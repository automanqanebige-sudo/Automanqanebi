'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { MapPin, Navigation, Star } from 'lucide-react'
import SearchInputWithSuggestions from '@/components/SearchInputWithSuggestions'
import { useLanguage } from '@/context/LanguageContext'
import { geocodeAddress } from '@/lib/geocode'
import { sortByDistance, withDistanceKm } from '@/lib/geo-distance'
import type { Service } from '@/types/service'

type WorkshopsMapSectionProps = {
  services: Service[]
}

type MapPin = {
  lat: number
  lng: number
  label: string
}

const DEFAULT_CENTER = { lat: 41.7151, lng: 44.8271 }

function workshopSuggestionLabel(service: Service) {
  return `${service.name} — ${service.location}`
}

function findWorkshopByQuery(services: Service[], query: string): Service | undefined {
  const q = query.trim().toLowerCase()
  if (!q) return undefined

  const exact = services.find(
    (s) =>
      s.name.toLowerCase() === q ||
      s.location.toLowerCase() === q ||
      workshopSuggestionLabel(s).toLowerCase() === q
  )
  if (exact) return exact

  return services.find(
    (s) => s.name.toLowerCase().includes(q) || s.location.toLowerCase().includes(q)
  )
}

export default function WorkshopsMapSection({ services }: WorkshopsMapSectionProps) {
  const { t } = useLanguage()
  const [userPos, setUserPos] = useState<{ latitude: number; longitude: number } | null>(null)
  const [geoError, setGeoError] = useState('')
  const [searchError, setSearchError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [searching, setSearching] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [mapPin, setMapPin] = useState<MapPin | null>(null)

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

  const filteredList = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return ranked
    return ranked.filter(
      (s) => s.name.toLowerCase().includes(q) || s.location.toLowerCase().includes(q)
    )
  }, [ranked, searchQuery])

  const searchSuggestions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (q.length < 1) return []
    return ranked
      .filter((s) => s.name.toLowerCase().includes(q) || s.location.toLowerCase().includes(q))
      .map(workshopSuggestionLabel)
      .slice(0, 8)
  }, [searchQuery, ranked])

  const selected = ranked.find((s) => s.id === selectedId)

  const mapCenter = useMemo(() => {
    if (selected?.latitude != null && selected.longitude != null) {
      return { lat: selected.latitude, lng: selected.longitude, precise: true }
    }
    if (mapPin) {
      return { lat: mapPin.lat, lng: mapPin.lng, precise: true }
    }
    if (userPos) {
      return { lat: userPos.latitude, lng: userPos.longitude, precise: false }
    }
    return { ...DEFAULT_CENTER, precise: false }
  }, [selected, mapPin, userPos])

  const bboxPad = mapCenter.precise
    ? { lng: 0.012, lat: 0.008 }
    : { lng: 0.08, lat: 0.05 }

  const bbox = `${mapCenter.lng - bboxPad.lng},${mapCenter.lat - bboxPad.lat},${mapCenter.lng + bboxPad.lng},${mapCenter.lat + bboxPad.lat}`
  const embedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${mapCenter.lat}%2C${mapCenter.lng}`

  const selectWorkshop = (service: Service) => {
    setSelectedId(service.id)
    setMapPin(null)
    setSearchError('')
    setSearchQuery(workshopSuggestionLabel(service))
  }

  const handleMapSearch = async (value: string) => {
    const q = value.trim()
    if (!q) return

    setSearchError('')
    setSearchQuery(q)

    const workshop = findWorkshopByQuery(ranked, q)
    if (workshop) {
      selectWorkshop(workshop)
      return
    }

    setSearching(true)
    try {
      const result = await geocodeAddress(q)
      if (!result) {
        setSearchError(t('services.formMapNotFound'))
        return
      }
      setSelectedId(null)
      setMapPin({
        lat: result.lat,
        lng: result.lng,
        label: result.displayName,
      })
    } catch {
      setSearchError(t('services.formMapSearchError'))
    } finally {
      setSearching(false)
    }
  }

  const nearMe = () => {
    setGeoError('')
    setSearchError('')
    if (!navigator.geolocation) {
      setGeoError(t('services.formMapGeoUnavailable'))
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserPos({ latitude: pos.coords.latitude, longitude: pos.coords.longitude })
        setMapPin(null)
        setSelectedId(null)
        setSearchQuery('')
      },
      () => setGeoError(t('services.formMapGeoError'))
    )
  }

  useEffect(() => {
    if (ranked[0] && !selectedId && !mapPin && !searchQuery) {
      setSelectedId(ranked[0].id)
    }
  }, [ranked, selectedId, mapPin, searchQuery])

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="space-y-3">
        <SearchInputWithSuggestions
          value={searchQuery}
          onChange={(value) => {
            setSearchQuery(value)
            setSearchError('')
            if (!value.trim()) {
              setMapPin(null)
            }
          }}
          onSubmit={handleMapSearch}
          placeholder={t('workshops.mapSearchPlaceholder')}
          suggestions={searchSuggestions}
          showHistory={false}
          inputClassName="w-full rounded-xl border border-border bg-background py-3 pl-12 pr-11 text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60"
        />
        {searching ? (
          <p className="text-xs text-muted-foreground">{t('services.formMapSearching')}</p>
        ) : null}
        {searchError ? <p className="text-sm text-destructive">{searchError}</p> : null}

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={nearMe}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            <Navigation className="h-4 w-4" />
            {t('workshops.nearMe')}
          </button>
          {userPos ? (
            <span className="text-xs text-muted-foreground">{t('workshops.sortedByDistance')}</span>
          ) : null}
        </div>
        {geoError ? <p className="text-sm text-destructive">{geoError}</p> : null}

        <ul className="max-h-[420px] space-y-2 overflow-y-auto rounded-xl border border-border bg-card p-2">
          {filteredList.length === 0 ? (
            <li className="p-4 text-sm text-muted-foreground">{t('workshops.noMapped')}</li>
          ) : (
            filteredList.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => selectWorkshop(s)}
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
                    {s.distanceKm != null ? (
                      <span className="ml-2 text-primary">
                        {s.distanceKm < 1
                          ? `${Math.round(s.distanceKm * 1000)} m`
                          : `${s.distanceKm.toFixed(1)} km`}
                      </span>
                    ) : null}
                  </p>
                  {s.description ? (
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{s.description}</p>
                  ) : null}
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
        {selected ? (
          <div className="rounded-xl border border-border bg-card p-4">
            <h3 className="font-bold text-foreground">{selected.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{selected.location}</p>
            {selected.description ? (
              <p className="mt-2 text-sm text-foreground">{selected.description}</p>
            ) : null}
            <p className="mt-2 text-sm text-muted-foreground">{selected.phone}</p>
            <Link
              href={`/services/${selected.id}`}
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              <Star className="h-4 w-4" />
              {t('workshops.viewDetails')}
            </Link>
          </div>
        ) : mapPin ? (
          <div className="rounded-xl border border-border bg-card p-4">
            <h3 className="font-bold text-foreground">{t('workshops.mapPinTitle')}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{mapPin.label}</p>
            <p className="mt-2 text-xs text-muted-foreground">
              {mapPin.lat.toFixed(5)}, {mapPin.lng.toFixed(5)}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  )
}
