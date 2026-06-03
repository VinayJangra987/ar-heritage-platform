const User    = require("../models/User");
const Heritage = require("../models/Heritage");

// ── GET /api/favorites ───────────────────────────────────────────────────────
// Used by FavoritesSection.js — get logged in user's saved sites
exports.getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate(
      "favorites",
      "name thumbnail state district type avgRating totalReviews unesco hasTour"
    );
    res.status(200).json({ favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── POST /api/favorites/toggle/:siteId ───────────────────────────────────────
// Used by toggleFavorite in AuthContext.js — add or remove from favorites
exports.toggleFavorite = async (req, res) => {
  try {
    const { siteId } = req.params;

    const site = await Heritage.findById(siteId);
    if (!site) return res.status(404).json({ message: "Heritage site not found." });

    const user = await User.findById(req.user._id);
    const isFav = user.favorites.includes(siteId);

    if (isFav) {
      user.favorites.pull(siteId);
    } else {
      user.favorites.push(siteId);
    }

    await user.save();

    res.status(200).json({
      isFavorite: !isFav,
      favorites: user.favorites,
      message: isFav ? "Removed from favorites." : "Added to favorites.",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};