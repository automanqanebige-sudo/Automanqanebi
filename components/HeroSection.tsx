'use client'

import { Search, ArrowRight, TrendingUp, Shield, Zap } from 'lucide-react'
import { useState } from 'react'
import { motion } from 'framer-motion'

const stats = [
  { icon: TrendingUp, value: '2,500+', label: 'განცხადება' },
  { icon: Shield, value: '100%', label: 'დაცული' },
  { icon: Zap, value: '24/7', label: 'მხარდაჭერა' },
]

export default function HeroSection({ onSearch }: { onSearch?: (query: string) => void }) {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = () => {
    onSearch?.(searchQuery)
  }

  return (
    <section className="relative overflow-hidden border-b border-border">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-16 lg:px-8 lg:pb-24 lg:pt-24">
        <div className="mx-auto max-w-3xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
          >
            {"იპოვე შენი "}
            <span className="text-primary">იდეალური</span>
            {" ავტომობილი"}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground lg:text-lg"
          >
            {"საქართველოს უდიდესი ავტომობილების პლატფორმა. იყიდე, გაყიდე და მოძებნე საუკეთესო შეთავაზებები."}
          </motion.p>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mt-8 max-w-xl"
          >
            <div className="flex items-center gap-2 rounded-xl border border-border bg-card p-1.5 shadow-lg shadow-background/50">
              <div className="flex flex-1 items-center gap-2 px-3">
                <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="მოძებნე მარკა, მოდელი..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full bg-transparent py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
              </div>
              <button
                onClick={handleSearch}
                className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                ძებნა
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mx-auto mt-14 grid max-w-lg grid-cols-3 gap-4"
        >
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.label} className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card/50 px-4 py-5">
                <Icon className="h-5 w-5 text-primary" />
                <span className="text-xl font-bold text-foreground">{stat.value}</span>
                <span className="text-xs text-muted-foreground">{stat.label}</span>
              </div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
