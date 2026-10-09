import React, { useContext } from 'react';
import { UtensilsCrossed, ArrowLeft, Layers, ShieldCheck, CheckCircle2, Store, Bike } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RoleLockContext } from './roleLock';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  badge: string;
  roleType: string;
  roleIcon: React.ReactNode;
  bulletPoints: string[];
  bannerGradient: string;
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  title,
  subtitle,
  badge,
  roleType,
  roleIcon,
  bulletPoints,
  bannerGradient,
  children,
}) => {
  const { setPortalModalOpen, setCurrentView } = useApp();
  const lockedRole = useContext(RoleLockContext);

  return (
    <div className="min-h-[calc(100vh-4.5rem)] bg-slate-50 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[620px]">
        
        {/* Left Column: Role-Specific Showcase Banner */}
        <div className={`lg:col-span-5 p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden bg-gradient-to-br ${bannerGradient}`}>
          
          {/* Subtle background circle patterns */}
          <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-white/10 blur-2xl pointer-events-none"></div>
          <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-black/10 blur-2xl pointer-events-none"></div>

          {/* Top Branding */}
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white font-black">
                  <UtensilsCrossed className="w-5 h-5" />
                </div>
                <span className="text-2xl font-black tracking-tight">Bhojj</span>
              </div>
              {!lockedRole && (<button
                onClick={() => setPortalModalOpen(true)}
                className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-md transition-colors flex items-center gap-1.5"
                title="Switch to another portal"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Switch Portal</span>
              </button>)}
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md mb-3">
              {roleIcon}
              <span>{badge}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug">
              {title}
            </h1>
            <p className="mt-2 text-sm text-white/80 leading-relaxed">
              {subtitle}
            </p>
          </div>

          {/* Value Propositions / Bullet Points */}
          <div className="relative z-10 my-8 space-y-3">
            {bulletPoints.map((point, index) => (
              <div key={index} className="flex items-center gap-2.5 text-xs sm:text-sm text-white/90">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                </div>
                <span>{point}</span>
              </div>
            ))}
          </div>

          {/* Bottom Security Assurance */}
          <div className="relative z-10 pt-4 border-t border-white/20 flex items-center justify-between text-[11px] text-white/80">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified & Secured Bhojj Portal</span>
            </div>
            {!lockedRole && (<button
              onClick={() => setCurrentView('customer_dashboard')}
              className="hover:underline flex items-center gap-1 text-white font-medium"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Guest Explore</span>
            </button>)}
          </div>

        </div>

        {/* Right Column: Dynamic Login / Register Form */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between bg-white">
          <div>
            {children}
          </div>

          {/* Direct Portal Quick Links Footer */}
          <div className={lockedRole ? 'hidden' : 'mt-8 pt-5 border-t border-slate-100'}>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Other Bhojj Access Portals:
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              {roleType !== 'customer' && (
                <button
                  type="button"
                  onClick={() => setCurrentView('customer_login')}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors font-semibold"
                >
                  <UtensilsCrossed className="w-3 h-3" />
                  <span>Customer Login</span>
                </button>
              )}
              {roleType !== 'restaurant' && (
                <button
                  type="button"
                  onClick={() => setCurrentView('restaurant_login')}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 transition-colors font-semibold"
                >
                  <Store className="w-3 h-3" />
                  <span>Kitchen Partner</span>
                </button>
              )}
              {roleType !== 'delivery' && (
                <button
                  type="button"
                  onClick={() => setCurrentView('delivery_login')}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200 transition-colors font-semibold"
                >
                  <Bike className="w-3 h-3" />
                  <span>Delivery Rider</span>
                </button>
              )}
              {roleType !== 'admin' && (
                <button
                  type="button"
                  onClick={() => setCurrentView('admin_login')}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-200 transition-colors font-semibold"
                >
                  <ShieldCheck className="w-3 h-3" />
                  <span>Admin Console</span>
                </button>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
