import { config } from "./config.js";

export class RetryableError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number
  ) {
    super(message);
    this.name = "RetryableError";
  }
}

class CircuitBreaker {
  private failures = 0;
  private openedAt: number | null = null;

  isOpen(): boolean {
    if (this.openedAt === null) {
      return false;
    }

    const elapsed = Date.now() - this.openedAt;

    if (
      elapsed >=
      config.CIRCUIT_BREAKER_RESET_SECONDS * 1000
    ) {
      this.reset();
      return false;
    }

    return true;
  }

  success(): void {
    this.reset();
  }

  failure(): void {
    this.failures += 1;

    if (
      this.failures >=
        config.CIRCUIT_BREAKER_FAILURE_THRESHOLD &&
      this.openedAt === null
    ) {
      this.openedAt = Date.now();
    }
  }

  private reset(): void {
    this.failures = 0;
    this.openedAt = null;
  }
}

export const circuitBreaker = new CircuitBreaker();

export function shouldRetry(
  error: unknown
): boolean {
  if (!(error instanceof RetryableError)) {
    return false;
  }

  if (error.statusCode === undefined) {
    return true;
  }

  return [429, 500, 502, 503].includes(
    error.statusCode
  );
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) =>
    setTimeout(resolve, ms)
  );
}

export async function withRetry<T>(
  fn: () => Promise<T>
): Promise<T> {
  if (circuitBreaker.isOpen()) {
    throw new Error(
      "Circuit breaker is currently open."
    );
  }

  const delays = [1000, 2000, 4000];

  let lastError: unknown;

  for (
    let attempt = 0;
    attempt <= config.MAX_RETRY_COUNT;
    attempt++
  ) {
    try {
      const result = await fn();

      circuitBreaker.success();

      return result;
    } catch (error) {
      lastError = error;

      circuitBreaker.failure();

      if (
        !shouldRetry(error) ||
        attempt >= config.MAX_RETRY_COUNT
      ) {
        throw error;
      }

      const delay =
        delays[
          Math.min(
            attempt,
            delays.length - 1
          )
        ] ?? 4000;

      await sleep(delay);
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("Retry failed.");
}