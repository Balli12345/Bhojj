/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { PortalSwitcherModal } from './components/common/PortalSwitcherModal';
import { NotificationToast } from './components/common/NotificationToast';
import { RealtimeAlertBanner } from './components/common/RealtimeAlertBanner';
import { ProductDetailsModal } from './components/customer/ProductDetailsModal';
import { RestaurantDetailsModal } from './components/customer/RestaurantDetailsModal';
import { CategoryDetailsModal } from './components/customer/CategoryDetailsModal';
import { CustomerMobileBottomNav } from './components/customer/CustomerMobileBottomNav';

// Auth Pages
import { CustomerAuth } from './components/auth/CustomerAuth';
import { RestaurantAuth } from './components/auth/RestaurantAuth';
import { DeliveryAuth } from './components/auth/DeliveryAuth';
import { AdminAuth } from './components/auth/AdminAuth';

// Dashboards
import { CustomerDashboard } from './components/customer/CustomerDashboard';
import { RestaurantDashboard } from './components/restaurant/RestaurantDashboard';
import { DeliveryDashboard } from './components/delivery/DeliveryDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';

const MainRouter: React.FC = () => {
  const { currentView, setCurrentView } = useApp();

  // Support direct URL routing to super admin login via ?admin, #admin or /admin-login
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const search = window.location.search.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const path = window.location.pathname.toLowerCase();
      if (search.includes('admin') || hash.includes('admin') || path.includes('admin')) {
        setCurrentView('admin_login');
      }

      // Also listen to hashchange
      const handleHashChange = () => {
        if (window.location.hash.toLowerCase().includes('admin')) {
          setCurrentView('admin_login');
        }
      };
      window.addEventListener('hashchange', handleHashChange);
      return () => window.removeEventListener('hashchange', handleHashChange);
    }
  }, [setCurrentView]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800 antialiased selection:bg-orange-500 selection:text-white">
      <Header />
      <RealtimeAlertBanner />
      <PortalSwitcherModal />
      <NotificationToast />
      <ProductDetailsModal />
      <RestaurantDetailsModal />
      <CategoryDetailsModal />

      <main className="flex-1">
        {/* Customer Views */}
        {currentView === 'customer_login' && <CustomerAuth mode="login" />}
        {currentView === 'customer_register' && <CustomerAuth mode="register" />}
        {currentView === 'customer_dashboard' && <CustomerDashboard />}

        {/* Restaurant Views */}
        {currentView === 'restaurant_login' && <RestaurantAuth mode="login" />}
        {currentView === 'restaurant_register' && <RestaurantAuth mode="register" />}
        {currentView === 'restaurant_dashboard' && <RestaurantDashboard />}

        {/* Delivery Rider Views */}
        {currentView === 'delivery_login' && <DeliveryAuth mode="login" />}
        {currentView === 'delivery_register' && <DeliveryAuth mode="register" />}
        {currentView === 'delivery_dashboard' && <DeliveryDashboard />}

        {/* Super Admin Views */}
        {currentView === 'admin_login' && <AdminAuth mode="login" />}
        {currentView === 'admin_register' && <AdminAuth mode="register" />}
        {currentView === 'admin_dashboard' && <AdminDashboard />}
      </main>

      <CustomerMobileBottomNav />
      <Footer />
    </div>
  );
};

export default function App({ initialView }: { initialView?: string }) {
  return (
    <AppProvider initialView={initialView}>
      <MainRouter />
    </AppProvider>
  );
}

