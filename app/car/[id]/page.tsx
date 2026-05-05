'use client'

import { useEffect, useState } from 'react'

type Car = {
  id?: string
  name?: string
  price?: number
  image?: string
}

export default function CarPage({ params }: { params: { id: string } }) {
  const [car, setCar] = useState<Car | null>(null)

  useEffect(() => {
    fetch(`/api/cars/${params.id}`)
      .then(res => res.json())
      .then(data => setCar(data))
  }, [params.id])

  if (!car) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1>{car?.name || "უცნობი მანქანა"}</h1>

      <h2>
        ${car?.price ? car.price.toLocaleString() : "ფასი არ არის"}
      </h2>

      {car?.image && (
        <img src={car.image} width={300} />
      )}
    </div>
  )
}