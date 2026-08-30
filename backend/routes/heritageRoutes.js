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



import express from "express";
import heritageController from "../controllers/heritageController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// ============ PUBLIC ROUTES ============

// Get all sites
router.get("/", heritageController.getAllSites);

// Get site by slug
router.get("/slug/:slug", heritageController.getSiteBySlug);

// Get site by ID
router.get("/:id", heritageController.getSiteById);

// Get recommendations for a site
router.get("/:id/recommendations", heritageController.getRecommendations);

// ============ ADMIN ONLY ROUTES ============

// Create new site
router.post("/", protect, adminOnly, heritageController.createSite);

// Update site
router.patch("/:id", protect, adminOnly, heritageController.updateSite);

// Delete site
router.delete("/:id", protect, adminOnly, heritageController.deleteSite);

export default router;