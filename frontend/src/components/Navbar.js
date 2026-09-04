// import { useState, useEffect } from 'react';
// import { useAuth } from '../context/AuthContext';
// import './Navbar.css';
// import AdminPanel from "./AdminPanel";

// const Navbar = ({ onSearchOpen, onMapClick, onARClick, onFavClick, extraRight, onAuthChoiceClick }) => {
//   const { user } = useAuth();
//   const [scrolled,   setScrolled]   = useState(false);
//   const [menuOpen,   setMenuOpen]   = useState(false);
//   const [showAdmin,  setShowAdmin]  = useState(false);

//   useEffect(() => {
//     const handleScroll = () => setScrolled(window.scrollY > 50);
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   const favCount = user?.favorites?.length || 0;
//   const isAdmin = user?.role === 'admin';

//   return (
//     <>
//       <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
//         <div className="navbar-inner">

//           {/* Brand */}
//           <div className="navbar-brand">
//             <span className="navbar-logo">🏛️</span>
//             <div>
//               <div className="navbar-title">Bharatiya Dharohar</div>
//               <div className="navbar-subtitle">AR Heritage Platform</div>
//             </div>
//           </div>

//           {/* Desktop links */}
//           <div className="navbar-links">
//             <button
//               className="nav-link"
//               onClick={() => document.getElementById('discovery')?.scrollIntoView({ behavior: 'smooth' })}
//             >
//               Explore
//             </button>

//             <button className="nav-link" onClick={onMapClick}>Map</button>

//             <button className="nav-link nav-fav-link" onClick={onFavClick}>
//               <span className="nav-fav-icon">♥</span>
//               Favourites
//               {favCount > 0 && <span className="nav-fav-badge">{favCount}</span>}
//             </button>

//             <button className="nav-link ar-badge" onClick={onARClick}>
//               <span>📱</span> AR View
//             </button>
//           </div>

//           {/* Right side */}
//           <div className="navbar-right" style={{ gap: '0.4rem' }}>
//             <button className="navbar-search-btn" onClick={onSearchOpen} aria-label="Search">🔍</button>

//             {/* Mobile fav icon */}
//             <button
//               className="navbar-fav-btn"
//               onClick={onFavClick}
//               aria-label="Favourites"
//               style={{ position: 'relative' }}
//             >
//               ♥
//               {favCount > 0 && (
//                 <span style={{
//                   position: 'absolute', top: '-4px', right: '-4px',
//                   background: '#C9A84C', color: '#0D1B2A',
//                   fontSize: '0.45rem', fontWeight: 700,
//                   width: '16px', height: '16px',
//                   borderRadius: '50%', display: 'flex',
//                   alignItems: 'center', justifyContent: 'center',
//                   fontFamily: "'Space Mono', monospace",
//                 }}>
//                   {favCount}
//                 </span>
//               )}
//             </button>

//             {/* ✅ Logged-in: UserMenu dikhega. Logged-out: sirf "Sign In" button — duplicate nahi */}
//             {user ? (
//               extraRight && <div className="navbar-auth-slot">{extraRight}</div>
//             ) : (
//               onAuthChoiceClick && (
//                 <button
//                   onClick={onAuthChoiceClick}
//                   style={{
//                     padding: '6px 10px',
//                     background: 'rgba(212,175,55,0.1)',
//                     border: '1px solid rgba(212,175,55,0.3)',
//                     borderRadius: '8px',
//                     color: '#d4af37',
//                     fontSize: '0.68rem',
//                     fontWeight: 600,
//                     cursor: 'pointer',
//                     whiteSpace: 'nowrap',
//                     fontFamily: "'Space Mono', monospace",
//                   }}
//                 >
//                   🔑 Sign In
//                 </button>
//               )
//             )}

//             {/* ✅ Admin button — sirf tab dikhega jab logged-in user ka role 'admin' ho */}
//             {/* {isAdmin && (
//               <button
//                 className="navbar-admin-btn"
//                 onClick={() => setShowAdmin(true)}
//               >
//                 🔐 Admin
//               </button>
//             )} */}

//             <button
//               className="navbar-hamburger"
//               onClick={() => setMenuOpen(!menuOpen)}
//               aria-label="Menu"
//             >
//               {menuOpen ? '✕' : '☰'}
//             </button>
//           </div>
//         </div>

//         {/* Mobile menu */}
//         {menuOpen && (
//           <div className="navbar-mobile-menu">
//             <button className="mobile-nav-link" onClick={() => {
//               document.getElementById('discovery')?.scrollIntoView({ behavior: 'smooth' });
//               setMenuOpen(false);
//             }}>🗂 Explore Sites</button>

//             <button className="mobile-nav-link" onClick={() => { onMapClick?.(); setMenuOpen(false); }}>
//               🗺 Map View
//             </button>

//             <button className="mobile-nav-link" onClick={() => { onFavClick?.(); setMenuOpen(false); }}>
//               ♥ Favourites {favCount > 0 && `(${favCount})`}
//             </button>

//             <button className="mobile-nav-link" onClick={() => { onARClick?.(); setMenuOpen(false); }}>
//               📱 AR View
//             </button>

//             <button className="mobile-nav-link" onClick={() => { onSearchOpen?.(); setMenuOpen(false); }}>
//               🔍 Search
//             </button>

//             {/* ✅ Logged-out: Sign In Options. Logged-in: UserMenu */}
//             {user ? (
//               extraRight && <div className="mobile-auth-slot">{extraRight}</div>
//             ) : (
//               onAuthChoiceClick && (
//                 <button className="mobile-nav-link" onClick={() => { onAuthChoiceClick(); setMenuOpen(false); }}>
//                   🔑 Sign In Options
//                 </button>
//               )
//             )}

