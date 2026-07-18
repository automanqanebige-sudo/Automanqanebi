import type { CarFeature } from '@/types/filters'
import { CAR_FEATURES } from '@/types/filters'

export const LISTING_LOCATIONS = [
  'თბილისი',
  'ბათუმი',
  'ქუთაისი',
  'რუსთავი',
  'ზუგდიდი',
  'გორი',
  'საქართველო',
] as const

export type ListingPriceCurrency = 'GEL' | 'USD'

export type CarListingPayload = {
  brand: string
  model: string
  /** Always stored in GEL */
  price: number
  /** Currency the seller entered when posting */
  priceCurrency?: ListingPriceCurrency
  year: number
  mileage: number
  location: string
  fuelType: string
  transmission: string
  phone: string
  contactWhatsApp?: boolean
  contactViber?: boolean
  image: string
  images?: string[]
  description: string
  category?: string
  bodyType?: string
  driveType?: string
  steering?: string
  engineVolume?: number
  cylinders?: number
  doors?: number
  color?: string
  listingType?: string
  offerType?: 'sale' | 'rent'
  importRegion?: string
  customsStatus?: string
  features?: CarFeature[]
}

export type CarListingFormValues = {
  brand: string
  model: string
  price: string
  year: string
  mileage: string
  location: string
  fuelType: string
  transmission: string
  phone: string
  contactWhatsApp: boolean
  contactViber: boolean
  imageUrl: string
  imageUrls: string[]
  description: string
  category: string
  bodyType: string
  driveType: string
  steering: string
  engineVolume: string
  cylinders: string
  doors: string
  color: string
  listingType: string
  offerType: 'sale' | 'rent'
  importRegion: string
  customsStatus: string
  features: CarFeature[]
}

export function fuelToFormValue(fuel?: string): string {
  if (!fuel) return 'petrol'
  return fuel.toLowerCase()
}

export function transmissionToFormValue(transmission?: string): string {
  if (!transmission) return 'automatic'
  return transmission.toLowerCase()
}

export function carToFormValues(car: {
  brand: string
  model: string
  price: number
  year: number
  mileage: number
  location: string
  fuelType: string
  transmission?: string
  phone?: string
  contactWhatsApp?: boolean
  contactViber?: boolean
  image: string
  images?: string[]
  description?: string
  category?: string
  bodyType?: string
  driveType?: string
  steering?: string
  engineVolume?: number
  cylinders?: number
  doors?: number
  color?: string
  listingType?: string
  offerType?: 'sale' | 'rent'
  importRegion?: string
  customsStatus?: string
  features?: string[]
}): CarListingFormValues {
  return {
    brand: car.brand,
    model: car.model,
    price: String(car.price),
    year: String(car.year),
    mileage: String(car.mileage || ''),
    location: car.location,
    fuelType: fuelToFormValue(car.fuelType),
    transmission: transmissionToFormValue(car.transmission),
    phone: car.phone ?? '',
    contactWhatsApp: Boolean(car.contactWhatsApp),
    contactViber: Boolean(car.contactViber),
    imageUrl: car.image ?? '',
    imageUrls: car.images?.length ? car.images : car.image ? [car.image] : [],
    description: car.description ?? '',
    category: car.category ?? '',
    bodyType: car.bodyType ?? '',
    driveType: car.driveType ?? '',
    steering: car.steering ?? '',
    engineVolume: car.engineVolume ? String(car.engineVolume) : '',
    cylinders: car.cylinders ? String(car.cylinders) : '',
    doors: car.doors ? String(car.doors) : '',
    color: car.color ?? '',
    listingType: car.listingType ?? 'standard',
    offerType: car.offerType === 'rent' ? 'rent' : 'sale',
    importRegion: car.importRegion ?? '',
    customsStatus: car.customsStatus ?? '',
    features: (car.features ?? []).filter((f): f is CarFeature =>
      typeof f === 'string' && (CAR_FEATURES as readonly string[]).includes(f)
    ),
  }
}

function optionalString(value: string): string | undefined {
  const trimmed = value.trim()
  return trimmed || undefined
}

function optionalNumber(value: string): number | undefined {
  if (!value.trim()) return undefined
  const n = Number(value)
  return Number.isFinite(n) ? n : undefined
}

export function formValuesToPayload(
  values: CarListingFormValues,
  imageUrls: string[],
  options?: {
    /** Price already converted to GEL for storage */
    priceInGel?: number
    priceCurrency?: ListingPriceCurrency
  }
): CarListingPayload {
  const images = imageUrls.map((url) => url.trim()).filter(Boolean)
  const primary = images[0] ?? ''
  const price =
    options?.priceInGel != null && Number.isFinite(options.priceInGel)
      ? Math.round(options.priceInGel)
      : Math.round(Number(values.price) || 0)

  return {
    brand: values.brand,
    model: values.model,
    price,
    priceCurrency: options?.priceCurrency ?? 'GEL',
    year: Number(values.year),
    mileage: Number(values.mileage) || 0,
    location: values.location,
    fuelType: values.fuelType,
    transmission: values.transmission,
    phone: values.phone.trim(),
    contactWhatsApp: values.contactWhatsApp,
    contactViber: values.contactViber,
    image: primary,
    images: images.length > 0 ? images : undefined,
    description: values.description.trim(),
    category: optionalString(values.category),
    bodyType: optionalString(values.bodyType),
    driveType: optionalString(values.driveType),
    steering: optionalString(values.steering),
    engineVolume: optionalNumber(values.engineVolume),
    cylinders: optionalNumber(values.cylinders),
    doors: optionalNumber(values.doors),
    color: optionalString(values.color),
    listingType: optionalString(values.listingType) ?? 'standard',
    offerType: values.offerType === 'rent' ? 'rent' : 'sale',
    importRegion: optionalString(values.importRegion),
    customsStatus: optionalString(values.customsStatus),
    features: values.features.length > 0 ? values.features : undefined,
  }
}
