import React from 'react';

// Base skeleton block
function Bone({ w, h, radius = 8, style = {} }) {
  return (
    <div
      className="skeleton"
      style={{ width: w, height: h, borderRadius: radius, flexShrink: 0, ...style }}
    />
  );
}

// ── Deal card skeleton ─────────────────────────────────────────────────────────
export function DealCardSkeleton({ index = 0 }) {
  return (
    <div
      className="skeleton-card anim-fade-in"
      style={{
        display:       'flex',
        background:    'var(--surface)',
        border:        '1px solid var(--border)',
        borderRadius:  14,
        overflow:      'hidden',
        animationDelay:`${index * 60}ms`,
        minHeight:     112,
      }}
    >
      {/* Image zone */}
      <Bone w={96} h="auto" radius={0} style={{ flexShrink: 0 }} />

      {/* Body */}
      <div style={{ flex: 1, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <Bone w={64} h={20} />
          <Bone w={44} h={20} radius={99} />
        </div>
        <Bone w="88%" h={16} />
        <Bone w="66%" h={16} />
        <div style={{ display: 'flex', gap: 8, marginTop: 2 }}>
          <Bone w={72} h={24} />
          <Bone w={52} h={22} radius={6} />
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 2 }}>
          <Bone w="55%" h={32} radius={9} />
          <Bone w={32}  h={32} radius={8} />
        </div>
      </div>

      {/* Vote column */}
      <div style={{ padding: '12px 10px', display: 'flex', alignItems: 'center' }}>
        <Bone w={36} h={52} radius={10} />
      </div>
    </div>
  );
}

// ── Feed skeleton (multiple cards) ────────────────────────────────────────────
export function FeedSkeleton({ count = 6 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {Array.from({ length: count }).map((_, i) => (
        <DealCardSkeleton key={i} index={i} />
      ))}
    </div>
  );
}

// ── Deal detail page skeleton ──────────────────────────────────────────────────
export function DetailSkeleton() {
  return (
    <div>
      {/* Breadcrumb */}
      <Bone w={220} h={13} style={{ marginBottom: 22 }} />

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 280px',
        gap: 20,
      }}>
        {/* Main card */}
        <div style={{
          background:   'var(--surface)',
          border:       '1px solid var(--border)',
          borderRadius: 16,
          overflow:     'hidden',
        }}>
          <Bone w="100%" h={220} radius={0} />
          <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <Bone w={72} h={22} radius={7} />
              <Bone w={56} h={22} radius={99} />
              <Bone w={48} h={22} radius={99} />
            </div>
            <Bone w="80%" h={28} />
            <Bone w="60%" h={24} />
            <Bone w="100%" h={72} radius={12} />
            <Bone w="70%" h={16} />
            <Bone w="50%" h={14} />
          </div>
        </div>

        {/* Action panel */}
        <div style={{
          background:   'var(--surface)',
          border:       '1px solid var(--border)',
          borderRadius: 14,
          padding:      20,
          display:      'flex',
          flexDirection:'column',
          gap:          10,
          alignSelf:    'flex-start',
        }}>
          <Bone w="60%" h={40} style={{ margin: '0 auto' }} />
          <Bone w="100%" h={44} radius={12} />
          <Bone w="100%" h={40} radius={10} />
        </div>
      </div>
    </div>
  );
}

// ── Sidebar skeleton ───────────────────────────────────────────────────────────
export function SidebarSkeleton() {
  return (
    <div style={{
      background:   'var(--surface)',
      border:       '1px solid var(--border)',
      borderRadius: 14,
      padding:      18,
      display:      'flex',
      flexDirection:'column',
      gap:          14,
    }}>
      <Bone w="50%" h={16} />
      {Array.from({ length: 4 }).map((_, i) => <Bone key={i} w="90%" h={32} />)}
      <Bone w="100%" h={1} radius={0} style={{ background: 'var(--border)', margin: '4px 0' }} />
      <Bone w="40%" h={14} />
      {Array.from({ length: 3 }).map((_, i) => <Bone key={i} w="75%" h={28} />)}
    </div>
  );
}

// ── Ticker skeleton ────────────────────────────────────────────────────────────
export function TickerSkeleton() {
  return (
    <div style={{
      background: 'var(--ink)',
      height:     34,
      display:    'flex',
      alignItems: 'center',
      padding:    '0 16px',
      gap:        16,
    }}>
      {Array.from({ length: 4 }).map((_, i) => (
        <Bone key={i} w={120 + i * 20} h={14} style={{ opacity: 0.3 }} />
      ))}
    </div>
  );
}