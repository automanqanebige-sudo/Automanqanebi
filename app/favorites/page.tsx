'use client'

import { useEffect, useState } from 'react'
import CarCard, { type Car } from '@/components/CarCard'

export default function FavoritesPage() {
  const [cars, setCars] = useState<Car[]>([])

  useEffect(() => {
    fetch('/api/favorites')
      .then((res) => res.json())
      .then((data) => setCars(Array.isArray(data) ? data : []))
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-3">
        {cars.map((car) => (
          <CarCard key={car.id} car={car} />
        ))}
      </div>
    </div>
  )
}
