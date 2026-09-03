import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function AuthModal({ onClose, onForgotPassword, initialMode = "login" }) {
  const [isLogin, setIsLogin] = useState(initialMode !== "signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ── OTP step ──
  const [step, setStep] = useState("form"); // "form" | "otp" | "2fa"
  const [otp, setOtp] = useState("");
  const [pendingEmail, setPendingEmail] = useState("");
  const [resendMsg, setResendMsg] = useState("");
  const [resendLoading, setResendLoading] = useState(false);

  // ── 2FA step ──
  const [twoFACode, setTwoFACode] = useState("");
  const [pendingPassword, setPendingPassword] = useState("");

  const { login, signup, verifyOTP, resendOTP } = useAuth();

  // App.js jab authMode change kare (Sign In vs Sign Up button), modal usko reflect kare
  useEffect(() => {
    setIsLogin(initialMode !== "signup");
  }, [initialMode]);

  // ── Main form submit (login / signup) ──
  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    try {
      let result;

      if (isLogin) {
        result = await login(email, password);
      } else {
        result = await signup(name, email, password, confirmPassword);
      }

      if (result?.requiresOTP) {
        setPendingEmail(result.email || email);
        setStep("otp");
        setError("");
      } else if (result?.requires2FA) {
        // Password sahi hai — 2FA code maango
        setPendingEmail(result.email || email);
        setPendingPassword(password);
        setStep("2fa");
        setError("");
      } else if (result?.success) {
        onClose();
      } else {
        setError(result?.message || "Error!");
      }
    } catch (err) {
      setError(err.message || "Something went wrong!");
    }

    setLoading(false);
  };

  // ── 2FA verify (login ko dobara call karo, ab code ke saath) ──
  const handleVerify2FA = async () => {
    if (twoFACode.length !== 6) {
      setError("Please enter a 6-digit code.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const result = await login(pendingEmail, pendingPassword, twoFACode);
      if (result?.success) {
        onClose();
      } else {
        setError(result?.message || "Invalid code.");
      }
    } catch (err) {
      setError(err.message || "Something went wrong.");
    }

    setLoading(false);
  };

  // ── OTP verify ──
  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      setError("Please enter a 6-digit OTP.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const result = await verifyOTP(pendingEmail, otp);
      if (result?.success) {
        onClose();
      } else {
        setError(result?.message || "Invalid OTP.");
      }
    } catch (err) {
      setError(err.message || "Something went wrong.");
    }

    setLoading(false);
  };

  // ── Resend OTP ──
  const handleResend = async () => {
    setResendMsg("");
    setError("");
    setResendLoading(true);
    try {
      const data = await resendOTP(pendingEmail);
      setResendMsg(data?.message || "OTP has been sent.");
    } catch {
      setError("Resend failed.");
    }
    setResendLoading(false);
  };

  // ── 2FA Screen ──
  if (step === "2fa") {
    return (
      <div style={overlayStyle}>
        <div style={cardStyle}>
          <h2 style={titleStyle}>Enter 2FA Code</h2>
          <p style={{ color: "rgba(242,232,208,0.6)", fontSize: "0.82rem", marginBottom: "1.5rem", lineHeight: 1.6 }}>
            Enter the 6-digit code from your authenticator app.
          </p>

          <input
            placeholder="000000"
            value={twoFACode}
            onChange={(e) => setTwoFACode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            maxLength={6}
            style={{ ...inputStyle, textAlign: "center", fontSize: "1.4rem", letterSpacing: "0.5em" }}
          />

          {error && <p style={errorStyle}>{error}</p>}

          <button onClick={handleVerify2FA} disabled={loading} style={btnStyle(loading)}>
            {loading ? "Verifying..." : "VERIFY"}
          </button>

          <p
            onClick={() => { setStep("form"); setTwoFACode(""); setError(""); }}
            style={{ color: "rgba(242,232,208,0.4)", fontSize: "0.72rem", textAlign: "center", marginTop: "1rem", cursor: "pointer" }}
          >
            ← Go back
          </p>

          <button onClick={onClose} style={closeBtn}>✕</button>
        </div>
      </div>
    );
  }

  // ── OTP Screen ──
  if (step === "otp") {
    return (
      <div style={overlayStyle}>
        <div style={cardStyle}>
          <h2 style={titleStyle}>Verify The Email</h2>
          <p style={{ color: "rgba(242,232,208,0.6)", fontSize: "0.82rem", marginBottom: "1.5rem", lineHeight: 1.6 }}>
            <span style={{ color: "#C9A84C" }}>{pendingEmail}</span> The 6-digit OTP is send to your Email.
          </p>

          <input
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
            maxLength={6}
            style={{ ...inputStyle, textAlign: "center", fontSize: "1.4rem", letterSpacing: "0.5em" }}
          />

          {error && <p style={errorStyle}>{error}</p>}
          {resendMsg && <p style={{ color: "#4CAF50", fontSize: "0.8rem", marginBottom: "1rem" }}>{resendMsg}</p>}

          <button onClick={handleVerifyOTP} disabled={loading} style={btnStyle(loading)}>
            {loading ? "Verifying..." : "VERIFY"}
          </button>

          <p style={{ color: "rgba(242,232,208,0.5)", fontSize: "0.75rem", textAlign: "center", marginTop: "1rem" }}>
            Didn't receive the OTP?{" "}
            <span
              onClick={resendLoading ? undefined : handleResend}
              style={{ color: "#C9A84C", cursor: resendLoading ? "default" : "pointer", opacity: resendLoading ? 0.5 : 1 }}
            >
              {resendLoading ? "Sending..." : "Resend"}
            </span>
          </p>

          <p
            onClick={() => { setStep("form"); setOtp(""); setError(""); setResendMsg(""); }}
            style={{ color: "rgba(242,232,208,0.4)", fontSize: "0.72rem", textAlign: "center", marginTop: "0.5rem", cursor: "pointer" }}
          >
            ← Go back
          </p>

          <button onClick={onClose} style={closeBtn}>✕</button>
        </div>
      </div>
    );
  }

  // ── Login / Signup Screen ──
  return (
    <div style={overlayStyle}>
      <div style={cardStyle}>
        <h2 style={titleStyle}>{isLogin ? "Login" : "Sign Up"}</h2>

        {!isLogin && (
          <input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={inputStyle}
          />
        )}
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />

        {!isLogin && (
          <input
            placeholder="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={inputStyle}
          />
        )}

        {error && <p style={errorStyle}>{error}</p>}

        <button onClick={handleSubmit} disabled={loading} style={btnStyle(loading)}>
          {loading ? "Please wait..." : isLogin ? "LOGIN" : "SIGN UP"}
        </button>

        {isLogin && onForgotPassword && (
          <p
            onClick={onForgotPassword}
            style={{ color: "rgba(242,232,208,0.45)", fontSize: "0.72rem", textAlign: "center", marginTop: "0.85rem", cursor: "pointer" }}
          >
            Forgot your password? <span style={{ color: "#C9A84C" }}>Reset Password</span>
          </p>
        )}

        <p style={{ color: "rgba(242,232,208,0.5)", fontSize: "0.75rem", textAlign: "center", marginTop: "1rem" }}>
          {isLogin ? "No account? " : "Already have one? "}
          <span
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
              setName("");
              setEmail("");
              setPassword("");
              setConfirmPassword("");
            }}
            style={{ color: "#C9A84C", cursor: "pointer" }}
          >
            {isLogin ? "Sign Up" : "Login"}
          </span>
        </p>

        <button onClick={onClose} style={closeBtn}>✕</button>
      </div>
    </div>
  );
}

