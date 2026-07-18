'use client'

import { useMemo, useState } from 'react'
import {
  BarChart3,
  Car,
  Heart,
  MessageCircle,
  Search,
  UserPlus,
  Wrench,
} from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { buildAdminAnalytics, type AdminAnalyticsInput } from '@/lib/admin-analytics'
import ActivityBarChart from '@/components/admin/ActivityBarChart'
import BreakdownChart from '@/components/admin/BreakdownChart'
import TrendLineChart from '@/components/admin/TrendLineChart'

type AdminAnalyticsDashboardProps = Omit<AdminAnalyticsInput, 'periodDays'> & {
  categoryLabel: (cat: string) => string
  platformTotals?: {
    cars: number
    services: number
    users: number
    eventsLoaded: number
  }
}

const PERIODS = [7, 14, 30, 90] as const

function StatChip({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Car
  label: string
  value: number
}) {
  return (
    <div className="rounded-lg border border-border bg-background/80 px-3 py-2">
      <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
        <Icon className="h-3.5 w-3.5 shrink-0" />
        {label}
      </p>
      <p className="mt-0.5 text-lg font-bold text-foreground">{value}</p>
    </div>
  )
}

export default function AdminAnalyticsDashboard({
  cars,
  services,
  events,
  conversations,
  categoryLabel,
  platformTotals,
}: AdminAnalyticsDashboardProps) {
  const { t } = useLanguage()
  const [periodDays, setPeriodDays] = useState<(typeof PERIODS)[number]>(30)

  const analytics = useMemo(
    () =>
      buildAdminAnalytics({
        periodDays,
        cars,
        services,
        events,
        conversations,
      }),
    [periodDays, cars, services, events, conversations]
  )

  const listingTypeLabel = (key: string) => {
    if (key === 'vip') return 'VIP'
    if (key === 'dealer') return t('filter.listing.dealer')
    return t('admin.analytics.standard')
  }

  const offerLabel = (key: string) =>
    key === 'rent' ? t('filter.offer.rent') : t('filter.offer.sale')

  const combinedActivity = useMemo(() => {
    return analytics.carListings.map((point, index) => ({
      key: point.key,
      label: point.label,
      value:
        point.value +
        (analytics.serviceListings[index]?.value ?? 0) +
        (analytics.carSearches[index]?.value ?? 0) +
        (analytics.serviceSearches[index]?.value ?? 0),
    }))
  }, [analytics])

  return (
    <div className="space-y-6">
      {platformTotals && (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <PlatformStat label={t('admin.statsCars')} value={platformTotals.cars} />
          <PlatformStat label={t('admin.statsServices')} value={platformTotals.services} />
          <PlatformStat label={t('admin.statsUsers')} value={platformTotals.users} />
          <PlatformStat label={t('admin.analytics.eventsLogged')} value={platformTotals.eventsLoaded} />
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-bold text-foreground">
            <BarChart3 className="h-5 w-5 text-primary" />
            {t('admin.analytics.title')}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">{t('admin.analytics.subtitle')}</p>
        </div>
        <div className="flex gap-1 rounded-lg border border-border bg-background p-0.5">
          {PERIODS.map((days) => (
            <button
              key={days}
              type="button"
              onClick={() => setPeriodDays(days)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                periodDays === days
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {days} {t('admin.analytics.days')}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
        <StatChip icon={Car} label={t('admin.analytics.newCars')} value={analytics.totals.carListings} />
        <StatChip icon={Wrench} label={t('admin.analytics.newServices')} value={analytics.totals.serviceListings} />
        <StatChip icon={Search} label={t('admin.analytics.carSearch')} value={analytics.totals.carSearches} />
        <StatChip icon={Search} label={t('admin.analytics.serviceSearch')} value={analytics.totals.serviceSearches} />
        <StatChip icon={MessageCircle} label={t('admin.analytics.chat')} value={analytics.totals.chatMessages} />
        <StatChip icon={Heart} label={t('admin.analytics.favorites')} value={analytics.totals.favorites} />
        <StatChip icon={UserPlus} label={t('admin.analytics.registrations')} value={analytics.totals.registrations} />
      </div>

      <ChartCard title={t('admin.analytics.chartCombined')}>
        <TrendLineChart data={combinedActivity} emptyLabel={t('admin.analytics.noData')} />
      </ChartCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title={t('admin.analytics.chartCarListings')}>
          <ActivityBarChart
            data={analytics.carListings}
            colorClass="bg-primary"
            emptyLabel={t('admin.analytics.noData')}
          />
        </ChartCard>
        <ChartCard title={t('admin.analytics.chartServiceListings')}>
          <ActivityBarChart
            data={analytics.serviceListings}
            colorClass="bg-emerald-500"
            emptyLabel={t('admin.analytics.noData')}
          />
        </ChartCard>
        <ChartCard title={t('admin.analytics.chartCarSearch')}>
          <ActivityBarChart
            data={analytics.carSearches}
            colorClass="bg-sky-500"
            emptyLabel={t('admin.analytics.noSearchYet')}
          />
        </ChartCard>
        <ChartCard title={t('admin.analytics.chartServiceSearch')}>
          <ActivityBarChart
            data={analytics.serviceSearches}
            colorClass="bg-violet-500"
            emptyLabel={t('admin.analytics.noSearchYet')}
          />
        </ChartCard>
        <ChartCard title={t('admin.analytics.chartChat')}>
          <ActivityBarChart
            data={analytics.chatActivity}
            colorClass="bg-amber-500"
            emptyLabel={t('admin.analytics.noData')}
          />
        </ChartCard>
        <ChartCard title={t('admin.analytics.chartFavorites')}>
          <ActivityBarChart
            data={analytics.favorites}
            colorClass="bg-rose-500"
            emptyLabel={t('admin.analytics.noData')}
          />
        </ChartCard>
        <ChartCard title={t('admin.analytics.chartRegistrations')}>
          <ActivityBarChart
            data={analytics.registrations}
            colorClass="bg-indigo-500"
            emptyLabel={t('admin.analytics.noData')}
          />
        </ChartCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title={t('admin.analytics.topCarSearches')}>
          <TopQueriesList items={analytics.topCarSearches} emptyLabel={t('admin.analytics.noSearchYet')} />
        </ChartCard>
        <ChartCard title={t('admin.analytics.topServiceSearches')}>
          <TopQueriesList items={analytics.topServiceSearches} emptyLabel={t('admin.analytics.noSearchYet')} />
        </ChartCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <ChartCard title={t('admin.analytics.offerBreakdown')}>
          <BreakdownChart
            items={analytics.offerTypeBreakdown}
            labelForKey={offerLabel}
            emptyLabel={t('admin.analytics.noData')}
          />
        </ChartCard>
        <ChartCard title={t('admin.analytics.listingTypeBreakdown')}>
          <BreakdownChart
            items={analytics.listingTypeBreakdown}
            labelForKey={listingTypeLabel}
            emptyLabel={t('admin.analytics.noData')}
            colorClass="bg-amber-500"
          />
        </ChartCard>
        <ChartCard title={t('admin.analytics.serviceCategoryBreakdown')}>
          <BreakdownChart
            items={analytics.serviceCategoryBreakdown}
            labelForKey={categoryLabel}
            emptyLabel={t('admin.analytics.noData')}
            colorClass="bg-emerald-500"
          />
        </ChartCard>
      </div>
    </div>
  )
}

function PlatformStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border bg-card px-4 py-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold text-foreground">{value}</p>
    </div>
  )
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <h3 className="mb-3 text-sm font-semibold text-foreground">{title}</h3>
      {children}
    </div>
  )
}

function TopQueriesList({
  items,
  emptyLabel,
}: {
  items: { name: string; count: number }[]
  emptyLabel: string
}) {
  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">{emptyLabel}</p>
  }

  return (
    <ol className="space-y-2">
      {items.map((item, i) => (
        <li key={item.name} className="flex items-center justify-between gap-2 text-sm">
          <span className="flex min-w-0 items-center gap-2">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
              {i + 1}
            </span>
            <span className="truncate text-foreground">{item.name}</span>
          </span>
          <span className="shrink-0 font-medium text-muted-foreground">{item.count}</span>
        </li>
      ))}
    </ol>
  )
}
