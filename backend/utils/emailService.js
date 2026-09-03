// import { Resend } from "resend";

// const resend = new Resend(process.env.RESEND_API_KEY);

// // ── Send OTP Email (generic, used for signup + password reset) ──
// export const sendOTPEmail = async (email, otp, name, purpose = "verify") => {
//   const subject =
//     purpose === "reset"
//       ? "Password Reset OTP - Bharatiya Dharohar"
//       : "Your OTP - Bharatiya Dharohar";

//   const introLine =
//     purpose === "reset"
//       ? "Your OTP to reset your password is:"
//       : "Your OTP code is:";

//   const { error } = await resend.emails.send({
//     from: "Bharatiya Dharohar <onboarding@resend.dev>",
//     to: email,
//     subject,
//     html: `
//       <div style="font-family:sans-serif;max-width:480px;margin:auto;background:#0D1B2A;color:#F2E8D0;padding:2rem;border-radius:12px;">
//         <h2 style="color:#C9A84C;margin-bottom:0.5rem;">🏛 Bharatiya Dharohar</h2>
//         <p>Hello <strong>${name}</strong>,</p>
//         <p>${introLine}</p>
//         <div style="font-size:2.5rem;font-weight:700;letter-spacing:0.3em;color:#C9A84C;text-align:center;padding:1rem;background:rgba(201,168,76,0.1);border-radius:8px;margin:1rem 0;">
//           ${otp}
//         </div>
//         <p style="color:rgba(242,232,208,0.5);font-size:0.85rem;">This OTP expires in 10 minutes.</p>
//         <p style="color:rgba(242,232,208,0.5);font-size:0.85rem;">If you didn't request this, you can safely ignore this email.</p>
//       </div>
//     `,
//   });

//   if (error) {
//     throw new Error(error.message || "Failed to send email");
//   }
// };

// import { Resend } from "resend";

// const resend = new Resend(process.env.RESEND_API_KEY);

// export const sendOTPEmail = async (
//   email,
//   otp,
//   name,
//   purpose = "verify"
// ) => {
//   try {
//     if (!process.env.RESEND_API_KEY) {
//       throw new Error("RESEND_API_KEY is missing in .env");
//     }

//     console.log("📧 Sending OTP email...");
//     console.log("📨 Recipient:", email);
//     console.log("🎯 Purpose:", purpose);

//     const subject =
//       purpose === "reset"
//         ? "Password Reset OTP - Bharatiya Dharohar"
//         : "Your OTP - Bharatiya Dharohar";

//     const introLine =
//       purpose === "reset"
//         ? "Use the following OTP to reset your password:"
//         : "Use the following OTP to verify your email:";

//     const result = await resend.emails.send({
//       from: "Bharatiya Dharohar <onboarding@resend.dev>",
//       to: [email],
//       subject,
//       html: `
//         <div style="
//           font-family: Arial, sans-serif;
//           max-width: 480px;
//           margin: auto;
//           padding: 30px;
//           background: #0D1B2A;
//           color: #F2E8D0;
//           border-radius: 12px;
//         ">
//           <h2 style="color: #C9A84C;">
//             Bharatiya Dharohar
//           </h2>

//           <p>Hello <strong>${name || "User"}</strong>,</p>

//           <p>${introLine}</p>

//           <div style="
//             font-size: 32px;
//             font-weight: bold;
//             letter-spacing: 8px;
//             color: #C9A84C;
//             text-align: center;
//             padding: 20px;
//             margin: 20px 0;
//             background: rgba(201,168,76,0.1);
//             border-radius: 8px;
//           ">
//             ${otp}
//           </div>

//           <p>This OTP expires in 10 minutes.</p>

//           <p style="color: #aaa; font-size: 13px;">
//             If you did not request this, you can safely ignore this email.
//           </p>
//         </div>
//       `,
//     });

//     console.log("📬 RESEND FULL RESPONSE:", result);

//     if (result.error) {
//       console.error("❌ RESEND API ERROR:", result.error);

//       throw new Error(
//         result.error.message || "Resend failed to send email"
//       );
//     }

//     console.log("✅ Email sent successfully");

