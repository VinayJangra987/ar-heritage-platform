
import { useState, useEffect, useCallback } from "react";
import ScrollStorySection from "./ScrollStorySection";
import { useAuth } from "../context/AuthContext";
import ReservationModal from "./ReservationModal";

export const SITES = [
  {
    id: "hampi",
    name: "Hampi Ruins",
    state: "Karnataka",
    era: "14th – 16th Century CE",
    tagline: "The Lost Empire of Vijayanagara",
    description:
      "Once the world's second-largest medieval city, Hampi was the magnificent capital of the Vijayanagara Empire. Over 1,600 temple ruins stretch across a surreal boulder-strewn landscape along the Tungabhadra river.",
    facts: [
      "1,600+ temples",
      "UNESCO 1986",
      "Former capital of South India",
      "Tungabhadra riverside",
    ],
    image:
      "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=1400&q=90",
    color: "#C9A84C",
    accent: "#8B6F47",
    num: "01",
  },
  {
    id: "taj",
    name: "Taj Mahal",
    state: "Uttar Pradesh",
    era: "17th Century CE · 1632 AD",
    tagline: "An Eternal Ode in White Marble",
    description:
      "Built by Mughal Emperor Shah Jahan in memory of his beloved wife Mumtaz Mahal, the Taj Mahal stands as the world's greatest monument to love — a perfect symphony of Persian, Islamic and Indian architecture.",
    facts: [
      "22 years to build",
      "20,000 artisans",
      "Pure white marble",
      "UNESCO World Heritage",
    ],
    image:
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1400&q=90",
    color: "#E8D5B7",
    accent: "#A0856B",
    num: "02",
  },
  {
    id: "ajanta",
    name: "Ajanta Caves",
    state: "Maharashtra",
    era: "2nd Century BCE – 5th Century CE",
    tagline: "Where Stone Speaks in Colour",
    description:
      "Carved into a horseshoe-shaped cliff above the Waghora river, the 30 Ajanta Caves preserve India's most breathtaking ancient Buddhist murals — masterpieces of narrative art that have survived over 2,000 years.",
    facts: [
      "30 rock-cut caves",
      "Finest Asian murals",
      "UNESCO 1983",
      "Buddhist heritage",
    ],
    image:
      "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=1400&q=90",
    color: "#E07B54",
    accent: "#8B5E3C",
    num: "03",
  },
  {
    id: "jaipur",
    name: "Amber Fort",
    state: "Rajasthan",
    era: "16th Century CE · 1592 AD",
    tagline: "The Golden Fortress of the Rajputs",
    description:
      "Perched dramatically on a rugged hilltop overlooking Maota Lake, Amber Fort is a masterpiece of Rajput military architecture. Its blend of Hindu and Mughal styles created one of India's most photographed monuments.",
    facts: [
      "Built in 1592",
      "Sheesh Mahal mirror palace",
      "UNESCO 2013",
      "Rajput architecture",
    ],
    image:
      "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1400&q=90",
    color: "#D4A84C",
    accent: "#8B6914",
    num: "04",
  },
];

