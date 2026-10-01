import type { BannerPlacement, BannerSize, SiteBanner } from '@/types/site-banner'

export function isBannerScheduleActive(banner: SiteBanner, now = new Date()): boolean {
  if (banner.startsAt) {
    const start = new Date(banner.startsAt)
    if (!Number.isNaN(start.getTime()) && now < start) return false
  }
  if (banner.expiresAt) {
    const end = new Date(banner.expiresAt)
    if (!Number.isNaN(end.getTime()) && now > end) return false
  }
  return true
}

export function isBannerVisible(banner: SiteBanner, now = new Date()): boolean {
  return banner.active && isBannerScheduleActive(banner, now)
}

export function filterBannersForPlacement(
  banners: SiteBanner[],
  placement: BannerPlacement,
  now = new Date()
): SiteBanner[] {
  return banners
    .filter((b) => b.placement === placement && isBannerVisible(b, now))
    .sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name))
}

export function bannerSizeClass(size: BannerSize): string {
  switch (size) {
    case 'full':
      return 'w-full aspect-[21/9] max-h-[300px] sm:max-h-[360px]'
    case 'large':
      return 'w-full aspect-[16/6] max-h-[280px]'
    case 'medium':
      return 'w-full max-w-4xl mx-auto aspect-[16/7] max-h-[220px]'
    case 'compact':
      return 'w-full h-16 sm:h-20 md:h-24'
    case 'leaderboard':
      return 'w-full max-w-[728px] mx-auto aspect-[728/90] max-h-[90px]'
    case 'square':
      return 'w-full max-w-sm mx-auto aspect-square max-h-[320px]'
    default:
      return 'w-full aspect-[16/6] max-h-[240px]'
  }
}

export function bannerHasMedia(banner: SiteBanner): boolean {
  if (banner.mediaType === 'video') return Boolean(banner.videoUrl?.trim())
  if (banner.mediaType === 'slideshow') return (banner.slideUrls?.length ?? 0) > 0
  return Boolean(banner.imageUrl?.trim())
}
