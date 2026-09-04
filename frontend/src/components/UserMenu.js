// import { useState, useRef, useEffect } from 'react';
// import { useAuth } from '../context/AuthContext';
// import './UserMenu.css';

// const UserMenu = ({ onShowAuth, onShowFavorites, onShowAdmin }) => {
//   const { user, logout } = useAuth();
//   const [open, setOpen] = useState(false);
//   const ref = useRef();

//   useEffect(() => {
//     const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
//     document.addEventListener('mousedown', handler);
//     return () => document.removeEventListener('mousedown', handler);
//   }, []);

//   if (!user) {
//     return (
//       <button className="um-login-btn" onClick={onShowAuth}>
//         <span>🔐</span> Login
//       </button>
//     );
//   }

//   const initials = user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
//   const favCount = user.favorites?.length || 0;
//   const isAdmin = user.role === 'admin'; // ✅ Role check

//   return (
//     <div className="um-wrap" ref={ref}>
//       <button className="um-avatar-btn" onClick={() => setOpen(!open)}>
//         <div className="um-avatar">{initials}</div>
//         <span className="um-name">{user.name.split(' ')[0]}</span>
//         <span className="um-chevron">{open ? '▲' : '▼'}</span>
//       </button>

//       {open && (
//         <div className="um-dropdown">
//           <div className="um-user-info">
//             <div className="um-big-avatar">{initials}</div>
//             <div>
//               <div className="um-full-name">{user.name}</div>
//               <div className="um-email">{user.email}</div>
//               {isAdmin && <div className="um-role-badge">Admin</div>}
//             </div>
//           </div>

//           <div className="um-divider" />

//           {/* ✅ Admin button - sirf admin ko dikhega */}
//           {isAdmin && (
//             <button className="um-item um-admin-item" onClick={() => { onShowAdmin?.(); setOpen(false); }}>
//               <span>⚙️</span>
//               <span>Admin Panel</span>
//             </button>
//           )}

//           <button className="um-item" onClick={() => { onShowFavorites?.(); setOpen(false); }}>
//             <span>❤️</span>
//             <span>My Favorites</span>
//             {favCount > 0 && <span className="um-badge">{favCount}</span>}
//           </button>

//           <button className="um-item" onClick={() => { logout(); setOpen(false); }}>
//             <span>🚪</span>
//             <span>Logout</span>
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UserMenu;
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import MyReservations from './MyReservations';
import './UserMenu.css';

const UserMenu = ({ onShowAuth, onShowFavorites, onShowAdmin }) => {
  const { user, logout } = useAuth();

  const [open, setOpen] = useState(false);
  const [showReservations, setShowReservations] = useState(false);

  const ref = useRef();

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handler);

    return () => {
      document.removeEventListener('mousedown', handler);
    };
  }, []);

  if (!user) {
    return (
      <button className="um-login-btn" onClick={onShowAuth}>
        <span>🔐</span> Login
      </button>
    );
  }

  const initials = user.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const favCount = user.favorites?.length || 0;
  const isAdmin = user.role === 'admin';
  const badgeCount = user.badges?.length || 0;
  const streakCurrent = user.streak?.current || 0;

  return (
    <>
      <div className="um-wrap" ref={ref}>
        <button
          className="um-avatar-btn"
          onClick={() => setOpen(!open)}
        >
          <div className="um-avatar">{initials}</div>

                    <span className="um-name">
            {user.name.split(' ')[0]}
          </span>

          <span className="um-chevron">
            {open ? '▲' : '▼'}
          </span>
        </button>

        {open && (
          <div className="um-dropdown">
            <div className="um-user-info">
              <div className="um-big-avatar">
                {initials}
              </div>

              <div>
                <div className="um-full-name">
                  {user.name}
                </div>

                <div className="um-email">
                  {user.email}
                </div>

                {isAdmin && (
                  <div className="um-role-badge">
                    Admin
                  </div>
                )}
              </div>
            </div>

            <div className="um-divider" />

            <div className="um-stats-row">
              <div className="um-stat-box">
                <div className="um-stat-num">
                  🔥 {streakCurrent}
                </div>

                <div className="um-stat-label">
                  Day Streak
                </div>
              </div>

              <div className="um-stat-box">
                <div className="um-stat-num">
                  🏅 {badgeCount}
                </div>

                <div className="um-stat-label">
                  Badges
                </div>
              </div>
            </div>

            {badgeCount > 0 && (
              <div className="um-badges-strip">
                {user.badges.map((b) => (
                  <span
                    key={b.id}
                    className="um-badge-chip"
                    title={b.id}
                  >
                    {b.id.includes("streak")
                      ? "🔥"
                      : b.id.includes("collector")
                      ? "❤️"
                      : b.id.includes("review")
                      ? "✍️"
                      : "🏅"}
                  </span>
                ))}
              </div>
            )}

            <div className="um-divider" />

            {isAdmin && (
              <button
                className="um-item um-admin-item"
                onClick={() => {
                  onShowAdmin?.();
                  setOpen(false);
                }}
              >
                <span>⚙️</span>
                <span>Admin Panel</span>
              </button>
            )}

            <button
              className="um-item"
              onClick={() => {
                setShowReservations(true);
                setOpen(false);
              }}
            >
              <span>🎟️</span>
              <span>My Reservations</span>
            </button>

            <button
              className="um-item"
              onClick={() => {
                onShowFavorites?.();
                setOpen(false);
              }}
            >
              <span>❤️</span>
              <span>My Favorites</span>

              {favCount > 0 && (
                <span className="um-badge">
                  {favCount}
                </span>
              )}
            </button>

            <button
              className="um-item"
              onClick={() => {
                logout();
                setOpen(false);
              }}
            >
              <span>🚪</span>
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>

      {showReservations && (
        <MyReservations
          onClose={() => setShowReservations(false)}
        />
      )}
    </>
  );
};

export default UserMenu;