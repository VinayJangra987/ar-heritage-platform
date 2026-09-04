// import { useNavigate } from "react-router-dom";

// export default function LandingPage() {
//   const navigate = useNavigate();

//   const features = [
//     {
//       icon: "🏛️",
//       title: "Explore Heritage Sites",
//       desc: "Discover UNESCO World Heritage monuments and hidden gems across India, each with rich history and context.",
//     },
//     {
//       icon: "📱",
//       title: "Live AR View",
//       desc: "Point your camera at a monument and see augmented reality overlays with historical facts and 3D models.",
//     },
//     {
//       icon: "🗺️",
//       title: "Interactive Maps",
//       desc: "Find nearby heritage sites with Leaflet-powered maps — plan your visit with real distances and directions.",
//     },
//     {
//       icon: "⭐",
//       title: "Reviews & Ratings",
//       desc: "Read genuine visitor reviews with photos, or share your own experience after a visit.",
//     },
//     {
//       icon: "❤️",
//       title: "Save Favorites",
//       desc: "Bookmark the sites you want to visit and build your own heritage travel wishlist.",
//     },
//     {
//       icon: "🔊",
//       title: "Audio Narration",
//       desc: "Listen to site descriptions narrated aloud — perfect for hands-free exploring.",
//     },
//   ];

//   return (
//     <>
//       <style>{`
//         .lp-wrap {
//           background: #0D1B2A;
//           min-height: 100vh;
//           color: #F2E8D0;
//           overflow-x: hidden;
//         }

//         .lp-nav {
//           display: flex; align-items: center; justify-content: space-between;
//           padding: 1.5rem 3rem;
//           position: sticky; top: 0; z-index: 100;
//           background: rgba(13,27,42,0.85);
//           backdrop-filter: blur(10px);
//           border-bottom: 1px solid rgba(201,168,76,0.15);
//         }
//         .lp-logo {
//           font-family: 'Cormorant Garamond', serif;
//           font-size: 1.5rem; font-weight: 700; color: #C9A84C;
//           letter-spacing: 0.02em;
//         }
//         .lp-nav-btns { display: flex; gap: 0.75rem; }
//         .lp-btn-ghost {
//           padding: 0.6rem 1.4rem; border-radius: 30px;
//           border: 1px solid rgba(201,168,76,0.4);
//           background: transparent; color: #C9A84C;
//           font-family: 'Space Mono', monospace; font-size: 0.7rem;
//           letter-spacing: 0.08em; text-transform: uppercase;
//           cursor: pointer; transition: all 0.25s;
//         }
//         .lp-btn-ghost:hover { background: rgba(201,168,76,0.1); border-color: #C9A84C; }
//         .lp-btn-solid {
//           padding: 0.6rem 1.4rem; border-radius: 30px;
//           border: none;
//           background: linear-gradient(135deg, #C9A84C, #E8C96A);
//           color: #0D1B2A; font-weight: 700;
//           font-family: 'Space Mono', monospace; font-size: 0.7rem;
//           letter-spacing: 0.08em; text-transform: uppercase;
//           cursor: pointer; transition: all 0.25s;
//         }
//         .lp-btn-solid:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(201,168,76,0.35); }

//         .lp-hero {
//           position: relative;
//           padding: 6rem 3rem 5rem;
//           text-align: center;
//           background:
//             radial-gradient(circle at 20% 20%, rgba(201,168,76,0.08), transparent 40%),
//             radial-gradient(circle at 80% 60%, rgba(201,168,76,0.06), transparent 40%);
//         }
//         .lp-eyebrow {
//           font-family: 'Space Mono', monospace; font-size: 0.65rem;
//           color: #C9A84C; letter-spacing: 0.25em; text-transform: uppercase;
//           margin-bottom: 1.2rem;
//         }
//         .lp-title {
//           font-family: 'Cormorant Garamond', serif;
//           font-size: clamp(2.4rem, 6vw, 4.2rem);
//           font-weight: 700; line-height: 1.1;
//           margin-bottom: 1.2rem;
//         }
//         .lp-title span { color: #C9A84C; }
//         .lp-subtitle {
//           font-family: 'Poppins', sans-serif; font-size: 1rem;
//           color: rgba(242,232,208,0.65); max-width: 620px;
//           margin: 0 auto 2.5rem; line-height: 1.75;
//         }
//         .lp-hero-cta { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; margin-bottom: 3rem; }
//         .lp-btn-large {
//           padding: 0.9rem 2.2rem; border-radius: 40px;
//           font-family: 'Space Mono', monospace; font-size: 0.75rem;
//           letter-spacing: 0.1em; text-transform: uppercase;
//           cursor: pointer; transition: all 0.25s;
//         }
//         .lp-btn-large.solid {
//           border: none; background: linear-gradient(135deg, #C9A84C, #E8C96A);
//           color: #0D1B2A; font-weight: 700;
//         }
//         .lp-btn-large.solid:hover { transform: translateY(-3px); box-shadow: 0 10px 30px rgba(201,168,76,0.4); }
//         .lp-btn-large.ghost {
//           border: 1px solid rgba(201,168,76,0.4); background: transparent; color: #C9A84C;
//         }
//         .lp-btn-large.ghost:hover { background: rgba(201,168,76,0.08); }

