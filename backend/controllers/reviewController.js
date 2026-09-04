// // const Review  = require("../models/Review");
// // const Heritage = require("../models/Heritage");

// // // ── GET /api/reviews/:siteId ─────────────────────────────────────────────────
// // // Used by ReviewSystem.js to load reviews for a site
// // exports.getReviews = async (req, res) => {
// //   try {
// //     const reviews = await Review.find({ site: req.params.siteId })
// //       .populate("user", "name avatar")
// //       .sort("-createdAt");
// //     res.status(200).json({ reviews });
// //   } catch (err) {
// //     res.status(500).json({ message: err.message });
// //   }
// // };

// // // ── POST /api/reviews/:siteId ────────────────────────────────────────────────
// // // User submits a review — protected route
// // exports.addReview = async (req, res) => {
// //   try {
// //     const { rating, title, comment, visitedViaAR, visitedViaVirtualTour } = req.body;

// //     // Check site exists
// //     const site = await Heritage.findById(req.params.siteId);
// //     if (!site) return res.status(404).json({ message: "Heritage site not found." });

// //     // Check if user already reviewed this site
// //     const existing = await Review.findOne({ site: req.params.siteId, user: req.user._id });
// //     if (existing) return res.status(400).json({ message: "You have already reviewed this site." });

// //     const review = await Review.create({
// //       site:    req.params.siteId,
// //       user:    req.user._id,
// //       rating,
// //       title,
// //       comment,
// //       visitedViaAR:         visitedViaAR || false,
// //       visitedViaVirtualTour: visitedViaVirtualTour || false,
// //     });

// //     await review.populate("user", "name avatar");
// //     res.status(201).json({ review });
// //   } catch (err) {
// //     res.status(400).json({ message: err.message });
// //   }
// // };

// // // ── DELETE /api/reviews/:reviewId ────────────────────────────────────────────
// // // User deletes own review
// // exports.deleteReview = async (req, res) => {
// //   try {
// //     const review = await Review.findById(req.params.reviewId);
// //     if (!review) return res.status(404).json({ message: "Review not found." });

// //     // Only the author or admin can delete
// //     if (review.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
// //       return res.status(403).json({ message: "Not authorized to delete this review." });
// //     }

// //     const siteId = review.site;
// //     await review.deleteOne();

// //     // Recalculate heritage rating
// //     const stats = await Review.aggregate([
// //       { $match: { site: siteId } },
// //       { $group: { _id: "$site", avg: { $avg: "$rating" }, count: { $sum: 1 } } },
// //     ]);
// //     await Heritage.findByIdAndUpdate(siteId, {
// //       avgRating:    stats.length ? Math.round(stats[0].avg * 10) / 10 : 0,
// //       totalReviews: stats.length ? stats[0].count : 0,
// //     });

// //     res.status(200).json({ message: "Review deleted." });
// //   } catch (err) {
// //     res.status(500).json({ message: err.message });
// //   }
// // };

// // // ── PATCH /api/reviews/:reviewId/like ───────────────────────────────────────
// // exports.likeReview = async (req, res) => {
// //   try {
// //     const review = await Review.findById(req.params.reviewId);
// //     if (!review) return res.status(404).json({ message: "Review not found." });

// //     const alreadyLiked = review.likes.includes(req.user._id);
// //     if (alreadyLiked) {
// //       review.likes.pull(req.user._id);
// //     } else {
// //       review.likes.push(req.user._id);
// //     }
// //     await review.save();
// //     res.status(200).json({ likes: review.likes.length, liked: !alreadyLiked });
// //   } catch (err) {
// //     res.status(500).json({ message: err.message });
// //   }
// // };


// import Review from "../models/Review.js";
// import Heritage from "../models/Heritage.js";

// // ============ GET REVIEWS FOR A SITE ============
// export const getReviews = async (req, res) => {
//   try {
//     const reviews = await Review.find({ site: req.params.siteId })
//       .populate("user", "name avatar")
//       .sort("-createdAt");

//     res.status(200).json({
//       success: true,
//       reviews,
//     });
//   } catch (error) {
//     console.error("❌ Get reviews error:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // ============ ADD REVIEW ============
// export const addReview = async (req, res) => {
//   try {
//     const { rating, title, comment, visitedViaAR, visitedViaVirtualTour } = req.body;

//     // Check if site exists
//     const site = await Heritage.findById(req.params.siteId);
//     if (!site) {
//       return res.status(404).json({
//         success: false,
//         message: "Heritage site not found",
//       });
//     }

//     // Check if user already reviewed this site
//     const existing = await Review.findOne({
//       site: req.params.siteId,
//       user: req.user._id,
//     });

//     if (existing) {
//       return res.status(400).json({
//         success: false,
//         message: "You have already reviewed this site",
//       });
//     }

//     const review = await Review.create({
//       site: req.params.siteId,
//       user: req.user._id,
//       rating,
//       title,
//       comment,
//       visitedViaAR: visitedViaAR || false,
//       visitedViaVirtualTour: visitedViaVirtualTour || false,
//     });

//     await review.populate("user", "name avatar");

