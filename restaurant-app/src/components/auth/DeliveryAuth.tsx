import React, { useState } from 'react';
import { AuthLayout } from './AuthLayout';
import { useApp } from '../../context/AppContext';
import { 
  Bike, 
  Phone, 
  Lock, 
  User, 
  Mail, 
  MapPin, 
  Sparkles, 
  ArrowRight, 
  FileCheck2, 
  CheckCircle2, 
  Shield 
} from 'lucide-react';

interface DeliveryAuthProps {
  initialMode?: 'login' | 'register';
  mode?: 'login' | 'register';
}

export const DeliveryAuth: React.FC<DeliveryAuthProps> = ({ initialMode, mode }) => {
  const { login, register, setCurrentView } = useApp();
  const effectiveMode = mode || initialMode || 'login';
  const [isLogin, setIsLogin] = useState(effectiveMode === 'login');

  React.useEffect(() => {
    setIsLogin(effectiveMode === 'login');
  }, [effectiveMode]);

  // Login State
  const [phoneOrEmail, setPhoneOrEmail] = useState('rajesh.rider@bhojj.in');
  const [password, setPassword] = useState('rider123');

  // Register State
  const [riderName, setRiderName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [vehicleType, setVehicleType] = useState<'Motorcycle' | 'Scooter' | 'Electric Bike' | 'Bicycle'>('Motorcycle');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [zone, setZone] = useState('Indore Vijay Nagar & Palasia');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await login(phoneOrEmail, 'delivery', password);
    setLoading(false);
    if (!res.success) {
      setError(res.message || 'Rider account not found.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!riderName || !regPhone) {
      setError('Please provide your name and phone number (*)');
      return;
    }

    setError('');
    setLoading(true);

    const res = await register({
        name: riderName,
        phone: regPhone,
        email: regEmail || `${regPhone.replace(/\D/g, '')}@rider.bhojj.in`,
        vehicleType,
        vehicleNumber: vehicleNumber || 'MP 09 XY 7890',
        licenseNumber: licenseNumber || 'DL-MP-2022-776655',
        city: zone,
    }, 'delivery');

    setLoading(false);
      if (!res.success) {
        setError(res.message || 'Registration failed.');
      }
  };

  const handleDemoFill = () => {
    if (isLogin) {
      setPhoneOrEmail('rajesh.rider@bhojj.in');
      setPassword('rider123');
    } else {
      setRiderName('Suresh Chawla');
      setRegPhone('+91 98270 44332');
      setRegEmail('suresh.rider@bhojj.in');
      setVehicleType('Motorcycle');
      setVehicleNumber('MP 09 CJ 8820');
      setLicenseNumber('DL-MP09-2023-112233');
      setZone('Indore Rajwada & Sarafa');
    }
  };

  return (
    <AuthLayout
      title={isLogin ? "Delivery Hero Sign In" : "Earn With Every Delivery"}
      subtitle={isLogin ? "Start your delivery shift, accept pending food orders, and collect instant payouts." : "Join Bhojj's premier delivery fleet with weekly incentives, flexible hours, and full insurance."}
      badge="Delivery Fleet Portal"
      roleType="delivery"
      roleIcon={<Bike className="w-4 h-4" />}
      bannerGradient="from-blue-600 via-indigo-600 to-slate-900"
      bulletPoints={[
        "Instant OTP verified delivery handovers",
        "Transparent per-order earnings + 100% customer tips",
        "Online / Offline flexible shift mode anytime",
        "Live interactive route guidance & support",
      ]}
    >
      <div className="max-w-md mx-auto w-full">
        
        {/* Toggle Switch */}
        <div className="flex bg-slate-100 p-1 rounded-xl mb-6 border border-slate-200">
          <button
            type="button"
            onClick={() => { setIsLogin(true); setCurrentView('delivery_login'); }}
            className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${isLogin ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Rider Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsLogin(false); setCurrentView('delivery_register'); }}
            className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${!isLogin ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
          >
            New Rider Signup
          </button>
        </div>

        {/* Demo Box */}
        <div className="mb-5 p-3 rounded-xl bg-blue-50 border border-blue-200/80 flex items-center justify-between text-xs text-blue-900">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
            <div>
              <span className="font-bold">1-Click Test Rider:</span>
              <span className="text-blue-800 ml-1">Rajesh Kumar (Active Hero)</span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleDemoFill}
            className="px-2.5 py-1 bg-white hover:bg-blue-100 rounded-md font-bold text-blue-800 border border-blue-300 shadow-2xs transition-colors shrink-0"
          >
            Auto Fill
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-xs border border-red-200">
            {error}
          </div>
        )}

        {/* LOGIN FORM */}
        {isLogin ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Rider Phone / Registered Email
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={phoneOrEmail}
                  onChange={(e) => setPhoneOrEmail(e.target.value)}
                  placeholder="rajesh.rider@bhojj.in or 9123456789"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Rider PIN / Password
                </label>
                <span className="text-xs text-blue-600 hover:underline cursor-pointer">
                  Forgot PIN?
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.99] transition-all shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 text-sm"
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <>
                  <span>Sign In & Start Shift</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          /* REGISTER FORM */
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Full Name (As on Aadhar/DL) *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={riderName}
                  onChange={(e) => setRiderName(e.target.value)}
                  placeholder="e.g. Rajesh Kumar"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mobile Number (WhatsApp) *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    required
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+91 91234 00000"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email (Optional)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="rider@bhojj.in"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Vehicle Type Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Vehicle Type
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'Motorcycle', label: 'Motorbike' },
                  { id: 'Scooter', label: 'Scooter' },
                  { id: 'Electric Bike', label: 'EV Scooter' },
                  { id: 'Bicycle', label: 'Bicycle' },
                ].map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setVehicleType(v.id as any)}
                    className={`py-1.5 px-2 text-xs font-bold rounded-lg border transition-colors ${vehicleType === v.id ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-300'}`}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Vehicle Number Plate
                </label>
                <input
                  type="text"
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                  placeholder="MP 09 CJ 4421"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Driving License Number
                </label>
                <div className="relative">
                  <FileCheck2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value.toUpperCase())}
                    placeholder="DL-MP09-2022-XXXX"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 uppercase"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Preferred Delivery Zone / Area
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={zone}
                  onChange={(e) => setZone(e.target.value)}
                  placeholder="Vijay Nagar, Bhawarkua, Palasia, Indore"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.99] transition-all shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 text-sm"
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <>
                  <span>Join Fleet & Activate Rider ID</span>
                  <CheckCircle2 className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

      </div>
    </AuthLayout>
  );
};
