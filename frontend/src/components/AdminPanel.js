// src/components/AdminPanel.js
// Owner/Admin panel — Login + Add/Edit/Delete heritage monuments
// Uses localStorage to persist monuments across sessions

import { useState, useEffect, useRef } from "react";

// ── Default admin credentials (change these!) ──
const ADMIN_EMAIL    = "admin@dharohar.com";
const ADMIN_PASSWORD = "dharohar@2024";

// ── Default monuments (can be overridden by localStorage) ──
const DEFAULT_MONUMENTS = [
  {
    id: "hampi-001",
    name: "Hampi Chariot",
    state: "Karnataka",
    location: "Hampi, Karnataka",
    era: "16th Century CE",
    type: "archaeological",
    subtitle: "Vijayanagara Empire",
    description: "The Stone Chariot of Hampi, built by King Krishnadevaraya.",
    facts: ["UNESCO 1986", "16th Century", "Stone Chariot", "Vijayanagara Empire"],
    image: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=800&q=80",
    sketchfabId: "1e8e9212dc874323af8d21c14d553f85",
    lat: "15.335", lng: "76.460",
    addedBy: "admin@dharohar.com",
    addedAt: "2024-01-01",
    status: "published",
  },
  {
    id: "taj-001",
    name: "Taj Mahal",
    state: "Uttar Pradesh",
    location: "Agra, Uttar Pradesh",
    era: "17th Century CE",
    type: "architectural",
    subtitle: "Mughal Architecture",
    description: "Built by Shah Jahan in memory of Mumtaz Mahal.",
    facts: ["UNESCO 1983", "22 years to build", "White marble", "20,000 artisans"],
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80",
    sketchfabId: "7b43e635cbfb47719d5a124302b78579",
    lat: "27.1751", lng: "78.0421",
    addedBy: "admin@dharohar.com",
    addedAt: "2024-01-01",
    status: "published",
  },
];

const TYPES = ["architectural", "archaeological", "religious", "natural", "intangible"];
const STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat",
  "Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh",
  "Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab",
  "Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh",
  "Uttarakhand","West Bengal","Delhi","Jammu & Kashmir","Ladakh",
];

const typeColors = {
  architectural: "#C9A84C", archaeological: "#8B6F47",
  religious: "#E07B54", natural: "#4A7C59", intangible: "#9B59B6",
};

// ── Helpers ──────────────────────────────────────────────────────────────────
const getMonuments = () => {
  try {
    const saved = localStorage.getItem("dharohar_monuments");
    return saved ? JSON.parse(saved) : DEFAULT_MONUMENTS;
  } catch { return DEFAULT_MONUMENTS; }
};
const saveMonuments = (list) => {
  localStorage.setItem("dharohar_monuments", JSON.stringify(list));
};
const getSession = () => {
  try { return JSON.parse(localStorage.getItem("dharohar_admin_session")); } catch { return null; }
};
const saveSession = (data) => localStorage.setItem("dharohar_admin_session", JSON.stringify(data));
const clearSession = () => localStorage.removeItem("dharohar_admin_session");

const emptyForm = {
  name: "", state: "", location: "", era: "", type: "architectural",
  subtitle: "", description: "", facts: "", image: "",
  sketchfabId: "", lat: "", lng: "", status: "published",
};

