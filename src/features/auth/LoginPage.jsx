import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  loginUser,
  selectIsAuthenticated,
  selectAuthStatus,
  selectAuthError,
  clearAuthError
} from './authSlice';
import { Lock, Mail, User, ShieldCheck, AlertCircle, RefreshCw, Zap, ArrowRight } from 'lucide-react';

export const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const status = useSelector(selectAuthStatus);
  const error = useSelector(selectAuthError);

  const [email, setEmail] = useState('rohit@streaxsellers.in');
  const [password, setPassword] = useState('streaxPass2026');
  const [name, setName] = useState('Rohit Sharma');

  // Destination return path from ProtectedRoute
  const fromPath = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(fromPath, { replace: true });
    }
  }, [isAuthenticated, navigate, fromPath]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password, name }));
  };

  const handleQuickFill = (presetEmail, presetName) => {
    setEmail(presetEmail);
    setName(presetName);
    setPassword('secretPass123');
    dispatch(clearAuthError());
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 animate-in fade-in">
      <div className="w-full max-w-md bg-dark-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-indigo-950/40 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">Streax Seller Sign In</h2>
          <p className="text-xs text-slate-400">
            {location.state?.from ? (
              <span className="text-indigo-400 font-semibold">
                Please authenticate to access {location.state.from.pathname}
              </span>
            ) : (
              'Enter your credentials or select a 1-click test profile'
            )}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2.5 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Sign In Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Rohit Sharma"
                className="w-full bg-dark-950 text-xs text-white rounded-xl pl-10 pr-3 py-2.5 border border-slate-800 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rohit@streaxsellers.in"
                className="w-full bg-dark-950 text-xs text-white rounded-xl pl-10 pr-3 py-2.5 border border-slate-800 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-dark-950 text-xs text-white rounded-xl pl-10 pr-3 py-2.5 border border-slate-800 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
          >
            {status === 'loading' ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Verifying JWT Session Token (600ms)...</span>
              </>
            ) : (
              <>
                <span>Sign In to Streax Seller</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* 1-Click Quick Fill Credentials */}
        <div className="pt-4 border-t border-slate-800 space-y-2">
          <span className="text-[11px] font-mono text-slate-400 block text-center">
            Or choose a preset test profile:
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleQuickFill('rohit@streaxsellers.in', 'Rohit Sharma')}
              className="p-2.5 rounded-xl bg-dark-850 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/40 text-left transition-all"
            >
              <div className="font-semibold text-white">Rohit Sharma</div>
              <div className="text-[10px] text-indigo-400 font-mono">Verified Customer</div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('admin@streaxsellers.in', 'Streax SuperAdmin')}
              className="p-2.5 rounded-xl bg-dark-850 hover:bg-slate-800 border border-slate-800 hover:border-purple-500/40 text-left transition-all"
            >
              <div className="font-semibold text-white">Seller Admin</div>
              <div className="text-[10px] text-purple-400 font-mono">SuperAdmin</div>
            </button>
          </div>
        </div>

        {/* Security badge */}
        <div className="text-center flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Simulated JWT Auth Lifecycle • Assignment 12</span>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
