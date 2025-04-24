/**
 * Custom API error class for handling API-specific errors
 */
export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: any;

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = 'INTERNAL_SERVER_ERROR',
    details?: any
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.name = 'ApiError';
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  /**
   * Create a 400 Bad Request error
   */
  static badRequest(message: string, code: string = 'BAD_REQUEST', details?: any): ApiError {
    return new ApiError(message, 400, code, details);
  }

  /**
   * Create a 401 Unauthorized error
   */
  static unauthorized(message: string = 'Unauthorized', code: string = 'UNAUTHORIZED', details?: any): ApiError {
    return new ApiError(message, 401, code, details);
  }

  /**
   * Create a 403 Forbidden error
   */
  static forbidden(message: string = 'Forbidden', code: string = 'FORBIDDEN', details?: any): ApiError {
    return new ApiError(message, 403, code, details);
  }

  /**
   * Create a 404 Not Found error
   */
  static notFound(message: string = 'Resource not found', code: string = 'NOT_FOUND', details?: any): ApiError {
    return new ApiError(message, 404, code, details);
  }

  /**
   * Create a 409 Conflict error
   */
  static conflict(message: string, code: string = 'CONFLICT', details?: any): ApiError {
    return new ApiError(message, 409, code, details);
  }

  /**
   * Create a 500 Internal Server Error
   */
  static internal(message: string = 'Internal server error', code: string = 'INTERNAL_SERVER_ERROR', details?: any): ApiError {
    return new ApiError(message, 500, code, details);
  }
}