import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './UserMenu.css';

const UserMenu = ({ onShowAuth, onShowFavorites }) => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (!user) {
    return (
      <button className="um-login-btn" onClick={onShowAuth}>
        <span>🔐</span> Login
      </button>
    );
  }

  const initials = user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  const favCount = user.favorites?.length || 0;

  return (
    <div className="um-wrap" ref={ref}>
      <button className="um-avatar-btn" onClick={() => setOpen(!open)}>
        <div className="um-avatar">{initials}</div>
        <span className="um-name">{user.name.split(' ')[0]}</span>
        <span className="um-chevron">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="um-dropdown">
          <div className="um-user-info">
            <div className="um-big-avatar">{initials}</div>
            <div>
              <div className="um-full-name">{user.name}</div>
              <div className="um-email">{user.email}</div>
            </div>
          </div>

          <div className="um-divider" />

          <button className="um-item" onClick={() => { onShowFavorites?.(); setOpen(false); }}>
            <span>❤️</span>
            <span>My Favorites</span>
            {favCount > 0 && <span className="um-badge">{favCount}</span>}
          </button>

          <button className="um-item" onClick={() => { logout(); setOpen(false); }}>
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;