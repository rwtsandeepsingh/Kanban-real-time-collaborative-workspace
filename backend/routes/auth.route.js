import express from "express";
import { login, logout, signUp } from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/login", login);
router.post("/signup", signUp);
router.post("/logout", logout);

router.get("/me", protectRoute, (req, res) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (err) {
    console.log("Error in fatching me ", err.message);
    res.status(500).json("Internal server error");
  }
});
export default router;
