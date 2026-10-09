import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MenuItem } from '../../types';
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
  Share2, 
  Heart,
  ChevronRight,
  Flame,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ProductDetailsModal: React.FC = () => {
  const { 
    selectedProductForModal, 
    setSelectedProductForModal,
    restaurants,
    menuItems,
    cart,
    addToCart,
    updateCartQuantity,
    openRestaurantDetails,
    openCategoryDetails,
    openProductDetails
  } = useApp();

  const [quantity, setQuantity] = useState<number>(1);
  const [spicePreference, setSpicePreference] = useState<'Mild' | 'Medium' | 'Jain'>('Mild');
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [specialInstruction, setSpecialInstruction] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  if (!selectedProductForModal) return null;

  const dish = selectedProductForModal;
  const kitchen = restaurants.find(r => r.id === dish.restaurantId);
  const inCart = cart.find(ci => ci.menuItem.id === dish.id);

  // Suggested addons
  const availableAddons = [
    { id: 'ghee-roti', name: 'Extra Desi Ghee Tawa Phulka', price: 15 },
    { id: 'makhan', name: 'Fresh White Makhan Cube', price: 20 },
    { id: 'mithai-cup', name: 'Mini Mathura Peda Prasad Cup', price: 25 },
  ];

  const toggleAddon = (id: string) => {
    setSelectedAddons(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const addonsTotal = selectedAddons.reduce((sum, id) => {
    const addon = availableAddons.find(a => a.id === id);
    return sum + (addon ? addon.price : 0);
  }, 0);

  const unitPrice = dish.price + addonsTotal;
  const currentTotalPrice = unitPrice * quantity;

  // Handle Add to Thali
  const handleAddToCart = () => {
    addToCart(dish, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);

    try {
      confetti({
        particleCount: 45,
        spread: 70,
        origin: { y: 0.6, x: 0.5 },
        colors: ['#ea580c', '#10b981', '#f59e0b', '#3b82f6'],
      });
    } catch (e) { /* ignore */ }
  };

  // Other items from this kitchen
  const relatedItems = menuItems
    .filter(m => m.restaurantId === dish.restaurantId && m.id !== dish.id)
    .slice(0, 3);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div 
        className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* TOP BAR / CONTROLS OVER IMAGE */}
        <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-900 shrink-0">
          <img 
            src={dish.image} 
            alt={dish.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

          {/* Floating Action Buttons */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
            <div className="flex items-center gap-2">
              <span className="bg-emerald-600/90 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                <span>Pure Satvik</span>
              </span>
              <span className="bg-black/60 backdrop-blur-md text-amber-300 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 border border-amber-400/30">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Desi Cow Ghee</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white flex items-center justify-center transition-colors shadow-md"
                title="Share Dish"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center transition-colors shadow-md ${
                  isFavorite ? 'bg-red-600 text-white' : 'bg-black/60 hover:bg-black/80 text-white'
                }`}
                title="Add to Favorites"
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={() => setSelectedProductForModal(null)}
                className="w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white flex items-center justify-center transition-colors shadow-md"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Bottom of Photo Details Overlay */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <button
                onClick={() => {
                  setSelectedProductForModal(null);
                  openCategoryDetails(dish.category);
                }}
                className="text-xs font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-orange-600/90 text-white hover:bg-orange-500 transition-colors flex items-center gap-1 shadow-xs"
              >
                <span>{dish.category}</span>
                <ChevronRight className="w-3 h-3" />
              </button>
              <span className="text-xs bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded-full flex items-center gap-1 font-bold text-slate-200">
                <Clock className="w-3 h-3 text-amber-400" />
                <span>{dish.prepTimeMinutes} mins prep</span>
              </span>
              <span className="text-xs bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full font-black flex items-center gap-1">
                <Star className="w-3 h-3 fill-slate-950 text-slate-950" />
                <span>{dish.rating} ({dish.reviewsCount} reviews)</span>
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight drop-shadow-md">
              {dish.name}
            </h2>
          </div>
        </div>

        {/* NOTIFICATION MESSAGE IF COPIED */}
        {copiedLink && (
          <div className="bg-emerald-600 text-white text-xs font-bold py-1 px-4 text-center">
            Link copied to clipboard! Share with family & devotees.
          </div>
        )}

        {/* SCROLLABLE BODY */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 flex-1">
          
          {/* Price & In-Stock Strip */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Price per portion</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl sm:text-3xl font-black text-slate-950">₹{dish.price}</span>
                <span className="text-sm text-slate-400 line-through font-semibold">₹{Math.round(dish.price * 1.25)}</span>
                <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  SAVE 20%
                </span>
              </div>
            </div>

            <div>
              {dish.inStock ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                  Fresh Batch Available
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black bg-red-50 text-red-700 border border-red-200">
                  Sold Out Today
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-1.5">
              Dish Description & Heritage
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed font-medium">
              {dish.description}
            </p>
          </div>

          {/* COOKED BY RESTAURANT CARD (CLICKABLE TO OPEN RESTAURANT DETAILS) */}
          {kitchen && (
            <div 
              onClick={() => {
                setSelectedProductForModal(null);
                openRestaurantDetails(kitchen);
              }}
              className="bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50/50 p-4 rounded-2xl border border-orange-200 hover:border-orange-400 hover:shadow-md cursor-pointer transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-orange-800">
                  <Store className="w-3.5 h-3.5 text-orange-600" />
                  <span>Prepared Fresh By Sacred Kitchen:</span>
                </div>
                <span className="text-xs font-black text-orange-700 group-hover:underline flex items-center gap-0.5">
                  <span>View Full Kitchen</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>

              <div className="flex items-center gap-3.5">
                <img 
                  src={kitchen.image} 
                  alt={kitchen.name} 
                  className="w-14 h-14 rounded-xl object-cover border border-orange-200 shadow-xs group-hover:scale-105 transition-transform"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-extrabold text-sm sm:text-base text-slate-900 truncate group-hover:text-orange-700 transition-colors">
                      {kitchen.name}
                    </h4>
                    <span className="text-xs font-bold text-emerald-700 shrink-0">✓ Verified</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5 flex-wrap">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-orange-600" />
                      <strong>{kitchen.locationZone}</strong> ({kitchen.landmark || kitchen.address})
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-600 mt-1">
                    <span className="flex items-center gap-0.5 font-bold text-amber-700">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      {kitchen.rating} Rating
                    </span>
                    <span>•</span>
                    <span>{kitchen.deliveryTimeRange} delivery</span>
                    <span>•</span>
                    <span className="text-emerald-700 font-bold">FSSAI: {kitchen.fssaiNumber}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SATVIK PURITY HIGHLIGHTS */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Goverdhan Sattvic Purity Standards</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-2xs">
                <span className="text-base block mb-1">🌿</span>
                <span className="font-extrabold text-slate-900 block">No Onion / Garlic</span>
                <span className="text-[10px] text-slate-500">100% Satvik temple rasoi</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-2xs">
                <span className="text-base block mb-1">🧈</span>
                <span className="font-extrabold text-slate-900 block">Pure Cow Ghee</span>
                <span className="text-[10px] text-slate-500">Traditional Bilona ghee</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-2xs">
                <span className="text-base block mb-1">🛕</span>
                <span className="font-extrabold text-slate-900 block">Mandir Rasoi</span>
                <span className="text-[10px] text-slate-500">Bhog blessed purity</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-2xs">
                <span className="text-base block mb-1">🍃</span>
                <span className="font-extrabold text-slate-900 block">Bio Eco Packing</span>
                <span className="text-[10px] text-slate-500">Thermal leaf sealing</span>
              </div>
            </div>
          </div>

          {/* CUSTOMIZATION PREFERENCES */}
          <div className="space-y-4">
            <div>
              <label className="text-xs font-black uppercase tracking-wider text-slate-700 block mb-2">
                Select Spice & Purity Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Mild', 'Medium', 'Jain'] as const).map(lvl => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setSpicePreference(lvl)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                      spicePreference === lvl
                        ? 'bg-orange-600 text-white border-orange-600 shadow-xs'
                        : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    {lvl === 'Mild' && <span>🍃 Sattvic Mild</span>}
                    {lvl === 'Medium' && <span>🌶️ Braj Spices</span>}
                    {lvl === 'Jain' && <span>🙏 Strict Jain</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Recommended Add-ons */}
            <div>
              <label className="text-xs font-black uppercase tracking-wider text-slate-700 block mb-2">
                Add Sacred Companions (Optional)
              </label>
              <div className="space-y-2">
                {availableAddons.map(addon => {
                  const isChecked = selectedAddons.includes(addon.id);
                  return (
                    <div 
                      key={addon.id}
                      onClick={() => toggleAddon(addon.id)}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        isChecked 
                          ? 'bg-orange-50/60 border-orange-400 text-slate-900' 
                          : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-4 h-4 rounded-md flex items-center justify-center border ${
                          isChecked ? 'bg-orange-600 border-orange-600 text-white' : 'border-slate-300'
                        }`}>
                          {isChecked && <Check className="w-3 h-3" />}
                        </div>
                        <span className="text-xs font-bold">{addon.name}</span>
                      </div>
                      <span className="text-xs font-extrabold text-orange-700">+₹{addon.price}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Special Instructions */}
            <div>
              <label className="text-xs font-black uppercase tracking-wider text-slate-700 block mb-1.5">
                Special Rasoi / Ashram Instruction
              </label>
              <input 
                type="text"
                value={specialInstruction}
                onChange={(e) => setSpecialInstruction(e.target.value)}
                placeholder="e.g., Deliver piping hot near Dan Ghati Gate 2, extra tissue..."
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500"
              />
            </div>
          </div>

          {/* DEVOTEES & PILGRIMS REVIEWS PREVIEW */}
          <div className="border-t border-slate-100 pt-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 mb-2 flex items-center justify-between">
              <span>Pilgrim Reviews & Experiences</span>
              <span className="text-amber-600 font-bold text-xs">{dish.rating} ★ (4.9 average)</span>
            </h4>

            <div className="space-y-2">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-extrabold text-slate-900">Naveen Agrawal (Radha Kund Parikrama)</span>
                  <span className="text-[10px] text-slate-400">Yesterday</span>
                </div>
                <div className="flex items-center gap-0.5 text-amber-500 mb-1">
                  {'★★★★★'}
                </div>
                <p className="text-slate-600">
                  "Truly blessed taste. The cow ghee aroma was outstanding and delivery to our dharamshala was in 20 minutes!"
                </p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-extrabold text-slate-900">Dr. Meenakshi Joshi (Delhi)</span>
                  <span className="text-[10px] text-slate-400">3 days ago</span>
                </div>
                <div className="flex items-center gap-0.5 text-amber-500 mb-1">
                  {'★★★★★'}
                </div>
                <p className="text-slate-600">
                  "No onion, no garlic, completely digestive and pure. The ideal food during Goverdhan parikrama."
                </p>
              </div>
            </div>
          </div>

          {/* MORE FROM THIS KITCHEN */}
          {relatedItems.length > 0 && (
            <div className="border-t border-slate-100 pt-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 mb-3">
                More Delicacies from {kitchen?.name}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {relatedItems.map(item => (
                  <div
                    key={item.id}
                    onClick={() => openProductDetails(item)}
                    className="p-2.5 rounded-xl border border-slate-200 hover:border-orange-300 hover:shadow-xs cursor-pointer transition-all bg-white flex flex-col justify-between group"
                  >
                    <div className="relative aspect-4/3 rounded-lg overflow-hidden mb-2 bg-slate-100">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                      />
                      <span className="absolute top-1 left-1 text-[9px] font-black bg-white/90 text-emerald-800 px-1 py-0.2 rounded">
                        SATVIK
                      </span>
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-900 group-hover:text-orange-600 line-clamp-1">
                        {item.name}
                      </h5>
                      <span className="text-xs font-black text-slate-950 mt-1 block">
                        ₹{item.price}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* FOOTER BAR: QUANTITY & ADD TO THALI CTA */}
        <div className="p-4 sm:p-5 bg-white border-t border-slate-200 flex items-center justify-between gap-4 shrink-0 shadow-lg">
          {/* Quantity Controls */}
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl border border-slate-200">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-9 h-9 rounded-xl bg-white text-slate-800 flex items-center justify-center font-bold hover:bg-slate-200 transition-colors shadow-2xs"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-black text-base text-slate-900 px-2 min-w-8 text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-9 h-9 rounded-xl bg-orange-600 text-white flex items-center justify-center font-bold hover:bg-orange-700 transition-colors shadow-2xs"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Thali Button */}
          <button
            type="button"
            disabled={!dish.inStock}
            onClick={handleAddToCart}
            className={`flex-1 py-3 px-5 rounded-2xl font-black text-sm transition-all flex items-center justify-between shadow-md active:scale-98 ${
              !dish.inStock
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                : justAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-orange-600 hover:bg-orange-700 text-white shadow-orange-600/25'
            }`}
          >
            <span>
              {justAdded ? '✓ Added to Thali!' : inCart ? `Add More (${inCart.quantity} in cart)` : 'Add to Holy Thali'}
            </span>
            <span className="bg-white/20 px-2.5 py-1 rounded-xl text-xs font-black">
              ₹{currentTotalPrice}
            </span>
          </button>
        </div>

      </div>
    </div>
  );
};
