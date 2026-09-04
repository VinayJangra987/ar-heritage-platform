// import User from "../models/User.js";
// import jwt from "jsonwebtoken";
// import bcrypt from "bcryptjs";
// import nodemailer from "nodemailer";
// import speakeasy from "speakeasy";
// import QRCode from "qrcode";
// import { sendOTPEmail } from "../utils/emailService.js";

// // ── Email transporter ──
// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 465,
//   secure: true,
//   family: 4,   // force IPv4 — fixes Render ENETUNREACH on IPv6
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// // ── Token generators ──
// const generateAccessToken = (userId) =>
//   jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "15m" });

// const generateRefreshToken = (userId) =>
//   jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });

// const generateOTP = () =>
//   Math.floor(100000 + Math.random() * 900000).toString();

// // // ── Send OTP Email (generic, used for signup + password reset) ──
// // const sendOTPEmail = async (email, otp, name, purpose = "verify") => {
// //   const subject =
// //     purpose === "reset"
// //       ? "Password Reset OTP - Bharatiya Dharohar"
// //       : "Your OTP - Bharatiya Dharohar";

// //   const introLine =
// //     purpose === "reset"
// //       ? "Your OTP to reset your password is:"
// //       : "Your OTP code is:";

// //   await transporter.sendMail({
// //     from: `"Bharatiya Dharohar" <${process.env.EMAIL_USER}>`,
// //     to: email,
// //     subject,
// //     html: `
// //       <div style="font-family:sans-serif;max-width:480px;margin:auto;background:#0D1B2A;color:#F2E8D0;padding:2rem;border-radius:12px;">
// //         <h2 style="color:#C9A84C;margin-bottom:0.5rem;">🏛 Bharatiya Dharohar</h2>
// //         <p>Hello <strong>${name}</strong>,</p>
// //         <p>${introLine}</p>
// //         <div style="font-size:2.5rem;font-weight:700;letter-spacing:0.3em;color:#C9A84C;text-align:center;padding:1rem;background:rgba(201,168,76,0.1);border-radius:8px;margin:1rem 0;">
// //           ${otp}
// //         </div>
// //         <p style="color:rgba(242,232,208,0.5);font-size:0.85rem;">This OTP expires in 10 minutes.</p>
// //         <p style="color:rgba(242,232,208,0.5);font-size:0.85rem;">If you didn't request this, you can safely ignore this email.</p>
// //       </div>
// //     `,
// //   });
// // };

// // ════════════════════════════════════════════════
// // SIGNUP — send OTP, don't create verified user yet
// // ════════════════════════════════════════════════
// export const signup = async (req, res) => {
//   try {
//     const { name, email, password, confirmPassword } = req.body;

//     if (!name || !email || !password)
//       return res.status(400).json({ success: false, message: "All fields are required." });

//     if (password !== confirmPassword)
//       return res.status(400).json({ success: false, message: "Passwords do not match." });

//     if (password.length < 6)
//       return res.status(400).json({ success: false, message: "Password must be at least 6 characters." });

//     const existing = await User.findOne({ email });

//     if (existing && existing.isEmailVerified)
//       return res.status(400).json({ success: false, message: "This email is already registered." });

//     const otp = generateOTP();
//     const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min

//     if (existing && !existing.isEmailVerified) {
//       existing.name = name;
//       existing.password = password;
//       existing.otp = otp;
//       existing.otpExpiry = otpExpiry;
//       await existing.save();
//     } else {
//       await User.create({
//         name,
//         email,
//         password,
//         otp,
//         otpExpiry,
//         isEmailVerified: false,
//         isVerified: false,
//         role: "user",
//       });
//     }

//     await sendOTPEmail(email, otp, name, "verify");

//     res.status(200).json({
//       success: true,
//       message: "OTP has been sent to your email. Verify within 10 minutes.",
//       email,
//       requiresOTP: true,
//     });
//   } catch (err) {
//     console.error("❌ Signup error:", err);
//     res.status(500).json({ success: false, message: "Signup failed.", error: err.message });
//   }
// };

// // ════════════════════════════════════════════════
// // VERIFY OTP — verify signup email and issue tokens
// // ════════════════════════════════════════════════
// export const verifyOTP = async (req, res) => {
//   try {
//     const { email, otp } = req.body;

//     if (!email || !otp)
//       return res.status(400).json({ success: false, message: "Email and OTP are required." });

//     const user = await User.findOne({ email }).select("+otp +otpExpiry +password");

//     if (!user)
//       return res.status(404).json({ success: false, message: "User not found." });

//     if (user.isEmailVerified)
//       return res.status(400).json({ success: false, message: "Email is already verified." });

