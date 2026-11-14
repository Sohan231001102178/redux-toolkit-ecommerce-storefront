import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
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
import { X, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';

export const CartDrawer = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector(selectCartItemsList);
  const totals = useSelector(selectCartTotals);

  if (!isOpen) return null;

  const handleGoToCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  const handleGoToCartPage = () => {
    onClose();
    navigate('/cart');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-dark-950/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-dark-900 border-l border-slate-800 shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-dark-950/70">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Your Shopping Cart</h2>
                <p className="text-xs text-slate-400 font-mono">
                  {totals.itemCount} {totals.itemCount === 1 ? 'item' : 'items'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {items.length > 0 && (
                <button
                  onClick={() => dispatch(clearCart())}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 text-xs transition-colors"
                  title="Clear Cart"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Cart Items Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-slate-800/50 flex items-center justify-center text-slate-500">
                  <ShoppingBag className="w-8 h-8 opacity-40" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-semibold text-white">Your cart is empty</h3>
                  <p className="text-xs text-slate-400 max-w-xs">
                    Explore our electronics, apparel, and jewelry catalog to add items.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all"
                >
                  Explore Catalog
                </button>
              </div>
            ) : (
              items.map(({ product, qty }) => (
                <div
                  key={product.id}
                  className="p-3.5 rounded-2xl bg-dark-850/90 border border-slate-800/80 flex gap-3 items-center"
                >
                  {/* Thumbnail */}
                  <div className="w-16 h-16 rounded-xl bg-slate-950/80 p-2 shrink-0 flex items-center justify-center border border-slate-800">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>

                  {/* Info & Stepper */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-slate-200 truncate">
                      {product.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1 mb-2">
                      <span className="text-xs font-mono font-bold text-white">
                        {formatINR(product.price)}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        Sub: {formatINR(product.price * qty)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <QuantityStepper
                        qty={qty}
                        onIncrease={() => dispatch(updateQuantity({ id: product.id, qty: qty + 1 }))}
                        onDecrease={() => dispatch(updateQuantity({ id: product.id, qty: qty - 1 }))}
                        onChange={(newVal) => dispatch(updateQuantity({ id: product.id, qty: newVal }))}
                      />

                      <button
                        onClick={() => dispatch(removeFromCart(product.id))}
                        className="text-slate-500 hover:text-rose-400 p-1 text-xs"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Order Summary */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-slate-800 bg-dark-950/90 space-y-3">
              <OrderSummaryBox onCheckout={handleGoToCheckout} />
              <button
                onClick={handleGoToCartPage}
                className="w-full py-2 text-center text-xs text-indigo-400 hover:text-indigo-300 font-mono flex items-center justify-center gap-1"
              >
                <span>View Full Screen Cart View</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
