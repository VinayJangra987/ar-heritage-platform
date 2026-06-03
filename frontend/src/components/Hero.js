// src/components/Hero.js
import { useState, useEffect, useCallback } from "react";
import ARView from "./ARView";
// ─── Discovery Tour Sites ───────────────────────────────────────────────────
const TOUR_SITES = [
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
    num: "04",
  },
];

// ─── AR Launcher Steps ──────────────────────────────────────────────────────
const AR_STEPS = [
  { id: "init",    label: "Initialising AR Engine",   duration: 800 },
  { id: "camera", label: "Accessing Camera Sensors",  duration: 900 },
  { id: "map",    label: "Loading Heritage Data",     duration: 700 },
  { id: "anchor", label: "Calibrating World Anchors", duration: 900 },
  { id: "ready",  label: "AR Experience Ready",       duration: 600 },
];

// ─── Hero Slides ────────────────────────────────────────────────────────────
const heroSlides = [
  {
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1800&q=80",
    title: "Taj Mahal",
    subtitle: "Agra, Uttar Pradesh",
    caption: "A testament to eternal love",
  },
  {
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1800&q=80",
    title: "Amber Fort",
    subtitle: "Jaipur, Rajasthan",
    caption: "Where Rajput glory endures",
  },
  {
    image: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=1800&q=80",
    title: "Hampi Ruins",
    subtitle: "Karnataka",
    caption: "The lost empire of Vijayanagara",
  },
  {
    image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=1800&q=80",
    title: "Ajanta Caves",
    subtitle: "Aurangabad, Maharashtra",
    caption: "Ancient art carved in rock",
  },
];

