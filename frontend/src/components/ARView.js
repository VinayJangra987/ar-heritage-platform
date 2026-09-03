// import { useEffect, useState, useRef, useCallback } from "react";

// // ═══════════════════════════════════════════
// // REAL SKETCHFAB MODEL IDs — all free & embeddable
// // ═══════════════════════════════════════════
// const CATEGORIES = {
//   all:           { label: "All",          icon: "⬡" },
//   camera:        { label: "Live AR",       icon: "📷" },
//   mughal:        { label: "Mughal",       icon: "🕌" },
//   temple:        { label: "Temples",      icon: "🛕" },
//   fort:          { label: "Forts",        icon: "🏰" },
//   archaeological:{ label: "Ruins",        icon: "⛏️" },
//   sculpture:     { label: "Sculptures",   icon: "🗿" },
// };

// const AR_SITES = [
//   {
//     id: "taj-mahal",
//     name: "Taj Mahal",
//     subtitle: "Mughal Mausoleum",
//     location: "Agra, Uttar Pradesh",
//     era: "1631–1648 CE",
//     category: "mughal",
//     unesco: true,
//     sketchfabId: "0d884b236a60477f82906ca7cece20ac",
//     poster: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&q=80",
//     fact: "Built by Emperor Shah Jahan for his wife Mumtaz Mahal. Over 20,000 artisans worked for 17 years to complete it.",
//     color: "#C9A84C",
//   },
//   {
//     id: "red-fort",
//     name: "Red Fort",
//     subtitle: "Mughal Imperial Palace",
//     location: "Delhi",
//     era: "1638–1648 CE",
//     category: "mughal",
//     unesco: true,
//     sketchfabId: "2ad9ae0a1b524a37a2c3ab245b0e5423",
//     poster: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=600&q=80",
//     fact: "Served as the main residence of Mughal emperors for nearly 200 years. Built from red sandstone by Shah Jahan.",
//     color: "#E07B54",
//   },
//   {
//     id: "konark",
//     name: "Konark Sun Temple",
//     subtitle: "Kalinga Architecture",
//     location: "Konark, Odisha",
//     era: "13th Century CE",
//     category: "temple",
//     unesco: true,
//     sketchfabId: "6cc905be2ae34e8091eb1eaa84a17738",
//     poster: "https://images.unsplash.com/photo-1609766418204-94aae0ecfdfc?w=600&q=80",
//     fact: "Designed as a colossal chariot of the Sun God with 24 intricately carved stone wheels. Known as the 'Black Pagoda'.",
//     color: "#F0A500",
//   },
//   {
//     id: "meenakshi",
//     name: "Meenakshi Temple",
//     subtitle: "Dravidian Sculpture",
//     location: "Madurai, Tamil Nadu",
//     era: "17th Century CE",
//     category: "temple",
//     unesco: false,
//     sketchfabId: "4c302dacd8c34d0b9cda22ffd28636ec",
//     poster: "https://images.unsplash.com/photo-1621428236756-e8a0e7f9e7d6?w=600&q=80",
//     fact: "The temple has 14 gopurams (gateway towers), the tallest standing at 52 meters. Over 33,000 sculptures adorn its walls.",
//     color: "#9B59B6",
//   },
//   {
//     id: "khajuraho",
//     name: "Khajuraho Temple",
//     subtitle: "Chandela Architecture",
//     location: "Madhya Pradesh",
//     era: "950–1050 CE",
//     category: "temple",
//     unesco: true,
//     sketchfabId: "dd99586619e74f24b8dec10cc009c360",
//     poster: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&q=80",
//     fact: "Built by the Chandela dynasty, these temples are famous for their nagara-style architecture and erotic sculptures.",
//     color: "#E07B54",
//   },
//   {
//     id: "indian-temples",
//     name: "Indian Temple Complex",
//     subtitle: "Classical Hindu Architecture",
//     location: "South India",
//     era: "Medieval Period",
//     category: "temple",
//     unesco: false,
//     sketchfabId: "12b72dbe488f4800a080d352c724247f",
//     poster: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=600&q=80",
//     fact: "South Indian temples are known for their towering gopurams and intricate sculptural programs depicting Hindu mythology.",
//     color: "#C9A84C",
//   },
//   {
//     id: "qutub-minar",
//     name: "Qutub Minar",
//     subtitle: "Indo-Islamic Architecture",
//     location: "Delhi",
//     era: "1193 CE",
//     category: "fort",
//     unesco: true,
//     sketchfabId: "8777afc0c80549d1abb7c0f28832bb4b",
//     poster: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&q=80",
//     fact: "At 72.5 metres, Qutub Minar is the world's tallest brick minaret. Built by Qutb ud-Din Aibak in 1193.",
//     color: "#8B6F47",
//   },
//   {
//     id: "konark-sun2",
//     name: "Konark Chariot Wheel",
//     subtitle: "Stone Carving Detail",
//     location: "Konark, Odisha",
//     era: "13th Century CE",
//     category: "archaeological",
//     unesco: true,
//     sketchfabId: "f7b47d96fc144eef87fcc97988f477df",
//     poster: "https://images.unsplash.com/photo-1609766418204-94aae0ecfdfc?w=600&q=80",
//     fact: "Each of the 24 wheels of Konark Sun Temple acts as a sundial — you can tell the time of day from the shadow cast.",
//     color: "#4A7C59",
//   },
//   {
//     id: "temple-sculpture",
//     name: "Temple Sculpture",
//     subtitle: "Classical Indian Sculpture",
//     location: "Various Sites",
//     era: "8th–12th Century CE",
//     category: "sculpture",
//     unesco: false,
//     sketchfabId: "4c302dacd8c34d0b9cda22ffd28636ec",
//     poster: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=600&q=80",
//     fact: "Indian temple sculptures tell stories from the Ramayana, Mahabharata and Puranas through stone carvings.",
//     color: "#9B59B6",
//   },
// ];

// export default function ARView({ onClose, initialSite }) {
//   const [activeCategory, setActiveCategory] = useState("all");
//   const [activeSite,     setActiveSite]     = useState(AR_SITES[0]);
//   const [searchQ,        setSearchQ]        = useState("");
//   const [frameLoaded,    setFrameLoaded]    = useState(false);
//   const [activeTab,      setActiveTab]      = useState("3d");   // "3d" | "camera"
//   const [cameraStream,   setCameraStream]   = useState(null);
//   const [cameraError,    setCameraError]    = useState("");
//   const [cameraActive,   setCameraActive]   = useState(false);
//   const [overlayScale,   setOverlayScale]   = useState(1);
//   const [overlayOpacity, setOverlayOpacity] = useState(0.85);
//   const [overlayX,       setOverlayX]       = useState(50);  // % from left
//   const [overlayY,       setOverlayY]       = useState(50);  // % from top
//   const [isDragging,     setIsDragging]     = useState(false);
//   const videoRef  = useRef(null);
//   const dragRef   = useRef({ startX:0, startY:0, startOX:50, startOY:50 });

//   // Lock body scroll
//   useEffect(() => {
//     document.body.style.overflow = "hidden";
//     return () => { document.body.style.overflow = ""; };
//   }, []);

//   // Try to match initialSite
//   useEffect(() => {
//     if (!initialSite) return;
//     const match = AR_SITES.find(s =>
//       initialSite.name?.toLowerCase().includes(s.name.toLowerCase().split(" ")[0]) ||
//       initialSite.type === s.category
//     );
//     if (match) setActiveSite(match);
//   }, [initialSite]);

//   // Reset frameLoaded when site changes
//   useEffect(() => { setFrameLoaded(false); }, [activeSite.id]);

//   const filtered = AR_SITES.filter(s => {
//     const matchCat = activeCategory === "all" || s.category === activeCategory;
//     const matchQ   = !searchQ || s.name.toLowerCase().includes(searchQ.toLowerCase()) ||
//                      s.location.toLowerCase().includes(searchQ.toLowerCase());
//     return matchCat && matchQ;
//   });


//   // ── Camera helpers ──────────────────────────────────────────
//   const startCamera = useCallback(async () => {
//     setCameraError("");
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } },
//         audio: false,
//       });
//       setCameraStream(stream);
//       setCameraActive(true);
//       if (videoRef.current) {
//         videoRef.current.srcObject = stream;
//         videoRef.current.play();
//       }
//     } catch (err) {
//       if (err.name === "NotAllowedError") {
//         setCameraError("Camera permission denied. Please allow camera access and try again.");
//       } else if (err.name === "NotFoundError") {
//         setCameraError("No camera found on this device.");
//       } else {
//         setCameraError("Could not start camera: " + err.message);
//       }
//     }
//   }, []);

//   const stopCamera = useCallback(() => {
//     if (cameraStream) {
//       cameraStream.getTracks().forEach(t => t.stop());
//       setCameraStream(null);
//     }
//     setCameraActive(false);
//   }, [cameraStream]);

//   // Stop camera when switching away from camera tab
//   useEffect(() => {
//     if (activeTab !== "camera") stopCamera();
//   }, [activeTab, stopCamera]);

//   // Cleanup on unmount
//   useEffect(() => () => stopCamera(), [stopCamera]);

//   // Drag handlers for overlay positioning
//   const onDragStart = (e) => {
//     e.preventDefault();
//     const clientX = e.touches ? e.touches[0].clientX : e.clientX;
//     const clientY = e.touches ? e.touches[0].clientY : e.clientY;
//     dragRef.current = { startX: clientX, startY: clientY, startOX: overlayX, startOY: overlayY };
//     setIsDragging(true);
//   };
//   const onDragMove = useCallback((e) => {
//     if (!isDragging) return;
//     const clientX = e.touches ? e.touches[0].clientX : e.clientX;
//     const clientY = e.touches ? e.touches[0].clientY : e.clientY;
//     const wrap = document.querySelector(".ar-cam-wrap");
//     if (!wrap) return;
//     const { width, height } = wrap.getBoundingClientRect();
//     const dx = ((clientX - dragRef.current.startX) / width)  * 100;
//     const dy = ((clientY - dragRef.current.startY) / height) * 100;
//     setOverlayX(Math.min(90, Math.max(10, dragRef.current.startOX + dx)));
//     setOverlayY(Math.min(90, Math.max(10, dragRef.current.startOY + dy)));
//   }, [isDragging]);
//   const onDragEnd = () => setIsDragging(false);

