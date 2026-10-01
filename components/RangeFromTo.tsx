'use client'

type RangeFromToProps = {
  title: string
  icon?: string
  fromLabel: string
  toLabel: string
  fromValue: string | number
  toValue: string | number
  onFromChange: (value: string) => void
  onToChange: (value: string) => void
  fromPlaceholder?: string
  toPlaceholder?: string
  min?: number
  max?: number
  step?: number
  suffix?: string
  className?: string
}

export default function RangeFromTo({
  title,
  icon,
  fromLabel,
  toLabel,
  fromValue,
  toValue,
  onFromChange,
  onToChange,
  fromPlaceholder = '',
  toPlaceholder = '',
  min,
  max,
  step = 1,
  suffix,
  className = '',
}: RangeFromToProps) {
  const inputClass = 'input-premium'

  return (
    <div className={`rounded-xl border border-border/70 bg-secondary/20 p-3 sm:p-4 ${className}`}>
      <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
        {icon && <span aria-hidden>{icon}</span>}
        {title}
      </p>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
            {fromLabel}
            {suffix ? ` (${suffix})` : ''}
          </label>
          <input
            type="number"
            min={min}
            max={max}
            step={step}
            value={fromValue === 0 || fromValue === '' ? '' : fromValue}
            onChange={(e) => onFromChange(e.target.value)}
            placeholder={fromPlaceholder}
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
            {toLabel}
            {suffix ? ` (${suffix})` : ''}
          </label>
          <input
            type="number"
            min={min}
            max={max}
            step={step}
            value={toValue === 0 || toValue === '' ? '' : toValue}
            onChange={(e) => onToChange(e.target.value)}
            placeholder={toPlaceholder}
            className={inputClass}
          />
        </div>
      </div>
    </div>
  )
}
