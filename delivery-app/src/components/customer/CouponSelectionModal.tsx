import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Coupon } from '../../types';
import confetti from 'canvas-confetti';
import { 
  Tag, 
  Check, 
  Copy, 
  X, 
  Sparkles, 
  Percent, 
  AlertCircle, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight,
  Gift,
  ShieldCheck
} from 'lucide-react';

interface CouponSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartSubtotal: number;
  onApplySuccess?: (coupon: Coupon, discount: number) => void;
}

export const CouponSelectionModal: React.FC<CouponSelectionModalProps> = ({
  isOpen,
  onClose,
  cartSubtotal,
  onApplySuccess
}) => {
  const { 
    coupons, 
    appliedCoupon, 
    applyCouponCode, 
    removeAppliedCoupon 
  } = useApp();

  const [inputCode, setInputCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [expandedTermsId, setExpandedTermsId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleApplyInput = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputCode.trim()) return;

    const res = applyCouponCode(inputCode.trim(), cartSubtotal);
    if (res.success) {
      setErrorMessage('');
      setSuccessMessage(res.message);
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
      if (onApplySuccess && res.coupon) {
        onApplySuccess(res.coupon, res.discount);
      }
      setTimeout(() => {
        onClose();
      }, 1200);
    } else {
      setSuccessMessage('');
      setErrorMessage(res.message);
    }
  };

  const handleSelectCoupon = (coupon: Coupon) => {
    const res = applyCouponCode(coupon.code, cartSubtotal);
    if (res.success) {
      setErrorMessage('');
      setSuccessMessage(res.message);
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
      if (onApplySuccess && res.coupon) {
        onApplySuccess(res.coupon, res.discount);
      }
      setTimeout(() => {
        onClose();
      }, 1200);
    } else {
      setSuccessMessage('');
      setErrorMessage(res.message);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setInputCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const activeCoupons = coupons.filter(c => c.isActive);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-center items-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-xs">
              <Gift className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg leading-tight flex items-center gap-1.5">
                <span>Available Coupons & Offers</span>
                <Sparkles className="w-4 h-4 text-amber-300" />
              </h3>
              <p className="text-[11px] text-white/80">
                Cart Total: <span className="font-bold text-white">₹{cartSubtotal}</span> • Save more on your sacred feast
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Input Promo Code Form */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 shrink-0">
          <form onSubmit={handleApplyInput} className="flex gap-2">
            <div className="relative flex-1">
              <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={inputCode}
                onChange={(e) => {
                  setInputCode(e.target.value.toUpperCase());
                  setErrorMessage('');
                }}
                placeholder="ENTER PROMO CODE (e.g. BHOJJ50)"
                className="w-full pl-9 pr-3 py-2.5 text-xs uppercase tracking-wider font-bold border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
              />
            </div>
            <button
              type="submit"
              disabled={!inputCode.trim()}
              className="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white text-xs font-black rounded-xl transition-all shadow-xs shrink-0 cursor-pointer"
            >
              Apply
            </button>
          </form>

          {errorMessage && (
            <div className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded-lg border border-red-200 flex items-center gap-1.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mt-2 text-xs text-emerald-700 bg-emerald-50 p-2 rounded-lg border border-emerald-200 flex items-center gap-1.5 animate-in fade-in">
              <Check className="w-4 h-4 shrink-0 font-bold" />
              <span>{successMessage}</span>
            </div>
          )}
        </div>

        {/* Coupon List */}
        <div className="p-4 overflow-y-auto space-y-3.5 flex-1">
          <div className="text-xs font-black text-slate-500 uppercase tracking-wider">
            Active Braj Coupons ({activeCoupons.length})
          </div>

          {activeCoupons.map((coupon) => {
            const isApplied = appliedCoupon?.coupon.id === coupon.id;
            const meetsMinOrder = cartSubtotal >= coupon.minOrderAmount;
            const amountNeeded = coupon.minOrderAmount - cartSubtotal;
            const isTermsExpanded = expandedTermsId === coupon.id;

            return (
              <div
                key={coupon.id}
                className={`rounded-2xl border p-4 transition-all relative overflow-hidden ${
                  isApplied
                    ? 'border-emerald-500 bg-emerald-50/50 shadow-md ring-2 ring-emerald-400/40'
                    : meetsMinOrder
                    ? 'border-slate-200 hover:border-orange-300 bg-white shadow-2xs hover:shadow-sm'
                    : 'border-slate-200 bg-slate-50/70 opacity-80'
                }`}
              >
                {/* Badge */}
                {coupon.badge && (
                  <div className="absolute top-0 right-0 bg-gradient-to-l from-orange-600 to-amber-600 text-white text-[9px] font-black px-3 py-0.5 rounded-bl-xl uppercase tracking-wider">
                    {coupon.badge}
                  </div>
                )}

                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-slate-900 text-sm tracking-tight">
                        {coupon.title}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {coupon.description}
                    </p>
                  </div>
                </div>

                {/* Code Pill & Action */}
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopyCode(coupon.code)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 hover:bg-amber-100 border border-amber-300 border-dashed rounded-lg text-xs font-black text-amber-900 transition-colors cursor-pointer"
                      title="Click to copy code"
                    >
                      <span>{coupon.code}</span>
                      {copiedCode === coupon.code ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3 text-amber-700" />
                      )}
                    </button>

                    <span className="text-[11px] text-slate-500">
                      Min order: <span className="font-bold text-slate-700">₹{coupon.minOrderAmount}</span>
                    </span>
                  </div>

                  {/* Apply / Applied Button */}
                  <div>
                    {isApplied ? (
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-xl flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" />
                          Applied
                        </span>
                        <button
                          type="button"
                          onClick={removeAppliedCoupon}
                          className="text-[11px] text-red-600 hover:text-red-700 font-bold hover:underline cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    ) : meetsMinOrder ? (
                      <button
                        type="button"
                        onClick={() => handleSelectCoupon(coupon)}
                        className="px-3.5 py-1.5 bg-orange-600 hover:bg-orange-700 text-white font-black text-xs rounded-xl transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                      >
                        <span>Apply</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    ) : (
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-100/80 px-2 py-1 rounded-lg">
                        Add ₹{amountNeeded} more to unlock
                      </span>
                    )}
                  </div>
                </div>

                {/* Terms Dropdown */}
                {coupon.terms && coupon.terms.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-slate-100 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setExpandedTermsId(isTermsExpanded ? null : coupon.id)}
                      className="text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium cursor-pointer"
                    >
                      <span>Terms & Conditions</span>
                      {isTermsExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>

                    {isTermsExpanded && (
                      <ul className="mt-1.5 space-y-1 pl-3 list-disc text-slate-600 text-[10px] animate-in fade-in">
                        {coupon.terms.map((term, i) => (
                          <li key={i}>{term}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-100 border-t border-slate-200 text-center shrink-0">
          <p className="text-[11px] text-slate-500">
            Coupons can be combined with Free Ashram Delivery over ₹299.
          </p>
        </div>

      </div>
    </div>
  );
};
