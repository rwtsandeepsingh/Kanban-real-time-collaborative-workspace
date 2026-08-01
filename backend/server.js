import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config({ path: "../.env" });

const app = express();
const PORT = process.env.PORT;

app.get("/", (req, res) => {
  res.send("REAL TIME COLLABORATIVE WORKSPACE");
});
const startServer = async () => {
  try {
    // 1. Wait for mongodb to connect succesfully
    await mongoose.connect(process.env.MONGO_DB_URI);
    console.log("✅ Connected to MongoDB Atlas!");

    // 2. only start listening to requests after db is ready
    app.listen(PORT, () => {
      console.log(`listening on the port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB Atlas:", error.message);
    process.exit(1); //Node.js command that forces your running Node process to shut down immediately.
  }
};

startServer();
