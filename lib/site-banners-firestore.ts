import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from 'firebase/firestore/lite'
import type { SiteBanner, SiteBannerInput } from '@/types/site-banner'
import { getDb } from '@/lib/firebase-db'
import { isFirebaseConfigured } from '@/lib/firebase'

export type FirestoreSiteBannerDoc = Omit<SiteBanner, 'id'> & {
  createdAt?: unknown
  updatedAt?: unknown
}

function docToBanner(id: string, data: FirestoreSiteBannerDoc): SiteBanner {
  return {
    id,
    name: data.name,
    title: data.title,
    subtitle: data.subtitle,
    placement: data.placement,
    size: data.size,
    mediaType: data.mediaType,
    imageUrl: data.imageUrl,
    videoUrl: data.videoUrl,
    slideUrls: data.slideUrls ?? [],
    linkUrl: data.linkUrl,
    linkLabel: data.linkLabel,
    altText: data.altText,
    backgroundColor: data.backgroundColor,
    startsAt: data.startsAt,
    expiresAt: data.expiresAt,
    active: data.active !== false,
    sortOrder: data.sortOrder ?? 0,
    openInNewTab: data.openInNewTab !== false,
  }
}

export async function fetchSiteBanners(): Promise<SiteBanner[]> {
  if (!isFirebaseConfigured()) return []

  try {
    const snap = await getDocs(collection(getDb(), 'siteBanners'))
    return snap.docs
      .map((d) => docToBanner(d.id, d.data() as FirestoreSiteBannerDoc))
      .sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name))
  } catch {
    return []
  }
}

export async function createSiteBanner(data: SiteBannerInput): Promise<string> {
  const docRef = await addDoc(collection(getDb(), 'siteBanners'), {
    ...data,
    slideUrls: data.slideUrls ?? [],
    active: data.active !== false,
    sortOrder: data.sortOrder ?? 0,
    openInNewTab: data.openInNewTab !== false,
    createdAt: new Date(),
    updatedAt: new Date(),
  })
  return docRef.id
}

export async function updateSiteBanner(id: string, data: Partial<SiteBannerInput>): Promise<void> {
  await updateDoc(doc(getDb(), 'siteBanners', id), {
    ...data,
    updatedAt: new Date(),
  })
}

export async function deleteSiteBanner(id: string): Promise<void> {
  await deleteDoc(doc(getDb(), 'siteBanners', id))
}
