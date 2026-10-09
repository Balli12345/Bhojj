import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Plus, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Clock, 
  Search, 
  Filter, 
  CheckCircle2, 
  CreditCard, 
  Smartphone, 
  Building2, 
  ShoppingBag, 
  UtensilsCrossed, 
  Gift, 
  AlertCircle,
  ChevronRight,
  Info,
  X,
  RefreshCw
} from 'lucide-react';
import { WalletTransaction } from '../../types';

interface CustomerWalletProps {
  onBackToMenu?: () => void;
  onOpenCart?: () => void;
}

export const CustomerWallet: React.FC<CustomerWalletProps> = ({ 
  onBackToMenu, 
  onOpenCart 
}) => {
  const { 
    walletBalance, 
    walletTransactions, 
    addFundsToWallet, 
    currentUser,
    cart
  } = useApp();

  const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState<string>('500');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [selectedUpiApp, setSelectedUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'bhim'>('gpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successToast, setSuccessToast] = useState<{ show: boolean; msg: string } | null>(null);
  
  // Ledger filter and search
  const [filterType, setFilterType] = useState<'all' | 'credit' | 'debit'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const quickAmounts = [100, 200, 500, 1000, 2000];

  const handleQuickAdd = (amt: number) => {
    setTopUpAmount(amt.toString());
    setShowAddMoneyModal(true);
  };

  const executeAddMoney = () => {
    const num = parseFloat(topUpAmount);
    if (isNaN(num) || num <= 0) {
      alert('Please enter a valid amount greater than ₹0.');
      return;
    }

    setIsProcessing(true);

    // Simulate realistic bank gateway verification
    setTimeout(() => {
      let methodName = 'UPI (Google Pay)';
      if (selectedPaymentMethod === 'upi') {
        const map = { gpay: 'Google Pay UPI', phonepe: 'PhonePe UPI', paytm: 'Paytm UPI', bhim: 'BHIM UPI' };
        methodName = map[selectedUpiApp] || 'UPI';
      } else if (selectedPaymentMethod === 'card') {
        methodName = 'Credit / Debit Card';
      } else {
        methodName = 'NetBanking (Instant Transfer)';
      }

      const result = addFundsToWallet(num, methodName);
      setIsProcessing(false);
      setShowAddMoneyModal(false);

      if (result.success) {
        setSuccessToast({
          show: true,
          msg: `₹${num.toLocaleString('en-IN')} added successfully to your Bhojj Wallet!`
        });
        setTimeout(() => setSuccessToast(null), 5000);
      }
    }, 900);
  };

  // Filter transactions
  const filteredTransactions = walletTransactions.filter((tx) => {
    if (filterType !== 'all' && tx.type !== filterType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchDesc = tx.description.toLowerCase().includes(q);
      const matchId = tx.id.toLowerCase().includes(q);
      const matchRef = tx.referenceId ? tx.referenceId.toLowerCase().includes(q) : false;
      const matchOrder = tx.orderId ? tx.orderId.toLowerCase().includes(q) : false;
      return matchDesc || matchId || matchRef || matchOrder;
    }
    return true;
  });

  const totalCredits = walletTransactions
    .filter(t => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalDebits = walletTransactions
    .filter(t => t.type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Toast Banner */}
      {successToast && (
        <div className="bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-lg flex items-center justify-between animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span className="text-xs sm:text-sm font-bold">{successToast.msg}</span>
          </div>
          <button 
            onClick={() => setSuccessToast(null)}
            className="text-white/80 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ================= TOP HERO SECTION: DIGITAL WALLET PASS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* The Digital Bhojj Pass Card */}
        <div className="lg:col-span-7 bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950 rounded-3xl p-6 sm:p-7 text-white shadow-xl relative overflow-hidden flex flex-col justify-between border border-amber-500/20">
          
          {/* Subtle decorative background watermarks */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-600/10 rounded-full blur-2xl pointer-events-none -ml-12 -mb-12"></div>

          <div>
            {/* Card Header */}
            <div className="flex items-center justify-between pb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400 shadow-inner">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-black tracking-wide text-white">Bhojj Satvik Pay</span>
                    <span className="text-[10px] uppercase font-black bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full">
                      Digital Pass
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium">Govardhan Fast Checkout • 0% Bank Drop</p>
                </div>
              </div>

              <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Active Ledger</span>
              </div>
            </div>

            {/* Current Balance Display */}
            <div className="space-y-1 my-2">
              <span className="text-[11px] uppercase tracking-widest text-slate-400 font-bold">
                Available Wallet Balance
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
                  ₹{walletBalance.toLocaleString('en-IN')}
                </span>
                <span className="text-xs font-semibold text-amber-400">INR</span>
              </div>
              <p className="text-xs text-slate-300 pt-1">
                Linked to: <span className="font-bold text-white">{currentUser?.name || 'Devotee Account'}</span> ({currentUser?.phone || '+91 98765 43210'})
              </p>
            </div>
          </div>

          {/* Quick Actions at bottom of card */}
          <div className="pt-6 mt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setTopUpAmount('500');
                  setShowAddMoneyModal(true);
                }}
                className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Funds to Wallet</span>
              </button>

              {cart.length > 0 && (
                <button
                  onClick={onOpenCart}
                  className="px-3.5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 text-amber-400" />
                  <span>Cart ({cart.length})</span>
                </button>
              )}
            </div>

            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>100% Encrypted & Safe</span>
            </span>
          </div>

        </div>

        {/* Quick Top-Up Presets & Summary */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                <Zap className="w-4 h-4 text-orange-600" />
                <span>Quick Top-Up Options</span>
              </h3>
              <span className="text-[11px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md">
                ⚡ Instant Load
              </span>
            </div>

            <p className="text-xs text-slate-500 mt-2">
              Add money instantly using UPI, Debit Card, or NetBanking for hassle-free order checkout.
            </p>

            {/* Quick Amount Chips */}
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-4">
              {quickAmounts.map((amt) => (
                <button
                  key={amt}
                  onClick={() => handleQuickAdd(amt)}
                  className="py-2 px-1 rounded-xl border border-slate-200 hover:border-orange-500 hover:bg-orange-50 text-slate-800 font-extrabold text-xs transition-all active:scale-95 cursor-pointer text-center group"
                >
                  <div className="text-[10px] text-slate-400 group-hover:text-orange-600">+</div>
                  <div>₹{amt}</div>
                </button>
              ))}
            </div>

            {/* Devotee Perk Banner */}
            <div className="mt-4 p-3 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/70 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 font-black text-xs">
                <Gift className="w-4 h-4" />
              </div>
              <div className="text-[11px] text-slate-700 leading-tight">
                <span className="font-extrabold text-amber-900">Parikrama Bonus:</span> Add ₹500 or more to get flat 5% cashback on your next Goverdhan Satvik order!
              </div>
            </div>
          </div>

          {/* Quick Ledger Stats */}
          <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-2 gap-3 text-center">
            <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Credited</span>
              <span className="text-sm font-black text-emerald-600">₹{totalCredits.toLocaleString('en-IN')}</span>
            </div>
            <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Spent</span>
              <span className="text-sm font-black text-slate-700">₹{totalDebits.toLocaleString('en-IN')}</span>
            </div>
          </div>

        </div>

      </div>

      {/* ================= VALUE PROPOSITION / FEATURES GRID ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">1-Click Fast Checkout</h4>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
              No waiting for bank SMS OTP or entering CVV codes on every hunger craving.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Zero Payment Drops</h4>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
              100% payment success rate even in congested temple parikrama networks.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
            <RefreshCw className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Instant 2-Sec Refunds</h4>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
              Cancelled items or modified orders are instantly credited back to your balance.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
            <Gift className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Exclusive Devotee Deals</h4>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
              Special discounts and extra Prasad credits exclusive to Bhojj Wallet users.
            </p>
          </div>
        </div>
      </div>

      {/* ================= TRANSACTION HISTORY / LEDGER ================= */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
        
        {/* Ledger Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-700" />
              <span>Wallet Passbook & Transactions</span>
            </h3>
            <p className="text-xs text-slate-500">Full audit log of money added, order deductions, and promotional credits.</p>
          </div>

          {/* Filters & Search */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search transactions..."
                className="pl-8 pr-3 py-1.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-orange-500 w-44 sm:w-52"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-xl text-xs font-bold">
              <button
                onClick={() => setFilterType('all')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  filterType === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({walletTransactions.length})
              </button>
              <button
                onClick={() => setFilterType('credit')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  filterType === 'credit' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Added
              </button>
              <button
                onClick={() => setFilterType('debit')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  filterType === 'debit' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Spent
              </button>
            </div>

          </div>
        </div>

        {/* Transactions List */}
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12 space-y-2">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <Wallet className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-800 text-sm">No transactions found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {searchQuery ? 'Try clearing your search query.' : 'Top up your wallet to start enjoying fast 1-click checkout.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredTransactions.map((tx) => {
              const isCredit = tx.type === 'credit';

              return (
                <div 
                  key={tx.id} 
                  className="py-3.5 flex items-center justify-between gap-3 hover:bg-slate-50/70 px-2 rounded-2xl transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                      isCredit ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}>
                      {isCredit ? (
                        <ArrowDownLeft className="w-5 h-5" />
                      ) : (
                        <ArrowUpRight className="w-5 h-5" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs sm:text-sm text-slate-900">
                          {tx.description}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                          Success
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                        <span>{tx.timestamp}</span>
                        <span>•</span>
                        <span className="font-mono text-[10px] text-slate-400">Txn: {tx.id}</span>
                        {tx.paymentMethod && (
                          <>
                            <span>•</span>
                            <span className="text-slate-600 font-medium">{tx.paymentMethod}</span>
                          </>
                        )}
                        {tx.orderId && (
                          <>
                            <span>•</span>
                            <span className="font-bold text-orange-600">{tx.orderId}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className={`text-sm sm:text-base font-black ${
                      isCredit ? 'text-emerald-600' : 'text-slate-900'
                    }`}>
                      {isCredit ? `+₹${tx.amount.toLocaleString('en-IN')}` : `-₹${tx.amount.toLocaleString('en-IN')}`}
                    </div>
                    {tx.closingBalance !== undefined && (
                      <div className="text-[10px] text-slate-400">
                        Bal: ₹{tx.closingBalance.toLocaleString('en-IN')}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* ================= ADD MONEY MODAL ================= */}
      {showAddMoneyModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                  <Wallet className="w-4 h-4" />
                </div>
                <h3 className="text-base font-black text-slate-900">Add Money to Bhojj Wallet</h3>
              </div>
              <button
                onClick={() => setShowAddMoneyModal(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Input Amount */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Enter Top-Up Amount (INR)</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg font-black text-slate-400">
                  ₹
                </span>
                <input
                  type="number"
                  min="1"
                  step="10"
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(e.target.value)}
                  placeholder="e.g. 500"
                  className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-lg font-black focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white"
                  autoFocus
                />
              </div>

              {/* Quick pills inside modal */}
              <div className="flex gap-2 pt-1">
                {[200, 500, 1000, 2000].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setTopUpAmount(amt.toString())}
                    className={`px-2.5 py-1 rounded-xl text-xs font-extrabold border transition-colors cursor-pointer ${
                      topUpAmount === amt.toString()
                        ? 'bg-orange-600 text-white border-orange-600'
                        : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">Select Payment Source</label>
              
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedPaymentMethod('upi')}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    selectedPaymentMethod === 'upi'
                      ? 'border-orange-500 bg-orange-50/60 ring-2 ring-orange-500/20 text-orange-950'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <Smartphone className="w-4 h-4 mx-auto mb-1 text-orange-600" />
                  <div className="text-xs font-bold">UPI Apps</div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedPaymentMethod('card')}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    selectedPaymentMethod === 'card'
                      ? 'border-orange-500 bg-orange-50/60 ring-2 ring-orange-500/20 text-orange-950'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <CreditCard className="w-4 h-4 mx-auto mb-1 text-orange-600" />
                  <div className="text-xs font-bold">Cards</div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedPaymentMethod('netbanking')}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    selectedPaymentMethod === 'netbanking'
                      ? 'border-orange-500 bg-orange-50/60 ring-2 ring-orange-500/20 text-orange-950'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <Building2 className="w-4 h-4 mx-auto mb-1 text-orange-600" />
                  <div className="text-xs font-bold">NetBanking</div>
                </button>
              </div>

              {/* UPI App Selection Sub-options */}
              {selectedPaymentMethod === 'upi' && (
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <span className="text-[11px] font-bold text-slate-500">Choose UPI App</span>
                  <div className="grid grid-cols-4 gap-2 text-center text-xs font-bold">
                    {(['gpay', 'phonepe', 'paytm', 'bhim'] as const).map((app) => (
                      <button
                        key={app}
                        type="button"
                        onClick={() => setSelectedUpiApp(app)}
                        className={`py-1.5 px-2 rounded-xl border capitalize transition-colors ${
                          selectedUpiApp === app
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {app === 'gpay' ? 'GPay' : app}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Card sub-details placeholder */}
              {selectedPaymentMethod === 'card' && (
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1.5">
                  <div className="text-[11px] font-bold text-slate-600">Supported: RuPay, Visa, Mastercard</div>
                  <div className="text-[11px] text-slate-500">Simulated 3D Secure instant bank gateway.</div>
                </div>
              )}

              {/* NetBanking sub-details */}
              {selectedPaymentMethod === 'netbanking' && (
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1.5">
                  <div className="text-[11px] font-bold text-slate-600">Supported: SBI, HDFC, ICICI, Axis Bank</div>
                  <div className="text-[11px] text-slate-500">Direct secure NEFT/IMPS pipeline integration.</div>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowAddMoneyModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 font-bold text-xs text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={executeAddMoney}
                disabled={isProcessing || !topUpAmount || parseFloat(topUpAmount) <= 0}
                className="flex-1 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Confirm & Add ₹{topUpAmount || '0'}</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
