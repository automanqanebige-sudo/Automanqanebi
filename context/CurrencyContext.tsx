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
  /** Stored listing prices are always in GEL */
  convertPrice: (priceInGel: number) => number
  formatPrice: (priceInGel: number) => string
  /** Convert user input in the active currency to GEL for storage/filtering */
  toBasePrice: (displayPrice: number) => number
  /** Convert GEL amount to the active currency for form/filter inputs */
  fromBasePrice: (priceInGel: number) => number
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
    (priceInGel: number) => {
      if (currency === 'GEL') return Math.round(priceInGel)
      return Math.round(priceInGel / rate)
    },
    [currency, rate]
  )

  const formatPrice = useCallback(
    (priceInGel: number) => {
      if (currency === 'GEL') {
        return `${Math.round(priceInGel).toLocaleString('en-US')} ₾`
      }
      return `$${Math.round(priceInGel / rate).toLocaleString('en-US')}`
    },
    [currency, rate]
  )

  const toBasePrice = useCallback(
    (displayPrice: number) => {
      if (currency === 'GEL') return Math.round(displayPrice)
      return Math.round(displayPrice * rate)
    },
    [currency, rate]
  )

  const fromBasePrice = useCallback(
    (priceInGel: number) => {
      if (currency === 'GEL') return Math.round(priceInGel)
      return Math.round(priceInGel / rate)
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
      toBasePrice,
      fromBasePrice,
    }),
    [currency, rate, setCurrency, toggleCurrency, convertPrice, formatPrice, toBasePrice, fromBasePrice]
  )

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (!context) throw new Error('useCurrency must be used within CurrencyProvider')
  return context
}
