import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  UserRole, 
  PortalView, 
  Restaurant, 
  MenuItem, 
  Order, 
  OrderStatus, 
  CartItem, 
  TiffinSubscription, 
  DeliveryRiderProfile, 
  NotificationItem,
  HeroSlide,
  SiteHeaderConfig,
  SiteFooterConfig,
  CategoryItem,
  PortalControlConfig,
  Coupon,
  RealtimeAlert,
  WalletTransaction,
  TableBooking,
  TableBookingStatus,
  RiderLiveTelemetry,
  Coordinates
} from '../types';
import { DEFAULT_DELIVERY_ROUTE } from '../utils/geoUtils';
import { 
  INITIAL_USERS, 
  INITIAL_RESTAURANTS, 
  INITIAL_MENU_ITEMS, 
  INITIAL_ORDERS, 
  INITIAL_TIFFIN_SUBSCRIPTIONS, 
  INITIAL_RIDERS,
  INITIAL_TABLE_BOOKINGS
} from '../data/mockData';
import { INITIAL_WALLET_TRANSACTIONS, INITIAL_WALLET_BALANCE } from '../data/walletData';
import {
  DEFAULT_HERO_SLIDES,
  DEFAULT_HEADER_CONFIG,
  DEFAULT_FOOTER_CONFIG,
  DEFAULT_CATEGORIES,
  DEFAULT_PORTAL_CONFIG
} from '../data/cmsData';
import { INITIAL_COUPONS, calculateCouponDiscount } from '../data/couponData';
import { realtimeService } from '../services/realtimeService';
import { soundEffects } from '../utils/soundEffects';
import { bhojjApi } from '../services/bhojjApi';

interface AppContextType {
  currentUser: User | null;
  currentView: PortalView;
  setCurrentView: (view: PortalView) => void;
  login: (identifier: string, role: UserRole, password?: string) => Promise<{ success: boolean; message?: string }>;
  register: (userData: Partial<User> & { password?: string; restaurantName?: string; cuisine?: string; vehicleType?: any; fssaiNumber?: string }, role: UserRole) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  setSessionUser: (user: User | null) => void;
  quickSwitchRole: (role: UserRole) => void;
  
  // Master Users & Switch Control (Super Admin)
  users: User[];
  addUser: (user: User) => void;
  updateUser: (user: User) => void;
  deleteUser: (userId: string) => void;
  switchUser: (user: User | null, targetView?: PortalView) => void;
  
  // Data
  restaurants: Restaurant[];
  updateRestaurant: (updated: Restaurant) => void;
  addRestaurant: (restaurant: Restaurant) => void;
  deleteRestaurant: (restaurantId: string) => void;
  toggleKitchenStatus: (restaurantId: string) => void;
  
  menuItems: MenuItem[];
  addMenuItem: (item: Omit<MenuItem, 'id' | 'rating' | 'reviewsCount'>) => void;
  updateMenuItem: (item: MenuItem) => void;
  toggleMenuItemStock: (itemId: string) => void;
  deleteMenuItem: (itemId: string) => void;

  
  orders: Order[];
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  assignRiderToOrder: (orderId: string, riderId: string) => void;
  completeDeliveryWithOtp: (orderId: string, otp: string) => { success: boolean; message: string };
  rateOrder: (orderId: string, rating: number, feedback: string) => void;
  
  // Cart
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (item: MenuItem, qty?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, delta: number) => void;
  clearCart: () => void;
  placeOrder: (details: {
    deliveryAddress: string;
    paymentMethod: 'UPI' | 'Cash on Delivery' | 'Card / NetBanking' | 'Bhojj Wallet';
    discount?: number;
    customerId?: string;
    customerName?: string;
    customerPhone?: string;
    restaurantId?: string;
    restaurantName?: string;
    items?: any[];
    subtotal?: number;
    deliveryFee?: number;
    tax?: number;
    totalAmount?: number;
    status?: OrderStatus;
    orderTime?: string;
    estimatedDeliveryTime?: string;
    paymentStatus?: 'Paid' | 'Pending (COD)';
  }) => Order | null;
  
  // Digital Wallet
  walletBalance: number;
  walletTransactions: WalletTransaction[];
  addFundsToWallet: (amount: number, paymentMethod: string, note?: string) => { success: boolean; message: string; transaction: WalletTransaction };
  deductWalletFunds: (amount: number, orderId: string, description?: string) => boolean;
  refundToWallet: (amount: number, orderId: string, reason?: string) => void;

  // Coupons System
  coupons: Coupon[];
  appliedCoupon: { coupon: Coupon; discountAmount: number } | null;
  applyCouponCode: (code: string, cartSubtotal: number) => { success: boolean; discount: number; message: string; coupon?: Coupon };
  removeAppliedCoupon: () => void;
  addCoupon: (coupon: Coupon) => void;
  updateCoupon: (coupon: Coupon) => void;
  deleteCoupon: (couponId: string) => void;
  toggleCouponStatus: (couponId: string) => void;

  // Real-time alerts and simulations
  activeAlerts: RealtimeAlert[];
  dismissAlert: (alertId: string) => void;
  clearAllAlerts: () => void;
  simulateIncomingOrderForRestaurant: (restaurantId: string) => void;
  simulateOrderProgression: (orderId: string) => void;

  // Tiffin
  tiffinSubscriptions: TiffinSubscription[];
  createTiffinSubscription: (sub: Omit<TiffinSubscription, 'id'>) => void;
  
  // Delivery
  riders: DeliveryRiderProfile[];
  currentRiderProfile: DeliveryRiderProfile | undefined;
  toggleRiderDuty: (riderUserId?: string) => void;
  acceptDeliveryRun: (orderId: string, riderUserId: string) => void;
  updateRiderProfile: (rider: DeliveryRiderProfile) => void;
  
  // Real-time Map & Rider Telemetry
  riderTelemetries: Record<string, RiderLiveTelemetry>;
  updateRiderTelemetry: (orderId: string, telemetry: Partial<RiderLiveTelemetry>) => void;
  getRiderTelemetry: (orderId: string) => RiderLiveTelemetry | null;
  
  // Admin Controls
  updateRestaurantVerification: (restaurantId: string, isVerified: boolean) => void;
  updateRiderVerification: (riderId: string, isVerified: boolean) => void;
  platformCommissionRate: number;
  setPlatformCommissionRate: (rate: number) => void;
  
  // Notifications & UI
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  portalModalOpen: boolean;
  setPortalModalOpen: (open: boolean) => void;
  resetAllDemoData: () => void;

  // Global Search & Location Filtering
  globalSearchQuery: string;
  setGlobalSearchQuery: (query: string) => void;
  selectedLocationFilter: string;
  setSelectedLocationFilter: (location: string) => void;

  // Modals for Product, Restaurant & Category Details
  selectedProductForModal: MenuItem | null;
  setSelectedProductForModal: (item: MenuItem | null) => void;
  openProductDetails: (itemOrId: MenuItem | string) => void;
  
  selectedRestaurantForModal: Restaurant | null;
  setSelectedRestaurantForModal: (restaurant: Restaurant | null) => void;
  openRestaurantDetails: (restOrId: Restaurant | string) => void;

  selectedCategoryForModal: string | null;
  setSelectedCategoryForModal: (category: string | null) => void;
  openCategoryDetails: (categoryName: string) => void;

  closeAllModals: () => void;

  // CMS & Home Page Content Controls (Super Admin)
  heroSlides: HeroSlide[];
  updateHeroSlide: (slide: HeroSlide) => void;
  addHeroSlide: (slide: HeroSlide) => void;
  deleteHeroSlide: (slideId: string) => void;
  resetHeroSlides: () => void;

  headerConfig: SiteHeaderConfig;
  updateHeaderConfig: (config: Partial<SiteHeaderConfig>) => void;

  footerConfig: SiteFooterConfig;
  updateFooterConfig: (config: Partial<SiteFooterConfig>) => void;

  categoriesList: CategoryItem[];
  updateCategory: (cat: CategoryItem) => void;
  addCategory: (cat: CategoryItem) => void;
  deleteCategory: (catId: string) => void;

  portalConfig: PortalControlConfig;
  updatePortalConfig: (config: Partial<PortalControlConfig>) => void;

  broadcastNotification: (title: string, message: string, type?: NotificationItem['type']) => void;

