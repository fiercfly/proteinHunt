import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dealsApi, userApi } from '../../utils/api';
import { formatPrice, timeAgo, isNew, isExpiringSoon } from '../../utils/helpers';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';
import './DealCard.css';

/* ── Protein icon placeholder ────────────────────────────────────── */
const ProteinIcon = () => (
  <svg width="28" height="28" fill="none" viewBox="0 0 24 24"
    stroke="var(--accent)" strokeWidth="1.4">
    <path d="M6.5 6.5a6 6 0 1 0 8.49 8.49" />
    <path d="M17.5 17.5a6 6 0 1 0-8.49-8.49" />
  </svg>
);

/* ── postType badge colours ──────────────────────────────────────── */
const TYPE = {
  Deal: { bg: 'rgba(34,197,94,0.15)', color: '#22c55e', label: 'Deal' },
  Restock: { bg: 'rgba(59,130,246,0.15)', color: '#60a5fa', label: 'Restock' },
  PriceDrop: { bg: 'rgba(234,179,8,0.15)', color: '#facc15', label: 'Price Drop' },
  Review: { bg: 'rgba(168,85,247,0.15)', color: '#c084fc', label: 'Review' },
  Freebie: { bg: 'rgba(236,72,153,0.15)', color: '#f472b6', label: 'Freebie' },
  Update: { bg: 'rgba(148,163,184,0.12)', color: '#94a3b8', label: 'Update' },
  Other: { bg: 'rgba(148,163,184,0.10)', color: '#64748b', label: 'Other' },
};

/* ── Skeleton ─────────────────────────────────────────────────────── */
export function DealCardSkeleton({ index = 0 }) {
  return (
    <div className="pc" style={{ animationDelay: `${index * 55}ms`, pointerEvents: 'none' }}>
      <div style={{ aspectRatio: '1/1', background: 'rgba(255,255,255,0.04)' }} className="skeleton" />
      <div className="pc__body">
        <div style={{ display: 'flex', gap: 5 }}>
          <div className="skeleton" style={{ width: 58, height: 10, borderRadius: 3 }} />
          <div className="skeleton" style={{ width: 38, height: 10, borderRadius: 3, marginLeft: 'auto' }} />
        </div>
        <div className="skeleton" style={{ width: 64, height: 10, borderRadius: 3 }} />
        <div className="skeleton" style={{ width: '88%', height: 14, borderRadius: 4 }} />
        <div className="skeleton" style={{ width: '70%', height: 14, borderRadius: 4 }} />
        <div className="skeleton" style={{ width: '100%', height: 58, borderRadius: 6 }} />
        <div style={{ display: 'flex', gap: 5 }}>
          {[52, 44, 60].map((w, i) => <div key={i} className="skeleton" style={{ width: w, height: 17, borderRadius: 99 }} />)}
        </div>
        <div className="skeleton" style={{ width: '100%', height: 32, borderRadius: 8 }} />
      </div>
    </div>
  );
}

