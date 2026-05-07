"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface CurrencyContextType {
  currency: 'GEL' | 'USD';
  rate: number;
  toggleCurrency: () => void;
  convertPrice: (priceInUSD: number) => number;
  formatPrice: (priceInUSD: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<'GEL' | 'USD'>('GEL');
  const [rate, setRate] = useState(2.7);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Load user preference from localStorage
    const savedCurrency = localStorage.getItem('user-currency') as 'GEL' | 'USD';
    if (savedCurrency) setCurrency(savedCurrency);

    // Fetch real exchange rate from API
    const fetchRate = async () => {
      try {
        const res = await fetch('https://open.er-api.com/v6/latest/USD');
        const data = await res.json();
        if (data.rates && data.rates.GEL) {
          setRate(data.rates.GEL);
        }
      } catch (error) {
        console.error("Failed to fetch exchange rate:", error);
      }
    };

    fetchRate();
  }, []);

  const toggleCurrency = useCallback(() => {
    const newCurrency = currency === 'GEL' ? 'USD' : 'GEL';
    setCurrency(newCurrency);
    if (mounted) {
      localStorage.setItem('user-currency', newCurrency);
    }
  }, [currency, mounted]);

  const convertPrice = useCallback((priceInUSD: number) => {
    if (currency === 'GEL') {
      return Math.round(priceInUSD * rate);
    }
    return priceInUSD;
  }, [currency, rate]);

  const formatPrice = useCallback((priceInUSD: number) => {
    if (currency === 'GEL') {
      const converted = Math.round(priceInUSD * rate);
      return `${converted.toLocaleString()} ₾`;
    }
    return `$${priceInUSD.toLocaleString()}`;
  }, [currency, rate]);

  return (
    <CurrencyContext.Provider value={{ currency, rate, toggleCurrency, convertPrice, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error('useCurrency must be used within CurrencyProvider');
  return context;
}