// ── Styles ──
const overlayStyle = {
  position: "fixed", inset: 0, zIndex: 9999,
  background: "rgba(0,0,0,0.7)",
  display: "flex", alignItems: "center", justifyContent: "center",
};

const cardStyle = {
  position: "relative",
  background: "#0D1B2A", border: "1px solid rgba(201,168,76,0.3)",
  borderRadius: "16px", padding: "2rem", width: "360px",
};

const titleStyle = {
  color: "#C9A84C", fontFamily: "Cormorant Garamond", marginBottom: "1.5rem",
};

const inputStyle = {
  width: "100%", padding: "0.75rem 1rem",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(201,168,76,0.2)",
  borderRadius: "8px", color: "#F2E8D0",
  fontFamily: "Poppins", fontSize: "0.85rem",
  marginBottom: "1rem", outline: "none",
  boxSizing: "border-box",
};

const btnStyle = (loading) => ({
  width: "100%", padding: "0.85rem",
  background: "linear-gradient(135deg, #C9A84C, #E8C96A)",
  color: "#0D1B2A", border: "none", borderRadius: "8px",
  fontFamily: "Space Mono", fontWeight: 700,
  fontSize: "0.7rem", letterSpacing: "0.1em",
  cursor: loading ? "not-allowed" : "pointer",
  opacity: loading ? 0.6 : 1,
});

const errorStyle = {
  color: "#E24B4A", fontSize: "0.8rem", marginBottom: "1rem",
};

const closeBtn = {
  position: "absolute", top: "1rem", right: "1rem",
  background: "none", border: "none",
  color: "rgba(242,232,208,0.5)", cursor: "pointer", fontSize: "1.2rem",
};