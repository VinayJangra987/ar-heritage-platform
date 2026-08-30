// // ════════════════════════════════════════════════════════════════
// // routes/reviewRoutes.js
// // ════════════════════════════════════════════════════════════════
// const express          = require("express");
// const reviewRouter     = express.Router();
// const reviewController = require("../controllers/reviewController");
// const { protect }      = require("../middleware/authMiddleware");

// reviewRouter.get("/:siteId",              reviewController.getReviews);
// reviewRouter.post("/:siteId",   protect,  reviewController.addReview);
// reviewRouter.delete("/:reviewId", protect, reviewController.deleteReview);
// reviewRouter.patch("/:reviewId/like", protect, reviewController.likeReview);

// module.exports = reviewRouter;


import express from "express";
import reviewController from "../controllers/reviewController.js";
import { protect } from "../middleware/authMiddleware.js";

const reviewRouter = express.Router();

// ============ GET REVIEWS ============
reviewRouter.get("/:siteId", reviewController.getReviews);

// ============ ADD REVIEW ============
reviewRouter.post("/:siteId", protect, reviewController.addReview);

// ============ DELETE REVIEW ============
reviewRouter.delete("/:reviewId", protect, reviewController.deleteReview);

// ============ LIKE REVIEW ============
reviewRouter.patch("/:reviewId/like", protect, reviewController.likeReview);

export default reviewRouter;