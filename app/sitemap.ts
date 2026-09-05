import type { MetadataRoute } from 'next'
import { SITE_URL, USE_SAMPLE_DATA } from '@/lib/site'
import { fetchFirestoreCars } from '@/lib/cars-firestore'
import { sampleCars } from '@/data/cars'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    '',
    '/services',
    '/workshops',
    '/tools',
    '/about',
    '/privacy',
    '/terms',
    '/cookies',
    '/login',
    '/register',
  ].map((path) => ({
    url: `${SITE_URL}${path || '/'}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: path === '' ? 1 : 0.7,
  }))

  let cars = await fetchFirestoreCars().catch(() => [])
  if (USE_SAMPLE_DATA && cars.length === 0) {
    cars = sampleCars
  }

  const carRoutes = cars.slice(0, 5000).map((car) => ({
    url: `${SITE_URL}/car/${car.id}`,
    lastModified: car.updatedAt ? new Date(car.updatedAt) : new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }))

  return [...staticRoutes, ...carRoutes]
}
