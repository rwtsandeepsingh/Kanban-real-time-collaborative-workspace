import express from "express";
import {
  createBoard,
  getBoardById,
  getBoards,
  deleteBoard,
  updateBoard,
} from "../controllers/board.controller.js";
import { createList } from "../controllers/list.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { createCard } from "../controllers/card.controller.js";

const router = express.Router();

// protectRoute middleware to protect all routes
router.use(protectRoute);

router.post("/create-new-board", createBoard);
router.get("/", getBoards);
router.get("/:id", getBoardById);
router.delete("/:id", deleteBoard);
router.post("/:boardId/lists", createList);
router.put("/:boardId", updateBoard);
router.post("/:boardId/lists/:listId/cards", protectRoute, createCard);

export default router;
