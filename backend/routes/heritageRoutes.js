// const express             = require("express");
// const router              = express.Router();
// const heritageController  = require("../controllers/heritageController");
// const { protect, adminOnly } = require("../middleware/authMiddleware");

// // Public routes
// router.get("/",                          heritageController.getAllSites);
// router.get("/slug/:slug",                heritageController.getSiteBySlug);
// router.get("/:id",                       heritageController.getSiteById);
// router.get("/:id/recommendations",      heritageController.getRecommendations);

// // Admin only routes
// router.post("/",          protect, adminOnly, heritageController.createSite);
// router.patch("/:id",      protect, adminOnly, heritageController.updateSite);
// router.delete("/:id",     protect, adminOnly, heritageController.deleteSite);

// module.exports = router;



// import express from "express";
// import heritageController from "../controllers/heritageController.js";
// import { protect, adminOnly } from "../middleware/authMiddleware.js";

// const router = express.Router();

// // ============ PUBLIC ROUTES ============

// // Get all sites
// router.get("/", heritageController.getAllSites);

// // Get site by slug
// router.get("/slug/:slug", heritageController.getSiteBySlug);

// // Get site by ID
// router.get("/:id", heritageController.getSiteById);

// // Get recommendations for a site
// router.get("/:id/recommendations", heritageController.getRecommendations);

// // ============ ADMIN ONLY ROUTES ============

// // Create new site
// router.post("/", protect, adminOnly, heritageController.createSite);

// // Update site
// router.patch("/:id", protect, adminOnly, heritageController.updateSite);

// // Delete site
// router.delete("/:id", protect, adminOnly, heritageController.deleteSite);

// export default router;



// const express = require("express");
// const router = express.Router();
// const Heritage = require("../models/Heritage");

// // ⚠️ Replace this with your project's actual auth middleware
// // (the one that verifies the Bearer token from AuthContext.js and sets req.user)
// const requireAuth = require("../middleware/authMiddleware");

// // ── GET all monuments ──
// // GET /api/heritage
// router.get("/", async (req, res) => {
//   try {
//     const sites = await Heritage.find().sort({ createdAt: -1 });
//     res.json({ success: true, sites });
//   } catch (err) {
//     console.error("GET /api/heritage error:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// });

// // ── CREATE monument ──
// // POST /api/heritage
// router.post("/", requireAuth, async (req, res) => {
//   try {
//     const site = await Heritage.create(req.body);
//     res.status(201).json({ success: true, site });
//   } catch (err) {
//     console.error("POST /api/heritage error:", err);

//     // Duplicate slug (unique index violation)
//     if (err.code === 11000) {
//       return res.status(400).json({
//         success: false,
//         message: `A monument with this name/slug already exists.`,
//       });
//     }

//     // Mongoose validation error — this is the one that was likely
//     // silently failing before. Now it returns a clear message.
//     if (err.name === "ValidationError") {
//       const messages = Object.values(err.errors).map(e => e.message);
//       return res.status(400).json({ success: false, message: messages.join(", ") });
//     }

//     res.status(500).json({ success: false, message: err.message });
//   }
// });

// // ── UPDATE monument ──
// // PUT /api/heritage/:id
// router.put("/:id", requireAuth, async (req, res) => {
//   try {
//     const site = await Heritage.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true,
//     });
//     if (!site) return res.status(404).json({ success: false, message: "Monument not found" });
//     res.json({ success: true, site });
//   } catch (err) {
//     console.error("PUT /api/heritage/:id error:", err);
//     if (err.name === "ValidationError") {
//       const messages = Object.values(err.errors).map(e => e.message);
//       return res.status(400).json({ success: false, message: messages.join(", ") });
//     }
//     res.status(500).json({ success: false, message: err.message });
//   }
// });

// // ── DELETE monument ──
// // DELETE /api/heritage/:id
// router.delete("/:id", requireAuth, async (req, res) => {
//   try {
//     const site = await Heritage.findByIdAndDelete(req.params.id);
//     if (!site) return res.status(404).json({ success: false, message: "Monument not found" });
//     res.json({ success: true });
//   } catch (err) {
//     console.error("DELETE /api/heritage/:id error:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// });

// module.exports = router;



import express from "express";
import heritageController from "../controllers/heritageController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// ============ PUBLIC ROUTES ============
router.get("/", heritageController.getAllSites);
router.get("/slug/:slug", heritageController.getSiteBySlug);
router.get("/:id", heritageController.getSiteById);
router.get("/:id/recommendations", heritageController.getRecommendations);

// ============ ADMIN ONLY ROUTES ============
router.post("/", protect, adminOnly, heritageController.createSite);
router.patch("/:id", protect, adminOnly, heritageController.updateSite);
router.delete("/:id", protect, adminOnly, heritageController.deleteSite);

export default router;