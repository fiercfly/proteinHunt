import React, { useMemo } from 'react';
import { useDeals, useBrands, usePostTypes, flatDeals } from '../hooks/useDeals';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { POST_TYPES } from '../utils/constants';
import DealCard, { DealCardSkeleton } from '../components/deals/DealCard';
import DealFeed from '../components/deals/DealFeed';
import Sidebar from '../components/layout/Sidebar';

const DEFAULT_FILTERS = {
  sort: 'newest', postType: '', brand: '',
  minDiscount: '', maxPrice: '', minPrice: '',
};

export default function Home({ searchQuery }) {
  const [filters, setFilters] = useLocalStorage('ph_v1', DEFAULT_FILTERS);

  const params = useMemo(() => ({
    ...filters,
    ...(searchQuery ? { search: searchQuery } : {}),
  }), [filters, searchQuery]);

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } = useDeals(params);
  const { data: brandCounts = [] } = useBrands();
  const { data: postTypeCounts = [] } = usePostTypes();

  const deals = flatDeals(data);
  const total = data?.pages?.[0]?.pagination?.total;

  return (
    <div style={{ flex: 1 }}>

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <div style={{ padding: '44px 0 32px', position: 'relative', overflow: 'hidden' }}>

        {/* Green ambient glows */}
        <div style={{
          position: 'absolute', top: '-120px', left: '10%',
          width: '600px', height: '400px', borderRadius: '50%', pointerEvents: 'none',
          background: 'radial-gradient(ellipse, rgba(255,230,0,0.08) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', top: '-60px', right: '5%',
          width: '350px', height: '350px', borderRadius: '50%', pointerEvents: 'none',
          background: 'radial-gradient(ellipse, rgba(255,230,0,0.05) 0%, transparent 70%)',
        }} />

        <div className="container" style={{ position: 'relative' }}>

          {/* Live badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            background: 'rgba(255,230,0,0.08)', border: '1px solid rgba(255,230,0,0.20)',
            borderRadius: 99, padding: '4px 12px', marginBottom: 18,
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)',
              boxShadow: '0 0 6px var(--accent)',
              animation: 'pulseDot 2s ease infinite', display: 'inline-block',
            }} />
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.58rem', fontWeight: 600,
              letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--accent)',
            }}>
              Live · @protein_deals1
            </span>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display)', fontWeight: 800,
            fontSize: 'clamp(1.9rem, 5.5vw, 3.2rem)',
            color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.05,
            marginBottom: 10,
          }}>
            Protein deals,{' '}
            <span style={{ color: 'var(--accent)' }}>scraped fresh.</span>
          </h1>

          <p style={{
            fontFamily: 'var(--font-sans)', fontSize: '0.95rem',
            color: 'var(--slate)', marginBottom: 28, maxWidth: 480,
          }}>
            Whey, creatine, pre-workout &amp; more — every deal from @protein_deals1, parsed and ranked.
          </p>

          {/* Post type filter pills */}
          <div style={{ display: 'flex', gap: 7, overflowX: 'auto', paddingBottom: 4 }}
            className="no-scrollbar">
            {POST_TYPES.map(pt => {
              const count = postTypeCounts.find(p => p.name === pt.id)?.count;
              const isActive = filters.postType === pt.id;
              return (
                <button
                  key={pt.id}
                  onClick={() => setFilters(f => ({ ...f, postType: pt.id }))}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    fontFamily: 'var(--font-sans)', fontSize: '0.76rem', fontWeight: isActive ? 700 : 500,
                    padding: '5px 14px', borderRadius: 99, whiteSpace: 'nowrap',
                    cursor: 'pointer', transition: 'all 0.13s',
                    border: `1px solid ${isActive ? 'var(--accent)' : 'rgba(255,255,255,0.12)'}`,
                    background: isActive ? 'var(--accent)' : 'rgba(255,255,255,0.04)',
                    color: isActive ? '#000' : 'var(--slate)',
                  }}
                >
                  {pt.label}
                  {count != null && !isActive && (
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.60rem', color: 'var(--muted)', marginLeft: 2 }}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── MAIN GRID ────────────────────────────────────────────── */}
      <div className="container" style={{ paddingTop: 8, paddingBottom: 64 }}>

        {/* Section heading + active filter chips */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 18, flexWrap: 'wrap', gap: 8,
        }}>
          <div>
            <h2 style={{
              fontFamily: 'var(--font-display)', fontWeight: 700,
              fontSize: '1.1rem', color: '#fff', letterSpacing: '-0.01em',
            }}>
              {searchQuery
                ? `Results for "${searchQuery}"`
                : filters.postType
                  ? `${POST_TYPES.find(p => p.id === filters.postType)?.label || filters.postType}`
                  : filters.brand
                    ? `${filters.brand} deals`
                    : 'All posts'
              }
            </h2>
            {!isLoading && total != null && (
              <p style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.60rem',
                color: 'var(--muted)', letterSpacing: '0.04em', marginTop: 3,
              }}>
                {total.toLocaleString('en-IN')} posts
              </p>
            )}
          </div>

          {/* Active filter chips */}
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
            {filters.brand && (
              <button
                style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.72rem', padding: '3px 10px', borderRadius: 99, cursor: 'pointer', border: '1px solid var(--accent-border)', background: 'var(--accent-dim)', color: 'var(--accent)', fontFamily: 'var(--font-sans)' }}
                onClick={() => setFilters(f => ({ ...f, brand: '' }))}
              >
                {filters.brand} ×
              </button>
            )}
            {filters.minDiscount && (
              <button
                style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.72rem', padding: '3px 10px', borderRadius: 99, cursor: 'pointer', border: '1px solid var(--accent-border)', background: 'var(--accent-dim)', color: 'var(--accent)', fontFamily: 'var(--font-sans)' }}
                onClick={() => setFilters(f => ({ ...f, minDiscount: '' }))}
              >
                {filters.minDiscount}%+ off ×
              </button>
            )}
            {filters.maxPrice && (
              <button
                style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.72rem', padding: '3px 10px', borderRadius: 99, cursor: 'pointer', border: '1px solid var(--accent-border)', background: 'var(--accent-dim)', color: 'var(--accent)', fontFamily: 'var(--font-sans)' }}
                onClick={() => setFilters(f => ({ ...f, maxPrice: '', minPrice: '' }))}
              >
                ≤₹{Number(filters.maxPrice).toLocaleString('en-IN')} ×
              </button>
            )}
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'var(--sidebar-w) 1fr',
          gap: 22, alignItems: 'flex-start',
        }} className="home-grid">
          <Sidebar filters={filters} onChange={setFilters} brandCounts={brandCounts} />
          <main>
            <DealFeed
              deals={deals} isLoading={isLoading}
              isFetchingNextPage={isFetchingNextPage}
              hasNextPage={hasNextPage} fetchNextPage={fetchNextPage}
            />
          </main>
        </div>
      </div>

      <style>{`
        @media (max-width: 800px) {
          .home-grid { grid-template-columns: 1fr !important; }
          .home-grid > aside { display: none !important; }
        }
      `}</style>
    </div>
  );
}