// const jwt  = require("jsonwebtoken");
// const User = require("../models/User");

// // ── Protect: must be logged in ───────────────────────────────────────────────
// exports.protect = async (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;
//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return res.status(401).json({ message: "Not authenticated. Please login." });
//     }

//     const token = authHeader.split(" ")[1];
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     const user = await User.findById(decoded.id).select("-password");
//     if (!user) return res.status(401).json({ message: "User no longer exists." });

//     req.user = user; // attach user to request
//     next();
//   } catch (err) {
//     return res.status(401).json({ message: "Invalid or expired token." });
//   }
// };

// // ── Admin only ───────────────────────────────────────────────────────────────
// exports.adminOnly = (req, res, next) => {
//   if (req.user?.role !== "admin") {
//     return res.status(403).json({ message: "Admin access only." });
//   }
//   next();
// };

// // ── Optional auth: attach user if token present, else continue ───────────────
// exports.optionalAuth = async (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;
//     if (authHeader && authHeader.startsWith("Bearer ")) {
//       const token = authHeader.split(" ")[1];
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       req.user = await User.findById(decoded.id).select("-password");
//     }
//   } catch (_) {
//     // no token or invalid — just continue without user
//   }
//   next();
// };


import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Protect middleware — token verify karo
export const protect = async (req, res, next) => {
  try {
    // Authorization header se token nikalo
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No token provided or invalid format",
      });
    }

    // "Bearer token" se token nikalo
    const token = authHeader.split(" ")[1];

    // Token verify karo
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // User ko database se fetch karo
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // User ko request mein attach karo
    req.user = user;
    next();
  } catch (error) {
    console.error("❌ Auth middleware error:", error.message);

    // Different error types handle karo
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Authentication failed",
    });
  }
};

// Optional auth — token hai toh verify karo, nahi toh continue karo
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");
      if (user) {
        req.user = user;
      }
    }

    next();
  } catch (error) {
    console.warn("⚠️ Optional auth warning:", error.message);
    next(); // Continue bina user ke
  }
};

// Admin check middleware
export const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Please login first",
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access required",
    });
  }

  next();
};

// Owner check middleware
export const ownerOrAdmin = (userId) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Please login first",
      });
    }

    if (req.user._id.toString() !== userId && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    next();
  };
};