//     if (!user.otp || user.otp !== otp)
//       return res.status(400).json({ success: false, message: "Incorrect OTP." });

//     if (new Date() > user.otpExpiry)
//       return res.status(400).json({ success: false, message: "OTP has expired. Please try again." });

//     user.isEmailVerified = true;
//     user.isVerified = true;
//     user.otp = undefined;
//     user.otpExpiry = undefined;
//     await user.save({ validateBeforeSave: false });

//     const accessToken  = generateAccessToken(user._id);
//     const refreshToken = generateRefreshToken(user._id);

//     res.status(200).json({
//       success: true,
//       message: "Email verified! Welcome to Bharatiya Dharohar.",
//       token: accessToken,
//       refreshToken,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         avatar: user.avatar || null,
//         favorites: user.favorites || [],
//       },
//     });
//   } catch (err) {
//     console.error("❌ Verify OTP error:", err);
//     res.status(500).json({ success: false, message: "Error verifying OTP.", error: err.message });
//   }
// };

// // ════════════════════════════════════════════════
// // RESEND OTP (signup verification)
// // ════════════════════════════════════════════════
// export const resendOTP = async (req, res) => {
//   try {
//     const { email } = req.body;

//     const user = await User.findOne({ email }).select("+otp +otpExpiry");
//     if (!user)
//       return res.status(404).json({ success: false, message: "User not found." });

//     if (user.isEmailVerified)
//       return res.status(400).json({ success: false, message: "Email is already verified." });

//     const otp = generateOTP();
//     user.otp = otp;
//     user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
//     await user.save({ validateBeforeSave: false });

//     await sendOTPEmail(email, otp, user.name, "verify");

//     res.status(200).json({ success: true, message: "A new OTP has been sent." });
//   } catch (err) {
//     res.status(500).json({ success: false, message: "Error sending OTP.", error: err.message });
//   }
// };

// // ════════════════════════════════════════════════
// // LOGIN — 2FA-aware
// // ════════════════════════════════════════════════
// export const login = async (req, res) => {
//   try {
//     const { email, password, twoFactorCode } = req.body;

//     if (!email || !password)
//       return res.status(400).json({ success: false, message: "Email and password are required." });

//     const user = await User.findOne({ email }).select("+password +twoFactorSecret");

//     if (!user || !(await bcrypt.compare(password, user.password)))
//       return res.status(401).json({ success: false, message: "Incorrect email or password." });

//     if (!user.isEmailVerified)
//       return res.status(403).json({
//         success: false,
//         message: "Email is not verified. Please verify with OTP first.",
//         requiresOTP: true,
//         email,
//       });

//     // 2FA check
//     if (user.twoFactorEnabled) {
//       if (!twoFactorCode) {
//         return res.status(200).json({
//           success: false,
//           requires2FA: true,
//           email,
//           message: "Please enter your 2FA code.",
//         });
//       }

//       const verified = speakeasy.totp.verify({
//         secret: user.twoFactorSecret,
//         encoding: "base32",
//         token: twoFactorCode,
//         window: 2,
//       });

//       if (!verified)
//         return res.status(401).json({ success: false, requires2FA: true, message: "Incorrect 2FA code." });
//     }

//     user.lastLogin = new Date();
//     await user.save({ validateBeforeSave: false });

//     const accessToken  = generateAccessToken(user._id);
//     const refreshToken = generateRefreshToken(user._id);

//     res.status(200).json({
//       success: true,
//       message: "Login successful",
//       token: accessToken,
//       refreshToken,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         avatar: user.avatar || null,
//         favorites: user.favorites || [],
//         twoFactorEnabled: user.twoFactorEnabled,
//       },
//     });
//   } catch (err) {
//     console.error("❌ Login error:", err);
//     res.status(500).json({ success: false, message: "Login failed.", error: err.message });
//   }
// };

// // ════════════════════════════════════════════════
// // 2FA — SETUP (generate QR code)
// // ════════════════════════════════════════════════
// export const setup2FA = async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id);

//     if (user.twoFactorEnabled)
//       return res.status(400).json({ success: false, message: "2FA is already enabled." });

//     const secret = speakeasy.generateSecret({
//       name: `Bharatiya Dharohar (${user.email})`,
//       issuer: "Bharatiya Dharohar",
//     });

//     // Save as temp secret until verified
//     user.twoFactorTempSecret = secret.base32;
//     await user.save({ validateBeforeSave: false });

//     const qrCode = await QRCode.toDataURL(secret.otpauth_url);

//     res.status(200).json({
//       success: true,
//       qrCode,
//       secret: secret.base32,
//       message: "Scan this with Google Authenticator or Authy.",
//     });
//   } catch (err) {
//     console.error("❌ 2FA setup error:", err);
//     res.status(500).json({ success: false, message: "2FA setup failed.", error: err.message });
//   }
// };

