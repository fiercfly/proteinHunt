import { Toaster, toast as hotToast } from 'react-hot-toast';

// ── Toaster component — place once in App.js ───────────────────────────────────
export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      gutter={8}
      containerStyle={{ top: 'calc(var(--header-h) + 34px + 8px)' }}
      toastOptions={{
        duration: 2800,
        style: {
          fontFamily:   'var(--font-body)',
          fontSize:     '0.875rem',
          fontWeight:   500,
          borderRadius: '12px',
          boxShadow:    'var(--shadow-lg)',
          border:       '1px solid var(--border)',
          background:   'var(--surface)',
          color:        'var(--ink)',
          padding:      '10px 14px',
          maxWidth:     340,
        },
        success: {
          iconTheme: { primary: 'var(--leaf)',  secondary: 'white' },
          duration:  2400,
        },
        error: {
          iconTheme: { primary: 'var(--ember)', secondary: 'white' },
          duration:  3200,
        },
      }}
    />
  );
}

// ── Toast helpers — use these instead of calling hotToast directly ─────────────
export const toast = {
  success: (msg, opts) => hotToast.success(msg, opts),
  error:   (msg, opts) => hotToast.error(msg, opts),
  info:    (msg, opts) => hotToast(msg, { icon: 'ℹ️', ...opts }),
  deal:    (msg, opts) => hotToast(msg, { icon: '🔥', ...opts }),
  saved:   ()          => hotToast.success('Deal saved!',           { icon: '🔖' }),
  unsaved: ()          => hotToast('Removed from saved',            { icon: '🗑️' }),
  voted:   ()          => hotToast.success('Vote counted!',         { icon: '▲'  }),
  copied:  ()          => hotToast.success('Link copied!',          { icon: '🔗' }),
  loginRequired: ()    => hotToast.error('Log in to do that',       { icon: '🔐' }),
};

export default toast;