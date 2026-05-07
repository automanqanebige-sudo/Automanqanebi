"use client";

import { useCurrency } from '@/context/CurrencyContext';
import { Coins } from 'lucide-react';

export default function CurrencySwitcher() {
  const { currency, toggleCurrency } = useCurrency();

  return (
    <button
      onClick={toggleCurrency}
      className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800 px-3 py-1.5 shadow-sm transition-all hover:bg-slate-700 active:scale-95"
    >
      <Coins size={16} className="text-orange-500" />
      <div className="flex gap-1.5 text-sm font-medium">
        <span className={currency === 'GEL' ? 'text-orange-500' : 'text-slate-500'}>₾</span>
        <span className="text-slate-600">|</span>
        <span className={currency === 'USD' ? 'text-orange-500' : 'text-slate-500'}>$</span>
      </div>
    </button>
  );
}
