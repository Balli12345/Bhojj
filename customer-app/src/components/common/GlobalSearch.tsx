import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { MenuItem, Restaurant } from '../../types';
import { 
  Search, 
  X, 
  MapPin, 
  Utensils, 
  Store, 
  Star, 
  Clock, 
  Plus, 
  Check, 
  TrendingUp, 
  Sparkles,
  ArrowRight,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

const POPULAR_SEARCHES = [
  'Satvik Thali',
  'Mathura Peda',
  'Desi Ghee Samosa',
  'Ashram Khichdi',
  'Bedmi Poori',
  'Dan Ghati Rasoi',
  'Bhandara Tray',
  'Rabdi Malpua'
];

export const LOCATION_ZONES = [
  'All',
  'Dan Ghati',
  'Radha Kund',
  'Mansi Ganga',
  'Jatipura',
  'Anyor / Parikrama',
];

interface GlobalSearchProps {
  className?: string;
  onResultSelect?: () => void;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({ className = '', onResultSelect }) => {
  const { 
    menuItems, 
    restaurants, 
    addToCart, 
    setCurrentView,
    globalSearchQuery,
    setGlobalSearchQuery,
    selectedLocationFilter,
    setSelectedLocationFilter,
    openProductDetails,
    openRestaurantDetails,
    openCategoryDetails,
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'dishes' | 'restaurants'>('all');
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter food items based on query & location
  const matchingDishes = menuItems.filter((dish) => {
    const query = globalSearchQuery.trim().toLowerCase();
    const rest = restaurants.find(r => r.id === dish.restaurantId);

    // Location filter
    if (selectedLocationFilter !== 'All') {
      if (rest?.locationZone && !rest.locationZone.toLowerCase().includes(selectedLocationFilter.toLowerCase())) {
        return false;
      }
    }

    if (!query) return false;

    const matchesName = dish.name.toLowerCase().includes(query);
    const matchesDesc = dish.description.toLowerCase().includes(query);
    const matchesCat = dish.category.toLowerCase().includes(query);
    const matchesRest = rest?.name.toLowerCase().includes(query) || false;
    const matchesLoc = rest?.locationZone?.toLowerCase().includes(query) || false;

    return matchesName || matchesDesc || matchesCat || matchesRest || matchesLoc;
  });

  // Filter restaurants based on query & location
  const matchingRestaurants = restaurants.filter((rest) => {
    const query = globalSearchQuery.trim().toLowerCase();

    // Location filter
    if (selectedLocationFilter !== 'All') {
      if (rest.locationZone && !rest.locationZone.toLowerCase().includes(selectedLocationFilter.toLowerCase())) {
        return false;
      }
    }

    if (!query) {
      // If no query but location is selected other than All, show all restaurants in that location
      return selectedLocationFilter !== 'All';
    }

    const matchesName = rest.name.toLowerCase().includes(query);
    const matchesCuisine = rest.cuisine.toLowerCase().includes(query);
    const matchesTag = rest.tagline.toLowerCase().includes(query);
    const matchesLoc = rest.locationZone?.toLowerCase().includes(query) || false;
    const matchesLandmark = rest.landmark?.toLowerCase().includes(query) || false;
    const matchesCity = rest.city.toLowerCase().includes(query);

    // Check if any dish of this restaurant matches
    const hasMatchingDish = menuItems.some(
      m => m.restaurantId === rest.id && (
        m.name.toLowerCase().includes(query) ||
        m.category.toLowerCase().includes(query)
      )
    );

    return matchesName || matchesCuisine || matchesTag || matchesLoc || matchesLandmark || matchesCity || hasMatchingDish;
  });

  const totalResults = matchingDishes.length + matchingRestaurants.length;

  const handleAddToCart = (e: React.MouseEvent, dish: MenuItem) => {
    e.stopPropagation();
    addToCart(dish, 1);
    setRecentlyAddedId(dish.id);
    setTimeout(() => setRecentlyAddedId(null), 1400);

    try {
      confetti({
        particleCount: 28,
        spread: 50,
        origin: { y: 0.2, x: 0.5 },
        colors: ['#ea580c', '#f59e0b', '#10b981'],
      });
    } catch (err) { /* ignore */ }
  };

  const handleSelectDish = (dish: MenuItem) => {
    setIsOpen(false);
    setCurrentView('customer_dashboard');
    if (onResultSelect) onResultSelect();
    openProductDetails(dish);
  };

  const handleSelectRestaurant = (rest: Restaurant) => {
    setIsOpen(false);
    setCurrentView('customer_dashboard');
    if (onResultSelect) onResultSelect();
    openRestaurantDetails(rest);
  };

  const handleChipClick = (term: string) => {
    setGlobalSearchQuery(term);
    setIsOpen(true);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const clearSearch = () => {
    setGlobalSearchQuery('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div ref={searchContainerRef} className={`relative ${className}`}>
      
      {/* Search Input Bar */}
      <div className="relative flex items-center">
        <div className="absolute left-3.5 text-slate-400 pointer-events-none flex items-center">
          <Search className="w-4 h-4 text-slate-400" />
        </div>

        <input
          ref={inputRef}
          type="text"
          id="global-header-search-input"
          value={globalSearchQuery}
          onChange={(e) => {
            setGlobalSearchQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search Satvik Thali, Samosa, Peda or Kitchens by Location..."
          className="w-full pl-10 pr-24 py-2 rounded-xl bg-slate-100/90 hover:bg-slate-100 focus:bg-white border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all shadow-2xs"
        />

        {/* Right side controls inside input: Location badge & Clear */}
        <div className="absolute right-2.5 flex items-center gap-1.5">
          {globalSearchQuery && (
            <button
              onClick={clearSearch}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/70 transition-colors"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Quick Location Indicator Chip */}
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-orange-50 hover:bg-orange-100 text-[10px] font-bold text-orange-800 border border-orange-200/80 transition-colors"
            title="Current search location filter"
          >
            <MapPin className="w-2.5 h-2.5 text-orange-600" />
            <span className="max-w-[72px] truncate">{selectedLocationFilter === 'All' ? 'Goverdhan' : selectedLocationFilter}</span>
          </button>
        </div>
      </div>

      {/* Live Search & Autocomplete Results Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150 max-h-[85vh] flex flex-col">
          
          {/* Top Bar: Location Selector Strip */}
          <div className="p-3 bg-slate-50/90 border-b border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-orange-600" />
                Filter by Goverdhan Location:
              </span>
              {selectedLocationFilter !== 'All' && (
                <button
                  onClick={() => setSelectedLocationFilter('All')}
                  className="text-[10px] font-bold text-orange-600 hover:underline"
                >
                  Reset to All
                </button>
              )}
            </div>

            {/* Location Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
              {LOCATION_ZONES.map((zone) => {
                const isSelected = selectedLocationFilter === zone;
                return (
                  <button
                    key={zone}
                    type="button"
                    onClick={() => setSelectedLocationFilter(zone)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition-all flex items-center gap-1 ${
                      isSelected
                        ? 'bg-orange-600 text-white shadow-xs'
                        : 'bg-white text-slate-700 hover:bg-slate-200/70 border border-slate-200'
                    }`}
                  >
                    <span>{zone === 'All' ? 'All Locations' : zone}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Results Category Tabs (when query exists) */}
          {globalSearchQuery.trim() && (
            <div className="flex items-center px-4 pt-2.5 border-b border-slate-100 bg-white gap-2 text-xs font-bold">
              <button
                onClick={() => setActiveTab('all')}
                className={`pb-2 px-1 border-b-2 transition-colors ${
                  activeTab === 'all'
                    ? 'border-orange-600 text-orange-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                All Results ({totalResults})
              </button>
              <button
                onClick={() => setActiveTab('dishes')}
                className={`pb-2 px-1 border-b-2 transition-colors flex items-center gap-1 ${
                  activeTab === 'dishes'
                    ? 'border-orange-600 text-orange-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Utensils className="w-3 h-3" />
                <span>Food Items ({matchingDishes.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('restaurants')}
                className={`pb-2 px-1 border-b-2 transition-colors flex items-center gap-1 ${
                  activeTab === 'restaurants'
                    ? 'border-orange-600 text-orange-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Store className="w-3 h-3" />
                <span>Kitchens ({matchingRestaurants.length})</span>
              </button>
            </div>
          )}

          {/* Scrollable Body */}
          <div className="overflow-y-auto max-h-[60vh] divide-y divide-slate-100 p-2 sm:p-3">
            
            {/* Case 1: Empty Query - Show Popular Searches & Featured Kitchens by Location */}
            {!globalSearchQuery.trim() && (
              <div className="space-y-4 py-2">
                
                {/* Trending Food Suggestions */}
                <div>
                  <div className="flex items-center gap-1.5 px-2 mb-2 text-xs font-extrabold text-slate-800">
                    <TrendingUp className="w-3.5 h-3.5 text-orange-600" />
                    <span>Popular Satvik Searches</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 px-2">
                    {POPULAR_SEARCHES.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => handleChipClick(item)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-orange-50 hover:text-orange-700 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5 border border-slate-200/70"
                      >
                        <Search className="w-3 h-3 text-slate-400" />
                        <span>{item}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Kitchens in Selected Location */}
                <div>
                  <div className="flex items-center justify-between px-2 mb-2">
                    <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-800">
                      <Store className="w-3.5 h-3.5 text-amber-600" />
                      <span>
                        {selectedLocationFilter === 'All'
                          ? 'Certified Goverdhan Kitchens'
                          : `Kitchens in ${selectedLocationFilter}`}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {matchingRestaurants.length} found
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {matchingRestaurants.slice(0, 4).map((rest) => (
                      <div
                        key={rest.id}
                        onClick={() => handleSelectRestaurant(rest)}
                        className="p-2.5 rounded-xl border border-slate-200/80 hover:border-orange-300 hover:bg-orange-50/30 transition-all cursor-pointer flex items-center gap-3 group"
                      >
                        <img
                          src={rest.image}
                          alt={rest.name}
                          className="w-12 h-12 rounded-lg object-cover shrink-0 group-hover:scale-105 transition-transform"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-bold text-slate-900 truncate">
                              {rest.name}
                            </span>
                            <span className="text-[9px] font-extrabold bg-emerald-100 text-emerald-800 px-1 py-0.2 rounded shrink-0">
                              ★ {rest.rating}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 truncate">{rest.tagline}</p>
                          <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400 font-medium">
                            <span className="text-orange-700 font-bold flex items-center gap-0.5">
                              <MapPin className="w-2.5 h-2.5" />
                              {rest.locationZone || 'Goverdhan'}
                            </span>
                            <span>•</span>
                            <span>{rest.deliveryTimeRange}</span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-orange-600 transition-colors shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* Case 2: Query active - Show Matching Results */}
            {globalSearchQuery.trim() && (
              <>
                {/* 1. MATCHING RESTAURANTS SECTION */}
                {(activeTab === 'all' || activeTab === 'restaurants') && matchingRestaurants.length > 0 && (
                  <div className="py-2">
                    <div className="flex items-center justify-between px-2 mb-2">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                        <Store className="w-3 h-3 text-orange-600" />
                        Kitchens & Bhojnalayas ({matchingRestaurants.length})
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      {matchingRestaurants.map((rest) => {
                        const restDishCount = menuItems.filter(m => m.restaurantId === rest.id).length;
                        return (
                          <div
                            key={rest.id}
                            onClick={() => handleSelectRestaurant(rest)}
                            className="p-2.5 rounded-xl hover:bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <img
                                src={rest.image}
                                alt={rest.name}
                                className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-200 group-hover:scale-105 transition-transform"
                              />
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                                    {rest.name}
                                  </h4>
                                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-0.5">
                                    <MapPin className="w-2.5 h-2.5" />
                                    {rest.locationZone || 'Goverdhan'}
                                  </span>
                                  <span className="text-[9px] font-black px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800">
                                    ★ {rest.rating}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-500 truncate mt-0.5">
                                  {rest.cuisine}
                                </p>
                                <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                                  <span>{rest.deliveryTimeRange}</span>
                                  <span>•</span>
                                  <span>{restDishCount} dishes available</span>
                                  <span>•</span>
                                  <span className="text-emerald-700 font-semibold">100% Satvik</span>
                                </div>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectRestaurant(rest);
                              }}
                              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-orange-50 hover:bg-orange-600 text-orange-700 hover:text-white border border-orange-200 hover:border-orange-600 transition-all shrink-0 flex items-center gap-1"
                            >
                              <span>View Menu</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 2. MATCHING FOOD ITEMS SECTION */}
                {(activeTab === 'all' || activeTab === 'dishes') && matchingDishes.length > 0 && (
                  <div className="py-2">
                    <div className="flex items-center justify-between px-2 mb-2">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                        <Utensils className="w-3 h-3 text-orange-600" />
                        Satvik Food Items ({matchingDishes.length})
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      {matchingDishes.map((dish) => {
                        const rest = restaurants.find(r => r.id === dish.restaurantId);
                        const isAdded = recentlyAddedId === dish.id;

                        return (
                          <div
                            key={dish.id}
                            onClick={() => handleSelectDish(dish)}
                            className="p-2.5 rounded-xl hover:bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="relative shrink-0">
                                <img
                                  src={dish.image}
                                  alt={dish.name}
                                  className="w-13 h-13 rounded-xl object-cover border border-slate-200 group-hover:scale-105 transition-transform"
                                />
                                <span className="absolute bottom-1 right-1 w-3 h-3 rounded-full bg-emerald-600 ring-2 ring-white" title="Pure Veg Satvik"></span>
                              </div>

                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                                    {dish.name}
                                  </h4>
                                  <span className="text-[10px] font-black text-orange-600 bg-orange-50 px-1.5 py-0.2 rounded border border-orange-100">
                                    ₹{dish.price}
                                  </span>
                                  <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                                    {dish.category}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-500 truncate mt-0.5 max-w-md">
                                  {dish.description}
                                </p>
                                <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                                  <span className="text-slate-700 font-bold">
                                    {rest?.name || 'Goverdhan Rasoi'}
                                  </span>
                                  {rest?.locationZone && (
                                    <>
                                      <span>•</span>
                                      <span className="text-orange-700 font-medium flex items-center gap-0.5">
                                        <MapPin className="w-2.5 h-2.5" />
                                        {rest.locationZone}
                                      </span>
                                    </>
                                  )}
                                  <span>•</span>
                                  <span className="flex items-center gap-0.5 text-amber-600 font-bold">
                                    <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                                    {dish.rating}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Direct Add to Cart Action */}
                            <button
                              type="button"
                              onClick={(e) => handleAddToCart(e, dish)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all shrink-0 flex items-center gap-1 shadow-xs active:scale-95 ${
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
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Empty State when query returned nothing */}
                {totalResults === 0 && (
                  <div className="py-8 text-center px-4">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
                      <Search className="w-6 h-6" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">
                      No results for "{globalSearchQuery}"
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                      Try searching for "Thali", "Peda", "Samosa", "Khichdi" or switch to "All Locations" filter above.
                    </p>
                    <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                      {POPULAR_SEARCHES.slice(0, 4).map((term) => (
                        <button
                          key={term}
                          onClick={() => handleChipClick(term)}
                          className="px-2.5 py-1 rounded-lg bg-orange-50 text-orange-700 text-[11px] font-bold hover:bg-orange-100 transition-colors"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

          </div>

          {/* Bottom Footer Info */}
          <div className="p-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1 font-medium">
              <Sparkles className="w-3 h-3 text-amber-500" />
              100% Satvik • Goverdhan Mandir Standard
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="font-bold text-slate-600 hover:text-slate-900 px-2 py-0.5 rounded hover:bg-slate-200/60"
            >
              Close (Esc)
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
