import express from "express";
import authController from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", authController.signup);

// Login
router.post("/login", authController.login);
// router.get("/verify", authController.verify);

// Logout
router.post("/logout", authController.logout);
export { router as authRoute };
