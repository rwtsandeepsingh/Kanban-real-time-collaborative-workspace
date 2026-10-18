import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({
        message: "Unauthorized - no token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decoded) {
      return res.status(401).json({
        message: "Unauthorised - invalid provided",
      });
    }

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res
        .status(401)
        .json({ message: "Unauthorised: user does not exist" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.log("Error in protectRoute middleWare", err);
    res.status(401).json({ message: "Unauthorised user" });
  }
};
