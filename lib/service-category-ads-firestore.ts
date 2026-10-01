import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from 'firebase/firestore/lite'
import type { ServiceCategoryAd, ServiceCategoryAdInput } from '@/types/service-category-ad'
import type { ServiceCategory } from '@/types/service-category'
import { getDb } from '@/lib/firebase-db'
import { isFirebaseConfigured } from '@/lib/firebase'

let adsCache: ServiceCategoryAd[] | null = null
let adsPromise: Promise<ServiceCategoryAd[]> | null = null

export type FirestoreServiceCategoryAdDoc = {
  name: string
  category: ServiceCategory | 'all'
  location: string
  phone: string
  description?: string
  image?: string
  price?: number
  oldPrice?: number
  newPrice?: number
  promoUntil?: string
  linkUrl?: string
  active: boolean
  sortOrder: number
  createdAt?: unknown
  updatedAt?: unknown
}

function docToAd(id: string, data: FirestoreServiceCategoryAdDoc): ServiceCategoryAd {
  return {
    id,
    name: data.name,
    category: data.category,
    location: data.location,
    phone: data.phone,
    description: data.description,
    image: data.image,
    price: data.price,
    oldPrice: data.oldPrice,
    newPrice: data.newPrice,
    promoUntil: data.promoUntil,
    linkUrl: data.linkUrl,
    active: data.active !== false,
    sortOrder: data.sortOrder ?? 0,
  }
}

export async function fetchServiceCategoryAds(): Promise<ServiceCategoryAd[]> {
  if (adsCache) return adsCache
  if (adsPromise) return adsPromise

  adsPromise = (async () => {
    if (!isFirebaseConfigured()) {
      adsCache = []
      return adsCache
    }

    const snap = await getDocs(collection(getDb(), 'serviceCategoryAds'))
    const list = snap.docs
      .map((d) => docToAd(d.id, d.data() as FirestoreServiceCategoryAdDoc))
      .sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name))
    adsCache = list
    return list
  })()

  try {
    return await adsPromise
  } finally {
    adsPromise = null
  }
}

export function getCachedServiceCategoryAds(): ServiceCategoryAd[] | null {
  return adsCache
}

export function invalidateServiceCategoryAdsCache(): void {
  adsCache = null
  adsPromise = null
}

export async function createServiceCategoryAd(data: ServiceCategoryAdInput): Promise<string> {
  const docRef = await addDoc(collection(getDb(), 'serviceCategoryAds'), {
    ...data,
    active: data.active !== false,
    sortOrder: data.sortOrder ?? 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  })
  invalidateServiceCategoryAdsCache()
  return docRef.id
}

export async function updateServiceCategoryAd(
  id: string,
  data: Partial<ServiceCategoryAdInput>
): Promise<void> {
  await updateDoc(doc(getDb(), 'serviceCategoryAds', id), {
    ...data,
    updatedAt: new Date(),
  })
  invalidateServiceCategoryAdsCache()
}

export async function deleteServiceCategoryAd(id: string): Promise<void> {
  await deleteDoc(doc(getDb(), 'serviceCategoryAds', id))
  invalidateServiceCategoryAdsCache()
}

export function filterAdsForCategory(
  ads: ServiceCategoryAd[],
  selectedCategory: ServiceCategory | 'all'
): ServiceCategoryAd[] {
  return ads
    .filter(
      (ad) =>
        ad.active &&
        (ad.category === 'all' || selectedCategory === 'all' || ad.category === selectedCategory)
    )
    .sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name))
}
