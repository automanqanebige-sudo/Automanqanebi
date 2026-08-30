'use client'

import { useMemo, useState } from 'react'
import { X } from 'lucide-react'

type TypeaheadInputProps = {
  label?: string
  value: string
  onChange: (value: string) => void
  onSelect?: (value: string) => void
  options: string[]
  placeholder?: string
  disabled?: boolean
  emptyLabel?: string
  className?: string
}

export default function TypeaheadInput({
  label,
  value,
  onChange,
  onSelect,
  options,
  placeholder,
  disabled = false,
  emptyLabel,
  className = '',
}: TypeaheadInputProps) {
  const [open, setOpen] = useState(false)

  const filtered = useMemo(() => {
    const q = value.trim().toLowerCase()
    const list = q
      ? options.filter((opt) => opt.toLowerCase().includes(q))
      : options
    return list.slice(0, 12)
  }, [options, value])

  const select = (next: string) => {
    onChange(next)
    onSelect?.(next)
    setOpen(false)
  }

  const inputClass =
    'w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50'

  return (
    <label className={`block ${className}`}>
      {label ? (
        <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
      ) : null}
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && filtered[0]) {
              e.preventDefault()
              select(filtered[0])
            }
            if (e.key === 'Escape') setOpen(false)
          }}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
          className={inputClass}
        />
        {value && !disabled ? (
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => onChange('')}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 hover:bg-secondary"
            aria-label="Clear"
          >
            <X className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        ) : null}
        {open && !disabled && filtered.length > 0 ? (
          <ul className="absolute left-0 right-0 top-full z-30 mt-1 max-h-52 overflow-y-auto rounded-xl border border-border bg-card shadow-lg">
            {filtered.map((opt) => (
              <li key={opt}>
                <button
                  type="button"
                  className="flex w-full px-3 py-2.5 text-left text-sm hover:bg-secondary"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => select(opt)}
                >
                  {opt}
                </button>
              </li>
            ))}
          </ul>
        ) : null}
        {open && !disabled && value.trim() && filtered.length === 0 && emptyLabel ? (
          <div className="absolute left-0 right-0 top-full z-30 mt-1 rounded-xl border border-border bg-card px-3 py-2.5 text-sm text-muted-foreground shadow-lg">
            {emptyLabel}
          </div>
        ) : null}
      </div>
    </label>
  )
}
