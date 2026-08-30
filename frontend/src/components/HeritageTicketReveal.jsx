import React, { useRef, useState } from 'react';
import './HeritageTicketReveal.css';

const DEFAULT_EVENT = {
  eyebrow: 'Admit One · Heritage Fest 2026',
  titlePrefix: 'Bharatiya',
  titleEm: 'Dharohar',
  date: '28 Nov',
  venue: 'Red Fort',
  seat: 'GA',
  modalTitle: 'Bharatiya Dharohar',
  description: "One night of living heritage — craft, cuisine and courtly music inside the Red Fort's eastern courtyard.",
  tiers: [
    { label: 'General', price: '₹499' },
    { label: 'Heritage Circle', price: '₹1,499' },
  ],
  note: 'Passes are limited · 28 Nov, Gate 03',
};

const THRESHOLD = 90;

export default function HeritageTicketReveal({
  variant = 'section',      // 'section' | 'promo'
  event = DEFAULT_EVENT,
  title = 'Festival Passes',
  eyebrowLabel = 'The Heritage Circle',
  onReserve,
}) {
  const ticketRef = useRef(null);
  const sealLeftRef = useRef(null);
  const sealRightRef = useRef(null);
  const dragState = useRef({ dragging: false, startX: 0, startY: 0, dy: 0 });

  const [dragging, setDragging] = useState(false);
  const [floating, setFloating] = useState(true);
  const [unsealed, setUnsealed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [hintHidden, setHintHidden] = useState(false);

  const pointerPos = (e) => {
    if (e.touches && e.touches[0]) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    return { x: e.clientX, y: e.clientY };
  };

  const onDown = (e) => {
    dragState.current.dragging = true;
    const p = pointerPos(e);
    dragState.current.startX = p.x;
    dragState.current.startY = p.y;
    setFloating(false);
    setDragging(true);
    setHintHidden(true);
  };

  const onMove = (e) => {
    if (!dragState.current.dragging) return;
    const p = pointerPos(e);
    const dx = p.x - dragState.current.startX;
    const dy = p.y - dragState.current.startY;
    const progress = Math.min(1, Math.max(0, dy / THRESHOLD));
    const rotate = -1.4 + Math.max(-16, Math.min(16, dx * 0.1));
    if (ticketRef.current) {
      ticketRef.current.style.transform = `translate(${dx}px, ${Math.max(0, dy)}px) rotate(${rotate}deg)`;
    }
    if (sealLeftRef.current) sealLeftRef.current.style.transform = `rotate(${-14 * progress}deg) translateX(${-4 * progress}px)`;
    if (sealRightRef.current) sealRightRef.current.style.transform = `rotate(${14 * progress}deg) translateX(${4 * progress}px)`;
    dragState.current.dy = dy;
  };

  const resetTicket = () => {
    if (ticketRef.current) ticketRef.current.style.transform = `translate(0px,0px) rotate(-1.4deg)`;
    if (sealLeftRef.current) sealLeftRef.current.style.transform = 'rotate(0deg)';
    if (sealRightRef.current) sealRightRef.current.style.transform = 'rotate(0deg)';
    setTimeout(() => setFloating(true), 300);
    setTimeout(() => setHintHidden(false), 600);
  };

  const onUp = () => {
    if (!dragState.current.dragging) return;
    dragState.current.dragging = false;
    setDragging(false);

    if (dragState.current.dy > THRESHOLD) {
      setUnsealed(true);
      setShowModal(true);
    } else {
      resetTicket();
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setUnsealed(false);
    resetTicket();
  };

  const handleReserve = () => {
    onReserve?.(event);
    handleClose();
  };

  const rootClass = `htr-root ${variant === 'promo' ? 'htr-promo' : 'htr-section'}`;

  return (
    <div className={rootClass}>
      {variant === 'section' && (
        <div className="htr-headline">
          <div className="eyebrow">{eyebrowLabel}</div>
          <h2>{title}</h2>
          <div className="rule" />
        </div>
      )}

      <div className="htr-ticket-wrap">
        <div
          ref={ticketRef}
          className={`htr-ticket ${dragging ? 'dragging' : ''} ${floating ? 'floating' : ''} ${unsealed ? 'unsealed' : ''}`}
          onMouseDown={onDown}
          onMouseMove={onMove}
          onMouseUp={onUp}
          onMouseLeave={onUp}
          onTouchStart={onDown}
          onTouchMove={onMove}
          onTouchEnd={onUp}
        >
          <div className="htr-ticket-main">
            <div>
              <div className="htr-ticket-eyebrow">{event.eyebrow}</div>
              <div className="htr-ticket-title">{event.titlePrefix}<br /><em>{event.titleEm}</em></div>
            </div>
            <div className="htr-ticket-meta">
              <div><label>Date</label><span>{event.date}</span></div>
              <div><label>Venue</label><span>{event.venue}</span></div>
              <div><label>Seat</label><span>{event.seat}</span></div>
            </div>
          </div>
          <div className="htr-ticket-stub">
            <div className="htr-hole top" />
            <span>Heritage Fest</span>
            <div className="htr-hole bottom" />
          </div>
          <div className="htr-seal">
            <div ref={sealLeftRef} className="htr-seal-half left">
              <svg viewBox="0 0 52 52"><circle cx="26" cy="26" r="25" fill="#C9A84C" stroke="#04080F" strokeWidth="1" /></svg>
            </div>
            <div ref={sealRightRef} className="htr-seal-half right">
              <svg viewBox="0 0 52 52"><circle cx="26" cy="26" r="25" fill="#C9A84C" stroke="#04080F" strokeWidth="1" /></svg>
            </div>
          </div>
        </div>
      </div>

      <div className={`htr-hint ${hintHidden ? 'hide' : ''}`}>
        <span>Drag down to break the seal</span>
      </div>

      <div className={`htr-modal-backdrop ${showModal ? 'show' : ''}`}>
        <div className="htr-modal">
          <button className="htr-close-x" onClick={handleClose}>✕</button>
          <div className="htr-rule-sm" />
          <h3>{event.modalTitle}</h3>
          <p className="htr-desc">{event.description}</p>
          <div className="htr-tiers">
            {event.tiers.map((t) => (
              <div className="htr-tier" key={t.label}>
                <label>{t.label}</label>
                <span>{t.price}</span>
              </div>
            ))}
          </div>
          <button className="htr-cta" onClick={handleReserve}>Reserve Your Seat</button>
          <div className="htr-modal-note">{event.note}</div>
        </div>
      </div>
    </div>
  );
}
