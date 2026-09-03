import './AuthChoice.css';

const AuthChoice = ({ onSelectLogin, onSelectSignup, onSelectAdmin, onSelectGuest }) => {
  return (
    <div className="auth-choice-overlay">
      <div className="auth-choice-card">
        <div className="auth-choice-logo">🏛️</div>
        <h2 className="auth-choice-title">Bharatiya Dharohar</h2>
        <p className="auth-choice-subtitle">Aage badhne ke liye option chuno</p>

        <div className="auth-choice-buttons">
          <button className="auth-choice-btn login-btn" onClick={onSelectLogin}>
            🔐 Login
          </button>

          <button className="auth-choice-btn signup-btn" onClick={onSelectSignup}>
            📝 Signup
          </button>

          <button className="auth-choice-btn admin-btn" onClick={onSelectAdmin}>
            🛡️ Admin Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthChoice;