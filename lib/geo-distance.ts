export function haversineKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const toRad = (d: number) => (d * Math.PI) / 180
  const R = 6371
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export type GeoPoint = { latitude: number; longitude: number }

export function withDistanceKm<T extends { latitude?: number; longitude?: number }>(
  items: T[],
  from: GeoPoint
): (T & { distanceKm: number | null })[] {
  return items.map((item) => {
    if (
      typeof item.latitude !== 'number' ||
      typeof item.longitude !== 'number' ||
      !Number.isFinite(item.latitude) ||
      !Number.isFinite(item.longitude)
    ) {
      return { ...item, distanceKm: null }
    }
    return {
      ...item,
      distanceKm: haversineKm(from.latitude, from.longitude, item.latitude, item.longitude),
    }
  })
}

export function sortByDistance<T extends { distanceKm: number | null }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    if (a.distanceKm == null && b.distanceKm == null) return 0
    if (a.distanceKm == null) return 1
    if (b.distanceKm == null) return -1
    return a.distanceKm - b.distanceKm
  })
}
