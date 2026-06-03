const Tour = require("../models/Tour");
const User = require("../models/User");

// ── GET /api/tours ───────────────────────────────────────────────────────────
// VirtualTour.js selector screen — list all available tours
exports.getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find({ isActive: true })
      .populate("site", "name state thumbnail")
      .select("-scenes"); // don't send full scene data in list
    res.status(200).json({ tours });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── GET /api/tours/:tourId ───────────────────────────────────────────────────
// VirtualTour.js — load full tour with all scenes & hotspots
exports.getTourById = async (req, res) => {
  try {
    const tour = await Tour.findOne({ tourId: req.params.tourId, isActive: true }).populate(
      "site",
      "name state district description highlights"
    );
    if (!tour) return res.status(404).json({ message: "Tour not found." });
    res.status(200).json({ tour });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── POST /api/tours/:tourId/complete  (protected) ────────────────────────────
// Track that a user completed a tour
exports.completeTour = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      $push: {
        tourHistory: { tourId: req.params.tourId, completedAt: new Date() },
      },
    });
    res.status(200).json({ message: "Tour completion recorded." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── POST /api/tours  (admin only) ────────────────────────────────────────────
exports.createTour = async (req, res) => {
  try {
    const tour = await Tour.create(req.body);
    res.status(201).json({ tour });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};