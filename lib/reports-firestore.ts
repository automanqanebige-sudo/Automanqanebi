import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from 'firebase/firestore/lite'
import { getDb } from '@/lib/firebase-db'
import { isFirebaseConfigured } from '@/lib/firebase'
import type { ListingReport, ListingReportInput } from '@/types/report'

export async function createListingReport(input: ListingReportInput): Promise<string> {
  if (!isFirebaseConfigured()) throw new Error('Firebase not configured')
  const ref = await addDoc(collection(getDb(), 'reports'), {
    ...input,
    status: input.status ?? 'open',
    createdAt: new Date().toISOString(),
  })
  return ref.id
}

export async function fetchListingReports(): Promise<ListingReport[]> {
  if (!isFirebaseConfigured()) return []
  try {
    const snap = await getDocs(collection(getDb(), 'reports'))
    return snap.docs
      .map((d) => {
        const data = d.data()
        return {
          id: d.id,
          listingId: String(data.listingId ?? ''),
          listingType: (data.listingType as ListingReport['listingType']) || 'car',
          reason: (data.reason as ListingReport['reason']) || 'wrong_data',
          message: data.message,
          reporterId: data.reporterId,
          reporterEmail: data.reporterEmail,
          createdAt: String(data.createdAt ?? ''),
          status: (data.status as ListingReport['status']) || 'open',
        } satisfies ListingReport
      })
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  } catch {
    return []
  }
}

export async function updateReportStatus(
  id: string,
  status: ListingReport['status']
): Promise<void> {
  await updateDoc(doc(getDb(), 'reports', id), { status })
}

export async function deleteListingReport(id: string): Promise<void> {
  await deleteDoc(doc(getDb(), 'reports', id))
}
