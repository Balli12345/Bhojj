import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Order, OrderStatus } from '../../types';
import { 
  CheckCircle2, 
  Clock, 
  UtensilsCrossed, 
  Bike, 
  CheckCheck, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  Copy, 
  Check, 
  Star, 
  Sparkles, 
  Store, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight, 
  AlertCircle,
  X,
  FileText,
  Flame,
  UserCheck,
  Radio,
  Eye,
  EyeOff
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { LiveDeliveryMap } from '../common/LiveDeliveryMap';

interface VisualOrderTrackerProps {
  order: Order;
  onClose?: () => void;
  compact?: boolean;
}

interface StepDefinition {
  key: string;
  label: string;
  shortLabel: string;
  description: string;
  icon: React.ElementType;
}

const STEPS: StepDefinition[] = [
  {
    key: 'placed',
    label: 'Order Placed & Confirmed',
    shortLabel: 'Placed',
    description: 'Received by kitchen & confirmed',
    icon: CheckCircle2,
  },
  {
    key: 'preparing',
    label: 'Cooking in Pure Ghee',
    shortLabel: 'Preparing',
    description: 'Kitchen is preparing your Satvik food',
    icon: UtensilsCrossed,
  },
  {
    key: 'out_for_delivery',
    label: 'Out for Delivery',
    shortLabel: 'On the Way',
    description: 'Rider picked up & heading to your ashram',
    icon: Bike,
  },
  {
    key: 'delivered',
    label: 'Delivered',
    shortLabel: 'Delivered',
    description: 'Handed over & verified with OTP',
    icon: CheckCheck,
  },
];

export const VisualOrderTracker: React.FC<VisualOrderTrackerProps> = ({ 
  order, 
  onClose,
  compact = false 
}) => {
  const { updateOrderStatus, rateOrder, getRiderTelemetry } = useApp();

  const [copiedOtp, setCopiedOtp] = useState(false);
  const [showLiveMap, setShowLiveMap] = useState(true);
  const [showItemsDetails, setShowItemsDetails] = useState(!compact);
  const [ratingVal, setRatingVal] = useState<number>(order.rating || 5);
  const [feedbackText, setFeedbackText] = useState<string>(order.feedback || '');
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);
  const [ratingSubmitted, setRatingSubmitted] = useState(Boolean(order.rating));

  // Determine current step index (0 to 3)
  const getStepIndex = (status: OrderStatus): number => {
    switch (status) {
      case 'placed':
      case 'accepted':
        return 0;
      case 'preparing':
      case 'ready_for_pickup':
        return 1;
      case 'out_for_delivery':
        return 2;
      case 'delivered':
        return 3;
      case 'cancelled':
        return -1;
      default:
        return 0;
    }
  };

  const currentIndex = getStepIndex(order.status);
  const isCancelled = order.status === 'cancelled';
  const isDelivered = order.status === 'delivered';

  // Copy OTP handler
  const handleCopyOtp = () => {
    navigator.clipboard.writeText(order.otp);
    setCopiedOtp(true);
    setTimeout(() => setCopiedOtp(false), 2000);
  };

  // Quick simulation controls for testing
  const handleSimulateNext = () => {
    if (order.status === 'placed' || order.status === 'accepted') {
      updateOrderStatus(order.id, 'preparing');
    } else if (order.status === 'preparing' || order.status === 'ready_for_pickup') {
      updateOrderStatus(order.id, 'out_for_delivery');
    } else if (order.status === 'out_for_delivery') {
      updateOrderStatus(order.id, 'delivered');
      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) { /* ignore */ }
    }
  };

  const handleRatingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingRating(true);
    rateOrder(order.id, ratingVal, feedbackText);
    setTimeout(() => {
      setIsSubmittingRating(false);
      setRatingSubmitted(true);
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch (e) { /* ignore */ }
    }, 400);
  };

  // Status-specific theme highlights
  const getStageHeaderInfo = () => {
    if (isCancelled) {
      return {
        title: 'Order Cancelled',
        desc: 'This order was cancelled. Any online payment has been refunded to source.',
        badge: 'Cancelled',
        badgeColor: 'bg-red-100 text-red-700 border-red-200',
        etaText: 'Refund Processed',
      };
    }
    switch (currentIndex) {
      case 0:
        return {
          title: 'Order Confirmed by Kitchen',
          desc: `${order.restaurantName} accepted your order and will start cooking shortly.`,
          badge: 'Confirmed',
          badgeColor: 'bg-blue-100 text-blue-700 border-blue-200',
          etaText: order.estimatedDeliveryTime || 'In 25-30 mins',
        };
      case 1:
        return {
          title: 'Cooking in Pure Desi Cow Ghee',
          desc: 'Your Satvik meal is being freshly prepared with sendha namak and zero onion/garlic.',
          badge: 'Preparing',
          badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
          etaText: order.estimatedDeliveryTime || 'In 20-25 mins',
        };
      case 2:
        return {
          title: 'Out for Delivery • On the Way!',
          desc: `${order.riderName || 'Your delivery partner'} is en route to ${order.deliveryAddress}.`,
          badge: 'Out for Delivery',
          badgeColor: 'bg-orange-500 text-white border-orange-600 animate-pulse',
          etaText: order.estimatedDeliveryTime || 'In 10-15 mins',
        };
      case 3:
        return {
          title: 'Delivered • Enjoy Your Satvik Bhojan',
          desc: 'Order handed over successfully. May this sacred meal bring you health & peace! 🙏',
          badge: 'Delivered',
          badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          etaText: 'Delivered Hot & Fresh',
        };
      default:
        return {
          title: 'Tracking Your Order',
          desc: 'Updating status in real-time...',
          badge: 'In Progress',
          badgeColor: 'bg-orange-100 text-orange-800 border-orange-200',
          etaText: order.estimatedDeliveryTime,
        };
    }
  };

  const headerInfo = getStageHeaderInfo();

  return (
    <div className={`bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden transition-all ${compact ? 'p-4 sm:p-5' : 'p-5 sm:p-7'}`}>
      
      {/* 1. TOP HEADER: ORDER ID, STATUS BADGE & CLOSE */}
      <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono font-black text-sm sm:text-base text-slate-900 tracking-tight">
              Order #{order.id}
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-black border ${headerInfo.badgeColor}`}>
              {headerInfo.badge}
            </span>
            {!isDelivered && !isCancelled && (
              <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span>Live GPS Tracking</span>
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5 flex-wrap">
            <Store className="w-3.5 h-3.5 text-orange-600" />
            <span className="font-bold text-slate-800">{order.restaurantName}</span>
            <span className="text-slate-300">•</span>
            <span>Placed {order.orderTime}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Estimated ETA badge */}
          <div className="text-right hidden sm:block">
            <div className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">Estimated Arrival</div>
            <div className="text-xs font-black text-orange-600 flex items-center justify-end gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{headerInfo.etaText}</span>
            </div>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 2. DYNAMIC LIVE STAGE BANNER */}
      <div className={`my-4 p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
        isCancelled 
          ? 'bg-red-50 border-red-200 text-red-900' 
          : isDelivered
            ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
            : currentIndex === 2
              ? 'bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 border-orange-200 text-orange-950'
              : 'bg-slate-50 border-slate-200 text-slate-900'
      }`}>
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
            isCancelled 
              ? 'bg-red-600 text-white'
              : isDelivered 
                ? 'bg-emerald-600 text-white'
                : currentIndex === 2
                  ? 'bg-orange-600 text-white'
                  : 'bg-amber-500 text-white'
          }`}>
            {isCancelled ? (
              <AlertCircle className="w-5 h-5" />
            ) : isDelivered ? (
              <CheckCheck className="w-5 h-5" />
            ) : currentIndex === 2 ? (
              <Bike className="w-5 h-5 animate-bounce" />
            ) : currentIndex === 1 ? (
              <Flame className="w-5 h-5 animate-pulse" />
            ) : (
              <Clock className="w-5 h-5" />
            )}
          </div>
          <div>
            <h4 className="font-extrabold text-sm sm:text-base leading-tight">
              {headerInfo.title}
            </h4>
            <p className="text-xs opacity-85 mt-0.5 max-w-xl">
              {headerInfo.desc}
            </p>
          </div>
        </div>

        {/* Mobile ETA view */}
        <div className="sm:hidden pt-2 border-t border-black/5 flex items-center justify-between text-xs">
          <span className="font-bold text-slate-500">Estimated Arrival:</span>
          <span className="font-black text-orange-600 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {headerInfo.etaText}
          </span>
        </div>
      </div>

      {/* 3. VISUAL PROGRESS STEPPER (4 STAGES) */}
      {!isCancelled && (
        <div className="py-3 sm:py-5">
          <div className="relative">
            
            {/* Background connecting track */}
            <div className="absolute top-4 left-6 right-6 sm:left-10 sm:right-10 h-1.5 bg-slate-200 rounded-full z-0"></div>

            {/* Dynamic Active connecting line fill */}
            <div 
              className="absolute top-4 left-6 sm:left-10 h-1.5 bg-gradient-to-r from-emerald-500 via-orange-500 to-amber-500 rounded-full transition-all duration-500 z-0"
              style={{
                width: `${
                  currentIndex === 0 ? '5%' :
                  currentIndex === 1 ? '38%' :
                  currentIndex === 2 ? '72%' :
                  '90%'
                }`
              }}
            ></div>

            {/* Stepper nodes */}
            <div className="relative z-10 grid grid-cols-4 gap-2 text-center">
              {STEPS.map((step, idx) => {
                const StepIcon = step.icon;
                const isCompleted = currentIndex > idx;
                const isCurrent = currentIndex === idx;
                const isUpcoming = currentIndex < idx;

                return (
                  <div key={step.key} className="flex flex-col items-center">
                    
                    {/* Node circle */}
                    <div 
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-md ${
                        isCompleted 
                          ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 scale-100' 
                          : isCurrent 
                            ? 'bg-orange-600 text-white ring-4 ring-orange-200 scale-110 shadow-orange-600/30' 
                            : 'bg-white text-slate-400 border-2 border-slate-300'
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
                      ) : (
                        <StepIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                      )}
                    </div>

                    {/* Step labels */}
                    <div className="mt-2.5">
                      <div className={`text-[11px] sm:text-xs font-black leading-tight ${
                        isCurrent 
                          ? 'text-orange-600' 
                          : isCompleted 
                            ? 'text-slate-900 font-extrabold' 
                            : 'text-slate-400'
                      }`}>
                        <span className="hidden sm:inline">{step.label}</span>
                        <span className="sm:hidden">{step.shortLabel}</span>
                      </div>
                      
                      <div className="hidden sm:block text-[10px] text-slate-500 mt-0.5 line-clamp-1">
                        {isCurrent ? (
                          <span className="text-orange-600 font-bold">● Active Now</span>
                        ) : isCompleted ? (
                          <span className="text-emerald-600 font-bold">✓ Completed</span>
                        ) : (
                          step.description
                        )}
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        </div>
      )}

      {/* 4. RIDER DETAILS & 4-DIGIT DELIVERY VERIFICATION OTP */}
      {!isDelivered && !isCancelled && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 my-4">
          
          {/* OTP Box (High Visibility) */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md relative overflow-hidden flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-100 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-white" />
                <span>Delivery Verification PIN</span>
              </div>
              <p className="text-[11px] text-white/90">
                Share this 4-digit OTP with your delivery partner to receive food safely.
              </p>
            </div>

            <div className="flex flex-col items-center gap-1 shrink-0 ml-3">
              <div className="px-3 py-1.5 bg-white text-slate-950 rounded-xl font-mono font-black text-xl tracking-widest shadow-lg">
                {order.otp}
              </div>
              <button
                onClick={handleCopyOtp}
                className="text-[10px] font-bold text-amber-100 hover:text-white flex items-center gap-1 transition-colors"
              >
                {copiedOtp ? (
                  <>
                    <Check className="w-3 h-3 text-white" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy PIN</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Delivery Partner Profile Card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-sky-600 text-white flex items-center justify-center font-black text-base shadow-xs shrink-0">
                <Bike className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-xs sm:text-sm text-slate-900 truncate">
                    {order.riderName || 'Rajesh Kumar'}
                  </span>
                  <span className="text-[10px] font-black text-amber-600 bg-amber-100 px-1.5 py-0.2 rounded-md shrink-0">
                    ★ 4.9
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 truncate mt-0.5">
                  {order.riderVehicle || 'Motorcycle (MP 09 CJ 4421)'}
                </div>
                <div className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mt-0.5">
                  <UserCheck className="w-3 h-3" />
                  <span>Verified Bhojj Fleet Rider</span>
                </div>
              </div>
            </div>

            <a
              href={`tel:${order.riderPhone || '+919123456789'}`}
              className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black flex items-center gap-1.5 transition-colors shadow-xs shrink-0"
              title="Call Delivery Partner"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Call Rider</span>
            </a>
          </div>

        </div>
      )}

      {/* REAL-TIME DELIVERY MAP VISUALIZATION */}
      {!isCancelled && (
        <div className="my-4 rounded-3xl border border-slate-200/90 overflow-hidden bg-slate-900 text-white shadow-lg">
          <div className="px-4 py-3 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="text-xs font-black uppercase tracking-wider text-slate-100 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-orange-400" />
                <span>Live Rider GPS Tracking</span>
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-emerald-400 font-mono font-bold hidden sm:inline">
                ⚡ Consuming live latitude/longitude telemetry
              </span>
              <button
                onClick={() => setShowLiveMap(!showLiveMap)}
                className="text-[11px] font-bold text-slate-400 hover:text-white flex items-center gap-1 transition-colors px-2 py-1 rounded-lg hover:bg-slate-800"
              >
                {showLiveMap ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>Hide Map</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    <span>Show Map</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {showLiveMap && (
            <div className="p-2 sm:p-3 bg-slate-950">
              <LiveDeliveryMap 
                order={order} 
                telemetry={getRiderTelemetry(order.id)} 
                height="h-64 sm:h-80" 
              />
            </div>
          )}
        </div>
      )}

      {/* 5. DELIVERY ADDRESS & DESTINATION ASHRAM */}
      <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 my-3 text-xs space-y-2">
        <div className="flex items-start gap-2.5">
          <MapPin className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold text-slate-500 uppercase text-[10px] tracking-wider block">
              Delivery Destination
            </span>
            <span className="font-extrabold text-slate-900">
              {order.deliveryAddress}
            </span>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-600 font-medium">
          <span>Payment: <strong>{order.paymentMethod}</strong> ({order.paymentStatus})</span>
          <span>Order Value: <strong className="text-slate-900 font-extrabold text-xs">₹{order.totalAmount}</strong></span>
        </div>
      </div>

      {/* 6. ORDER ITEMS BREAKDOWN (COLLAPSIBLE) */}
      <div className="border border-slate-200/80 rounded-2xl overflow-hidden mt-3">
        <button
          onClick={() => setShowItemsDetails(!showItemsDetails)}
          className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100/80 flex items-center justify-between text-xs font-black text-slate-800 transition-colors"
        >
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-orange-600" />
            <span>Order Summary ({order.items.reduce((s, i) => s + i.quantity, 0)} items)</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500 font-bold">
            <span>₹{order.totalAmount}</span>
            {showItemsDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {showItemsDetails && (
          <div className="p-4 bg-white space-y-3 text-xs divide-y divide-slate-100 animate-in fade-in duration-150">
            <div className="space-y-2">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0"></span>
                    <span className="font-medium text-slate-900">{item.name}</span>
                    <span className="text-slate-400 font-bold">× {item.quantity}</span>
                  </div>
                  <span className="font-black text-slate-900">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="pt-2.5 space-y-1.5 text-[11px] text-slate-600">
              <div className="flex justify-between">
                <span>Item Subtotal</span>
                <span>₹{order.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Ashram Delivery Fee</span>
                <span className={order.deliveryFee === 0 ? 'text-emerald-600 font-bold' : ''}>
                  {order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Taxes (5% GST)</span>
                <span>₹{order.tax}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Coupon Discount</span>
                  <span>-₹{order.discount}</span>
                </div>
              )}
              <div className="pt-2 border-t border-slate-200 flex justify-between text-xs font-black text-slate-950">
                <span>Grand Total</span>
                <span className="text-orange-600 text-sm">₹{order.totalAmount}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 7. CUSTOMER RATING FORM (SHOWN WHEN DELIVERED) */}
      {isDelivered && (
        <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h5 className="font-extrabold text-xs text-slate-900">How was your Satvik meal experience?</h5>
            </div>
            {ratingSubmitted && (
              <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                ✓ Rating Saved
              </span>
            )}
          </div>

          <form onSubmit={handleRatingSubmit} className="space-y-2">
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRatingVal(star)}
                  className="p-1 text-amber-400 hover:scale-110 transition-transform"
                >
                  <Star className={`w-6 h-6 ${star <= ratingVal ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                </button>
              ))}
              <span className="text-xs font-black text-amber-800 ml-2">
                {ratingVal === 5 ? 'Exceptional Pure Ghee Bhog!' : `${ratingVal} Stars`}
              </span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Share your compliments or feedback..."
                className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-amber-200 bg-white focus:outline-hidden focus:ring-1 focus:ring-orange-500"
              />
              <button
                type="submit"
                disabled={isSubmittingRating}
                className="px-3.5 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-xs transition-colors shrink-0"
              >
                {isSubmittingRating ? 'Saving...' : 'Submit Rating'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 8. INTERACTIVE PROGRESS SIMULATION TOOLBAR (FOR TESTING & DEMO REVIEW) */}
      {!isDelivered && !isCancelled && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-orange-500"></span>
            <span>Interactive Demo: Test status progress in real-time</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleSimulateNext}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs flex items-center gap-1.5 transition-all shadow-xs active:scale-95"
              title="Advance order to next state"
            >
              <span>Advance Status</span>
              <ArrowRight className="w-3.5 h-3.5 text-orange-400" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