// ════════════════════════════════════════════════════════════════════════════
// DiscoveryTour — inline component
// ════════════════════════════════════════════════════════════════════════════
function DiscoveryTour({ onClose, onViewAR }) {
  const [current, setCurrent]         = useState(0);
  const [animDir, setAnimDir]         = useState("next");
  const [transitioning, setTransitioning] = useState(false);
  const [progress, setProgress]       = useState(0);
  const [paused, setPaused]           = useState(false);
  const DURATION = 6000;

  const goTo = useCallback((index, dir = "next") => {
    if (transitioning) return;
    setAnimDir(dir);
    setTransitioning(true);
    setProgress(0);
    setTimeout(() => { setCurrent(index); setTransitioning(false); }, 600);
  }, [transitioning]);

  const next = useCallback(() => goTo((current + 1) % TOUR_SITES.length, "next"), [current, goTo]);
  const prev = useCallback(() => goTo((current - 1 + TOUR_SITES.length) % TOUR_SITES.length, "prev"), [current, goTo]);

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

  const site = TOUR_SITES[current];

  return (
    <>
      <style>{`
        @keyframes dtFadeIn { from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)} }
        @keyframes dtPulse  { 0%,100%{opacity:1}50%{opacity:0.3} }

        .dt-overlay {
          position: fixed; inset: 0; z-index: 10000;
          background: #050A0F;
          font-family: 'Poppins', sans-serif;
          overflow: hidden;
          animation: dtFadeIn 0.35s ease;
        }
        .dt-bg { position: absolute; inset: 0; }
        .dt-bg img {
          width: 100%; height: 100%;
          object-fit: cover;
          filter: brightness(0.32) saturate(0.8);
          transform: scale(1.04);
          transition: opacity 0.6s ease;
        }
        .dt-bg-gradient {
          position: absolute; inset: 0;
          background: linear-gradient(105deg, rgba(5,10,15,0.95) 0%, rgba(5,10,15,0.65) 50%, rgba(5,10,15,0.35) 100%);
        }
        .dt-right-panel {
          position: absolute; right: 0; top: 0; bottom: 0; width: 38%;
          overflow: hidden; pointer-events: none;
        }
        .dt-right-img {
          width: 100%; height: 100%; object-fit: cover;
          filter: brightness(0.45) saturate(0.7);
          mask-image: linear-gradient(to right, transparent 0%, rgba(0,0,0,0.6) 40%, black 100%);
          -webkit-mask-image: linear-gradient(to right, transparent 0%, rgba(0,0,0,0.6) 40%, black 100%);
        }
        .dt-right-overlay { position: absolute; inset: 0; background: linear-gradient(to right, #050A0F 0%, transparent 40%); }

        .dt-num {
          position: absolute; right: 6vw; top: 50%; transform: translateY(-50%);
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(6rem, 14vw, 12rem); font-weight: 900;
          color: transparent; -webkit-text-stroke: 1px rgba(255,255,255,0.05);
          pointer-events: none; user-select: none; line-height: 1;
        }
        .dt-topbar {
          position: absolute; top: 0; left: 0; right: 0;
          display: flex; align-items: center; justify-content: space-between;
          padding: 1.5rem 2.5rem; z-index: 20;
        }
        .dt-logo {
          font-family: 'Space Mono', monospace; font-size: 0.6rem;
          letter-spacing: 0.25em; text-transform: uppercase; color: rgba(255,255,255,0.3);
        }
        .dt-topbar-right { display: flex; align-items: center; gap: 0.75rem; }
        .dt-icon-btn {
          width: 36px; height: 36px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12);
          color: rgba(255,255,255,0.5); font-size: 0.8rem; cursor: pointer; transition: all 0.2s;
        }
        .dt-icon-btn:hover { background: rgba(255,255,255,0.12); color: #fff; }
        .dt-icon-btn.close:hover { background: rgba(201,168,76,0.15); border-color: rgba(201,168,76,0.4); color: #C9A84C; }

        .dt-content {
          position: absolute; inset: 0;
          display: flex; flex-direction: column; justify-content: center;
          padding: 0 8vw;
          transition: opacity 0.5s ease, transform 0.5s ease;
        }
        .dt-content.exit-next { opacity: 0; transform: translateX(-60px); }
        .dt-content.exit-prev { opacity: 0; transform: translateX(60px); }
        .dt-content.enter    { opacity: 1; transform: translateX(0); }

        .dt-state-row { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 2rem; }
        .dt-state-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--sc); animation: dtPulse 2s infinite; }
        .dt-state-text { font-family: 'Space Mono', monospace; font-size: 0.5rem; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(255,255,255,0.25); }

        .dt-eyebrow {
          font-family: 'Space Mono', monospace; font-size: 0.58rem;
          letter-spacing: 0.3em; text-transform: uppercase; color: var(--sc);
          margin-bottom: 1.2rem; display: flex; align-items: center; gap: 0.8rem;
        }
        .dt-eyebrow::before { content: ''; width: 40px; height: 1px; background: var(--sc); }
        .dt-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(3rem, 7vw, 6rem); font-weight: 900;
          color: #F5EFE0; line-height: 1.05; margin-bottom: 0.6rem; max-width: 700px;
        }
        .dt-tagline {
          font-family: 'Cormorant Garamond', serif; font-style: italic;
          font-size: clamp(1rem, 2.2vw, 1.4rem); color: rgba(245,239,224,0.4);
          margin-bottom: 1.8rem;
        }
        .dt-divider { width: 60px; height: 2px; background: var(--sc); margin-bottom: 1.8rem; border-radius: 2px; }
        .dt-description {
          font-size: clamp(0.82rem, 1.4vw, 0.96rem); color: rgba(245,239,224,0.58);
          line-height: 1.85; max-width: 520px; margin-bottom: 2rem;
        }
        .dt-facts { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 2.5rem; }
        .dt-fact {
          font-family: 'Space Mono', monospace; font-size: 0.52rem;
          letter-spacing: 0.1em; text-transform: uppercase; color: var(--sc);
          background: rgba(0,0,0,0.3); border: 1px solid rgba(201,168,76,0.2);
          border-radius: 4px; padding: 4px 10px;
        }
        .dt-actions { display: flex; gap: 1rem; flex-wrap: wrap; }
        .dt-btn-primary {
          display: flex; align-items: center; gap: 0.6rem;
          padding: 0.85rem 1.8rem; border-radius: 4px; border: none;
          background: linear-gradient(135deg, var(--sc, #C9A84C), #E8C96A);
          color: #0D1B2A; font-family: 'Space Mono', monospace;
          font-size: 0.58rem; font-weight: 700; letter-spacing: 0.15em;
          text-transform: uppercase; cursor: pointer; transition: all 0.25s;
        }
        .dt-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(201,168,76,0.35); }
        .dt-btn-secondary {
          display: flex; align-items: center; gap: 0.6rem;
          padding: 0.85rem 1.8rem; border-radius: 4px;
          background: transparent; color: rgba(245,239,224,0.7);
          border: 1px solid rgba(245,239,224,0.2);
          font-family: 'Space Mono', monospace; font-size: 0.58rem;
          font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase;
          cursor: pointer; transition: all 0.25s;
        }
        .dt-btn-secondary:hover { background: rgba(201,168,76,0.08); border-color: rgba(201,168,76,0.4); color: #C9A84C; }

        .dt-bottom {
          position: absolute; bottom: 0; left: 0; right: 0;
          padding: 1.5rem 2.5rem;
          display: flex; align-items: center; justify-content: space-between; z-index: 20;
        }
        .dt-progress-bars { display: flex; gap: 6px; align-items: center; }
        .dt-progress-bar {
          height: 2px; background: rgba(255,255,255,0.12);
          border-radius: 2px; overflow: hidden; cursor: pointer; transition: width 0.3s ease;
        }
        .dt-progress-bar.active { width: 60px; }
        .dt-progress-bar:not(.active) { width: 20px; }
        .dt-progress-fill { height: 100%; background: #C9A84C; border-radius: 2px; transition: width 0.1s linear; }
        .dt-counter { font-family: 'Space Mono', monospace; font-size: 0.6rem; color: rgba(255,255,255,0.25); letter-spacing: 0.1em; }
        .dt-counter span { color: rgba(255,255,255,0.55); }
        .dt-nav-arrows { display: flex; gap: 0.5rem; }
        .dt-arrow {
          width: 44px; height: 44px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.5);
          font-size: 1rem; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s;
        }
        .dt-arrow:hover { background: rgba(201,168,76,0.15); border-color: rgba(201,168,76,0.4); color: #C9A84C; }

        @media (max-width: 768px) {
          .dt-content { padding: 0 6vw; justify-content: flex-end; padding-bottom: 130px; }
          .dt-right-panel { display: none; }
          .dt-title { font-size: 2.4rem; }
        }
      `}</style>

      <div className="dt-overlay">
        <div className="dt-bg">
          <img key={site.id} src={site.image} alt={site.name} />
          <div className="dt-bg-gradient" />
        </div>
        <div className="dt-right-panel">
          <img className="dt-right-img" src={site.image} alt={site.name} />
          <div className="dt-right-overlay" />
        </div>
        <div className="dt-num">{site.num}</div>

        <div className="dt-topbar">
          <div className="dt-logo">Bharatiya Dharohar · Heritage Tour</div>
          <div className="dt-topbar-right">
            <button className="dt-icon-btn" onClick={() => setPaused(p => !p)} title={paused ? "Play" : "Pause"}>
              {paused ? "▶" : "⏸"}
            </button>
            <button className="dt-icon-btn close" onClick={onClose}>✕</button>
          </div>
        </div>

        <div
          className={`dt-content ${transitioning ? `exit-${animDir}` : "enter"}`}
          style={{ "--sc": site.color }}
        >
          <div className="dt-state-row">
            <div className="dt-state-dot" style={{ "--sc": site.color }} />
            <div className="dt-state-text">Live · Heritage Discovery</div>
          </div>
          <div className="dt-eyebrow">{site.state} &nbsp;·&nbsp; {site.era}</div>
          <h2 className="dt-title">{site.name}</h2>
          <div className="dt-tagline">{site.tagline}</div>
          <div className="dt-divider" />
          <p className="dt-description">{site.description}</p>
          <div className="dt-facts">
            {site.facts.map((f, i) => <span key={i} className="dt-fact">✦ {f}</span>)}
          </div>
          <div className="dt-actions">
            <button className="dt-btn-primary" onClick={() => onViewAR(site)}>📱 View in AR</button>
            <button className="dt-btn-secondary" onClick={next}>Next Site →</button>
          </div>
        </div>

        <div className="dt-bottom">
          <div className="dt-progress-bars">
            {TOUR_SITES.map((s, i) => (
              <div
                key={s.id}
                className={`dt-progress-bar ${i === current ? "active" : ""}`}
                onClick={() => goTo(i, i > current ? "next" : "prev")}
              >
                <div className="dt-progress-fill"
                  style={{ width: i === current ? `${progress}%` : i < current ? "100%" : "0%" }}
                />
              </div>
            ))}
          </div>
          <div className="dt-counter"><span>{String(current + 1).padStart(2, "0")}</span> / {String(TOUR_SITES.length).padStart(2, "0")}</div>
          <div className="dt-nav-arrows">
            <button className="dt-arrow" onClick={prev}>←</button>
            <button className="dt-arrow" onClick={next}>→</button>
          </div>
        </div>
      </div>
    </>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// ARLauncher — inline component
// ════════════════════════════════════════════════════════════════════════════
function ARLauncher({ onComplete, onCancel, siteName }) {
  const [step,      setStep]      = useState(0);
  const [done,      setDone]      = useState(false);
  const [scanAngle, setScanAngle] = useState(0);
  const [dots,      setDots]      = useState("");

  useEffect(() => {
    const t = setInterval(() => setDots(d => d.length >= 3 ? "" : d + "."), 400);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    let raf;
    const animate = () => { setScanAngle(a => (a + 1.2) % 360); raf = requestAnimationFrame(animate); };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (step >= AR_STEPS.length) { setDone(true); return; }
    const t = setTimeout(() => setStep(s => s + 1), AR_STEPS[step]?.duration || 700);
    return () => clearTimeout(t);
  }, [step]);

  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => onComplete(), 900);
    return () => clearTimeout(t);
  }, [done, onComplete]);

  const progress = Math.min(100, (step / AR_STEPS.length) * 100);

  return (
    <>
      <style>{`
        @keyframes arlGridShift { from{background-position:0 0}to{background-position:40px 40px} }
        @keyframes arlRingSpin  { to{transform:rotate(360deg)} }
        @keyframes arlPulse     { from{box-shadow:0 0 0 0 rgba(201,168,76,0.3)}to{box-shadow:0 0 0 6px rgba(201,168,76,0)} }

        .arl-overlay {
          position: fixed; inset: 0; z-index: 10001;
          background: #020810;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          font-family: 'Space Mono', monospace; overflow: hidden;
        }
        .arl-grid {
          position: absolute; inset: 0;
          background-image: linear-gradient(rgba(0,200,255,0.03) 1px,transparent 1px), linear-gradient(90deg,rgba(0,200,255,0.03) 1px,transparent 1px);
          background-size: 40px 40px; animation: arlGridShift 8s linear infinite;
        }
        .arl-glow {
          position: absolute; width: 600px; height: 600px; border-radius: 50%;
          background: radial-gradient(circle, rgba(201,168,76,0.07) 0%, transparent 70%);
          pointer-events: none;
        }
        .arl-scanlines {
          position: absolute; inset: 0; pointer-events: none;
          background: repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.03) 2px,rgba(0,0,0,0.03) 4px);
        }
        .arl-scanner-wrap {
          position: relative; width: 220px; height: 220px; margin-bottom: 3rem; flex-shrink: 0;
        }
        .arl-ring { position: absolute; inset: 0; border-radius: 50%; }
        .arl-ring-1 { border: 1px solid rgba(201,168,76,0.15); }
        .arl-ring-2 { inset: 16px; border: 1px solid rgba(0,200,255,0.1); animation: arlRingSpin 4s linear infinite; }
        .arl-ring-3 { inset: 32px; border: 1px solid rgba(201,168,76,0.2); animation: arlRingSpin 6s linear infinite reverse; }
        .arl-scan-line { position: absolute; inset: 0; border-radius: 50%; overflow: hidden; }
        .arl-scan-line::after {
          content: ''; position: absolute; top: 50%; left: 50%;
          width: 50%; height: 1px;
          background: linear-gradient(to right, transparent, rgba(201,168,76,0.8));
          transform-origin: left center; transform: rotate(var(--ang));
        }
        .arl-scanner-center {
          position: absolute; inset: 48px; border-radius: 50%;
          background: rgba(201,168,76,0.04); border: 1px solid rgba(201,168,76,0.12);
          display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 4px;
        }
        .arl-scanner-icon { font-size: 2rem; filter: drop-shadow(0 0 12px rgba(201,168,76,0.6)); }
        .arl-scanner-label { font-size: 0.42rem; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(201,168,76,0.6); }

        .arl-corner { position: absolute; width: 18px; height: 18px; }
        .arl-corner::before,.arl-corner::after { content:'';position:absolute;background:#C9A84C;border-radius:1px; }
        .arl-corner.tl{top:0;left:0} .arl-corner.tr{top:0;right:0} .arl-corner.bl{bottom:0;left:0} .arl-corner.br{bottom:0;right:0}
        .arl-corner.tl::before{width:2px;height:100%;top:0;left:0} .arl-corner.tl::after{width:100%;height:2px;top:0;left:0}
        .arl-corner.tr::before{width:2px;height:100%;top:0;right:0} .arl-corner.tr::after{width:100%;height:2px;top:0;right:0}
        .arl-corner.bl::before{width:2px;height:100%;bottom:0;left:0} .arl-corner.bl::after{width:100%;height:2px;bottom:0;left:0}
        .arl-corner.br::before{width:2px;height:100%;bottom:0;right:0} .arl-corner.br::after{width:100%;height:2px;bottom:0;right:0}

        .arl-title { font-size: clamp(1.2rem,3vw,1.6rem); font-weight: 700; color: #F2E8D0; letter-spacing: 0.1em; text-align: center; margin-bottom: 0.4rem; }
        .arl-subtitle { font-size: 0.58rem; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(242,232,208,0.3); text-align: center; margin-bottom: 2.5rem; }
        .arl-site-name { color: #C9A84C; font-weight: 700; }

        .arl-steps { display: flex; flex-direction: column; gap: 0.6rem; width: 300px; margin-bottom: 2rem; }
        .arl-step {
          display: flex; align-items: center; gap: 0.75rem;
          font-size: 0.53rem; letter-spacing: 0.1em; text-transform: uppercase;
          color: rgba(242,232,208,0.2); transition: color 0.3s ease;
        }
        .arl-step.active   { color: rgba(242,232,208,0.75); }
        .arl-step.complete { color: rgba(74,200,120,0.7); }
        .arl-step-indicator {
          width: 20px; height: 20px; border-radius: 50%; border: 1px solid currentColor;
          display: flex; align-items: center; justify-content: center; font-size: 0.55rem; flex-shrink: 0;
        }
        .arl-step.active .arl-step-indicator { border-color: #C9A84C; background: rgba(201,168,76,0.1); color: #C9A84C; animation: arlPulse 0.8s infinite alternate; }
        .arl-step.complete .arl-step-indicator { border-color: rgba(74,200,120,0.7); background: rgba(74,200,120,0.1); color: rgba(74,200,120,0.9); }

        .arl-progress-wrap { width: 300px; margin-bottom: 2rem; }
        .arl-progress-label { display: flex; justify-content: space-between; font-size: 0.48rem; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(242,232,208,0.25); margin-bottom: 6px; }
        .arl-progress-track { height: 2px; background: rgba(255,255,255,0.06); border-radius: 2px; overflow: hidden; }
        .arl-progress-fill { height: 100%; background: linear-gradient(to right, #8B6914, #C9A84C, #E8C96A); border-radius: 2px; transition: width 0.4s ease; position: relative; }
        .arl-progress-fill::after { content:''; position:absolute; right:0; top:-3px; width:8px; height:8px; border-radius:50%; background:#E8C96A; box-shadow:0 0 8px rgba(232,201,106,0.8); }

        .arl-ready-badge {
          display: flex; align-items: center; gap: 0.6rem;
          padding: 0.6rem 1.5rem;
          background: rgba(74,200,120,0.1); border: 1px solid rgba(74,200,120,0.3); border-radius: 50px;
          font-size: 0.55rem; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(74,200,120,0.8);
          opacity: 0; transition: opacity 0.5s ease;
        }
        .arl-ready-badge.visible { opacity: 1; }
        .arl-ready-dot { width: 6px; height: 6px; border-radius: 50%; background: rgba(74,200,120,0.8); animation: arlPulse 0.6s infinite alternate; }

        .arl-cancel {
          position: absolute; bottom: 2rem;
          font-size: 0.52rem; letter-spacing: 0.15em; text-transform: uppercase;
          color: rgba(242,232,208,0.2); background: none; border: none; cursor: pointer; transition: color 0.2s;
        }
        .arl-cancel:hover { color: rgba(242,232,208,0.5); }
      `}</style>

      <div className="arl-overlay">
        <div className="arl-grid" />
        <div className="arl-glow" />
        <div className="arl-scanlines" />

        <div className="arl-scanner-wrap">
          <div className="arl-ring arl-ring-1" />
          <div className="arl-ring arl-ring-2" />
          <div className="arl-ring arl-ring-3" />
          <div className="arl-scan-line" style={{ "--ang": `${scanAngle}deg` }} />
          <div className="arl-corner tl" /><div className="arl-corner tr" />
          <div className="arl-corner bl" /><div className="arl-corner br" />
          <div className="arl-scanner-center">
            <div className="arl-scanner-icon">📱</div>
            <div className="arl-scanner-label">AR Mode</div>
          </div>
        </div>

        <div className="arl-title">Augmented Reality</div>
        <div className="arl-subtitle">
          Loading{dots}&nbsp;
          {siteName && <span className="arl-site-name">{siteName}</span>}
        </div>

        <div className="arl-steps">
          {AR_STEPS.map((s, i) => (
            <div key={s.id} className={`arl-step ${i < step ? "complete" : i === step ? "active" : ""}`}>
              <div className="arl-step-indicator">{i < step ? "✓" : i === step ? "◉" : "○"}</div>
              <div>{s.label}</div>
            </div>
          ))}
        </div>

        <div className="arl-progress-wrap">
          <div className="arl-progress-label"><span>Initialising</span><span>{Math.round(progress)}%</span></div>
          <div className="arl-progress-track">
            <div className="arl-progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className={`arl-ready-badge ${done ? "visible" : ""}`}>
          <div className="arl-ready-dot" />
          AR Experience Ready — Launching
        </div>

        <button className="arl-cancel" onClick={onCancel}>✕ Cancel</button>
      </div>
    </>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// Main Hero Component
// ════════════════════════════════════════════════════════════════════════════
export default function Hero({ onExplore }) {
  const [current, setCurrent]         = useState(0);
  const [fading, setFading]           = useState(false);
  const [showTour, setShowTour]       = useState(false);
  const [showARLaunch, setShowARLaunch] = useState(false);
  const [showARView, setShowARView]   = useState(false);
  const [arSite, setArSite]           = useState(null);

  // Hero auto-slide
  useEffect(() => {
    const timer = setInterval(() => {
      setFading(true);
      setTimeout(() => { setCurrent((c) => (c + 1) % heroSlides.length); setFading(false); }, 600);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  const handleOpenAR = (site = null) => {
    setArSite(site);
    setShowTour(false);
    setShowARLaunch(true);
  };

  const handleARLaunchComplete = () => {
    setShowARLaunch(false);
    setShowARView(true);
  };

  const slide = heroSlides[current];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Space+Mono:wght@400;700&family=Poppins:wght@300;400;500&display=swap');

        :root {
          --gold: #C9A84C; --gold-light: #E8C96A; --gold-dim: rgba(201,168,76,0.15);
          --navy: #0D1B2A; --navy-mid: #1A2E44; --teal: #1A6B72;
          --cream: #F2E8D0; --cream-dim: rgba(242,232,208,0.7);
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: var(--navy); color: var(--cream); font-family: 'Poppins', sans-serif; overflow-x: hidden; }

        .hero { position: relative; height: 100vh; min-height: 680px; display: flex; align-items: flex-end; overflow: hidden; }
        .hero-bg { position: absolute; inset: 0; background-size: cover; background-position: center; transition: opacity 0.6s ease, transform 8s ease; transform: scale(1.05); }
        .hero-bg.fading { opacity: 0; }
        .hero-bg::after { content: ''; position: absolute; inset: 0; background: linear-gradient(to top, rgba(8,14,23,0.97) 0%, rgba(8,14,23,0.5) 40%, rgba(8,14,23,0.15) 70%, transparent 100%); }

        .hero-content { position: relative; z-index: 2; padding: 0 5vw 5rem; max-width: 900px; animation: heroSlideUp 0.8s ease both; }
        @keyframes heroSlideUp { from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)} }

        .hero-eyebrow { font-family:'Space Mono',monospace; font-size:0.65rem; color:var(--gold); letter-spacing:0.22em; text-transform:uppercase; margin-bottom:1rem; display:flex; align-items:center; gap:0.75rem; }
        .hero-eyebrow::before { content:''; display:block; width:30px; height:1px; background:var(--gold); }
        .hero-title { font-family:'Cormorant Garamond',serif; font-size:clamp(3.5rem,9vw,7.5rem); font-weight:700; line-height:0.92; color:var(--cream); margin-bottom:0.5rem; letter-spacing:-0.01em; }
        .hero-subtitle { font-family:'Space Mono',monospace; font-size:0.75rem; color:var(--gold); letter-spacing:0.15em; text-transform:uppercase; margin-bottom:1.25rem; }
        .hero-caption { font-family:'Poppins',sans-serif; font-size:1.05rem; color:var(--cream-dim); font-weight:300; font-style:italic; margin-bottom:2.5rem; }

        .hero-actions { display:flex; gap:1rem; flex-wrap:wrap; }
        .btn-primary { background:linear-gradient(135deg,var(--gold),var(--gold-light)); color:var(--navy); padding:0.85rem 2.2rem; border-radius:50px; font-family:'Space Mono',monospace; font-size:0.72rem; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; border:none; cursor:pointer; transition:all 0.3s; box-shadow:0 4px 25px rgba(201,168,76,0.35); }
        .btn-primary:hover { transform:translateY(-2px); box-shadow:0 8px 35px rgba(201,168,76,0.5); }
        .btn-secondary { background:transparent; color:var(--cream); padding:0.85rem 2.2rem; border-radius:50px; font-family:'Space Mono',monospace; font-size:0.72rem; letter-spacing:0.1em; text-transform:uppercase; border:1px solid rgba(242,232,208,0.3); cursor:pointer; transition:all 0.3s; }
        .btn-secondary:hover { background:rgba(242,232,208,0.06); border-color:var(--cream); }

        .hero-indicators { position:absolute; bottom:2.5rem; right:5vw; display:flex; gap:8px; z-index:3; }
        .hero-dot { width:6px; height:6px; border-radius:50%; background:rgba(242,232,208,0.3); cursor:pointer; transition:all 0.3s; }
        .hero-dot.active { background:var(--gold); width:24px; border-radius:3px; }

        .hero-stats { position:absolute; top:50%; right:5vw; transform:translateY(-50%); display:flex; flex-direction:column; gap:1.5rem; z-index:3; }
        .hero-stat { text-align:right; }
        .hero-stat-num { font-family:'Cormorant Garamond',serif; font-size:2rem; font-weight:700; color:var(--gold); line-height:1; }
        .hero-stat-label { font-family:'Space Mono',monospace; font-size:0.55rem; color:rgba(242,232,208,0.5); letter-spacing:0.15em; text-transform:uppercase; }

        @media (max-width: 768px) { .hero-stats{display:none} .hero-content{padding:0 1.5rem 4rem} }
      `}</style>

      {/* ── Hero Section ── */}
      <section className="hero" id="home">
        <div className={`hero-bg ${fading ? "fading" : ""}`} style={{ backgroundImage: `url(${slide.image})` }} />

        <div className="hero-stats">
          {[{ num: "3,000+", label: "Heritage Sites" }, { num: "40", label: "UNESCO Sites" }, { num: "28", label: "States" }].map((s) => (
            <div className="hero-stat" key={s.label}>
              <div className="hero-stat-num">{s.num}</div>
              <div className="hero-stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="hero-content">
          <div className="hero-eyebrow">AR Heritage Platform — India</div>
          <h1 className="hero-title">{slide.title}</h1>
          <div className="hero-subtitle">{slide.subtitle}</div>
          <p className="hero-caption">{slide.caption}</p>
          <div className="hero-actions">
            {/* BEGIN DISCOVERY → opens DiscoveryTour */}
            <button className="btn-primary" onClick={() => setShowTour(true)}>
              Begin Discovery
            </button>
            {/* VIEW IN AR → opens ARLauncher then ARView */}
            <button className="btn-secondary" onClick={() => handleOpenAR(null)}>
              ⬡ View in AR
            </button>
          </div>
        </div>

        <div className="hero-indicators">
          {heroSlides.map((_, i) => (
            <div
              key={i}
              className={`hero-dot ${i === current ? "active" : ""}`}
              onClick={() => { setFading(true); setTimeout(() => { setCurrent(i); setFading(false); }, 300); }}
            />
          ))}
        </div>
      </section>

      {/* ── Discovery Tour ── */}
      {showTour && (
        <DiscoveryTour
          onClose={() => setShowTour(false)}
          onViewAR={handleOpenAR}
        />
      )}

      {/* ── AR Launcher (cinematic intro) ── */}
      {showARLaunch && (
        <ARLauncher
          siteName={arSite?.name || "Heritage Site"}
          onComplete={handleARLaunchComplete}
          onCancel={() => setShowARLaunch(false)}
        />
      )}

      {/* ── AR View (actual 3D viewer) ── */}
      {showARView && (
        // Replace this div with your <ARView /> component import
        // e.g.: <ARView initialSite={arSite} onClose={() => setShowARView(false)} />
        <div style={{
          position: "fixed", inset: 0, zIndex: 10002,
          background: "#050A0F", display: "flex", alignItems: "center", justifyContent: "center",
          flexDirection: "column", gap: "1rem", fontFamily: "'Space Mono', monospace",
        }}>
          <div style={{ fontSize: "3rem" }}>📱</div>
          <div style={{ color: "#C9A84C", fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase" }}>
            AR View — {arSite?.name || "Heritage Site"}
          </div>
          <div style={{ color: "rgba(242,232,208,0.4)", fontSize: "0.6rem" }}>
            Import ARView component here
          </div>
          <button
            onClick={() => setShowARView(false)}
            style={{ marginTop: "1rem", background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.3)", color: "#C9A84C", padding: "0.6rem 1.5rem", borderRadius: "50px", cursor: "pointer", fontFamily: "inherit", fontSize: "0.58rem", letterSpacing: "0.12em" }}
          >
            ✕ Close
          </button>
        </div>
      )}
    </>
  );
}


<section className="category-section">

  <h2 className="category-title">
    Explore By Category
  </h2>

  <div className="category-buttons">

    <button>🏛 Temples</button>
    <button>🏰 Forts</button>
    <button>🕌 Mughal</button>
    <button>🪨 Ancient</button>
    <button>🌍 UNESCO</button>
    <button>🕉 Spiritual</button>

  </div>

</section>