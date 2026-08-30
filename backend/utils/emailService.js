// utils/emailService.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for port 465
  family: 4,    // force IPv4 — fixes Render ENETUNREACH on IPv6
  auth: {
    user: process.env.EMAIL_USER,      // tumhara email
    pass: process.env.EMAIL_PASS,      // app password (Gmail App Password)
  },
});

exports.sendOTPEmail = async (toEmail, otp, name) => {
  const mailOptions = {
    from: `"Heritage India" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Verify Your Email - Heritage India",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; 
                  background: #1a2332; color: #fff; padding: 32px; border-radius: 12px;">
        <h2 style="color: #e6b84a; margin-bottom: 8px;">Heritage India</h2>
        <p style="color: #aaa; margin-top: 0;">AN HERITAGE PLATFORM — INDIA</p>
        <hr style="border-color: #333; margin: 20px 0;" />
        <p>Namaste <strong>${name}</strong>,</p>
        <p>Apna account verify karne ke liye neeche diya gaya OTP use karein:</p>
        <div style="background: #e6b84a; color: #1a2332; font-size: 32px; 
                    font-weight: bold; text-align: center; padding: 16px; 
                    border-radius: 8px; letter-spacing: 8px; margin: 24px 0;">
          ${otp}
        </div>
        <p style="color: #aaa; font-size: 13px;">
          ⚠️ Yeh OTP <strong>10 minutes</strong> mein expire ho jayega.<br/>
          Agar aapne signup nahi kiya toh is email ko ignore karein.
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};