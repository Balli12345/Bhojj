import React, { useState } from 'react';
import { 
  Users, 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Check, 
  Utensils, 
  Sparkles, 
  Ticket, 
  Building, 
  Search, 
  Filter, 
  Plus,
  Send,
  Coffee,
  CheckCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TableBooking, TableBookingStatus, Restaurant } from '../../types';

interface RestaurantTableBookingsProps {
  restaurant: Restaurant;
}

export const RestaurantTableBookings: React.FC<RestaurantTableBookingsProps> = ({ restaurant }) => {
  const { 
    tableBookings, 
    updateBookingStatus, 
    assignTableNumber, 
    cancelTableBooking,
    createTableBooking
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'confirmed' | 'ready_for_seating' | 'seated' | 'completed' | 'cancelled'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Table number editing state
  const [editingBookingId, setEditingBookingId] = useState<string | null>(null);
  const [tableInput, setTableInput] = useState('');

  // PIN check-in verify state
  const [verifyingBookingId, setVerifyingBookingId] = useState<string | null>(null);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  // Filter bookings for this restaurant
  const myBookings = tableBookings.filter(b => 
    b.restaurantId === restaurant.id || 
    b.restaurantName.toLowerCase().includes(restaurant.name.toLowerCase())
  );

  const filteredBookings = myBookings.filter(b => {
    if (activeFilter !== 'all' && b.status !== activeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        b.customerName.toLowerCase().includes(q) ||
        b.customerPhone.includes(q) ||
        b.bookingPin.includes(q) ||
        b.id.toLowerCase().includes(q) ||
        (b.tableNumber && b.tableNumber.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const confirmedCount = myBookings.filter(b => b.status === 'confirmed').length;
  const readyCount = myBookings.filter(b => b.status === 'ready_for_seating').length;
  const seatedCount = myBookings.filter(b => b.status === 'seated').length;
  const completedCount = myBookings.filter(b => b.status === 'completed').length;

  const handleSaveTableNumber = (bookingId: string) => {
    if (!tableInput.trim()) return;
    assignTableNumber(bookingId, tableInput.trim());
    setEditingBookingId(null);
    setTableInput('');
  };

  const handleVerifyCheckIn = (booking: TableBooking) => {
    if (pinInput.trim() === booking.bookingPin) {
      updateBookingStatus(booking.id, 'seated');
      setVerifyingBookingId(null);
      setPinInput('');
      setPinError('');
    } else {
      setPinError('Invalid 4-digit PIN. Please check guest voucher pass.');
    }
  };

  // Simulate a quick incoming reservation for this restaurant to test realtime
  const handleSimulateIncomingBooking = () => {
    const demoGuests = [2, 4, 6, 8][Math.floor(Math.random() * 4)];
    const seatingAreas = ['Traditional Floor Chawki', 'AC Royal Hall', 'Courtyard Garden'];
    const selectedSeating = seatingAreas[Math.floor(Math.random() * seatingAreas.length)];
    const sampleNames = ['Gaurav Sharma', 'Sadhvi Krishna Priya', 'Ramesh Agarwal', 'Meenakshi Devi', 'Alok Nath'];
    const randomName = sampleNames[Math.floor(Math.random() * sampleNames.length)];

    createTableBooking({
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      restaurantAddress: restaurant.address,
      restaurantImage: restaurant.image,
      restaurantPhone: restaurant.phone,
      customerName: `${randomName} (Pilgrim)`,
      customerPhone: `98${Math.floor(10000000 + Math.random() * 90000000)}`,
      customerEmail: 'pilgrim@bhojj.org',
      guestsCount: demoGuests,
      date: 'Today',
      timeSlot: '01:30 PM - 02:30 PM',
      seatingArea: selectedSeating,
      specialRequests: 'Pure Satvik, no onion, floor mat required',
      appliedOffer: 'FLAT 20% OFF'
    });
  };

  const getStatusBadge = (status: TableBookingStatus) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-300">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            <span>Confirmed</span>
          </span>
        );
      case 'ready_for_seating':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>Table Ready & Sanitized</span>
          </span>
        );
      case 'seated':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black bg-blue-100 text-blue-900 border border-blue-300">
            <Utensils className="w-3 h-3 text-blue-600" />
            <span>Currently Seated</span>
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
            <CheckCircle2 className="w-3 h-3 text-slate-500" />
            <span>Completed</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
            <span>Cancelled</span>
          </span>
        );
    }
  };

  return (
    <div id="restaurant-dining-reservations-hub" className="space-y-6 animate-in fade-in duration-200">
      
      {/* 1. TOP STATS BAR */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Confirmed Upcoming</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl sm:text-3xl font-black text-amber-600">{confirmedCount}</span>
            <span className="text-xs text-slate-400 font-semibold">Reservations</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Tables Ready</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl sm:text-3xl font-black text-emerald-600">{readyCount}</span>
            <span className="text-xs text-slate-400 font-semibold">Sanitized</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Currently Seated</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl sm:text-3xl font-black text-blue-600">{seatedCount}</span>
            <span className="text-xs text-slate-400 font-semibold">Dining Now</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Completed Feasts</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{completedCount}</span>
            <span className="text-xs text-slate-400 font-semibold">History</span>
          </div>
        </div>
      </div>

      {/* 2. CONTROLS BAR: SEARCH, FILTERS, AND TEST SIMULATOR */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search guest name, phone, PIN or Table..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All', count: myBookings.length },
            { id: 'confirmed', label: 'Upcoming', count: confirmedCount },
            { id: 'ready_for_seating', label: 'Ready', count: readyCount },
            { id: 'seated', label: 'Seated', count: seatedCount },
            { id: 'completed', label: 'Completed', count: completedCount }
          ].map((f) => {
            const active = activeFilter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setActiveFilter(f.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1 cursor-pointer ${
                  active
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{f.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${active ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'}`}>
                  {f.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Demo simulator trigger */}
        <button
          type="button"
          onClick={handleSimulateIncomingBooking}
          className="px-3.5 py-2 rounded-xl bg-orange-100 text-orange-800 hover:bg-orange-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shrink-0 cursor-pointer"
          title="Simulate new table booking from customer"
        >
          <Sparkles className="w-3.5 h-3.5 text-orange-600" />
          <span>Simulate Booking Alert</span>
        </button>
      </div>

      {/* 3. BOOKINGS LIST */}
      {filteredBookings.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
          <Ticket className="w-12 h-12 text-slate-300 mx-auto" />
          <h4 className="font-bold text-slate-800 text-base">No table bookings in this filter</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Reservations made by pilgrims and diners will appear here with live notification chimes.
          </p>
          <button
            type="button"
            onClick={handleSimulateIncomingBooking}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition-colors shadow-xs inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Create Test Reservation</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => {
            const isEditing = editingBookingId === booking.id;
            const isVerifying = verifyingBookingId === booking.id;

            return (
              <div
                key={booking.id}
                className={`bg-white rounded-3xl p-5 sm:p-6 border transition-all space-y-4 ${
                  booking.status === 'confirmed'
                    ? 'border-amber-300 ring-2 ring-amber-500/10 shadow-md'
                    : booking.status === 'ready_for_seating'
                    ? 'border-emerald-300 ring-2 ring-emerald-500/10 shadow-md'
                    : 'border-slate-200 shadow-xs'
                }`}
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-sm shrink-0">
                      {booking.guestsCount}P
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-black text-base text-slate-900">{booking.customerName}</h4>
                        <span className="text-xs font-mono text-slate-400">#{booking.id}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-emerald-600" />
                          <a href={`tel:${booking.customerPhone}`} className="hover:underline">{booking.customerPhone}</a>
                        </span>
                        <span>•</span>
                        <span className="font-medium text-amber-900 bg-amber-50 px-2 py-0.2 rounded-md">
                          {booking.seatingArea}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div>{getStatusBadge(booking.status)}</div>
                    
                    {/* Check-in PIN */}
                    <div className="bg-slate-900 text-white px-3 py-1.5 rounded-xl flex items-center gap-2 text-xs font-mono">
                      <span className="text-[10px] text-slate-400 font-sans">PIN:</span>
                      <strong className="text-amber-300 font-bold">{booking.bookingPin}</strong>
                    </div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 rounded-2xl p-3.5 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Date & Time</span>
                    <span className="font-bold text-slate-900">{booking.date}</span>
                    <span className="block text-slate-600 text-[11px] font-semibold">{booking.timeSlot}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Party Size</span>
                    <span className="font-bold text-slate-900">{booking.guestsCount} Guests</span>
                    <span className="block text-slate-500 text-[11px]">Dine-in</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Assigned Table</span>
                    <span className="font-black text-amber-700 text-sm">
                      {booking.tableNumber || 'Not Assigned Yet'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Offer Applied</span>
                    <span className="font-bold text-emerald-700">
                      {booking.appliedOffer || 'Standard'}
                    </span>
                  </div>
                </div>

                {/* Special Dietary Requests / Notes */}
                {booking.specialRequests && (
                  <div className="bg-amber-50/70 border border-amber-200/70 rounded-2xl p-3 text-xs flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-amber-900">Guest Dietary & Seating Instructions:</span>
                      <p className="text-amber-800 mt-0.5">{booking.specialRequests}</p>
                    </div>
                  </div>
                )}

                {/* Preordered Dishes if any */}
                {booking.preorderedItems && booking.preorderedItems.length > 0 && (
                  <div className="bg-slate-50 rounded-2xl p-3 text-xs space-y-1.5 border border-slate-200">
                    <span className="font-bold text-slate-700 block text-[11px] uppercase">
                      Pre-ordered Delicacies for Table ({booking.preorderedItems.length} items):
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {booking.preorderedItems.map((item, idx) => (
                        <span key={idx} className="bg-white border border-slate-200 px-2.5 py-1 rounded-lg text-slate-800 font-semibold">
                          {item.quantity}x {item.name} (₹{item.price * item.quantity})
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Interactive Table Assignment Form */}
                {isEditing && (
                  <div className="p-3 bg-amber-50 border border-amber-300 rounded-2xl flex items-center gap-2 text-xs">
                    <input
                      type="text"
                      value={tableInput}
                      onChange={(e) => setTableInput(e.target.value)}
                      placeholder="e.g. Table T-04 or Chawki-2"
                      className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white font-bold flex-1 text-xs focus:ring-2 focus:ring-amber-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleSaveTableNumber(booking.id)}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold"
                    >
                      Save Table
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingBookingId(null)}
                      className="px-2 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl"
                    >
                      Cancel
                    </button>
                  </div>
                )}

                {/* Interactive Check-in PIN Verification */}
                {isVerifying && (
                  <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-2xl space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-900">Verify Guest 4-Digit Check-in PIN</span>
                      <button onClick={() => setVerifyingBookingId(null)} className="text-slate-400 hover:text-slate-600">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        maxLength={4}
                        value={pinInput}
                        onChange={(e) => {
                          setPinInput(e.target.value);
                          setPinError('');
                        }}
                        placeholder="Enter 4-digit PIN"
                        className="px-3 py-1.5 rounded-xl border border-emerald-300 bg-white font-mono font-black text-sm tracking-widest text-center w-36"
                      />
                      <button
                        type="button"
                        onClick={() => handleVerifyCheckIn(booking)}
                        className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold"
                      >
                        Verify & Seat
                      </button>
                    </div>
                    {pinError && <p className="text-[11px] text-red-600 font-bold">{pinError}</p>}
                  </div>
                )}

                {/* Workflow Status Transition Actions */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
                  {/* Left: Table assignment button */}
                  <div className="flex items-center gap-2">
                    {!isEditing && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingBookingId(booking.id);
                          setTableInput(booking.tableNumber || '');
                        }}
                        className="px-3 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Building className="w-3.5 h-3.5 text-amber-600" />
                        <span>{booking.tableNumber ? 'Change Table' : 'Assign Table #'}</span>
                      </button>
                    )}
                  </div>

                  {/* Right: Progression Actions */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {booking.status === 'confirmed' && (
                      <button
                        type="button"
                        onClick={() => updateBookingStatus(booking.id, 'ready_for_seating')}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Mark Table Ready & Sanitized</span>
                      </button>
                    )}

                    {booking.status === 'ready_for_seating' && (
                      <button
                        type="button"
                        onClick={() => {
                          setVerifyingBookingId(booking.id);
                          setPinInput('');
                          setPinError('');
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                        <span>Verify PIN & Seat Guests</span>
                      </button>
                    )}

                    {booking.status === 'seated' && (
                      <button
                        type="button"
                        onClick={() => updateBookingStatus(booking.id, 'completed')}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Finish Dining & Free Table</span>
                      </button>
                    )}

                    {(booking.status === 'confirmed' || booking.status === 'ready_for_seating') && (
                      <button
                        type="button"
                        onClick={() => cancelTableBooking(booking.id, 'Cancelled by kitchen management')}
                        className="px-3 py-1.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 font-bold transition-colors cursor-pointer"
                      >
                        Release
                      </button>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
