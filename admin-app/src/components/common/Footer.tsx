import React, { useState } from 'react';
import { 
  UtensilsCrossed, 
  Sparkles, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  CheckCircle2, 
  Heart, 
  ShieldCheck, 
  Leaf, 
  Send,
  Award,
  Sun,
  Coffee,
  HelpCircle,
  ExternalLink
} from 'lucide-react';

export const Footer: React.FC = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setNewsletterEmail('');
      }, 3000);
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 relative overflow-hidden mt-auto">
      {/* Decorative subtle background aura */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-600/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-amber-600/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* 1. TOP PURITY & TRUST TICKER */}
      <div className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-xs py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20 flex items-center justify-center shrink-0">
                <Sun className="w-5 h-5" />
              </div>
              <div>
                <h5 className="text-white font-extrabold text-xs sm:text-sm">100% Desi Cow Ghee</h5>
                <p className="text-[11px] text-slate-400">Authentic Braj mandir recipes</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
                <Leaf className="w-5 h-5" />
              </div>
              <div>
                <h5 className="text-white font-extrabold text-xs sm:text-sm">Zero Onion & Garlic</h5>
                <p className="text-[11px] text-slate-400">Strict Vaishnav Satvik purity</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h5 className="text-white font-extrabold text-xs sm:text-sm">Mandir FSSAI Certified</h5>
                <p className="text-[11px] text-slate-400">Lic. 11422859900123</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h5 className="text-white font-extrabold text-xs sm:text-sm">25-Min Ashram Drop</h5>
                <p className="text-[11px] text-slate-400">Hot meals on Parikrama route</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 2. MAIN FOOTER CONTENT (Portals completely removed as instructed) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          
          {/* Col 1: Brand & Heritage (5 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-orange-600 via-amber-500 to-yellow-400 flex items-center justify-center text-white font-black shadow-lg shadow-orange-500/25">
                <UtensilsCrossed className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black text-white tracking-tight">Bhojj</span>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30">
                    Goverdhan
                  </span>
                </div>
                <p className="text-[11px] text-amber-400 font-bold tracking-wide">
                  शुद्ध सात्विक ब्रज रस • गोवर्धन धाम
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Rooted in the sacred soil of Shri Giriraj Maharaj, Bhojj delivers freshly prepared Satvik thalis, daily ashram tiffins, temple bhog, and pilgrim bhandaras with uncompromised Vaishnav hygiene.
            </p>

            {/* Sacred Ashram Seva Desk */}
            <div className="pt-2 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <Phone className="w-4 h-4 text-orange-400 shrink-0" />
                <span>Ashram Seva Desk: <strong className="text-white">+91 98765 43210</strong> (24x7)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Mail className="w-4 h-4 text-orange-400 shrink-0" />
                <span>Pilgrim & Bhandara Support: <strong className="text-white">seva@bhojj.in</strong></span>
              </div>
              <div className="flex items-start gap-2 text-slate-400">
                <MapPin className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <span>Central Kitchen, Dan Ghati Mandir Marg, Goverdhan, Mathura, UP - 281502</span>
              </div>
            </div>
          </div>

          {/* Col 2: Seva & Pilgrim Services (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-white font-extrabold text-sm uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-500"></span>
              <span>Devotee Offerings</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button 
                  onClick={() => scrollToSection('menu-section')} 
                  className="hover:text-orange-400 transition-colors text-left flex items-center gap-1.5"
                >
                  <span className="text-slate-600">›</span>
                  <span>Royal Satvik Thalis</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('menu-section')} 
                  className="hover:text-orange-400 transition-colors text-left flex items-center gap-1.5"
                >
                  <span className="text-slate-600">›</span>
                  <span>Daily Homestyle Tiffins</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('menu-section')} 
                  className="hover:text-orange-400 transition-colors text-left flex items-center gap-1.5"
                >
                  <span className="text-slate-600">›</span>
                  <span>Mandir Bhog & Peda Prasad</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('menu-section')} 
                  className="hover:text-orange-400 transition-colors text-left flex items-center gap-1.5"
                >
                  <span className="text-slate-600">›</span>
                  <span>Pilgrim Bhandara Trays (10-500+)</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('menu-section')} 
                  className="hover:text-orange-400 transition-colors text-left flex items-center gap-1.5"
                >
                  <span className="text-slate-600">›</span>
                  <span>Parikrama Route Meal Drops</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('vision-section')} 
                  className="hover:text-orange-400 transition-colors text-left flex items-center gap-1.5"
                >
                  <span className="text-slate-600">›</span>
                  <span>Ekadashi & Vrat Specialties</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Goverdhan Drop Hubs (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-white font-extrabold text-sm uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span>Ashram Hubs</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Dan Ghati Parisar</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Radha Kund Gate</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Mansi Ganga Ghat</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Jatipura Mukharvind</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Kusum Sarovar Marg</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Poonchhari Ka Lautha</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter & Devotee Alerts (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-white font-extrabold text-sm uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Festive Bhog Alerts</span>
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Get notified for Annakut, Guru Purnima, Mudiya Poono bhandara bookings & daily prasad schedules.
            </p>

            <form onSubmit={handleNewsletterSubmit} className="space-y-2 pt-1">
              <div className="relative">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter email or WhatsApp..."
                  className="w-full pl-3 pr-10 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:border-orange-500"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 p-1 rounded-lg bg-orange-600 hover:bg-orange-500 text-white transition-colors"
                  title="Subscribe"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>

              {subscribed && (
                <p className="text-[11px] text-emerald-400 font-bold flex items-center gap-1 animate-in fade-in">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Radhe Radhe! You are now subscribed to Seva updates.</span>
                </p>
              )}
            </form>

            <div className="pt-2 flex items-center gap-3 text-slate-400 text-[11px]">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>100% Spam-free devotee communication.</span>
            </div>
          </div>

        </div>
      </div>

      {/* 3. BOTTOM COPYRIGHT & STANDARDS BAR */}
      <div className="border-t border-slate-800/80 bg-slate-950 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
            <span className="font-semibold text-slate-400">
              © 2026 Bhojj Pure Satvik Kitchen. All rights reserved.
            </span>
            <span className="hidden sm:inline text-slate-700">•</span>
            <span className="text-amber-400/90 font-medium">
              Prepared with reverence in Shri Giriraj Maharaj Dham 🕉️
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-400 text-xs">
            <button 
              onClick={() => scrollToSection('vision-section')} 
              className="hover:text-orange-400 transition-colors"
            >
              Mandir Kitchen Maryada
            </button>
            <span className="text-slate-700">•</span>
            <button 
              onClick={() => scrollToSection('menu-section')} 
              className="hover:text-orange-400 transition-colors"
            >
              FSSAI Compliance
            </button>
            <span className="text-slate-700">•</span>
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
              className="text-orange-400 hover:text-orange-300 font-bold transition-colors"
            >
              Back to Top ↑
            </button>
          </div>

        </div>
      </div>
    </footer>
  );
};
