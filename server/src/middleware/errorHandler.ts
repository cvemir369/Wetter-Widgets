/**
 * Express error handling middleware.
 * Catches errors thrown in routes/controllers and sends a consistent JSON response.
 * Handles custom ErrorResponse objects and falls back to generic errors.
 *
 * Usage:
 *   app.use(errorHandler);
 *
 * This should be the last middleware registered in your Express app.
 */
import { Request, Response, NextFunction } from "express";
import ErrorResponse from "../utils/errorResponse";

const errorHandler = (
  err: Error | ErrorResponse,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // If the error is a custom ErrorResponse, use its status code; otherwise default to 500
  const statusCode =
    err instanceof ErrorResponse && err.statusCode ? err.statusCode : 500;
  res.status(statusCode).json({
    success: false,
    error: err.message || "Server Error",
    statusCode,
  });
};

export default errorHandler;