//   useEffect(() => {
//     if (isDragging) {
//       window.addEventListener("mousemove", onDragMove);
//       window.addEventListener("mouseup",   onDragEnd);
//       window.addEventListener("touchmove", onDragMove, { passive: false });
//       window.addEventListener("touchend",  onDragEnd);
//     }
//     return () => {
//       window.removeEventListener("mousemove", onDragMove);
//       window.removeEventListener("mouseup",   onDragEnd);
//       window.removeEventListener("touchmove", onDragMove);
//       window.removeEventListener("touchend",  onDragEnd);
//     };
//   }, [isDragging, onDragMove]);

//   return (
//     <>
//       <style>{`
//         @keyframes arIn  { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
//         @keyframes spin  { to { transform:rotate(360deg); } }
//         @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }

//         .ar-overlay {
//           position:fixed; inset:0; z-index:9999;
//           background:#04080F;
//           display:flex; flex-direction:column;
//           animation:arIn 0.3s ease;
//           font-family:'Poppins',sans-serif;
//           color:#F2E8D0;
//         }

//         .ar-top {
//           display:flex; align-items:center; justify-content:space-between;
//           padding:0.9rem 1.5rem;
//           border-bottom:1px solid rgba(201,168,76,0.12);
//           flex-shrink:0; gap:1rem;
//         }
//         .ar-top-left { display:flex; align-items:center; gap:0.75rem; }
//         .ar-badge {
//           font-family:'Space Mono',monospace; font-size:0.52rem;
//           letter-spacing:0.15em; text-transform:uppercase;
//           color:#0D1B2A; background:#C9A84C;
//           padding:3px 10px; border-radius:20px; font-weight:700;
//         }
//         .ar-title {
//           font-family:'Space Mono',monospace; font-size:0.6rem;
//           color:rgba(242,232,208,0.45); letter-spacing:0.12em; text-transform:uppercase;
//         }
//         .ar-search {
//           flex:1; max-width:260px;
//           display:flex; align-items:center; gap:0.5rem;
//           background:rgba(15,30,47,0.8);
//           border:1px solid rgba(201,168,76,0.15);
//           border-radius:10px; padding:0.45rem 0.85rem;
//         }
//         .ar-search-icon { font-size:0.75rem; color:rgba(201,168,76,0.5); }
//         .ar-search input {
//           background:transparent; border:none; outline:none;
//           color:#F2E8D0; font-family:'Poppins',sans-serif; font-size:0.78rem;
//           width:100%; placeholder-color:rgba(242,232,208,0.3);
//         }
//         .ar-search input::placeholder { color:rgba(242,232,208,0.25); }
//         .ar-close {
//           width:34px; height:34px; display:flex; align-items:center; justify-content:center;
//           background:rgba(242,232,208,0.06); border:1px solid rgba(242,232,208,0.1);
//           border-radius:9px; color:rgba(242,232,208,0.5); font-size:0.95rem;
//           cursor:pointer; transition:all 0.2s; flex-shrink:0;
//         }
//         .ar-close:hover { background:rgba(242,232,208,0.12); color:#F2E8D0; }

//         .ar-cats {
//           display:flex; gap:0.4rem; padding:0.75rem 1.5rem;
//           border-bottom:1px solid rgba(201,168,76,0.08);
//           flex-shrink:0; overflow-x:auto;
//         }
//         .ar-cats::-webkit-scrollbar { display:none; }
//         .ar-cat {
//           display:flex; align-items:center; gap:0.4rem;
//           padding:0.4rem 1rem; border-radius:50px;
//           font-family:'Space Mono',monospace; font-size:0.56rem;
//           letter-spacing:0.1em; text-transform:uppercase;
//           background:transparent; border:1px solid rgba(201,168,76,0.12);
//           color:rgba(242,232,208,0.4); cursor:pointer;
//           transition:all 0.2s; white-space:nowrap;
//         }
//         .ar-cat:hover { border-color:rgba(201,168,76,0.3); color:rgba(242,232,208,0.7); }
//         .ar-cat.active {
//           background:rgba(201,168,76,0.12); border-color:rgba(201,168,76,0.4); color:#C9A84C;
//         }
//         .ar-cat-count {
//           background:rgba(201,168,76,0.15); color:#C9A84C;
//           border-radius:10px; padding:1px 6px; font-size:0.48rem;
//         }

//         .ar-body {
//           display:grid; grid-template-columns:240px 1fr 270px;
//           flex:1; overflow:hidden; min-height:0;
//         }

//         .ar-left {
//           border-right:1px solid rgba(201,168,76,0.1);
//           overflow-y:auto; padding:0.75rem;
//           display:flex; flex-direction:column; gap:0.4rem;
//         }
//         .ar-left::-webkit-scrollbar { width:3px; }
//         .ar-left::-webkit-scrollbar-thumb { background:rgba(201,168,76,0.2); border-radius:2px; }
//         .ar-left-empty {
//           padding:2rem 1rem; text-align:center;
//           font-family:'Space Mono',monospace; font-size:0.58rem;
//           color:rgba(242,232,208,0.2); letter-spacing:0.1em;
//         }
//         .ar-item {
//           display:flex; align-items:center; gap:0.7rem;
//           padding:0.65rem 0.7rem; border-radius:11px;
//           border:1px solid transparent; cursor:pointer;
//           transition:all 0.18s; background:transparent;
//           text-align:left; width:100%; position:relative;
//         }
//         .ar-item:hover { background:rgba(242,232,208,0.04); border-color:rgba(201,168,76,0.15); }
//         .ar-item.active { background:rgba(201,168,76,0.09); border-color:rgba(201,168,76,0.35); }
//         .ar-item-thumb {
//           width:42px; height:42px; border-radius:8px;
//           object-fit:cover; flex-shrink:0;
//           border:1px solid rgba(255,255,255,0.06);
//         }
//         .ar-item-info { flex:1; min-width:0; }
//         .ar-item-name {
//           font-family:'Cormorant Garamond',serif; font-size:0.92rem; font-weight:700;
//           color:rgba(242,232,208,0.65); white-space:nowrap;
//           overflow:hidden; text-overflow:ellipsis; line-height:1.2;
//           transition:color 0.2s;
//         }
//         .ar-item.active .ar-item-name { color:#F2E8D0; }
//         .ar-item-loc {
//           font-family:'Space Mono',monospace; font-size:0.48rem;
//           color:rgba(242,232,208,0.25); letter-spacing:0.08em;
//           text-transform:uppercase; margin-top:2px;
//           white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
//         }
//         .ar-item.active .ar-item-loc { color:rgba(201,168,76,0.6); }
//         .ar-item-unesco {
//           position:absolute; top:6px; right:6px;
//           font-family:'Space Mono',monospace; font-size:0.42rem;
//           background:#C9A84C; color:#0D1B2A;
//           padding:1px 5px; border-radius:4px; font-weight:700;
//           letter-spacing:0.08em;
//         }

//         .ar-center {
//           position:relative; background:#070D14;
//           display:flex; flex-direction:column; overflow:hidden;
//         }
//         .ar-viewer-header {
//           padding:0.85rem 1.2rem;
//           border-bottom:1px solid rgba(201,168,76,0.08);
//           display:flex; align-items:center; justify-content:space-between; flex-shrink:0;
//         }
//         .ar-viewer-name {
//           font-family:'Cormorant Garamond',serif; font-size:1.3rem; font-weight:700;
//           color:#F2E8D0; line-height:1;
//         }
//         .ar-viewer-loc {
//           font-family:'Space Mono',monospace; font-size:0.52rem;
//           color:rgba(201,168,76,0.6); letter-spacing:0.1em;
//           text-transform:uppercase; margin-top:3px;
//         }
//         .ar-viewer-badges { display:flex; gap:0.4rem; align-items:center; }
//         .ar-viewer-badge {
//           font-family:'Space Mono',monospace; font-size:0.48rem;
//           letter-spacing:0.1em; text-transform:uppercase;
//           padding:3px 9px; border-radius:6px; font-weight:700;
//         }
//         .ar-viewer-badge.gold { background:rgba(201,168,76,0.15); color:#C9A84C; border:1px solid rgba(201,168,76,0.25); }
//         .ar-viewer-badge.unesco { background:#C9A84C; color:#0D1B2A; }

//         .ar-frame-wrap {
//           flex:1; position:relative; overflow:hidden;
//         }
//         .ar-frame-loading {
//           position:absolute; inset:0; z-index:5;
//           display:flex; flex-direction:column;
//           align-items:center; justify-content:center; gap:1rem;
//           background:#070D14;
//           transition:opacity 0.5s;
//         }
//         .ar-frame-loading.hidden { opacity:0; pointer-events:none; }
//         .ar-spinner {
//           width:44px; height:44px;
//           border:2px solid rgba(201,168,76,0.1);
//           border-top-color:#C9A84C;
//           border-radius:50%; animation:spin 0.9s linear infinite;
//         }
//         .ar-loading-text {
//           font-family:'Space Mono',monospace; font-size:0.58rem;
//           color:rgba(242,232,208,0.3); letter-spacing:0.15em; text-transform:uppercase;
//           animation:pulse 1.5s ease infinite;
//         }
//         .ar-frame-wrap iframe {
//           position:absolute; inset:0;
//           width:100%; height:100%; border:none;
//         }

//         .ar-right {
//           border-left:1px solid rgba(201,168,76,0.1);
//           overflow-y:auto; padding:1.25rem;
//           display:flex; flex-direction:column; gap:1.4rem;
//         }
//         .ar-right::-webkit-scrollbar { width:3px; }
//         .ar-right::-webkit-scrollbar-thumb { background:rgba(201,168,76,0.2); border-radius:2px; }

//         .ar-section-title {
//           font-family:'Space Mono',monospace; font-size:0.5rem;
//           color:rgba(201,168,76,0.45); letter-spacing:0.2em; text-transform:uppercase;
//           margin-bottom:0.75rem;
//           display:flex; align-items:center; gap:0.5rem;
//         }
//         .ar-section-title::after { content:''; flex:1; height:1px; background:rgba(201,168,76,0.08); }