// // ════════════════════════════════════════════════
// // 2FA — VERIFY & ENABLE
// // ════════════════════════════════════════════════
// export const verify2FA = async (req, res) => {
//   try {
//     const { token } = req.body;
//     const user = await User.findById(req.user._id).select("+twoFactorTempSecret");

//     if (!user.twoFactorTempSecret)
//       return res.status(400).json({ success: false, message: "Please set up 2FA first." });

//     const verified = speakeasy.totp.verify({
//       secret: user.twoFactorTempSecret,
//       encoding: "base32",
//       token,
//       window: 2,
//     });

//     if (!verified)
//       return res.status(400).json({ success: false, message: "Incorrect code." });

//     user.twoFactorSecret = user.twoFactorTempSecret;
//     user.twoFactorEnabled = true;
//     user.twoFactorTempSecret = undefined;
//     await user.save({ validateBeforeSave: false });

//     res.status(200).json({ success: true, message: "2FA enabled! You'll be asked for a code on future logins." });
//   } catch (err) {
//     console.error("❌ 2FA verify error:", err);
//     res.status(500).json({ success: false, message: "2FA verification failed.", error: err.message });
//   }
// };

// // ════════════════════════════════════════════════
// // 2FA — DISABLE
// // ════════════════════════════════════════════════
// export const disable2FA = async (req, res) => {
//   try {
//     const { password } = req.body;
//     const user = await User.findById(req.user._id).select("+password");

//     // Require password confirmation for security
//     if (!password || !(await bcrypt.compare(password, user.password)))
//       return res.status(401).json({ success: false, message: "Incorrect password." });

//     user.twoFactorEnabled = false;
//     user.twoFactorSecret = undefined;
//     user.twoFactorTempSecret = undefined;
//     await user.save({ validateBeforeSave: false });

//     res.status(200).json({ success: true, message: "2FA has been disabled." });
//   } catch (err) {
//     res.status(500).json({ success: false, message: "Failed to disable 2FA.", error: err.message });
//   }
// };

// // ════════════════════════════════════════════════
// // REFRESH TOKEN
// // ════════════════════════════════════════════════
// export const refreshToken = async (req, res) => {
//   try {
//     const { refreshToken: token } = req.body;

//     if (!token)
//       return res.status(401).json({ success: false, message: "Refresh token is required." });

//     const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
//     const user = await User.findById(decoded.id);

//     if (!user)
//       return res.status(401).json({ success: false, message: "User not found." });

//     const newAccessToken  = generateAccessToken(user._id);
//     const newRefreshToken = generateRefreshToken(user._id);

//     res.status(200).json({
//       success: true,
//       token: newAccessToken,
//       refreshToken: newRefreshToken,
//     });
//   } catch (err) {
//     res.status(401).json({ success: false, message: "Refresh token is invalid or expired. Please log in again." });
//   }
// };

// // ════════════════════════════════════════════════
// // GET ME
// // ════════════════════════════════════════════════
// export const getMe = async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id).select("-password");
//     if (!user)
//       return res.status(404).json({ success: false, message: "User not found" });

//     res.status(200).json({
//       success: true,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         avatar: user.avatar || null,
//         favorites: user.favorites || [],
//         twoFactorEnabled: user.twoFactorEnabled,
//         createdAt: user.createdAt,
//       },
//     });
//   } catch (err) {
//     res.status(500).json({ success: false, message: "Failed to get user", error: err.message });
//   }
// };

// // ════════════════════════════════════════════════
// // UPDATE PROFILE
// // ════════════════════════════════════════════════
// export const updateProfile = async (req, res) => {
//   try {
//     const { name, avatar, bio } = req.body;
//     const user = await User.findByIdAndUpdate(
//       req.user._id,
//       { name, avatar, bio },
//       { new: true, runValidators: true }
//     ).select("-password");

//     res.status(200).json({
//       success: true,
//       message: "Profile updated",
//       user: {
//         id: user._id, name: user.name, email: user.email,
//         role: user.role, avatar: user.avatar || null,
//         bio: user.bio || null, favorites: user.favorites || [],
//       },
//     });
//   } catch (err) {
//     res.status(500).json({ success: false, message: "Failed to update profile", error: err.message });
//   }
// };

// // ════════════════════════════════════════════════
// // CHANGE PASSWORD (while logged in)
// // ════════════════════════════════════════════════
// export const changePassword = async (req, res) => {
//   try {
//     const { currentPassword, newPassword, confirmPassword } = req.body;

//     if (!currentPassword || !newPassword)
//       return res.status(400).json({ success: false, message: "Both passwords are required." });

