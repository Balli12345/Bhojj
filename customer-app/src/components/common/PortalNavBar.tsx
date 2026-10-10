import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PortalView, UserRole } from '../../types';
import { 
  UtensilsCrossed, 
  Store, 
  Bike, 
  ShieldCheck, 
  ChevronDown, 
  ExternalLink,
  LogIn,
  UserPlus,
  Compass,
  Sparkles,
  Layers
} from 'lucide-react';

export const PortalNavBar: React.FC = () => {
  const { 
    currentView, 
    setCurrentView, 
    currentUser, 
    quickSwitchRole, 
    setPortalModalOpen 
  } = useApp();

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const portals = [
    {
      id: 'customer',
      role: 'customer' as UserRole,
      label: 'Customer Portal',
      shortLabel: 'Customer',
      sublabel: 'Food & Tiffins',
      icon: UtensilsCrossed,
      color: 'emerald',
      activeColor: 'text-emerald-700 bg-emerald-50 border-emerald-300 ring-emerald-400',
      badgeBg: 'bg-emerald-100 text-emerald-800',
      dashboardView: 'customer_dashboard' as PortalView,
      loginView: 'customer_login' as PortalView,
      registerView: 'customer_register' as PortalView,
      views: ['customer_dashboard', 'customer_login', 'customer_register'],
    },
    {
      id: 'restaurant',
      role: 'restaurant' as UserRole,
      label: 'Restaurant Partner',
      shortLabel: 'Kitchen',
      sublabel: 'Orders & Menu',
      icon: Store,
      color: 'amber',
      activeColor: 'text-amber-800 bg-amber-50 border-amber-300 ring-amber-400',
      badgeBg: 'bg-amber-100 text-amber-800',
      dashboardView: 'restaurant_dashboard' as PortalView,
      loginView: 'restaurant_login' as PortalView,
      registerView: 'restaurant_register' as PortalView,
      views: ['restaurant_dashboard', 'restaurant_login', 'restaurant_register'],
    },
    {
      id: 'delivery',
      role: 'delivery' as UserRole,
      label: 'Delivery Partner',
      shortLabel: 'Delivery',
      sublabel: 'Rider & Fleet',
      icon: Bike,
      color: 'blue',
      activeColor: 'text-blue-700 bg-blue-50 border-blue-300 ring-blue-400',
      badgeBg: 'bg-blue-100 text-blue-800',
      dashboardView: 'delivery_dashboard' as PortalView,
      loginView: 'delivery_login' as PortalView,
      registerView: 'delivery_register' as PortalView,
      views: ['delivery_dashboard', 'delivery_login', 'delivery_register'],
    },
    {
      id: 'admin',
      role: 'admin' as UserRole,
      label: 'Super Admin',
      shortLabel: 'Admin',
      sublabel: 'Control Room',
      icon: ShieldCheck,
      color: 'purple',
      activeColor: 'text-purple-700 bg-purple-50 border-purple-300 ring-purple-400',
      badgeBg: 'bg-purple-100 text-purple-800',
      dashboardView: 'admin_dashboard' as PortalView,
      loginView: 'admin_login' as PortalView,
      registerView: null,
      views: ['admin_dashboard', 'admin_login', 'admin_register'],
    },
  ];

  return (
    <div className="bg-slate-900 text-white border-b border-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-2.5 gap-2.5">
          
          {/* Label indicating multi-portal navigation */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30">
                <Layers className="w-3 h-3 text-orange-400" />
                <span>Portals Linked</span>
              </span>
              <span className="text-xs text-slate-400 hidden xl:inline">
                Directly access any portal or login/register:
              </span>
            </div>

            {/* Mobile trigger to open modal */}
            <button
              onClick={() => setPortalModalOpen(true)}
              className="text-[11px] text-slate-300 hover:text-white underline md:hidden"
            >
              Portal Guide
            </button>
          </div>

          {/* Links for all 4 Portals */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {portals.map((portal) => {
              const Icon = portal.icon;
              const isCurrentSection = portal.views.includes(currentView);
              const isRoleLoggedIn = currentUser?.role === portal.id;
              const isDropdownOpen = activeDropdown === portal.id;

              return (
                <div key={portal.id} className="relative">
                  <div 
                    className={`flex items-center justify-between gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs transition-all ${
                      isCurrentSection 
                        ? 'bg-slate-800 border-orange-500/80 shadow-xs ring-1 ring-orange-500/40 text-white' 
                        : 'bg-slate-800/60 border-slate-700/70 hover:bg-slate-800 hover:border-slate-600 text-slate-300'
                    }`}
                  >
                    {/* Main direct link to Dashboard / Portal View */}
                    <button
                      type="button"
                      onClick={() => {
                        if (currentUser?.role === portal.id) {
                          setCurrentView(portal.dashboardView);
                        } else {
                          // Quick switch into this role or open its view
                          quickSwitchRole(portal.role);
                        }
                      }}
                      className="flex items-center gap-2 text-left flex-1 min-w-0 py-0.5 group focus:outline-hidden"
                      title={`Open ${portal.label} Dashboard`}
                    >
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                        isCurrentSection ? 'bg-orange-500 text-white font-bold' : 'bg-slate-700 text-slate-300'
                      }`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="truncate">
                        <div className="font-bold leading-tight truncate flex items-center gap-1">
                          <span className="truncate">{portal.shortLabel}</span>
                          {isRoleLoggedIn && (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" title="Signed in with this role"></span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          {portal.sublabel}
                        </div>
                      </div>
                    </button>

                    {/* Submenu Trigger for Login / Register / Live Dashboard */}
                    <div className="relative shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveDropdown(isDropdownOpen ? null : portal.id);
                        }}
                        className={`p-1 rounded-md transition-colors ${
                          isDropdownOpen 
                            ? 'bg-slate-700 text-white' 
                            : 'text-slate-400 hover:text-white hover:bg-slate-700/60'
                        }`}
                        title="Portal links: Login, Register, Demo"
                      >
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {/* Dropdown Menu for this Portal */}
                      {isDropdownOpen && (
                        <>
                          <div 
                            className="fixed inset-0 z-40" 
                            onClick={() => setActiveDropdown(null)}
                          />
                          <div className="absolute right-0 top-full mt-1.5 w-52 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
                            <div className="px-3 py-1 border-b border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                              <span>{portal.label}</span>
                              <span className="text-orange-400 font-normal">Direct Links</span>
                            </div>

                            {/* Direct Link 1: Dashboard */}
                            <button
                              type="button"
                              onClick={() => {
                                quickSwitchRole(portal.role);
                                setActiveDropdown(null);
                              }}
                              className="w-full text-left px-3 py-1.5 text-slate-200 hover:bg-slate-800 hover:text-white flex items-center gap-2 font-medium"
                            >
                              <Compass className="w-3.5 h-3.5 text-orange-400" />
                              <span>Live Dashboard</span>
                            </button>

                            {/* Direct Link 2: Login Page */}
                            <button
                              type="button"
                              onClick={() => {
                                setCurrentView(portal.loginView);
                                setActiveDropdown(null);
                              }}
                              className="w-full text-left px-3 py-1.5 text-slate-200 hover:bg-slate-800 hover:text-white flex items-center gap-2 font-medium"
                            >
                              <LogIn className="w-3.5 h-3.5 text-emerald-400" />
                              <span>{portal.shortLabel} Login Page</span>
                            </button>

                            {/* Direct Link 3: Register Page */}
                            {portal.registerView && (
                              <button
                                type="button"
                                onClick={() => {
                                  setCurrentView(portal.registerView!);
                                  setActiveDropdown(null);
                                }}
                                className="w-full text-left px-3 py-1.5 text-slate-200 hover:bg-slate-800 hover:text-white flex items-center gap-2 font-medium"
                              >
                                <UserPlus className="w-3.5 h-3.5 text-blue-400" />
                                <span>{portal.shortLabel} Register Page</span>
                              </button>
                            )}
                          </div>
                        </>
                      )}
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
};
