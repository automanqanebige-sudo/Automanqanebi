'use client'

import { Search, X, Clock } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import type { OfferType } from '@/types/filters'
import { OFFER_TYPES } from '@/types/filters'
import {
  clearSearchHistory,
  getSearchHistory,
  pushSearchHistory,
} from '@/lib/search-history'

type ListingQuickSearchProps = {
  search: string
  offerType: OfferType
  onSearchChange: (value: string) => void
  onOfferTypeChange: (value: OfferType) => void
  onSubmit?: () => void
  resultCount?: number
}

export default function ListingQuickSearch({
  search,
  offerType,
  onSearchChange,
  onOfferTypeChange,
  onSubmit,
  resultCount,
}: ListingQuickSearchProps) {
  const { t } = useLanguage()
  const [history, setHistory] = useState<string[]>([])
  const [showHistory, setShowHistory] = useState(false)

  useEffect(() => {
    setHistory(getSearchHistory())
  }, [])

  const handleSubmit = () => {
    if (search.trim().length >= 2) {
      setHistory(pushSearchHistory(search))
    }
    setShowHistory(false)
    onSubmit?.()
  }

  return (
    <div className="mb-4 space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative min-w-0 flex-1">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setShowHistory(true)}
            onBlur={() => setTimeout(() => setShowHistory(false), 150)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder={t('search.placeholder')}
            aria-label={t('search.placeholder')}
            className="input-premium w-full py-3.5 pl-12 pr-11 text-base"
            autoComplete="off"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 transition-colors hover:bg-secondary"
              aria-label={t('search.reset')}
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
          {showHistory && history.length > 0 && (
            <div className="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-xl border border-border bg-card shadow-lg">
              <div className="flex items-center justify-between border-b border-border px-3 py-2">
                <span className="text-xs font-medium text-muted-foreground">
                  {t('search.recent')}
                </span>
                <button
                  type="button"
                  className="text-xs text-primary hover:underline"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    clearSearchHistory()
                    setHistory([])
                  }}
                >
                  {t('search.clearHistory')}
                </button>
              </div>
              <ul>
                {history.map((item) => (
                  <li key={item}>
                    <button
                      type="button"
                      className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm hover:bg-secondary"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        onSearchChange(item)
                        setHistory(pushSearchHistory(item))
                        setShowHistory(false)
                        onSubmit?.()
                      }}
                    >
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          className="btn-primary inline-flex shrink-0 rounded-xl px-8 py-3.5 text-base"
        >
          <Search className="h-5 w-5" />
          {t('search.button')}
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs font-medium text-muted-foreground">{t('filter.section.offerType')}:</span>
        <div
          className="inline-flex rounded-xl border border-border bg-card p-0.5"
          role="group"
          aria-label={t('filter.section.offerType')}
        >
          {OFFER_TYPES.map((type) => {
            const active = offerType === type
            return (
              <button
                key={type || 'all'}
                type="button"
                onClick={() => onOfferTypeChange(type as OfferType)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                {type ? t(`filter.offer.${type}`) : t('filter.all')}
              </button>
            )
          })}
        </div>
        {resultCount != null && search.trim() && (
          <span className="text-sm text-muted-foreground">
            {resultCount} {t('home.found')}
          </span>
        )}
      </div>
    </div>
  )
}
