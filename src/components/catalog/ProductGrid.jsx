import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ProductCard } from './ProductCard';
import {
  selectFilteredProducts,
  selectProductsStatus,
  selectProductsError
} from '../../features/products/productsSelectors';
import { fetchProducts, resetFilters } from '../../features/products/productsSlice';
import { AlertCircle, RefreshCw, Sparkles, SearchX } from 'lucide-react';

export const ProductGrid = ({ onSelectProduct }) => {
  const dispatch = useDispatch();
  const products = useSelector(selectFilteredProducts);
  const status = useSelector(selectProductsStatus);
  const error = useSelector(selectProductsError);

  const handleRetry = () => {
    dispatch(fetchProducts());
  };

  // 1. Shimmer Loading Skeleton State
  if (status === 'loading') {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
          <span className="flex items-center gap-2">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-400" />
            Querying catalog from store & remote API...
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-dark-900/60 rounded-2xl border border-slate-800 p-4 space-y-4 animate-pulse"
            >
              <div className="h-48 w-full bg-slate-800/60 rounded-xl" />
              <div className="space-y-2">
                <div className="h-4 bg-slate-800/80 rounded w-3/4" />
                <div className="h-3 bg-slate-800/40 rounded w-full" />
                <div className="h-3 bg-slate-800/40 rounded w-2/3" />
              </div>
              <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between">
                <div className="h-6 w-16 bg-slate-800 rounded" />
                <div className="h-8 w-20 bg-slate-800 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 2. Rejected / Error State with interactive Retry Button
  if (status === 'failed') {
    return (
      <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 space-y-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-semibold text-sm text-white">Catalog Service Alert</h4>
            <p className="text-xs text-rose-300/90 leading-relaxed">
              {error || 'Unable to sync latest catalog state from external endpoint.'}
            </p>
          </div>
        </div>
        <div className="pt-2 flex items-center gap-3">
          <button
            onClick={handleRetry}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-rose-950/40 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Request</span>
          </button>
        </div>
      </div>
    );
  }

  // 3. Empty Search / Filter State
  if (products.length === 0) {
    return (
      <div className="p-12 text-center rounded-2xl bg-dark-900/60 border border-slate-800/80 space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-slate-800/60 flex items-center justify-center mx-auto text-slate-400">
          <SearchX className="w-6 h-6" />
        </div>
        <div className="space-y-1 max-w-sm mx-auto">
          <h4 className="font-semibold text-white text-base">No Matching Products</h4>
          <p className="text-xs text-slate-400">
            No items matched your current search keywords or price filter ceiling.
          </p>
        </div>
        <button
          onClick={() => dispatch(resetFilters())}
          className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 transition-colors"
        >
          Reset All Filters
        </button>
      </div>
    );
  }

  // 4. Fulfilled / Success Grid
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onSelect={onSelectProduct}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