//     return result;

//   } catch (error) {
//     console.error("❌ RESEND EMAIL ERROR:");
//     console.error(error);

//     throw error;
//   }
// };


// import nodemailer from "nodemailer";

// // ── Gmail SMTP transporter ──
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.GMAIL_USER,          // your gmail address
//     pass: process.env.GMAIL_APP_PASSWORD,  // 16-digit App Password
//   },
// });

// // ── Send OTP Email (generic, used for signup + password reset) ──
// export const sendOTPEmail = async (
//   email,
//   otp,
//   name,
//   purpose = "verify"
// ) => {
//   try {
//     if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
//       throw new Error("GMAIL_USER or GMAIL_APP_PASSWORD is missing in .env");
//     }

//     console.log("📧 Sending OTP email...");
//     console.log("📨 Recipient:", email);
//     console.log("🎯 Purpose:", purpose);

//     const subject =
//       purpose === "reset"
//         ? "Password Reset OTP - Bharatiya Dharohar"
//         : "Your OTP - Bharatiya Dharohar";

//     const introLine =
//       purpose === "reset"
//         ? "Use the following OTP to reset your password:"
//         : "Use the following OTP to verify your email:";

//     const result = await transporter.sendMail({
//       from: `"Bharatiya Dharohar" <${process.env.GMAIL_USER}>`,
//       to: email,
//       subject,
//       html: `
//         <div style="
//           font-family: Arial, sans-serif;
//           max-width: 480px;
//           margin: auto;
//           padding: 30px;
//           background: #0D1B2A;
//           color: #F2E8D0;
//           border-radius: 12px;
//         ">
//           <h2 style="color: #C9A84C;">
//             Bharatiya Dharohar
//           </h2>

//           <p>Hello <strong>${name || "User"}</strong>,</p>

//           <p>${introLine}</p>

//           <div style="
//             font-size: 32px;
//             font-weight: bold;
//             letter-spacing: 8px;
//             color: #C9A84C;
//             text-align: center;
//             padding: 20px;
//             margin: 20px 0;
//             background: rgba(201,168,76,0.1);
//             border-radius: 8px;
//           ">
//             ${otp}
//           </div>

//           <p>This OTP expires in 10 minutes.</p>

//           <p style="color: #aaa; font-size: 13px;">
//             If you did not request this, you can safely ignore this email.
//           </p>
//         </div>
//       `,
//     });

//     console.log("📬 GMAIL SMTP RESPONSE:", result);
//     console.log("✅ Email sent successfully");

//     return result;

//   } catch (error) {
//     console.error("❌ EMAIL SEND ERROR:");
//     console.error(error);

//     throw error;
//   }
// };

// console.log("🚀 USING NODEMAILER GMAIL EMAIL SERVICE");
// console.log("📧 EMAIL_USER exists:", !!process.env.EMAIL_USER);
// console.log(
//   "🔐 EMAIL_PASS exists:",
//   !!process.env.EMAIL_PASS
// );

// import nodemailer from "nodemailer";
// import dns from "node:dns";

// dns.setDefaultResultOrder("ipv4first");

// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 587,
//   secure: false,

//   family: 4,

//   auth: {
//     user: process.env.GMAIL_USER,
//     pass: process.env.GMAIL_APP_PASSWORD,
//   },

//   connectionTimeout: 20000,
//   greetingTimeout: 20000,
//   socketTimeout: 30000,
// });

// export const sendOTPEmail = async (
//   email,
//   otp,
//   name,
//   purpose = "verify"
// ) => {
//   try {
//     console.log("📧 SMTP CONFIG:");
//     console.log("Host: smtp.gmail.com");
//     console.log("Port: 587");
//     console.log("Family: IPv4");

//     const subject =
//       purpose === "reset"
//         ? "Password Reset OTP - Bharatiya Dharohar"
//         : "Your OTP - Bharatiya Dharohar";

//     const introLine =
//       purpose === "reset"
//         ? "Use the following OTP to reset your password:"
//         : "Use the following OTP to verify your email:";

