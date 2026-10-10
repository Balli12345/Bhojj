import React, { useState } from 'react';
import { AuthLayout } from './AuthLayout';
import { useApp } from '../../context/AppContext';
import { SHOW_DEMO_LOGIN } from './roleLock';
import { 
  Store, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  MapPin, 
  Sparkles, 
  ArrowRight, 
  FileText, 
  Utensils, 
  CheckCircle2, 
  Clock 
} from 'lucide-react';

interface RestaurantAuthProps {
  initialMode?: 'login' | 'register';
  mode?: 'login' | 'register';
}

export const RestaurantAuth: React.FC<RestaurantAuthProps> = ({ initialMode, mode }) => {
  const { login, register, setCurrentView } = useApp();
  const effectiveMode = mode || initialMode || 'login';
  const [isLogin, setIsLogin] = useState(effectiveMode === 'login');

  React.useEffect(() => {
    setIsLogin(effectiveMode === 'login');
  }, [effectiveMode]);

  // Login State
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');

  // Register State
  const [ownerName, setOwnerName] = useState('');
  const [restaurantName, setRestaurantName] = useState('');
  const [cuisine, setCuisine] = useState('North Indian, Thali & Curries');
  const [fssaiNumber, setFssaiNumber] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [city, setCity] = useState('Indore');
  const [address, setAddress] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await login(emailOrPhone, 'restaurant', password);
    setLoading(false);
    if (!res.success) {
      setError(res.message || 'Invalid restaurant credentials.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerName || !restaurantName || !regEmail || !regPhone || regPassword.length < 8) {
      setError('Please fill all mandatory kitchen details (*) and a password of at least 8 characters.');
      return;
    }

    setError('');
    setLoading(true);

    const res = await register({
        name: ownerName,
        email: regEmail,
        phone: regPhone,
        password: regPassword,
        restaurantName,
        cuisine,
        fssaiNumber,
        city,
        address,
    }, 'restaurant');

    setLoading(false);
      if (!res.success) {
        setError(res.message || 'Restaurant onboarding failed.');
      }
  };

  const handleDemoFill = () => {
    if (isLogin) {
      setEmailOrPhone('chef.vikram@royalrasoi.in');
      setPassword('password');
    } else {
      setOwnerName('Master Chef Anand Verma');
      setRestaurantName('Shahi Annapurna Bhojnalaya');
      setCuisine('Rajasthani Dal Baati, Thali & Sweets');
      setFssaiNumber('11422859900876');
      setRegPhone('+91 98260 77665');
      setRegEmail('anand.chef@annapurna.in');
      setCity('Indore');
      setRegPassword('password123');
      setAddress('45 Chhappan Dukan Food Market, New Palasia, Indore');
    }
  };

  return (
    <AuthLayout
      title={isLogin ? "Kitchen Partner Sign In" : "Register Your Kitchen or Dhaba"}
      subtitle={isLogin ? "Manage live order dispatch, edit dishes in real-time, and check daily payout reports." : "Partner with Bhojj to reach thousands of hungry patrons across the city."}
      badge="Restaurant & Kitchen Portal"
      roleType="restaurant"
      roleIcon={<Store className="w-4 h-4" />}
      bannerGradient="from-amber-600 via-orange-600 to-amber-800"
      bulletPoints={[
        "Real-time kitchen order dispatch terminal",
        "Toggle dishes in-stock / out-of-stock instantly",
        "Direct rider assignment & handover confirmation",
        "Transparent daily commission & revenue analytics",
      ]}
    >
      <div className="max-w-md mx-auto w-full">
        
        {/* Toggle Switch */}
        <div className="flex bg-slate-100 p-1 rounded-xl mb-6 border border-slate-200">
          <button
            type="button"
            onClick={() => { setIsLogin(true); setCurrentView('restaurant_login'); }}
            className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${isLogin ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Kitchen Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsLogin(false); setCurrentView('restaurant_register'); }}
            className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${!isLogin ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Register New Kitchen
          </button>
        </div>

        {/* Demo Box */}
        <div hidden={!SHOW_DEMO_LOGIN} className="mb-5 p-3 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-between text-xs text-amber-900">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <div>
              <span className="font-bold">1-Click Test Kitchen:</span>
              <span className="text-amber-800 ml-1">Chef Vikram (Royal Rasoi)</span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleDemoFill}
            className="px-2.5 py-1 bg-white hover:bg-amber-100 rounded-md font-bold text-amber-800 border border-amber-300 shadow-2xs transition-colors shrink-0"
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
                Kitchen Partner Email / ID
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  placeholder="chef.vikram@royalrasoi.in"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Kitchen Portal Password
                </label>
                <span className="text-xs text-amber-600 hover:underline cursor-pointer">
                  Reset Password?
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
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl font-bold text-white bg-amber-600 hover:bg-amber-700 active:scale-[0.99] transition-all shadow-md shadow-amber-600/20 flex items-center justify-center gap-2 text-sm"
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <>
                  <span>Open Kitchen Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          /* REGISTER FORM */
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Owner / Chef Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="e.g. Vikramaditya"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Restaurant / Kitchen Name *
                </label>
                <div className="relative">
                  <Store className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={restaurantName}
                    onChange={(e) => setRestaurantName(e.target.value)}
                    placeholder="e.g. Royal Rasoi Thali"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Business Email *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="partner@kitchen.com"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kitchen Phone *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    required
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+91 98231 00000"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Cuisine Categories
                </label>
                <div className="relative">
                  <Utensils className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={cuisine}
                    onChange={(e) => setCuisine(e.target.value)}
                    placeholder="North Indian, Thali, Sweets"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>FSSAI License No.</span>
                  <span className="text-[10px] text-slate-400">14 Digits</span>
                </label>
                <div className="relative">
                  <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={fssaiNumber}
                    onChange={(e) => setFssaiNumber(e.target.value)}
                    placeholder="11422850000341"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Kitchen Address & City
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Shop / Unit No, Road, Commercial Complex, Indore"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
            <div>
              <label htmlFor="reg-password" className="block text-xs font-bold text-slate-700 mb-1">
                Create Password * <span className="text-[10px] text-slate-400 font-medium">(min 8 characters)</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  id="reg-password"
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>


            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl font-bold text-white bg-amber-600 hover:bg-amber-700 active:scale-[0.99] transition-all shadow-md shadow-amber-600/20 flex items-center justify-center gap-2 text-sm"
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <>
                  <span>Submit Kitchen Application</span>
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
