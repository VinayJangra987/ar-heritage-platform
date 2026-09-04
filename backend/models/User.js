import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Enter the valid Email"],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    avatar: {
      type: String,
      default: "",
    },
    favorites: [String],
    arVisits: [
      {
        siteId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Heritage",
        },
        visitedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    tourHistory: [
      {
        tourId: String,
        completedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // ── Email verification ──────────────────────────────────────
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailOTP: {
      type: String,
      select: false,
    },
    emailOTPExpires: {
      type: Date,
      select: false,
    },

    // ── OTP for login/signup ─────────────────────────────────────
    otp: {
      type: String,
      select: false,
    },
    otpExpiry: {
      type: Date,
      select: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },

    // ── 2FA (TOTP) ────────────────────────────────────────────────
    twoFactorSecret: {
      type: String,
      select: false,
    },
    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },
    twoFactorTempSecret: {
      type: String,
      select: false,
    },
      resetOtp: {
      type: String,
      select: false,
    },
    resetOtpExpiry: {
      type: Date,
      select: false,
    },

    // ── Additional fields ────────────────────────────────────────
    bio: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    lastLogin: {
      type: Date,
    },
    badges: [{
  id: String,        // "unesco-hunter", "first-review", "ar-explorer"
  earnedAt: Date
  }],
  streak: { current: Number, longest: Number, lastVisitDate: Date },
  },
  { timestamps: true }
);

// ============ SCHEMA METHODS ============

// Hash password before save
userSchema.pre("save", function (next) {
  if (!this.isModified("password")) return next();

  const salt = bcrypt.genSaltSync(12);
  this.password = bcrypt.hashSync(this.password, salt);
  return next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Get user without sensitive fields
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.emailOTP;
  delete user.emailOTPExpires;
  delete user.otp;
  delete user.otpExpiry;
  delete user.twoFactorSecret;
  delete user.twoFactorTempSecret;
  return user;
};

export default mongoose.model("User", userSchema);