//     const result = await transporter.sendMail({
//       from: `"Bharatiya Dharohar" <${process.env.GMAIL_USER}>`,
//       to: email,
//       subject,
//       html: `
//         <div style="font-family: Arial, sans-serif; padding: 20px;">
//           <h2>🏛 Bharatiya Dharohar</h2>

//           <p>Hello <strong>${name || "User"}</strong>,</p>

//           <p>${introLine}</p>

//           <h1 style="letter-spacing: 8px;">
//             ${otp}
//           </h1>

//           <p>This OTP expires in 10 minutes.</p>
//         </div>
//       `,
//     });

//     console.log("✅ EMAIL SENT:", result.messageId);

//     return result;
//   } catch (error) {
//     console.error("❌ EMAIL ERROR:", error);

//     throw error;
//   }
// };


import Mailjet from "node-mailjet";

const mailjet = new Mailjet({
  apiKey: process.env.MAILJET_API_KEY,
  apiSecret: process.env.MAILJET_SECRET_KEY,
});

export const sendOTPEmail = async (
  email,
  otp,
  name,
  purpose = "verify"
) => {
  try {
    // Environment variable checks
    if (!process.env.MAILJET_API_KEY) {
      throw new Error("MAILJET_API_KEY is missing");
    }

    if (!process.env.MAILJET_SECRET_KEY) {
      throw new Error("MAILJET_SECRET_KEY is missing");
    }

    if (!process.env.MAILJET_SENDER_EMAIL) {
      throw new Error("MAILJET_SENDER_EMAIL is missing");
    }

    console.log("📧 Sending OTP via Mailjet API...");
    console.log("📨 Recipient:", email);

    const subject =
      purpose === "reset"
        ? "Password Reset OTP - Bharatiya Dharohar"
        : "Your OTP - Bharatiya Dharohar";

    const introLine =
      purpose === "reset"
        ? "Use the following OTP to reset your password:"
        : "Use the following OTP to verify your email:";

    const request = mailjet
      .post("send", { version: "v3.1" })
      .request({
        Messages: [
          {
            From: {
              Email: process.env.MAILJET_SENDER_EMAIL,
              Name:
                process.env.MAILJET_SENDER_NAME ||
                "Bharatiya Dharohar",
            },

            To: [
              {
                Email: email,
                Name: name || "User",
              },
            ],

            Subject: subject,

            TextPart: `${introLine}

Your OTP is: ${otp}

This OTP expires in 10 minutes.

If you did not request this, you can safely ignore this email.`,

            HTMLPart: `
              <div style="
                font-family: Arial, sans-serif;
                max-width: 480px;
                margin: auto;
                padding: 30px;
                background: #0D1B2A;
                color: #F2E8D0;
                border-radius: 12px;
              ">
                <h2 style="color: #C9A84C;">
                  🏛 Bharatiya Dharohar
                </h2>

                <p>Hello <strong>${name || "User"}</strong>,</p>

                <p>${introLine}</p>

                <div style="
                  font-size: 32px;
                  font-weight: bold;
                  letter-spacing: 8px;
                  color: #C9A84C;
                  text-align: center;
                  padding: 20px;
                  margin: 20px 0;
                  background: rgba(201, 168, 76, 0.1);
                  border-radius: 8px;
                ">
                  ${otp}
                </div>

                <p>This OTP expires in 10 minutes.</p>

                <p style="
                  color: #aaa;
                  font-size: 13px;
                ">
                  If you did not request this, you can safely ignore this email.
                </p>
              </div>
            `,
          },
        ],
      });

    console.log("📬 MAILJET RESPONSE:", request.body);

    // Mailjet response validation
    const message = request.body.Messages?.[0];

    if (!message || message.Status !== "success") {
      throw new Error(
        message?.Errors?.[0]?.ErrorMessage ||
        "Mailjet failed to send email"
      );
    }

    console.log("✅ OTP EMAIL SENT SUCCESSFULLY");

    return request.body;

  } catch (error) {
    console.error("❌ MAILJET EMAIL ERROR:");

    console.error(
      error.response?.data ||
      error.body ||
      error.message ||
      error
    );

    throw error;
  }
};