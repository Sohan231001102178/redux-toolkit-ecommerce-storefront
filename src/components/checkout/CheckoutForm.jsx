import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import {
  selectCartItemsList,
  selectCartTotals
} from '../../features/cart/cartSelectors';
import {
  placeOrder,
  selectCheckoutStatus,
  selectCheckoutError,
  selectLatestOrder
} from '../../features/orders/ordersSlice';
import { selectCurrentUser } from '../../features/auth/authSlice';
import { OrderConfirmationBanner } from './OrderConfirmationBanner';
import { formatINR } from '../../utils/currency';
import {
  CreditCard,
  Truck,
  ShieldCheck,
  RefreshCw,
  Lock,
  ArrowLeft,
  AlertTriangle,
  Zap,
  CheckCircle2,
  Smartphone
} from 'lucide-react';

export const CheckoutForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector(selectCurrentUser);
  const items = useSelector(selectCartItemsList);
  const totals = useSelector(selectCartTotals);
  const checkoutStatus = useSelector(selectCheckoutStatus);
  const checkoutError = useSelector(selectCheckoutError);
  const latestOrder = useSelector(selectLatestOrder);

  // Form states in Indian context
  const [fullName, setFullName] = useState(user?.name || 'Rohit Sharma');
  const [email, setEmail] = useState(user?.email || 'rohit@streaxsellers.in');
  const [street, setStreet] = useState('Flat 402, Galaxy Heights, Linking Road, Bandra West');
  const [city, setCity] = useState('Mumbai');
  const [state, setState] = useState('Maharashtra');
  const [zip, setZip] = useState('400050');
  const [paymentType, setPaymentType] = useState('UPI');
  const [upiId, setUpiId] = useState('rohit@oksbi');
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 5521');
  const [cardExp, setCardExp] = useState('08/29');
  const [cardCvc, setCardCvc] = useState('789');

  // If order was just placed, display the confirmation banner!
  if (latestOrder) {
    return <OrderConfirmationBanner order={latestOrder} />;
  }

  // If cart is empty, redirect or prompt user
  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-slate-800 flex items-center justify-center mx-auto text-slate-500">
          <Truck className="w-8 h-8 opacity-40" />
        </div>
        <h2 className="text-xl font-bold text-white">Your checkout bag is empty</h2>
        <p className="text-xs text-slate-400">
          Please add items to your cart before proceeding to checkout.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Catalog</span>
        </Link>
      </div>
    );
  }

  const handleSubmitOrder = (e) => {
    e.preventDefault();

    const orderPayload = {
      items,
      totals,
      shippingAddress: {
        fullName,
        email,
        street,
        city,
        state,
        zip,
        country: 'India'
      },
      paymentMethod: {
        type: paymentType,
        vpa: paymentType === 'UPI' ? upiId : null,
        last4: paymentType === 'CARD' ? '5521' : null
      }
    };

    dispatch(placeOrder(orderPayload));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <Link
            to="/cart"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-indigo-400 transition-colors mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Review Cart Items</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
            <Lock className="w-6 h-6 text-emerald-400" />
            <span>Secure Enterprise Checkout</span>
          </h1>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 font-mono">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>End-to-End Encrypted</span>
        </div>
      </div>

      {/* Error alert if placeOrder rejected */}
      {checkoutError && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-center gap-3 text-xs">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>{checkoutError}</span>
        </div>
      )}

      {/* Checkout Grid */}
      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Form: Shipping & Payment (8 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Shipping Address Section */}
          <div className="bg-dark-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wide">
              <Truck className="w-4 h-4 text-indigo-400" />
              <span>1. Shipping Destination</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1 sm:col-span-2">
                <label className="text-slate-300 font-medium">Full Recipient Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-dark-950 text-white rounded-xl px-3.5 py-2.5 border border-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-slate-300 font-medium">Email for Order Updates</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-dark-950 text-white rounded-xl px-3.5 py-2.5 border border-slate-800 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-slate-300 font-medium">Street Address</label>
                <input
                  type="text"
                  required
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full bg-dark-950 text-white rounded-xl px-3.5 py-2.5 border border-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">City</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-dark-950 text-white rounded-xl px-3.5 py-2.5 border border-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">State</label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full bg-dark-950 text-white rounded-xl px-3 py-2.5 border border-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Zip Code</label>
                  <input
                    type="text"
                    required
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    className="w-full bg-dark-950 text-white rounded-xl px-3 py-2.5 border border-slate-800 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method Section */}
          <div className="bg-dark-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wide">
              <CreditCard className="w-4 h-4 text-cyan-400" />
              <span>2. Payment Gateway (India)</span>
            </h3>

            {/* Payment Method Selector */}
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setPaymentType('UPI')}
                className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                  paymentType === 'UPI'
                    ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500'
                    : 'bg-dark-950 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                UPI (GPay/PhonePe)
              </button>
              <button
                type="button"
                onClick={() => setPaymentType('CARD')}
                className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                  paymentType === 'CARD'
                    ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500'
                    : 'bg-dark-950 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                RuPay / Cards
              </button>
              <button
                type="button"
                onClick={() => setPaymentType('COD')}
                className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                  paymentType === 'COD'
                    ? 'bg-amber-600/20 text-amber-300 border-amber-500'
                    : 'bg-dark-950 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                Cash on Delivery
              </button>
            </div>

            {/* UPI or Card Details */}
            {paymentType === 'UPI' ? (
              <div className="space-y-1.5 pt-2 text-xs">
                <label className="text-slate-300 font-medium">Virtual Payment Address (VPA / UPI ID)</label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="yourname@upi"
                    className="w-full bg-dark-950 text-white rounded-xl pl-10 pr-3 py-2.5 border border-slate-800 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
                <p className="text-[10px] text-slate-500">Supports Google Pay, PhonePe, Paytm, BHIM</p>
              </div>
            ) : paymentType === 'CARD' ? (
              <div className="space-y-3 pt-2 text-xs">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Card Number (RuPay/Visa/Mastercard)</label>
                  <div className="relative">
                    <CreditCard className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-dark-950 text-white rounded-xl pl-10 pr-3 py-2.5 border border-slate-800 focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-slate-300 font-medium">Expiry</label>
                    <input
                      type="text"
                      value={cardExp}
                      onChange={(e) => setCardExp(e.target.value)}
                      className="w-full bg-dark-950 text-white rounded-xl px-3 py-2.5 border border-slate-800 focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-300 font-medium">CVV</label>
                    <input
                      type="text"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      className="w-full bg-dark-950 text-white rounded-xl px-3 py-2.5 border border-slate-800 focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
                Pay in cash or via UPI QR code upon home delivery across India.
              </div>
            )}

          </div>

        </div>

        {/* Right Summary & Submit (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-dark-900 border border-slate-800 rounded-3xl p-6 space-y-5 sticky top-24">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider pb-3 border-b border-slate-800">
              Order Review & Summary
            </h3>

            {/* Itemized Mini List */}
            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {items.map(({ product, qty }) => (
                <div key={product.id} className="flex items-center justify-between text-xs gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-5 h-5 rounded-md bg-dark-950 text-indigo-400 font-mono text-[10px] font-bold flex items-center justify-center shrink-0 border border-slate-800">
                      {qty}
                    </span>
                    <span className="text-slate-300 truncate max-w-[190px]">{product.title}</span>
                  </div>
                  <span className="font-mono text-white font-semibold shrink-0">
                    {formatINR(product.price * qty)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="pt-3 border-t border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span className="font-mono text-slate-200">{formatINR(totals.subtotal)}</span>
              </div>
              {totals.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Coupon Discount ({totals.promoCode})</span>
                  <span className="font-mono">-{formatINR(totals.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-400">
                <span>GST / Tax (8%)</span>
                <span className="font-mono text-slate-200">{formatINR(totals.taxAmount)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Express Shipping (Pan India)</span>
                <span className="font-mono text-emerald-400 font-semibold">FREE</span>
              </div>
              <div className="pt-3 border-t border-slate-800 flex justify-between items-baseline">
                <span className="text-sm font-bold text-white">Grand Total</span>
                <span className="text-2xl font-extrabold font-mono text-white">
                  {formatINR(totals.finalTotal)}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={checkoutStatus === 'loading'}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-xs shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
            >
              {checkoutStatus === 'loading' ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Processing Payment via Streax Gateway...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Authorize & Pay {formatINR(totals.finalTotal)}</span>
                </>
              )}
            </button>

            <div className="text-center text-[11px] text-slate-500 font-mono">
              Calls <code>placeOrder</code> thunk &bull; Clears cart via extraReducers
            </div>

          </div>
        </div>

      </form>
    </div>
  );
};

export default CheckoutForm;
