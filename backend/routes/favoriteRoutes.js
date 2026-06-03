const express            = require("express");
const router             = express.Router();
const favoriteController = require("../controllers/favoriteController");
const { protect }        = require("../middleware/authMiddleware");

router.get("/",                protect, favoriteController.getFavorites);
router.post("/toggle/:siteId", protect, favoriteController.toggleFavorite);

module.exports = router;