"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext({
  currency: 'USD',
  rate: 2.70, // დეფოლტ კურსი
  toggleCurrency: () => {},
});

export const CurrencyProvider = ({ children }: { children: React.ReactNode }) => {
  const [currency, setCurrency] = useState('USD');
  const [rate, setRate] = useState(2.70);

  // რეალური კურსის წამოღება API-დან
  useEffect(() => {
    fetch('https://open.er-api.com/v6/latest/USD')
      .then(res => res.json())
      .then(data => {
        if (data.rates && data.rates.GEL) {
          setRate(data.rates.GEL);
        }
      })
      .catch(err => console.error("კურსის განახლება ვერ მოხერხდა:", err));
  }, []);

  const toggleCurrency = () => {
    setCurrency(prev => prev === 'USD' ? 'GEL' : 'USD');
  };

  return (
    <CurrencyContext.Provider value={{ currency, rate, toggleCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
