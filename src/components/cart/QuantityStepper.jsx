import React from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';

export const QuantityStepper = ({ qty, onIncrease, onDecrease, onChange }) => {
  return (
    <div className="flex items-center border border-slate-700/80 rounded-xl overflow-hidden bg-dark-950/80">
      <button
        onClick={onDecrease}
        className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        title={qty <= 1 ? 'Remove item from cart' : 'Decrease quantity'}
      >
        {qty <= 1 ? (
          <Trash2 className="w-3.5 h-3.5 text-rose-400" />
        ) : (
          <Minus className="w-3.5 h-3.5" />
        )}
      </button>

      <input
        type="number"
        min="0"
        value={qty}
        onChange={(e) => onChange && onChange(e.target.value)}
        className="w-10 text-center bg-transparent text-xs font-mono font-bold text-white focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />

      <button
        onClick={onIncrease}
        className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        title="Increase quantity"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export default QuantityStepper;
