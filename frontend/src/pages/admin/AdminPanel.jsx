import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { apiGet } from '@/lib/api';
import AdminDashboard from './AdminDashboard';

export default function AdminPanel() {
  const location = useLocation();
  const navigate = useNavigate();
  const [authState, setAuthState] = useState(location.state?.user ? 'in' : null);
  const [user, setUser] = useState(location.state?.user || null);

  useEffect(() => {
    if (location.state?.user) return;
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

  useEffect(() => {
    if (authState === 'out') navigate('/login', { replace: true, state: { from: '/adcom-admin' } });
  }, [authState, navigate]);

  if (authState !== 'in') {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border border-white/20 border-t-[#E11D2E] animate-spin" />
      </div>
    );
  }

  return <AdminDashboard user={user} onSignedOut={() => { setUser(null); setAuthState('out'); navigate('/login', { replace: true }); }} />;
}
