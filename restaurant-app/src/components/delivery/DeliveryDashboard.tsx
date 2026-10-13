import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Order } from '../../types';
import confetti from 'canvas-confetti';
import { RiderProfile } from './RiderProfile';
import { LiveDeliveryMap } from '../common/LiveDeliveryMap';
import { RiderDeviceGpsConsole } from './RiderDeviceGpsConsole';
import { 
  Bike, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  Navigation, 
  Clock, 
  DollarSign, 
  Wallet, 
  ShieldCheck, 
  Power, 
  AlertCircle, 
  KeyRound, 
  ArrowRight, 
  ChevronRight, 
  Star, 
  FileText 
} from 'lucide-react';

export const DeliveryDashboard: React.FC = () => {
  const { 
    currentUser, 
    orders, 
    riders, 
    toggleRiderDuty, 
    acceptDeliveryRun, 
    updateOrderStatus, 
    completeDeliveryWithOtp,
    getRiderTelemetry 
  } = useApp();

  const currentRider = riders.find(r => r.userId === currentUser?.id) || riders[0];

  const [activeTab, setActiveTab] = useState<'radar' | 'earnings' | 'history' | 'profile'>('radar');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  useEffect(() => {
    const handleTabChange = (e: any) => {
      if (e.detail && ['radar', 'earnings', 'history', 'profile'].includes(e.detail)) {
        setActiveTab(e.detail);
      }
    };
    window.addEventListener('open-delivery-tab', handleTabChange);
    return () => window.removeEventListener('open-delivery-tab', handleTabChange);
  }, []);

  // Active delivery order assigned to this rider
  const activeOrder = orders.find(o => 
    (o.riderId === currentRider.userId || o.riderId === currentUser?.id) && 
    (o.status === 'out_for_delivery' || o.status === 'ready_for_pickup')
  );

  // Ready orders available for pickup by any rider
  const availableOrders = orders.filter(o => 
    o.status === 'ready_for_pickup' && (!o.riderId || o.riderId !== currentRider.userId)
  );

  // Completed deliveries by this rider
  const completedOrders = orders.filter(o => 
    (o.riderId === currentRider.userId || o.riderId === currentUser?.id) && 
    o.status === 'delivered'
  );

  const handleVerifyOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOrder) return;
    setOtpError('');

    const res = await completeDeliveryWithOtp(activeOrder.id, enteredOtp);
    if (!res.success) {
      setOtpError(res.message);
    } else {
      setEnteredOtp('');
      try {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#3b82f6', '#10b981', '#f59e0b'],
        });
      } catch (err) { /* ignore */ }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      
      {/* Top Rider Hero Banner */}
      <div className="bg-white border-b border-slate-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-black shadow-md shadow-blue-600/20 shrink-0">
                <Bike className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    {currentRider.name}
                  </h1>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 font-bold border border-blue-200">
                    {currentRider.vehicleType} ({currentRider.vehicleNumber})
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Zone: {currentRider.zone} • Rating: {currentRider.rating}★ ({currentRider.totalTrips} Trips)
                </p>
              </div>
            </div>

            {/* Duty Status Switcher */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleRiderDuty(currentRider.userId)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black border transition-all ${currentRider.isOnline ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-2xs hover:bg-emerald-100' : 'bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200'}`}
              >
                <span className={`w-3 h-3 rounded-full ${currentRider.isOnline ? 'bg-emerald-500 animate-pulse ring-4 ring-emerald-100' : 'bg-slate-400'}`}></span>
                <span>{currentRider.isOnline ? 'DUTY ONLINE (Ready for Orders)' : 'DUTY OFFLINE (Shift Paused)'}</span>
              </button>
            </div>

          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-100">
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80">
              <div className="text-[11px] font-bold text-slate-500 uppercase">Today's Deliveries</div>
              <div className="text-2xl font-black text-blue-600 mt-0.5">{currentRider.todayTrips} Orders</div>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80">
              <div className="text-[11px] font-bold text-slate-500 uppercase">Today's Earnings</div>
              <div className="text-2xl font-black text-emerald-600 mt-0.5">₹{currentRider.todayEarnings}</div>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80">
              <div className="text-[11px] font-bold text-slate-500 uppercase">Lifetime Trips</div>
              <div className="text-2xl font-black text-slate-900 mt-0.5">{currentRider.totalTrips} Runs</div>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80">
              <div className="text-[11px] font-bold text-slate-500 uppercase">Rider Rating</div>
              <div className="text-2xl font-black text-amber-500 mt-0.5 flex items-center gap-1">
                <span>{currentRider.rating}</span>
                <Star className="w-5 h-5 fill-amber-500" />
              </div>
            </div>
          </div>

          {/* Nav Tabs */}
          <div className="flex items-center gap-2 mt-5 overflow-x-auto pb-1">
            <button
              onClick={() => setActiveTab('radar')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${activeTab === 'radar' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:text-slate-900'}`}
            >
              Active Run & Radar {activeOrder && '🚨 (1 Active)'}
            </button>
            <button
              onClick={() => setActiveTab('earnings')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${activeTab === 'earnings' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:text-slate-900'}`}
            >
              Earnings & Wallet (₹{currentRider.todayEarnings})
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${activeTab === 'history' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:text-slate-900'}`}
            >
              Completed Deliveries ({completedOrders.length})
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${activeTab === 'profile' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:text-slate-900'}`}
            >
              Vehicle & DL Profile
            </button>
          </div>

        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* ================= TAB 1: RADAR & ACTIVE DELIVERY ================= */}
        {activeTab === 'radar' && (
          <div className="space-y-6">
            
            {/* If Duty is Offline */}
            {!currentRider.isOnline && (
              <div className="bg-amber-50 rounded-3xl p-8 border border-amber-200 text-center">
                <Power className="w-12 h-12 text-amber-500 mx-auto mb-3" />
                <h3 className="font-extrabold text-amber-950 text-lg">Your Duty is Currently Offline</h3>
                <p className="text-xs sm:text-sm text-amber-800 mt-1 max-w-md mx-auto">
                  Click the button below to turn your radar online and start receiving high-paying Bhojj delivery orders.
                </p>
                <button
                  onClick={() => toggleRiderDuty(currentRider.userId)}
                  className="mt-4 px-6 py-2.5 rounded-xl font-black text-xs sm:text-sm bg-blue-600 text-white shadow-md hover:bg-blue-700 transition-colors"
                >
                  Turn Duty Online Now
                </button>
              </div>
            )}

            {/* ACTIVE ORDER NAVIGATION TERMINAL */}
            {currentRider.isOnline && activeOrder && (
              <div className="bg-white rounded-3xl border-2 border-blue-500 p-6 sm:p-8 shadow-xl relative overflow-hidden">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                  <div>
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-blue-100 text-blue-900 animate-pulse inline-block mb-1">
                      ACTIVE RUN IN PROGRESS
                    </span>
                    <h2 className="text-xl font-black text-slate-900">
                      Deliver Order #{activeOrder.id}
                    </h2>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400">Payout upon delivery</span>
                    <div className="text-xl font-black text-emerald-600">+₹65.00</div>
                  </div>
                </div>

                {/* 1. REAL-TIME MAP VISUALIZATION FOR RIDER */}
                <div className="mb-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                      <h3 className="font-black text-sm text-slate-900 uppercase tracking-wider">
                        Live Route Navigation & Telemetry
                      </h3>
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-500">
                      Auto-tracking Kitchen → Doorstep
                    </span>
                  </div>

                  <LiveDeliveryMap 
                    order={activeOrder} 
                    telemetry={getRiderTelemetry(activeOrder.id)} 
                    isRiderView={true}
                    height="h-72 sm:h-96" 
                  />

                  {/* 2. RIDER DEVICE GPS TRANSMITTER & CONTROLLER */}
                  <RiderDeviceGpsConsole 
                    order={activeOrder} 
                    telemetry={getRiderTelemetry(activeOrder.id)} 
                  />
                </div>

                {/* Step 1: Restaurant Pickup */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Left: Pickup & Drop details */}
                  <div className="space-y-4">
                    
                    {/* Kitchen Pickup Card */}
                    <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                          <Navigation className="w-3.5 h-3.5 text-amber-700" />
                          <span>1. Pick Up From Kitchen</span>
                        </span>
                        <span className="text-xs font-bold text-amber-900">2.1 km away</span>
                      </div>
                      <h4 className="font-extrabold text-slate-900 text-sm">{activeOrder.restaurantName}</h4>
                      <p className="text-xs text-slate-600 mt-0.5">Food Street, 56 Dukan, Indore</p>

                      <div className="mt-3 pt-3 border-t border-amber-200/80 flex items-center justify-between text-xs">
                        <span className="text-slate-500">{activeOrder.items.length} Food packets packed</span>
                        {activeOrder.status === 'ready_for_pickup' ? (
                          <button
                            onClick={() => updateOrderStatus(activeOrder.id, 'out_for_delivery')}
                            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold shadow-xs transition-colors"
                          >
                            Confirm Food Picked Up
                          </button>
                        ) : (
                          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-md font-bold text-[11px]">
                            ✓ Food Picked Up
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Customer Drop Card */}
                    <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-blue-700" />
                          <span>2. Drop at Customer Doorstep</span>
                        </span>
                        <span className="text-xs font-bold text-blue-900">3.4 km</span>
                      </div>
                      <h4 className="font-extrabold text-slate-900 text-sm">{activeOrder.customerName}</h4>
                      <p className="text-xs text-slate-600 mt-0.5">{activeOrder.deliveryAddress}</p>

                      <div className="mt-3 pt-3 border-t border-blue-200/80 flex items-center justify-between">
                        <span className="text-xs text-slate-500">Collect: {activeOrder.paymentStatus}</span>
                        <a
                          href={`tel:${activeOrder.customerPhone}`}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>Call Customer</span>
                        </a>
                      </div>
                    </div>

                  </div>

                  {/* Right: Security PIN (OTP) Delivery Verification Box */}
                  <div className="bg-slate-900 text-white rounded-2xl p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <KeyRound className="w-5 h-5 text-amber-400" />
                        <h3 className="font-extrabold text-base">Verify Customer OTP</h3>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Customer will show you a 4-digit PIN on their Bhojj app. Enter that PIN to securely finish delivery and unlock payout.
                      </p>
                      
                      {/* Hint for tester */}
                      <div className="mt-3 p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-[11px] text-amber-300">
                        💡 Demo Hint: Customer's OTP for this order is <strong className="font-mono text-white text-xs">{activeOrder.otp}</strong>
                      </div>
                    </div>

                    <form onSubmit={handleVerifyOtpSubmit} className="mt-6 space-y-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                          Enter 4-Digit Delivery PIN
                        </label>
                        <input
                          type="text"
                          maxLength={4}
                          value={enteredOtp}
                          onChange={(e) => setEnteredOtp(e.target.value)}
                          placeholder="e.g. 4821"
                          className="w-full text-center tracking-[0.4em] text-2xl font-mono font-black py-2.5 px-4 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-hidden focus:ring-2 focus:ring-blue-400"
                        />
                      </div>

                      {otpError && (
                        <p className="text-xs text-red-400 font-semibold">{otpError}</p>
                      )}

                      <button
                        type="submit"
                        className="w-full py-3 px-4 rounded-xl font-black text-sm bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Confirm OTP & Complete Delivery</span>
                      </button>
                    </form>

                  </div>

                </div>
              </div>
            )}

            {/* AVAILABLE ORDERS ON RADAR */}
            {currentRider.isOnline && !activeOrder && (
              <div className="space-y-4">
                <div className="bg-blue-50/60 border border-blue-200 rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-blue-600 animate-ping"></div>
                    <div>
                      <h3 className="font-black text-slate-900 text-sm">Delivery Radar Active</h3>
                      <p className="text-xs text-slate-500">Searching orders within 5 km of your location in {currentRider.zone}...</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
                    {availableOrders.length} Ready for Pickup
                  </span>
                </div>

                {availableOrders.length === 0 ? (
                  <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
                    <Bike className="w-12 h-12 text-slate-300 mx-auto mb-2 animate-pulse" />
                    <h3 className="font-bold text-slate-800 text-base">Scanning for new orders...</h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                      All currently packed orders have been assigned. You will be notified the instant a kitchen marks a meal ready.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {availableOrders.map((order) => (
                      <div key={order.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <div>
                              <span className="font-black text-base text-slate-900">Order #{order.id}</span>
                              <div className="text-xs text-slate-500">{order.restaurantName}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-base font-black text-emerald-600">+₹65.00</div>
                              <span className="text-[10px] text-slate-400">Est. Payout</span>
                            </div>
                          </div>

                          <div className="py-3 space-y-2 text-xs">
                            <div className="flex items-center gap-2 text-slate-700">
                              <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                              <span>Pickup: <strong>{order.restaurantName}</strong> (2.3 km)</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-700">
                              <Navigation className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                              <span>Drop: <strong>{order.customerName}</strong> ({order.deliveryAddress})</span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => acceptDeliveryRun(order.id, currentRider.userId)}
                          className="w-full mt-3 py-2.5 px-4 rounded-xl text-xs font-black text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-xs flex items-center justify-center gap-1.5"
                        >
                          <Bike className="w-4 h-4" />
                          <span>Accept Delivery Run (₹65)</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        )}

        {/* ================= TAB 2: EARNINGS & WALLET ================= */}
        {activeTab === 'earnings' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 mb-2 inline-block">
                  Bhojj Rider Wallet
                </span>
                <h2 className="text-3xl font-black tracking-tight">
                  ₹{currentRider.todayEarnings}.00
                </h2>
                <p className="text-xs text-blue-200 mt-1">
                  Today's accumulated earnings from {currentRider.todayTrips} deliveries + tips
                </p>
              </div>

              <button
                onClick={() => setWithdrawModalOpen(true)}
                className="px-6 py-3 rounded-xl font-black text-xs sm:text-sm bg-emerald-500 hover:bg-emerald-600 text-white shadow-md transition-colors shrink-0 flex items-center gap-2"
              >
                <Wallet className="w-4 h-4" />
                <span>Withdraw to UPI / Bank</span>
              </button>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
              <h3 className="font-black text-slate-900 text-base mb-4">Earnings Breakdown</h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between p-3 rounded-xl bg-slate-50">
                  <span className="text-slate-600">Base Trip Delivery Pay</span>
                  <span className="font-bold text-slate-900">₹{currentRider.todayTrips * 45}</span>
                </div>
                <div className="flex justify-between p-3 rounded-xl bg-slate-50">
                  <span className="text-slate-600">Distance & Surge Incentives</span>
                  <span className="font-bold text-slate-900">₹{currentRider.todayTrips * 15}</span>
                </div>
                <div className="flex justify-between p-3 rounded-xl bg-slate-50">
                  <span className="text-slate-600">100% Customer Tips</span>
                  <span className="font-bold text-emerald-700">+₹{Math.max(0, currentRider.todayEarnings - (currentRider.todayTrips * 60))}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: DELIVERY HISTORY ================= */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            <h3 className="font-black text-slate-900 text-base">Completed Delivery Runs</h3>
            {completedOrders.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 text-center border border-slate-200">
                <p className="text-xs text-slate-500">No deliveries completed yet today.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
                {completedOrders.map((order) => (
                  <div key={order.id} className="p-4 sm:p-5 flex items-center justify-between gap-4 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">Order #{order.id}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">Delivered</span>
                      </div>
                      <div className="text-slate-500 mt-0.5">
                        {order.restaurantName} ➔ {order.customerName}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-black text-emerald-700 text-sm">+₹65.00</div>
                      <span className="text-[10px] text-slate-400">PIN Verified</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 4: RIDER PROFILE ================= */}
        {activeTab === 'profile' && (
          <RiderProfile rider={currentRider} />
        )}

      </div>

      {/* ================= WITHDRAW MODAL ================= */}
      {withdrawModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-2xs animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-100">
            <h3 className="font-black text-slate-900 text-base">Instant Wallet Payout</h3>
            <p className="text-xs text-slate-500 mt-0.5">Transfer available ₹{currentRider.todayEarnings} to your registered UPI ID.</p>

            <div className="my-4 p-3 bg-slate-50 rounded-xl text-xs space-y-1">
              <div className="text-slate-500">Recipient UPI ID:</div>
              <div className="font-bold text-slate-900">9123456789@okaxis</div>
            </div>

            {withdrawSuccess ? (
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold text-center mb-4">
                ✓ ₹{currentRider.todayEarnings} successfully disbursed to bank!
              </div>
            ) : null}

            <div className="flex gap-2">
              <button
                onClick={() => { setWithdrawModalOpen(false); setWithdrawSuccess(false); }}
                className="flex-1 py-2 text-xs font-bold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200"
              >
                Close
              </button>
              <button
                onClick={() => setWithdrawSuccess(true)}
                className="flex-1 py-2 text-xs font-bold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700"
              >
                Disburse Funds
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
