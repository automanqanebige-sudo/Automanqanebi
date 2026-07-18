import {
  initialFilters,
  PRICE_SLIDER_MAX,
  type CarFeature,
  type FilterState,
} from '@/types/filters'

export const SORT_OPTIONS = ['newest', 'price-low', 'price-high', 'mileage', 'year'] as const
export type SortOption = (typeof SORT_OPTIONS)[number]

export const LISTINGS_PAGE_SIZE = 12

function numParam(params: URLSearchParams, key: string, fallback: number): number {
  const raw = params.get(key)
  if (!raw) return fallback
  const n = Number(raw)
  return Number.isFinite(n) ? n : fallback
}

function strParam(params: URLSearchParams, key: string): string {
  return params.get(key)?.trim() ?? ''
}

export function parseCarFiltersFromParams(params: URLSearchParams): {
  filters: FilterState
  sort: SortOption
  page: number
} {
  const featuresRaw = strParam(params, 'features')
  const features = featuresRaw
    ? (featuresRaw.split(',').filter(Boolean) as CarFeature[])
    : []

  const sortRaw = strParam(params, 'sort')
  const sort = SORT_OPTIONS.includes(sortRaw as SortOption)
    ? (sortRaw as SortOption)
    : 'newest'

  const pageRaw = numParam(params, 'page', 1)
  const page = pageRaw >= 1 ? Math.floor(pageRaw) : 1

  return {
    filters: {
      ...initialFilters,
      search: strParam(params, 'q'),
      brand: strParam(params, 'brand'),
      model: strParam(params, 'model'),
      category: strParam(params, 'category'),
      fuelType: strParam(params, 'fuel'),
      priceMin: numParam(params, 'priceMin', 0),
      priceMax: numParam(params, 'priceMax', PRICE_SLIDER_MAX),
      yearMin: strParam(params, 'yearMin'),
      yearMax: strParam(params, 'yearMax'),
      bodyType: strParam(params, 'body'),
      transmission: strParam(params, 'transmission'),
      driveType: strParam(params, 'drive'),
      steering: strParam(params, 'steering'),
      engineVolume: strParam(params, 'engine'),
      engineVolumeMin: strParam(params, 'engineMin'),
      engineVolumeMax: strParam(params, 'engineMax'),
      cylinders: strParam(params, 'cylinders'),
      doors: strParam(params, 'doors'),
      color: strParam(params, 'color'),
      mileageMin: strParam(params, 'mileageMin'),
      mileageMax: strParam(params, 'mileageMax'),
      features,
      offerType: (strParam(params, 'offer') as FilterState['offerType']) || '',
      listingType: (strParam(params, 'listing') as FilterState['listingType']) || '',
      importRegion: (strParam(params, 'import') as FilterState['importRegion']) || '',
      customsStatus: (strParam(params, 'customs') as FilterState['customsStatus']) || '',
    },
    sort,
    page,
  }
}

export function carFiltersToParams(
  filters: FilterState,
  sort: SortOption,
  page = 1
): URLSearchParams {
  const params = new URLSearchParams()

  if (filters.search.trim()) params.set('q', filters.search.trim())
  if (filters.brand) params.set('brand', filters.brand)
  if (filters.model) params.set('model', filters.model)
  if (filters.category) params.set('category', filters.category)
  if (filters.fuelType) params.set('fuel', filters.fuelType)
  if (filters.priceMin > 0) params.set('priceMin', String(filters.priceMin))
  if (filters.priceMax < PRICE_SLIDER_MAX) params.set('priceMax', String(filters.priceMax))
  if (filters.yearMin) params.set('yearMin', filters.yearMin)
  if (filters.yearMax) params.set('yearMax', filters.yearMax)
  if (filters.bodyType) params.set('body', filters.bodyType)
  if (filters.transmission) params.set('transmission', filters.transmission)
  if (filters.driveType) params.set('drive', filters.driveType)
  if (filters.steering) params.set('steering', filters.steering)
  if (filters.engineVolume) params.set('engine', filters.engineVolume)
  if (filters.engineVolumeMin) params.set('engineMin', filters.engineVolumeMin)
  if (filters.engineVolumeMax) params.set('engineMax', filters.engineVolumeMax)
  if (filters.cylinders) params.set('cylinders', filters.cylinders)
  if (filters.doors) params.set('doors', filters.doors)
  if (filters.color) params.set('color', filters.color)
  if (filters.mileageMin) params.set('mileageMin', filters.mileageMin)
  if (filters.mileageMax) params.set('mileageMax', filters.mileageMax)
  if (filters.features.length) params.set('features', filters.features.join(','))
  if (filters.offerType) params.set('offer', filters.offerType)
  if (filters.listingType) params.set('listing', filters.listingType)
  if (filters.importRegion) params.set('import', filters.importRegion)
  if (filters.customsStatus) params.set('customs', filters.customsStatus)
  if (sort !== 'newest') params.set('sort', sort)
  if (page > 1) params.set('page', String(page))

  return params
}

export function filtersEqual(a: FilterState, b: FilterState): boolean {
  return JSON.stringify(a) === JSON.stringify(b)
}
