import { addDoc, collection, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore/lite'
import type { Car } from '@/components/CarCard'
import { getDb } from '@/lib/firebase-db'
import { isFirebaseConfigured } from '@/lib/firebase'
import { docToCar, type FirestoreCarDoc } from '@/lib/cars-mapper'
import { isListingExpired, isVipListingType, listingSortTime } from '@/lib/listing-lifecycle'
import type { CarListingPayload } from '@/lib/car-listing'
import { omitUndefined } from '@/lib/firestore-utils'

function sortCars(cars: Car[]): Car[] {
  return [...cars].sort((a, b) => {
    const aVip = a.isVip || isVipListingType(a.listingType) ? 1 : 0
    const bVip = b.isVip || isVipListingType(b.listingType) ? 1 : 0
    if (bVip !== aVip) return bVip - aVip
    return listingSortTime(b) - listingSortTime(a)
  })
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

export async function loadAllCars(): Promise<Car[]> {
  const { mergeCarsWithSample } = await import('@/lib/cars-mapper')
  const firestoreCars = await fetchFirestoreCars()
  return mergeCarsWithSample(firestoreCars)
}

export async function createCarListing(
  payload: CarListingPayload,
  extras: Record<string, unknown>
): Promise<string> {
  const cleaned = omitUndefined({
    ...(payload as Record<string, unknown>),
    ...extras,
  })
  const docRef = await addDoc(collection(getDb(), 'cars'), cleaned)
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
  await updateDoc(doc(getDb(), 'cars', carId), cleaned)
}
