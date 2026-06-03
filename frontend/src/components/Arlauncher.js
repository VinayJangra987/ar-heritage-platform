// src/components/ARLauncher.js
// Cinematic AR intro animation → then launches ARView
// Use this instead of directly opening ARView from "View in AR" button

import { useState, useEffect } from "react";

const STEPS = [
  { id: "init",    label: "Initialising AR Engine",    duration: 800  },
  { id: "camera", label: "Accessing Camera Sensors",   duration: 900  },
  { id: "map",    label: "Loading Heritage Data",      duration: 700  },
  { id: "anchor", label: "Calibrating World Anchors",  duration: 900  },
  { id: "ready",  label: "AR Experience Ready",        duration: 600  },
];

export default function ARLauncher({ onComplete, onCancel, siteName }) {
  const [step,      setStep]      = useState(0);
  const [done,      setDone]      = useState(false);
  const [scanAngle, setScanAngle] = useState(0);
  const [dots,      setDots]      = useState("");

  // Animate dots
  useEffect(() => {
    const t = setInterval(() => setDots(d => d.length >= 3 ? "" : d + "."), 400);
    return () => clearInterval(t);
  }, []);

  // Animate scan angle
  useEffect(() => {
    let raf;
    const animate = () => {
      setScanAngle(a => (a + 1.2) % 360);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Step through init sequence
  useEffect(() => {
    if (step >= STEPS.length) { setDone(true); return; }
    const t = setTimeout(() => setStep(s => s + 1), STEPS[step]?.duration || 700);
    return () => clearTimeout(t);
  }, [step]);

  // Launch after "ready"
  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => onComplete(), 900);
    return () => clearTimeout(t);
  }, [done, onComplete]);

  const progress = Math.min(100, (step / STEPS.length) * 100);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Orbitron:wght@400;700;900&display=swap');

        .arl-overlay {
          position: fixed; inset: 0; z-index: 10001;
          background: #020810;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-family: 'Space Mono', monospace;
          overflow: hidden;
        }

        /* ── Animated grid background ── */
        .arl-grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(0,200,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,200,255,0.03) 1px, transparent 1px);
          background-size: 40px 40px;
          animation: arlGridShift 8s linear infinite;
        }
        @keyframes arlGridShift {
          from { background-position: 0 0; }
          to   { background-position: 40px 40px; }
        }

        /* ── Radial glow ── */
        .arl-glow {
          position: absolute;
          width: 600px; height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%);
          pointer-events: none;
        }

        /* ── Scanner ring ── */
        .arl-scanner-wrap {
          position: relative;
          width: 220px; height: 220px;
          margin-bottom: 3rem;
          flex-shrink: 0;
        }

        .arl-ring {
          position: absolute; inset: 0;
          border-radius: 50%;
        }
        .arl-ring-1 {
          border: 1px solid rgba(201,168,76,0.15);
        }
        .arl-ring-2 {
          inset: 16px;
          border: 1px solid rgba(0,200,255,0.1);
          animation: arlRingSpin 4s linear infinite;
        }
        .arl-ring-3 {
          inset: 32px;
          border: 1px solid rgba(201,168,76,0.2);
          animation: arlRingSpin 6s linear infinite reverse;
        }
        @keyframes arlRingSpin {
          to { transform: rotate(360deg); }
        }

        /* Rotating scan line */
        .arl-scan-line {
          position: absolute; inset: 0;
          border-radius: 50%;
          overflow: hidden;
        }
        .arl-scan-line::after {
          content: '';
          position: absolute;
          top: 50%; left: 50%;
          width: 50%; height: 1px;
          background: linear-gradient(to right, transparent, rgba(201,168,76,0.8));
          transform-origin: left center;
          transform: rotate(var(--angle));
        }

        /* Center content of scanner */
        .arl-scanner-center {
          position: absolute; inset: 48px;
          border-radius: 50%;
          background: rgba(201,168,76,0.04);
          border: 1px solid rgba(201,168,76,0.12);
          display: flex; align-items: center; justify-content: center;
          flex-direction: column; gap: 4px;
        }
        .arl-scanner-icon {
          font-size: 2rem;
          filter: drop-shadow(0 0 12px rgba(201,168,76,0.6));
        }
        .arl-scanner-label {
          font-size: 0.42rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(201,168,76,0.6);
        }

        /* Corner brackets */
        .arl-corner {
          position: absolute;
          width: 18px; height: 18px;
        }
        .arl-corner::before, .arl-corner::after {
          content: '';
          position: absolute;
          background: #C9A84C;
          border-radius: 1px;
        }
        .arl-corner.tl { top: 0; left: 0; }
        .arl-corner.tr { top: 0; right: 0; }
        .arl-corner.bl { bottom: 0; left: 0; }
        .arl-corner.br { bottom: 0; right: 0; }

        .arl-corner.tl::before { width: 2px; height: 100%; top: 0; left: 0; }
        .arl-corner.tl::after  { width: 100%; height: 2px; top: 0; left: 0; }
        .arl-corner.tr::before { width: 2px; height: 100%; top: 0; right: 0; }
        .arl-corner.tr::after  { width: 100%; height: 2px; top: 0; right: 0; }
        .arl-corner.bl::before { width: 2px; height: 100%; bottom: 0; left: 0; }
        .arl-corner.bl::after  { width: 100%; height: 2px; bottom: 0; left: 0; }
        .arl-corner.br::before { width: 2px; height: 100%; bottom: 0; right: 0; }
        .arl-corner.br::after  { width: 100%; height: 2px; bottom: 0; right: 0; }

        /* ── Text content ── */
        .arl-title {
          font-family: 'Orbitron', monospace;
          font-size: clamp(1.2rem, 3vw, 1.6rem);
          font-weight: 900;
          color: #F2E8D0;
          letter-spacing: 0.08em;
          text-align: center;
          margin-bottom: 0.4rem;
        }
        .arl-subtitle {
          font-size: 0.58rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(242,232,208,0.3);
          text-align: center;
          margin-bottom: 2.5rem;
        }
        .arl-site-name {
          color: #C9A84C;
          font-weight: 700;
        }

        /* ── Steps ── */
        .arl-steps {
          display: flex; flex-direction: column; gap: 0.6rem;
          width: 320px; margin-bottom: 2.5rem;
        }
        .arl-step {
          display: flex; align-items: center; gap: 0.75rem;
          font-size: 0.55rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(242,232,208,0.2);
          transition: color 0.3s ease;
        }
        .arl-step.active { color: rgba(242,232,208,0.7); }
        .arl-step.complete { color: rgba(74,200,120,0.7); }

        .arl-step-indicator {
          width: 20px; height: 20px;
          border-radius: 50%;
          border: 1px solid currentColor;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.6rem;
          flex-shrink: 0;
          transition: all 0.3s;
        }
        .arl-step.active .arl-step-indicator {
          border-color: #C9A84C;
          background: rgba(201,168,76,0.1);
          color: #C9A84C;
          animation: arlStepPulse 0.8s infinite alternate;
        }
        .arl-step.complete .arl-step-indicator {
          border-color: rgba(74,200,120,0.7);
          background: rgba(74,200,120,0.1);
          color: rgba(74,200,120,0.9);
        }
        @keyframes arlStepPulse {
          from { box-shadow: 0 0 0 0 rgba(201,168,76,0.3); }
          to   { box-shadow: 0 0 0 6px rgba(201,168,76,0); }
        }

        .arl-step-text { flex: 1; }

        /* ── Progress bar ── */
        .arl-progress-wrap {
          width: 320px;
          margin-bottom: 2rem;
        }
        .arl-progress-label {
          display: flex; justify-content: space-between;
          font-size: 0.48rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(242,232,208,0.25);
          margin-bottom: 6px;
        }
        .arl-progress-track {
          height: 2px;
          background: rgba(255,255,255,0.06);
          border-radius: 2px;
          overflow: hidden;
        }
        .arl-progress-fill {
          height: 100%;
          background: linear-gradient(to right, #8B6914, #C9A84C, #E8C96A);
          border-radius: 2px;
          transition: width 0.4s ease;
          position: relative;
        }
        .arl-progress-fill::after {
          content: '';
          position: absolute;
          right: 0; top: -3px;
          width: 8px; height: 8px;
          border-radius: 50%;
          background: #E8C96A;
          box-shadow: 0 0 8px rgba(232,201,106,0.8);
        }

        /* ── Ready state ── */
        .arl-ready-badge {
          display: flex; align-items: center; gap: 0.6rem;
          padding: 0.6rem 1.5rem;
          background: rgba(74,200,120,0.1);
          border: 1px solid rgba(74,200,120,0.3);
          border-radius: 50px;
          font-size: 0.58rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(74,200,120,0.8);
          opacity: 0;
          transition: opacity 0.5s ease;
        }
        .arl-ready-badge.visible { opacity: 1; }
        .arl-ready-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: rgba(74,200,120,0.8);
          animation: arlStepPulse 0.6s infinite alternate;
        }

        /* Cancel */
        .arl-cancel {
          position: absolute; bottom: 2rem;
          font-size: 0.52rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(242,232,208,0.2);
          background: none; border: none;
          cursor: pointer;
          transition: color 0.2s;
        }
        .arl-cancel:hover { color: rgba(242,232,208,0.5); }

        /* Scanlines overlay */
        .arl-scanlines {
          position: absolute; inset: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0,0,0,0.03) 2px,
            rgba(0,0,0,0.03) 4px
          );
          pointer-events: none;
        }
      `}</style>

      <div className="arl-overlay">
        <div className="arl-grid" />
        <div className="arl-glow" />
        <div className="arl-scanlines" />

        {/* Scanner */}
        <div className="arl-scanner-wrap">
          <div className="arl-ring arl-ring-1" />
          <div className="arl-ring arl-ring-2" />
          <div className="arl-ring arl-ring-3" />

          <div
            className="arl-scan-line"
            style={{ "--angle": `${scanAngle}deg` }}
          />

          <div className="arl-corner tl" />
          <div className="arl-corner tr" />
          <div className="arl-corner bl" />
          <div className="arl-corner br" />

          <div className="arl-scanner-center">
            <div className="arl-scanner-icon">📱</div>
            <div className="arl-scanner-label">AR Mode</div>
          </div>
        </div>

        {/* Title */}
        <div className="arl-title">Augmented Reality</div>
        <div className="arl-subtitle">
          Loading{dots}&nbsp;
          {siteName && <span className="arl-site-name">{siteName}</span>}
        </div>

        {/* Steps */}
        <div className="arl-steps">
          {STEPS.map((s, i) => (
            <div
              key={s.id}
              className={`arl-step ${i < step ? "complete" : i === step ? "active" : ""}`}
            >
              <div className="arl-step-indicator">
                {i < step ? "✓" : i === step ? "◉" : "○"}
              </div>
              <div className="arl-step-text">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Progress */}
        <div className="arl-progress-wrap">
          <div className="arl-progress-label">
            <span>Initialising</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="arl-progress-track">
            <div className="arl-progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Ready badge */}
        <div className={`arl-ready-badge ${done ? "visible" : ""}`}>
          <div className="arl-ready-dot" />
          AR Experience Ready — Launching
        </div>

        <button className="arl-cancel" onClick={onCancel}>✕ Cancel</button>
      </div>
    </>
  );
}