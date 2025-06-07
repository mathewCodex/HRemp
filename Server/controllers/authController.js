import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const authController = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Input validation
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: "Email and password are required",
        });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({  // Changed from 404 to 401 for security
          success: false,
          error: "Invalid credentials", // Generic message for security
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          error: "Invalid credentials",
        });
      }

      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }  // Reduced from 10d for better security
      );

      // Set HTTP-only cookie
      res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      });

      return res.status(200).json({
        success: true,
        message: "Login successful",
        token, // Also send token in response for frontend storage
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  },

  verify: (req, res) => {
    try {
      return res.status(200).json({
        success: true,
        user: {
          _id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          role: req.user.role,
        },
      });
    } catch (error) {
      console.error("Verification error:", error);
      return res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  },

  signup: async (req, res) => {
    try {
      const { name, email, password, role } = req.body;

      // Input validation
      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          error: "Name, email and password are required",
        });
      }

      if (!["admin", "employee"].includes(role)) {
        return res.status(400).json({
          success: false,
          error: "Invalid role specified",
        });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({  // Changed to 409 Conflict
          success: false,
          error: "User already exists",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 12); // Increased salt rounds

      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        role,
      });

      await newUser.save();

      const token = jwt.sign(
        { id: newUser._id, role: newUser.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      // Set HTTP-only cookie
res.cookie("jwt", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 24 * 60 * 60 * 1000, // 1 day
  domain: process.env.NODE_ENV === "development" ? undefined : process.env.COOKIE_DOMAIN
});

      return res.status(201).json({
        success: true,
        message: "Signup successful",
        token,
        user: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
      });
    } catch (error) {
      console.error("Signup error:", error);
      return res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  },

  logout: (req, res) => {
    try {
      res.clearCookie("jwt");
      return res.status(200).json({
        success: true,
        message: "Logout successful",
      });
    } catch (error) {
      console.error("Logout error:", error);
      return res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  },
};

export default authController;