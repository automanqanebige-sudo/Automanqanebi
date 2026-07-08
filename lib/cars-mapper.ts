import type { Car } from '@/components/CarCard'
import { sampleCars } from '@/data/cars'
import { USE_SAMPLE_DATA } from '@/lib/site'

export const DEFAULT_CAR_IMAGE =
  'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80'

export type FirestoreCarDoc = {
  brand: string
  model: string
  price: number
  year: number
  image?: string
  description?: string
  mileage?: number
  location?: string
  fuelType?: string
  transmission?: string
  phone?: string
  userId?: string | null
  userEmail?: string | null
  createdAt?: unknown
  isVip?: boolean
  listingType?: string
  category?: string
  bodyType?: string
  driveType?: string
  steering?: string
  engineVolume?: number
  cylinders?: number
  doors?: number
  color?: string
  importRegion?: string
  customsStatus?: string
  features?: string[]
}

function capitalizeFuel(fuel?: string): string {
  if (!fuel) return 'Petrol'
  const lower = fuel.toLowerCase()
  if (lower === 'petrol') return 'Petrol'
  if (lower === 'diesel') return 'Diesel'
  if (lower === 'hybrid') return 'Hybrid'
  if (lower === 'electric') return 'Electric'
  if (lower === 'lpg') return 'LPG'
  return fuel.charAt(0).toUpperCase() + fuel.slice(1)
}

export function docToCar(id: string, data: FirestoreCarDoc): Car {
  const listingType = data.listingType as Car['listingType'] | undefined
  const isVip =
    data.isVip ??
    Boolean(listingType && ['vip', 'vip_plus', 'super_vip'].includes(listingType))

  return {
    id,
    brand: data.brand,
    model: data.model,
    price: Number(data.price) || 0,
    year: Number(data.year) || new Date().getFullYear(),
    image: data.image?.trim() || DEFAULT_CAR_IMAGE,
    location: data.location?.trim() || 'საქართველო',
    mileage: Number(data.mileage) || 0,
    fuelType: capitalizeFuel(data.fuelType),
    transmission: data.transmission,
    description: data.description,
    phone: data.phone,
    userId: data.userId ?? undefined,
    isVip,
    listingType: listingType || (isVip ? 'vip' : 'standard'),
    category: data.category,
    bodyType: data.bodyType,
    driveType: data.driveType,
    steering: data.steering,
    engineVolume: data.engineVolume,
    cylinders: data.cylinders,
    doors: data.doors,
    color: data.color,
    importRegion: data.importRegion,
    customsStatus: data.customsStatus,
    features: data.features,
  }
}

export function mergeCarsWithSample(firestoreCars: Car[]): Car[] {
  if (!USE_SAMPLE_DATA) return firestoreCars

  const sampleIds = new Set(sampleCars.map((c) => c.id))
  const uniqueFirestore = firestoreCars.filter((c) => !sampleIds.has(c.id))
  return [...sampleCars, ...uniqueFirestore]
}

export function getSampleCarById(id: string): Car | undefined {
  return sampleCars.find((c) => c.id === id)
}
