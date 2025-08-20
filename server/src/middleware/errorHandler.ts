// ================= Express Error Handler Middleware =============
// Catches errors thrown in routes/controllers and sends a consistent
// JSON response. Handles custom ErrorResponse objects and falls back
// to generic errors. Should be registered last in the Express app.
// Usage: app.use(errorHandler);
// ===============================================================

import { Request, Response, NextFunction } from "express";
import ErrorResponse from "../utils/errorResponse";

/**
 * Express error handling middleware.
 * @param err - The error thrown in a route/controller (can be Error or ErrorResponse)
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next middleware function
 *
 * Sends a JSON response with error details and appropriate status code.
 * If the error is a custom ErrorResponse, uses its status code; otherwise defaults to 500.
 */
const errorHandler = (
  err: Error | ErrorResponse,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Determine status code based on error type
  const statusCode =
    err instanceof ErrorResponse && err.statusCode ? err.statusCode : 500;
  res.status(statusCode).json({
    success: false,
    error: err.message || "Server Error",
    statusCode,
  });
};

// Export the error handler for use in Express app
export default errorHandler;
