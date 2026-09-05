import {
  FILTERABLE_SERVICE_CATEGORIES,
  LEGACY_WORKSHOP_CATEGORIES,
  WORKSHOP_PAGE_CATEGORIES,
  type Service,
  type ServiceCategory,
} from '@/types/service'

/** Categories shown on the Georgia services/workshops map */
export const MAP_SERVICE_CATEGORIES: ServiceCategory[] = Array.from(
  new Set([
    ...WORKSHOP_PAGE_CATEGORIES,
    ...LEGACY_WORKSHOP_CATEGORIES,
    ...FILTERABLE_SERVICE_CATEGORIES,
    'mechanic',
    'diagnostics',
    'detailing',
    'painting',
    'carwash',
    'parts',
    'mobile',
    'towing',
  ])
) as ServiceCategory[]

const NON_PHYSICAL_PATTERNS = [/online/i, /\(online\)/i]

export function isPhysicalAutoService(service: Service): boolean {
  if (!MAP_SERVICE_CATEGORIES.includes(service.category)) return false
  if (service.category === 'rental') return false
  const loc = service.location.trim()
  if (!loc) return false
  if (NON_PHYSICAL_PATTERNS.some((re) => re.test(loc))) return false
  return true
}

export function hasStoredCoords(service: Service): boolean {
  return (
    typeof service.latitude === 'number' &&
    typeof service.longitude === 'number' &&
    Number.isFinite(service.latitude) &&
    Number.isFinite(service.longitude)
  )
}

/** Georgia bounding box — south-west / north-east */
export const GEORGIA_BOUNDS: [[number, number], [number, number]] = [
  [41.05, 39.95],
  [43.75, 46.75],
]

export const GEORGIA_CENTER = { lat: 41.7151, lng: 44.8271 }
