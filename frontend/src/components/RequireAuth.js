import { useAuth } from "../context/AuthContext";

export default function RequireAuth({
  children,
  onShowAuth,
  title,
  message,
  mode = "overlay",

  // true karne par login required nahi hoga
  publicAccess = false,
}) {
  const { user, loading } = useAuth();

  // Public component ke liye auth wall completely skip
  if (publicAccess) {
    return children;
  }

  if (loading) {
    return (
      <div className={`ra-wrap ra-${mode}`}>
        <style>{RA_STYLES}</style>

        <div className="ra-loading">
          <div className="ra-spinner" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={`ra-wrap ra-${mode}`}>
        <style>{RA_STYLES}</style>

        <div className="ra-card">

          <div className="ra-icon">
            🔒
          </div>

          <div className="ra-title">
            {title || "Sign in to continue"}
          </div>

          <div className="ra-desc">
            {message ||
              "This experience is available to logged-in explorers only. Sign in or create a free account to continue."}
          </div>

          <button
            className="ra-btn"
            onClick={() => {
              if (onShowAuth) {
                onShowAuth();
              } else {
                console.warn(
                  "RequireAuth: no onShowAuth handler passed"
                );
              }
            }}
          >
            🔐 Login / Sign Up
          </button>

        </div>
      </div>
    );
  }

  return children;
}


const RA_STYLES = `
  .ra-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Poppins', sans-serif;
  }

  .ra-overlay {
    position: fixed;
    inset: 0;
    z-index: 9999;
    background: rgba(4,8,15,0.92);
    backdrop-filter: blur(6px);
  }

  .ra-inline {
    position: relative;
    min-height: 420px;
    background: #0A141F;
    border-top: 1px solid rgba(201,168,76,0.1);
    border-bottom: 1px solid rgba(201,168,76,0.1);
    padding: 3rem 1.5rem;
  }

  .ra-card {
    max-width: 380px;
    width: 100%;
    text-align: center;
    background: rgba(15,30,47,0.9);
    border: 1px solid rgba(201,168,76,0.25);
    border-radius: 16px;
    padding: 2.5rem 2rem;
    box-shadow: 0 20px 60px rgba(0,0,0,0.5);
  }

  .ra-icon {
    font-size: 2rem;
    margin-bottom: 0.75rem;
  }

  .ra-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.6rem;
    font-weight: 700;
    color: #F2E8D0;
    margin-bottom: 0.6rem;
    line-height: 1.15;
  }

  .ra-desc {
    font-family: 'Poppins', sans-serif;
    font-size: 0.82rem;
    color: rgba(242,232,208,0.5);
    line-height: 1.6;
    margin-bottom: 1.6rem;
  }

  .ra-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.8rem;
    border-radius: 50px;
    border: none;
    background: linear-gradient(135deg, #C9A84C, #E8C96A);
    color: #0D1B2A;
    font-family: 'Space Mono', monospace;
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.25s;
    box-shadow: 0 4px 20px rgba(201,168,76,0.3);
  }

  .ra-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(201,168,76,0.45);
  }

  .ra-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 3rem;
  }

  .ra-spinner {
    width: 36px;
    height: 36px;
    border: 2px solid rgba(201,168,76,0.15);
    border-top-color: #C9A84C;
    border-radius: 50%;
    animation: raSpin 0.8s linear infinite;
  }

  @keyframes raSpin {
    to {
      transform: rotate(360deg);
    }
  }
`;