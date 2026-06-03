// src/components/DiscoveryTour.js
// Immersive animated heritage tour — triggered by "Begin Discovery"

import { useState, useEffect, useCallback } from "react";

const SITES = [
  {
    id: "hampi",
    name: "Hampi Ruins",
    state: "Karnataka",
    era: "14th – 16th Century CE",
    tagline: "The Lost Empire of Vijayanagara",
    description:
      "Once the world's second-largest medieval city, Hampi was the magnificent capital of the Vijayanagara Empire. Over 1,600 temple ruins stretch across a surreal boulder-strewn landscape along the Tungabhadra river.",
    facts: ["1,600+ temples", "UNESCO 1986", "Former capital of South India", "Tungabhadra riverside"],
    image: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=1400&q=90",
    color: "#C9A84C",
    accent: "#8B6F47",
    num: "01",
  },
  {
    id: "taj",
    name: "Taj Mahal",
    state: "Uttar Pradesh",
    era: "17th Century CE · 1632 AD",
    tagline: "An Eternal Ode in White Marble",
    description:
      "Built by Mughal Emperor Shah Jahan in memory of his beloved wife Mumtaz Mahal, the Taj Mahal stands as the world's greatest monument to love — a perfect symphony of Persian, Islamic and Indian architecture.",
    facts: ["22 years to build", "20,000 artisans", "Pure white marble", "UNESCO World Heritage"],
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1400&q=90",
    color: "#E8D5B7",
    accent: "#A0856B",
    num: "02",
  },
  {
    id: "ajanta",
    name: "Ajanta Caves",
    state: "Maharashtra",
    era: "2nd Century BCE – 5th Century CE",
    tagline: "Where Stone Speaks in Colour",
    description:
      "Carved into a horseshoe-shaped cliff above the Waghora river, the 30 Ajanta Caves preserve India's most breathtaking ancient Buddhist murals — masterpieces of narrative art that have survived over 2,000 years.",
    facts: ["30 rock-cut caves", "Finest Asian murals", "UNESCO 1983", "Buddhist heritage"],
    image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=1400&q=90",
    color: "#E07B54",
    accent: "#8B5E3C",
    num: "03",
  },
  {
    id: "jaipur",
    name: "Amber Fort",
    state: "Rajasthan",
    era: "16th Century CE · 1592 AD",
    tagline: "The Golden Fortress of the Rajputs",
    description:
      "Perched dramatically on a rugged hilltop overlooking Maota Lake, Amber Fort is a masterpiece of Rajput military architecture. Its blend of Hindu and Mughal styles created one of India's most photographed monuments.",
    facts: ["Built in 1592", "Sheesh Mahal mirror palace", "UNESCO 2013", "Rajput architecture"],
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1400&q=90",
    color: "#D4A84C",
    accent: "#8B6914",
    num: "04",
  },
];

