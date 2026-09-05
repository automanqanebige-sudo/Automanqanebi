'use client'

import Link from 'next/link'
import { Building2, Eye, Heart, MessageCircle, ExternalLink } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import type { DealerListingStats } from '@/lib/dealer-listing-stats'

type DealerStatsPanelProps = {
  stats: DealerListingStats
  dealerSlug?: string
  dealerApproved?: boolean
  dealerName?: string
}

export default function DealerStatsPanel({
  stats,
  dealerSlug,
  dealerApproved,
  dealerName,
}: DealerStatsPanelProps) {
  const { t } = useLanguage()

  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-bold text-foreground">
            <Building2 className="h-5 w-5 text-primary" />
            {t('dealer.panelTitle')}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">{t('dealer.panelSubtitle')}</p>
          {dealerName && (
            <p className="mt-1 text-xs text-muted-foreground">
              {dealerName}
              {dealerApproved ? ` · ${t('dealer.approved')}` : ` · ${t('dealer.pending')}`}
            </p>
          )}
        </div>
        {dealerApproved && dealerSlug && (
          <Link
            href={`/dealer/${dealerSlug}`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-primary/30 px-3 py-2 text-sm font-medium text-primary hover:bg-primary/10"
          >
            <ExternalLink className="h-4 w-4" />
            {t('dealer.viewPublic')}
          </Link>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <StatChip label={t('dealer.statListings')} value={stats.totals.listings} />
        <StatChip icon={Eye} label={t('dealer.statViews')} value={stats.totals.views} />
        <StatChip icon={Heart} label={t('dealer.statFavorites')} value={stats.totals.favorites} />
        <StatChip icon={MessageCircle} label={t('dealer.statInquiries')} value={stats.totals.inquiries} />
      </div>

      {stats.byCar.length > 0 && (
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[420px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground">
                <th className="pb-2 font-medium">{t('dealer.colListing')}</th>
                <th className="pb-2 font-medium">{t('dealer.statViews')}</th>
                <th className="pb-2 font-medium">{t('dealer.statFavorites')}</th>
                <th className="pb-2 font-medium">{t('dealer.statInquiries')}</th>
              </tr>
            </thead>
            <tbody>
              {stats.byCar.map((row) => (
                <tr key={row.carId} className="border-b border-border/60 last:border-0">
                  <td className="py-2.5 pr-2">
                    <Link href={`/car/${row.carId}`} className="font-medium text-foreground hover:text-primary hover:underline">
                      {row.title}
                    </Link>
                  </td>
                  <td className="py-2.5 text-muted-foreground">{row.views}</td>
                  <td className="py-2.5 text-muted-foreground">{row.favorites}</td>
                  <td className="py-2.5 text-muted-foreground">{row.inquiries}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

function StatChip({
  icon: Icon,
  label,
  value,
}: {
  icon?: typeof Eye
  label: string
  value: number
}) {
  return (
    <div className="rounded-xl border border-border bg-background/80 px-3 py-2.5">
      <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
        {Icon ? <Icon className="h-3.5 w-3.5 shrink-0" /> : null}
        {label}
      </p>
      <p className="mt-0.5 text-xl font-bold text-foreground">{value}</p>
    </div>
  )
}
