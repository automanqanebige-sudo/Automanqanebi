import type { Car } from '@/components/CarCard'
import { carMatchesBrand } from '@/data/car-brands'

function similarityScore(candidate: Car, current: Car): number {
  let score = 0
  if (carMatchesBrand(candidate.brand, current.brand)) {
    score += 40
    if (candidate.model.toLowerCase() === current.model.toLowerCase()) score += 25
  }
  if (current.category && candidate.category === current.category) score += 15
  if (current.bodyType && candidate.bodyType === current.bodyType) score += 10
  if (current.fuelType && candidate.fuelType === current.fuelType) score += 5
  if (candidate.isVip) score += 3
  score += candidate.year / 1000
  return score
}

export function findSimilarCars(all: Car[], current: Car, limit = 4): Car[] {
  return all
    .filter((c) => c.id !== current.id)
    .map((car) => ({ car, score: similarityScore(car, current) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ car }) => car)
}
