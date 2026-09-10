/**
 * Standardized Application Error class for client-side error handling.
 * Unifies HTTP network errors, validation errors, and backend domain errors.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: unknown;

  constructor(message: string, statusCode = 500, code = 'INTERNAL_ERROR', details?: unknown) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;

    // Maintain prototype chain
    Object.setPrototypeOf(this, AppError.prototype);
  }

  /**
   * Check if error is an authentication/token expiry error (HTTP 401)
   */
  get isUnauthorized(): boolean {
    return this.statusCode === 401;
  }

  /**
   * Check if error is a forbidden access error (HTTP 403)
   */
  get isForbidden(): boolean {
    return this.statusCode === 403;
  }

  /**
   * Check if error is not found (HTTP 404)
   */
  get isNotFound(): boolean {
    return this.statusCode === 404;
  }

  /**
   * Check if error is a network connectivity failure
   */
  get isNetworkError(): boolean {
    return this.code === 'NETWORK_ERROR';
  }
}

/**
 * Normalizes any caught error into an AppError instance.
 */
export function normalizeError(err: unknown): AppError {
  if (err instanceof AppError) {
    return err;
  }

  if (err instanceof Error) {
    return new AppError(err.message, 500, 'UNEXPECTED_ERROR');
  }

  return new AppError('Đã xảy ra lỗi không xác định. Vui lòng thử lại sau.', 500, 'UNKNOWN_ERROR');
}
