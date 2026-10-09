import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RealtimeAlert } from '../../types';
import { soundEffects } from '../../utils/soundEffects';
import { 
  Bell, 
  Bike, 
  UtensilsCrossed, 
  Volume2, 
  VolumeX, 
  X, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  Zap
} from 'lucide-react';

interface RealtimeAlertBannerProps {
  currentRole?: 'restaurant' | 'customer' | 'delivery' | 'admin';
  restaurantId?: string;
  onNavigateToOrder?: (orderId: string) => void;
}

export const RealtimeAlertBanner: React.FC<RealtimeAlertBannerProps> = ({
  currentRole: propRole,
  restaurantId: propRestaurantId,
  onNavigateToOrder
}) => {
  const { 
    currentUser,
    currentView,
    setCurrentView,
    restaurants,
    activeAlerts, 
    dismissAlert, 
    updateOrderStatus, 
    orders 
  } = useApp();

  const [isMuted, setIsMuted] = useState(soundEffects.getMuted());

  // Determine active effective role
  const effectiveRole: 'restaurant' | 'customer' | 'delivery' | 'admin' = 
    propRole || 
    (currentView.startsWith('restaurant') ? 'restaurant' :
     currentView.startsWith('delivery') ? 'delivery' :
     currentView.startsWith('admin') ? 'admin' :
     currentUser?.role || 'customer');

  const effectiveRestaurantId = propRestaurantId || 
    (currentUser?.role === 'restaurant' 
      ? restaurants.find(r => r.ownerUserId === currentUser.id)?.id || restaurants[0]?.id
      : undefined);

  // Filter alerts relevant to this dashboard role
  const relevantAlerts = activeAlerts.filter(a => {
    if (effectiveRole === 'restaurant') {
      return a.targetRole === 'restaurant' && (!effectiveRestaurantId || a.targetRestaurantId === effectiveRestaurantId);
    }
    if (effectiveRole === 'customer') {
      return a.targetRole === 'customer';
    }
    if (effectiveRole === 'delivery') {
      return a.targetRole === 'delivery';
    }
    if (effectiveRole === 'admin') {
      return true; // Admin can monitor all alerts
    }
    return false;
  });

  const handleToggleSound = () => {
    const newState = soundEffects.toggleMute();
    setIsMuted(newState);
  };

  const handleNavigate = (orderId: string) => {
    if (onNavigateToOrder) {
      onNavigateToOrder(orderId);
      return;
    }

    if (effectiveRole === 'customer') {
      if (currentView !== 'customer_dashboard') {
        setCurrentView('customer_dashboard');
      }
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('open-customer-tab', { detail: 'orders' }));
      }, 50);
    } else if (effectiveRole === 'restaurant') {
      if (currentView !== 'restaurant_dashboard') {
        setCurrentView('restaurant_dashboard');
      }
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('open-restaurant-tab', { detail: 'orders' }));
      }, 50);
    } else if (effectiveRole === 'delivery') {
      if (currentView !== 'delivery_dashboard') {
        setCurrentView('delivery_dashboard');
      }
    }
  };

  if (relevantAlerts.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-3 sm:right-6 z-50 max-w-md w-full space-y-2 pointer-events-none">
      {relevantAlerts.slice(0, 3).map((alert, idx) => {
        const order = alert.order || orders.find(o => o.id === alert.orderId);
        const isRestaurantNewOrder = alert.type === 'new_order';

        return (
          <div
            key={`${alert.id}-${idx}`}
            className={`pointer-events-auto rounded-2xl p-4 shadow-2xl border transition-all animate-in slide-in-from-top-3 duration-300 ${
              isRestaurantNewOrder
                ? 'bg-amber-950/95 text-white border-amber-500/80 backdrop-blur-md ring-2 ring-amber-500/40'
                : 'bg-slate-900/95 text-white border-orange-500/80 backdrop-blur-md ring-2 ring-orange-500/40'
            }`}
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    isRestaurantNewOrder ? 'bg-amber-400' : 'bg-orange-400'
                  }`} />
                  <span className={`relative inline-flex rounded-full h-3 w-3 ${
                    isRestaurantNewOrder ? 'bg-amber-500' : 'bg-orange-500'
                  }`} />
                </span>

                <span className="text-[11px] font-black uppercase tracking-wider text-amber-300 flex items-center gap-1">
                  {isRestaurantNewOrder ? (
                    <>
                      <UtensilsCrossed className="w-3.5 h-3.5" />
                      <span>Live Order Alert</span>
                    </>
                  ) : (
                    <>
                      <Bike className="w-3.5 h-3.5 text-orange-400" />
                      <span>Live Delivery Update</span>
                    </>
                  )}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleToggleSound}
                  className="p-1 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
                  title={isMuted ? 'Unmute alerts' : 'Mute alerts'}
                >
                  {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
                </button>
                <button
                  type="button"
                  onClick={() => dismissAlert(alert.id)}
                  className="p-1 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
                  title="Dismiss alert"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Alert Content */}
            <div className="space-y-1">
              <h4 className="text-sm font-black text-white leading-tight">
                {alert.title}
              </h4>
              <p className="text-xs text-white/85 leading-relaxed">
                {alert.message}
              </p>
            </div>

            {/* Order snapshot pill if available */}
            {order && (
              <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-white/70">
                <span>Order #{order.id} • {order.items.length} items</span>
                <span className="font-black text-white">₹{order.totalAmount}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-3 flex items-center gap-2">
              {isRestaurantNewOrder && order && order.status === 'placed' && (
                <button
                  type="button"
                  onClick={() => {
                    updateOrderStatus(order.id, 'accepted');
                    dismissAlert(alert.id);
                  }}
                  className="flex-1 py-1.5 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Accept Order</span>
                </button>
              )}

              {alert.orderId && (
                <button
                  type="button"
                  onClick={() => {
                    handleNavigate(alert.orderId!);
                    dismissAlert(alert.id);
                  }}
                  className="flex-1 py-1.5 px-3 bg-white/15 hover:bg-white/25 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>{effectiveRole === 'restaurant' ? 'View in Kitchen' : 'Track Order'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}

              <button
                type="button"
                onClick={() => dismissAlert(alert.id)}
                className="py-1.5 px-2.5 bg-transparent hover:bg-white/10 text-white/60 hover:text-white text-xs rounded-xl transition-all cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
