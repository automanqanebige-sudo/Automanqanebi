import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  query,
  where,
  deleteDoc,
  doc,
  updateDoc,
} from 'firebase/firestore/lite'
import type { Service, ServiceCategory, WorkSchedule } from '@/types/service'
import { normalizeServiceCategory } from '@/types/service'
import { getDb } from '@/lib/firebase-db'
import { isFirebaseConfigured } from '@/lib/firebase'
import { sampleServices } from '@/data/services'
import { USE_SAMPLE_DATA } from '@/lib/site'

export type FirestoreServiceDoc = {
  name: string
  category: ServiceCategory
  location: string
  phone: string
  description?: string
  bio?: string
  image?: string
  images?: string[]
  price?: number
  oldPrice?: number
  newPrice?: number
  promoUntil?: string
  latitude?: number
  longitude?: number
  workSchedule?: WorkSchedule
  open24Hours?: boolean
  userId?: string | null
  rentalTransportTypes?: string[]
  rentalSubServices?: string[]
  rentalPricePerDay?: number
  rentalPricePerMonth?: number
  rentalMinDays?: number
  withDriver?: boolean
  discDiameters?: string[]
  discBoltPatterns?: string[]
  discMaterials?: string[]
  discCondition?: string
  userEmail?: string | null
  createdAt?: unknown
  updatedAt?: unknown
}

export function docToService(id: string, data: FirestoreServiceDoc): Service {
  const imagesFromDoc = (data.images ?? []).map((url) => url.trim()).filter(Boolean)
  const primaryImage = imagesFromDoc[0] || data.image?.trim() || undefined
  const images =
    imagesFromDoc.length > 0 ? imagesFromDoc : primaryImage ? [primaryImage] : undefined

  return {
    id,
    name: data.name,
    category: normalizeServiceCategory(data.category as string),
    location: data.location,
    phone: data.phone,
    description: data.description ?? data.bio,
    bio: data.bio ?? data.description,
    image: primaryImage,
    images,
    price: data.price,
    oldPrice: data.oldPrice,
    newPrice: data.newPrice,
    promoUntil: data.promoUntil,
    latitude: data.latitude,
    longitude: data.longitude,
    workSchedule: data.workSchedule,
    open24Hours: data.open24Hours,
    userId: data.userId ?? undefined,
    rentalTransportTypes: data.rentalTransportTypes as Service['rentalTransportTypes'],
    rentalSubServices: data.rentalSubServices as Service['rentalSubServices'],
    rentalPricePerDay: data.rentalPricePerDay,
    rentalPricePerMonth: data.rentalPricePerMonth,
    rentalMinDays: data.rentalMinDays,
    withDriver: data.withDriver,
    discDiameters: data.discDiameters as Service['discDiameters'],
    discBoltPatterns: data.discBoltPatterns as Service['discBoltPatterns'],
    discMaterials: data.discMaterials as Service['discMaterials'],
    discCondition: data.discCondition as Service['discCondition'],
  }
}

export async function fetchFirestoreServices(): Promise<Service[]> {
  if (!isFirebaseConfigured()) return []

  const snap = await getDocs(collection(getDb(), 'services'))
  return snap.docs
    .map((d) => docToService(d.id, d.data() as FirestoreServiceDoc))
    .sort((a, b) => a.name.localeCompare(b.name))
}

/** In-memory cache so /services client navigations do not flash a full reload. */
let servicesListCache: Service[] | null = null
let servicesListPromise: Promise<Service[]> | null = null

export function getCachedServices(): Service[] | null {
  return servicesListCache
}

export function invalidateServicesCache(): void {
  servicesListCache = null
  servicesListPromise = null
}

export async function loadAllServices(): Promise<Service[]> {
  if (servicesListCache) return servicesListCache
  if (servicesListPromise) return servicesListPromise

  servicesListPromise = (async () => {
    const remote = await fetchFirestoreServices()
    let list: Service[]
    if (!USE_SAMPLE_DATA) {
      list = remote
    } else {
      const sampleIds = new Set(sampleServices.map((s) => s.id))
      const uniqueRemote = remote.filter((s) => !sampleIds.has(s.id))
      list = [...sampleServices, ...uniqueRemote]
    }
    servicesListCache = list
    return list
  })()

  try {
    return await servicesListPromise
  } finally {
    servicesListPromise = null
  }
}

export async function fetchServiceById(serviceId: string): Promise<Service | null> {
  const sample = sampleServices.find((s) => s.id === serviceId)
  if (sample) return sample

  if (!isFirebaseConfigured()) return null

  const snap = await getDoc(doc(getDb(), 'services', serviceId))
  if (!snap.exists()) return null
  return docToService(snap.id, snap.data() as FirestoreServiceDoc)
}

export async function fetchUserServices(userId: string): Promise<Service[]> {
  if (!isFirebaseConfigured()) return []

  const q = query(collection(getDb(), 'services'), where('userId', '==', userId))
  const snap = await getDocs(q)
  return snap.docs.map((d) => docToService(d.id, d.data() as FirestoreServiceDoc))
}

export async function deleteService(serviceId: string): Promise<void> {
  await deleteDoc(doc(getDb(), 'services', serviceId))
  invalidateServicesCache()
}

/** Firestore rejects `undefined` field values — strip them before write. */
function omitUndefined(obj: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) out[key] = value
  }
  return out
}

export async function createService(
  data: Omit<FirestoreServiceDoc, 'createdAt' | 'updatedAt'>,
  userId: string,
  userEmail?: string | null
): Promise<string> {
  const cleaned = omitUndefined({
    ...(data as Record<string, unknown>),
    userId,
    userEmail: userEmail ?? null,
    createdAt: new Date(),
  })
  const docRef = await addDoc(collection(getDb(), 'services'), cleaned)
  invalidateServicesCache()
  return docRef.id
}

export async function updateService(
  serviceId: string,
  data: Partial<Omit<FirestoreServiceDoc, 'createdAt' | 'userId' | 'userEmail'>>
): Promise<void> {
  const cleaned = omitUndefined({
    ...(data as Record<string, unknown>),
    updatedAt: new Date(),
  })
  await updateDoc(doc(getDb(), 'services', serviceId), cleaned)
  invalidateServicesCache()
}
