import React, { useState, useEffect } from 'react';
import { subscribeTelemetry, telemetryLog } from '../../app/middleware/loggerAnalyticsMiddleware';
import { Activity, X, Trash2, Zap, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

export const TelemetryHUD = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [logs, setLogs] = useState([...telemetryLog]);

  useEffect(() => {
    const unsubscribe = subscribeTelemetry((updatedLogs) => {
      setLogs(updatedLogs);
    });
    return unsubscribe;
  }, []);

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-dark-850/90 hover:bg-dark-800 text-xs font-mono border border-indigo-500/30 shadow-lg shadow-indigo-950/50 backdrop-blur-md transition-all hover:scale-105 group"
        title="Open Redux Telemetry & Action Stream"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
        </span>
        <span className="text-slate-300 font-semibold group-hover:text-white">RTK Telemetry</span>
        <span className="px-1.5 py-0.5 rounded text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
          {logs.length}
        </span>
      </button>

      {/* Floating Drawer / Modal */}
      {isOpen && (
        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-dark-900/95 border-l border-slate-800/80 shadow-2xl backdrop-blur-xl flex flex-col animate-in slide-in-from-right duration-200">
          {/* Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-dark-950/60">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-400" />
              <div>
                <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                  Action Telemetry Stream
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Live
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400 font-mono">loggerAnalyticsMiddleware.js</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setLogs([])}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 text-xs"
                title="Clear Logs"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Action List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5 font-mono text-xs">
            {logs.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-2 py-12">
                <Activity className="w-8 h-8 opacity-40 animate-pulse" />
                <p>Waiting for dispatched Redux actions...</p>
                <p className="text-[11px]">Click items, filter catalog, or update cart to observe live actions.</p>
              </div>
            ) : (
              logs.map((log) => {
                let badgeClass = 'bg-slate-800 text-slate-300 border-slate-700';
                if (log.isConversion) {
                  badgeClass = 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
                } else if (log.isError) {
                  badgeClass = 'bg-rose-500/15 text-rose-400 border-rose-500/30';
                } else if (log.type.startsWith('cart/')) {
                  badgeClass = 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30';
                } else if (log.type.startsWith('products/')) {
                  badgeClass = 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30';
                }

                return (
                  <div
                    key={log.id}
                    className="p-2.5 rounded-lg bg-dark-850/80 border border-slate-800/80 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${badgeClass} truncate max-w-[260px]`}>
                        {log.type}
                      </span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1 shrink-0">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {log.durationMs}ms
                      </span>
                    </div>

                    {log.isConversion && (
                      <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 mt-1 mb-1 font-semibold">
                        <Zap className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/30" />
                        <span>Conversion Event: {log.conversionType}</span>
                      </div>
                    )}

                    {log.isError && (
                      <div className="flex items-center gap-1.5 text-[11px] text-rose-400 mt-1 mb-1 font-semibold">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Thunk Failure Audited</span>
                      </div>
                    )}

                    {log.payload !== undefined && (
                      <details className="mt-1 cursor-pointer">
                        <summary className="text-[10px] text-slate-500 hover:text-slate-300 select-none">
                          View Payload
                        </summary>
                        <pre className="mt-1 p-2 rounded bg-black/40 text-[10px] text-slate-300 overflow-x-auto border border-slate-800/50">
                          {JSON.stringify(log.payload, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer note */}
          <div className="p-3 border-t border-slate-800 text-[11px] text-slate-500 bg-dark-950/80 text-center font-mono">
            Intercepted via store =&gt; next =&gt; action middleware
          </div>
        </div>
      )}
    </>
  );
};

export default TelemetryHUD;
