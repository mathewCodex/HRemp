import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getDB } from "../utils/db.js"; // Import the database getter function
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
      const db = getDB(); // Get database instance

      // Find user by email
      const user = await db.collection("employees").findOne({ email: email });

      if (user) {
        const storedHashedPassword = user.password;

        const passwordsMatch = await bcrypt.compare(
          password,
          storedHashedPassword
        );

        if (passwordsMatch) {
          const token = jwt.sign(
            { role: "employee", email: user.email, id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
          );

          // Set JWT token as a cookie
          res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: 3600000,
            secure: process.env.NODE_ENV === "production",
          });

          // Send success response
          return res.status(200).json({
            loginStatus: true,
            message: "You are logged in",
            //  id: user._id,
            token, // Also send token in response for frontend storage
            user: {
              _id: user._id,
              name: user.name,
              email: user.email,
              role: user.role,
            },
          });
        } else {
          // Send response for incorrect password
          return res.status(401).json({
            loginStatus: false,
            error: "Incorrect Email or Password",
          });
        }
      } else {
        // Send response for user not found
        return res.status(404).json({
          loginStatus: false,
          error: "User not found",
        });
      }
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
      const { name, email, password, position } = req.body;
      // const role = position;
      // Input validation
      if (!name || !email || !password || !position) {
        return res.status(400).json({
          success: false,
          error: "Name, email and password  or position are required",
        });
      }
      const role = position;
      if (!["admin", "employee"].includes(role)) {
        return res.status(400).json({
          success: false,
          error: "Invalid role specified",
        });
      }
      const db = getDB();

      // Check if user already exists
      const existingUser = await db
        .collection("employees")
        .findOne({ email: email });

      if (existingUser) {
        return res.status(409).json({
          signupStatus: false,
          error: "Email already exists",
        });
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      // Insert new employee into database
      const newEmployee = {
        name: name,
        email: email,
        password: hashedPassword,
        role: position || "Employee",
        createdAt: new Date(),
      };

      const result = await db.collection("employees").insertOne(newEmployee);

      const token = jwt.sign(
        { id: result.insertedId, role: newEmployee.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      // Set HTTP-only cookie
      res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        domain:
          process.env.NODE_ENV === "development"
            ? undefined
            : process.env.COOKIE_DOMAIN,
      });

      // return res.status(201).json({
      //   success: true,
      //   message: "Signup successful",
      //   token,
      //   user: {
      //     _id: newUser._id,
      //     name: newUser.name,
      //     email: newUser.email,
      //     role: newUser.role,
      //   },
      // });
      // Send success response
      return res.status(201).json({
        signupStatus: true,
        message: "Employee account created successfully",
        token, 
        employee: {
          id: result.insertedId,
          name: name,
          email: email,
          role: newEmployee.role,
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