'use client'

import { TrendingUp, Clock, Tag } from 'lucide-react'

const stats = [
  { icon: TrendingUp, value: '12+', label: 'განცხადება' },
  { icon: Clock, value: '24/7', label: 'ხელმისაწვდომი' },
  { icon: Tag, value: 'უფასო', label: 'განცხადება' },
]

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-primary/5 to-transparent">
      {/* Background image/pattern */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-12 lg:px-8 lg:py-16">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <div className="animate-fade-in-up mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary">
            <span className="flex h-2 w-2 rounded-full bg-primary" />
            საქართველო #1 მარკეტი
          </div>

          <h1 className="animate-fade-in-up text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl [animation-delay:100ms]">
            AUTOMANQANEBI.GE
          </h1>

          <p className="animate-fade-in-up mt-3 max-w-lg text-pretty text-base leading-relaxed text-muted-foreground [animation-delay:200ms]">
            იყიდე, გაყიდე, იქირავე — სწრაფად და მარტივად
          </p>

          {/* Stats */}
          <div className="animate-fade-in-up mt-8 grid grid-cols-3 gap-6 [animation-delay:300ms]">
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <div key={stat.label} className="flex flex-col items-center gap-1">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-card border border-border">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-lg font-bold text-foreground">{stat.value}</span>
                  <span className="text-xs text-muted-foreground">{stat.label}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
