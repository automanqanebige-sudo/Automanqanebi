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

export type CarListingPayload = {
  brand: string
  model: string
  price: number
  year: number
  mileage: number
  location: string
  fuelType: string
  transmission: string
  phone: string
  image: string
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
  imageUrl: string
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
  image: string
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
    imageUrl: car.image ?? '',
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
  image: string
): CarListingPayload {
  return {
    brand: values.brand,
    model: values.model,
    price: Number(values.price),
    year: Number(values.year),
    mileage: Number(values.mileage) || 0,
    location: values.location,
    fuelType: values.fuelType,
    transmission: values.transmission,
    phone: values.phone.trim(),
    image,
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
    importRegion: optionalString(values.importRegion),
    customsStatus: optionalString(values.customsStatus),
    features: values.features.length > 0 ? values.features : undefined,
  }
}
