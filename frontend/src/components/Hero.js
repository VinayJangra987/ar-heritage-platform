import { useState, useEffect } from "react";
import ARView from "./ARView";
import DiscoveryTour, { SITES } from "./DiscoveryTour";
import HeritageScrollMorph from "./HeritageScrollMorph";
import RequireAuth from "./RequireAuth";

// ─── Hero Slides ────────────────────────────────────────────────────────────
const heroSlides = [
  {
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1800&q=80",
    title: "Taj Mahal",
    state: "Uttar Pradesh",
    subtitle: "Agra, Uttar Pradesh",
    caption: "A testament to eternal love",
    tagline: "An Eternal Ode in White Marble",
    era: "17th Century CE · 1632 AD",
    color: "#E8D5B7",
  },
  {
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1800&q=80",
    title: "Amber Fort",
    state: "Rajasthan",
    subtitle: "Jaipur, Rajasthan",
    caption: "Where Rajput glory endures",
    tagline: "The Golden Fortress of the Rajputs",
    era: "16th Century CE · 1592 AD",
    color: "#D4A84C",
  },
  {
    image: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=1800&q=80",
    title: "Hampi Ruins",
    state: "Karnataka",
    subtitle: "Karnataka",
    caption: "The lost empire of Vijayanagara",
    tagline: "The Lost Empire of Vijayanagara",
    era: "14th – 16th Century CE",
    color: "#C9A84C",
  },
  {
    image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=1800&q=80",
    title: "Ajanta Caves",
    state: "Maharashtra",
    subtitle: "Aurangabad, Maharashtra",
    caption: "Ancient art carved in rock",
    tagline: "Where Stone Speaks in Colour",
    era: "2nd Century BCE – 5th Century CE",
    color: "#E07B54",
  },
];

// ─── Category Data ──────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: "temples",   label: "Temples",   icon: "🏛" },
  { id: "forts",     label: "Forts",     icon: "🏰" },
  { id: "mughal",    label: "Mughal",    icon: "🕌" },
  { id: "ancient",   label: "Ancient",   icon: "🪨" },
  { id: "unesco",    label: "UNESCO",    icon: "🌍" },
  { id: "spiritual", label: "Spiritual", icon: "🕉" },
];

// ════════════════════════════════════════════════════════════════════════════
// CategorySection — inline component
// ════════════════════════════════════════════════════════════════════════════
function CategorySection({ onSelect, activeCategory }) {
  return (
    <>
      <style>{`
        .category-section {
          padding: 5rem 5vw;
          background: var(--navy, #0D1B2A);
          text-align: center;
        }
        .category-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 700;
          color: var(--cream, #F2E8D0);
          margin-bottom: 2.5rem;
        }
        .category-buttons {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 1rem;
        }
        .category-buttons button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.6rem;
          border-radius: 50px;
          border: 1px solid rgba(242,232,208,0.2);
          background: rgba(242,232,208,0.04);
          color: var(--cream-dim, rgba(242,232,208,0.7));
          font-family: 'Space Mono', monospace;
          font-size: 0.72rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.22,1,0.36,1);
        }
        .category-buttons button:hover {
          background: rgba(201,168,76,0.1);
          border-color: var(--gold, #C9A84C);
          color: var(--gold, #C9A84C);
          transform: translateY(-3px);
        }
        .category-buttons button.active {
          background: linear-gradient(135deg, var(--gold, #C9A84C), var(--gold-light, #E8C96A));
          border-color: transparent;
          color: var(--navy, #0D1B2A);
          font-weight: 700;
        }
      `}</style>

      <section className="category-section">
        <h2 className="category-title">Explore By Category</h2>
        <div className="category-buttons">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className={activeCategory === cat.id ? "active" : ""}
              onClick={() => onSelect && onSelect(cat.id)}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>
      </section>
    </>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// Main Hero Component
// ════════════════════════════════════════════════════════════════════════════
export default function Hero({ onExplore, onShowAuth }) {
  const [current, setCurrent]         = useState(0);
  const [fading, setFading]           = useState(false);
  const [showTour, setShowTour]       = useState(false);
  const [showARView, setShowARView]   = useState(false);
  const [arSite, setArSite]           = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);

  // Hero auto-slide
  useEffect(() => {
    const timer = setInterval(() => {
      setFading(true);
      setTimeout(() => { setCurrent((c) => (c + 1) % heroSlides.length); setFading(false); }, 600);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  // DiscoveryTour's "View in AR" hands back a site object → open ARView directly.
  const handleOpenAR = (site = null) => {
    setArSite(site);
    setShowTour(false);
    setShowARView(true);
  };

  const handleCategorySelect = (id) => {
    setActiveCategory(id);
    onExplore && onExplore(id);
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
            {/* BEGIN DISCOVERY → opens real DiscoveryTour.js */}
            <button className="btn-primary" onClick={() => setShowTour(true)}>
              Begin Discovery
            </button>
            {/* VIEW IN AR → opens ARView directly */}
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

      {/* ── Scroll-driven morph sequence (landing page) — morphs through all 4 sites in one continuous scroll ── */}
      <HeritageScrollMorph sites={SITES} onViewAR={handleOpenAR} />

      {/* ── Category Section ── */}
      <CategorySection onSelect={handleCategorySelect} activeCategory={activeCategory} />

      {/* ── Discovery Tour — now PUBLIC, no login required ── */}
      {showTour && (
        <DiscoveryTour
          onClose={() => setShowTour(false)}
          onViewAR={handleOpenAR}
          onShowAuth={onShowAuth}
        />
      )}

      {/* ── AR View (actual 3D viewer) ── */}
      {/* 🔒 Logged-in users only — same auth wall pattern as FavoritesSection */}
      {showARView && (
        <RequireAuth
          onShowAuth={onShowAuth}
          mode="overlay"
          title="Sign in to view in AR"
          message="Create a free account to place heritage monuments in your own space with AR."
        >
          <ARView initialSite={arSite} onClose={() => setShowARView(false)} />
        </RequireAuth>
      )}
    </>
  );
}