import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import './styles/global.css';
import './styles/animations.css';
import './styles/utilities.css';

import Header    from './components/layout/Header';
import Footer    from './components/layout/Footer';
import Ticker    from './components/ui/Ticker';
import { ToastProvider } from './components/ui/Toast';

import Home       from './pages/Home';
import DealPage   from './pages/DealPage';
import SavedDeals from './pages/SavedDeals';
import SubmitDeal from './pages/SubmitDeal';
import Login      from './pages/Login';
import Register   from './pages/Register';

import useAuthStore from './store/authStore';
import { authApi }  from './utils/api';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
  },
});

// ── Bootstrap auth from saved token on first load ─────────────────────────────
function AuthBoot({ children }) {
  const { token, setUser, logout, setReady } = useAuthStore();

  useEffect(() => {
    if (!token) { setReady(); return; }
    authApi.me()
      .then(d  => { setUser(d.user); setReady(); })
      .catch(() => { logout(); setReady(); });
  }, []); // eslint-disable-line

  return children;
}

// ── Scroll to top on every route change ──────────────────────────────────────
function ScrollTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [pathname]);
  return null;
}

// ── App shell — owns search state shared between Header and Home ──────────────
function Shell() {
  const [searchQuery, setSearch] = useState('');
  const { pathname }             = useLocation();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <ScrollTop />
      <Ticker />
      <Header
        onSearch={setSearch}
        searchValue={searchQuery}
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Routes>
          <Route path="/"         element={<Home searchQuery={pathname === '/' ? searchQuery : ''} />} />
          <Route path="/deal/:id" element={<DealPage />} />
          <Route path="/saved"    element={<SavedDeals />} />
          <Route path="/submit"   element={<SubmitDeal />} />
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*"         element={
            <div className="container text-center" style={{ paddingTop: 80, paddingBottom: 80 }}>
              <div style={{ fontSize: '3rem', marginBottom: 12 }}>🗺️</div>
              <h2 className="font-display" style={{ fontWeight: 800, marginBottom: 8 }}>404</h2>
              <p className="text-muted" style={{ marginBottom: 24 }}>Page not found.</p>
              <a href="/" className="btn btn-fire" style={{ textDecoration: 'none' }}>
                Go Home
              </a>
            </div>
          } />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthBoot>
          <ToastProvider />
          <Shell />
        </AuthBoot>
      </BrowserRouter>
    </QueryClientProvider>
  );
}