//     if (newPassword !== confirmPassword)
//       return res.status(400).json({ success: false, message: "New passwords do not match." });

//     const user = await User.findById(req.user._id).select("+password");
//     const isValid = await bcrypt.compare(currentPassword, user.password);

//     if (!isValid)
//       return res.status(401).json({ success: false, message: "Current password is incorrect." });

//     user.password = newPassword;
//     await user.save();

//     res.status(200).json({ success: true, message: "Password changed successfully." });
//   } catch (err) {
//     res.status(500).json({ success: false, message: "Failed to change password", error: err.message });
//   }
// };

// // ════════════════════════════════════════════════
// // FORGOT PASSWORD — Step 1: send OTP
// // ════════════════════════════════════════════════
// // export const forgotPassword = async (req, res) => {
// //   try {
// //     const { email } = req.body;
// //     const user = await User.findOne({ email });

// //     if (!user)
// //       return res.status(404).json({ success: false, message: "User not found." });

// //     const otp = generateOTP();
// //     user.resetOtp = otp;
// //     user.resetOtpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min
// //     await user.save({ validateBeforeSave: false });

// //     await sendOTPEmail(email, otp, user.name, "reset");

// //     res.status(200).json({ success: true, message: "OTP has been sent to your email." });
// //   } catch (err) {
// //     console.error("❌ Forgot password error:", err);
// //     res.status(500).json({ success: false, message: "Failed to send reset OTP", error: err.message });
// //   }
// // };


// export const forgotPassword = async (req, res) => {
// try {
// const email = req.body.email?.trim().toLowerCase();
// if (!email) {
//   return res.status(400).json({
//     success: false,
//     message: "Email is required."
//   });
// }

// console.log("Forgot password request email:", email);

// const user = await User.findOne({
//   email: {
//     $regex: new RegExp(`^${email}$`, "i")
//   }
// });

// if (!user) {
//   console.log("User not found for email:", email);

//   return res.status(404).json({
//     success: false,
//     message: "User not found."
//   });
// }

// const otp = generateOTP();

// user.resetOtp = otp;
// user.resetOtpExpiry = new Date(Date.now() + 10 * 60 * 1000);

// await user.save({ validateBeforeSave: false });

// console.log("OTP generated for:", user.email);

// await sendOTPEmail(
//   user.email,
//   otp,
//   user.name,
//   "reset"
// );

// res.status(200).json({
//   success: true,
//   message: "OTP has been sent to your email."
// });
// } catch (err) {
// console.error("Forgot password error:", err);


// res.status(500).json({
//   success: false,
//   message: "Failed to send reset OTP",
//   error: err.message
// });

// }
// };

// // ════════════════════════════════════════════════
// // VERIFY RESET OTP — Step 2: check OTP, issue short-lived reset token
// // ════════════════════════════════════════════════
// export const verifyResetOtp = async (req, res) => {
//   try {
//     const { email, otp } = req.body;

//     if (!email || !otp)
//       return res.status(400).json({ success: false, message: "Email and OTP are required." });

//     const user = await User.findOne({ email }).select("+resetOtp +resetOtpExpiry");

//     if (!user)
//       return res.status(404).json({ success: false, message: "User not found." });

//     if (!user.resetOtp || user.resetOtp !== otp)
//       return res.status(400).json({ success: false, message: "Incorrect OTP." });

//     if (new Date() > user.resetOtpExpiry)
//       return res.status(400).json({ success: false, message: "OTP has expired." });

//     // Clear OTP so it can't be reused
//     user.resetOtp = undefined;
//     user.resetOtpExpiry = undefined;
//     await user.save({ validateBeforeSave: false });

//     // Short-lived token that only reset-password will accept
//     const resetToken = jwt.sign(
//       { id: user._id, purpose: "password_reset" },
//       process.env.JWT_SECRET,
//       { expiresIn: "10m" }
//     );

//     res.status(200).json({ success: true, resetToken, message: "OTP verified." });
//   } catch (err) {
//     console.error("❌ Verify reset OTP error:", err);
//     res.status(500).json({ success: false, message: "Error verifying OTP.", error: err.message });
//   }
// };

// // ════════════════════════════════════════════════
// // RESET PASSWORD — Step 3: set new password using resetToken from Step 2
// // ════════════════════════════════════════════════
// // Replace only the resetPassword function in controllers/AuthController.js with this:

// export const resetPassword = async (req, res) => {
//   try {
//     const { resetToken, newPassword } = req.body;

//     if (!resetToken || !newPassword)
//       return res.status(400).json({ success: false, message: "Reset token and new password are required." });

