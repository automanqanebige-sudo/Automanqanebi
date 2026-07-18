import type { Service, ServiceCategory } from '@/types/service'
import { SERVICE_SUB_SECTIONS } from '@/types/service'
import type { ServiceRentalFilterState } from '@/types/rental-transport'
import { RENTAL_SUB_TRANSPORT } from '@/types/rental-transport'

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

export function filterServices(
  services: Service[],
  query: string,
  category: ServiceCategory | 'all',
  getCategoryLabel: (cat: ServiceCategory) => string,
  rentalFilters?: ServiceRentalFilterState
) {
  const rentalActive =
    rentalFilters &&
    (rentalFilters.transport || rentalFilters.subService || rentalFilters.withDriver)

  return services.filter((service) => {
    if (category !== 'all' && service.category !== category) return false

    if (rentalActive) {
      if (category === 'all') {
        if (service.category !== 'rental') return false
      }
      if (!serviceMatchesRentalFilters(service, rentalFilters!)) return false
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
  diagnostics: 'diagnostics',
  bodywork: 'bodywork',
  painting: 'painting',
  detailing: 'detailing',
  carwash: 'detailing',
  chemical: 'detailing',
  electric: 'electric',
  ev: 'evHybrid',
  tires: 'tires',
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
  importer: 'sales',
  dealership: 'sales',
  auction: 'sales',
  appraisal: 'sales',
  rental: 'rental',
  insurance: 'insurance',
  inspection: 'legal',
  registration: 'legal',
  fleet: 'fleet',
  trucking: 'fleet',
  motorcycle: 'specialty',
  rv: 'specialty',
  lpg: 'fuel',
  storage: 'specialty',
  armored: 'specialty',
  other: 'specialty',
}