//         .ar-poster {
//           width:100%; height:130px; object-fit:cover;
//           border-radius:10px; border:1px solid rgba(201,168,76,0.1);
//           margin-bottom:0.9rem;
//         }
//         .ar-detail-name {
//           font-family:'Cormorant Garamond',serif; font-size:1.4rem; font-weight:700;
//           color:#F2E8D0; line-height:1.1; margin-bottom:0.25rem;
//         }
//         .ar-detail-sub {
//           font-family:'Space Mono',monospace; font-size:0.52rem;
//           color:rgba(201,168,76,0.65); letter-spacing:0.1em; text-transform:uppercase;
//         }

//         .ar-meta-grid {
//           display:grid; grid-template-columns:1fr 1fr; gap:0.5rem;
//         }
//         .ar-meta {
//           background:rgba(201,168,76,0.04);
//           border:1px solid rgba(201,168,76,0.1);
//           border-radius:9px; padding:0.55rem 0.7rem;
//         }
//         .ar-meta-label {
//           font-family:'Space Mono',monospace; font-size:0.46rem;
//           color:rgba(242,232,208,0.25); letter-spacing:0.12em;
//           text-transform:uppercase; margin-bottom:2px;
//         }
//         .ar-meta-val {
//           font-family:'Poppins',sans-serif; font-size:0.73rem;
//           color:#F2E8D0; font-weight:500;
//         }

//         .ar-fact {
//           background:rgba(201,168,76,0.05);
//           border:1px solid rgba(201,168,76,0.12);
//           border-left:3px solid #C9A84C;
//           border-radius:0 9px 9px 0; padding:0.85rem;
//         }
//         .ar-fact-text {
//           font-family:'Poppins',sans-serif; font-size:0.76rem;
//           color:rgba(242,232,208,0.55); line-height:1.65; font-style:italic;
//         }

//         .ar-controls { display:flex; flex-direction:column; gap:0.4rem; }
//         .ar-ctrl {
//           display:flex; align-items:center; gap:0.6rem;
//           font-family:'Space Mono',monospace; font-size:0.5rem;
//           color:rgba(242,232,208,0.28); letter-spacing:0.06em;
//         }
//         .ar-ctrl-key {
//           background:rgba(242,232,208,0.05);
//           border:1px solid rgba(242,232,208,0.1);
//           border-radius:5px; padding:2px 7px;
//           font-size:0.48rem; color:rgba(242,232,208,0.35);
//           white-space:nowrap;
//         }

//         .ar-mobile-notice {
//           background:rgba(74,124,89,0.07);
//           border:1px solid rgba(74,124,89,0.18);
//           border-radius:9px; padding:0.75rem;
//           display:flex; gap:0.5rem;
//         }
//         .ar-mobile-notice-text {
//           font-family:'Poppins',sans-serif; font-size:0.7rem;
//           color:rgba(242,232,208,0.45); line-height:1.55;
//         }
//         .ar-mobile-notice-text strong { color:rgba(242,232,208,0.75); display:block; margin-bottom:2px; }

//         .ar-view-tabs {
//           display:flex; gap:0; border-bottom:1px solid rgba(201,168,76,0.1);
//           flex-shrink:0;
//         }
//         .ar-view-tab {
//           flex:1; padding:0.65rem 1rem;
//           font-family:'Space Mono',monospace; font-size:0.56rem;
//           letter-spacing:0.12em; text-transform:uppercase;
//           color:rgba(242,232,208,0.35); background:transparent; border:none;
//           cursor:pointer; transition:all 0.2s;
//           border-bottom:2px solid transparent; display:flex;
//           align-items:center; justify-content:center; gap:0.4rem;
//         }
//         .ar-view-tab:hover { color:rgba(242,232,208,0.6); }
//         .ar-view-tab.active { color:#C9A84C; border-bottom-color:#C9A84C; }

//         .ar-cam-wrap {
//           position:relative; width:100%; flex:1;
//           background:#000; overflow:hidden;
//           display:flex; align-items:center; justify-content:center;
//         }
//         .ar-cam-video {
//           position:absolute; inset:0;
//           width:100%; height:100%;
//           object-fit:cover; z-index:1;
//         }
//         .ar-cam-overlay {
//           position:absolute; z-index:3;
//           transform:translate(-50%,-50%);
//           cursor:grab; user-select:none;
//           filter:drop-shadow(0 8px 32px rgba(0,0,0,0.7));
//           transition: filter 0.2s;
//         }
//         .ar-cam-overlay:active { cursor:grabbing; }
//         .ar-cam-overlay img {
//           width:100%; height:100%;
//           object-fit:contain; border-radius:8px;
//           pointer-events:none;
//           mix-blend-mode:normal;
//         }
//         .ar-cam-overlay-label {
//           position:absolute; bottom:-28px; left:50%; transform:translateX(-50%);
//           background:rgba(13,27,42,0.85);
//           border:1px solid rgba(201,168,76,0.3); border-radius:20px;
//           padding:3px 12px; white-space:nowrap;
//           font-family:'Space Mono',monospace; font-size:0.5rem;
//           color:#C9A84C; letter-spacing:0.1em; pointer-events:none;
//         }
//         .ar-cam-start {
//           display:flex; flex-direction:column;
//           align-items:center; justify-content:center;
//           gap:1.2rem; padding:2rem; text-align:center; z-index:2;
//         }
//         .ar-cam-start-icon { font-size:3rem; }
//         .ar-cam-start-title {
//           font-family:'Cormorant Garamond',serif; font-size:1.5rem;
//           font-weight:700; color:#F2E8D0;
//         }
//         .ar-cam-start-desc {
//           font-family:'Poppins',sans-serif; font-size:0.8rem;
//           color:rgba(242,232,208,0.45); line-height:1.6; max-width:320px;
//         }
//         .ar-cam-start-btn {
//           display:flex; align-items:center; gap:0.5rem;
//           padding:0.8rem 1.8rem; border-radius:50px;
//           background:linear-gradient(135deg,#C9A84C,#E8C96A);
//           color:#0D1B2A; border:none; cursor:pointer;
//           font-family:'Space Mono',monospace; font-size:0.62rem;
//           font-weight:700; letter-spacing:0.1em;
//           transition:all 0.25s;
//           box-shadow:0 4px 20px rgba(201,168,76,0.35);
//         }
//         .ar-cam-start-btn:hover { transform:translateY(-2px); box-shadow:0 8px 30px rgba(201,168,76,0.5); }
//         .ar-cam-error {
//           background:rgba(224,123,84,0.1); border:1px solid rgba(224,123,84,0.3);
//           border-radius:10px; padding:0.8rem 1.2rem;
//           font-family:'Poppins',sans-serif; font-size:0.75rem;
//           color:rgba(224,123,84,0.9); max-width:340px; text-align:center;
//         }
//         .ar-cam-controls {
//           position:absolute; bottom:1rem; left:50%; transform:translateX(-50%);
//           z-index:10; display:flex; gap:0.6rem; align-items:center;
//           background:rgba(4,8,15,0.75); backdrop-filter:blur(12px);
//           border:1px solid rgba(201,168,76,0.2); border-radius:50px;
//           padding:0.5rem 1rem;
//         }
//         .ar-cam-ctrl-label {
//           font-family:'Space Mono',monospace; font-size:0.5rem;
//           color:rgba(242,232,208,0.35); letter-spacing:0.1em; white-space:nowrap;
//         }
//         .ar-cam-slider {
//           -webkit-appearance:none; appearance:none;
//           height:3px; border-radius:2px; outline:none;
//           background:rgba(201,168,76,0.2); cursor:pointer; width:80px;
//         }
//         .ar-cam-slider::-webkit-slider-thumb {
//           -webkit-appearance:none; width:14px; height:14px;
//           border-radius:50%; background:#C9A84C; cursor:pointer;
//           border:2px solid #0D1B2A;
//         }
//         .ar-cam-stop-btn {
//           padding:4px 12px; border-radius:20px;
//           background:rgba(224,123,84,0.15); border:1px solid rgba(224,123,84,0.3);
//           color:rgba(224,123,84,0.9); font-family:'Space Mono',monospace;
//           font-size:0.5rem; letter-spacing:0.1em; cursor:pointer;
//           transition:all 0.2s;
//         }
//         .ar-cam-stop-btn:hover { background:rgba(224,123,84,0.25); }
//         @keyframes flashIn { 0%{opacity:0.8} 100%{opacity:0} }
//         .ar-cam-flash {
//           position:absolute; inset:0; background:#fff; z-index:20;
//           pointer-events:none; animation:flashIn 0.4s ease forwards;
//         }
//         @keyframes scanline { 0%{top:-10%} 100%{top:110%} }
//         .ar-cam-scan {
//           position:absolute; left:0; right:0; height:2px;
//           background:linear-gradient(90deg,transparent,rgba(201,168,76,0.6),transparent);
//           z-index:4; animation:scanline 3s linear infinite;
//           pointer-events:none;
//         }
//         .ar-cam-bracket {
//           position:absolute; z-index:5; width:40px; height:40px;
//           pointer-events:none;
//         }
//         .ar-cam-bracket.tl { top:16px; left:16px; border-top:2px solid #C9A84C; border-left:2px solid #C9A84C; }
//         .ar-cam-bracket.tr { top:16px; right:16px; border-top:2px solid #C9A84C; border-right:2px solid #C9A84C; }
//         .ar-cam-bracket.bl { bottom:60px; left:16px; border-bottom:2px solid #C9A84C; border-left:2px solid #C9A84C; }
//         .ar-cam-bracket.br { bottom:60px; right:16px; border-bottom:2px solid #C9A84C; border-right:2px solid #C9A84C; }
//         .ar-cam-hint {
//           position:absolute; top:12px; left:50%; transform:translateX(-50%);
//           z-index:6; background:rgba(4,8,15,0.75); backdrop-filter:blur(8px);
//           border:1px solid rgba(201,168,76,0.2); border-radius:20px;
//           padding:4px 14px;
//           font-family:'Space Mono',monospace; font-size:0.5rem;
//           color:rgba(201,168,76,0.8); letter-spacing:0.1em; white-space:nowrap;
//           pointer-events:none;
//         }

