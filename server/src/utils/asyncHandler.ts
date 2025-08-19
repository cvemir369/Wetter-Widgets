/**
 * asyncHandler is a higher-order function for Express route handlers.
 * It wraps an async route/controller function and ensures that any errors
 * thrown or rejected Promises are passed to Express's error handling middleware.
 *
 * Usage:
 *   router.get('/route', asyncHandler(async (req, res, next) => { ... }))
 *
 * This eliminates repetitive try/catch blocks in controllers and keeps code clean.
 *
 * @param fn - An async Express route handler function
 * @returns An Express RequestHandler with built-in error forwarding
 */
import { Request, Response, NextFunction, RequestHandler } from "express";

type AsyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => RequestHandler;

const asyncHandler: AsyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

export default asyncHandler;
