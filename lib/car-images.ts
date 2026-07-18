import type { Car } from '@/components/CarCard'
import { DEFAULT_CAR_IMAGE } from '@/lib/cars-mapper'

export const MAX_CAR_IMAGES = 10

export function getCarImages(car: Pick<Car, 'image' | 'images'>): string[] {
  const fromArray = (car.images ?? []).map((url) => url.trim()).filter(Boolean)
  if (fromArray.length > 0) return fromArray
  const single = car.image?.trim()
  return single ? [single] : [DEFAULT_CAR_IMAGE]
}

export function primaryCarImage(car: Pick<Car, 'image' | 'images'>): string {
  return getCarImages(car)[0] ?? DEFAULT_CAR_IMAGE
}
