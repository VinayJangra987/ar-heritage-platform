const express        = require("express");
const router         = express.Router();
const tourController = require("../controllers/tourController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/",                          tourController.getAllTours);
router.get("/:tourId",                   tourController.getTourById);
router.post("/:tourId/complete", protect, tourController.completeTour);
router.post("/",   protect, adminOnly,   tourController.createTour);

module.exports = router;