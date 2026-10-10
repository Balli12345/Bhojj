import React, { useEffect, useState } from 'react';
import { Clock, LogOut, RefreshCw, ShieldCheck, UtensilsCrossed } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { bhojjApi } from '../../services/bhojjApi';
import type { PortalView, User } from '../../types';
import { RoleLockContext, type LockedRole } from './roleLock';
import { RestaurantAuth } from './RestaurantAuth';
import { DeliveryAuth } from './DeliveryAuth';
import { AdminAuth } from './AdminAuth';
import { RestaurantDashboard } from '../restaurant/RestaurantDashboard';
import { DeliveryDashboard } from '../delivery/DeliveryDashboard';
import { AdminDashboard } from '../admin/AdminDashboard';
import { NotificationToast } from '../common/NotificationToast';
import { RealtimeAlertBanner } from '../common/RealtimeAlertBanner';

const ROLE_LABEL: Record<LockedRole, string> = {
  restaurant: 'Restaurant Partner',
  delivery: 'Delivery Partner',
  admin: 'Super Admin',
};

const BhojjLogo: React.FC<{ subtitle: string }> = ({ subtitle }) => (
  <div className="flex items-center gap-2 min-w-0">
    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-orange-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20 shrink-0">
      <UtensilsCrossed className="w-5 h-5" />
    </div>
    <div className="min-w-0">
      <div className="flex items-center gap-1.5">
        <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 leading-none">bhojj</span>
        <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
          100% SATVIK
        </span>
      </div>
      <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-500 mt-0.5 truncate">{subtitle}</p>
    </div>
  </div>
);

const needsApproval = (role: LockedRole) => role === 'restaurant' || role === 'delivery';

export const RoleAppShell: React.FC<{ role: LockedRole }> = ({ role }) => {
  const { currentUser, currentView, setCurrentView, setSessionUser, logout } = useApp();
  const [checking, setChecking] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const applyServerUser = (user: User | undefined | null) => {
    if (user && user.role === role) {
      setSessionUser(user);
      setCurrentView(`${role}_dashboard` as PortalView);
    } else {
      setSessionUser(null);
      setCurrentView(`${role}_login` as PortalView);
    }
  };

  useEffect(() => {
    let cancelled = false;
    bhojjApi.me()
      .then(res => { if (!cancelled) applyServerUser(res.user as User | undefined); })
      .catch(() => { if (!cancelled) applyServerUser(null); })
      .finally(() => { if (!cancelled) setChecking(false); });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  const refreshApproval = async () => {
    setRefreshing(true);
    setStatusMessage('');
    try {
      const res = await bhojjApi.me();
      const user = res.user as User | undefined;
      applyServerUser(user);
      if (user?.approvalStatus !== 'approved') setStatusMessage('Your account is still awaiting admin approval.');
    } catch (error: any) {
      setStatusMessage(error?.message || 'Unable to reach the Bhojj server. Please try again.');
    } finally {
      setRefreshing(false);
    }
  };

  const authorized = !!currentUser && currentUser.role === role;
  const pending = authorized && needsApproval(role) && currentUser.approvalStatus !== 'approved';

  let body: React.ReactNode;
  if (checking) {
    body = (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 p-6" role="status" aria-live="polite">
        <BhojjLogo subtitle={`${ROLE_LABEL[role]} App`} />
        <span className="inline-block w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-semibold text-slate-500">Verifying your session…</p>
      </div>
    );
  } else if (!authorized) {
    const mode = currentView === `${role}_register` ? 'register' : 'login';
    body = role === 'admin' ? <AdminAuth /> : role === 'restaurant' ? <RestaurantAuth mode={mode} /> : <DeliveryAuth mode={mode} />;
  } else if (pending) {
    body = (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 text-center space-y-4">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <Clock className="w-7 h-7" />
          </div>
          <h1 className="text-xl font-black text-slate-900">Application under review</h1>
          <p className="text-sm text-slate-600">
            Thanks, {currentUser.name}. Your {role === 'restaurant' ? 'kitchen' : 'rider'} account has been created and is waiting for
            verification by the Bhojj admin team. The dashboard unlocks automatically once your account is approved.
          </p>
          {statusMessage && <p className="text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-2.5">{statusMessage}</p>}
          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <button
              type="button"
              onClick={refreshApproval}
              disabled={refreshing}
              className="flex-1 min-h-11 inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-sm font-bold"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Check approval status
            </button>
            <button
              type="button"
              onClick={logout}
              className="flex-1 min-h-11 inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 text-slate-700 text-sm font-bold hover:bg-slate-50"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>
        </div>
      </div>
    );
  } else {
    body = role === 'restaurant' ? <RestaurantDashboard /> : role === 'delivery' ? <DeliveryDashboard /> : <AdminDashboard />;
  }

  return (
    <RoleLockContext.Provider value={role}>
      <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800 antialiased">
        {authorized && !checking && (
          <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs pt-[env(safe-area-inset-top)]">
            <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-3">
              <BhojjLogo subtitle={`${ROLE_LABEL[role]} App`} />
              <div className="flex items-center gap-2 shrink-0">
                <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-slate-600">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  {currentUser.name}
                </span>
                <button
                  type="button"
                  onClick={logout}
                  aria-label="Sign out"
                  className="min-w-11 min-h-11 inline-flex items-center justify-center gap-1.5 px-3 rounded-xl border border-slate-200 text-xs font-bold text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign out</span>
                </button>
              </div>
            </div>
          </header>
        )}
        {authorized && !pending && !checking && <RealtimeAlertBanner />}
        <NotificationToast />
        <main className="flex-1 flex flex-col">{body}</main>
      </div>
    </RoleLockContext.Provider>
  );
};