//         .lp-hero-stats { display: flex; gap: 3rem; justify-content: center; flex-wrap: wrap; }
//         .lp-stat { text-align: center; }
//         .lp-stat-num { font-family: 'Cormorant Garamond', serif; font-size: 2.2rem; font-weight: 700; color: #C9A84C; }
//         .lp-stat-label { font-family: 'Space Mono', monospace; font-size: 0.58rem; color: rgba(242,232,208,0.45); letter-spacing: 0.14em; text-transform: uppercase; }

//         .lp-section { padding: 4rem 3rem; }
//         .lp-section-head { text-align: center; margin-bottom: 3rem; }
//         .lp-section-eyebrow {
//           font-family: 'Space Mono', monospace; font-size: 0.6rem;
//           color: #C9A84C; letter-spacing: 0.2em; text-transform: uppercase;
//           margin-bottom: 0.6rem;
//         }
//         .lp-section-title {
//           font-family: 'Cormorant Garamond', serif;
//           font-size: 2rem; font-weight: 700; color: #F2E8D0;
//         }

//         .lp-feature-grid {
//           display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem;
//           max-width: 1100px; margin: 0 auto;
//         }
//         .lp-feature-card {
//           background: rgba(255,255,255,0.03);
//           border: 1px solid rgba(201,168,76,0.12);
//           border-radius: 16px; padding: 1.75rem;
//           transition: all 0.3s;
//         }
//         .lp-feature-card:hover {
//           border-color: rgba(201,168,76,0.4);
//           transform: translateY(-4px);
//           background: rgba(201,168,76,0.04);
//         }
//         .lp-feature-icon { font-size: 2rem; margin-bottom: 0.9rem; }
//         .lp-feature-title {
//           font-family: 'Cormorant Garamond', serif; font-size: 1.15rem;
//           font-weight: 600; color: #C9A84C; margin-bottom: 0.5rem;
//         }
//         .lp-feature-desc {
//           font-family: 'Poppins', sans-serif; font-size: 0.82rem;
//           color: rgba(242,232,208,0.6); line-height: 1.65;
//         }

//         .lp-cta-band {
//           text-align: center; padding: 4rem 3rem;
//           background: rgba(201,168,76,0.05);
//           border-top: 1px solid rgba(201,168,76,0.12);
//           border-bottom: 1px solid rgba(201,168,76,0.12);
//         }
//         .lp-cta-title {
//           font-family: 'Cormorant Garamond', serif; font-size: 1.8rem;
//           font-weight: 700; color: #F2E8D0; margin-bottom: 0.6rem;
//         }
//         .lp-cta-sub {
//           font-family: 'Poppins', sans-serif; font-size: 0.85rem;
//           color: rgba(242,232,208,0.55); margin-bottom: 1.75rem;
//         }

//         .lp-footer {
//           text-align: center; padding: 2rem;
//           font-family: 'Space Mono', monospace; font-size: 0.6rem;
//           color: rgba(242,232,208,0.3); letter-spacing: 0.1em;
//         }

//         @media (max-width: 768px) {
//           .lp-nav { padding: 1.2rem 1.5rem; }
//           .lp-hero { padding: 4rem 1.5rem 3rem; }
//           .lp-section { padding: 3rem 1.5rem; }
//           .lp-feature-grid { grid-template-columns: 1fr; }
//           .lp-hero-stats { gap: 1.75rem; }
//         }
//       `}</style>

