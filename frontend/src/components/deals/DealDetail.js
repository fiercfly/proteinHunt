import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { dealsApi } from '../../utils/api';
import { formatPrice, timeAgo, savings, isExpiringSoon } from '../../utils/helpers';
import DealCard, { DealCardSkeleton } from './DealCard';
import { DealNotFound } from '../ui/EmptyState';

/* postType badge styles — same map as DealCard */
const TYPE = {
  Deal: { bg: 'rgba(34,197,94,0.15)', color: '#22c55e', label: 'Deal' },
  Restock: { bg: 'rgba(59,130,246,0.15)', color: '#60a5fa', label: 'Restock' },
  PriceDrop: { bg: 'rgba(234,179,8,0.15)', color: '#facc15', label: 'Price Drop' },
  Review: { bg: 'rgba(168,85,247,0.15)', color: '#c084fc', label: 'Review' },
  Freebie: { bg: 'rgba(236,72,153,0.15)', color: '#f472b6', label: 'Freebie' },
  Update: { bg: 'rgba(148,163,184,0.12)', color: '#94a3b8', label: 'Update' },
  Other: { bg: 'rgba(148,163,184,0.10)', color: '#64748b', label: 'Other' },
};

export default function DealDetail({ id }) {
  const [copied, setCopied] = useState(false);

  const { data: deal, isLoading } = useQuery({
    queryKey: ['deal', id],
    queryFn: () => dealsApi.getOne(id),
    enabled: !!id,
  });

  /* Related: same postType OR same brand — fall back to latest */
  const { data: relatedData } = useQuery({
    queryKey: ['related', deal?.brand, deal?.postType],
    queryFn: () => dealsApi.getAll({
      ...(deal?.brand ? { brand: deal.brand } : { postType: deal?.postType }),
      limit: 6,
    }),
    enabled: !!deal,
  });
  const related = relatedData?.deals?.filter(d => d._id !== id).slice(0, 4) ?? [];

  const copy = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) return <Skeleton />;
  if (!deal) return <DealNotFound />;

  const expiring = isExpiringSoon(deal.expiresAt);
  const saved = savings(deal.originalPrice, deal.price);
  const t = TYPE[deal.postType] || TYPE.Deal;

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{
        display: 'flex', gap: 6, alignItems: 'center', marginBottom: 22,
        fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
        color: 'var(--muted)', letterSpacing: '0.02em',
      }}>
        <Link to="/" style={{ color: 'var(--accent)' }}>ProteinHunt</Link>
        <span>/</span>
        <Link to={`/?postType=${deal.postType}`} style={{ color: 'var(--accent)' }}>
          {t.label}s
        </Link>
        <span>/</span>
        <span className="clamp-1" style={{ maxWidth: 220 }}>{deal.title}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 268px', gap: 20, alignItems: 'flex-start' }}
        className="detail-grid">

        {/* ── Main card ── */}
        <div style={{
          background: 'var(--surface)', border: '1px solid rgba(255,230,0,0.12)',
          borderRadius: 'var(--r-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-md)',
        }}>
          {expiring && (
            <div style={{
              background: 'var(--red)', color: 'white', padding: '8px 20px',
              fontFamily: 'var(--font-mono)', fontSize: '0.68rem',
              textAlign: 'center', letterSpacing: '0.06em',
            }}>ENDING SOON</div>
          )}

          {deal.image && (
            <div style={{
              background: 'rgba(255,230,0,0.04)', display: 'flex', alignItems: 'center',
              justifyContent: 'center', padding: 32,
              borderBottom: '1px solid rgba(255,230,0,0.10)',
            }}>
              <img src={deal.image} alt={deal.title}
                style={{ maxHeight: 200, maxWidth: '100%', objectFit: 'contain', borderRadius: 8 }} />
            </div>
          )}

          <div style={{ padding: '24px 28px 28px' }}>
            {/* Meta row */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              flexWrap: 'wrap', marginBottom: 14,
            }}>
              {/* postType pill */}
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.65rem', fontWeight: 700,
                letterSpacing: '0.08em', textTransform: 'uppercase',
                background: t.bg, color: t.color,
                padding: '3px 9px', borderRadius: 6,
              }}>{t.label}</span>

              {deal.brand && (
                <>
                  <span style={{ width: 2, height: 2, borderRadius: '50%', background: 'rgba(255,255,255,0.15)' }} />
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
                    fontWeight: 600, color: 'var(--accent)',
                  }}>{deal.brand}</span>
                </>
              )}

              {deal.store && deal.store !== 'Unknown' && (
                <>
                  <span style={{ width: 2, height: 2, borderRadius: '50%', background: 'rgba(255,255,255,0.15)' }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--slate)' }}>
                    {deal.store}
                  </span>
                </>
              )}

              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.60rem', color: 'var(--muted)',
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)',
                padding: '1px 6px', borderRadius: 4,
              }}>
                {deal.source === 'telegram' ? 'TG' : deal.source}
              </span>

              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)', marginLeft: 'auto' }}>
                {timeAgo(deal.createdAt)}
              </span>
            </div>

            {/* Title */}
            <h1 style={{
              fontFamily: 'var(--font-display)', fontWeight: 800,
              fontSize: 'clamp(1.2rem, 3vw, 1.65rem)',
              color: 'var(--ink)', lineHeight: 1.2, marginBottom: 20, letterSpacing: '-0.02em',
            }}>{deal.title}</h1>

            {/* Key features */}
            {deal.keyFeatures?.length > 0 && (
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
                {deal.keyFeatures.map((f, i) => (
                  <span key={i} style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.68rem', fontWeight: 500,
                    color: 'var(--ink-2)', background: 'rgba(255,230,0,0.08)',
                    border: '1px solid rgba(255,230,0,0.15)',
                    padding: '3px 10px', borderRadius: 99,
                  }}>{f}</span>
                ))}
              </div>
            )}

            {/* Price block */}
            <div style={{
              background: 'rgba(255,230,0,0.05)',
              border: '1px solid rgba(255,230,0,0.12)',
              borderRadius: 12, padding: '16px 20px',
              display: 'flex', alignItems: 'center', gap: 14,
              flexWrap: 'wrap', marginBottom: 20,
            }}>
              {deal.price != null && (
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: '2rem', fontWeight: 600,
                  color: 'var(--ink)', letterSpacing: '-0.03em', lineHeight: 1,
                }}>
                  {formatPrice(deal.price)}
                </span>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {deal.originalPrice && (
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.82rem',
                    color: 'var(--muted)', textDecoration: 'line-through',
                  }}>{formatPrice(deal.originalPrice)}</span>
                )}
                {saved && (
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--accent)', fontWeight: 600 }}>
                    Save {saved}
                  </span>
                )}
              </div>
              {deal.discount && (
                <span style={{
                  marginLeft: 'auto',
                  fontFamily: 'var(--font-mono)', fontSize: '0.9rem', fontWeight: 600,
                  color: 'var(--accent)', background: 'var(--accent-dim)',
                  padding: '6px 14px', borderRadius: 8,
                }}>
                  -{deal.discount}%
                </span>
              )}
            </div>

            {/* Raw message / description */}
            {(deal.rawText || deal.description) && (
              <div style={{
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 10, padding: '14px 16px', marginBottom: 16,
              }}>
                <p style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.75rem',
                  color: 'var(--slate)', lineHeight: 1.8, whiteSpace: 'pre-wrap',
                }}>
                  {deal.rawText?.trim() || deal.description}
                </p>
              </div>
            )}

            {deal.sourceChannel && (
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)', letterSpacing: '0.02em' }}>
                Source: {deal.sourceChannel}
              </p>
            )}
          </div>
        </div>

        {/* ── Sticky side panel ── */}
        <div style={{ position: 'sticky', top: 'calc(var(--header-h) + 16px)', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{
            background: 'var(--surface)', border: '1px solid rgba(255,230,0,0.15)',
            borderRadius: 'var(--r-lg)', padding: 20, boxShadow: 'var(--shadow-md)',
          }}>
            {deal.price != null && (
              <div style={{ textAlign: 'center', marginBottom: 16 }}>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: '1.9rem', fontWeight: 600,
                  color: 'var(--ink)', letterSpacing: '-0.03em', lineHeight: 1,
                }}>
                  {formatPrice(deal.price)}
                </div>
                {deal.discount && (
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.68rem',
                    fontWeight: 600, color: 'var(--accent)', display: 'inline-block', marginTop: 6,
                  }}>
                    -{deal.discount}% off
                  </span>
                )}
              </div>
            )}
            <a href={deal.link || '#'} target="_blank" rel="noopener noreferrer"
              className="btn btn-primary btn-lg"
              style={{ width: '100%', justifyContent: 'center', marginBottom: 8, textDecoration: 'none' }}
              onClick={e => !deal.link && e.preventDefault()}>
              Get deal
            </a>
            <button onClick={copy} className="btn btn-outline"
              style={{ width: '100%', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.04em' }}>
              {copied ? '✓ Copied' : 'Share link'}
            </button>
          </div>

          {deal.expiresAt && (
            <div style={{
              background: expiring ? 'var(--red-dim)' : 'var(--surface-3)',
              border: `1px solid ${expiring ? 'rgba(220,38,38,0.15)' : 'var(--border)'}`,
              borderRadius: 10, padding: '10px 14px', textAlign: 'center',
              fontFamily: 'var(--font-mono)', fontSize: '0.68rem',
              color: expiring ? 'var(--red)' : 'var(--muted)', letterSpacing: '0.04em',
            }}>
              {expiring ? 'Ending very soon' : `Expires ${timeAgo(deal.expiresAt)}`}
            </div>
          )}

          <div style={{
            background: 'rgba(255,230,0,0.04)', border: '1px solid rgba(255,230,0,0.10)',
            borderRadius: 10, padding: '10px 14px',
            fontFamily: 'var(--font-mono)', fontSize: '0.64rem',
            color: 'var(--muted)', lineHeight: 1.6, letterSpacing: '0.02em',
          }}>
            Prices may change. Verify at checkout.
          </div>
        </div>
      </div>

      {/* Related deals */}
      {related.length > 0 && (
        <div style={{ marginTop: 48 }}>
          <p style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.62rem', fontWeight: 500,
            letterSpacing: '0.14em', textTransform: 'uppercase',
            color: 'var(--muted)', marginBottom: 16,
          }}>
            {deal.brand ? `More ${deal.brand} deals` : `More ${t.label}s`}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
            {related.map((d, i) => <DealCard key={d._id} deal={d} index={i} />)}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 720px) {
          .detail-grid { grid-template-columns: 1fr !important; }
          .detail-grid > div:last-child { position: static !important; }
        }
      `}</style>
    </div>
  );
}

function Skeleton() {
  return (
    <div>
      <div className="skeleton" style={{ height: 13, width: 220, marginBottom: 22 }} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 268px', gap: 20 }}>
        <div style={{ background: 'var(--surface)', borderRadius: 18, border: '1px solid var(--border)', overflow: 'hidden' }}>
          <div className="skeleton" style={{ height: 200, borderRadius: 0 }} />
          <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <div className="skeleton" style={{ width: 60, height: 13, borderRadius: 4 }} />
              <div className="skeleton" style={{ width: 40, height: 13, borderRadius: 4 }} />
            </div>
            <div className="skeleton" style={{ height: 28, width: '75%' }} />
            <div className="skeleton" style={{ height: 68, borderRadius: 12 }} />
          </div>
        </div>
        <div style={{ background: 'var(--surface)', borderRadius: 14, border: '1px solid var(--border)', padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div className="skeleton" style={{ height: 40, width: '60%', margin: '0 auto' }} />
          <div className="skeleton" style={{ height: 42, borderRadius: 10 }} />
          <div className="skeleton" style={{ height: 38, borderRadius: 8 }} />
        </div>
      </div>
    </div>
  );
}