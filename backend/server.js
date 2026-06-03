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

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT ERROR:", err.message);
  console.log(err.stack);
});

// Debug logs
console.log("MONGO_URI exists:", !!process.env.MONGO_URI);
console.log("CLIENT_URL:", process.env.CLIENT_URL);

// Middleware
app.use(
  cors({
    origin: true, // Vercel preview + production domains allow
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

// Health check
app.get("/", (req, res) => {
  res.json({ status: "Bharatiya Dharohar API running 🏛️" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Internal Server Error" });
});

// MongoDB + Server Start
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");

    app.listen(process.env.PORT || 5000, () => {
      console.log(
        `🚀 Server running on port ${process.env.PORT || 5000}`
      );
    });
  })
  .catch((err) => {
    console.error("❌ DB ERROR:", err);
  });