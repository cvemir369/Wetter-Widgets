// ================= Database Connection Module ==================
// Handles connection to MongoDB using Mongoose. Ensures the app
// exits on connection failure and logs connection status.
// Exports the mongoose instance for use in other modules.
// ===============================================================

import mongoose from "mongoose";
import { MONGO_URI } from "../config";

/**
 * Establishes a connection to MongoDB using the provided URI.
 * Exits the process if connection fails.
 */
async function connectToDatabase() {
  try {
    if (!MONGO_URI) {
      throw new Error("MONGO_URI is not defined.");
    }
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB is connected...");
  } catch (err) {
    console.error("Unable to connect to the database:", err);
    process.exit(1);
  }
}

// Immediately connect to the database on module load
connectToDatabase();

// Export the mongoose instance for use in other modules
export { mongoose };
