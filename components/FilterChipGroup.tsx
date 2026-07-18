'use client'

type FilterChipOption = {
  value: string
  label: string
  emoji?: string
}

type FilterChipGroupProps = {
  options: FilterChipOption[]
  value: string
  onChange: (value: string) => void
  rounded?: 'full' | 'lg'
}

export default function FilterChipGroup({
  options,
  value,
  onChange,
  rounded = 'full',
}: FilterChipGroupProps) {
  const radius = rounded === 'full' ? 'rounded-full' : 'rounded-lg'

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = value === opt.value
        return (
          <button
            key={opt.value || '__all'}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors ${radius} ${
              active
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            {opt.emoji && (
              <span className="text-base leading-none" aria-hidden>
                {opt.emoji}
              </span>
            )}
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

export type { FilterChipOption }
