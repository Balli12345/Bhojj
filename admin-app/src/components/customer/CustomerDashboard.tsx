import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { MenuItem, Order, OrderStatus } from '../../types';
import { LocationRestaurantsSection } from './LocationRestaurantsSection';
import { VisualOrderTracker } from './VisualOrderTracker';
import { CustomerProfile } from './CustomerProfile';
import { CouponSelectionModal } from './CouponSelectionModal';
import { LiveDeliveryMap } from '../common/LiveDeliveryMap';
import confetti from 'canvas-confetti';
import { 
  Search, 
  UtensilsCrossed, 
  ShoppingBag, 
  Clock, 
  Star, 
  Plus, 
  Minus, 
  Check, 
  MapPin, 
  Tag, 
  Calendar, 
  Sparkles, 
  Bike, 
  Phone, 
  ArrowRight, 
  X, 
  CreditCard, 
  Banknote, 
  QrCode, 
  Store, 
  Lock, 
  User, 
  Mail,
  Flame,
  ChevronLeft,
  ChevronRight,
  Copy,
  CheckCheck,
  Heart,
  Soup,
  Coffee,
  SunMedium,
  Award,
  ShieldCheck,
  CheckCircle2,
  SlidersHorizontal,
  Leaf,
  Wallet,
  AlertCircle,
  Smartphone,
  Ticket,
  Utensils
} from 'lucide-react';
import { CustomerWallet } from './CustomerWallet';
import { ZomatoDiningSection } from './ZomatoDiningSection';
import { ZomatoTableBookingModal } from './ZomatoTableBookingModal';

