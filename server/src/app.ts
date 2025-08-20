// ===================== Express App Entry =======================
// Main entry point for the Wetter-Widgets server application.
// Sets up middleware, routes, error handling, and starts the server.
// ===============================================================

import express, { Request, Response } from "express";
import cors from "cors";
import wetterWidgetRouter from "./routes/wetterWidgetRouter";
import errorHandler from "./middleware/errorHandler";
import "./db/index"; // Ensure database connection is established
import { PORT } from "./config";

// Create Express app instance
const app = express();

// Middleware for parsing JSON bodies
app.use(express.json());

// Enable CORS for all routes
app.use(cors());

/**
 * Health check route
 * GET /
 * Returns a simple Hello World message
 */
app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

// Mount widget routes at /widgets
app.use("/widgets", wetterWidgetRouter);

// Register error handler middleware (should be last)
app.use(errorHandler);

// Start the server and listen on the configured port
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
