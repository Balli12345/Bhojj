import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { MenuItem } from '../../types';
import { 
  X, 
  Star, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  Store, 
  Plus, 
  Minus, 
  Check, 
  ShieldCheck, 
  Sparkles, 
  UtensilsCrossed, 
  Leaf, 
  Share2, 
  Heart,
  ChevronRight,
  Search,
  Award,
  Calendar,
  MessageSquare,
  Ticket
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const RestaurantDetailsModal: React.FC = () => {
  const { 
    selectedRestaurantForModal, 
    setSelectedRestaurantForModal,
    menuItems,
    cart,
    addToCart,
    updateCartQuantity,
    openProductDetails,
    openCategoryDetails,
    openTableBookingModal
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  if (!selectedRestaurantForModal) return null;

  const restaurant = selectedRestaurantForModal;

  // Dishes belonging to this restaurant
  const restaurantDishes = menuItems.filter(item => item.restaurantId === restaurant.id);

  // Available categories in this restaurant
  const categories = ['All', ...Array.from(new Set(restaurantDishes.map(d => d.category)))];

  // Filtered dishes
  const filteredDishes = restaurantDishes.filter(dish => {
    if (activeCategory !== 'All' && dish.category !== activeCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = dish.name.toLowerCase().includes(q);
      const matchDesc = dish.description.toLowerCase().includes(q);
      const matchCat = dish.category.toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchCat) return false;
    }
    return true;
  });

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleAddToCart = (e: React.MouseEvent, dish: MenuItem) => {
    e.stopPropagation();
    addToCart(dish, 1);
    setJustAddedId(dish.id);
    setTimeout(() => setJustAddedId(null), 1400);

    try {
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.6, x: 0.5 },
        colors: ['#ea580c', '#10b981', '#f59e0b', '#3b82f6'],
      });
    } catch (err) { /* ignore */ }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div 
        className="relative bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* TOP HERO HEADER */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-slate-950 shrink-0">
          <img 
            src={restaurant.image} 
            alt={restaurant.name}
            className="w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-black/30"></div>

          {/* Action Icons */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
            <div className="flex items-center gap-2">
              <span className="bg-emerald-600 text-white text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                <span>Open Now for Holy Orders</span>
              </span>
              <span className="bg-black/60 backdrop-blur-md text-amber-300 px-2.5 py-1 rounded-full text-xs font-bold border border-amber-400/30">
                100% Satvik Verified
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white flex items-center justify-center transition-colors shadow-md"
                title="Share Kitchen"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center transition-colors shadow-md ${
                  isFavorite ? 'bg-red-600 text-white' : 'bg-black/60 hover:bg-black/80 text-white'
                }`}
                title="Favorite"
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={() => setSelectedRestaurantForModal(null)}
                className="w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white flex items-center justify-center transition-colors shadow-md"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Cover Details */}
          <div className="absolute bottom-5 left-5 right-5 text-white">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="bg-orange-600 text-white text-xs font-extrabold px-3 py-0.5 rounded-full flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {restaurant.locationZone || 'Goverdhan'}
              </span>
              <span className="bg-white/20 backdrop-blur-md text-slate-100 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                {restaurant.landmark || restaurant.address}
              </span>
              <span className="bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-bold px-2.5 py-0.5 rounded-full">
                ✓ FSSAI: {restaurant.fssaiNumber}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-md">
              {restaurant.name}
            </h1>
            <p className="text-sm text-amber-200 font-medium mt-1">
              {restaurant.tagline}
            </p>

            {/* Quick Metrics */}
            <div className="flex items-center gap-4 text-xs font-bold mt-3 text-slate-200 flex-wrap">
              <span className="flex items-center gap-1 bg-amber-500 text-slate-950 px-2.5 py-0.5 rounded-lg font-black">
                <Star className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
                {restaurant.rating} ({restaurant.reviewsCount}+ reviews)
              </span>
              <span className="flex items-center gap-1 bg-white/10 px-2.5 py-0.5 rounded-lg">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                {restaurant.deliveryTimeRange} delivery
              </span>
              <span className="bg-white/10 px-2.5 py-0.5 rounded-lg">
                Min Order: ₹{restaurant.minOrderAmount}
              </span>
              <span className="bg-white/10 px-2.5 py-0.5 rounded-lg text-emerald-300">
                Pure Cow Ghee: Guaranteed
              </span>
            </div>
          </div>
        </div>

        {/* NOTIFICATION MESSAGE IF COPIED */}
        {copiedLink && (
          <div className="bg-emerald-600 text-white text-xs font-bold py-1 px-4 text-center">
            Kitchen link copied to clipboard! Share with fellow devotees.
          </div>
        )}

        {/* SUBHEADER STRIP: ADDRESS & OWNER INFO */}
        <div className="bg-slate-50 px-5 sm:px-7 py-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1">
              <Store className="w-3.5 h-3.5 text-orange-600" />
              <strong>Head Rasoiya:</strong> {restaurant.ownerName}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              {restaurant.phone}
            </span>
            <span>•</span>
            <span><strong>Cuisines:</strong> {restaurant.cuisine}</span>
          </div>

          <div className="text-[11px] font-bold text-orange-700 bg-orange-100/70 px-2.5 py-1 rounded-lg">
            Specialty: {restaurant.specialty || 'Pure Satvik Mahaprasad'}
          </div>
        </div>

        {/* ZOMATO DINING TABLE RESERVATION CALLOUT */}
        <div className="mx-5 sm:mx-7 mt-3 p-3.5 rounded-2xl bg-gradient-to-r from-red-950 via-slate-900 to-amber-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md border border-amber-400/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600/80 text-white flex items-center justify-center shrink-0">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-white">Reserve a Table at {restaurant.name}</span>
                <span className="text-[10px] font-black bg-amber-400 text-slate-950 px-2 py-0.2 rounded-full">Flat 20% Off</span>
              </div>
              <p className="text-[11px] text-slate-300">Choose Floor Chawki or AC Seating • Instant Confirmation</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setSelectedRestaurantForModal(null);
              openTableBookingModal(restaurant);
            }}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs shrink-0 cursor-pointer"
          >
            <span>Book Table Now</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* MAIN BODY: MENU ITEMS & CATEGORY TABS */}
        <div className="p-5 sm:p-7 overflow-y-auto flex-1 space-y-6">
          
          {/* SEARCH & CATEGORY FILTER BAR */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-5 bg-orange-600 rounded-full"></div>
                <h3 className="font-black text-slate-900 text-lg">
                  Explore {restaurant.name}'s Menu
                </h3>
                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                  {restaurantDishes.length} Satvik items
                </span>
              </div>

              {/* In-Kitchen Search */}
              <div className="relative max-w-xs w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search in this kitchen..."
                  className="w-full pl-9 pr-8 py-2 rounded-xl text-xs border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
              {categories.map(cat => {
                const isSelected = activeCategory === cat;
                const count = cat === 'All' 
                  ? restaurantDishes.length 
                  : restaurantDishes.filter(d => d.category === cat).length;

                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 border ${
                      isSelected 
                        ? 'bg-slate-950 text-white border-slate-950 shadow-xs' 
                        : 'bg-white text-slate-700 hover:bg-orange-50 border-slate-200'
                    }`}
                  >
                    <span>{cat}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                      isSelected ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* DISHES LIST / GRID */}
          {filteredDishes.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200">
              <p className="text-sm font-bold text-slate-700">No dishes found matching your search.</p>
              <button
                onClick={() => {
                  setActiveCategory('All');
                  setSearchQuery('');
                }}
                className="mt-2 text-xs font-bold text-orange-600 hover:underline"
              >
                Clear search filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDishes.map(dish => {
                const inCart = cart.find(ci => ci.menuItem.id === dish.id);
                const isAdded = justAddedId === dish.id;

                return (
                  <div
                    key={dish.id}
                    onClick={() => openProductDetails(dish)}
                    className="bg-white rounded-2xl border border-slate-200/90 hover:border-orange-400 hover:shadow-md transition-all p-3.5 flex flex-col justify-between cursor-pointer group relative"
                  >
                    {/* Top: Image, Tags, Ratings */}
                    <div>
                      <div className="relative rounded-xl overflow-hidden aspect-16/10 mb-3 bg-slate-100">
                        <img 
                          src={dish.image} 
                          alt={dish.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {/* Satvik Dot */}
                        <div className="absolute top-2 left-2 w-4 h-4 rounded bg-white border border-emerald-600 flex items-center justify-center p-0.5 shadow-xs">
                          <div className="w-2 h-2 rounded-full bg-emerald-600"></div>
                        </div>

                        {/* Rating Tag */}
                        <div className="absolute bottom-2 right-2 bg-black/75 backdrop-blur-xs text-white text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-0.5">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span>{dish.rating}</span>
                        </div>
                      </div>

                      {/* Category & Prep Time */}
                      <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mb-1">
                        <span className="text-orange-700 bg-orange-50 px-1.5 py-0.5 rounded border border-orange-100 uppercase">
                          {dish.category}
                        </span>
                        <span className="flex items-center gap-0.5">
                          <Clock className="w-2.5 h-2.5" />
                          {dish.prepTimeMinutes}m
                        </span>
                      </div>

                      <h4 className="font-extrabold text-sm text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-1">
                        {dish.name}
                      </h4>

                      <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                        {dish.description}
                      </p>
                    </div>

                    {/* Bottom: Price & Add to Thali */}
                    <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block leading-none">Price</span>
                        <span className="text-base font-black text-slate-950">₹{dish.price}</span>
                      </div>

                      {inCart ? (
                        <div 
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1.5 bg-orange-50 border border-orange-200 rounded-xl p-1 shadow-2xs"
                        >
                          <button
                            onClick={() => updateCartQuantity(dish.id, -1)}
                            className="w-6 h-6 rounded-lg bg-white text-slate-800 flex items-center justify-center font-bold hover:bg-slate-100 shadow-2xs"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-black text-xs text-orange-950 px-1 min-w-4 text-center">
                            {inCart.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(dish.id, 1)}
                            className="w-6 h-6 rounded-lg bg-orange-600 text-white flex items-center justify-center font-bold hover:bg-orange-700 shadow-2xs"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => handleAddToCart(e, dish)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1 shadow-xs active:scale-95 ${
                            isAdded 
                              ? 'bg-emerald-600 text-white' 
                              : 'bg-orange-600 hover:bg-orange-700 text-white shadow-orange-600/20'
                          }`}
                        >
                          {isAdded ? (
                            <>
                              <Check className="w-3 h-3" />
                              <span>Added!</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3 h-3" />
                              <span>Add</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ASHRAM & BHANDARA CATERING BANNER */}
          <div className="rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 p-4 sm:p-5 border border-amber-300/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center shrink-0 shadow-sm font-bold text-lg">
                🛕
              </div>
              <div>
                <h4 className="font-extrabold text-sm sm:text-base text-slate-900">
                  Bulk Bhandara & Ashram Seva Catering
                </h4>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                  Need 50 to 500+ thalis for pilgrims during Parikrama or Ekadashi? {restaurant.name} provides specialized eco-packed Bhandara distributions.
                </p>
              </div>
            </div>

            <a
              href={`tel:${restaurant.phone}`}
              className="px-4 py-2 rounded-xl bg-slate-950 text-white text-xs font-black hover:bg-slate-800 transition-colors whitespace-nowrap shadow-xs"
            >
              Call Kitchen Directly
            </a>
          </div>

        </div>

        {/* FOOTER BAR */}
        <div className="p-4 sm:p-5 bg-white border-t border-slate-200 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>FSSAI License: {restaurant.fssaiNumber} • All dishes prepared without onion & garlic</span>
          </div>

          <button
            onClick={() => setSelectedRestaurantForModal(null)}
            className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
          >
            Close Kitchen View
          </button>
        </div>

      </div>
    </div>
  );
};
