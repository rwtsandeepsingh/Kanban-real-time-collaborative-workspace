import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import boardRoutes from "./routes/board.route.js";
import listRoutes from "./routes/list.route.js";
import cardRoutes from "./routes/card.route.js";

const app = express();
dotenv.config();
const PORT = process.env.PORT;
const corsOptions = {
  origin: "http://localhost:5173", // Must NOT have a trailing slash
  credentials: true, // Allows HTTP-only cookies
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

// 2. Handle preflight requests for all routes
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/boards", boardRoutes);
app.use("/api/lists", listRoutes);
app.use("/api/cards", cardRoutes);
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
