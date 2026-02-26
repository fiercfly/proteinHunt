import React from 'react';
import { getDiscountLevel, getStoreColor, CATEGORY_MAP } from '../../utils/constants';

// ── Discount Badge ─────────────────────────────────────────────────────────────
export function DiscountBadge({ discount, solid = false, size = 'md' }) {
  if (!discount) return null;
  const level = getDiscountLevel(discount);
  const sizes = { sm: '0.62rem', md: '0.72rem', lg: '0.9rem' };
  const pads  = { sm: '2px 6px', md: '3px 9px', lg: '5px 14px' };

  return (
    <span
      className={`badge badge-discount badge-${level} ${solid && level !== 'low' ? 'solid' : ''}`}
      style={{ fontSize: sizes[size], padding: pads[size] }}
    >
      {discount}% off
    </span>
  );
}

// ── Store Badge ────────────────────────────────────────────────────────────────
export function StoreBadge({ store, size = 'md' }) {
  if (!store || store === 'Unknown') return null;
  const color = getStoreColor(store);
  const sizes = { sm: '0.62rem', md: '0.7rem', lg: '0.82rem' };

  return (
    <span style={{
      fontSize:   sizes[size],
      fontWeight: 700,
      color,
      background: color + '15',
      border:     `1px solid ${color}25`,
      padding:    size === 'sm' ? '2px 6px' : '3px 9px',
      borderRadius: 7,
      whiteSpace: 'nowrap',
    }}>
      {store}
    </span>
  );
}

// ── Source Badge ───────────────────────────────────────────────────────────────
export function SourceBadge({ source, size = 'sm' }) {
  const labels = {
    telegram: '✈ TG',
    reddit:   '🔸 Reddit',
    manual:   '👤 User',
  };
  const sizes = { sm: '0.62rem', md: '0.72rem' };

  return (
    <span
      className={`badge badge-source-${source}`}
      style={{ fontSize: sizes[size] }}
    >
      {labels[source] || source}
    </span>
  );
}

// ── Category Badge ─────────────────────────────────────────────────────────────
export function CategoryBadge({ category, size = 'sm' }) {
  const cat   = CATEGORY_MAP[category];
  const sizes = { sm: '0.7rem', md: '0.8rem' };

  return (
    <span style={{
      display:     'inline-flex',
      alignItems:  'center',
      gap:         4,
      fontSize:    sizes[size],
      fontWeight:  500,
      color:       'var(--slate)',
      background:  'var(--whisper)',
      border:      '1px solid var(--border)',
      padding:     size === 'sm' ? '2px 8px' : '4px 10px',
      borderRadius: 99,
      whiteSpace:  'nowrap',
    }}>
      {cat?.emoji || '🏷️'} {cat?.label || category}
    </span>
  );
}

// ── New Badge ──────────────────────────────────────────────────────────────────
export function NewBadge() {
  return (
    <span style={{
      fontFamily:     'var(--font-display)',
      fontSize:       '0.55rem',
      fontWeight:     700,
      letterSpacing:  '0.1em',
      background:     'var(--leaf)',
      color:          'white',
      padding:        '2px 7px',
      borderRadius:   5,
    }}>
      NEW
    </span>
  );
}

// ── Verified Badge ─────────────────────────────────────────────────────────────
export function VerifiedBadge() {
  return (
    <span title="Verified deal" style={{
      fontSize: '0.75rem',
      color:    'var(--leaf)',
    }}>
      ✓
    </span>
  );
}