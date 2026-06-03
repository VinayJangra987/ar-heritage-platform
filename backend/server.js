const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes      = require("./routes/AuthRoutes");
const heritageRoutes  = require("./routes/heritageRoutes");
const reviewRoutes    = require("./routes/reviewRoutes");
const favoriteRoutes  = require("./routes/favoriteRoutes");
const nearbyRoutes    = require("./routes/nearbyRoutes");
const tourRoutes      = require("./routes/tourRoutes");

const app = express();
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT ERROR:', err.message);
  console.log(err.stack);
});

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000", credentials: true }));
app.use(express.json());

// ── Routes ──────────────────────────────────────────────────────────────────
app.use("/api/auth",      authRoutes);      // signup, login, me
app.use("/api/heritage",  heritageRoutes);  // all sites, filters, search, single
app.use("/api/reviews",   reviewRoutes);    // add, get, delete review
app.use("/api/favorites", favoriteRoutes);  // toggle, get user favorites
app.use("/api/nearby",    nearbyRoutes);    // nearby sites by lat/lng
app.use("/api/tours",     tourRoutes);      // virtual tour data

// ── Health check ────────────────────────────────────────────────────────────
app.get("/", (req, res) => res.json({ status: "Bharatiya Dharohar API running 🏛️" }));

// ── Global error handler ────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || "Internal Server Error" });
});

// ── DB + Server ─────────────────────────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(process.env.PORT || 5000, () =>
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`)
    );
  })
  .catch((err) => console.error("❌ DB Error:", err));




  console.log("MONGO_URI exists:", !!process.env.MONGO_URI);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(process.env.PORT || 5000, () => {
      console.log("Server Started");
    });
  })
  .catch((err) => {
    console.error("DB ERROR:", err);
  });