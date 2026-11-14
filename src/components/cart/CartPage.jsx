import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
  selectCartItemsList,
  selectCartTotals
} from '../../features/cart/cartSelectors';
import {
  updateQuantity,
  removeFromCart,
  clearCart
} from '../../features/cart/cartSlice';
import { QuantityStepper } from './QuantityStepper';
import { OrderSummaryBox } from './OrderSummaryBox';
import { formatINR } from '../../utils/currency';
import { ShoppingCart, Trash2, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';

export const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector(selectCartItemsList);
  const totals = useSelector(selectCartTotals);

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      
      {/* Breadcrumb / Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-indigo-400 transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Storefront</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
            <ShoppingCart className="w-7 h-7 text-indigo-500" />
            <span>Shopping Cart</span>
            <span className="text-xs font-mono font-normal px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              {totals.itemCount} items
            </span>
          </h1>
        </div>

        {items.length > 0 && (
          <button
            onClick={() => dispatch(clearCart())}
            className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-all"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear Cart</span>
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="p-16 text-center rounded-3xl bg-dark-900/60 border border-slate-800 space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-3xl bg-slate-800/50 flex items-center justify-center mx-auto text-slate-500">
            <ShoppingCart className="w-8 h-8 opacity-40" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">Your cart is currently empty</h3>
            <p className="text-xs text-slate-400">
              Add products from our normalized catalog to proceed through checkout.
            </p>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all"
          >
            <span>Explore Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Items Table / List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-dark-900/90 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="p-4 bg-dark-950/70 border-b border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider grid grid-cols-12 gap-4">
                <span className="col-span-6">Product Details</span>
                <span className="col-span-2 text-center">Unit Price</span>
                <span className="col-span-2 text-center">Quantity</span>
                <span className="col-span-2 text-right">Subtotal</span>
              </div>

              <div className="divide-y divide-slate-800/80">
                {items.map(({ product, qty }) => (
                  <div key={product.id} className="p-4 grid grid-cols-12 gap-4 items-center">
                    
                    {/* Item Details */}
                    <div className="col-span-6 flex items-center gap-3">
                      <div className="w-14 h-14 rounded-xl bg-slate-950 p-2 shrink-0 flex items-center justify-center border border-slate-800">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-white truncate hover:text-indigo-300">
                          {product.title}
                        </h4>
                        <span className="text-[10px] text-indigo-400 font-mono uppercase">
                          {product.category}
                        </span>
                      </div>
                    </div>

                    {/* Unit Price */}
                    <div className="col-span-2 text-center font-mono text-xs text-slate-300">
                      {formatINR(product.price)}
                    </div>

                    {/* Quantity Stepper */}
                    <div className="col-span-2 flex justify-center">
                      <QuantityStepper
                        qty={qty}
                        onIncrease={() => dispatch(updateQuantity({ id: product.id, qty: qty + 1 }))}
                        onDecrease={() => dispatch(updateQuantity({ id: product.id, qty: qty - 1 }))}
                        onChange={(val) => dispatch(updateQuantity({ id: product.id, qty: val }))}
                      />
                    </div>

                    {/* Line Total & Remove */}
                    <div className="col-span-2 text-right flex items-center justify-end gap-3">
                      <span className="font-mono text-xs font-bold text-white">
                        {formatINR(product.price * qty)}
                      </span>
                      <button
                        onClick={() => dispatch(removeFromCart(product.id))}
                        className="text-slate-500 hover:text-rose-400 p-1"
                        title="Remove product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            </div>

            {/* Persistence note */}
            <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10 flex items-center gap-2 text-xs text-indigo-300/80">
              <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>
                Synchronized via <code>persistenceMiddleware.js</code> — your items will remain intact on page refreshes.
              </span>
            </div>
          </div>

          {/* Right Summary Column */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <OrderSummaryBox onCheckout={handleCheckout} />
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

export default CartPage;
