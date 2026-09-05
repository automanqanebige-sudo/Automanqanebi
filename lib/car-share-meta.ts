import type { Car } from '@/components/CarCard'

/** Structured text for link previews & share sheets (photo is separate via OG image). */
export function carShareTitle(car: Pick<Car, 'year' | 'brand' | 'model' | 'price'>): string {
  const price = `${Math.round(car.price).toLocaleString('en-US')}₾`
  return `${car.year} ${car.brand} ${car.model} — ${price}`
}

export function carShareDescription(
  car: Pick<
    Car,
    | 'year'
    | 'brand'
    | 'model'
    | 'price'
    | 'mileage'
    | 'fuelType'
    | 'transmission'
    | 'location'
    | 'offerType'
  >
): string {
  const price = `${Math.round(car.price).toLocaleString('en-US')}₾`
  const km = `${Math.round(car.mileage).toLocaleString('en-US')} კმ`
  const offer = car.offerType === 'rent' ? 'ქირავდება' : 'იყიდება'
  return [offer, `${car.year} ${car.brand} ${car.model}`, price, km, car.fuelType, car.transmission, car.location]
    .filter(Boolean)
    .join(' · ')
}

export function carOgImagePath(carId: string): string {
  // v= bumps CDN / messenger caches when the OG card layout changes
  return `/api/og/car/${carId}?v=2`
}