//     let decoded;
//     try {
//       decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
//     } catch {
//       return res.status(400).json({ success: false, message: "Reset token is invalid or expired." });
//     }

//     if (decoded.purpose !== "password_reset")
//       return res.status(400).json({ success: false, message: "Invalid reset token." });

//     const user = await User.findById(decoded.id);
//     if (!user)
//       return res.status(404).json({ success: false, message: "User not found." });

//     user.password = newPassword;
//     await user.save();

//     // Log the user in immediately — issue tokens same as login
//     const accessToken  = generateAccessToken(user._id);
//     const refreshToken = generateRefreshToken(user._id);

//     res.status(200).json({
//       success: true,
//       message: "Password reset successfully.",
//       token: accessToken,
//       refreshToken,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         avatar: user.avatar || null,
//         favorites: user.favorites || [],
//         twoFactorEnabled: user.twoFactorEnabled,
//       },
//     });
//   } catch (err) {
//     console.error("❌ Reset password error:", err);
//     res.status(500).json({ success: false, message: "Failed to reset password.", error: err.message });
//   }
// };


import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import speakeasy from "speakeasy";
import QRCode from "qrcode";
import { sendOTPEmail } from "../utils/emailService.js";
import { updateStreak, awardBadges } from "../utils/gamification.js";

// ── Token generators ──
const generateAccessToken = (userId) =>
  jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

const generateRefreshToken = (userId) =>
  jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// ════════════════════════════════════════════════
// SIGNUP
// ════════════════════════════════════════════════
export const signup = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existing = await User.findOne({
      email: normalizedEmail,
    });

    if (existing && existing.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: "This email is already registered.",
      });
    }

    const otp = generateOTP();

    const otpExpiry = new Date(
      Date.now() + 10 * 60 * 1000
    );

    if (existing && !existing.isEmailVerified) {
      existing.name = name;
      existing.password = password;
      existing.otp = otp;
      existing.otpExpiry = otpExpiry;

      await existing.save();
    } else {
      await User.create({
        name,
        email: normalizedEmail,
        password,
        otp,
        otpExpiry,
        isEmailVerified: false,
        isVerified: false,
        role: "user",
      });
    }

    await sendOTPEmail(
      normalizedEmail,
      otp,
      name,
      "verify"
    );

    return res.status(200).json({
      success: true,
      message:
        "OTP has been sent to your email. Verify within 10 minutes.",
      email: normalizedEmail,
      requiresOTP: true,
    });

  } catch (err) {
    console.error("❌ Signup error:", err);

    return res.status(500).json({
      success: false,
      message: "Signup failed.",
      error: err.message,
    });
  }
};

// ════════════════════════════════════════════════
// VERIFY SIGNUP OTP
// ════════════════════════════════════════════════
export const verifyOTP = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const otp = req.body.otp?.toString().trim();

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required.",
      });
    }

    const user = await User.findOne({
      email,
    }).select("+otp +otpExpiry +password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is already verified.",
      });
    }

    const storedOTP = user.otp?.toString().trim();

    if (!storedOTP || storedOTP !== otp) {
      return res.status(400).json({
        success: false,
        message: "Incorrect OTP.",
      });
    }

    if (
      !user.otpExpiry ||
      new Date() > new Date(user.otpExpiry)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "OTP has expired. Please try again.",
      });
    }

    user.isEmailVerified = true;
    user.isVerified = true;

    user.otp = undefined;
    user.otpExpiry = undefined;

    await user.save({
      validateBeforeSave: false,
    });

    const accessToken = generateAccessToken(
      user._id
    );

    const refreshToken = generateRefreshToken(
      user._id
    );

    return res.status(200).json({
      success: true,
      message:
        "Email verified! Welcome to Bharatiya Dharohar.",
      token: accessToken,
      refreshToken,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar || null,
        favorites: user.favorites || [],
      },
    });

  } catch (err) {
    console.error("❌ Verify OTP error:", err);

    return res.status(500).json({
      success: false,
      message: "Error verifying OTP.",
      error: err.message,
    });
  }
};

// ════════════════════════════════════════════════
// RESEND OTP
// ════════════════════════════════════════════════
export const resendOTP = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    const user = await User.findOne({
      email,
    }).select("+otp +otpExpiry");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is already verified.",
      });
    }

    const otp = generateOTP();

    user.otp = otp;

    user.otpExpiry = new Date(
      Date.now() + 10 * 60 * 1000
    );

    await user.save({
      validateBeforeSave: false,
    });

    await sendOTPEmail(
      email,
      otp,
      user.name,
      "verify"
    );

    return res.status(200).json({
      success: true,
      message: "A new OTP has been sent.",
    });

  } catch (err) {
    console.error("❌ Resend OTP error:", err);

    return res.status(500).json({
      success: false,
      message: "Error sending OTP.",
      error: err.message,
    });
  }
};