//         @media (max-width:900px) {
//           .ar-body { grid-template-columns:1fr; grid-template-rows:auto 1fr; }
//           .ar-left {
//             flex-direction:row; overflow-x:auto; overflow-y:hidden;
//             border-right:none; border-bottom:1px solid rgba(201,168,76,0.1);
//             padding:0.6rem; max-height:110px; gap:0.5rem;
//           }
//           .ar-item { min-width:90px; flex-direction:column; padding:0.5rem; gap:0.4rem; }
//           .ar-item-thumb { width:36px; height:36px; }
//           .ar-item-loc { display:none; }
//           .ar-right { display:none; }
//           .ar-frame-wrap { min-height:300px; }
//         }
//       `}</style>

//       <div className="ar-overlay">

//         <div className="ar-top">
//           <div className="ar-top-left">
//             <span className="ar-badge">📱 AR View</span>
//             <span className="ar-title">3D Heritage Explorer</span>
//           </div>
//           <div className="ar-search">
//             <span className="ar-search-icon">🔍</span>
//             <input
//               placeholder="Search models..."
//               value={searchQ}
//               onChange={e => setSearchQ(e.target.value)}
//             />
//           </div>
//           <button className="ar-close" onClick={onClose}>✕</button>
//         </div>

//         <div className="ar-cats">
//           {Object.entries(CATEGORIES).map(([key, cat]) => {
//             const count = key === "all"
//               ? AR_SITES.length
//               : AR_SITES.filter(s => s.category === key).length;
//             return (
//               <button
//                 key={key}
//                 className={`ar-cat ${activeCategory === key ? "active" : ""}`}
//                 onClick={() => { setActiveCategory(key); setSearchQ(""); }}
//               >
//                 {cat.icon} {cat.label}
//                 <span className="ar-cat-count">{count}</span>
//               </button>
//             );
//           })}
//         </div>

//         <div className="ar-body">

//           <div className="ar-left">
//             {filtered.length === 0 ? (
//               <div className="ar-left-empty">No models found</div>
//             ) : filtered.map(site => (
//               <button
//                 key={site.id}
//                 className={`ar-item ${activeSite.id === site.id ? "active" : ""}`}
//                 onClick={() => setActiveSite(site)}
//               >
//                 <img src={site.poster} alt={site.name} className="ar-item-thumb" />
//                 <div className="ar-item-info">
//                   <div className="ar-item-name">{site.name}</div>
//                   <div className="ar-item-loc">📍 {site.location}</div>
//                 </div>
//                 {site.unesco && <span className="ar-item-unesco">UNESCO</span>}
//               </button>
//             ))}
//           </div>

//           <div className="ar-center">

//             <div className="ar-viewer-header">
//               <div>
//                 <div className="ar-viewer-name">{activeSite.name}</div>
//                 <div className="ar-viewer-loc">📍 {activeSite.location} · {activeSite.era}</div>
//               </div>
//               <div className="ar-viewer-badges">
//                 <span className="ar-viewer-badge gold">{activeSite.subtitle}</span>
//                 {activeSite.unesco && <span className="ar-viewer-badge unesco">UNESCO ★</span>}
//               </div>
//             </div>

//             <div className="ar-view-tabs">
//               <button
//                 className={`ar-view-tab ${activeTab === "3d" ? "active" : ""}`}
//                 onClick={() => setActiveTab("3d")}
//               >
//                 ⬡ 3D Model
//               </button>
//               <button
//                 className={`ar-view-tab ${activeTab === "camera" ? "active" : ""}`}
//                 onClick={() => setActiveTab("camera")}
//               >
//                 📷 Live Camera AR
//               </button>
//             </div>

//             {activeTab === "3d" && (
//               <div className="ar-frame-wrap">
//                 <div className={`ar-frame-loading ${frameLoaded ? "hidden" : ""}`}>
//                   <div className="ar-spinner" />
//                   <div className="ar-loading-text">Loading 3D Model...</div>
//                 </div>
//                 <iframe
//                   key={activeSite.id}
//                   title={activeSite.name}
//                   src={`https://sketchfab.com/models/${activeSite.sketchfabId}/embed?autostart=1&ui_theme=dark&ui_color=c9a84c&ui_infos=0&ui_watermark=0`}
//                   allow="autoplay; fullscreen; xr-spatial-tracking; accelerometer; gyroscope; magnetometer"
//                   onLoad={() => setFrameLoaded(true)}
//                 />
//               </div>
//             )}

//             {activeTab === "camera" && (
//               <div className="ar-cam-wrap">

//                 {!cameraActive && (
//                   <div className="ar-cam-start">
//                     <div className="ar-cam-start-icon">📷</div>
//                     <div className="ar-cam-start-title">Live Camera AR</div>
//                     <div className="ar-cam-start-desc">
//                       Place <strong style={{color:"#C9A84C"}}>{activeSite.name}</strong> in your real environment.
//                       Your camera will open and the heritage model will float in your view — drag to reposition, scale to resize.
//                     </div>
//                     {cameraError && <div className="ar-cam-error">⚠️ {cameraError}</div>}
//                     <button className="ar-cam-start-btn" onClick={startCamera}>
//                       📷 Start Camera
//                     </button>
//                     <div style={{
//                       fontFamily:"'Space Mono',monospace", fontSize:"0.5rem",
//                       color:"rgba(242,232,208,0.2)", letterSpacing:"0.1em", textAlign:"center"
//                     }}>
//                       Camera access required · Works best on mobile
//                     </div>
//                   </div>
//                 )}

//                 {cameraActive && (
//                   <>
//                     <video
//                       ref={videoRef}
//                       className="ar-cam-video"
//                       autoPlay
//                       playsInline
//                       muted
//                     />

//                     <div className="ar-cam-scan" />

//                     <div className="ar-cam-bracket tl" />
//                     <div className="ar-cam-bracket tr" />
//                     <div className="ar-cam-bracket bl" />
//                     <div className="ar-cam-bracket br" />

//                     <div className="ar-cam-hint">
//                       Drag monument · Use sliders to adjust
//                     </div>

//                     <div
//                       className="ar-cam-overlay"
//                       style={{
//                         left: `${overlayX}%`,
//                         top:  `${overlayY}%`,
//                         width:  `${Math.round(180 * overlayScale)}px`,
//                         height: `${Math.round(180 * overlayScale)}px`,
//                         opacity: overlayOpacity,
//                       }}
//                       onMouseDown={onDragStart}
//                       onTouchStart={onDragStart}
//                     >
//                       <img src={activeSite.poster} alt={activeSite.name} />
//                       <div className="ar-cam-overlay-label">{activeSite.name}</div>
//                     </div>

//                     <div className="ar-cam-controls">
//                       <span className="ar-cam-ctrl-label">Size</span>
//                       <input
//                         type="range" className="ar-cam-slider"
//                         min="0.4" max="3" step="0.05"
//                         value={overlayScale}
//                         onChange={e => setOverlayScale(parseFloat(e.target.value))}
//                       />
//                       <span className="ar-cam-ctrl-label">Opacity</span>
//                       <input
//                         type="range" className="ar-cam-slider"
//                         min="0.2" max="1" step="0.05"
//                         value={overlayOpacity}
//                         onChange={e => setOverlayOpacity(parseFloat(e.target.value))}
//                       />
//                       <button className="ar-cam-stop-btn" onClick={stopCamera}>
//                         ✕ Stop
//                       </button>
//                     </div>
//                   </>
//                 )}
//               </div>
//             )}

//           </div>

//           <div className="ar-right">

//             <div>
//               <div className="ar-section-title">Viewing</div>
//               <img src={activeSite.poster} alt={activeSite.name} className="ar-poster" />
//               <div className="ar-detail-name">{activeSite.name}</div>
//               <div className="ar-detail-sub">{activeSite.subtitle}</div>
//             </div>

//             <div>
//               <div className="ar-section-title">Details</div>
//               <div className="ar-meta-grid">
//                 <div className="ar-meta">
//                   <div className="ar-meta-label">Era</div>
//                   <div className="ar-meta-val">{activeSite.era}</div>
//                 </div>
//                 <div className="ar-meta">
//                   <div className="ar-meta-label">Category</div>
//                   <div className="ar-meta-val" style={{textTransform:"capitalize"}}>
//                     {CATEGORIES[activeSite.category]?.icon} {CATEGORIES[activeSite.category]?.label}
//                   </div>
//                 </div>
//                 <div className="ar-meta" style={{gridColumn:"1/-1"}}>
//                   <div className="ar-meta-label">Location</div>
//                   <div className="ar-meta-val">📍 {activeSite.location}</div>
//                 </div>
//               </div>
//             </div>

//             <div>
//               <div className="ar-section-title">Did You Know</div>
//               <div className="ar-fact">
//                 <div className="ar-fact-text">"{activeSite.fact}"</div>
//               </div>
//             </div>

//             <div>
//               <div className="ar-section-title">3D Controls</div>
//               <div className="ar-controls">
//                 {[
//                   { key:"Drag",       desc:"Rotate model" },
//                   { key:"Scroll",     desc:"Zoom in / out" },
//                   { key:"Two finger", desc:"Pan the view" },
//                   { key:"Fullscreen", desc:"Immersive mode" },
//                 ].map(c => (
//                   <div className="ar-ctrl" key={c.key}>
//                     <span className="ar-ctrl-key">{c.key}</span> {c.desc}
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div>
//               <div className="ar-section-title">Mobile AR</div>
//               <div className="ar-mobile-notice">
//                 <span style={{fontSize:"1rem",flexShrink:0}}>📱</span>
//                 <div className="ar-mobile-notice-text">
//                   <strong>Real-world AR on mobile</strong>
//                   Android: ARCore via Chrome. iOS: Quick Look via Safari. Open on phone for AR placement.
//                 </div>
//               </div>
//             </div>

//           </div>
//         </div>
//       </div>
//     </>
//   );
// }



import { useEffect, useState, useRef, useCallback } from "react";

// ═══════════════════════════════════════════
// REAL SKETCHFAB MODEL IDs — all free & embeddable
// ═══════════════════════════════════════════
const CATEGORIES = {
  all:           { label: "All",          icon: "⬡" },
  camera:        { label: "Live AR",       icon: "📷" },
  mughal:        { label: "Mughal",       icon: "🕌" },
  temple:        { label: "Temples",      icon: "🛕" },
  fort:          { label: "Forts",        icon: "🏰" },
  archaeological:{ label: "Ruins",        icon: "⛏️" },
  sculpture:     { label: "Sculptures",   icon: "🗿" },
};

