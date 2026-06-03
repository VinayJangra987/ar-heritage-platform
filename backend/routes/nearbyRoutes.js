const express          = require("express");
const router           = express.Router();
const nearbyController = require("../controllers/nearbyController");

// GET /api/nearby?lat=28.61&lng=77.20&radius=50
router.get("/", nearbyController.getNearbySites);

module.exports = router;