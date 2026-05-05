'use client'

import { Car, TrendingUp, Shield, Tag } from 'lucide-react'

const stats = [
  { icon: TrendingUp, value: '2,500+', label: 'განცხადება' },
  { icon: Shield, value: '100%', label: 'უსაფრთხო' },
  { icon: Tag, value: 'უფასო', label: 'დამატება' },
]

export default function HeroSection() {
  return (
    <section className="relative border-b border-border bg-gradient-to-b from-primary/5 via-background to-background">
      {/* Background elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -right-20 top-20 h-60 w-60 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:py-16 lg:px-8 lg:py-20">
        <div className="flex flex-col items-center text-center">
          {/* Logo badge */}
          <div className="animate-fade-in-up mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/25">
            <Car className="h-8 w-8 text-primary-foreground" />
          </div>

          {/* Badge */}
          <div className="animate-fade-in-up mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary [animation-delay:50ms]">
            <span className="flex h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            საქართველოს #1 ავტო პლატფორმა
          </div>

          <h1 className="animate-fade-in-up text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl [animation-delay:100ms]">
            AUTOMANQANEBI.GE
          </h1>

          <p className="animate-fade-in-up mt-4 max-w-md text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg [animation-delay:150ms]">
            იყიდე, გაყიდე, იქირავე — სწრაფად, მარტივად და უსაფრთხოდ
          </p>

          {/* Stats */}
          <div className="animate-fade-in-up mt-10 grid w-full max-w-md grid-cols-3 gap-4 [animation-delay:200ms]">
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <div key={stat.label} className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card/50 px-3 py-4 backdrop-blur-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-lg font-bold text-foreground sm:text-xl">{stat.value}</span>
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
