import React, { useRef, useState, useCallback, useEffect } from 'react';
import { debounce } from '../../utils/helpers';

export default function SearchBar({ value, onChange, placeholder = 'Search deals…' }) {
  const ref               = useRef(null);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const h = e => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault(); ref.current?.focus();
      }
      if (e.key === 'Escape') ref.current?.blur();
    };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, []);

  const debounced = useCallback(debounce(onChange, 280), [onChange]);
  const handleChange = e => debounced(e.target.value);

  return (
    <div style={{
      display:      'flex',
      alignItems:   'center',
      background:   'var(--surface)',
      border:       `1px solid ${focused ? 'var(--accent)' : 'var(--border-strong)'}`,
      borderRadius: 'var(--radius)',
      padding:      '0 12px',
      gap:          8,
      boxShadow:    focused ? '0 0 0 3px rgba(79,110,247,0.10)' : 'none',
      transition:   'border-color 0.16s, box-shadow 0.16s',
      height:       38,
    }}>
      <svg width="14" height="14" fill="none" viewBox="0 0 24 24"
           stroke="var(--muted)" strokeWidth="2" style={{ flexShrink: 0 }}>
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
      </svg>

      <input
        ref={ref}
        type="search"
        defaultValue={value}
        onChange={handleChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        style={{
          flex:       1, border: 'none', outline: 'none',
          background: 'transparent', fontFamily: 'var(--font-sans)',
          fontSize:   '0.875rem', color: 'var(--ink)', minWidth: 0,
        }}
      />

      {!focused && !value && (
        <kbd style={{
          fontFamily:    'var(--font-mono)',
          fontSize:      '0.6rem', color: 'var(--muted)',
          background:    'var(--surface-3)',
          border:        '1px solid var(--border-strong)',
          borderRadius:  4, padding: '1px 5px', flexShrink: 0,
        }}>/</kbd>
      )}

      {value && (
        <button onClick={() => { onChange(''); ref.current.value = ''; ref.current.focus(); }}
          style={{
            background: 'var(--surface-3)', border: 'none', borderRadius: '50%',
            width: 16, height: 16, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--slate)', flexShrink: 0, fontSize: '0.6rem',
          }}>✕</button>
      )}
    </div>
  );
}