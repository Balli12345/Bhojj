import React from 'react';
import { useApp } from '../../context/AppContext';
import { Home, Compass, Clock3, ShoppingBag, UserCircle2 } from 'lucide-react';

/**
 * Mobile-only navigation for the Customer portal.
 * This intentionally reuses the existing customer views/events so the
 * desktop/source UI remains unchanged; it only improves thumb navigation
 * inside a narrow WebView viewport.
 */
export const CustomerMobileBottomNav: React.FC = () => {
  const { currentView, setCurrentView, setIsCartOpen, cart, orders } = useApp();

  if (currentView !== 'customer_dashboard') return null;

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const activeOrders = orders.filter(
    (order) => order.status !== 'delivered' && order.status !== 'cancelled'
  ).length;

  const goTab = (tab: 'menu' | 'orders' | 'profile') => {
    setCurrentView('customer_dashboard');
    window.dispatchEvent(new CustomEvent('open-customer-tab', { detail: tab }));
  };

  return (
    <nav
      aria-label="Bhojj Customer mobile navigation"
      className="bhojj-mobile-bottom-nav fixed inset-x-0 bottom-0 z-[70] md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-xl shadow-[0_-8px_24px_rgba(15,23,42,0.10)]"
    >
      <div className="mx-auto grid h-[64px] max-w-lg grid-cols-5 items-stretch px-1">
        <button
          type="button"
          onClick={() => goTab('menu')}
          className="flex min-w-0 flex-col items-center justify-center gap-0.5 rounded-xl text-slate-500 active:bg-slate-100"
        >
          <Home className="h-5 w-5" />
          <span className="text-[10px] font-bold">Home</span>
        </button>

        <button
          type="button"
          onClick={() => goTab('menu')}
          className="flex min-w-0 flex-col items-center justify-center gap-0.5 rounded-xl text-slate-500 active:bg-slate-100"
        >
          <Compass className="h-5 w-5" />
          <span className="text-[10px] font-bold">Explore</span>
        </button>

        <button
          type="button"
          onClick={() => goTab('orders')}
          className="relative flex min-w-0 flex-col items-center justify-center gap-0.5 rounded-xl text-slate-500 active:bg-slate-100"
        >
          <Clock3 className="h-5 w-5" />
          <span className="text-[10px] font-bold">Orders</span>
          {activeOrders > 0 && (
            <span className="absolute right-[22%] top-2 min-w-4 rounded-full bg-orange-600 px-1 text-center text-[9px] font-black leading-4 text-white">
              {activeOrders > 9 ? '9+' : activeOrders}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setIsCartOpen(true)}
          className="relative flex min-w-0 flex-col items-center justify-center gap-0.5 rounded-xl text-slate-500 active:bg-slate-100"
        >
          <ShoppingBag className="h-5 w-5" />
          <span className="text-[10px] font-bold">Cart</span>
          {cartCount > 0 && (
            <span className="absolute right-[22%] top-2 min-w-4 rounded-full bg-orange-600 px-1 text-center text-[9px] font-black leading-4 text-white">
              {cartCount > 9 ? '9+' : cartCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => goTab('profile')}
          className="flex min-w-0 flex-col items-center justify-center gap-0.5 rounded-xl text-slate-500 active:bg-slate-100"
        >
          <UserCircle2 className="h-5 w-5" />
          <span className="text-[10px] font-bold">Account</span>
        </button>
      </div>
    </nav>
  );
};
