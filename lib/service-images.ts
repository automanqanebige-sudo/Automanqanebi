import type { Service } from '@/types/service'

export const MAX_SERVICE_IMAGES = 10

/** Prefer `images[]`, fall back to legacy single `image`. */
export function getServiceImages(service: Pick<Service, 'image' | 'images'>): string[] {
  const fromArray = (service.images ?? []).map((url) => url.trim()).filter(Boolean)
  if (fromArray.length > 0) return fromArray
  const single = service.image?.trim()
  return single ? [single] : []
}

export function primaryServiceImage(service: Pick<Service, 'image' | 'images'>): string | undefined {
  return getServiceImages(service)[0]
}
