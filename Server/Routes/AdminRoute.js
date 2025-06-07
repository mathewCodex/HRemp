import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import multer from "multer";
import path from "path";
import fs from "fs";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import { body, validationResult } from "express-validator";
import User from "../models/User.js";
import Category from "../models/Category.js";
import authController from "../controllers/authController.js";

dotenv.config();
const router = express.Router();

// Security Middlewares
router.use(helmet());
router.use(mongoSanitize());

// Constants
const ROLES = {
  ADMIN: 'admin',
  EMPLOYEE: 'employee'
};

// Rate Limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many attempts, please try again later'
});

// File Upload Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'public/images';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => 
    cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    mimetype && extname ? cb(null, true) : cb(new Error('Only image files are allowed!'));
  }
});

// Middleware
const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) throw new Error('No token provided');

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) throw new Error('User not found');
    
    next();
  } catch (err) {
    console.error("Authentication error:", err);
    res.status(401).json({ success: false, error: "Unauthorized" });
  }
};

const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, error: "Forbidden" });
    }
    next();
  };
};

// ==================== AUTH ROUTES ====================
router.post("/adminsignup", [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('role').isIn(Object.values(ROLES)).withMessage('Invalid role')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

  try {
    const { name, email, password, role } = req.body;

    if (await User.findOne({ email })) {
      return res.status(409).json({ success: false, error: "User already exists" });
    }
 
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await User.create({ 
      name, 
      email, 
      password: hashedPassword, 
      role 
    });

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

res.cookie("jwt", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 24 * 60 * 60 * 1000, // 1 day
  domain: process.env.NODE_ENV === "development" ? undefined : process.env.COOKIE_DOMAIN
});

    return res.status(201).json({ 
      success: true, 
      data: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
});

router.post("/auth/adminlogin", authLimiter, [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

  try {
    const { email, password } = req.body;
    console.log(`Login attempt for: ${email}`);
    
    const user = await User.findOne({ email, role: 'admin' });
    if (!user) {
      console.log('No admin user found with this email');
      return res.status(401).json({ success: false, error: "Invalid credentials" });
    }

    console.log('Comparing passwords...');
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match result:', isMatch);
    
    if (!isMatch) {
      console.log('Password does not match');
      return res.status(401).json({ success: false, error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 86400000,
      domain: process.env.NODE_ENV === 'development' ? 'localhost' : undefined
    });

    return res.json({ 
      success: true, 
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
});
// ==================== PROTECTED ROUTES ====================
router.use(authenticate);

// ==================== CATEGORY ROUTES ====================
router.get("/categories", authorize([ROLES.ADMIN]), async (req, res) => {
  try {
    const categories = await Category.find().lean();
    res.json({ success: true, data: categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ success: false, error: "Failed to load categories" });
  }
});

router.post("/categories", authorize([ROLES.ADMIN]), [
  body('name').trim().notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

  try {
    const category = await Category.create({ name: req.body.name });
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    console.error("Error adding category:", error);
    res.status(500).json({ success: false, error: "Failed to add category" });
  }
});

// ==================== EMPLOYEE ROUTES ====================
router.post("/employees", authorize([ROLES.ADMIN]), upload.single("image"), [
  body('name').trim().notEmpty(),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  body('address').optional().trim(),
  body('salary').isFloat({ gt: 0 }),
  body('category_id').isMongoId()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    if (req.file) fs.unlinkSync(req.file.path);
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { name, email, password, address, salary, category_id } = req.body;
    
    const employee = await User.create({
      name,
      email,
      password: await bcrypt.hash(password, 12),
      address,
      salary,
      image: req.file?.filename,
      category_id,
      role: ROLES.EMPLOYEE
    });

    res.status(201).json({ success: true, data: employee });
  } catch (error) {
    if (req.file) fs.unlinkSync(req.file.path);
    console.error("Error adding employee:", error);
    res.status(500).json({ success: false, error: "Failed to add employee" });
  }
});

// ==================== ADMIN MANAGEMENT ====================
router.get("/admins", authorize([ROLES.ADMIN]), async (req, res) => {
  try {
    const admins = await User.find({ role: ROLES.ADMIN }).select('-password');
    res.json({ success: true, data: admins });
  } catch (error) {
    console.error("Error fetching admins:", error);
    res.status(500).json({ success: false, error: "Failed to fetch admins" });
  }
});

router.post("/admins", authorize([ROLES.ADMIN]), [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

  try {
    const { email, password } = req.body;
    
    const admin = await User.create({
      email,
      password: await bcrypt.hash(password, 12),
      role: ROLES.ADMIN
    });

    res.status(201).json({ success: true, data: { id: admin._id, email: admin.email } });
  } catch (error) {
    console.error("Error adding admin:", error);
    res.status(500).json({ success: false, error: "Failed to add admin" });
  }
});

// ==================== DASHBOARD ROUTES ====================
router.get("/dashboard/stats", authorize([ROLES.ADMIN]), async (req, res) => {
  try {
    const [adminCount, employeeCount, salarySum] = await Promise.all([
      User.countDocuments({ role: ROLES.ADMIN }),
      User.countDocuments({ role: ROLES.EMPLOYEE }),
      User.aggregate([
        { $match: { role: ROLES.EMPLOYEE } },
        { $group: { _id: null, total: { $sum: "$salary" } } }
      ])
    ]);

    res.json({ 
      success: true, 
      data: {
        adminCount,
        employeeCount,
        totalSalary: salarySum[0]?.total || 0
      }
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ success: false, error: "Failed to load stats" });
  }
});

// ==================== OTHER ROUTES ====================
router.post("/logout", (req, res) => {
  res.clearCookie('jwt');
  res.json({ success: true });
});

// ==================== ERROR HANDLING ====================
router.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ success: false, error: "File upload error" });
  }
  
  res.status(500).json({ success: false, error: "Internal server error" });
});

// router.post("/adminlogin", authController.login);
// router.post("/adminsignup", authController.signup);
// router.get("/verify", authController.verify);
// router.post("/logout", authController.logout);

export { router as adminRouter };