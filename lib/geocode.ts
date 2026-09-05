export type GeocodeResult = {
  lat: number
  lng: number
  displayName: string
}

export async function geocodeAddress(
  query: string,
  countrySuffix = 'Georgia'
): Promise<GeocodeResult | null> {
  const q = query.trim()
  if (!q) return null

  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(`${q}, ${countrySuffix}`)}&format=json&limit=1`,
    { headers: { Accept: 'application/json' } }
  )
  if (!res.ok) throw new Error('Geocode request failed')

  const data = (await res.json()) as { lat: string; lon: string; display_name: string }[]
  if (!data.length) return null

  return {
    lat: Number(data[0].lat),
    lng: Number(data[0].lon),
    displayName: data[0].display_name,
  }
}
