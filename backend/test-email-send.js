// backend/test-email-send.js
// Chalane ke liye: node test-email-send.js
// Ye sirf check karega ki tumhara EMAIL_USER/EMAIL_PASS se mail bhej sakte ho ya nahi

import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.sendMail(
  {
    from: `"Test" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER, // khud ko bhejo test ke liye
    subject: "Test Email — Bharatiya Dharohar",
    text: "Agar ye email aaya, matlab EMAIL_USER/EMAIL_PASS sahi hai.",
  },
  (err, info) => {
    if (err) {
      console.error("❌ Email FAILED:", err.message);
    } else {
      console.log("✅ Email SENT:", info.response);
    }
  }
);