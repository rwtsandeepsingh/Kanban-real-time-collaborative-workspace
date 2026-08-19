import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";

dotenv.config({ path: "../.env" });

const app = express();
const PORT = process.env.PORT;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`listening on the port ${PORT}`);
    });
  } catch (error) {
    console.log("Error in starting server", error);
  }
};

startServer();
