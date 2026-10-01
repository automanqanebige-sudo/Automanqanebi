'use client'

import { useLanguage } from '@/context/LanguageContext'
import { useSiteBanners } from '@/context/SiteBannersContext'
import type { BannerPlacement } from '@/types/site-banner'
import { filterBannersForPlacement } from '@/lib/site-banner-utils'
import SiteBannerDisplay from '@/components/SiteBannerDisplay'

type SiteBannerSlotProps = {
  placement: BannerPlacement
  className?: string
  max?: number
}

function BannerAdPlaceholder({ compact = false }: { compact?: boolean }) {
  const { t } = useLanguage()
  return (
    <div
      className={`flex w-full items-center justify-center rounded-xl border border-dashed border-border bg-card px-4 text-center ${
        compact ? 'min-h-[64px] py-3 sm:min-h-[80px]' : 'min-h-[100px] py-6 sm:min-h-[140px]'
      }`}
      role="img"
      aria-label={t('banner.placeholder')}
    >
      <p className="text-sm font-medium tracking-wide text-muted-foreground sm:text-base">
        {t('banner.placeholder')}
      </p>
    </div>
  )
}

export default function SiteBannerSlot({ placement, className = '', max = 3 }: SiteBannerSlotProps) {
  const { banners } = useSiteBanners()
  const visible = filterBannersForPlacement(banners, placement).slice(0, max)

  return (
    <div className={`mx-auto w-full max-w-7xl ${className}`}>
      {visible.length === 0 ? (
        <BannerAdPlaceholder />
      ) : (
        <div className={`grid gap-3 ${visible.length > 1 ? 'md:grid-cols-2' : ''}`}>
          {visible.map((banner) => (
            <SiteBannerDisplay key={banner.id} banner={banner} />
          ))}
        </div>
      )}
    </div>
  )
}

/** Full-bleed strip (navbar below) */
export function SiteBannerGlobalStrip({ placement }: { placement: BannerPlacement }) {
  const { banners } = useSiteBanners()
  const visible = filterBannersForPlacement(banners, placement).slice(0, 2)

  return (
    <div className="border-b border-border/60 bg-background/95 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl space-y-2 px-2 py-2 sm:px-4">
        {visible.length === 0 ? (
          <BannerAdPlaceholder compact />
        ) : (
          visible.map((banner) => <SiteBannerDisplay key={banner.id} banner={banner} />)
        )}
      </div>
    </div>
  )
}
