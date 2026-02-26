import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { userApi } from '../utils/api';
import useAuthStore from '../store/authStore';
import DealCard, { DealCardSkeleton } from '../components/deals/DealCard';
import { LoginRequired, NoSavedDeals } from '../components/ui/EmptyState';

export default function SavedDeals() {
  const { user } = useAuthStore();

  const { data: deals = [], isLoading } = useQuery({
    queryKey: ['saved'],
    queryFn:  userApi.getSaved,
    enabled:  !!user,
  });

  if (!user) return (
    <div className="container" style={{ paddingTop: 80, paddingBottom: 80 }}>
      <LoginRequired message="Sign in to view saved deals" />
    </div>
  );

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 52, maxWidth: 860 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontWeight: 800,
          fontSize: '1.6rem', letterSpacing: '-0.02em', color: 'var(--ink)', marginBottom: 4,
        }}>
          Saved deals
        </h1>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--muted)', letterSpacing: '0.02em' }}>
          {isLoading ? '' : `${deals.length} saved`}
        </p>
      </div>

      {isLoading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
          {Array.from({ length: 4 }).map((_, i) => <DealCardSkeleton key={i} index={i} />)}
        </div>
      ) : deals.length === 0 ? (
        <NoSavedDeals />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
          {deals.map((deal, i) => <DealCard key={deal._id} deal={deal} index={i} />)}
        </div>
      )}
    </div>
  );
}
