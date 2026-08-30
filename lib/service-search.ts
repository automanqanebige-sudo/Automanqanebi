import type { Service, ServiceCategory } from '@/types/service'
import { SERVICE_SUB_SECTIONS } from '@/types/service'
import type { ServiceRentalFilterState } from '@/types/rental-transport'
import { RENTAL_SUB_TRANSPORT } from '@/types/rental-transport'
import type { ServiceDiscFilterState } from '@/types/disc-filters'
import { countActiveDiscFilters } from '@/types/disc-filters'

function normalize(text: string) {
  return text.trim().toLowerCase()
}

export function serviceMatchesQuery(service: Service, query: string, categoryLabel?: string) {
  const q = normalize(query)
  if (!q) return true

  const haystack = [
    service.name,
    service.location,
    service.phone,
    service.description,
    service.bio,
    service.category,
    categoryLabel,
    ...(service.rentalTransportTypes ?? []),
    ...(service.rentalSubServices ?? []),
    ...(service.discDiameters ?? []).map((d) => `R${d}`),
    ...(service.discBoltPatterns ?? []),
    ...(service.discMaterials ?? []),
    service.discCondition,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

  return q.split(/\s+/).every((token) => haystack.includes(token))
}

export function serviceMatchesRentalFilters(
  service: Service,
  rentalFilters: ServiceRentalFilterState
): boolean {
  if (service.category !== 'rental') return false

  const { transport, subService, withDriver } = rentalFilters
  const hasRentalFilter = Boolean(transport || subService || withDriver)
  if (!hasRentalFilter) return true

  if (transport) {
    const types = service.rentalTransportTypes ?? []
    const subs = service.rentalSubServices ?? []
    const matchesTransport =
      types.includes(transport) ||
      subs.some((sub) => RENTAL_SUB_TRANSPORT[sub] === transport)
    if (!matchesTransport) return false
  }

  if (subService) {
    const subs = service.rentalSubServices ?? []
    if (!subs.includes(subService)) return false
  }

  if (withDriver === 'yes' && !service.withDriver) return false
  if (withDriver === 'no' && service.withDriver) return false

  return true
}

export function serviceMatchesDiscFilters(
  service: Service,
  discFilters: ServiceDiscFilterState
): boolean {
  if (service.category !== 'discs') return false
  if (countActiveDiscFilters(discFilters) === 0) return true

  if (discFilters.diameter) {
    const diameters = service.discDiameters ?? []
    if (diameters.length > 0 && !diameters.includes(discFilters.diameter)) return false
  }

  if (discFilters.boltPattern) {
    const patterns = service.discBoltPatterns ?? []
    if (patterns.length > 0 && !patterns.includes(discFilters.boltPattern)) return false
  }

  if (discFilters.material) {
    const materials = service.discMaterials ?? []
    if (materials.length > 0 && !materials.includes(discFilters.material)) return false
  }

  if (discFilters.condition) {
    if (service.discCondition && service.discCondition !== discFilters.condition) return false
  }

  return true
}

export function filterServices(
  services: Service[],
  query: string,
  category: ServiceCategory | 'all',
  getCategoryLabel: (cat: ServiceCategory) => string,
  rentalFilters?: ServiceRentalFilterState,
  discFilters?: ServiceDiscFilterState
) {
  const rentalActive =
    rentalFilters &&
    (rentalFilters.transport || rentalFilters.subService || rentalFilters.withDriver)
  const discActive = discFilters && countActiveDiscFilters(discFilters) > 0

  return services.filter((service) => {
    if (category !== 'all' && service.category !== category) return false

    if (rentalActive) {
      if (category === 'all') {
        if (service.category !== 'rental') return false
      }
      if (!serviceMatchesRentalFilters(service, rentalFilters!)) return false
    }

    if (discActive) {
      if (category === 'all') {
        if (service.category !== 'discs') return false
      }
      if (!serviceMatchesDiscFilters(service, discFilters!)) return false
    }

    return serviceMatchesQuery(service, query, getCategoryLabel(service.category))
  })
}

export type ServiceSubItemMatch = {
  sectionKey: string
  itemId: string
  nameKey: string
  descKey: string
  icon: string
  colorClass: string
  defaultCategory: string
}

export function filterServiceSubItems(
  query: string,
  translate: (key: string) => string,
  sectionKey?: string
): ServiceSubItemMatch[] {
  const q = normalize(query)
  const sections = sectionKey
    ? SERVICE_SUB_SECTIONS.filter((s) => s.key === sectionKey)
    : SERVICE_SUB_SECTIONS

  const results: ServiceSubItemMatch[] = []

  for (const section of sections) {
    for (const item of section.items) {
      if (!q) {
        results.push({
          sectionKey: section.key,
          itemId: item.itemId,
          nameKey: item.nameKey,
          descKey: item.descKey,
          icon: section.icon,
          colorClass: section.colorClass,
          defaultCategory: section.defaultCategory,
        })
        continue
      }

      const haystack = `${translate(item.nameKey)} ${translate(item.descKey)}`.toLowerCase()
      if (q.split(/\s+/).every((token) => haystack.includes(token))) {
        results.push({
          sectionKey: section.key,
          itemId: item.itemId,
          nameKey: item.nameKey,
          descKey: item.descKey,
          icon: section.icon,
          colorClass: section.colorClass,
          defaultCategory: section.defaultCategory,
        })
      }
    }
  }

  return results
}

/** Maps provider category to browse section for detail-page search */
export const CATEGORY_TO_SECTION: Partial<Record<ServiceCategory, string>> = {
  mechanic: 'mechanic',
  workshop: 'workshop',
  fullService: 'workshop',
  diagnostics: 'diagnostics',
  bodywork: 'bodywork',
  painting: 'painting',
  detailing: 'detailing',
  carwash: 'detailing',
  chemical: 'detailing',
  electric: 'electric',
  ev: 'evHybrid',
  tires: 'tires',
  discs: 'discs',
  alignment: 'steering',
  brakes: 'brakes',
  exhaust: 'tuning',
  cooling: 'cooling',
  fuel: 'fuel',
  steering: 'steering',
  parts: 'parts',
  glass: 'glass',
  tuning: 'tuning',
  wrap: 'wrap',
  upholstery: 'upholstery',
  accessories: 'accessories',
  audio: 'accessories',
  security: 'security',
  locksmith: 'locksmith',
  mobile: 'mobile',
  towing: 'towing',
  fuelDrain: 'mobile',
  importer: 'sales',
  dealership: 'sales',
  auction: 'sales',
  appraisal: 'sales',
  rental: 'rental',
  insurance: 'insurance',
  inspection: 'legal',
  registration: 'legal',
  fleet: 'specialty',
  trucking: 'specialty',
  motorcycle: 'specialty',
  rv: 'specialty',
  lpg: 'fuel',
  storage: 'specialty',
  armored: 'specialty',
  other: 'specialty',
}
