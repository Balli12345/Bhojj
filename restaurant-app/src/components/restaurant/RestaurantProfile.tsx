import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Restaurant } from '../../types';
import { 
  Store, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  Clock, 
  CreditCard, 
  CheckCircle2, 
  Sparkles, 
  Check, 
  X,
  FileText,
  AlertCircle
} from 'lucide-react';

interface RestaurantProfileProps {
  restaurant: Restaurant;
}

export const RestaurantProfile: React.FC<RestaurantProfileProps> = ({ restaurant }) => {
  const { currentUser, updateUser, updateRestaurant } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'contact' | 'address' | 'operations' | 'payout'>('contact');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // 1. Contact Information
  const [ownerName, setOwnerName] = useState(restaurant.ownerName || currentUser?.name || '');
  const [phone, setPhone] = useState(restaurant.phone || currentUser?.phone || '');
  const [alternatePhone, setAlternatePhone] = useState(restaurant.alternatePhone || currentUser?.alternatePhone || '');
  const [email, setEmail] = useState(restaurant.email || currentUser?.email || '');

  // 2. Kitchen Address & Area
  const [kitchenName, setKitchenName] = useState(restaurant.name);
  const [address, setAddress] = useState(restaurant.address);
  const [landmark, setLandmark] = useState(restaurant.landmark || 'Near Dan Ghati Mandir');
  const [city, setCity] = useState(restaurant.city || 'Goverdhan');
  const [locationZone, setLocationZone] = useState(restaurant.locationZone || 'Dan Ghati Central');

  // 3. Operations & Preferences
  const [tagline, setTagline] = useState(restaurant.tagline || '');
  const [cuisine, setCuisine] = useState(restaurant.cuisine || 'North Indian, Satvik Thali, Bedmi Poori');
  const [fssaiNumber, setFssaiNumber] = useState(restaurant.fssaiNumber || '11422850000341');
  const [deliveryTimeRange, setDeliveryTimeRange] = useState(restaurant.deliveryTimeRange || '20-25 mins');
  const [minOrderValue, setMinOrderValue] = useState(restaurant.minOrderValue || 99);
  const [isOpen, setIsOpen] = useState(restaurant.isOpen);

  // 4. Payout Preferences
  const [upiId, setUpiId] = useState(restaurant.upiId || currentUser?.upiId || 'girirajbhoj@okaxis');

  const showNotification = (msg: string) => {
    setSaveSuccessMsg(msg);
    setTimeout(() => setSaveSuccessMsg(''), 3500);
  };

  const handleSaveAll = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const updatedRest: Restaurant = {
      ...restaurant,
      name: kitchenName,
      ownerName,
      phone,
      alternatePhone,
      email,
      address,
      landmark,
      city,
      locationZone,
      tagline,
      cuisine,
      fssaiNumber,
      deliveryTimeRange,
      minOrderValue: Number(minOrderValue),
      isOpen,
      upiId,
    };

    updateRestaurant(updatedRest);

    if (currentUser) {
      updateUser({
        ...currentUser,
        name: ownerName,
        phone,
        alternatePhone,
        email,
        address,
        upiId,
      });
    }

    showNotification('Kitchen details & partner preferences updated successfully!');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {saveSuccessMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-lg flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{saveSuccessMsg}</span>
          </div>
          <button onClick={() => setSaveSuccessMsg('')} className="p-1 hover:bg-emerald-600 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Hero Overview Card */}
      <div className="bg-gradient-to-r from-amber-700 via-orange-800 to-amber-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
            <img
              src={restaurant.image}
              alt={restaurant.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-3 border-white/80 shadow-md"
            />
            <div className="space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-xl sm:text-2xl font-black">{restaurant.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/80 text-white text-[10px] font-black uppercase tracking-wider">
                  {restaurant.isVerified ? 'Verified Partner' : 'Registered'}
                </span>
              </div>
              <p className="text-xs text-amber-200 font-medium">{restaurant.tagline}</p>
              <div className="text-[11px] text-amber-100/80 pt-1 flex flex-wrap gap-2 justify-center sm:justify-start">
                <span>Proprietor: {restaurant.ownerName}</span>
                <span>•</span>
                <span>FSSAI: {restaurant.fssaiNumber}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center sm:items-end gap-2 shrink-0">
            <div className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider ${
              isOpen ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
            }`}>
              {isOpen ? '● Live & Taking Orders' : '○ Kitchen Paused'}
            </div>
            <span className="text-[11px] text-amber-200">{restaurant.city} • {locationZone}</span>
          </div>
        </div>
      </div>

      {/* Sub-Tab Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200">
        <button
          onClick={() => setActiveSubTab('contact')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeSubTab === 'contact'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Proprietor & Contact</span>
        </button>

        <button
          onClick={() => setActiveSubTab('address')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeSubTab === 'address'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Address & Location Zone</span>
        </button>

        <button
          onClick={() => setActiveSubTab('operations')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeSubTab === 'operations'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Kitchen Standards & FSSAI</span>
        </button>

        <button
          onClick={() => setActiveSubTab('payout')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeSubTab === 'payout'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Settlement & UPI Payout</span>
        </button>
      </div>

      <form onSubmit={handleSaveAll} className="space-y-6">
        {/* ================= SECTION 1: CONTACT INFORMATION ================= */}
        {activeSubTab === 'contact' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-black text-slate-900">Proprietor & Kitchen Contact Details</h3>
            <p className="text-xs text-slate-500">Official contact points for Bhojj dispatch management and rider coordination.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Master Chef / Owner Full Name *</label>
                <input
                  type="text"
                  required
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Official Contact Email *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Order Dispatch Hotline Phone *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Alternate / WhatsApp Phone</label>
                <input
                  type="tel"
                  value={alternatePhone}
                  onChange={(e) => setAlternatePhone(e.target.value)}
                  placeholder="+91 98231 54321"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* ================= SECTION 2: ADDRESS & LOCATION ================= */}
        {activeSubTab === 'address' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-black text-slate-900">Kitchen Operating Address & Serving Zone</h3>
            <p className="text-xs text-slate-500">Riders and ashram devotees reference this location for pickup and dispatch.</p>

            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Kitchen Display Title *</label>
                <input
                  type="text"
                  required
                  value={kitchenName}
                  onChange={(e) => setKitchenName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Physical Kitchen Address *</label>
                <textarea
                  rows={2}
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Prominent Landmark</label>
                  <input
                    type="text"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    placeholder="Near Dan Ghati Mandir"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Goverdhan Zone</label>
                  <select
                    value={locationZone}
                    onChange={(e) => setLocationZone(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold"
                  >
                    <option value="Dan Ghati Central">Dan Ghati Central</option>
                    <option value="Radha Kund">Radha Kund Marg</option>
                    <option value="Jatipura / Mukharvind">Jatipura / Mukharvind</option>
                    <option value="Manasi Ganga">Manasi Ganga Kund</option>
                    <option value="Punchari">Punchari Ka Lotha</option>
                    <option value="Any Goverdhan Parikrama Marg">Goverdhan Parikrama Marg</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">City / District</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= SECTION 3: OPERATIONS & FSSAI ================= */}
        {activeSubTab === 'operations' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-black text-slate-900">Operating Preferences & FSSAI Compliance</h3>
            <p className="text-xs text-slate-500">Configure your daily turnaround times, dietary cuisine tagline, and live status.</p>

            <div className="space-y-4 pt-2">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between">
                <div>
                  <div className="text-xs font-black text-amber-950">Online Kitchen Acceptance Status</div>
                  <div className="text-[11px] text-amber-800 mt-0.5">
                    {isOpen ? 'Currently accepting live orders from pilgrims' : 'Kitchen is currently turned OFF'}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(!isOpen)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                    isOpen ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-800'
                  }`}
                >
                  {isOpen ? 'Online (Accepting)' : 'Paused (Offline)'}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">FSSAI License Number *</label>
                  <input
                    type="text"
                    required
                    value={fssaiNumber}
                    onChange={(e) => setFssaiNumber(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-mono font-bold focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Target Prep & Delivery Time</label>
                  <input
                    type="text"
                    value={deliveryTimeRange}
                    onChange={(e) => setDeliveryTimeRange(e.target.value)}
                    placeholder="20-25 mins"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Cuisine Specialties</label>
                <input
                  type="text"
                  value={cuisine}
                  onChange={(e) => setCuisine(e.target.value)}
                  placeholder="North Indian, Satvik Thali, Bedmi Poori"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Promotional Tagline / Sacred Bhog Guarantee</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="Authentic Satvik & Royal Thalis Made in 100% Pure Cow Ghee"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* ================= SECTION 4: PAYOUT & SETTLEMENT ================= */}
        {activeSubTab === 'payout' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-black text-slate-900">Settlement & Bank Payout Settings</h3>
            <p className="text-xs text-slate-500">Direct instant UPI settlements for completed Bhojj food orders (0% platform commission during promotion).</p>

            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Merchant / Rasoi UPI ID for Daily Payouts *</label>
                <input
                  type="text"
                  required
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="girirajbhoj@okaxis"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-mono font-bold focus:ring-2 focus:ring-amber-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">Earnings from delivered orders are credited daily at 11:30 PM.</p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <div className="text-xs text-emerald-900">
                  <strong>Zero Platform Commission:</strong> Under the Govardhan Temple Seva program, Bhojj takes 0% commission from registered Satvik kitchen partners.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Global Save Button */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs sm:text-sm shadow-md shadow-amber-600/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Save Kitchen Profile & Operating Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
};
