import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { MenuItem, Restaurant } from '../../types';
import { 
  X, 
  Star, 
  Clock, 
  MapPin, 
  Store, 
  Plus, 
  Minus, 
  Check, 
  ShieldCheck, 
  Sparkles, 
  UtensilsCrossed, 
  Leaf, 
  Search,
  ChevronRight,
  Filter,
  ArrowUpDown
} from 'lucide-react';
import confetti from 'canvas-confetti';

const CATEGORY_DESCRIPTIONS: Record<string, { desc: string; bannerIcon: string; highlight: string }> = {
  'Daily Thali': {
    desc: 'Complete sacred thali plates featuring fresh Desi Cow Ghee phulkas, arhar dal, seasonal subzis, aromatic jeera rice, and divine sweet prasad. 100% Satvik.',
    bannerIcon: '🍛',
    highlight: 'Pure Cow Ghee Phulkas & Homestyle Arhar Dal'
  },
  'Daily Meals': {
    desc: 'Wholesome, digestive meals prepared specifically for ashram devotees, pilgrims, and long stays in Goverdhan. Light on the stomach and deeply nourishing.',
    bannerIcon: '🍲',
    highlight: 'Stomach-friendly Moong Dal & Sabzis'
  },
  'Prasad': {
    desc: 'Sacred Goverdhan & Mathura prasad offerings including caramelised mawa pedas, makhan mishri bhog, and dry sweets made in pure milk and cow ghee.',
    bannerIcon: '🛕',
    highlight: 'Goverdhan Mawa Pedas & Temple Sweets'
  },
  'Pooja Orders': {
    desc: 'Special bhog offerings and ceremonial dishes prepared with strict spiritual sanctity for parikrama poojas, giriraj abhisheks, and temple archanas.',
    bannerIcon: '🙏',
    highlight: 'Ceremonial Abhishekam & Purity Standard'
  },
  'Bhandara': {
    desc: 'Single & bulk catering trays for feeding pilgrims, sadhus, and devotees during Ekadashi, Purnima, and Parikrama yatras. Delivered hot to ashrams.',
    bannerIcon: '🥘',
    highlight: 'Bulk Eco-Leaf Trays for Devotee Seva'
  },
  'Snacks': {
    desc: 'Crispy snacks fried in pure desi ghee, including samosas, kachoris, bedmi pooris, and crunchy parikrama mathris with Zero Onion and Garlic.',
    bannerIcon: '🥟',
    highlight: 'Fried in 100% Desi Cow Ghee'
  },
  'Thali': {
    desc: 'Traditional North Indian and Pushtimargiya satvik thalis prepared with temple recipes and served with fresh phulkas, dal, subzi, and prasad.',
    bannerIcon: '🍛',
    highlight: 'Traditional Temple Rasoi Recipes'
  },
  'Curry & Sabzi': {
    desc: 'Aromatic pure satvik curries, paneer bhujia, aloo tamatar rasedar, and seasonal vegetables simmered with sendha namak and fresh spices.',
    bannerIcon: '🥘',
    highlight: 'Zero Onion, Zero Garlic Gravies'
  },
  'Desserts & Drinks': {
    desc: 'Sweet temple prasads, Mathura rabdi, malpua, and fresh buttermilk (chaas) rolled with digestive roasted cumin.',
    bannerIcon: '🥛',
    highlight: 'Pure Milk Mawa & Cooling Chaas'
  }
};