export const CustomerDashboard: React.FC = () => {
  const { 
    currentUser, 
    restaurants, 
    menuItems, 
    cart, 
    isCartOpen,
    setIsCartOpen,
    addToCart, 
    updateCartQuantity, 
    removeFromCart, 
    clearCart, 
    placeOrder, 
    orders, 
    rateOrder,
    tiffinSubscriptions, 
    createTiffinSubscription,
    setCurrentView,
    login,
    register,
    globalSearchQuery,
    setGlobalSearchQuery,
    selectedLocationFilter,
    setSelectedLocationFilter,
    openProductDetails,
    openRestaurantDetails,
    openCategoryDetails,
    heroSlides,
    categoriesList,
    portalConfig,
    coupons,
    appliedCoupon,
    applyCouponCode,
    removeAppliedCoupon,
    simulateOrderProgression,
    walletBalance,
    walletTransactions,
    addFundsToWallet,
    tableBookings,
    openTableBookingModal,
    getRiderTelemetry,
  } = useApp();

  // Active view tab in customer experience
  const [activeTab, setActiveTab] = useState<'menu' | 'dining' | 'orders' | 'tiffin' | 'profile' | 'wallet'>('menu');
  const [inlineMapOpen, setInlineMapOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [vegOnly, setVegOnly] = useState(true);
  const [fastDeliveryOnly, setFastDeliveryOnly] = useState(false);
  const [ratingsOnly, setRatingsOnly] = useState(false);
  const [dealsOnly, setDealsOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'relevance' | 'rating' | 'price_low' | 'price_high'>('relevance');

  // Active bookings count for badge
  const activeTableBookingsCount = tableBookings.filter(b => 
    b.status === 'confirmed' || b.status === 'ready_for_seating' || b.status === 'seated'
  ).length;

  // Listen for open-customer-tab events (e.g. from header profile button)
  useEffect(() => {
    const handleTabChange = (e: any) => {
      if (e.detail && ['menu', 'dining', 'orders', 'tiffin', 'profile', 'wallet'].includes(e.detail)) {
        setActiveTab(e.detail);
      }
    };
    window.addEventListener('open-customer-tab', handleTabChange);
    return () => window.removeEventListener('open-customer-tab', handleTabChange);
  }, []);

  // Coupon state
  const [couponInput, setCouponInput] = useState('');
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [couponSuccessMsg, setCouponSuccessMsg] = useState('');
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);

  // Address & Payment
  const [deliveryAddress, setDeliveryAddress] = useState(
    currentUser?.address || 'Room 108, Shri Giriraj Seva Sadan, Dan Ghati Ashram, Goverdhan'
  );
  const [paymentMethod, setPaymentMethod] = useState<'Bhojj Wallet' | 'UPI' | 'Card' | 'Cash on Delivery'>('Bhojj Wallet');
  const [showWalletShortfallModal, setShowWalletShortfallModal] = useState(false);
  const [isInstantTopUpLoading, setIsInstantTopUpLoading] = useState(false);
  const [placedOrderInfo, setPlacedOrderInfo] = useState<Order | null>(null);
  const [selectedOrderForTracking, setSelectedOrderForTracking] = useState<Order | null>(null);

  // Guest Checkout Auth Modal State
  const [showCheckoutAuthModal, setShowCheckoutAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authEmail, setAuthEmail] = useState('priya@example.com');
  const [authPassword, setAuthPassword] = useState('password123');
  const [authName, setAuthName] = useState('Priya Sharma');
  const [authPhone, setAuthPhone] = useState('+91 98765 43210');
  const [authAddress, setAuthAddress] = useState(deliveryAddress);
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Ratings
  const [ratingOrder, setRatingOrder] = useState<Order | null>(null);
  const [ratingStars, setRatingStars] = useState(5);
  const [ratingComment, setRatingComment] = useState('');

  // Dynamic CMS Hero Slides from AppContext
  const activeSlides = (heroSlides || []).filter(s => s.isActive);
  const foodHeroSlides = activeSlides.length > 0 ? activeSlides : (heroSlides || []);
  const [foodHeroSlide, setFoodHeroSlide] = useState(0);
  const [isSliderHovered, setIsSliderHovered] = useState(false);

  // Safe slide index
  const currentSlideIndex = foodHeroSlide < foodHeroSlides.length ? foodHeroSlide : 0;

  // Auto-play food slider every 5.5s (pauses on hover)
  useEffect(() => {
    if (isSliderHovered || foodHeroSlides.length <= 1) return;
    const timer = setInterval(() => {
      setFoodHeroSlide(prev => (prev + 1) % foodHeroSlides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [isSliderHovered, foodHeroSlides.length]);

  // Handler to add featured food slide item directly to cart
  const handleFoodSlideAddToCart = (slide: typeof foodHeroSlides[0]) => {
    const found = menuItems.find(m => m.id === slide.menuId);
    if (found) {
      addToCart(found, 1);
    } else {
      const fallbackItem: MenuItem = {
        id: slide.menuId,
        restaurantId: 'rest-1',
        name: slide.title,
        description: slide.subtitle,
        price: slide.price,
        category: slide.category,
        image: slide.image,
        isVeg: true,
        inStock: true,
        rating: slide.rating,
        reviewsCount: 150,
        prepTimeMinutes: 20,
      };
      addToCart(fallbackItem, 1);
    }
    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#ea580c', '#f59e0b', '#16a34a']
    });
  };

  // Listen to custom navigation events from Header
  useEffect(() => {
    const handleTabChange = (e: any) => {
      if (e.detail) setActiveTab(e.detail);
    };
    const handleCategoryChange = (e: any) => {
      if (e.detail) {
        setSelectedCategory(e.detail);
        setActiveTab('menu');
        const el = document.getElementById('menu-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    };
    window.addEventListener('open-customer-tab', handleTabChange);
    window.addEventListener('filter-category', handleCategoryChange);
    return () => {
      window.removeEventListener('open-customer-tab', handleTabChange);
      window.removeEventListener('filter-category', handleCategoryChange);
    };
  }, []);

  // Steal Deals Data matching screenshot
  const stealDeals = [
    {
      id: 'deal-1',
      menuId: 'satvik-1',
      title: 'Shri Radharani Desi Ghee Samosa (2 pcs)',
      discountBadge: '33% OFF',
      tagBadge: 'Bestseller Deal',
      prepTime: '25-30 min',
      rating: 4.9,
      reviewsCount: 312,
      description: 'Crisp golden crust fried in pure cow ghee, spiced potato & cashew stuffing. Pure Satvik (No Onion, No Garlic).',
      price: 60,
      mrp: 90,
      savings: 30,
      image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=80',
      category: 'Snacks' as MenuItem['category'],
      isVeg: true,
    },
    {
      id: 'deal-2',
      menuId: 'satvik-2',
      title: 'Bhojj Special Satvik Daily Thali',
      discountBadge: 'FLAT ₹50 OFF',
      tagBadge: 'Top Pick Today',
      prepTime: '30-35 min',
      rating: 4.9,
      reviewsCount: 480,
      description: '4 Desi Ghee Phulkas, Arhar Dal Tadka, Paneer Bhujia, Seasonal Subzi, Basmati Jeera Rice, Sweet Prasad & Salad.',
      price: 150,
      mrp: 200,
      savings: 50,
      image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=500&auto=format&fit=crop&q=80',
      category: 'Daily Thali' as MenuItem['category'],
      isVeg: true,
    },
    {
      id: 'deal-3',
      menuId: 'satvik-3',
      title: 'Goverdhan Mathura Peda (250g)',
      discountBadge: '23% OFF',
      tagBadge: 'Temple Prasad',
      prepTime: '20-25 min',
      rating: 4.9,
      reviewsCount: 295,
      description: 'Sacred Goverdhan-style caramelised mawa pedas rolled in boora and cardamom. 100% pure milk mawa.',
      price: 135,
      mrp: 175,
      savings: 40,
      image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=80',
      category: 'Prasad' as MenuItem['category'],
      isVeg: true,
    },
    {
      id: 'deal-4',
      menuId: 'satvik-4',
      title: 'Parikrama Special Dry Mathri Box (400g)',
      discountBadge: 'SAVE ₹25',
      tagBadge: 'Travel Snack',
      prepTime: '20-25 min',
      rating: 4.8,
      reviewsCount: 160,
      description: 'Hygienic crunchy ajwain mathris, perfect for parikrama pilgrims and ashram storage.',
      price: 110,
      mrp: 135,
      savings: 25,
      image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=500&auto=format&fit=crop&q=80',
      category: 'Snacks' as MenuItem['category'],
      isVeg: true,
    },
  ];

  // Categories list dynamically driven by CMS
  const categoryTiles = (categoriesList || [])
    .filter(c => c.isActive)
    .map(cat => ({
      id: cat.id,
      name: cat.name,
      desc: cat.desc,
      badge: cat.badge,
      icon: cat.id === 'Daily Thali' ? UtensilsCrossed :
            cat.id === 'Daily Meals' ? Soup :
            cat.id === 'Prasad' ? SunMedium :
            cat.id === 'Pooja Orders' ? Award :
            cat.id === 'Bhandara' ? Store : Sparkles,
      count: cat.id === 'All' 
        ? menuItems.length 
        : menuItems.filter(m => m.category === cat.id || m.category?.toLowerCase() === cat.name.toLowerCase()).length
    }));

  // Cart Calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
  const deliveryFee = cartSubtotal > 199 || cartSubtotal === 0 ? 0 : 30;
  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const taxes = Math.round(cartSubtotal * 0.05);
  const grandTotal = Math.max(0, cartSubtotal + deliveryFee + taxes - discountAmount);

  // Coupon copy handler
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCoupon(code);
    setCouponInput(code);
    const res = applyCouponCode(code, cartSubtotal);
    if (res.success) {
      setCouponError('');
      setCouponSuccessMsg(res.message);
    } else {
      setCouponError(res.message);
    }
    setTimeout(() => {
      setCopiedCoupon(null);
      setCouponSuccessMsg('');
    }, 3000);
  };

  const handleApplyCoupon = () => {
    if (!couponInput.trim()) {
      setCouponError('Please enter a coupon code (e.g. BHOJJ50 or RADHA25)');
      return;
    }
    const res = applyCouponCode(couponInput, cartSubtotal);
    if (res.success) {
      setCouponError('');
      setCouponSuccessMsg(res.message);
      setTimeout(() => setCouponSuccessMsg(''), 4000);
    } else {
      setCouponError(res.message);
      setCouponSuccessMsg('');
    }
  };

  // Add deal directly to cart
  const handleAddDealToCart = (deal: typeof stealDeals[0]) => {
    const existing = menuItems.find(m => m.id === deal.menuId);
    if (existing) {
      addToCart(existing, 1);
    } else {
      const fallbackItem: MenuItem = {
        id: deal.menuId,
        restaurantId: 'rest-1',
        name: deal.title,
        description: deal.description,
        price: deal.price,
        category: deal.category,
        isVeg: deal.isVeg,
        image: deal.image,
        rating: deal.rating,
        reviewsCount: deal.reviewsCount,
        inStock: true,
        prepTimeMinutes: 25,
      };
      addToCart(fallbackItem, 1);
    }
  };

  // Filtered Menu Items
  const filteredMenuItems = menuItems.filter((dish) => {
    // Category filter
    if (selectedCategory !== 'All') {
      if (selectedCategory === 'Daily Thali' && (dish.category === 'Daily Thali' || dish.category === 'Thali')) return true;
      if (selectedCategory === 'Daily Meals' && (dish.category === 'Daily Meals' || dish.category === 'Curry & Sabzi')) return true;
      if (selectedCategory === 'Prasad' && (dish.category === 'Prasad' || dish.category === 'Desserts & Drinks')) return true;
      if (dish.category !== selectedCategory) return false;
    }
    if (vegOnly && !dish.isVeg) return false;

    // Location Filter
    if (selectedLocationFilter !== 'All') {
      const rest = restaurants.find(r => r.id === dish.restaurantId);
      if (rest?.locationZone && !rest.locationZone.toLowerCase().includes(selectedLocationFilter.toLowerCase())) {
        return false;
      }
    }

    // Effective search (local or global)
    const effectiveSearch = (searchQuery || globalSearchQuery).trim().toLowerCase();
    if (effectiveSearch) {
      const rest = restaurants.find(r => r.id === dish.restaurantId);
      const matchName = dish.name.toLowerCase().includes(effectiveSearch);
      const matchDesc = dish.description.toLowerCase().includes(effectiveSearch);
      const matchCat = dish.category.toLowerCase().includes(effectiveSearch);
      const matchRest = rest?.name.toLowerCase().includes(effectiveSearch) || false;
      const matchZone = rest?.locationZone?.toLowerCase().includes(effectiveSearch) || false;
      if (!matchName && !matchDesc && !matchCat && !matchRest && !matchZone) return false;
    }

    if (fastDeliveryOnly && dish.prepTimeMinutes > 25) return false;
    if (ratingsOnly && dish.rating < 4.5) return false;
    return true;
  }).sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'price_low') return a.price - b.price;
    if (sortBy === 'price_high') return b.price - a.price;
    return 0;
  });

  // Execute Order Placement once user is authenticated
  const executeOrderPlacement = (confirmedAddress?: string) => {
    if (cart.length === 0) return;
    const finalAddress = confirmedAddress || deliveryAddress;
    const primaryRestId = cart[0].menuItem.restaurantId;
    const restObj = restaurants.find(r => r.id === primaryRestId);

    const newOrder = placeOrder({
      customerId: currentUser?.id || 'user-guest',
      customerName: currentUser?.name || authName || 'Priya Sharma',
      customerPhone: currentUser?.phone || authPhone || '+91 98765 43210',
      deliveryAddress: finalAddress,
      restaurantId: primaryRestId,
      restaurantName: restObj?.name || 'Goverdhan Satvik Rasoi',
      items: cart.map(ci => ({
        id: ci.menuItem.id,
        name: ci.menuItem.name,
        price: ci.menuItem.price,
        quantity: ci.quantity,
        isVeg: ci.menuItem.isVeg,
      })),
      subtotal: cartSubtotal,
      deliveryFee,
      tax: taxes,
      discount: discountAmount,
      totalAmount: grandTotal,
      status: 'placed',
      orderTime: 'Just now',
      estimatedDeliveryTime: 'In 25-30 mins',
      paymentMethod,
      paymentStatus: 'Paid',
    });

    clearCart();
    setIsCartOpen(false);
    setShowCheckoutAuthModal(false);
    setPlacedOrderInfo(newOrder);
    setSelectedOrderForTracking(newOrder);
    setActiveTab('orders');

    try {
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#ea580c', '#10b981', '#f59e0b', '#3b82f6'],
      });
    } catch (e) { /* ignore */ }
  };

  // Triggered when user clicks Proceed to Checkout in the Cart Drawer
  const handlePlaceOrderSubmit = () => {
    if (cart.length === 0) return;

    // Check if paying with Bhojj Wallet and balance is insufficient
    if (paymentMethod === 'Bhojj Wallet' && walletBalance < grandTotal) {
      setShowWalletShortfallModal(true);
      return;
    }

    // Requirement: Guest user must login or register at checkout before booking
    if (!currentUser || currentUser.role !== 'customer') {
      setShowCheckoutAuthModal(true);
      return;
    }

    executeOrderPlacement();
  };

  // Instant top-up required shortfall & place order
  const handleTopUpShortfallAndPlaceOrder = () => {
    const shortfall = Math.max(10, grandTotal - walletBalance);
    setIsInstantTopUpLoading(true);

    setTimeout(() => {
      addFundsToWallet(shortfall, 'Instant Checkout UPI Auto-load');
      setIsInstantTopUpLoading(false);
      setShowWalletShortfallModal(false);

      if (!currentUser || currentUser.role !== 'customer') {
        setShowCheckoutAuthModal(true);
      } else {
        executeOrderPlacement();
      }
    }, 700);
  };

  // 1-Click fast checkout
  const handleInstantDemoLoginAndPlaceOrder = async () => {
    setAuthLoading(true);
    await login('priya@example.com', 'customer', 'password123');
    setTimeout(() => {
      setAuthLoading(false);
      executeOrderPlacement();
    }, 300);
  };

  // Standard checkout auth submit
  const handleAuthSubmitAndPlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    if (authMode === 'login') {
      const res = await login(authEmail, 'customer', authPassword);
      if (res && res.success) {
        setTimeout(() => {
          setAuthLoading(false);
          executeOrderPlacement();
        }, 300);
      } else {
        setAuthLoading(false);
        setAuthError(res?.message || 'Invalid credentials. Use demo: priya@example.com / password123 or 1-Click Fast Login.');
      }
    } else {
      if (!authName.trim() || !authEmail.trim() || !authPassword.trim()) {
        setAuthLoading(false);
        setAuthError('Please fill in Name, Email/Phone, and Password.');
        return;
      }
      register({
        name: authName,
        email: authEmail,
        role: 'customer',
        phone: authPhone,
        address: authAddress || deliveryAddress,
        password: authPassword,
      }, 'customer');
      setTimeout(() => {
        setAuthLoading(false);
        executeOrderPlacement(authAddress || deliveryAddress);
      }, 300);
    }
  };

  const myOrders = currentUser
    ? orders.filter(o => o.customerId === currentUser.id || o.customerName === currentUser.name)
    : orders.filter(o => o.customerId === 'user-cust-1' || o.id === 'ORD-7821' || o.id === 'ORD-7820' || o.customerId === 'user-guest');

  // Currently tracked order (synced with latest state from orders in AppContext)
  const activeTrackedOrder = selectedOrderForTracking 
    ? (orders.find(o => o.id === selectedOrderForTracking.id) || selectedOrderForTracking)
    : null;

  // Active ongoing order to show in persistent banner
  const activeOrder = myOrders.find(o => o.status !== 'delivered' && o.status !== 'cancelled') || orders.find(o => o.status === 'out_for_delivery' || o.status === 'preparing');

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'placed':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">Order Placed</span>;
      case 'accepted':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">Kitchen Accepted</span>;
      case 'preparing':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800">Cooking in Ghee</span>;
      case 'ready_for_pickup':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800">Packed & Ready</span>;
      case 'out_for_delivery':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800 animate-pulse">Out for Delivery</span>;
      case 'delivered':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">Delivered</span>;
      case 'cancelled':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800">Cancelled</span>;
    }
  };

  // Check if Customer Portal is temporarily disabled by Super Admin
  if (portalConfig && !portalConfig.customerPortalEnabled && currentUser?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 text-center shadow-xl space-y-4">
          <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl mx-auto flex items-center justify-center font-bold text-2xl">
            🪔
          </div>
          <h2 className="text-xl font-black text-slate-900">Customer Portal Temporarily Paused</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Ashram Rasois and Bhojj ordering services are undergoing scheduled cleaning and platform maintenance. Ordering will resume shortly.
          </p>
          <div className="p-3 bg-amber-50 rounded-xl text-amber-800 text-xs font-bold">
            Radhe Radhe! For temple seva inquiries, please visit Shri Giriraj Ashram.
          </div>
          <div className="pt-2">
            <button
              onClick={() => setCurrentView('admin')}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs cursor-pointer shadow-xs"
            >
              Access Admin Panel (Super Admin)
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/60 pb-24">
      
      {/* Super Admin Notice if Customer Portal is Disabled for Public */}
      {portalConfig && !portalConfig.customerPortalEnabled && currentUser?.role === 'admin' && (
        <div className="bg-amber-500 text-slate-950 px-4 py-2 text-xs font-bold text-center flex items-center justify-center gap-2 border-b border-amber-600">
          <span>⚠️ <strong>Super Admin Mode:</strong> Customer Portal is currently disabled for regular users in Master Portal Control.</span>
          <button 
            onClick={() => setCurrentView('admin')}
            className="underline font-black hover:text-white"
          >
            Open Portal Control
          </button>
        </div>
      )}
      
      {/* ================= SUB-NAVIGATION BAR (Sticky under Header for quick jumping) ================= */}
      <div className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-14 sm:top-18 z-30 transition-all shadow-2xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3">
          
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
            {/* Primary Experience Mode Switcher */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200/80 shrink-0">
              <button
                onClick={() => setActiveTab('menu')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'menu'
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <UtensilsCrossed className="w-3.5 h-3.5" />
                <span>Food Menu</span>
              </button>

              <button
                id="customer-dining-tab-btn"
                onClick={() => setActiveTab('dining')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'dining'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Utensils className="w-3.5 h-3.5" />
                <span>Book a Table (Dining)</span>
                {activeTableBookingsCount > 0 ? (
                  <span className={`text-[9px] font-black px-1.5 py-0.2 rounded-full ${
                    activeTab === 'dining' ? 'bg-white text-red-700' : 'bg-red-100 text-red-800'
                  }`}>
                    {activeTableBookingsCount}
                  </span>
                ) : (
                  <span className="text-[9px] font-black px-1.5 py-0.2 rounded-full bg-amber-200/80 text-amber-950">
                    25% Off
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'orders'
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Bike className="w-3.5 h-3.5" />
                <span>Orders</span>
                {myOrders.length > 0 && (
                  <span className={`text-[9px] font-black px-1.5 py-0.2 rounded-full ${
                    activeTab === 'orders' ? 'bg-white text-orange-700' : 'bg-orange-100 text-orange-800'
                  }`}>
                    {myOrders.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('profile')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'profile'
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Profile & Addresses</span>
              </button>

              <button
                onClick={() => setActiveTab('wallet')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'wallet'
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Wallet className="w-3.5 h-3.5 text-amber-500" />
                <span>Bhojj Wallet</span>
                <span className={`text-[10px] font-black px-1.5 py-0.2 rounded-full ${
                  activeTab === 'wallet' ? 'bg-white text-orange-700' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  ₹{walletBalance.toLocaleString('en-IN')}
                </span>
              </button>
            </div>

            <div className="h-5 w-px bg-slate-200 shrink-0 hidden sm:block"></div>

            {/* Category Quick Pills */}
            <div className="flex items-center gap-1.5 shrink-0">
              {categoryTiles.map((cat) => {
                const isSelected = selectedCategory === cat.id && activeTab === 'menu';
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setActiveTab('menu');
                      const el = document.getElementById('menu-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                      isSelected 
                        ? 'bg-slate-900 text-white shadow-xs' 
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200/70'
                    }`}
                  >
                    <span>{cat.name}</span>
                    {cat.badge && (
                      <span className={`text-[9px] px-1.5 py-0.2 rounded font-black ${
                        isSelected ? 'bg-orange-500 text-white' : 'bg-orange-100 text-orange-800'
                      }`}>
                        {cat.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Right Action: Pure Veg Indicator & Cart Trigger */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
              <span>100% Satvik Shuddh</span>
            </span>

            {cart.length > 0 && (
              <button
                onClick={() => setIsCartOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-600 hover:bg-orange-700 text-white text-xs font-black shadow-xs transition-transform active:scale-95"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>₹{grandTotal}</span>
                <span className="w-4 h-4 rounded-full bg-white text-orange-600 flex items-center justify-center text-[10px] font-black">
                  {cart.reduce((s, i) => s + i.quantity, 0)}
                </span>
              </button>
            )}
          </div>

        </div>
      </div>

      {/* ================= ACTIVE LIVE ORDER TRACKING BANNER ================= */}
      {activeOrder && (
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-4">
          <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 rounded-3xl p-4 sm:p-5 text-white shadow-xl shadow-orange-600/20 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-orange-400/40 relative overflow-hidden">
            
            {/* Ambient Background glow */}
            <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

            <div className="relative z-10 space-y-1.5 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-black uppercase tracking-wider backdrop-blur-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  <span>Live Order in Progress</span>
                </span>
                <span className="text-xs font-mono font-black text-amber-200">
                  #{activeOrder.id}
                </span>
                <span className="text-xs text-white/80">•</span>
                <span className="text-xs font-bold text-white/90">
                  {activeOrder.restaurantName}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <h3 className="text-base sm:text-lg font-black tracking-tight leading-tight">
                  {activeOrder.status === 'placed' && 'Kitchen confirmed your order! Preparing soon.'}
                  {activeOrder.status === 'preparing' && 'Cooking fresh in Pure Desi Cow Ghee...'}
                  {activeOrder.status === 'ready_for_pickup' && 'Packed & ready for fleet partner pickup!'}
                  {activeOrder.status === 'out_for_delivery' && 'Your food is out for delivery! Rider on the way.'}
                  {activeOrder.status === 'delivered' && 'Order Delivered! Hare Krishna 🙏'}
                </h3>

                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-200 bg-black/20 px-2.5 py-1 rounded-xl w-fit">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{activeOrder.estimatedDeliveryTime || 'In 15 mins'}</span>
                </div>
              </div>

              {/* Visual Step Tracker Mini Summary */}
              <div className="pt-2 flex items-center gap-2 text-[11px] font-extrabold text-white/90 overflow-x-auto scrollbar-none">
                <span className={`px-2 py-0.5 rounded-md ${activeOrder.status === 'placed' || activeOrder.status === 'accepted' ? 'bg-white text-orange-700 shadow-xs' : 'bg-white/20 text-white'}`}>
                  1. Placed
                </span>
                <span>➔</span>
                <span className={`px-2 py-0.5 rounded-md ${activeOrder.status === 'preparing' || activeOrder.status === 'ready_for_pickup' ? 'bg-white text-orange-700 shadow-xs' : 'bg-white/20 text-white'}`}>
                  2. Preparing
                </span>
                <span>➔</span>
                <span className={`px-2 py-0.5 rounded-md ${activeOrder.status === 'out_for_delivery' ? 'bg-white text-orange-700 shadow-xs' : 'bg-white/20 text-white'}`}>
                  3. Out for Delivery
                </span>
                <span>➔</span>
                <span className={`px-2 py-0.5 rounded-md ${activeOrder.status === 'delivered' ? 'bg-white text-orange-700 shadow-xs' : 'bg-white/20 text-white/70'}`}>
                  4. Delivered
                </span>
              </div>
            </div>

            {/* Right Action: OTP PIN & Track Details Button */}
            <div className="relative z-10 flex items-center gap-2.5 shrink-0 self-start md:self-center flex-wrap">
              <div className="bg-white/15 backdrop-blur-xs rounded-2xl px-3 py-2 border border-white/20 text-center">
                <div className="text-[9px] font-black uppercase tracking-wider text-amber-200">Rider OTP</div>
                <div className="font-mono font-black text-lg leading-tight text-white">{activeOrder.otp}</div>
              </div>

              <button
                id="banner-toggle-map-btn"
                onClick={() => setInlineMapOpen(!inlineMapOpen)}
                className="px-3.5 py-2.5 rounded-2xl bg-black/25 hover:bg-black/40 text-white font-black text-xs border border-white/25 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <MapPin className="w-3.5 h-3.5 text-amber-300" />
                <span>{inlineMapOpen ? 'Hide Map' : 'Live Map'}</span>
              </button>

              <button
                id="banner-track-live-order-btn"
                onClick={() => setSelectedOrderForTracking(activeOrder)}
                className="px-4 py-2.5 rounded-2xl bg-white text-orange-700 hover:bg-amber-50 font-black text-xs shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center gap-1.5 cursor-pointer"
              >
                <span>Full Tracker</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* INLINE EXPANDED REAL-TIME MAP */}
            {inlineMapOpen && (
              <div className="w-full pt-4 border-t border-white/20 relative z-10 animate-in fade-in duration-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-amber-100 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    <span>Live GPS Telemetry Feed (Goverdhan Corridor)</span>
                  </span>
                  <button
                    onClick={() => setSelectedOrderForTracking(activeOrder)}
                    className="text-[11px] text-white hover:underline font-bold"
                  >
                    Open Expanded View ↗
                  </button>
                </div>
                <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/20">
                  <LiveDeliveryMap 
                    order={activeOrder} 
                    telemetry={getRiderTelemetry(activeOrder.id)} 
                    height="h-64 sm:h-80" 
                  />
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ================= ZOMATO DINING OUT & TABLE RESERVATIONS VIEW ================= */}
      {activeTab === 'dining' ? (
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6">
          <ZomatoDiningSection />
        </div>
      ) : (
        <>
          {/* ================= NEW PROFESSIONAL FOOD PRODUCTS HERO SECTION WITH SLIDER ================= */}
      <div 
        className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-5"
        onMouseEnter={() => setIsSliderHovered(true)}
        onMouseLeave={() => setIsSliderHovered(false)}
      >
        <div className="rounded-3xl bg-gradient-to-br from-amber-950/95 via-slate-950 to-orange-950/95 text-white p-6 sm:p-9 lg:p-11 shadow-2xl border border-amber-500/25 relative overflow-hidden">
          
          {/* Ambient Culinary Saffron & Golden Light Flares */}
          <div className="absolute top-0 right-1/3 w-[500px] h-[500px] bg-orange-600/15 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-10 -left-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute top-1/2 right-4 w-72 h-72 bg-amber-600/10 rounded-full blur-3xl pointer-events-none"></div>

          {/* Background Decorative Pattern Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none"></div>

          {/* Main Slide Grid */}
          {(() => {
            const currentSlide = foodHeroSlides[currentSlideIndex] || foodHeroSlides[0];
            if (!currentSlide) return null;
            return (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
                
                {/* Left Column: Food Details, Ingredients, Pricing & Ordering Actions */}
                <div className="lg:col-span-7 space-y-4">
                  
                  {/* Badge & Fresh Batch Live Indicator */}
                  <div className="flex flex-wrap items-center gap-2.5">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-orange-500/25 via-amber-500/25 to-orange-500/25 border border-amber-400/40 text-amber-300 text-xs font-black uppercase tracking-wider shadow-xs backdrop-blur-xs">
                      <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                      <span>{currentSlide.badge}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => openCategoryDetails(currentSlide.category)}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-orange-950/80 text-orange-300 border border-orange-700/80 hover:bg-orange-900 transition-colors"
                    >
                      <span>Category: {currentSlide.category} ↗</span>
                    </button>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-800/80">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span>{currentSlide.timer}</span>
                    </span>
                  </div>

                  {/* Food Title & Subtitle */}
                  <div className="space-y-1.5">
                    <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-[1.12]">
                      {currentSlide.title}
                    </h1>
                    <p className="text-xs sm:text-sm font-bold text-amber-300 line-clamp-1 sm:line-clamp-none">
                      {currentSlide.subtitle}
                    </p>
                    <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed font-normal pt-1">
                      {currentSlide.description}
                    </p>
                  </div>

                  {/* Feature Pills */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {(currentSlide.pills || []).map((pill, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/10 text-slate-200 border border-white/10 backdrop-blur-xs"
                      >
                        <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>{pill}</span>
                      </span>
                    ))}
                  </div>

                  {/* Pricing & Savings Block */}
                  <div className="flex flex-wrap items-baseline gap-3 pt-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl sm:text-3xl font-black text-white">
                        ₹{currentSlide.price}
                      </span>
                      <span className="text-sm text-slate-400 line-through">
                        ₹{currentSlide.mrp}
                      </span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Save ₹{currentSlide.savings} ({Math.round((currentSlide.savings / (currentSlide.mrp || 1)) * 100)}% OFF)
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>{currentSlide.prepTime}</span>
                    </span>
                  </div>

                  {/* Primary Call-to-Actions (Add to Cart / Order & Coupon) */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    {/* 1. Direct Order / Add to Cart */}
                    <button
                      id="hero-food-add-cart-btn"
                      onClick={() => handleFoodSlideAddToCart(currentSlide)}
                      className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 hover:from-orange-500 hover:to-amber-500 text-white text-xs sm:text-sm font-black shadow-xl shadow-orange-600/30 border border-amber-300/40 transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center gap-2 group cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      <span>{currentSlide.cta} (₹{currentSlide.price})</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </button>

                    {/* 2. Open Product Details Modal */}
                    <button
                      onClick={() => openProductDetails(currentSlide.menuId)}
                      className="px-4 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <span>View Dish Details ↗</span>
                    </button>

                    {/* 3. Explore Full Menu / Details */}
                    <button
                      onClick={() => {
                        setSelectedCategory(currentSlide.category);
                        setActiveTab('menu');
                        const el = document.getElementById('menu-section');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="px-3.5 py-3.5 rounded-2xl bg-white/5 hover:bg-white/15 border border-white/10 text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
                    >
                      Menu List ↓
                    </button>

                    {/* 4. Instant Coupon Copy */}
                    <button
                      onClick={() => handleCopyCode(currentSlide.code)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 text-xs font-bold text-amber-300 transition-colors cursor-pointer"
                    >
                      <Tag className="w-3.5 h-3.5 text-amber-400" />
                      <span>{copiedCoupon === currentSlide.code ? 'APPLIED!' : currentSlide.couponText}</span>
                    </button>
                  </div>

                </div>

                {/* Right Column: High-Impact Food Showcase Image & Interactive Slider Controls */}
                <div className="lg:col-span-5 relative">
                  <div 
                    onClick={() => openProductDetails(currentSlide.menuId)}
                    className="relative rounded-3xl overflow-hidden aspect-4/3 sm:aspect-16/11 shadow-2xl border-2 border-amber-500/30 group cursor-pointer"
                    title="Click to view full dish details"
                  >
                    <img
                      src={currentSlide.image}
                      alt={currentSlide.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent"></div>

                    {/* Hover prompt */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/35 backdrop-blur-2xs">
                      <span className="px-4 py-2 rounded-2xl bg-orange-600 text-white text-xs font-black shadow-xl flex items-center gap-1.5">
                        <span>View Dish Details</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>

                    {/* Floating Review Pill */}
                    <div className="absolute top-3.5 right-3.5 bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 border border-white/20 shadow-md">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span>{currentSlide.rating} ({currentSlide.reviewsCount})</span>
                    </div>

                    {/* Floating Discount Tag */}
                    <div className="absolute top-3.5 left-3.5 bg-red-600 text-white text-[11px] font-black px-2.5 py-1 rounded-lg shadow-lg border border-red-400/40">
                      {Math.round((currentSlide.savings / (currentSlide.mrp || 1)) * 100)}% DISCOUNT
                    </div>

                    {/* Bottom Overlay: Purity Tag & Carousel Controls */}
                    <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between text-xs text-white">
                      <span className="font-extrabold bg-slate-950/85 px-3 py-1.5 rounded-xl backdrop-blur-xs border border-white/15 flex items-center gap-1.5 text-[11px]">
                        <span>🕉️</span>
                        <span>100% Satvik & Mandir Blessed</span>
                      </span>

                      {/* Slider Arrows & Indicators */}
                      <div className="flex items-center gap-1.5 bg-slate-950/85 p-1 rounded-xl backdrop-blur-xs border border-white/15">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setFoodHeroSlide((currentSlideIndex - 1 + foodHeroSlides.length) % foodHeroSlides.length);
                          }}
                          className="p-1.5 rounded-lg hover:bg-white/20 text-white transition-colors cursor-pointer"
                          title="Previous Slide"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        
                        {foodHeroSlides.map((_, i) => (
                          <button
                            key={i}
                            onClick={(e) => {
                              e.stopPropagation();
                              setFoodHeroSlide(i);
                            }}
                            className={`h-2 rounded-full transition-all cursor-pointer ${
                              currentSlideIndex === i ? 'w-5 bg-orange-500' : 'w-2 bg-white/40 hover:bg-white/70'
                            }`}
                            title={`Slide ${i + 1}`}
                          />
                        ))}

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setFoodHeroSlide((currentSlideIndex + 1) % foodHeroSlides.length);
                          }}
                          className="p-1.5 rounded-lg hover:bg-white/20 text-white transition-colors cursor-pointer"
                          title="Next Slide"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            );
          })()}

          {/* QUICK-SELECT DISH PILLS UNDER HERO SLIDER */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="text-[11px] font-black uppercase text-amber-400 tracking-wider flex items-center gap-1 mr-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Quick Select:</span>
            </span>
            {foodHeroSlides.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => setFoodHeroSlide(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  foodHeroSlide === idx
                    ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30 border border-orange-400/50 scale-102'
                    : 'bg-white/5 hover:bg-white/15 text-slate-300 border border-white/10'
                }`}
              >
                <span>{slide.chipLabel}</span>
                <span className={`text-[10px] ${foodHeroSlide === idx ? 'text-amber-200' : 'text-slate-400'}`}>
                  ₹{slide.price}
                </span>
              </button>
            ))}
          </div>

          {/* CULINARY PURITY & TRUST STRIP */}
          <div className="mt-5 pt-4 border-t border-slate-800/60 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-orange-500/15 text-orange-400 flex items-center justify-center shrink-0">
                <UtensilsCrossed className="w-4 h-4" />
              </div>
              <span className="text-slate-300 font-semibold">Cooked Fresh to Order</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
                <Leaf className="w-4 h-4" />
              </div>
              <span className="text-slate-300 font-semibold">Zero Onion, Zero Garlic</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-slate-300 font-semibold">100% Desi Cow Ghee</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-sky-500/15 text-sky-400 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <span className="text-slate-300 font-semibold">25-Min Hot Ashram Drop</span>
            </div>
          </div>

        </div>
      </div>

      {/* ================= OFFERS & COUPONS STRIP ================= */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 mt-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-orange-100 text-orange-800 border border-orange-200">
              % OFFERS & COUPONS
            </span>
            <span className="text-xs text-slate-500 font-medium">Tap any card to copy & auto-apply coupon</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          
          {/* Coupon 1: BHOJJ50 */}
          <div 
            onClick={() => handleCopyCode('BHOJJ50')}
            className="p-4 rounded-2xl bg-white border border-dashed border-orange-300 hover:border-orange-500 hover:shadow-md cursor-pointer transition-all flex items-center justify-between group relative overflow-hidden"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded border border-orange-200">
                  BHOJJ50
                </span>
                <span className="text-xs font-black text-slate-900">FLAT 50% OFF</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Up to ₹120 discount on min. order ₹149
              </p>
            </div>
            <div className="text-[11px] font-extrabold text-orange-600 group-hover:underline shrink-0 pl-2">
              {copiedCoupon === 'BHOJJ50' ? 'APPLIED ✓' : 'TAP TO COPY'}
            </div>
          </div>

          {/* Coupon 2: TIFFIN20 */}
          <div 
            onClick={() => handleCopyCode('TIFFIN20')}
            className="p-4 rounded-2xl bg-white border border-dashed border-emerald-300 hover:border-emerald-500 hover:shadow-md cursor-pointer transition-all flex items-center justify-between group relative overflow-hidden"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                  TIFFIN20
                </span>
                <span className="text-xs font-black text-slate-900">FLAT 20% OFF</span>
              </div>
              <p className="text-[11px] text-slate-500">
                On all Daily Thalis & Homestyle Meals
              </p>
            </div>
            <div className="text-[11px] font-extrabold text-emerald-700 group-hover:underline shrink-0 pl-2">
              {copiedCoupon === 'TIFFIN20' ? 'APPLIED ✓' : 'TAP TO COPY'}
            </div>
          </div>

          {/* Coupon 3: FREEDEL */}
          <div 
            onClick={() => handleCopyCode('FREEDEL')}
            className="p-4 rounded-2xl bg-white border border-dashed border-sky-300 hover:border-sky-500 hover:shadow-md cursor-pointer transition-all flex items-center justify-between group relative overflow-hidden"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded border border-sky-200">
                  FREEDEL
                </span>
                <span className="text-xs font-black text-slate-900">FREE DELIVERY</span>
              </div>
              <p className="text-[11px] text-slate-500">
                On Goverdhan orders above ₹199
              </p>
            </div>
            <div className="text-[11px] font-extrabold text-sky-700 group-hover:underline shrink-0 pl-2">
              {copiedCoupon === 'FREEDEL' ? 'APPLIED ✓' : 'TAP TO COPY'}
            </div>
          </div>

        </div>
      </div>

      {/* ================= EXPLORE CATEGORIES ================= */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 mt-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Explore Categories
              </h2>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                SATVIK KITCHEN
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Daily thalis, tiffins, temple prasad, pooja orders & sacred Goverdhan catering
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setActiveTab('menu');
              const el = document.getElementById('menu-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="text-xs sm:text-sm font-bold text-orange-600 hover:text-orange-700 hover:underline flex items-center gap-1 cursor-pointer shrink-0"
          >
            <span>View all</span>
            <span>→</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {categoryTiles.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;

            return (
              <div
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  openCategoryDetails(cat.id);
                }}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between group relative overflow-hidden transform hover:-translate-y-1 ${
                  isSelected 
                    ? 'bg-gradient-to-b from-orange-500 to-amber-600 text-white border-orange-500 shadow-lg shadow-orange-500/20' 
                    : 'bg-white hover:bg-orange-50/50 border-slate-200/90 hover:border-orange-300 text-slate-800 shadow-2xs'
                }`}
                title={`Click to view ${cat.name} details & kitchens`}
              >
                {cat.badge && (
                  <span className={`absolute top-2.5 right-2.5 text-[8px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded ${
                    isSelected ? 'bg-white text-orange-700' : 'bg-orange-100 text-orange-800'
                  }`}>
                    {cat.badge}
                  </span>
                )}

                <div>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold mb-3 transition-transform group-hover:scale-110 ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-orange-100/80 text-orange-600'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-sm leading-tight">{cat.name}</h3>
                  <p className={`text-[11px] mt-1 line-clamp-2 ${isSelected ? 'text-white/80' : 'text-slate-500'}`}>
                    {cat.desc}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between text-[11px] font-bold pt-2 border-t border-slate-100/50">
                  <span className={isSelected ? 'text-white' : 'text-slate-400'}>{cat.count} items</span>
                  <span className="text-orange-600 group-hover:translate-x-0.5 transition-transform">View ↗</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= TODAY'S STEAL DEALS & SALES ================= */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 mt-12">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🔥</span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Today's Steal Deals & Sales
              </h2>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-red-100 text-red-800 border border-red-200">
                UP TO 40% OFF
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Handpicked Satvik specialties with instant discounted pricing and one-tap order
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stealDeals.map((deal) => {
            const inCart = cart.find(ci => ci.menuItem.id === deal.menuId);

            return (
              <div
                key={deal.id}
                onClick={() => openProductDetails(deal.menuId)}
                className="bg-white rounded-2xl border border-slate-200/90 hover:border-orange-400 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  {/* Deal Image with Discount Tag */}
                  <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                    <img
                      src={deal.image}
                      alt={deal.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                      <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-xs">
                        {deal.discountBadge}
                      </span>
                      <span className="bg-white/95 text-slate-900 text-[9px] font-extrabold px-1.5 py-0.5 rounded-md shadow-xs">
                        {deal.tagBadge}
                      </span>
                    </div>

                    {/* View Details Hover Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/35 backdrop-blur-2xs">
                      <span className="px-3 py-1.5 rounded-xl bg-orange-600 text-white text-xs font-black shadow-lg">
                        View Dish Details ↗
                      </span>
                    </div>

                    <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] font-bold">
                      <span className="bg-slate-950/80 backdrop-blur-xs text-white px-2 py-0.5 rounded-md flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-400" />
                        <span>{deal.prepTime}</span>
                      </span>
                      <span className="bg-white/95 text-slate-900 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                        <span>{deal.rating}</span>
                      </span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="p-4">
                    <h3 className="font-extrabold text-sm sm:text-base text-slate-900 leading-snug group-hover:text-orange-600 transition-colors">
                      {deal.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                      {deal.description}
                    </p>
                  </div>
                </div>

                {/* Pricing & Add to Cart */}
                <div 
                  onClick={(e) => e.stopPropagation()}
                  className="p-4 pt-0 border-t border-slate-100 flex items-center justify-between mt-2"
                >
                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-lg font-black text-slate-900">₹{deal.price}</span>
                      <span className="text-xs text-slate-400 line-through">₹{deal.mrp}</span>
                    </div>
                    <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                      Save ₹{deal.savings}
                    </span>
                  </div>

                  {inCart ? (
                    <div className="flex items-center gap-2 bg-orange-50 border border-orange-300 rounded-xl p-1">
                      <button
                        onClick={() => updateCartQuantity(deal.menuId, -1)}
                        className="w-7 h-7 rounded-lg bg-white text-slate-800 flex items-center justify-center font-bold hover:bg-slate-100"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-black text-xs text-orange-900 min-w-4 text-center">
                        {inCart.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(deal.menuId, 1)}
                        className="w-7 h-7 rounded-lg bg-orange-600 text-white flex items-center justify-center font-bold hover:bg-orange-700"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleAddDealToCart(deal)}
                      className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-xs transition-transform active:scale-95 flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>ADD</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= VISION & SACRED TRADITION BANNER ================= */}
      <div id="vision-section" className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 mt-12">
        <div className="rounded-3xl bg-gradient-to-r from-amber-50 via-orange-50 to-amber-100/60 border border-amber-200/90 p-6 sm:p-8 relative overflow-hidden shadow-xs">
          <div className="max-w-3xl space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-600"></span>
              <h3 className="font-black text-slate-900 text-lg sm:text-xl tracking-tight">
                Bhojj: Our Sacred Mandir Tradition & Vision
              </h3>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-orange-200 text-orange-900 font-mono">
                GOVERDHAN, UP
              </span>
            </div>

            <p className="text-sm font-semibold text-slate-800 italic leading-relaxed">
              "To become Goverdhan's most trusted name for pure Satvik food, bringing mandir-style purity and taste to every home and every Bhandara."
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <span>🌱</span>
                <span>100% No Onion, No Garlic</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <span>🍯</span>
                <span>Shri Radharani Inspired</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <span>🛵</span>
                <span>Dedicated Delivery Service</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <span>⏱</span>
                <span>25-35 Min Hot Delivery</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  const el = document.getElementById('menu-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-xs font-black text-orange-700 hover:text-orange-800 underline flex items-center gap-1"
              >
                <span>Full Story & Mandir Policies</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= LOCATION-WISE RESTAURANTS & THEIR FOOD SECTION ================= */}
      <LocationRestaurantsSection />

      {/* ================= FILTER BAR & CURATED MENU ================= */}
      <div id="menu-section" className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 mt-12">
        
        {/* Filter Strip */}
        <div className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-3">
          
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setVegOnly(!vegOnly)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 ${
                vegOnly ? 'bg-emerald-50 border-emerald-400 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              <span className={`w-2.5 h-2.5 rounded-full ${vegOnly ? 'bg-emerald-600' : 'bg-slate-400'}`}></span>
              <span>Pure Veg</span>
              {vegOnly && <Check className="w-3 h-3 text-emerald-600" />}
            </button>

            <button
              onClick={() => setRatingsOnly(!ratingsOnly)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 ${
                ratingsOnly ? 'bg-amber-50 border-amber-400 text-amber-900' : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
              <span>Ratings 4.5+</span>
            </button>

            <button
              onClick={() => setFastDeliveryOnly(!fastDeliveryOnly)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 ${
                fastDeliveryOnly ? 'bg-blue-50 border-blue-400 text-blue-800' : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              <Bike className="w-3 h-3 text-blue-600" />
              <span>Fast Delivery (&lt; 25m)</span>
            </button>

            <button
              onClick={() => setDealsOnly(!dealsOnly)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 ${
                dealsOnly ? 'bg-orange-50 border-orange-400 text-orange-800' : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              <Flame className="w-3 h-3 text-orange-600" />
              <span>Great Offers</span>
            </button>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500 font-semibold ml-auto">
            <span>{restaurants.length} kitchens near you</span>
            <span className="text-slate-300">•</span>
            <div className="flex items-center gap-1">
              <span>Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="border-none bg-transparent font-bold text-slate-800 focus:outline-hidden cursor-pointer"
              >
                <option value="relevance">Relevance</option>
                <option value="rating">Top Rated</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
              </select>
            </div>
          </div>

        </div>

        {/* Menu Items Grid */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-extrabold text-slate-900 text-base">
              {selectedCategory === 'All' ? 'All Satvik Delicacies' : `${selectedCategory} Specialties`} ({filteredMenuItems.length})
            </h3>
            {cart.length > 0 && (
              <button
                onClick={() => setIsCartOpen(true)}
                className="text-xs font-bold text-orange-600 hover:text-orange-700 underline flex items-center gap-1"
              >
                <span>View My Thali ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMenuItems.map((dish) => {
              const inCart = cart.find(ci => ci.menuItem.id === dish.id);
              const restObj = restaurants.find(r => r.id === dish.restaurantId);

              return (
                <div 
                  key={dish.id} 
                  onClick={() => openProductDetails(dish)}
                  className={`bg-white rounded-2xl border border-slate-200/90 hover:border-orange-400 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer ${
                    !dish.inStock ? 'opacity-65 grayscale-30' : ''
                  }`}
                  title="Click to view dish details, ingredients & customer reviews"
                >
                  <div>
                    <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                      <img 
                        src={dish.image} 
                        alt={dish.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2 py-1 rounded-md text-[10px] font-extrabold flex items-center gap-1 shadow-xs">
                        <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                        <span className="text-emerald-900 font-black">PURE SATVIK</span>
                      </div>

                      {/* View Details hover badge */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/35 backdrop-blur-2xs">
                        <span className="px-3.5 py-1.5 rounded-xl bg-orange-600 text-white text-xs font-black shadow-lg flex items-center gap-1">
                          <span>View Details</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>

                      <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-bold text-slate-900 flex items-center gap-1 shadow-xs">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span>{dish.rating}</span>
                        <span className="text-[9px] text-slate-400">({dish.reviewsCount})</span>
                      </div>

                      {!dish.inStock && (
                        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-2xs flex items-center justify-center text-white font-black text-sm uppercase tracking-wider">
                          Sold Out Today
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      {/* Clickable Category and Kitchen links */}
                      <div className="flex items-center gap-1.5 flex-wrap text-[11px] font-semibold text-orange-600 uppercase tracking-wide">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openCategoryDetails(dish.category);
                          }}
                          className="hover:underline hover:text-orange-700 bg-orange-50 px-1.5 py-0.5 rounded text-[10px]"
                        >
                          {dish.category} ↗
                        </button>
                        <span>•</span>
                        {restObj && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openRestaurantDetails(restObj);
                            }}
                            className="hover:underline hover:text-slate-900 text-slate-600 text-[10px] font-bold"
                          >
                            {restObj.name} ↗
                          </button>
                        )}
                      </div>

                      <h4 className="font-extrabold text-base text-slate-900 mt-1.5 leading-snug group-hover:text-orange-600 transition-colors">
                        {dish.name}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                        {dish.description}
                      </p>
                    </div>
                  </div>

                  <div 
                    onClick={(e) => e.stopPropagation()}
                    className="p-4 pt-0 border-t border-slate-100 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-[10px] text-slate-400 font-medium">Price</div>
                      <div className="text-lg font-black text-slate-900">₹{dish.price}</div>
                    </div>

                    {inCart ? (
                      <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-xl p-1 shadow-2xs">
                        <button
                          onClick={() => updateCartQuantity(dish.id, -1)}
                          className="w-7 h-7 rounded-lg bg-white text-slate-800 flex items-center justify-center font-bold hover:bg-slate-100 transition-colors shadow-2xs"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-black text-sm text-orange-950 px-1.5 min-w-4 text-center">
                          {inCart.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(dish.id, 1)}
                          className="w-7 h-7 rounded-lg bg-orange-600 text-white flex items-center justify-center font-bold hover:bg-orange-700 transition-colors shadow-2xs"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        disabled={!dish.inStock}
                        onClick={() => addToCart(dish, 1)}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 active:scale-95 disabled:bg-slate-300 disabled:cursor-not-allowed shadow-xs transition-all flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add to Thali</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* ================= PREFOOTER: HIGH-CONVERSION PARTNER WITH BHOJJ SECTION ================= */}
      {/* Relocated here as per user request to empower holy kitchens & riders right before the footer */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 mt-16 pt-10 border-t border-slate-200">
        <div className="rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 text-white p-6 sm:p-10 lg:p-12 shadow-2xl border border-amber-500/20 relative overflow-hidden">
          
          {/* Ambient Glows & Mesh Gradients */}
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-orange-600/15 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-10 -left-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute top-1/2 right-10 w-72 h-72 bg-sky-600/10 rounded-full blur-3xl pointer-events-none"></div>

          {/* Background Decorative Pattern Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
            
            {/* Left Column: Headline, Value Proposition & Primary Conversion CTAs */}
            <div className="lg:col-span-7 space-y-5">
              
              {/* Sacred Eyebrow Tag */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-orange-500/20 via-amber-500/20 to-orange-500/20 border border-amber-500/40 text-amber-300 text-xs font-black uppercase tracking-wider shadow-xs backdrop-blur-xs">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  <span>Goverdhan Dham's Sacred Cloud Kitchen Network</span>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-800/80">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>100% Satvik & Mandir Certified</span>
                </span>
              </div>

              {/* Main Headline for 'Bhojj' */}
              <div className="space-y-2">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-[1.1]">
                  Bhojj — <span className="bg-gradient-to-r from-amber-300 via-orange-400 to-amber-200 bg-clip-text text-transparent">Pure Satvik Taste,</span> Empowering Kitchens & Fast Delivery
                </h2>
                <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed font-normal">
                  Connecting Goverdhan’s holy kitchens and bhojnalayas with thousands of pilgrims, ashrams, and Parikrama yatris. Partner your rasoi to scale daily orders, or earn with pride in our dedicated rider fleet.
                </p>
              </div>

              {/* HIGH-CONVERSION PRIMARY CALLS-TO-ACTION */}
              <div className="pt-2 space-y-3">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  
                  {/* Primary CTA 1: Partner with Us (Restaurant) */}
                  <button
                    id="prefooter-partner-restaurant-btn"
                    onClick={() => setCurrentView('restaurant_register')}
                    className="flex-1 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-600 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-white font-black text-xs sm:text-sm shadow-xl shadow-orange-600/30 border border-amber-300/40 transition-all transform hover:-translate-y-0.5 active:scale-98 flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3 text-left">
                      <div className="w-10 h-10 rounded-xl bg-black/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <Store className="w-5 h-5 text-amber-200" />
                      </div>
                      <div>
                        <div className="leading-tight font-extrabold text-white">Partner with Us</div>
                        <div className="text-[10px] text-amber-100/90 font-medium">For Kitchens & Dhabas (0% Fee)</div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform shrink-0" />
                  </button>

                  {/* Primary CTA 2: Join as Delivery Partner */}
                  <button
                    id="prefooter-join-delivery-btn"
                    onClick={() => setCurrentView('delivery_register')}
                    className="flex-1 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-sky-600 to-blue-700 hover:from-blue-500 hover:to-sky-500 text-white font-black text-xs sm:text-sm shadow-xl shadow-sky-600/30 border border-sky-300/40 transition-all transform hover:-translate-y-0.5 active:scale-98 flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3 text-left">
                      <div className="w-10 h-10 rounded-xl bg-black/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <Bike className="w-5 h-5 text-sky-200" />
                      </div>
                      <div>
                        <div className="leading-tight font-extrabold text-white">Join as Delivery Partner</div>
                        <div className="text-[10px] text-sky-100/90 font-medium">Earn ₹800–₹1,400/Day + Bonus</div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform shrink-0" />
                  </button>

                </div>

                {/* Login Direct Links */}
                <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
                  <span>Already registered?</span>
                  <button
                    onClick={() => setCurrentView('restaurant_login')}
                    className="text-amber-400 hover:underline font-bold"
                  >
                    Kitchen Login
                  </button>
                  <span>•</span>
                  <button
                    onClick={() => setCurrentView('delivery_login')}
                    className="text-sky-400 hover:underline font-bold"
                  >
                    Rider Login
                  </button>
                </div>
              </div>

            </div>

            {/* Right Column: Dual Ecosystem Showcase Bento */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Bento Showcase Card 1: Restaurant Kitchen Highlight */}
              <div className="rounded-2xl bg-slate-900/90 backdrop-blur-md border border-amber-500/30 p-4 shadow-xl relative overflow-hidden group hover:border-amber-400/60 transition-all">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                      <Store className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-white">Kitchen Partner Network</span>
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-emerald-950 text-emerald-400 border border-emerald-800">
                          Active Orders
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">Goverdhan Mandir Rasoi & Bhog Hub</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setCurrentView('restaurant_register')}
                    className="text-[11px] font-black text-amber-400 hover:text-amber-300 underline"
                  >
                    Register →
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-800 text-center">
                  <div className="bg-slate-950/60 rounded-lg p-2 border border-slate-800">
                    <div className="text-[10px] text-slate-400">Avg. Payout</div>
                    <div className="text-xs font-black text-amber-300">₹45,000+</div>
                  </div>
                  <div className="bg-slate-950/60 rounded-lg p-2 border border-slate-800">
                    <div className="text-[10px] text-slate-400">Order Growth</div>
                    <div className="text-xs font-black text-emerald-400">+150%</div>
                  </div>
                  <div className="bg-slate-950/60 rounded-lg p-2 border border-slate-800">
                    <div className="text-[10px] text-slate-400">Setup Fee</div>
                    <div className="text-xs font-black text-white">₹0 FREE</div>
                  </div>
                </div>
              </div>

              {/* Bento Showcase Card 2: Delivery Fleet Hero Highlight */}
              <div className="rounded-2xl bg-slate-900/90 backdrop-blur-md border border-sky-500/30 p-4 shadow-xl relative overflow-hidden group hover:border-sky-400/60 transition-all">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400">
                      <Bike className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-white">Delivery Partner Fleet</span>
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-blue-950 text-sky-300 border border-blue-800">
                          Now Hiring
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">Goverdhan Parikrama & Ashram Routes</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setCurrentView('delivery_register')}
                    className="text-[11px] font-black text-sky-400 hover:text-sky-300 underline"
                  >
                    Join Fleet →
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-800 text-center">
                  <div className="bg-slate-950/60 rounded-lg p-2 border border-slate-800">
                    <div className="text-[10px] text-slate-400">Daily Earnings</div>
                    <div className="text-xs font-black text-sky-300">₹800–₹1,400</div>
                  </div>
                  <div className="bg-slate-950/60 rounded-lg p-2 border border-slate-800">
                    <div className="text-[10px] text-slate-400">Payouts</div>
                    <div className="text-xs font-black text-emerald-400">Instant UPI</div>
                  </div>
                  <div className="bg-slate-950/60 rounded-lg p-2 border border-slate-800">
                    <div className="text-[10px] text-slate-400">Shifts</div>
                    <div className="text-xs font-black text-white">Flexible</div>
                  </div>
                </div>
              </div>

              {/* Floating Platter Thumbnail & Devotee Rating */}
              <div className="p-3 rounded-2xl bg-gradient-to-r from-orange-600/20 to-amber-600/20 border border-amber-500/20 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-white/20">
                    <img 
                      src={foodHeroSlides[0].image} 
                      alt="Sacred Thali" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="text-xs font-black text-white flex items-center gap-1.5">
                      <span>{foodHeroSlides[0].title}</span>
                      <span className="text-[10px] text-amber-300">★ 4.9</span>
                    </div>
                    <div className="text-[10px] text-slate-400">12,800+ Devotees Served across Goverdhan</div>
                  </div>
                </div>
                <button
                  onClick={() => handleCopyCode('BHOJJ50')}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-amber-300 text-[10px] font-black border border-amber-400/30 whitespace-nowrap"
                >
                  {copiedCoupon === 'BHOJJ50' ? 'COPIED!' : 'CODE: BHOJJ50'}
                </button>
              </div>

            </div>

          </div>

          {/* CREDIBILITY STRIP AT BOTTOM OF PREFOOTER HERO */}
          <div className="mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center shrink-0">
                <Store className="w-4 h-4" />
              </div>
              <span className="text-slate-300 font-semibold">50+ Satvik Kitchens Listed</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center shrink-0">
                <Bike className="w-4 h-4" />
              </div>
              <span className="text-slate-300 font-semibold">120+ Dedicated Fleet Heroes</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                <Leaf className="w-4 h-4" />
              </div>
              <span className="text-slate-300 font-semibold">100% Desi Cow Ghee (Satvik)</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <span className="text-slate-300 font-semibold">25-Min Ashram Drop Guaranteed</span>
            </div>
          </div>

        </div>
      </div>
        </>
      )}

      {/* ================= MY ORDERS TAB MODAL / VIEW ================= */}
      {activeTab === 'orders' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-center items-start overflow-y-auto p-4 sm:p-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-3xl w-full shadow-2xl border border-slate-200 my-8 space-y-6 animate-in fade-in zoom-in-95">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">Your Bhojj Orders</h2>
                <p className="text-xs text-slate-500">Live order status, delivery tracking, and 4-digit rider OTP.</p>
              </div>
              <button
                onClick={() => setActiveTab('menu')}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!currentUser && myOrders.length === 0 ? (
              <div className="bg-orange-50/50 border border-orange-200 rounded-2xl p-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto">
                  <Lock className="w-6 h-6" />
                </div>
                <h4 className="font-extrabold text-slate-900 text-base">Sign In to Track Orders</h4>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Please sign in to view real-time delivery rider tracking and delivery handoff PIN.
                </p>
                <div className="flex gap-2 justify-center pt-2">
                  <button
                    onClick={() => setCurrentView('customer_login')}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-orange-600 text-white hover:bg-orange-700"
                  >
                    Customer Sign In
                  </button>
                  <button
                    onClick={() => login('priya@example.com', 'customer', 'password123')}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-white border border-slate-300 text-slate-700 hover:bg-slate-100"
                  >
                    ⚡ Fast Demo Login
                  </button>
                </div>
              </div>
            ) : myOrders.length === 0 ? (
              <div className="text-center py-10">
                <UtensilsCrossed className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <h4 className="font-bold text-slate-800 text-sm">No orders placed yet</h4>
                <p className="text-xs text-slate-500 mt-1">Browse our delicious Satvik specialties and order now!</p>
              </div>
            ) : (
              <div className="space-y-5">
                {myOrders.map((order) => {
                  const isActive = order.status !== 'delivered' && order.status !== 'cancelled';

                  return (
                    <div 
                      key={order.id}
                      className={`rounded-3xl border transition-all overflow-hidden ${
                        isActive ? 'border-orange-300 ring-2 ring-orange-500/15 bg-white shadow-md' : 'border-slate-200 bg-slate-50/60'
                      }`}
                    >
                      {/* If order is active, embed the visual progress tracker directly */}
                      {isActive ? (
                        <VisualOrderTracker order={order} compact={true} />
                      ) : (
                        <div className="p-5">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-black text-slate-900 text-sm">Order #{order.id}</span>
                                {getStatusBadge(order.status)}
                              </div>
                              <p className="text-xs text-slate-500 mt-0.5">{order.restaurantName} • Placed: {order.orderTime}</p>
                            </div>

                            <button
                              onClick={() => setSelectedOrderForTracking(order)}
                              className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors self-start sm:self-center shadow-xs"
                            >
                              <Bike className="w-3.5 h-3.5 text-orange-400" />
                              <span>View Order Journey</span>
                            </button>
                          </div>

                          {/* Items */}
                          <div className="py-2.5 space-y-1 text-xs">
                            {order.items.map((item, i) => (
                              <div key={i} className="flex justify-between text-slate-700">
                                <span>{item.quantity}x {item.name}</span>
                                <span className="font-bold text-slate-900">₹{item.price * item.quantity}</span>
                              </div>
                            ))}
                          </div>

                          <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                            <div className="text-slate-500">
                              Total Paid: <strong className="text-slate-900 text-sm">₹{order.totalAmount}</strong>
                            </div>
                            <div className="text-slate-500 font-medium">
                              Delivered on: <strong className="text-emerald-700">{order.orderDate}</strong>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveTab('menu')}
                className="px-5 py-2.5 rounded-xl bg-orange-600 text-white font-bold text-xs hover:bg-orange-700"
              >
                Back to Food Menu
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ================= USER PROFILE & ADDRESSES MODAL / VIEW ================= */}
      {activeTab === 'profile' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-center items-start overflow-y-auto p-2 sm:p-6">
          <div className="bg-slate-50 rounded-3xl p-4 sm:p-6 max-w-4xl w-full shadow-2xl border border-slate-200 my-4 sm:my-8 space-y-4 animate-in fade-in zoom-in-95 relative">
            <div className="flex items-center justify-between px-2 pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight">Customer Profile & Saved Addresses</h2>
                  <p className="text-[11px] text-slate-500">Manage contact information, delivery ashram addresses, and dietary preferences.</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('menu')}
                className="w-9 h-9 rounded-full bg-white hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 shadow-xs cursor-pointer"
                title="Close Profile"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <CustomerProfile onBackToMenu={() => setActiveTab('menu')} />
          </div>
        </div>
      )}

      {/* ================= BHOJJ DIGITAL WALLET MODAL / VIEW ================= */}
      {activeTab === 'wallet' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-center items-start overflow-y-auto p-2 sm:p-6 animate-in fade-in">
          <div className="bg-slate-50 rounded-3xl p-4 sm:p-6 max-w-4xl w-full shadow-2xl border border-slate-200 my-4 sm:my-8 space-y-4 relative">
            <div className="flex items-center justify-between px-2 pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight">Bhojj Satvik Digital Wallet</h2>
                  <p className="text-[11px] text-slate-500">Manage funds, review passbook transactions, and enjoy seamless 1-click checkout.</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('menu')}
                className="w-9 h-9 rounded-full bg-white hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 shadow-xs cursor-pointer"
                title="Back to Menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <CustomerWallet 
              onBackToMenu={() => setActiveTab('menu')} 
              onOpenCart={() => {
                setActiveTab('menu');
                setIsCartOpen(true);
              }} 
            />
          </div>
        </div>
      )}

      {/* ================= CART & CHECKOUT DRAWER ================= */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl overflow-hidden">
            
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-orange-600" />
                <span className="font-black text-slate-900 text-base">Your Satvik Thali ({cart.length} items)</span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-16">
                  <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                  <p className="font-bold text-slate-700">Your cart is empty</p>
                  <p className="text-xs text-slate-400 mt-1">Add pure Goverdhan delicacies from the menu.</p>
                </div>
              ) : (
                <>
                  <div className="divide-y divide-slate-100">
                    {cart.map((ci) => (
                      <div key={ci.menuItem.id} className="py-3 flex items-center justify-between gap-3">
                        <div 
                          onClick={() => openProductDetails(ci.menuItem.id)}
                          className="flex-1 cursor-pointer group/item"
                          title="Click to view dish details"
                        >
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                            <span className="font-bold text-xs sm:text-sm text-slate-900 leading-tight group-hover/item:text-orange-600 transition-colors">
                              {ci.menuItem.name} ↗
                            </span>
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">₹{ci.menuItem.price} each</div>
                        </div>

                        <div className="flex items-center gap-1.5 bg-slate-100 rounded-lg p-1">
                          <button
                            onClick={() => updateCartQuantity(ci.menuItem.id, -1)}
                            className="w-6 h-6 rounded bg-white text-slate-700 flex items-center justify-center font-bold text-xs hover:bg-slate-200"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-black text-slate-900 px-1.5 min-w-4 text-center">
                            {ci.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(ci.menuItem.id, 1)}
                            className="w-6 h-6 rounded bg-orange-600 text-white flex items-center justify-center font-bold text-xs hover:bg-orange-700"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="text-xs font-black text-slate-900 min-w-12 text-right">
                          ₹{ci.menuItem.price * ci.quantity}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Delivery Address input */}
                  <div className="pt-3 border-t border-slate-200">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-orange-600" />
                        <span>Deliver to Ashram / Room:</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setIsCartOpen(false);
                          setActiveTab('profile');
                        }}
                        className="text-[10px] font-bold text-orange-600 hover:text-orange-700 hover:underline cursor-pointer"
                      >
                        {currentUser ? '⚙️ Saved Addresses' : 'Manage Profile'}
                      </button>
                    </div>

                    {/* Quick Pick Saved Addresses */}
                    {currentUser?.savedAddresses && currentUser.savedAddresses.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {currentUser.savedAddresses.map((addr) => {
                          const fullFormatted = `${addr.name ? addr.name + ' - ' : ''}${addr.addressLine}${addr.landmark ? ', near ' + addr.landmark : ''}, ${addr.city}`;
                          const isSelected = deliveryAddress.includes(addr.addressLine);

                          return (
                            <button
                              key={addr.id}
                              type="button"
                              onClick={() => setDeliveryAddress(fullFormatted)}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer border ${
                                isSelected
                                  ? 'bg-orange-600 text-white border-orange-600 shadow-2xs'
                                  : 'bg-orange-50 hover:bg-orange-100 text-orange-900 border-orange-200'
                              }`}
                              title={fullFormatted}
                            >
                              <span>📍 {addr.label}</span>
                              {addr.isDefault && <span className="text-[8px] bg-black/15 px-1 rounded">DEFAULT</span>}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    <textarea
                      rows={2}
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="w-full p-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500"
                      placeholder="Room number, Ashram name, Goverdhan..."
                    />

                    {currentUser?.preferences?.deliveryInstructions && (
                      <div className="mt-1.5 text-[10px] text-slate-500 bg-slate-50 p-1.5 rounded-lg border border-slate-200 flex items-center gap-1.5">
                        <span className="font-bold text-slate-700 shrink-0">Note:</span>
                        <span className="truncate">{currentUser.preferences.deliveryInstructions}</span>
                      </div>
                    )}
                  </div>

                  {/* Coupon Box */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                        <Tag className="w-3.5 h-3.5 text-orange-600" />
                        <span>Coupons & Offers</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowCouponModal(true)}
                        className="text-[11px] font-extrabold text-orange-600 hover:text-orange-700 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>View Offers ({coupons.filter(c => c.isActive).length})</span>
                      </button>
                    </div>

                    {appliedCoupon ? (
                      <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between animate-in fade-in">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
                            %
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-black text-emerald-900 tracking-wide">
                                '{appliedCoupon.coupon.code}'
                              </span>
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-emerald-200/70 text-emerald-800">
                                APPLIED
                              </span>
                            </div>
                            <p className="text-[10px] text-emerald-700 font-semibold">
                              Saved ₹{appliedCoupon.discountAmount} on this order!
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={removeAppliedCoupon}
                          className="px-2.5 py-1 text-[11px] font-bold text-red-600 hover:text-red-700 hover:bg-red-100/50 rounded-lg transition-colors cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={couponInput}
                            onChange={(e) => {
                              setCouponInput(e.target.value.toUpperCase());
                              if (couponError) setCouponError('');
                            }}
                            placeholder="Enter Promo Code (e.g. BHOJJ50)"
                            className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs uppercase font-bold text-slate-800 placeholder:normal-case placeholder:font-normal focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                          />
                          <button
                            type="button"
                            onClick={handleApplyCoupon}
                            className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-black transition-colors cursor-pointer"
                          >
                            Apply
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => setShowCouponModal(true)}
                          className="w-full py-1.5 px-2.5 rounded-lg bg-orange-50 hover:bg-orange-100 border border-orange-200/80 text-orange-800 text-[11px] font-bold flex items-center justify-between transition-colors cursor-pointer"
                        >
                          <span className="flex items-center gap-1.5">
                            <Tag className="w-3 h-3 text-orange-600" />
                            <span>Have a promo coupon or ashram code?</span>
                          </span>
                          <span className="font-extrabold text-orange-600 flex items-center gap-0.5">
                            Browse <ArrowRight className="w-3 h-3" />
                          </span>
                        </button>
                      </div>
                    )}

                    {couponError && (
                      <p className="text-[11px] text-red-600 font-medium mt-1.5 flex items-center gap-1">
                        <X className="w-3 h-3 shrink-0" />
                        <span>{couponError}</span>
                      </p>
                    )}
                    {couponSuccessMsg && (
                      <p className="text-[11px] text-emerald-700 font-bold mt-1.5 flex items-center gap-1">
                        <Check className="w-3 h-3 shrink-0" />
                        <span>{couponSuccessMsg}</span>
                      </p>
                    )}
                  </div>

                  {/* Payment Mode Selection */}
                  <div className="pt-3 border-t border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5 text-orange-600" />
                        <span>Payment Method</span>
                      </label>
                      {paymentMethod === 'Bhojj Wallet' && (
                        <span className="text-[10px] font-black text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          <span>1-Click Pay</span>
                        </span>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      {/* 1. Bhojj Digital Wallet option */}
                      <div
                        onClick={() => setPaymentMethod('Bhojj Wallet')}
                        className={`p-2.5 rounded-2xl border transition-all cursor-pointer ${
                          paymentMethod === 'Bhojj Wallet'
                            ? 'border-amber-500 bg-gradient-to-r from-amber-50/80 to-orange-50/80 ring-2 ring-amber-500/20 shadow-2xs'
                            : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs ${
                              paymentMethod === 'Bhojj Wallet' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'bg-slate-100 text-slate-600'
                            }`}>
                              <Wallet className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-black text-slate-900">Bhojj Digital Wallet</span>
                                <span className="text-[9px] font-bold bg-amber-200 text-amber-950 px-1.5 py-0.2 rounded">
                                  FAST
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-500">
                                Available: <strong className="text-slate-900 font-black">₹{walletBalance.toLocaleString('en-IN')}</strong>
                              </div>
                            </div>
                          </div>

                          <input
                            type="radio"
                            name="cart-payment-method"
                            checked={paymentMethod === 'Bhojj Wallet'}
                            onChange={() => setPaymentMethod('Bhojj Wallet')}
                            className="w-4 h-4 accent-orange-600 cursor-pointer"
                          />
                        </div>

                        {paymentMethod === 'Bhojj Wallet' && (
                          <div className="mt-2 pt-2 border-t border-amber-200/60 flex items-center justify-between text-[11px]">
                            {walletBalance >= grandTotal ? (
                              <div className="text-emerald-700 font-bold flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Sufficient (₹{walletBalance - grandTotal} left)</span>
                              </div>
                            ) : (
                              <div className="text-red-600 font-bold flex items-center gap-1">
                                <AlertCircle className="w-3.5 h-3.5" />
                                <span>Short by ₹{grandTotal - walletBalance}</span>
                              </div>
                            )}

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsCartOpen(false);
                                setActiveTab('wallet');
                              }}
                              className="text-[10px] font-black text-orange-600 hover:text-orange-700 bg-white px-2 py-0.5 rounded-lg border border-orange-200 shadow-2xs hover:bg-orange-50 cursor-pointer"
                            >
                              + Add Funds
                            </button>
                          </div>
                        )}
                      </div>

                      {/* 2. UPI Option */}
                      <div
                        onClick={() => setPaymentMethod('UPI')}
                        className={`p-2 rounded-xl border transition-all cursor-pointer ${
                          paymentMethod === 'UPI'
                            ? 'border-orange-500 bg-orange-50/60 ring-1 ring-orange-500/20'
                            : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs ${
                              paymentMethod === 'UPI' ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-600'
                            }`}>
                              <Smartphone className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-xs font-bold text-slate-800">UPI / QR (Google Pay, PhonePe)</span>
                          </div>
                          <input
                            type="radio"
                            name="cart-payment-method"
                            checked={paymentMethod === 'UPI'}
                            onChange={() => setPaymentMethod('UPI')}
                            className="w-4 h-4 accent-orange-600 cursor-pointer"
                          />
                        </div>
                      </div>

                      {/* 3. Cash on Delivery Option */}
                      <div
                        onClick={() => setPaymentMethod('Cash on Delivery')}
                        className={`p-2 rounded-xl border transition-all cursor-pointer ${
                          paymentMethod === 'Cash on Delivery'
                            ? 'border-orange-500 bg-orange-50/60 ring-1 ring-orange-500/20'
                            : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs ${
                              paymentMethod === 'Cash on Delivery' ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-600'
                            }`}>
                              💵
                            </div>
                            <span className="text-xs font-bold text-slate-800">Cash on Delivery (Pay at Ashram)</span>
                          </div>
                          <input
                            type="radio"
                            name="cart-payment-method"
                            checked={paymentMethod === 'Cash on Delivery'}
                            onChange={() => setPaymentMethod('Cash on Delivery')}
                            className="w-4 h-4 accent-orange-600 cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bill Details */}
                  <div className="pt-3 border-t border-slate-200 space-y-1.5 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span>Item Total</span>
                      <span className="font-bold text-slate-900">₹{cartSubtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Fee</span>
                      <span>{deliveryFee === 0 ? <strong className="text-emerald-700">FREE</strong> : `₹${deliveryFee}`}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-700 font-semibold">
                        <span>Coupon Savings</span>
                        <span>-₹{discountAmount}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Mandir Standard Hygiene & Tax</span>
                      <span>₹{taxes}</span>
                    </div>
                    <div className="pt-2 border-t border-slate-200 flex justify-between font-black text-sm text-slate-900">
                      <span>Grand Total</span>
                      <span className="text-orange-600">₹{grandTotal}</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-3">
                <button
                  id="checkout-proceed-btn"
                  onClick={handlePlaceOrderSubmit}
                  className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black text-sm shadow-md shadow-orange-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {paymentMethod === 'Bhojj Wallet' && walletBalance >= grandTotal ? (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>1-Click Pay ₹{grandTotal} from Bhojj Wallet</span>
                    </>
                  ) : paymentMethod === 'Bhojj Wallet' && walletBalance < grandTotal ? (
                    <>
                      <AlertCircle className="w-4 h-4" />
                      <span>Top-Up ₹{grandTotal - walletBalance} & Pay (₹{grandTotal})</span>
                    </>
                  ) : (
                    <>
                      <span>Proceed to Book Order (₹{grandTotal})</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ================= WALLET SHORTFALL TOP-UP MODAL ================= */}
      {showWalletShortfallModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Bhojj Wallet Shortfall</h3>
                  <p className="text-[11px] text-slate-500">Add funds to complete your order seamlessly.</p>
                </div>
              </div>
              <button
                onClick={() => setShowWalletShortfallModal(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-amber-50/70 rounded-2xl p-4 border border-amber-200/80 space-y-2 text-xs">
              <div className="flex justify-between text-slate-700">
                <span>Order Grand Total:</span>
                <span className="font-bold text-slate-900">₹{grandTotal}</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Current Wallet Balance:</span>
                <span className="font-bold text-slate-900">₹{walletBalance}</span>
              </div>
              <div className="pt-2 border-t border-amber-200 flex justify-between font-black text-sm text-red-600">
                <span>Amount Needed:</span>
                <span>₹{grandTotal - walletBalance}</span>
              </div>
            </div>

            <p className="text-xs text-slate-500">
              Top-up ₹{grandTotal - walletBalance} instantly using UPI or switch to another payment method.
            </p>

            <div className="space-y-2 pt-1">
              <button
                type="button"
                disabled={isInstantTopUpLoading}
                onClick={handleTopUpShortfallAndPlaceOrder}
                className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
              >
                {isInstantTopUpLoading ? (
                  <span>Processing instant top-up...</span>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Instant Top-Up ₹{grandTotal - walletBalance} & Place Order</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setPaymentMethod('Cash on Delivery');
                  setShowWalletShortfallModal(false);
                }}
                className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold text-xs cursor-pointer"
              >
                Switch to Cash on Delivery Instead
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowWalletShortfallModal(false);
                  setIsCartOpen(false);
                  setActiveTab('wallet');
                }}
                className="w-full py-2 text-center text-[11px] font-bold text-orange-600 hover:underline cursor-pointer"
              >
                Go to Full Bhojj Wallet Page
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ================= GUEST CHECKOUT AUTH MODAL ================= */}
      {/* Strict User Requirement: Home page customer wala hi chiye, koi bhi order Book kr ske, bs customer check out kre tab usko login option aye */}
      {showCheckoutAuthModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 relative">
            
            <button
              onClick={() => setShowCheckoutAuthModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto mb-3 shadow-xs">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-slate-900">Login to Complete Order</h3>
              <p className="text-xs text-slate-500 mt-1">
                Please log in or register to secure your meal delivery and receive live rider tracking.
              </p>
            </div>

            {/* 1-Click Fast Checkout Option */}
            <div className="mb-5 p-3 rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 flex items-center justify-between">
              <div>
                <div className="text-xs font-black text-orange-950 flex items-center gap-1">
                  <span>⚡ 1-Click Fast Checkout</span>
                </div>
                <div className="text-[10px] text-slate-500">Sign in instantly as Priya Sharma</div>
              </div>
              <button
                type="button"
                disabled={authLoading}
                onClick={handleInstantDemoLoginAndPlaceOrder}
                className="px-3 py-1.5 rounded-xl bg-orange-600 text-white font-extrabold text-xs hover:bg-orange-700 shadow-xs"
              >
                {authLoading ? 'Booking...' : 'Book Now'}
              </button>
            </div>

            <div className="relative flex py-1 items-center mb-4">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-3 text-[11px] font-bold text-slate-400 uppercase">Or use account</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            {/* Switch between Login and Register */}
            <div className="flex border border-slate-200 p-1 rounded-xl bg-slate-100 mb-4 text-xs font-bold">
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className={`flex-1 py-1.5 rounded-lg transition-all ${authMode === 'login' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'}`}
              >
                Customer Login
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('register')}
                className={`flex-1 py-1.5 rounded-lg transition-all ${authMode === 'register' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'}`}
              >
                New Register
              </button>
            </div>

            <form onSubmit={handleAuthSubmitAndPlaceOrder} className="space-y-3">
              {authMode === 'register' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      placeholder="e.g. Ramesh Chandra"
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                    <input
                      type="text"
                      required
                      value={authPhone}
                      onChange={(e) => setAuthPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email / Username</label>
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="priya@example.com"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                />
              </div>

              {authError && (
                <div className="text-[11px] text-red-600 bg-red-50 p-2 rounded-lg border border-red-200">
                  {authError}
                </div>
              )}

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs shadow-md transition-colors flex items-center justify-center gap-2"
              >
                {authLoading ? 'Verifying...' : authMode === 'login' ? 'Sign In & Place Order' : 'Register & Place Order'}
              </button>
            </form>

          </div>
        </div>
      )}

      {/* ================= DEDICATED VISUAL ORDER TRACKING MODAL ================= */}
      {activeTrackedOrder && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex justify-center items-center overflow-y-auto p-3 sm:p-5 animate-in fade-in duration-200"
          onClick={() => setSelectedOrderForTracking(null)}
        >
          <div 
            className="relative max-w-3xl w-full my-auto animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <VisualOrderTracker 
              order={activeTrackedOrder} 
              onClose={() => setSelectedOrderForTracking(null)} 
            />
          </div>
        </div>
      )}

      {/* ================= COUPON SELECTION & PROMO MODAL ================= */}
      <CouponSelectionModal
        isOpen={showCouponModal}
        onClose={() => setShowCouponModal(false)}
        cartSubtotal={cartSubtotal}
      />

      {/* ================= ZOMATO TABLE BOOKING WORKFLOW MODAL ================= */}
      <ZomatoTableBookingModal
        onSuccessNavigateToDining={() => setActiveTab('dining')}
      />

    </div>
  );
};
