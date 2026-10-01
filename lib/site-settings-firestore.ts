import { doc, getDoc, setDoc } from 'firebase/firestore/lite'
import { DEFAULT_HERO_VARIANT_ID } from '@/data/hero-backgrounds'
import { getDb } from '@/lib/firebase-db'
import { isFirebaseConfigured } from '@/lib/firebase'
import { SITE_CONTACT_EMAIL, SITE_CONTACT_PHONE } from '@/lib/site'
import type { SiteSettings } from '@/types/site-settings'
import { SITE_SETTINGS_DOC_ID } from '@/types/site-settings'

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  contactEmail: SITE_CONTACT_EMAIL,
  contactPhone: SITE_CONTACT_PHONE,
  facebookUrl: '',
  instagramUrl: '',
  youtubeUrl: '',
  heroVariantId: DEFAULT_HERO_VARIANT_ID,
  maintenanceMode: false,
  maintenanceMessageKa: 'საიტზე ტექნიკური სამუშაოები მიმდინარეობს. მალე დაბრუნდით.',
  maintenanceMessageEn: 'Site is temporarily under maintenance. Please check back soon.',
  maintenanceMessageRu: 'Сайт временно на обслуживании. Зайдите позже.',
}

const LEGACY_CONTACT_PHONE = '+995 555 123 456'

export async function fetchSiteSettings(): Promise<SiteSettings> {
  if (!isFirebaseConfigured()) return DEFAULT_SITE_SETTINGS

  try {
    const snap = await getDoc(doc(getDb(), 'siteSettings', SITE_SETTINGS_DOC_ID))
    if (!snap.exists()) return DEFAULT_SITE_SETTINGS
    const merged = { ...DEFAULT_SITE_SETTINGS, ...(snap.data() as Partial<SiteSettings>) }
    if (merged.contactPhone === LEGACY_CONTACT_PHONE) {
      merged.contactPhone = SITE_CONTACT_PHONE
    }
    return merged
  } catch {
    return DEFAULT_SITE_SETTINGS
  }
}

export async function saveSiteSettings(settings: SiteSettings): Promise<void> {
  await setDoc(
    doc(getDb(), 'siteSettings', SITE_SETTINGS_DOC_ID),
    { ...settings, updatedAt: new Date() },
    { merge: true }
  )
}