export const CategoryDetailsModal: React.FC = () => {
  const { 
    selectedCategoryForModal, 
    setSelectedCategoryForModal,
    menuItems,
    restaurants,
    cart,
    addToCart,
    updateCartQuantity,
    openProductDetails,
    openRestaurantDetails
  } = useApp();

  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'rating' | 'price_low' | 'price_high'>('rating');
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  // Find all dishes belonging to this category unconditionally
  const matchingDishes = useMemo(() => {
    if (!selectedCategoryForModal) return [];
    const categoryName = selectedCategoryForModal;
    return menuItems.filter(item => {
      if (categoryName === 'Daily Thali') {
        return item.category === 'Daily Thali' || item.category === 'Thali';
      }
      if (categoryName === 'Daily Meals') {
        return item.category === 'Daily Meals' || item.category === 'Curry & Sabzi';
      }
      if (categoryName === 'Prasad') {
        return item.category === 'Prasad' || item.category === 'Desserts & Drinks';
      }
      return item.category === categoryName;
    });
  }, [menuItems, selectedCategoryForModal]);

  // Filter and sort dishes unconditionally
  const filteredDishes = useMemo(() => {
    if (!selectedCategoryForModal) return [];
    let list = matchingDishes.filter(dish => {
      const rest = restaurants.find(r => r.id === dish.restaurantId);
      if (selectedLocation !== 'All') {
        if (!rest?.locationZone?.toLowerCase().includes(selectedLocation.toLowerCase())) {
          return false;
        }
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = dish.name.toLowerCase().includes(q);
        const matchDesc = dish.description.toLowerCase().includes(q);
        const matchRest = rest?.name.toLowerCase().includes(q) || false;
        if (!matchName && !matchDesc && !matchRest) return false;
      }
      return true;
    });

    if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'price_low') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_high') {
      list.sort((a, b) => b.price - a.price);
    }

    return list;
  }, [matchingDishes, restaurants, selectedLocation, searchQuery, sortBy, selectedCategoryForModal]);

  // Return early ONLY after all hooks have been called unconditionally
  if (!selectedCategoryForModal) return null;

  const categoryName = selectedCategoryForModal;
  const categoryInfo = CATEGORY_DESCRIPTIONS[categoryName] || {
    desc: 'Explore authentic Goverdhan satvik specialties cooked in pure cow ghee with strict temple purity standards.',
    bannerIcon: '✨',
    highlight: '100% Pure Satvik • No Onion, No Garlic'
  };

  // Find kitchens that serve items in this category
  const kitchenIds = Array.from(new Set(matchingDishes.map(d => d.restaurantId)));
  const specialistKitchens = restaurants.filter(r => kitchenIds.includes(r.id));

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
        {/* TOP BANNER */}
        <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white p-6 sm:p-8 relative overflow-hidden shrink-0">
          <div className="absolute right-0 top-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>

          {/* Close button */}
          <button
            onClick={() => setSelectedCategoryForModal(null)}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-colors shadow-md z-10"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="relative z-10 space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-3xl">{categoryInfo.bannerIcon}</span>
              <span className="text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-md">
                Goverdhan Category Showcase
              </span>
              <span className="text-xs font-bold text-amber-200 bg-black/20 px-2 py-0.5 rounded-full">
                {matchingDishes.length} Sacred Items
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight drop-shadow-sm">
              {categoryName} Delicacies
            </h1>

            <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-medium">
              {categoryInfo.desc}
            </p>

            <div className="pt-2 flex items-center gap-3 text-xs text-amber-100 font-bold flex-wrap">
              <span className="flex items-center gap-1 bg-white/15 px-2.5 py-1 rounded-xl">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                {categoryInfo.highlight}
              </span>
              <span className="flex items-center gap-1 bg-white/15 px-2.5 py-1 rounded-xl">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                No Onion, No Garlic Verified
              </span>
            </div>
          </div>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="p-5 sm:p-7 overflow-y-auto flex-1 space-y-6">

          {/* SPECIALIST KITCHENS FOR THIS CATEGORY (CLICKABLE TO OPEN RESTAURANT DETAILS) */}
          {specialistKitchens.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Store className="w-4 h-4 text-orange-600" />
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                    Sacred Kitchens Specializing in {categoryName}
                  </h3>
                  <span className="text-xs text-slate-400 font-bold">
                    ({specialistKitchens.length})
                  </span>
                </div>
                <span className="text-xs text-slate-500 hidden sm:inline font-medium">
                  Tap any kitchen to view its full details & location
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {specialistKitchens.map(kitchen => (
                  <div
                    key={kitchen.id}
                    onClick={() => {
                      setSelectedCategoryForModal(null);
                      openRestaurantDetails(kitchen);
                    }}
                    className="p-3 rounded-2xl border border-slate-200/90 hover:border-orange-400 hover:shadow-md cursor-pointer transition-all bg-white flex items-center gap-3 group"
                  >
                    <img 
                      src={kitchen.image} 
                      alt={kitchen.name} 
                      className="w-12 h-12 rounded-xl object-cover border border-slate-100 group-hover:scale-105 transition-transform"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 truncate group-hover:text-orange-600 transition-colors">
                        {kitchen.name}
                      </h4>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                        <MapPin className="w-3 h-3 text-orange-600 shrink-0" />
                        <span className="truncate">{kitchen.locationZone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-600 mt-1 font-bold">
                        <span className="text-amber-600">★ {kitchen.rating}</span>
                        <span>•</span>
                        <span>{kitchen.deliveryTimeRange}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-orange-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FILTER & SORT CONTROLS */}
          <div className="pt-2 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            
            {/* Location Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
              {['All', 'Dan Ghati', 'Radha Kund', 'Mansi Ganga', 'Jatipura', 'Anyor'].map(zone => (
                <button
                  key={zone}
                  onClick={() => setSelectedLocation(zone)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                    selectedLocation === zone
                      ? 'bg-orange-600 text-white border-orange-600 shadow-2xs'
                      : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  {zone === 'All' ? 'All Holy Zones' : zone}
                </button>
              ))}
            </div>

            {/* In-category Search & Sort */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter dishes..."
                  className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-1 focus:ring-orange-500 w-36 sm:w-44"
                />
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-xs font-bold px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-hidden cursor-pointer"
              >
                <option value="rating">Top Rated</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
              </select>
            </div>

          </div>

          {/* ALL DISHES IN THIS CATEGORY */}
          {filteredDishes.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200">
              <p className="text-sm font-bold text-slate-700">No dishes match the selected location or search query.</p>
              <button
                onClick={() => {
                  setSelectedLocation('All');
                  setSearchQuery('');
                }}
                className="mt-2 text-xs font-bold text-orange-600 hover:underline"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDishes.map(dish => {
                const inCart = cart.find(ci => ci.menuItem.id === dish.id);
                const restObj = restaurants.find(r => r.id === dish.restaurantId);
                const isAdded = justAddedId === dish.id;

                return (
                  <div
                    key={dish.id}
                    onClick={() => openProductDetails(dish)}
                    className="bg-white rounded-2xl border border-slate-200/90 hover:border-orange-400 hover:shadow-md transition-all p-3.5 flex flex-col justify-between cursor-pointer group relative"
                  >
                    <div>
                      {/* Image */}
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

                      {/* Cooked by Restaurant link */}
                      {restObj && (
                        <div 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCategoryForModal(null);
                            openRestaurantDetails(restObj);
                          }}
                          className="text-[10px] font-bold text-orange-700 hover:text-orange-800 hover:underline flex items-center gap-1 mb-1"
                        >
                          <Store className="w-3 h-3" />
                          <span>{restObj.name}</span>
                          <span className="text-slate-400">• {restObj.locationZone}</span>
                        </div>
                      )}

                      <h4 className="font-extrabold text-sm text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-1">
                        {dish.name}
                      </h4>

                      <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                        {dish.description}
                      </p>
                    </div>

                    {/* Price & Add */}
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

        </div>

        {/* FOOTER */}
        <div className="p-4 sm:p-5 bg-white border-t border-slate-200 flex items-center justify-between gap-4 shrink-0">
          <div className="text-xs text-slate-500 font-medium">
            Showing <strong className="text-slate-900">{filteredDishes.length}</strong> items in <strong>{categoryName}</strong>
          </div>

          <button
            onClick={() => setSelectedCategoryForModal(null)}
            className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
          >
            Close Category View
          </button>
        </div>

      </div>
    </div>
  );
};
