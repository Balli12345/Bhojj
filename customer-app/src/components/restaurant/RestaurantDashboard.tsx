import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { MenuItem, Order, OrderStatus } from '../../types';
import { RestaurantProfile } from './RestaurantProfile';
import { soundEffects } from '../../utils/soundEffects';
import { 
  Store, 
  UtensilsCrossed, 
  Clock, 
  CheckCircle2, 
  Plus, 
  X, 
  Edit3, 
  Trash2, 
  Power, 
  DollarSign, 
  TrendingUp, 
  Bike, 
  Phone, 
  MapPin, 
  AlertCircle, 
  Star, 
  FileText, 
  ChefHat,
  Radio,
  Volume2,
  VolumeX,
  Sparkles,
  Bell,
  Ticket
} from 'lucide-react';
import { RestaurantTableBookings } from './RestaurantTableBookings';

export const RestaurantDashboard: React.FC = () => {
  const { 
    currentUser, 
    restaurants, 
    toggleKitchenStatus, 
    updateRestaurant, 
    menuItems, 
    addMenuItem, 
    updateMenuItem, 
    toggleMenuItemStock, 
    deleteMenuItem, 
    orders, 
    updateOrderStatus,
    simulateIncomingOrderForRestaurant,
    tableBookings
  } = useApp();

  const [isAlertMuted, setIsAlertMuted] = useState(soundEffects.getMuted());

  // Find the restaurant associated with current user
  const currentRestaurant = restaurants.find(r => r.id === currentUser?.restaurantId || r.ownerName.includes(currentUser?.name || '')) || restaurants[0];

  const [activeTab, setActiveTab] = useState<'pipeline' | 'menu' | 'bookings' | 'analytics' | 'profile'>('pipeline');
  const [pipelineFilter, setPipelineFilter] = useState<'all' | 'new' | 'preparing' | 'ready' | 'delivered'>('all');

  useEffect(() => {
    const handleTabChange = (e: any) => {
      if (e.detail && ['pipeline', 'menu', 'bookings', 'analytics', 'profile'].includes(e.detail)) {
        setActiveTab(e.detail);
      }
    };
    window.addEventListener('open-restaurant-tab', handleTabChange);
    return () => window.removeEventListener('open-restaurant-tab', handleTabChange);
  }, []);

  // Add Dish Modal
  const [addDishModalOpen, setAddDishModalOpen] = useState(false);
  const [newDishName, setNewDishName] = useState('');
  const [newDishCategory, setNewDishCategory] = useState<MenuItem['category']>('Thali');
  const [newDishPrice, setNewDishPrice] = useState<number>(180);
  const [newDishDesc, setNewDishDesc] = useState('');
  const [newDishIsVeg, setNewDishIsVeg] = useState(true);
  const [newDishPrepTime, setNewDishPrepTime] = useState(20);
  const [newDishImage, setNewDishImage] = useState('https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=80');

  // Edit Dish Price Modal
  const [editingDish, setEditingDish] = useState<MenuItem | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);

  // Filter orders for this restaurant
  const restaurantOrders = orders.filter(o => o.restaurantId === currentRestaurant.id || o.restaurantName.toLowerCase().includes(currentRestaurant.name.toLowerCase()));

  // Filter dishes for this restaurant
  const restaurantDishes = menuItems.filter(m => m.restaurantId === currentRestaurant.id);

  // Pipeline counts
  const newOrders = restaurantOrders.filter(o => o.status === 'placed');
  const preparingOrders = restaurantOrders.filter(o => o.status === 'accepted' || o.status === 'preparing');
  const readyOrders = restaurantOrders.filter(o => o.status === 'ready_for_pickup' || o.status === 'out_for_delivery');
  const completedOrders = restaurantOrders.filter(o => o.status === 'delivered');

  // Today Revenue calculation
  const totalRevenue = completedOrders.reduce((sum, o) => sum + o.subtotal, 0);

  const displayedOrders = restaurantOrders.filter(o => {
    if (pipelineFilter === 'new') return o.status === 'placed';
    if (pipelineFilter === 'preparing') return o.status === 'accepted' || o.status === 'preparing';
    if (pipelineFilter === 'ready') return o.status === 'ready_for_pickup' || o.status === 'out_for_delivery';
    if (pipelineFilter === 'delivered') return o.status === 'delivered';
    return true;
  });

  const handleAddDishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDishName) return;

    addMenuItem({
      restaurantId: currentRestaurant.id,
      name: newDishName,
      category: newDishCategory,
      price: Number(newDishPrice),
      description: newDishDesc || 'Freshly prepared signature delicacy made with authentic spices.',
      isVeg: newDishIsVeg,
      prepTimeMinutes: Number(newDishPrepTime),
      image: newDishImage,
      inStock: true,
    });

    setNewDishName('');
    setNewDishDesc('');
    setAddDishModalOpen(false);
  };

  const handleSaveEditPrice = () => {
    if (editingDish) {
      updateMenuItem({
        ...editingDish,
        price: Number(editPrice),
      });
      setEditingDish(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      
      {/* Top Kitchen Hero Banner */}
      <div className="bg-white border-b border-slate-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center font-black shadow-md shadow-amber-500/20 shrink-0">
                <ChefHat className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    {currentRestaurant.name}
                  </h1>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold border border-amber-200">
                    FSSAI: {currentRestaurant.fssaiNumber}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Chef {currentUser?.name || currentRestaurant.ownerName} • {currentRestaurant.cuisine}
                </p>
              </div>
            </div>

            {/* Kitchen Open/Close Switch & Navigation */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => toggleKitchenStatus(currentRestaurant.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black border transition-all ${currentRestaurant.isOpen ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-2xs hover:bg-emerald-100' : 'bg-red-50 text-red-800 border-red-300 shadow-2xs hover:bg-red-100'}`}
              >
                <Power className={`w-4 h-4 ${currentRestaurant.isOpen ? 'text-emerald-600' : 'text-red-600'}`} />
                <span>{currentRestaurant.isOpen ? 'KITCHEN OPEN (Accepting Orders)' : 'KITCHEN CLOSED (Paused)'}</span>
              </button>

              <button
                onClick={() => setAddDishModalOpen(true)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Add Dish</span>
              </button>
            </div>

          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-100">
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80">
              <div className="text-[11px] font-bold text-slate-500 uppercase">Incoming Placed</div>
              <div className="text-2xl font-black text-orange-600 mt-0.5">{newOrders.length} Orders</div>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80">
              <div className="text-[11px] font-bold text-slate-500 uppercase">Cooking In Kitchen</div>
              <div className="text-2xl font-black text-indigo-600 mt-0.5">{preparingOrders.length} Orders</div>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80">
              <div className="text-[11px] font-bold text-slate-500 uppercase">Today's Revenue</div>
              <div className="text-2xl font-black text-emerald-600 mt-0.5">₹{totalRevenue}</div>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80">
              <div className="text-[11px] font-bold text-slate-500 uppercase">Kitchen Rating</div>
              <div className="text-2xl font-black text-amber-500 mt-0.5 flex items-center gap-1">
                <span>{currentRestaurant.rating}</span>
                <Star className="w-5 h-5 fill-amber-500" />
              </div>
            </div>
          </div>

          {/* Nav Tabs */}
          <div className="flex items-center gap-2 mt-5 overflow-x-auto pb-1">
            <button
              onClick={() => setActiveTab('pipeline')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${activeTab === 'pipeline' ? 'bg-amber-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:text-slate-900'}`}
            >
              Live Kitchen Orders ({restaurantOrders.length})
            </button>
            <button
              id="restaurant-tab-bookings"
              onClick={() => setActiveTab('bookings')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'bookings'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              <Ticket className="w-4 h-4" />
              <span>Table Bookings ({tableBookings.filter(b => b.restaurantId === currentRestaurant.id || b.restaurantName.toLowerCase().includes(currentRestaurant.name.toLowerCase())).length})</span>
              {tableBookings.filter(b => (b.restaurantId === currentRestaurant.id || b.restaurantName.toLowerCase().includes(currentRestaurant.name.toLowerCase())) && (b.status === 'confirmed' || b.status === 'ready_for_seating')).length > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                  activeTab === 'bookings' ? 'bg-white text-amber-700' : 'bg-red-500 text-white animate-pulse'
                }`}>
                  {tableBookings.filter(b => (b.restaurantId === currentRestaurant.id || b.restaurantName.toLowerCase().includes(currentRestaurant.name.toLowerCase())) && (b.status === 'confirmed' || b.status === 'ready_for_seating')).length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('menu')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${activeTab === 'menu' ? 'bg-amber-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:text-slate-900'}`}
            >
              Menu & Inventory ({restaurantDishes.length})
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${activeTab === 'analytics' ? 'bg-amber-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:text-slate-900'}`}
            >
              Kitchen Analytics
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${activeTab === 'profile' ? 'bg-amber-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:text-slate-900'}`}
            >
              Kitchen Info & FSSAI
            </button>
          </div>

        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* ================= TAB 1: LIVE KITCHEN PIPELINE ================= */}
        {activeTab === 'pipeline' && (
          <div className="space-y-4">
            
            {/* Live Order Radar & Sound Alert Control Bar */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 rounded-2xl p-3 sm:p-4 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md border border-amber-500/30">
              <div className="flex items-center gap-3">
                <div className="relative flex h-3.5 w-3.5 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black tracking-wide text-white flex items-center gap-1.5">
                      <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                      Live Order Radar: ONLINE
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                      Polling Every 3s
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    Real-time audio chime triggers automatically when devotees book thalis.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => {
                    const nextMuted = soundEffects.toggleMute();
                    setIsAlertMuted(nextMuted);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
                    isAlertMuted 
                      ? 'bg-red-500/20 text-red-300 border-red-500/40 hover:bg-red-500/30' 
                      : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                  }`}
                  title={isAlertMuted ? 'Unmute Audio Chime' : 'Mute Audio Chime'}
                >
                  {isAlertMuted ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5 text-red-400" />
                      <span>Sound Off</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Chime On</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => simulateIncomingOrderForRestaurant(currentRestaurant.id)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-black bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center gap-1.5 shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>⚡ Test New Order Alert</span>
                </button>
              </div>
            </div>

            {/* Pipeline Stage Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {[
                { id: 'all', label: `All Orders (${restaurantOrders.length})` },
                { id: 'new', label: `New Incoming (${newOrders.length})` },
                { id: 'preparing', label: `Cooking (${preparingOrders.length})` },
                { id: 'ready', label: `Ready / Dispatched (${readyOrders.length})` },
                { id: 'delivered', label: `Delivered (${completedOrders.length})` },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setPipelineFilter(f.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors whitespace-nowrap ${pipelineFilter === f.id ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {displayedOrders.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
                <ChefHat className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <h3 className="font-bold text-slate-800 text-base">No orders in this stage</h3>
                <p className="text-xs text-slate-500 mt-1">When customers place orders, they will appear here with instant sound alert.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {displayedOrders.map((order) => {
                  const isNew = order.status === 'placed';
                  const isCooking = order.status === 'accepted' || order.status === 'preparing';
                  const isReady = order.status === 'ready_for_pickup';
                  const isDispatched = order.status === 'out_for_delivery';
                  const isDelivered = order.status === 'delivered';

                  return (
                    <div 
                      key={order.id}
                      className={`bg-white rounded-2xl border p-5 shadow-xs flex flex-col justify-between ${isNew ? 'border-orange-400 ring-2 ring-orange-400/20 bg-orange-50/20' : 'border-slate-200'}`}
                    >
                      <div>
                        {/* Header */}
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-black text-base text-slate-900">Order #{order.id}</span>
                              <span className="text-xs px-2 py-0.5 rounded font-bold uppercase tracking-wider bg-slate-100 text-slate-800">
                                {order.status.replace(/_/g, ' ')}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">{order.orderTime}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-lg font-black text-slate-900">₹{order.subtotal}</span>
                            <div className="text-[10px] text-slate-400">{order.paymentMethod}</div>
                          </div>
                        </div>

                        {/* Customer & Address */}
                        <div className="py-3 border-b border-slate-100 text-xs">
                          <div className="font-bold text-slate-900">{order.customerName} ({order.customerPhone})</div>
                          <div className="text-slate-500 truncate mt-0.5">{order.deliveryAddress}</div>
                        </div>

                        {/* Order Items List for Chef */}
                        <div className="py-3 space-y-2 text-xs">
                          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Kitchen Items to Prepare:</div>
                          {order.items.map((it, idx) => (
                            <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                              <span className="font-bold text-slate-900">{it.quantity}x {it.name}</span>
                              <span className="text-slate-500">₹{it.price * it.quantity}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Action Buttons for Kitchen Partner */}
                      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                        {isNew && (
                          <>
                            <button
                              onClick={() => updateOrderStatus(order.id, 'cancelled')}
                              className="px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 border border-red-200 transition-colors"
                            >
                              Decline
                            </button>
                            <button
                              onClick={() => updateOrderStatus(order.id, 'accepted')}
                              className="flex-1 py-2 px-4 rounded-xl text-xs font-black text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-xs flex items-center justify-center gap-1.5"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Accept Order & Start Prep</span>
                            </button>
                          </>
                        )}

                        {isCooking && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'ready_for_pickup')}
                            className="w-full py-2.5 px-4 rounded-xl text-xs font-black text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-xs flex items-center justify-center gap-1.5"
                          >
                            <UtensilsCrossed className="w-4 h-4" />
                            <span>Mark Food Ready & Notify Delivery Rider</span>
                          </button>
                        )}

                        {isReady && (
                          <div className="w-full p-2.5 rounded-xl bg-purple-50 border border-purple-200 text-xs text-purple-900 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Bike className="w-4 h-4 text-purple-600 animate-bounce" />
                              <span>Waiting for Rider to collect packet</span>
                            </div>
                            <span className="font-bold text-purple-800">OTP Required: {order.otp}</span>
                          </div>
                        )}

                        {isDispatched && (
                          <div className="w-full p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Bike className="w-4 h-4 text-blue-600" />
                              <span>Handed over to {order.riderName || 'Rider Hero'}</span>
                            </div>
                            <span className="text-[11px] font-bold text-blue-700">En-route</span>
                          </div>
                        )}

                        {isDelivered && (
                          <div className="w-full p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-bold flex items-center justify-between">
                            <span className="flex items-center gap-1">
                              <CheckCircle2 className="w-4 h-4" /> Delivered to Customer
                            </span>
                            <span>Payout Credited (+₹{order.subtotal})</span>
                          </div>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>
            )}

          </div>
        )}

        {/* ================= TAB 2: MENU & INVENTORY MANAGEMENT ================= */}
        {activeTab === 'menu' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Kitchen Dishes & Live Stock</h2>
                <p className="text-xs text-slate-500">Toggle in-stock status if ingredients are finished, or edit prices.</p>
              </div>
              <button
                onClick={() => setAddDishModalOpen(true)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Dish</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {restaurantDishes.map((dish) => (
                <div key={dish.id} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <img
                        src={dish.image}
                        alt={dish.name}
                        className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${dish.isVeg ? 'bg-emerald-600' : 'bg-amber-600'}`}></span>
                          <h4 className="font-extrabold text-sm text-slate-900 truncate">{dish.name}</h4>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{dish.description}</p>
                        <div className="text-xs font-bold text-slate-900 mt-1">₹{dish.price}</div>
                      </div>
                    </div>
                  </div>

                  {/* Stock Toggle & Edit Controls */}
                  <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => toggleMenuItemStock(dish.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${dish.inStock ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-slate-100 text-slate-500 border-slate-300'}`}
                    >
                      {dish.inStock ? '🟢 In Stock (Active)' : '🔴 Out of Stock (Paused)'}
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => { setEditingDish(dish); setEditPrice(dish.price); }}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                        title="Edit Price"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteMenuItem(dish.id)}
                        className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50"
                        title="Delete Dish"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB: TABLE BOOKINGS (ZOMATO DINING) ================= */}
        {activeTab === 'bookings' && (
          <RestaurantTableBookings restaurant={currentRestaurant} />
        )}

        {/* ================= TAB 3: KITCHEN ANALYTICS ================= */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
              <h3 className="font-black text-slate-900 text-base mb-4">Financial & Order Performance</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200">
                  <div className="text-xs font-bold text-amber-800">Gross Sales Value</div>
                  <div className="text-3xl font-black text-amber-900 mt-1">₹{totalRevenue}</div>
                  <div className="text-[11px] text-amber-700 mt-0.5">Across {completedOrders.length} completed orders</div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200">
                  <div className="text-xs font-bold text-emerald-800">Net Restaurant Payout (85%)</div>
                  <div className="text-3xl font-black text-emerald-900 mt-1">₹{Math.round(totalRevenue * 0.85)}</div>
                  <div className="text-[11px] text-emerald-700 mt-0.5">Direct to linked bank account</div>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200">
                  <div className="text-xs font-bold text-blue-800">Platform Convenience Fee (15%)</div>
                  <div className="text-3xl font-black text-blue-900 mt-1">₹{Math.round(totalRevenue * 0.15)}</div>
                  <div className="text-[11px] text-blue-700 mt-0.5">Logistics & rider fleet management</div>
                </div>
              </div>

              <h4 className="font-bold text-slate-800 text-sm mb-3">Top Selling Dishes in Your Kitchen</h4>
              <div className="divide-y divide-slate-100 text-xs">
                {restaurantDishes.slice(0, 4).map((dish, i) => (
                  <div key={dish.id} className="py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-slate-400">#{i + 1}</span>
                      <span className="font-bold text-slate-900">{dish.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-slate-500">₹{dish.price}</span>
                      <span className="font-bold text-emerald-700">{dish.reviewsCount * 3} orders</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 4: KITCHEN PROFILE & FSSAI ================= */}
        {activeTab === 'profile' && (
          <RestaurantProfile restaurant={currentRestaurant} />
        )}

      </div>

      {/* ================= ADD DISH MODAL ================= */}
      {addDishModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-2xs animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-slate-900 text-base">Add New Dish to Menu</h3>
              <button onClick={() => setAddDishModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddDishSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Dish Title *</label>
                <input
                  type="text"
                  required
                  value={newDishName}
                  onChange={(e) => setNewDishName(e.target.value)}
                  placeholder="e.g. Shahi Kaju Paneer Thali"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={newDishCategory}
                    onChange={(e) => setNewDishCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                  >
                    <option value="Thali">Thali</option>
                    <option value="Curry & Sabzi">Curry & Sabzi</option>
                    <option value="Breads">Breads</option>
                    <option value="Rice & Biryani">Rice & Biryani</option>
                    <option value="Tiffin Meal">Tiffin Meal</option>
                    <option value="Snacks">Snacks</option>
                    <option value="Desserts & Drinks">Desserts & Drinks</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newDishPrice}
                    onChange={(e) => setNewDishPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newDishDesc}
                  onChange={(e) => setNewDishDesc(e.target.value)}
                  placeholder="Ingredients, gravies, number of rotis, sides included..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Dietary Tag</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setNewDishIsVeg(true)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold border ${newDishIsVeg ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-700 border-slate-300'}`}
                    >
                      🟢 Veg
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewDishIsVeg(false)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold border ${!newDishIsVeg ? 'bg-amber-600 text-white border-amber-600' : 'bg-white text-slate-700 border-slate-300'}`}
                    >
                      🔴 Non-Veg
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Prep Time (Mins)</label>
                  <input
                    type="number"
                    value={newDishPrepTime}
                    onChange={(e) => setNewDishPrepTime(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Dish Image URL</label>
                <input
                  type="text"
                  value={newDishImage}
                  onChange={(e) => setNewDishImage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAddDishModalOpen(false)}
                  className="flex-1 py-2 text-xs font-bold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-bold text-white bg-amber-600 rounded-xl hover:bg-amber-700"
                >
                  Save & Publish Dish
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ================= EDIT PRICE MODAL ================= */}
      {editingDish && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-2xs animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl border border-slate-100">
            <h3 className="font-black text-slate-900 text-base">Edit Price for {editingDish.name}</h3>
            <div className="my-4">
              <label className="block text-xs font-bold text-slate-700 mb-1">New Price (₹)</label>
              <input
                type="number"
                value={editPrice}
                onChange={(e) => setEditPrice(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setEditingDish(null)}
                className="flex-1 py-2 text-xs font-bold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEditPrice}
                className="flex-1 py-2 text-xs font-bold text-white bg-amber-600 rounded-lg hover:bg-amber-700"
              >
                Update Price
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
