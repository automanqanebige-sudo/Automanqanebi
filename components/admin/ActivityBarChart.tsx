'use client'

import type { TimeSeriesPoint } from '@/types/analytics'

type ActivityBarChartProps = {
  data: TimeSeriesPoint[]
  colorClass?: string
  emptyLabel: string
}

const BAR_AREA_HEIGHT = 132

export default function ActivityBarChart({
  data,
  colorClass = 'bg-primary',
  emptyLabel,
}: ActivityBarChartProps) {
  const max = Math.max(...data.map((d) => d.value), 1)
  const hasData = data.some((d) => d.value > 0)

  if (!hasData) {
    return (
      <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed border-border bg-secondary/20 px-4 text-center">
        <p className="text-sm text-muted-foreground">{emptyLabel}</p>
      </div>
    )
  }

  return (
    <div>
      <div
        className="relative flex items-end gap-0.5 rounded-lg border border-border/50 bg-gradient-to-t from-secondary/30 to-transparent px-1 pb-0 pt-6 sm:gap-1 sm:px-2"
        style={{ height: BAR_AREA_HEIGHT + 24 }}
      >
        <div
          className="pointer-events-none absolute inset-x-0 top-6 border-b border-dashed border-border/40"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-0 top-[calc(50%+12px)] border-b border-dashed border-border/30"
          aria-hidden
        />

        {data.map((point) => {
          const barHeight =
            point.value > 0 ? Math.max(Math.round((point.value / max) * BAR_AREA_HEIGHT), 6) : 0

          return (
            <div
              key={point.key}
              className="group flex min-w-0 flex-1 flex-col items-center justify-end"
              style={{ height: BAR_AREA_HEIGHT }}
              title={`${point.label}: ${point.value}`}
            >
              {point.value > 0 && (
                <span className="mb-1 text-[10px] font-semibold text-foreground">{point.value}</span>
              )}
              <div
                className={`w-full rounded-t-md shadow-sm transition-all ${colorClass} group-hover:opacity-90`}
                style={{ height: barHeight }}
              />
            </div>
          )
        })}
      </div>

      <div className="mt-2 flex gap-0.5 sm:gap-1">
        {data.map((point) => (
          <span
            key={`${point.key}-label`}
            className="min-w-0 flex-1 truncate text-center text-[9px] leading-tight text-muted-foreground sm:text-[10px]"
          >
            {point.label}
          </span>
        ))}
      </div>
    </div>
  )
}
