
import { useState, useMemo, useEffect } from "react";
import heritageData from "../data/heritage";
import { heritageAPI } from "../api";
import SiteCard from "./SiteCard";

export default function Discovery({ onSiteClick }) {
  const [selectedState, setSelectedState]       = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedType, setSelectedType]         = useState("");
  const [unescoOnly, setUnescoOnly]             = useState(false);
  const [apiSites, setApiSites]                 = useState([]);
  const [loading, setLoading]                   = useState(true);

  // ── Backend se sites fetch karo ──────────────────────────────────────────
  useEffect(() => {
    const fetchFromBackend = async () => {
      try {
        const data = await heritageAPI.getAll();
        // getAllSites returns { sites: [...], total, page, totalPages }
        const list = data?.sites || [];
        const normalized = list.map((site) => ({
          id:          site._id,
          _id:         site._id,
          name:        site.name,
          // Backend "Architectural" → lowercase "architectural" for filter match
          type:        (site.type || "architectural").toLowerCase(),
          period:      site.era || "",
          unesco:      site.unesco || false,
          coordinates: site.location?.coordinates
            ? { lat: site.location.coordinates[1], lng: site.location.coordinates[0] }
            : { lat: 0, lng: 0 },
          description: site.description || site.shortDesc || "",
          significance:"",
          visitInfo: {
            timings:    site.visitingHours || "",
            entryFee:   site.entryFee      || "",
            bestSeason: site.bestSeason    || "",
          },
          images:      site.images?.length ? site.images
                       : site.thumbnail    ? [site.thumbnail]
                       : [],
          tags:        site.tags || [],
          state:       site.state    || "",
          stateKey:    (site.state    || "").toLowerCase().replace(/\s+/g, ""),
          district:    site.district || "",
          districtKey: (site.district || "").toLowerCase().replace(/\s+/g, ""),
          fromBackend: true,
        }));
        setApiSites(normalized);
      } catch (err) {
        console.error("Backend fetch failed, using local data only:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFromBackend();
  }, []);

  const states        = Object.entries(heritageData.states);
  const districts     = selectedState
    ? Object.entries(heritageData.states[selectedState]?.districts || {})
    : [];
  const heritageTypes = Object.entries(heritageData.heritageTypes);

  const filteredSites = useMemo(() => {
    // Local + backend merge — duplicate id hata do
    const localSites     = heritageData.getAllSites();
    const localIds       = new Set(localSites.map((s) => s.id));
    const uniqueApiSites = apiSites.filter((s) => !localIds.has(s.id));
    let sites            = [...localSites, ...uniqueApiSites];

    if (selectedState)    sites = sites.filter((s) => s.stateKey    === selectedState);
    if (selectedDistrict) sites = sites.filter((s) => s.districtKey === selectedDistrict);
    if (selectedType)     sites = sites.filter((s) => s.type        === selectedType);
    if (unescoOnly)       sites = sites.filter((s) => s.unesco);
    return sites;
  }, [selectedState, selectedDistrict, selectedType, unescoOnly, apiSites]);

  const activeTypeBg = selectedType
    ? heritageData.heritageTypes[selectedType]?.bgVideo
    : null;

  const handleStateChange = (e) => {
    setSelectedState(e.target.value);
    setSelectedDistrict("");
  };

  return (
    <>
      <style>{`
        .discovery-section {
          padding: 6rem 5vw 5rem;
          position: relative;
          min-height: 70vh;
        }
        .discovery-bg-blur {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          opacity: 0.07;
          transition: all 0.8s ease;
          pointer-events: none;
        }
        .discovery-section-header {
          margin-bottom: 3rem;
          max-width: 720px;
        }
        .section-eyebrow {
          font-family: 'Space Mono', monospace;
          font-size: 0.62rem;
          color: #C9A84C;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          margin-bottom: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.65rem;
        }
        .section-eyebrow::before {
          content: '';
          display: block;
          width: 24px; height: 1px;
          background: #C9A84C;
        }
        .section-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2rem, 4vw, 3.2rem);
          font-weight: 700;
          color: #F2E8D0;
          line-height: 1.1;
          margin-bottom: 0.75rem;
        }
        .section-desc {
          font-family: 'Poppins', sans-serif;
          font-size: 0.9rem;
          color: rgba(242,232,208,0.55);
          line-height: 1.7;
        }
        .filter-panel {
          background: rgba(15, 30, 47, 0.7);
          border: 1px solid rgba(201,168,76,0.14);
          border-radius: 20px;
          padding: 1.75rem 2rem;
          margin-bottom: 2.5rem;
          backdrop-filter: blur(16px);
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.25rem;
          align-items: end;
        }
        .filter-group label {
          display: block;
          font-family: 'Space Mono', monospace;
          font-size: 0.57rem;
          color: rgba(242,232,208,0.42);
          letter-spacing: 0.14em;
          text-transform: uppercase;
          margin-bottom: 0.5rem;
        }
        .filter-select {
          width: 100%;
          background: rgba(26,46,68,0.7);
          border: 1px solid rgba(201,168,76,0.2);
          border-radius: 10px;
          padding: 0.7rem 1rem;
          color: #F2E8D0;
          font-family: 'Poppins', sans-serif;
          font-size: 0.82rem;
          outline: none;
          cursor: pointer;
          transition: border-color 0.3s;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23C9A84C'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 0.9rem center;
          padding-right: 2.2rem;
        }
        .filter-select:focus { border-color: #C9A84C; }
        .filter-select option { background: #0F1E2F; color: #F2E8D0; }
        .filter-toggle {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          cursor: pointer;
        }
        .toggle-switch {
          width: 38px; height: 21px;
          background: rgba(26,46,68,0.7);
          border: 1px solid rgba(201,168,76,0.25);
          border-radius: 20px;
          position: relative;
          transition: all 0.3s;
          flex-shrink: 0;
        }
        .toggle-switch.on { background: rgba(201,168,76,0.25); border-color: #C9A84C; }
        .toggle-knob {
          position: absolute;
          top: 3px; left: 3px;
          width: 13px; height: 13px;
          background: rgba(242,232,208,0.4);
          border-radius: 50%;
          transition: all 0.3s;
        }
        .toggle-switch.on .toggle-knob { left: 20px; background: #C9A84C; }
        .toggle-label {
          font-family: 'Poppins', sans-serif;
          font-size: 0.8rem;
          color: rgba(242,232,208,0.65);
        }
        .type-pills {
          display: flex;
          gap: 0.6rem;
          flex-wrap: wrap;
          margin-bottom: 2.5rem;
        }
        .type-pill {
          background: rgba(26,46,68,0.55);
          border: 1px solid rgba(201,168,76,0.15);
          color: rgba(242,232,208,0.6);
          padding: 0.55rem 1.25rem;
          border-radius: 30px;
          font-family: 'Space Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.08em;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .type-pill:hover { border-color: rgba(201,168,76,0.4); color: #F2E8D0; }
        .type-pill.active {
          background: rgba(201,168,76,0.14);
          border-color: #C9A84C;
          color: #C9A84C;
        }
        .results-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.75rem;
        }
        .results-count {
          font-family: 'Space Mono', monospace;
          font-size: 0.65rem;
          color: rgba(242,232,208,0.45);
          letter-spacing: 0.1em;
        }
        .results-count span { color: #C9A84C; font-weight: 700; }
        .sites-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }
        .no-results {
          grid-column: 1 / -1;
          text-align: center;
          padding: 4rem 2rem;
        }
        .no-results-icon { font-size: 3rem; margin-bottom: 1rem; }
        .no-results-msg {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.4rem;
          color: rgba(242,232,208,0.4);
        }
        @media (max-width: 600px) {
          .filter-panel { grid-template-columns: 1fr 1fr; padding: 1.25rem; }
          .sites-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <section className="discovery-section" id="discover">
        {activeTypeBg && (
          <div
            className="discovery-bg-blur"
            style={{ backgroundImage: `url(${activeTypeBg})` }}
          />
        )}

        <div style={{ position: "relative", zIndex: 1 }}>
          <div className="discovery-section-header">
            <div className="section-eyebrow">Explore India's Heritage</div>
            <h2 className="section-title">Discover Sacred & Ancient Sites</h2>
            <p className="section-desc">
              Navigate 3,000+ heritage sites across India — from UNESCO World Heritage monuments
              to hidden regional gems — using our intelligent discovery engine.
            </p>
          </div>

          {/* Type pills */}
          <div className="type-pills">
            <div
              className={`type-pill ${!selectedType ? "active" : ""}`}
              onClick={() => setSelectedType("")}
            >
              🌐 All Types
            </div>
            {heritageTypes.map(([key, type]) => (
              <div
                key={key}
                className={`type-pill ${selectedType === key ? "active" : ""}`}
                onClick={() => setSelectedType(selectedType === key ? "" : key)}
              >
                {type.icon} {type.label}
              </div>
            ))}
          </div>

          {/* Filter Panel */}
          <div className="filter-panel">
            <div className="filter-group">
              <label>State</label>
              <select className="filter-select" value={selectedState} onChange={handleStateChange}>
                <option value="">All States</option>
                {states.map(([key, s]) => (
                  <option key={key} value={key}>{s.name}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>District / City</label>
              <select
                className="filter-select"
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                disabled={!selectedState}
              >
                <option value="">All Districts</option>
                {districts.map(([key, d]) => (
                  <option key={key} value={key}>{d.name}</option>
                ))}
              </select>
            </div>

            <div className="filter-group" style={{ display: "flex", alignItems: "center", paddingTop: "1.2rem" }}>
              <div className="filter-toggle" onClick={() => setUnescoOnly(!unescoOnly)}>
                <div className={`toggle-switch ${unescoOnly ? "on" : ""}`}>
                  <div className="toggle-knob" />
                </div>
                <span className="toggle-label">UNESCO only</span>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="results-header">
            <div className="results-count">
              {loading
                ? <span style={{ color: "rgba(201,168,76,0.6)" }}>Loading sites...</span>
                : <><span>{filteredSites.length}</span> heritage sites
                  {selectedState && ` in ${heritageData.states[selectedState]?.name}`}</>
              }
            </div>
          </div>

          <div className="sites-grid">
            {filteredSites.length === 0 && !loading ? (
              <div className="no-results">
                <div className="no-results-icon">🏛️</div>
                <div className="no-results-msg">No sites match your filters</div>
              </div>
            ) : (
              filteredSites.map((site) => (
                <SiteCard key={site.id} site={site} onClick={onSiteClick} />
              ))
            )}
          </div>
        </div>
      </section>
    </>
  );
}