import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle2, 
  Sparkles, 
  MapPin, 
  Utensils, 
  ShieldCheck, 
  QrCode, 
  Ticket, 
  Copy, 
  Check, 
  Share2, 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Tag, 
  Info, 
  Phone, 
  Mail, 
  Sun, 
  Moon,
  Coffee,
  HeartHandshake
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Restaurant, TableBooking, PreorderedItem } from '../../types';

interface Props {
  onSuccessNavigateToDining?: () => void;
}

export const ZomatoTableBookingModal: React.FC<Props> = ({ onSuccessNavigateToDining }) => {
  const { 
    isTableBookingModalOpen, 
    closeTableBookingModal, 
    selectedRestaurantForBooking,
    restaurants,
    menuItems,
    currentUser,
    createTableBooking
  } = useApp();

  // Selected restaurant fallback
  const restaurant: Restaurant = selectedRestaurantForBooking || restaurants[0];

  // Steps: 1: Guests & Date | 2: Time Slot & Seating | 3: Offers & Special Notes | 4: Success Pass
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [guestsCount, setGuestsCount] = useState<number>(4);

  // Dates: Today, Tomorrow, and upcoming 5 days
  const getDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 6; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const iso = d.toISOString().split('T')[0];
      const dayName = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' });
      const monthDay = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
      dates.push({ iso, dayName, monthDay, fullDate: d.toDateString() });
    }
    return dates;
  };

  const availableDates = getDates();
  const [selectedDate, setSelectedDate] = useState<string>(availableDates[0].iso);
  const [selectedMealPeriod, setSelectedMealPeriod] = useState<'Lunch' | 'Evening Snacks' | 'Dinner'>('Lunch');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('01:30 PM');

  // Seating area
  const [selectedSeating, setSelectedSeating] = useState<'AC Dining Hall' | 'Traditional Floor Chawki' | 'Giriraj View Rooftop' | 'Family Private Booth'>('Traditional Floor Chawki');
  
  // Occasion & Notes
  const [selectedOccasion, setSelectedOccasion] = useState<'Pilgrimage Darshan' | 'Everyday Dining' | 'Birthday' | 'Anniversary' | 'Family Reunion'>('Pilgrimage Darshan');
  const [specialRequests, setSpecialRequests] = useState<string[]>(['Strict Jain (No Root Veg)']);
  const [customNotes, setCustomNotes] = useState<string>('');

  // Offers
  const [appliedOffer, setAppliedOffer] = useState<{ code: string; description: string; discountPercent?: number } | null>({
    code: 'ZOMATODINE20',
    description: 'Flat 20% OFF on Total Dine-in Bill',
    discountPercent: 20
  });

  // Optional pre-ordered items
  const [preorderedItems, setPreorderedItems] = useState<PreorderedItem[]>([]);

  // Guest details
  const [guestName, setGuestName] = useState<string>(currentUser?.name || 'Priya Sharma');
  const [guestPhone, setGuestPhone] = useState<string>(currentUser?.phone || '+91 98765 43210');
  const [guestEmail, setGuestEmail] = useState<string>(currentUser?.email || 'priya@bhojj.in');

  // Completed booking pass state
  const [confirmedBooking, setConfirmedBooking] = useState<TableBooking | null>(null);
  const [copiedPass, setCopiedPass] = useState<boolean>(false);

  if (!isTableBookingModalOpen || !restaurant) return null;

  // Meal slot matrix
  const timeSlots = {
    Lunch: ['12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM'],
    'Evening Snacks': ['04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM'],
    Dinner: ['07:00 PM', '07:30 PM', '08:00 PM', '08:30 PM', '09:00 PM', '09:30 PM', '10:00 PM']
  };

  const seatingOptions = [
    {
      id: 'Traditional Floor Chawki',
      title: 'Traditional Wooden Chawki',
      desc: 'Sacred Braj floor dining on hand-carved low tables with pure brass thalis.',
      tag: 'Most Authentic',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300'
    },
    {
      id: 'AC Dining Hall',
      title: 'AC Royal Dining Hall',
      desc: 'Climate-controlled central hall with plush family banquettes and soothing chants.',
      tag: 'Family Favorite',
      badgeColor: 'bg-sky-100 text-sky-800 border-sky-300'
    },
    {
      id: 'Giriraj View Rooftop',
      title: 'Giriraj View Rooftop',
      desc: 'Open terrace dining overlooking holy Govardhan Hill with serene breeze.',
      tag: 'Scenic Darshan',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300'
    },
    {
      id: 'Family Private Booth',
      title: 'Family Private Booth',
      desc: 'Enclosed quiet seating with dedicated server for pilgrimage families (4+ guests).',
      tag: 'Private & Quiet',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-300'
    }
  ];

  const availableOffers = [
    {
      code: 'ZOMATODINE20',
      description: 'Flat 20% OFF on Total Dine-in Bill',
      discountPercent: 20,
      badge: 'Zomato Dining Gold'
    },
    {
      code: 'FREEKHEER',
      description: 'Free Kesar Badam Kheer for groups of 3+',
      discountPercent: 0,
      badge: 'Complimentary Treat'
    }
  ];

  const dietaryTags = [
    'Strict Jain (No Root Veg)',
    'Zero Onion / Pure Satvik',
    'Senior Ground Floor Access',
    'High Chair for Kids',
    'Quiet Corner Table',
    'Warm Water on Arrival'
  ];

  const toggleSpecialRequest = (tag: string) => {
    if (specialRequests.includes(tag)) {
      setSpecialRequests(specialRequests.filter(t => t !== tag));
    } else {
      setSpecialRequests([...specialRequests, tag]);
    }
  };

  // Restaurant menu items for optional pre-order
  const restaurantDishes = menuItems.filter(m => m.restaurantId === restaurant.id).slice(0, 4);

  const togglePreorderItem = (dish: any) => {
    const existing = preorderedItems.find(p => p.menuItemId === dish.id);
    if (existing) {
      setPreorderedItems(preorderedItems.filter(p => p.menuItemId !== dish.id));
    } else {
      setPreorderedItems([
        ...preorderedItems,
        {
          menuItemId: dish.id,
          name: dish.name,
          quantity: 1,
          price: dish.price
        }
      ]);
    }
  };

  const handleConfirmReservation = () => {
    const newBooking = createTableBooking({
      customerId: currentUser?.id || 'guest-user',
      customerName: guestName.trim() || 'Pilgrim Devotee',
      customerPhone: guestPhone.trim() || '+91 98765 43210',
      customerEmail: guestEmail.trim() || undefined,
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      restaurantAddress: restaurant.address,
      restaurantImage: restaurant.image,
      restaurantPhone: restaurant.phone,
      guestsCount,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      mealPeriod: selectedMealPeriod,
      seatingArea: selectedSeating,
      occasion: selectedOccasion,
      specialRequests,
      customNotes: customNotes.trim() || undefined,
      offerApplied: appliedOffer || undefined,
      preorderedItems: preorderedItems.length > 0 ? preorderedItems : undefined,
    });

    setConfirmedBooking(newBooking);
    setCurrentStep(4);
  };

  const copyBookingPass = () => {
    if (!confirmedBooking) return;
    const text = `🍽️ BHOJJ ZOMATO TABLE PASS\nBooking ID: ${confirmedBooking.id}\nEntry PIN: ${confirmedBooking.bookingPin}\nRestaurant: ${confirmedBooking.restaurantName}\nGuests: ${confirmedBooking.guestsCount} Persons\nDate & Time: ${confirmedBooking.date} at ${confirmedBooking.timeSlot}\nSeating: ${confirmedBooking.seatingArea}\nAddress: ${confirmedBooking.restaurantAddress}`;
    navigator.clipboard.writeText(text);
    setCopiedPass(true);
    setTimeout(() => setCopiedPass(false), 2500);
  };

  const shareBookingWhatsApp = () => {
    if (!confirmedBooking) return;
    const text = encodeURIComponent(
      `🙏 Radhe Radhe! Table reservation confirmed at ${confirmedBooking.restaurantName} for ${confirmedBooking.guestsCount} guests on ${confirmedBooking.date} at ${confirmedBooking.timeSlot}.\nCheck-in PIN: ${confirmedBooking.bookingPin}\nAddress: ${confirmedBooking.restaurantAddress}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleClose = () => {
    closeTableBookingModal();
    setCurrentStep(1);
    setConfirmedBooking(null);
  };

  const handleViewInDining = () => {
    handleClose();
    if (onSuccessNavigateToDining) {
      onSuccessNavigateToDining();
    }
  };

  return (
    <div 
      id="zomato-table-booking-modal-overlay"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200"
    >
      <div 
        id="zomato-table-booking-modal-container"
        className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <div className="relative bg-slate-900 text-white p-5 sm:p-6 shrink-0 overflow-hidden">
          {/* Subtle background image overlay */}
          <img 
            src={restaurant.image} 
            alt={restaurant.name} 
            className="absolute inset-0 w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-amber-950/80"></div>

          <div className="relative z-10 flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="bg-red-600 text-white text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                  <Utensils className="w-3 h-3" />
                  <span>Zomato Dining</span>
                </span>
                <span className="bg-amber-400 text-slate-950 text-[11px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Instant Confirmation</span>
                </span>
                <span className="text-xs text-slate-300">★ {restaurant.rating} ({restaurant.reviewsCount}+)</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                Book a Table at {restaurant.name}
              </h2>
              <p className="text-xs text-slate-300 mt-0.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                <span className="truncate">{restaurant.address}</span>
              </p>
            </div>

            <button
              id="zomato-booking-close-btn"
              type="button"
              onClick={handleClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors shrink-0"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* STEP INDICATOR (Only on steps 1, 2, 3) */}
          {currentStep < 4 && (
            <div className="relative z-10 flex items-center justify-between mt-5 pt-4 border-t border-white/10 text-xs font-bold">
              <div className={`flex items-center gap-1.5 ${currentStep >= 1 ? 'text-amber-400' : 'text-slate-400'}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${currentStep >= 1 ? 'bg-amber-400 text-slate-900' : 'bg-slate-700 text-slate-400'}`}>
                  1
                </span>
                <span>Guests & Date</span>
              </div>
              <div className="w-8 h-0.5 bg-white/20"></div>
              <div className={`flex items-center gap-1.5 ${currentStep >= 2 ? 'text-amber-400' : 'text-slate-400'}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${currentStep >= 2 ? 'bg-amber-400 text-slate-900' : 'bg-slate-700 text-slate-400'}`}>
                  2
                </span>
                <span>Slot & Seating</span>
              </div>
              <div className="w-8 h-0.5 bg-white/20"></div>
              <div className={`flex items-center gap-1.5 ${currentStep >= 3 ? 'text-amber-400' : 'text-slate-400'}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${currentStep >= 3 ? 'bg-amber-400 text-slate-900' : 'bg-slate-700 text-slate-400'}`}>
                  3
                </span>
                <span>Offers & Confirm</span>
              </div>
            </div>
          )}
        </div>

        {/* MODAL BODY */}
        <div className="p-5 sm:p-7 overflow-y-auto flex-1 space-y-6">

          {/* STEP 1: GUESTS COUNT & DATE */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Select Number of Guests */}
              <div>
                <label className="block text-sm font-black text-slate-900 mb-2 flex items-center gap-2">
                  <Users className="w-4 h-4 text-orange-600" />
                  <span>Select Number of Guests</span>
                  <span className="text-xs font-semibold text-slate-500">(Parties above 6 get priority banquet tables)</span>
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {[1, 2, 3, 4, 5, 6, 8, 10].map((count) => {
                    const isSelected = guestsCount === count;
                    return (
                      <button
                        key={count}
                        type="button"
                        onClick={() => setGuestsCount(count)}
                        className={`py-3 rounded-2xl flex flex-col items-center justify-center gap-1 border-2 transition-all font-bold ${
                          isSelected 
                            ? 'border-orange-600 bg-orange-50 text-orange-700 shadow-xs ring-2 ring-orange-400/20' 
                            : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <span className="text-base font-black">{count}</span>
                        <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                          {count === 1 ? 'Guest' : 'Guests'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Select Dining Date */}
              <div>
                <label className="block text-sm font-black text-slate-900 mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-orange-600" />
                  <span>Choose Dining Date</span>
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {availableDates.map((item) => {
                    const isSelected = selectedDate === item.iso;
                    return (
                      <button
                        key={item.iso}
                        type="button"
                        onClick={() => setSelectedDate(item.iso)}
                        className={`p-3 rounded-2xl flex flex-col items-center justify-center border-2 transition-all ${
                          isSelected
                            ? 'border-orange-600 bg-orange-600 text-white shadow-md'
                            : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span className={`text-xs font-black uppercase ${isSelected ? 'text-amber-200' : 'text-slate-500'}`}>
                          {item.dayName}
                        </span>
                        <span className="text-sm font-black mt-0.5">
                          {item.monthDay}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Highlights Banner */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900 space-y-1">
                  <p className="font-bold text-slate-900">Zero Cancellation Fee Guarantee</p>
                  <p className="text-amber-800">
                    Tables are reserved exclusively for you. If your pilgrimage schedule changes, you can modify or cancel at zero fee anytime.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: TIME SLOT & SEATING AREA */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Meal Period Selector */}
              <div>
                <label className="block text-sm font-black text-slate-900 mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-600" />
                  <span>Select Meal Period & Time Slot</span>
                </label>

                {/* Meal Tabs */}
                <div className="flex rounded-2xl bg-slate-100 p-1 mb-3">
                  {(['Lunch', 'Evening Snacks', 'Dinner'] as const).map((period) => {
                    const isSelected = selectedMealPeriod === period;
                    return (
                      <button
                        key={period}
                        type="button"
                        onClick={() => {
                          setSelectedMealPeriod(period);
                          setSelectedTimeSlot(timeSlots[period][0]);
                        }}
                        className={`flex-1 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                          isSelected ? 'bg-white text-orange-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {period === 'Lunch' && <Sun className="w-3.5 h-3.5 text-amber-500" />}
                        {period === 'Evening Snacks' && <Coffee className="w-3.5 h-3.5 text-orange-500" />}
                        {period === 'Dinner' && <Moon className="w-3.5 h-3.5 text-indigo-500" />}
                        <span>{period}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Available Time Slots Grid */}
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {timeSlots[selectedMealPeriod].map((slot) => {
                    const isSelected = selectedTimeSlot === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedTimeSlot(slot)}
                        className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                          isSelected
                            ? 'border-orange-600 bg-orange-600 text-white shadow-xs'
                            : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                        }`}
                      >
                        <span>{slot}</span>
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Seating Area Preference */}
              <div>
                <label className="block text-sm font-black text-slate-900 mb-2 flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-orange-600" />
                  <span>Choose Seating Style</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {seatingOptions.map((seat) => {
                    const isSelected = selectedSeating === seat.id;
                    return (
                      <div
                        key={seat.id}
                        onClick={() => setSelectedSeating(seat.id as any)}
                        className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                          isSelected
                            ? 'border-orange-600 bg-orange-50/70 shadow-xs'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-black text-sm text-slate-900">{seat.title}</h4>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${seat.badgeColor}`}>
                            {seat.tag}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600">{seat.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: OCCASION, DIETARY & ZOMATO OFFERS */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Dining Occasion */}
              <div>
                <label className="block text-sm font-black text-slate-900 mb-2 flex items-center gap-2">
                  <HeartHandshake className="w-4 h-4 text-orange-600" />
                  <span>Select Dining Occasion</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {(['Pilgrimage Darshan', 'Everyday Dining', 'Birthday', 'Anniversary', 'Family Reunion'] as const).map((occ) => {
                    const isSelected = selectedOccasion === occ;
                    return (
                      <button
                        key={occ}
                        type="button"
                        onClick={() => setSelectedOccasion(occ)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                          isSelected
                            ? 'bg-orange-600 text-white border-orange-600 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {occ}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dietary & Seating Preferences */}
              <div>
                <label className="block text-sm font-black text-slate-900 mb-2">
                  Special Dietary & Seating Requests
                </label>
                <div className="flex flex-wrap gap-2">
                  {dietaryTags.map((tag) => {
                    const active = specialRequests.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleSpecialRequest(tag)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                          active
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {active && <Check className="w-3 h-3" />}
                        <span>{tag}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Note */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Additional Notes for Restaurant Kitchen / Host (Optional)
                </label>
                <input
                  type="text"
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  placeholder="e.g. Arriving after Govardhan Parikrama, please keep warm herbal water ready"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Zomato Dining Exclusive Offers */}
              <div>
                <label className="block text-sm font-black text-slate-900 mb-2 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-orange-600" />
                  <span>Exclusive Zomato Dining Offers</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {availableOffers.map((offer) => {
                    const isApplied = appliedOffer?.code === offer.code;
                    return (
                      <div
                        key={offer.code}
                        onClick={() => setAppliedOffer(isApplied ? null : offer)}
                        className={`p-3 rounded-2xl border-2 cursor-pointer transition-all flex items-start justify-between gap-2 ${
                          isApplied
                            ? 'border-emerald-600 bg-emerald-50/80 shadow-xs'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-black text-xs text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                              {offer.code}
                            </span>
                            <span className="text-[10px] font-bold text-slate-500">
                              {offer.badge}
                            </span>
                          </div>
                          <p className="text-xs font-bold text-slate-800 mt-1">{offer.description}</p>
                        </div>
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${isApplied ? 'bg-emerald-600 text-white' : 'border border-slate-300'}`}>
                          {isApplied && <Check className="w-3.5 h-3.5" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Optional Pre-order Signature Items */}
              {restaurantDishes.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>Optional: Pre-order Hot Dishes</span>
                    </label>
                    <span className="text-xs text-slate-500 font-semibold">Served instantly upon seating</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {restaurantDishes.map((dish) => {
                      const isAdded = preorderedItems.some(p => p.menuItemId === dish.id);
                      return (
                        <div
                          key={dish.id}
                          onClick={() => togglePreorderItem(dish)}
                          className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-2 ${
                            isAdded ? 'border-orange-600 bg-orange-50' : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-black text-slate-900 truncate">{dish.name}</p>
                            <p className="text-[11px] font-bold text-orange-600">₹{dish.price}</p>
                          </div>
                          <button
                            type="button"
                            className={`px-2.5 py-1 rounded-lg text-xs font-black transition-colors ${
                              isAdded ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            {isAdded ? '✓ Added' : '+ Add'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Guest Primary Contact */}
              <div className="pt-2 border-t border-slate-100">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
                  Primary Guest Contact Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Guest Name</label>
                    <input
                      type="text"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 font-bold focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Mobile (for Instant SMS/WhatsApp Pass)</label>
                    <input
                      type="text"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 font-bold focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: SUCCESS - INSTANT DIGITAL TABLE PASS */}
          {currentStep === 4 && confirmedBooking && (
            <div className="space-y-6 animate-in zoom-in-95 duration-300">
              
              {/* Success Badge Banner */}
              <div className="text-center py-2">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <h3 className="text-2xl font-black text-slate-900">Table Reservation Confirmed!</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Your table at <strong className="text-slate-900">{confirmedBooking.restaurantName}</strong> is reserved and awaiting your arrival.
                </p>
              </div>

              {/* THE DIGITAL TABLE PASS (ZOMATO STYLE TICKET) */}
              <div className="relative rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 text-white p-5 sm:p-6 shadow-2xl border border-slate-800 overflow-hidden">
                
                {/* Decorative cutouts */}
                <div className="absolute top-1/2 -left-4 -translate-y-1/2 w-7 h-7 bg-white rounded-full"></div>
                <div className="absolute top-1/2 -right-4 -translate-y-1/2 w-7 h-7 bg-white rounded-full"></div>

                <div className="flex items-center justify-between border-b border-dashed border-white/20 pb-4 mb-4">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-black">
                      OFFICIAL DINE-IN BOARDING PASS
                    </span>
                    <h4 className="text-lg font-black text-white">{confirmedBooking.restaurantName}</h4>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400">BOOKING ID</span>
                    <p className="font-mono text-xs font-black text-amber-300">{confirmedBooking.id}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">DATE</span>
                    <p className="font-black text-slate-100">{confirmedBooking.date}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">SLOT</span>
                    <p className="font-black text-amber-300">{confirmedBooking.timeSlot}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">GUESTS</span>
                    <p className="font-black text-slate-100">{confirmedBooking.guestsCount} Persons</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">SEATING AREA</span>
                    <p className="font-black text-emerald-400 truncate">{confirmedBooking.seatingArea}</p>
                  </div>
                </div>

                {/* CHECK-IN PIN & QR CODE CONTAINER */}
                <div className="mt-4 pt-4 border-t border-dashed border-white/20 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/5 rounded-2xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 bg-white rounded-xl p-1.5 flex items-center justify-center shrink-0 shadow-md">
                      <QrCode className="w-12 h-12 text-slate-900" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400">Reception Check-in PIN</span>
                      <div className="text-2xl font-mono font-black tracking-wider text-amber-300">
                        {confirmedBooking.bookingPin}
                      </div>
                      <span className="text-[10px] text-slate-400">Show this PIN or QR to the host</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={copyBookingPass}
                      className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      {copiedPass ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedPass ? 'Copied!' : 'Copy Pass'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={shareBookingWhatsApp}
                      className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </button>
                  </div>
                </div>

                {/* Offer notice on pass */}
                {confirmedBooking.offerApplied && (
                  <div className="mt-3 text-[11px] text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 rounded-xl px-3 py-1.5 flex items-center gap-2">
                    <Tag className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Offer Applied: <strong>{confirmedBooking.offerApplied.code}</strong> - {confirmedBooking.offerApplied.description}</span>
                  </div>
                )}
              </div>

              {/* Next Steps Guidance */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-700 space-y-1.5">
                <p className="font-black text-slate-900 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-orange-600" />
                  <span>Important Arrival Guidelines</span>
                </p>
                <p>• Please arrive 5-10 minutes prior to your slot: <strong>{confirmedBooking.timeSlot}</strong>.</p>
                <p>• Tables are held for up to 15 minutes past reserved time during heavy temple festival rush.</p>
                <p>• For any changes or instant directions, call the restaurant directly at <strong>{confirmedBooking.restaurantPhone}</strong>.</p>
              </div>

            </div>
          )}

        </div>

        {/* MODAL FOOTER CONTROLS */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 shrink-0 flex items-center justify-between gap-3">
          {currentStep === 1 && (
            <>
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                id="zomato-booking-step1-next"
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-black flex items-center gap-1.5 transition-all shadow-md"
              >
                <span>Select Slot & Seating</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}

          {currentStep === 2 && (
            <>
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                id="zomato-booking-step2-next"
                type="button"
                onClick={() => setCurrentStep(3)}
                className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-black flex items-center gap-1.5 transition-all shadow-md"
              >
                <span>Offers & Preferences</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}

          {currentStep === 3 && (
            <>
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                id="zomato-booking-confirm-btn"
                type="button"
                onClick={handleConfirmReservation}
                className="px-7 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center gap-2 transition-all shadow-lg"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm Free Reservation</span>
              </button>
            </>
          )}

          {currentStep === 4 && (
            <div className="w-full flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Done
              </button>
              <button
                id="zomato-booking-view-reservations-btn"
                type="button"
                onClick={handleViewInDining}
                className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-black flex items-center gap-1.5 transition-all shadow-md"
              >
                <Ticket className="w-4 h-4" />
                <span>View My Reservations</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
