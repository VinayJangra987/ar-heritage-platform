const mongoose = require("mongoose");

// Used by VirtualTour.js component
const tourSchema = new mongoose.Schema(
  {
    tourId:      { type: String, required: true, unique: true }, // e.g. "taj-mahal"
    title:       { type: String, required: true },
    site:        { type: mongoose.Schema.Types.ObjectId, ref: "Heritage" },
    description: { type: String },
    thumbnail:   { type: String },

    // Panoramic scenes / hotspots in the tour
    scenes: [
      {
        sceneId:     String,
        title:       String,
        description: String,
        panoramaUrl: String, // 360° image URL
        hotspots: [
          {
            yaw:   Number,
            pitch: Number,
            label: String,
            targetScene: String, // links to another sceneId
          },
        ],
      },
    ],

    duration:   { type: Number }, // estimated minutes
    difficulty: { type: String, enum: ["easy", "moderate", "detailed"], default: "easy" },
    isActive:   { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tour", tourSchema);