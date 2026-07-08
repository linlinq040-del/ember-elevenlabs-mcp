export type ErrorCode =
  | "INVALID_REQUEST"
  | "INVALID_CONFIGURATION"
  | "ELEVENLABS_API_ERROR"
  | "ELEVENLABS_TIMEOUT"
  | "AUDIO_MERGE_FAILED"
  | "AUDIO_SAVE_FAILED"
  | "CIRCUIT_BREAKER_OPEN"
  | "UNKNOWN_ERROR";

export class AppError extends Error {
  constructor(
    public readonly code: ErrorCode,
    message: string,
    public readonly statusCode = 500,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = "AppError";
  }
}

export function toAppError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error) {
    if (error.name === "AbortError") {
      return new AppError(
        "ELEVENLABS_TIMEOUT",
        "The request to ElevenLabs timed out.",
        504,
        error
      );
    }

    return new AppError(
      "UNKNOWN_ERROR",
      error.message,
      500,
      error
    );
  }

  return new AppError(
    "UNKNOWN_ERROR",
    "Unknown error.",
    500
  );
}

export function createErrorResponse(error: unknown) {
  const appError = toAppError(error);

  return {
    success: false,
    code: appError.code,
    message: appError.message
  };
}