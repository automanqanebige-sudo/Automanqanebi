'use client'

import { useCurrency } from '@/context/CurrencyContext'
import { useLanguage } from '@/context/LanguageContext'

type CurrencyToggleProps = {
  className?: string
  compact?: boolean
}

export default function CurrencyToggle({ className = '', compact = false }: CurrencyToggleProps) {
  const { currency, setCurrency } = useCurrency()
  const { t } = useLanguage()

  return (
    <div
      className={`inline-flex items-center rounded-lg border border-border bg-background p-0.5 ${className}`}
      role="group"
      aria-label={t('currency.label')}
    >
      <button
        type="button"
        onClick={() => setCurrency('GEL')}
        className={`rounded-md px-2.5 py-1 text-sm font-semibold transition-colors ${
          currency === 'GEL'
            ? 'bg-primary text-primary-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        }`}
        aria-pressed={currency === 'GEL'}
      >
        {compact ? '₾' : '₾ GEL'}
      </button>
      <button
        type="button"
        onClick={() => setCurrency('USD')}
        className={`rounded-md px-2.5 py-1 text-sm font-semibold transition-colors ${
          currency === 'USD'
            ? 'bg-primary text-primary-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        }`}
        aria-pressed={currency === 'USD'}
      >
        {compact ? '$' : '$ USD'}
      </button>
    </div>
  )
}
