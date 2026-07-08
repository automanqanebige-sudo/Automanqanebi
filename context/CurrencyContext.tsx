'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

const DEFAULT_USD_TO_GEL = 2.7

type Currency = 'USD' | 'GEL'

type CurrencyContextType = {
  currency: Currency
  rate: number
  setCurrency: (currency: Currency) => void
  toggleCurrency: () => void
  convertPrice: (priceInUsd: number) => number
  formatPrice: (priceInUsd: number) => string
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>('GEL')
  const [rate, setRate] = useState(DEFAULT_USD_TO_GEL)

  useEffect(() => {
    const saved = localStorage.getItem('user-currency')
    if (saved === 'GEL' || saved === 'USD') {
      setCurrencyState(saved)
    }

    fetch('https://open.er-api.com/v6/latest/USD')
      .then((res) => res.json())
      .then((data: { rates?: { GEL?: number } }) => {
        if (data.rates?.GEL) setRate(data.rates.GEL)
      })
      .catch(() => {
        /* keep default rate */
      })
  }, [])

  const setCurrency = useCallback((next: Currency) => {
    setCurrencyState(next)
    localStorage.setItem('user-currency', next)
  }, [])

  const toggleCurrency = useCallback(() => {
    setCurrency(currency === 'GEL' ? 'USD' : 'GEL')
  }, [currency, setCurrency])

  const convertPrice = useCallback(
    (priceInUsd: number) => {
      if (currency === 'GEL') return Math.round(priceInUsd * rate)
      return priceInUsd
    },
    [currency, rate]
  )

  const formatPrice = useCallback(
    (priceInUsd: number) => {
      if (currency === 'GEL') {
        return `${Math.round(priceInUsd * rate).toLocaleString('en-US')} ₾`
      }
      return `$${priceInUsd.toLocaleString('en-US')}`
    },
    [currency, rate]
  )

  const value = useMemo(
    () => ({
      currency,
      rate,
      setCurrency,
      toggleCurrency,
      convertPrice,
      formatPrice,
    }),
    [currency, rate, setCurrency, toggleCurrency, convertPrice, formatPrice]
  )

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (!context) throw new Error('useCurrency must be used within CurrencyProvider')
  return context
}
