'use client'

import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import { ArrowLeft, Plus, X, Check, Minus } from 'lucide-react'
import Link from 'next/link'
import type { Car } from '@/types/car'
import { fuelTypeLabels } from '@/types/car'

export default function ComparePage() {
  const [cars, setCars] = useState<Car[]>([])
  const [allCars, setAllCars] = useState<Car[]>([])
  const [showPicker, setShowPicker] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/cars')
      .then(res => res.json())
      .then(data => {
        setAllCars(data || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const addCar = (car: Car, slot: number) => {
    const newCars = [...cars]
    newCars[slot] = car
    setCars(newCars)
    setShowPicker(null)
  }

  const removeCar = (slot: number) => {
    const newCars = [...cars]
    newCars.splice(slot, 1)
    setCars(newCars)
  }

  const compareSpecs = [
    { label: 'ფასი', getValue: (car: Car) => car.price ? `${car.price.toLocaleString()} ₾` : '-' },
    { label: 'წელი', getValue: (car: Car) => car.year?.toString() || '-' },
    { label: 'გარბენი', getValue: (car: Car) => car.mileage ? `${car.mileage.toLocaleString()} კმ` : '-' },
    { label: 'საწვავი', getValue: (car: Car) => car.fuelType ? fuelTypeLabels[car.fuelType] || car.fuelType : '-' },
    { label: 'ძრავი', getValue: (car: Car) => car.engineSize ? `${car.engineSize}L` : '-' },
    { label: 'გადაცემათა კოლოფი', getValue: (car: Car) => car.transmission === 'Automatic' ? 'ავტომატიკა' : car.transmission === 'Manual' ? 'მექანიკა' : '-' },
    { label: 'მდებარეობა', getValue: (car: Car) => car.location || '-' },
  ]

  const getBestValue = (spec: typeof compareSpecs[0], index: number) => {
    if (cars.length < 2) return false
    const values = cars.map(car => spec.getValue(car))
    
    // For price - lower is better
    if (spec.label === 'ფასი') {
      const prices = cars.map(car => car.price || Infinity)
      const minPrice = Math.min(...prices)
      return cars[index]?.price === minPrice && minPrice !== Infinity
    }
    
    // For year - newer is better
    if (spec.label === 'წელი') {
      const years = cars.map(car => car.year || 0)
      const maxYear = Math.max(...years)
      return cars[index]?.year === maxYear && maxYear !== 0
    }
    
    // For mileage - lower is better
    if (spec.label === 'გარბენი') {
      const mileages = cars.map(car => car.mileage || Infinity)
      const minMileage = Math.min(...mileages)
      return cars[index]?.mileage === minMileage && minMileage !== Infinity
    }
    
    return false
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        {/* Back link */}
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          მთავარზე დაბრუნება
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">მანქანების შედარება</h1>
          <p className="mt-2 text-muted-foreground">შეადარე 2-3 მანქანა და აირჩიე საუკეთესო</p>
        </div>

        {/* Car slots */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((slot) => {
            const car = cars[slot]
            
            if (car) {
              return (
                <div key={slot} className="relative rounded-2xl border border-border bg-card overflow-hidden">
                  <button
                    onClick={() => removeCar(slot)}
                    className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-destructive/90 text-white transition-colors hover:bg-destructive"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  
                  <div className="aspect-[16/10] overflow-hidden bg-secondary">
                    {car.image ? (
                      <img src={car.image} alt={car.name || ''} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <span className="text-4xl text-muted-foreground/30">🚗</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground">
                      {car.year} {car.brand} {car.model}
                    </h3>
                    <p className="mt-1 text-lg font-bold text-primary">
                      {car.price?.toLocaleString()} ₾
                    </p>
                  </div>
                </div>
              )
            }
            
            return (
              <button
                key={slot}
                onClick={() => setShowPicker(slot)}
                className="flex aspect-[4/3] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-card/50 text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
              >
                <Plus className="h-10 w-10" />
                <span className="mt-2 text-sm font-medium">მანქანის დამატება</span>
              </button>
            )
          })}
        </div>

        {/* Comparison table */}
        {cars.length >= 2 && (
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">პარამეტრი</th>
                  {cars.map((car, i) => (
                    <th key={i} className="px-4 py-3 text-left text-sm font-medium text-foreground">
                      {car.brand} {car.model}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {compareSpecs.map((spec, specIndex) => (
                  <tr key={spec.label} className={specIndex % 2 === 0 ? '' : 'bg-secondary/30'}>
                    <td className="px-4 py-3 text-sm font-medium text-muted-foreground">{spec.label}</td>
                    {cars.map((car, carIndex) => {
                      const isBest = getBestValue(spec, carIndex)
                      return (
                        <td key={carIndex} className="px-4 py-3 text-sm">
                          <span className={`flex items-center gap-2 ${isBest ? 'font-semibold text-emerald-500' : 'text-foreground'}`}>
                            {isBest && <Check className="h-4 w-4" />}
                            {spec.getValue(car)}
                          </span>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {cars.length < 2 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 py-16">
            <Minus className="h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-lg font-medium text-foreground">აირჩიე მინიმუმ 2 მანქანა</p>
            <p className="mt-1 text-sm text-muted-foreground">შედარების ცხრილის სანახავად</p>
          </div>
        )}

        {/* Car picker modal */}
        {showPicker !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <div className="max-h-[80vh] w-full max-w-2xl overflow-auto rounded-2xl border border-border bg-card p-6 shadow-xl">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">აირჩიე მანქანა</h3>
                <button
                  onClick={() => setShowPicker(null)}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              {loading ? (
                <p className="py-8 text-center text-muted-foreground">იტვირთება...</p>
              ) : allCars.length === 0 ? (
                <p className="py-8 text-center text-muted-foreground">მანქანები ვერ მოიძებნა</p>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {allCars.filter(c => !cars.find(selected => selected.id === c.id)).map((car) => (
                    <button
                      key={car.id}
                      onClick={() => addCar(car, showPicker)}
                      className="flex items-center gap-3 rounded-xl border border-border bg-background p-3 text-left transition-all hover:border-primary/50 hover:bg-secondary"
                    >
                      <div className="h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-secondary">
                        {car.image ? (
                          <img src={car.image} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-2xl text-muted-foreground/30">🚗</div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-foreground">
                          {car.year} {car.brand} {car.model}
                        </p>
                        <p className="text-sm font-bold text-primary">
                          {car.price?.toLocaleString()} ₾
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
