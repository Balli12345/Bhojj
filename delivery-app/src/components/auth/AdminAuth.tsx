import React, { useState } from 'react';
import { AuthLayout } from './AuthLayout';
import { useApp } from '../../context/AppContext';
import { SHOW_DEMO_LOGIN } from './roleLock';
import { 
  ShieldCheck, 
  Mail, 
  KeyRound, 
  Sparkles, 
  ArrowRight, 
  LockKeyhole, 
  Sliders, 
  Database 
} from 'lucide-react';

export const AdminAuth: React.FC = () => {
  const { login } = useApp();

  const [email, setEmail] = useState('');
  const [securityKey, setSecurityKey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await login(email, 'admin', securityKey);
    setLoading(false);
    if (!res.success) {
      setError(res.message || 'Unauthorized admin access.');
    }
  };

  const handleDemoFill = () => {
    setEmail('admin@bhojj.in');
    setSecurityKey('password');
  };

  return (
    <AuthLayout
      title="Platform Master Terminal"
      subtitle="Restricted command center for Bhojj network monitoring, verification of restaurant partners, and rider fleet management."
      badge="Super Admin Portal"
      roleType="admin"
      roleIcon={<ShieldCheck className="w-4 h-4" />}
      bannerGradient="from-purple-900 via-indigo-950 to-slate-950"
      bulletPoints={[
        "Real-time platform GMV & cross-kitchen order stream",
        "KYC & FSSAI approval terminal for new restaurants",
        "Rider fleet performance & dispute settlement",
        "Platform fee commission setting & payout audit",
      ]}
    >
      <div className="max-w-md mx-auto w-full">
        
        <div className="flex items-center gap-3 mb-6 p-3 rounded-2xl bg-purple-50/80 border border-purple-200/60">
          <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold shrink-0">
            <LockKeyhole className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm">Restricted Admin Authentication</h3>
            <p className="text-xs text-slate-500">Authorized personnel & platform executives only.</p>
          </div>
        </div>

        {/* Demo Box */}
        <div hidden={!SHOW_DEMO_LOGIN} className="mb-5 p-3 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-between text-xs text-purple-900">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
            <div>
              <span className="font-bold">1-Click Test Admin:</span>
              <span className="text-purple-800 ml-1">Badal Rai (Super Admin)</span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleDemoFill}
            className="px-2.5 py-1 bg-white hover:bg-purple-100 rounded-md font-bold text-purple-800 border border-purple-300 shadow-2xs transition-colors shrink-0"
          >
            Auto Fill
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-xs border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Admin Identity Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@bhojj.in"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Master Security Key / Password
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={securityKey}
                onChange={(e) => setSecurityKey(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-slate-400 shrink-0" />
            <span>Admins manage all users, verify kitchens, view GMV, and track live order flow.</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl font-bold text-white bg-slate-950 hover:bg-slate-900 active:scale-[0.99] transition-all shadow-md shadow-slate-900/20 flex items-center justify-center gap-2 text-sm"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                <span>Access Master Admin Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

      </div>
    </AuthLayout>
  );
};
