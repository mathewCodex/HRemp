import express from "express";
import authController from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", authController.signup);

// Login
router.post("/login", authController.login);
// router.get("/verify", authController.verify);
router.post("/adminsignup", authController.adminSignup)

router.post("/adminlogin", authController.adminLogin);
// Logout
router.post("/logout", authController.logout);
export { router as authRoute}
