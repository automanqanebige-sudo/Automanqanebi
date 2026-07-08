import type { Car } from '@/components/CarCard'
import type { FilterState } from '@/types/filters'
import { PRICE_SLIDER_MAX } from '@/types/filters'
import { carMatchesBrand, carMatchesModel } from '@/data/car-brands'

function norm(v?: string) {
  return (v ?? '').trim().toLowerCase()
}

function carListingType(car: Car): string {
  if (car.listingType) return car.listingType
  if (car.isVip) return 'vip'
  return 'standard'
}

export function applyCarFilters(cars: Car[], filters: FilterState): Car[] {
  return cars.filter((car) => {
    if (filters.search) {
      const q = filters.search.toLowerCase()
      const hay = `${car.brand} ${car.model} ${car.location}`.toLowerCase()
      if (!hay.includes(q)) return false
    }

    if (filters.brand && !carMatchesBrand(car.brand, filters.brand)) return false
    if (filters.model && !carMatchesModel(car.model, filters.model)) return false

    if (filters.category && norm(car.category) !== norm(filters.category)) return false
    if (filters.fuelType && norm(car.fuelType) !== norm(filters.fuelType)) return false

    if (filters.priceMin > 0 && car.price < filters.priceMin) return false
    if (filters.priceMax < PRICE_SLIDER_MAX && car.price > filters.priceMax) return false

    if (filters.yearMin && car.year < Number(filters.yearMin)) return false
    if (filters.yearMax && car.year > Number(filters.yearMax)) return false

    if (filters.bodyType && norm(car.bodyType) !== norm(filters.bodyType)) return false
    if (filters.transmission && norm(car.transmission) !== norm(filters.transmission))
      return false
    if (filters.driveType && norm(car.driveType) !== norm(filters.driveType)) return false
    if (filters.steering && norm(car.steering) !== norm(filters.steering)) return false
    if (filters.engineVolume && Number(car.engineVolume ?? 0) !== Number(filters.engineVolume))
      return false
    if (filters.cylinders && String(car.cylinders ?? '') !== filters.cylinders) return false
    if (filters.doors && String(car.doors ?? '') !== filters.doors) return false
    if (filters.color && norm(car.color) !== norm(filters.color)) return false

    if (filters.mileageMin && car.mileage < Number(filters.mileageMin)) return false
    if (filters.mileageMax && car.mileage > Number(filters.mileageMax)) return false

    if (filters.features.length > 0) {
      const carFeatures = car.features ?? []
      if (!filters.features.every((f) => carFeatures.includes(f))) return false
    }

    if (filters.listingType) {
      const lt = carListingType(car)
      if (lt !== filters.listingType) return false
    }

    if (filters.importRegion && norm(car.importRegion) !== norm(filters.importRegion))
      return false
    if (filters.customsStatus && norm(car.customsStatus) !== norm(filters.customsStatus))
      return false

    return true
  })
}

export function countActiveFilters(filters: FilterState): number {
  let n = 0
  if (filters.search) n++
  if (filters.brand) n++
  if (filters.model) n++
  if (filters.category) n++
  if (filters.fuelType) n++
  if (filters.priceMin > 0 || filters.priceMax < PRICE_SLIDER_MAX) n++
  if (filters.yearMin || filters.yearMax) n++
  if (filters.bodyType) n++
  if (filters.transmission) n++
  if (filters.driveType) n++
  if (filters.steering) n++
  if (filters.engineVolume) n++
  if (filters.cylinders) n++
  if (filters.doors) n++
  if (filters.color) n++
  if (filters.mileageMin || filters.mileageMax) n++
  if (filters.features.length) n++
  if (filters.listingType) n++
  if (filters.importRegion) n++
  if (filters.customsStatus) n++
  return n
}
