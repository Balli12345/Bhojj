import React from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole, PortalView } from '../../types';
import { 
  X, 
  UtensilsCrossed, 
  Store, 
  Bike, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  LogIn, 
  UserPlus,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';

export const PortalSwitcherModal: React.FC = () => {
  const { 
    portalModalOpen, 
    setPortalModalOpen, 
    setCurrentView, 
    quickSwitchRole, 
    currentUser 
  } = useApp();

  if (!portalModalOpen) return null;

  const handleNavigate = (view: PortalView) => {
    setCurrentView(view);
    setPortalModalOpen(false);
  };

  const handleQuickDemo = (role: UserRole) => {
    quickSwitchRole(role);
    setPortalModalOpen(false);
  };

  const portals = [
    {
      id: 'customer',
      title: 'Customer Portal',
      hindiTitle: 'ग्राहक पोर्टल (Diner)',
      description: 'Explore mouth-watering traditional thalis, homestyle tiffins, add to cart, track orders live with PIN.',
      icon: UtensilsCrossed,
      color: 'emerald',
      bgGradient: 'from-emerald-500/10 via-emerald-500/5 to-transparent',
      borderColor: 'border-emerald-200 hover:border-emerald-400',
      badgeColor: 'bg-emerald-100 text-emerald-800',
      loginView: 'customer_login' as PortalView,
      registerView: 'customer_register' as PortalView,
      dashboardView: 'customer_dashboard' as PortalView,
      demoName: 'Priya Sharma (Customer)',
    },
    {
      id: 'restaurant',
      title: 'Restaurant & Kitchen Portal',
      hindiTitle: 'रसोई / भोजनालय पार्टनर',
      description: 'Manage menu items, toggle in-stock, accept incoming orders, pack food and track kitchen revenue.',
      icon: Store,
      color: 'amber',
      bgGradient: 'from-amber-500/10 via-amber-500/5 to-transparent',
      borderColor: 'border-amber-200 hover:border-amber-400',
      badgeColor: 'bg-amber-100 text-amber-800',
      loginView: 'restaurant_login' as PortalView,
      registerView: 'restaurant_register' as PortalView,
      dashboardView: 'restaurant_dashboard' as PortalView,
      demoName: 'Chef Vikram (Royal Rasoi)',
    },
    {
      id: 'delivery',
      title: 'Delivery Partner Portal',
      hindiTitle: 'राइडर / डिलीवरी साथी',
      description: 'Toggle duty online/offline, accept delivery orders, pickup from kitchen, verify customer OTP and track wallet.',
      icon: Bike,
      color: 'blue',
      bgGradient: 'from-blue-500/10 via-blue-500/5 to-transparent',
      borderColor: 'border-blue-200 hover:border-blue-400',
      badgeColor: 'bg-blue-100 text-blue-800',
      loginView: 'delivery_login' as PortalView,
      registerView: 'delivery_register' as PortalView,
      dashboardView: 'delivery_dashboard' as PortalView,
      demoName: 'Rajesh Kumar (Rider Hero)',
    },
    {
      id: 'admin',
      title: 'Platform Admin Portal',
      hindiTitle: 'सुपर एडमिन कंट्रोल',
      description: 'Master overview of platform GMV, live orders across kitchens, restaurant approvals, and rider fleet management.',
      icon: ShieldCheck,
      color: 'purple',
      bgGradient: 'from-purple-500/10 via-purple-500/5 to-transparent',
      borderColor: 'border-purple-200 hover:border-purple-400',
      badgeColor: 'bg-purple-100 text-purple-800',
      loginView: 'admin_login' as PortalView,
      registerView: null, // Admin login only
      dashboardView: 'admin_dashboard' as PortalView,
      demoName: 'Badal Rai (Super Admin)',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 sm:p-8">
        
        {/* Close Button */}
        <button
          onClick={() => setPortalModalOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Modal Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-orange-600" />
            Bhojj Multi-Role Architecture
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Select User Portal & Gateway
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Har ek role ke liye <strong className="text-slate-900">alag Login aur Register page</strong> banaya gaya hai. Aap kisi bhi role ke page par ja sakte hain ya 1-click mein test kar sakte hain.
          </p>
        </div>

        {/* Portals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {portals.map((portal) => {
            const Icon = portal.icon;
            const isCurrentRole = currentUser?.role === portal.id;

            return (
              <div 
                key={portal.id}
                className={`relative rounded-2xl border p-5 transition-all duration-200 bg-gradient-to-b ${portal.bgGradient} ${portal.borderColor} ${isCurrentRole ? 'ring-2 ring-orange-500 shadow-md' : 'hover:shadow-lg'}`}
              >
                {/* Active Role Indicator */}
                {isCurrentRole && (
                  <div className="absolute top-4 right-4 flex items-center gap-1 text-[11px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Currently Active
                  </div>
                )}

                <div className="flex items-start gap-3.5 mb-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold shrink-0 ${portal.badgeColor}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 leading-tight">
                      {portal.title}
                    </h3>
                    <p className="text-xs font-medium text-slate-500">
                      {portal.hindiTitle}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                  {portal.description}
                </p>

                {/* Action Links: Login, Register, Direct Demo Dashboard */}
                <div className="pt-3 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleNavigate(portal.loginView)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 shadow-xs transition-colors"
                    >
                      <LogIn className="w-3.5 h-3.5 text-slate-600" />
                      Login Page
                    </button>
                    
                    {portal.registerView && (
                      <button
                        onClick={() => handleNavigate(portal.registerView)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 shadow-xs transition-colors"
                      >
                        <UserPlus className="w-3.5 h-3.5 text-slate-600" />
                        Register
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => handleQuickDemo(portal.id as UserRole)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition-all ml-auto"
                    title={`Open active ${portal.title} directly`}
                  >
                    <span>Test Dashboard</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="mt-6 pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <div className="flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-slate-400" />
            <span>Sabhi dashboards mein real live state sync hoti hai (Cart ➔ Kitchen ➔ Delivery ➔ Admin).</span>
          </div>
          <button
            onClick={() => setPortalModalOpen(false)}
            className="text-slate-700 hover:text-slate-900 font-semibold underline"
          >
            Close & Continue
          </button>
        </div>

      </div>
    </div>
  );
};
