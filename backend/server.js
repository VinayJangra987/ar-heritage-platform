// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// require("dotenv").config();

// const authRoutes = require("./routes/AuthRoutes");
// const heritageRoutes = require("./routes/heritageRoutes");
// const reviewRoutes = require("./routes/reviewRoutes");
// const favoriteRoutes = require("./routes/favoriteRoutes");
// const nearbyRoutes = require("./routes/nearbyRoutes");
// const tourRoutes = require("./routes/tourRoutes");

// const app = express();

// // Debug logs
// console.log("MONGO_URI exists:", !!process.env.MONGO_URI);
// console.log("CLIENT_URL:", process.env.CLIENT_URL);

// process.on("uncaughtException", (err) => {
//   console.error("UNCAUGHT ERROR:", err);
// });

// // Middleware
// app.use(cors({
//   origin: function(origin, callback) {
//     if (!origin || 
//         origin.includes('vercel.app') || 
//         origin.includes('localhost')) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true
// }));

// app.use(express.json());

// // Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/heritage", heritageRoutes);
// app.use("/api/reviews", reviewRoutes);
// app.use("/api/favorites", favoriteRoutes);
// app.use("/api/nearby", nearbyRoutes);
// app.use("/api/tours", tourRoutes);

// // Health Check
// app.get("/", (req, res) => {
//   res.json({
//     status: "Bharatiya Dharohar API running 🏛️",
//   });
// });

// // Error Handler
// app.use((err, req, res, next) => {
//   console.error(err.stack);

//   res.status(err.status || 500).json({
//     message: err.message || "Internal Server Error",
//   });
// });

// // MongoDB + Server Start
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log("✅ MongoDB Connected");

//     const PORT = process.env.PORT || 5000;

//     app.listen(PORT, () => {
//       console.log(`🚀 Server running on port ${PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.error("❌ DB ERROR:", err);
//   });
import "dotenv/config";   
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/AuthRoutes.js";
import heritageRoutes from "./routes/heritageRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";
import nearbyRoutes from "./routes/nearbyRoutes.js";
import tourRoutes from "./routes/tourRoutes.js";
import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const app = express();

// Debug logs
console.log("MONGO_URI exists:", !!process.env.MONGO_URI);
console.log("CLIENT_URL:", process.env.CLIENT_URL);

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT ERROR:", err);
});

// ============ MIDDLEWARE ============

// CORS Configuration
app.use(
  cors({
    origin: function (origin, callback) {
      if (
        !origin ||
        origin.includes("vercel.app") ||
        origin.includes("localhost") ||
        origin.includes("127.0.0.1")
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============ ROUTES ============

// Health Check
app.get("/", (req, res) => {
  res.json({
    status: "Bharatiya Dharohar API running 🏛️",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/heritage", heritageRoutes);
app.use("/api/heritage-sites", heritageRoutes); // Alternative route
app.use("/api/reviews", reviewRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/nearby", nearbyRoutes);
app.use("/api/tours", tourRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.path}`,
  });
});

// ============ ERROR HANDLER ============

app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// ============ DATABASE + SERVER START ============

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV || "development"}`);
    });
  })
  .catch((err) => {
    console.error("❌ DB ERROR:", err.message);
    process.exit(1);
  });
export default app;
