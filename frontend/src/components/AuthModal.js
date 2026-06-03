// import React, { useState } from 'react';
// import { useAuth } from '../context/AuthContext';
// import './AuthModal.css';

// const AuthModal = ({ onClose }) => {
//   const [mode, setMode] = useState('login'); // 'login' | 'signup'
//   const [form, setForm] = useState({ name: '', email: '', password: '' });
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const { login, signup } = useAuth();

//   const handle = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);
//     await new Promise(r => setTimeout(r, 400)); // slight delay for feel

//     let result;
//     if (mode === 'login') {
//       result = login(form.email, form.password);
//     } else {
//       if (!form.name.trim()) { setError('Name required!'); setLoading(false); return; }
//       result = signup(form.name, form.email, form.password);
//     }

//     setLoading(false);
//     if (result.success) onClose();
//     else setError(result.error);
//   };

//   return (
//     <div className="auth-overlay" onClick={onClose}>
//       <div className="auth-modal" onClick={e => e.stopPropagation()}>
//         {/* Decorative top */}
//         <div className="auth-top-deco">
//           <div className="auth-mandala">✦</div>
//         </div>

//         <button className="auth-close" onClick={onClose}>✕</button>

//         <div className="auth-header">
//           <h2 className="auth-title">
//             {mode === 'login' ? 'Welcome Back' : 'Join Heritage'}
//           </h2>
//           <p className="auth-sub">
//             {mode === 'login'
//               ? 'Continue your journey through India\'s history'
//               : 'Start exploring 5,000 years of heritage'}
//           </p>
//         </div>

//         <div className="auth-tabs">
//           <button
//             className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
//             onClick={() => { setMode('login'); setError(''); }}
//           >Login</button>
//           <button
//             className={`auth-tab ${mode === 'signup' ? 'active' : ''}`}
//             onClick={() => { setMode('signup'); setError(''); }}
//           >Sign Up</button>
//           <div className={`auth-tab-indicator ${mode === 'signup' ? 'right' : ''}`} />
//         </div>

//         <form className="auth-form" onSubmit={handle}>
//           {mode === 'signup' && (
//             <div className="auth-field">
//               <label>Your Name</label>
//               <input
//                 type="text"
//                 placeholder="Arjun Sharma"
//                 value={form.name}
//                 onChange={e => setForm({ ...form, name: e.target.value })}
//                 required
//               />
//             </div>
//           )}
//           <div className="auth-field">
//             <label>Email</label>
//             <input
//               type="email"
//               placeholder="you@example.com"
//               value={form.email}
//               onChange={e => setForm({ ...form, email: e.target.value })}
//               required
//             />
//           </div>
//           <div className="auth-field">
//             <label>Password</label>
//             <input
//               type="password"
//               placeholder={mode === 'signup' ? 'Min 6 characters' : '••••••••'}
//               value={form.password}
//               onChange={e => setForm({ ...form, password: e.target.value })}
//               minLength={mode === 'signup' ? 6 : undefined}
//               required
//             />
//           </div>

//           {error && <div className="auth-error">⚠ {error}</div>}

//           <button className="auth-submit" type="submit" disabled={loading}>
//             {loading ? (
//               <span className="auth-spinner">◌</span>
//             ) : mode === 'login' ? 'Enter the Journey' : 'Begin Exploring'}
//           </button>
//         </form>

//         <p className="auth-switch">
//           {mode === 'login' ? "New here? " : "Already have an account? "}
//           <span onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }}>
//             {mode === 'login' ? 'Create account' : 'Login'}
//           </span>
//         </p>

//         <div className="auth-footer-deco">
//           <span>🏛</span><span>🕌</span><span>⛩</span><span>🗿</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AuthModal;



import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function AuthModal({ onClose }) {
  const [isLogin, setIsLogin]   = useState(true);
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const { login, signup } = useAuth();

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      let data;
      if (isLogin) {
        data = await login(email, password);
      } else {
        data = await signup(name, email, password);
      }
      if (data.message && !data.token) {
        setError(data.message);
      } else {
        onClose();
      }
    } catch (err) {
      setError("Something went wrong. Try again.");
    }
    setLoading(false);
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "rgba(0,0,0,0.7)",
      display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      <div style={{
        background: "#0D1B2A", border: "1px solid rgba(201,168,76,0.3)",
        borderRadius: "16px", padding: "2rem", width: "360px"
      }}>
        <h2 style={{ color: "#C9A84C", fontFamily: "Cormorant Garamond", marginBottom: "1.5rem" }}>
          {isLogin ? "Login" : "Sign Up"}
        </h2>

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

        {error && <p style={{ color: "#E24B4A", fontSize: "0.8rem", marginBottom: "1rem" }}>{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: "100%", padding: "0.85rem",
            background: "linear-gradient(135deg, #C9A84C, #E8C96A)",
            color: "#0D1B2A", border: "none", borderRadius: "8px",
            fontFamily: "Space Mono", fontWeight: 700,
            fontSize: "0.7rem", letterSpacing: "0.1em",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Please wait..." : isLogin ? "LOGIN" : "SIGN UP"}
        </button>

        <p style={{ color: "rgba(242,232,208,0.5)", fontSize: "0.75rem", textAlign: "center", marginTop: "1rem" }}>
          {isLogin ? "No account? " : "Already have one? "}
          <span
            onClick={() => setIsLogin(!isLogin)}
            style={{ color: "#C9A84C", cursor: "pointer" }}
          >
            {isLogin ? "Sign Up" : "Login"}
          </span>
        </p>

        <button
          onClick={onClose}
          style={{ position: "absolute", top: "1rem", right: "1rem", background: "none", border: "none", color: "rgba(242,232,208,0.5)", cursor: "pointer", fontSize: "1.2rem" }}
        >✕</button>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "0.75rem 1rem",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(201,168,76,0.2)",
  borderRadius: "8px", color: "#F2E8D0",
  fontFamily: "Poppins", fontSize: "0.85rem",
  marginBottom: "1rem", outline: "none",
  boxSizing: "border-box",
};