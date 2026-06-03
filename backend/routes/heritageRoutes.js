const express             = require("express");
const router              = express.Router();
const heritageController  = require("../controllers/heritageController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// Public routes
router.get("/",                          heritageController.getAllSites);
router.get("/slug/:slug",                heritageController.getSiteBySlug);
router.get("/:id",                       heritageController.getSiteById);
router.get("/:id/recommendations",      heritageController.getRecommendations);

// Admin only routes
router.post("/",          protect, adminOnly, heritageController.createSite);
router.patch("/:id",      protect, adminOnly, heritageController.updateSite);
router.delete("/:id",     protect, adminOnly, heritageController.deleteSite);

module.exports = router;