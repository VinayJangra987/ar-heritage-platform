// src/components/FavoritesSection.js
import { useAuth } from '../context/AuthContext';
import heritageData from '../data/heritage';

export default function FavoritesSection({ onSiteClick, onShowAuth }) {
  const { user, toggleFavorite } = useAuth();

  const allSites   = heritageData.getAllSites();
  const favSites   = user?.favorites
    ? allSites.filter(s => user.favorites.includes(s.id))
    : [];

  const typeColors = {
    architectural:  '#C9A84C',
    archaeological: '#8B6F47',
    religious:      '#E07B54',
    natural:        '#4A7C59',
    intangible:     '#9B59B6',
  };

  /* ── Not logged in ── */
  if (!user) {
    return (
      <>
        <style>{favStyles}</style>
        <section className="fav-section">
          <div className="fav-inner fav-auth-wall">
            <div className="fav-auth-icon">♡</div>
            <h3 className="fav-auth-title">Your Favourites</h3>
            <p className="fav-auth-desc">
              Sign in to save heritage sites you love — they'll appear here for quick access.
            </p>
            <button className="fav-auth-btn" onClick={onShowAuth}>
              Sign in to Continue
            </button>
          </div>
        </section>
      </>
    );
  }

  /* ── Logged in but no favourites ── */
  if (favSites.length === 0) {
    return (
      <>
        <style>{favStyles}</style>
        <section className="fav-section">
          <div className="fav-inner">
            <FavHeader count={0} userName={user.name} />
            <div className="fav-empty">
              <div className="fav-empty-icon">♡</div>
              <div className="fav-empty-title">No favourites yet</div>
              <div className="fav-empty-desc">
                Tap the ♡ on any heritage site card to save it here.
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  /* ── Has favourites ── */
  return (
    <>
      <style>{favStyles}</style>
      <section className="fav-section">
        <div className="fav-inner">
          <FavHeader count={favSites.length} userName={user.name} />

          {/* Stats row */}
          <div className="fav-stats-row">
            {[
              { n: favSites.length,                                    l: 'Saved Sites'   },
              { n: favSites.filter(s => s.unesco).length,              l: 'UNESCO Sites'  },
              { n: [...new Set(favSites.map(s => s.state))].length,    l: 'States'        },
              { n: [...new Set(favSites.map(s => s.type))].length,     l: 'Categories'    },
            ].map(s => (
              <div className="fav-stat" key={s.l}>
                <span className="fav-stat-n">{s.n}</span>
                <span className="fav-stat-l">{s.l}</span>
              </div>
            ))}
          </div>

          {/* Cards grid */}
          <div className="fav-grid">
            {favSites.map(site => (
              <div key={site.id} className="fav-card" onClick={() => onSiteClick(site)}>

                {/* Image */}
                <div className="fav-card-img-wrap">
                  <img
                    src={site.images?.[0]}
                    alt={site.name}
                    className="fav-card-img"
                  />
                  {/* Remove fav button */}
                  <button
                    className="fav-card-remove"
                    onClick={e => { e.stopPropagation(); toggleFavorite(site.id); }}
                    title="Remove from favourites"
                  >
                    ♥
                  </button>
                  {site.unesco && (
                    <span className="fav-card-unesco">UNESCO ★</span>
                  )}
                  {/* Type dot */}
                  <span
                    className="fav-card-type-dot"
                    style={{ background: typeColors[site.type] || '#C9A84C' }}
                  />
                </div>

                {/* Info */}
                <div className="fav-card-info">
                  <div
                    className="fav-card-type"
                    style={{ color: typeColors[site.type] || '#C9A84C' }}
                  >
                    {site.type}
                  </div>
                  <div className="fav-card-name">{site.name}</div>
                  <div className="fav-card-loc">📍 {site.district}, {site.state}</div>
                  {site.period && (
                    <div className="fav-card-era">{site.period}</div>
                  )}
                  <div className="fav-card-cta">View Details →</div>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>
    </>
  );
}

/* ── Sub-component: section header ── */
function FavHeader({ count, userName }) {
  return (
    <div className="fav-header">
      <div className="fav-eyebrow">
        <span className="fav-eyebrow-line" />
        My Collection
      </div>
      <div className="fav-header-row">
        <h2 className="fav-title">
          {userName ? `${userName}'s` : 'Your'} <em>Favourites</em>
        </h2>
        {count > 0 && (
          <span className="fav-count-badge">{count} saved</span>
        )}
      </div>
      <p className="fav-subtitle">
        Your personally curated collection of India's heritage wonders.
      </p>
    </div>
  );
}

/* ── All styles ── */
const favStyles = `
  .fav-section {
    position: relative;
    z-index: 0;
    background: #06090F;
    border-top: 1px solid rgba(201,168,76,0.1);
    padding: 4rem 0 5rem;
    isolation: isolate;
  }

  .fav-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 5vw;
  }

  /* ── Header ── */
  .fav-eyebrow {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    font-family: 'Space Mono', monospace;
    font-size: 0.6rem;
    color: #C9A84C;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    margin-bottom: 0.8rem;
  }
  .fav-eyebrow-line {
    display: block;
    width: 24px; height: 1px;
    background: #C9A84C;
    flex-shrink: 0;
  }
  .fav-header-row {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
    margin-bottom: 0.5rem;
  }
  .fav-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 700;
    color: #F2E8D0;
    line-height: 1.05;
    margin: 0;
  }
  .fav-title em { font-style: italic; color: #C9A84C; }
  .fav-count-badge {
    font-family: 'Space Mono', monospace;
    font-size: 0.55rem;
    letter-spacing: 0.12em;
    color: #0D1B2A;
    background: #C9A84C;
    padding: 4px 12px;
    border-radius: 20px;
    font-weight: 700;
  }
  .fav-subtitle {
    font-family: 'Poppins', sans-serif;
    font-size: 0.86rem;
    color: rgba(242,232,208,0.4);
    margin: 0 0 2.5rem;
  }

  /* ── Stats row ── */
  .fav-stats-row {
    display: flex;
    gap: 0;
    border: 1px solid rgba(201,168,76,0.1);
    border-radius: 14px;
    overflow: hidden;
    margin-bottom: 2.5rem;
  }
  .fav-stat {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
    padding: 1.1rem 1rem;
    border-right: 1px solid rgba(201,168,76,0.08);
    background: rgba(201,168,76,0.03);
    transition: background 0.2s;
  }
  .fav-stat:last-child { border-right: none; }
  .fav-stat:hover { background: rgba(201,168,76,0.06); }
  .fav-stat-n {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.7rem;
    font-weight: 700;
    color: #C9A84C;
    line-height: 1;
  }
  .fav-stat-l {
    font-family: 'Space Mono', monospace;
    font-size: 0.5rem;
    color: rgba(242,232,208,0.3);
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  /* ── Grid ── */
  .fav-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 1.5rem;
  }

  /* ── Card ── */
  .fav-card {
    background: rgba(15,28,45,0.7);
    border: 1px solid rgba(201,168,76,0.1);
    border-radius: 16px;
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.25s, border-color 0.25s, box-shadow 0.25s;
  }
  .fav-card:hover {
    transform: translateY(-5px);
    border-color: rgba(201,168,76,0.35);
    box-shadow: 0 16px 40px rgba(0,0,0,0.4);
  }

  .fav-card-img-wrap {
    position: relative;
    height: 170px;
    overflow: hidden;
  }
  .fav-card-img {
    width: 100%; height: 100%;
    object-fit: cover;
    transition: transform 0.4s;
  }
  .fav-card:hover .fav-card-img {
    transform: scale(1.05);
  }

  /* Remove button */
  .fav-card-remove {
    position: absolute;
    top: 10px; right: 10px;
    width: 32px; height: 32px;
    display: flex; align-items: center; justify-content: center;
    background: rgba(201,168,76,0.9);
    border: none; border-radius: 50%;
    color: #0D1B2A; font-size: 0.85rem;
    cursor: pointer;
    transition: all 0.2s;
    z-index: 2;
  }
  .fav-card-remove:hover {
    background: #E07B54;
    transform: scale(1.1);
  }

  .fav-card-unesco {
    position: absolute;
    bottom: 10px; left: 10px;
    font-family: 'Space Mono', monospace;
    font-size: 0.48rem;
    letter-spacing: 0.1em;
    background: #C9A84C;
    color: #0D1B2A;
    padding: 2px 8px;
    border-radius: 6px;
    font-weight: 700;
  }

  .fav-card-type-dot {
    position: absolute;
    bottom: 10px; right: 10px;
    width: 10px; height: 10px;
    border-radius: 50%;
    border: 2px solid rgba(255,255,255,0.5);
  }

  /* Card info */
  .fav-card-info {
    padding: 1rem 1.1rem 1.1rem;
  }
  .fav-card-type {
    font-family: 'Space Mono', monospace;
    font-size: 0.5rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    margin-bottom: 4px;
    font-weight: 700;
  }
  .fav-card-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.15rem;
    font-weight: 700;
    color: #F2E8D0;
    line-height: 1.2;
    margin-bottom: 4px;
  }
  .fav-card-loc {
    font-family: 'Space Mono', monospace;
    font-size: 0.52rem;
    color: rgba(242,232,208,0.35);
    letter-spacing: 0.06em;
    margin-bottom: 3px;
  }
  .fav-card-era {
    font-family: 'Poppins', sans-serif;
    font-size: 0.72rem;
    color: rgba(242,232,208,0.3);
    font-style: italic;
    margin-bottom: 0.7rem;
  }
  .fav-card-cta {
    font-family: 'Space Mono', monospace;
    font-size: 0.55rem;
    color: #C9A84C;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    transition: letter-spacing 0.2s;
  }
  .fav-card:hover .fav-card-cta {
    letter-spacing: 0.18em;
  }

  /* ── Auth wall ── */
  .fav-auth-wall {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 4rem 2rem;
  }
  .fav-auth-icon {
    font-size: 3rem;
    color: rgba(201,168,76,0.3);
    margin-bottom: 1rem;
    line-height: 1;
  }
  .fav-auth-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2rem;
    font-weight: 700;
    color: #F2E8D0;
    margin: 0 0 0.75rem;
  }
  .fav-auth-desc {
    font-family: 'Poppins', sans-serif;
    font-size: 0.88rem;
    color: rgba(242,232,208,0.4);
    max-width: 360px;
    line-height: 1.6;
    margin: 0 0 1.75rem;
  }
  .fav-auth-btn {
    background: linear-gradient(135deg, #C9A84C, #E8C96A);
    color: #0D1B2A;
    border: none;
    padding: 0.8rem 2rem;
    border-radius: 50px;
    font-family: 'Space Mono', monospace;
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    cursor: pointer;
    transition: all 0.25s;
    box-shadow: 0 4px 20px rgba(201,168,76,0.3);
  }
  .fav-auth-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(201,168,76,0.45);
  }

  /* ── Empty state ── */
  .fav-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 3rem 2rem;
    border: 1px dashed rgba(201,168,76,0.15);
    border-radius: 16px;
    text-align: center;
  }
  .fav-empty-icon {
    font-size: 2.5rem;
    color: rgba(201,168,76,0.2);
    margin-bottom: 0.8rem;
  }
  .fav-empty-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.5rem;
    font-weight: 700;
    color: rgba(242,232,208,0.5);
    margin-bottom: 0.4rem;
  }
  .fav-empty-desc {
    font-family: 'Poppins', sans-serif;
    font-size: 0.82rem;
    color: rgba(242,232,208,0.3);
    line-height: 1.6;
  }

  /* ── Mobile ── */
  @media (max-width: 600px) {
    .fav-grid { grid-template-columns: 1fr 1fr; gap: 0.9rem; }
    .fav-stats-row { flex-wrap: wrap; }
    .fav-stat { flex: 1 1 45%; }
  }
  @media (max-width: 400px) {
    .fav-grid { grid-template-columns: 1fr; }
  }
`;