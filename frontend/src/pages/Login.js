import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authApi } from '../utils/api';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

export default function Login() {
  const [form,    setForm]    = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const { setAuth }           = useAuthStore();
  const navigate              = useNavigate();
  const location              = useLocation();
  const from                  = location.state?.from || '/';

  const set = e => { setForm(p => ({ ...p, [e.target.name]: e.target.value })); setError(''); };

  const submit = async e => {
    e.preventDefault();
    if (!form.email || !form.password) { setError('All fields required'); return; }
    setLoading(true);
    try {
      const data = await authApi.login(form);
      setAuth(data);
      toast.success(`Welcome back, ${data.user.name.split(' ')[0]}`);
      navigate(from, { replace: true });
    } catch (err) { setError(err.response?.data?.error || 'Invalid credentials'); }
    setLoading(false);
  };

  return <AuthShell title="Sign in" sub="Welcome back">
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Field label="Email">
        <input name="email" type="email" className="input" placeholder="you@example.com"
          value={form.email} onChange={set} autoFocus autoComplete="email" />
      </Field>
      <Field label="Password">
        <input name="password" type="password" className="input" placeholder="••••••••"
          value={form.password} onChange={set} autoComplete="current-password" />
      </Field>
      {error && <ErrorMsg>{error}</ErrorMsg>}
      <button type="submit" className="btn btn-primary btn-lg" disabled={loading}
        style={{ justifyContent: 'center', marginTop: 4 }}>
        {loading ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
    <p style={{ textAlign: 'center', marginTop: 20, fontSize: '0.82rem', color: 'var(--muted)' }}>
      No account?{' '}
      <Link to="/register" state={{ from }} style={{ color: 'var(--accent)', fontWeight: 500 }}>
        Create one
      </Link>
    </p>
  </AuthShell>;
}

// ── Shared auth shell ─────────────────────────────────────────────────────────
export function AuthShell({ title, sub, children }) {
  return (
    <div style={{
      minHeight: 'calc(100vh - var(--header-h) - 32px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--surface-2)', padding: '32px 16px',
    }}>
      <div className="anim-scale-in" style={{
        width: '100%', maxWidth: 380,
        background: 'var(--surface)',
        borderRadius: 'var(--r-xl)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-lg)',
        overflow: 'hidden',
      }}>
        <div style={{ height: 2, background: 'var(--accent)' }} />
        <div style={{ padding: '32px 28px 28px' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 28 }}>
            <div style={{
              width: 26, height: 26, borderRadius: 6, background: 'var(--ink)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                <path d="M10 2L4 11h5l-1 7 7-10h-5l1-6z" fill="var(--accent)"/>
              </svg>
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '0.95rem', color: 'var(--ink)' }}>
              BestDeals
            </span>
          </Link>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontStyle: 'italic',
            fontSize: '1.6rem', fontWeight: 400,
            color: 'var(--ink)', marginBottom: 4, letterSpacing: '-0.01em',
          }}>{title}</h1>
          <p style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: 26 }}>{sub}</p>
          {children}
        </div>
      </div>
    </div>
  );
}

export function Field({ label, children }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--slate)', marginBottom: 6, letterSpacing: '-0.01em' }}>
        {label}
      </label>
      {children}
    </div>
  );
}

export function ErrorMsg({ children }) {
  return (
    <div className="anim-slide-down" style={{
      fontSize: '0.78rem', color: 'var(--danger)',
      background: 'var(--danger-dim)',
      border: '1px solid rgba(220,38,38,0.15)',
      borderRadius: 8, padding: '8px 12px', fontWeight: 500,
    }}>{children}</div>
  );
}