//       <div className="lp-wrap">
//         {/* ── Nav ── */}
//         {/* <nav className="lp-nav">
//           <div className="lp-logo">Bharatiya Dharohar</div>
//           <div className="lp-nav-btns">
//             <button className="lp-btn-ghost" onClick={() => navigate("/login")}>Log In</button>
//             <button className="lp-btn-solid" onClick={() => navigate("/signup")}>Sign Up</button>
//           </div>
//         </nav> */}

//         {/* ── Hero ── */}
//         <section className="lp-hero">
//           <div className="lp-eyebrow">India's Living Heritage, Reimagined</div>
//           <h1 className="lp-title">
//             Explore India's <span>Heritage</span><br />Like Never Before
//           </h1>
//           <p className="lp-subtitle">
//             Discover monuments, walk through history with augmented reality, find hidden gems near you,
//             and share your journey — all in one platform built for explorers of India's rich past.
//           </p>
//           <div className="lp-hero-cta">
//             <button className="lp-btn-large solid" onClick={() => navigate("/signup")}>Get Started Free</button>
//             <button className="lp-btn-large ghost" onClick={() => navigate("/explore")}>Preview the App</button>
//           </div>
//           <div className="lp-hero-stats">
//             <div className="lp-stat">
//               <div className="lp-stat-num">100+</div>
//               <div className="lp-stat-label">Heritage Sites</div>
//             </div>
//             <div className="lp-stat">
//               <div className="lp-stat-num">AR</div>
//               <div className="lp-stat-label">Live Camera View</div>
//             </div>
//             <div className="lp-stat">
//               <div className="lp-stat-num">28</div>
//               <div className="lp-stat-label">States Covered</div>
//             </div>
//           </div>
//         </section>

//         {/* ── Features ── */}
//         <section className="lp-section">
//           <div className="lp-section-head">
//             <div className="lp-section-eyebrow">What You Get</div>
//             <div className="lp-section-title">Everything You Need to Explore</div>
//           </div>
//           <div className="lp-feature-grid">
//             {features.map((f, i) => (
//               <div key={i} className="lp-feature-card">
//                 <div className="lp-feature-icon">{f.icon}</div>
//                 <div className="lp-feature-title">{f.title}</div>
//                 <div className="lp-feature-desc">{f.desc}</div>
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* ── CTA Band ── */}
//         <section className="lp-cta-band">
//           <div className="lp-cta-title">Ready to Begin Your Journey?</div>
//           <p className="lp-cta-sub">Create a free account and start exploring India's heritage today.</p>
//           <button className="lp-btn-large solid" onClick={() => navigate("/signup")}>Create Free Account</button>
//         </section>

//         {/* ── Footer ── */}
//         <footer className="lp-footer">
//           © {new Date().getFullYear()} BHARATIYA DHAROHAR — PRESERVING HISTORY, ONE SITE AT A TIME
//         </footer>
//       </div>
//     </>
//   );
// }