// ════════════════════════════════════════════════════════════════════════════
export default function AdminPanel({ onClose, onMonumentsUpdate }) {
  const [session,      setSession]      = useState(getSession);
  const [monuments,    setMonuments]    = useState(getMonuments);
  const [view,         setView]         = useState("dashboard"); // dashboard | add | edit | detail
  const [editTarget,   setEditTarget]   = useState(null);
  const [form,         setForm]         = useState(emptyForm);
  const [formErrors,   setFormErrors]   = useState({});
  const [loginForm,    setLoginForm]    = useState({ email: "", password: "" });
  const [loginError,   setLoginError]   = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [saveMsg,      setSaveMsg]      = useState("");
  const [deleteConfirm,setDeleteConfirm]= useState(null);
  const [searchQuery,  setSearchQuery]  = useState("");
  const [filterType,   setFilterType]   = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Sync monuments to parent
  useEffect(() => {
    if (onMonumentsUpdate) onMonumentsUpdate(monuments);
  }, [monuments, onMonumentsUpdate]);

  // ── Login ──
  const handleLogin = () => {
    setLoginLoading(true);
    setLoginError("");
    setTimeout(() => {
      if (loginForm.email === ADMIN_EMAIL && loginForm.password === ADMIN_PASSWORD) {
        const sess = { email: loginForm.email, name: "Admin", loginAt: new Date().toISOString() };
        saveSession(sess);
        setSession(sess);
      } else {
        setLoginError("Invalid email or password.");
      }
      setLoginLoading(false);
    }, 900);
  };

  // ── Logout ──
  const handleLogout = () => { clearSession(); setSession(null); setView("dashboard"); };

  // ── Form helpers ──
  const setField = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validateForm = () => {
    const errs = {};
    if (!form.name.trim())        errs.name     = "Name required";
    if (!form.state)              errs.state    = "State required";
    if (!form.location.trim())    errs.location = "Location required";
    if (!form.era.trim())         errs.era      = "Era required";
    if (!form.image.trim())       errs.image    = "Image URL required";
    if (!form.description.trim()) errs.description = "Description required";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ── Save monument ──
  const handleSave = () => {
    if (!validateForm()) return;
    const factsArr = form.facts.split("\n").map(f => f.trim()).filter(Boolean);
    const now = new Date().toISOString().split("T")[0];

    if (editTarget) {
      const updated = monuments.map(m =>
        m.id === editTarget.id ? { ...m, ...form, facts: factsArr } : m
      );
      setMonuments(updated);
      saveMonuments(updated);
    } else {
      const newM = {
        ...form,
        id: `monument-${Date.now()}`,
        facts: factsArr,
        addedBy: session?.email,
        addedAt: now,
      };
      const updated = [newM, ...monuments];
      setMonuments(updated);
      saveMonuments(updated);
    }
    setSaveMsg(editTarget ? "Monument updated!" : "Monument added!");
    setTimeout(() => setSaveMsg(""), 2500);
    setView("dashboard");
    setForm(emptyForm);
    setEditTarget(null);
    setFormErrors({});
  };

  // ── Delete ──
  const handleDelete = (id) => {
    const updated = monuments.filter(m => m.id !== id);
    setMonuments(updated);
    saveMonuments(updated);
    setDeleteConfirm(null);
    setView("dashboard");
  };

  // ── Edit ──
  const openEdit = (m) => {
    setEditTarget(m);
    setForm({ ...emptyForm, ...m, facts: (m.facts || []).join("\n") });
    setFormErrors({});
    setView("edit");
  };

  // ── Filtered list ──
  const filtered = monuments.filter(m => {
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || m.name.toLowerCase().includes(q) || m.location.toLowerCase().includes(q) || m.state.toLowerCase().includes(q);
    const matchType   = filterType   === "all" || m.type   === filterType;
    const matchStatus = filterStatus === "all" || m.status === filterStatus;
    return matchSearch && matchType && matchStatus;
  });

  // ════════════════════════════════════════════════════════════════════════
  // LOGIN SCREEN
  // ════════════════════════════════════════════════════════════════════════
  if (!session) return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Space+Mono:wght@400;700&family=Poppins:wght@300;400;500;600&display=swap');

        .adm-login-overlay {
          position:fixed;inset:0;z-index:10002;
          background: linear-gradient(135deg, #050A0F 0%, #0D1B2A 50%, #0A1520 100%);
          display:flex;align-items:center;justify-content:center;
          font-family:'Poppins',sans-serif;
        }
        .adm-login-bg {
          position:absolute;inset:0;
          background-image: radial-gradient(ellipse at 20% 50%, rgba(201,168,76,0.06) 0%, transparent 60%),
                            radial-gradient(ellipse at 80% 20%, rgba(26,107,114,0.08) 0%, transparent 50%);
        }
        .adm-login-grid {
          position:absolute;inset:0;
          background-image: linear-gradient(rgba(201,168,76,0.03) 1px,transparent 1px),
                            linear-gradient(90deg,rgba(201,168,76,0.03) 1px,transparent 1px);
          background-size:50px 50px;
        }
        .adm-login-card {
          position:relative;z-index:2;
          width:420px;
          background:rgba(8,18,30,0.9);
          border:1px solid rgba(201,168,76,0.15);
          border-radius:20px;
          padding:3rem;
          backdrop-filter:blur(20px);
          box-shadow:0 40px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(201,168,76,0.1);
        }
        .adm-login-icon {
          width:56px;height:56px;
          background:linear-gradient(135deg,rgba(201,168,76,0.15),rgba(201,168,76,0.05));
          border:1px solid rgba(201,168,76,0.25);
          border-radius:14px;
          display:flex;align-items:center;justify-content:center;
          font-size:1.5rem;margin-bottom:1.5rem;
        }
        .adm-login-title {
          font-family:'Cormorant Garamond',serif;
          font-size:1.8rem;font-weight:700;color:#F2E8D0;margin-bottom:0.3rem;
        }
        .adm-login-sub {
          font-family:'Space Mono',monospace;font-size:0.52rem;
          letter-spacing:0.2em;text-transform:uppercase;color:rgba(242,232,208,0.3);
          margin-bottom:2rem;
        }
        .adm-field { margin-bottom:1.2rem; }
        .adm-label {
          display:block;font-family:'Space Mono',monospace;font-size:0.5rem;
          letter-spacing:0.18em;text-transform:uppercase;color:rgba(242,232,208,0.4);
          margin-bottom:6px;
        }
        .adm-input {
          width:100%;padding:0.75rem 1rem;
          background:rgba(242,232,208,0.04);
          border:1px solid rgba(242,232,208,0.1);
          border-radius:10px;color:#F2E8D0;
          font-family:'Poppins',sans-serif;font-size:0.9rem;
          outline:none;transition:all 0.2s;
        }
        .adm-input:focus { border-color:rgba(201,168,76,0.5);background:rgba(201,168,76,0.04); }
        .adm-input.error { border-color:rgba(220,80,80,0.5); }
        .adm-login-error {
          background:rgba(220,80,80,0.08);border:1px solid rgba(220,80,80,0.2);
          border-radius:8px;padding:0.7rem 1rem;
          font-size:0.8rem;color:rgba(255,120,120,0.9);margin-bottom:1.2rem;
        }
        .adm-login-btn {
          width:100%;padding:0.9rem;
          background:linear-gradient(135deg,#C9A84C,#E8C96A);
          color:#0D1B2A;border:none;border-radius:10px;
          font-family:'Space Mono',monospace;font-size:0.65rem;
          font-weight:700;letter-spacing:0.15em;text-transform:uppercase;
          cursor:pointer;transition:all 0.25s;
        }
        .adm-login-btn:hover:not(:disabled) { transform:translateY(-1px);box-shadow:0 8px 25px rgba(201,168,76,0.35); }
        .adm-login-btn:disabled { opacity:0.6;cursor:not-allowed; }
        .adm-login-close {
          position:absolute;top:1.5rem;right:1.5rem;
          width:32px;height:32px;border-radius:50%;
          background:rgba(242,232,208,0.06);border:1px solid rgba(242,232,208,0.1);
          color:rgba(242,232,208,0.4);font-size:0.9rem;cursor:pointer;
          display:flex;align-items:center;justify-content:center;transition:all 0.2s;
        }
        .adm-login-close:hover { background:rgba(242,232,208,0.12);color:#F2E8D0; }
        .adm-hint {
          margin-top:1.2rem;padding:0.7rem;
          background:rgba(201,168,76,0.05);border:1px solid rgba(201,168,76,0.1);
          border-radius:8px;font-size:0.72rem;color:rgba(242,232,208,0.35);
          font-family:'Space Mono',monospace;text-align:center;line-height:1.6;
        }
      `}</style>
      <div className="adm-login-overlay">
        <div className="adm-login-bg" />
        <div className="adm-login-grid" />
        <div className="adm-login-card">
          <button className="adm-login-close" onClick={onClose}>✕</button>
          <div className="adm-login-icon">🏛</div>
          <div className="adm-login-title">Admin Portal</div>
          <div className="adm-login-sub">Bharatiya Dharohar · Owner Access</div>
          {loginError && <div className="adm-login-error">⚠ {loginError}</div>}
          <div className="adm-field">
            <label className="adm-label">Email Address</label>
            <input
              className={`adm-input ${loginError ? "error" : ""}`}
              type="email" placeholder="admin@dharohar.com"
              value={loginForm.email}
              onChange={e => setLoginForm(f => ({ ...f, email: e.target.value }))}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
            />
          </div>
          <div className="adm-field">
            <label className="adm-label">Password</label>
            <input
              className={`adm-input ${loginError ? "error" : ""}`}
              type="password" placeholder="••••••••••"
              value={loginForm.password}
              onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
            />
          </div>
          <button className="adm-login-btn" onClick={handleLogin} disabled={loginLoading}>
            {loginLoading ? "Authenticating..." : "→ Sign In"}
          </button>
          <div className="adm-hint">
            Demo: admin@dharohar.com<br />Password: dharohar@2024
          </div>
        </div>
      </div>
    </>
  );

  // ════════════════════════════════════════════════════════════════════════
  // MAIN ADMIN PANEL
  // ════════════════════════════════════════════════════════════════════════
  return (
    <>
      <style>{`
        .adm-overlay {
          position:fixed;inset:0;z-index:10002;
          background:#06101A;
          display:flex;flex-direction:column;
          font-family:'Poppins',sans-serif;
          overflow:hidden;
        }

        /* ── Top bar ── */
        .adm-topbar {
          display:flex;align-items:center;justify-content:space-between;
          padding:0.9rem 1.5rem;
          background:rgba(8,18,30,0.95);
          border-bottom:1px solid rgba(201,168,76,0.12);
          flex-shrink:0;
        }
        .adm-topbar-left { display:flex;align-items:center;gap:1rem; }
        .adm-brand {
          font-family:'Cormorant Garamond',serif;font-size:1.1rem;font-weight:700;color:#F2E8D0;
          display:flex;align-items:center;gap:0.5rem;
        }
        .adm-brand-badge {
          font-family:'Space Mono',monospace;font-size:0.45rem;letter-spacing:0.15em;
          text-transform:uppercase;background:rgba(201,168,76,0.15);
          color:#C9A84C;border:1px solid rgba(201,168,76,0.25);
          padding:3px 8px;border-radius:20px;
        }
        .adm-topbar-right { display:flex;align-items:center;gap:0.75rem; }
        .adm-user-pill {
          display:flex;align-items:center;gap:0.5rem;
          padding:5px 12px;background:rgba(242,232,208,0.05);
          border:1px solid rgba(242,232,208,0.1);border-radius:50px;
          font-family:'Space Mono',monospace;font-size:0.52rem;color:rgba(242,232,208,0.5);
        }
        .adm-user-dot { width:6px;height:6px;border-radius:50%;background:#4AC878; }
        .adm-topbar-btn {
          padding:6px 14px;border-radius:8px;font-family:'Space Mono',monospace;
          font-size:0.52rem;letter-spacing:0.1em;text-transform:uppercase;
          cursor:pointer;transition:all 0.2s;border:none;
        }
        .adm-topbar-btn.gold { background:linear-gradient(135deg,#C9A84C,#E8C96A);color:#0D1B2A;font-weight:700; }
        .adm-topbar-btn.gold:hover { box-shadow:0 4px 15px rgba(201,168,76,0.35); }
        .adm-topbar-btn.ghost { background:rgba(242,232,208,0.06);color:rgba(242,232,208,0.5);border:1px solid rgba(242,232,208,0.1); }
        .adm-topbar-btn.ghost:hover { background:rgba(242,232,208,0.1);color:#F2E8D0; }
        .adm-topbar-btn.danger { background:rgba(220,80,80,0.08);color:rgba(255,120,120,0.7);border:1px solid rgba(220,80,80,0.15); }
        .adm-topbar-btn.danger:hover { background:rgba(220,80,80,0.15);color:#FF8888; }

        /* ── Body ── */
        .adm-body { display:flex;flex:1;overflow:hidden; }

        /* ── Sidebar ── */
        .adm-sidebar {
          width:200px;flex-shrink:0;
          background:rgba(5,12,22,0.8);
          border-right:1px solid rgba(201,168,76,0.08);
          padding:1rem 0.75rem;
          display:flex;flex-direction:column;gap:0.3rem;
        }
        .adm-nav-label {
          font-family:'Space Mono',monospace;font-size:0.46rem;
          letter-spacing:0.2em;text-transform:uppercase;color:rgba(201,168,76,0.4);
          padding:0.5rem 0.6rem 0.3rem;
        }
        .adm-nav-item {
          display:flex;align-items:center;gap:0.6rem;
          padding:0.6rem 0.8rem;border-radius:10px;
          font-size:0.78rem;color:rgba(242,232,208,0.4);
          cursor:pointer;transition:all 0.2s;background:transparent;border:none;
          text-align:left;width:100%;
        }
        .adm-nav-item:hover { background:rgba(242,232,208,0.05);color:rgba(242,232,208,0.7); }
        .adm-nav-item.active { background:rgba(201,168,76,0.1);color:#C9A84C;border:1px solid rgba(201,168,76,0.2); }
        .adm-nav-item .nav-icon { font-size:1rem;width:20px;text-align:center; }

        /* ── Main content ── */
        .adm-main { flex:1;overflow-y:auto;padding:1.5rem; }

        /* ── Stats row ── */
        .adm-stats-row { display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;margin-bottom:1.5rem; }
        .adm-stat-card {
          background:rgba(8,18,30,0.8);border:1px solid rgba(201,168,76,0.1);
          border-radius:14px;padding:1.2rem;
        }
        .adm-stat-label { font-family:'Space Mono',monospace;font-size:0.48rem;letter-spacing:0.15em;text-transform:uppercase;color:rgba(242,232,208,0.3);margin-bottom:0.4rem; }
        .adm-stat-num { font-family:'Cormorant Garamond',serif;font-size:2rem;font-weight:700;color:#C9A84C;line-height:1; }
        .adm-stat-sub { font-size:0.7rem;color:rgba(242,232,208,0.3);margin-top:3px; }

        /* ── Section header ── */
        .adm-section-head {
          display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;
        }
        .adm-section-title {
          font-family:'Cormorant Garamond',serif;font-size:1.3rem;font-weight:700;color:#F2E8D0;
        }

        /* ── Filters ── */
        .adm-filters { display:flex;gap:0.75rem;margin-bottom:1rem;flex-wrap:wrap; }
        .adm-search {
          flex:1;min-width:200px;padding:0.6rem 1rem;
          background:rgba(242,232,208,0.04);border:1px solid rgba(242,232,208,0.1);
          border-radius:8px;color:#F2E8D0;font-family:'Poppins',sans-serif;font-size:0.82rem;outline:none;
        }
        .adm-search:focus { border-color:rgba(201,168,76,0.3); }
        .adm-select {
          padding:0.6rem 0.9rem;background:rgba(242,232,208,0.04);
          border:1px solid rgba(242,232,208,0.1);border-radius:8px;
          color:rgba(242,232,208,0.7);font-family:'Space Mono',monospace;font-size:0.52rem;
          letter-spacing:0.08em;outline:none;cursor:pointer;
        }
        .adm-select:focus { border-color:rgba(201,168,76,0.3); }
        .adm-select option { background:#0D1B2A; }

        /* ── Monument grid ── */
        .adm-monument-grid { display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:1rem; }
        .adm-monument-card {
          background:rgba(8,18,30,0.8);border:1px solid rgba(242,232,208,0.07);
          border-radius:14px;overflow:hidden;transition:all 0.2s;
        }
        .adm-monument-card:hover { border-color:rgba(201,168,76,0.2);transform:translateY(-2px); }
        .adm-monument-img { width:100%;height:140px;object-fit:cover;display:block; }
        .adm-monument-body { padding:1rem; }
        .adm-monument-type {
          font-family:'Space Mono',monospace;font-size:0.46rem;letter-spacing:0.15em;text-transform:uppercase;
          padding:3px 8px;border-radius:20px;display:inline-block;margin-bottom:0.5rem;
        }
        .adm-monument-name { font-family:'Cormorant Garamond',serif;font-size:1.15rem;font-weight:700;color:#F2E8D0;margin-bottom:2px; }
        .adm-monument-loc { font-size:0.72rem;color:rgba(242,232,208,0.4);margin-bottom:0.75rem; }
        .adm-monument-meta { display:flex;align-items:center;justify-content:space-between; }
        .adm-monument-status {
          font-family:'Space Mono',monospace;font-size:0.45rem;letter-spacing:0.12em;
          text-transform:uppercase;padding:3px 8px;border-radius:20px;
        }
        .adm-monument-status.published { background:rgba(74,200,120,0.1);color:rgba(74,200,120,0.8);border:1px solid rgba(74,200,120,0.2); }
        .adm-monument-status.draft     { background:rgba(242,232,208,0.06);color:rgba(242,232,208,0.4);border:1px solid rgba(242,232,208,0.1); }
        .adm-card-actions { display:flex;gap:0.4rem; }
        .adm-card-btn {
          padding:5px 10px;border-radius:6px;font-family:'Space Mono',monospace;
          font-size:0.48rem;letter-spacing:0.08em;cursor:pointer;border:none;transition:all 0.2s;
        }
        .adm-card-btn.edit  { background:rgba(201,168,76,0.1);color:#C9A84C;border:1px solid rgba(201,168,76,0.2); }
        .adm-card-btn.edit:hover  { background:rgba(201,168,76,0.2); }
        .adm-card-btn.del   { background:rgba(220,80,80,0.08);color:rgba(255,120,120,0.7);border:1px solid rgba(220,80,80,0.15); }
        .adm-card-btn.del:hover   { background:rgba(220,80,80,0.18); }

        /* ── Form ── */
        .adm-form-page { max-width:760px; }
        .adm-form-title { font-family:'Cormorant Garamond',serif;font-size:1.6rem;font-weight:700;color:#F2E8D0;margin-bottom:0.3rem; }
        .adm-form-sub { font-family:'Space Mono',monospace;font-size:0.52rem;color:rgba(242,232,208,0.3);letter-spacing:0.15em;text-transform:uppercase;margin-bottom:1.5rem; }

        .adm-form-grid { display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem; }
        .adm-form-full { grid-column:1/-1; }
        .adm-form-group { display:flex;flex-direction:column;gap:5px; }
        .adm-form-label {
          font-family:'Space Mono',monospace;font-size:0.48rem;letter-spacing:0.15em;
          text-transform:uppercase;color:rgba(242,232,208,0.4);
        }
        .adm-form-input, .adm-form-textarea, .adm-form-select {
          padding:0.7rem 0.9rem;
          background:rgba(242,232,208,0.04);border:1px solid rgba(242,232,208,0.1);
          border-radius:10px;color:#F2E8D0;font-family:'Poppins',sans-serif;font-size:0.85rem;outline:none;transition:all 0.2s;
        }
        .adm-form-input:focus,.adm-form-textarea:focus,.adm-form-select:focus { border-color:rgba(201,168,76,0.4);background:rgba(201,168,76,0.03); }
        .adm-form-input.err,.adm-form-textarea.err { border-color:rgba(220,80,80,0.5); }
        .adm-form-select option { background:#0D1B2A; }
        .adm-form-textarea { resize:vertical;min-height:90px; }
        .adm-form-err { font-size:0.68rem;color:rgba(255,120,120,0.8); }

        /* Image preview */
        .adm-img-preview { width:100%;height:160px;object-fit:cover;border-radius:10px;margin-top:0.5rem;border:1px solid rgba(242,232,208,0.1); }
        .adm-img-placeholder {
          width:100%;height:100px;border-radius:10px;margin-top:0.5rem;
          border:1px dashed rgba(242,232,208,0.15);
          display:flex;align-items:center;justify-content:center;
          font-size:0.7rem;color:rgba(242,232,208,0.2);
        }

        /* Section divider */
        .adm-form-divider {
          border:none;border-top:1px solid rgba(242,232,208,0.07);
          margin:1.2rem 0;
        }
        .adm-form-section-label {
          font-family:'Space Mono',monospace;font-size:0.5rem;letter-spacing:0.2em;
          text-transform:uppercase;color:rgba(201,168,76,0.5);margin-bottom:0.75rem;
          display:flex;align-items:center;gap:0.5rem;
        }
        .adm-form-section-label::after { content:'';flex:1;height:1px;background:rgba(201,168,76,0.1); }

        .adm-form-actions { display:flex;gap:0.75rem;margin-top:1.5rem; }
        .adm-btn {
          padding:0.8rem 1.8rem;border-radius:10px;font-family:'Space Mono',monospace;
          font-size:0.58rem;letter-spacing:0.12em;text-transform:uppercase;font-weight:700;cursor:pointer;transition:all 0.25s;border:none;
        }
        .adm-btn.primary { background:linear-gradient(135deg,#C9A84C,#E8C96A);color:#0D1B2A; }
        .adm-btn.primary:hover { transform:translateY(-1px);box-shadow:0 8px 20px rgba(201,168,76,0.3); }
        .adm-btn.secondary { background:rgba(242,232,208,0.06);color:rgba(242,232,208,0.6);border:1px solid rgba(242,232,208,0.1); }
        .adm-btn.secondary:hover { background:rgba(242,232,208,0.1);color:#F2E8D0; }

        /* Save message */
        .adm-save-msg {
          position:fixed;bottom:2rem;right:2rem;z-index:99999;
          background:rgba(74,200,120,0.15);border:1px solid rgba(74,200,120,0.3);
          border-radius:10px;padding:0.75rem 1.5rem;
          font-family:'Space Mono',monospace;font-size:0.6rem;letter-spacing:0.1em;
          color:rgba(74,200,120,0.9);display:flex;align-items:center;gap:0.5rem;
          animation:adm-slideup 0.3s ease;
        }
        @keyframes adm-slideup { from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)} }

        /* Delete confirm modal */
        .adm-confirm-overlay {
          position:fixed;inset:0;z-index:10010;
          background:rgba(0,0,0,0.7);backdrop-filter:blur(4px);
          display:flex;align-items:center;justify-content:center;
        }
        .adm-confirm-box {
          background:#0D1B2A;border:1px solid rgba(220,80,80,0.3);border-radius:16px;
          padding:2rem;max-width:360px;width:90%;text-align:center;
        }
        .adm-confirm-icon { font-size:2rem;margin-bottom:1rem; }
        .adm-confirm-title { font-family:'Cormorant Garamond',serif;font-size:1.3rem;font-weight:700;color:#F2E8D0;margin-bottom:0.5rem; }
        .adm-confirm-text { font-size:0.8rem;color:rgba(242,232,208,0.5);margin-bottom:1.5rem;line-height:1.5; }
        .adm-confirm-actions { display:flex;gap:0.75rem;justify-content:center; }

        /* Empty state */
        .adm-empty {
          display:flex;flex-direction:column;align-items:center;justify-content:center;
          padding:4rem;text-align:center;gap:1rem;
        }
        .adm-empty-icon { font-size:3rem;opacity:0.3; }
        .adm-empty-text { font-size:0.9rem;color:rgba(242,232,208,0.3); }

        @media(max-width:768px) {
          .adm-stats-row { grid-template-columns:1fr 1fr; }
          .adm-form-grid { grid-template-columns:1fr; }
          .adm-sidebar { display:none; }
        }
      `}</style>

      <div className="adm-overlay">
        {/* Top bar */}
        <div className="adm-topbar">
          <div className="adm-topbar-left">
            <div className="adm-brand">🏛 Dharohar <span className="adm-brand-badge">Admin</span></div>
          </div>
          <div className="adm-topbar-right">
            <div className="adm-user-pill">
              <div className="adm-user-dot" />
              {session.email}
            </div>
            <button className="adm-topbar-btn gold" onClick={() => { setForm(emptyForm); setEditTarget(null); setFormErrors({}); setView("add"); }}>
              + Add Monument
            </button>
            <button className="adm-topbar-btn danger" onClick={handleLogout}>Logout</button>
            <button className="adm-topbar-btn ghost" onClick={onClose}>✕ Close</button>
          </div>
        </div>

        <div className="adm-body">
          {/* Sidebar */}
          <div className="adm-sidebar">
            <div className="adm-nav-label">Navigation</div>
            {[
              { id: "dashboard", icon: "🏠", label: "Dashboard" },
              { id: "add",       icon: "➕", label: "Add Monument" },
            ].map(item => (
              <button
                key={item.id}
                className={`adm-nav-item ${view === item.id || (view === "edit" && item.id === "dashboard") ? "active" : ""}`}
                onClick={() => { if (item.id === "add") { setForm(emptyForm); setEditTarget(null); setFormErrors({}); } setView(item.id); }}
              >
                <span className="nav-icon">{item.icon}</span> {item.label}
              </button>
            ))}
          </div>

          {/* Main */}
          <div className="adm-main">

            {/* ── DASHBOARD ── */}
            {(view === "dashboard") && (
              <>
                {/* Stats */}
                <div className="adm-stats-row">
                  {[
                    { label: "Total Monuments", num: monuments.length, sub: "All entries" },
                    { label: "Published",        num: monuments.filter(m => m.status === "published").length, sub: "Live on app" },
                    { label: "Drafts",           num: monuments.filter(m => m.status === "draft").length, sub: "Not visible" },
                    { label: "States Covered",   num: [...new Set(monuments.map(m => m.state))].length, sub: "Across India" },
                  ].map(s => (
                    <div className="adm-stat-card" key={s.label}>
                      <div className="adm-stat-label">{s.label}</div>
                      <div className="adm-stat-num">{s.num}</div>
                      <div className="adm-stat-sub">{s.sub}</div>
                    </div>
                  ))}
                </div>

                {/* Section header */}
                <div className="adm-section-head">
                  <div className="adm-section-title">All Monuments</div>
                </div>

                {/* Filters */}
                <div className="adm-filters">
                  <input
                    className="adm-search" placeholder="🔍  Search by name, location, state..."
                    value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  />
                  <select className="adm-select" value={filterType} onChange={e => setFilterType(e.target.value)}>
                    <option value="all">All Types</option>
                    {TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>)}
                  </select>
                  <select className="adm-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                    <option value="all">All Status</option>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>

                {/* Monument grid */}
                {filtered.length === 0 ? (
                  <div className="adm-empty">
                    <div className="adm-empty-icon">🏛</div>
                    <div className="adm-empty-text">No monuments found.<br />Try a different search or add a new one.</div>
                  </div>
                ) : (
                  <div className="adm-monument-grid">
                    {filtered.map(m => (
                      <div className="adm-monument-card" key={m.id}>
                        <img
                          className="adm-monument-img"
                          src={m.image || "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400"}
                          alt={m.name}
                          onError={e => { e.target.src = "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400"; }}
                        />
                        <div className="adm-monument-body">
                          <span
                            className="adm-monument-type"
                            style={{ background: `${typeColors[m.type]}18`, color: typeColors[m.type], border: `1px solid ${typeColors[m.type]}33` }}
                          >
                            {m.type}
                          </span>
                          <div className="adm-monument-name">{m.name}</div>
                          <div className="adm-monument-loc">📍 {m.location} · {m.era}</div>
                          <div className="adm-monument-meta">
                            <span className={`adm-monument-status ${m.status}`}>{m.status}</span>
                            <div className="adm-card-actions">
                              <button className="adm-card-btn edit" onClick={() => openEdit(m)}>✏ Edit</button>
                              <button className="adm-card-btn del" onClick={() => setDeleteConfirm(m)}>🗑 Delete</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* ── ADD / EDIT FORM ── */}
            {(view === "add" || view === "edit") && (
              <div className="adm-form-page">
                <div className="adm-form-title">{editTarget ? "Edit Monument" : "Add New Monument"}</div>
                <div className="adm-form-sub">{editTarget ? `Editing: ${editTarget.name}` : "Fill in the details to add a heritage site"}</div>

                {/* Basic Info */}
                <div className="adm-form-section-label">Basic Information</div>
                <div className="adm-form-grid">
                  <div className="adm-form-group">
                    <label className="adm-form-label">Monument Name *</label>
                    <input className={`adm-form-input ${formErrors.name?"err":""}`} placeholder="e.g. Qutub Minar" value={form.name} onChange={e => setField("name", e.target.value)} />
                    {formErrors.name && <span className="adm-form-err">{formErrors.name}</span>}
                  </div>
                  <div className="adm-form-group">
                    <label className="adm-form-label">Subtitle / Style</label>
                    <input className="adm-form-input" placeholder="e.g. Indo-Islamic Architecture" value={form.subtitle} onChange={e => setField("subtitle", e.target.value)} />
                  </div>
                  <div className="adm-form-group">
                    <label className="adm-form-label">State *</label>
                    <select className={`adm-form-select ${formErrors.state?"err":""}`} value={form.state} onChange={e => setField("state", e.target.value)}>
                      <option value="">-- Select State --</option>
                      {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {formErrors.state && <span className="adm-form-err">{formErrors.state}</span>}
                  </div>
                  <div className="adm-form-group">
                    <label className="adm-form-label">Full Location *</label>
                    <input className={`adm-form-input ${formErrors.location?"err":""}`} placeholder="e.g. New Delhi, Delhi" value={form.location} onChange={e => setField("location", e.target.value)} />
                    {formErrors.location && <span className="adm-form-err">{formErrors.location}</span>}
                  </div>
                  <div className="adm-form-group">
                    <label className="adm-form-label">Era / Period *</label>
                    <input className={`adm-form-input ${formErrors.era?"err":""}`} placeholder="e.g. 12th Century CE" value={form.era} onChange={e => setField("era", e.target.value)} />
                    {formErrors.era && <span className="adm-form-err">{formErrors.era}</span>}
                  </div>
                  <div className="adm-form-group">
                    <label className="adm-form-label">Type</label>
                    <select className="adm-form-select" value={form.type} onChange={e => setField("type", e.target.value)}>
                      {TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>)}
                    </select>
                  </div>
                  <div className="adm-form-group adm-form-full">
                    <label className="adm-form-label">Description *</label>
                    <textarea className={`adm-form-textarea ${formErrors.description?"err":""}`} placeholder="Write a detailed description..." value={form.description} onChange={e => setField("description", e.target.value)} />
                    {formErrors.description && <span className="adm-form-err">{formErrors.description}</span>}
                  </div>
                  <div className="adm-form-group adm-form-full">
                    <label className="adm-form-label">Facts (one per line)</label>
                    <textarea className="adm-form-textarea" style={{minHeight:"80px"}} placeholder={"UNESCO 1993\n72.5 metres tall\nRed sandstone"} value={form.facts} onChange={e => setField("facts", e.target.value)} />
                  </div>
                </div>

                <hr className="adm-form-divider" />
                <div className="adm-form-section-label">Media</div>
                <div className="adm-form-grid">
                  <div className="adm-form-group adm-form-full">
                    <label className="adm-form-label">Image URL * (Unsplash, Imgur, etc.)</label>
                    <input className={`adm-form-input ${formErrors.image?"err":""}`} placeholder="https://images.unsplash.com/photo-..." value={form.image} onChange={e => setField("image", e.target.value)} />
                    {formErrors.image && <span className="adm-form-err">{formErrors.image}</span>}
                    {form.image
                      ? <img className="adm-img-preview" src={form.image} alt="preview" onError={e => e.target.style.display="none"} />
                      : <div className="adm-img-placeholder">🖼 Image preview will appear here</div>
                    }
                  </div>
                  <div className="adm-form-group adm-form-full">
                    <label className="adm-form-label">Sketchfab Model ID (for Full 3D tab)</label>
                    <input className="adm-form-input" placeholder="e.g. 7b43e635cbfb47719d5a124302b78579" value={form.sketchfabId} onChange={e => setField("sketchfabId", e.target.value)} />
                  </div>
                </div>

                <hr className="adm-form-divider" />
                <div className="adm-form-section-label">Map Coordinates</div>
                <div className="adm-form-grid">
                  <div className="adm-form-group">
                    <label className="adm-form-label">Latitude</label>
                    <input className="adm-form-input" placeholder="e.g. 28.5245" value={form.lat} onChange={e => setField("lat", e.target.value)} />
                  </div>
                  <div className="adm-form-group">
                    <label className="adm-form-label">Longitude</label>
                    <input className="adm-form-input" placeholder="e.g. 77.1855" value={form.lng} onChange={e => setField("lng", e.target.value)} />
                  </div>
                </div>

                <hr className="adm-form-divider" />
                <div className="adm-form-section-label">Publishing</div>
                <div className="adm-form-grid">
                  <div className="adm-form-group">
                    <label className="adm-form-label">Status</label>
                    <select className="adm-form-select" value={form.status} onChange={e => setField("status", e.target.value)}>
                      <option value="published">Published — Live on app</option>
                      <option value="draft">Draft — Hidden</option>
                    </select>
                  </div>
                </div>

                <div className="adm-form-actions">
                  <button className="adm-btn primary" onClick={handleSave}>
                    {editTarget ? "💾 Save Changes" : "✅ Add Monument"}
                  </button>
                  <button className="adm-btn secondary" onClick={() => { setView("dashboard"); setForm(emptyForm); setEditTarget(null); setFormErrors({}); }}>
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Save toast */}
      {saveMsg && <div className="adm-save-msg">✓ {saveMsg}</div>}

      {/* Delete confirm */}
      {deleteConfirm && (
        <div className="adm-confirm-overlay">
          <div className="adm-confirm-box">
            <div className="adm-confirm-icon">🗑</div>
            <div className="adm-confirm-title">Delete Monument?</div>
            <div className="adm-confirm-text">
              Are you sure you want to delete <strong style={{color:"#F2E8D0"}}>{deleteConfirm.name}</strong>?<br/>This action cannot be undone.
            </div>
            <div className="adm-confirm-actions">
              <button className="adm-btn secondary" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button
                className="adm-btn"
                style={{background:"rgba(220,80,80,0.15)",color:"rgba(255,120,120,0.9)",border:"1px solid rgba(220,80,80,0.3)"}}
                onClick={() => handleDelete(deleteConfirm.id)}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}