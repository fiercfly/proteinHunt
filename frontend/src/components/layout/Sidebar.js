import React from 'react';
import { BRANDS, SORT_OPTIONS, DISCOUNT_OPTIONS, PRICE_RANGES, POST_TYPES } from '../../utils/constants';

function Label({ children }) {
  return (
    <p style={{
      fontFamily: 'var(--font-mono)', fontSize: '0.56rem', fontWeight: 500,
      letterSpacing: '0.14em', textTransform: 'uppercase',
      color: 'var(--muted)', marginBottom: 6, paddingLeft: 2,
    }}>{children}</p>
  );
}

function Row({ active, onClick, children, count, green }) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      width: '100%', padding: '7px 10px', borderRadius: 8, border: 'none',
      background: active ? (green ? 'rgba(255,230,0,0.12)' : 'rgba(255,230,0,0.10)') : 'transparent',
      color: active ? 'var(--accent)' : 'var(--slate)',
      fontFamily: 'var(--font-sans)', fontSize: '0.82rem',
      fontWeight: active ? 600 : 400,
      cursor: 'pointer', textAlign: 'left',
      borderLeft: `2px solid ${active ? 'var(--accent)' : 'transparent'}`,
      transition: 'all 0.12s',
    }}>
      <span>{children}</span>
      {count != null && (
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.60rem', color: 'var(--muted)' }}>
          {count}
        </span>
      )}
    </button>
  );
}

const DEFAULT_FILTERS = { sort: 'newest', postType: '', brand: '', minDiscount: '', maxPrice: '', minPrice: '' };

export default function Sidebar({ filters, onChange, brandCounts = [] }) {
  const set = (k, v) => onChange({ ...filters, [k]: v });

  const activePriceRange = PRICE_RANGES.find(r =>
    r.max === (filters.maxPrice || '') && (r.min || '') === (filters.minPrice || '')
  );

  return (
    <aside style={{
      background: 'rgba(255,230,0,0.03)',
      border: '1px solid rgba(255,230,0,0.12)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderRadius: 'var(--r-lg)',
      padding: '18px 14px',
      position: 'sticky',
      top: 'calc(var(--header-h) + 14px)',
      maxHeight: 'calc(100vh - var(--header-h) - 40px)',
      overflowY: 'auto',
    }} className="no-scrollbar">

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.88rem', color: 'var(--ink)', letterSpacing: '-0.01em' }}>
          Filters
        </span>
        <button
          onClick={() => onChange(DEFAULT_FILTERS)}
          style={{ fontSize: '0.70rem', fontFamily: 'var(--font-sans)', color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}
        >
          Reset
        </button>
      </div>

      {/* Sort */}
      <div style={{ marginBottom: 20 }}>
        <Label>Sort by</Label>
        {SORT_OPTIONS.map(o => (
          <Row key={o.id} active={filters.sort === o.id} onClick={() => set('sort', o.id)}>
            {o.label}
          </Row>
        ))}
      </div>

      <hr className="divider" style={{ marginBottom: 20 }} />

      {/* Post type */}
      <div style={{ marginBottom: 20 }}>
        <Label>Post type</Label>
        {POST_TYPES.map(pt => (
          <Row key={pt.id} active={filters.postType === pt.id} onClick={() => set('postType', pt.id)}>
            {pt.label}
          </Row>
        ))}
      </div>

      <hr className="divider" style={{ marginBottom: 20 }} />

      {/* Brand */}
      <div style={{ marginBottom: 20 }}>
        <Label>Brand</Label>
        {BRANDS.map(b => {
          const count = brandCounts.find(bc => bc.name === b.id)?.count;
          return (
            <Row key={b.id} active={filters.brand === b.id} onClick={() => set('brand', filters.brand === b.id ? '' : b.id)} count={count}>
              {b.label}
            </Row>
          );
        })}
      </div>

      <hr className="divider" style={{ marginBottom: 20 }} />

      {/* Price range */}
      <div style={{ marginBottom: 20 }}>
        <Label>Price range</Label>
        {PRICE_RANGES.map((r, i) => (
          <Row key={i} active={activePriceRange?.label === r.label}
            onClick={() => onChange({ ...filters, maxPrice: r.max, minPrice: r.min || '' })}>
            {r.label}
          </Row>
        ))}
        <input
          type="number" placeholder="Custom max ₹"
          value={filters.maxPrice || ''}
          onChange={e => onChange({ ...filters, maxPrice: e.target.value, minPrice: '' })}
          className="input"
          style={{ marginTop: 8, fontSize: '0.78rem', padding: '6px 10px', fontFamily: 'var(--font-mono)' }}
        />
      </div>

      <hr className="divider" style={{ marginBottom: 20 }} />

      {/* Min discount */}
      <div>
        <Label>Min discount</Label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
          {DISCOUNT_OPTIONS.map(d => (
            <button key={d.id} onClick={() => set('minDiscount', d.id)} style={{
              padding: '4px 11px', borderRadius: 99, cursor: 'pointer', transition: 'all 0.12s',
              border: `1px solid ${filters.minDiscount === d.id ? 'var(--accent-border)' : 'rgba(255,255,255,0.10)'}`,
              background: filters.minDiscount === d.id ? 'var(--accent-dim)' : 'transparent',
              color: filters.minDiscount === d.id ? 'var(--accent)' : 'var(--slate)',
              fontFamily: 'var(--font-mono)', fontSize: '0.70rem', fontWeight: 500,
            }}>{d.label}</button>
          ))}
        </div>
      </div>

    </aside>
  );
}