//     res.status(201).json({
//       success: true,
//       message: "Review added successfully",
//       review,
//     });
//   } catch (error) {
//     console.error("❌ Add review error:", error);
//     res.status(400).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // ============ DELETE REVIEW ============
// export const deleteReview = async (req, res) => {
//   try {
//     const review = await Review.findById(req.params.reviewId);

//     if (!review) {
//       return res.status(404).json({
//         success: false,
//         message: "Review not found",
//       });
//     }

//     // Only author or admin can delete
//     if (review.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
//       return res.status(403).json({
//         success: false,
//         message: "Not authorized to delete this review",
//       });
//     }

//     const siteId = review.site;
//     await review.deleteOne();

//     // Recalculate site rating
//     const stats = await Review.aggregate([
//       { $match: { site: siteId } },
//       {
//         $group: {
//           _id: "$site",
//           avg: { $avg: "$rating" },
//           count: { $sum: 1 },
//         },
//       },
//     ]);

//     await Heritage.findByIdAndUpdate(siteId, {
//       avgRating: stats.length ? Math.round(stats[0].avg * 10) / 10 : 0,
//       totalReviews: stats.length ? stats[0].count : 0,
//     });

//     res.status(200).json({
//       success: true,
//       message: "Review deleted successfully",
//     });
//   } catch (error) {
//     console.error("❌ Delete review error:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // ============ LIKE REVIEW ============
// export const likeReview = async (req, res) => {
//   try {
//     const review = await Review.findById(req.params.reviewId);

//     if (!review) {
//       return res.status(404).json({
//         success: false,
//         message: "Review not found",
//       });
//     }

//     const alreadyLiked = review.likes.includes(req.user._id);

//     if (alreadyLiked) {
//       review.likes.pull(req.user._id);
//     } else {
//       review.likes.push(req.user._id);
//     }

//     await review.save();

//     res.status(200).json({
//       success: true,
//       likes: review.likes.length,
//       liked: !alreadyLiked,
//     });
//   } catch (error) {
//     console.error("❌ Like review error:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // ============ DEFAULT EXPORT ============
// export default {
//   getReviews,
//   addReview,
//   deleteReview,
//   likeReview,
// };

import Review from "../models/Review.js";
import Heritage from "../models/Heritage.js";
import cloudinary from "../config/cloudinary.js";

// ============ GET REVIEWS FOR A SITE ============
export const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ site: req.params.siteId })
      .populate("user", "name avatar")
      .sort("-createdAt");

    res.status(200).json({ success: true, reviews });
  } catch (error) {
    console.error("❌ Get reviews error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============ ADD REVIEW (with optional images) ============
export const addReview = async (req, res) => {
  try {
    const { rating, title, comment, visitedViaAR, visitedViaVirtualTour } = req.body;

    const site = await Heritage.findById(req.params.siteId);
    if (!site) {
      return res.status(404).json({ success: false, message: "Heritage site not found" });
    }

    const existing = await Review.findOne({
      site: req.params.siteId,
      user: req.user._id,
    });

    if (existing) {
      return res.status(400).json({ success: false, message: "You have already reviewed this site" });
    }

    // req.files aayega multer se (upload.array("images", 5) middleware ke through)
    const images = (req.files || []).map((file) => ({
      url: file.path,
      publicId: file.filename,
    }));

    const review = await Review.create({
      site: req.params.siteId,
      user: req.user._id,
      rating,
      title,
      comment,
      images,
      visitedViaAR: visitedViaAR === "true" || visitedViaAR === true,
      visitedViaVirtualTour: visitedViaVirtualTour === "true" || visitedViaVirtualTour === true,
    });

    await review.populate("user", "name avatar");

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      review,
    });
  } catch (error) {
    console.error("❌ Add review error:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// ============ DELETE REVIEW (deletes images from cloudinary too) ============
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);

    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    if (review.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized to delete this review" });
    }

    // Cloudinary se images delete karo
    if (review.images?.length) {
      for (const img of review.images) {
        await cloudinary.uploader.destroy(img.publicId).catch(() => {});
      }
    }

    const siteId = review.site;
    await review.deleteOne();

    const stats = await Review.aggregate([
      { $match: { site: siteId } },
      { $group: { _id: "$site", avg: { $avg: "$rating" }, count: { $sum: 1 } } },
    ]);

    await Heritage.findByIdAndUpdate(siteId, {
      avgRating: stats.length ? Math.round(stats[0].avg * 10) / 10 : 0,
      totalReviews: stats.length ? stats[0].count : 0,
    });

    res.status(200).json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    console.error("❌ Delete review error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============ LIKE REVIEW ============
export const likeReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);

    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    const alreadyLiked = review.likes.includes(req.user._id);

    if (alreadyLiked) {
      review.likes.pull(req.user._id);
    } else {
      review.likes.push(req.user._id);
    }

    await review.save();

    res.status(200).json({ success: true, likes: review.likes.length, liked: !alreadyLiked });
  } catch (error) {
    console.error("❌ Like review error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export default { getReviews, addReview, deleteReview, likeReview };