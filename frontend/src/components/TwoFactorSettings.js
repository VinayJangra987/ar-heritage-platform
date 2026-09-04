import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function TwoFactorSettings() {
  const { user, setup2FA, verify2FA, disable2FA } = useAuth();

  const [stage, setStage] = useState("idle"); // idle | qr | disabling
  const [qrCode, setQrCode] = useState("");
  const [secret, setSecret] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleStartSetup = async () => {
    setError(""); setMessage(""); setLoading(true);
    const data = await setup2FA();
    if (data?.success) {
      setQrCode(data.qrCode);
      setSecret(data.secret);
      setStage("qr");
    } else {
      setError(data?.message || "Setup failed.");
    }
    setLoading(false);
  };

  const handleVerify = async () => {
    if (code.length !== 6) {
      setError("Enter the 6-digit code.");
      return;
    }
    setError(""); setLoading(true);
    const data = await verify2FA(code);
    if (data?.success) {
      setMessage("2FA enabled successfully!");
      setStage("idle");
      setCode("");
    } else {
      setError(data?.message || "Incorrect code.");
    }
    setLoading(false);
  };

  const handleDisable = async () => {
    if (!password) {
      setError("Please confirm your password.");
      return;
    }
    setError(""); setLoading(true);
    const data = await disable2FA(password);
    if (data?.success) {
      setMessage("2FA disabled.");
      setStage("idle");
      setPassword("");
    } else {
      setError(data?.message || "Disable failed.");
    }
    setLoading(false);
  };

  return (
    <div style={wrapStyle}>
      <h3 style={headingStyle}>Two-Factor Authentication</h3>
      <p style={descStyle}>
        {user?.twoFactorEnabled
          ? "2FA is currently enabled — you'll be asked for an authenticator code at login."
          : "Add extra security using an authenticator app (Google Authenticator, Authy)."}
      </p>

      {error && <p style={errorStyle}>{error}</p>}
      {message && <p style={successStyle}>{message}</p>}

      {/* ── Already enabled: disable option ── */}
      {user?.twoFactorEnabled && stage === "idle" && (
        <button onClick={() => setStage("disabling")} style={dangerBtnStyle}>
          DISABLE 2FA
        </button>
      )}

      {stage === "disabling" && (
        <>
          <input
            placeholder="Confirm your password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />
          <button onClick={handleDisable} disabled={loading} style={dangerBtnStyle}>
            {loading ? "Please wait..." : "CONFIRM DISABLE"}
          </button>
          <p onClick={() => setStage("idle")} style={linkStyle}>← Cancel</p>
        </>
      )}

      {/* ── Not enabled: setup flow ── */}
      {!user?.twoFactorEnabled && stage === "idle" && (
        <button onClick={handleStartSetup} disabled={loading} style={btnStyle(loading)}>
          {loading ? "Loading..." : "ENABLE 2FA"}
        </button>
      )}

      {stage === "qr" && (
        <div>
          <img src={qrCode} alt="2FA QR Code" style={{ width: "180px", height: "180px", borderRadius: "8px", marginBottom: "1rem" }} />
          <p style={{ color: "rgba(242,232,208,0.5)", fontSize: "0.7rem", marginBottom: "1rem", wordBreak: "break-all" }}>
            Manual key: <span style={{ color: "#C9A84C" }}>{secret}</span>
          </p>
          <input
            placeholder="6-digit code"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            maxLength={6}
            style={{ ...inputStyle, textAlign: "center", letterSpacing: "0.4em" }}
          />
          <button onClick={handleVerify} disabled={loading} style={btnStyle(loading)}>
            {loading ? "Verifying..." : "VERIFY & ENABLE"}
          </button>
          <p onClick={() => setStage("idle")} style={linkStyle}>← Cancel</p>
        </div>
      )}
    </div>
  );
}

// ── Styles ──
const wrapStyle = {
  background: "rgba(15,30,47,0.6)",
  border: "1px solid rgba(201,168,76,0.2)",
  borderRadius: "12px",
  padding: "1.5rem",
  maxWidth: "360px",
};

const headingStyle = {
  color: "#C9A84C", fontFamily: "Cormorant Garamond",
  fontSize: "1.2rem", marginBottom: "0.5rem",
};

const descStyle = {
  color: "rgba(242,232,208,0.55)", fontFamily: "Poppins",
  fontSize: "0.8rem", lineHeight: 1.6, marginBottom: "1.25rem",
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

const dangerBtnStyle = {
  width: "100%", padding: "0.85rem",
  background: "rgba(226,75,74,0.15)",
  color: "#E24B4A", border: "1px solid rgba(226,75,74,0.4)",
  borderRadius: "8px",
  fontFamily: "Space Mono", fontWeight: 700,
  fontSize: "0.7rem", letterSpacing: "0.1em",
  cursor: "pointer", marginBottom: "0.5rem",
};

const errorStyle = {
  color: "#E24B4A", fontSize: "0.8rem", marginBottom: "1rem",
};

const successStyle = {
  color: "#4CAF50", fontSize: "0.8rem", marginBottom: "1rem",
};

const linkStyle = {
  color: "rgba(242,232,208,0.4)", fontSize: "0.72rem",
  textAlign: "center", marginTop: "0.75rem", cursor: "pointer",
};