import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  updateDoc,
  where,
} from 'firebase/firestore/lite'
import type { Car } from '@/components/CarCard'
import { getDb } from '@/lib/firebase-db'
import { isFirebaseConfigured } from '@/lib/firebase'
import { docToCar, type FirestoreCarDoc } from '@/lib/cars-mapper'
import { isListingExpired, isVipListingType, listingSortTime } from '@/lib/listing-lifecycle'
import type { CarListingPayload } from '@/lib/car-listing'
import { omitUndefined } from '@/lib/firestore-utils'
import { findSimilarCars } from '@/lib/similar-cars'
import { isAdminEmail } from '@/lib/site'

const CARS_CACHE_TTL_MS = 60_000

let carsListCache: { cars: Car[]; at: number } | null = null
let carsListPromise: Promise<Car[]> | null = null

function sortCars(cars: Car[]): Car[] {
  return [...cars].sort((a, b) => {
    const aVip = a.isVip || isVipListingType(a.listingType) ? 1 : 0
    const bVip = b.isVip || isVipListingType(b.listingType) ? 1 : 0
    if (bVip !== aVip) return bVip - aVip
    return listingSortTime(b) - listingSortTime(a)
  })
}

export function invalidateCarsCache(): void {
  carsListCache = null
  carsListPromise = null
}

export function getCachedCars(): Car[] | null {
  if (!carsListCache) return null
  if (Date.now() - carsListCache.at > CARS_CACHE_TTL_MS) return null
  return carsListCache.cars
}

export async function fetchFirestoreCars(): Promise<Car[]> {
  if (!isFirebaseConfigured()) return []

  const snap = await getDocs(collection(getDb(), 'cars'))
  const cars = snap.docs
    .map((d) => docToCar(d.id, d.data() as FirestoreCarDoc))
    .filter((c) => !isListingExpired(c))

  return sortCars(cars)
}

export async function fetchFirestoreCarById(id: string): Promise<Car | null> {
  if (!isFirebaseConfigured()) return null

  const snap = await getDoc(doc(getDb(), 'cars', id))
  if (!snap.exists()) return null
  return docToCar(snap.id, snap.data() as FirestoreCarDoc)
}

export async function fetchUserCars(userId: string): Promise<Car[]> {
  if (!isFirebaseConfigured()) return []

  const q = query(collection(getDb(), 'cars'), where('userId', '==', userId))
  const snap = await getDocs(q)
  return snap.docs.map((d) => docToCar(d.id, d.data() as FirestoreCarDoc))
}

/**
 * Prefer brand-scoped query (cheap) instead of downloading the whole catalog
 * for “similar cars” on the detail page.
 */
export async function fetchSimilarCarsFor(car: Car, max = 4): Promise<Car[]> {
  if (!isFirebaseConfigured()) return []

  try {
    const q = query(
      collection(getDb(), 'cars'),
      where('brand', '==', car.brand),
      limit(24)
    )
    const snap = await getDocs(q)
    const pool = snap.docs
      .map((d) => docToCar(d.id, d.data() as FirestoreCarDoc))
      .filter((c) => !isListingExpired(c))
    const similar = findSimilarCars(pool, car, max)
    if (similar.length > 0) return similar
  } catch {
    /* missing index or offline — fall through to short cache */
  }

  const cached = getCachedCars()
  if (cached) return findSimilarCars(cached, car, max)

  try {
    const all = await loadAllCars()
    return findSimilarCars(all, car, max)
  } catch {
    return []
  }
}

export async function loadAllCars(): Promise<Car[]> {
  const fresh = getCachedCars()
  if (fresh) return fresh
  if (carsListPromise) return carsListPromise

  carsListPromise = (async () => {
    const { mergeCarsWithSample } = await import('@/lib/cars-mapper')
    const firestoreCars = await fetchFirestoreCars()
    const merged = mergeCarsWithSample(firestoreCars)
    carsListCache = { cars: merged, at: Date.now() }
    return merged
  })()

  try {
    return await carsListPromise
  } finally {
    carsListPromise = null
  }
}

export async function createCarListing(
  payload: CarListingPayload,
  extras: Record<string, unknown>
): Promise<string> {
  // Client creates are always standard; VIP only via paid fulfill / admin.
  const email = typeof extras.userEmail === 'string' ? extras.userEmail : ''
  const cleaned = omitUndefined({
    ...(payload as Record<string, unknown>),
    ...extras,
    isVip: false,
    listingType: 'standard',
    // Admin / demo posts are labeled სატესტო so buyers are not confused.
    isTest: extras.isTest === true || isAdminEmail(email) ? true : undefined,
  })
  delete cleaned.vipExpiresAt
  if (cleaned.isTest !== true) delete cleaned.isTest
  const docRef = await addDoc(collection(getDb(), 'cars'), cleaned)
  invalidateCarsCache()
  return docRef.id
}

export async function updateCarListing(
  carId: string,
  payload: CarListingPayload,
  extras?: Record<string, unknown>
): Promise<void> {
  const cleaned = omitUndefined({
    ...(payload as Record<string, unknown>),
    updatedAt: new Date(),
    ...extras,
  })
  // Owners editing their listing must not self-grant VIP via the form.
  if (!extras || extras.allowVipUpdate !== true) {
    delete cleaned.isVip
    delete cleaned.listingType
    delete cleaned.vipExpiresAt
  }
  delete cleaned.allowVipUpdate
  await updateDoc(doc(getDb(), 'cars', carId), cleaned)
  invalidateCarsCache()
}
