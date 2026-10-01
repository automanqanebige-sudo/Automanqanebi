import { geocodeAddress } from '@/lib/geocode'
import { hasStoredCoords } from '@/lib/service-map-eligibility'
import type { Service } from '@/types/service'

export type MappedService = Service & {
  latitude: number
  longitude: number
  geocoded?: boolean
}

const CACHE_KEY = 'automanqanebi-service-geocode-v1'

type GeocodeCache = Record<string, { lat: number; lng: number }>

function readCache(): GeocodeCache {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    return raw ? (JSON.parse(raw) as GeocodeCache) : {}
  } catch {
    return {}
  }
}

function writeCache(cache: GeocodeCache) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache))
  } catch {
    /* quota */
  }
}

function cacheKey(service: Service) {
  return `${service.id}:${service.location.trim().toLowerCase()}`
}

export function servicesWithStoredCoords(services: Service[]): MappedService[] {
  return services.filter(hasStoredCoords).map((s) => ({
    ...s,
    latitude: s.latitude as number,
    longitude: s.longitude as number,
  }))
}

/** Geocode services missing coordinates (respects Nominatim ~1 req/s). */
export async function resolveMissingServiceCoordinates(
  services: Service[],
  onBatch?: (mapped: MappedService[]) => void
): Promise<MappedService[]> {
  const cache = readCache()
  const mapped = new Map<string, MappedService>()

  for (const service of services) {
    if (hasStoredCoords(service)) {
      mapped.set(service.id, {
        ...service,
        latitude: service.latitude as number,
        longitude: service.longitude as number,
      })
      continue
    }

    const key = cacheKey(service)
    const cached = cache[key]
    if (cached) {
      mapped.set(service.id, {
        ...service,
        latitude: cached.lat,
        longitude: cached.lng,
        geocoded: true,
      })
    }
  }

  onBatch?.(Array.from(mapped.values()))

  const pending = services.filter((s) => !mapped.has(s.id))
  for (const service of pending) {
    const location = service.location.trim()
    if (!location) continue

    await new Promise((r) => setTimeout(r, 1100))
    try {
      const result = await geocodeAddress(location)
      if (!result) continue
      cache[cacheKey(service)] = { lat: result.lat, lng: result.lng }
      writeCache(cache)
      mapped.set(service.id, {
        ...service,
        latitude: result.lat,
        longitude: result.lng,
        geocoded: true,
      })
      onBatch?.(Array.from(mapped.values()))
    } catch {
      /* skip failed geocode */
    }
  }

  return Array.from(mapped.values())
}