const AR_SITES = [
  {
    id: "taj-mahal",
    name: "Taj Mahal",
    subtitle: "Mughal Mausoleum",
    location: "Agra, Uttar Pradesh",
    era: "1631–1648 CE",
    category: "mughal",
    unesco: true,
    sketchfabId: "0d884b236a60477f82906ca7cece20ac",
    poster: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&q=80",
    fact: "Built by Emperor Shah Jahan for his wife Mumtaz Mahal. Over 20,000 artisans worked for 17 years to complete it.",
    color: "#C9A84C",
  },
  {
    id: "red-fort",
    name: "Red Fort",
    subtitle: "Mughal Imperial Palace",
    location: "Delhi",
    era: "1638–1648 CE",
    category: "mughal",
    unesco: true,
    sketchfabId: "2ad9ae0a1b524a37a2c3ab245b0e5423",
    poster: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=600&q=80",
    fact: "Served as the main residence of Mughal emperors for nearly 200 years. Built from red sandstone by Shah Jahan.",
    color: "#E07B54",
  },
  {
    id: "konark",
    name: "Konark Sun Temple",
    subtitle: "Kalinga Architecture",
    location: "Konark, Odisha",
    era: "13th Century CE",
    category: "temple",
    unesco: true,
    sketchfabId: "6cc905be2ae34e8091eb1eaa84a17738",
    poster: "https://images.unsplash.com/photo-1609766418204-94aae0ecfdfc?w=600&q=80",
    fact: "Designed as a colossal chariot of the Sun God with 24 intricately carved stone wheels. Known as the 'Black Pagoda'.",
    color: "#F0A500",
  },
  {
    id: "meenakshi",
    name: "Meenakshi Temple",
    subtitle: "Dravidian Sculpture",
    location: "Madurai, Tamil Nadu",
    era: "17th Century CE",
    category: "temple",
    unesco: false,
    sketchfabId: "4c302dacd8c34d0b9cda22ffd28636ec",
    poster: "https://images.unsplash.com/photo-1621428236756-e8a0e7f9e7d6?w=600&q=80",
    fact: "The temple has 14 gopurams (gateway towers), the tallest standing at 52 meters. Over 33,000 sculptures adorn its walls.",
    color: "#9B59B6",
  },
  {
    id: "khajuraho",
    name: "Khajuraho Temple",
    subtitle: "Chandela Architecture",
    location: "Madhya Pradesh",
    era: "950–1050 CE",
    category: "temple",
    unesco: true,
    sketchfabId: "dd99586619e74f24b8dec10cc009c360",
    poster: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&q=80",
    fact: "Built by the Chandela dynasty, these temples are famous for their nagara-style architecture and erotic sculptures.",
    color: "#E07B54",
  },
  {
    id: "indian-temples",
    name: "Indian Temple Complex",
    subtitle: "Classical Hindu Architecture",
    location: "South India",
    era: "Medieval Period",
    category: "temple",
    unesco: false,
    sketchfabId: "12b72dbe488f4800a080d352c724247f",
    poster: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=600&q=80",
    fact: "South Indian temples are known for their towering gopurams and intricate sculptural programs depicting Hindu mythology.",
    color: "#C9A84C",
  },
  {
    id: "qutub-minar",
    name: "Qutub Minar",
    subtitle: "Indo-Islamic Architecture",
    location: "Delhi",
    era: "1193 CE",
    category: "fort",
    unesco: true,
    sketchfabId: "8777afc0c80549d1abb7c0f28832bb4b",
    poster: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&q=80",
    fact: "At 72.5 metres, Qutub Minar is the world's tallest brick minaret. Built by Qutb ud-Din Aibak in 1193.",
    color: "#8B6F47",
  },
  {
    id: "konark-sun2",
    name: "Konark Chariot Wheel",
    subtitle: "Stone Carving Detail",
    location: "Konark, Odisha",
    era: "13th Century CE",
    category: "archaeological",
    unesco: true,
    sketchfabId: "f7b47d96fc144eef87fcc97988f477df",
    poster: "https://images.unsplash.com/photo-1609766418204-94aae0ecfdfc?w=600&q=80",
    fact: "Each of the 24 wheels of Konark Sun Temple acts as a sundial — you can tell the time of day from the shadow cast.",
    color: "#4A7C59",
  },
  {
    id: "temple-sculpture",
    name: "Temple Sculpture",
    subtitle: "Classical Indian Sculpture",
    location: "Various Sites",
    era: "8th–12th Century CE",
    category: "sculpture",
    unesco: false,
    sketchfabId: "4c302dacd8c34d0b9cda22ffd28636ec",
    poster: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=600&q=80",
    fact: "Indian temple sculptures tell stories from the Ramayana, Mahabharata and Puranas through stone carvings.",
    color: "#9B59B6",
  },
];

