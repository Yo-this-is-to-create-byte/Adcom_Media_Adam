import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { apiPost } from '@/lib/api';
import Seo from '@/hooks/useSEO';

/** Completes Google OAuth: exchanges one-time code for session cookie, then opens admin. */
export default function GoogleAuthDone() {
  const navigate = useNavigate();
  const location = useLocation();
  const processed = useRef(false);
  const [error, setError] = useState('');

  useEffect(() => {
    document.body.classList.add('native-cursor');
    return () => document.body.classList.remove('native-cursor');
  }, []);

  useEffect(() => {
    if (processed.current) return;
    processed.current = true;

    const code = new URLSearchParams(location.search).get('code');
    if (!code) {
      navigate('/login?error=' + encodeURIComponent('Missing Google sign-in code'), { replace: true });
      return;
    }
    // StrictMode mounts this page twice. Only the first call should exchange.
    const guardKey = `adcom_ggl_${code}`;
    if (sessionStorage.getItem(guardKey) === '1') return;
    sessionStorage.setItem(guardKey, '1');

    (async () => {
      try {
        const data = await apiPost('/auth/google/exchange', { code });
        navigate('/adcom-admin', { replace: true, state: { user: data.user } });
      } catch (e) {
        sessionStorage.removeItem(guardKey);
        setError(e.message || 'Google sign-in failed');
        setTimeout(() => {
          navigate('/login?error=' + encodeURIComponent(e.message || 'Google sign-in failed'), { replace: true });
        }, 2500);
      }
    })();
  }, [location.search, navigate]);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <Seo title="Signing in" robots="noindex, nofollow" />
      <div className="text-center max-w-md">
        <div className="w-14 h-14 mx-auto mb-6 rounded-full border border-[#E11D2E]/40 border-t-[#E11D2E] animate-spin" />
        {error ? (
          <>
            <div className="font-display text-2xl mb-2">Authentication failed</div>
            <div className="text-sm text-white/60">{error}</div>
          </>
        ) : (
          <>
            <div className="adam-mono text-[11px] uppercase tracking-[0.3em] text-[#F43F5E] mb-2">Securing session</div>
            <div className="text-white/70">Finishing Google sign-in…</div>
          </>
        )}
      </div>
    </div>
  );
}
