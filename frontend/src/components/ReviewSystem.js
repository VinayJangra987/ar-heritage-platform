import { useState, useEffect } from "react";
import { reviewsAPI } from "../api";
import { useAuth } from "../context/AuthContext";

export default function ReviewSystem({ site, onClose }) {
  const { user } = useAuth();
  const [reviews,    setReviews]    = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [rating,     setRating]     = useState(5);
  const [comment,    setComment]    = useState("");
  const [title,      setTitle]      = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]      = useState("");
  const [success,    setSuccess]    = useState("");

  // ── Safe id helper — MongoDB _id takes priority ───────────────────────────
  const isMongoId = (id) => id && /^[a-f\d]{24}$/i.test(id.toString());
  const getSiteId = () => {
    const mongoId = site?._id?.toString();
    const localId = site?.id?.toString();
    // Only return an id if it's a real MongoDB ObjectId
    if (isMongoId(mongoId)) return mongoId;
    if (isMongoId(localId)) return localId;
    return null; // local data like "taj_mahal" — no backend id
  };

  const siteId = getSiteId();

  // ── Load reviews — only if valid MongoDB id ───────────────────────────────
  useEffect(() => {
    if (!siteId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    reviewsAPI.getReviews(siteId)
      .then((data) => {
        setReviews(data.reviews || []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [siteId]);

  // ── Submit review ─────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!user)    { setError("Pehle login karo!"); return; }
    if (!comment) { setError("Comment likho!");    return; }

    if (!siteId) {
      setError("Ye site abhi reviews support nahi karti (local data). Backend se connect karo.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const data = await reviewsAPI.addReview(siteId, { rating, title, comment });
      if (data.review) {
        setReviews((prev) => [data.review, ...prev]);
        setSuccess("Review submit ho gaya! ✅");
        setComment(""); setTitle(""); setRating(5);
      } else {
        setError(data.message || "Error aaya!");
      }
    } catch (err) {
      setError("Server se connect nahi ho paya. Baad mein try karo.");
    }

    setSubmitting(false);
  };

  return (
    <>
      <style>{`
        .rv-overlay {
          position: fixed; inset: 0; z-index: 9999;
          background: rgba(0,0,0,0.8);
          display: flex; align-items: center; justify-content: center;
          padding: 1rem;
        }
        .rv-box {
          background: #0D1B2A;
          border: 1px solid rgba(201,168,76,0.3);
          border-radius: 16px;
          width: 100%; max-width: 560px;
          max-height: 85vh; overflow-y: auto;
          padding: 2rem;
          position: relative;
        }
        .rv-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.6rem; color: #C9A84C;
          margin-bottom: 0.3rem;
        }
        .rv-site-name {
          font-family: 'Space Mono', monospace;
          font-size: 0.55rem; letter-spacing: 0.2em;
          color: rgba(242,232,208,0.4);
          text-transform: uppercase; margin-bottom: 1.5rem;
        }
        .rv-close {
          position: absolute; top: 1rem; right: 1rem;
          background: none; border: none;
          color: rgba(242,232,208,0.4);
          font-size: 1.2rem; cursor: pointer;
        }
        .rv-no-backend {
          background: rgba(201,168,76,0.05);
          border: 1px dashed rgba(201,168,76,0.2);
          border-radius: 10px; padding: 1.2rem;
          margin-bottom: 1.5rem;
          text-align: center;
        }
        .rv-no-backend-icon { font-size: 1.8rem; margin-bottom: 0.5rem; }
        .rv-no-backend-text {
          font-family: 'Poppins', sans-serif;
          font-size: 0.78rem; color: rgba(242,232,208,0.4);
          line-height: 1.6;
        }
        .rv-no-backend-text strong { color: rgba(201,168,76,0.7); display: block; margin-bottom: 3px; }
        .rv-form {
          background: rgba(201,168,76,0.05);
          border: 1px solid rgba(201,168,76,0.15);
          border-radius: 12px; padding: 1.2rem;
          margin-bottom: 1.5rem;
        }
        .rv-form-title {
          font-family: 'Space Mono', monospace;
          font-size: 0.58rem; letter-spacing: 0.15em;
          color: #C9A84C; text-transform: uppercase;
          margin-bottom: 1rem;
          display: flex; align-items: center; gap: 0.5rem;
        }
        .rv-stars { display: flex; gap: 0.3rem; margin-bottom: 1rem; }
        .rv-star {
          font-size: 1.4rem; cursor: pointer;
          transition: transform 0.15s;
        }
        .rv-star:hover { transform: scale(1.2); }
        .rv-input {
          width: 100%; padding: 0.65rem 0.9rem;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(201,168,76,0.2);
          border-radius: 8px; color: #F2E8D0;
          font-family: 'Poppins', sans-serif;
          font-size: 0.82rem; margin-bottom: 0.75rem;
          outline: none; box-sizing: border-box;
        }
        .rv-input:focus { border-color: rgba(201,168,76,0.5); }
        .rv-textarea {
          width: 100%; padding: 0.65rem 0.9rem;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(201,168,76,0.2);
          border-radius: 8px; color: #F2E8D0;
          font-family: 'Poppins', sans-serif;
          font-size: 0.82rem; margin-bottom: 0.75rem;
          outline: none; box-sizing: border-box;
          resize: vertical; min-height: 80px;
        }
        .rv-textarea:focus { border-color: rgba(201,168,76,0.5); }
        .rv-submit {
          width: 100%; padding: 0.8rem;
          background: linear-gradient(135deg, #C9A84C, #E8C96A);
          color: #0D1B2A; border: none; border-radius: 8px;
          font-family: 'Space Mono', monospace;
          font-weight: 700; font-size: 0.62rem;
          letter-spacing: 0.12em; text-transform: uppercase;
          cursor: pointer; transition: opacity 0.2s;
        }
        .rv-submit:disabled { opacity: 0.6; cursor: not-allowed; }
        .rv-error   { color: #E24B4A; font-size: 0.75rem; margin-bottom: 0.5rem; }
        .rv-success { color: #4AC878; font-size: 0.75rem; margin-bottom: 0.5rem; }
        .rv-divider {
          font-family: 'Space Mono', monospace;
          font-size: 0.55rem; letter-spacing: 0.2em;
          color: rgba(201,168,76,0.6); text-transform: uppercase;
          margin-bottom: 1rem;
        }
        .rv-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 10px; padding: 1rem;
          margin-bottom: 0.75rem;
        }
        .rv-card-top {
          display: flex; justify-content: space-between;
          align-items: center; margin-bottom: 0.4rem;
        }
        .rv-card-name {
          font-family: 'Space Mono', monospace;
          font-size: 0.6rem; color: #C9A84C;
          letter-spacing: 0.1em;
        }
        .rv-card-date { font-size: 0.65rem; color: rgba(242,232,208,0.3); }
        .rv-card-stars { margin-bottom: 0.4rem; font-size: 0.9rem; }
        .rv-card-title {
          font-size: 0.85rem; font-weight: 600;
          color: #F2E8D0; margin-bottom: 0.3rem;
        }
        .rv-card-comment { font-size: 0.8rem; color: rgba(242,232,208,0.6); line-height: 1.6; }
        .rv-empty { text-align: center; color: rgba(242,232,208,0.3); font-size: 0.8rem; padding: 1.5rem 0; }
        .rv-login-msg {
          text-align: center; color: rgba(242,232,208,0.4);
          font-size: 0.78rem; padding: 0.75rem;
          border: 1px dashed rgba(201,168,76,0.2); border-radius: 8px;
          margin-bottom: 1.5rem;
        }
      `}</style>

      <div className="rv-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className="rv-box">
          <button className="rv-close" onClick={onClose}>✕</button>

          <div className="rv-title">Reviews</div>
          <div className="rv-site-name">{site?.name}</div>

          {/* ── No MongoDB id — show info message ── */}
          {!siteId ? (
            <div className="rv-no-backend">
              <div className="rv-no-backend-icon">🔗</div>
              <div className="rv-no-backend-text">
                <strong>Backend connection needed</strong>
                Ye site local data se aa rahi hai. Reviews backend MongoDB se connect hone ke baad kaam karenge.
              </div>
            </div>
          ) : user ? (
            /* ── Review Form — only when valid siteId ── */
            <div className="rv-form">
              <div className="rv-form-title">✍ Write a Review</div>

              {/* Star Rating */}
              <div className="rv-stars">
                {[1,2,3,4,5].map((s) => (
                  <span key={s} className="rv-star" onClick={() => setRating(s)}>
                    {s <= rating ? "⭐" : "☆"}
                  </span>
                ))}
              </div>

              <input
                className="rv-input"
                placeholder="Title (optional)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <textarea
                className="rv-textarea"
                placeholder="Apna experience share karo..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />

              {error   && <div className="rv-error">{error}</div>}
              {success && <div className="rv-success">{success}</div>}

              <button className="rv-submit" onClick={handleSubmit} disabled={submitting}>
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          ) : (
            <div className="rv-login-msg">
              Reviews likhne ke liye pehle login karo 🔐
            </div>
          )}

          {/* ── Reviews List ── */}
          {siteId && (
            <>
              <div className="rv-divider">
                {reviews.length} Review{reviews.length !== 1 ? "s" : ""}
              </div>

              {loading ? (
                <div className="rv-empty">Loading reviews...</div>
              ) : reviews.length === 0 ? (
                <div className="rv-empty">Abhi koi review nahi — pehle review likho! ✍️</div>
              ) : (
                reviews.map((r) => (
                  <div key={r._id} className="rv-card">
                    <div className="rv-card-top">
                      <div className="rv-card-name">{r.user?.name || "Anonymous"}</div>
                      <div className="rv-card-date">
                        {new Date(r.createdAt).toLocaleDateString("en-IN")}
                      </div>
                    </div>
                    <div className="rv-card-stars">
                      {"⭐".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
                    </div>
                    {r.title && <div className="rv-card-title">{r.title}</div>}
                    <div className="rv-card-comment">{r.comment}</div>
                  </div>
                ))
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}