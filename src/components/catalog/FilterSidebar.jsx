import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectProductFilters, selectCategories, selectPriceRange, selectFilteredCount } from '../../features/products/productsSelectors';
import { setCategory, setSortBy, setMaxPrice, resetFilters } from '../../features/products/productsSlice';
import { SlidersHorizontal, RotateCcw, ArrowUpDown, DollarSign, Tag } from 'lucide-react';

export const FilterSidebar = ({ onClose }) => {
  const dispatch = useDispatch();
  const filters = useSelector(selectProductFilters);
  const categories = useSelector(selectCategories);
  const priceRange = useSelector(selectPriceRange);
  const matchCount = useSelector(selectFilteredCount);

  return (
    <div className="bg-dark-900/90 border border-slate-800/90 rounded-2xl p-5 backdrop-blur-md space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
            Catalog Filters
          </h3>
        </div>
        <button
          onClick={() => dispatch(resetFilters())}
          className="flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-indigo-400 transition-colors"
          title="Reset all filters"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Sort By Dropdown */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <ArrowUpDown className="w-3.5 h-3.5 text-indigo-400" />
          <span>Sort Order</span>
        </label>
        <select
          value={filters.sortBy}
          onChange={(e) => dispatch(setSortBy(e.target.value))}
          className="w-full bg-dark-850 text-slate-200 text-xs rounded-xl px-3 py-2.5 border border-slate-800 focus:outline-none focus:border-indigo-500 font-sans cursor-pointer"
        >
          <option value="featured">Featured / Default</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating-desc">Highest Customer Rating</option>
        </select>
      </div>

      {/* Categories Radio / List */}
      <div className="space-y-2.5">
        <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5 text-cyan-400" />
          <span>Category</span>
        </label>
        <div className="space-y-1.5">
          {categories.map((cat) => (
            <label
              key={cat}
              className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs cursor-pointer transition-all ${
                filters.category === cat
                  ? 'bg-indigo-600/20 text-indigo-300 font-semibold border border-indigo-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
              }`}
            >
              <span className="capitalize">{cat === 'all' ? 'All Catalog' : cat}</span>
              <input
                type="radio"
                name="category"
                checked={filters.category === cat}
                onChange={() => dispatch(setCategory(cat))}
                className="hidden"
              />
            </label>
          ))}
        </div>
      </div>

      {/* Price Ceiling Range Slider */}
      <div className="space-y-3 pt-2 border-t border-slate-800/80">
        <div className="flex items-center justify-between text-xs">
          <label className="font-semibold text-slate-300 flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            <span>Price Ceiling (INR)</span>
          </label>
          <span className="font-mono font-bold text-emerald-400 text-sm">
            ₹{Number(filters.maxPrice).toLocaleString('en-IN')}
          </span>
        </div>
        <input
          type="range"
          min="500"
          max="100000"
          step="500"
          value={filters.maxPrice}
          onChange={(e) => dispatch(setMaxPrice(e.target.value))}
          className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-500 font-mono">
          <span>Min: ₹500</span>
          <span>Max: ₹1,00,000</span>
        </div>
      </div>

      {/* Results pill */}
      <div className="pt-2 text-center">
        <span className="inline-block px-3 py-1 rounded-full text-[11px] font-mono text-slate-400 bg-slate-800/60 border border-slate-800">
          Showing <strong className="text-white">{matchCount}</strong> items
        </span>
      </div>

      {/* Mobile close button */}
      {onClose && (
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-medium text-xs lg:hidden shadow-lg shadow-indigo-600/30"
        >
          Apply Filters
        </button>
      )}

    </div>
  );
};

export default FilterSidebar;