// ════════════════════════════════════════════════
// LOGIN
// ════════════════════════════════════════════════
export const login = async (req, res) => {
  try {
    const {
      email,
      password,
      twoFactorCode,
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required.",
      });
    }

    const normalizedEmail =
      email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    }).select("+password +twoFactorSecret");

    if (
      !user ||
      !(await bcrypt.compare(
        password,
        user.password
      ))
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Incorrect email or password.",
      });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({
        success: false,
        message:
          "Email is not verified. Please verify with OTP first.",
        requiresOTP: true,
        email: normalizedEmail,
      });
    }

    if (user.twoFactorEnabled) {
      if (!twoFactorCode) {
        return res.status(200).json({
          success: false,
          requires2FA: true,
          email: normalizedEmail,
          message:
            "Please enter your 2FA code.",
        });
      }

      const verified =
        speakeasy.totp.verify({
          secret: user.twoFactorSecret,
          encoding: "base32",
          token: twoFactorCode,
          window: 2,
        });

      if (!verified) {
        return res.status(401).json({
          success: false,
          requires2FA: true,
          message:
            "Incorrect 2FA code.",
        });
      }
    }

    user.lastLogin = new Date();

// 🏅 Gamification — streak + badges
    updateStreak(user);
    const newBadges = awardBadges(user);

    

    await user.save({
      validateBeforeSave: false,
    });

    const accessToken =
      generateAccessToken(user._id);

    const refreshToken =
      generateRefreshToken(user._id);

    return res.status(200).json({
      success: true,
      message: "Login successful",

      token: accessToken,
      refreshToken,
      newBadges,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar || null,
        favorites:
          user.favorites || [],
        twoFactorEnabled:
          user.twoFactorEnabled,
         badges: user.badges || [], 
         streak: user.streak || { current: 0, longest: 0 }, 
      },
    });

  } catch (err) {
    console.error("❌ Login error:", err);

    return res.status(500).json({
      success: false,
      message: "Login failed.",
      error: err.message,
    });
  }
};

// ════════════════════════════════════════════════
// 2FA SETUP
// ════════════════════════════════════════════════
export const setup2FA = async (req, res) => {
  try {
    const user = await User.findById(
      req.user._id
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (user.twoFactorEnabled) {
      return res.status(400).json({
        success: false,
        message:
          "2FA is already enabled.",
      });
    }

    const secret =
      speakeasy.generateSecret({
        name:
          `Bharatiya Dharohar (${user.email})`,
        issuer:
          "Bharatiya Dharohar",
      });

    user.twoFactorTempSecret =
      secret.base32;

    await user.save({
      validateBeforeSave: false,
    });

    const qrCode =
      await QRCode.toDataURL(
        secret.otpauth_url
      );

    return res.status(200).json({
      success: true,
      qrCode,
      secret: secret.base32,
      message:
        "Scan this with Google Authenticator or Authy.",
    });

  } catch (err) {
    console.error(
      "❌ 2FA setup error:",
      err
    );

    return res.status(500).json({
      success: false,
      message:
        "2FA setup failed.",
      error: err.message,
    });
  }
};

// ════════════════════════════════════════════════
// 2FA VERIFY
// ════════════════════════════════════════════════
export const verify2FA = async (req, res) => {
  try {
    const { token } = req.body;

    const user =
      await User.findById(
        req.user._id
      ).select("+twoFactorTempSecret");

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User not found.",
      });
    }

    if (!user.twoFactorTempSecret) {
      return res.status(400).json({
        success: false,
        message:
          "Please set up 2FA first.",
      });
    }

    const verified =
      speakeasy.totp.verify({
        secret:
          user.twoFactorTempSecret,
        encoding: "base32",
        token,
        window: 2,
      });

    if (!verified) {
      return res.status(400).json({
        success: false,
        message:
          "Incorrect code.",
      });
    }

    user.twoFactorSecret =
      user.twoFactorTempSecret;

    user.twoFactorEnabled = true;

    user.twoFactorTempSecret =
      undefined;

    await user.save({
      validateBeforeSave: false,
    });

    return res.status(200).json({
      success: true,
      message:
        "2FA enabled! You'll be asked for a code on future logins.",
    });

  } catch (err) {
    console.error(
      "❌ 2FA verify error:",
      err
    );

    return res.status(500).json({
      success: false,
      message:
        "2FA verification failed.",
      error: err.message,
    });
  }
};

