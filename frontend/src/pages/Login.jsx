import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { apiGet, apiPost } from '@/lib/api';

// REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
function goToGoogleAuth() {
  const redirectUrl = window.location.origin + '/adcom-admin';
  window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
}

const STATES = { IDLE: 'idle', AUTHENTICATING: 'authenticating', GRANTED: 'granted', DENIED: 'denied' };

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [status, setStatus] = useState(STATES.IDLE);
  const [error, setError] = useState('');

  // If already signed in, bounce to admin
  useEffect(() => {
    apiGet('/auth/me').then(() => navigate('/adcom-admin', { replace: true })).catch(() => {});
  }, [navigate]);

  const submit = async (e) => {
    e?.preventDefault?.();
    if (!email || !password || status === STATES.AUTHENTICATING) return;
    setError('');
    setStatus(STATES.AUTHENTICATING);
    try {
      await apiPost('/auth/login', { email: email.trim(), password });
      setStatus(STATES.GRANTED);
      const dest = location.state?.from || '/adcom-admin';
      setTimeout(() => navigate(dest, { replace: true }), 900);
    } catch (err) {
      setStatus(STATES.DENIED);
      setError(err.message === 'Too many attempts. Try again in 15 minutes.' ? err.message : '');
      setTimeout(() => setStatus(STATES.IDLE), 2400);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative flex items-center justify-center px-6">
      {/* ambient */}
      <div className="absolute inset-0 pointer-events-none opacity-60"
           style={{ backgroundImage: 'radial-gradient(circle at 30% 30%, rgba(225,29,46,0.14), transparent 55%), radial-gradient(circle at 80% 80%, rgba(225,29,46,0.06), transparent 55%)' }} />
      <div className="absolute inset-0 pointer-events-none"
           style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 adam-mono text-[10px] uppercase tracking-[0.32em] text-[#F43F5E] mb-6">
            <ShieldCheck size={12} /> Internal Access
          </div>
          <div className="font-display text-5xl md:text-6xl tracking-[-0.03em] leading-none">
            ADAM
          </div>
          <div className="adam-mono text-[10px] uppercase tracking-[0.4em] text-white/40 mt-3">
            Authorized personnel only.
          </div>
        </div>

        <AnimatePresence mode="wait">
          {status === STATES.AUTHENTICATING && (
            <motion.div key="auth" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-8" data-testid="login-authenticating">
              <div className="w-12 h-12 mx-auto mb-6 rounded-full border border-[#E11D2E]/40 border-t-[#E11D2E] animate-spin" />
              <div className="adam-mono text-[11px] uppercase tracking-[0.32em] text-[#F43F5E]">Authenticating…</div>
            </motion.div>
          )}
          {status === STATES.GRANTED && (
            <motion.div key="granted" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="text-center py-8" data-testid="login-granted">
              <div className="mx-auto w-14 h-14 rounded-full border border-[#F43F5E]/50 bg-[#F43F5E]/10 flex items-center justify-center mb-6">
                <ShieldCheck size={22} className="text-[#F43F5E]" />
              </div>
              <div className="font-display text-2xl tracking-tight mb-2">Access granted.</div>
              <div className="adam-mono text-[10px] uppercase tracking-[0.3em] text-white/50">Opening control room…</div>
            </motion.div>
          )}
          {(status === STATES.IDLE || status === STATES.DENIED) && (
            <motion.form key="form" onSubmit={submit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4" data-testid="login-form">
              <label className="block">
                <div className="adam-mono text-[10px] uppercase tracking-[0.28em] text-white/45 mb-2">Email</div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  placeholder="you@adcommedia.com"
                  data-testid="login-email"
                  disabled={status === STATES.DENIED}
                  className="w-full px-4 py-3.5 rounded-xl bg-black/40 border border-white/12 focus:border-[#F43F5E] outline-none text-white placeholder:text-white/25 backdrop-blur-sm transition-colors"
                />
              </label>
              <label className="block">
                <div className="adam-mono text-[10px] uppercase tracking-[0.28em] text-white/45 mb-2">Password</div>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    data-testid="login-password"
                    disabled={status === STATES.DENIED}
                    className="w-full px-4 py-3.5 pr-11 rounded-xl bg-black/40 border border-white/12 focus:border-[#F43F5E] outline-none text-white placeholder:text-white/25 backdrop-blur-sm transition-colors"
                  />
                  <button type="button" onClick={() => setShowPw((v) => !v)} tabIndex={-1} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors" aria-label="Show password">
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </label>

              <AnimatePresence>
                {status === STATES.DENIED && (
                  <motion.div
                    key="denied"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    data-testid="login-denied"
                    className="rounded-xl border border-[#F43F5E]/40 bg-[#F43F5E]/10 px-4 py-3"
                  >
                    <div className="adam-mono text-[10px] uppercase tracking-[0.3em] text-[#F43F5E] mb-1">Access denied</div>
                    <div className="text-sm text-white/85">{error || 'Invalid credentials.'}</div>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={!email || !password || status === STATES.DENIED}
                data-testid="login-submit"
                className="group w-full inline-flex items-center justify-center gap-3 px-6 py-4 rounded-full bg-[#E11D2E] text-white font-semibold text-sm tracking-wide hover:bg-[#ff2f45] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Access ADAM
                <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>

              <div className="pt-2 flex items-center gap-3">
                <div className="flex-1 h-px bg-white/10" />
                <span className="adam-mono text-[9px] uppercase tracking-[0.3em] text-white/30">Or</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              <button
                type="button"
                onClick={goToGoogleAuth}
                data-testid="login-google"
                className="w-full inline-flex items-center justify-center gap-3 px-5 py-3 rounded-full border border-white/15 text-white/85 text-sm hover:bg-white/5 transition-colors"
              >
                <Lock size={14} /> Continue with Google
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        <div className="mt-10 text-center adam-mono text-[9px] uppercase tracking-[0.32em] text-white/25">
          <a href="/" className="hover:text-white/70 transition-colors">← Back to site</a>
        </div>
      </motion.div>
    </div>
  );
}
