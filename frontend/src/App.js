import { useState, useEffect, useRef } from "react";
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar          from "./components/Navbar";
import Hero            from "./components/Hero";
import Discovery       from "./components/Discovery";
import Modal           from "./components/Modal";
import Recommendations from "./components/Recommendations";
import MapView         from "./components/MapView";
import AuthModal       from './components/AuthModal';
import UserMenu        from './components/UserMenu';
import ARView          from './components/ARView';
import FavoritesSection from './components/FavoritesSection';
import NearbySites     from "./components/NearbySites";
import VirtualTour     from "./components/VirtualTour";
import ReviewSystem    from "./components/ReviewSystem";
import DiscoveryTour   from "./components/DiscoveryTour";
import heritageData    from "./data/heritage";
import "./App.css";

// ── Backend base URL — sirf yahan change karo ────────────────────────────────
const API_BASE = "http://localhost:5000/api";

// ════════════════════════════════════════════════════════════════════════════
// FOOTER
// ════════════════════════════════════════════════════════════════════════════
function Footer() {
  const currentYear = new Date().getFullYear();

  const links = {
    explore: [
      { label: "Heritage Sites", href: "#discovery" },
      { label: "Interactive Map", href: "#map"       },
      { label: "AR View",        href: "#"           },
      { label: "UNESCO Sites",   href: "#"           },
    ],
    categories: [
      { label: "Architectural",  href: "#" },
      { label: "Archaeological", href: "#" },
      { label: "Religious",      href: "#" },
      { label: "Natural",        href: "#" },
      { label: "Intangible",     href: "#" },
    ],
    about: [
      { label: "About Project", href: "#"                       },
      { label: "Data Sources",  href: "#"                       },
      { label: "ASI India",     href: "https://asi.nic.in",     target: "_blank" },
      { label: "UNESCO WHC",    href: "https://whc.unesco.org", target: "_blank" },
    ],
  };

  return (
    <>
      <style>{`
        .footer{position:relative;background:#04080F;border-top:1px solid rgba(201,168,76,0.15);overflow:hidden;z-index:1}
        .footer-glow{position:absolute;top:0;left:50%;transform:translateX(-50%);width:60%;height:1px;background:linear-gradient(90deg,transparent,rgba(201,168,76,0.6) 40%,rgba(201,168,76,0.6) 60%,transparent);pointer-events:none}
        .footer-glow-radial{position:absolute;top:-120px;left:50%;transform:translateX(-50%);width:500px;height:300px;background:radial-gradient(ellipse,rgba(201,168,76,0.05) 0%,transparent 70%);pointer-events:none}
        .footer-main{position:relative;z-index:1;display:grid;grid-template-columns:1.6fr 1fr 1fr 1fr;gap:3rem;padding:4rem 5vw 3rem;border-bottom:1px solid rgba(201,168,76,0.08)}
        .footer-brand{display:flex;flex-direction:column}
        .footer-logo{display:flex;align-items:center;gap:0.75rem;margin-bottom:1.2rem;flex-wrap:nowrap;min-width:0}
        .footer-logo-icon{font-size:1.8rem;line-height:1;flex-shrink:0}
        .footer-logo-text{display:flex;flex-direction:column;min-width:0}
        .footer-logo-name{font-family:'Cormorant Garamond',serif;font-size:1.25rem;font-weight:700;color:#F2E8D0;line-height:1;white-space:nowrap}
        .footer-logo-sub{font-family:'Space Mono',monospace;font-size:0.5rem;color:#C9A84C;letter-spacing:0.18em;text-transform:uppercase;margin-top:3px}
        .footer-tagline{font-family:'Poppins',sans-serif;font-size:0.82rem;color:rgba(242,232,208,0.4);line-height:1.7;margin-bottom:1.6rem;max-width:280px}
        .footer-socials{display:flex;gap:0.6rem}
        .footer-social-btn{width:36px;height:36px;display:flex;align-items:center;justify-content:center;background:rgba(201,168,76,0.06);border:1px solid rgba(201,168,76,0.15);border-radius:10px;font-size:0.9rem;cursor:pointer;transition:background 0.25s,border-color 0.25s,transform 0.2s;color:inherit}
        .footer-social-btn:hover{background:rgba(201,168,76,0.14);border-color:rgba(201,168,76,0.4);transform:translateY(-2px)}
        .footer-col-title{font-family:'Space Mono',monospace;font-size:0.58rem;color:#C9A84C;letter-spacing:0.2em;text-transform:uppercase;margin-bottom:1.2rem;display:flex;align-items:center;gap:0.5rem}
        .footer-col-title::after{content:'';flex:1;height:1px;background:rgba(201,168,76,0.15)}
        .footer-col-links{display:flex;flex-direction:column;gap:0.65rem;list-style:none;padding:0;margin:0}
        .footer-col-links a{font-family:'Poppins',sans-serif;font-size:0.8rem;color:rgba(242,232,208,0.45);text-decoration:none;transition:color 0.2s,padding-left 0.2s;display:inline-block}
        .footer-col-links a:hover{color:#F2E8D0;padding-left:4px}
        .footer-bottom{position:relative;z-index:1;display:flex;align-items:center;justify-content:space-between;padding:1.4rem 5vw;flex-wrap:wrap;gap:1rem}
        .footer-copy{font-family:'Space Mono',monospace;font-size:0.55rem;color:rgba(242,232,208,0.25);letter-spacing:0.1em}
        .footer-copy span{color:rgba(201,168,76,0.5)}
        .footer-badges{display:flex;gap:0.6rem;align-items:center}
        .footer-badge{font-family:'Space Mono',monospace;font-size:0.5rem;letter-spacing:0.1em;color:rgba(242,232,208,0.3);border:1px solid rgba(242,232,208,0.1);border-radius:6px;padding:3px 8px;text-transform:uppercase}
        .footer-badge.gold{color:rgba(201,168,76,0.6);border-color:rgba(201,168,76,0.2)}
        .footer-watermark{position:absolute;bottom:-40px;right:5vw;font-size:14rem;opacity:0.015;pointer-events:none;user-select:none;line-height:1}
        @media(max-width:900px){.footer-main{grid-template-columns:1fr 1fr;gap:2rem}.footer-brand{grid-column:1/-1}}
        @media(max-width:500px){.footer-main{grid-template-columns:1fr}.footer-brand{grid-column:auto}.footer-bottom{flex-direction:column;align-items:flex-start}}
      `}</style>

      <footer className="footer">
        <div className="footer-glow" />
        <div className="footer-glow-radial" />
        <div className="footer-watermark">🏛️</div>

        <div className="footer-main">
          {/* Brand */}
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="footer-logo-icon">🏛️</span>
              <div className="footer-logo-text">
                <span className="footer-logo-name">Bharatiya Dharohar</span>
                <span className="footer-logo-sub">AR Heritage Platform</span>
              </div>
            </div>
            <p className="footer-tagline">
              Preserving India's cultural legacy through immersive AR technology —
              bringing 5,000 years of history to your fingertips.
            </p>
            <div className="footer-socials">
              {["𝕏", "in", "gh", "▶"].map((icon, i) => (
                <button key={i} className="footer-social-btn"
                  style={{ fontFamily:"'Space Mono',monospace", fontSize:"0.65rem", color:"rgba(242,232,208,0.5)" }}>
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div className="footer-col">
            <div className="footer-col-title">Explore</div>
            <ul className="footer-col-links">
              {links.explore.map((l) => (
                <li key={l.label}>
                  <a href={l.href} onClick={l.href.startsWith('#') ? (e) => {
                    e.preventDefault();
                    document.querySelector(l.href)?.scrollIntoView({ behavior:'smooth' });
                  } : undefined}>{l.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="footer-col">
            <div className="footer-col-title">Categories</div>
            <ul className="footer-col-links">
              {links.categories.map((l) => (
                <li key={l.label}><a href={l.href}>{l.label}</a></li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div className="footer-col">
            <div className="footer-col-title">About</div>
            <ul className="footer-col-links">
              {links.about.map((l) => (
                <li key={l.label}>
                  <a href={l.href} target={l.target || "_self"}
                    rel={l.target === "_blank" ? "noopener noreferrer" : undefined}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-copy">
            © {currentYear} <span>Bharatiya Dharohar</span>. Built with ♥ for India's heritage.
          </div>
          <div className="footer-badges">
            <span className="footer-badge gold">UNESCO Partner</span>
            <span className="footer-badge">ASI Data</span>
            <span className="footer-badge">Open Source</span>
          </div>
        </div>
      </footer>
    </>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// MAIN APP
// ════════════════════════════════════════════════════════════════════════════
function AppInner() {
  const { user, toggleFavorite } = useAuth();

  // ── States ────────────────────────────────────────────────────────────────
  const [selectedSite,      setSelectedSite]      = useState(null);
  const [lastViewedId,      setLastViewedId]       = useState(null);
  const [searchOpen,        setSearchOpen]         = useState(false);
  const [searchQuery,       setSearchQuery]        = useState("");
  const [searchResults,     setSearchResults]      = useState([]);
  const [showAuth,          setShowAuth]           = useState(false);
  const [showAR,            setShowAR]             = useState(false);
  const [activeView,        setActiveView]         = useState('discover');
  // eslint-disable-next-line no-unused-vars
  const [showFav,           setShowFav]            = useState(false);
  const [showNearby,        setShowNearby]         = useState(false);
  const [showTour,          setShowTour]           = useState(false);
  const [tourId,            setTourId]             = useState(null);
  const [showReview,        setShowReview]         = useState(false);
  const [reviewSite,        setReviewSite]         = useState(null);
  const [showDiscoveryTour, setShowDiscoveryTour]  = useState(false);
  const [recommendations,   setRecommendations]    = useState([]);

  // ── NEW: Backend se sites fetch ───────────────────────────────────────────
  const [allSites,          setAllSites]           = useState([]);
  const [sitesLoading,      setSitesLoading]       = useState(true);

  // App mount hote hi backend se saari sites fetch karo
  useEffect(() => {
    fetch(`${API_BASE}/heritage`)
      .then((r) => r.json())
      .then((data) => {
        if (data.sites?.length > 0) {
          setAllSites(data.sites);
        } else {
          // Backend ne empty diya — local fallback
          setAllSites(heritageData.getAllSites());
        }
      })
      .catch(() => {
        // Backend offline — local fallback
        setAllSites(heritageData.getAllSites());
      })
      .finally(() => setSitesLoading(false));
  }, []);

  // ── Refs ──────────────────────────────────────────────────────────────────
  const discoverRef    = useRef(null);
  const mapRef         = useRef(null);
  const viewSectionRef = useRef(null);
  const favRef         = useRef(null);

  // ── Site click — backend se recommendations, local fallback ───────────────
  const handleSiteClick = async (site) => {
    if (!site) return;
    setSelectedSite(site);
    setSearchOpen(false);

    const isMongoId = (id) => id && /^[a-f\d]{24}$/i.test(id.toString());
    const mongoId   = site._id?.toString();
    const localId   = site.id?.toString();
    const siteId    = mongoId || localId;

    if (!siteId || siteId === 'undefined') {
      setRecommendations(heritageData.getRecommendations?.('') || []);
      return;
    }

    setLastViewedId(siteId);

    if (isMongoId(mongoId)) {
      try {
        const res = await fetch(`${API_BASE}/heritage/${mongoId}/recommendations`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setRecommendations(data.recommendations || []);
        return;
      } catch {
        // Backend offline — fall through to local
      }
    }

    setRecommendations(heritageData.getRecommendations?.(localId) || []);
  };

  // ── Tab switch ────────────────────────────────────────────────────────────
  const handleTabSwitch = (view) => {
    setActiveView(view);
    setShowFav(view === 'favourites');
    setTimeout(() => {
      const target =
        view === 'map'        ? mapRef.current     :
        view === 'favourites' ? favRef.current     :
                                discoverRef.current;
      if (target) {
        const y = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }, 120);
  };

  // ── Search — backend first, local fallback ────────────────────────────────
  const handleSearch = async (q) => {
    setSearchQuery(q);
    if (q.trim().length < 2) { setSearchResults([]); return; }

    try {
      const res  = await fetch(`${API_BASE}/heritage?search=${encodeURIComponent(q)}&limit=8`);
      const data = await res.json();
      if (data.sites?.length > 0) { setSearchResults(data.sites); return; }
    } catch { /* backend offline */ }

    const lower = q.toLowerCase();
    const results = (heritageData.getAllSites?.() || []).filter((s) =>
      s.name.toLowerCase().includes(lower)     ||
      s.state.toLowerCase().includes(lower)    ||
      s.district.toLowerCase().includes(lower) ||
      s.type.toLowerCase().includes(lower)     ||
      s.tags?.some((t) => t.toLowerCase().includes(lower))
    );
    setSearchResults(results.slice(0, 8));
  };

  // ── Helper functions ──────────────────────────────────────────────────────
  // eslint-disable-next-line no-unused-vars
  const openTour   = (id = null) => { setTourId(id); setShowTour(true); };
  const openReview = (site)      => { setReviewSite(site); setShowReview(true); };

  const handleViewNearbySite = (monument) => {
    openReview({
      _id:      monument._id || monument.id,
      name:     monument.name,
      location: monument.location,
    });
  };

  const handleARFromDiscovery = () => { setShowDiscoveryTour(false); setShowAR(true); };

  // ── isFav ─────────────────────────────────────────────────────────────────
  const isFav = (id) => {
    if (!user?.favorites || !id || id === 'undefined') return false;
    const idStr = id.toString();
    return user.favorites.some((f) => {
      const favId = typeof f === "object" ? f._id?.toString() : f?.toString();
      return favId && favId === idStr;
    });
  };

  const getSiteId = (site) => {
    const id = site?._id?.toString() || site?.id?.toString();
    return (id && id !== 'undefined') ? id : null;
  };

  // ── Sites to show — backend agar available hai, warna local ──────────────
  const sitesToShow = allSites.length > 0
    ? allSites
    : heritageData.getAllSites();

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="app">

      {/* ── Navbar ── */}
      <Navbar
        onSearchOpen={() => setSearchOpen(true)}
        onMapClick={() => handleTabSwitch('map')}
        onFavClick={() => handleTabSwitch('favourites')}
        onARClick={() => setShowAR(true)}
        extraRight={<UserMenu onShowAuth={() => setShowAuth(true)} />}
      />

      {/* ── Hero ── */}
      <Hero
        onExplore={() => {
          setActiveView('discover');
          setTimeout(() => discoverRef.current?.scrollIntoView({ behavior:"smooth" }), 50);
        }}
        onARClick={() => setShowAR(true)}
      />

      {/* ── Browse Section ── */}
      <section className="browse-section" ref={viewSectionRef}>
        <div className="browse-grain" />
        <div className="browse-border-top" />

        <div className="browse-inner">
          <div className="browse-heading">
            <div className="browse-eyebrow">
              <span className="browse-eyebrow-line" />
              Heritage Explorer
            </div>
            <h2 className="browse-title">
              {activeView === 'discover'
                ? <><span>Discover</span><br /><em>India's Soul</em></>
                : activeView === 'map'
                ? <><span>Navigate</span><br /><em>The Map</em></>
                : <><span>Your</span><br /><em>Favourites</em></>
              }
            </h2>
            <p className="browse-desc">
              {activeView === 'discover'
                ? "Browse 3,000+ heritage sites across 28 states — filter by type, era, or UNESCO status."
                : activeView === 'map'
                ? "Pin to pin across India — click any marker to reveal the story behind the site."
                : "Your personal collection of saved heritage wonders — curated by you."}
            </p>
          </div>

          <div className="browse-tabs">
            {[
              { key:'discover',   num:"01", icon:"🗂", label:"Discover",   sub:"Cards & filters"   },
              { key:'map',        num:"02", icon:"🗺", label:"Map View",   sub:"Interactive India" },
              { key:'favourites', num:"03", icon:"♥", label:"Favourites", sub:"My collection"     },
            ].map((t) => (
              <button
                key={t.key}
                className={`browse-tab ${activeView === t.key ? 'browse-tab--active' : ''}`}
                onClick={() => handleTabSwitch(t.key)}
              >
                <div className="browse-tab-top">
                  <span className="browse-tab-num">{t.num}</span>
                  {activeView === t.key && <span className="browse-tab-active-pill">Active</span>}
                </div>
                <div className="browse-tab-icon-wrap">
                  <span className="browse-tab-icon">{t.icon}</span>
                </div>
                <div className="browse-tab-label">{t.label}</div>
                <div className="browse-tab-sub">{t.sub}</div>
                <div className="browse-tab-arrow">→</div>
              </button>
            ))}
          </div>
        </div>

        <div className="browse-stats">
          {[
            { n:"3,000+", l:"Heritage Sites" },
            { n:"40",     l:"UNESCO Sites"   },
            { n:"28",     l:"States"         },
            { n:"5",      l:"Categories"     },
          ].map((s) => (
            <div className="browse-stat" key={s.l}>
              <span className="browse-stat-n">{s.n}</span>
              <span className="browse-stat-l">{s.l}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Content ── */}
      {activeView === 'discover' && (
        <div ref={discoverRef}>
          {/* 
            NEW: sites prop pass karo — backend se real _id wali sites milegi
            sitesLoading true hai toh Discovery apna loader dikhayega
          */}
          <Discovery
            sites={sitesToShow}
            sitesLoading={sitesLoading}
            onSiteClick={handleSiteClick}
            isFav={isFav}
            onToggleFav={user ? toggleFavorite : () => setShowAuth(true)}
          />
          <Recommendations
            lastViewedId={lastViewedId}
            onSiteClick={handleSiteClick}
            onShowAuth={() => setShowAuth(true)}
          />
        </div>
      )}

      {activeView === 'map' && (
        <div ref={mapRef}>
          {/* NEW: sites prop pass karo MapView ko bhi */}
          <MapView
            sites={sitesToShow}
            onSiteClick={handleSiteClick}
          />
        </div>
      )}

      {activeView === 'favourites' && (
        <div ref={favRef}>
          <FavoritesSection
            onSiteClick={handleSiteClick}
            onShowAuth={() => setShowAuth(true)}
          />
        </div>
      )}

      {/* ── Search Overlay ── */}
      {searchOpen && (
        <div className="search-overlay"
          onClick={(e) => e.target === e.currentTarget && setSearchOpen(false)}>
          <div className="search-panel">
            <div className="search-bar">
              <span className="search-icon">🔍</span>
              <input
                autoFocus
                className="search-input"
                placeholder="Search by site name, state, type..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
              <button className="search-close" onClick={() => setSearchOpen(false)}>✕</button>
            </div>
            {searchResults.length > 0 && (
              <div className="search-results">
                {searchResults.map((site) => (
                  <div
                    key={site._id || site.id}
                    className="search-result-item"
                    onClick={() => handleSiteClick(site)}
                  >
                    <img
                      src={site.thumbnail || site.images?.[0]}
                      alt={site.name}
                      className="search-result-img"
                    />
                    <div>
                      <div className="search-result-name">{site.name}</div>
                      <div className="search-result-meta">
                        {site.district}, {site.state} · {site.type}
                      </div>
                    </div>
                    {site.unesco && <span className="search-unesco">UNESCO</span>}
                  </div>
                ))}
              </div>
            )}
            {searchQuery.length > 1 && searchResults.length === 0 && (
              <div className="search-empty">No results for "{searchQuery}"</div>
            )}
          </div>
        </div>
      )}

      {/* ── Site Modal ── */}
      {selectedSite && (
        <Modal
          site={selectedSite}
          onClose={() => { setSelectedSite(null); setRecommendations([]); }}
          recommendations={recommendations}
          isFav={isFav(getSiteId(selectedSite))}
          onToggleFav={
            user
              ? () => toggleFavorite(getSiteId(selectedSite))
              : () => setShowAuth(true)
          }
          onARClick={() => setShowAR(true)}
          onNavigate={handleSiteClick}
        />
      )}

      {/* ── Auth Modal ── */}
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}

      {/* ── AR View ── */}
      {showAR && <ARView onClose={() => setShowAR(false)} initialSite={selectedSite} />}

      {/* ── Nearby Sites ── */}
      {showNearby && (
        <NearbySites
          onClose={() => setShowNearby(false)}
          onViewSite={handleViewNearbySite}
        />
      )}

      {/* ── Virtual Tour ── */}
      {showTour && (
        <VirtualTour
          onClose={() => { setShowTour(false); setTourId(null); }}
          initialTourId={tourId}
        />
      )}

      {/* ── Review System ── */}
      {showReview && reviewSite && (
        <ReviewSystem
          site={reviewSite}
          onClose={() => { setShowReview(false); setReviewSite(null); }}
        />
      )}

      {/* ── Discovery Tour ── */}
      {showDiscoveryTour && (
        <DiscoveryTour
          onClose={() => setShowDiscoveryTour(false)}
          onViewAR={handleARFromDiscovery}
        />
      )}

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}