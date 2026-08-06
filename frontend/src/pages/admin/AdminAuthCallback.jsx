import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { apiPost } from '@/lib/api';

// REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
export default function AdminAuthCallback() {
  const location = useLocation();
  const navigate = useNavigate();
  const processed = useRef(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (processed.current) return;
    processed.current = true;

    const hash = location.hash || '';
    const params = new URLSearchParams(hash.startsWith('#') ? hash.slice(1) : hash);
    const sessionId = params.get('session_id');

    if (!sessionId) {
      navigate('/adcom-admin', { replace: true });
      return;
    }

    (async () => {
      try {
        const data = await apiPost('/auth/session', { session_id: sessionId });
        // Clear the hash so refresh doesn't retry
        window.history.replaceState(null, '', '/adcom-admin');
        navigate('/adcom-admin', { replace: true, state: { user: data.user } });
      } catch (e) {
        setError(e.message || 'Auth failed');
        setTimeout(() => navigate('/adcom-admin', { replace: true }), 3200);
      }
    })();
  }, [location.hash, navigate]);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
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
            <div className="text-white/70">Signing you into Adcom Control…</div>
          </>
        )}
      </div>
    </div>
  );
}
