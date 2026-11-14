import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { selectCartItemCount } from '../../features/cart/cartSelectors';
import { selectAuth, logoutUser } from '../../features/auth/authSlice';
import { setSearchQuery } from '../../features/products/productsSlice';
import { selectProductFilters } from '../../features/products/productsSelectors';
import {
  ShoppingCart,
  Search,
  Package,
  User,
  LogOut,
  Zap,
  SlidersHorizontal,
  X
} from 'lucide-react';

export const Navbar = ({ onOpenCart, onToggleFilters }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const cartItemCount = useSelector(selectCartItemCount);
  const { user, isAuthenticated } = useSelector(selectAuth);
  const filters = useSelector(selectProductFilters);

  const handleSearchChange = (e) => {
    dispatch(setSearchQuery(e.target.value));
    if (location.pathname !== '/') {
      navigate('/');
    }
  };

  const handleClearSearch = () => {
    dispatch(setSearchQuery(''));
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-dark-950/80 backdrop-blur-xl border-b border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30 group-hover:shadow-indigo-500/50 transition-all duration-300">
            <Zap className="w-5 h-5 text-white fill-white/20 transform group-hover:rotate-12 transition-transform" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base sm:text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-rose-300 to-indigo-300">
                STREAX SELLER
              </span>
              <span className="text-[10px] uppercase font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                WORLD'S #1
              </span>
            </div>
            <span className="text-[10px] text-amber-400/90 block -mt-1 font-mono tracking-wider font-semibold">
              WORLD'S NO. 1 BRAND
            </span>
          </div>
        </Link>

        {/* Global Live Search Bar */}
        <div className="flex-1 max-w-xl mx-2 hidden sm:block">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search catalog by title, keyword, specs..."
              value={filters?.search || ''}
              onChange={handleSearchChange}
              className="w-full bg-dark-900/90 text-sm text-slate-200 placeholder-slate-500 rounded-xl pl-10 pr-9 py-2 border border-slate-800 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/40 transition-all font-sans"
            />
            {filters?.search && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-0.5"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Actions / Nav links */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Mobile Filter Toggle (only on homepage) */}
          {location.pathname === '/' && onToggleFilters && (
            <button
              onClick={onToggleFilters}
              className="lg:hidden p-2 rounded-xl bg-dark-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
              title="Toggle Filters"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          )}

          {/* Orders History Link */}
          <Link
            to="/orders"
            className={`hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
              location.pathname === '/orders'
                ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent'
            }`}
          >
            <Package className="w-4 h-4 text-indigo-400" />
            <span>Orders</span>
          </Link>

          {/* Cart Trigger Button */}
          <button
            onClick={onOpenCart}
            className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl bg-dark-900/90 hover:bg-slate-800/80 border border-slate-800 hover:border-indigo-500/40 text-slate-200 transition-all group"
            title="Open Cart"
          >
            <ShoppingCart className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold hidden sm:inline">Cart</span>
            {cartItemCount > 0 && (
              <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[11px] font-bold text-white bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full shadow-md shadow-indigo-500/40 animate-pulse">
                {cartItemCount}
              </span>
            )}
          </button>

          {/* Auth Status & User Profile */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-semibold text-slate-200 truncate max-w-[120px]">
                  {user?.name}
                </div>
                <div className="text-[10px] text-emerald-400 font-mono">
                  {user?.role === 'admin' ? 'Administrator' : 'Verified Member'}
                </div>
              </div>
              <button
                onClick={() => dispatch(logoutUser())}
                className="p-2 rounded-xl bg-dark-900/80 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-500/30 transition-all"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/25 transition-all hover:shadow-indigo-500/40"
            >
              <User className="w-4 h-4" />
              <span>Sign In</span>
            </Link>
          )}

        </div>
      </div>

      {/* Mobile Search Input */}
      <div className="sm:hidden px-4 pb-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search products..."
            value={filters?.search || ''}
            onChange={handleSearchChange}
            className="w-full bg-dark-900 text-sm text-slate-200 placeholder-slate-500 rounded-lg pl-9 pr-8 py-1.5 border border-slate-800 focus:outline-none focus:border-indigo-500"
          />
          {filters?.search && (
            <button
              onClick={handleClearSearch}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
