// src/components/NearbySites.js
// Shows heritage monuments near the user's current location

import { useState, useEffect } from "react";

const ALL_MONUMENTS = [
  { id: "taj", name: "Taj Mahal", location: "Agra, UP", state: "Uttar Pradesh", type: "architectural", lat: 27.1751, lng: 78.0421, image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400&q=80", era: "17th Century CE" },
  { id: "qutub", name: "Qutub Minar", location: "New Delhi", state: "Delhi", type: "architectural", lat: 28.5245, lng: 77.1855, image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&q=80", era: "12th Century CE" },
  { id: "hampi", name: "Hampi Ruins", location: "Hampi, Karnataka", state: "Karnataka", type: "archaeological", lat: 15.335, lng: 76.460, image: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400&q=80", era: "14th–16th Century CE" },
  { id: "ajanta", name: "Ajanta Caves", location: "Aurangabad, Maharashtra", state: "Maharashtra", type: "religious", lat: 20.5519, lng: 75.7033, image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=400&q=80", era: "2nd Century BCE" },
  { id: "amber", name: "Amber Fort", location: "Jaipur, Rajasthan", state: "Rajasthan", type: "architectural", lat: 26.9855, lng: 75.8513, image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=400&q=80", era: "16th Century CE" },
  { id: "ellora", name: "Ellora Caves", location: "Aurangabad, Maharashtra", state: "Maharashtra", type: "religious", lat: 20.0258, lng: 75.1780, image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=400&q=80", era: "600–1000 CE" },
  { id: "konark", name: "Konark Sun Temple", location: "Konark, Odisha", state: "Odisha", type: "religious", lat: 19.8876, lng: 86.0946, image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=400&q=80", era: "13th Century CE" },
  { id: "fatehpur", name: "Fatehpur Sikri", location: "Agra, UP", state: "Uttar Pradesh", type: "architectural", lat: 27.0945, lng: 77.6610, image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400&q=80", era: "16th Century CE" },
  { id: "khajuraho", name: "Khajuraho Temples", location: "Khajuraho, MP", state: "Madhya Pradesh", type: "religious", lat: 24.8318, lng: 79.9199, image: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400&q=80", era: "10th–11th Century CE" },
  { id: "mahabalipuram", name: "Mahabalipuram", location: "Tamil Nadu", state: "Tamil Nadu", type: "archaeological", lat: 12.6269, lng: 80.1927, image: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400&q=80", era: "7th–8th Century CE" },
  { id: "redfort", name: "Red Fort", location: "New Delhi", state: "Delhi", type: "architectural", lat: 28.6562, lng: 77.2410, image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&q=80", era: "17th Century CE" },
  { id: "humayun", name: "Humayun's Tomb", location: "New Delhi", state: "Delhi", type: "architectural", lat: 28.5933, lng: 77.2507, image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&q=80", era: "16th Century CE" },
];

const typeColors = {
  architectural: "#C9A84C", archaeological: "#8B6F47",
  religious: "#E07B54", natural: "#4A7C59", intangible: "#9B59B6",
};

function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function NearbySites({ onClose, onViewSite }) {
  const [status,   setStatus]   = useState("idle"); // idle | loading | success | error | denied
  const [userPos,  setUserPos]  = useState(null);
  const [results,  setResults]  = useState([]);
  const [radius,   setRadius]   = useState(500); // km
  const [sortBy,   setSortBy]   = useState("distance");

  const fetchLocation = () => {
    setStatus("loading");
    if (!navigator.geolocation) { setStatus("error"); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setUserPos({ lat, lng });
        const withDist = ALL_MONUMENTS.map(m => ({
          ...m,
          distance: Math.round(haversineKm(lat, lng, m.lat, m.lng)),
        })).filter(m => m.distance <= radius).sort((a, b) => a.distance - b.distance);
        setResults(withDist);
        setStatus("success");
      },
      () => setStatus("denied"),
      { timeout: 10000 }
    );
  };

  useEffect(() => { fetchLocation(); }, [radius]);

  const sorted = [...results].sort((a, b) =>
    sortBy === "distance" ? a.distance - b.distance : a.name.localeCompare(b.name)
  );

  return (
    <>
      <style>{`
        @keyframes nbFadeIn { from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)} }
        @keyframes nbSpin    { to{transform:rotate(360deg)} }
        @keyframes nbPulse   { 0%,100%{transform:scale(1)}50%{transform:scale(1.05)} }

        .nb-overlay {
          position:fixed;inset:0;z-index:10000;
          background:rgba(4,8,15,0.97);
          display:flex;flex-direction:column;
          font-family:'Poppins',sans-serif;
          animation:nbFadeIn 0.3s ease;
        }

        /* Top bar */
        .nb-topbar {
          display:flex;align-items:center;justify-content:space-between;
          padding:1rem 1.5rem;
          border-bottom:1px solid rgba(201,168,76,0.12);
          flex-shrink:0;
        }
        .nb-topbar-left { display:flex;align-items:center;gap:0.75rem; }
        .nb-badge { font-family:'Space Mono',monospace;font-size:0.52rem;letter-spacing:0.15em;text-transform:uppercase;color:#0D1B2A;background:#C9A84C;padding:3px 10px;border-radius:20px;font-weight:700; }
        .nb-title { font-family:'Space Mono',monospace;font-size:0.62rem;color:rgba(242,232,208,0.5);letter-spacing:0.12em;text-transform:uppercase; }
        .nb-close { width:36px;height:36px;display:flex;align-items:center;justify-content:center;background:rgba(242,232,208,0.06);border:1px solid rgba(242,232,208,0.12);border-radius:10px;color:rgba(242,232,208,0.6);font-size:1rem;cursor:pointer;transition:all 0.2s; }
        .nb-close:hover { background:rgba(201,168,76,0.15);color:#C9A84C; }

        /* Controls */
        .nb-controls {
          display:flex;align-items:center;gap:1rem;padding:1rem 1.5rem;
          border-bottom:1px solid rgba(242,232,208,0.06);flex-shrink:0;flex-wrap:wrap;
        }
        .nb-radius-label { font-family:'Space Mono',monospace;font-size:0.52rem;color:rgba(242,232,208,0.4);letter-spacing:0.1em;text-transform:uppercase;white-space:nowrap; }
        .nb-radius-val { color:#C9A84C;font-weight:700; }
        .nb-slider { flex:1;min-width:120px;max-width:200px;accent-color:#C9A84C; }
        .nb-sort-select { padding:6px 10px;background:rgba(242,232,208,0.04);border:1px solid rgba(242,232,208,0.1);border-radius:8px;color:rgba(242,232,208,0.7);font-family:'Space Mono',monospace;font-size:0.52rem;letter-spacing:0.08em;outline:none;cursor:pointer; }
        .nb-sort-select option { background:#0D1B2A; }
        .nb-refresh-btn { padding:6px 14px;background:rgba(201,168,76,0.1);border:1px solid rgba(201,168,76,0.25);border-radius:8px;color:#C9A84C;font-family:'Space Mono',monospace;font-size:0.52rem;letter-spacing:0.1em;text-transform:uppercase;cursor:pointer;transition:all 0.2s; }
        .nb-refresh-btn:hover { background:rgba(201,168,76,0.2); }

        /* Body */
        .nb-body { flex:1;overflow-y:auto;padding:1.5rem; }

        /* State screens */
        .nb-state-screen {
          display:flex;flex-direction:column;align-items:center;justify-content:center;
          height:100%;gap:1.2rem;text-align:center;padding:3rem;
        }
        .nb-state-icon { font-size:3.5rem; }
        .nb-state-title { font-family:'Cormorant Garamond',serif;font-size:1.8rem;font-weight:700;color:#F2E8D0; }
        .nb-state-text { font-size:0.85rem;color:rgba(242,232,208,0.4);max-width:380px;line-height:1.7; }
        .nb-spinner { width:48px;height:48px;border:2px solid rgba(201,168,76,0.1);border-top-color:#C9A84C;border-radius:50%;animation:nbSpin 1s linear infinite; }
        .nb-action-btn { padding:0.8rem 2rem;background:linear-gradient(135deg,#C9A84C,#E8C96A);color:#0D1B2A;border:none;border-radius:50px;font-family:'Space Mono',monospace;font-size:0.62rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;cursor:pointer;transition:all 0.25s; }
        .nb-action-btn:hover { transform:translateY(-2px);box-shadow:0 8px 25px rgba(201,168,76,0.35); }

        /* User location bar */
        .nb-location-bar {
          display:flex;align-items:center;gap:0.75rem;
          padding:0.75rem 1rem;background:rgba(74,200,120,0.06);
          border:1px solid rgba(74,200,120,0.15);border-radius:10px;margin-bottom:1.2rem;
        }
        .nb-loc-dot { width:8px;height:8px;border-radius:50%;background:#4AC878;flex-shrink:0;animation:nbPulse 2s infinite; }
        .nb-loc-text { font-family:'Space Mono',monospace;font-size:0.52rem;color:rgba(74,200,120,0.8);letter-spacing:0.1em; }

        /* Result header */
        .nb-result-header {
          display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;
        }
        .nb-result-title { font-family:'Cormorant Garamond',serif;font-size:1.3rem;font-weight:700;color:#F2E8D0; }
        .nb-result-count { font-family:'Space Mono',monospace;font-size:0.52rem;color:rgba(201,168,76,0.6);letter-spacing:0.1em; }

        /* Cards */
        .nb-grid { display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1rem; }
        .nb-card {
          background:rgba(8,18,30,0.9);border:1px solid rgba(242,232,208,0.07);
          border-radius:16px;overflow:hidden;cursor:pointer;transition:all 0.25s;
        }
        .nb-card:hover { border-color:rgba(201,168,76,0.25);transform:translateY(-3px);box-shadow:0 12px 30px rgba(0,0,0,0.4); }
        .nb-card-img-wrap { position:relative;height:150px;overflow:hidden; }
        .nb-card-img { width:100%;height:100%;object-fit:cover;transition:transform 0.4s ease; }
        .nb-card:hover .nb-card-img { transform:scale(1.05); }
        .nb-dist-badge {
          position:absolute;top:0.75rem;right:0.75rem;
          background:rgba(4,8,15,0.85);backdrop-filter:blur(8px);
          border:1px solid rgba(201,168,76,0.3);border-radius:20px;
          padding:4px 10px;font-family:'Space Mono',monospace;
          font-size:0.52rem;color:#C9A84C;font-weight:700;letter-spacing:0.08em;
        }
        .nb-card-body { padding:1rem; }
        .nb-card-type {
          font-family:'Space Mono',monospace;font-size:0.45rem;letter-spacing:0.15em;
          text-transform:uppercase;padding:3px 8px;border-radius:20px;display:inline-block;margin-bottom:0.5rem;
        }
        .nb-card-name { font-family:'Cormorant Garamond',serif;font-size:1.1rem;font-weight:700;color:#F2E8D0;margin-bottom:3px; }
        .nb-card-loc  { font-size:0.72rem;color:rgba(242,232,208,0.4);margin-bottom:0.75rem; }
        .nb-card-era  { font-family:'Space Mono',monospace;font-size:0.48rem;color:rgba(242,232,208,0.25);letter-spacing:0.1em;text-transform:uppercase; }
        .nb-card-footer { display:flex;align-items:center;justify-content:space-between;margin-top:0.75rem; }
        .nb-map-btn {
          font-family:'Space Mono',monospace;font-size:0.48rem;letter-spacing:0.1em;text-transform:uppercase;
          padding:5px 12px;background:rgba(201,168,76,0.1);border:1px solid rgba(201,168,76,0.2);
          border-radius:6px;color:#C9A84C;cursor:pointer;transition:all 0.2s;
        }
        .nb-map-btn:hover { background:rgba(201,168,76,0.2); }

        /* Empty */
        .nb-empty { text-align:center;padding:3rem;color:rgba(242,232,208,0.3);font-size:0.9rem; }
        .nb-empty-icon { font-size:2.5rem;margin-bottom:0.75rem; }

        @media(max-width:600px) { .nb-grid{grid-template-columns:1fr} .nb-controls{gap:0.5rem} }
      `}</style>

      <div className="nb-overlay">
        {/* Top bar */}
        <div className="nb-topbar">
          <div className="nb-topbar-left">
            <span className="nb-badge">📍 Nearby</span>
            <span className="nb-title">Heritage Sites Near You</span>
          </div>
          <button className="nb-close" onClick={onClose}>✕</button>
        </div>

        {/* Controls */}
        <div className="nb-controls">
          <span className="nb-radius-label">Radius: <span className="nb-radius-val">{radius} km</span></span>
          <input type="range" className="nb-slider" min={100} max={2000} step={100} value={radius} onChange={e => setRadius(Number(e.target.value))} />
          <select className="nb-sort-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="distance">Sort: Nearest First</option>
            <option value="name">Sort: A → Z</option>
          </select>
          <button className="nb-refresh-btn" onClick={fetchLocation}>↻ Refresh</button>
        </div>

        {/* Body */}
        <div className="nb-body">
          {status === "idle" && (
            <div className="nb-state-screen">
              <div className="nb-state-icon">📍</div>
              <div className="nb-state-title">Discover Nearby Heritage</div>
              <div className="nb-state-text">Allow location access to find heritage monuments near you.</div>
              <button className="nb-action-btn" onClick={fetchLocation}>Enable Location</button>
            </div>
          )}

          {status === "loading" && (
            <div className="nb-state-screen">
              <div className="nb-spinner" />
              <div className="nb-state-title">Locating You...</div>
              <div className="nb-state-text">Finding heritage sites near your location.</div>
            </div>
          )}

          {status === "denied" && (
            <div className="nb-state-screen">
              <div className="nb-state-icon">🚫</div>
              <div className="nb-state-title">Location Denied</div>
              <div className="nb-state-text">Please allow location permission in your browser settings and try again.</div>
              <button className="nb-action-btn" onClick={fetchLocation}>Try Again</button>
            </div>
          )}

          {status === "error" && (
            <div className="nb-state-screen">
              <div className="nb-state-icon">⚠️</div>
              <div className="nb-state-title">Location Unavailable</div>
              <div className="nb-state-text">Your browser does not support geolocation.</div>
            </div>
          )}

          {status === "success" && (
            <>
              <div className="nb-location-bar">
                <div className="nb-loc-dot" />
                <div className="nb-loc-text">
                  📡 Your location detected · {userPos?.lat?.toFixed(4)}°N, {userPos?.lng?.toFixed(4)}°E · Searching within {radius} km
                </div>
              </div>

              <div className="nb-result-header">
                <div className="nb-result-title">Found {sorted.length} Monument{sorted.length !== 1 ? "s" : ""}</div>
                <div className="nb-result-count">{radius} KM RADIUS</div>
              </div>

              {sorted.length === 0 ? (
                <div className="nb-empty">
                  <div className="nb-empty-icon">🗺</div>
                  No monuments within {radius} km.<br />Try increasing the radius.
                </div>
              ) : (
                <div className="nb-grid">
                  {sorted.map(m => (
                    <div className="nb-card" key={m.id} onClick={() => onViewSite?.(m)}>
                      <div className="nb-card-img-wrap">
                        <img className="nb-card-img" src={m.image} alt={m.name} />
                        <div className="nb-dist-badge">📍 {m.distance} km</div>
                      </div>
                      <div className="nb-card-body">
                        <span className="nb-card-type" style={{ background: `${typeColors[m.type]}18`, color: typeColors[m.type], border: `1px solid ${typeColors[m.type]}33` }}>
                          {m.type}
                        </span>
                        <div className="nb-card-name">{m.name}</div>
                        <div className="nb-card-loc">📍 {m.location}</div>
                        <div className="nb-card-era">{m.era}</div>
                        <div className="nb-card-footer">
                          <div className="nb-card-era">{m.state}</div>
                          <button className="nb-map-btn" onClick={e => { e.stopPropagation(); window.open(`https://maps.google.com?q=${m.lat},${m.lng}`, "_blank"); }}>
                            🗺 Open Map
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}