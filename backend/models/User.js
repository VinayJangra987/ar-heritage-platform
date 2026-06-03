const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true, trim: true, minlength: 2, maxlength: 50 },
    email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    avatar:   { type: String, default: "" },
    favorites:   [{ type: mongoose.Schema.Types.ObjectId, ref: "Heritage" }],
    arVisits:    [{ siteId: { type: mongoose.Schema.Types.ObjectId, ref: "Heritage" }, visitedAt: { type: Date, default: Date.now } }],
    tourHistory: [{ tourId: String, completedAt: { type: Date, default: Date.now } }],
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true }
);

// SYNC version — no next() issues
userSchema.pre("save", function (next) {
  if (!this.isModified("password")) return next();
  const salt = bcrypt.genSaltSync(12);
  this.password = bcrypt.hashSync(this.password, salt);
  return next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);