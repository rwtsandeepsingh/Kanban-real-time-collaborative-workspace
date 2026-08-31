import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import {
  createCard,
  deleteCard,
  getCardsByBoard,
  moveCard,
  updateCard,
} from "../controllers/card.controller.js";

const router = express.Router();
router.use(protectRoute);

router.post("/", createCard);
router.get("/board/:boardId", getCardsByBoard);
router.put("/:cardId", updateCard);
router.delete("/:cardId", deleteCard);
router.put("/:cardId/move", moveCard);
export default router;
