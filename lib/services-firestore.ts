import { collection, addDoc, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore/lite'
import type { Service, ServiceCategory } from '@/types/service'
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
  userId?: string | null
  userEmail?: string | null
  createdAt?: unknown
}

export function docToService(id: string, data: FirestoreServiceDoc): Service {
  return {
    id,
    name: data.name,
    category: data.category,
    location: data.location,
    phone: data.phone,
    description: data.description,
    userId: data.userId ?? undefined,
  }
}

export async function fetchFirestoreServices(): Promise<Service[]> {
  if (!isFirebaseConfigured()) return []

  const snap = await getDocs(collection(getDb(), 'services'))
  return snap.docs
    .map((d) => docToService(d.id, d.data() as FirestoreServiceDoc))
    .sort((a, b) => a.name.localeCompare(b.name))
}

export async function loadAllServices(): Promise<Service[]> {
  const remote = await fetchFirestoreServices()
  if (!USE_SAMPLE_DATA) return remote

  const sampleIds = new Set(sampleServices.map((s) => s.id))
  const uniqueRemote = remote.filter((s) => !sampleIds.has(s.id))
  return [...sampleServices, ...uniqueRemote]
}

export async function fetchUserServices(userId: string): Promise<Service[]> {
  if (!isFirebaseConfigured()) return []

  const q = query(collection(getDb(), 'services'), where('userId', '==', userId))
  const snap = await getDocs(q)
  return snap.docs.map((d) => docToService(d.id, d.data() as FirestoreServiceDoc))
}

export async function deleteService(serviceId: string): Promise<void> {
  await deleteDoc(doc(getDb(), 'services', serviceId))
}

export async function createService(
  data: Omit<FirestoreServiceDoc, 'createdAt'>,
  userId: string,
  userEmail?: string | null
): Promise<string> {
  const docRef = await addDoc(collection(getDb(), 'services'), {
    ...data,
    userId,
    userEmail: userEmail ?? null,
    createdAt: new Date(),
  })
  return docRef.id
}
