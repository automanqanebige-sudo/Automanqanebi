'use client'

import { useEffect, useState } from 'react'

type Car = {
  id?: string
  name?: string
  price?: number
}

export default function FavoritesPage() {
  const [cars, setCars] = useState<Car[]>([])

  useEffect(() => {
    fetch('/api/favorites')
      .then(res => res.json())
      .then(data => setCars(data || []))
  }, [])

  if (!cars || cars.length === 0) {
    return <div>არ გაქვს ფავორიტები</div>
  }

  return (
    <div>
      {cars?.map((car) => (
        <div key={car.id} style={{ marginBottom: 20 }}>
          <h2>{car?.name || "უცნობი მანქანა"}</h2>
          <p>${car?.price || "ფასი არ არის"}</p>
        </div>
      ))}
    </div>
  )
}