export default function DiscoveryTour({
  onClose,
  onViewAR,
  onShowAuth,
}) {
  const { user } = useAuth();

  const [current, setCurrent] = useState(0);
  const [animDir, setAnimDir] = useState("next");
  const [transitioning, setTransitioning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inDepthSite, setInDepthSite] = useState(null);
  const [showReservation, setShowReservation] = useState(false);

  const DURATION = 6000;

  const goTo = useCallback(
    (index, dir = "next") => {
      if (transitioning) return;

      setAnimDir(dir);
      setTransitioning(true);
      setProgress(0);

      setTimeout(() => {
        setCurrent(index);
        setTransitioning(false);
      }, 600);
    },
    [transitioning]
  );

  const next = useCallback(() => {
    goTo((current + 1) % SITES.length, "next");
  }, [current, goTo]);

  const prev = useCallback(() => {
    goTo(
      (current - 1 + SITES.length) % SITES.length,
      "prev"
    );
  }, [current, goTo]);

  useEffect(() => {
    if (paused || inDepthSite || showReservation) return;

    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          next();
          return 0;
        }

        return p + 100 / (DURATION / 100);
      });
    }, 100);

    return () => clearInterval(interval);
  }, [
    paused,
    next,
    inDepthSite,
    showReservation,
  ]);

  useEffect(() => {
    const handler = (e) => {
      if (showReservation) return;

      if (inDepthSite) {
        if (e.key === "Escape") {
          setInDepthSite(null);
        }

        return;
      }

      if (e.key === "ArrowRight") {
        next();
      }

      if (e.key === "ArrowLeft") {
        prev();
      }

      if (e.key === "Escape") {
        onClose();
      }

      if (e.key === " ") {
        e.preventDefault();
        setPaused((p) => !p);
      }
    };

    window.addEventListener("keydown", handler);

    return () => {
      window.removeEventListener(
        "keydown",
        handler
      );
    };
  }, [
    next,
    prev,
    onClose,
    inDepthSite,
    showReservation,
  ]);

  const site = SITES[current];

  const handleReserve = () => {
    if (!user) {
      onShowAuth?.();
      return;
    }

    setShowReservation(true);
  };

  if (inDepthSite) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 10050,
          overflowY: "auto",
          background: "#0D1B2A",
        }}
      >
        <button
          onClick={() => setInDepthSite(null)}
          style={{
            position: "fixed",
            top: "1.5rem",
            right: "1.5rem",
            zIndex: 10060,
            width: 40,
            height: 40,
            borderRadius: "50%",
            background:
              "rgba(255,255,255,0.08)",
            border:
              "1px solid rgba(255,255,255,0.15)",
            color: "#F2E8D0",
            fontSize: "1rem",
            cursor: "pointer",
          }}
          title="Back to tour"
        >
          ✕
        </button>

        <ScrollStorySection
          site={inDepthSite}
          onViewAR={onViewAR}
        />
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;500&display=swap');

        .dt-overlay {
          position: fixed;
          inset: 0;
          z-index: 10000;
          background: #050A0F;
          font-family: 'DM Sans', sans-serif;
          overflow: hidden;
        }

        .dt-bg {
          position: absolute;
          inset: 0;
        }

        .dt-bg img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: brightness(0.35) saturate(0.8);
        }

        .dt-bg-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            105deg,
            rgba(5,10,15,0.95) 0%,
            rgba(5,10,15,0.72) 50%,
            rgba(5,10,15,0.35) 100%
          );
        }

        .dt-right-panel {
          position: absolute;
          top: 0;
          right: 0;
          width: 32%;
          height: 100%;
          z-index: 2;
          opacity: 0.9;
        }

        .dt-right-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .dt-right-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            #050A0F,
            transparent 40%
          );
        }

        .dt-num {
          position: absolute;
          right: 5vw;
          bottom: 8vh;
          z-index: 3;
          font-family: 'Playfair Display', serif;
          font-size: clamp(7rem, 15vw, 15rem);
          font-weight: 900;
          color: var(--site-color);
          opacity: 0.1;
          line-height: 1;
        }

        .dt-topbar {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          z-index: 30;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.4rem 3vw;
        }

        .dt-logo {
          color: #F2E8D0;
          font-family: 'Space Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.08em;
        }

        .dt-topbar-right {
          display: flex;
          align-items: center;
          gap: 0.7rem;
        }

        .dt-topbar-reserve-btn {
          border: 1px solid rgba(201,168,76,0.45);
          background: rgba(201,168,76,0.1);
          color: #F2E8D0;
          border-radius: 999px;
          padding: 0.55rem 1rem;
          cursor: pointer;
          font-size: 0.68rem;
          font-family: 'Space Mono', monospace;
        }

        .dt-pause-btn,
        .dt-close-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.15);
          background: rgba(0,0,0,0.25);
          color: #F2E8D0;
          cursor: pointer;
        }

        .dt-announce-bar {
          position: absolute;
          top: 72px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 25;
          display: flex;
          align-items: center;
          background: rgba(4,8,15,0.75);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(201,168,76,0.25);
          border-radius: 50px;
          padding: 0.55rem 1.3rem;
          max-width: 92vw;
        }

        .dt-announce-text {
          font-size: 0.72rem;
          color: rgba(245,239,224,0.75);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .dt-announce-icon {
          margin-right: 4px;
        }

        .dt-content {
          position: absolute;
          inset: 0;
          z-index: 10;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 0 8vw;
          max-width: 900px;
          transition:
            opacity 0.5s ease,
            transform 0.5s ease;
        }

        .dt-content.exit-next {
          opacity: 0;
          transform: translateX(-60px);
        }

        .dt-content.exit-prev {
          opacity: 0;
          transform: translateX(60px);
        }

        .dt-content.enter {
          opacity: 1;
          transform: translateX(0);
        }

        .dt-state-row {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          margin-bottom: 1rem;
        }

        .dt-state-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #C9A84C;
          box-shadow: 0 0 14px #C9A84C;
        }

        .dt-state-text {
          color: rgba(245,239,224,0.65);
          font-family: 'Space Mono', monospace;
          font-size: 0.65rem;
        }

        .dt-eyebrow {
          color: var(--site-color);
          font-family: 'Space Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.1em;
          margin-bottom: 0.8rem;
        }

        .dt-title {
          margin: 0;
          color: #F8F2E6;
          font-family: 'Playfair Display', serif;
          font-size: clamp(3rem, 7vw, 6.5rem);
          line-height: 0.95;
          max-width: 800px;
        }

        .dt-tagline {
          margin-top: 1rem;
          color: rgba(245,239,224,0.85);
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-size: clamp(1rem, 2vw, 1.4rem);
        }

        .dt-divider {
          width: 80px;
          height: 2px;
          margin: 1.5rem 0;
          background: var(--site-color);
        }

        .dt-description {
          margin: 0;
          max-width: 650px;
          color: rgba(245,239,224,0.7);
          line-height: 1.8;
          font-size: 0.95rem;
        }

        .dt-facts {
          display: flex;
          flex-wrap: wrap;
          gap: 0.6rem;
          margin-top: 1.5rem;
        }

        .dt-fact {
          padding: 0.5rem 0.8rem;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 999px;
          background: rgba(255,255,255,0.04);
          color: rgba(245,239,224,0.8);
          font-size: 0.72rem;
        }

        .dt-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.8rem;
          margin-top: 2rem;
        }

        .dt-btn-primary,
        .dt-btn-secondary {
          padding: 0.85rem 1.2rem;
          border-radius: 10px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-weight: 600;
        }

        .dt-btn-primary {
          border: none;
          background: #C9A84C;
          color: #07111E;
        }

        .dt-btn-secondary {
          border: 1px solid rgba(255,255,255,0.15);
          background: rgba(0,0,0,0.2);
          color: #F2E8D0;
        }

        .dt-bottom {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 20;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding: 1.5rem 3vw;
        }

        .dt-progress-bars {
          flex: 1;
          display: flex;
          gap: 0.4rem;
        }

        .dt-progress-bar {
          flex: 1;
          height: 3px;
          background: rgba(255,255,255,0.15);
          cursor: pointer;
          overflow: hidden;
        }

        .dt-progress-fill {
          height: 100%;
          background: #C9A84C;
          transition: width 0.1s linear;
        }

        .dt-counter {
          color: rgba(245,239,224,0.7);
          font-family: 'Space Mono', monospace;
          font-size: 0.7rem;
        }

        .dt-counter span {
          color: #C9A84C;
        }

        .dt-nav-arrows {
          display: flex;
          gap: 0.5rem;
        }

        .dt-arrow {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.15);
          background: rgba(0,0,0,0.25);
          color: white;
          cursor: pointer;
        }

        @media (max-width: 768px) {
          .dt-content {
            padding: 0 6vw;
            justify-content: flex-end;
            padding-bottom: 140px;
          }

          .dt-right-panel {
            display: none;
          }

          .dt-num {
            font-size: 5rem;
            right: 4vw;
            opacity: 0.4;
          }

          .dt-title {
            font-size: 2.4rem;
          }

          .dt-description {
            font-size: 0.85rem;
          }

          .dt-actions {
            flex-direction: column;
          }

          .dt-btn-primary,
          .dt-btn-secondary {
            justify-content: center;
          }

          .dt-topbar-reserve-btn {
            padding: 0.4rem 0.8rem;
            font-size: 0.5rem;
          }

          .dt-announce-bar {
            top: 62px;
            padding: 0.4rem 0.9rem;
          }

          .dt-announce-text {
            font-size: 0.62rem;
          }

          .dt-bottom {
            padding: 1rem;
          }
        }
      `}</style>

      <div className="dt-overlay">
        <div className="dt-bg">
          <img
            key={site.id + "-bg"}
            src={site.image}
            alt={site.name}
          />

          <div className="dt-bg-gradient" />
        </div>

        <div className="dt-right-panel">
          <img
            key={site.id + "-right"}
            src={site.image}
            alt={site.name}
            className="dt-right-img"
          />

          <div className="dt-right-overlay" />
        </div>

        <div
          className="dt-num"
          style={{
            "--site-color": site.color,
          }}
        >
          {site.num}
        </div>

        <div className="dt-topbar">
          <div className="dt-logo">
            Bharatiya Dharohar · Heritage Tour
          </div>

          <div className="dt-topbar-right">
            <button
              className="dt-topbar-reserve-btn"
              onClick={handleReserve}
            >
              {user
                ? "🎟 Reserve Seat"
                : "🔒 Sign in to Reserve"}
            </button>

            <button
              className="dt-pause-btn"
              onClick={() =>
                setPaused((p) => !p)
              }
              title={paused ? "Play" : "Pause"}
            >
              {paused ? "▶" : "⏸"}
            </button>

            <button
              className="dt-close-btn"
              onClick={onClose}
            >
              ✕
            </button>
          </div>
        </div>

        <div className="dt-announce-bar">
          <div className="dt-announce-text">
            <span className="dt-announce-icon">
              📢
            </span>

            Heritage Fest 2026 · 28 Nov · Red Fort — limited seats
          </div>
        </div>

        <div
          className={`dt-content ${
            transitioning
              ? `exit-${animDir}`
              : "enter"
          }`}
          style={{
            "--site-color": site.color,
          }}
        >
          <div className="dt-state-row">
            <div className="dt-state-dot" />

            <div className="dt-state-text">
              Live · Heritage Discovery
            </div>
          </div>

          <div className="dt-eyebrow">
            {site.state} · {site.era}
          </div>

          <h1 className="dt-title">
            {site.name}
          </h1>

          <div className="dt-tagline">
            {site.tagline}
          </div>

          <div className="dt-divider" />

          <p className="dt-description">
            {site.description}
          </p>

          <div className="dt-facts">
            {site.facts.map((fact, index) => (
              <span
                key={index}
                className="dt-fact"
              >
                ✦ {fact}
              </span>
            ))}
          </div>

          <div className="dt-actions">
            <button
              className="dt-btn-primary"
              onClick={() =>
                onViewAR?.(site)
              }
            >
              📱 View in AR
            </button>

            <button
              className="dt-btn-secondary"
              onClick={() =>
                setInDepthSite(site)
              }
            >
              ↓ Explore in Depth
            </button>

            <button
              className="dt-btn-secondary"
              onClick={next}
            >
              Next Site →
            </button>
          </div>
        </div>

        <div className="dt-bottom">
          <div className="dt-progress-bars">
            {SITES.map((item, index) => (
              <div
                key={item.id}
                className="dt-progress-bar"
                onClick={() =>
                  goTo(
                    index,
                    index > current
                      ? "next"
                      : "prev"
                  )
                }
                title={item.name}
              >
                <div
                  className="dt-progress-fill"
                  style={{
                    width:
                      index === current
                        ? `${progress}%`
                        : index < current
                        ? "100%"
                        : "0%",
                  }}
                />
              </div>
            ))}
          </div>

          <div className="dt-counter">
            <span>
              {String(current + 1).padStart(
                2,
                "0"
              )}
            </span>{" "}
            /{" "}
            {String(SITES.length).padStart(
              2,
              "0"
            )}
          </div>

          <div className="dt-nav-arrows">
            <button
              className="dt-arrow"
              onClick={prev}
            >
              ←
            </button>

            <button
              className="dt-arrow"
              onClick={next}
            >
              →
            </button>
          </div>
        </div>
      </div>

      {showReservation && (
        <ReservationModal
          site={site}
          user={user}
          onClose={() =>
            setShowReservation(false)
          }
          onReserved={(reservation) => {
            setShowReservation(false);

            alert(
              `Reservation confirmed! Your booking code is ${reservation.reservationCode}`
            );
          }}
        />
      )}
    </>
  );
}