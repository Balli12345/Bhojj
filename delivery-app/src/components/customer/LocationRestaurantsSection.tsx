import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Restaurant, MenuItem } from '../../types';
import { 
  MapPin, 
  Store, 
  Star, 
  Clock, 
  UtensilsCrossed, 
  Plus, 
  Check, 
  ChevronRight, 
  ShieldCheck, 
  Sparkles, 
  Flame,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  Ticket
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const LOCATION_TABS = [
  { id: 'All', label: 'All Locations', icon: '📍', desc: 'All Sacred Zones' },
  { id: 'Dan Ghati', label: 'Dan Ghati', icon: '🛕', desc: 'Mukharvind Mandir' },
  { id: 'Radha Kund', label: 'Radha Kund', icon: '🌸', desc: 'Parikrama Marg' },
  { id: 'Mansi Ganga', label: 'Mansi Ganga', icon: '🌊', desc: 'Chakleshwar Ghat' },
  { id: 'Jatipura', label: 'Jatipura', icon: '⛰️', desc: 'Mukharvind Seva' },
  { id: 'Anyor / Parikrama', label: 'Anyor Village', icon: '🙏', desc: 'Bhandara & Annakshetra' },
];

export const LocationRestaurantsSection: React.FC = () => {
  const { 
    restaurants, 
    menuItems, 
    addToCart, 
    selectedLocationFilter, 
    setSelectedLocationFilter,
    globalSearchQuery,
    setGlobalSearchQuery,
    openProductDetails,
    openRestaurantDetails,
    openCategoryDetails,
    openTableBookingModal,
  } = useApp();

  const [expandedRestId, setExpandedRestId] = useState<string | null>(null);
  const [justAddedId, setJustAddedId] = useState<string | null>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('All');

  // Filter restaurants by selected location and global search query
  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((rest) => {
      // 1. Location filter
      if (selectedLocationFilter !== 'All') {
        const zone = rest.locationZone || '';
        if (!zone.toLowerCase().includes(selectedLocationFilter.toLowerCase())) {
          return false;
        }
      }

      // 2. Global search query filter
      if (globalSearchQuery.trim()) {
        const q = globalSearchQuery.toLowerCase();
        const matchName = rest.name.toLowerCase().includes(q);
        const matchCuisine = rest.cuisine.toLowerCase().includes(q);
        const matchTag = rest.tagline.toLowerCase().includes(q);
        const matchZone = rest.locationZone?.toLowerCase().includes(q) || false;
        const matchLandmark = rest.landmark?.toLowerCase().includes(q) || false;

        // check if any dish in this restaurant matches
        const hasDishMatch = menuItems.some(
          item => item.restaurantId === rest.id && (
            item.name.toLowerCase().includes(q) ||
            item.description.toLowerCase().includes(q) ||
            item.category.toLowerCase().includes(q)
          )
        );

        if (!matchName && !matchCuisine && !matchTag && !matchZone && !matchLandmark && !hasDishMatch) {
          return false;
        }
      }

      return true;
    });
  }, [restaurants, menuItems, selectedLocationFilter, globalSearchQuery]);

  // Handle Add to Cart with Confetti Feedback
  const handleAddToCart = (e: React.MouseEvent, dish: MenuItem) => {
    e.stopPropagation();
    addToCart(dish, 1);
    setJustAddedId(dish.id);
    setTimeout(() => setJustAddedId(null), 1400);

    try {
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.7, x: 0.5 },
        colors: ['#ea580c', '#10b981', '#f59e0b', '#3b82f6'],
      });
    } catch (err) { /* ignore */ }
  };

  const toggleExpandRestaurant = (restId: string) => {
    setExpandedRestId(prev => prev === restId ? null : restId);
  };

  return (
    <section id="location-restaurants-section" className="py-10 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
      
      {/* SECTION HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 border-b border-slate-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-900 border border-orange-200">
              <Sparkles className="w-3.5 h-3.5 text-orange-600" />
              Goverdhan Location-Wise Discovery
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              100% Satvik Verified
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
            Sacred Kitchens & Their Food by Location
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Order directly from authentic Goverdhan bhojnalayas situated near <strong className="text-slate-800">Dan Ghati, Radha Kund, Mansi Ganga, and Jatipura</strong>. Explore each restaurant's signature satvik dishes below.
          </p>
        </div>

        {/* Search status or Reset */}
        {(selectedLocationFilter !== 'All' || globalSearchQuery.trim()) && (
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                setSelectedLocationFilter('All');
                setGlobalSearchQuery('');
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              <span>Reset All Filters</span>
            </button>
          </div>
        )}
      </div>

      {/* LOCATION TABS BAR */}
      <div className="mb-8">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-orange-600" />
            Select Holy Location / Parikrama Stop
          </span>
          <span className="text-xs text-slate-500 font-medium">
            Showing <strong className="text-slate-900">{filteredRestaurants.length}</strong> {filteredRestaurants.length === 1 ? 'kitchen' : 'kitchens'}
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-2">
          {LOCATION_TABS.map((tab) => {
            const isSelected = selectedLocationFilter === tab.id;
            // count kitchens in this zone
            const count = tab.id === 'All' 
              ? restaurants.length 
              : restaurants.filter(r => r.locationZone?.toLowerCase().includes(tab.id.toLowerCase())).length;

            return (
              <button
                key={tab.id}
                onClick={() => setSelectedLocationFilter(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition-all shrink-0 border text-left shadow-2xs ${
                  isSelected
                    ? 'bg-slate-950 text-white border-slate-950 shadow-md ring-2 ring-orange-500/40'
                    : 'bg-white text-slate-700 border-slate-200/90 hover:bg-orange-50/50 hover:border-orange-300'
                }`}
              >
                <span className="text-base">{tab.icon}</span>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span>{tab.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                      isSelected ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {count}
                    </span>
                  </div>
                  <div className={`text-[10px] font-medium leading-none mt-0.5 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                    {tab.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* RESTAURANTS & THEIR FOOD SECTIONS LIST */}
      {filteredRestaurants.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mx-auto mb-4">
            <Store className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No Kitchens Found</h3>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            No kitchens match the current filter "{selectedLocationFilter}" {globalSearchQuery ? `and query "${globalSearchQuery}"` : ''}.
          </p>
          <button
            onClick={() => {
              setSelectedLocationFilter('All');
              setGlobalSearchQuery('');
            }}
            className="mt-5 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-black shadow-md shadow-orange-600/20 transition-all"
          >
            Show All Goverdhan Kitchens
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {filteredRestaurants.map((restaurant) => {
            // Get all menu items for this restaurant
            const restaurantItems = menuItems.filter(item => item.restaurantId === restaurant.id);
            const isExpanded = expandedRestId === restaurant.id;
            const displayedItems = isExpanded ? restaurantItems : restaurantItems.slice(0, 4);

            return (
              <div 
                key={restaurant.id}
                id={`restaurant-${restaurant.id}`}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                
                {/* 1. RESTAURANT HEADER CARD */}
                <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 text-white p-5 sm:p-7 relative overflow-hidden">
                  
                  {/* Subtle Background Flare */}
                  <div className="absolute right-0 top-0 w-80 h-80 bg-orange-600/10 rounded-full blur-3xl pointer-events-none"></div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center relative z-10">
                    
                    {/* Left: Kitchen Photo & Status Badge (Clickable) */}
                    <div 
                      onClick={() => openRestaurantDetails(restaurant)}
                      className="md:col-span-4 lg:col-span-3 cursor-pointer"
                    >
                      <div className="relative rounded-2xl overflow-hidden shadow-lg aspect-4/3 md:aspect-square group">
                        <img 
                          src={restaurant.image} 
                          alt={restaurant.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                        
                        {/* Status Badges */}
                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-emerald-600 text-white shadow-xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                            Open Now
                          </span>
                        </div>

                        {/* View Details Hover Prompt */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-2xs">
                          <span className="px-3 py-1.5 rounded-xl bg-orange-600 text-white text-xs font-bold shadow-lg flex items-center gap-1">
                            <span>View Kitchen</span>
                            <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>

                        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white text-[11px] font-extrabold">
                          <span className="bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md flex items-center gap-1">
                            <Clock className="w-3 h-3 text-amber-400" />
                            {restaurant.deliveryTimeRange}
                          </span>
                          <span className="bg-amber-500 text-slate-950 px-2 py-0.5 rounded-md flex items-center gap-0.5 font-black">
                            <Star className="w-3 h-3 fill-slate-950" />
                            {restaurant.rating}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Middle: Details & Sacred Location Metadata */}
                    <div className="md:col-span-8 lg:col-span-9 space-y-2.5">
                      
                      {/* Location & Tags */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          onClick={() => setSelectedLocationFilter(restaurant.locationZone || 'All')}
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-orange-500/20 text-orange-300 border border-orange-500/30 hover:bg-orange-500/30 transition-colors"
                        >
                          <MapPin className="w-3.5 h-3.5 text-orange-400" />
                          {restaurant.locationZone || 'Goverdhan'}
                        </button>
                        <span className="text-xs font-bold text-slate-300 bg-white/10 px-2.5 py-0.5 rounded-full">
                          {restaurant.landmark || restaurant.address}
                        </span>
                        <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded-full">
                          ✓ FSSAI: {restaurant.fssaiNumber}
                        </span>
                      </div>

                      {/* Name & Tagline */}
                      <div>
                        <div 
                          onClick={() => openRestaurantDetails(restaurant)}
                          className="flex items-center gap-2 cursor-pointer group/title"
                        >
                          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight group-hover/title:text-orange-400 transition-colors">
                            {restaurant.name}
                          </h3>
                          <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-black shrink-0" title="Verified Bhojnalaya">
                            ✓
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-amber-200/90 font-medium mt-0.5">
                          {restaurant.tagline}
                        </p>
                      </div>

                      {/* Cuisine & Specialty */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300 pt-1">
                        <div>
                          <span className="text-slate-400 font-bold">Cuisines: </span>
                          <span className="text-slate-200">{restaurant.cuisine}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-bold">Specialty: </span>
                          <span className="text-amber-300 font-bold">{restaurant.specialty || 'Pure Satvik Thali'}</span>
                        </div>
                      </div>

                      {/* Quick Meta Footer & Details Button */}
                      <div className="flex items-center justify-between gap-3 pt-2 border-t border-white/10 flex-wrap text-xs text-slate-300">
                        <div className="flex items-center gap-3">
                          <span>Min Order: <strong className="text-white">₹{restaurant.minOrderAmount}</strong></span>
                          <span>•</span>
                          <span>Pure Cow Ghee: <strong className="text-emerald-400">100% Guaranteed</strong></span>
                          <span>•</span>
                          <span>Reviews: <strong className="text-white">{restaurant.reviewsCount}+</strong></span>
                        </div>

                        {/* Action Buttons: Book Table & View Kitchen */}
                        <div className="flex items-center gap-2 ml-auto">
                          <button
                            type="button"
                            onClick={() => openTableBookingModal(restaurant)}
                            className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs"
                            title="Reserve a Dine-in Table via Zomato Dining"
                          >
                            <Ticket className="w-3.5 h-3.5" />
                            <span>Book a Table</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => openRestaurantDetails(restaurant)}
                            className="px-3.5 py-1.5 rounded-xl bg-orange-600/90 hover:bg-orange-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs"
                          >
                            <Store className="w-3.5 h-3.5" />
                            <span>View Kitchen & Menu ↗</span>
                          </button>
                        </div>
                      </div>

                    </div>

                  </div>
                </div>

                {/* 2. "THEIR FOOD SECTION" (Restaurant's Dedicated Dishes Grid) */}
                <div className="p-5 sm:p-7 bg-slate-50/50">
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-5 bg-orange-600 rounded-full"></div>
                      <h4 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                        {restaurant.name}'s Food Menu
                      </h4>
                      <span className="text-xs font-bold text-slate-500 bg-slate-200/70 px-2 py-0.5 rounded-full">
                        {restaurantItems.length} items
                      </span>
                    </div>

                    {/* Expand/Collapse Toggle if more than 4 items */}
                    {restaurantItems.length > 4 && (
                      <button
                        onClick={() => toggleExpandRestaurant(restaurant.id)}
                        className="text-xs font-black text-orange-700 hover:text-orange-800 flex items-center gap-1 transition-colors px-2.5 py-1 rounded-lg hover:bg-orange-100/60"
                      >
                        <span>{isExpanded ? 'Show Fewer Dishes' : `View All ${restaurantItems.length} Dishes`}</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    )}
                  </div>

                  {/* Dishes Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {displayedItems.map((dish) => {
                      const isAdded = justAddedId === dish.id;

                      return (
                        <div
                          key={dish.id}
                          id={`dish-${dish.id}`}
                          onClick={() => openProductDetails(dish)}
                          className="bg-white rounded-2xl border border-slate-200/90 hover:border-orange-400 hover:shadow-md transition-all p-3 flex flex-col justify-between group cursor-pointer"
                        >
                          {/* Dish Image + Badges */}
                          <div>
                            <div className="relative rounded-xl overflow-hidden aspect-16/10 mb-2.5">
                              <img
                                src={dish.image}
                                alt={dish.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              
                              {/* Veg dot badge */}
                              <div className="absolute top-2 left-2 w-4 h-4 rounded bg-white border border-emerald-600 flex items-center justify-center p-0.5 shadow-xs">
                                <div className="w-2 h-2 rounded-full bg-emerald-600"></div>
                              </div>

                              {/* Rating badge */}
                              <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                                <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                                <span>{dish.rating}</span>
                              </div>
                            </div>

                            {/* Category & Title */}
                            <div className="flex items-center justify-between gap-1 mb-1">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openCategoryDetails(dish.category);
                                }}
                                className="text-[10px] font-bold uppercase tracking-wider text-orange-700 bg-orange-50 hover:bg-orange-100 px-1.5 py-0.2 rounded border border-orange-100 transition-colors"
                              >
                                {dish.category}
                              </button>
                              <span className="text-[10px] text-slate-400 font-medium flex items-center gap-0.5">
                                <Clock className="w-2.5 h-2.5" />
                                {dish.prepTimeMinutes}m
                              </span>
                            </div>

                            <h5 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug line-clamp-1 group-hover:text-orange-600 transition-colors">
                              {dish.name}
                            </h5>

                            <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                              {dish.description}
                            </p>
                          </div>

                          {/* Price & Add to Cart */}
                          <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100">
                            <div>
                              <span className="text-xs text-slate-400 block -mb-0.5 font-medium">Price</span>
                              <span className="text-sm sm:text-base font-black text-slate-950">
                                ₹{dish.price}
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={(e) => handleAddToCart(e, dish)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1 shadow-xs active:scale-95 ${
                                isAdded
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-orange-600 hover:bg-orange-700 text-white'
                              }`}
                            >
                              {isAdded ? (
                                <>
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Added!</span>
                                </>
                              ) : (
                                <>
                                  <Plus className="w-3.5 h-3.5" />
                                  <span>Add</span>
                                </>
                              )}
                            </button>
                          </div>

                        </div>
                      );
                    })}
                  </div>

                  {/* Bottom Strip: Ashram Delivery Guarantee for this Restaurant */}
                  <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500 flex-wrap gap-2">
                    <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                      <Flame className="w-3.5 h-3.5 text-amber-500" />
                      Freshly prepared in {restaurant.locationZone} upon ordering. Delivered hot to your Ashram room or Parikrama stop.
                    </span>
                    <button
                      onClick={() => toggleExpandRestaurant(restaurant.id)}
                      className="text-xs font-bold text-orange-600 hover:underline"
                    >
                      {isExpanded ? 'Collapse Menu' : `View All ${restaurantItems.length} Dishes →`}
                    </button>
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

    </section>
  );
};
