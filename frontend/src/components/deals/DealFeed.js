import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import DealCard, { DealCardSkeleton } from './DealCard';

export default function DealFeed({ deals, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage }) {
  const sentinel = useRef(null);

  const observe = useCallback((entries) => {
    if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const obs = new IntersectionObserver(observe, { rootMargin: '200px' });
    obs.observe(el);
    return () => obs.disconnect();
  }, [observe]);

  // Dynamically split and group the incoming deals
  const { groupedProtein, otherDeals } = useMemo(() => {
    const protein = [];
    const others = [];

    deals.forEach(deal => {
      // Check if it came from the protein channel OR is strictly protein categorized
      if (deal.sourceChannel?.toLowerCase().includes('protein_deals1') || deal.category === 'Protein') {
        protein.push(deal);
      } else {
        others.push(deal);
      }
    });

    // Group the protein deals by Brand (using the 'store' property)
    const grouped = protein.reduce((acc, deal) => {
      // Fallback: If it's a generic deal/update, group it together under "General Updates" 
      const brand = deal.store && deal.store !== 'Unknown'
        ? deal.store
        : (deal.brand ? deal.brand : 'Other Brands & Updates');

      if (!acc[brand]) acc[brand] = [];
      acc[brand].push(deal);
      return acc;
    }, {});

    return { groupedProtein: grouped, otherDeals: others };
  }, [deals]);


  if (isLoading) {
    return (
      <div className="feed">
        {Array.from({ length: 7 }).map((_, i) => <DealCardSkeleton key={i} index={i} />)}
      </div>
    );
  }

  if (!deals.length) {
    return (
      <div style={{ textAlign: 'center', padding: '64px 20px', color: 'var(--muted)' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🔍</div>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--slate)', marginBottom: 6 }}>
          No deals found
        </p>
        <p style={{ fontSize: '0.875rem' }}>
          Try a different filter, or check back soon — deals update constantly.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* SECTION 1: PROTEIN DEALS (Grouped by Brand) */}
      {Object.keys(groupedProtein).length > 0 && (
        <div style={{ marginBottom: 40 }}>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.5rem',
            marginBottom: 20,
            paddingBottom: 10,
            borderBottom: '2px solid var(--border)'
          }}>
            💪 Protein Deals
          </h2>

          {Object.entries(groupedProtein).map(([brand, brandDeals]) => (
            <div key={brand} style={{ marginBottom: 24 }}>
              <h3 style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem',
                color: 'var(--accent)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: 12
              }}>
                {brand} ({brandDeals.length})
              </h3>
              <div className="feed">
                {brandDeals.map((deal, i) => (
                  <DealCard key={deal._id} deal={deal} index={i} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SECTION 2: OTHER DEALS */}
      {otherDeals.length > 0 && (
        <div>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.5rem',
            marginBottom: 20,
            paddingBottom: 10,
            borderBottom: '2px solid var(--border)'
          }}>
            🔥 General Deals
          </h2>
          <div className="feed">
            {otherDeals.map((deal, i) => (
              <DealCard key={deal._id} deal={deal} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* Infinite scroll trigger */}
      <div ref={sentinel} style={{ height: 20 }} />

      {isFetchingNextPage && (
        <div className="feed" style={{ marginTop: 8 }}>
          {Array.from({ length: 3 }).map((_, i) => <DealCardSkeleton key={i} />)}
        </div>
      )}

      {!hasNextPage && deals.length > 0 && (
        <p style={{
          textAlign: 'center',
          color: 'var(--muted)',
          fontSize: '0.8rem',
          padding: '28px 0 8px',
          fontStyle: 'italic',
        }}>
          You've seen all {deals.length} deals — check back soon for more 🔥
        </p>
      )}

      <style>{`.feed { display: flex; flex-direction: column; gap: 10px; }`}</style>
    </div>
  );
}