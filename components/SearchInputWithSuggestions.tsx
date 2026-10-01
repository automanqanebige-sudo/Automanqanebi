'use client'

import { useEffect, useState } from 'react'
import { Clock, Search, X } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import {
  clearSearchHistory,
  getSearchHistory,
  pushSearchHistory,
} from '@/lib/search-history'

type SearchInputWithSuggestionsProps = {
  value: string
  onChange: (value: string) => void
  onSubmit?: (value: string) => void
  placeholder?: string
  suggestions?: string[]
  showHistory?: boolean
  id?: string
  label?: string
  className?: string
  inputClassName?: string
}

export default function SearchInputWithSuggestions({
  value,
  onChange,
  onSubmit,
  placeholder,
  suggestions = [],
  showHistory = true,
  id,
  label,
  className = '',
  inputClassName = '',
}: SearchInputWithSuggestionsProps) {
  const { t } = useLanguage()
  const [history, setHistory] = useState<string[]>([])
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (showHistory) setHistory(getSearchHistory())
  }, [showHistory])

  const handleSubmit = (submitValue = value) => {
    const q = submitValue.trim()
    if (q.length >= 2 && showHistory) {
      setHistory(pushSearchHistory(q))
    }
    setOpen(false)
    onSubmit?.(q)
  }

  const pick = (next: string) => {
    onChange(next)
    if (showHistory && next.trim().length >= 2) {
      setHistory(pushSearchHistory(next))
    }
    setOpen(false)
    onSubmit?.(next.trim())
  }

  const showPanel =
    open &&
    ((showHistory && history.length > 0 && !value.trim()) || suggestions.length > 0)

  return (
    <div className={className}>
      {label ? (
        <label
          htmlFor={id}
          className="mb-2 block text-xs font-medium uppercase tracking-wide text-muted-foreground"
        >
          {label}
        </label>
      ) : null}
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <input
          id={id}
          type="search"
          value={value}
          onChange={(e) => {
            onChange(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              if (suggestions[0] && value.trim()) pick(suggestions[0])
              else handleSubmit()
            }
          }}
          placeholder={placeholder}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          className={
            inputClassName ||
            'input-premium w-full py-3.5 pl-12 pr-11 text-base'
          }
        />
        {value ? (
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => onChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 transition-colors hover:bg-secondary"
            aria-label={t('search.reset')}
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        ) : null}
        {showPanel ? (
          <div className="absolute left-0 right-0 top-full z-30 mt-1 overflow-hidden rounded-xl border border-border bg-card shadow-lg">
            {showHistory && history.length > 0 && !value.trim() ? (
              <>
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
                        onClick={() => pick(item)}
                      >
                        <Clock className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                        {item}
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
            {suggestions.length > 0 ? (
              <ul className={showHistory && history.length > 0 && !value.trim() ? 'border-t border-border' : ''}>
                {suggestions.map((item) => (
                  <li key={item}>
                    <button
                      type="button"
                      className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm hover:bg-secondary"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => pick(item)}
                    >
                      <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  )
}
