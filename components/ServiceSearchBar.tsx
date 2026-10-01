'use client'

import { Search, X } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

type ServiceSearchBarProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  resultCount?: number
  compact?: boolean
}

export default function ServiceSearchBar({
  value,
  onChange,
  placeholder,
  resultCount,
  compact,
}: ServiceSearchBarProps) {
  const { t } = useLanguage()

  return (
    <div className={compact ? 'space-y-1' : 'space-y-2'}>
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          inputMode="search"
          enterKeyHint="search"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder ?? t('services.searchPlaceholder')}
          className={`w-full rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary ${
            compact ? 'py-2.5 pl-11 pr-10 text-sm' : 'py-3 pl-12 pr-12 text-base'
          }`}
        />
        {value ? (
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 transition-colors hover:bg-secondary"
            aria-label={t('search.reset')}
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        ) : null}
      </div>
      {resultCount != null && value.trim() ? (
        <p className="text-sm text-muted-foreground">
          {t('services.searchResults').replace('{{count}}', String(resultCount))}
        </p>
      ) : null}
    </div>
  )
}
