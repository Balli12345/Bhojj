export type UserRole = 'customer' | 'restaurant' | 'delivery' | 'admin';

export type AuthMode = 'login' | 'register';

export type PortalView = 
  | 'customer_login'
  | 'customer_register'
  | 'customer_dashboard'
  | 'restaurant_login'
  | 'restaurant_register'
  | 'restaurant_dashboard'
  | 'delivery_login'
  | 'delivery_register'
  | 'delivery_dashboard'
  | 'admin_login'
  | 'admin_dashboard';

export interface UserAddress {
  id: string;
  label: 'Home' | 'Ashram / Dharamshala' | 'Hotel / Room' | 'Parikrama Point' | 'Office' | 'Other';
  addressLine: string;
  landmark?: string;
  areaZone?: string;
  city: string;
  phone?: string;
  deliveryInstructions?: string;
  isDefault?: boolean;
}

export interface UserPreferences {
  dietary?: 'satvik' | 'jain' | 'pure-veg';
  spiceLevel?: 'mild' | 'medium' | 'desi-spicy';
  cutleryPreference?: 'dont-send' | 'send-eco-friendly';
  deliveryInstructions?: string;
  receiveWhatsappUpdates?: boolean;
  receiveSmsUpdates?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  approvalStatus?: 'approved' | 'pending';
  avatar?: string;
  createdAt: string;
  // Role specific & extended fields
  restaurantId?: string; // If role === 'restaurant'
  vehicleType?: 'Motorcycle' | 'Scooter' | 'Electric Bike' | 'Bicycle'; // If role === 'delivery'
  vehicleNumber?: string;
  licenseNumber?: string;
  isOnline?: boolean;
  city?: string;
  address?: string;
  alternatePhone?: string;
  emergencyContact?: { name: string; phone: string };
  savedAddresses?: UserAddress[];
  preferences?: UserPreferences;
  dietaryPreference?: 'veg' | 'non-veg' | 'both';
  upiId?: string;
  shiftPreference?: string;
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  mrp?: number;
  category: 'Thali' | 'Curry & Sabzi' | 'Breads' | 'Rice & Biryani' | 'Tiffin Meal' | 'Snacks' | 'Desserts & Drinks' | 'Daily Thali' | 'Daily Meals' | 'Prasad' | 'Pooja Orders' | 'Bhandara';
  isVeg: boolean;
  image: string;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  prepTimeMinutes: number;
}

export interface Restaurant {
  id: string;
  name: string;
  tagline: string;
  cuisine: string;
  address: string;
  city: string;
  rating: number;
  reviewsCount: number;
  isOpen: boolean;
  image: string;
  fssaiNumber: string;
  phone: string;
  email: string;
  ownerName: string;
  deliveryTimeRange: string;
  minOrderAmount: number;
  isVerified: boolean;
  locationZone?: string;
  landmark?: string;
  specialty?: string;
  pureSatvik?: boolean;
  alternatePhone?: string;
  gstNumber?: string;
  prepTimeMinutes?: number;
  autoAcceptOrders?: boolean;
  soundAlerts?: boolean;
  payoutUpiId?: string;
  coordinates?: Coordinates;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface RiderLiveTelemetry {
  orderId: string;
  riderId: string;
  riderName: string;
  riderPhone: string;
  location: Coordinates;
  heading: number; // 0 to 360 degrees
  speedKmh: number;
  accuracyMeters: number;
  updatedAt: string;
  batteryLevel?: number;
  status: 'at_kitchen' | 'picked_up' | 'on_the_way' | 'arriving' | 'reached';
  remainingDistanceKm: number;
  remainingMinutes: number;
  routeProgressPercent: number; // 0 to 100
  isLiveGps?: boolean; // true if streaming from device navigator.geolocation
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  customization?: string;
}

export type OrderStatus = 
  | 'placed' 
  | 'accepted' 
  | 'preparing' 
  | 'ready_for_pickup' 
  | 'out_for_delivery' 
  | 'delivered' 
  | 'cancelled';

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  isVeg: boolean;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  restaurantId: string;
  restaurantName: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  discount: number;
  totalAmount: number;
  status: OrderStatus;
  orderTime: string;
  estimatedDeliveryTime: string;
  paymentMethod: 'UPI' | 'Cash on Delivery' | 'Card / NetBanking' | 'Bhojj Wallet';
  paymentStatus: 'Paid' | 'Pending (COD)';
  walletAmountUsed?: number;
  riderId?: string;
  riderName?: string;
  riderPhone?: string;
  riderVehicle?: string;
  otp: string; // 4-digit code needed by delivery rider to complete delivery
  rating?: number;
  feedback?: string;
  restaurantCoordinates?: Coordinates;
  deliveryCoordinates?: Coordinates;
  riderTelemetry?: RiderLiveTelemetry;
}

export interface TiffinSubscription {
  id: string;
  customerId: string;
  planName: '7-Day Bhojj Daily' | '30-Day Royal Monthly' | 'Office Executive Tiffin';
  mealType: 'Lunch' | 'Dinner' | 'Both Lunch & Dinner';
  cuisineChoice: 'Pure Veg Standard Thali' | 'Deluxe Punjabi Thali' | 'Low-Oil Fitness Thali';
  startDate: string;
  endDate: string;
  status: 'Active' | 'Paused' | 'Expired';
  deliveryAddress: string;
  pricePerMeal: number;
  mealsRemaining: number;
}