export default function LandingPage({ onLogin, onSignup, onExplore }) {
const features = [
{
icon: "🏛️",
title: "Explore Heritage Sites",
desc: "Discover UNESCO World Heritage monuments and hidden gems across India, each with rich history and context.",
},
{
icon: "📱",
title: "Live AR View",
desc: "Point your camera at a monument and see augmented reality overlays with historical facts and 3D models.",
},
{
icon: "🗺️",
title: "Interactive Maps",
desc: "Find nearby heritage sites with Leaflet-powered maps — plan your visit with real distances and directions.",
},
{
icon: "⭐",
title: "Reviews & Ratings",
desc: "Read genuine visitor reviews with photos, or share your own experience after a visit.",
},
{
icon: "❤️",
title: "Save Favorites",
desc: "Bookmark the sites you want to visit and build your own heritage travel wishlist.",
},
{
icon: "🔊",
title: "Audio Narration",
desc: "Listen to site descriptions narrated aloud — perfect for hands-free exploring.",
},
];

return (
<> <style>{`
.lp-wrap {
background: #0D1B2A;
min-height: 100vh;
color: #F2E8D0;
overflow-x: hidden;
}
    .lp-nav {
      display: flex; align-items: center; justify-content: space-between;
      padding: 1.5rem 3rem;
      position: sticky; top: 0; z-index: 100;
      background: rgba(13,27,42,0.85);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid rgba(201,168,76,0.15);
    }

    .lp-logo {
      font-family: 'Cormorant Garamond', serif;
      font-size: 1.5rem; font-weight: 700; color: #C9A84C;
      letter-spacing: 0.02em;
    }

    .lp-nav-btns {
      display: flex;
      gap: 0.75rem;
    }

    .lp-btn-ghost {
      padding: 0.6rem 1.4rem; border-radius: 30px;
      border: 1px solid rgba(201,168,76,0.4);
      background: transparent; color: #C9A84C;
      font-family: 'Space Mono', monospace; font-size: 0.7rem;
      letter-spacing: 0.08em; text-transform: uppercase;
      cursor: pointer; transition: all 0.25s;
    }

    .lp-btn-ghost:hover {
      background: rgba(201,168,76,0.1);
      border-color: #C9A84C;
    }

    .lp-btn-solid {
      padding: 0.6rem 1.4rem; border-radius: 30px;
      border: none;
      background: linear-gradient(135deg, #C9A84C, #E8C96A);
      color: #0D1B2A; font-weight: 700;
      font-family: 'Space Mono', monospace; font-size: 0.7rem;
      letter-spacing: 0.08em; text-transform: uppercase;
      cursor: pointer; transition: all 0.25s;
    }

    .lp-btn-solid:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(201,168,76,0.35);
    }

    .lp-hero {
      position: relative;
      padding: 6rem 3rem 5rem;
      text-align: center;
      background:
        radial-gradient(circle at 20% 20%, rgba(201,168,76,0.08), transparent 40%),
        radial-gradient(circle at 80% 60%, rgba(201,168,76,0.06), transparent 40%);
    }

    .lp-eyebrow {
      font-family: 'Space Mono', monospace; font-size: 0.65rem;
      color: #C9A84C; letter-spacing: 0.25em; text-transform: uppercase;
      margin-bottom: 1.2rem;
    }

    .lp-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: clamp(2.4rem, 6vw, 4.2rem);
      font-weight: 700; line-height: 1.1;
      margin-bottom: 1.2rem;
    }

    .lp-title span {
      color: #C9A84C;
    }

    .lp-subtitle {
      font-family: 'Poppins', sans-serif; font-size: 1rem;
      color: rgba(242,232,208,0.65); max-width: 620px;
      margin: 0 auto 2.5rem; line-height: 1.75;
    }

    .lp-hero-cta {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
      margin-bottom: 3rem;
    }

    .lp-btn-large {
      padding: 0.9rem 2.2rem;
      border-radius: 40px;
      font-family: 'Space Mono', monospace;
      font-size: 0.75rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      cursor: pointer;
      transition: all 0.25s;
    }

    .lp-btn-large.solid {
      border: none;
      background: linear-gradient(135deg, #C9A84C, #E8C96A);
      color: #0D1B2A;
      font-weight: 700;
    }

    .lp-btn-large.solid:hover {
      transform: translateY(-3px);
      box-shadow: 0 10px 30px rgba(201,168,76,0.4);
    }

    .lp-btn-large.ghost {
      border: 1px solid rgba(201,168,76,0.4);
      background: transparent;
      color: #C9A84C;
    }

    .lp-btn-large.ghost:hover {
      background: rgba(201,168,76,0.08);
    }

    .lp-hero-stats {
      display: flex;
      gap: 3rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    .lp-stat {
      text-align: center;
    }

    .lp-stat-num {
      font-family: 'Cormorant Garamond', serif;
      font-size: 2.2rem;
      font-weight: 700;
      color: #C9A84C;
    }

    .lp-stat-label {
      font-family: 'Space Mono', monospace;
      font-size: 0.58rem;
      color: rgba(242,232,208,0.45);
      letter-spacing: 0.14em;
      text-transform: uppercase;
    }

    .lp-section {
      padding: 4rem 3rem;
    }

    .lp-section-head {
      text-align: center;
      margin-bottom: 2.5rem;
    }

    .lp-section-eyebrow {
      font-family: 'Space Mono', monospace;
      font-size: 0.6rem;
      letter-spacing: 0.2em;
      color: #C9A84C;
      text-transform: uppercase;
      margin-bottom: 0.6rem;
    }

    .lp-section-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: 2rem;
      font-weight: 700;
      color: #F2E8D0;
    }

    .lp-feature-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.2rem;
      max-width: 1100px;
      margin: 0 auto;
    }

    .lp-feature-card {
      padding: 1.5rem;
      border: 1px solid rgba(201,168,76,0.15);
      border-radius: 12px;
      background: rgba(255,255,255,0.025);
      transition: all 0.25s;
    }

    .lp-feature-card:hover {
      transform: translateY(-4px);
      border-color: rgba(201,168,76,0.4);
      background: rgba(201,168,76,0.04);
    }

    .lp-feature-icon {
      font-size: 1.8rem;
      margin-bottom: 0.8rem;
    }

    .lp-feature-title {
      font-family: 'Poppins', sans-serif;
      font-size: 0.9rem;
      font-weight: 600;
      color: #F2E8D0;
      margin-bottom: 0.5rem;
    }

    .lp-feature-desc {
      font-family: 'Poppins', sans-serif;
      font-size: 0.82rem;
      color: rgba(242,232,208,0.6);
      line-height: 1.65;
    }

    .lp-cta-band {
      text-align: center;
      padding: 4rem 3rem;
      background: rgba(201,168,76,0.05);
      border-top: 1px solid rgba(201,168,76,0.12);
      border-bottom: 1px solid rgba(201,168,76,0.12);
    }

    .lp-cta-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: 1.8rem;
      font-weight: 700;
      color: #F2E8D0;
      margin-bottom: 0.6rem;
    }

    .lp-cta-sub {
      font-family: 'Poppins', sans-serif;
      font-size: 0.85rem;
      color: rgba(242,232,208,0.55);
      margin-bottom: 1.75rem;
    }

    .lp-footer {
      text-align: center;
      padding: 2rem;
      font-family: 'Space Mono', monospace;
      font-size: 0.6rem;
      color: rgba(242,232,208,0.3);
      letter-spacing: 0.1em;
    }

    @media (max-width: 768px) {
      .lp-nav {
        padding: 1.2rem 1.5rem;
      }

      .lp-hero {
        padding: 4rem 1.5rem 3rem;
      }

      .lp-section {
        padding: 3rem 1.5rem;
      }

      .lp-feature-grid {
        grid-template-columns: 1fr;
      }

      .lp-hero-stats {
        gap: 1.75rem;
      }
    }
  `}</style>

  <div className="lp-wrap">
    {/* <nav className="lp-nav">
      <div className="lp-logo">Bharatiya Dharohar</div>

      <div className="lp-nav-btns">
        <button className="lp-btn-ghost" onClick={onLogin}>
          Log In
        </button>

        <button className="lp-btn-solid" onClick={onSignup}>
          Sign Up
        </button>
      </div>
    </nav> */}

    <section className="lp-hero">
      <div className="lp-eyebrow">
        India's Living Heritage, Reimagined
      </div>

      <h1 className="lp-title">
        Explore India's <span>Heritage</span>
        <br />
        Like Never Before
      </h1>

      <p className="lp-subtitle">
        Discover monuments, walk through history with augmented reality,
        find hidden gems near you, and share your journey — all in one
        platform built for explorers of India's rich past.
      </p>

      <div className="lp-hero-cta">
        <button className="lp-btn-large solid" onClick={onSignup}>
          Get Started Free
        </button>

        <button className="lp-btn-large ghost" onClick={onExplore}>
          Preview the App
        </button>
      </div>

      <div className="lp-hero-stats">
        <div className="lp-stat">
          <div className="lp-stat-num">100+</div>
          <div className="lp-stat-label">Heritage Sites</div>
        </div>

        <div className="lp-stat">
          <div className="lp-stat-num">AR</div>
          <div className="lp-stat-label">Live Camera View</div>
        </div>

        <div className="lp-stat">
          <div className="lp-stat-num">28</div>
          <div className="lp-stat-label">States Covered</div>
        </div>
      </div>
    </section>

    <section className="lp-section">
      <div className="lp-section-head">
        <div className="lp-section-eyebrow">What You Get</div>

        <div className="lp-section-title">
          Everything You Need to Explore
        </div>
      </div>

      <div className="lp-feature-grid">
        {features.map((f, i) => (
          <div key={i} className="lp-feature-card">
            <div className="lp-feature-icon">{f.icon}</div>

            <div className="lp-feature-title">{f.title}</div>

            <div className="lp-feature-desc">{f.desc}</div>
          </div>
        ))}
      </div>
    </section>

    <section className="lp-cta-band">
      <div className="lp-cta-title">
        Ready to Begin Your Journey?
      </div>

      <p className="lp-cta-sub">
        Create a free account and start exploring India's heritage today.
      </p>

      <button className="lp-btn-large solid" onClick={onSignup}>
        Create Free Account
      </button>
    </section>

    <footer className="lp-footer">
      © {new Date().getFullYear()} BHARATIYA DHAROHAR — PRESERVING HISTORY,
      ONE SITE AT A TIME
    </footer>
  </div>
</>

);
}
