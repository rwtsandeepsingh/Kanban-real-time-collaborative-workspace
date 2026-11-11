import express from "express";
import {
  createList,
  getListByBoard,
  updateList,
  deleteList,
} from "../controllers/list.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(protectRoute);

// router.post("/boards/:boardId/lists", createList);
router.get("/boards/:boardId", getListByBoard);
router.put("/:id", updateList);
router.delete("/:id", deleteList);

export default router;
