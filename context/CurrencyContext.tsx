"use client";
import React, { createContext, useContext, useState, useCallback } from 'react';

const USD_TO_GEL_RATE = 2.65;

type CurrencyContextType = {
  currency: 'USD' | 'GEL';
  toggleCurrency: () => void;
  convertPrice: (priceInUSD: number) => number;
  formatPrice: (priceInUSD: number) => string;
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<'USD' | 'GEL'>('GEL');
  const toggleCurrency = () => setCurrency((prev) => (prev === 'USD' ? 'GEL' : 'USD'));
  
  const convertPrice = useCallback((priceInUSD: number) => {
    if (currency === 'GEL') {
      return Math.round(priceInUSD * USD_TO_GEL_RATE);
    }
    return priceInUSD;
  }, [currency]);
  
  const formatPrice = useCallback((priceInUSD: number) => {
    const converted = convertPrice(priceInUSD);
    const symbol = currency === 'GEL' ? '₾' : '$';
    return `${converted.toLocaleString()} ${symbol}`;
  }, [currency, convertPrice]);

  return (
    <CurrencyContext.Provider value={{ currency, toggleCurrency, convertPrice, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error('useCurrency must be used within CurrencyProvider');
  return context;
}
