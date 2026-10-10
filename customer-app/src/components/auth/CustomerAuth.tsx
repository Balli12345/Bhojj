import React, { useState } from 'react';
import { AuthLayout } from './AuthLayout';
import { useApp } from '../../context/AppContext';
import { 
  UtensilsCrossed, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  MapPin, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Leaf 
} from 'lucide-react';

interface CustomerAuthProps {
  initialMode?: 'login' | 'register';
  mode?: 'login' | 'register';
}

export const CustomerAuth: React.FC<CustomerAuthProps> = ({ initialMode, mode }) => {
  const { login, register, setCurrentView } = useApp();
  const effectiveMode = mode || initialMode || 'login';
  const [isLogin, setIsLogin] = useState(effectiveMode === 'login');

  React.useEffect(() => {
    setIsLogin(effectiveMode === 'login');
  }, [effectiveMode]);

  // Form State
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');

  // Register Fields
  const [name, setName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regCity, setRegCity] = useState('Indore');
  const [regAddress, setRegAddress] = useState('');
  const [dietaryPreference, setDietaryPreference] = useState<'veg' | 'non-veg' | 'both'>('veg');
  const [referralCode, setReferralCode] = useState('BHOJJ50');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await login(emailOrPhone, 'customer', password);
    setLoading(false);
    if (!res.success) {
      setError(res.message || 'Login failed. Please check credentials.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !regEmail || !regPhone) {
      setError('Please fill all required fields (*)');
      return;
    }

    setError('');
    setLoading(true);

    const res = await register({
        name,
        email: regEmail,
        phone: regPhone,
        city: regCity,
        address: regAddress || 'Indore Central, MP',
        dietaryPreference,
      }, 'customer');
      setLoading(false);
      if (!res.success) {
        setError(res.message || 'Registration failed.');
      }
  };

  const handleDemoFill = () => {
    if (isLogin) {
      setEmailOrPhone('priya@bhojj.in');
      setPassword('bhojj123');
    } else {
      setName('Rahul Sharma');
      setRegEmail('rahul.sharma@example.com');
      setRegPhone('+91 98210 99881');
      setRegCity('Indore');
      setRegAddress('Flat 301, Royal Enclave, Saket Nagar, Indore');
      setDietaryPreference('veg');
    }
  };

  return (
    <AuthLayout
      title={isLogin ? "Welcome to Customer Portal" : "Join Bhojj as a Diner"}
      subtitle={isLogin ? "Sign in to order your favorite thalis, track deliveries, and manage your daily tiffin plan." : "Create your account for fresh, authentic regional delicacies delivered piping hot."}
      badge="Customer Portal"
      roleType="customer"
      roleIcon={<UtensilsCrossed className="w-4 h-4" />}
      bannerGradient="from-emerald-600 via-teal-600 to-emerald-800"
      bulletPoints={[
        "Instant delivery tracking with 4-digit security PIN",
        "Curated pure veg, jain & authentic regional thalis",
        "Save 50% on your first order with code BHOJJ50",
        "Flexible daily tiffin subscriptions for lunch & dinner",
      ]}
    >
      <div className="max-w-md mx-auto w-full">
        
        {/* Toggle Switch between Login and Register */}
        <div className="flex bg-slate-100 p-1 rounded-xl mb-6 border border-slate-200">
          <button
            type="button"
            onClick={() => { setIsLogin(true); setCurrentView('customer_login'); }}
            className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${isLogin ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Customer Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsLogin(false); setCurrentView('customer_register'); }}
            className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${!isLogin ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
          >
            New Registration
          </button>
        </div>

        {/* Demo Credentials Quick Fill Box */}
        <div className="mb-5 p-3 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-between text-xs text-emerald-900">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <span className="font-bold">1-Click Test Customer:</span>
              <span className="text-emerald-700 ml-1">Priya Sharma</span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleDemoFill}
            className="px-2.5 py-1 bg-white hover:bg-emerald-100 rounded-md font-bold text-emerald-800 border border-emerald-300 shadow-2xs transition-colors shrink-0"
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
                Email Address or Phone Number
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  placeholder="priya@bhojj.in or 9876543210"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <span className="text-xs text-emerald-600 hover:underline cursor-pointer">
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
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 text-sm"
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <>
                  <span>Sign In as Customer</span>
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
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="name@mail.com"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    required
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+91 98210 00000"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  City
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={regCity}
                    onChange={(e) => setRegCity(e.target.value)}
                    placeholder="Indore"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Referral / Promo Code
                </label>
                <input
                  type="text"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                  placeholder="BHOJJ50"
                  className="w-full px-3 py-2 rounded-xl border border-emerald-300 bg-emerald-50/50 text-sm font-semibold text-emerald-800 uppercase focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Dietary Preference */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                Dietary Preference
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setDietaryPreference('veg')}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition-colors ${dietaryPreference === 'veg' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-700 border-slate-300'}`}
                >
                  🟢 Pure Veg
                </button>
                <button
                  type="button"
                  onClick={() => setDietaryPreference('non-veg')}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition-colors ${dietaryPreference === 'non-veg' ? 'bg-amber-600 text-white border-amber-600' : 'bg-white text-slate-700 border-slate-300'}`}
                >
                  🔴 Non-Veg
                </button>
                <button
                  type="button"
                  onClick={() => setDietaryPreference('both')}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition-colors ${dietaryPreference === 'both' ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-700 border-slate-300'}`}
                >
                  ⚪ Both / Any
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Default Delivery Address
              </label>
              <textarea
                rows={2}
                value={regAddress}
                onChange={(e) => setRegAddress(e.target.value)}
                placeholder="House / Flat No, Landmark, Society, Street..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 text-sm"
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <>
                  <span>Complete Registration & Order Food</span>
                  <CheckCircle2 className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Footer info */}
        <p className="text-[11px] text-center text-slate-400 mt-5">
          By continuing, you agree to Bhojj Terms of Service & Privacy Policy.
        </p>

      </div>
    </AuthLayout>
  );
};
