import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, Lock } from 'lucide-react';
import { apiGet } from '@/lib/api';
import AdminDashboard from './AdminDashboard';

// REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
function goToGoogleAuth() {
  const redirectUrl = window.location.origin + '/adcom-admin';
  window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
}

export default function AdminPanel() {
  const location = useLocation();
  const navigate = useNavigate();
  const [authState, setAuthState] = useState(location.state?.user ? 'in' : null); // null | 'in' | 'out'
  const [user, setUser] = useState(location.state?.user || null);

  useEffect(() => {
    if (location.state?.user) return; // AuthCallback passed user
    (async () => {
      try {
        const u = await apiGet('/auth/me');
        setUser(u);
        setAuthState('in');
      } catch {
        setAuthState('out');
      }
    })();
  }, [location.state]);

  if (authState === null) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border border-white/20 border-t-[#E11D2E] animate-spin" />
      </div>
    );
  }

  if (authState === 'out') {
    return (
      <div className="min-h-screen bg-black text-white overflow-hidden relative flex items-center justify-center px-6">
        <div className="absolute inset-0 opacity-40 pointer-events-none"
             style={{ backgroundImage: 'radial-gradient(circle at 30% 40%, rgba(225,29,46,0.16), transparent 55%)' }} />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative max-w-md w-full text-center"
        >
          <div className="inline-flex items-center gap-2 adam-mono text-[10px] uppercase tracking-[0.3em] text-[#F43F5E] mb-8">
            <Lock size={12} /> Adcom Control
          </div>
          <h1 className="font-display text-4xl md:text-5xl tracking-tight leading-[1.05] mb-4">
            Signed access only.
          </h1>
          <p className="text-white/60 mb-10 leading-relaxed">
            The Adcom control room is restricted to studio staff. Sign in with your allowlisted Google account to continue.
          </p>
          <button
            data-testid="admin-google-signin"
            onClick={goToGoogleAuth}
            className="group inline-flex items-center gap-3 px-7 py-4 rounded-full bg-white text-black text-sm font-semibold hover:bg-[#F43F5E] hover:text-white transition-colors"
          >
            Continue with Google
            <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
          <div className="mt-10 text-[11px] font-mono uppercase tracking-[0.28em] text-white/30">
            Not staff? <a href="/" className="hover:text-white transition-colors">Back to site →</a>
          </div>
        </motion.div>
      </div>
    );
  }

  return <AdminDashboard user={user} onSignedOut={() => { setUser(null); setAuthState('out'); navigate('/adcom-admin', { replace: true }); }} />;
}