export interface DeliveryRiderProfile {
  id: string;
  userId: string;
  name: string;
  phone: string;
  alternatePhone?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  address?: string;
  vehicleType: string;
  vehicleNumber: string;
  licenseNumber?: string;
  rating: number;
  totalTrips: number;
  todayEarnings: number;
  todayTrips: number;
  isOnline: boolean;
  currentOrderId?: string;
  zone: string;
  status: 'Available' | 'On Delivery' | 'Offline';
  isVerified: boolean;
  payoutUpiId?: string;
  shiftPreference?: string;
  navigationApp?: string;
  autoAcceptRadar?: boolean;
}

export interface Coupon {
  id: string;
  code: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'flat';
  discountValue: number; // e.g. 50 for flat ₹50, or 20 for 20%
  minOrderAmount: number;
  maxDiscount?: number; // max cap for percentage discounts, e.g. 100
  badge?: string;
  validTill?: string;
  category?: string;
  terms?: string[];
  isFeatured?: boolean;
  usageCount: number;
  isActive: boolean;
}

export interface RealtimeAlert {
  id: string;
  type: 'new_order' | 'delivery_update' | 'rider_assigned' | 'status_progression' | 'rider_location_update';
  title: string;
  message: string;
  orderId: string;
  order?: Order;
  telemetry?: RiderLiveTelemetry;
  timestamp: number;
  targetRole: UserRole | 'all';
  targetRestaurantId?: string;
  targetCustomerId?: string;
  soundAlert?: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'order' | 'system' | 'earnings' | 'alert';
  read: boolean;
  targetRole?: UserRole;
}

export interface HeroSlide {
  id: string;
  menuId?: string;
  chipLabel: string;
  badge: string;
  timer: string;
  title: string;
  subtitle: string;
  description: string;
  price: number;
  mrp: number;
  savings: number;
  prepTime: string;
  rating: number;
  reviewsCount: string;
  pills: string[];
  cta: string;
  code: string;
  couponText: string;
  image: string;
  category: string;
  isActive: boolean;
}

export interface SiteHeaderConfig {
  announcementText: string;
  announcementBadge: string;
  announcementCode: string;
  helplinePhone: string;
  defaultAshramLocation: string;
  brandName: string;
  brandTagline: string;
}

export interface SiteFooterConfig {
  aboutDescription: string;
  contactAddress: string;
  contactPhone: string;
  contactEmail: string;
  contactTiming: string;
  copyrightText: string;
  socialInstagram: string;
  socialFacebook: string;
  socialYoutube: string;
  featurePurityText: string;
  featureNoOnionText: string;
  featureAshramText: string;
  featureEcoText: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  desc: string;
  badge: string;
  iconName: string;
  isActive: boolean;
}

export interface PortalControlConfig {
  customerPortalEnabled: boolean;
  restaurantPortalEnabled: boolean;
  riderPortalEnabled: boolean;
  maintenanceNotice: string;
  allowGuestCheckout: boolean;
  autoAssignRiders: boolean;
  activeAnnouncementBanner: string;
  showAnnouncementBanner: boolean;
}

export interface WalletTransaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  timestamp: string;
  status: 'success' | 'pending' | 'failed';
  paymentMethod?: string; // e.g. 'UPI (GPay)', 'Debit Card', 'Cashback Bonus', 'Bhojj 1-Click Pay'
  referenceId?: string;
  orderId?: string;
  closingBalance?: number;
}

// Zomato Dining / Table Booking Workflow Types
export type TableBookingStatus = 
  | 'confirmed'
  | 'ready_for_seating'
  | 'seated'
  | 'completed'
  | 'cancelled';

export interface PreorderedItem {
  menuItemId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface TableBooking {
  id: string; // e.g. 'ZM-BHOJJ-7821'
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  restaurantId: string;
  restaurantName: string;
  restaurantAddress: string;
  restaurantImage: string;
  restaurantPhone: string;
  guestsCount: number;
  date: string; // YYYY-MM-DD or formatted 'Today, 12 Sep'
  timeSlot: string; // e.g. '01:30 PM'
  mealPeriod: 'Lunch' | 'Evening Snacks' | 'Dinner';
  seatingArea: 'AC Dining Hall' | 'Traditional Floor Chawki' | 'Giriraj View Rooftop' | 'Family Private Booth';
  occasion?: 'Everyday Dining' | 'Pilgrimage Darshan' | 'Birthday' | 'Anniversary' | 'Family Reunion' | 'Other';
  specialRequests?: string[]; // e.g. ['Strict Jain (No Root Veg)', 'High Chair Needed', 'Quiet Corner Table']
  customNotes?: string;
  offerApplied?: {
    code: string;
    description: string;
    discountPercent?: number;
  };
  preorderedItems?: PreorderedItem[];
  tableNumber?: string; // Assigned by restaurant, e.g. 'Table T-07'
  status: TableBookingStatus;
  createdAt: string;
  bookingPin: string; // 4-digit check-in code
  checkInQrCode?: string; // Simulated QR token
  cancellationReason?: string;
}

