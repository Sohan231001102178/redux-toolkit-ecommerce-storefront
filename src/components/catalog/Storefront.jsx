import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CategoryTabs } from '../layout/CategoryTabs';
import { FilterSidebar } from './FilterSidebar';
import { ProductGrid } from './ProductGrid';
import { ProductDetailModal } from './ProductDetailModal';
import {
  selectProductFilters,
  selectFilteredCount,
  selectAllProducts
} from '../../features/products/productsSelectors';
import { resetFilters } from '../../features/products/productsSlice';
import { Sparkles, Cpu, Layers, ArrowRight, X, Crown, Trophy } from 'lucide-react';

export const Storefront = ({ isFilterMobileOpen, onCloseFilterMobile }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState(null);

  const filters = useSelector(selectProductFilters);
  const matchCount = useSelector(selectFilteredCount);
  const allProducts = useSelector(selectAllProducts);

  const isFiltered =
    filters.category !== 'all' ||
    Boolean(filters.search) ||
    filters.sortBy !== 'featured' ||
    filters.maxPrice < 100000;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Hero Showcase Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950/60 via-dark-900 to-dark-950 border border-indigo-500/20 p-6 sm:p-10 shadow-2xl">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono shadow-lg shadow-amber-950/30">
            <Crown className="w-4 h-4 text-amber-400 fill-amber-400/20" />
            <span className="font-bold tracking-wide">STREAX SELLER &bull; THE WORLD'S NO. 1 BRAND</span>
            <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-ping" />
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Streax Seller Hub, <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-rose-300 to-indigo-400">
              World's No. 1 Brand
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            Welcome to the <strong>World's No. 1 Brand Store</strong> in Indian Rupee (INR ₹). Engineered mandatorily with <strong>Redux Toolkit (RTK)</strong>. Minimal normalized state via 
            <code className="text-amber-300 mx-1">createEntityAdapter</code>, derived financial calculations with 
            <code className="text-cyan-300 mx-1">createSelector</code>, telemetry middleware, and route-level session protection.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-mono">
            <span className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-center gap-1.5 font-semibold">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>World's #1 Certified Brand</span>
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-dark-850/80 border border-slate-800 text-slate-300 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />
              <span>createAsyncThunk Lifecycle</span>
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-dark-850/80 border border-slate-800 text-slate-300 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Reselect Derived Pipeline</span>
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-dark-850/80 border border-slate-800 text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Auto LocalStorage Hydration</span>
            </span>
          </div>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="space-y-4">
        <CategoryTabs />
      </div>

      {/* Active Filter Pill Alert (if any active) */}
      {isFiltered && (
        <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-indigo-300">
            <span className="font-semibold text-white">Active Filters:</span>
            {filters.category !== 'all' && (
              <span className="px-2 py-0.5 rounded-lg bg-indigo-500/20 border border-indigo-500/30">
                Category: {filters.category}
              </span>
            )}
            {filters.search && (
              <span className="px-2 py-0.5 rounded-lg bg-indigo-500/20 border border-indigo-500/30">
                Search: "{filters.search}"
              </span>
            )}
            {filters.maxPrice < 100000 && (
              <span className="px-2 py-0.5 rounded-lg bg-indigo-500/20 border border-indigo-500/30">
                Max: ₹{filters.maxPrice.toLocaleString('en-IN')}
              </span>
            )}
            <span className="text-slate-400 font-mono">({matchCount} items match)</span>
          </div>

          <button
            onClick={() => dispatch(resetFilters())}
            className="flex items-center gap-1 text-slate-300 hover:text-white font-semibold text-[11px]"
          >
            <X className="w-3.5 h-3.5" />
            <span>Clear Filters</span>
          </button>
        </div>
      )}

      {/* Main Catalog Section: Sidebar + Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Desktop Sidebar (1 col) */}
        <div className="hidden lg:block lg:col-span-1 sticky top-24">
          <FilterSidebar />
        </div>

        {/* Mobile Filter Slide-out Overlay */}
        {isFilterMobileOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div className="fixed inset-0 bg-dark-950/80 backdrop-blur-sm" onClick={onCloseFilterMobile} />
            <div className="relative ml-auto w-full max-w-xs h-full bg-dark-900 p-6 overflow-y-auto border-l border-slate-800">
              <FilterSidebar onClose={onCloseFilterMobile} />
            </div>
          </div>
        )}

        {/* Catalog Grid (3 cols) */}
        <div className="lg:col-span-3">
          <ProductGrid onSelectProduct={(p) => setSelectedProduct(p)} />
        </div>

      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onGoToCheckout={() => navigate('/checkout')}
        />
      )}

    </div>
  );
};

export default Storefront;
