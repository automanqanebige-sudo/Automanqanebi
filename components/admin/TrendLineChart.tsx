'use client'

import type { TimeSeriesPoint } from '@/types/analytics'

type TrendLineChartProps = {
  data: TimeSeriesPoint[]
  strokeClass?: string
  fillClass?: string
  emptyLabel: string
}

export default function TrendLineChart({
  data,
  strokeClass = 'stroke-primary',
  fillClass = 'fill-primary/15',
  emptyLabel,
}: TrendLineChartProps) {
  const max = Math.max(...data.map((d) => d.value), 1)
  const hasData = data.some((d) => d.value > 0)
  const width = 640
  const height = 180
  const padX = 8
  const padY = 16
  const innerW = width - padX * 2
  const innerH = height - padY * 2

  if (!hasData) {
    return (
      <div className="flex h-44 items-center justify-center rounded-lg border border-dashed border-border bg-secondary/20 px-4 text-center text-sm text-muted-foreground">
        {emptyLabel}
      </div>
    )
  }

  const points = data.map((point, index) => {
    const x = padX + (data.length <= 1 ? innerW / 2 : (index / (data.length - 1)) * innerW)
    const y = padY + innerH - (point.value / max) * innerH
    return { x, y, point }
  })

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const areaPath = `${linePath} L ${points[points.length - 1]?.x ?? padX} ${padY + innerH} L ${points[0]?.x ?? padX} ${padY + innerH} Z`

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height + 28}`} className="h-auto w-full min-w-[320px]">
        {[0.25, 0.5, 0.75].map((ratio) => (
          <line
            key={ratio}
            x1={padX}
            x2={width - padX}
            y1={padY + innerH * (1 - ratio)}
            y2={padY + innerH * (1 - ratio)}
            className="stroke-border/50"
            strokeDasharray="4 4"
            strokeWidth="1"
          />
        ))}
        <path d={areaPath} className={fillClass} />
        <path d={linePath} className={strokeClass} fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {points.map(({ x, y, point }) => (
          <g key={point.key}>
            <circle cx={x} cy={y} r="4" className="fill-background stroke-primary" strokeWidth="2" />
            {point.value > 0 && (
              <text x={x} y={y - 8} textAnchor="middle" className="fill-foreground text-[10px] font-semibold">
                {point.value}
              </text>
            )}
          </g>
        ))}
        {points.map(({ x, point }, index) => {
          if (data.length > 14 && index % 2 !== 0 && index !== data.length - 1) return null
          return (
            <text
              key={`${point.key}-x`}
              x={x}
              y={height + 18}
              textAnchor="middle"
              className="fill-muted-foreground text-[10px]"
            >
              {point.label}
            </text>
          )
        })}
      </svg>
    </div>
  )
}
