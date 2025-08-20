// ================= Express Async Handler Utility ================
// Provides a higher-order function to wrap async route/controller
// functions in Express. Ensures errors are forwarded to the error
// handler middleware, eliminating repetitive try/catch blocks.
// Usage: router.get('/route', asyncHandler(async (req, res, next) => { ... }))
// ===============================================================

/**
 * Wraps an async Express route handler and forwards errors to next().
 * @param fn - An async Express route handler function
 * @returns An Express RequestHandler with built-in error forwarding
 */

import { Request, Response, NextFunction, RequestHandler } from "express";

// Type definition for the async handler wrapper
type AsyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => RequestHandler;

// Implementation of the async handler wrapper
const asyncHandler: AsyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Export the async handler for use in routes/controllers
export default asyncHandler;
