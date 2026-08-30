'use client'

import { useEffect, useRef } from 'react'
import type { MappedService } from '@/lib/resolve-service-coordinates'
import { GEORGIA_BOUNDS, GEORGIA_CENTER } from '@/lib/service-map-eligibility'

type ServicesLeafletMapProps = {
  services: MappedService[]
  selectedId: string | null
  onSelect: (id: string) => void
  className?: string
}

function fixLeafletIcons(L: typeof import('leaflet')) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (L.Icon.Default.prototype as any)._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  })
}

export default function ServicesLeafletMap({
  services,
  selectedId,
  onSelect,
  className = '',
}: ServicesLeafletMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<import('leaflet').Map | null>(null)
  const markersRef = useRef<Map<string, import('leaflet').Marker>>(new Map())
  const onSelectRef = useRef(onSelect)

  useEffect(() => {
    onSelectRef.current = onSelect
  }, [onSelect])

  useEffect(() => {
    let cancelled = false

    void import('leaflet').then((leafletModule) => {
      if (cancelled || !containerRef.current || mapRef.current) return

      const L = leafletModule.default
      fixLeafletIcons(L)

      const map = L.map(containerRef.current, {
        scrollWheelZoom: true,
        maxBounds: L.latLngBounds(GEORGIA_BOUNDS),
        maxBoundsViscosity: 0.85,
      }).setView([GEORGIA_CENTER.lat, GEORGIA_CENTER.lng], 7)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap',
        maxZoom: 18,
      }).addTo(map)

      mapRef.current = map
      setTimeout(() => map.invalidateSize(), 100)
    })

    return () => {
      cancelled = true
      markersRef.current.forEach((marker) => marker.remove())
      markersRef.current.clear()
      mapRef.current?.remove()
      mapRef.current = null
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    void import('leaflet').then((leafletModule) => {
      const L = leafletModule.default
      const existing = markersRef.current
      const nextIds = new Set(services.map((s) => s.id))

      existing.forEach((marker, id) => {
        if (!nextIds.has(id)) {
          marker.remove()
          existing.delete(id)
        }
      })

      for (const service of services) {
        const latLng: [number, number] = [service.latitude, service.longitude]
        let marker = existing.get(service.id)

        if (!marker) {
          marker = L.marker(latLng).addTo(map)
          marker.on('click', () => onSelectRef.current(service.id))
          existing.set(service.id, marker)
        } else {
          marker.setLatLng(latLng)
        }

        marker.bindPopup(`<strong>${escapeHtml(service.name)}</strong><br/>${escapeHtml(service.location)}`)
      }

      if (services.length > 0) {
        const bounds = L.latLngBounds(services.map((s) => [s.latitude, s.longitude] as [number, number]))
        map.fitBounds(bounds.pad(0.12), { maxZoom: 12 })
      } else {
        map.setView([GEORGIA_CENTER.lat, GEORGIA_CENTER.lng], 7)
      }
    })
  }, [services])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    markersRef.current.forEach((marker, id) => {
      const el = marker.getElement()
      if (!el) return
      if (id === selectedId) {
        el.classList.add('z-[1000]', 'scale-110')
        el.style.filter = 'hue-rotate(90deg) saturate(1.4)'
        marker.openPopup()
      } else {
        el.classList.remove('z-[1000]', 'scale-110')
        el.style.filter = ''
      }
    })

    if (selectedId) {
      const selected = services.find((s) => s.id === selectedId)
      if (selected) {
        map.flyTo([selected.latitude, selected.longitude], Math.max(map.getZoom(), 13), {
          duration: 0.6,
        })
      }
    }
  }, [selectedId, services])

  return (
    <div
      ref={containerRef}
      className={`h-72 w-full rounded-xl border border-border sm:h-80 lg:h-[420px] ${className}`}
    />
  )
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
