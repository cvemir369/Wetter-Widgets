// ================= Custom Error Response Class ==================
// Defines a custom error class for use in controllers and services.
// Allows attaching an HTTP status code to errors for consistent
// error handling and response formatting throughout the app.
// ===============================================================

/**
 * Custom error class for HTTP error handling.
 * Extends the built-in Error object with a status code property.
 */
class ErrorResponse extends Error {
  statusCode: number;

  /**
   * Create a new ErrorResponse instance.
   * @param message - Error message
   * @param statusCode - HTTP status code
   */
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

// Export the custom error class for use in error handling
export default ErrorResponse;
