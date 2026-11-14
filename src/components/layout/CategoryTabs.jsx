import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCategories, selectProductFilters } from '../../features/products/productsSelectors';
import { setCategory } from '../../features/products/productsSlice';
import { Layers, Laptop, Sparkles, Shirt, Sparkle } from 'lucide-react';

const categoryIcons = {
  all: Layers,
  electronics: Laptop,
  jewelery: Sparkles,
  "men's clothing": Shirt,
  "women's clothing": Sparkle
};

export const CategoryTabs = () => {
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);
  const filters = useSelector(selectProductFilters);
  const activeCategory = filters?.category || 'all';

  const formatCategoryName = (cat) => {
    if (cat === 'all') return 'All Categories';
    if (cat === 'jewelery') return 'Jewelry & Luxury';
    if (cat === "men's clothing") return "Men's Apparel";
    if (cat === "women's clothing") return "Women's Fashion";
    if (cat === 'electronics') return 'Electronics & Gear';
    return cat.charAt(0).toUpperCase() + cat.slice(1);
  };

  return (
    <div className="w-full overflow-x-auto pb-2 scrollbar-none">
      <div className="flex items-center gap-2 min-w-max">
        {categories.map((cat) => {
          const isActive = activeCategory === cat;
          const Icon = categoryIcons[cat] || Layers;

          return (
            <button
              key={cat}
              onClick={() => dispatch(setCategory(cat))}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-600/30 scale-102 font-semibold'
                  : 'bg-dark-900/80 hover:bg-slate-800/80 text-slate-300 hover:text-white border border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{formatCategoryName(cat)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryTabs;
