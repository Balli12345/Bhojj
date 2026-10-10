import React, { useState } from 'react';
import { 
  Utensils, 
  Sparkles, 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  Ticket, 
  QrCode, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Copy, 
  Check, 
  Phone, 
  Navigation, 
  Filter, 
  Tag, 
  Compass, 
  Search,
  Star,
  ShieldCheck,
  Building,
  Heart
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Restaurant, TableBooking } from '../../types';

export const ZomatoDiningSection: React.FC = () => {
  const { 
    restaurants, 
    tableBookings, 
    cancelTableBooking, 
    openTableBookingModal, 
    openRestaurantDetails,
    currentUser 
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'chawki' | 'ac' | 'rooftop' | 'offers'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedBookingForPass, setSelectedBookingForPass] = useState<TableBooking | null>(null);
  const [copiedPin, setCopiedPin] = useState<string | null>(null);
  const [cancelModalBooking, setCancelModalBooking] = useState<TableBooking | null>(null);
  const [cancelReason, setCancelReason] = useState<string>('');

  // Filter customer's bookings
  const myBookings = tableBookings.filter(b => 
    !currentUser || b.customerId === currentUser.id || b.customerPhone === currentUser.phone
  );

  const activeReservations = myBookings.filter(b => b.status === 'confirmed' || b.status === 'ready_for_seating' || b.status === 'seated');
  const pastReservations = myBookings.filter(b => b.status === 'completed' || b.status === 'cancelled');

  // Filter dining restaurants
  const filteredRestaurants = restaurants.filter(r => {
    const matchesSearch = 
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.locationZone && r.locationZone.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (activeFilter === 'chawki') {
      return r.name.toLowerCase().includes('giriraj') || r.name.toLowerCase().includes('ashram') || (r.specialty && r.specialty.toLowerCase().includes('thali'));
    }
    if (activeFilter === 'ac') {
      return r.name.toLowerCase().includes('shahi') || r.name.toLowerCase().includes('brijwasi') || r.name.toLowerCase().includes('radha');
    }
    if (activeFilter === 'rooftop') {
      return r.name.toLowerCase().includes('ashram') || r.address.toLowerCase().includes('kund') || r.address.toLowerCase().includes('marg');
    }
    if (activeFilter === 'offers') {
      return r.rating >= 4.7;
    }
    return true;
  });

  const handleCopyPin = (pin: string) => {
    navigator.clipboard.writeText(pin);
    setCopiedPin(pin);
    setTimeout(() => setCopiedPin(null), 2000);
  };

  const handleConfirmCancel = () => {
    if (!cancelModalBooking) return;
    cancelTableBooking(cancelModalBooking.id, cancelReason);
    setCancelModalBooking(null);
    setCancelReason('');
  };

  const getStatusBadge = (status: TableBooking['status']) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-800 border border-amber-300">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            <span>Confirmed</span>
          </span>
        );
      case 'ready_for_seating':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>Table Ready & Sanitized</span>
          </span>
        );
      case 'seated':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-blue-100 text-blue-800 border border-blue-300">
            <Utensils className="w-3 h-3 text-blue-600" />
            <span>Currently Seated</span>
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
            <CheckCircle2 className="w-3 h-3 text-slate-500" />
            <span>Dining Completed</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
            <span>Cancelled</span>
          </span>
        );
    }
  };

  return (
    <div id="zomato-dining-hub" className="space-y-8 animate-in fade-in duration-200">
      
      {/* 1. ZOMATO DINING HERO BANNER */}
      <div className="relative rounded-3xl bg-gradient-to-r from-red-950 via-slate-900 to-amber-950 text-white overflow-hidden p-6 sm:p-10 shadow-xl border border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.25),transparent_50%)]"></div>

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-red-600 text-white text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md">
              <Utensils className="w-3.5 h-3.5" />
              <span>Zomato Dining Experience</span>
            </span>
            <span className="bg-amber-400 text-slate-950 text-xs font-black px-2.5 py-1 rounded-full flex items-center gap-1 shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Up to 25% Off on Food Bill</span>
            </span>
            <span className="bg-white/10 backdrop-blur-md text-amber-200 text-xs font-semibold px-2.5 py-1 rounded-full border border-white/10">
              Zero Booking Fee
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
            Book a Table at Holy Govardhan & Mathura Bhojanalayas
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed font-medium">
            Reserve traditional floor chawki or royal AC dining booths in advance. Enjoy guaranteed seating with no waiting lines after your sacred Giriraj Parikrama and temple darshan.
          </p>

          {/* Quick Search & Filters Bar */}
          <div className="pt-3 flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search restaurant, ashram rasoi, or cuisine..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-slate-400 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-amber-400"
              />
            </div>
            <button
              type="button"
              onClick={() => openTableBookingModal()}
              className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-black flex items-center justify-center gap-2 transition-all shadow-md shrink-0"
            >
              <Ticket className="w-4 h-4" />
              <span>Book Table Now</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. ACTIVE RESERVATIONS CALLOUT (IF DEVOTEE HAS UPCOMING RESERVATIONS) */}
      {activeReservations.length > 0 && (
        <div id="active-dining-reservations-section" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-6 bg-orange-600 rounded-full"></div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Your Active Table Reservations ({activeReservations.length})
              </h2>
            </div>
            <span className="text-xs font-bold text-slate-500">
              Show check-in PIN upon arrival
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeReservations.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-3xl p-5 border border-slate-200 shadow-md hover:shadow-lg transition-all space-y-4 relative overflow-hidden"
              >
                {/* Status and Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img 
                      src={booking.restaurantImage} 
                      alt={booking.restaurantName}
                      className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-black text-base text-slate-900 leading-snug">
                          {booking.restaurantName}
                        </h3>
                      </div>
                      <p className="text-xs text-slate-500 truncate max-w-xs flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-orange-500 shrink-0" />
                        <span className="truncate">{booking.restaurantAddress}</span>
                      </p>
                    </div>
                  </div>

                  <div>{getStatusBadge(booking.status)}</div>
                </div>

                {/* Reservation Summary Chips */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 rounded-2xl p-3 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">DATE</span>
                    <span className="font-black text-slate-900">{booking.date}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">TIME SLOT</span>
                    <span className="font-black text-orange-700">{booking.timeSlot}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">GUESTS</span>
                    <span className="font-black text-slate-900">{booking.guestsCount} Persons</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">SEATING</span>
                    <span className="font-black text-emerald-700 truncate block">{booking.seatingArea}</span>
                  </div>
                </div>

                {/* Assigned Table & PIN Bar */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-amber-50 border border-amber-200 flex-wrap gap-2 text-xs">
                  <div className="flex items-center gap-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-amber-800 block">Assigned Table</span>
                      <span className="font-black text-slate-900 text-sm">
                        {booking.tableNumber || 'Assigned on Arrival'}
                      </span>
                    </div>
                    <div className="h-6 w-px bg-amber-200"></div>
                    <div>
                      <span className="text-[10px] font-bold uppercase text-amber-800 block">Check-in PIN</span>
                      <span className="font-mono font-black text-orange-700 text-sm">
                        {booking.bookingPin}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopyPin(booking.bookingPin)}
                    className="px-2.5 py-1 rounded-lg bg-white border border-amber-300 text-amber-900 font-bold text-[11px] flex items-center gap-1 hover:bg-amber-100 transition-colors"
                  >
                    {copiedPin === booking.bookingPin ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedPin === booking.bookingPin ? 'Copied' : 'Copy PIN'}</span>
                  </button>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
                  <button
                    type="button"
                    onClick={() => setSelectedBookingForPass(booking)}
                    className="font-black text-orange-600 hover:text-orange-700 flex items-center gap-1 py-1"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>View Digital Pass</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${booking.restaurantPhone}`}
                      className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                      title="Call Kitchen"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>
                    <button
                      type="button"
                      onClick={() => setCancelModalBooking(booking)}
                      className="px-3 py-1.5 rounded-xl border border-red-200 text-red-600 font-bold hover:bg-red-50 transition-colors text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. DINING CATEGORY FILTER PILLS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Explore Dining Out & Table Reservations
            </h2>
            <p className="text-xs text-slate-500">
              Browse top rated Satvik dining halls with instant confirmation
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
            {[
              { id: 'all', label: 'All Restaurants', count: restaurants.length },
              { id: 'chawki', label: '🪑 Floor Chawki' },
              { id: 'ac', label: '🏛️ AC Royal Halls' },
              { id: 'rooftop', label: '🌿 Parikrama View' },
              { id: 'offers', label: '🏷️ 20% Off Offers' }
            ].map((f) => {
              const active = activeFilter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setActiveFilter(f.id as any)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    active
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span>{f.label}</span>
                  {f.count !== undefined && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                      {f.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. RESTAURANTS CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRestaurants.map((restaurant) => {
            return (
              <div 
                key={restaurant.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                {/* Card Hero Image */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                  <img 
                    src={restaurant.image} 
                    alt={restaurant.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="bg-red-600 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                      <Utensils className="w-3 h-3" />
                      <span>Table Booking</span>
                    </span>
                    <span className="bg-black/60 backdrop-blur-md text-amber-300 text-xs font-black px-2 py-0.5 rounded-full flex items-center gap-1 border border-white/20">
                      ★ {restaurant.rating}
                    </span>
                  </div>

                  {/* Dining Offer Ribbon */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                    <span className="bg-amber-400 text-slate-950 font-black text-[11px] px-2.5 py-0.5 rounded-full shadow-xs">
                      Flat 20% OFF via Zomato
                    </span>
                    <span className="text-[11px] text-slate-300 font-medium">
                      {restaurant.reviewsCount}+ Reviews
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-black text-lg text-slate-900 group-hover:text-orange-600 transition-colors">
                      {restaurant.name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                      {restaurant.cuisine}
                    </p>
                    <p className="text-xs text-slate-600 flex items-center gap-1 mt-2">
                      <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                      <span className="truncate">{restaurant.address}</span>
                    </p>
                  </div>

                  {/* Dining Highlights Badges */}
                  <div className="flex flex-wrap gap-1.5 text-[11px]">
                    <span className="bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-lg font-semibold">
                      ✓ Chawki Seating
                    </span>
                    <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-lg font-semibold">
                      ✓ Pure Desi Ghee
                    </span>
                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-lg font-semibold">
                      Instant Confirm
                    </span>
                  </div>

                  {/* Card Action Buttons */}
                  <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => openRestaurantDetails(restaurant)}
                      className="px-3 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors"
                    >
                      View Menu
                    </button>
                    <button
                      type="button"
                      onClick={() => openTableBookingModal(restaurant)}
                      className="px-3 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs"
                    >
                      <Ticket className="w-3.5 h-3.5" />
                      <span>Book Table</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* 5. PAST BOOKINGS SECTION (IF AVAILABLE) */}
      {pastReservations.length > 0 && (
        <div className="pt-6 border-t border-slate-200 space-y-3">
          <h3 className="text-lg font-black text-slate-900 tracking-tight">
            Past Reservations History ({pastReservations.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {pastReservations.map((b) => (
              <div 
                key={b.id} 
                className="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <h4 className="font-bold text-slate-900">{b.restaurantName}</h4>
                  <p className="text-slate-500 text-[11px] mt-0.5">{b.date} • {b.timeSlot} ({b.guestsCount} Guests)</p>
                  <div className="mt-1">{getStatusBadge(b.status)}</div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const found = restaurants.find(r => r.id === b.restaurantId);
                    if (found) openTableBookingModal(found);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs shrink-0"
                >
                  Book Again
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: VIEW DIGITAL BOARDING PASS */}
      {selectedBookingForPass && (
        <div 
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200"
          onClick={() => setSelectedBookingForPass(null)}
        >
          <div 
            className="bg-slate-950 text-white rounded-3xl max-w-md w-full p-6 border border-slate-800 shadow-2xl relative space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-dashed border-white/20 pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-black">
                  ZOMATO DINING PASS
                </span>
                <h3 className="text-lg font-black text-white">{selectedBookingForPass.restaurantName}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBookingForPass(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">BOOKING ID</span>
                <p className="font-mono font-black text-amber-300">{selectedBookingForPass.id}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">STATUS</span>
                <div>{getStatusBadge(selectedBookingForPass.status)}</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">DATE & TIME</span>
                <p className="font-black text-white">{selectedBookingForPass.date} at {selectedBookingForPass.timeSlot}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">GUESTS & SEATING</span>
                <p className="font-black text-emerald-400">{selectedBookingForPass.guestsCount} Guests ({selectedBookingForPass.seatingArea})</p>
              </div>
            </div>

            {/* QR Code and Check-in PIN */}
            <div className="bg-white/5 rounded-2xl p-4 flex items-center justify-between border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-white rounded-xl p-1.5 flex items-center justify-center shrink-0">
                  <QrCode className="w-12 h-12 text-slate-900" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Reception Check-in PIN</span>
                  <p className="text-2xl font-mono font-black text-amber-300 tracking-wider">
                    {selectedBookingForPass.bookingPin}
                  </p>
                  <span className="text-[10px] text-slate-400">Show to host upon arrival</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleCopyPin(selectedBookingForPass.bookingPin)}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1"
              >
                {copiedPin === selectedBookingForPass.bookingPin ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPin === selectedBookingForPass.bookingPin ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setSelectedBookingForPass(null)}
              className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-black text-xs transition-colors"
            >
              Close Pass
            </button>
          </div>
        </div>
      )}

      {/* MODAL: CANCEL TABLE RESERVATION */}
      {cancelModalBooking && (
        <div 
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200"
          onClick={() => setCancelModalBooking(null)}
        >
          <div 
            className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">Cancel Table Reservation?</h3>
                <p className="text-xs text-slate-500">Booking #{cancelModalBooking.id} at {cancelModalBooking.restaurantName}</p>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900">
              <p className="font-bold">Zero Cancellation Fee</p>
              <p className="mt-0.5">Your table will be instantly released for other devotees on pilgrimage.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Reason for cancellation (Optional)
              </label>
              <input
                type="text"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="e.g. Schedule changed, delayed at Mandir darshan"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCancelModalBooking(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50"
              >
                Keep Table
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black transition-colors"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
