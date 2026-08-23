import type { Car } from '@/components/CarCard'
import { sampleCars } from '@/data/cars'
import { USE_SAMPLE_DATA } from '@/lib/site'
import { isVipListingType, toIsoFromUnknown } from '@/lib/listing-lifecycle'

export const DEFAULT_CAR_IMAGE =
  'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80'

export type FirestoreCarDoc = {
  brand: string
  model: string
  price: number
  year: number
  image?: string
  images?: string[]
  description?: string
  mileage?: number
  location?: string
  fuelType?: string
  transmission?: string
  phone?: string
  contactWhatsApp?: boolean
  contactViber?: boolean
  userId?: string | null
  userEmail?: string | null
  isTest?: boolean
  createdAt?: unknown
  updatedAt?: unknown
  expiresAt?: unknown
  bumpedAt?: unknown
  views?: number
  favoriteCount?: number
  vipExpiresAt?: unknown
  renewalNotifiedAt?: unknown
  inAppRenewalNotifiedAt?: unknown
  isVip?: boolean
  listingType?: string
  priceCurrency?: 'GEL' | 'USD'
  offerType?: 'sale' | 'rent'
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
  const isVip = data.isVip ?? isVipListingType(listingType)

  const imagesFromDoc = (data.images ?? []).map((url) => url.trim()).filter(Boolean)
  const primaryImage = imagesFromDoc[0] || data.image?.trim() || DEFAULT_CAR_IMAGE
  const images = imagesFromDoc.length > 0 ? imagesFromDoc : primaryImage ? [primaryImage] : undefined

  return {
    id,
    brand: data.brand,
    model: data.model,
    price: Number(data.price) || 0,
    year: Number(data.year) || new Date().getFullYear(),
    image: primaryImage,
    images,
    location: data.location?.trim() || 'საქართველო',
    mileage: Number(data.mileage) || 0,
    fuelType: capitalizeFuel(data.fuelType),
    transmission: data.transmission,
    description: data.description,
    phone: data.phone,
    contactWhatsApp: Boolean(data.contactWhatsApp),
    contactViber: Boolean(data.contactViber),
    userId: data.userId ?? undefined,
    userEmail: data.userEmail?.trim() || undefined,
    isTest: data.isTest === true,
    isVip,
    listingType: listingType || (isVip ? 'vip' : 'standard'),
    offerType: data.offerType === 'rent' ? 'rent' : 'sale',
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
    createdAt: toIsoFromUnknown(data.createdAt),
    updatedAt: toIsoFromUnknown(data.updatedAt),
    expiresAt: toIsoFromUnknown(data.expiresAt),
    bumpedAt: toIsoFromUnknown(data.bumpedAt),
    views: Number(data.views) || 0,
    favoriteCount: Number(data.favoriteCount) || 0,
    vipExpiresAt: toIsoFromUnknown(data.vipExpiresAt),
    renewalNotifiedAt: toIsoFromUnknown(data.renewalNotifiedAt),
    inAppRenewalNotifiedAt: toIsoFromUnknown(data.inAppRenewalNotifiedAt),
  }
}

export function mergeCarsWithSample(firestoreCars: Car[]): Car[] {
  if (!USE_SAMPLE_DATA) return firestoreCars

  const sampleIds = new Set(sampleCars.map((c) => c.id))
  const uniqueFirestore = firestoreCars.filter((c) => !sampleIds.has(c.id))
  const markedSample = sampleCars.map((c) => ({ ...c, isTest: true as const }))
  return [...markedSample, ...uniqueFirestore]
}

export function getSampleCarById(id: string): Car | undefined {
  const car = sampleCars.find((c) => c.id === id)
  return car ? { ...car, isTest: true } : undefined
}
