export const BANNER_PLACEMENTS = [
  'global_top',
  'home_below_hero',
  'home_mid',
  'listings_top',
  'services_top',
  'services_mid',
  'global_footer',
] as const

export type BannerPlacement = (typeof BANNER_PLACEMENTS)[number]

export const BANNER_SIZES = [
  'full',
  'large',
  'medium',
  'compact',
  'leaderboard',
  'square',
] as const

export type BannerSize = (typeof BANNER_SIZES)[number]

export const BANNER_MEDIA_TYPES = ['image', 'video', 'slideshow'] as const

export type BannerMediaType = (typeof BANNER_MEDIA_TYPES)[number]

export type SiteBanner = {
  id: string
  /** Admin internal name */
  name: string
  /** Display headline on banner */
  title?: string
  subtitle?: string
  placement: BannerPlacement
  size: BannerSize
  mediaType: BannerMediaType
  imageUrl?: string
  videoUrl?: string
  slideUrls?: string[]
  linkUrl?: string
  linkLabel?: string
  altText?: string
  backgroundColor?: string
  startsAt?: string
  expiresAt?: string
  active: boolean
  sortOrder: number
  openInNewTab: boolean
}

export type SiteBannerInput = Omit<SiteBanner, 'id'>
