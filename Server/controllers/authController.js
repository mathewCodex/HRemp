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

  adminSignup: async (req, res) => {
    
// Admin Signup Route
// router.post("/adminsignup", [
//   body('name')
//     .trim()
//     .isLength({ min: 2, max: 50 })
//     .withMessage('Name must be between 2 and 50 characters'),
//   body('email')
//     .isEmail()
//     .normalizeEmail()
//     .withMessage('Please provide a valid email address'),
//   body('password')
//     .isLength({ min: 8 })
//     .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
//     .withMessage('Password must be at least 8 characters with uppercase, lowercase, and number'),
//   body('role')
//     .isIn(Object.values(ROLES))
//     .withMessage('Invalid role specified')
// ], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      errors: errors.array(),
      message: "Validation failed"
    });
  }

  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ 
        success: false, 
        error: "User with this email already exists" 
      });
    }

    // Create new user
    const newUser = await User.create({ 
      name: name.trim(), 
      email: email.toLowerCase(), 
      password: password.trim(),
      role 
    });

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: newUser._id, 
        role: newUser.role,
        email: newUser.email 
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Set HTTP-only cookie
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    return res.status(201).json({ 
      success: true, 
      message: "User created successfully",
      data: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (err) {
    console.error("Signup error:", err);
    
    if (err.code === 11000) {
      return res.status(409).json({ 
        success: false, 
        error: "Email already registered" 
      });
    }
    
    return res.status(500).json({ 
      success: false, 
      error: "Failed to create user account" 
    });
  }

  },

  adminLogin : async (req, res) => {
    // Admin Login Route

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      errors: errors.array(),
      message: "Invalid input data"
    });
  }

  try {
    const { email, password } = req.body;
    
    // Find admin user
    const admin = await User.findOne({ 
      email: email.toLowerCase(),
      role: ROLES.ADMIN 
    }).select('+password');

    if (!admin) {
      return res.status(401).json({ 
        success: false, 
        error: "Invalid credentials - admin account not found" 
      });
    }

    // Verify password
    const isPasswordValid = await admin.comparePassword(password.trim());
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        error: "Invalid credentials - incorrect password" 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: admin._id, 
        role: admin.role,
        email: admin.email 
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Set HTTP-only cookie
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    return res.json({ 
      success: true, 
      message: "Login successful",
      data: {
        id: admin._id,
        email: admin.email,
        role: admin.role,
        name: admin.name || admin.email.split('@')[0]
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    
    if (err.name === 'MongooseError' || err.message.includes('timed out')) {
      return res.status(504).json({ 
        success: false, 
        error: "Database connection timeout - please try again" 
      });
    }
    
    return res.status(500).json({ 
      success: false, 
      error: "Authentication service temporarily unavailable"
    });
  }


  }
};

export default authController;