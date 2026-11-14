import React from 'react';
import { ShieldCheck, RefreshCw, Cpu, Award, Zap } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="w-full bg-dark-950 border-t border-slate-800/80 mt-20 pt-12 pb-8 text-slate-400 text-xs font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Core Architecture Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-12 border-b border-slate-800/60">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-200 text-sm mb-1">Normalized RTK Store</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Single source of truth with <code>createEntityAdapter</code> and derived <code>createSelector</code> models.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-200 text-sm mb-1">Async Thunk States</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                4-state finite state machine (idle, loading, succeeded, failed) handling network lifecycles.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-200 text-sm mb-1">State Persistence</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Cart items and filter preferences automatically hydrated & synchronized with localStorage.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-200 text-sm mb-1">Telemetry & Analytics</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Custom middleware tracking execution latency, audit errors, and e-commerce conversion triggers.
              </p>
            </div>
          </div>
        </div>

        {/* Brand & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-slate-200">STREAX SELLER STOREFRONT</span>
            <span className="text-amber-400 font-mono text-[11px]">— World's No. 1 Brand &bull; RTK Store</span>
          </div>

          <div className="text-slate-500 text-[11px] font-mono">
            React 18+ • Redux Toolkit (RTK) • React Router v6 • Vitest • INR (₹)
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
