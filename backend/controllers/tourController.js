// const Tour = require("../models/Tour");
// const User = require("../models/User");

// // ── GET /api/tours ───────────────────────────────────────────────────────────
// // VirtualTour.js selector screen — list all available tours
// exports.getAllTours = async (req, res) => {
//   try {
//     const tours = await Tour.find({ isActive: true })
//       .populate("site", "name state thumbnail")
//       .select("-scenes"); // don't send full scene data in list
//     res.status(200).json({ tours });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // ── GET /api/tours/:tourId ───────────────────────────────────────────────────
// // VirtualTour.js — load full tour with all scenes & hotspots
// exports.getTourById = async (req, res) => {
//   try {
//     const tour = await Tour.findOne({ tourId: req.params.tourId, isActive: true }).populate(
//       "site",
//       "name state district description highlights"
//     );
//     if (!tour) return res.status(404).json({ message: "Tour not found." });
//     res.status(200).json({ tour });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // ── POST /api/tours/:tourId/complete  (protected) ────────────────────────────
// // Track that a user completed a tour
// exports.completeTour = async (req, res) => {
//   try {
//     await User.findByIdAndUpdate(req.user._id, {
//       $push: {
//         tourHistory: { tourId: req.params.tourId, completedAt: new Date() },
//       },
//     });
//     res.status(200).json({ message: "Tour completion recorded." });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // ── POST /api/tours  (admin only) ────────────────────────────────────────────
// exports.createTour = async (req, res) => {
//   try {
//     const tour = await Tour.create(req.body);
//     res.status(201).json({ tour });
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// };


import Tour from "../models/Tour.js";
import User from "../models/User.js";

// ============ GET ALL TOURS ============
export const getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find({ isActive: true })
      .populate("site", "name state thumbnail")
      .select("-scenes");

    res.status(200).json({
      success: true,
      tours,
    });
  } catch (error) {
    console.error("❌ Get all tours error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============ GET TOUR BY ID ============
export const getTourById = async (req, res) => {
  try {
    const tour = await Tour.findOne({
      tourId: req.params.tourId,
      isActive: true,
    }).populate("site", "name state district description highlights");

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: "Tour not found",
      });
    }

    res.status(200).json({
      success: true,
      tour,
    });
  } catch (error) {
    console.error("❌ Get tour by ID error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============ COMPLETE TOUR ============
export const completeTour = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      $push: {
        tourHistory: {
          tourId: req.params.tourId,
          completedAt: new Date(),
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Tour completion recorded",
    });
  } catch (error) {
    console.error("❌ Complete tour error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============ CREATE TOUR (ADMIN ONLY) ============
export const createTour = async (req, res) => {
  try {
    const tour = await Tour.create(req.body);

    res.status(201).json({
      success: true,
      message: "Tour created successfully",
      tour,
    });
  } catch (error) {
    console.error("❌ Create tour error:", error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ============ UPDATE TOUR (ADMIN ONLY) ============
export const updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: "Tour not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Tour updated successfully",
      tour,
    });
  } catch (error) {
    console.error("❌ Update tour error:", error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ============ DELETE TOUR (ADMIN ONLY) ============
export const deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: "Tour not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Tour deleted successfully",
    });
  } catch (error) {
    console.error("❌ Delete tour error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============ DEFAULT EXPORT ============
export default {
  getAllTours,
  getTourById,
  completeTour,
  createTour,
  updateTour,
  deleteTour,
};