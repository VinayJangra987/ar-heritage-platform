// const User    = require("../models/User");
// const Heritage = require("../models/Heritage");

// // ── GET /api/favorites ───────────────────────────────────────────────────────
// // Used by FavoritesSection.js — get logged in user's saved sites
// exports.getFavorites = async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id).populate(
//       "favorites",
//       "name thumbnail state district type avgRating totalReviews unesco hasTour"
//     );
//     res.status(200).json({ favorites: user.favorites });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // ── POST /api/favorites/toggle/:siteId ───────────────────────────────────────
// // Used by toggleFavorite in AuthContext.js — add or remove from favorites
// exports.toggleFavorite = async (req, res) => {
//   try {
//     const { siteId } = req.params;

//   //  const site = await Heritage.findOne({ id: siteId });
//   //   if (!site) return res.status(404).json({ message: "Heritage site not found." });

//     const user = await User.findById(req.user._id);
//     const isFav = user.favorites.includes(siteId);

//     if (isFav) {
//       user.favorites.pull(siteId);
//     } else {
//       user.favorites.push(siteId);
//     }

//     await user.save();

//     res.status(200).json({
//       isFavorite: !isFav,
//       favorites: user.favorites,
//       message: isFav ? "Removed from favorites." : "Added to favorites.",
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

import User from "../models/User.js";
import Heritage from "../models/Heritage.js";

// ============ GET ALL FAVORITES ============
export const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate(
      "favorites",
      "name thumbnail state district type avgRating totalReviews unesco hasTour"
    );

    res.status(200).json({
      success: true,
      favorites: user.favorites || [],
    });
  } catch (error) {
    console.error("❌ Get favorites error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============ TOGGLE FAVORITE ============
export const toggleFavorite = async (req, res) => {
  try {
    const { siteId } = req.params;

    const user = await User.findById(req.user._id);
    const isFav = user.favorites.includes(siteId);

    if (isFav) {
      user.favorites.pull(siteId);
    } else {
      user.favorites.push(siteId);
    }

    await user.save();

    res.status(200).json({
      success: true,
      isFavorite: !isFav,
      favorites: user.favorites,
      message: isFav ? "Removed from favorites" : "Added to favorites",
    });
  } catch (error) {
    console.error("❌ Toggle favorite error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============ ADD FAVORITE ============
export const add = async (req, res) => {
  try {
    const { siteId } = req.body;

    // Check if site exists
    const site = await Heritage.findById(siteId);
    if (!site) {
      return res.status(404).json({
        success: false,
        message: "Site not found",
      });
    }

    const user = await User.findById(req.user._id);

    if (user.favorites.includes(siteId)) {
      return res.status(400).json({
        success: false,
        message: "Already in favorites",
      });
    }

    user.favorites.push(siteId);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Added to favorites",
      favorites: user.favorites,
    });
  } catch (error) {
    console.error("❌ Add favorite error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============ REMOVE FAVORITE ============
export const remove = async (req, res) => {
  try {
    const { siteId } = req.params;

    const user = await User.findById(req.user._id);

    if (!user.favorites.includes(siteId)) {
      return res.status(400).json({
        success: false,
        message: "Not in favorites",
      });
    }

    user.favorites.pull(siteId);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Removed from favorites",
      favorites: user.favorites,
    });
  } catch (error) {
    console.error("❌ Remove favorite error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============ DEFAULT EXPORT ============
export default {
  getFavorites,
  toggleFavorite,
  add,
  remove,
};