  // Zomato Dining / Table Booking Workflow
  tableBookings: TableBooking[];
  createTableBooking: (booking: Omit<TableBooking, 'id' | 'createdAt' | 'status' | 'bookingPin' | 'checkInQrCode'>) => TableBooking;
  updateBookingStatus: (bookingId: string, status: TableBookingStatus, tableNumber?: string) => void;
  cancelTableBooking: (bookingId: string, reason?: string) => boolean;
  assignTableNumber: (bookingId: string, tableNumber: string) => void;
  selectedRestaurantForBooking: Restaurant | null;
  setSelectedRestaurantForBooking: (restaurant: Restaurant | null) => void;
  openTableBookingModal: (restaurant?: Restaurant) => void;
  closeTableBookingModal: () => void;
  isTableBookingModalOpen: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: 'bhojj_user',
  VIEW: 'bhojj_view',
  RESTAURANTS: 'bhojj_restaurants',
  MENU_ITEMS: 'bhojj_menu_items',
  ORDERS: 'bhojj_orders',
  RIDERS: 'bhojj_riders',
  TIFFIN: 'bhojj_tiffin',
  COMMISSION: 'bhojj_commission',
  HERO_SLIDES: 'bhojj_hero_slides',
  HEADER_CONFIG: 'bhojj_header_config',
  FOOTER_CONFIG: 'bhojj_footer_config',
  CATEGORIES: 'bhojj_categories',
  PORTAL_CONFIG: 'bhojj_portal_config',
  USERS: 'bhojj_users',
  COUPONS: 'bhojj_coupons',
  WALLET_BALANCE: 'bhojj_wallet_balance',
  WALLET_TRANSACTIONS: 'bhojj_wallet_transactions',
  TABLE_BOOKINGS: 'bhojj_table_bookings',
  RIDER_TELEMETRIES: 'bhojj_rider_telemetries',
};

const INITIAL_RIDER_TELEMETRIES: Record<string, RiderLiveTelemetry> = {
  'ORD-7821': {
    orderId: 'ORD-7821',
    riderId: 'user-rider-1',
    riderName: 'Rajesh Kumar',
    riderPhone: '+91 91234 56789',
    location: { lat: 27.5098, lng: 77.4715 },
    heading: 42,
    speedKmh: 28,
    accuracyMeters: 4,
    updatedAt: 'Just now',
    status: 'on_the_way',
    remainingDistanceKm: 1.4,
    remainingMinutes: 6,
    routeProgressPercent: 52,
    isLiveGps: false,
    batteryLevel: 88,
  },
};

// Counter to ensure 100% unique notification IDs even within same-millisecond calls
let notifSequence = 0;

