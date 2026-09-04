import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema(
  {
    reservationCode: {
      type: String,
      required: true,
      unique: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    siteId: {
      type: String,
      required: true,
    },

    siteName: {
      type: String,
      required: true,
      trim: true,
    },

    siteImage: {
      type: String,
      default: "",
    },

    visitDate: {
      type: Date,
      required: true,
    },

    timeSlot: {
      type: String,
      required: true,
    },

    seats: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },

    visitorName: {
      type: String,
      required: true,
      trim: true,
    },

    visitorEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    visitorPhone: {
      type: String,
      default: "",
      trim: true,
    },

    specialRequest: {
      type: String,
      default: "",
      maxlength: 500,
    },

    status: {
      type: String,
      enum: ["confirmed", "cancelled"],
      default: "confirmed",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Reservation", reservationSchema);