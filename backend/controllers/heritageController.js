// const Heritage = require("../models/Heritage");

// // ── GET /api/heritage ────────────────────────────────────────────────────────
// // Supports: ?type=Architectural&state=Rajasthan&unesco=true&search=taj&page=1&limit=12
// exports.getAllSites = async (req, res) => {
//   try {
//     const { type, state, unesco, search, page = 1, limit = 12, sort = "-createdAt" } = req.query;

//     const filter = {};

//     // Discovery.js filters
//     if (type)   filter.type  = type;
//     if (state)  filter.state = state;
//     if (unesco) filter.unesco = unesco === "true";

//     // Search overlay in App.js — name, state, district, tags
//     if (search) {
//       filter.$or = [
//         { name:     { $regex: search, $options: "i" } },
//         { state:    { $regex: search, $options: "i" } },
//         { district: { $regex: search, $options: "i" } },
//         { tags:     { $in: [new RegExp(search, "i")] } },
//       ];
//     }

//     const skip = (Number(page) - 1) * Number(limit);

//     const [sites, total] = await Promise.all([
//       Heritage.find(filter)
//         .sort(sort)
//         .skip(skip)
//         .limit(Number(limit))
//         .select("-description -scenes"), // keep response light for cards
//       Heritage.countDocuments(filter),
//     ]);

//     res.status(200).json({
//       sites,
//       total,
//       page: Number(page),
//       totalPages: Math.ceil(total / Number(limit)),
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // ── GET /api/heritage/:id ────────────────────────────────────────────────────
// // Used by Modal.js — full site details
// exports.getSiteById = async (req, res) => {
//   try {
//     const site = await Heritage.findById(req.params.id).populate("relatedSites", "name thumbnail state type avgRating");
//     if (!site) return res.status(404).json({ message: "Site not found." });
//     res.status(200).json({ site });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // ── GET /api/heritage/slug/:slug ─────────────────────────────────────────────
// exports.getSiteBySlug = async (req, res) => {
//   try {
//     const site = await Heritage.findOne({ slug: req.params.slug }).populate("relatedSites", "name thumbnail state type");
//     if (!site) return res.status(404).json({ message: "Site not found." });
//     res.status(200).json({ site });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // ── GET /api/heritage/recommendations/:id ────────────────────────────────────
// // Used by Recommendations.js component
// exports.getRecommendations = async (req, res) => {
//   try {
//     const site = await Heritage.findById(req.params.id);
//     if (!site) return res.status(404).json({ message: "Site not found." });

//     // Return same-type sites in the same state, exclude current
//     const recommendations = await Heritage.find({
//       _id:   { $ne: site._id },
//       $or:   [{ state: site.state }, { type: site.type }],
//     })
//       .limit(6)
//       .select("name thumbnail state type avgRating totalReviews unesco");

//     res.status(200).json({ recommendations });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // ── POST /api/heritage  (admin only) ─────────────────────────────────────────
// exports.createSite = async (req, res) => {
//   try {
//     const site = await Heritage.create(req.body);
//     res.status(201).json({ site });
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// };

// // ── PATCH /api/heritage/:id  (admin only) ────────────────────────────────────
// exports.updateSite = async (req, res) => {
//   try {
//     const site = await Heritage.findByIdAndUpdate(req.params.id, req.body, {
//       new: true, runValidators: true,
//     });
//     if (!site) return res.status(404).json({ message: "Site not found." });
//     res.status(200).json({ site });
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// };

// // ── DELETE /api/heritage/:id  (admin only) ───────────────────────────────────
// exports.deleteSite = async (req, res) => {
//   try {
//     const site = await Heritage.findByIdAndDelete(req.params.id);
//     if (!site) return res.status(404).json({ message: "Site not found." });
//     res.status(200).json({ message: "Site deleted." });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

import Heritage from "../models/Heritage.js";

// ============ GET ALL SITES ============
// Supports: ?type=Architectural&state=Rajasthan&search=taj&page=1&limit=12
export const getAllSites = async (req, res) => {
  try {
    const { type, state, unesco, search, page = 1, limit = 12, sort = "-createdAt" } = req.query;

    const filter = {};

    if (type) filter.type = type;
    if (state) filter.state = state;
    if (unesco) filter.unesco = unesco === "true";

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { state: { $regex: search, $options: "i" } },
        { district: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [sites, total] = await Promise.all([
      Heritage.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(Number(limit))
        .select("-description"),
      Heritage.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      sites,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    console.error("❌ Get all sites error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============ GET SITE BY ID ============
export const getSiteById = async (req, res) => {
  try {
    const site = await Heritage.findById(req.params.id).populate(
      "relatedSites",
      "name thumbnail state type avgRating"
    );

    if (!site) {
      return res.status(404).json({
        success: false,
        message: "Site not found",
      });
    }

    res.status(200).json({
      success: true,
      site,
    });
  } catch (error) {
    console.error("❌ Get site by ID error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============ GET SITE BY SLUG ============
export const getSiteBySlug = async (req, res) => {
  try {
    const site = await Heritage.findOne({ slug: req.params.slug }).populate(
      "relatedSites",
      "name thumbnail state type"
    );

    if (!site) {
      return res.status(404).json({
        success: false,
        message: "Site not found",
      });
    }

    res.status(200).json({
      success: true,
      site,
    });
  } catch (error) {
    console.error("❌ Get site by slug error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============ GET RECOMMENDATIONS ============
// Return similar sites in same state or of same type
export const getRecommendations = async (req, res) => {
  try {
    const site = await Heritage.findById(req.params.id);

    if (!site) {
      return res.status(404).json({
        success: false,
        message: "Site not found",
      });
    }

    const recommendations = await Heritage.find({
      _id: { $ne: site._id },
      $or: [{ state: site.state }, { type: site.type }],
    })
      .limit(6)
      .select("name thumbnail state type avgRating totalReviews unesco");

    res.status(200).json({
      success: true,
      recommendations,
    });
  } catch (error) {
    console.error("❌ Get recommendations error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============ CREATE SITE (ADMIN ONLY) ============
export const createSite = async (req, res) => {
  try {
    const site = await Heritage.create(req.body);

    res.status(201).json({
      success: true,
      message: "Site created successfully",
      site,
    });
  } catch (error) {
    console.error("❌ Create site error:", error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ============ UPDATE SITE (ADMIN ONLY) ============
export const updateSite = async (req, res) => {
  try {
    const site = await Heritage.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!site) {
      return res.status(404).json({
        success: false,
        message: "Site not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Site updated successfully",
      site,
    });
  } catch (error) {
    console.error("❌ Update site error:", error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ============ DELETE SITE (ADMIN ONLY) ============
export const deleteSite = async (req, res) => {
  try {
    const site = await Heritage.findByIdAndDelete(req.params.id);

    if (!site) {
      return res.status(404).json({
        success: false,
        message: "Site not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Site deleted successfully",
    });
  } catch (error) {
    console.error("❌ Delete site error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============ DEFAULT EXPORT ============
export default {
  getAllSites,
  getSiteById,
  getSiteBySlug,
  getRecommendations,
  createSite,
  updateSite,
  deleteSite,
};