import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { clearLatestOrder } from '../../features/orders/ordersSlice';
import { formatINR } from '../../utils/currency';
import { CheckCircle2, Package, ArrowRight, ShieldCheck, Printer, Calendar } from 'lucide-react';

export const OrderConfirmationBanner = ({ order, onContinueShopping }) => {
  const dispatch = useDispatch();

  if (!order) return null;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 animate-in fade-in duration-300 space-y-6">
      
      {/* Success Badge */}
      <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 text-center space-y-3">
        <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-lg shadow-emerald-950/40">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-extrabold text-white">Order Confirmed!</h2>
        <p className="text-xs text-emerald-300/90 max-w-md mx-auto">
          Thank you for your purchase. Your payment was verified, and your cart has been automatically cleared via Redux middleware.
        </p>
      </div>

      {/* Itemized Order Receipt Card */}
      <div className="bg-dark-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        
        {/* Receipt Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
          <div>
            <span className="text-[10px] text-slate-500 font-mono block">CONFIRMATION CODE</span>
            <div className="text-base font-extrabold font-mono text-indigo-400">
              {order.id}
            </div>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-[10px] text-slate-500 font-mono block">ORDER DATE</span>
            <div className="text-xs text-slate-300 font-mono flex items-center gap-1.5 sm:justify-end">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{new Date(order.createdAt).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Customer & Shipping Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-dark-850/80 border border-slate-800 text-xs">
          <div>
            <span className="text-[10px] text-slate-500 font-mono block mb-1">RECIPIENT</span>
            <div className="font-semibold text-white">{order.customer.name}</div>
            <div className="text-slate-400 text-[11px] font-mono">{order.customer.email}</div>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-mono block mb-1">SHIPPING DESTINATION</span>
            <div className="text-slate-300 leading-relaxed">
              {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
            </div>
          </div>
        </div>

        {/* Itemized Snapshot */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Itemized Order Snapshot ({order.items.length} items)
          </h4>
          <div className="divide-y divide-slate-800/80 rounded-2xl bg-dark-950/60 border border-slate-800/80 p-2">
            {order.items.map((item, idx) => (
              <div key={idx} className="p-3 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-slate-900 p-1 shrink-0 flex items-center justify-center">
                    <img src={item.image} alt={item.title} className="max-h-full max-w-full object-contain" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-200 truncate max-w-xs">{item.title}</p>
                    <p className="text-[11px] text-slate-500 font-mono">Qty: {item.qty} × {formatINR(item.price)}</p>
                  </div>
                </div>
                <div className="font-mono font-bold text-white shrink-0">
                  {formatINR(item.lineTotal)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Breakdown */}
        <div className="pt-4 border-t border-slate-800 space-y-2 text-xs">
          <div className="flex justify-between text-slate-400">
            <span>Subtotal</span>
            <span className="font-mono text-slate-300">{formatINR(order.totals.subtotal)}</span>
          </div>
          {order.totals.discountAmount > 0 && (
            <div className="flex justify-between text-emerald-400 font-semibold">
              <span>Promo Discount ({order.totals.promoCode})</span>
              <span className="font-mono">-{formatINR(order.totals.discountAmount)}</span>
            </div>
          )}
          <div className="flex justify-between text-slate-400">
            <span>GST / Sales Tax (8%)</span>
            <span className="font-mono text-slate-300">{formatINR(order.totals.taxAmount)}</span>
          </div>
          <div className="pt-2 border-t border-slate-800 flex justify-between items-baseline">
            <span className="text-sm font-bold text-white">Paid in Full (INR)</span>
            <span className="text-2xl font-extrabold font-mono text-white">
              {formatINR(order.totals.finalTotal)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
          <Link
            to="/orders"
            onClick={() => dispatch(clearLatestOrder())}
            className="w-full sm:w-1/2 py-3 px-4 rounded-xl bg-dark-850 hover:bg-slate-800 text-white text-xs font-semibold text-center border border-slate-700 transition-colors flex items-center justify-center gap-2"
          >
            <Package className="w-4 h-4 text-indigo-400" />
            <span>View All Past Orders</span>
          </Link>

          <Link
            to="/"
            onClick={() => dispatch(clearLatestOrder())}
            className="w-full sm:w-1/2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold text-center shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
};

export default OrderConfirmationBanner;
