import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import cookieParser from "cookie-parser";
import authRoute from "./routes/auth.route.js";
import boardRoute from "./routes/board.route.js";
const app = express();
dotenv.config();
const PORT = process.env.PORT;
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/board", boardRoute);

// Function expression
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log("Error in starting server", error);
  }
};

startServer();
