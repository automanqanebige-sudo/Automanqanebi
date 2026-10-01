'use client'

import type { NamedCount } from '@/types/analytics'

type BreakdownChartProps = {
  items: NamedCount[]
  labelForKey: (key: string) => string
  emptyLabel: string
  colorClass?: string
}

export default function BreakdownChart({
  items,
  labelForKey,
  emptyLabel,
  colorClass = 'bg-primary',
}: BreakdownChartProps) {
  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">{emptyLabel}</p>
  }

  const max = Math.max(...items.map((i) => i.count), 1)

  return (
    <div className="space-y-2.5">
      {items.map((item) => (
        <div key={item.name}>
          <div className="mb-1 flex items-center justify-between gap-2 text-xs">
            <span className="truncate font-medium text-foreground">{labelForKey(item.name)}</span>
            <span className="shrink-0 text-muted-foreground">{item.count}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-secondary">
            <div
              className={`h-full rounded-full ${colorClass}`}
              style={{ width: `${(item.count / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
