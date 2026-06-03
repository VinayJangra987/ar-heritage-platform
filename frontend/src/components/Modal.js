


// src/components/Modal.js
import { useEffect, useState } from "react";
import { reviewsAPI } from "../api";
import { useAuth } from "../context/AuthContext";

export default function Modal({ site, onClose, recommendations, onNavigate, onARClick, isFav, onToggleFav }) {
  const { user } = useAuth();
  const [imgIdx, setImgIdx]       = useState(0);
  const [tab, setTab]             = useState("overview");

  // ── Reviews state ──────────────────────────────────────────
  const [reviews, setReviews]     = useState([]);
  const [rvLoading, setRvLoading] = useState(false);
  const [rating, setRating]       = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment]     = useState("");
  const [title, setTitle]         = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [rvError, setRvError]     = useState("");
  const [rvSuccess, setRvSuccess] = useState("");

  

const siteId = /^[a-f\d]{24}$/i.test(site?._id) ? site._id : null;
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // ✅ Reviews load safely
  useEffect(() => {

    if (tab !== "reviews" || !siteId) return;

    setRvLoading(true);

    reviewsAPI.getReviews(siteId)
      .then((data) => {
        setReviews(data.reviews || []);
        setRvLoading(false);
      })
      .catch(() => {
        setRvLoading(false);
      });

  }, [tab, siteId]);

  // ✅ Safe Review Submit
  const handleReviewSubmit = async () => {

    if (!user) {
      setRvError("Pehle login karo!");
      return;
    }

    if (!comment) {
      setRvError("Comment zaroor likho!");
      return;
    }

    // Invalid/local site protection
   if (!siteId) {
  setRvError("Is site ke reviews abhi available nahi hain.");
  return;
}

    try {

      setSubmitting(true);
      setRvError("");
      setRvSuccess("");

      const data = await reviewsAPI.addReview(siteId, {
        rating,
        title,
        comment
      });

      if (data.review) {

        setReviews((prev) => [data.review, ...prev]);

        setRvSuccess("Review submit ho gaya! ✅");

        setComment("");
        setTitle("");
        setRating(5);

      } else {

        setRvError(data.message || "Kuch error aaya!");

      }

    } catch (err) {

      setRvError(
        err?.response?.data?.message ||
        "Review submit nahi ho paya!"
      );

    } finally {

      setSubmitting(false);

    }
  };

  if (!site) return null;

  const images = site.images?.length
    ? site.images
    : ["https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800"];

  const avgRating = site.avgRating || 0;
  const totalReviews = site.totalReviews || 0;

  return (
    <>
      <style>{`
        .modal-overlay {
          position: fixed; inset: 0;
          background: rgba(4,9,17,0.88);
          backdrop-filter: blur(10px);
          z-index: 2000;
          display: flex; align-items: center; justify-content: center;
          padding: 1.5rem;
          animation: fadeIn 0.3s ease;
        }
        @keyframes fadeIn { from{opacity:0}to{opacity:1} }
        .modal-panel {
          background: #0F1E2F;
          border: 1px solid rgba(201,168,76,0.2);
          border-radius: 24px;
          max-width: 900px; width: 100%;
          max-height: 90vh; overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: rgba(201,168,76,0.3) transparent;
          animation: slideUp 0.4s cubic-bezier(0.25,0.46,0.45,0.94);
          position: relative;
        }
        @keyframes slideUp { from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)} }
        .modal-hero { position:relative;height:340px;overflow:hidden;border-radius:24px 24px 0 0; }
        .modal-hero img { width:100%;height:100%;object-fit:cover;display:block;transition:opacity 0.4s; }
        .modal-hero-gradient { position:absolute;inset:0;background:linear-gradient(to top,#0F1E2F 0%,transparent 60%); }
        .modal-close {
          position:absolute;top:1.2rem;right:1.2rem;
          width:36px;height:36px;
          background:rgba(8,14,23,0.7);backdrop-filter:blur(8px);
          border:1px solid rgba(201,168,76,0.3);border-radius:50%;
          color:#F2E8D0;font-size:1.1rem;cursor:pointer;
          display:flex;align-items:center;justify-content:center;
          transition:all 0.25s;z-index:10;
        }
        .modal-close:hover { background:rgba(201,168,76,0.15);border-color:#C9A84C; }
        .modal-fav-btn {
          position:absolute;top:1.2rem;right:4rem;
          width:36px;height:36px;
          background:rgba(8,14,23,0.7);backdrop-filter:blur(8px);
          border:1px solid rgba(201,168,76,0.3);border-radius:50%;
          font-size:1.1rem;cursor:pointer;
          display:flex;align-items:center;justify-content:center;
          transition:all 0.25s;z-index:10;
        }
        .modal-fav-btn:hover { background:rgba(201,168,76,0.15);border-color:#C9A84C; }
        .modal-img-dots { position:absolute;bottom:1rem;left:50%;transform:translateX(-50%);display:flex;gap:6px; }
        .modal-img-dot { width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,0.3);cursor:pointer;transition:all 0.3s; }
        .modal-img-dot.active { background:#C9A84C;width:18px;border-radius:3px; }
        .modal-header { padding:1.5rem 2rem 0; }
        .modal-badges { display:flex;gap:0.6rem;margin-bottom:0.75rem;flex-wrap:wrap;align-items:center; }
        .badge { padding:4px 12px;border-radius:20px;font-family:'Space Mono',monospace;font-size:0.58rem;letter-spacing:0.12em;text-transform:uppercase; }
        .badge-type { background:rgba(201,168,76,0.12);border:1px solid rgba(201,168,76,0.3);color:#C9A84C; }
        .badge-unesco { background:rgba(201,168,76,0.9);color:#0D1B2A;font-weight:700; }
        .badge-period { background:rgba(26,46,68,0.8);border:1px solid rgba(242,232,208,0.1);color:rgba(242,232,208,0.6); }
        .badge-rating {
          display:flex;align-items:center;gap:4px;
          background:rgba(201,168,76,0.08);border:1px solid rgba(201,168,76,0.2);
          color:#C9A84C;padding:4px 10px;border-radius:20px;
          font-family:'Space Mono',monospace;font-size:0.58rem;
        }
        .modal-title { font-family:'Cormorant Garamond',serif;font-size:2.5rem;font-weight:700;color:#F2E8D0;line-height:1.1;margin-bottom:0.4rem; }
        .modal-location { font-family:'Space Mono',monospace;font-size:0.65rem;color:#C9A84C;letter-spacing:0.14em;text-transform:uppercase;margin-bottom:1.5rem; }
        .modal-tabs { display:flex;gap:0;border-bottom:1px solid rgba(201,168,76,0.12);margin:0 2rem; }
        .modal-tab { font-family:'Space Mono',monospace;font-size:0.62rem;letter-spacing:0.1em;text-transform:uppercase;color:rgba(242,232,208,0.45);background:none;border:none;padding:0.75rem 1.2rem;cursor:pointer;border-bottom:2px solid transparent;transition:all 0.3s; }
        .modal-tab.active { color:#C9A84C;border-bottom-color:#C9A84C; }
        .modal-tab:hover { color:#F2E8D0; }
        .modal-body { padding:1.75rem 2rem 2rem; }
        .modal-section-title { font-family:'Cormorant Garamond',serif;font-size:1.2rem;font-weight:600;color:#C9A84C;margin-bottom:0.75rem; }
        .modal-text { font-family:'Poppins',sans-serif;font-size:0.88rem;color:rgba(242,232,208,0.72);line-height:1.75;margin-bottom:1.5rem; }
        .visit-grid { display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin-bottom:1.5rem; }
        .visit-item { background:rgba(26,46,68,0.6);border:1px solid rgba(201,168,76,0.12);border-radius:12px;padding:1rem; }
        .visit-item-label { font-family:'Space Mono',monospace;font-size:0.55rem;color:rgba(242,232,208,0.4);letter-spacing:0.14em;text-transform:uppercase;margin-bottom:0.4rem; }
        .visit-item-value { font-family:'Poppins',sans-serif;font-size:0.82rem;color:#F2E8D0;font-weight:500; }
        .modal-map-placeholder { background:rgba(26,46,68,0.6);border:1px solid rgba(201,168,76,0.12);border-radius:16px;padding:2rem;text-align:center;margin-bottom:1.5rem; }
        .modal-map-btn { display:inline-flex;align-items:center;gap:0.5rem;background:linear-gradient(135deg,#C9A84C,#E8C96A);color:#0D1B2A;padding:0.7rem 1.8rem;border-radius:40px;font-family:'Space Mono',monospace;font-size:0.65rem;font-weight:700;letter-spacing:0.1em;text-decoration:none;transition:all 0.3s;border:none;cursor:pointer;margin-top:0.75rem; }
        .modal-map-btn:hover { transform:translateY(-2px);box-shadow:0 6px 20px rgba(201,168,76,0.4); }
        .modal-tags { display:flex;gap:0.5rem;flex-wrap:wrap; }
        .modal-tag { background:rgba(26,46,68,0.6);border:1px solid rgba(201,168,76,0.15);color:rgba(242,232,208,0.55);padding:4px 12px;border-radius:20px;font-family:'Space Mono',monospace;font-size:0.58rem;letter-spacing:0.08em; }
        .modal-rec-grid { display:grid;grid-template-columns:repeat(2,1fr);gap:1rem; }
        .modal-rec-card { background:rgba(26,46,68,0.5);border:1px solid rgba(201,168,76,0.12);border-radius:12px;overflow:hidden;cursor:pointer;transition:all 0.3s;display:flex;gap:0.85rem;align-items:center; }
        .modal-rec-card:hover { border-color:rgba(201,168,76,0.35);transform:translateX(4px); }
        .modal-rec-img { width:72px;height:72px;object-fit:cover;flex-shrink:0; }
        .modal-rec-info { padding:0.5rem 0.75rem 0.5rem 0; }
        .modal-rec-name { font-family:'Cormorant Garamond',serif;font-size:1rem;font-weight:600;color:#F2E8D0;margin-bottom:0.25rem; }
        .modal-rec-loc { font-family:'Space Mono',monospace;font-size:0.55rem;color:#C9A84C;letter-spacing:0.1em;text-transform:uppercase; }

        /* ── Reviews Tab ── */
        .rv-form { background:rgba(201,168,76,0.05);border:1px solid rgba(201,168,76,0.15);border-radius:12px;padding:1.2rem;margin-bottom:1.5rem; }
        .rv-form-title { font-family:'Space Mono',monospace;font-size:0.58rem;letter-spacing:0.15em;color:#C9A84C;text-transform:uppercase;margin-bottom:1rem; }
        .rv-stars { display:flex;gap:0.3rem;margin-bottom:1rem; }
        .rv-star { font-size:1.5rem;cursor:pointer;transition:transform 0.15s;line-height:1; }
        .rv-star:hover { transform:scale(1.2); }
        .rv-input { width:100%;padding:0.65rem 0.9rem;background:rgba(255,255,255,0.05);border:1px solid rgba(201,168,76,0.2);border-radius:8px;color:#F2E8D0;font-family:'Poppins',sans-serif;font-size:0.82rem;margin-bottom:0.75rem;outline:none;box-sizing:border-box; }
        .rv-textarea { width:100%;padding:0.65rem 0.9rem;background:rgba(255,255,255,0.05);border:1px solid rgba(201,168,76,0.2);border-radius:8px;color:#F2E8D0;font-family:'Poppins',sans-serif;font-size:0.82rem;margin-bottom:0.75rem;outline:none;box-sizing:border-box;resize:vertical;min-height:80px; }
        .rv-submit { width:100%;padding:0.8rem;background:linear-gradient(135deg,#C9A84C,#E8C96A);color:#0D1B2A;border:none;border-radius:8px;font-family:'Space Mono',monospace;font-weight:700;font-size:0.62rem;letter-spacing:0.12em;text-transform:uppercase;cursor:pointer;transition:all 0.2s; }
        .rv-submit:hover { transform:translateY(-1px);box-shadow:0 4px 15px rgba(201,168,76,0.3); }
        .rv-submit:disabled { opacity:0.6;cursor:not-allowed; }
        .rv-error   { color:#E24B4A;font-size:0.75rem;margin-bottom:0.5rem;font-family:'Poppins',sans-serif; }
        .rv-success { color:#4AC878;font-size:0.75rem;margin-bottom:0.5rem;font-family:'Poppins',sans-serif; }
        .rv-login-msg { text-align:center;color:rgba(242,232,208,0.4);font-size:0.78rem;padding:1rem;border:1px dashed rgba(201,168,76,0.2);border-radius:8px;margin-bottom:1.5rem;font-family:'Poppins',sans-serif; }
        .rv-divider { font-family:'Space Mono',monospace;font-size:0.55rem;letter-spacing:0.2em;color:rgba(201,168,76,0.6);text-transform:uppercase;margin-bottom:1rem; }
        .rv-card { background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:10px;padding:1rem;margin-bottom:0.75rem; }
        .rv-card-top { display:flex;justify-content:space-between;align-items:center;margin-bottom:0.4rem; }
        .rv-card-name { font-family:'Space Mono',monospace;font-size:0.6rem;color:#C9A84C;letter-spacing:0.1em; }
        .rv-card-date { font-size:0.65rem;color:rgba(242,232,208,0.3);font-family:'Poppins',sans-serif; }
        .rv-card-stars { margin-bottom:0.4rem;font-size:0.9rem; }
        .rv-card-title { font-size:0.85rem;font-weight:600;color:#F2E8D0;margin-bottom:0.3rem;font-family:'Poppins',sans-serif; }
        .rv-card-comment { font-size:0.8rem;color:rgba(242,232,208,0.6);line-height:1.6;font-family:'Poppins',sans-serif; }
        .rv-empty { text-align:center;color:rgba(242,232,208,0.3);font-size:0.8rem;padding:2rem 0;font-family:'Poppins',sans-serif; }
        .rv-summary { display:flex;align-items:center;gap:1rem;background:rgba(201,168,76,0.05);border:1px solid rgba(201,168,76,0.12);border-radius:12px;padding:1rem 1.2rem;margin-bottom:1.2rem; }
        .rv-avg { font-family:'Cormorant Garamond',serif;font-size:2.5rem;font-weight:700;color:#C9A84C;line-height:1; }
        .rv-avg-stars { font-size:1rem;margin-bottom:0.2rem; }
        .rv-avg-count { font-family:'Space Mono',monospace;font-size:0.52rem;color:rgba(242,232,208,0.4);letter-spacing:0.1em; }

        @media (max-width:600px) {
          .modal-title { font-size:1.8rem; }
          .visit-grid { grid-template-columns:1fr 1fr; }
          .modal-rec-grid { grid-template-columns:1fr; }
          .modal-body { padding:1.25rem; }
          .modal-header { padding:1.25rem 1.25rem 0; }
          .modal-tabs { margin:0 1.25rem; }
        }
      `}</style>

      <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className="modal-panel">

          {/* ── Hero Image ── */}
          <div className="modal-hero">
            <img src={images[imgIdx]} alt={site.name} />
            <div className="modal-hero-gradient" />
            {/* Favorite button */}
            {onToggleFav && (
              <button className="modal-fav-btn" onClick={onToggleFav} title="Toggle Favorite">
                {isFav ? "❤️" : "🤍"}
              </button>
            )}
            <button className="modal-close" onClick={onClose}>✕</button>
            {images.length > 1 && (
              <div className="modal-img-dots">
                {images.map((_, i) => (
                  <div key={i} className={`modal-img-dot ${i === imgIdx ? "active" : ""}`}
                    onClick={() => setImgIdx(i)} />
                ))}
              </div>
            )}
          </div>

          {/* ── Header ── */}
          <div className="modal-header">
            <div className="modal-badges">
              <span className="badge badge-type">{site.type}</span>
              {site.unesco && <span className="badge badge-unesco">UNESCO World Heritage</span>}
              {site.era && <span className="badge badge-period">{site.era}</span>}
              {avgRating > 0 && (
                <span className="badge-rating">
                  ⭐ {avgRating.toFixed(1)} · {totalReviews} review{totalReviews !== 1 ? "s" : ""}
                </span>
              )}
            </div>
            <h2 className="modal-title">{site.name}</h2>
            <div className="modal-location">📍 {site.district}, {site.state}</div>
          </div>

          {/* ── Tabs ── */}
          <div className="modal-tabs">
            {["overview", "visit", "location", "reviews", "related"].map((t) => (
              <button key={t} className={`modal-tab ${tab === t ? "active" : ""}`}
                onClick={() => setTab(t)}>
                {t === "reviews" && totalReviews > 0 ? `reviews (${totalReviews})` : t}
              </button>
            ))}
          </div>

          {/* ── Tab Body ── */}
          <div className="modal-body">

            {/* Overview */}
            {tab === "overview" && (
              <>
                <div className="modal-section-title">About</div>
                <p className="modal-text">{site.description || site.shortDesc || "No description available."}</p>
                {site.significance && (
                  <>
                    <div className="modal-section-title">Historical Significance</div>
                    <p className="modal-text">{site.significance}</p>
                  </>
                )}
                {site.highlights?.length > 0 && (
                  <>
                    <div className="modal-section-title">Highlights</div>
                    <div className="modal-tags" style={{ marginBottom: "1.5rem" }}>
                      {site.highlights.map((h, i) => (
                        <span key={i} className="modal-tag">✦ {h}</span>
                      ))}
                    </div>
                  </>
                )}
                {site.tags?.length > 0 && (
                  <>
                    <div className="modal-section-title">Tags</div>
                    <div className="modal-tags">
                      {site.tags.map((tag) => (
                        <span key={tag} className="modal-tag">#{tag}</span>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}

            {/* Visit Info */}
            {tab === "visit" && (
              <>
                <div className="modal-section-title">Visitor Information</div>
                <div className="visit-grid">
                  <div className="visit-item">
                    <div className="visit-item-label">🕐 Timings</div>
                    <div className="visit-item-value">{site.visitingHours || site.visitInfo?.timings || "Sunrise to Sunset"}</div>
                  </div>
                  <div className="visit-item">
                    <div className="visit-item-label">🎟️ Entry Fee</div>
                    <div className="visit-item-value">{site.entryFee || site.visitInfo?.entryFee || "Check official site"}</div>
                  </div>
                  <div className="visit-item">
                    <div className="visit-item-label">🌤️ Best Season</div>
                    <div className="visit-item-value">{site.bestSeason || site.visitInfo?.bestSeason || "October – March"}</div>
                  </div>
                </div>
              </>
            )}

            {/* Location */}
            {tab === "location" && (
              <>
                <div className="modal-section-title">Location</div>
                <div className="modal-map-placeholder">
                  <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🗺️</div>
                  <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: "0.85rem", color: "rgba(242,232,208,0.6)", marginBottom: "0.5rem" }}>
                    {site.name}, {site.district}, {site.state}
                  </p>
                  {site.location?.coordinates && (
                    <p style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.6rem", color: "rgba(201,168,76,0.6)" }}>
                      {site.location.coordinates[1]?.toFixed(4)}°N, {site.location.coordinates[0]?.toFixed(4)}°E
                    </p>
                  )}
                  <a
                    href={`https://www.google.com/maps?q=${site.name} ${site.state}`}
                    target="_blank" rel="noopener noreferrer"
                    className="modal-map-btn"
                  >
                    📍 Open in Google Maps
                  </a>
                </div>
              </>
            )}

            {/* ── REVIEWS TAB ── */}
            {tab === "reviews" && (
              <>
                {/* Rating Summary */}
                {avgRating > 0 && (
                  <div className="rv-summary">
                    <div className="rv-avg">{avgRating.toFixed(1)}</div>
                    <div>
                      <div className="rv-avg-stars">{"⭐".repeat(Math.round(avgRating))}{"☆".repeat(5 - Math.round(avgRating))}</div>
                      <div className="rv-avg-count">{totalReviews} REVIEW{totalReviews !== 1 ? "S" : ""}</div>
                    </div>
                  </div>
                )}

                {/* Write Review Form */}
                {user ? (
                  <div className="rv-form">
                    <div className="rv-form-title">✍️ Write a Review</div>
                    <div className="rv-stars">
                      {[1,2,3,4,5].map((s) => (
                        <span
                          key={s}
                          className="rv-star"
                          onMouseEnter={() => setHoverRating(s)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setRating(s)}
                        >
                          {s <= (hoverRating || rating) ? "⭐" : "☆"}
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
                    {rvError   && <div className="rv-error">{rvError}</div>}
                    {rvSuccess && <div className="rv-success">{rvSuccess}</div>}
                    <button
                      className="rv-submit"
                      onClick={handleReviewSubmit}
                      disabled={submitting}
                    >
                      {submitting ? "Submitting..." : "Submit Review ⭐"}
                    </button>
                  </div>
                ) : (
                  <div className="rv-login-msg">
                    Reviews likhne ke liye pehle login karo 🔐
                  </div>
                )}

                {/* Reviews List */}
                <div className="rv-divider">
                  {reviews.length} Review{reviews.length !== 1 ? "s" : ""}
                </div>

                {rvLoading ? (
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
                      {r.title   && <div className="rv-card-title">{r.title}</div>}
                      {r.comment && <div className="rv-card-comment">{r.comment}</div>}
                    </div>
                  ))
                )}
              </>
            )}

            {/* Related */}
            {tab === "related" && recommendations?.length > 0 && (
              <>
                <div className="modal-section-title">You May Also Like</div>
                <div className="modal-rec-grid">
                  {recommendations.map((rec) => (
                    <div key={rec.id || rec._id} className="modal-rec-card" onClick={() => onNavigate?.(rec)}>
                      <img className="modal-rec-img"
                        src={rec.images?.[0] || rec.thumbnail || "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=200"}
                        alt={rec.name} />
                      <div className="modal-rec-info">
                        <div className="modal-rec-name">{rec.name}</div>
                        <div className="modal-rec-loc">{rec.state}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

          </div>
        </div>
      </div>
    </>
  );
}