import { useEffect, useRef, useState } from "react";

function buildStages(site) {
  
  const name = site?.name || site?.title || "Heritage Site";
  const state = site?.state || site?.subtitle || "";
  const tagline = site?.tagline || site?.caption || name;
  const era = site?.era || "";

  return [
    {
      key: "aerial",
      label: "01 — From Above",
      caption: state ? `${name}, ${state}` : name,
      sub: "A single scroll, through centuries of stone and story.",
      filter: "brightness(0.94) saturate(1.05)",
    },
    {
      key: "blueprint",
      label: "02 — The Design",
      caption: tagline,
      sub: "Every arch, dome and courtyard — drawn before it was ever carved.",
      filter: "grayscale(1) contrast(1.5) brightness(1.15) invert(0.04)",
      overlay: "grid",
    },
    {
      key: "historical",
      label: "03 — As It Was Built",
      caption: era || "A Chapter of History",
      sub: `Raised by hands that worked in ${era || "another age"}.`,
      filter: "sepia(0.55) contrast(1.1) brightness(0.95) saturate(1.15)",
      overlay: "vignette",
    },
    {
      key: "restoration",
      label: "04 — Preserved Through Time",
      caption: "Conservation & Care",
      sub: "Studied, restored, and protected for every generation after.",
      filter: "grayscale(0.85) contrast(1.3) brightness(0.85)",
      overlay: "dust",
    },
    {
      key: "daylight",
      label: "05 — In Detail",
      caption: "Craft In Every Corner",
      sub: "Carvings and textures that reward a closer look.",
      filter: "brightness(1.05) saturate(1.15) contrast(1.05)",
      overlay: "zoom",
    },
    {
      key: "dusk",
      label: "06 — At Dusk",
      caption: "Golden Hour",
      sub: "Where history glows warmest, just before nightfall.",
      filter: "sepia(0.25) brightness(0.75) saturate(1.3)",
    },
    {
      key: "lifestyle",
      label: "07 — Walk Through It",
      caption: "Experience It Yourself",
      sub: "Step inside, in augmented reality.",
      filter: "brightness(0.97) saturate(1.05)",
      overlay: "reveal",
    },
  ];
}

