'use client'

import { useSiteBanners } from '@/context/SiteBannersContext'
import type { BannerPlacement } from '@/types/site-banner'
import { filterBannersForPlacement } from '@/lib/site-banner-utils'
import SiteBannerDisplay from '@/components/SiteBannerDisplay'

type SiteBannerSlotProps = {
  placement: BannerPlacement
  className?: string
  max?: number
}

export default function SiteBannerSlot({ placement, className = '', max = 3 }: SiteBannerSlotProps) {
  const { banners } = useSiteBanners()
  const visible = filterBannersForPlacement(banners, placement).slice(0, max)

  if (visible.length === 0) return null

  return (
    <div className={`mx-auto w-full max-w-7xl ${className}`}>
      <div className={`grid gap-3 ${visible.length > 1 ? 'md:grid-cols-2' : ''}`}>
        {visible.map((banner) => (
          <SiteBannerDisplay key={banner.id} banner={banner} />
        ))}
      </div>
    </div>
  )
}

/** Full-bleed strip (navbar below) */
export function SiteBannerGlobalStrip({ placement }: { placement: BannerPlacement }) {
  const { banners } = useSiteBanners()
  const visible = filterBannersForPlacement(banners, placement).slice(0, 2)

  if (visible.length === 0) return null

  return (
    <div className="border-b border-border/60 bg-card/50">
      <div className="mx-auto max-w-7xl space-y-2 px-2 py-2 sm:px-4">
        {visible.map((banner) => (
          <SiteBannerDisplay key={banner.id} banner={banner} />
        ))}
      </div>
    </div>
  )
}
