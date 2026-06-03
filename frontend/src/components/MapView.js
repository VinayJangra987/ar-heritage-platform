// src/components/MapView.js
import { useEffect, useRef, useState } from "react";
import heritageData from "../data/heritage";

const typeColors = {
  architectural: "#C9A84C",
  archaeological: "#8B6F47",
  religious:      "#E07B54",
  natural:        "#4A7C59",
  intangible:     "#9B59B6",
};

const typeIcons = {
  architectural: "🏛️",
  archaeological: "⛏️",
  religious:      "🛕",
  natural:        "🌿",
  intangible:     "🎭",
};

export default function MapView({ onSiteClick }) {
  const mapRef         = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef     = useRef([]);
  const shieldRef      = useRef(null);

  // eslint-disable-next-line no-unused-vars
  const [selectedSite, setSelectedSite] = useState(null);
  const [filterType,   setFilterType]   = useState("");
  const [filterState,  setFilterState]  = useState("");
  const [mapLoaded,    setMapLoaded]    = useState(false);
  const [mapActive,    setMapActive]    = useState(false); // scroll-zoom guard

  const allSites      = heritageData.getAllSites();
  const filteredSites = allSites.filter((s) => {
    if (filterType  && s.type     !== filterType)  return false;
    if (filterState && s.stateKey !== filterState) return false;
    return true;
  });

  /* ── Load Leaflet ── */
  useEffect(() => {
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id   = "leaflet-css";
      link.rel  = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }
    if (window.L) { setMapLoaded(true); return; }
    const script    = document.createElement("script");
    script.src      = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.onload   = () => setMapLoaded(true);
    document.head.appendChild(script);
  }, []);

  /* ── Init map ── */
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || mapInstanceRef.current) return;
    const L   = window.L;
    const map = L.map(mapRef.current, {
      center:          [22.5, 80.0],
      zoom:            5,
      zoomControl:     false,
      // KEY FIX: disable scroll zoom by default
      scrollWheelZoom: false,
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> © <a href="https://carto.com/">CARTO</a>',
      subdomains:  "abcd",
      maxZoom:     19,
    }).addTo(map);

    L.control.zoom({ position: "bottomright" }).addTo(map);
    mapInstanceRef.current = map;
  }, [mapLoaded]);

  /* ── Enable/disable scroll zoom based on mapActive ── */
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    if (mapActive) {
      map.scrollWheelZoom.enable();
    } else {
      map.scrollWheelZoom.disable();
    }
  }, [mapActive]);

  /* ── Click outside map → deactivate scroll zoom ── */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (mapRef.current && !mapRef.current.contains(e.target)) {
        setMapActive(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ── Markers ── */
  useEffect(() => {
    if (!mapLoaded || !mapInstanceRef.current) return;
    const L   = window.L;
    const map = mapInstanceRef.current;

    markersRef.current.forEach((m) => map.removeLayer(m));
    markersRef.current = [];

    filteredSites.forEach((site) => {
      if (!site.coordinates?.lat || !site.coordinates?.lng) return;
      const color = site.unesco ? "#C9A84C" : typeColors[site.type] || "#4EC9D1";

      const icon = L.divIcon({
        className: "",
        html: `
          <div style="
            width:32px;height:32px;
            background:${color};
            border:2px solid rgba(255,255,255,0.3);
            border-radius:50% 50% 50% 0;
            transform:rotate(-45deg);
            box-shadow:0 4px 15px rgba(0,0,0,0.5);
            cursor:pointer;
          ">
            <div style="
              width:100%;height:100%;
              display:flex;align-items:center;justify-content:center;
              transform:rotate(45deg);font-size:13px;
            ">${typeIcons[site.type] || "🏛️"}</div>
          </div>`,
        iconSize:    [32, 32],
        iconAnchor:  [16, 32],
        popupAnchor: [0, -36],
      });

      const popupContent = `
        <div style="
          background:#0F1E2F;border:1px solid rgba(201,168,76,0.3);
          border-radius:12px;padding:12px;min-width:200px;
          font-family:'Poppins',sans-serif;color:#F2E8D0;
        ">
          <img src="${site.images?.[0] || ''}" style="
            width:100%;height:110px;object-fit:cover;
            border-radius:8px;margin-bottom:10px;display:block;
          "/>
          ${site.unesco ? `<span style="
            background:#C9A84C;color:#0D1B2A;padding:2px 8px;
            border-radius:10px;font-size:10px;font-weight:700;
            font-family:'Space Mono',monospace;letter-spacing:0.08em;
          ">UNESCO ★</span>` : ""}
          <div style="
            font-family:'Cormorant Garamond',serif;font-size:1.1rem;
            font-weight:700;margin:6px 0 2px;color:#F2E8D0;
          ">${site.name}</div>
          <div style="
            font-family:'Space Mono',monospace;font-size:0.6rem;
            color:#C9A84C;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:8px;
          ">📍 ${site.district}, ${site.state}</div>
          <div style="
            font-size:0.75rem;color:rgba(242,232,208,0.6);
            line-height:1.5;margin-bottom:10px;
          ">${site.description?.slice(0, 100)}...</div>
          <button onclick="window.__heritageOpenSite('${site.id}')" style="
            background:linear-gradient(135deg,#C9A84C,#E8C96A);color:#0D1B2A;
            border:none;padding:7px 16px;border-radius:20px;
            font-family:'Space Mono',monospace;font-size:0.6rem;font-weight:700;
            letter-spacing:0.08em;cursor:pointer;width:100%;margin-bottom:6px;
          ">View Full Details</button>
          <a href="https://www.google.com/maps?q=${site.coordinates.lat},${site.coordinates.lng}"
            target="_blank" style="
            display:block;text-align:center;
            font-family:'Space Mono',monospace;font-size:0.58rem;
            color:rgba(242,232,208,0.45);text-decoration:none;padding:4px;
          ">🧭 Open in Google Maps</a>
        </div>`;

      const marker = L.marker([site.coordinates.lat, site.coordinates.lng], { icon });
      marker.bindPopup(popupContent, { maxWidth: 240, className: "heritage-popup" });
      marker.on("click", () => setSelectedSite(site));
      marker.addTo(map);
      markersRef.current.push(marker);
    });

    if (!document.getElementById("heritage-popup-style")) {
      const style = document.createElement("style");
      style.id    = "heritage-popup-style";
      style.textContent = `
        .heritage-popup .leaflet-popup-content-wrapper {
          background:transparent!important;border:none!important;
          box-shadow:0 20px 60px rgba(0,0,0,0.6)!important;
          border-radius:12px!important;padding:0!important;
        }
        .heritage-popup .leaflet-popup-content{margin:0!important;}
        .heritage-popup .leaflet-popup-tip-container{display:none;}
        .leaflet-popup-close-button{color:#C9A84C!important;font-size:18px!important;right:8px!important;top:6px!important;z-index:10;}
      `;
      document.head.appendChild(style);
    }
  }, [mapLoaded, filteredSites]);

  /* ── Global popup handler ── */
  useEffect(() => {
    window.__heritageOpenSite = (siteId) => {
      const site = allSites.find((s) => s.id === siteId);
      if (site && onSiteClick) onSiteClick(site);
    };
    return () => { delete window.__heritageOpenSite; };
  }, [onSiteClick, allSites]);

  const states       = Object.entries(heritageData.states);
  const heritageTypes = Object.entries(heritageData.heritageTypes);

  return (
    <>
      <style>{`
        .mapview-section {
          position: relative;
          z-index: 0;
          isolation: isolate;
          background: #080E17;
          padding-top: 5rem;
        }
        .mapview-header { padding: 0 5vw 2.5rem; }
        .mapview-controls {
          padding: 0 5vw;
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          align-items: center;
        }
        .map-filter-select {
          background-color: rgba(15,30,47,0.95);
          border: 1px solid rgba(201,168,76,0.22);
          border-radius: 10px;
          padding: 0.6rem 2rem 0.6rem 1rem;
          color: #F2E8D0;
          font-family: 'Space Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.08em;
          outline: none;
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23C9A84C'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 0.75rem center;
          transition: border-color 0.3s;
        }
        .map-filter-select:focus { border-color: #C9A84C; }
        .map-filter-select option { background: #0F1E2F; }
        .map-site-count {
          font-family: 'Space Mono', monospace;
          font-size: 0.6rem;
          color: rgba(242,232,208,0.4);
          letter-spacing: 0.1em;
          margin-left: auto;
        }
        .map-site-count span { color: #C9A84C; font-weight: 700; }

        /* Map container */
        .map-container {
          width: 100%;
          height: 580px;
          position: relative;
          z-index: 1;
          isolation: isolate;
          background: #0A141F;
          border-top: 1px solid rgba(201,168,76,0.1);
          border-bottom: 1px solid rgba(201,168,76,0.1);
          overflow: hidden;
        }
        .map-container .leaflet-container {
          width: 100% !important;
          height: 100% !important;
          background: #0A141F !important;
        }

        /* ── SCROLL ZOOM SHIELD ── */
        .map-scroll-shield {
          position: absolute;
          inset: 0;
          z-index: 900;
          cursor: pointer;
          background: transparent;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          padding-bottom: 1.5rem;
          transition: opacity 0.3s;
        }
        .map-scroll-shield-hint {
          background: rgba(13,27,42,0.88);
          border: 1px solid rgba(201,168,76,0.35);
          border-radius: 24px;
          padding: 0.55rem 1.3rem;
          font-family: 'Space Mono', monospace;
          font-size: 0.58rem;
          color: #C9A84C;
          letter-spacing: 0.1em;
          pointer-events: none;
          animation: shieldPulse 2s ease-in-out infinite;
        }
        @keyframes shieldPulse {
          0%,100% { opacity: 0.7; }
          50%      { opacity: 1; }
        }

        .map-loading {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0A141F;
          z-index: 10;
          flex-direction: column;
          gap: 1rem;
        }
        .map-loading-spinner {
          width: 40px; height: 40px;
          border: 2px solid rgba(201,168,76,0.15);
          border-top-color: #C9A84C;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .map-loading-text {
          font-family: 'Space Mono', monospace;
          font-size: 0.65rem;
          color: rgba(242,232,208,0.4);
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }

        .map-legend {
          padding: 1.5rem 5vw;
          display: flex;
          gap: 1.5rem;
          flex-wrap: wrap;
          background: rgba(10,20,33,0.98);
          border-bottom: 1px solid rgba(201,168,76,0.08);
        }
        .legend-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-family: 'Space Mono', monospace;
          font-size: 0.58rem;
          color: rgba(242,232,208,0.5);
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .legend-dot {
          width: 10px; height: 10px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .leaflet-control-zoom a {
          background: rgba(15,30,47,0.9) !important;
          color: #C9A84C !important;
          border-color: rgba(201,168,76,0.2) !important;
        }
        .leaflet-control-zoom a:hover { background: rgba(201,168,76,0.15) !important; }
        .leaflet-control-attribution {
          background: rgba(8,14,23,0.7) !important;
          color: rgba(242,232,208,0.3) !important;
          font-size: 9px !important;
        }
        .leaflet-control-attribution a { color: rgba(201,168,76,0.5) !important; }
      `}</style>

      <section className="mapview-section" id="map">
        {/* Header */}
        <div className="mapview-header">
          <div style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.62rem", color: "#C9A84C",
            letterSpacing: "0.22em", textTransform: "uppercase",
            marginBottom: "0.6rem", display: "flex", alignItems: "center", gap: "0.65rem",
          }}>
            <span style={{ display: "block", width: "24px", height: "1px", background: "#C9A84C" }} />
            Interactive Heritage Map
          </div>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
            fontWeight: 700, color: "#F2E8D0", lineHeight: 1.1, marginBottom: "0.5rem",
          }}>
            Explore India on the Map
          </h2>
          <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: "0.88rem", color: "rgba(242,232,208,0.5)" }}>
            Click any marker to explore heritage sites — zoom, pan, and discover India's cultural landscape.
          </p>
        </div>

        {/* Filters */}
        <div className="mapview-controls">
          <select className="map-filter-select" value={filterState} onChange={(e) => setFilterState(e.target.value)}>
            <option value="">🗺️ All States</option>
            {states.map(([key, s]) => <option key={key} value={key}>{s.name}</option>)}
          </select>
          <select className="map-filter-select" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="">🏛️ All Types</option>
            {heritageTypes.map(([key, t]) => <option key={key} value={key}>{t.icon} {t.label}</option>)}
          </select>
          <div className="map-site-count"><span>{filteredSites.length}</span> sites on map</div>
        </div>

        {/* Map */}
        <div className="map-container">
          {!mapLoaded && (
            <div className="map-loading">
              <div className="map-loading-spinner" />
              <div className="map-loading-text">Loading Map...</div>
            </div>
          )}

          {/* Scroll zoom shield — shown until user clicks map */}
          {mapLoaded && !mapActive && (
            <div
              className="map-scroll-shield"
              ref={shieldRef}
              onClick={() => setMapActive(true)}
            >
              <div className="map-scroll-shield-hint">
                🖱 Click map to enable scroll zoom
              </div>
            </div>
          )}

          <div
            ref={mapRef}
            style={{ width: "100%", height: "100%", background: "#0A141F", position: "relative", zIndex: 1 }}
          />
        </div>

        {/* Legend */}
        <div className="map-legend">
          {Object.entries(typeColors).map(([type, color]) => (
            <div key={type} className="legend-item">
              <div className="legend-dot" style={{ background: color }} />
              {typeIcons[type]} {type}
            </div>
          ))}
          <div className="legend-item" style={{ marginLeft: "auto" }}>
            <div className="legend-dot" style={{ background: "#C9A84C", border: "2px solid white" }} />
            UNESCO World Heritage
          </div>
        </div>
      </section>
    </>
  );
}