export default function DiscoveryTour({ onClose, onViewAR }) {
  const [current, setCurrent]   = useState(0);
  const [animDir, setAnimDir]   = useState("next"); // "next" | "prev"
  const [transitioning, setTransitioning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused]     = useState(false);

  const DURATION = 6000; // ms per slide

  const goTo = useCallback((index, dir = "next") => {
    if (transitioning) return;
    setAnimDir(dir);
    setTransitioning(true);
    setProgress(0);
    setTimeout(() => {
      setCurrent(index);
      setTransitioning(false);
    }, 600);
  }, [transitioning]);

  const next = useCallback(() => {
    goTo((current + 1) % SITES.length, "next");
  }, [current, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + SITES.length) % SITES.length, "prev");
  }, [current, goTo]);

  // Auto-advance
  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { next(); return 0; }
        return p + (100 / (DURATION / 100));
      });
    }, 100);
    return () => clearInterval(interval);
  }, [paused, next]);

  // Keyboard
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft")  prev();
      if (e.key === "Escape")     onClose();
      if (e.key === " ")          setPaused(p => !p);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, prev, onClose]);

  const site = SITES[current];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;500&display=swap');

        .dt-overlay {
          position: fixed; inset: 0; z-index: 10000;
          background: #050A0F;
          font-family: 'DM Sans', sans-serif;
          overflow: hidden;
        }

        /* ── Background image ── */
        .dt-bg {
          position: absolute; inset: 0;
          transition: opacity 0.6s ease;
        }
        .dt-bg img {
          width: 100%; height: 100%;
          object-fit: cover;
          filter: brightness(0.35) saturate(0.8);
          transition: transform 8s ease;
          transform: scale(1.08);
        }
        .dt-bg.playing img { transform: scale(1); }
        .dt-bg-gradient {
          position: absolute; inset: 0;
          background: linear-gradient(
            105deg,
            rgba(5,10,15,0.95) 0%,
            rgba(5,10,15,0.7) 50%,
            rgba(5,10,15,0.4) 100%
          );
        }

        /* ── Slide transition ── */
        .dt-content {
          position: absolute; inset: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 0 8vw;
          transition: opacity 0.5s ease, transform 0.5s ease;
        }
        .dt-content.exit-next  { opacity: 0; transform: translateX(-60px); }
        .dt-content.exit-prev  { opacity: 0; transform: translateX(60px); }
        .dt-content.enter      { opacity: 1; transform: translateX(0); }

        /* ── Top bar ── */
        .dt-topbar {
          position: absolute; top: 0; left: 0; right: 0;
          display: flex; align-items: center; justify-content: space-between;
          padding: 1.5rem 2.5rem;
          z-index: 20;
        }
        .dt-logo {
          font-family: 'Space Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.25em;
          color: rgba(255,255,255,0.35);
          text-transform: uppercase;
        }
        .dt-topbar-right {
          display: flex; align-items: center; gap: 0.75rem;
        }
        .dt-pause-btn {
          width: 36px; height: 36px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 50%;
          color: rgba(255,255,255,0.5);
          font-size: 0.75rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .dt-pause-btn:hover { background: rgba(255,255,255,0.12); color: #fff; }
        .dt-close-btn {
          width: 36px; height: 36px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 50%;
          color: rgba(255,255,255,0.5);
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .dt-close-btn:hover { background: rgba(201,168,76,0.2); border-color: rgba(201,168,76,0.4); color: #C9A84C; }

        /* ── Site number ── */
        .dt-num {
          font-family: 'Playfair Display', serif;
          font-size: clamp(6rem, 14vw, 12rem);
          font-weight: 900;
          color: transparent;
          -webkit-text-stroke: 1px rgba(255,255,255,0.06);
          line-height: 1;
          position: absolute;
          right: 6vw;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          user-select: none;
        }

        /* ── Main content ── */
        .dt-eyebrow {
          font-family: 'Space Mono', monospace;
          font-size: 0.58rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--site-color, #C9A84C);
          margin-bottom: 1.2rem;
          display: flex; align-items: center; gap: 0.8rem;
        }
        .dt-eyebrow::before {
          content: '';
          width: 40px; height: 1px;
          background: var(--site-color, #C9A84C);
        }

        .dt-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(3rem, 7vw, 6rem);
          font-weight: 900;
          color: #F5EFE0;
          line-height: 1.05;
          margin-bottom: 0.6rem;
          max-width: 700px;
        }

        .dt-tagline {
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-size: clamp(1rem, 2.2vw, 1.4rem);
          color: rgba(245,239,224,0.45);
          margin-bottom: 1.8rem;
        }

        .dt-divider {
          width: 60px; height: 2px;
          background: var(--site-color, #C9A84C);
          margin-bottom: 1.8rem;
          border-radius: 2px;
        }

        .dt-description {
          font-size: clamp(0.85rem, 1.4vw, 1rem);
          color: rgba(245,239,224,0.6);
          line-height: 1.8;
          max-width: 520px;
          margin-bottom: 2.5rem;
        }

        /* ── Facts row ── */
        .dt-facts {
          display: flex; flex-wrap: wrap; gap: 0.6rem;
          margin-bottom: 3rem;
        }
        .dt-fact {
          font-family: 'Space Mono', monospace;
          font-size: 0.55rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--site-color, #C9A84C);
          background: rgba(0,0,0,0.3);
          border: 1px solid rgba(201,168,76,0.2);
          border-radius: 4px;
          padding: 5px 12px;
        }

        /* ── Action buttons ── */
        .dt-actions {
          display: flex; gap: 1rem; flex-wrap: wrap;
        }
        .dt-btn-primary {
          display: flex; align-items: center; gap: 0.6rem;
          padding: 0.9rem 2rem;
          background: linear-gradient(135deg, var(--site-color, #C9A84C), #E8C96A);
          color: #0D1B2A;
          border: none;
          border-radius: 4px;
          font-family: 'Space Mono', monospace;
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.25s;
        }
        .dt-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(201,168,76,0.35);
        }
        .dt-btn-secondary {
          display: flex; align-items: center; gap: 0.6rem;
          padding: 0.9rem 2rem;
          background: transparent;
          color: rgba(245,239,224,0.7);
          border: 1px solid rgba(245,239,224,0.2);
          border-radius: 4px;
          font-family: 'Space Mono', monospace;
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.25s;
        }
        .dt-btn-secondary:hover {
          background: rgba(201,168,76,0.08);
          border-color: rgba(201,168,76,0.4);
          color: #C9A84C;
        }

        /* ── Bottom nav ── */
        .dt-bottom {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          padding: 1.5rem 2.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          z-index: 20;
        }

        /* Progress bars */
        .dt-progress-bars {
          display: flex; gap: 6px; align-items: center;
        }
        .dt-progress-bar {
          height: 2px;
          background: rgba(255,255,255,0.15);
          border-radius: 2px;
          overflow: hidden;
          cursor: pointer;
          transition: width 0.3s ease;
        }
        .dt-progress-bar.active { width: 60px; }
        .dt-progress-bar:not(.active) { width: 20px; }
        .dt-progress-fill {
          height: 100%;
          background: #C9A84C;
          border-radius: 2px;
          transition: width 0.1s linear;
        }
        .dt-progress-bar:not(.active) .dt-progress-fill {
          width: 0%;
        }

        /* Prev / next arrows */
        .dt-nav-arrows { display: flex; gap: 0.5rem; }
        .dt-arrow {
          width: 44px; height: 44px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 50%;
          color: rgba(255,255,255,0.5);
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .dt-arrow:hover {
          background: rgba(201,168,76,0.15);
          border-color: rgba(201,168,76,0.4);
          color: #C9A84C;
        }

        /* Counter */
        .dt-counter {
          font-family: 'Space Mono', monospace;
          font-size: 0.6rem;
          color: rgba(255,255,255,0.25);
          letter-spacing: 0.1em;
        }
        .dt-counter span { color: rgba(255,255,255,0.55); }

        /* State indicator dot */
        .dt-state-row {
          display: flex; align-items: center; gap: 0.5rem;
          margin-bottom: 2rem;
        }
        .dt-state-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--site-color, #C9A84C);
          animation: dtPulse 2s infinite;
        }
        @keyframes dtPulse {
          0%,100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        .dt-state-text {
          font-family: 'Space Mono', monospace;
          font-size: 0.5rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.25);
        }

        /* Right side image panel */
        .dt-right-panel {
          position: absolute;
          right: 0; top: 0; bottom: 0;
          width: 38%;
          overflow: hidden;
          pointer-events: none;
        }
        .dt-right-img {
          width: 100%; height: 100%;
          object-fit: cover;
          filter: brightness(0.5) saturate(0.7);
          mask-image: linear-gradient(to right, transparent 0%, rgba(0,0,0,0.7) 40%, black 100%);
          -webkit-mask-image: linear-gradient(to right, transparent 0%, rgba(0,0,0,0.7) 40%, black 100%);
          transition: opacity 0.6s ease;
        }
        .dt-right-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to right, #050A0F 0%, transparent 40%);
        }

        /* Mobile */
        @media (max-width: 768px) {
          .dt-content { padding: 0 6vw; justify-content: flex-end; padding-bottom: 140px; }
          .dt-right-panel { display: none; }
          .dt-num { font-size: 5rem; right: 4vw; opacity: 0.4; }
          .dt-title { font-size: 2.4rem; }
          .dt-description { font-size: 0.85rem; }
          .dt-actions { flex-direction: column; }
          .dt-btn-primary, .dt-btn-secondary { justify-content: center; }
        }
      `}</style>

      <div className="dt-overlay">

        {/* Full background */}
        <div className="dt-bg">
          <img
            key={site.id + "-bg"}
            src={site.image}
            alt={site.name}
            className="playing"
          />
          <div className="dt-bg-gradient" />
        </div>

        {/* Right image panel */}
        <div className="dt-right-panel">
          <img
            key={site.id + "-right"}
            src={site.image}
            alt={site.name}
            className="dt-right-img"
          />
          <div className="dt-right-overlay" />
        </div>

        {/* Ghost number */}
        <div className="dt-num" style={{ "--site-color": site.color }}>{site.num}</div>

        {/* Top bar */}
        <div className="dt-topbar">
          <div className="dt-logo">Bharatiya Dharohar · Heritage Tour</div>
          <div className="dt-topbar-right">
            <button
              className="dt-pause-btn"
              onClick={() => setPaused(p => !p)}
              title={paused ? "Play" : "Pause"}
            >
              {paused ? "▶" : "⏸"}
            </button>
            <button className="dt-close-btn" onClick={onClose}>✕</button>
          </div>
        </div>

        {/* Main slide content */}
        <div
          className={`dt-content ${transitioning ? `exit-${animDir}` : "enter"}`}
          style={{ "--site-color": site.color }}
        >
          <div className="dt-state-row">
            <div className="dt-state-dot" />
            <div className="dt-state-text">Live · Heritage Discovery</div>
          </div>

          <div className="dt-eyebrow">
            {site.state} &nbsp;·&nbsp; {site.era}
          </div>

          <h1 className="dt-title">{site.name}</h1>
          <div className="dt-tagline">{site.tagline}</div>
          <div className="dt-divider" />
          <p className="dt-description">{site.description}</p>

          <div className="dt-facts">
            {site.facts.map((f, i) => (
              <span key={i} className="dt-fact">✦ {f}</span>
            ))}
          </div>

          <div className="dt-actions">
            <button
              className="dt-btn-primary"
              onClick={() => onViewAR && onViewAR(site)}
            >
              📱 View in AR
            </button>
            <button
              className="dt-btn-secondary"
              onClick={next}
            >
              Next Site →
            </button>
          </div>
        </div>

        {/* Bottom controls */}
        <div className="dt-bottom">
          <div className="dt-progress-bars">
            {SITES.map((s, i) => (
              <div
                key={s.id}
                className={`dt-progress-bar ${i === current ? "active" : ""}`}
                onClick={() => goTo(i, i > current ? "next" : "prev")}
                title={s.name}
              >
                <div
                  className="dt-progress-fill"
                  style={{ width: i === current ? `${progress}%` : i < current ? "100%" : "0%" }}
                />
              </div>
            ))}
          </div>

          <div className="dt-counter">
            <span>{String(current + 1).padStart(2, "0")}</span> / {String(SITES.length).padStart(2, "0")}
          </div>

          <div className="dt-nav-arrows">
            <button className="dt-arrow" onClick={prev}>←</button>
            <button className="dt-arrow" onClick={next}>→</button>
          </div>
        </div>

      </div>
    </>
  );
}