const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/AuthRoutes");
const heritageRoutes = require("./routes/heritageRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const nearbyRoutes = require("./routes/nearbyRoutes");
const tourRoutes = require("./routes/tourRoutes");

const app = express();

// Debug logs
console.log("MONGO_URI exists:", !!process.env.MONGO_URI);
console.log("CLIENT_URL:", process.env.CLIENT_URL);

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT ERROR:", err);
});

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/heritage", heritageRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/nearby", nearbyRoutes);
app.use("/api/tours", tourRoutes);

// Health Check
app.get("/", (req, res) => {
  res.json({
    status: "Bharatiya Dharohar API running 🏛️",
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

// MongoDB + Server Start
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ DB ERROR:", err);
  });