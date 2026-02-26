import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { dealsApi } from '../utils/api';
import useAuthStore from '../store/authStore';
import { POST_TYPES, BRANDS } from '../utils/constants';
import { LoginRequired } from '../components/ui/EmptyState';
import toast from 'react-hot-toast';

function Label({ children, required }) {
  return (
    <label style={{
      display: 'block', fontSize: '0.75rem', fontWeight: 600,
      color: 'var(--slate)', marginBottom: 6, letterSpacing: '-0.01em',
    }}>
      {children}
      {required && <span style={{ color: 'var(--danger)', marginLeft: 2 }}>*</span>}
    </label>
  );
}

export default function SubmitDeal() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', link: '', price: '',
    originalPrice: '', store: '', brand: '', postType: 'Deal', image: '',
  });

  const set = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    if (!form.title.trim()) { toast.error('Title is required'); return; }
    if (!form.link.trim()) { toast.error('Deal link is required'); return; }
    setLoading(true);
    try {
      await dealsApi.submit({
        ...form,
        price: form.price ? Number(form.price) : null,
        originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
        category: 'Protein',
      });
      toast.success('Submitted! It will appear shortly.');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Submission failed');
    }
    setLoading(false);
  };

  if (!user) return (
    <div className="container" style={{ paddingTop: 80, paddingBottom: 80 }}>
      <LoginRequired message="Sign in to submit a deal" />
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 60 }}>
      <div className="container" style={{ paddingTop: 36, maxWidth: 600 }}>

        <div style={{ marginBottom: 28 }}>
          {/* Live badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            background: 'rgba(255,230,0,0.08)', border: '1px solid rgba(255,230,0,0.20)',
            borderRadius: 99, padding: '4px 12px', marginBottom: 14,
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)',
              boxShadow: '0 0 6px var(--accent)', animation: 'pulseDot 2s ease infinite',
            }} />
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.58rem',
              fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase',
              color: 'var(--accent)',
            }}>Share a protein deal</span>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display)', fontWeight: 800,
            fontSize: '1.6rem', letterSpacing: '-0.02em', color: 'var(--ink)', marginBottom: 6,
          }}>
            Submit a deal
          </h1>
          <p style={{ fontSize: '0.82rem', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
            Found a great protein or supplement deal? Share it with the community.
          </p>
        </div>

        <form onSubmit={submit} style={{
          background: 'rgba(255,230,0,0.03)',
          border: '1px solid rgba(255,230,0,0.12)',
          borderRadius: 'var(--r-xl)', padding: '28px 24px',
          boxShadow: 'var(--shadow-md)', display: 'flex', flexDirection: 'column', gap: 18,
        }}>
          {/* Title */}
          <div>
            <Label required>Product title</Label>
            <input name="title" type="text" className="input"
              placeholder="e.g. MuscleBlaze Whey Gold 2kg Chocolate"
              value={form.title} onChange={set} />
          </div>

          {/* Link */}
          <div>
            <Label required>Deal link</Label>
            <input name="link" type="url" className="input"
              placeholder="https://amazon.in/…"
              value={form.link} onChange={set} />
          </div>

          {/* Post type + Brand */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <Label>Post type</Label>
              <select name="postType" className="input" value={form.postType} onChange={set}
                style={{ cursor: 'pointer' }}>
                {POST_TYPES.filter(p => p.id).map(p => (
                  <option key={p.id} value={p.id}>{p.label}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Brand</Label>
              <select name="brand" className="input" value={form.brand} onChange={set}
                style={{ cursor: 'pointer' }}>
                <option value="">Select brand…</option>
                {BRANDS.filter(b => b.id).map(b => (
                  <option key={b.id} value={b.id}>{b.label}</option>
                ))}
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Store + Prices */}
          <div>
            <Label>Store / Retailer</Label>
            <input name="store" type="text" className="input"
              placeholder="Amazon, Healthkart, Myprotein…"
              value={form.store} onChange={set} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <Label>Deal price (₹)</Label>
              <input name="price" type="number" className="input"
                placeholder="e.g. 1799"
                value={form.price} onChange={set}
                style={{ fontFamily: 'var(--font-mono)' }} />
            </div>
            <div>
              <Label>MRP / Original (₹)</Label>
              <input name="originalPrice" type="number" className="input"
                placeholder="e.g. 2999"
                value={form.originalPrice} onChange={set}
                style={{ fontFamily: 'var(--font-mono)' }} />
            </div>
          </div>

          {/* Description */}
          <div>
            <Label>Details (optional)</Label>
            <textarea name="description" className="input" rows={3}
              placeholder="Coupon code, offer details, flavours available…"
              value={form.description} onChange={set} />
          </div>

          {/* Image URL */}
          <div>
            <Label>Product image URL (optional)</Label>
            <input name="image" type="url" className="input"
              placeholder="https://…"
              value={form.image} onChange={set} />
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <button type="submit" className="btn btn-lg"
              disabled={loading}
              style={{
                flex: 1, justifyContent: 'center',
                background: 'var(--accent)', color: '#000',
                boxShadow: loading ? 'none' : '0 2px 12px rgba(255,230,0,0.25)',
              }}>
              {loading ? 'Submitting…' : 'Submit deal'}
            </button>
            <Link to="/" className="btn btn-outline btn-lg">Cancel</Link>
          </div>
        </form>
      </div>

      <style>{`
        .input:focus { border-color: var(--accent) !important; box-shadow: 0 0 0 3px var(--accent-dim) !important; }
      `}</style>
    </div>
  );
}