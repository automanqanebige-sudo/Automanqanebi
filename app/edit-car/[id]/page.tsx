'use client'

import { useEffect, useState } from 'react'

export default function EditCar({ params }: { params: { id: string } }) {
  const [name, setName] = useState('')
  const [price, setPrice] = useState(0)
  const [image, setImage] = useState('')
  const [car, setCar] = useState<any>(null)

  useEffect(() => {
    fetch(`/api/cars/${params.id}`)
      .then(res => res.json())
      .then(data => setCar(data))
  }, [params.id])

  useEffect(() => {
    if (car) {
      setName(car.name || '')
      setPrice(car.price || 0)
      setImage(car.image || '')
    }
  }, [car])

  if (!car) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1>Edit Car</h1>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />

      <input
        value={price}
        onChange={(e) => setPrice(Number(e.target.value))}
        placeholder="Price"
        type="number"
      />

      <input
        value={image}
        onChange={(e) => setImage(e.target.value)}
        placeholder="Image URL"
      />
    </div>
  )
}