import React from 'react';
import { Link } from 'react-router-dom';

export default function EmptyState({ icon, title, subtitle, action }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      textAlign: 'center', padding: '64px 24px', gap: 10,
    }}>
      {icon && (
        <div style={{ color: 'var(--fog)', marginBottom: 4 }}>{icon}</div>
      )}
      <h3 style={{
        fontFamily: 'var(--font-serif)', fontStyle: 'italic',
        fontSize: '1.2rem', fontWeight: 400, color: 'var(--slate)',
      }}>{title}</h3>
      {subtitle && (
        <p style={{ fontSize: '0.82rem', color: 'var(--muted)', maxWidth: 320, fontFamily: 'var(--font-mono)', lineHeight: 1.6 }}>
          {subtitle}
        </p>
      )}
      {action && <div style={{ marginTop: 12 }}>{action}</div>}
    </div>
  );
}

// SVG icons — no emojis
const SearchIcon = () => (
  <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.2">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
);
const BookmarkIcon = () => (
  <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.2">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
  </svg>
);
const LockIcon = () => (
  <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.2">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const AlertIcon = () => (
  <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.2">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

export function NoDealsFound({ onReset }) {
  return (
    <EmptyState
      icon={<SearchIcon />}
      title="No deals found"
      subtitle="Try a different filter or search term. Deals update constantly."
      action={onReset && (
        <button onClick={onReset} className="btn btn-outline btn-sm">Clear filters</button>
      )}
    />
  );
}

export function NoSavedDeals() {
  return (
    <EmptyState
      icon={<BookmarkIcon />}
      title="No saved deals"
      subtitle="Bookmark any deal to find it here later."
      action={<Link to="/" className="btn btn-primary btn-sm">Browse deals</Link>}
    />
  );
}

export function LoginRequired({ message = 'Sign in to continue' }) {
  return (
    <EmptyState
      icon={<LockIcon />}
      title={message}
      subtitle="Create a free account to save deals, vote, and submit your own finds."
      action={
        <div style={{ display: 'flex', gap: 8 }}>
          <Link to="/login"    className="btn btn-outline btn-sm">Sign in</Link>
          <Link to="/register" className="btn btn-primary btn-sm">Create account</Link>
        </div>
      }
    />
  );
}

export function DealNotFound() {
  return (
    <EmptyState
      icon={<AlertIcon />}
      title="Deal not found"
      subtitle="It may have expired or been removed."
      action={<Link to="/" className="btn btn-primary btn-sm">Browse deals</Link>}
    />
  );
}

export function ErrorState({ onRetry }) {
  return (
    <EmptyState
      icon={<AlertIcon />}
      title="Something went wrong"
      subtitle="Could not load deals. Check your connection and try again."
      action={onRetry && (
        <button onClick={onRetry} className="btn btn-primary btn-sm">Try again</button>
      )}
    />
  );
}

export function EndOfFeed({ count }) {
  return (
    <p style={{
      textAlign: 'center', color: 'var(--muted)',
      fontFamily: 'var(--font-mono)', fontSize: '0.68rem',
      padding: '28px 0 8px', letterSpacing: '0.04em',
    }}>
      {count} deals — check back soon
    </p>
  );
}