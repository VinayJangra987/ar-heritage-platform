// ════════════════════════════════════════════════════════════════
// routes/reviewRoutes.js
// ════════════════════════════════════════════════════════════════
const express          = require("express");
const reviewRouter     = express.Router();
const reviewController = require("../controllers/reviewController");
const { protect }      = require("../middleware/authMiddleware");

reviewRouter.get("/:siteId",              reviewController.getReviews);
reviewRouter.post("/:siteId",   protect,  reviewController.addReview);
reviewRouter.delete("/:reviewId", protect, reviewController.deleteReview);
reviewRouter.patch("/:reviewId/like", protect, reviewController.likeReview);

module.exports = reviewRouter;


// ════════════════════════════════════════════════════════════════
// routes/favoriteRoutes.js  — save this as a separate file
// ════════════════════════════════════════════════════════════════
// const express            = require("express");
// const favoriteRouter     = express.Router();
// const favoriteController = require("../controllers/favoriteController");
// const { protect }        = require("../middleware/authMiddleware");
//
// favoriteRouter.get("/",               protect, favoriteController.getFavorites);
// favoriteRouter.post("/toggle/:siteId", protect, favoriteController.toggleFavorite);
//
// module.exports = favoriteRouter;