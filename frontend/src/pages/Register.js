import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authApi } from '../utils/api';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';
import { AuthShell, Field, ErrorMsg } from './Login';

export default function Register() {
  const [form,    setForm]    = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const { setAuth }           = useAuthStore();
  const navigate              = useNavigate();
  const location              = useLocation();
  const from                  = location.state?.from || '/';

  const set = e => { setForm(p => ({ ...p, [e.target.name]: e.target.value })); setError(''); };

  const submit = async e => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) { setError('All fields required'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const data = await authApi.register(form);
      setAuth(data);
      toast.success('Account created');
      navigate(from, { replace: true });
    } catch (err) { setError(err.response?.data?.error || 'Registration failed'); }
    setLoading(false);
  };

  return <AuthShell title="Create account" sub="Free — save deals and vote">
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {[
        { name: 'name',     label: 'Name',     type: 'text',     ph: 'Your name',        auto: 'name'         },
        { name: 'email',    label: 'Email',     type: 'email',    ph: 'you@example.com',  auto: 'email'        },
        { name: 'password', label: 'Password',  type: 'password', ph: 'Min 6 characters', auto: 'new-password' },
      ].map((f, i) => (
        <Field key={f.name} label={f.label}>
          <input name={f.name} type={f.type} className="input" placeholder={f.ph}
            value={form[f.name]} onChange={set} autoComplete={f.auto} autoFocus={i === 0} />
        </Field>
      ))}
      {error && <ErrorMsg>{error}</ErrorMsg>}
      <button type="submit" className="btn btn-primary btn-lg" disabled={loading}
        style={{ justifyContent: 'center', marginTop: 4 }}>
        {loading ? 'Creating account…' : 'Create account'}
      </button>
    </form>
    <p style={{ textAlign: 'center', marginTop: 20, fontSize: '0.82rem', color: 'var(--muted)' }}>
      Already have an account?{' '}
      <Link to="/login" state={{ from }} style={{ color: 'var(--accent)', fontWeight: 500 }}>
        Sign in
      </Link>
    </p>
  </AuthShell>;
}