// ════════════════════════════════════════════════
// DISABLE 2FA
// ════════════════════════════════════════════════
export const disable2FA = async (req, res) => {
  try {
    const { password } = req.body;

    const user =
      await User.findById(
        req.user._id
      ).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User not found.",
      });
    }

    if (
      !password ||
      !(await bcrypt.compare(
        password,
        user.password
      ))
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Incorrect password.",
      });
    }

    user.twoFactorEnabled = false;
    user.twoFactorSecret = undefined;
    user.twoFactorTempSecret =
      undefined;

    await user.save({
      validateBeforeSave: false,
    });

    return res.status(200).json({
      success: true,
      message:
        "2FA has been disabled.",
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message:
        "Failed to disable 2FA.",
      error: err.message,
    });
  }
};

// ════════════════════════════════════════════════
// REFRESH TOKEN
// ════════════════════════════════════════════════
export const refreshToken = async (
  req,
  res
) => {
  try {
    const {
      refreshToken: token,
    } = req.body;

    if (!token) {
      return res.status(401).json({
        success: false,
        message:
          "Refresh token is required.",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET
    );

    const user =
      await User.findById(
        decoded.id
      );

    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "User not found.",
      });
    }

    const newAccessToken =
      generateAccessToken(user._id);

    const newRefreshToken =
      generateRefreshToken(user._id);

    return res.status(200).json({
      success: true,
      token: newAccessToken,
      refreshToken:
        newRefreshToken,
    });

  } catch (err) {
    return res.status(401).json({
      success: false,
      message:
        "Refresh token is invalid or expired. Please log in again.",
    });
  }
};

// ════════════════════════════════════════════════
// GET ME
// ════════════════════════════════════════════════
export const getMe = async (
  req,
  res
) => {
  try {
    const user =
      await User.findById(
        req.user._id
      ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User not found",
      });
    }

    return res.status(200).json({
      success: true,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar:
          user.avatar || null,
        favorites:
          user.favorites || [],
        twoFactorEnabled:
          user.twoFactorEnabled,
        createdAt:
          user.createdAt,
          badges: user.badges || [],     
        streak: user.streak || { current: 0, longest: 0 },
      },
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message:
        "Failed to get user",
      error:
        err.message,
    });
  }
};

// ════════════════════════════════════════════════
// UPDATE PROFILE
// ════════════════════════════════════════════════
export const updateProfile = async (
  req,
  res
) => {
  try {
    const {
      name,
      avatar,
      bio,
    } = req.body;

    const updateData = {};

    if (name !== undefined)
      updateData.name = name;

    if (avatar !== undefined)
      updateData.avatar = avatar;

    if (bio !== undefined)
      updateData.bio = bio;

    const user =
      await User.findByIdAndUpdate(
        req.user._id,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Profile updated",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar:
          user.avatar || null,
        bio:
          user.bio || null,
        favorites:
          user.favorites || [],
      },
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message:
        "Failed to update profile",
      error:
        err.message,
    });
  }
};

// ════════════════════════════════════════════════
// CHANGE PASSWORD
// ════════════════════════════════════════════════
export const changePassword = async (
  req,
  res
) => {
  try {
    const {
      currentPassword,
      newPassword,
      confirmPassword,
    } = req.body;

    if (
      !currentPassword ||
      !newPassword
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Both passwords are required.",
      });
    }

    if (
      newPassword !==
      confirmPassword
    ) {
      return res.status(400).json({
        success: false,
        message:
          "New passwords do not match.",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters.",
      });
    }

    const user =
      await User.findById(
        req.user._id
      ).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User not found.",
      });
    }

    const isValid =
      await bcrypt.compare(
        currentPassword,
        user.password
      );

    if (!isValid) {
      return res.status(401).json({
        success: false,
        message:
          "Current password is incorrect.",
      });
    }

    user.password =
      newPassword;

    await user.save();

    return res.status(200).json({
      success: true,
      message:
        "Password changed successfully.",
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message:
        "Failed to change password",
      error:
        err.message,
    });
  }
};

// ════════════════════════════════════════════════
// FORGOT PASSWORD — Step 1: Send OTP
// ════════════════════════════════════════════════
export const forgotPassword = async (req, res) => {
  try {
    const email = String(req.body.email || "")
      .trim()
      .toLowerCase();

    console.log("🔐 FORGOT PASSWORD REQUEST");
    console.log("📧 Email:", email);

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    const user = await User.findOne({
      email,
    }).select("+resetOtp +resetOtpExpiry");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // OTP ONLY GENERATED ONCE
    const otp = String(generateOTP()).trim();

    console.log("🎲 GENERATED OTP:", otp);

    // Save EXACT SAME OTP
    user.resetOtp = otp;

    user.resetOtpExpiry = new Date(
      Date.now() + 10 * 60 * 1000
    );

    await user.save({
      validateBeforeSave: false,
    });

    console.log(
      "💾 SAVED OTP:",
      String(user.resetOtp).trim()
    );

    // Send EXACT SAME OTP
    await sendOTPEmail(
      user.email,
      otp,
      user.name || "User",
      "reset"
    );

    console.log("📨 SENT OTP:", otp);

    return res.status(200).json({
      success: true,
      message: "OTP has been sent to your email.",
    });

  } catch (err) {
    console.error("❌ FORGOT PASSWORD ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to send reset OTP",
      error: err.message,
    });
  }
};


