import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Home, Compass, Clock3, ShoppingBag, UserCircle2 } from 'lucide-react';

type NavKey = 'home' | 'explore' | 'orders' | 'account';
type CustomerTab = 'menu' | 'orders' | 'profile';

const scrollToTabs = () => {
  requestAnimationFrame(() => {
    const tabs = document.querySelector('[data-customer-tabs]');
    if (tabs) tabs.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
};

/**
 * Mobile-only navigation for the Customer portal. Reuses the existing customer
 * dashboard tabs (open-customer-tab event), cart drawer and auth views.
 */
export const CustomerMobileBottomNav: React.FC = () => {
  const { currentView, currentUser, setCurrentView, setIsCartOpen, cart, orders } = useApp();
  const [active, setActive] = useState<NavKey>('home');

  useEffect(() => {
    const onTab = (e: Event) => {
      const tab = (e as CustomEvent).detail;
      if (tab === 'orders') setActive('orders');
      else if (tab === 'profile') setActive('account');
      else if (tab === 'menu') setActive((prev) => (prev === 'explore' ? 'explore' : 'home'));
    };
    window.addEventListener('open-customer-tab', onTab);
    return () => window.removeEventListener('open-customer-tab', onTab);
  }, []);

  if (currentView !== 'customer_dashboard') return null;

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const activeOrders = orders.filter(
    (order) => order.status !== 'delivered' && order.status !== 'cancelled'
  ).length;

  const openTab = (tab: CustomerTab) => {
    setCurrentView('customer_dashboard');
    window.dispatchEvent(new CustomEvent('open-customer-tab', { detail: tab }));
  };

  const goHome = () => {
    setActive('home');
    openTab('menu');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goExplore = () => {
    setActive('explore');
    openTab('menu');
    requestAnimationFrame(() => {
      document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const goOrders = () => {
    setActive('orders');
    openTab('orders');
    scrollToTabs();
  };

  const goAccount = () => {
    setActive('account');
    if (!currentUser) {
      setCurrentView('customer_login');
      window.scrollTo({ top: 0 });
      return;
    }
    openTab('profile');
    scrollToTabs();
  };

  const itemClass = (key: NavKey) =>
    `relative flex min-h-12 min-w-0 flex-col items-center justify-center gap-0.5 rounded-xl active:bg-slate-100 focus-visible:outline-2 focus-visible:outline-orange-500 ${
      active === key ? 'text-orange-600' : 'text-slate-500'
    }`;

  const badge = (count: number) => (
    <span className="absolute right-[22%] top-1.5 min-w-4 rounded-full bg-orange-600 px-1 text-center text-[9px] font-black leading-4 text-white">
      {count > 9 ? '9+' : count}
    </span>
  );

  return (
    <nav
      aria-label="Bhojj Customer mobile navigation"
      className="bhojj-mobile-bottom-nav fixed inset-x-0 bottom-0 z-40 md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-xl shadow-[0_-8px_24px_rgba(15,23,42,0.10)]"
    >
      <div className="mx-auto grid h-16 max-w-lg grid-cols-5 items-stretch gap-0.5 px-1 py-1">
        <button type="button" onClick={goHome} aria-label="Home" aria-current={active === 'home' ? 'page' : undefined} className={itemClass('home')}>
          <Home className="h-5 w-5" />
          <span className="text-[10px] font-bold">Home</span>
        </button>

        <button type="button" onClick={goExplore} aria-label="Explore menu" aria-current={active === 'explore' ? 'page' : undefined} className={itemClass('explore')}>
          <Compass className="h-5 w-5" />
          <span className="text-[10px] font-bold">Explore</span>
        </button>

        <button
          type="button"
          onClick={goOrders}
          aria-label={activeOrders > 0 ? `Orders, ${activeOrders} active` : 'Orders'}
          aria-current={active === 'orders' ? 'page' : undefined}
          className={itemClass('orders')}
        >
          <Clock3 className="h-5 w-5" />
          <span className="text-[10px] font-bold">Orders</span>
          {activeOrders > 0 && badge(activeOrders)}
        </button>

        <button
          type="button"
          id="mobile-nav-cart-button"
          onClick={() => setIsCartOpen(true)}
          aria-label={`Cart, ${cartCount} ${cartCount === 1 ? 'item' : 'items'}`}
          className="relative flex min-h-12 min-w-0 flex-col items-center justify-center gap-0.5 rounded-xl text-slate-500 active:bg-slate-100 focus-visible:outline-2 focus-visible:outline-orange-500"
        >
          <ShoppingBag className="h-5 w-5" />
          <span className="text-[10px] font-bold">Cart</span>
          {cartCount > 0 && badge(cartCount)}
        </button>

        <button
          type="button"
          onClick={goAccount}
          aria-label={currentUser ? 'Account profile' : 'Account: sign in'}
          aria-current={active === 'account' ? 'page' : undefined}
          className={itemClass('account')}
        >
          <UserCircle2 className="h-5 w-5" />
          <span className="text-[10px] font-bold">Account</span>
        </button>
      </div>
    </nav>
  );
};
