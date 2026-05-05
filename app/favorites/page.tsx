'use client'

import { useEffect, useState } from 'react'
import CarCard from '@/components/CarCard'
import Navbar from '@/components/Navbar'

export default function FavoritesPage() {
  const [cars, setCars] = useState([])

  useEffect(() => {
    fetch('/api/favorites')
      .then(res => res.json())
      .then(data => setCars(data || []))
  }, [])

  return (
    <div className="bg-[#0a0a0a] min-h-screen">

      <Navbar />

      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {cars?.map((car: any) => (
          <CarCard key={car.id} car={car} />
        ))}
      </div>

    </div>
  )
}