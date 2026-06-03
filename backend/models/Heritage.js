const mongoose = require("mongoose");

const heritageSchema = new mongoose.Schema(
  {
    // ── Basic Info ─────────────────────────────────────────────────────────
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true }, // e.g. "taj-mahal"

    // ── Location — used by MapView.js & NearbySites.js ────────────────────
    state:    { type: String, required: true },
    district: { type: String, required: true },
    address:  { type: String },
    location: {
      type: { type: String, default: "Point" },
      coordinates: [Number], // [longitude, latitude]
    },

    // ── Classification — used by Discovery.js filters ─────────────────────
    type: {
      type: String,
      enum: ["Architectural", "Archaeological", "Religious", "Natural", "Intangible"],
      required: true,
    },
    era:      { type: String }, // e.g. "17th Century CE"
    dynasty:  { type: String }, // e.g. "Mughal"

    tags: [String], // ["marble", "monument", "love"] — used in search

    // ── UNESCO — Discovery.js filter + Modal.js badge ─────────────────────
    unesco:       { type: Boolean, default: false },
    unescoYear:   { type: Number },
    unescoSerial: { type: String },

    // ── Media — Modal.js & SiteCard.js ────────────────────────────────────
    images:      [String],   // array of image URLs
    thumbnail:   { type: String },
    videoUrl:    { type: String },
    arModelUrl:  { type: String }, // 3D model for ARView.js

    // ── Content — Modal.js description panel ──────────────────────────────
    description:   { type: String },
    shortDesc:     { type: String }, // used in SiteCard.js
    highlights:    [String],         // bullet facts shown in DiscoveryTour.js
    visitingHours: { type: String },
    entryFee:      { type: String },
    bestSeason:    { type: String },

    // ── Ratings (aggregated from Review model) ─────────────────────────────
    avgRating:   { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },

    // ── VirtualTour.js ────────────────────────────────────────────────────
    hasTour:  { type: Boolean, default: false },
    tourId:   { type: String }, // matches tourId in VirtualTour component

    // ── Recommendations.js — what to suggest after viewing ────────────────
    relatedSites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Heritage" }],
  },
  { timestamps: true }
);

// Geospatial index — used by NearbySites.js location queries
heritageSchema.index({ location: "2dsphere" });

// Text search index — used by search overlay in App.js
heritageSchema.index({
  name: "text",
  state: "text",
  district: "text",
  tags: "text",
  description: "text",
});

// Auto-generate slug from name
heritageSchema.pre("save", function (next) {
  if (!this.slug) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
  }
  next();
});

module.exports = mongoose.model("Heritage", heritageSchema);