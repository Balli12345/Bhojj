import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserAddress, UserPreferences, Order } from '../../types';
import { 
  User as UserIcon, 
  MapPin, 
  Phone, 
  Mail, 
  Settings, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Check, 
  Home, 
  Building, 
  Hotel, 
  Compass, 
  Briefcase, 
  ShieldCheck, 
  Sparkles, 
  RotateCcw, 
  Clock, 
  ArrowRight, 
  X, 
  Edit3, 
  Bell, 
  HeartHandshake,
  Utensils,
  Wallet
} from 'lucide-react';

interface CustomerProfileProps {
  onBackToMenu?: () => void;
}

export const CustomerProfile: React.FC<CustomerProfileProps> = ({ onBackToMenu }) => {
  const { 
    currentUser, 
    updateUser, 
    orders, 
    addToCart, 
    setIsCartOpen,
    menuItems,
    walletBalance 
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'contact' | 'addresses' | 'preferences' | 'orders'>('contact');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // 1. Contact Info Form State
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [alternatePhone, setAlternatePhone] = useState(currentUser?.alternatePhone || '');
  const [city, setCity] = useState(currentUser?.city || 'Goverdhan');

  // 2. Address State
  const [addresses, setAddresses] = useState<UserAddress[]>(
    currentUser?.savedAddresses && currentUser.savedAddresses.length > 0
      ? currentUser.savedAddresses
      : [
          {
            id: 'addr-default',
            label: 'Ashram / Dharamshala',
            addressLine: currentUser?.address || 'Room 204, Shri Radha Govind Dharamshala, Dan Ghati Marg',
            landmark: 'Near Dan Ghati Mandir',
            areaZone: 'Dan Ghati',
            city: currentUser?.city || 'Goverdhan',
            phone: currentUser?.phone || '+91 98765 43210',
            deliveryInstructions: 'Leave with reception or call on arrival.',
            isDefault: true,
          }
        ]
  );
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [newLabel, setNewLabel] = useState<UserAddress['label']>('Ashram / Dharamshala');
  const [newAddressLine, setNewAddressLine] = useState('');
  const [newLandmark, setNewLandmark] = useState('');
  const [newAreaZone, setNewAreaZone] = useState('Dan Ghati');
  const [newInstructions, setNewInstructions] = useState('');
  const [newAddressPhone, setNewAddressPhone] = useState(currentUser?.phone || '');
  const [newIsDefault, setNewIsDefault] = useState(false);

  // 3. Preferences State
  const [dietary, setDietary] = useState<'satvik' | 'jain' | 'pure-veg'>(
    currentUser?.preferences?.dietary || 'satvik'
  );
  const [spiceLevel, setSpiceLevel] = useState<'mild' | 'medium' | 'desi-spicy'>(
    currentUser?.preferences?.spiceLevel || 'medium'
  );
  const [cutlery, setCutlery] = useState<'dont-send' | 'send-eco-friendly'>(
    currentUser?.preferences?.cutleryPreference || 'send-eco-friendly'
  );
  const [defaultDeliveryNotes, setDefaultDeliveryNotes] = useState(
    currentUser?.preferences?.deliveryInstructions || 'Call when at the ashram gate.'
  );
  const [whatsappUpdates, setWhatsappUpdates] = useState(
    currentUser?.preferences?.receiveWhatsappUpdates ?? true
  );
  const [smsUpdates, setSmsUpdates] = useState(
    currentUser?.preferences?.receiveSmsUpdates ?? true
  );

  const showNotification = (msg: string) => {
    setSaveSuccessMsg(msg);
    setTimeout(() => setSaveSuccessMsg(''), 3500);
  };

  // Save Contact Information
  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const updated = {
      ...currentUser,
      name,
      email,
      phone,
      alternatePhone,
      city,
    };
    updateUser(updated);
    showNotification('Contact information saved successfully!');
  };

  // Add New Address
  const handleAddAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddressLine.trim() || !currentUser) return;

    const newAddr: UserAddress = {
      id: `addr-${Date.now()}`,
      label: newLabel,
      addressLine: newAddressLine,
      landmark: newLandmark,
      areaZone: newAreaZone,
      city: 'Goverdhan',
      phone: newAddressPhone || phone,
      deliveryInstructions: newInstructions,
      isDefault: newIsDefault || addresses.length === 0,
    };

    let updatedList = [...addresses];
    if (newAddr.isDefault) {
      updatedList = updatedList.map(a => ({ ...a, isDefault: false }));
    }
    updatedList.push(newAddr);

    setAddresses(updatedList);
    updateUser({
      ...currentUser,
      address: newAddr.isDefault ? newAddr.addressLine : currentUser.address,
      savedAddresses: updatedList,
    });

    setShowAddAddressModal(false);
    setNewAddressLine('');
    setNewLandmark('');
    setNewInstructions('');
    showNotification('New address added to your address book!');
  };

  // Delete Address
  const handleDeleteAddress = (addrId: string) => {
    if (!currentUser) return;
    const filtered = addresses.filter(a => a.id !== addrId);
    if (filtered.length > 0 && !filtered.some(a => a.isDefault)) {
      filtered[0].isDefault = true;
    }
    setAddresses(filtered);
    updateUser({
      ...currentUser,
      savedAddresses: filtered,
    });
    showNotification('Address removed.');
  };

  // Set Default Address
  const handleSetDefaultAddress = (addrId: string) => {
    if (!currentUser) return;
    const updated = addresses.map(a => ({
      ...a,
      isDefault: a.id === addrId,
    }));
    const target = updated.find(a => a.id === addrId);
    setAddresses(updated);
    updateUser({
      ...currentUser,
      address: target?.addressLine || currentUser.address,
      savedAddresses: updated,
    });
    showNotification(`"${target?.label}" set as primary delivery address.`);
  };

  // Save Preferences
  const handleSavePreferences = () => {
    if (!currentUser) return;
    const prefObj: UserPreferences = {
      dietary,
      spiceLevel,
      cutleryPreference: cutlery,
      deliveryInstructions: defaultDeliveryNotes,
      receiveWhatsappUpdates: whatsappUpdates,
      receiveSmsUpdates: smsUpdates,
    };

    updateUser({
      ...currentUser,
      preferences: prefObj,
      dietaryPreference: dietary === 'satvik' || dietary === 'jain' ? 'veg' : 'veg',
    });
    showNotification('Food & delivery preferences updated!');
  };

  // Quick 1-Click Reorder from History
  const handleReorder = (order: Order) => {
    // Add all items of this order to cart
    order.items.forEach(item => {
      const originalMenu = menuItems.find(m => m.id === item.id) || {
        id: item.id,
        restaurantId: order.restaurantId,
        name: item.name,
        description: 'Authentic Goverdhan Satvik Preparation',
        price: item.price,
        category: 'Thali',
        isVeg: item.isVeg,
        image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=500&auto=format&fit=crop&q=80',
        rating: 4.9,
        reviewsCount: 150,
        inStock: true,
        prepTimeMinutes: 25,
      };
      addToCart(originalMenu as any, item.quantity);
    });
    setIsCartOpen(true);
    showNotification(`Added ${order.items.length} dishes to cart for instant checkout!`);
  };

  const userOrders = orders.filter(o => 
    o.customerId === currentUser?.id || 
    (currentUser?.phone && o.customerPhone === currentUser.phone)
  );

  const getLabelIcon = (label: UserAddress['label']) => {
    switch (label) {
      case 'Home': return <Home className="w-4 h-4 text-amber-600" />;
      case 'Ashram / Dharamshala': return <Building className="w-4 h-4 text-orange-600" />;
      case 'Hotel / Room': return <Hotel className="w-4 h-4 text-sky-600" />;
      case 'Parikrama Point': return <Compass className="w-4 h-4 text-emerald-600" />;
      case 'Office': return <Briefcase className="w-4 h-4 text-indigo-600" />;
      default: return <MapPin className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Success Alert Banner */}
      {saveSuccessMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-lg flex items-center justify-between animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{saveSuccessMsg}</span>
          </div>
          <button onClick={() => setSaveSuccessMsg('')} className="p-1 hover:bg-emerald-600 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Profile Overview Card */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
          
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
            <div className="relative">
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'}
                alt={currentUser?.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-3 border-white/80 shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full border-2 border-white shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5" />
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{currentUser?.name || 'Valued Guest'}</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-[11px] font-extrabold uppercase tracking-wider backdrop-blur-xs">
                  Bhojj Customer
                </span>
              </div>
              <p className="text-xs sm:text-sm text-orange-100 font-medium flex items-center justify-center sm:justify-start gap-1.5">
                <Mail className="w-3.5 h-3.5 opacity-80" />
                <span>{currentUser?.email || 'priya@bhojj.in'}</span>
                <span>•</span>
                <Phone className="w-3.5 h-3.5 opacity-80" />
                <span>{currentUser?.phone || '+91 98765 43210'}</span>
              </p>
              <div className="text-[11px] text-orange-200/90 pt-1">
                Goverdhan Dham Devotee Account • Member since {currentUser?.createdAt || '2026'}
              </div>
            </div>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
            {onBackToMenu && (
              <button
                onClick={onBackToMenu}
                className="px-4 py-2 rounded-xl bg-white text-orange-700 hover:bg-orange-50 font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
              >
                <Utensils className="w-3.5 h-3.5" />
                <span>Browse Menu</span>
              </button>
            )}
            
            <div 
              onClick={() => {
                window.dispatchEvent(new CustomEvent('open-customer-tab', { detail: 'wallet' }));
              }}
              className="text-center sm:text-right bg-black/25 hover:bg-black/35 cursor-pointer backdrop-blur-xs px-3.5 py-1.5 rounded-xl border border-white/20 transition-all group"
              title="Click to manage Bhojj Wallet"
            >
              <span className="text-[10px] uppercase font-bold text-amber-300 flex items-center justify-center sm:justify-end gap-1">
                <Wallet className="w-3 h-3 group-hover:scale-110 transition-transform" /> 
                <span>Bhojj Wallet</span>
              </span>
              <span className="text-lg font-black text-white">₹{walletBalance.toLocaleString('en-IN')}</span>
            </div>

            <div className="text-center sm:text-right bg-black/20 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-white/10">
              <span className="text-[10px] uppercase font-bold text-orange-200 block">Saved Addresses</span>
              <span className="text-lg font-black text-white">{addresses.length} Locations</span>
            </div>
          </div>

        </div>
      </div>

      {/* Secondary Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200">
        <button
          onClick={() => setActiveSubTab('contact')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeSubTab === 'contact'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <UserIcon className="w-4 h-4" />
          <span>Personal & Contact Info</span>
        </button>

        <button
          onClick={() => setActiveSubTab('addresses')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeSubTab === 'addresses'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Saved Addresses ({addresses.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('preferences')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeSubTab === 'preferences'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Food & Satvik Preferences</span>
        </button>

        <button
          onClick={() => setActiveSubTab('orders')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeSubTab === 'orders'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Order History & Fast Reorder ({userOrders.length})</span>
        </button>
      </div>

      {/* ================= TAB 1: CONTACT INFORMATION ================= */}
      {activeSubTab === 'contact' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div>
            <h2 className="text-lg font-black text-slate-900">Personal Contact Information</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              These details are used by the kitchen and delivery rider to contact you regarding your order.
            </p>
          </div>

          <form onSubmit={handleSaveContact} className="space-y-4 max-w-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Name *</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Priya Sharma"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. priya@bhojj.in"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Primary Mobile Phone (OTP & Rider calls) *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">WhatsApp Number / Alternate Phone</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-emerald-600 absolute left-3 top-3" />
                  <input
                    type="tel"
                    value={alternatePhone}
                    onChange={(e) => setAlternatePhone(e.target.value)}
                    placeholder="+91 98765 43211"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Current City / Sacred Dhama</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Goverdhan (Mathura District)"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black text-xs shadow-md shadow-orange-600/20 transition-all"
              >
                Save Contact Information
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ================= TAB 2: SAVED ADDRESSES ================= */}
      {activeSubTab === 'addresses' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
            <div>
              <h2 className="text-lg font-black text-slate-900">Saved Addresses</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage your Ashram, Dharamshala, Hotel, or Parikrama Marg delivery points.
              </p>
            </div>
            <button
              onClick={() => setShowAddAddressModal(true)}
              className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-600/20 transition-all flex items-center justify-center gap-2 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Address</span>
            </button>
          </div>

          {/* Address Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((addr) => (
              <div 
                key={addr.id}
                className={`rounded-3xl p-5 border transition-all relative ${
                  addr.isDefault 
                    ? 'bg-orange-50/50 border-orange-300 ring-2 ring-orange-400/30' 
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-white shadow-2xs border border-slate-100">
                      {getLabelIcon(addr.label)}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-sm">{addr.label}</h3>
                      <span className="text-[11px] text-slate-500">{addr.areaZone || 'Goverdhan'}</span>
                    </div>
                  </div>

                  {addr.isDefault && (
                    <span className="px-2.5 py-0.5 rounded-full bg-orange-600 text-white text-[10px] font-black uppercase tracking-wider">
                      Default
                    </span>
                  )}
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 my-3">
                  <p className="font-medium text-slate-900 leading-relaxed">{addr.addressLine}</p>
                  {addr.landmark && (
                    <p className="text-[11px] text-slate-500">
                      <strong>Landmark:</strong> {addr.landmark}
                    </p>
                  )}
                  {addr.deliveryInstructions && (
                    <p className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200">
                      <strong>Note:</strong> {addr.deliveryInstructions}
                    </p>
                  )}
                  <p className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    <span>Contact: {addr.phone || phone}</span>
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  {!addr.isDefault ? (
                    <button
                      onClick={() => handleSetDefaultAddress(addr.id)}
                      className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Set as Default</span>
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Active Delivery Address</span>
                    </span>
                  )}

                  {addresses.length > 1 && (
                    <button
                      onClick={() => handleDeleteAddress(addr.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Address"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* ================= TAB 3: SATVIK & FOOD PREFERENCES ================= */}
      {activeSubTab === 'preferences' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div>
            <h2 className="text-lg font-black text-slate-900">Food & Account Preferences</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Customize your sacred Satvik dining standards, spice level, and delivery notification settings.
            </p>
          </div>

          <div className="space-y-6 max-w-2xl">
            
            {/* Dietary Selection */}
            <div>
              <label className="block text-xs font-extrabold text-slate-800 mb-2">
                Sacred Dietary Standard
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setDietary('satvik')}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    dietary === 'satvik'
                      ? 'bg-orange-50 border-orange-400 ring-2 ring-orange-400/20'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="font-bold text-xs text-slate-900 flex items-center justify-between">
                    <span>100% Satvik</span>
                    {dietary === 'satvik' && <Check className="w-3.5 h-3.5 text-orange-600" />}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    No Onion, No Garlic. Cooked in pure Desi Cow Ghee.
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setDietary('jain')}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    dietary === 'jain'
                      ? 'bg-orange-50 border-orange-400 ring-2 ring-orange-400/20'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="font-bold text-xs text-slate-900 flex items-center justify-between">
                    <span>Jain Satvik</span>
                    {dietary === 'jain' && <Check className="w-3.5 h-3.5 text-orange-600" />}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    No Onion, No Garlic, No Root Veg (Potato/Carrot/Radish).
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setDietary('pure-veg')}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    dietary === 'pure-veg'
                      ? 'bg-orange-50 border-orange-400 ring-2 ring-orange-400/20'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="font-bold text-xs text-slate-900 flex items-center justify-between">
                    <span>Pure Vegetarian</span>
                    {dietary === 'pure-veg' && <Check className="w-3.5 h-3.5 text-orange-600" />}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Standard authentic North Indian vegetarian recipes.
                  </div>
                </button>
              </div>
            </div>

            {/* Spice Level */}
            <div>
              <label className="block text-xs font-extrabold text-slate-800 mb-2">
                Preferred Spice Level
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'mild', label: 'Mild & Gentle', desc: 'Minimal red chili, stomach friendly' },
                  { id: 'medium', label: 'Balanced (Standard)', desc: 'Authentic temple flavors' },
                  { id: 'desi-spicy', label: 'Braj Desi Masala', desc: 'Full fragrant spices & hing' },
                ].map(s => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSpiceLevel(s.id as any)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      spiceLevel === s.id
                        ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-400/20'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="font-bold text-xs text-slate-900">{s.label}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{s.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Eco Cutlery Preference */}
            <div>
              <label className="block text-xs font-extrabold text-slate-800 mb-2">
                Cutlery & Packaging
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setCutlery('send-eco-friendly')}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    cutlery === 'send-eco-friendly'
                      ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-400/20'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="font-bold text-xs text-slate-900">🍃 Send Eco-Friendly Leaf Dona / Pattal</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Sacred biodegradable packaging included.</div>
                </button>

                <button
                  type="button"
                  onClick={() => setCutlery('dont-send')}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    cutlery === 'dont-send'
                      ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-400/20'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="font-bold text-xs text-slate-900">🌱 No Cutlery Needed (Save Environment)</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">I have my own utensils in ashram/room.</div>
                </button>
              </div>
            </div>

            {/* Default Delivery Instructions */}
            <div>
              <label className="block text-xs font-extrabold text-slate-800 mb-1.5">
                Default Delivery Instructions for Riders
              </label>
              <textarea
                rows={2}
                value={defaultDeliveryNotes}
                onChange={(e) => setDefaultDeliveryNotes(e.target.value)}
                placeholder="e.g. Leave with ashram reception or call once at the gate."
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Live Order Updates via WhatsApp & SMS */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <h3 className="font-extrabold text-slate-900 text-xs">Notification Channels</h3>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-800">WhatsApp Order Tracking</div>
                  <div className="text-[11px] text-slate-500">Get live rider status and food preparation updates on WhatsApp.</div>
                </div>
                <input
                  type="checkbox"
                  checked={whatsappUpdates}
                  onChange={(e) => setWhatsappUpdates(e.target.checked)}
                  className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                <div>
                  <div className="text-xs font-bold text-slate-800">SMS Confirmation & Delivery PIN</div>
                  <div className="text-[11px] text-slate-500">Receive 4-digit verification OTP instantly via SMS.</div>
                </div>
                <input
                  type="checkbox"
                  checked={smsUpdates}
                  onChange={(e) => setSmsUpdates(e.target.checked)}
                  className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleSavePreferences}
                className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black text-xs shadow-md shadow-orange-600/20 transition-all"
              >
                Save Preferences
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ================= TAB 4: ORDER HISTORY & REORDER ================= */}
      {activeSubTab === 'orders' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
            <h2 className="text-lg font-black text-slate-900">Your Past Orders</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Review your meal history and reorder your favorite Goverdhan delicacies with 1-click.
            </p>
          </div>

          {userOrders.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
              <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-extrabold text-slate-800 text-sm">No past orders yet</h3>
              <p className="text-xs text-slate-500 mt-1">Browse the Satvik menu and enjoy fresh pure meals.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {userOrders.map((order) => (
                <div key={order.id} className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900 text-sm">{order.restaurantName}</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          order.status === 'delivered' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-orange-100 text-orange-800'
                        }`}>
                          {order.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Order #{order.id} • {order.orderTime}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="font-black text-slate-900 text-base">₹{order.totalAmount}</div>
                        <span className="text-[10px] text-slate-400">{order.paymentMethod}</span>
                      </div>
                      
                      {/* 1-Click Zomato Fast Reorder Button */}
                      <button
                        onClick={() => handleReorder(order)}
                        className="px-3.5 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black text-xs shadow-md shadow-orange-600/20 transition-all flex items-center gap-1.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reorder</span>
                      </button>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="divide-y divide-slate-100 text-xs text-slate-700">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="py-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                          <span className="font-bold">{item.name}</span>
                          <span className="text-slate-400">× {item.quantity}</span>
                        </div>
                        <span className="font-semibold">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  {/* Delivery Location & Rider info if available */}
                  <div className="bg-slate-50 rounded-2xl p-3 text-[11px] text-slate-600 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                      <span className="truncate max-w-md">{order.deliveryAddress}</span>
                    </div>
                    {order.otp && (
                      <div className="font-mono font-bold text-slate-800">
                        Delivery PIN: {order.otp}
                      </div>
                    )}
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= ADD NEW ADDRESS MODAL ================= */}
      {showAddAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 relative">
            <button
              onClick={() => setShowAddAddressModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4">
              <h3 className="font-black text-slate-900 text-lg">Add New Delivery Address</h3>
              <p className="text-xs text-slate-500">Save your hotel, ashram or dharamshala for fast 1-click checkout.</p>
            </div>

            <form onSubmit={handleAddAddressSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Address Label</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Ashram / Dharamshala', 'Hotel / Room', 'Home', 'Parikrama Point', 'Office', 'Other'] as const).map((lbl) => (
                    <button
                      key={lbl}
                      type="button"
                      onClick={() => setNewLabel(lbl)}
                      className={`px-2.5 py-2 rounded-xl text-[11px] font-bold border transition-all text-center ${
                        newLabel === lbl 
                          ? 'bg-orange-600 text-white border-orange-600' 
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {lbl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Address / Room Details *</label>
                <textarea
                  required
                  rows={2}
                  value={newAddressLine}
                  onChange={(e) => setNewAddressLine(e.target.value)}
                  placeholder="e.g. Room 204, 2nd Floor, Shri Radha Govind Dharamshala, Dan Ghati Marg"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nearest Landmark</label>
                  <input
                    type="text"
                    value={newLandmark}
                    onChange={(e) => setNewLandmark(e.target.value)}
                    placeholder="e.g. Opposite Dan Ghati Gate 2"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Area / Zone</label>
                  <select
                    value={newAreaZone}
                    onChange={(e) => setNewAreaZone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                  >
                    <option value="Dan Ghati">Dan Ghati Central</option>
                    <option value="Radha Kund">Radha Kund Marg</option>
                    <option value="Jatipura">Jatipura / Mukharvind</option>
                    <option value="Manasi Ganga">Manasi Ganga Kund</option>
                    <option value="Punchari">Punchari Ka Lotha</option>
                    <option value="Govardhan Bus Stand">Govardhan Bus Stand Road</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Delivery Instructions for Rider</label>
                <input
                  type="text"
                  value={newInstructions}
                  onChange={(e) => setNewInstructions(e.target.value)}
                  placeholder="e.g. Call at gate, do not ring bell after 9 PM"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="set-as-default"
                  checked={newIsDefault}
                  onChange={(e) => setNewIsDefault(e.target.checked)}
                  className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                />
                <label htmlFor="set-as-default" className="text-xs font-bold text-slate-700">
                  Set as default delivery address
                </label>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddAddressModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-600/20"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
