import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid rgba(255,230,0,0.10)',
      background: 'rgba(0,0,0,0.70)',
      backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
      padding: '28px 0', marginTop: 'auto',
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 26, height: 26, borderRadius: 7,
            background: 'linear-gradient(135deg, var(--accent), #eab308)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 10px rgba(255,230,0,0.25)',
          }}>
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="#000" strokeWidth="2.2">
              <path d="M6.5 6.5a6 6 0 1 0 8.49 8.49" />
              <path d="M17.5 17.5a6 6 0 1 0-8.49-8.49" />
            </svg>
          </div>
          <div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.9rem', color: '#fff', letterSpacing: '-0.01em' }}>
              ProteinHunt
            </span>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.57rem', color: 'var(--muted)', letterSpacing: '0.04em', marginTop: 1 }}>
              Protein &amp; supplement deals · scraped from @protein_deals1
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          {[['/', 'Deals'], ['/submit', 'Submit'], ['/saved', 'Saved']].map(([to, label]) => (
            <Link key={to} to={to} style={{ fontFamily: 'var(--font-sans)', fontSize: '0.80rem', color: 'var(--muted)', transition: 'color 0.13s' }}
              onMouseEnter={e => e.target.style.color = 'var(--accent)'}
              onMouseLeave={e => e.target.style.color = 'var(--muted)'}>
              {label}
            </Link>
          ))}
        </div>

        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.04em' }}>
          Prices change fast — verify at checkout.
        </p>
      </div>
    </footer>
  );
}