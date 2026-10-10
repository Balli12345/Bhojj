import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Order, OrderStatus } from '../../types';
import { SuperAdminPortalControl } from './SuperAdminPortalControl';
import { HomePageCmsManager } from './HomePageCmsManager';
import { HostingerDeploymentModal } from './HostingerDeploymentModal';
import { AdminCouponManager } from './AdminCouponManager';
import { 
  ShieldCheck, 
  Store, 
  Bike, 
  Users, 
  DollarSign, 
  TrendingUp, 
  CheckCircle2, 
  XCircle, 
  Sliders, 
  Activity, 
  Search, 
  Clock, 
  Star, 
  RefreshCw, 
  AlertTriangle,
  Layout,
  Download,
  ExternalLink,
  Tag
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { 
    currentUser, 
    restaurants, 
    updateRestaurantVerification, 
    riders, 
    updateRiderVerification, 
    orders, 
    updateOrderStatus, 
    platformCommissionRate, 
    setPlatformCommissionRate,
    resetAllDemoData,
    setCurrentView 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'orders' | 'portals' | 'cms' | 'coupons' | 'kitchens' | 'fleet' | 'commission' | 'hostinger'>('portals');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Platform Metrics
  const totalPlatformGMV = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalCompletedOrders = orders.filter(o => o.status === 'delivered').length;
  const platformRevenue = Math.round(totalPlatformGMV * (platformCommissionRate / 100));

  const filteredOrders = orders.filter(o => {
    const matchesStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
    const matchesSearch = o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          o.restaurantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          o.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      
      {/* Top Admin Terminal Banner */}
      <div className="bg-slate-950 text-white border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 text-white flex items-center justify-center font-black shadow-lg shadow-purple-600/30 shrink-0">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                    Bhojj Platform Command Center
                  </h1>
                  <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-900/60 text-purple-300 font-bold border border-purple-700">
                    Master Admin
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                  Logged in as {currentUser?.name || 'Administrator'} • Realtime System Oversight
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={resetAllDemoData}
                className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-1.5 border border-slate-700"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Demo State</span>
              </button>
            </div>

          </div>

          {/* Core Platform KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800/80">
            <div className="bg-slate-900/80 rounded-xl p-3.5 border border-slate-800">
              <div className="text-[11px] font-bold text-slate-400 uppercase">Gross Merchandise Value</div>
              <div className="text-2xl font-black text-white mt-1">₹{totalPlatformGMV}</div>
              <div className="text-[10px] text-emerald-400 mt-0.5">Across {orders.length} total orders</div>
            </div>

            <div className="bg-slate-900/80 rounded-xl p-3.5 border border-slate-800">
              <div className="text-[11px] font-bold text-slate-400 uppercase">Platform Take (Revenue)</div>
              <div className="text-2xl font-black text-purple-400 mt-1">₹{platformRevenue}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">At {platformCommissionRate}% fee</div>
            </div>

            <div className="bg-slate-900/80 rounded-xl p-3.5 border border-slate-800">
              <div className="text-[11px] font-bold text-slate-400 uppercase">Kitchen Partners</div>
              <div className="text-2xl font-black text-amber-400 mt-1">{restaurants.length} Active</div>
              <div className="text-[10px] text-slate-400 mt-0.5">{restaurants.filter(r => r.isOpen).length} currently open</div>
            </div>

            <div className="bg-slate-900/80 rounded-xl p-3.5 border border-slate-800">
              <div className="text-[11px] font-bold text-slate-400 uppercase">Delivery Fleet</div>
              <div className="text-2xl font-black text-blue-400 mt-1">{riders.length} Riders</div>
              <div className="text-[10px] text-slate-400 mt-0.5">{riders.filter(r => r.isOnline).length} on active shift</div>
            </div>
          </div>

          {/* Admin Navigation Tabs */}
          <div className="flex items-center gap-2 mt-5 overflow-x-auto pb-1">
            <button
              onClick={() => setActiveTab('portals')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${activeTab === 'portals' ? 'bg-purple-600 text-white shadow-xs' : 'bg-slate-900 text-slate-300 hover:text-white'}`}
            >
              <Sliders className="w-4 h-4" />
              <span>Portal Control & Users</span>
            </button>
            <button
              onClick={() => setActiveTab('cms')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${activeTab === 'cms' ? 'bg-purple-600 text-white shadow-xs' : 'bg-slate-900 text-slate-300 hover:text-white'}`}
            >
              <Layout className="w-4 h-4" />
              <span>Home Page Editor (CMS)</span>
            </button>
            <button
              onClick={() => setActiveTab('coupons')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${activeTab === 'coupons' ? 'bg-purple-600 text-white shadow-xs' : 'bg-slate-900 text-slate-300 hover:text-white'}`}
            >
              <Tag className="w-4 h-4 text-amber-300" />
              <span>Coupons & Deals Engine</span>
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${activeTab === 'orders' ? 'bg-purple-600 text-white shadow-xs' : 'bg-slate-900 text-slate-300 hover:text-white'}`}
            >
              Live Order Stream ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('kitchens')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${activeTab === 'kitchens' ? 'bg-purple-600 text-white shadow-xs' : 'bg-slate-900 text-slate-300 hover:text-white'}`}
            >
              Kitchen Approvals ({restaurants.length})
            </button>
            <button
              onClick={() => setActiveTab('fleet')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${activeTab === 'fleet' ? 'bg-purple-600 text-white shadow-xs' : 'bg-slate-900 text-slate-300 hover:text-white'}`}
            >
              Rider Fleet ({riders.length})
            </button>
            <button
              onClick={() => setActiveTab('commission')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${activeTab === 'commission' ? 'bg-purple-600 text-white shadow-xs' : 'bg-slate-900 text-slate-300 hover:text-white'}`}
            >
              Commission & Payouts
            </button>
            <button
              onClick={() => setActiveTab('hostinger')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${activeTab === 'hostinger' ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-xs' : 'bg-slate-900 text-amber-300 hover:text-white'}`}
            >
              <Download className="w-4 h-4" />
              <span>Hostinger ZIP Deploy</span>
            </button>
          </div>

        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* ================= TAB: PORTAL CONTROL & USERS ================= */}
        {activeTab === 'portals' && <SuperAdminPortalControl />}

        {/* ================= TAB: HOME PAGE CMS EDITOR ================= */}
        {activeTab === 'cms' && <HomePageCmsManager />}

        {/* ================= TAB: HOSTINGER DEPLOYMENT & ZIP ================= */}
        {activeTab === 'hostinger' && <HostingerDeploymentModal />}

        {/* ================= TAB 1: LIVE ORDERS MONITOR ================= */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search order ID, restaurant or customer..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
                {['all', 'placed', 'preparing', 'ready_for_pickup', 'out_for_delivery', 'delivered'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setOrderStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize whitespace-nowrap border ${orderStatusFilter === st ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                  >
                    {st.replace(/_/g, ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="p-4">Order ID & Time</th>
                      <th className="p-4">Kitchen</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Status & OTP</th>
                      <th className="p-4">Rider Assigned</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4 text-right">Admin Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-4">
                          <div className="font-bold text-slate-900">{order.id}</div>
                          <div className="text-[11px] text-slate-400">{order.orderTime}</div>
                        </td>
                        <td className="p-4">
                          <div className="font-bold text-slate-800">{order.restaurantName}</div>
                          <div className="text-[10px] text-slate-400">{order.items.length} items</div>
                        </td>
                        <td className="p-4">
                          <div className="font-bold text-slate-800">{order.customerName}</div>
                          <div className="text-[10px] text-slate-400 truncate max-w-xs">{order.deliveryAddress}</div>
                        </td>
                        <td className="p-4">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-slate-100 text-slate-800">
                            {order.status.replace(/_/g, ' ')}
                          </span>
                          <div className="text-[10px] text-purple-700 font-bold mt-1">
                            PIN: {order.otp}
                          </div>
                        </td>
                        <td className="p-4">
                          {order.riderName ? (
                            <div className="font-bold text-slate-900">{order.riderName}</div>
                          ) : (
                            <span className="text-slate-400 italic">Unassigned</span>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="font-black text-slate-900">₹{order.totalAmount}</div>
                          <div className="text-[10px] text-emerald-600 font-bold">{order.paymentStatus}</div>
                        </td>
                        <td className="p-4 text-right">
                          {order.status !== 'delivered' && order.status !== 'cancelled' ? (
                            <button
                              onClick={() => updateOrderStatus(order.id, 'delivered')}
                              className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-300 rounded-lg text-[11px] font-bold"
                            >
                              Force Complete
                            </button>
                          ) : (
                            <span className="text-slate-400 text-[11px]">Archived</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ================= TAB 2: KITCHEN APPROVALS ================= */}
        {activeTab === 'kitchens' && (
          <div className="space-y-4">
            <h3 className="font-black text-slate-900 text-base">Registered Restaurant & Dhaba Partners</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {restaurants.map((rest) => (
                <div key={rest.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <img src={rest.image} alt={rest.name} className="w-16 h-16 rounded-xl object-cover border border-slate-200" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-black text-base text-slate-900 truncate">{rest.name}</h4>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${rest.isVerified ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                            {rest.isVerified ? 'Verified' : 'Pending KYC'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{rest.cuisine}</p>
                        <div className="text-xs text-slate-600 mt-1 font-mono">FSSAI: {rest.fssaiNumber}</div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
                      <div>Owner: <strong className="text-slate-800">{rest.ownerName}</strong> ({rest.phone})</div>
                      <div>Address: {rest.address}</div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      Kitchen is: <strong className={rest.isOpen ? 'text-emerald-600' : 'text-red-600'}>{rest.isOpen ? 'OPEN' : 'CLOSED'}</strong>
                    </span>

                    <button
                      onClick={() => updateRestaurantVerification(rest.id, !rest.isVerified)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${rest.isVerified ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100' : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'}`}
                    >
                      {rest.isVerified ? 'Suspend Kitchen' : 'Approve & Verify'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 3: RIDER FLEET ================= */}
        {activeTab === 'fleet' && (
          <div className="space-y-4">
            <h3 className="font-black text-slate-900 text-base">Delivery Fleet Heroes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {riders.map((rider) => (
                <div key={rider.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-base text-slate-900">{rider.name}</span>
                        <span className={`w-2.5 h-2.5 rounded-full ${rider.isOnline ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                      </div>
                      <span className="text-xs font-bold text-amber-500 flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-500" /> {rider.rating}★
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 space-y-1">
                      <div>Phone: <strong>{rider.phone}</strong></div>
                      <div>Vehicle: <strong>{rider.vehicleType}</strong> ({rider.vehicleNumber})</div>
                      <div>Zone: {rider.zone}</div>
                      <div>Completed Runs: <strong className="text-slate-900">{rider.totalTrips} orders</strong></div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-700">
                      Today's Payout: ₹{rider.todayEarnings}
                    </span>

                    <button
                      onClick={() => updateRiderVerification(rider.id, !rider.isVerified)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${rider.isVerified ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100' : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'}`}
                    >
                      {rider.isVerified ? 'Revoke License' : 'Verify Driver'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB: COUPONS & OFFERS ENGINE ================= */}
        {activeTab === 'coupons' && (
          <AdminCouponManager />
        )}

        {/* ================= TAB 4: COMMISSION & SETTINGS ================= */}
        {activeTab === 'commission' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs max-w-xl">
            <h3 className="font-black text-slate-900 text-lg mb-1">Platform Commission Engine</h3>
            <p className="text-xs text-slate-500 mb-6">Set standard commission percentage deducted from restaurant order totals.</p>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-slate-700 uppercase">Platform Take Rate</label>
                  <span className="text-2xl font-black text-purple-600">{platformCommissionRate}%</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={30}
                  value={platformCommissionRate}
                  onChange={(e) => setPlatformCommissionRate(Number(e.target.value))}
                  className="w-full accent-purple-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>5% (Subsidized)</span>
                  <span>15% (Standard)</span>
                  <span>30% (High Growth)</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 text-xs text-purple-950 space-y-2">
                <div className="font-bold text-sm">Realtime Financial Calculation:</div>
                <div className="flex justify-between">
                  <span>Gross Orders Value:</span>
                  <span className="font-bold">₹{totalPlatformGMV}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Platform Commission ({platformCommissionRate}%):</span>
                  <span className="font-black text-purple-700">₹{platformRevenue}</span>
                </div>
                <div className="flex justify-between">
                  <span>Restaurant Net Settlements ({(100 - platformCommissionRate)}%):</span>
                  <span className="font-black text-slate-900">₹{totalPlatformGMV - platformRevenue}</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
