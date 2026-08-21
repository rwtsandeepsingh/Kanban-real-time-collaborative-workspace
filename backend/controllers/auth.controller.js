import User from "../models/User.js";
import jwt from "jsonwebtoken";

// Helper function to genereate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "7d",
  });
};

// register new user
// route POST /api/auth/register
export const signUp = async (req, res) => {
  console.log(req.body);
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(404).json({ message: "All fields are nessesary" });
    }

    if (password.length < 6) {
      res
        .status(404)
        .json({ message: "password must be atleast 6 characters." });
    }

    // check if email is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    // check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // create user
    const user = await User.create({ name, email, password });

    const jwtToken = generateToken(user._id);

    res.cookie("jwt", jwtToken, {
      httpOnly: true, // Prevents client-side JS from reading the cookie
      sameSite: "lax", // Protects against CSRF attacks
      secure: process.env.NODE_ENV == "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    });

    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.log(`Error in register user: ${error.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      const jwtToken = generateToken(user._id);

      res.cookie("jwt", jwtToken, {
        httpOnly: true, // Prevents client-side JS from reading the cookie
        sameSite: "lax", // Protects against CSRF attacks
        secure: process.env.NODE_ENV == "production",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
      });

      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
      });
    } else {
      res.status(401).json({
        message: "Invalid email or password",
      });
    }
  } catch (err) {
    console.log("Error in login", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = (req, res) => {
  res.clearCookie("jwt");
  res.status(200).json({ success: true, message: "Logout successfull" });
};
