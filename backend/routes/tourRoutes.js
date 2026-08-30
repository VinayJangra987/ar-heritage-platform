// const express        = require("express");
// const router         = express.Router();
// const tourController = require("../controllers/tourController");
// const { protect, adminOnly } = require("../middleware/authMiddleware");

// router.get("/",                          tourController.getAllTours);
// router.get("/:tourId",                   tourController.getTourById);
// router.post("/:tourId/complete", protect, tourController.completeTour);
// router.post("/",   protect, adminOnly,   tourController.createTour);

// module.exports = router;


import express from "express";
import tourController from "../controllers/tourController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// ============ GET ALL TOURS ============
router.get("/", tourController.getAllTours);

// ============ GET TOUR BY ID ============
router.get("/:tourId", tourController.getTourById);

// ============ COMPLETE TOUR ============
router.post("/:tourId/complete", protect, tourController.completeTour);

// ============ CREATE TOUR (ADMIN ONLY) ============
router.post("/", protect, adminOnly, tourController.createTour);

export default router;