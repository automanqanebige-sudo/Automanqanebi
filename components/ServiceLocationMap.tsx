'use client'

import { useState } from 'react'
import { MapPin, Navigation, Search } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { geocodeAddress } from '@/lib/geocode'

const DEFAULT_LAT = 41.7151
const DEFAULT_LNG = 44.8271

type ServiceLocationMapProps = {
  latitude: string
  longitude: string
  onLatitudeChange: (value: string) => void
  onLongitudeChange: (value: string) => void
  disabled?: boolean
}

export default function ServiceLocationMap({
  latitude,
  longitude,
  onLatitudeChange,
  onLongitudeChange,
  disabled,
}: ServiceLocationMapProps) {
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState('')
  const [searching, setSearching] = useState(false)
  const [mapError, setMapError] = useState('')

  const lat = latitude.trim() ? Number(latitude) : DEFAULT_LAT
  const lng = longitude.trim() ? Number(longitude) : DEFAULT_LNG
  const safeLat = Number.isFinite(lat) ? lat : DEFAULT_LAT
  const safeLng = Number.isFinite(lng) ? lng : DEFAULT_LNG

  const bbox = `${safeLng - 0.04},${safeLat - 0.025},${safeLng + 0.04},${safeLat + 0.025}`
  const embedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${safeLat}%2C${safeLng}`

  const useMyLocation = () => {
    setMapError('')
    if (!navigator.geolocation) {
      setMapError(t('services.formMapGeoUnavailable'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onLatitudeChange(String(pos.coords.latitude.toFixed(6)))
        onLongitudeChange(String(pos.coords.longitude.toFixed(6)))
      },
      () => setMapError(t('services.formMapGeoError'))
    )
  }

  const searchAddress = async () => {
    const query = searchQuery.trim()
    if (!query) return

    setSearching(true)
    setMapError('')
    try {
      const result = await geocodeAddress(query)
      if (!result) {
        setMapError(t('services.formMapNotFound'))
        return
      }
      onLatitudeChange(result.lat.toFixed(6))
      onLongitudeChange(result.lng.toFixed(6))
    } catch {
      setMapError(t('services.formMapSearchError'))
    } finally {
      setSearching(false)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
        <MapPin className="h-4 w-4 text-primary" />
        {t('services.formMapTitle')}
      </div>
      <p className="text-xs text-muted-foreground">{t('services.formMapHint')}</p>

      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="text"
          value={searchQuery}
          disabled={disabled}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), searchAddress())}
          placeholder={t('services.formMapSearchPlaceholder')}
          className="flex-1 rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-all focus:ring-2 focus:ring-primary disabled:opacity-60"
        />
        <button
          type="button"
          disabled={disabled || searching}
          onClick={searchAddress}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-secondary px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary/80 disabled:opacity-60"
        >
          <Search className="h-4 w-4" />
          {searching ? t('services.formMapSearching') : t('services.formMapSearch')}
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-border">
        <iframe
          title={t('services.formMapTitle')}
          src={embedUrl}
          className="h-56 w-full border-0 sm:h-64"
          loading="lazy"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
            {t('services.formLatitude')}
          </label>
          <input
            type="number"
            step="any"
            value={latitude}
            disabled={disabled}
            onChange={(e) => onLatitudeChange(e.target.value)}
            placeholder={String(DEFAULT_LAT)}
            className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-all focus:ring-2 focus:ring-primary disabled:opacity-60"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
            {t('services.formLongitude')}
          </label>
          <input
            type="number"
            step="any"
            value={longitude}
            disabled={disabled}
            onChange={(e) => onLongitudeChange(e.target.value)}
            placeholder={String(DEFAULT_LNG)}
            className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-all focus:ring-2 focus:ring-primary disabled:opacity-60"
          />
        </div>
      </div>

      <button
        type="button"
        disabled={disabled}
        onClick={useMyLocation}
        className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline disabled:opacity-60"
      >
        <Navigation className="h-4 w-4" />
        {t('services.formMapMyLocation')}
      </button>

      {mapError && <p className="text-sm text-destructive">{mapError}</p>}
    </div>
  )
}