export default function ARView({ onClose, initialSite }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeSite,     setActiveSite]     = useState(AR_SITES[0]);
  const [searchQ,        setSearchQ]        = useState("");
  const [frameLoaded,    setFrameLoaded]    = useState(false);
  const [activeTab,      setActiveTab]      = useState("3d");   // "3d" | "camera"
  const [cameraStream,   setCameraStream]   = useState(null);
  const [cameraError,    setCameraError]    = useState("");
  const [cameraActive,   setCameraActive]   = useState(false);
  const [overlayScale,   setOverlayScale]   = useState(1);
  const [overlayOpacity, setOverlayOpacity] = useState(0.85);
  const [overlayX,       setOverlayX]       = useState(50);  // % from left
  const [overlayY,       setOverlayY]       = useState(50);  // % from top
  const [isDragging,     setIsDragging]     = useState(false);
  const [initializing,   setInitializing]   = useState(true); // radar scan intro
  const videoRef  = useRef(null);
  const dragRef   = useRef({ startX:0, startY:0, startOX:50, startOY:50 });

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Radar scan intro — plays once on open, then reveals the AR interface
  useEffect(() => {
    const t = setTimeout(() => setInitializing(false), 1800);
    return () => clearTimeout(t);
  }, []);

  // Try to match initialSite
  useEffect(() => {
    if (!initialSite) return;
    const match = AR_SITES.find(s =>
      initialSite.name?.toLowerCase().includes(s.name.toLowerCase().split(" ")[0]) ||
      initialSite.type === s.category
    );
    if (match) setActiveSite(match);
  }, [initialSite]);

  // Reset frameLoaded when site changes
  useEffect(() => { setFrameLoaded(false); }, [activeSite.id]);

  const filtered = AR_SITES.filter(s => {
    const matchCat = activeCategory === "all" || s.category === activeCategory;
    const matchQ   = !searchQ || s.name.toLowerCase().includes(searchQ.toLowerCase()) ||
                     s.location.toLowerCase().includes(searchQ.toLowerCase());
    return matchCat && matchQ;
  });


  // ── Camera helpers ──────────────────────────────────────────
  const startCamera = useCallback(async () => {
    setCameraError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      setCameraStream(stream);
      setCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      if (err.name === "NotAllowedError") {
        setCameraError("Camera permission denied. Please allow camera access and try again.");
      } else if (err.name === "NotFoundError") {
        setCameraError("No camera found on this device.");
      } else {
        setCameraError("Could not start camera: " + err.message);
      }
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(t => t.stop());
      setCameraStream(null);
    }
    setCameraActive(false);
  }, [cameraStream]);

  // Stop camera when switching away from camera tab
  useEffect(() => {
    if (activeTab !== "camera") stopCamera();
  }, [activeTab, stopCamera]);

  // Cleanup on unmount
  useEffect(() => () => stopCamera(), [stopCamera]);

  // Drag handlers for overlay positioning
  const onDragStart = (e) => {
    e.preventDefault();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    dragRef.current = { startX: clientX, startY: clientY, startOX: overlayX, startOY: overlayY };
    setIsDragging(true);
  };
  const onDragMove = useCallback((e) => {
    if (!isDragging) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const wrap = document.querySelector(".ar-cam-wrap");
    if (!wrap) return;
    const { width, height } = wrap.getBoundingClientRect();
    const dx = ((clientX - dragRef.current.startX) / width)  * 100;
    const dy = ((clientY - dragRef.current.startY) / height) * 100;
    setOverlayX(Math.min(90, Math.max(10, dragRef.current.startOX + dx)));
    setOverlayY(Math.min(90, Math.max(10, dragRef.current.startOY + dy)));
  }, [isDragging]);
  const onDragEnd = () => setIsDragging(false);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", onDragMove);
      window.addEventListener("mouseup",   onDragEnd);
      window.addEventListener("touchmove", onDragMove, { passive: false });
      window.addEventListener("touchend",  onDragEnd);
    }
    return () => {
      window.removeEventListener("mousemove", onDragMove);
      window.removeEventListener("mouseup",   onDragEnd);
      window.removeEventListener("touchmove", onDragMove);
      window.removeEventListener("touchend",  onDragEnd);
    };
  }, [isDragging, onDragMove]);

  return (
    <>
      <style>{`
        @keyframes arIn  { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin  { to { transform:rotate(360deg); } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }

        /* ── Radar scan intro ── */
        @keyframes radarSpin   { to { transform:rotate(360deg); } }
        @keyframes radarPulse  { 0%{transform:scale(0.55);opacity:0.8} 100%{transform:scale(2);opacity:0} }
        @keyframes radarGlow   { 0%,100%{box-shadow:0 0 18px rgba(201,168,76,0.5)} 50%{box-shadow:0 0 38px rgba(201,168,76,0.9)} }
        @keyframes dotBlink    { 0%,20%{opacity:0.15} 50%{opacity:1} 100%{opacity:0.15} }
        @keyframes initFadeOut { to { opacity:0; visibility:hidden; } }

        .ar-init-overlay {
          position:absolute; inset:0; z-index:60;
          background:#04080F;
          display:flex; flex-direction:column; align-items:center; justify-content:center; gap:1.6rem;
          transition:opacity 0.6s ease, visibility 0.6s ease;
        }
        .ar-init-overlay.hidden { opacity:0; visibility:hidden; pointer-events:none; }

        .ar-radar { position:relative; width:150px; height:150px; display:flex; align-items:center; justify-content:center; }
        .ar-radar-sweep {
          position:absolute; inset:0; border-radius:50%;
          background:conic-gradient(from 0deg, rgba(201,168,76,0.6), transparent 38%);
          animation:radarSpin 1.7s linear infinite;
        }
        .ar-radar-ring {
          position:absolute; border:1px solid rgba(201,168,76,0.18); border-radius:50%;
        }
        .ar-radar-ring.r1 { inset:0; }
        .ar-radar-ring.r2 { inset:22px; }
        .ar-radar-ring.r3 { inset:44px; }
        .ar-radar-pulse {
          position:absolute; width:56px; height:56px; border-radius:50%;
          border:1px solid rgba(201,168,76,0.55);
          animation:radarPulse 2s ease-out infinite;
        }
        .ar-radar-pulse.delay { animation-delay:1s; }
        .ar-radar-core {
          position:relative; z-index:2; width:42px; height:42px; border-radius:50%;
          background:radial-gradient(circle, #E8C96A, #8B6F47);
          display:flex; align-items:center; justify-content:center;
          font-size:1.15rem;
          animation:radarGlow 2s ease-in-out infinite;
        }

        .ar-init-text {
          font-family:'Space Mono',monospace; font-size:0.65rem;
          color:rgba(201,168,76,0.85); letter-spacing:0.22em; text-transform:uppercase;
          display:flex; align-items:center; gap:2px;
        }
        .ar-init-text .dot { animation:dotBlink 1.4s infinite; }
        .ar-init-text .dot:nth-child(2) { animation-delay:0.2s; }
        .ar-init-text .dot:nth-child(3) { animation-delay:0.4s; }

        .ar-init-sub {
          font-family:'Space Mono',monospace; font-size:0.52rem;
          color:rgba(242,232,208,0.3); letter-spacing:0.15em; text-transform:uppercase;
        }

        .ar-overlay {
          position:fixed; inset:0; z-index:9999;
          background:#04080F;
          display:flex; flex-direction:column;
          animation:arIn 0.3s ease;
          font-family:'Poppins',sans-serif;
          color:#F2E8D0;
        }

        .ar-top {
          display:flex; align-items:center; justify-content:space-between;
          padding:0.9rem 1.5rem;
          border-bottom:1px solid rgba(201,168,76,0.12);
          flex-shrink:0; gap:1rem;
        }
        .ar-top-left { display:flex; align-items:center; gap:0.75rem; }
        .ar-badge {
          font-family:'Space Mono',monospace; font-size:0.52rem;
          letter-spacing:0.15em; text-transform:uppercase;
          color:#0D1B2A; background:#C9A84C;
          padding:3px 10px; border-radius:20px; font-weight:700;
        }
        .ar-title {
          font-family:'Space Mono',monospace; font-size:0.6rem;
          color:rgba(242,232,208,0.45); letter-spacing:0.12em; text-transform:uppercase;
        }
        .ar-search {
          flex:1; max-width:260px;
          display:flex; align-items:center; gap:0.5rem;
          background:rgba(15,30,47,0.8);
          border:1px solid rgba(201,168,76,0.15);
          border-radius:10px; padding:0.45rem 0.85rem;
        }
        .ar-search-icon { font-size:0.75rem; color:rgba(201,168,76,0.5); }
        .ar-search input {
          background:transparent; border:none; outline:none;
          color:#F2E8D0; font-family:'Poppins',sans-serif; font-size:0.78rem;
          width:100%; placeholder-color:rgba(242,232,208,0.3);
        }
        .ar-search input::placeholder { color:rgba(242,232,208,0.25); }
        .ar-close {
          width:34px; height:34px; display:flex; align-items:center; justify-content:center;
          background:rgba(242,232,208,0.06); border:1px solid rgba(242,232,208,0.1);
          border-radius:9px; color:rgba(242,232,208,0.5); font-size:0.95rem;
          cursor:pointer; transition:all 0.2s; flex-shrink:0;
        }
        .ar-close:hover { background:rgba(242,232,208,0.12); color:#F2E8D0; }

        .ar-cats {
          display:flex; gap:0.4rem; padding:0.75rem 1.5rem;
          border-bottom:1px solid rgba(201,168,76,0.08);
          flex-shrink:0; overflow-x:auto;
        }
        .ar-cats::-webkit-scrollbar { display:none; }
        .ar-cat {
          display:flex; align-items:center; gap:0.4rem;
          padding:0.4rem 1rem; border-radius:50px;
          font-family:'Space Mono',monospace; font-size:0.56rem;
          letter-spacing:0.1em; text-transform:uppercase;
          background:transparent; border:1px solid rgba(201,168,76,0.12);
          color:rgba(242,232,208,0.4); cursor:pointer;
          transition:all 0.2s; white-space:nowrap;
        }
        .ar-cat:hover { border-color:rgba(201,168,76,0.3); color:rgba(242,232,208,0.7); }
        .ar-cat.active {
          background:rgba(201,168,76,0.12); border-color:rgba(201,168,76,0.4); color:#C9A84C;
        }
        .ar-cat-count {
          background:rgba(201,168,76,0.15); color:#C9A84C;
          border-radius:10px; padding:1px 6px; font-size:0.48rem;
        }

        .ar-body {
          display:grid; grid-template-columns:240px 1fr 270px;
          flex:1; overflow:hidden; min-height:0;
        }

        .ar-left {
          border-right:1px solid rgba(201,168,76,0.1);
          overflow-y:auto; padding:0.75rem;
          display:flex; flex-direction:column; gap:0.4rem;
        }
        .ar-left::-webkit-scrollbar { width:3px; }
        .ar-left::-webkit-scrollbar-thumb { background:rgba(201,168,76,0.2); border-radius:2px; }
        .ar-left-empty {
          padding:2rem 1rem; text-align:center;
          font-family:'Space Mono',monospace; font-size:0.58rem;
          color:rgba(242,232,208,0.2); letter-spacing:0.1em;
        }
        .ar-item {
          display:flex; align-items:center; gap:0.7rem;
          padding:0.65rem 0.7rem; border-radius:11px;
          border:1px solid transparent; cursor:pointer;
          transition:all 0.18s; background:transparent;
          text-align:left; width:100%; position:relative;
        }
        .ar-item:hover { background:rgba(242,232,208,0.04); border-color:rgba(201,168,76,0.15); }
        .ar-item.active { background:rgba(201,168,76,0.09); border-color:rgba(201,168,76,0.35); }
        .ar-item-thumb {
          width:42px; height:42px; border-radius:8px;
          object-fit:cover; flex-shrink:0;
          border:1px solid rgba(255,255,255,0.06);
        }
        .ar-item-info { flex:1; min-width:0; }
        .ar-item-name {
          font-family:'Cormorant Garamond',serif; font-size:0.92rem; font-weight:700;
          color:rgba(242,232,208,0.65); white-space:nowrap;
          overflow:hidden; text-overflow:ellipsis; line-height:1.2;
          transition:color 0.2s;
        }
        .ar-item.active .ar-item-name { color:#F2E8D0; }
        .ar-item-loc {
          font-family:'Space Mono',monospace; font-size:0.48rem;
          color:rgba(242,232,208,0.25); letter-spacing:0.08em;
          text-transform:uppercase; margin-top:2px;
          white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
        }
        .ar-item.active .ar-item-loc { color:rgba(201,168,76,0.6); }
        .ar-item-unesco {
          position:absolute; top:6px; right:6px;
          font-family:'Space Mono',monospace; font-size:0.42rem;
          background:#C9A84C; color:#0D1B2A;
          padding:1px 5px; border-radius:4px; font-weight:700;
          letter-spacing:0.08em;
        }

        .ar-center {
          position:relative; background:#070D14;
          display:flex; flex-direction:column; overflow:hidden;
        }
        .ar-viewer-header {
          padding:0.85rem 1.2rem;
          border-bottom:1px solid rgba(201,168,76,0.08);
          display:flex; align-items:center; justify-content:space-between; flex-shrink:0;
        }
        .ar-viewer-name {
          font-family:'Cormorant Garamond',serif; font-size:1.3rem; font-weight:700;
          color:#F2E8D0; line-height:1;
        }
        .ar-viewer-loc {
          font-family:'Space Mono',monospace; font-size:0.52rem;
          color:rgba(201,168,76,0.6); letter-spacing:0.1em;
          text-transform:uppercase; margin-top:3px;
        }
        .ar-viewer-badges { display:flex; gap:0.4rem; align-items:center; }
        .ar-viewer-badge {
          font-family:'Space Mono',monospace; font-size:0.48rem;
          letter-spacing:0.1em; text-transform:uppercase;
          padding:3px 9px; border-radius:6px; font-weight:700;
        }
        .ar-viewer-badge.gold { background:rgba(201,168,76,0.15); color:#C9A84C; border:1px solid rgba(201,168,76,0.25); }
        .ar-viewer-badge.unesco { background:#C9A84C; color:#0D1B2A; }

        .ar-frame-wrap {
          flex:1; position:relative; overflow:hidden;
        }
        .ar-frame-loading {
          position:absolute; inset:0; z-index:5;
          display:flex; flex-direction:column;
          align-items:center; justify-content:center; gap:1rem;
          background:#070D14;
          transition:opacity 0.5s;
        }
        .ar-frame-loading.hidden { opacity:0; pointer-events:none; }
        .ar-frame-radar { position:relative; width:80px; height:80px; display:flex; align-items:center; justify-content:center; }
        .ar-frame-radar .ar-radar-sweep { animation-duration:1.3s; }
        .ar-frame-radar .ar-radar-ring.r1 { inset:0; }
        .ar-frame-radar .ar-radar-ring.r2 { inset:14px; }
        .ar-frame-radar .ar-radar-core { width:24px; height:24px; font-size:0.7rem; }
        .ar-loading-text {
          font-family:'Space Mono',monospace; font-size:0.58rem;
          color:rgba(242,232,208,0.3); letter-spacing:0.15em; text-transform:uppercase;
          animation:pulse 1.5s ease infinite;
        }
        .ar-frame-wrap iframe {
          position:absolute; inset:0;
          width:100%; height:100%; border:none;
        }

        .ar-right {
          border-left:1px solid rgba(201,168,76,0.1);
          overflow-y:auto; padding:1.25rem;
          display:flex; flex-direction:column; gap:1.4rem;
        }
        .ar-right::-webkit-scrollbar { width:3px; }
        .ar-right::-webkit-scrollbar-thumb { background:rgba(201,168,76,0.2); border-radius:2px; }

        .ar-section-title {
          font-family:'Space Mono',monospace; font-size:0.5rem;
          color:rgba(201,168,76,0.45); letter-spacing:0.2em; text-transform:uppercase;
          margin-bottom:0.75rem;
          display:flex; align-items:center; gap:0.5rem;
        }
        .ar-section-title::after { content:''; flex:1; height:1px; background:rgba(201,168,76,0.08); }

        .ar-poster {
          width:100%; height:130px; object-fit:cover;
          border-radius:10px; border:1px solid rgba(201,168,76,0.1);
          margin-bottom:0.9rem;
        }
        .ar-detail-name {
          font-family:'Cormorant Garamond',serif; font-size:1.4rem; font-weight:700;
          color:#F2E8D0; line-height:1.1; margin-bottom:0.25rem;
        }
        .ar-detail-sub {
          font-family:'Space Mono',monospace; font-size:0.52rem;
          color:rgba(201,168,76,0.65); letter-spacing:0.1em; text-transform:uppercase;
        }

        .ar-meta-grid {
          display:grid; grid-template-columns:1fr 1fr; gap:0.5rem;
        }
        .ar-meta {
          background:rgba(201,168,76,0.04);
          border:1px solid rgba(201,168,76,0.1);
          border-radius:9px; padding:0.55rem 0.7rem;
        }
        .ar-meta-label {
          font-family:'Space Mono',monospace; font-size:0.46rem;
          color:rgba(242,232,208,0.25); letter-spacing:0.12em;
          text-transform:uppercase; margin-bottom:2px;
        }
        .ar-meta-val {
          font-family:'Poppins',sans-serif; font-size:0.73rem;
          color:#F2E8D0; font-weight:500;
        }

        .ar-fact {
          background:rgba(201,168,76,0.05);
          border:1px solid rgba(201,168,76,0.12);
          border-left:3px solid #C9A84C;
          border-radius:0 9px 9px 0; padding:0.85rem;
        }
        .ar-fact-text {
          font-family:'Poppins',sans-serif; font-size:0.76rem;
          color:rgba(242,232,208,0.55); line-height:1.65; font-style:italic;
        }

        .ar-controls { display:flex; flex-direction:column; gap:0.4rem; }
        .ar-ctrl {
          display:flex; align-items:center; gap:0.6rem;
          font-family:'Space Mono',monospace; font-size:0.5rem;
          color:rgba(242,232,208,0.28); letter-spacing:0.06em;
        }
        .ar-ctrl-key {
          background:rgba(242,232,208,0.05);
          border:1px solid rgba(242,232,208,0.1);
          border-radius:5px; padding:2px 7px;
          font-size:0.48rem; color:rgba(242,232,208,0.35);
          white-space:nowrap;
        }

        .ar-mobile-notice {
          background:rgba(74,124,89,0.07);
          border:1px solid rgba(74,124,89,0.18);
          border-radius:9px; padding:0.75rem;
          display:flex; gap:0.5rem;
        }
        .ar-mobile-notice-text {
          font-family:'Poppins',sans-serif; font-size:0.7rem;
          color:rgba(242,232,208,0.45); line-height:1.55;
        }
        .ar-mobile-notice-text strong { color:rgba(242,232,208,0.75); display:block; margin-bottom:2px; }

        .ar-view-tabs {
          display:flex; gap:0; border-bottom:1px solid rgba(201,168,76,0.1);
          flex-shrink:0;
        }
        .ar-view-tab {
          flex:1; padding:0.65rem 1rem;
          font-family:'Space Mono',monospace; font-size:0.56rem;
          letter-spacing:0.12em; text-transform:uppercase;
          color:rgba(242,232,208,0.35); background:transparent; border:none;
          cursor:pointer; transition:all 0.2s;
          border-bottom:2px solid transparent; display:flex;
          align-items:center; justify-content:center; gap:0.4rem;
        }
        .ar-view-tab:hover { color:rgba(242,232,208,0.6); }
        .ar-view-tab.active { color:#C9A84C; border-bottom-color:#C9A84C; }

        .ar-cam-wrap {
          position:relative; width:100%; flex:1;
          background:#000; overflow:hidden;
          display:flex; align-items:center; justify-content:center;
        }
        .ar-cam-video {
          position:absolute; inset:0;
          width:100%; height:100%;
          object-fit:cover; z-index:1;
        }
        .ar-cam-overlay {
          position:absolute; z-index:3;
          transform:translate(-50%,-50%);
          cursor:grab; user-select:none;
          filter:drop-shadow(0 8px 32px rgba(0,0,0,0.7));
          transition: filter 0.2s;
        }
        .ar-cam-overlay:active { cursor:grabbing; }
        .ar-cam-overlay img {
          width:100%; height:100%;
          object-fit:contain; border-radius:8px;
          pointer-events:none;
          mix-blend-mode:normal;
        }
        .ar-cam-overlay-label {
          position:absolute; bottom:-28px; left:50%; transform:translateX(-50%);
          background:rgba(13,27,42,0.85);
          border:1px solid rgba(201,168,76,0.3); border-radius:20px;
          padding:3px 12px; white-space:nowrap;
          font-family:'Space Mono',monospace; font-size:0.5rem;
          color:#C9A84C; letter-spacing:0.1em; pointer-events:none;
        }
        .ar-cam-start {
          display:flex; flex-direction:column;
          align-items:center; justify-content:center;
          gap:1.2rem; padding:2rem; text-align:center; z-index:2;
        }
        .ar-cam-start-icon { font-size:3rem; }
        .ar-cam-start-title {
          font-family:'Cormorant Garamond',serif; font-size:1.5rem;
          font-weight:700; color:#F2E8D0;
        }
        .ar-cam-start-desc {
          font-family:'Poppins',sans-serif; font-size:0.8rem;
          color:rgba(242,232,208,0.45); line-height:1.6; max-width:320px;
        }
        .ar-cam-start-btn {
          display:flex; align-items:center; gap:0.5rem;
          padding:0.8rem 1.8rem; border-radius:50px;
          background:linear-gradient(135deg,#C9A84C,#E8C96A);
          color:#0D1B2A; border:none; cursor:pointer;
          font-family:'Space Mono',monospace; font-size:0.62rem;
          font-weight:700; letter-spacing:0.1em;
          transition:all 0.25s;
          box-shadow:0 4px 20px rgba(201,168,76,0.35);
        }
        .ar-cam-start-btn:hover { transform:translateY(-2px); box-shadow:0 8px 30px rgba(201,168,76,0.5); }
        .ar-cam-error {
          background:rgba(224,123,84,0.1); border:1px solid rgba(224,123,84,0.3);
          border-radius:10px; padding:0.8rem 1.2rem;
          font-family:'Poppins',sans-serif; font-size:0.75rem;
          color:rgba(224,123,84,0.9); max-width:340px; text-align:center;
        }
        .ar-cam-controls {
          position:absolute; bottom:1rem; left:50%; transform:translateX(-50%);
          z-index:10; display:flex; gap:0.6rem; align-items:center;
          background:rgba(4,8,15,0.75); backdrop-filter:blur(12px);
          border:1px solid rgba(201,168,76,0.2); border-radius:50px;
          padding:0.5rem 1rem;
        }
        .ar-cam-ctrl-label {
          font-family:'Space Mono',monospace; font-size:0.5rem;
          color:rgba(242,232,208,0.35); letter-spacing:0.1em; white-space:nowrap;
        }
        .ar-cam-slider {
          -webkit-appearance:none; appearance:none;
          height:3px; border-radius:2px; outline:none;
          background:rgba(201,168,76,0.2); cursor:pointer; width:80px;
        }
        .ar-cam-slider::-webkit-slider-thumb {
          -webkit-appearance:none; width:14px; height:14px;
          border-radius:50%; background:#C9A84C; cursor:pointer;
          border:2px solid #0D1B2A;
        }
        .ar-cam-stop-btn {
          padding:4px 12px; border-radius:20px;
          background:rgba(224,123,84,0.15); border:1px solid rgba(224,123,84,0.3);
          color:rgba(224,123,84,0.9); font-family:'Space Mono',monospace;
          font-size:0.5rem; letter-spacing:0.1em; cursor:pointer;
          transition:all 0.2s;
        }
        .ar-cam-stop-btn:hover { background:rgba(224,123,84,0.25); }
        @keyframes flashIn { 0%{opacity:0.8} 100%{opacity:0} }
        .ar-cam-flash {
          position:absolute; inset:0; background:#fff; z-index:20;
          pointer-events:none; animation:flashIn 0.4s ease forwards;
        }
        @keyframes scanline { 0%{top:-10%} 100%{top:110%} }
        .ar-cam-scan {
          position:absolute; left:0; right:0; height:2px;
          background:linear-gradient(90deg,transparent,rgba(201,168,76,0.6),transparent);
          z-index:4; animation:scanline 3s linear infinite;
          pointer-events:none;
        }
        .ar-cam-bracket {
          position:absolute; z-index:5; width:40px; height:40px;
          pointer-events:none;
        }
        .ar-cam-bracket.tl { top:16px; left:16px; border-top:2px solid #C9A84C; border-left:2px solid #C9A84C; }
        .ar-cam-bracket.tr { top:16px; right:16px; border-top:2px solid #C9A84C; border-right:2px solid #C9A84C; }
        .ar-cam-bracket.bl { bottom:60px; left:16px; border-bottom:2px solid #C9A84C; border-left:2px solid #C9A84C; }
        .ar-cam-bracket.br { bottom:60px; right:16px; border-bottom:2px solid #C9A84C; border-right:2px solid #C9A84C; }
        .ar-cam-hint {
          position:absolute; top:12px; left:50%; transform:translateX(-50%);
          z-index:6; background:rgba(4,8,15,0.75); backdrop-filter:blur(8px);
          border:1px solid rgba(201,168,76,0.2); border-radius:20px;
          padding:4px 14px;
          font-family:'Space Mono',monospace; font-size:0.5rem;
          color:rgba(201,168,76,0.8); letter-spacing:0.1em; white-space:nowrap;
          pointer-events:none;
        }

        @media (max-width:900px) {
          .ar-body { grid-template-columns:1fr; grid-template-rows:auto 1fr; }
          .ar-left {
            flex-direction:row; overflow-x:auto; overflow-y:hidden;
            border-right:none; border-bottom:1px solid rgba(201,168,76,0.1);
            padding:0.6rem; max-height:110px; gap:0.5rem;
          }
          .ar-item { min-width:90px; flex-direction:column; padding:0.5rem; gap:0.4rem; }
          .ar-item-thumb { width:36px; height:36px; }
          .ar-item-loc { display:none; }
          .ar-right { display:none; }
          .ar-frame-wrap { min-height:300px; }
        }
      `}</style>

      <div className="ar-overlay">

        {/* ── Radar scan intro ── */}
        <div className={`ar-init-overlay ${initializing ? "" : "hidden"}`}>
          <div className="ar-radar">
            <div className="ar-radar-sweep" />
            <div className="ar-radar-ring r1" />
            <div className="ar-radar-ring r2" />
            <div className="ar-radar-ring r3" />
            <div className="ar-radar-pulse" />
            <div className="ar-radar-pulse delay" />
            <div className="ar-radar-core">📡</div>
          </div>
          <div className="ar-init-text">
            Initializing AR Scanner
            <span className="dot">.</span>
            <span className="dot">.</span>
            <span className="dot">.</span>
          </div>
          <div className="ar-init-sub">Calibrating heritage model registry</div>
        </div>

        <div className="ar-top">
          <div className="ar-top-left">
            <span className="ar-badge">📱 AR View</span>
            <span className="ar-title">3D Heritage Explorer</span>
          </div>
          <div className="ar-search">
            <span className="ar-search-icon">🔍</span>
            <input
              placeholder="Search models..."
              value={searchQ}
              onChange={e => setSearchQ(e.target.value)}
            />
          </div>
          <button className="ar-close" onClick={onClose}>✕</button>
        </div>

        <div className="ar-cats">
          {Object.entries(CATEGORIES).map(([key, cat]) => {
            const count = key === "all"
              ? AR_SITES.length
              : AR_SITES.filter(s => s.category === key).length;
            return (
              <button
                key={key}
                className={`ar-cat ${activeCategory === key ? "active" : ""}`}
                onClick={() => { setActiveCategory(key); setSearchQ(""); }}
              >
                {cat.icon} {cat.label}
                <span className="ar-cat-count">{count}</span>
              </button>
            );
          })}
        </div>

        <div className="ar-body">

          <div className="ar-left">
            {filtered.length === 0 ? (
              <div className="ar-left-empty">No models found</div>
            ) : filtered.map(site => (
              <button
                key={site.id}
                className={`ar-item ${activeSite.id === site.id ? "active" : ""}`}
                onClick={() => setActiveSite(site)}
              >
                <img src={site.poster} alt={site.name} className="ar-item-thumb" />
                <div className="ar-item-info">
                  <div className="ar-item-name">{site.name}</div>
                  <div className="ar-item-loc">📍 {site.location}</div>
                </div>
                {site.unesco && <span className="ar-item-unesco">UNESCO</span>}
              </button>
            ))}
          </div>

          <div className="ar-center">

            <div className="ar-viewer-header">
              <div>
                <div className="ar-viewer-name">{activeSite.name}</div>
                <div className="ar-viewer-loc">📍 {activeSite.location} · {activeSite.era}</div>
              </div>
              <div className="ar-viewer-badges">
                <span className="ar-viewer-badge gold">{activeSite.subtitle}</span>
                {activeSite.unesco && <span className="ar-viewer-badge unesco">UNESCO ★</span>}
              </div>
            </div>

            <div className="ar-view-tabs">
              <button
                className={`ar-view-tab ${activeTab === "3d" ? "active" : ""}`}
                onClick={() => setActiveTab("3d")}
              >
                ⬡ 3D Model
              </button>
              <button
                className={`ar-view-tab ${activeTab === "camera" ? "active" : ""}`}
                onClick={() => setActiveTab("camera")}
              >
                📷 Live Camera AR
              </button>
            </div>

            {activeTab === "3d" && (
              <div className="ar-frame-wrap">
                <div className={`ar-frame-loading ${frameLoaded ? "hidden" : ""}`}>
                  <div className="ar-frame-radar">
                    <div className="ar-radar-sweep" />
                    <div className="ar-radar-ring r1" />
                    <div className="ar-radar-ring r2" />
                    <div className="ar-radar-core">⬡</div>
                  </div>
                  <div className="ar-loading-text">Loading 3D Model...</div>
                </div>
                <iframe
                  key={activeSite.id}
                  title={activeSite.name}
                  src={`https://sketchfab.com/models/${activeSite.sketchfabId}/embed?autostart=1&ui_theme=dark&ui_color=c9a84c&ui_infos=0&ui_watermark=0`}
                  allow="autoplay; fullscreen; xr-spatial-tracking; accelerometer; gyroscope; magnetometer"
                  onLoad={() => setFrameLoaded(true)}
                />
              </div>
            )}

            {activeTab === "camera" && (
              <div className="ar-cam-wrap">

                {!cameraActive && (
                  <div className="ar-cam-start">
                    <div className="ar-cam-start-icon">📷</div>
                    <div className="ar-cam-start-title">Live Camera AR</div>
                    <div className="ar-cam-start-desc">
                      Place <strong style={{color:"#C9A84C"}}>{activeSite.name}</strong> in your real environment.
                      Your camera will open and the heritage model will float in your view — drag to reposition, scale to resize.
                    </div>
                    {cameraError && <div className="ar-cam-error">⚠️ {cameraError}</div>}
                    <button className="ar-cam-start-btn" onClick={startCamera}>
                      📷 Start Camera
                    </button>
                    <div style={{
                      fontFamily:"'Space Mono',monospace", fontSize:"0.5rem",
                      color:"rgba(242,232,208,0.2)", letterSpacing:"0.1em", textAlign:"center"
                    }}>
                      Camera access required · Works best on mobile
                    </div>
                  </div>
                )}

                {cameraActive && (
                  <>
                    <video
                      ref={videoRef}
                      className="ar-cam-video"
                      autoPlay
                      playsInline
                      muted
                    />

                    <div className="ar-cam-scan" />

                    <div className="ar-cam-bracket tl" />
                    <div className="ar-cam-bracket tr" />
                    <div className="ar-cam-bracket bl" />
                    <div className="ar-cam-bracket br" />

                    <div className="ar-cam-hint">
                      Drag monument · Use sliders to adjust
                    </div>

                    <div
                      className="ar-cam-overlay"
                      style={{
                        left: `${overlayX}%`,
                        top:  `${overlayY}%`,
                        width:  `${Math.round(180 * overlayScale)}px`,
                        height: `${Math.round(180 * overlayScale)}px`,
                        opacity: overlayOpacity,
                      }}
                      onMouseDown={onDragStart}
                      onTouchStart={onDragStart}
                    >
                      <img src={activeSite.poster} alt={activeSite.name} />
                      <div className="ar-cam-overlay-label">{activeSite.name}</div>
                    </div>

                    <div className="ar-cam-controls">
                      <span className="ar-cam-ctrl-label">Size</span>
                      <input
                        type="range" className="ar-cam-slider"
                        min="0.4" max="3" step="0.05"
                        value={overlayScale}
                        onChange={e => setOverlayScale(parseFloat(e.target.value))}
                      />
                      <span className="ar-cam-ctrl-label">Opacity</span>
                      <input
                        type="range" className="ar-cam-slider"
                        min="0.2" max="1" step="0.05"
                        value={overlayOpacity}
                        onChange={e => setOverlayOpacity(parseFloat(e.target.value))}
                      />
                      <button className="ar-cam-stop-btn" onClick={stopCamera}>
                        ✕ Stop
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

          </div>

          <div className="ar-right">

            <div>
              <div className="ar-section-title">Viewing</div>
              <img src={activeSite.poster} alt={activeSite.name} className="ar-poster" />
              <div className="ar-detail-name">{activeSite.name}</div>
              <div className="ar-detail-sub">{activeSite.subtitle}</div>
            </div>

            <div>
              <div className="ar-section-title">Details</div>
              <div className="ar-meta-grid">
                <div className="ar-meta">
                  <div className="ar-meta-label">Era</div>
                  <div className="ar-meta-val">{activeSite.era}</div>
                </div>
                <div className="ar-meta">
                  <div className="ar-meta-label">Category</div>
                  <div className="ar-meta-val" style={{textTransform:"capitalize"}}>
                    {CATEGORIES[activeSite.category]?.icon} {CATEGORIES[activeSite.category]?.label}
                  </div>
                </div>
                <div className="ar-meta" style={{gridColumn:"1/-1"}}>
                  <div className="ar-meta-label">Location</div>
                  <div className="ar-meta-val">📍 {activeSite.location}</div>
                </div>
              </div>
            </div>

            <div>
              <div className="ar-section-title">Did You Know</div>
              <div className="ar-fact">
                <div className="ar-fact-text">"{activeSite.fact}"</div>
              </div>
            </div>

            <div>
              <div className="ar-section-title">3D Controls</div>
              <div className="ar-controls">
                {[
                  { key:"Drag",       desc:"Rotate model" },
                  { key:"Scroll",     desc:"Zoom in / out" },
                  { key:"Two finger", desc:"Pan the view" },
                  { key:"Fullscreen", desc:"Immersive mode" },
                ].map(c => (
                  <div className="ar-ctrl" key={c.key}>
                    <span className="ar-ctrl-key">{c.key}</span> {c.desc}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="ar-section-title">Mobile AR</div>
              <div className="ar-mobile-notice">
                <span style={{fontSize:"1rem",flexShrink:0}}>📱</span>
                <div className="ar-mobile-notice-text">
                  <strong>Real-world AR on mobile</strong>
                  Android: ARCore via Chrome. iOS: Quick Look via Safari. Open on phone for AR placement.
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}