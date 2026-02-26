import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

const SearchInput = React.forwardRef(function SearchInput({ value, onChange, onClear }, ref) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8, height: 36, padding: '0 12px',
      background: focused ? 'rgba(255,230,0,0.07)' : 'rgba(255,255,255,0.04)',
      border: `1px solid ${focused ? 'var(--accent-border)' : 'rgba(255,255,255,0.10)'}`,
      borderRadius: '10px',
      boxShadow: focused ? '0 0 0 3px var(--accent-dim)' : 'none',
      transition: 'all 0.15s',
    }}>
      <svg width="13" height="13" fill="none" viewBox="0 0 24 24"
        stroke="var(--muted)" strokeWidth="2.2" style={{ flexShrink: 0 }}>
        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
      </svg>
      <input
        ref={ref} type="text" value={value} onChange={onChange}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        placeholder="Search protein, brands, products…"
        style={{
          flex: 1, minWidth: 0, border: 'none', outline: 'none',
          background: 'transparent', fontFamily: 'var(--font-sans)',
          fontSize: '0.84rem', color: 'var(--ink)',
        }}
      />
      {value
        ? <button onClick={onClear} style={{ width: 16, height: 16, borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,0.15)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.52rem', color: 'var(--slate)', flexShrink: 0 }}>✕</button>
        : <kbd style={{ fontFamily: 'var(--font-mono)', fontSize: '0.52rem', color: 'var(--muted)', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 4, padding: '1px 5px', flexShrink: 0 }}>/</kbd>
      }
    </div>
  );
});

export default function Header({ onSearch, searchValue }) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenu] = useState(false);
  const [mobSearch, setMob] = useState(false);
  const [input, setInput] = useState(searchValue || '');
  const menuRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 4);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);
  useEffect(() => {
    const h = e => { if (!menuRef.current?.contains(e.target)) setMenu(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  useEffect(() => { setMenu(false); setMob(false); }, [location.pathname]);
  useEffect(() => {
    const h = e => {
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
        e.preventDefault(); setMob(true); setTimeout(() => inputRef.current?.focus(), 60);
      }
    };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, []);

  const handleSearch = e => { setInput(e.target.value); onSearch(e.target.value); };
  const clearSearch = () => { setInput(''); onSearch(''); inputRef.current?.focus(); };
  const handleLogout = () => { logout(); toast.success('Logged out'); navigate('/'); };

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: scrolled ? 'rgba(8,8,8,0.94)' : 'rgba(8,8,8,0.75)',
      backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      borderBottom: `1px solid ${scrolled ? 'rgba(255,230,0,0.12)' : 'rgba(255,255,255,0.05)'}`,
      boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.5)' : 'none',
      transition: 'all 0.2s',
    }}>
      <div className="container">
        <div style={{ height: 'var(--header-h)', display: 'flex', alignItems: 'center', gap: 14 }}>

          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 9, flexShrink: 0 }}>
            <div style={{
              width: 30, height: 30,
              background: 'linear-gradient(135deg, var(--accent), #eab308)',
              borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 12px rgba(255,230,0,0.35)',
            }}>
              {/* Dumbbell icon */}
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#000" strokeWidth="2.2">
                <path d="M6.5 6.5a6 6 0 1 0 8.49 8.49" />
                <path d="M17.5 17.5a6 6 0 1 0-8.49-8.49" />
              </svg>
            </div>
            <div>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1rem', letterSpacing: '-0.01em', color: '#fff' }}>
                ProteinHunt
              </span>
            </div>
          </Link>

          {/* Search — desktop */}
          <div style={{ flex: 1, maxWidth: 420 }} className="hdr-desk-search">
            <SearchInput ref={inputRef} value={input} onChange={handleSearch} onClear={clearSearch} />
          </div>

          {/* Right nav */}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 7 }}>
            {/* Mobile search toggle */}
            <button className="btn btn-ghost btn-sm hdr-mob-srch"
              onClick={() => { setMob(m => !m); setTimeout(() => inputRef.current?.focus(), 60); }}
              style={{ padding: '6px 8px', color: 'var(--ink-2)' }}>
              <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
            </button>

            <Link to="/submit" className="btn btn-sm hdr-submit-btn" style={{
              background: 'var(--accent)', color: '#000',
              boxShadow: '0 2px 10px rgba(255,230,0,0.25)',
            }}>
              + Submit
            </Link>

            {user ? (
              <div style={{ position: 'relative' }} ref={menuRef}>
                <button onClick={() => setMenu(m => !m)} style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  padding: '4px 10px 4px 4px', borderRadius: 99,
                  border: '1px solid rgba(255,230,0,0.20)',
                  background: 'rgba(255,230,0,0.06)',
                  cursor: 'pointer', backdropFilter: 'blur(8px)',
                }}>
                  <span style={{
                    width: 26, height: 26, borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--accent), #eab308)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-mono)', fontSize: '0.68rem', fontWeight: 700, color: '#000',
                  }}>{user.name?.[0]?.toUpperCase() || 'U'}</span>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.82rem', fontWeight: 500, color: 'var(--ink-2)' }} className="hdr-uname">
                    {user.name?.split(' ')[0]}
                  </span>
                </button>
                {menuOpen && (
                  <div className="anim-slide-down" style={{
                    position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                    background: 'rgba(10,10,10,0.97)', backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,230,0,0.12)',
                    borderRadius: 12, boxShadow: 'var(--shadow-lg)',
                    minWidth: 164, overflow: 'hidden', zIndex: 60,
                  }}>
                    {[{ to: '/saved', label: 'Saved deals' }, { to: '/submit', label: 'Submit a deal' }].map(item => (
                      <Link key={item.to} to={item.to} style={{ display: 'block', padding: '11px 16px', fontSize: '0.83rem', fontWeight: 500, color: 'var(--ink-2)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,230,0,0.07)'}
                        onMouseLeave={e => e.currentTarget.style.background = ''}>
                        {item.label}
                      </Link>
                    ))}
                    <button onClick={handleLogout} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '11px 16px', border: 'none', background: 'none', fontSize: '0.83rem', fontWeight: 500, color: 'var(--red)', fontFamily: 'var(--font-sans)', cursor: 'pointer' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--red-dim)'}
                      onMouseLeave={e => e.currentTarget.style.background = ''}>
                      Log out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 5 }}>
                <Link to="/login" className="btn btn-glass btn-sm">Login</Link>
                <Link to="/register" className="btn btn-sm btn-primary">Sign up</Link>
              </div>
            )}
          </div>
        </div>

        {mobSearch && (
          <div className="anim-slide-down" style={{ paddingBottom: 10 }}>
            <SearchInput ref={inputRef} value={input} onChange={handleSearch} onClear={clearSearch} />
          </div>
        )}
      </div>

      <style>{`
        .hdr-desk-search { display: none; }
        .hdr-mob-srch    { display: flex; }
        @media (min-width: 600px) {
          .hdr-desk-search { display: block; }
          .hdr-mob-srch    { display: none !important; }
        }
        @media (max-width: 480px) {
          .hdr-uname      { display: none; }
          .hdr-submit-btn { display: none !important; }
        }
      `}</style>
    </header>
  );
}