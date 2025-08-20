// ================= App Configuration Loader ====================
// Loads environment variables and exports key configuration values
// for use throughout the server application. Uses dotenv for local
// development and fallback defaults where appropriate.
// ===============================================================

import { config } from "dotenv";
config();

// Server port (default: 5000 if not specified in env)
const PORT = process.env.PORT || 5000;

// MongoDB connection URI (must be set in environment)
const MONGO_URI = process.env.MONGO_URI;

// Export configuration constants for use in app entry point and services
export { PORT, MONGO_URI };
