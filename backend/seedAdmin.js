import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    const existing = await User.findOne({ email: "admin@dharohar.com" });

    if (existing) {
      existing.role = "admin";
      existing.isEmailVerified = true; // ✅ YAHI FIX HAI
      existing.isVerified = true;
      await existing.save();
      console.log("✅ Admin updated:", existing.email);
    } else {
      await User.create({
        name: "Admin",
        email: "admin@dharohar.com",
        password: "Admin@123",
        role: "admin",
        isEmailVerified: true, // ✅
        isVerified: true,
      });
      console.log("✅ Admin created");
    }

    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
};

createAdmin();