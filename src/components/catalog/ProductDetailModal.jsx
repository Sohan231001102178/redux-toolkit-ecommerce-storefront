import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../features/cart/cartSlice';
import { formatINR } from '../../utils/currency';
import { X, Star, ShoppingBag, ShieldCheck, Truck, Check, ArrowRight } from 'lucide-react';

export const ProductDetailModal = ({ product, onClose, onGoToCheckout }) => {
  const dispatch = useDispatch();
  const [qty, setQty] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  if (!product) return null;

  const handleAddToCart = () => {
    dispatch(addToCart({ product, qty }));
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  const handleBuyNow = () => {
    dispatch(addToCart({ product, qty }));
    onClose();
    if (onGoToCheckout) {
      onGoToCheckout();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Click outside backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-3xl bg-dark-900 border border-slate-800 rounded-3xl shadow-2xl shadow-indigo-950/50 overflow-hidden z-10 max-h-[90vh] flex flex-col md:flex-row">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-dark-950/70 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Image Column */}
        <div className="md:w-1/2 p-8 bg-slate-950/60 flex items-center justify-center border-b md:border-b-0 md:border-r border-slate-800">
          <div className="relative max-h-80 w-full flex items-center justify-center">
            <img
              src={product.image}
              alt={product.title}
              className="max-h-72 max-w-full object-contain filter drop-shadow-xl"
            />
          </div>
        </div>

        {/* Details & Actions Column */}
        <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-4">
            
            {/* Category & Rating */}
            <div className="flex items-center justify-between gap-2">
              <span className="px-2.5 py-1 rounded-lg text-[11px] font-semibold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                {product.category}
              </span>
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{product.rating?.rate || '4.5'}</span>
                <span className="text-slate-500 font-normal">({product.rating?.count || 120} reviews)</span>
              </div>
            </div>

            {/* Title */}
            <h2 className="text-lg md:text-xl font-bold text-white leading-snug">
              {product.title}
            </h2>

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-2xl md:text-3xl font-extrabold font-mono text-white">
                {formatINR(product.price)}
              </span>
              <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                In Stock & Ready to Dispatch (India)
              </span>
            </div>

            {/* Description */}
            <p className="text-xs text-slate-300 leading-relaxed max-h-36 overflow-y-auto pr-1">
              {product.description}
            </p>

            {/* Features checkmarks */}
            <div className="pt-2 border-t border-slate-800 space-y-1.5 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-cyan-400" />
                <span>Free Express Shipping across India on Orders over ₹999</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                <span>100% Genuine Guarantee • 7-Day Hassle-Free Returns</span>
              </div>
            </div>
          </div>

          {/* Stepper & Action Buttons */}
          <div className="pt-6 border-t border-slate-800 space-y-3 mt-4">
            
            {/* Quantity Selector */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">Quantity</span>
              <div className="flex items-center border border-slate-700 rounded-xl overflow-hidden bg-dark-950">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="px-3 py-1.5 text-slate-400 hover:text-white hover:bg-slate-800 text-sm font-bold"
                >
                  -
                </button>
                <span className="px-4 py-1.5 text-xs font-mono font-semibold text-white">
                  {qty}
                </span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="px-3 py-1.5 text-slate-400 hover:text-white hover:bg-slate-800 text-sm font-bold"
                >
                  +
                </button>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleAddToCart}
                className={`py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  addedAnimation
                    ? 'bg-emerald-600 text-white'
                    : 'bg-dark-850 hover:bg-slate-800 text-white border border-slate-700 hover:border-indigo-500/50'
                }`}
              >
                {addedAnimation ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 text-indigo-400" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>

              <button
                onClick={handleBuyNow}
                className="py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 hover:shadow-indigo-500/50 transition-all"
              >
                <span>Instant Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetailModal;