//             {/* ✅ Admin in mobile menu — sirf admin ko */}
//             {isAdmin && (
//               <button className="mobile-nav-link" onClick={() => { setShowAdmin(true); setMenuOpen(false); }}>
//                 🔐 Admin Panel
//               </button>
//             )}
//           </div>
//         )}
//       </nav>

//       {/* AdminPanel — root level pe, navbar ke bahar */}
//      {isAdmin && showAdmin && (
//         <AdminPanel
//           onClose={() => setShowAdmin(false)}
//           adminUser={user}
//         />
//       )}
//     </>
//   );
// };

// export default Navbar;



import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';
import AdminPanel from "./AdminPanel";

const Navbar = ({
  onSearchOpen,
  onMapClick,
  onARClick,
  onFavClick,
  onExploreClick,
  onAboutClick,
  extraRight,
  onAuthChoiceClick
}) => {
  const { user } = useAuth();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const favCount = user?.favorites?.length || 0;
  const isAdmin = user?.role === 'admin';

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar-inner">

          <div className="navbar-brand">
            <span className="navbar-logo">🏛️</span>

            <div>
              <div className="navbar-title">
                Bharatiya Dharohar
              </div>

              <div className="navbar-subtitle">
                AR Heritage Platform
              </div>
            </div>
          </div>

          <div className="navbar-links">

            <button
              className="nav-link"
              onClick={onExploreClick}
            >
              Explore
            </button>

            <button
              className="nav-link"
              onClick={onMapClick}
            >
              Map
            </button>

            {!user && (
          <button
            className="nav-link"
            onClick={onAboutClick}
          >
            About
          </button>
              )}

            {user && (
              <>
                <button
                  className="nav-link nav-fav-link"
                  onClick={onFavClick}
                >
                  <span className="nav-fav-icon">♥</span>

                  Favourites

                  {favCount > 0 && (
                    <span className="nav-fav-badge">
                      {favCount}
                    </span>
                  )}
                </button>

                <button
                  className="nav-link ar-badge"
                  onClick={onARClick}
                >
                  <span>📱</span> AR View
                </button>
              </>
            )}

          </div>

          <div
            className="navbar-right"
            style={{ gap: '0.4rem' }}
          >

            <button
              className="navbar-search-btn"
              onClick={onSearchOpen}
              aria-label="Search"
            >
              🔍
            </button>

            {user && (
              <button
                className="navbar-fav-btn"
                onClick={onFavClick}
                aria-label="Favourites"
                style={{ position: 'relative' }}
              >
                ♥

                {favCount > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-4px',
                      right: '-4px',
                      background: '#C9A84C',
                      color: '#0D1B2A',
                      fontSize: '0.45rem',
                      fontWeight: 700,
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: "'Space Mono', monospace",
                    }}
                  >
                    {favCount}
                  </span>
                )}
              </button>
            )}

            {user ? (
              extraRight && (
                <div className="navbar-auth-slot">
                  {extraRight}
                </div>
              )
            ) : (
              onAuthChoiceClick && (
                <button
                  onClick={onAuthChoiceClick}
                  style={{
                    padding: '6px 10px',
                    background: 'rgba(212,175,55,0.1)',
                    border: '1px solid rgba(212,175,55,0.3)',
                    borderRadius: '8px',
                    color: '#d4af37',
                    fontSize: '0.68rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    fontFamily: "'Space Mono', monospace",
                  }}
                >
                  🔑 Sign In
                </button>
              )
            )}

            <button
              className="navbar-hamburger"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              {menuOpen ? '✕' : '☰'}
            </button>

          </div>
        </div>

        {menuOpen && (
          <div className="navbar-mobile-menu">

            <button
              className="mobile-nav-link"
              onClick={() => {
                onExploreClick?.();
                setMenuOpen(false);
              }}
            >
              🗂 Explore Sites
            </button>

            <button
              className="mobile-nav-link"
              onClick={() => {
                onMapClick?.();
                setMenuOpen(false);
              }}
            >
              🗺 Map View
            </button>

         {!user && (
            <button
              className="mobile-nav-link"
              onClick={() => {
                onAboutClick?.();
                setMenuOpen(false);
              }}
            >
              ℹ️ About
            </button>
          )}

            {user && (
              <>
                <button
                  className="mobile-nav-link"
                  onClick={() => {
                    onFavClick?.();
                    setMenuOpen(false);
                  }}
                >
                  ♥ Favourites {favCount > 0 && `(${favCount})`}
                </button>

                <button
                  className="mobile-nav-link"
                  onClick={() => {
                    onARClick?.();
                    setMenuOpen(false);
                  }}
                >
                  📱 AR View
                </button>
              </>
            )}

            <button
              className="mobile-nav-link"
              onClick={() => {
                onSearchOpen?.();
                setMenuOpen(false);
              }}
            >
              🔍 Search
            </button>

            {user ? (
              extraRight && (
                <div className="mobile-auth-slot">
                  {extraRight}
                </div>
              )
            ) : (
              onAuthChoiceClick && (
                <button
                  className="mobile-nav-link"
                  onClick={() => {
                    onAuthChoiceClick();
                    setMenuOpen(false);
                  }}
                >
                  🔑 Sign In Options
                </button>
              )
            )}

            {isAdmin && (
              <button
                className="mobile-nav-link"
                onClick={() => {
                  setShowAdmin(true);
                  setMenuOpen(false);
                }}
              >
                🔐 Admin Panel
              </button>
            )}

          </div>
        )}
      </nav>

      {isAdmin && showAdmin && (
        <AdminPanel
          onClose={() => setShowAdmin(false)}
          adminUser={user}
        />
      )}
    </>
  );
};

export default Navbar;