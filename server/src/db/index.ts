import mongoose from "mongoose";
import { MONGO_URI } from "../config";

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

connectToDatabase();

export { mongoose };
