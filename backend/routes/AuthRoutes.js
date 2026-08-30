import express from "express";
import {
  signup, login, getMe, updateProfile,
  changePassword, forgotPassword, resetPassword,
  verifyResetOtp,
  verifyOTP, resendOTP, refreshToken,
  setup2FA, verify2FA, disable2FA,
} from "../controllers/AuthController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup",           signup);
router.post("/login",            login);
router.post("/verify-otp",       verifyOTP);
router.post("/resend-otp",       resendOTP);
router.post("/refresh-token",    refreshToken);
router.post("/forgot-password",  forgotPassword);
router.post("/verify-reset-otp", verifyResetOtp);
router.post("/reset-password",   resetPassword);
router.get("/me",                protect, getMe);
router.patch("/update-profile",  protect, updateProfile);
router.post("/change-password",  protect, changePassword);

// ── 2FA ──
router.post("/2fa/setup",   protect, setup2FA);
router.post("/2fa/verify",  protect, verify2FA);
router.post("/2fa/disable", protect, disable2FA);

export default router;