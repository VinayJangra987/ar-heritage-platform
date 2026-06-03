// src/components/SiteCard.js
export default function SiteCard({ site, onClick, compact = false }) {
  return (
    <>
      <style>{`
        .site-card {
          background: rgba(26, 46, 68, 0.55);
          border: 1px solid rgba(201, 168, 76, 0.15);
          border-radius: 16px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          backdrop-filter: blur(12px);
          position: relative;
          group: true;
        }
        .site-card:hover {
          transform: translateY(-6px);
          border-color: rgba(201, 168, 76, 0.45);
          box-shadow: 0 20px 50px rgba(0,0,0,0.4), 0 0 0 1px rgba(201,168,76,0.2);
        }
        .site-card-img {
          width: 100%;
          height: ${compact ? "160px" : "220px"};
          object-fit: cover;
          display: block;
          transition: transform 0.5s ease;
        }
        .site-card:hover .site-card-img {
          transform: scale(1.06);
        }
        .site-card-img-wrap {
          overflow: hidden;
          position: relative;
        }
        .site-card-type-badge {
          position: absolute;
          top: 12px; left: 12px;
          background: rgba(8, 14, 23, 0.75);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(201,168,76,0.3);
          padding: 4px 10px;
          border-radius: 20px;
          font-family: 'Space Mono', monospace;
          font-size: 0.55rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #C9A84C;
        }
        .site-card-unesco {
          position: absolute;
          top: 12px; right: 12px;
          background: rgba(201, 168, 76, 0.9);
          color: #0D1B2A;
          padding: 4px 8px;
          border-radius: 20px;
          font-family: 'Space Mono', monospace;
          font-size: 0.5rem;
          font-weight: 700;
          letter-spacing: 0.1em;
        }
        .site-card-body {
          padding: ${compact ? "1rem" : "1.35rem"};
        }
        .site-card-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: ${compact ? "1.1rem" : "1.35rem"};
          font-weight: 700;
          color: #F2E8D0;
          margin-bottom: 0.3rem;
          line-height: 1.2;
        }
        .site-card-location {
          font-family: 'Space Mono', monospace;
          font-size: 0.6rem;
          color: #C9A84C;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: ${compact ? "0" : "0.75rem"};
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .site-card-desc {
          font-family: 'Poppins', sans-serif;
          font-size: 0.8rem;
          color: rgba(242, 232, 208, 0.62);
          line-height: 1.6;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .site-card-footer {
          padding: 0 1.35rem 1.2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .site-card-period {
          font-family: 'Space Mono', monospace;
          font-size: 0.58rem;
          color: rgba(242,232,208,0.4);
          letter-spacing: 0.08em;
        }
        .site-card-cta {
          font-family: 'Space Mono', monospace;
          font-size: 0.58rem;
          color: #C9A84C;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 0.35rem;
          transition: gap 0.3s;
        }
        .site-card:hover .site-card-cta {
          gap: 0.65rem;
        }
      `}</style>

      <div className="site-card" onClick={() => onClick(site)}>
        <div className="site-card-img-wrap">
          <img
            className="site-card-img"
            src={site.images?.[0] || "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600"}
            alt={site.name}
            loading="lazy"
          />
          <div className="site-card-type-badge">{site.type}</div>
          {site.unesco && <div className="site-card-unesco">UNESCO ★</div>}
        </div>

        <div className="site-card-body">
          <h3 className="site-card-name">{site.name}</h3>
          <div className="site-card-location">
            📍 {site.district}, {site.state}
          </div>
          {!compact && (
            <p className="site-card-desc">{site.description}</p>
          )}
        </div>

        {!compact && (
          <div className="site-card-footer">
            <span className="site-card-period">{site.period}</span>
            <span className="site-card-cta">Explore →</span>
          </div>
        )}
      </div>
    </>
  );
}