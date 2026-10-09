import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DeliveryRiderProfile } from '../../types';
import { 
  Bike, 
  User, 
  Phone, 
  MapPin, 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  X, 
  Navigation, 
  AlertCircle,
  Radio
} from 'lucide-react';

interface RiderProfileProps {
  rider: DeliveryRiderProfile;
}

export const RiderProfile: React.FC<RiderProfileProps> = ({ rider }) => {
  const { updateRiderProfile } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'contact' | 'vehicle' | 'preferences'>('contact');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // 1. Personal & Contact
  const [name, setName] = useState(rider.name);
  const [phone, setPhone] = useState(rider.phone);
  const [alternatePhone, setAlternatePhone] = useState(rider.alternatePhone || '');
  const [emergencyContactName, setEmergencyContactName] = useState(rider.emergencyContactName || 'Manoj Kumar (Brother)');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState(rider.emergencyContactPhone || '+91 98222 33445');
  const [address, setAddress] = useState(rider.address || 'Ward 4, Near Goverdhan Railway Station Road, Mathura');
  const [zone, setZone] = useState(rider.zone || 'Dan Ghati & Parikrama Marg, Goverdhan');

  // 2. Vehicle & License
  const [vehicleType, setVehicleType] = useState(rider.vehicleType || 'Motorcycle');
  const [vehicleNumber, setVehicleNumber] = useState(rider.vehicleNumber || 'UP 85 AB 4421');
  const [licenseNumber, setLicenseNumber] = useState(rider.licenseNumber || 'DL-UP85-2022-9988');

  // 3. Payout & Fleet Preferences
  const [payoutUpiId, setPayoutUpiId] = useState(rider.payoutUpiId || 'rajeshkumar@okhdfcbank');
  const [shiftPreference, setShiftPreference] = useState(rider.shiftPreference || 'Morning (7 AM - 2 PM)');
  const [navigationApp, setNavigationApp] = useState(rider.navigationApp || 'Google Maps');
  const [autoAcceptRadar, setAutoAcceptRadar] = useState(rider.autoAcceptRadar ?? true);

  const showNotification = (msg: string) => {
    setSaveSuccessMsg(msg);
    setTimeout(() => setSaveSuccessMsg(''), 3500);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const updated: DeliveryRiderProfile = {
      ...rider,
      name,
      phone,
      alternatePhone,
      emergencyContactName,
      emergencyContactPhone,
      address,
      zone,
      vehicleType,
      vehicleNumber,
      licenseNumber,
      payoutUpiId,
      shiftPreference,
      navigationApp,
      autoAcceptRadar,
    };

    updateRiderProfile(updated);
    showNotification('Rider contact info, vehicle details, and preferences saved!');
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

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-blue-600/30 border-3 border-white/80 flex items-center justify-center text-blue-200">
            <Bike className="w-12 h-12" />
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-xl sm:text-2xl font-black">{rider.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider">
                {rider.isVerified ? 'KYC Approved & Active' : 'Active Partner'}
              </span>
            </div>
            <p className="text-xs text-blue-200">{rider.vehicleType} • Plate: {rider.vehicleNumber}</p>
            <div className="text-[11px] text-blue-300 pt-1">
              Rating: ★ {rider.rating} • Completed Deliveries: {rider.totalTrips} runs
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center sm:items-end gap-1.5 shrink-0">
          <div className="px-3 py-1.5 rounded-xl bg-white/15 backdrop-blur-xs text-xs font-bold text-white">
            Zone: {zone}
          </div>
          <span className="text-[11px] text-blue-200">Bhojj Fleet ID: #{rider.id}</span>
        </div>
      </div>

      {/* Navigation Pills */}
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
          <span>Personal & Emergency Contact</span>
        </button>

        <button
          onClick={() => setActiveSubTab('vehicle')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeSubTab === 'vehicle'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Bike className="w-4 h-4" />
          <span>Vehicle & License</span>
        </button>

        <button
          onClick={() => setActiveSubTab('preferences')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeSubTab === 'preferences'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Payouts & Shift Preferences</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* ================= SUB-TAB 1: CONTACT & ADDRESS ================= */}
        {activeSubTab === 'contact' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-black text-slate-900">Rider Partner Contact Information</h3>
            <p className="text-xs text-slate-500">Contact coordinates used for order dispatch, customer delivery coordination, and safety.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Rider Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Registered Rider Phone *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Alternate WhatsApp Phone</label>
                <input
                  type="tel"
                  value={alternatePhone}
                  onChange={(e) => setAlternatePhone(e.target.value)}
                  placeholder="+91 91234 98765"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Primary Delivery Zone</label>
                <select
                  value={zone}
                  onChange={(e) => setZone(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold"
                >
                  <option value="Dan Ghati & Parikrama Marg, Goverdhan">Dan Ghati & Parikrama Marg, Goverdhan</option>
                  <option value="Radha Kund & Mukharvind, Goverdhan">Radha Kund & Mukharvind, Goverdhan</option>
                  <option value="Jatipura & Punchari Sector">Jatipura & Punchari Sector</option>
                  <option value="Manasi Ganga & Goverdhan Bus Stand">Manasi Ganga & Goverdhan Bus Stand</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Residential Base Address</label>
              <textarea
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Ward number, local colony, Goverdhan..."
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Emergency Contact Block */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 mt-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <h4 className="text-xs font-black text-slate-900">Safety & Emergency Contact</h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Emergency Contact Person & Relation</label>
                  <input
                    type="text"
                    value={emergencyContactName}
                    onChange={(e) => setEmergencyContactName(e.target.value)}
                    placeholder="e.g. Manoj Kumar (Brother)"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Emergency Phone Number</label>
                  <input
                    type="tel"
                    value={emergencyContactPhone}
                    onChange={(e) => setEmergencyContactPhone(e.target.value)}
                    placeholder="+91 98222 33445"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ================= SUB-TAB 2: VEHICLE & LICENSE ================= */}
        {activeSubTab === 'vehicle' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-black text-slate-900">Vehicle & Driving License Details</h3>
            <p className="text-xs text-slate-500">Government compliance documents registered for highway and parikrama safety.</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Vehicle Type</label>
                <select
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold"
                >
                  <option value="Motorcycle">Motorcycle (Petrol)</option>
                  <option value="Scooter">Scooter (Gearless)</option>
                  <option value="EV Scooter">Electric EV Scooter</option>
                  <option value="Bicycle">Sacred Parikrama Bicycle</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Vehicle Registration Number *</label>
                <input
                  type="text"
                  required
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                  placeholder="UP 85 AB 4421"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-mono font-bold uppercase focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Driving License Number *</label>
                <input
                  type="text"
                  required
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value.toUpperCase())}
                  placeholder="DL-UP85-2022-9988"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-mono font-bold uppercase focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <div className="text-xs text-emerald-900">
                <strong>Digital RC & Insurance:</strong> Verified with Mathura RTO. All Bhojj riders are covered by complimentary ₹2,00,000 on-duty transit accident insurance.
              </div>
            </div>
          </div>
        )}

        {/* ================= SUB-TAB 3: PAYOUT & SHIFT PREFERENCES ================= */}
        {activeSubTab === 'preferences' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-black text-slate-900">Payout UPI & Fleet Shift Settings</h3>
            <p className="text-xs text-slate-500">Configure your instant bank payout destination and daily availability preference.</p>

            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">UPI ID for Daily Payouts & Tips *</label>
                <input
                  type="text"
                  required
                  value={payoutUpiId}
                  onChange={(e) => setPayoutUpiId(e.target.value)}
                  placeholder="rajeshkumar@okhdfcbank"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-mono font-bold focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">Earnings and customer tips withdraw directly to this VPA address.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Preferred Shift Timing</label>
                  <select
                    value={shiftPreference}
                    onChange={(e) => setShiftPreference(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold"
                  >
                    <option value="Morning (7 AM - 2 PM)">Morning (7 AM - 2 PM) - High Breakfast & Poori surge</option>
                    <option value="Evening (4 PM - 11 PM)">Evening (4 PM - 11 PM) - Dinner & Tiffin peak</option>
                    <option value="Full Day (7 AM - 10 PM)">Full Day (7 AM - 10 PM) - Max incentive tier</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Navigation GPS App</label>
                  <select
                    value={navigationApp}
                    onChange={(e) => setNavigationApp(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold"
                  >
                    <option value="Google Maps">Google Maps (Turn-by-turn)</option>
                    <option value="Apple Maps">Apple Maps</option>
                    <option value="Waze">Waze Navigation</option>
                  </select>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-between">
                <div>
                  <div className="text-xs font-black text-blue-950">Auto-Accept Nearest Orders</div>
                  <div className="text-[11px] text-blue-800">Instantly lock incoming food runs within 1.5 km of your current GPS position.</div>
                </div>
                <input
                  type="checkbox"
                  checked={autoAcceptRadar}
                  onChange={(e) => setAutoAcceptRadar(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
              </div>

            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs sm:text-sm shadow-md shadow-blue-600/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Save Rider Profile & Preferences</span>
          </button>
        </div>

      </form>
    </div>
  );
};
