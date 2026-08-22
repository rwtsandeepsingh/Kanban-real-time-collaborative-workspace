import express from "express";
import {
  createBoard,
  getBoardById,
  getBoards,
  deleteBoard,
} from "../controllers/board.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

// protectRoute middleware to protect all routes
router.use(protectRoute);

router.post("/create-new-board", createBoard);
router.get("/", getBoards);
router.get("/:id", getBoardById);
router.delete("/:id", deleteBoard);

export default router;
