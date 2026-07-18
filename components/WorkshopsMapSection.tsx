'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { MapPin, Navigation, Star } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import type { Service } from '@/types/service'
import { sortByDistance, withDistanceKm } from '@/lib/geo-distance'

type WorkshopsMapSectionProps = {
  services: Service[]
}

export default function WorkshopsMapSection({ services }: WorkshopsMapSectionProps) {
  const { t } = useLanguage()
  const [userPos, setUserPos] = useState<{ latitude: number; longitude: number } | null>(null)
  const [geoError, setGeoError] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const withCoords = useMemo(
    () =>
      services.filter(
        (s) =>
          typeof s.latitude === 'number' &&
          typeof s.longitude === 'number' &&
          Number.isFinite(s.latitude) &&
          Number.isFinite(s.longitude)
      ),
    [services]
  )

  const ranked = useMemo(() => {
    if (!userPos) return withCoords.map((s) => ({ ...s, distanceKm: null as number | null }))
    return sortByDistance(withDistanceKm(withCoords, userPos))
  }, [withCoords, userPos])

  const selected = ranked.find((s) => s.id === selectedId) ?? ranked[0]

  const mapCenter = selected
    ? { lat: selected.latitude!, lng: selected.longitude! }
    : userPos
      ? { lat: userPos.latitude, lng: userPos.longitude }
      : { lat: 41.7151, lng: 44.8271 }

  const bbox = `${mapCenter.lng - 0.08},${mapCenter.lat - 0.05},${mapCenter.lng + 0.08},${mapCenter.lat + 0.05}`
  const embedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${mapCenter.lat}%2C${mapCenter.lng}`

  const nearMe = () => {
    setGeoError('')
    if (!navigator.geolocation) {
      setGeoError(t('services.formMapGeoUnavailable'))
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserPos({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
      () => setGeoError(t('services.formMapGeoError'))
    )
  }

  useEffect(() => {
    if (ranked[0] && !selectedId) setSelectedId(ranked[0].id)
  }, [ranked, selectedId])

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={nearMe}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            <Navigation className="h-4 w-4" />
            {t('workshops.nearMe')}
          </button>
          {userPos && (
            <span className="text-xs text-muted-foreground">{t('workshops.sortedByDistance')}</span>
          )}
        </div>
        {geoError && <p className="text-sm text-destructive">{geoError}</p>}

        <ul className="max-h-[420px] space-y-2 overflow-y-auto rounded-xl border border-border bg-card p-2">
          {ranked.length === 0 ? (
            <li className="p-4 text-sm text-muted-foreground">{t('workshops.noMapped')}</li>
          ) : (
            ranked.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(s.id)}
                  className={`w-full rounded-lg border px-3 py-3 text-left transition-colors ${
                    selectedId === s.id
                      ? 'border-primary bg-primary/5'
                      : 'border-transparent hover:bg-secondary'
                  }`}
                >
                  <p className="font-semibold text-foreground">{s.name}</p>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    {s.location}
                    {s.distanceKm != null && (
                      <span className="ml-2 text-primary">
                        {s.distanceKm < 1
                          ? `${Math.round(s.distanceKm * 1000)} m`
                          : `${s.distanceKm.toFixed(1)} km`}
                      </span>
                    )}
                  </p>
                  {s.description && (
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{s.description}</p>
                  )}
                </button>
              </li>
            ))
          )}
        </ul>
      </div>

      <div className="space-y-3">
        <div className="overflow-hidden rounded-xl border border-border">
          <iframe title="workshops-map" src={embedUrl} className="h-72 w-full" loading="lazy" />
        </div>
        {selected && (
          <div className="rounded-xl border border-border bg-card p-4">
            <h3 className="font-bold text-foreground">{selected.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{selected.location}</p>
            {selected.description && (
              <p className="mt-2 text-sm text-foreground">{selected.description}</p>
            )}
            <p className="mt-2 text-sm text-muted-foreground">{selected.phone}</p>
            <Link
              href={`/services/${selected.id}`}
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              <Star className="h-4 w-4" />
              {t('workshops.viewDetails')}
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
