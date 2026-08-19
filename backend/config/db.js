import dotenv from "dotenv";
import mongoose from "mongoose";

// Database connection
export async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_DB_URI);
    console.log("✅ Connected to MongoDB Atlas!");
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB Atlas:", error.message);
    process.exit(1); //Node.js command that forces your running Node process to shut down immediately.
  }
}
