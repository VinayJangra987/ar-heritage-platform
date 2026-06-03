// src/components/Recommendations.js
import { useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import heritageData from "../data/heritage";

export default function Recommendations({ lastViewedId, onSiteClick, onShowAuth }) {
  const { user, toggleFavorite } = useAuth();

  const recommendations = useMemo(() => {
    const allSites = heritageData.getAllSites();
    if (!lastViewedId) {
      return allSites.filter((s) => s.unesco).slice(0, 6);
    }
    return heritageData.getRecommendations(lastViewedId);
  }, [lastViewedId]);

  const isFav = (id) => user?.favorites?.includes(id);

  const handleFav = (e, siteId) => {
    e.stopPropagation();
    if (!user) { onShowAuth?.(); return; }
    toggleFavorite(siteId);
  };

  return (
    <>
      <style>{`
        .rec-section {
          padding: 5rem 5vw;
          background: linear-gradient(180deg, transparent 0%, rgba(10,20,33,0.6) 30%, rgba(10,20,33,0.6) 70%, transparent 100%);
          position: relative;
          overflow: hidden;
        }
        .rec-section::before {
          content: '';
          position: absolute;
          top: -200px; right: -200px;
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(201,168,76,0.05) 0%, transparent 70%);
          pointer-events: none;
        }
        .rec-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 2.5rem;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .rec-ai-badge {
          background: rgba(26,107,114,0.2);
          border: 1px solid rgba(26,107,114,0.4);
          color: #4EC9D1;
          padding: 6px 14px;
          border-radius: 20px;
          font-family: 'Space Mono', monospace;
          font-size: 0.58rem;
          letter-spacing: 0.12em;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .ai-dot {
          width: 6px; height: 6px;
          background: #4EC9D1;
          border-radius: 50%;
          animation: aiPulse 1.8s ease-in-out infinite;
        }
        @keyframes aiPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.7); }
        }
        .rec-scroll {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 1.35rem;
        }
        .rec-card {
          background: rgba(15, 30, 47, 0.65);
          border: 1px solid rgba(201,168,76,0.13);
          border-radius: 16px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.35s ease;
          backdrop-filter: blur(10px);
          position: relative;
        }
        .rec-card:hover {
          transform: translateY(-5px);
          border-color: rgba(201,168,76,0.38);
          box-shadow: 0 16px 40px rgba(0,0,0,0.35);
        }
        .rec-card-img-wrap { position: relative; overflow: hidden; }
        .rec-card-img {
          width: 100%;
          height: 170px;
          object-fit: cover;
          display: block;
          transition: transform 0.5s ease;
        }
        .rec-card:hover .rec-card-img { transform: scale(1.08); }
        .rec-card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(15,30,47,0.85) 0%, transparent 55%);
        }
        .rec-relevance {
          position: absolute;
          top: 10px; right: 10px;
          background: rgba(26,107,114,0.8);
          backdrop-filter: blur(8px);
          color: #4EC9D1;
          padding: 4px 9px;
          border-radius: 12px;
          font-family: 'Space Mono', monospace;
          font-size: 0.52rem;
          letter-spacing: 0.1em;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        /* ── FAV BUTTON ── */
        .rec-fav-btn {
          position: absolute;
          bottom: 10px; right: 10px;
          width: 34px; height: 34px;
          display: flex; align-items: center; justify-content: center;
          border-radius: 50%;
          border: 1.5px solid rgba(255,255,255,0.2);
          background: rgba(13,27,42,0.75);
          backdrop-filter: blur(8px);
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.2s;
          z-index: 3;
          color: rgba(242,232,208,0.5);
          line-height: 1;
        }
        .rec-fav-btn:hover {
          background: rgba(201,168,76,0.2);
          border-color: rgba(201,168,76,0.5);
          color: #C9A84C;
          transform: scale(1.1);
        }
        .rec-fav-btn.active {
          background: rgba(201,168,76,0.15);
          border-color: #C9A84C;
          color: #C9A84C;
        }
        @keyframes favPop {
          0%   { transform: scale(1); }
          40%  { transform: scale(1.35); }
          100% { transform: scale(1); }
        }
        .rec-fav-btn.pop { animation: favPop 0.3s ease; }

        .rec-card-body { padding: 1rem 1.1rem 1.1rem; }
        .rec-card-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.15rem;
          font-weight: 700;
          color: #F2E8D0;
          margin-bottom: 0.25rem;
          line-height: 1.2;
        }
        .rec-card-loc {
          font-family: 'Space Mono', monospace;
          font-size: 0.57rem;
          color: #C9A84C;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 0.5rem;
        }
        .rec-card-type {
          font-family: 'Space Mono', monospace;
          font-size: 0.55rem;
          color: rgba(242,232,208,0.38);
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .rec-empty {
          grid-column: 1 / -1;
          text-align: center;
          padding: 3rem;
          color: rgba(242,232,208,0.3);
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.2rem;
        }
      `}</style>

      <section className="rec-section" id="recommendations">
        <div className="rec-header">
          <div>
            <div style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "0.62rem",
              color: "#C9A84C",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              marginBottom: "0.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.65rem",
            }}>
              <span style={{ display: "block", width: "24px", height: "1px", background: "#C9A84C" }} />
              {lastViewedId ? "Based on your interest" : "Featured UNESCO Sites"}
            </div>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
              fontWeight: 700,
              color: "#F2E8D0",
              lineHeight: 1.1,
            }}>
              {lastViewedId ? "Recommended for You" : "Iconic World Heritage Sites"}
            </h2>
          </div>
          <div className="rec-ai-badge">
            <div className="ai-dot" />
            AI-Powered Recommendations
          </div>
        </div>

        <div className="rec-scroll">
          {recommendations.length === 0 ? (
            <div className="rec-empty">Explore a site to get personalized recommendations</div>
          ) : (
            recommendations.map((site) => (
              <div key={site.id} className="rec-card" onClick={() => onSiteClick(site)}>
                <div className="rec-card-img-wrap">
                  <img
                    className="rec-card-img"
                    src={site.images?.[0] || "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=500"}
                    alt={site.name}
                    loading="lazy"
                  />
                  <div className="rec-card-overlay" />

                  {/* AI Pick badge */}
                  {site.relevanceScore > 0 && (
                    <div className="rec-relevance">✦ AI Pick</div>
                  )}

                  {/* UNESCO badge */}
                  {site.unesco && (
                    <div style={{
                      position: "absolute", top: "10px", left: "10px",
                      background: "rgba(201,168,76,0.88)", color: "#0D1B2A",
                      padding: "3px 8px", borderRadius: "10px",
                      fontFamily: "'Space Mono', monospace",
                      fontSize: "0.5rem", fontWeight: 700,
                    }}>UNESCO</div>
                  )}

                  {/* ♥ Favourite button */}
                  <button
                    className={`rec-fav-btn ${isFav(site.id) ? "active" : ""}`}
                    onClick={(e) => handleFav(e, site.id)}
                    title={isFav(site.id) ? "Remove from favourites" : "Add to favourites"}
                    onAnimationEnd={e => e.currentTarget.classList.remove("pop")}
                    onMouseDown={e => { e.currentTarget.classList.remove("pop"); void e.currentTarget.offsetWidth; e.currentTarget.classList.add("pop"); }}
                  >
                    {isFav(site.id) ? "♥" : "♡"}
                  </button>
                </div>

                <div className="rec-card-body">
                  <div className="rec-card-name">{site.name}</div>
                  <div className="rec-card-loc">📍 {site.district}, {site.state}</div>
                  <div className="rec-card-type">{site.type} · {site.period}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </>
  );
}