/* ── Product Card ─────────────────────────────────────────────────── */
export default function DealCard({ deal, index = 0 }) {
  const { user } = useAuthStore();
  const [votes, setVotes] = useState(deal.votes || 0);
  const [voted, setVoted] = useState(false);
  const [saved, setSaved] = useState(false);
  const [imgErr, setImgErr] = useState(false);
  const [voting, setVoting] = useState(false);

  // Lazy Loading State
  const [inView, setInView] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
          observer.disconnect(); // Once loaded, keep it loaded
        }
      },
      { rootMargin: '600px' } // Load slightly before it comes into view
    );
    if (cardRef.current) {
      observer.observe(cardRef.current);
    }
    return () => observer.disconnect();
  }, []);

  const dealNew = isNew(deal.createdAt);
  const expiring = isExpiringSoon(deal.expiresAt);
  const hasImage = !!(deal.image) && !imgErr;
  const t = TYPE[deal.postType] || TYPE.Deal;

  const savedRs = deal.originalPrice && deal.price && deal.originalPrice > deal.price
    ? Math.round(deal.originalPrice - deal.price) : null;

  const fullMsg = deal.rawText?.trim() || deal.description?.trim() || null;

  const handleVote = async (e) => {
    e.preventDefault(); e.stopPropagation();
    if (!user) { toast.error('Login to vote'); return; }
    if (voting) return;
    setVoting(true);
    const was = voted;
    setVoted(!was); setVotes(v => was ? v - 1 : v + 1);
    try { await dealsApi.vote(deal._id); }
    catch { setVoted(was); setVotes(v => was ? v + 1 : v - 1); }
    setVoting(false);
  };

  const handleSave = async (e) => {
    e.preventDefault(); e.stopPropagation();
    if (!user) { toast.error('Login to save'); return; }
    const was = saved; setSaved(!was);
    try { await userApi.toggleSave(deal._id); toast.success(was ? 'Removed' : 'Saved!'); }
    catch { setSaved(was); }
  };

  if (!inView) {
    return (
      <div ref={cardRef}>
        <DealCardSkeleton index={index} />
      </div>
    );
  }

  return (
    <article
      ref={cardRef}
      className={['pc anim-fade-up pc--protein', dealNew && 'pc--new'].filter(Boolean).join(' ')}
      style={{ animationDelay: `${Math.min(index, 9) * 55}ms` }}
    >
      {/* IMAGE */}
      <Link to={`/deal/${deal._id}`} tabIndex={-1} style={{ display: 'block' }}>
        <div className="pc__img">
          {hasImage ? (
            <img src={deal.image} alt={deal.title} loading="lazy" onError={() => setImgErr(true)} />
          ) : (
            <div className="pc__img-placeholder">
              <div className="pc__img-placeholder-icon"><ProteinIcon /></div>
              {(deal.brand || deal.store) && (
                <span className="pc__img-placeholder-label">{deal.brand || deal.store}</span>
              )}
            </div>
          )}
          <div className="pc__price-badge">
            {deal.price != null
              ? <span className="pc__price">{formatPrice(deal.price)}</span>
              : <span className="pc__price-na">Price N/A</span>
            }
          </div>
          {deal.discount != null && <span className="pc__off-badge">-{deal.discount}%</span>}
          {expiring && <div className="pc__expiring">Ending soon</div>}
        </div>
      </Link>

      {/* BODY */}
      <div className="pc__body">

        {/* postType · store · time */}
        <div className="pc__meta">
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.56rem', fontWeight: 700,
            letterSpacing: '0.06em', textTransform: 'uppercase',
            background: t.bg, color: t.color,
            padding: '2px 7px', borderRadius: 5, flexShrink: 0,
          }}>{t.label}</span>
          {deal.store && deal.store !== 'Unknown' && (
            <><span className="pc__dot" /><span className="pc__store">{deal.store}</span></>
          )}
          <span className="pc__time">{timeAgo(deal.createdAt)}</span>
        </div>

        {deal.brand && <div className="pc__brand">{deal.brand}</div>}

        <Link to={`/deal/${deal._id}`} style={{ textDecoration: 'none' }}>
          <h3 className="pc__title">{deal.title}</h3>
        </Link>

        {deal.keyFeatures?.length > 0 && (
          <div className="pc__features">
            {deal.keyFeatures.map((f, i) => <span key={i} className="pc__feature">{f}</span>)}
          </div>
        )}

        {fullMsg && <p className="pc__desc">{fullMsg}</p>}

        {(deal.originalPrice || savedRs) && (
          <div className="pc__pricing">
            {deal.originalPrice != null && deal.originalPrice > (deal.price ?? 0) && (
              <span className="pc__mrp">MRP {formatPrice(deal.originalPrice)}</span>
            )}
            {savedRs && (
              <span className="pc__save">Save ₹{savedRs.toLocaleString('en-IN')}</span>
            )}
          </div>
        )}

        <div className="pc__actions">
          <a href={deal.link || '#'} target="_blank" rel="noopener noreferrer"
            className="btn btn-primary btn-sm pc__cta"
            onClick={e => !deal.link && e.preventDefault()}>
            Get deal →
          </a>
          <button onClick={handleSave} className={`pc__icon-btn ${saved ? 'saved' : ''}`}
            title={saved ? 'Unsave' : 'Save'} aria-label="Save">
            <svg width="13" height="13" viewBox="0 0 24 24"
              fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
          </button>
          <Link to={`/deal/${deal._id}`} className="pc__icon-btn" title="Details">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 3h6v6" /><path d="M10 14 21 3" />
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            </svg>
          </Link>
          <button onClick={handleVote} className={`pc__vote ${voted ? 'voted' : ''}`}
            disabled={voting} aria-label={`${votes} votes`}>
            <span className="arrow">▲</span>
            <span className="count">{votes}</span>
          </button>
        </div>
      </div>
    </article>
  );
}