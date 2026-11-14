import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../features/cart/cartSlice';
import { selectCartItemsMap } from '../../features/cart/cartSelectors';
import { formatINR } from '../../utils/currency';
import { Star, ShoppingBag, Eye, Check } from 'lucide-react';

export const ProductCard = ({ product, onSelect }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItemsMap);
  const cartItem = cartItems[product.id];
  const qtyInCart = cartItem?.qty || 0;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    dispatch(addToCart({ product, qty: 1 }));
  };

  return (
    <div
      onClick={() => onSelect(product)}
      className="group relative bg-dark-900/90 rounded-2xl border border-slate-800/80 hover:border-indigo-500/50 transition-all duration-300 flex flex-col overflow-hidden hover:shadow-2xl hover:shadow-indigo-950/40 cursor-pointer"
    >
      {/* Category Tag & Rating Overlay */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        <span className="px-2.5 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-wider bg-dark-950/80 backdrop-blur-md text-indigo-300 border border-slate-800">
          {product.category}
        </span>
        <div className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-bold bg-dark-950/80 backdrop-blur-md text-amber-400 border border-slate-800">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <span>{product.rating?.rate || '4.5'}</span>
          <span className="text-slate-500 text-[10px]">({product.rating?.count || 85})</span>
        </div>
      </div>

      {/* Image container */}
      <div className="relative h-56 w-full p-6 flex items-center justify-center bg-slate-950/50 overflow-hidden group-hover:bg-slate-900/40 transition-colors">
        <img
          src={product.image}
          alt={product.title}
          className="max-h-full max-w-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Quick View Hover Pill */}
        <div className="absolute inset-0 bg-dark-950/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="px-3 py-1.5 rounded-xl bg-indigo-600/90 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-indigo-900/50 transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye className="w-3.5 h-3.5" />
            Quick Inspect
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-slate-200 text-sm line-clamp-2 mb-1.5 group-hover:text-indigo-300 transition-colors">
            {product.title}
          </h3>
          <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Action Row */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] text-slate-500 font-mono block">PRICE (INR)</span>
            <span className="text-base sm:text-lg font-bold font-mono text-white">
              {formatINR(product.price)}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              qtyInCart > 0
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/30'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 hover:scale-105'
            }`}
            title="Add item to cart"
          >
            {qtyInCart > 0 ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>In Cart ({qtyInCart})</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
