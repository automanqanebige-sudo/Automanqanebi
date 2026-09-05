'use client'

import { useCurrency } from '@/context/CurrencyContext'
import { useLanguage } from '@/context/LanguageContext'

export type PriceCurrency = 'USD' | 'GEL'

type CurrencyToggleProps = {
  className?: string
  compact?: boolean
  variant?: 'default' | 'floating'
  /** Controlled value — when set, does not change global site currency */
  value?: PriceCurrency
  onChange?: (currency: PriceCurrency) => void
  disabled?: boolean
}

export default function CurrencyToggle({
  className = '',
  compact = false,
  variant = 'default',
  value,
  onChange,
  disabled = false,
}: CurrencyToggleProps) {
  const { currency: globalCurrency, setCurrency } = useCurrency()
  const { t } = useLanguage()

  const currency = value ?? globalCurrency
  const select = (next: PriceCurrency) => {
    if (disabled) return
    if (onChange) onChange(next)
    else setCurrency(next)
  }

  const isFloating = variant === 'floating'

  return (
    <div
      className={`inline-flex items-center ${
        isFloating
          ? 'w-full rounded-xl border border-border/60 bg-background/80 p-1 shadow-inner'
          : 'rounded-lg border border-border bg-background p-0.5'
      } ${className}`}
      role="group"
      aria-label={t('currency.label')}
    >
      <button
        type="button"
        disabled={disabled}
        onClick={() => select('GEL')}
        className={`flex-1 font-semibold transition-all disabled:opacity-50 ${
          isFloating ? 'rounded-lg px-3 py-2 text-base' : 'rounded-md px-2.5 py-1 text-sm'
        } ${
          currency === 'GEL'
            ? isFloating
              ? 'bg-gradient-to-br from-primary to-primary/85 text-primary-foreground shadow-md shadow-primary/25'
              : 'bg-primary text-primary-foreground shadow-sm'
            : 'text-muted-foreground hover:bg-secondary/80 hover:text-foreground'
        }`}
        aria-pressed={currency === 'GEL'}
      >
        {compact ? '₾' : '₾ GEL'}
      </button>
      <button
        type="button"
        disabled={disabled}
        onClick={() => select('USD')}
        className={`flex-1 font-semibold transition-all disabled:opacity-50 ${
          isFloating ? 'rounded-lg px-3 py-2 text-base' : 'rounded-md px-2.5 py-1 text-sm'
        } ${
          currency === 'USD'
            ? isFloating
              ? 'bg-gradient-to-br from-primary to-primary/85 text-primary-foreground shadow-md shadow-primary/25'
              : 'bg-primary text-primary-foreground shadow-sm'
            : 'text-muted-foreground hover:bg-secondary/80 hover:text-foreground'
        }`}
        aria-pressed={currency === 'USD'}
      >
        {compact ? '$' : '$ USD'}
      </button>
    </div>
  )
}
