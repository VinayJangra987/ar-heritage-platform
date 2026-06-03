import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';
import AdminPanel from "./AdminPanel";

const Navbar = ({ onSearchOpen, onMapClick, onARClick, onFavClick, extraRight }) => {
  const { user } = useAuth();
  const [scrolled,   setScrolled]   = useState(false);
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [showAdmin,  setShowAdmin]  = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const favCount = user?.favorites?.length || 0;

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar-inner">

          {/* Brand */}
          <div className="navbar-brand">
            <span className="navbar-logo">🏛️</span>
            <div>
              <div className="navbar-title">Bharatiya Dharohar</div>
              <div className="navbar-subtitle">AR Heritage Platform</div>
            </div>
          </div>

          {/* Desktop links */}
          <div className="navbar-links">
            <button
              className="nav-link"
              onClick={() => document.getElementById('discovery')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Explore
            </button>

            <button className="nav-link" onClick={onMapClick}>Map</button>

            <button className="nav-link nav-fav-link" onClick={onFavClick}>
              <span className="nav-fav-icon">♥</span>
              Favourites
              {favCount > 0 && <span className="nav-fav-badge">{favCount}</span>}
            </button>

            <button className="nav-link ar-badge" onClick={onARClick}>
              <span>📱</span> AR View
            </button>
          </div>

          {/* Right side */}
          <div className="navbar-right">
            <button className="navbar-search-btn" onClick={onSearchOpen} aria-label="Search">🔍</button>

            {/* Mobile fav icon */}
            <button
              className="navbar-fav-btn"
              onClick={onFavClick}
              aria-label="Favourites"
              style={{ position: 'relative' }}
            >
              ♥
              {favCount > 0 && (
                <span style={{
                  position: 'absolute', top: '-4px', right: '-4px',
                  background: '#C9A84C', color: '#0D1B2A',
                  fontSize: '0.45rem', fontWeight: 700,
                  width: '16px', height: '16px',
                  borderRadius: '50%', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  fontFamily: "'Space Mono', monospace",
                }}>
                  {favCount}
                </span>
              )}
            </button>

            {extraRight && <div className="navbar-auth-slot">{extraRight}</div>}

            {/* Admin button */}
            <button
              onClick={() => setShowAdmin(true)}
              style={{
                padding: '6px 14px',
                background: 'rgba(201,168,76,0.12)',
                border: '1px solid rgba(201,168,76,0.3)',
                borderRadius: '8px',
                color: '#C9A84C',
                fontFamily: "'Space Mono', monospace",
                fontSize: '0.55rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseOver={e => e.currentTarget.style.background = 'rgba(201,168,76,0.22)'}
              onMouseOut={e => e.currentTarget.style.background = 'rgba(201,168,76,0.12)'}
            >
              🔐 Admin
            </button>

            <button
              className="navbar-hamburger"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="navbar-mobile-menu">
            <button className="mobile-nav-link" onClick={() => {
              document.getElementById('discovery')?.scrollIntoView({ behavior: 'smooth' });
              setMenuOpen(false);
            }}>🗂 Explore Sites</button>

            <button className="mobile-nav-link" onClick={() => { onMapClick?.(); setMenuOpen(false); }}>
              🗺 Map View
            </button>

            <button className="mobile-nav-link" onClick={() => { onFavClick?.(); setMenuOpen(false); }}>
              ♥ Favourites {favCount > 0 && `(${favCount})`}
            </button>

            <button className="mobile-nav-link" onClick={() => { onARClick?.(); setMenuOpen(false); }}>
              📱 AR View
            </button>

            <button className="mobile-nav-link" onClick={() => { onSearchOpen?.(); setMenuOpen(false); }}>
              🔍 Search
            </button>

            {/* Admin in mobile menu too */}
            <button className="mobile-nav-link" onClick={() => { setShowAdmin(true); setMenuOpen(false); }}>
              🔐 Admin Panel
            </button>

            {extraRight && <div className="mobile-auth-slot">{extraRight}</div>}
          </div>
        )}
      </nav>

      {/* ✅ AdminPanel — correctly outside nav, at root level */}
      {showAdmin && (
        <AdminPanel onClose={() => setShowAdmin(false)} />
      )}
    </>
  );
};

export default Navbar;