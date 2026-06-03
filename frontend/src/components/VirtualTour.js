// src/components/VirtualTour.js
// Immersive guided virtual tour with progress tracking

import { useState, useEffect, useRef, useCallback } from "react";

const TOURS = [
  {
    id: "taj-mahal",
    name: "Taj Mahal",
    location: "Agra, Uttar Pradesh",
    duration: "12 min",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1400&q=90",
    color: "#E8D5B7",
    stops: [
      { id: 1, title: "The Great Gate — Darwaza-i-Rauza", duration: "2 min", image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80", content: "You enter through the magnificent red sandstone gateway, known as the Darwaza-i-Rauza or 'Gate of the Mausoleum'. Built in 1648, this 30-metre-high structure frames a breathtaking first glimpse of the Taj Mahal beyond. Notice the intricate white marble inlay work and the 22 small domes on top — one for each year of construction.", fact: "The gate is inscribed with verses from the Quran in black marble inlay." },
      { id: 2, title: "The Reflecting Pool", duration: "1.5 min", image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80", content: "Walk along the central pathway flanked by the famous Hauz-i-Kausar, the reflecting pool that mirrors the Taj Mahal's image perfectly. This 300-metre channel is lined with cyprus trees symbolising death, and fruit trees symbolising life. At dawn, the reflection creates an ethereal double image — a favourite of photographers worldwide.", fact: "The pool water appears to change colour with the sky — pink at sunrise, golden at sunset." },
      { id: 3, title: "The Main Mausoleum", duration: "4 min", image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80", content: "You now stand before one of humanity's greatest architectural achievements. The central dome rises 73 metres above the platform — taller than a 20-storey building. The pure white Makrana marble was brought from Rajasthan on elephant back. Notice how the four minarets lean slightly outward — this was a deliberate structural choice to protect the tomb if they fell.", fact: "The Taj Mahal appears to change colour throughout the day — pinkish at dawn, white at noon, golden at sunset." },
      { id: 4, title: "The Interior Chamber", duration: "2.5 min", image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80", content: "Inside, an octagonal chamber houses the ornamental tombs of Shah Jahan and Mumtaz Mahal, surrounded by an exquisite marble screen (jali) inlaid with 28 types of precious and semi-precious stones. The actual graves lie in a plain crypt below, facing Mecca. Natural light filters through marble lattice screens, creating a soft, sacred atmosphere.", fact: "Over 1,000 elephants were used to transport building materials during construction." },
      { id: 5, title: "The Mosque & Guest House", duration: "2 min", image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80", content: "Flanking the main tomb are two identical red sandstone buildings. To the west is the mosque, still used for Friday prayers. To the east is the jawab (answer) — a mirror building built purely for symmetry, one of the Mughal's great architectural devices. This perfect bilateral symmetry is one reason the complex feels so visually harmonious.", fact: "The jawab cannot be used as a mosque because it faces away from Mecca." },
    ],
  },
  {
    id: "hampi",
    name: "Hampi Ruins",
    location: "Karnataka",
    duration: "15 min",
    image: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=1400&q=90",
    color: "#C9A84C",
    stops: [
      { id: 1, title: "Virupaksha Temple", duration: "3 min", image: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=800&q=80", content: "Your journey begins at the Virupaksha Temple, a living temple dedicated to Lord Shiva and the spiritual heart of Hampi. This ancient temple predates the Vijayanagara Empire itself and has been in continuous use for over 1,300 years. Its towering gopuram (gateway tower), rising 49 metres, is decorated with painted stucco figures from Hindu mythology.", fact: "An elephant named Lakshmi lives here and blesses devotees by touching their heads with her trunk." },
      { id: 2, title: "The Stone Chariot", duration: "2 min", image: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=800&q=80", content: "One of Hampi's most iconic monuments, this magnificent stone chariot was carved in the 16th century in honour of Garuda, the vehicle of Lord Vishnu. Remarkably detailed, the wheels are carved so precisely that they actually rotate. The chariot sits within the Vittala Temple complex — the finest example of Vijayanagara architecture.", fact: "The stone chariot appears on the Indian 50-rupee note." },
      { id: 3, title: "Musical Pillars of Vittala Temple", duration: "3 min", image: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=800&q=80", content: "Inside the Vittala Temple stands one of ancient India's greatest engineering marvels — 56 musical pillars. When tapped, each pillar produces a different musical note, forming a complete scale. The British, curious about this phenomenon, cut two pillars to discover the secret — and found them hollow inside, with no mechanism. The acoustics are entirely natural.", fact: "The musical pillars have stumped modern engineers — no one fully understands how they produce such pure tones." },
      { id: 4, title: "Lotus Mahal & Zenana Enclosure", duration: "3 min", image: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=800&q=80", content: "Within the fortified Zanana enclosure (women's quarters), the Lotus Mahal is a two-storey pavilion combining Hindu and Islamic architectural styles. Its lotus-bud arches and recessed balconies were designed to catch the breeze and provide natural air-conditioning for the royal ladies. The structure has survived 500 years remarkably intact.", fact: "The Lotus Mahal may have served as a council chamber, not a women's palace — historians still debate." },
      { id: 5, title: "The Royal Enclosure", duration: "4 min", image: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=800&q=80", content: "The vast Royal Enclosure housed the king's ceremonial platform — the Mahanavami Dibba. This 8-metre-high stepped platform was the throne from which the king watched the nine-day Mahanavami festival, featuring processions of elephants, horses and soldiers. Its walls are carved with extraordinary relief sculptures showing hunting scenes, dancers, and court life.", fact: "Hampi was the second-largest city in the world in 1500 CE, with a population of over 500,000." },
    ],
  },
  {
    id: "ajanta",
    name: "Ajanta Caves",
    location: "Maharashtra",
    duration: "10 min",
    image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=1400&q=90",
    color: "#E07B54",
    stops: [
      { id: 1, title: "The Horseshoe Cliff", duration: "1.5 min", image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&q=80", content: "The Ajanta Caves are carved into a dramatic horseshoe-shaped cliff above the Waghora river. For over 2,000 years, Buddhist monks laboured to create 30 caves from solid basalt rock. The caves were abandoned around 650 CE and remained completely unknown to the outside world for over 1,000 years, perfectly preserved in the jungle.", fact: "The caves were rediscovered in 1819 by a British army officer named John Smith during a tiger hunt." },
      { id: 2, title: "Cave 1 — The Royal Court", duration: "2.5 min", image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&q=80", content: "Cave 1 contains some of the finest paintings ever created by human hands. The murals depict scenes from the Jataka tales — stories of Buddha's previous lives — painted with extraordinary naturalism and psychological depth. Notice the famous Bodhisattva Padmapani painting: the figure's gentle expression and the intricate details of jewellery and fabric have not faded in 1,500 years.", fact: "The painters used natural pigments from plants and minerals — lapis lazuli for blue, lamp black for outlines." },
      { id: 3, title: "Cave 26 — The Reclining Buddha", duration: "2 min", image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&q=80", content: "Cave 26 is a chaitya (prayer hall) containing the most dramatic sculpture at Ajanta — a massive 7-metre reclining Buddha depicting his Mahaparinirvana (passing into final nirvana). The figure radiates serenity, and the surrounding smaller figures show disciples grieving while celestial beings above celebrate his liberation. The cave's vaulted ceiling mimics wooden architecture in stone.", fact: "The technique used — fresco secco — involves painting on dried plaster, making preservation even more remarkable." },
      { id: 4, title: "The Monastery Caves", duration: "2 min", image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&q=80", content: "The vihara (monastery) caves served as living quarters for Buddhist monks. Each cave has a central hall with small cells around the edges where monks slept, meditated, and studied. Some cells still have stone pillows carved into the platform beds. Channels cut into the rock managed water flow, and the cliff face was angled to maximise natural light.", fact: "At its peak, Ajanta was a major Buddhist university hosting scholars from across Asia." },
    ],
  },
];

export default function VirtualTour({ onClose, initialTourId }) {
  const [selectedTour, setSelectedTour] = useState(
    initialTourId ? TOURS.find(t => t.id === initialTourId) || TOURS[0] : null
  );
  const [currentStop, setCurrentStop]   = useState(0);
  const [progress,    setProgress]      = useState({});
  const [autoPlay,    setAutoPlay]      = useState(false);
  const [elapsed,     setElapsed]       = useState(0);
  const timerRef = useRef(null);

  // Load progress
  useEffect(() => {
    try { setProgress(JSON.parse(localStorage.getItem("dharohar_tour_progress") || "{}")); } catch {}
  }, []);

  const saveProgress = useCallback((tourId, stopIdx) => {
    setProgress(p => {
      const updated = { ...p, [tourId]: { stop: stopIdx, total: TOURS.find(t => t.id === tourId)?.stops.length, ts: Date.now() } };
      localStorage.setItem("dharohar_tour_progress", JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Auto-play timer
  useEffect(() => {
    if (!autoPlay || !selectedTour) return;
    timerRef.current = setInterval(() => {
      setElapsed(e => {
        if (e >= 100) {
          const next = currentStop + 1;
          if (next < selectedTour.stops.length) {
            setCurrentStop(next);
            saveProgress(selectedTour.id, next);
            return 0;
          } else {
            setAutoPlay(false);
            return 100;
          }
        }
        return e + 0.5;
      });
    }, 150);
    return () => clearInterval(timerRef.current);
  }, [autoPlay, currentStop, selectedTour, saveProgress]);

  const goToStop = (idx) => {
    setCurrentStop(idx);
    setElapsed(0);
    if (selectedTour) saveProgress(selectedTour.id, idx);
  };

  const startTour = (tour) => {
    const saved = progress[tour.id];
    setSelectedTour(tour);
    setCurrentStop(saved?.stop || 0);
    setElapsed(0);
    setAutoPlay(false);
  };

  const stop = selectedTour?.stops[currentStop];
  const tourProgress = selectedTour ? progress[selectedTour.id] : null;
  const completedStops = tourProgress?.stop ?? -1;

  // ── TOUR SELECTION ──────────────────────────────────────────────────────────
  if (!selectedTour) return (
    <>
      <style>{`
        @keyframes vtFade { from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)} }
        .vt-overlay { position:fixed;inset:0;z-index:10000;background:#050A0F;display:flex;flex-direction:column;font-family:'Poppins',sans-serif;animation:vtFade 0.3s ease; }
        .vt-topbar { display:flex;align-items:center;justify-content:space-between;padding:1rem 1.5rem;border-bottom:1px solid rgba(201,168,76,0.12);flex-shrink:0; }
        .vt-badge { font-family:'Space Mono',monospace;font-size:0.52rem;letter-spacing:0.15em;text-transform:uppercase;color:#0D1B2A;background:#C9A84C;padding:3px 10px;border-radius:20px;font-weight:700; }
        .vt-hdr-title { font-family:'Space Mono',monospace;font-size:0.62rem;color:rgba(242,232,208,0.5);letter-spacing:0.12em;text-transform:uppercase; }
        .vt-close { width:36px;height:36px;display:flex;align-items:center;justify-content:center;background:rgba(242,232,208,0.06);border:1px solid rgba(242,232,208,0.12);border-radius:10px;color:rgba(242,232,208,0.6);font-size:1rem;cursor:pointer;transition:all 0.2s; }
        .vt-close:hover { background:rgba(201,168,76,0.15);color:#C9A84C; }
        .vt-sel-body { flex:1;overflow-y:auto;padding:2rem; }
        .vt-sel-title { font-family:'Cormorant Garamond',serif;font-size:2rem;font-weight:700;color:#F2E8D0;margin-bottom:0.4rem; }
        .vt-sel-sub { font-family:'Space Mono',monospace;font-size:0.55rem;color:rgba(242,232,208,0.3);letter-spacing:0.15em;text-transform:uppercase;margin-bottom:2rem; }
        .vt-tour-grid { display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1.2rem; }
        .vt-tour-card { border-radius:18px;overflow:hidden;cursor:pointer;transition:all 0.25s;border:1px solid rgba(242,232,208,0.07);background:rgba(8,18,30,0.8); }
        .vt-tour-card:hover { border-color:rgba(201,168,76,0.3);transform:translateY(-4px);box-shadow:0 16px 40px rgba(0,0,0,0.5); }
        .vt-tour-img { width:100%;height:180px;object-fit:cover;display:block; }
        .vt-tour-body { padding:1.2rem; }
        .vt-tour-name { font-family:'Cormorant Garamond',serif;font-size:1.25rem;font-weight:700;color:#F2E8D0;margin-bottom:4px; }
        .vt-tour-meta { display:flex;align-items:center;gap:0.75rem;margin-bottom:0.75rem; }
        .vt-tour-loc { font-family:'Space Mono',monospace;font-size:0.48rem;color:rgba(242,232,208,0.35);letter-spacing:0.08em; }
        .vt-tour-dur { font-family:'Space Mono',monospace;font-size:0.48rem;color:rgba(201,168,76,0.7);letter-spacing:0.08em; }
        .vt-tour-stops { font-size:0.75rem;color:rgba(242,232,208,0.4);margin-bottom:1rem; }
        .vt-tour-progress-bar { height:3px;background:rgba(242,232,208,0.08);border-radius:2px;overflow:hidden;margin-bottom:0.75rem; }
        .vt-tour-progress-fill { height:100%;border-radius:2px;transition:width 0.4s ease; }
        .vt-start-btn { width:100%;padding:0.7rem;background:linear-gradient(135deg,#C9A84C,#E8C96A);color:#0D1B2A;border:none;border-radius:8px;font-family:'Space Mono',monospace;font-size:0.58rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;cursor:pointer;transition:all 0.2s; }
        .vt-start-btn:hover { box-shadow:0 6px 20px rgba(201,168,76,0.35); }
        .vt-resume-badge { font-family:'Space Mono',monospace;font-size:0.45rem;color:rgba(74,200,120,0.7);letter-spacing:0.1em;text-transform:uppercase;margin-bottom:4px; }
      `}</style>
      <div className="vt-overlay">
        <div className="vt-topbar">
          <div style={{display:"flex",alignItems:"center",gap:"0.75rem"}}>
            <span className="vt-badge">🗺 Virtual Tours</span>
            <span className="vt-hdr-title">Choose a Heritage Journey</span>
          </div>
          <button className="vt-close" onClick={onClose}>✕</button>
        </div>
        <div className="vt-sel-body">
          <div className="vt-sel-title">Virtual Heritage Tours</div>
          <div className="vt-sel-sub">Guided journeys through India's greatest monuments</div>
          <div className="vt-tour-grid">
            {TOURS.map(tour => {
              const p = progress[tour.id];
              const pct = p ? Math.round(((p.stop + 1) / tour.stops.length) * 100) : 0;
              return (
                <div className="vt-tour-card" key={tour.id}>
                  <img className="vt-tour-img" src={tour.image} alt={tour.name} />
                  <div className="vt-tour-body">
                    {p && <div className="vt-resume-badge">↩ {pct}% completed</div>}
                    <div className="vt-tour-name">{tour.name}</div>
                    <div className="vt-tour-meta">
                      <span className="vt-tour-loc">📍 {tour.location}</span>
                      <span className="vt-tour-dur">⏱ {tour.duration}</span>
                    </div>
                    <div className="vt-tour-stops">{tour.stops.length} stops along the way</div>
                    {p && (
                      <div className="vt-tour-progress-bar">
                        <div className="vt-tour-progress-fill" style={{ width: `${pct}%`, background: tour.color }} />
                      </div>
                    )}
                    <button className="vt-start-btn" onClick={() => startTour(tour)}>
                      {p ? "↩ Resume Tour" : "▶ Begin Tour"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );

  // ── ACTIVE TOUR ─────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @keyframes vtFade  { from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)} }
        @keyframes vtSlide { from{opacity:0;transform:translateX(30px)}to{opacity:1;transform:translateX(0)} }

        .vt-overlay { position:fixed;inset:0;z-index:10000;background:#050A0F;display:flex;flex-direction:column;font-family:'Poppins',sans-serif;animation:vtFade 0.3s ease;overflow:hidden; }

        /* Top bar */
        .vt-topbar { display:flex;align-items:center;justify-content:space-between;padding:1rem 1.5rem;border-bottom:1px solid rgba(201,168,76,0.12);flex-shrink:0; }
        .vt-badge { font-family:'Space Mono',monospace;font-size:0.52rem;letter-spacing:0.15em;text-transform:uppercase;color:#0D1B2A;background:#C9A84C;padding:3px 10px;border-radius:20px;font-weight:700; }
        .vt-hdr-title { font-family:'Space Mono',monospace;font-size:0.62rem;color:rgba(242,232,208,0.5);letter-spacing:0.12em;text-transform:uppercase; }
        .vt-topbar-right { display:flex;align-items:center;gap:0.6rem; }
        .vt-btn-sm { padding:6px 14px;border-radius:8px;font-family:'Space Mono',monospace;font-size:0.52rem;letter-spacing:0.1em;text-transform:uppercase;cursor:pointer;transition:all 0.2s;border:none; }
        .vt-btn-sm.ghost { background:rgba(242,232,208,0.06);color:rgba(242,232,208,0.5);border:1px solid rgba(242,232,208,0.1); }
        .vt-btn-sm.ghost:hover { background:rgba(242,232,208,0.12);color:#F2E8D0; }
        .vt-close { width:36px;height:36px;display:flex;align-items:center;justify-content:center;background:rgba(242,232,208,0.06);border:1px solid rgba(242,232,208,0.12);border-radius:10px;color:rgba(242,232,208,0.6);font-size:1rem;cursor:pointer;transition:all 0.2s; }
        .vt-close:hover { background:rgba(201,168,76,0.15);color:#C9A84C; }

        /* Overall progress */
        .vt-overall-bar { display:flex;align-items:center;gap:0.75rem;padding:0.6rem 1.5rem;background:rgba(4,8,15,0.5);border-bottom:1px solid rgba(242,232,208,0.05);flex-shrink:0; }
        .vt-overall-label { font-family:'Space Mono',monospace;font-size:0.48rem;color:rgba(242,232,208,0.3);letter-spacing:0.1em;text-transform:uppercase;white-space:nowrap; }
        .vt-overall-track { flex:1;height:3px;background:rgba(242,232,208,0.08);border-radius:2px;overflow:hidden; }
        .vt-overall-fill  { height:100%;border-radius:2px;transition:width 0.4s ease; }
        .vt-overall-pct   { font-family:'Space Mono',monospace;font-size:0.48rem;color:rgba(201,168,76,0.7);white-space:nowrap; }

        /* Body */
        .vt-body { flex:1;display:grid;grid-template-columns:260px 1fr;overflow:hidden; }

        /* Stop list sidebar */
        .vt-stoplist { border-right:1px solid rgba(242,232,208,0.06);overflow-y:auto;padding:0.75rem; }
        .vt-stop-btn {
          width:100%;display:flex;align-items:flex-start;gap:0.7rem;
          padding:0.75rem;border-radius:10px;border:1px solid transparent;
          background:transparent;text-align:left;cursor:pointer;transition:all 0.2s;margin-bottom:4px;
        }
        .vt-stop-btn:hover { background:rgba(242,232,208,0.04);border-color:rgba(242,232,208,0.08); }
        .vt-stop-btn.active { background:rgba(201,168,76,0.08);border-color:rgba(201,168,76,0.25); }
        .vt-stop-btn.done .vt-stop-num { background:rgba(74,200,120,0.15);color:rgba(74,200,120,0.8);border-color:rgba(74,200,120,0.3); }
        .vt-stop-num {
          width:24px;height:24px;border-radius:50%;border:1px solid rgba(242,232,208,0.15);
          display:flex;align-items:center;justify-content:center;flex-shrink:0;
          font-family:'Space Mono',monospace;font-size:0.5rem;color:rgba(242,232,208,0.35);
          transition:all 0.2s;
        }
        .vt-stop-btn.active .vt-stop-num { background:rgba(201,168,76,0.15);color:#C9A84C;border-color:rgba(201,168,76,0.4); }
        .vt-stop-info { flex:1;min-width:0; }
        .vt-stop-name { font-size:0.78rem;font-weight:500;color:rgba(242,232,208,0.5);line-height:1.3;transition:color 0.2s; }
        .vt-stop-btn.active .vt-stop-name { color:#F2E8D0; }
        .vt-stop-dur  { font-family:'Space Mono',monospace;font-size:0.45rem;color:rgba(242,232,208,0.2);letter-spacing:0.08em;margin-top:3px; }

        /* Auto-play bar */
        .vt-autoplay-track { height:2px;background:rgba(201,168,76,0.1);border-radius:2px;overflow:hidden;margin-top:4px; }
        .vt-autoplay-fill  { height:100%;background:#C9A84C;border-radius:2px;transition:width 0.15s linear; }

        /* Main content */
        .vt-main { display:flex;flex-direction:column;overflow:hidden; }
        .vt-stop-img-wrap { position:relative;height:45%;flex-shrink:0;overflow:hidden; }
        .vt-stop-img { width:100%;height:100%;object-fit:cover;filter:brightness(0.7); }
        .vt-stop-img-overlay { position:absolute;inset:0;background:linear-gradient(to top,rgba(5,10,15,1) 0%,rgba(5,10,15,0.3) 60%,transparent 100%); }
        .vt-stop-header { position:absolute;bottom:1rem;left:1.5rem;right:1.5rem; }
        .vt-stop-counter { font-family:'Space Mono',monospace;font-size:0.52rem;color:rgba(201,168,76,0.7);letter-spacing:0.15em;text-transform:uppercase;margin-bottom:0.4rem; }
        .vt-stop-title { font-family:'Cormorant Garamond',serif;font-size:clamp(1.3rem,3vw,2rem);font-weight:700;color:#F2E8D0;line-height:1.1; }

        /* Text area */
        .vt-text-area { flex:1;overflow-y:auto;padding:1.5rem;animation:vtSlide 0.4s ease; }
        .vt-text-content { font-size:0.9rem;color:rgba(242,232,208,0.65);line-height:1.9;margin-bottom:1.2rem;max-width:680px; }
        .vt-fact-box { display:flex;align-items:flex-start;gap:0.75rem;padding:0.9rem;background:rgba(201,168,76,0.06);border:1px solid rgba(201,168,76,0.15);border-left:3px solid #C9A84C;border-radius:0 10px 10px 0;margin-bottom:1.5rem;max-width:680px; }
        .vt-fact-icon { font-size:1rem;flex-shrink:0; }
        .vt-fact-text { font-size:0.8rem;color:rgba(242,232,208,0.6);line-height:1.6;font-style:italic; }

        /* Navigation */
        .vt-nav { display:flex;align-items:center;gap:0.75rem;padding:1rem 1.5rem;border-top:1px solid rgba(242,232,208,0.06);flex-shrink:0; }
        .vt-nav-btn { padding:0.7rem 1.5rem;border-radius:8px;font-family:'Space Mono',monospace;font-size:0.58rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;cursor:pointer;transition:all 0.2s;border:none; }
        .vt-nav-btn.prev { background:rgba(242,232,208,0.06);color:rgba(242,232,208,0.5);border:1px solid rgba(242,232,208,0.1); }
        .vt-nav-btn.prev:hover:not(:disabled) { background:rgba(242,232,208,0.12);color:#F2E8D0; }
        .vt-nav-btn.prev:disabled { opacity:0.3;cursor:not-allowed; }
        .vt-nav-btn.next { background:linear-gradient(135deg,#C9A84C,#E8C96A);color:#0D1B2A; }
        .vt-nav-btn.next:hover { box-shadow:0 6px 20px rgba(201,168,76,0.35); }
        .vt-autoplay-btn { padding:0.7rem 1rem;border-radius:8px;background:rgba(201,168,76,0.08);border:1px solid rgba(201,168,76,0.2);color:#C9A84C;font-family:'Space Mono',monospace;font-size:0.52rem;letter-spacing:0.1em;cursor:pointer;transition:all 0.2s; }
        .vt-autoplay-btn.playing { background:rgba(201,168,76,0.15); }
        .vt-nav-spacer { flex:1; }

        /* Complete screen */
        .vt-complete { display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;text-align:center;padding:2rem;gap:1rem; }
        .vt-complete-icon { font-size:4rem; }
        .vt-complete-title { font-family:'Cormorant Garamond',serif;font-size:2rem;font-weight:700;color:#F2E8D0; }
        .vt-complete-text  { font-size:0.85rem;color:rgba(242,232,208,0.4);max-width:360px;line-height:1.7; }
        .vt-complete-btn { padding:0.8rem 2rem;background:linear-gradient(135deg,#C9A84C,#E8C96A);color:#0D1B2A;border:none;border-radius:50px;font-family:'Space Mono',monospace;font-size:0.62rem;font-weight:700;letter-spacing:0.1em;cursor:pointer;transition:all 0.25s; }
        .vt-complete-btn:hover { transform:translateY(-2px);box-shadow:0 8px 25px rgba(201,168,76,0.35); }

        @media(max-width:700px) {
          .vt-body { grid-template-columns:1fr; }
          .vt-stoplist { display:none; }
        }
      `}</style>

      <div className="vt-overlay">
        {/* Top bar */}
        <div className="vt-topbar">
          <div style={{ display:"flex",alignItems:"center",gap:"0.75rem" }}>
            <span className="vt-badge">🗺 Tour</span>
            <span className="vt-hdr-title">{selectedTour.name} · {selectedTour.location}</span>
          </div>
          <div className="vt-topbar-right">
            <button className="vt-btn-sm ghost" onClick={() => { setSelectedTour(null); setAutoPlay(false); }}>← All Tours</button>
            <button className="vt-close" onClick={onClose}>✕</button>
          </div>
        </div>

        {/* Overall progress bar */}
        <div className="vt-overall-bar">
          <span className="vt-overall-label">Tour Progress</span>
          <div className="vt-overall-track">
            <div className="vt-overall-fill" style={{ width: `${((currentStop) / selectedTour.stops.length) * 100}%`, background: selectedTour.color }} />
          </div>
          <span className="vt-overall-pct">Stop {currentStop + 1} of {selectedTour.stops.length}</span>
        </div>

        <div className="vt-body">
          {/* Stop list */}
          <div className="vt-stoplist">
            {selectedTour.stops.map((s, i) => (
              <button
                key={s.id}
                className={`vt-stop-btn ${i === currentStop ? "active" : ""} ${i <= completedStops ? "done" : ""}`}
                onClick={() => goToStop(i)}
              >
                <div className="vt-stop-num">{i <= completedStops ? "✓" : i + 1}</div>
                <div className="vt-stop-info">
                  <div className="vt-stop-name">{s.title}</div>
                  <div className="vt-stop-dur">⏱ {s.duration}</div>
                  {i === currentStop && autoPlay && (
                    <div className="vt-autoplay-track">
                      <div className="vt-autoplay-fill" style={{ width: `${elapsed}%` }} />
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Main */}
          <div className="vt-main">
            {currentStop >= selectedTour.stops.length ? (
              <div className="vt-complete">
                <div className="vt-complete-icon">🏆</div>
                <div className="vt-complete-title">Tour Complete!</div>
                <div className="vt-complete-text">You have completed the {selectedTour.name} virtual tour. We hope you enjoyed this journey through history.</div>
                <button className="vt-complete-btn" onClick={() => { setSelectedTour(null); setAutoPlay(false); }}>Explore More Tours →</button>
              </div>
            ) : (
              <>
                {/* Stop image */}
                <div className="vt-stop-img-wrap">
                  <img key={stop.id} className="vt-stop-img" src={stop.image} alt={stop.title} />
                  <div className="vt-stop-img-overlay" />
                  <div className="vt-stop-header">
                    <div className="vt-stop-counter">Stop {currentStop + 1} of {selectedTour.stops.length}</div>
                    <div className="vt-stop-title">{stop.title}</div>
                  </div>
                </div>

                {/* Text */}
                <div className="vt-text-area" key={stop.id}>
                  <div className="vt-text-content">{stop.content}</div>
                  <div className="vt-fact-box">
                    <div className="vt-fact-icon">💡</div>
                    <div className="vt-fact-text"><strong style={{color:"#C9A84C"}}>Did you know?</strong> {stop.fact}</div>
                  </div>
                </div>

                {/* Nav */}
                <div className="vt-nav">
                  <button className="vt-nav-btn prev" disabled={currentStop === 0} onClick={() => goToStop(currentStop - 1)}>← Previous</button>
                  <button className={`vt-autoplay-btn ${autoPlay ? "playing" : ""}`} onClick={() => { setAutoPlay(a => !a); setElapsed(0); }}>
                    {autoPlay ? "⏸ Pause" : "▶ Auto"}
                  </button>
                  <div className="vt-nav-spacer" />
                  <button className="vt-nav-btn next" onClick={() => { goToStop(currentStop + 1); }}>
                    {currentStop === selectedTour.stops.length - 1 ? "Finish Tour ✓" : "Next Stop →"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}