export default function ScrollStorySection({ site, onViewAR }) {
  const wrapRef = useRef(null);
  const [frameIndex, setFrameIndex] = useState(0);
  const [localProgress, setLocalProgress] = useState(0);

  const stages = buildStages(site);
  const siteImage = site?.image || "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1600&q=90";
  const totalFrames = stages.length + 1; // +1 for the misty intro (frame 0)

  useEffect(() => {
    const handleScroll = () => {
      const el = wrapRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      if (total <= 0) return;

      const raw = -rect.top / total;
      const clamped = Math.min(1, Math.max(0, raw));

      const idx = Math.min(totalFrames - 1, Math.floor(clamped * totalFrames));
      setFrameIndex(idx);
      setLocalProgress(clamped * totalFrames - idx);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [totalFrames]);

  // frame 0 = mist (no image). frames 1..stages.length = content stages.
  const isMist = frameIndex === 0;
  const stage = isMist ? null : stages[frameIndex - 1];
  const nextStage = frameIndex < stages.length ? stages[frameIndex] : null; // next content stage (or null on last)
  const mistOpacity = isMist ? 1 - localProgress : 0;

  const accent = site?.color || "#C9A84C";
  const siteName = site?.name || site?.title || "Heritage Site";

  return (
    <>
      <style>{`
        .ss-wrap {
          position: relative;
          height: ${totalFrames * 100}vh;
          background: #0D1B2A;
        }
        .ss-sticky {
          position: sticky;
          top: 0;
          height: 100vh;
          overflow: hidden;
        }

        /* ── Misty intro (pure CSS) ── */
        .ss-mist { position: absolute; inset: 0; z-index: 1; background: #0D1B2A; overflow: hidden; }
        .ss-mist-blob { position: absolute; border-radius: 50%; filter: blur(60px); opacity: 0.55; animation: ssDrift 20s ease-in-out infinite alternate; }
        .ss-mist-blob.b1 { width: 55vw; height: 55vw; top: -15%; left: -10%; background: radial-gradient(circle, rgba(201,168,76,0.35), transparent 70%); }
        .ss-mist-blob.b2 { width: 45vw; height: 45vw; bottom: -10%; right: -5%; background: radial-gradient(circle, rgba(26,107,114,0.4), transparent 70%); animation-duration: 26s; }
        .ss-mist-blob.b3 { width: 40vw; height: 40vw; top: 30%; left: 35%; background: radial-gradient(circle, rgba(242,232,208,0.15), transparent 70%); animation-duration: 17s; }
        @keyframes ssDrift { from { transform: translate(0,0) scale(1); } to { transform: translate(4%, -3%) scale(1.12); } }

        .ss-img-layer { position: absolute; inset: 0; }
        .ss-img-layer img {
          width: 100%; height: 100%; object-fit: cover;
          transition: filter 0.6s ease, transform 0.6s ease;
        }
        .ss-img-layer.base img { z-index: 2; }
        .ss-img-layer.top img { z-index: 3; }

        /* ── Per-stage overlay treatments ── */
        .ss-overlay { position: absolute; inset: 0; z-index: 4; pointer-events: none; }
        .ss-overlay.grid {
          background-image:
            repeating-linear-gradient(0deg, rgba(242,232,208,0.08) 0px, transparent 1px, transparent 42px, rgba(242,232,208,0.08) 43px),
            repeating-linear-gradient(90deg, rgba(242,232,208,0.08) 0px, transparent 1px, transparent 42px, rgba(242,232,208,0.08) 43px);
        }
        .ss-overlay.vignette {
          background: radial-gradient(ellipse at center, transparent 35%, rgba(45,32,15,0.55) 100%);
        }
        .ss-overlay.dust {
          background-image: radial-gradient(rgba(242,232,208,0.09) 1px, transparent 1px);
          background-size: 4px 4px;
          opacity: 0.5;
        }

        .ss-gradient {
          position: absolute; inset: 0; z-index: 5;
          background: linear-gradient(to top, rgba(13,27,42,0.95) 0%, rgba(13,27,42,0.35) 45%, rgba(13,27,42,0.15) 70%, transparent 100%);
        }
        .ss-content {
          position: relative; z-index: 6;
          height: 100%;
          display: flex; flex-direction: column; justify-content: flex-end;
          padding: 0 6vw 4.5rem;
        }
        .ss-label {
          font-family: 'Space Mono', monospace;
          font-size: 0.65rem; letter-spacing: 0.25em; text-transform: uppercase;
          color: var(--gold, #C9A84C); margin-bottom: 0.8rem;
          display: flex; align-items: center; gap: 0.75rem;
        }
        .ss-label::before { content: ''; width: 34px; height: 1px; background: var(--gold, #C9A84C); }
        .ss-caption {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2rem, 5vw, 3.6rem);
          color: #F2E8D0; font-weight: 700; line-height: 1.1;
          max-width: 700px; margin-bottom: 0.6rem;
        }
        .ss-sub {
          font-family: 'Cormorant Garamond', serif; font-style: italic;
          font-size: clamp(0.9rem, 1.6vw, 1.15rem);
          color: rgba(242,232,208,0.6);
          max-width: 560px; margin-bottom: 1.5rem;
        }
        .ss-progress-track {
          display: flex; gap: 6px; margin-top: 1rem;
        }
        .ss-progress-seg {
          flex: 1; height: 2px; background: rgba(242,232,208,0.15); border-radius: 2px; overflow: hidden;
        }
        .ss-progress-seg span {
          display: block; height: 100%; background: var(--gold, #C9A84C);
        }
        .ss-ar-btn {
          margin-top: 1.75rem;
          align-self: flex-start;
          display: inline-flex; align-items: center; gap: 0.6rem;
          padding: 0.8rem 1.8rem; border-radius: 4px; border: none;
          background: linear-gradient(135deg, var(--gold, #C9A84C), #E8C96A);
          color: #0D1B2A; font-family: 'Space Mono', monospace;
          font-size: 0.6rem; font-weight: 700; letter-spacing: 0.15em;
          text-transform: uppercase; cursor: pointer; transition: transform 0.25s ease;
        }
        .ss-ar-btn:hover { transform: translateY(-2px); }
        .ss-scroll-hint {
          position: absolute; bottom: 1.5rem; left: 50%; transform: translateX(-50%);
          z-index: 6;
          font-family: 'Space Mono', monospace; font-size: 0.55rem;
          letter-spacing: 0.2em; text-transform: uppercase; color: rgba(242,232,208,0.4);
          opacity: ${isMist && localProgress < 0.3 ? 1 : 0};
          transition: opacity 0.4s ease;
        }
        @media (max-width: 768px) {
          .ss-caption { font-size: 1.8rem; }
          .ss-content { padding: 0 6vw 3rem; }
        }
      `}</style>

      <div className="ss-wrap" ref={wrapRef} style={{ "--gold": accent }}>
        <div className="ss-sticky">
          {/* misty intro */}
          <div className="ss-mist" style={{ opacity: mistOpacity }}>
            <div className="ss-mist-blob b1" />
            <div className="ss-mist-blob b2" />
            <div className="ss-mist-blob b3" />
          </div>

          {/* base = current stage image, top = crossfading next stage */}
          <div className="ss-img-layer base" style={{ opacity: stage ? 1 : 0 }}>
            {stage && (
              <img
                src={siteImage}
                alt={stage.label}
                style={{
                  filter: stage.filter,
                  transform: stage.overlay === "zoom" ? `scale(${1.05 + localProgress * 0.05})` : "scale(1)",
                }}
              />
            )}
          </div>
          <div className="ss-img-layer top" style={{ opacity: nextStage ? localProgress : 0 }}>
            {nextStage && <img src={siteImage} alt={nextStage.label} style={{ filter: nextStage.filter }} />}
          </div>

          {stage?.overlay && stage.overlay !== "zoom" && stage.overlay !== "reveal" && (
            <div className={`ss-overlay ${stage.overlay}`} />
          )}

          <div className="ss-gradient" />

          <div className="ss-content">
            {stage ? (
              <>
                <div className="ss-label">{stage.label}</div>
                <div className="ss-caption">{stage.caption}</div>
                <div className="ss-sub">{stage.sub}</div>
              </>
            ) : (
              <>
                <div className="ss-label">Bharatiya Dharohar</div>
                <div className="ss-caption">{siteName}</div>
                <div className="ss-sub">Scroll to begin the journey</div>
              </>
            )}

            <div className="ss-progress-track">
              {stages.map((s, i) => (
                <div className="ss-progress-seg" key={s.key}>
                  <span
                    style={{
                      width:
                        i < frameIndex - 1
                          ? "100%"
                          : i === frameIndex - 1
                          ? `${localProgress * 100}%`
                          : "0%",
                    }}
                  />
                </div>
              ))}
            </div>

            {stage?.key === "lifestyle" && onViewAR && (
              <button className="ss-ar-btn" onClick={() => onViewAR(site)}>
                📱 View {siteName} in AR
              </button>
            )}
          </div>

          <div className="ss-scroll-hint">Scroll to explore ↓</div>
        </div>
      </div>
    </>
  );
}