// ════════════════════════════════════════════════
// VERIFY RESET OTP — Step 2
// ════════════════════════════════════════════════
export const verifyResetOtp = async (req, res) => {
  try {
    const email = String(req.body.email || "")
      .trim()
      .toLowerCase();

    const receivedOtp = String(
      req.body.otp || ""
    ).trim();

    console.log("🔍 VERIFYING RESET OTP");
    console.log("📧 Email:", email);
    console.log("📥 RECEIVED OTP:", receivedOtp);

    if (!email || !receivedOtp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required.",
      });
    }

    const user = await User.findOne({
      email,
    }).select("+resetOtp +resetOtpExpiry");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const storedOtp = user.resetOtp
      ? String(user.resetOtp).trim()
      : "";

    console.log("💾 STORED OTP:", storedOtp);
    console.log(
      "🔄 OTP MATCH:",
      receivedOtp === storedOtp
    );

    if (!storedOtp) {
      return res.status(400).json({
        success: false,
        message:
          "No OTP found. Please request a new OTP.",
      });
    }

    // Compare OTP
    if (receivedOtp !== storedOtp) {
      return res.status(400).json({
        success: false,
        message: "Incorrect OTP.",
      });
    }

    // Check expiry
    if (
      !user.resetOtpExpiry ||
      Date.now() >
        new Date(user.resetOtpExpiry).getTime()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "OTP has expired. Please request a new OTP.",
      });
    }

    console.log("✅ OTP VERIFIED SUCCESSFULLY");

    // Clear OTP
    user.resetOtp = undefined;
    user.resetOtpExpiry = undefined;

    await user.save({
      validateBeforeSave: false,
    });

    // Create reset token
    const resetToken = jwt.sign(
      {
        id: user._id,
        purpose: "password_reset",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "10m",
      }
    );

    return res.status(200).json({
      success: true,
      resetToken,
      message: "OTP verified.",
    });

  } catch (err) {
    console.error(
      "❌ VERIFY RESET OTP ERROR:",
      err
    );

    return res.status(500).json({
      success: false,
      message: "Error verifying OTP.",
      error: err.message,
    });
  }
};
// ════════════════════════════════════════════════
// RESET PASSWORD
// STEP 3
// ════════════════════════════════════════════════
export const resetPassword = async (
  req,
  res
) => {
  try {
    const {
      resetToken,
      newPassword,
    } = req.body;

    if (
      !resetToken ||
      !newPassword
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Reset token and new password are required.",
      });
    }

    if (
      newPassword.length < 6
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters.",
      });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error(
        "JWT_SECRET is missing."
      );
    }

    let decoded;

    try {
      decoded =
        jwt.verify(
          resetToken,
          process.env.JWT_SECRET
        );

    } catch (error) {
      return res.status(400).json({
        success: false,
        message:
          "Reset token is invalid or expired.",
      });
    }

    if (
      decoded.purpose !==
      "password_reset"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid reset token.",
      });
    }

    const user =
      await User.findById(
        decoded.id
      );

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User not found.",
      });
    }

    // Save new password.
    // Your User model should hash
    // the password in its pre-save hook.
    user.password =
      newPassword;

    user.resetOtp =
      undefined;

    user.resetOtpExpiry =
      undefined;

    await user.save();

    console.log(
      "✅ PASSWORD RESET SUCCESS:",
      user.email
    );

    // Issue fresh login tokens
    const accessToken =
      generateAccessToken(
        user._id
      );

    const refreshToken =
      generateRefreshToken(
        user._id
      );

    return res.status(200).json({
      success: true,
      message:
        "Password reset successfully.",

      token:
        accessToken,

      refreshToken,

      user: {
        id:
          user._id,

        name:
          user.name,

        email:
          user.email,

        role:
          user.role,

        avatar:
          user.avatar ||
          null,

        favorites:
          user.favorites ||
          [],

        twoFactorEnabled:
          user.twoFactorEnabled,
      },
    });

  } catch (err) {
    console.error(
      "❌ Reset password error:",
      err
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to reset password.",
      error:
        err.message,
    });
  }
};