import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// ── Send OTP Email (generic, used for signup + password reset) ──
export const sendOTPEmail = async (email, otp, name, purpose = "verify") => {
  const subject =
    purpose === "reset"
      ? "Password Reset OTP - Bharatiya Dharohar"
      : "Your OTP - Bharatiya Dharohar";

  const introLine =
    purpose === "reset"
      ? "Your OTP to reset your password is:"
      : "Your OTP code is:";

  const { error } = await resend.emails.send({
    from: "Bharatiya Dharohar <onboarding@resend.dev>",
    to: email,
    subject,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:auto;background:#0D1B2A;color:#F2E8D0;padding:2rem;border-radius:12px;">
        <h2 style="color:#C9A84C;margin-bottom:0.5rem;">🏛 Bharatiya Dharohar</h2>
        <p>Hello <strong>${name}</strong>,</p>
        <p>${introLine}</p>
        <div style="font-size:2.5rem;font-weight:700;letter-spacing:0.3em;color:#C9A84C;text-align:center;padding:1rem;background:rgba(201,168,76,0.1);border-radius:8px;margin:1rem 0;">
          ${otp}
        </div>
        <p style="color:rgba(242,232,208,0.5);font-size:0.85rem;">This OTP expires in 10 minutes.</p>
        <p style="color:rgba(242,232,208,0.5);font-size:0.85rem;">If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
  });

  if (error) {
    throw new Error(error.message || "Failed to send email");
  }
};