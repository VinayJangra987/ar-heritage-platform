import { useEffect, useRef, useState, useCallback } from "react";

const HOLD = 0.6; // fraction of each scroll "segment" the current site holds still before crossfading

function easeProgress(segT) {
  if (segT <= HOLD) return 0;
  return (segT - HOLD) / (1 - HOLD);
}

// Mini in-hold pulse: aerial → blueprint → dusk, mirroring the deep-dive story.
function holdStage(segT) {
  const holdT = Math.min(1, segT / HOLD); // 0..1 across the hold window
  if (holdT < 0.35) return "aerial";
  if (holdT < 0.68) return "blueprint";
  return "dusk";
}

const HOLD_FILTERS = {
  aerial: "brightness(0.95) saturate(1.05)",
  blueprint: "grayscale(1) contrast(1.5) brightness(1.15) invert(0.04)",
  dusk: "sepia(0.25) brightness(0.78) saturate(1.3)",
};

const HOLD_LABELS = {
  aerial: "From Above",
  blueprint: "The Design",
  dusk: "At Dusk",
};

export default function HeritageScrollMorph({ sites = [], onViewAR }) {
  const wrapRef = useRef(null);
  const [frameIndex, setFrameIndex] = useState(0); // 0..N  (N = sites.length)
  const [segT, setSegT] = useState(0); // 0..1 progress within current frame

  const N = sites.length;
  const totalFrames = N + 1; // +1 for the misty intro frame

  const handleScroll = useCallback(() => {
    const el = wrapRef.current;
    if (!el || N === 0) return;
    const rect = el.getBoundingClientRect();
    const total = rect.height - window.innerHeight;
    if (total <= 0) return;

    const raw = -rect.top / total;
    const clamped = Math.min(1, Math.max(0, raw));
    const overall = clamped * totalFrames;

    const fIdx = Math.min(N, Math.floor(overall));
    const t = fIdx === N ? Math.min(1, overall - fIdx) : overall - fIdx;

    setFrameIndex(fIdx);
    setSegT(t);
  }, [N, totalFrames]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [handleScroll]);

  if (N === 0) return null;

  // ── Derived state ──────────────────────────────────────────────────────
  const currentSiteIndex = frameIndex === 0 ? null : frameIndex - 1;
  const nextSiteIndex = frameIndex < N ? frameIndex : null;
  const fade = easeProgress(segT); // 0..1 crossfade amount within this segment

  const currentSite = currentSiteIndex !== null ? sites[currentSiteIndex] : null;
  const nextSite = nextSiteIndex !== null ? sites[nextSiteIndex] : null;

  // continuous "how far through the site sequence" value, 0..N
  const siteContinuous = frameIndex + (nextSiteIndex !== null ? fade : 0);

  // which site's text/eyebrow is in focus right now, and how opaque it is
  let focusSite = currentSite;
  let textOpacity = 1;
  if (segT > HOLD) {
    const t2 = fade; // 0..1 within the crossfade window
    if (t2 < 0.5) {
      focusSite = currentSite;
      textOpacity = 1 - t2 * 2;
    } else {
      focusSite = nextSite;
      textOpacity = (t2 - 0.5) * 2;
    }
  }

  const mistOpacity = frameIndex === 0 ? 1 - fade : 0;
  const currentImgOpacity = currentSite ? 1 : 0;
  const nextImgOpacity = nextSite ? fade : 0;

  // the mini in-hold pulse only applies while the current site is still holding
  const inHold = segT <= HOLD && currentSite;
  const currentStageKey = inHold ? holdStage(segT) : "aerial";
  const currentImgFilter = HOLD_FILTERS[currentStageKey];
  const holdLabel = inHold ? HOLD_LABELS[currentStageKey] : null;

  const accent = (focusSite && focusSite.color) || (currentSite && currentSite.color) || "#C9A84C";

  return (
    <>
      <style>{`
        .hsm-wrap { position: relative; background: #0D1B2A; }
        .hsm-sticky {
          position: sticky; top: 0; height: 100vh; overflow: hidden;
        }
        .hsm-layer { position: absolute; inset: 0; transition: opacity 0.15s linear; }
        .hsm-layer img {
          width: 100%; height: 100%; object-fit: cover;
          transition: filter 0.7s ease;
        }
        .hsm-layer.current-layer { z-index: 2; }
        .hsm-layer.next-layer { z-index: 3; }

        /* ── Misty intro (pure CSS, no image dependency) ── */
        .hsm-mist {
          position: absolute; inset: 0; z-index: 1;
          background: #0D1B2A;
          overflow: hidden;
        }
        .hsm-mist-blob {
          position: absolute; border-radius: 50%;
          filter: blur(60px);
          opacity: 0.55;
          animation: hsmDrift 18s ease-in-out infinite alternate;
        }
        .hsm-mist-blob.b1 { width: 55vw; height: 55vw; top: -15%; left: -10%; background: radial-gradient(circle, rgba(201,168,76,0.35), transparent 70%); animation-duration: 22s; }
        .hsm-mist-blob.b2 { width: 45vw; height: 45vw; bottom: -10%; right: -5%; background: radial-gradient(circle, rgba(26,107,114,0.4), transparent 70%); animation-duration: 26s; }
        .hsm-mist-blob.b3 { width: 40vw; height: 40vw; top: 30%; left: 35%; background: radial-gradient(circle, rgba(242,232,208,0.15), transparent 70%); animation-duration: 20s; }
        @keyframes hsmDrift {
          from { transform: translate(0,0) scale(1); }
          to { transform: translate(4%, -3%) scale(1.12); }
        }
        .hsm-mist-grain {
          position: absolute; inset: 0;
          background-image: radial-gradient(rgba(242,232,208,0.06) 1px, transparent 1px);
          background-size: 3px 3px;
          opacity: 0.4;
        }

        /* ── Blueprint grid overlay, shown during the mini in-hold pulse ── */
        .hsm-grid-overlay {
          position: absolute; inset: 0; z-index: 3.5; pointer-events: none;
          background-image:
            repeating-linear-gradient(0deg, rgba(242,232,208,0.08) 0px, transparent 1px, transparent 42px, rgba(242,232,208,0.08) 43px),
            repeating-linear-gradient(90deg, rgba(242,232,208,0.08) 0px, transparent 1px, transparent 42px, rgba(242,232,208,0.08) 43px);
          transition: opacity 0.4s ease;
        }

        .hsm-gradient {
          position: absolute; inset: 0; z-index: 4;
          background: linear-gradient(to top, rgba(13,27,42,0.96) 0%, rgba(13,27,42,0.4) 45%, rgba(13,27,42,0.1) 70%, transparent 100%);
        }

        .hsm-content {
          position: relative; z-index: 5; height: 100%;
          display: flex; flex-direction: column; justify-content: flex-end;
          padding: 0 6vw 4.5rem;
        }
        .hsm-stage-tag {
          font-family: 'Space Mono', monospace; font-size: 0.6rem;
          letter-spacing: 0.15em; text-transform: uppercase;
          color: rgba(242,232,208,0.5);
          border: 1px solid rgba(242,232,208,0.2); border-radius: 3px;
          padding: 3px 10px; display: inline-block; width: fit-content;
          margin-bottom: 0.75rem;
          transition: opacity 0.3s ease;
        }
        .hsm-eyebrow {
          font-family: 'Space Mono', monospace;
          font-size: 0.65rem; letter-spacing: 0.25em; text-transform: uppercase;
          color: var(--hsm-accent, #C9A84C); margin-bottom: 0.9rem;
          display: flex; align-items: center; gap: 0.75rem;
        }
        .hsm-eyebrow::before { content: ''; width: 34px; height: 1px; background: var(--hsm-accent, #C9A84C); }
        .hsm-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.6rem, 6.5vw, 5.5rem); font-weight: 700;
          color: #F2E8D0; line-height: 1.02; margin-bottom: 0.5rem; max-width: 800px;
        }
        .hsm-tagline {
          font-family: 'Cormorant Garamond', serif; font-style: italic;
          font-size: clamp(1rem, 2vw, 1.35rem);
          color: rgba(242,232,208,0.65); margin-bottom: 1.8rem; max-width: 620px;
        }

        .hsm-progress-track { display: flex; gap: 6px; margin-top: 0.5rem; max-width: 480px; }
        .hsm-progress-seg { flex: 1; height: 2px; background: rgba(242,232,208,0.15); border-radius: 2px; overflow: hidden; }
        .hsm-progress-seg span { display: block; height: 100%; background: var(--hsm-accent, #C9A84C); transition: width 0.1s linear; }
        .hsm-progress-labels { display: flex; justify-content: space-between; margin-top: 0.5rem; max-width: 480px; }
        .hsm-progress-labels span {
          font-family: 'Space Mono', monospace; font-size: 0.55rem; letter-spacing: 0.05em;
          color: rgba(242,232,208,0.35);
        }

        .hsm-ar-btn {
          margin-top: 1.75rem; align-self: flex-start;
          display: inline-flex; align-items: center; gap: 0.6rem;
          padding: 0.8rem 1.8rem; border-radius: 4px; border: none;
          background: linear-gradient(135deg, var(--hsm-accent, #C9A84C), #E8C96A);
          color: #0D1B2A; font-family: 'Space Mono', monospace;
          font-size: 0.6rem; font-weight: 700; letter-spacing: 0.15em;
          text-transform: uppercase; cursor: pointer; transition: transform 0.25s ease;
        }
        .hsm-ar-btn:hover { transform: translateY(-2px); }

        .hsm-scroll-hint {
          position: absolute; bottom: 1.5rem; left: 50%; transform: translateX(-50%);
          z-index: 5; font-family: 'Space Mono', monospace; font-size: 0.55rem;
          letter-spacing: 0.2em; text-transform: uppercase; color: rgba(242,232,208,0.4);
          opacity: ${frameIndex === 0 && segT < 0.3 ? 1 : 0};
          transition: opacity 0.4s ease;
        }

        /* ── Mobile fallback markup (hidden on desktop) ── */
        .hsm-mobile { display: none; }

        @media (max-width: 768px) {
          .hsm-desktop { display: none; }
          .hsm-mobile {
            display: block; background: #0D1B2A;
          }
          .hsm-mobile-slide {
            position: relative; height: 100vh; min-height: 560px;
            display: flex; align-items: flex-end; overflow: hidden;
          }
          .hsm-mobile-slide img {
            position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;
          }
          .hsm-mobile-slide::after {
            content: ''; position: absolute; inset: 0;
            background: linear-gradient(to top, rgba(13,27,42,0.96) 0%, rgba(13,27,42,0.35) 45%, transparent 80%);
          }
          .hsm-mobile-content { position: relative; z-index: 2; padding: 0 6vw 3rem; width: 100%; }
          .hsm-mobile-num {
            font-family: 'Space Mono', monospace; font-size: 0.6rem; letter-spacing: 0.15em;
            color: var(--hsm-accent, #C9A84C); text-transform: uppercase; margin-bottom: 0.75rem;
          }
          .hsm-mobile-title {
            font-family: 'Cormorant Garamond', serif; font-size: 2.4rem; font-weight: 700;
            color: #F2E8D0; line-height: 1.05; margin-bottom: 0.4rem;
          }
          .hsm-mobile-tagline {
            font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 1rem;
            color: rgba(242,232,208,0.65); margin-bottom: 1.4rem;
          }
        }
      `}</style>

      {/* ══════════════ DESKTOP: pinned scroll-morph ══════════════ */}
      <div className="hsm-desktop">
        <div className="hsm-wrap" ref={wrapRef} style={{ height: `${totalFrames * 100}vh` }}>
          <div className="hsm-sticky" style={{ "--hsm-accent": accent }}>

            {/* misty intro */}
            <div className="hsm-mist" style={{ opacity: mistOpacity }}>
              <div className="hsm-mist-blob b1" />
              <div className="hsm-mist-blob b2" />
              <div className="hsm-mist-blob b3" />
              <div className="hsm-mist-grain" />
            </div>

            {/* current site image — pulses aerial → blueprint → dusk while holding */}
            <div className="hsm-layer current-layer" style={{ opacity: currentImgOpacity }}>
              {currentSite && <img src={currentSite.image} alt={currentSite.name} style={{ filter: currentImgFilter }} />}
            </div>
            {inHold && currentStageKey === "blueprint" && <div className="hsm-grid-overlay" />}

            {/* next site image, crossfading in (always its clean aerial look) */}
            <div className="hsm-layer next-layer" style={{ opacity: nextImgOpacity }}>
              {nextSite && <img src={nextSite.image} alt={nextSite.name} />}
            </div>

            <div className="hsm-gradient" />

            <div className="hsm-content">
              {focusSite ? (
                <div style={{ opacity: textOpacity, transition: "opacity 0.1s linear" }}>
                  {holdLabel && <div className="hsm-stage-tag">{holdLabel}</div>}
                  <div className="hsm-eyebrow">{focusSite.state} &nbsp;·&nbsp; {focusSite.era}</div>
                  <h2 className="hsm-title">{focusSite.name}</h2>
                  <div className="hsm-tagline">{focusSite.tagline}</div>
                </div>
              ) : (
                <div>
                  <div className="hsm-eyebrow">Bharatiya Dharohar</div>
                  <h2 className="hsm-title">Four Monuments,<br />One Living Heritage</h2>
                  <div className="hsm-tagline">Scroll to begin the journey</div>
                </div>
              )}

              <div className="hsm-progress-track">
                {sites.map((s, i) => (
                  <div className="hsm-progress-seg" key={s.id}>
                    <span
                      style={{
                        width: `${Math.min(1, Math.max(0, siteContinuous - i)) * 100}%`,
                      }}
                    />
                  </div>
                ))}
              </div>
              <div className="hsm-progress-labels">
                {sites.map((s) => (
                  <span key={s.id}>{s.name}</span>
                ))}
              </div>

              {focusSite && onViewAR && (
                <button
                  className="hsm-ar-btn"
                  style={{ opacity: textOpacity }}
                  onClick={() => onViewAR(focusSite)}
                >
                  📱 View {focusSite.name} in AR
                </button>
              )}
            </div>

            <div className="hsm-scroll-hint">Scroll to explore ↓</div>
          </div>
        </div>
      </div>

      {/* ══════════════ MOBILE: simple stacked sections ══════════════ */}
      <div className="hsm-mobile">
        {sites.map((s, i) => (
          <div className="hsm-mobile-slide" key={s.id} style={{ "--hsm-accent": s.color }}>
            <img src={s.image} alt={s.name} />
            <div className="hsm-mobile-content">
              <div className="hsm-mobile-num">
                {String(i + 1).padStart(2, "0")} / {String(N).padStart(2, "0")} &nbsp;·&nbsp; {s.state}
              </div>
              <h2 className="hsm-mobile-title">{s.name}</h2>
              <div className="hsm-mobile-tagline">{s.tagline}</div>
              {onViewAR && (
                <button className="hsm-ar-btn" onClick={() => onViewAR(s)}>
                  📱 View in AR
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}