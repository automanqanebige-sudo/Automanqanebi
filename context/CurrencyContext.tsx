"use client";
import React, { createContext, useContext, useState } from 'react';

type CurrencyContextType = {
  currency: 'USD' | 'GEL';
  toggleCurrency: () => void;
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<'USD' | 'GEL'>('USD');
  const toggleCurrency = () => setCurrency((prev) => (prev === 'USD' ? 'GEL' : 'USD'));

  return (
    <CurrencyContext.Provider value={{ currency, toggleCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error('useCurrency must be used within CurrencyProvider');
  return context;
}
