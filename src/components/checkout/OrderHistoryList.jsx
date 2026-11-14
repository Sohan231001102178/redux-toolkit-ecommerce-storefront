import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { selectOrderHistory } from '../../features/orders/ordersSlice';
import { addToCart } from '../../features/cart/cartSlice';
import { formatINR } from '../../utils/currency';
import { Package, Calendar, ArrowLeft, RefreshCw, CheckCircle, Clock, Truck, ChevronRight } from 'lucide-react';

export const OrderHistoryList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const orders = useSelector(selectOrderHistory);

  const handleReorder = (order) => {
    order.items.forEach((item) => {
      dispatch(addToCart({
        product: {
          id: item.productId,
          title: item.title,
          price: item.price,
          image: item.image,
          category: item.category
        },
        qty: item.qty
      }));
    });
    navigate('/cart');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-indigo-400 transition-colors mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Storefront</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
            <Package className="w-7 h-7 text-indigo-500" />
            <span>Order History & Receipts</span>
            <span className="text-xs font-mono font-normal px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              {orders.length} orders
            </span>
          </h1>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="p-16 text-center rounded-3xl bg-dark-900/60 border border-slate-800 space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-3xl bg-slate-800/50 flex items-center justify-center mx-auto text-slate-500">
            <Package className="w-8 h-8 opacity-40" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">No historical orders yet</h3>
            <p className="text-xs text-slate-400">
              When you complete checkout, your itemized receipts will be archived here.
            </p>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all"
          >
            <span>Explore Products</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-dark-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl hover:border-slate-700 transition-all"
            >
              {/* Order Card Header */}
              <div className="p-4 sm:p-6 bg-dark-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-6">
                  <div>
                    <span className="text-[10px] text-slate-500 font-mono block">ORDER NUMBER</span>
                    <span className="text-sm font-extrabold font-mono text-indigo-400">
                      {order.id}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 font-mono block">PLACED ON</span>
                    <span className="text-xs text-slate-300 font-mono flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 font-mono block">TOTAL (INR)</span>
                    <span className="text-sm font-bold font-mono text-white">
                      {formatINR(order.totals.finalTotal)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>{order.status || 'Confirmed'}</span>
                  </span>

                  <button
                    onClick={() => handleReorder(order)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
                    title="Add all items from this order to current cart"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reorder</span>
                  </button>
                </div>
              </div>

              {/* Order Items Body */}
              <div className="p-4 sm:p-6 divide-y divide-slate-800/80">
                {order.items.map((item, idx) => (
                  <div key={idx} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-slate-950 p-1.5 shrink-0 flex items-center justify-center border border-slate-800">
                        <img src={item.image} alt={item.title} className="max-h-full max-w-full object-contain" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-semibold text-white truncate max-w-md">{item.title}</h4>
                        <span className="text-[11px] text-slate-400 font-mono">
                          Qty: {item.qty} &bull; {formatINR(item.price)} each
                        </span>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-bold text-white shrink-0">
                      {formatINR(item.lineTotal)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Order Footer with Address & Breakdown */}
              <div className="p-4 sm:p-6 bg-dark-950/40 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-slate-500" />
                  <span>
                    Delivering to: <strong className="text-slate-300">{order.shippingAddress.city}, {order.shippingAddress.state}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-4 font-mono text-[11px]">
                  <span>Subtotal: {formatINR(order.totals.subtotal)}</span>
                  {order.totals.discountAmount > 0 && (
                    <span className="text-emerald-400">Saved: -{formatINR(order.totals.discountAmount)}</span>
                  )}
                  <span>GST: {formatINR(order.totals.taxAmount)}</span>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default OrderHistoryList;
