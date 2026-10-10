import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GlobalSearch } from './GlobalSearch';
import { PWAInstallButton } from './PWAInstallButton';
import { 
  UtensilsCrossed, 
  ShoppingBag, 
  Bell, 
  UserCircle2, 
  User,
  LogOut, 
  Store, 
  Bike, 
  ChevronDown,
  RefreshCw,
  MapPin,
  Search,
  Clock,
  Flame,
  Sparkles,
  Check,
  CheckCircle2,
  X,
  Settings,
  ShieldCheck,
  Wallet
} from 'lucide-react';

interface HeaderProps {
  onOpenCart?: () => void;
  onSearchChange?: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCart, onSearchChange }) => {
  const { 
    currentUser, 
    currentView, 
    setCurrentView, 
    logout, 
    cart, 
    setIsCartOpen,
    notifications, 
    markNotificationRead,
    orders,
    resetAllDemoData,
    setSelectedLocationFilter,
    openCategoryDetails,
    walletBalance,
  } = useApp();

  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  
  // Ashram location state
  const [selectedAshram, setSelectedAshram] = useState('Dan Ghati Ashram');
  const [selectedRoom, setSelectedRoom] = useState('Room 108, Shri Giriraj Seva Sadan');
  const [tempAshram, setTempAshram] = useState(selectedAshram);
  const [tempRoom, setTempRoom] = useState(selectedRoom);
  const [headerSearch, setHeaderSearch] = useState('');

  const ashramOptions = [
    { name: 'Dan Ghati Ashram', desc: 'Room 108, Shri Giriraj Seva Sadan, Goverdhan' },
    { name: 'Radha Kund Parikrama Marg', desc: 'Near Shyama Kunj Ashram, Govardhan' },
    { name: 'Mansi Ganga Ghat', desc: 'Mukharvind Mandir Parisar, Goverdhan' },
    { name: 'Jatipura Ashram Hub', desc: 'Shri Giriraj Mukharvind, Jatipura' },
  ];

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
  const unreadNotifs = notifications.filter(n => !n.read).length;

  const activeOrdersCount = orders.filter(
    o => o.status !== 'delivered' && o.status !== 'cancelled'
  ).length;

  const handleSearch = (val: string) => {
    setHeaderSearch(val);
    if (onSearchChange) {
      onSearchChange(val);
    }
  };

  const handleSaveLocation = () => {
    setSelectedAshram(tempAshram);
    setSelectedRoom(tempRoom);
    if (tempAshram.includes('Dan Ghati')) setSelectedLocationFilter('Dan Ghati');
    else if (tempAshram.includes('Radha Kund')) setSelectedLocationFilter('Radha Kund');
    else if (tempAshram.includes('Mansi Ganga')) setSelectedLocationFilter('Mansi Ganga');
    else if (tempAshram.includes('Jatipura')) setSelectedLocationFilter('Jatipura');
    setShowLocationModal(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white shadow-xs">
      
      {/* 1. TOP ECOSYSTEM BAR (Dark) */}
      {/* User Instruction: Header se customer app remove krna h, super admin home page par show nhi krna h, sirf Restaurant Partner App aur Delivery Partner App show krna h */}
      <div className="hidden md:block bg-slate-950 text-slate-200 border-b border-slate-800 text-[11px] py-1.5 px-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          <div className="flex items-center gap-2">
            <span className="font-extrabold uppercase tracking-wider text-amber-400 text-[10px] sm:text-[11px]">
              FOOD DELIVERY PLATFORM:
            </span>
            <span className="text-slate-300 font-medium hidden sm:inline text-xs">
              4-in-1 Ecosystem
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800/80 px-1.5 py-0.2 rounded font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Goverdhan Cloud Kitchen
            </span>
          </div>

          {/* ONLY Restaurant Partner App & Delivery Partner App (No Customer App, No Admin Panel) */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              id="header-restaurant-portal-btn"
              onClick={() => setCurrentView('restaurant_login')}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 hover:text-amber-200 border border-amber-500/30 transition-colors"
              title="Open Restaurant Partner Portal"
            >
              <Store className="w-3.5 h-3.5 text-amber-400" />
              <span>Restaurant App</span>
            </button>

            <button
              id="header-delivery-portal-btn"
              onClick={() => setCurrentView('delivery_login')}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 hover:text-sky-200 border border-sky-500/30 transition-colors"
              title="Open Delivery Partner Fleet Portal"
            >
              <Bike className="w-3.5 h-3.5 text-sky-400" />
              <span>Delivery Partner App</span>
            </button>
          </div>

        </div>
      </div>

      {/* 2. ORANGE TICKER / ANNOUNCEMENT BAR */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-600 text-white text-xs py-1.5 px-3 sm:px-6 shadow-inner">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <Flame className="w-3.5 h-3.5 text-yellow-300 shrink-0 animate-bounce" />
            <span className="font-extrabold text-white text-[11px] sm:text-xs">
              Bhojj (Goverdhan, UP):
            </span>
            <span className="font-medium text-orange-100 text-[11px] sm:text-xs">
              Pure Satvik Cloud Kitchen (No Onion, No Garlic)
            </span>
            <span className="hidden md:inline text-white/60">•</span>
            <span className="hidden md:inline font-bold bg-white/20 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider">
              Code: BHOJJ50
            </span>
            <span className="hidden lg:inline text-white/90 text-[11px]">
              • 100% Mandir Standard Hygiene
            </span>
          </div>

          <div className="shrink-0 flex items-center gap-2 text-[11px] font-bold">
            <button
              onClick={() => {
                const el = document.getElementById('vision-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:underline flex items-center gap-1 text-white/95 hover:text-white"
            >
              <span>About Us & Vision</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. MAIN NAVIGATION BAR */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={() => setCurrentView('customer_dashboard')}
              className="flex items-center gap-2 text-left focus:outline-hidden group"
              title="Bhojj Satvik Food Home"
              aria-label="Bhojj home"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-orange-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform duration-200">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 leading-none">
                    bhojj
                  </span>
                  <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                    100% SATVIK
                  </span>
                </div>
                <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-500 mt-0.5 hidden sm:block">
                  PURE CLOUD KITCHEN • GOVERDHAN, UP
                </p>
              </div>
            </button>
          </div>

          {/* Ashram Location Picker */}
          <div className="hidden lg:flex items-center">
            <button
              onClick={() => setShowLocationModal(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors border border-slate-200/80 text-left"
              title="Change Delivery Ashram or Room"
            >
              <div className="w-7 h-7 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
                  <span>{selectedAshram}</span>
                  <ChevronDown className="w-3 h-3 text-slate-500" />
                </div>
                <div className="text-[10px] text-slate-500 max-w-44 truncate">
                  {selectedRoom}
                </div>
              </div>
            </button>
          </div>

          {/* Global Search Bar (Food & Restaurants across platform) */}
          <div className="hidden md:block flex-1 max-w-lg mx-1 sm:mx-3">
            <GlobalSearch className="w-full" />
          </div>

          {/* Right Action Icons & Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setShowLocationModal(true)}
              aria-label={`Delivery location: ${selectedAshram}. Change location`}
              title="Change delivery location"
              className="lg:hidden min-w-10 min-h-10 inline-flex items-center justify-center rounded-xl text-orange-600 hover:bg-orange-50 border border-slate-200/80 transition-colors"
            >
              <MapPin className="w-5 h-5" />
            </button>
            <PWAInstallButton />
            
            {/* Track Delivery LIVE Button */}
            <button
              onClick={() => {
                setCurrentView('customer_dashboard');
                // notify customer to scroll to orders or trigger tab
                window.dispatchEvent(new CustomEvent('open-customer-tab', { detail: 'orders' }));
              }}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-orange-50 text-orange-800 border border-orange-200 hover:bg-orange-100 transition-colors"
              title="Track live orders"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Track Delivery</span>
              <span className="text-[9px] font-black bg-orange-600 text-white px-1 py-0.2 rounded">LIVE</span>
            </button>

            {/* Orders Clock Icon */}
            <button
              onClick={() => {
                setCurrentView('customer_dashboard');
                window.dispatchEvent(new CustomEvent('open-customer-tab', { detail: 'orders' }));
              }}
              className="hidden md:block p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors relative"
              title="My Orders History"
              aria-label="My orders"
            >
              <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
              {activeOrdersCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-orange-600 rounded-full animate-ping"></span>
              )}
            </button>

            {/* Bhojj Wallet Quick Pill */}
            {(!currentUser || currentUser.role === 'customer') && (
              <button
                onClick={() => {
                  setCurrentView('customer_dashboard');
                  window.dispatchEvent(new CustomEvent('open-customer-tab', { detail: 'wallet' }));
                }}
                className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-black bg-amber-50 text-amber-950 border border-amber-300 hover:bg-amber-100 hover:border-amber-400 transition-all shadow-2xs cursor-pointer group"
                title="Bhojj Satvik Digital Wallet"
              >
                <div className="w-5 h-5 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs group-hover:scale-105 transition-transform">
                  <Wallet className="w-3 h-3" />
                </div>
                <span>Wallet:</span>
                <span className="text-emerald-700 font-extrabold">₹{walletBalance.toLocaleString('en-IN')}</span>
              </button>
            )}

            {/* Cart Button */}
            <button
              id="header-cart-button"
              onClick={() => {
                if (onOpenCart) {
                  onOpenCart();
                } else {
                  setIsCartOpen(true);
                }
              }}
              className={`relative p-2 sm:px-3 sm:py-2 rounded-xl transition-all hidden md:flex items-center gap-1.5 border font-black ${
                cartItemCount > 0 
                  ? 'bg-orange-600 hover:bg-orange-700 text-white border-orange-600 shadow-md shadow-orange-600/20' 
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
              }`}
              title="View Cart"
              aria-label={`Cart, ${cartItemCount} items`}
            >
              <ShoppingBag className={`w-4 h-4 ${cartItemCount > 0 ? 'text-white' : 'text-orange-600'}`} />
              <span className="hidden sm:inline text-xs">
                {cartItemCount > 0 ? `Cart (₹${cartSubtotal})` : 'Cart'}
              </span>
              {cartItemCount > 0 && (
                <span className="bg-white text-orange-600 text-[10px] font-black px-1.5 py-0.2 rounded-full min-w-4 text-center">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                id="header-notifications-button"
                onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                className="min-w-10 min-h-10 inline-flex items-center justify-center p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 relative transition-colors"
                title="Notifications"
                aria-label={unreadNotifs > 0 ? `Notifications, ${unreadNotifs} unread` : 'Notifications'}
              >
                <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                {unreadNotifs > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-600 rounded-full ring-2 ring-white"></span>
                )}
              </button>

              {showNotifDropdown && (
                <div className="fixed inset-x-3 top-28 sm:absolute sm:inset-x-auto sm:top-auto sm:right-0 mt-2 sm:w-88 bg-white rounded-2xl shadow-2xl border border-slate-200 py-3 z-50 animate-in fade-in">
                  <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-900">Live Alerts</span>
                    <span className="text-[11px] bg-slate-100 px-2 py-0.5 rounded-full font-medium text-slate-600">
                      {notifications.length} alerts
                    </span>
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-500">No notifications yet.</div>
                    ) : (
                      notifications.slice(0, 8).map((notif, index) => (
                        <div 
                          key={`${notif.id}-${index}`} 
                          onClick={() => markNotificationRead(notif.id)}
                          className={`p-3 text-xs hover:bg-slate-50 cursor-pointer transition-colors ${notif.read ? 'opacity-65' : 'bg-orange-50/40'}`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-semibold text-slate-900">{notif.title}</span>
                            <span className="text-[10px] text-slate-400 shrink-0">{notif.time}</span>
                          </div>
                          <p className="text-slate-600 mt-1 leading-relaxed">{notif.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Customer User Profile / Sign In */}
            {currentUser ? (
              <div className="relative">
                <button
                  id="user-profile-menu-button"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  aria-label="Account menu"
                  aria-expanded={showUserMenu}
                  className="min-h-10 flex items-center gap-2 p-1 sm:px-2.5 sm:py-1.5 rounded-xl hover:bg-slate-100 border border-slate-200 text-left transition-colors"
                >
                  <img
                    src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                    alt={currentUser.name}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-slate-300"
                  />
                  <div className="hidden md:block">
                    <div className="text-xs font-bold text-slate-900 leading-tight truncate max-w-24">
                      {currentUser.name}
                    </div>
                    <div className="text-[10px] capitalize text-emerald-700 font-semibold">
                      {currentUser.role}
                    </div>
                  </div>
                  <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:block" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50/50">
                      <div className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</div>
                      <div className="text-[11px] text-slate-500 truncate">{currentUser.email || currentUser.phone}</div>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-800">
                        {currentUser.role} Account
                      </span>
                    </div>
                    
                    {/* Role-Specific Shortcuts */}
                    {currentUser.role === 'customer' && (
                      <>
                        <button
                          onClick={() => {
                            setCurrentView('customer_dashboard');
                            window.dispatchEvent(new CustomEvent('open-customer-tab', { detail: 'wallet' }));
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-4 py-2 text-xs text-slate-800 hover:bg-amber-50 hover:text-amber-900 flex items-center justify-between font-bold"
                        >
                          <div className="flex items-center gap-2.5">
                            <Wallet className="w-4 h-4 text-amber-600" />
                            <span>Bhojj Digital Wallet</span>
                          </div>
                          <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full">
                            ₹{walletBalance.toLocaleString('en-IN')}
                          </span>
                        </button>

                        <button
                          onClick={() => {
                            setCurrentView('customer_dashboard');
                            window.dispatchEvent(new CustomEvent('open-customer-tab', { detail: 'profile' }));
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-4 py-2 text-xs text-slate-800 hover:bg-orange-50 hover:text-orange-700 flex items-center gap-2.5 font-bold"
                        >
                          <User className="w-4 h-4 text-orange-600" />
                          My Profile & Saved Addresses
                        </button>

                        <button
                          onClick={() => {
                            setCurrentView('customer_dashboard');
                            window.dispatchEvent(new CustomEvent('open-customer-tab', { detail: 'orders' }));
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium"
                        >
                          <Clock className="w-4 h-4 text-slate-500" />
                          My Orders & Live Tracker
                        </button>

                        <button
                          onClick={() => {
                            setCurrentView('customer_dashboard');
                            window.dispatchEvent(new CustomEvent('open-customer-tab', { detail: 'menu' }));
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium"
                        >
                          <UtensilsCrossed className="w-4 h-4 text-slate-500" />
                          Browse Satvik Food Menu
                        </button>
                      </>
                    )}

                    {currentUser.role === 'restaurant' && (
                      <>
                        <button
                          onClick={() => {
                            setCurrentView('restaurant_dashboard');
                            window.dispatchEvent(new CustomEvent('open-restaurant-tab', { detail: 'pipeline' }));
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-4 py-2 text-xs text-slate-800 hover:bg-amber-50 hover:text-amber-700 flex items-center gap-2.5 font-bold"
                        >
                          <Store className="w-4 h-4 text-amber-600" />
                          Kitchen Order Pipeline (KOT)
                        </button>

                        <button
                          onClick={() => {
                            setCurrentView('restaurant_dashboard');
                            window.dispatchEvent(new CustomEvent('open-restaurant-tab', { detail: 'profile' }));
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-amber-50 hover:text-amber-700 flex items-center gap-2.5 font-medium"
                        >
                          <Settings className="w-4 h-4 text-amber-600" />
                          Kitchen Profile & Settings
                        </button>
                      </>
                    )}

                    {currentUser.role === 'delivery' && (
                      <>
                        <button
                          onClick={() => {
                            setCurrentView('delivery_dashboard');
                            window.dispatchEvent(new CustomEvent('open-delivery-tab', { detail: 'radar' }));
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-4 py-2 text-xs text-slate-800 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2.5 font-bold"
                        >
                          <Bike className="w-4 h-4 text-blue-600" />
                          Rider Radar & Live Trips
                        </button>

                        <button
                          onClick={() => {
                            setCurrentView('delivery_dashboard');
                            window.dispatchEvent(new CustomEvent('open-delivery-tab', { detail: 'profile' }));
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2.5 font-medium"
                        >
                          <User className="w-4 h-4 text-blue-600" />
                          Rider Profile & Fleet Settings
                        </button>
                      </>
                    )}

                    {currentUser.role === 'admin' && (
                      <button
                        onClick={() => {
                          setCurrentView('admin_dashboard');
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-purple-700 hover:bg-purple-50 flex items-center gap-2.5 font-bold"
                      >
                        <ShieldCheck className="w-4 h-4 text-purple-600" />
                        Admin Master Console
                      </button>
                    )}

                    <div className="border-t border-slate-100 my-1"></div>

                    {currentUser.role !== 'customer' && (
                      <button
                        onClick={() => {
                          setCurrentView('customer_dashboard');
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <UtensilsCrossed className="w-4 h-4 text-slate-400" />
                        Go to Customer Store
                      </button>
                    )}

                    <button
                      onClick={() => {
                        resetAllDemoData();
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <RefreshCw className="w-4 h-4 text-slate-400" />
                      Reset Demo Data
                    </button>

                    <div className="border-t border-slate-100 my-1"></div>

                    <button
                      onClick={() => {
                        logout();
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 font-semibold"
                    >
                      <LogOut className="w-4 h-4 text-red-500" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                id="header-sign-in-button"
                onClick={() => setCurrentView('customer_login')}
                aria-label="Sign in"
                className="min-w-10 min-h-10 justify-center inline-flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition-colors"
              >
                <UserCircle2 className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}

          </div>

        </div>
        <div className="md:hidden mt-2">
          <GlobalSearch className="w-full" />
        </div>
      </div>

      {/* 4. SUB-SERVICES STRIP */}
      <div className="border-t border-slate-100 bg-slate-50/70 px-3 sm:px-6 py-1.5">
        <div className="max-w-7xl mx-auto flex items-center gap-2 sm:gap-3 overflow-x-auto scrollbar-none text-xs font-bold">
          <button 
            onClick={() => {
              setCurrentView('customer_dashboard');
              openCategoryDetails('Thali');
            }}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white hover:bg-orange-50 text-slate-800 hover:text-orange-700 border border-slate-200 shadow-2xs transition-colors shrink-0"
          >
            <span className="text-orange-600">🍛</span>
            <span>Satvik Thalis ↗</span>
          </button>

          <button 
            onClick={() => {
              setCurrentView('customer_dashboard');
              openCategoryDetails('Bhandara');
            }}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white hover:bg-orange-50 text-slate-800 hover:text-orange-700 border border-slate-200 shadow-2xs transition-colors shrink-0"
          >
            <span className="text-amber-600">🍯</span>
            <span>Bhandara & Pooja Seva ↗</span>
          </button>

          <button 
            onClick={() => {
              setCurrentView('customer_dashboard');
              openCategoryDetails('Prasad');
            }}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white hover:bg-orange-50 text-slate-800 hover:text-orange-700 border border-slate-200 shadow-2xs transition-colors shrink-0"
          >
            <span className="text-pink-600">🍬</span>
            <span>Temple Prasad & Sweets ↗</span>
          </button>

          <button 
            onClick={() => {
              setCurrentView('customer_dashboard');
              openCategoryDetails('Tiffin');
            }}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white hover:bg-orange-50 text-slate-800 hover:text-orange-700 border border-slate-200 shadow-2xs transition-colors shrink-0"
          >
            <span className="text-emerald-600">🍱</span>
            <span>Monthly Tiffins ↗</span>
          </button>
        </div>
      </div>

      {/* LOCATION PICKER MODAL */}
      {showLocationModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-orange-600" />
                <h3 className="font-extrabold text-slate-900 text-base">Select Delivery Ashram</h3>
              </div>
              <button 
                onClick={() => setShowLocationModal(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 mt-4">
              <label className="block text-xs font-bold text-slate-700">Choose Sacred Spot / Ashram:</label>
              <div className="space-y-2">
                {ashramOptions.map((ashram) => (
                  <div
                    key={ashram.name}
                    onClick={() => {
                      setTempAshram(ashram.name);
                      setTempRoom(ashram.desc);
                    }}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                      tempAshram === ashram.name 
                        ? 'border-orange-500 bg-orange-50/60 text-orange-950 font-bold' 
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold">{ashram.name}</div>
                      <div className="text-[11px] text-slate-500 font-normal">{ashram.desc}</div>
                    </div>
                    {tempAshram === ashram.name && (
                      <Check className="w-4 h-4 text-orange-600 shrink-0" />
                    )}
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Specific Room / Dharmshala Details:
                </label>
                <input
                  type="text"
                  value={tempRoom}
                  onChange={(e) => setTempRoom(e.target.value)}
                  placeholder="e.g. Room 108, Shri Giriraj Seva Sadan"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowLocationModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveLocation}
                  className="flex-1 py-2.5 rounded-xl bg-orange-600 text-white text-xs font-bold hover:bg-orange-700 shadow-md shadow-orange-600/20"
                >
                  Confirm Location
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </header>
  );
};
