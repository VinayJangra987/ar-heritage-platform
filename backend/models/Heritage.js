import mongoose from "mongoose";

const heritageSchema = new mongoose.Schema(
  {
    // ── Basic Info ─────────────────────────────────────────────────────────
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
    },

    // ── Location ───────────────────────────────────────────────────────────
    state: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    location: {
      type: {
        type: String,
        default: "Point",
      },
      coordinates: [Number], 
    },

    // ── Classification ─────────────────────────────────────────────────────
    type: {
      type: String,
      enum: ["Architectural", "Archaeological", "Religious", "Natural", "Intangible"],
      required: true,
    },
    era: {
      type: String,
    },
    dynasty: {
      type: String,
    },

    tags: [String],

    // ── UNESCO ─────────────────────────────────────────────────────────────
    unesco: {
      type: Boolean,
      default: false,
    },
    unescoYear: {
      type: Number,
    },
    unescoSerial: {
      type: String,
    },

    // ── Media ──────────────────────────────────────────────────────────────
    images: [String],
    thumbnail: {
      type: String,
    },
    videoUrl: {
      type: String,
    },
    arModelUrl: {
      type: String,
    },

    // ── Content ────────────────────────────────────────────────────────────
    description: {
      type: String,
    },
    shortDesc: {
      type: String,
    },
    highlights: [String],
    visitingHours: {
      type: String,
    },
    entryFee: {
      type: String,
    },
    bestSeason: {
      type: String,
    },

    // ── Ratings ────────────────────────────────────────────────────────────
    avgRating: {
      type: Number,
      default: 0,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },

    // ── Virtual Tour ───────────────────────────────────────────────────────
    hasTour: {
      type: Boolean,
      default: false,
    },
    tourId: {
      type: String,
    },

    // ── Related Sites ──────────────────────────────────────────────────────
    relatedSites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Heritage",
      },
    ],
  },
  { timestamps: true }
);

// Geospatial index for location-based queries
heritageSchema.index({ location: "2dsphere" });

// Text search index
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
    this.slug = this.name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "");
  }
  next();
});

export default mongoose.model("Heritage", heritageSchema);