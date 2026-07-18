'use client'

import { Search, X } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

type ServicesTopSearchProps = {
  value: string
  onChange: (value: string) => void
}

export default function ServicesTopSearch({ value, onChange }: ServicesTopSearchProps) {
  const { t } = useLanguage()

  return (
    <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
      <label htmlFor="services-search" className="mb-2 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {t('services.searchLabel')}
      </label>
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <input
          id="services-search"
          type="text"
          inputMode="search"
          enterKeyHint="search"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={t('services.searchPlaceholder')}
          className="w-full rounded-xl border border-input bg-background py-3.5 pl-12 pr-11 text-base text-foreground shadow-sm placeholder:text-muted-foreground focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {value ? (
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 transition-colors hover:bg-secondary"
            aria-label={t('search.reset')}
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        ) : null}
      </div>
    </div>
  )
}
