import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectCartTotals,
  selectPromoError
} from '../../features/cart/cartSelectors';
import {
  applyPromoCode,
  removePromoCode
} from '../../features/cart/cartSlice';
import { formatINR } from '../../utils/currency';
import { Tag, Check, X, ShieldAlert, ArrowRight, Percent } from 'lucide-react';

export const OrderSummaryBox = ({ onCheckout, showCheckoutButton = true }) => {
  const dispatch = useDispatch();
  const totals = useSelector(selectCartTotals);
  const promoError = useSelector(selectPromoError);

  const [inputCode, setInputCode] = useState('');

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    dispatch(applyPromoCode(inputCode));
    setInputCode('');
  };

  const handleRemovePromo = () => {
    dispatch(removePromoCode());
  };

  return (
    <div className="bg-dark-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
      <h3 className="text-sm font-bold text-white uppercase tracking-wider pb-3 border-b border-slate-800">
        Streax Order Summary (INR)
      </h3>

      {/* Item count & Subtotal */}
      <div className="space-y-2.5 text-xs">
        <div className="flex justify-between text-slate-400">
          <span>Items in Order ({totals.itemCount})</span>
          <span className="font-mono text-slate-200">{formatINR(totals.subtotal)}</span>
        </div>

        {/* Promo discount row if applied */}
        {totals.discountAmount > 0 && (
          <div className="flex justify-between text-emerald-400 font-semibold bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/20">
            <span className="flex items-center gap-1.5">
              <Percent className="w-3.5 h-3.5" />
              Promo ({totals.promoCode} - {(totals.discountRate * 100)}%)
            </span>
            <div className="flex items-center gap-2">
              <span className="font-mono">-{formatINR(totals.discountAmount)}</span>
              <button
                onClick={handleRemovePromo}
                className="text-emerald-400 hover:text-rose-400"
                title="Remove promo"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* 8% Sales Tax / GST */}
        <div className="flex justify-between text-slate-400">
          <span className="flex items-center gap-1">
            <span>GST / State Tax</span>
            <span className="text-[10px] text-slate-500 font-mono">(8% calculated)</span>
          </span>
          <span className="font-mono text-slate-200">{formatINR(totals.taxAmount)}</span>
        </div>

        {/* Grand Total */}
        <div className="pt-3 border-t border-slate-800 flex justify-between items-baseline">
          <span className="text-sm font-bold text-white">Grand Total</span>
          <span className="text-xl font-extrabold font-mono text-white">
            {formatINR(totals.finalTotal)}
          </span>
        </div>
      </div>

      {/* Promo Code Input Form */}
      <form onSubmit={handleApplyPromo} className="pt-2">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Tag className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Coupon (e.g. STREAX10)"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              className="w-full bg-dark-950 text-xs text-white placeholder-slate-500 rounded-xl pl-9 pr-3 py-2 border border-slate-800 focus:outline-none focus:border-indigo-500 font-mono uppercase"
            />
          </div>
          <button
            type="submit"
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
          >
            Apply
          </button>
        </div>

        {/* Preset Badges for easy 1-click testing */}
        <div className="flex items-center gap-1.5 mt-2 text-[10px] text-slate-400 font-mono">
          <span>Coupons:</span>
          <button
            type="button"
            onClick={() => dispatch(applyPromoCode('STREAX10'))}
            className="px-1.5 py-0.5 rounded bg-slate-800/80 hover:bg-amber-600/30 text-amber-300 border border-slate-700"
          >
            STREAX10
          </button>
          <button
            type="button"
            onClick={() => dispatch(applyPromoCode('STREAX20'))}
            className="px-1.5 py-0.5 rounded bg-slate-800/80 hover:bg-amber-600/30 text-amber-300 border border-slate-700"
          >
            STREAX20
          </button>
          <button
            type="button"
            onClick={() => dispatch(applyPromoCode('STREAX50'))}
            className="px-1.5 py-0.5 rounded bg-slate-800/80 hover:bg-purple-600/30 text-purple-300 border border-slate-700"
          >
            STREAX50
          </button>
        </div>

        {/* Promo Error Message */}
        {promoError && (
          <p className="mt-2 text-[11px] text-rose-400 flex items-center gap-1">
            <ShieldAlert className="w-3 h-3 shrink-0" />
            <span>{promoError}</span>
          </p>
        )}
      </form>

      {/* Proceed to Checkout CTA */}
      {showCheckoutButton && (
        <button
          onClick={onCheckout}
          disabled={totals.isEmpty}
          className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
            totals.isEmpty
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-lg shadow-indigo-600/30'
          }`}
        >
          <span>Proceed to Checkout</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default OrderSummaryBox;
