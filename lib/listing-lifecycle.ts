import { parseFirestoreDate } from '@/lib/firestore-date'

export const LISTING_LIFETIME_DAYS = 30
export const VIP_RENEWAL_WINDOW_DAYS = 2 // notify when 1–2 days left (days 28–29 of 30)
/** Cheap list-boost price (GEL) — payment gateway still stubbed */
export const BUMP_PRICE_GEL = 1

export const VIP_LISTING_TYPES = [
  'vip',
  'vip_plus',
  'super_vip',
  'silver',
  'gold',
  'platinum',
] as const

export type VipListingType = (typeof VIP_LISTING_TYPES)[number]

export function isVipListingType(type?: string | null): boolean {
  return Boolean(type && (VIP_LISTING_TYPES as readonly string[]).includes(type))
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

export function computeExpiresAt(from: Date = new Date()): Date {
  return addDays(from, LISTING_LIFETIME_DAYS)
}

export function listingSortTime(car: {
  bumpedAt?: string | Date | null
  createdAt?: string | Date | null
}): number {
  const bumped = car.bumpedAt
    ? typeof car.bumpedAt === 'string'
      ? new Date(car.bumpedAt).getTime()
      : car.bumpedAt.getTime()
    : 0
  const created = car.createdAt
    ? typeof car.createdAt === 'string'
      ? new Date(car.createdAt).getTime()
      : car.createdAt.getTime()
    : 0
  return Math.max(bumped, created)
}

export function isListingExpired(car: {
  expiresAt?: string | Date | null
  createdAt?: string | Date | null
}): boolean {
  const now = Date.now()
  if (car.expiresAt) {
    const exp =
      typeof car.expiresAt === 'string' ? new Date(car.expiresAt).getTime() : car.expiresAt.getTime()
    if (!Number.isNaN(exp)) return exp < now
  }
  if (car.createdAt) {
    const created =
      typeof car.createdAt === 'string' ? new Date(car.createdAt).getTime() : car.createdAt.getTime()
    if (!Number.isNaN(created)) {
      return addDays(new Date(created), LISTING_LIFETIME_DAYS).getTime() < now
    }
  }
  return false
}

export function isVipRenewalDue(car: {
  vipExpiresAt?: string | Date | null
  expiresAt?: string | Date | null
}): boolean {
  const raw = car.vipExpiresAt ?? car.expiresAt
  if (!raw) return false
  const exp = typeof raw === 'string' ? new Date(raw).getTime() : raw.getTime()
  if (Number.isNaN(exp)) return false
  const now = Date.now()
  const windowMs = VIP_RENEWAL_WINDOW_DAYS * 24 * 60 * 60 * 1000
  return exp > now && exp - now <= windowMs
}

export function formatListingDate(value?: string | Date | null, locale = 'ka-GE'): string {
  if (!value) return ''
  const d = typeof value === 'string' ? new Date(value) : value
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' })
}

export function toIsoFromUnknown(value: unknown): string | undefined {
  const d = parseFirestoreDate(value)
  return d ? d.toISOString() : undefined
}

export function daysUntilExpiry(car: {
  expiresAt?: string | Date | null
  createdAt?: string | Date | null
}): number | null {
  let exp: Date | null = null
  if (car.expiresAt) {
    exp = typeof car.expiresAt === 'string' ? new Date(car.expiresAt) : car.expiresAt
  } else if (car.createdAt) {
    const created = typeof car.createdAt === 'string' ? new Date(car.createdAt) : car.createdAt
    exp = addDays(created, LISTING_LIFETIME_DAYS)
  }
  if (!exp || Number.isNaN(exp.getTime())) return null
  return Math.ceil((exp.getTime() - Date.now()) / (24 * 60 * 60 * 1000))
}
