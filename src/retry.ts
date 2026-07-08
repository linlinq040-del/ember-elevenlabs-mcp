import { config } from './config.js';

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export class RetryableError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number
  ) {
    super(message);
  }
}

export class CircuitBreaker {
  private failures = 0;
  private openedAt = 0;

  isOpen(): boolean {
    if (this.failures < config.CIRCUIT_BREAKER_FAILURE_THRESHOLD) {
      return false;
    }

    const elapsed = Date.now() - this.openedAt;
    if (elapsed >= config.CIRCUIT_BREAKER_RESET_SECONDS * 1000) {
      this.failures = 0;
      this.openedAt = 0;
      return false;
    }

    return true;
  }

  recordSuccess() {
    this.failures = 0;
    this.openedAt = 0;
  }

  recordFailure() {
    this.failures += 1;
    if (this.failures >= config.CIRCUIT_BREAKER_FAILURE_THRESHOLD && this.openedAt === 0) {
      this.openedAt = Date.now();
    }
  }
}

export const circuitBreaker = new CircuitBreaker();

function shouldRetry(error: unknown): boolean {
  if (!(error instanceof RetryableError)) return false;

  const code = error.statusCode;

  if (code === undefined) return true;

  return [429, 500, 502, 503].includes(code);
}

export async function withRetry<T>(
  task: () => Promise<T>
): Promise<T> {
  if (circuitBreaker.isOpen()) {
    throw new Error('ElevenLabs temporarily unavailable (circuit breaker open).');
  }

  const delays = [1000, 2000, 4000];

  for (let attempt = 0; attempt <= config.MAX_RETRY_COUNT; attempt++) {
    try {
      const result = await Promise.race([
        task(),
        new Promise<T>((_, reject) =>
          setTimeout(
            () => reject(new RetryableError('Request timeout')),
            config.REQUEST_TIMEOUT_MS
          )
        )
      ]);

      circuitBreaker.recordSuccess();
      return result;
    } catch (error) {
      circuitBreaker.recordFailure();

      if (attempt >= config.MAX_RETRY_COUNT || !shouldRetry(error)) {
        throw error;
      }

      await sleep(delays[Math.min(attempt, delays.length - 1)]);
    }
  }

  throw new Error('Retry unexpectedly exhausted.');
}
