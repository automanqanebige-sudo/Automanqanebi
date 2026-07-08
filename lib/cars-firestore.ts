import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore/lite'
import type { Car } from '@/components/CarCard'
import { getDb } from '@/lib/firebase-db'
import { isFirebaseConfigured } from '@/lib/firebase'
import { docToCar, type FirestoreCarDoc } from '@/lib/cars-mapper'

export async function fetchFirestoreCars(): Promise<Car[]> {
  if (!isFirebaseConfigured()) return []

  const snap = await getDocs(collection(getDb(), 'cars'))
  const cars = snap.docs.map((d) => docToCar(d.id, d.data() as FirestoreCarDoc))

  return cars.sort((a, b) => {
    const yearDiff = b.year - a.year
    if (yearDiff !== 0) return yearDiff
    return b.price - a.price
  })
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
