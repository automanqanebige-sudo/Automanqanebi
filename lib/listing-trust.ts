import type { Car } from '@/components/CarCard'
import { isAdminEmail } from '@/lib/site'

/** Demo / admin / seeded listings — show “სატესტო” so buyers are not confused. */
export function isTestListing(car: Pick<Car, 'id' | 'isTest' | 'userEmail' | 'userId'>): boolean {
  if (car.isTest === true) return true
  if (car.id.startsWith('sample')) return true
  // Legacy sample dataset ids are short numeric strings ("1"…"n")
  if (/^\d{1,3}$/.test(car.id)) return true
  if (isAdminEmail(car.userEmail)) return true
  return false
}

/** Real seller listing — show “დამოწმებული”. */
export function isVerifiedListing(car: Pick<Car, 'id' | 'isTest' | 'userEmail' | 'userId'>): boolean {
  return Boolean(car.userId) && !isTestListing(car)
}
