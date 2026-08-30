import type { Car } from '@/components/CarCard'
import { SITE_URL } from '@/lib/site'
import { getCarImages } from '@/lib/car-images'

export function buildCarListingJsonLd(car: Car) {
  const images = getCarImages(car)
  const name = `${car.year} ${car.brand} ${car.model}`

  return {
    '@context': 'https://schema.org',
    '@type': 'Car',
    name,
    brand: {
      '@type': 'Brand',
      name: car.brand,
    },
    model: car.model,
    vehicleModelDate: String(car.year),
    mileageFromOdometer: {
      '@type': 'QuantitativeValue',
      value: car.mileage,
      unitCode: 'KMT',
    },
    fuelType: car.fuelType,
    vehicleTransmission: car.transmission,
    color: car.color,
    image: images.length > 0 ? images : undefined,
    offers: {
      '@type': 'Offer',
      price: car.price,
      priceCurrency: 'GEL',
      availability: 'https://schema.org/InStock',
      url: `${SITE_URL}/car/${car.id}`,
    },
    url: `${SITE_URL}/car/${car.id}`,
  }
}
