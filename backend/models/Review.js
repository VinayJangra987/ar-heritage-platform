const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    site:    { type: mongoose.Schema.Types.ObjectId, ref: "Heritage", required: true },
    user:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rating:  { type: Number, required: true, min: 1, max: 5 },
    title:   { type: String, trim: true, maxlength: 100 },
    comment: { type: String, trim: true, maxlength: 1000 },
    visitedViaAR:          { type: Boolean, default: false },
    visitedViaVirtualTour: { type: Boolean, default: false },
    likes:    [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    reported: { type: Boolean, default: false },
  },
  { timestamps: true }
);

reviewSchema.index({ site: 1, user: 1 }, { unique: true });

// Mongoose 7+ mein post("save") mein next nahi hota — async directly use karo
reviewSchema.post("save", async function (doc) {
  try {
    const Heritage = mongoose.model("Heritage");
    const stats = await mongoose.model("Review").aggregate([
      { $match: { site: doc.site } },
      { $group: { _id: "$site", avg: { $avg: "$rating" }, count: { $sum: 1 } } },
    ]);
    if (stats.length > 0) {
      await Heritage.findByIdAndUpdate(doc.site, {
        avgRating:    Math.round(stats[0].avg * 10) / 10,
        totalReviews: stats[0].count,
      });
    }
  } catch (err) {
    console.error("Review post-save error:", err.message);
  }
});

module.exports = mongoose.model("Review", reviewSchema);