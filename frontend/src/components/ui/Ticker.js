import React from 'react';
import { useTicker, flatDeals } from '../../hooks/useDeals';
import { formatPrice } from '../../utils/helpers';

export default function Ticker() {
  const { data } = useTicker();
  const deals = flatDeals(data);
  if (!deals.length) return null;

  const items = [...deals, ...deals]; // double for seamless loop

  return (
    <div style={{
      background: 'rgba(255,230,0,0.06)',
      borderBottom: '1px solid rgba(255,230,0,0.12)',
      overflow: 'hidden', height: 28, display: 'flex', alignItems: 'center',
    }}>
      {/* Label */}
      <div style={{
        flexShrink: 0, padding: '0 12px',
        borderRight: '1px solid rgba(255,230,0,0.15)',
        display: 'flex', alignItems: 'center', gap: 6,
        height: '100%',
      }}>
        <span style={{
          width: 5, height: 5, borderRadius: '50%', background: 'var(--accent)',
          boxShadow: '0 0 5px var(--accent)',
          animation: 'pulseDot 2s ease infinite', flexShrink: 0,
        }} />
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.52rem', fontWeight: 700,
          letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--accent)',
          whiteSpace: 'nowrap',
        }}>LIVE</span>
      </div>

      {/* Scrolling text */}
      <div style={{ overflow: 'hidden', flex: 1 }}>
        <div style={{ display: 'flex', animation: 'ticker 40s linear infinite', width: 'max-content' }}>
          {items.map((deal, i) => (
            <a
              key={`${deal._id}-${i}`}
              href={`/deal/${deal._id}`}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '0 20px', whiteSpace: 'nowrap',
                fontFamily: 'var(--font-sans)', fontSize: '0.72rem',
                color: 'var(--slate)', textDecoration: 'none',
                transition: 'color 0.13s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--slate)'}
            >
              <span style={{ color: 'var(--muted)', fontSize: '0.60rem' }}>·</span>
              {deal.brand && (
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.60rem', color: 'var(--accent)', fontWeight: 600 }}>
                  {deal.brand}
                </span>
              )}
              <span style={{ fontWeight: 500, color: 'var(--ink-2)' }}>
                {deal.title.slice(0, 55)}{deal.title.length > 55 ? '…' : ''}
              </span>
              {deal.price != null && (
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--accent)', fontWeight: 600 }}>
                  {formatPrice(deal.price)}
                </span>
              )}
              {deal.discount != null && (
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.60rem', color: 'var(--muted)' }}>
                  -{deal.discount}%
                </span>
              )}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}