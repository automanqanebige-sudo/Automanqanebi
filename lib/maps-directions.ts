/** Build turn-by-turn navigation URLs for a destination. */

export function getDirectionsUrl(
  lat: number,
  lng: number,
  label?: string
): string {
  const dest = `${lat},${lng}`
  const q = encodeURIComponent(label?.trim() || dest)

  if (typeof navigator !== 'undefined') {
    const ua = navigator.userAgent || ''
    const isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    if (isIOS) {
      return `https://maps.apple.com/?daddr=${dest}&q=${q}&dirflg=d`
    }
  }

  // Android + desktop: Google Maps directions (uses current location as origin in the app)
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(dest)}&travelmode=driving`
}

export function openDirections(lat: number, lng: number, label?: string): void {
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return
  const url = getDirectionsUrl(lat, lng, label)
  window.open(url, '_blank', 'noopener,noreferrer')
}

export function hasCoordinates(
  value: { latitude?: number; longitude?: number } | null | undefined
): value is { latitude: number; longitude: number } {
  return (
    value != null &&
    typeof value.latitude === 'number' &&
    typeof value.longitude === 'number' &&
    Number.isFinite(value.latitude) &&
    Number.isFinite(value.longitude)
  )
}