export const AppProvider: React.FC<{ children: React.ReactNode, initialView?: PortalView }> = ({ children, initialView }) => {
  // Load initial states from localStorage if available
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    // Default to Guest visitor so any user can freely browse & will be prompted on checkout
    return null;
  });

  const [currentView, setCurrentView] = useState<PortalView>(() => {
    if (initialView) return initialView;
    const saved = localStorage.getItem(STORAGE_KEYS.VIEW);
    if (saved) return saved as PortalView;
    return 'customer_dashboard';
  });

  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [selectedLocationFilter, setSelectedLocationFilter] = useState('All');

  const [restaurants, setRestaurants] = useState<Restaurant[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RESTAURANTS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= INITIAL_RESTAURANTS.length && parsed[0]?.locationZone) {
          return parsed;
        }
      } catch (e) { /* ignore */ }
    }
    return INITIAL_RESTAURANTS;
  });

  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MENU_ITEMS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= INITIAL_MENU_ITEMS.length) {
          return parsed;
        }
      } catch (e) { /* ignore */ }
    }
    return INITIAL_MENU_ITEMS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_ORDERS;
  });

  const [riders, setRiders] = useState<DeliveryRiderProfile[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RIDERS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_RIDERS;
  });

  const [tiffinSubscriptions, setTiffinSubscriptions] = useState<TiffinSubscription[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TIFFIN);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_TIFFIN_SUBSCRIPTIONS;
  });

  const [platformCommissionRate, setPlatformCommissionRate] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COMMISSION);
    return saved ? Number(saved) : 15;
  });

  // Master Users State
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) { /* ignore */ }
    }
    return INITIAL_USERS;
  });

  // CMS: Hero Slides State
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.HERO_SLIDES);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) { /* ignore */ }
    }
    return DEFAULT_HERO_SLIDES;
  });

  // CMS: Header & Announcement State
  const [headerConfig, setHeaderConfig] = useState<SiteHeaderConfig>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.HEADER_CONFIG);
    if (saved) {
      try {
        return { ...DEFAULT_HEADER_CONFIG, ...JSON.parse(saved) };
      } catch (e) { /* ignore */ }
    }
    return DEFAULT_HEADER_CONFIG;
  });

  // CMS: Footer State
  const [footerConfig, setFooterConfig] = useState<SiteFooterConfig>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FOOTER_CONFIG);
    if (saved) {
      try {
        return { ...DEFAULT_FOOTER_CONFIG, ...JSON.parse(saved) };
      } catch (e) { /* ignore */ }
    }
    return DEFAULT_FOOTER_CONFIG;
  });

  // CMS: Categories State
  const [categoriesList, setCategoriesList] = useState<CategoryItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) { /* ignore */ }
    }
    return DEFAULT_CATEGORIES;
  });

  // Coupons State
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COUPONS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) { /* ignore */ }
    }
    return INITIAL_COUPONS;
  });

  const [appliedCoupon, setAppliedCoupon] = useState<{ coupon: Coupon; discountAmount: number } | null>(null);

  // Digital Wallet State
  const [walletBalance, setWalletBalance] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WALLET_BALANCE);
    if (saved) {
      const num = Number(saved);
      if (!isNaN(num)) return num;
    }
    return INITIAL_WALLET_BALANCE;
  });

  const [walletTransactions, setWalletTransactions] = useState<WalletTransaction[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WALLET_TRANSACTIONS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) { /* ignore */ }
    }
    return INITIAL_WALLET_TRANSACTIONS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WALLET_BALANCE, walletBalance.toString());
  }, [walletBalance]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WALLET_TRANSACTIONS, JSON.stringify(walletTransactions));
  }, [walletTransactions]);

  // Real-time alerts state (for live banner & sound notification)
  const [activeAlerts, setActiveAlerts] = useState<RealtimeAlert[]>([]);

  // Master Portal Control Settings
  const [portalConfig, setPortalConfig] = useState<PortalControlConfig>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PORTAL_CONFIG);
    if (saved) {
      try {
        return { ...DEFAULT_PORTAL_CONFIG, ...JSON.parse(saved) };
      } catch (e) { /* ignore */ }
    }
    return DEFAULT_PORTAL_CONFIG;
  });

  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [portalModalOpen, setPortalModalOpen] = useState<boolean>(false);


  // Modal states for Product, Restaurant & Category Details
  const [selectedProductForModal, setSelectedProductForModal] = useState<MenuItem | null>(null);
  const [selectedRestaurantForModal, setSelectedRestaurantForModal] = useState<Restaurant | null>(null);
  const [selectedCategoryForModal, setSelectedCategoryForModal] = useState<string | null>(null);
  
  // Zomato Dining / Table Booking Modal State
  const [selectedRestaurantForBooking, setSelectedRestaurantForBooking] = useState<Restaurant | null>(null);
  const [isTableBookingModalOpen, setIsTableBookingModalOpen] = useState<boolean>(false);

  // Table Bookings Storage & State
  const [tableBookings, setTableBookings] = useState<TableBooking[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TABLE_BOOKINGS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) { /* ignore */ }
    }
    return INITIAL_TABLE_BOOKINGS;
  });

  // Real-time Map & Rider Telemetry State
  const [riderTelemetries, setRiderTelemetries] = useState<Record<string, RiderLiveTelemetry>>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RIDER_TELEMETRIES);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') return parsed;
      } catch (e) { /* ignore */ }
    }
    return INITIAL_RIDER_TELEMETRIES;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RIDER_TELEMETRIES, JSON.stringify(riderTelemetries));
  }, [riderTelemetries]);

  const openTableBookingModal = (restaurant?: Restaurant) => {
    if (restaurant) {
      setSelectedRestaurantForBooking(restaurant);
    } else if (!selectedRestaurantForBooking && restaurants.length > 0) {
      setSelectedRestaurantForBooking(restaurants[0]);
    }
    setIsTableBookingModalOpen(true);
  };

  const closeTableBookingModal = () => {
    setIsTableBookingModalOpen(false);
  };

  const openProductDetails = (itemOrId: MenuItem | string) => {
    if (typeof itemOrId === 'string') {
      const found = menuItems.find(m => m.id === itemOrId);
      if (found) {
        setSelectedProductForModal(found);
      }
    } else {
      setSelectedProductForModal(itemOrId);
    }
  };

  const openRestaurantDetails = (restOrId: Restaurant | string) => {
    if (typeof restOrId === 'string') {
      const found = restaurants.find(r => r.id === restOrId);
      if (found) {
        setSelectedRestaurantForModal(found);
      }
    } else {
      setSelectedRestaurantForModal(restOrId);
    }
  };

  const openCategoryDetails = (categoryName: string) => {
    setSelectedCategoryForModal(categoryName);
  };

  const closeAllModals = () => {
    setSelectedProductForModal(null);
    setSelectedRestaurantForModal(null);
    setSelectedCategoryForModal(null);
    setIsTableBookingModalOpen(false);
  };
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'Welcome to Bhojj!',
      message: 'Explore authentic thalis, home-style tiffins, and restaurant-quality food.',
      time: 'Just now',
      type: 'system',
      read: false,
    }
  ]);

  // Sync state to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.VIEW, currentView);
  }, [currentView]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RESTAURANTS, JSON.stringify(restaurants));
  }, [restaurants]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MENU_ITEMS, JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RIDERS, JSON.stringify(riders));
  }, [riders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TIFFIN, JSON.stringify(tiffinSubscriptions));
  }, [tiffinSubscriptions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COMMISSION, platformCommissionRate.toString());
  }, [platformCommissionRate]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.HERO_SLIDES, JSON.stringify(heroSlides));
  }, [heroSlides]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.HEADER_CONFIG, JSON.stringify(headerConfig));
  }, [headerConfig]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FOOTER_CONFIG, JSON.stringify(footerConfig));
  }, [footerConfig]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categoriesList));
  }, [categoriesList]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PORTAL_CONFIG, JSON.stringify(portalConfig));
  }, [portalConfig]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TABLE_BOOKINGS, JSON.stringify(tableBookings));
  }, [tableBookings]);

  // Real-time Event Subscription and Polling
  useEffect(() => {
    // 1. Subscribe to incoming broadcast events (from other tabs or in-memory actions)
    const unsubscribe = realtimeService.subscribe((alert) => {
      // Smooth telemetry update for live map
      if (alert.type === 'rider_location_update' && alert.telemetry) {
        setRiderTelemetries(prev => ({
          ...prev,
          [alert.telemetry!.orderId]: alert.telemetry!
        }));
        return;
      }

      setActiveAlerts(prev => {
        if (prev.some(a => a.id === alert.id)) return prev;
        return [alert, ...prev.slice(0, 4)];
      });

      // Auto dismiss after 8 seconds
      setTimeout(() => {
        setActiveAlerts(prev => prev.filter(a => a.id !== alert.id));
      }, 8000);
    });

    // 2. Start Polling Loop (checks for new orders / status updates every 3s)
    realtimeService.startPolling(
      () => orders,
      currentUser?.role || 'customer',
      currentUser?.restaurantId,
      currentUser?.id
    );

    return () => {
      unsubscribe();
      realtimeService.stopPolling();
    };
  }, [orders, currentUser]);


  // Helper to add toast notification
  const addNotification = (title: string, message: string, type: 'order' | 'system' | 'earnings' | 'alert', targetRole?: UserRole) => {
    notifSequence += 1;
    const uniqueId = `notif-${Date.now()}-${notifSequence}-${Math.random().toString(36).substring(2, 8)}`;
    const newNotif: NotificationItem = {
      id: uniqueId,
      title,
      message,
      time: 'Just now',
      type,
      read: false,
      targetRole,
    };
    setNotifications(prev => [newNotif, ...prev.filter(n => n.id !== uniqueId).slice(0, 19)]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  // Central PHP/MySQL synchronization. Existing local/demo state remains a safe
  // fallback if the API is temporarily unavailable; the server is authoritative
  // whenever a response is received.
  const loadRemoteData = async () => {
    try {
      const data = await bhojjApi.getBootstrap();
      if (Array.isArray(data.restaurants) && data.restaurants.length) setRestaurants(data.restaurants);
      if (Array.isArray(data.menuItems) && data.menuItems.length) setMenuItems(data.menuItems);
      if (Array.isArray(data.orders)) setOrders(data.orders);
      if (Array.isArray(data.riders) && data.riders.length) setRiders(data.riders);
      if (Array.isArray(data.coupons) && data.coupons.length) setCoupons(data.coupons);
      if (Array.isArray(data.users) && data.users.length) setUsers(data.users);
      if (Array.isArray(data.heroSlides) && data.heroSlides.length) setHeroSlides(data.heroSlides);
      if (data.headerConfig) setHeaderConfig((prev: any) => ({ ...prev, ...data.headerConfig }));
      if (data.footerConfig) setFooterConfig((prev: any) => ({ ...prev, ...data.footerConfig }));
      if (Array.isArray(data.categoriesList) && data.categoriesList.length) setCategoriesList(data.categoriesList);
      if (data.portalConfig) setPortalConfig((prev: any) => ({ ...prev, ...data.portalConfig }));
      if (data.user) {
        setCurrentUser(data.user as User);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));
      } else if (data.user === null) {
        setCurrentUser(null);
      }
      return data;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    void loadRemoteData();
  }, []);

  // Server-authoritative order/rider refresh keeps Customer tracking and the
  // Restaurant/Delivery dashboards in sync even when realtime transport is unavailable.
  useEffect(() => {
    if (!currentUser) return;
    const timer = window.setInterval(() => { void loadRemoteData(); }, 15000);
    return () => window.clearInterval(timer);
  }, [currentUser?.id]);

  // Auth Functions
  const login = async (identifier: string, role: UserRole, password = '') => {
    try {
      const result = await bhojjApi.login(identifier, role, password);
      if (!result.user) throw new Error('Login succeeded but no user was returned.');
      setCurrentUser(result.user as User);
      setCurrentView(`${role}_dashboard` as PortalView);
      addNotification('Login Successful', `Welcome back, ${result.user.name}!`, 'system', role);
      void loadRemoteData();
      return { success: true };
    } catch (error: any) {
      return { success: false, message: error?.message || 'Unable to sign in.' };
    }
  };


  const register = async (
    userData: Partial<User> & { password?: string; restaurantName?: string; cuisine?: string; vehicleType?: any; fssaiNumber?: string },
    role: UserRole
  ) => {
    try {
      const result = await bhojjApi.register({
        role,
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        password: userData.password || '',
        city: userData.city || '',
        address: userData.address || '',
        dietaryPreference: userData.dietaryPreference,
        restaurantName: userData.restaurantName,
        cuisine: userData.cuisine,
        fssaiNumber: userData.fssaiNumber,
        vehicleType: userData.vehicleType,
        vehicleNumber: userData.vehicleNumber,
        licenseNumber: userData.licenseNumber,
      });
      if (!result.user) throw new Error('Registration succeeded but no user was returned.');
      setCurrentUser(result.user as User);
      setCurrentView(`${role}_dashboard` as PortalView);
      addNotification('Registration Complete!', `Welcome to Bhojj Portal as ${role.toUpperCase()}.`, 'system', role);
      void loadRemoteData();
      return { success: true };
    } catch (error: any) {
      return { success: false, message: error?.message || 'Registration failed.' };
    }
  };


  const logout = () => {
    void bhojjApi.logout().catch(() => undefined);
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_KEYS.USER);
    setCurrentView('customer_dashboard');
    addNotification('Logged Out', 'You have been safely signed out.', 'system');
  };

  // Quick switch for reviewers/testers
  const quickSwitchRole = (role: UserRole) => {
    const demoUser = INITIAL_USERS.find(u => u.role === role) || INITIAL_USERS[0];
    setCurrentUser(demoUser);
    setCurrentView(`${role}_dashboard` as PortalView);
    addNotification('Role Switched', `Switched view to ${role.toUpperCase()} Portal (${demoUser.name})`, 'system', role);
  };

  // Restaurant Actions
  const updateRestaurant = (updated: Restaurant) => {
    void bhojjApi.updateRestaurant({ id: updated.id, name: updated.name, tagline: updated.tagline, cuisine: updated.cuisine, address: updated.address, city: updated.city, phone: updated.phone, email: updated.email, owner_name: updated.ownerName, delivery_time_range: updated.deliveryTimeRange, min_order_amount: updated.minOrderAmount, is_open: updated.isOpen, image: updated.image, fssai_number: updated.fssaiNumber, is_verified: updated.isVerified }).catch((error: any) => addNotification('Kitchen Sync Failed', error?.message || 'Kitchen profile could not be saved.', 'alert', 'restaurant'));
    setRestaurants(prev => prev.map(r => r.id === updated.id ? updated : r));
    addNotification('Kitchen Updated', `${updated.name} profile has been updated.`, 'system', 'restaurant');
  };

  const toggleKitchenStatus = (restaurantId: string) => {
    setRestaurants(prev => prev.map(r => {
      if (r.id === restaurantId) {
        const nextStatus = !r.isOpen;
        addNotification(
          nextStatus ? 'Kitchen is OPEN' : 'Kitchen is CLOSED', 
          `${r.name} is now ${nextStatus ? 'accepting orders' : 'paused from taking orders'}.`,
          'alert',
          'restaurant'
        );
        void bhojjApi.updateRestaurant({ id: r.id, is_open: nextStatus }).catch((error: any) => addNotification('Kitchen Status Sync Failed', error?.message || 'Kitchen status could not be saved.', 'alert', 'restaurant'));
        return { ...r, isOpen: nextStatus };
      }
      return r;
    }));
  };

  // Menu Management
  const addMenuItem = (item: Omit<MenuItem, 'id' | 'rating' | 'reviewsCount'>) => {
    const newItem: MenuItem = {
      ...item,
      id: `menu-${Date.now()}`,
      rating: 5.0,
      reviewsCount: 1,
    };
    setMenuItems(prev => [newItem, ...prev]);
    void bhojjApi.saveMenuItem(newItem).catch((error: any) => addNotification('Menu Sync Failed', error?.message || 'Dish could not be saved on server.', 'alert', 'restaurant'));
    addNotification('Dish Added', `"${item.name}" has been added to your menu!`, 'system', 'restaurant');
  };

  const updateMenuItem = (item: MenuItem) => {
    setMenuItems(prev => prev.map(m => m.id === item.id ? item : m));
    void bhojjApi.saveMenuItem(item).catch((error: any) => addNotification('Menu Sync Failed', error?.message || 'Dish could not be updated on server.', 'alert', 'restaurant'));
    addNotification('Dish Updated', `"${item.name}" updated successfully.`, 'system', 'restaurant');
  };

  const toggleMenuItemStock = (itemId: string) => {
    setMenuItems(prev => prev.map(m => {
      if (m.id === itemId) {
        const newStock = !m.inStock;
        addNotification(
          newStock ? 'Item In Stock' : 'Item Out of Stock',
          `"${m.name}" is now marked as ${newStock ? 'available' : 'sold out'}.`,
          'system',
          'restaurant'
        );
        return { ...m, inStock: newStock };
      }
      return m;
    }));
  };

  const deleteMenuItem = (itemId: string) => {
    setMenuItems(prev => prev.filter(m => m.id !== itemId));
    void bhojjApi.deleteMenuItem(itemId).catch((error: any) => addNotification('Menu Delete Failed', error?.message || 'Dish could not be removed from server.', 'alert', 'restaurant'));
    addNotification('Dish Removed', 'The item was deleted from the menu.', 'system', 'restaurant');
  };

  // Cart Management
  const addToCart = (item: MenuItem, qty: number = 1) => {
    setCart(prev => {
      const existing = prev.find(ci => ci.menuItem.id === item.id);
      if (existing) {
        return prev.map(ci => ci.menuItem.id === item.id ? { ...ci, quantity: ci.quantity + qty } : ci);
      }
      return [...prev, { menuItem: item, quantity: qty }];
    });
    addNotification('Added to Bhojj Thali', `${item.name} added to cart`, 'order', 'customer');
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(ci => ci.menuItem.id !== itemId));
  };

  const updateCartQuantity = (itemId: string, delta: number) => {
    setCart(prev => {
      return prev
        .map(ci => {
          if (ci.menuItem.id === itemId) {
            const newQty = ci.quantity + delta;
            return newQty > 0 ? { ...ci, quantity: newQty } : null;
          }
          return ci;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const clearCart = () => setCart([]);

  // Digital Wallet Operations
  const addFundsToWallet = (amount: number, paymentMethod: string, note?: string) => {
    if (amount <= 0) {
      return { 
        success: false, 
        message: 'Please enter an amount greater than ₹0.', 
        transaction: {
          id: '',
          type: 'credit',
          amount: 0,
          description: '',
          timestamp: '',
          status: 'failed'
        } as WalletTransaction 
      };
    }

    const txId = `WTX-${Math.floor(10000 + Math.random() * 90000)}`;
    const newBal = walletBalance + amount;

    const newTx: WalletTransaction = {
      id: txId,
      type: 'credit',
      amount,
      description: note || `Added funds via ${paymentMethod}`,
      timestamp: 'Just now',
      status: 'success',
      paymentMethod,
      referenceId: `REF-${Math.floor(100000 + Math.random() * 900000)}`,
      closingBalance: newBal,
    };

    setWalletBalance(newBal);
    setWalletTransactions(prev => [newTx, ...prev]);

    soundEffects.playWalletSuccess();
    addNotification(
      'Wallet Top-Up Successful!',
      `₹${amount} added successfully via ${paymentMethod}. New Wallet Balance: ₹${newBal}.`,
      'system',
      'customer'
    );

    return { success: true, message: `Successfully added ₹${amount} to Bhojj Wallet!`, transaction: newTx };
  };

  const deductWalletFunds = (amount: number, orderId: string, description?: string): boolean => {
    if (walletBalance < amount) {
      return false;
    }

    const newBal = Math.max(0, walletBalance - amount);
    const txId = `WTX-${Math.floor(10000 + Math.random() * 90000)}`;

    const newTx: WalletTransaction = {
      id: txId,
      type: 'debit',
      amount,
      description: description || `Payment for Order #${orderId}`,
      timestamp: 'Just now',
      status: 'success',
      paymentMethod: 'Bhojj 1-Click Pay',
      orderId,
      closingBalance: newBal,
    };

    setWalletBalance(newBal);
    setWalletTransactions(prev => [newTx, ...prev]);
    soundEffects.playWalletPayment();

    return true;
  };

  const refundToWallet = (amount: number, orderId: string, reason?: string) => {
    const newBal = walletBalance + amount;
    const txId = `WTX-${Math.floor(10000 + Math.random() * 90000)}`;

    const newTx: WalletTransaction = {
      id: txId,
      type: 'credit',
      amount,
      description: reason ? `Refund for Order #${orderId}: ${reason}` : `Instant Refund for Order #${orderId}`,
      timestamp: 'Just now',
      status: 'success',
      paymentMethod: 'Instant Wallet Refund',
      orderId,
      closingBalance: newBal,
    };

    setWalletBalance(newBal);
    setWalletTransactions(prev => [newTx, ...prev]);
    soundEffects.playWalletSuccess();

    addNotification(
      'Instant Wallet Refund Credited',
      `₹${amount} refunded to your Bhojj Wallet for Order #${orderId}.`,
      'system',
      'customer'
    );
  };

  // Orders
  const placeOrder = (details: {
    deliveryAddress: string;
    paymentMethod: 'UPI' | 'Cash on Delivery' | 'Card / NetBanking' | 'Bhojj Wallet';
    discount?: number;
    customerId?: string;
    customerName?: string;
    customerPhone?: string;
    restaurantId?: string;
    restaurantName?: string;
    items?: any[];
    subtotal?: number;
    deliveryFee?: number;
    tax?: number;
    totalAmount?: number;
    status?: OrderStatus;
    orderTime?: string;
    estimatedDeliveryTime?: string;
    paymentStatus?: 'Paid' | 'Pending (COD)';
    deliveryCoordinates?: Coordinates;
    restaurantCoordinates?: Coordinates;
  }) => {
    if (cart.length === 0 && (!details.items || details.items.length === 0)) return null;

    const calcSubtotal = cart.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
    const subtotal = details.subtotal ?? calcSubtotal;
    const deliveryFee = details.deliveryFee ?? (subtotal > 299 ? 0 : 30);
    const tax = details.tax ?? Math.round(subtotal * 0.05); // 5% GST
    const discount = details.discount ?? 0;
    const totalAmount = details.totalAmount ?? Math.max(0, subtotal + deliveryFee + tax - discount);

    if (details.paymentMethod === 'Bhojj Wallet') {
      if (walletBalance < totalAmount) {
        addNotification(
          'Wallet Balance Insufficient',
          `Order requires ₹${totalAmount}, but your wallet balance is ₹${walletBalance}. Please top up your wallet.`,
          'system',
          'customer'
        );
        return null;
      }
    }

    const firstRestId = details.restaurantId || (cart[0] ? cart[0].menuItem.restaurantId : 'rest-1');
    const restObj = restaurants.find(r => r.id === firstRestId);
    const firstRestName = restObj?.name || '';
    const restName = details.restaurantName || (restObj ? restObj.name : 'Bhojj Kitchen Partner');

    // Generate random 4-digit OTP for delivery verification
    const randomOtp = Math.floor(1000 + Math.random() * 9000).toString();
    const orderId = `ORD-${Math.floor(7000 + Math.random() * 3000)}`;

    if (details.paymentMethod === 'Bhojj Wallet') {
      deductWalletFunds(totalAmount, orderId, `1-Click Checkout for Order #${orderId}`);
    }

    const newOrder: Order = {
      id: orderId,
      customerId: details.customerId || currentUser?.id || 'guest-user',
      customerName: details.customerName || currentUser?.name || 'Priya Sharma',
      customerPhone: details.customerPhone || currentUser?.phone || '+91 98765 43210',
      deliveryAddress: details.deliveryAddress,
      restaurantId: firstRestId,
      restaurantName: restName,
      items: details.items || cart.map(ci => ({
        id: ci.menuItem.id,
        name: ci.menuItem.name,
        price: ci.menuItem.price,
        quantity: ci.quantity,
        isVeg: ci.menuItem.isVeg,
      })),
      subtotal,
      deliveryFee,
      tax,
      discount,
      totalAmount,
      status: details.status || 'placed',
      orderTime: details.orderTime || 'Just now',
      estimatedDeliveryTime: details.estimatedDeliveryTime || 'In 25-30 mins',
      paymentMethod: details.paymentMethod,
      paymentStatus: details.paymentMethod === 'Cash on Delivery' ? 'Pending (COD)' : 'Paid',
      walletAmountUsed: details.paymentMethod === 'Bhojj Wallet' ? totalAmount : 0,
      otp: randomOtp,
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    setAppliedCoupon(null);

    addNotification(
      'New Order Placed!',
      details.paymentMethod === 'Bhojj Wallet'
        ? `Order #${newOrder.id} booked with Bhojj Wallet (₹${totalAmount} debited). OTP: ${randomOtp}`
        : `Order #${newOrder.id} for ₹${totalAmount} has been sent to ${restName}. OTP: ${randomOtp}`,
      'order',
      'customer'
    );
    addNotification(
      'New Incoming Order!',
      `Incoming Order #${newOrder.id} (${newOrder.items.length} items) for ₹${totalAmount}`,
      'order',
      'restaurant'
    );

    // Instant real-time broadcast alert for restaurant
    realtimeService.broadcastAlert({
      id: `alert-new-${newOrder.id}-${Date.now()}`,
      type: 'new_order',
      title: '🚨 LIVE NEW ORDER RECEIVED!',
      message: `Order #${newOrder.id} received: ${newOrder.items.length} items (₹${totalAmount}) for ${details.deliveryAddress}`,
      orderId: newOrder.id,
      order: newOrder,
      timestamp: Date.now(),
      targetRole: 'restaurant',
      targetRestaurantId: firstRestId,
      soundAlert: true
    });

    // Persist the same order to the central PHP/MySQL backend. The existing UI remains
    // optimistic so the current design/checkout interaction does not change.
    if (currentUser?.role === 'customer') {
      void bhojjApi.createOrder({
        deliveryAddress: details.deliveryAddress,
        paymentMethod: details.paymentMethod,
        discount,
        customerId: currentUser.id,
        customerName: details.customerName || currentUser.name,
        customerPhone: details.customerPhone || currentUser.phone,
        restaurantId: details.restaurantId || firstRestId,
        restaurantName: details.restaurantName || firstRestName,
        items: newOrder.items.map((i: any) => ({
          id: i.id,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          isVeg: i.isVeg ?? i.menuItem?.isVeg ?? true,
        })),
        subtotal,
        deliveryFee,
        tax,
        totalAmount,
        estimatedDeliveryTime: details.estimatedDeliveryTime,
        deliveryCoordinates: details.deliveryCoordinates,
        restaurantCoordinates: details.restaurantCoordinates || restObj?.coordinates,
      }).then(result => {
        if (result.order) {
          setOrders(prev => prev.map(o => o.id === newOrder.id ? result.order as Order : o));
        }
        void loadRemoteData();
      }).catch((error: any) => {
        addNotification('Order Sync Failed', error?.message || 'Order could not be saved to Bhojj server.', 'system');
      });
    }

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    void bhojjApi.updateOrderStatus(orderId, status).then(result => {
      if (result.order) setOrders(prev => prev.map(o => o.id === orderId ? result.order as Order : o));
      if ((status === 'ready_for_pickup' || status === 'out_for_delivery') && (currentUser?.role === 'restaurant' || currentUser?.role === 'admin')) {
        void bhojjApi.autoAssignRider(orderId).then(assignResult => {
          if (assignResult.order) setOrders(prev => prev.map(o => o.id === orderId ? assignResult.order as Order : o));
          void loadRemoteData();
        }).catch(() => undefined);
      }
    }).catch((error: any) => addNotification('Order Update Failed', error?.message || 'Server rejected this status change.', 'system'));
    let updatedOrderObj: Order | undefined;

    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        let updateMsg = `Order #${orderId} status changed to ${status.replace(/_/g, ' ').toUpperCase()}`;
        if (status === 'accepted') updateMsg = `Kitchen accepted order #${orderId}. Preparing food now in pure cow ghee!`;
        if (status === 'preparing') updateMsg = `Chef is preparing your fresh Satvik delicacies for order #${orderId}.`;
        if (status === 'ready_for_pickup') updateMsg = `Order #${orderId} is packed & ready for delivery partner pickup.`;
        if (status === 'out_for_delivery') updateMsg = `Rider picked up order #${orderId} and is en-route to customer!`;
        if (status === 'delivered') updateMsg = `Order #${orderId} was delivered successfully! Shubh Bhojan!`;

        addNotification('Order Status Update', updateMsg, 'order');
        updatedOrderObj = { ...order, status };
        return updatedOrderObj;
      }
      return order;
    }));

    if (updatedOrderObj) {
      realtimeService.broadcastAlert({
        id: `alert-status-${orderId}-${Date.now()}`,
        type: 'delivery_update',
        title: `🛵 Order #${orderId}: ${
          status === 'accepted' ? 'Accepted by Kitchen' :
          status === 'preparing' ? 'Food Being Cooked' :
          status === 'ready_for_pickup' ? 'Ready for Pickup' :
          status === 'out_for_delivery' ? 'Out for Delivery' :
          status === 'delivered' ? 'Delivered!' :
          status.replace(/_/g, ' ').toUpperCase()
        }`,
        message: status === 'accepted' ? 'Kitchen accepted your order and started preparations.' :
                 status === 'preparing' ? 'Chef is cooking your order with pure ingredients.' :
                 status === 'ready_for_pickup' ? 'Food packed and waiting for rider pickup.' :
                 status === 'out_for_delivery' ? `Rider is on the way! Share OTP ${(updatedOrderObj as Order).otp} upon arrival.` :
                 status === 'delivered' ? 'Order delivered successfully! Thank you for dining with Bhojj.' :
                 `Status updated to ${status.replace(/_/g, ' ').toUpperCase()}`,
        orderId,
        order: updatedOrderObj,
        timestamp: Date.now(),
        targetRole: 'customer',
        targetCustomerId: (updatedOrderObj as Order).customerId,
        soundAlert: true
      });
    }
  };

  const assignRiderToOrder = (orderId: string, riderId: string) => {
    const rider = riders.find(r => r.userId === riderId || r.id === riderId);
    void bhojjApi.assignRider(orderId, rider?.userId || riderId).then(async result => {
      if (result.order) setOrders(prev => prev.map(o => o.id === orderId ? result.order as Order : o));
      else await loadRemoteData();
      addNotification('Delivery Partner Assigned', `Order #${orderId} is now assigned to ${rider?.name || 'Rider'}.`, 'order');
    }).catch((error: any) => addNotification('Assignment Failed', error?.message || 'Server rejected rider assignment.', 'alert'));
  };

  const acceptDeliveryRun = (orderId: string, riderUserId: string) => {
    void bhojjApi.acceptDelivery(orderId).then(async result => {
      if (result.order) setOrders(prev => prev.map(o => o.id === orderId ? result.order as Order : o));
      else await loadRemoteData();
      addNotification('Run Accepted!', `You accepted order #${orderId}. Head to restaurant for food pickup.`, 'order', 'delivery');
    }).catch((error: any) => addNotification('Run Acceptance Failed', error?.message || 'Unable to accept delivery run.', 'alert', 'delivery'));
  };

  const completeDeliveryWithOtp = (orderId: string, enteredOtp: string) => {
    const targetOrder = orders.find(o => o.id === orderId);
    if (!targetOrder) return { success: false, message: 'Order not found' };

    if (targetOrder.otp && targetOrder.otp.trim() !== enteredOtp.trim()) {
      return { success: false, message: 'Incorrect OTP! Please ask customer for the 4-digit PIN.' };
    }

    // Server is authoritative: never mark a delivery complete locally until
    // PHP verifies the OTP and commits the delivered state.
    void bhojjApi.completeDelivery(orderId, enteredOtp).then(async result => {
      if (result.order) {
        setOrders(prev => prev.map(o => o.id === orderId ? result.order as Order : o));
      } else {
        await loadRemoteData();
      }
      const deliveryEarning = 60 + Math.floor(Math.random() * 25);
      addNotification('Delivery Completed!', `Order #${orderId} delivered successfully! +₹${deliveryEarning} credited.`, 'earnings', 'delivery');
      addNotification('Order Delivered!', `Your Bhojj order #${orderId} has arrived! Enjoy your delicious meal.`, 'order', 'customer');
    }).catch((error: any) => {
      addNotification('Delivery Completion Failed', error?.message || 'Server rejected delivery OTP.', 'alert', 'delivery');
    });

    return { success: true, message: 'Delivery verification submitted to server.' };
  };

  const rateOrder = (orderId: string, rating: number, feedback: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, rating, feedback } : o));
    addNotification('Rating Submitted', `Thank you for rating order #${orderId} (${rating} Stars)!`, 'system', 'customer');
  };

  // Coupons System Methods
  const applyCouponCode = (code: string, cartSubtotal: number) => {
    const normalized = code.trim().toUpperCase();
    const coupon = coupons.find(c => c.code.toUpperCase() === normalized && c.isActive);

    if (!coupon) {
      return { 
        success: false, 
        discount: 0, 
        message: `Invalid or expired coupon code "${code}". Try BHOJJ50 or RADHA25.` 
      };
    }

    if (cartSubtotal < coupon.minOrderAmount) {
      return {
        success: false,
        discount: 0,
        message: `Cart total (₹${cartSubtotal}) must be at least ₹${coupon.minOrderAmount} to use "${coupon.code}". Add ₹${coupon.minOrderAmount - cartSubtotal} more items.`
      };
    }

    const discountAmount = calculateCouponDiscount(coupon, cartSubtotal);
    setAppliedCoupon({ coupon, discountAmount });
    soundEffects.playCouponSuccess();

    return {
      success: true,
      discount: discountAmount,
      message: `Coupon "${coupon.code}" applied! You saved ₹${discountAmount}.`,
      coupon
    };
  };

  const removeAppliedCoupon = () => {
    setAppliedCoupon(null);
  };

  const addCoupon = (coupon: Coupon) => {
    setCoupons(prev => [coupon, ...prev]);
    addNotification('Coupon Created', `Promo code ${coupon.code} is now active!`, 'system', 'admin');
  };

  const updateCoupon = (coupon: Coupon) => {
    setCoupons(prev => prev.map(c => c.id === coupon.id ? coupon : c));
    addNotification('Coupon Updated', `Promo code ${coupon.code} updated.`, 'system', 'admin');
  };

  const deleteCoupon = (couponId: string) => {
    setCoupons(prev => prev.filter(c => c.id !== couponId));
    if (appliedCoupon?.coupon.id === couponId) {
      setAppliedCoupon(null);
    }
  };

  const toggleCouponStatus = (couponId: string) => {
    setCoupons(prev => prev.map(c => c.id === couponId ? { ...c, isActive: !c.isActive } : c));
  };

  // Real-time Alerts and Order Simulation
  const dismissAlert = (alertId: string) => {
    setActiveAlerts(prev => prev.filter(a => a.id !== alertId));
  };

  const clearAllAlerts = () => {
    setActiveAlerts([]);
  };

  const simulateIncomingOrderForRestaurant = (restaurantId: string) => {
    const rest = restaurants.find(r => r.id === restaurantId) || restaurants[0];
    const orderItemsPool = menuItems.filter(m => m.restaurantId === rest.id);
    const selectedItems = orderItemsPool.length > 0 ? orderItemsPool.slice(0, 2) : menuItems.slice(0, 2);
    const subtotal = selectedItems.reduce((s, i) => s + i.price, 0) || 280;
    const orderId = `ORD-${Math.floor(7500 + Math.random() * 2000)}`;

    const pilgrimNames = ['Acharya Raman', 'Shruti Verma', 'Gaurav Das', 'Meera Trivedi', 'Kamlesh Sharma'];
    const pilgrimAshrams = [
      'Room 204, Radha Govind Ashram, Dan Ghati Marg, Goverdhan',
      'Govind Dham Dharamshala, Near Mukharvind, Jatipura',
      'Anand Ashram Guest House, Bhakt Niwas, Radha Kund',
      'Shri Giriraj Parikrama Marg, Ashram Gate 3, Goverdhan'
    ];

    const randomName = pilgrimNames[Math.floor(Math.random() * pilgrimNames.length)];
    const randomAddress = pilgrimAshrams[Math.floor(Math.random() * pilgrimAshrams.length)];

    const testOrder: Order = {
      id: orderId,
      customerId: `cust-sim-${Date.now()}`,
      customerName: randomName,
      customerPhone: '+91 98765 ' + Math.floor(10000 + Math.random() * 90000),
      deliveryAddress: randomAddress,
      restaurantId: rest.id,
      restaurantName: rest.name,
      items: selectedItems.map(i => ({
        id: i.id,
        name: i.name,
        price: i.price,
        quantity: 1,
        isVeg: i.isVeg
      })),
      subtotal,
      deliveryFee: 30,
      tax: Math.round(subtotal * 0.05),
      discount: 0,
      totalAmount: subtotal + 30 + Math.round(subtotal * 0.05),
      status: 'placed',
      orderTime: 'Just now',
      estimatedDeliveryTime: 'In 25-30 mins',
      paymentMethod: 'UPI',
      paymentStatus: 'Paid',
      otp: `${Math.floor(1000 + Math.random() * 9000)}`
    };

    setOrders(prev => [testOrder, ...prev]);

    realtimeService.broadcastAlert({
      id: `alert-sim-incoming-${Date.now()}`,
      type: 'new_order',
      title: `🔔 New Order Received: #${testOrder.id}!`,
      message: `${testOrder.customerName} ordered ${testOrder.items.length} items (₹${testOrder.totalAmount}) for ${testOrder.deliveryAddress}`,
      orderId: testOrder.id,
      order: testOrder,
      timestamp: Date.now(),
      targetRole: 'restaurant',
      targetRestaurantId: rest.id,
      soundAlert: true
    });
  };

  const simulateOrderProgression = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    let nextStatus: OrderStatus = 'accepted';
    if (order.status === 'placed') nextStatus = 'accepted';
    else if (order.status === 'accepted') nextStatus = 'preparing';
    else if (order.status === 'preparing') nextStatus = 'ready_for_pickup';
    else if (order.status === 'ready_for_pickup') nextStatus = 'out_for_delivery';
    else if (order.status === 'out_for_delivery') nextStatus = 'delivered';
    else return;

    updateOrderStatus(orderId, nextStatus);
  };

  // Delivery Rider duty
  const toggleRiderDuty = (riderUserId?: string) => {
    const targetId = riderUserId || currentUser?.id;
    const existing = riders.find(r => r.userId === targetId);
    if (existing) void bhojjApi.toggleRiderDuty(!existing.isOnline).catch((error: any) => addNotification('Duty Update Failed', error?.message || 'Unable to update duty status.', 'alert', 'delivery'));
    setRiders(prev => prev.map(r => {
      if (r.userId === targetId) {
        const nextStatus = !r.isOnline;
        addNotification(
          nextStatus ? 'Duty Status: ONLINE' : 'Duty Status: OFFLINE',
          nextStatus ? 'You are now visible on radar for delivery orders.' : 'You will not receive new delivery tasks.',
          'system',
          'delivery'
        );
        return { ...r, isOnline: nextStatus, status: nextStatus ? 'Available' : 'Offline' };
      }
      return r;
    }));
  };

  // Tiffin
  const createTiffinSubscription = (sub: Omit<TiffinSubscription, 'id'>) => {
    const newSub: TiffinSubscription = {
      ...sub,
      id: `TIF-${Math.floor(100 + Math.random() * 900)}`,
    };
    setTiffinSubscriptions(prev => [newSub, ...prev]);
    addNotification('Tiffin Subscription Activated!', `Your ${sub.planName} is active for ${sub.mealType}.`, 'system', 'customer');
  };

  // Admin approvals
  const updateRestaurantVerification = (restaurantId: string, isVerified: boolean) => {
    void bhojjApi.adminVerifyRestaurant(restaurantId, isVerified).catch((error: any) => addNotification('Verification Sync Failed', error?.message || 'Unable to update restaurant verification.', 'alert', 'admin'));
    setRestaurants(prev => prev.map(r => r.id === restaurantId ? { ...r, isVerified } : r));
    addNotification(
      isVerified ? 'Restaurant Approved' : 'Restaurant Suspended',
      `Kitchen verification status updated.`,
      'alert',
      'admin'
    );
  };

  const updateRiderVerification = (riderId: string, isVerified: boolean) => {
    void bhojjApi.adminVerifyRider(riderId, isVerified).catch((error: any) => addNotification('Verification Sync Failed', error?.message || 'Unable to update rider verification.', 'alert', 'admin'));
    setRiders(prev => prev.map(r => r.id === riderId ? { ...r, isVerified } : r));
    addNotification(
      isVerified ? 'Rider Approved' : 'Rider Suspended',
      `Rider verification status updated.`,
      'alert',
      'admin'
    );
  };

  const updateRiderProfile = (updatedRider: DeliveryRiderProfile) => {
    void bhojjApi.updateRiderProfile({ name: updatedRider.name, phone: updatedRider.phone, vehicle_type: updatedRider.vehicleType, vehicle_number: updatedRider.vehicleNumber, license_number: updatedRider.licenseNumber, payout_upi_id: updatedRider.payoutUpiId, shift_preference: updatedRider.shiftPreference, navigation_app: updatedRider.navigationApp }).catch((error: any) => addNotification('Rider Profile Sync Failed', error?.message || 'Rider profile could not be saved.', 'alert', 'delivery'));
    setRiders(prev => prev.map(r => (r.id === updatedRider.id || r.userId === updatedRider.userId) ? updatedRider : r));
    // Also keep currentUser in sync if this rider is logged in
    if (currentUser && (currentUser.id === updatedRider.userId || currentUser.phone === updatedRider.phone)) {
      const updatedUser: User = {
        ...currentUser,
        name: updatedRider.name,
        phone: updatedRider.phone,
        alternatePhone: updatedRider.alternatePhone,
        address: updatedRider.address || currentUser.address,
        vehicleType: updatedRider.vehicleType as any,
        vehicleNumber: updatedRider.vehicleNumber,
        licenseNumber: updatedRider.licenseNumber,
        upiId: updatedRider.payoutUpiId || currentUser.upiId,
        shiftPreference: updatedRider.shiftPreference || currentUser.shiftPreference,
      };
      setCurrentUser(updatedUser);
      setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    }
    addNotification('Rider Profile Saved', 'Your official details and preferences have been updated.', 'system', 'delivery');
  };

  // Master User Management (Super Admin)
  const addUser = (user: User) => {
    setUsers(prev => [user, ...prev]);
    addNotification('User Created', `Added ${user.name} (${user.role.toUpperCase()}) to system.`, 'system', 'admin');
  };

  const updateUser = (updatedUser: User) => {
    void bhojjApi.adminUpdateUser(updatedUser).catch((error: any) => addNotification('User Sync Failed', error?.message || 'User changes could not be saved.', 'alert', 'admin'));
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    if (currentUser?.id === updatedUser.id) {
      setCurrentUser(updatedUser);
    }
    // Sync restaurant owner details if linked
    if (updatedUser.restaurantId) {
      setRestaurants(prev => prev.map(r => {
        if (r.id === updatedUser.restaurantId) {
          return {
            ...r,
            ownerName: updatedUser.name || r.ownerName,
            phone: updatedUser.phone || r.phone,
            email: updatedUser.email || r.email,
            address: updatedUser.address || r.address,
          };
        }
        return r;
      }));
    }
    addNotification('Profile Saved', `Account details for ${updatedUser.name} updated successfully.`, 'system', updatedUser.role);
  };

  const deleteUser = (userId: string) => {
    void bhojjApi.adminDeleteUser(userId).catch((error: any) => addNotification('User Delete Failed', error?.message || 'User could not be deactivated.', 'alert', 'admin'));
    setUsers(prev => prev.filter(u => u.id !== userId));
    addNotification('User Removed', 'User account was deleted from platform.', 'alert', 'admin');
  };

  const switchUser = (user: User | null, targetView?: PortalView) => {
    setCurrentUser(user);
    if (targetView) {
      setCurrentView(targetView);
    } else if (user) {
      setCurrentView(`${user.role}_dashboard` as PortalView);
    } else {
      setCurrentView('customer_dashboard');
    }
    addNotification('Portal Switch', `Switched session to ${user ? user.name : 'Guest Visitor'}`, 'system');
  };

  // Restaurant Management
  const addRestaurant = (restaurant: Restaurant) => {
    void bhojjApi.createRestaurant(restaurant).catch((error: any) => addNotification('Kitchen Sync Failed', error?.message || 'Kitchen could not be created on server.', 'alert', 'admin'));
    setRestaurants(prev => [restaurant, ...prev]);
    addNotification('Kitchen Added', `Added kitchen partner "${restaurant.name}"`, 'system', 'admin');
  };

  const deleteRestaurant = (restaurantId: string) => {
    setRestaurants(prev => prev.filter(r => r.id !== restaurantId));
    addNotification('Kitchen Removed', 'Kitchen partner removed from platform.', 'alert', 'admin');
  };

  // CMS: Hero Slides Management
  const updateHeroSlide = (updated: HeroSlide) => {
    const next = heroSlides.map(s => s.id === updated.id ? updated : s);
    setHeroSlides(next);
    void bhojjApi.updateCms({ heroSlides: next }).catch((error: any) => addNotification('CMS Sync Failed', error?.message || 'Hero slide could not be saved.', 'alert', 'admin'));
    addNotification('Slide Updated', `Updated slide "${updated.title}"`, 'system', 'admin');
  };

  const addHeroSlide = (newSlide: HeroSlide) => {
    const next = [newSlide, ...heroSlides];
    setHeroSlides(next);
    void bhojjApi.updateCms({ heroSlides: next }).catch((error: any) => addNotification('CMS Sync Failed', error?.message || 'Hero slide could not be saved.', 'alert', 'admin'));
    addNotification('Slide Added', `Added new hero slide "${newSlide.title}"`, 'system', 'admin');
  };

  const deleteHeroSlide = (slideId: string) => {
    const next = heroSlides.filter(s => s.id !== slideId);
    setHeroSlides(next);
    void bhojjApi.updateCms({ heroSlides: next }).catch((error: any) => addNotification('CMS Sync Failed', error?.message || 'Hero slide could not be removed.', 'alert', 'admin'));
    addNotification('Slide Removed', 'Hero slide deleted successfully', 'system', 'admin');
  };

  const resetHeroSlides = () => {
    setHeroSlides(DEFAULT_HERO_SLIDES);
    addNotification('Slides Reset', 'Restored default hero slides', 'system', 'admin');
  };

  // CMS: Header & Announcement Management
  const updateHeaderConfig = (partial: Partial<SiteHeaderConfig>) => {
    setHeaderConfig(prev => ({ ...prev, ...partial }));
    void bhojjApi.updateCms({ headerConfig: { ...headerConfig, ...partial } }).catch((error: any) => addNotification('CMS Sync Failed', error?.message || 'Header settings could not be saved.', 'alert', 'admin'));
    addNotification('Header Updated', 'Header & announcement settings saved', 'system', 'admin');
  };

  // CMS: Footer Management
  const updateFooterConfig = (partial: Partial<SiteFooterConfig>) => {
    setFooterConfig(prev => ({ ...prev, ...partial }));
    void bhojjApi.updateCms({ footerConfig: { ...footerConfig, ...partial } }).catch((error: any) => addNotification('CMS Sync Failed', error?.message || 'Footer settings could not be saved.', 'alert', 'admin'));
    addNotification('Footer Updated', 'Footer details & contacts saved', 'system', 'admin');
  };

  // CMS: Categories Management
  const updateCategory = (cat: CategoryItem) => {
    const next = categoriesList.map(c => c.id === cat.id ? cat : c);
    setCategoriesList(next);
    void bhojjApi.updateCms({ categories: next }).catch((error: any) => addNotification('CMS Sync Failed', error?.message || 'Category could not be saved.', 'alert', 'admin'));
    addNotification('Category Updated', `Category "${cat.name}" updated`, 'system', 'admin');
  };

  const addCategory = (cat: CategoryItem) => {
    const next = [...categoriesList, cat];
    setCategoriesList(next);
    void bhojjApi.updateCms({ categories: next }).catch((error: any) => addNotification('CMS Sync Failed', error?.message || 'Category could not be created.', 'alert', 'admin'));
    addNotification('Category Added', `Category "${cat.name}" created`, 'system', 'admin');
  };

  const deleteCategory = (catId: string) => {
    const next = categoriesList.filter(c => c.id !== catId);
    setCategoriesList(next);
    void bhojjApi.updateCms({ categories: next }).catch((error: any) => addNotification('CMS Sync Failed', error?.message || 'Category could not be removed.', 'alert', 'admin'));
    addNotification('Category Removed', 'Category removed from home page', 'system', 'admin');
  };

  // Master Portal Control
  const updatePortalConfig = (partial: Partial<PortalControlConfig>) => {
    setPortalConfig(prev => ({ ...prev, ...partial }));
    void bhojjApi.updateCms({ portalConfig: { ...portalConfig, ...partial } }).catch((error: any) => addNotification('CMS Sync Failed', error?.message || 'Portal controls could not be saved.', 'alert', 'admin'));
    addNotification('Portal Controls Updated', 'Platform access and portal settings updated.', 'alert', 'admin');
  };

  const broadcastNotification = (title: string, message: string, type: NotificationItem['type'] = 'system') => {
    addNotification(title, message, type);
  };

  // Zomato Table Booking Workflow Implementation
  const createTableBooking = (bookingData: Omit<TableBooking, 'id' | 'createdAt' | 'status' | 'bookingPin' | 'checkInQrCode'>): TableBooking => {
    const randomPin = Math.floor(1000 + Math.random() * 9000).toString();
    const bookingId = `ZM-BHOJJ-${Math.floor(1000 + Math.random() * 9000)}`;
    
    const newBooking: TableBooking = {
      ...bookingData,
      id: bookingId,
      createdAt: new Date().toISOString(),
      status: 'confirmed',
      bookingPin: randomPin,
      checkInQrCode: `ZM-QR-${randomPin}-${bookingData.restaurantId}`,
    };

    setTableBookings(prev => [newBooking, ...prev]);

    // Audio chime
    try {
      soundEffects.playSuccessChime();
    } catch (e) { /* ignore */ }

    // Real-time notifications
    addNotification(
      'Table Reservation Confirmed!',
      `Table for ${newBooking.guestsCount} at ${newBooking.restaurantName} confirmed for ${newBooking.date} at ${newBooking.timeSlot}. PIN: ${randomPin}`,
      'order',
      'customer'
    );

    addNotification(
      'New Dine-in Table Reservation!',
      `${newBooking.guestsCount} guests (${newBooking.customerName}) arriving on ${newBooking.date} at ${newBooking.timeSlot} (${newBooking.seatingArea}).`,
      'order',
      'restaurant'
    );

    // Broadcast live alert to restaurant
    realtimeService.broadcastAlert({
      id: `alert-booking-${bookingId}-${Date.now()}`,
      type: 'new_order',
      title: '🍽️ LIVE TABLE RESERVATION RECEIVED!',
      message: `Table for ${newBooking.guestsCount} guests booked by ${newBooking.customerName} for ${newBooking.timeSlot} (${newBooking.seatingArea})`,
      orderId: bookingId,
      timestamp: Date.now(),
      targetRole: 'restaurant',
      targetRestaurantId: newBooking.restaurantId,
      soundAlert: true
    });

    return newBooking;
  };

  const updateBookingStatus = (bookingId: string, status: TableBookingStatus, tableNumber?: string) => {
    setTableBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        const updated: TableBooking = {
          ...b,
          status,
          ...(tableNumber ? { tableNumber } : {})
        };

        let statusText = `Booking #${bookingId} is now ${status.replace(/_/g, ' ')}.`;
        if (status === 'ready_for_seating') statusText = `Your table (${tableNumber || updated.tableNumber || 'Assigned'}) at ${b.restaurantName} is sanitized and ready for seating!`;
        if (status === 'seated') statusText = `Welcome to ${b.restaurantName}! You are seated at ${tableNumber || updated.tableNumber || 'your table'}. Enjoy your Satvik feast!`;
        if (status === 'completed') statusText = `Dining completed at ${b.restaurantName}. Thank you for visiting! Shubh Bhojan!`;
        if (status === 'cancelled') statusText = `Table reservation #${bookingId} was cancelled.`;

        addNotification('Table Reservation Update', statusText, 'order');
        return updated;
      }
      return b;
    }));
  };

  const cancelTableBooking = (bookingId: string, reason?: string): boolean => {
    setTableBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          status: 'cancelled',
          cancellationReason: reason || 'Cancelled by guest'
        };
      }
      return b;
    }));

    addNotification(
      'Reservation Cancelled',
      `Table booking #${bookingId} cancelled with zero fee. Table released.`,
      'alert',
      'customer'
    );

    return true;
  };

  const assignTableNumber = (bookingId: string, tableNumber: string) => {
    setTableBookings(prev => prev.map(b => b.id === bookingId ? { ...b, tableNumber } : b));
    addNotification('Table Assigned', `Table ${tableNumber} assigned to reservation #${bookingId}.`, 'system', 'restaurant');
  };

  // Real-time Map & Rider Telemetry methods
  const updateRiderTelemetry = (orderId: string, telemetry: Partial<RiderLiveTelemetry>) => {
    setRiderTelemetries(prev => {
      const existing = prev[orderId] || {
        orderId,
        riderId: 'user-rider-1',
        riderName: 'Rajesh Kumar',
        riderPhone: '+91 91234 56789',
        location: { lat: 27.5098, lng: 77.4715 },
        heading: 42,
        speedKmh: 28,
        accuracyMeters: 4,
        updatedAt: 'Just now',
        status: 'on_the_way' as const,
        remainingDistanceKm: 1.4,
        remainingMinutes: 6,
        routeProgressPercent: 50,
        isLiveGps: false,
        batteryLevel: 88,
      };

      const updated: RiderLiveTelemetry = {
        ...existing,
        ...telemetry,
        updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      };

      // Persist live GPS telemetry to PHP/MySQL when this is the active delivery rider.
      if (currentUser?.role === 'delivery' && orderId) {
        void bhojjApi.sendRiderTelemetry(orderId, {
          location: updated.location,
          heading: updated.heading,
          speedKmh: updated.speedKmh,
          accuracy: updated.accuracyMeters,
          batteryLevel: updated.batteryLevel,
          status: updated.status,
        }).catch(() => undefined);
      }

      // Broadcast to other open browser tabs / portals
      realtimeService.broadcastRiderLocation(updated);

      return {
        ...prev,
        [orderId]: updated,
      };
    });
  };

  const getRiderTelemetry = (orderId: string): RiderLiveTelemetry | null => {
    return riderTelemetries[orderId] || null;
  };

  const resetAllDemoData = () => {
    localStorage.clear();
    setRestaurants(INITIAL_RESTAURANTS);
    setMenuItems(INITIAL_MENU_ITEMS);
    setOrders(INITIAL_ORDERS);
    setRiders(INITIAL_RIDERS);
    setRiderTelemetries(INITIAL_RIDER_TELEMETRIES);
    setTiffinSubscriptions(INITIAL_TIFFIN_SUBSCRIPTIONS);
    setUsers(INITIAL_USERS);
    setHeroSlides(DEFAULT_HERO_SLIDES);
    setHeaderConfig(DEFAULT_HEADER_CONFIG);
    setFooterConfig(DEFAULT_FOOTER_CONFIG);
    setCategoriesList(DEFAULT_CATEGORIES);
    setPortalConfig(DEFAULT_PORTAL_CONFIG);
    setWalletBalance(INITIAL_WALLET_BALANCE);
    setWalletTransactions(INITIAL_WALLET_TRANSACTIONS);
    setTableBookings(INITIAL_TABLE_BOOKINGS);
    setCurrentUser(INITIAL_USERS[0]);
    setCurrentView('customer_dashboard');
    setCart([]);
    addNotification('Reset Complete', 'All demo data & CMS content reset to initial state.', 'system');
  };

  const currentRiderProfile = riders.find(r => r.userId === currentUser?.id);

  return (
    <AppContext.Provider value={{
      currentUser,
      currentView,
      setSessionUser: setCurrentUser,
      setCurrentView,
      login,
      register,
      logout,
      quickSwitchRole,
      users,
      addUser,
      updateUser,
      deleteUser,
      switchUser,
      restaurants,
      updateRestaurant,
      addRestaurant,
      deleteRestaurant,
      toggleKitchenStatus,
      menuItems,
      addMenuItem,
      updateMenuItem,
      toggleMenuItemStock,
      deleteMenuItem,
      orders,
      updateOrderStatus,
      assignRiderToOrder,
      completeDeliveryWithOtp,
      rateOrder,
      cart,
      isCartOpen,
      setIsCartOpen,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      placeOrder,
      walletBalance,
      walletTransactions,
      addFundsToWallet,
      deductWalletFunds,
      refundToWallet,
      coupons,
      appliedCoupon,
      applyCouponCode,
      removeAppliedCoupon,
      addCoupon,
      updateCoupon,
      deleteCoupon,
      toggleCouponStatus,
      activeAlerts,
      dismissAlert,
      clearAllAlerts,
      simulateIncomingOrderForRestaurant,
      simulateOrderProgression,
      tiffinSubscriptions,
      createTiffinSubscription,
      riders,
      currentRiderProfile,
      toggleRiderDuty,
      acceptDeliveryRun,
      updateRiderProfile,
      riderTelemetries,
      updateRiderTelemetry,
      getRiderTelemetry,
      updateRestaurantVerification,
      updateRiderVerification,
      platformCommissionRate,
      setPlatformCommissionRate,
      notifications,
      markNotificationRead,
      portalModalOpen,
      setPortalModalOpen,
      resetAllDemoData,
      globalSearchQuery,
      setGlobalSearchQuery,
      selectedLocationFilter,
      setSelectedLocationFilter,
      selectedProductForModal,
      setSelectedProductForModal,
      openProductDetails,
      selectedRestaurantForModal,
      setSelectedRestaurantForModal,
      openRestaurantDetails,
      selectedCategoryForModal,
      setSelectedCategoryForModal,
      openCategoryDetails,
      closeAllModals,
      heroSlides,
      updateHeroSlide,
      addHeroSlide,
      deleteHeroSlide,
      resetHeroSlides,
      headerConfig,
      updateHeaderConfig,
      footerConfig,
      updateFooterConfig,
      categoriesList,
      updateCategory,
      addCategory,
      deleteCategory,
      portalConfig,
      updatePortalConfig,
      broadcastNotification,
      tableBookings,
      createTableBooking,
      updateBookingStatus,
      cancelTableBooking,
      assignTableNumber,
      selectedRestaurantForBooking,
      setSelectedRestaurantForBooking,
      openTableBookingModal,
      closeTableBookingModal,
      isTableBookingModalOpen,
    }}>
      {children}
    </AppContext.Provider>
  );

};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
