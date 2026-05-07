'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import Navbar from '@/components/Navbar'
import { ArrowLeft, Plus, X, Check, Minus } from 'lucide-react'
import Link from 'next/link'
import type { Car } from '@/types/car'
import { fuelTypeLabels } from '@/types/car'

export default function ComparePage() {
  const t = useTranslations()
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
    { key: 'price', label: t('car.price'), getValue: (car: Car) => car.price ? `${car.price.toLocaleString()} ₾` : '-' },
    { key: 'year', label: t('car.year'), getValue: (car: Car) => car.year?.toString() || '-' },
    { key: 'mileage', label: t('car.mileage'), getValue: (car: Car) => car.mileage ? `${car.mileage.toLocaleString()} ${t('common.km')}` : '-' },
    { key: 'fuel', label: t('car.fuel'), getValue: (car: Car) => car.fuelType ? fuelTypeLabels[car.fuelType] || car.fuelType : '-' },
    { key: 'engine', label: t('filters.engine'), getValue: (car: Car) => car.engineSize ? `${car.engineSize}L` : '-' },
    { key: 'transmission', label: t('car.transmission'), getValue: (car: Car) => car.transmission === 'Automatic' ? t('filters.automatic') : car.transmission === 'Manual' ? t('filters.manual') : '-' },
    { key: 'location', label: t('car.location'), getValue: (car: Car) => car.location || '-' },
  ]

  const getBestValue = (spec: typeof compareSpecs[0], index: number) => {
    if (cars.length < 2) return false
    
    // For price - lower is better
    if (spec.key === 'price') {
      const prices = cars.map(car => car.price || Infinity)
      const minPrice = Math.min(...prices)
      return cars[index]?.price === minPrice && minPrice !== Infinity
    }
    
    // For year - newer is better
    if (spec.key === 'year') {
      const years = cars.map(car => car.year || 0)
      const maxYear = Math.max(...years)
      return cars[index]?.year === maxYear && maxYear !== 0
    }
    
    // For mileage - lower is better
    if (spec.key === 'mileage') {
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
          {t('common.backToHome')}
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">{t('compare.title')}</h1>
          <p className="mt-2 text-muted-foreground">{t('compare.subtitle')}</p>
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
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={car.images?.[0] || '/placeholder-car.jpg'}
                      alt={`${car.brand} ${car.model}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground">{car.brand} {car.model}</h3>
                    <p className="text-sm text-muted-foreground">{car.year}</p>
                    <p className="mt-2 text-lg font-bold text-primary">
                      {car.price?.toLocaleString()} ₾
                    </p>
                  </div>
                </div>
              )
            }
            
            return (
              <div key={slot} className="relative">
                <button
                  onClick={() => setShowPicker(slot)}
                  className="flex aspect-[4/3] w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-card/50 transition-all hover:border-primary/50 hover:bg-card"
                >
                  <Plus className="h-10 w-10 text-muted-foreground" />
                  <span className="mt-2 text-sm font-medium text-muted-foreground">{t('compare.addToCompare')}</span>
                </button>
                
                {showPicker === slot && (
                  <div className="absolute left-0 top-0 z-20 max-h-[400px] w-full overflow-y-auto rounded-2xl border border-border bg-card p-4 shadow-xl">
                    <div className="mb-3 flex items-center justify-between">
                      <h4 className="font-semibold text-foreground">{t('compare.chooseCar')}</h4>
                      <button
                        onClick={() => setShowPicker(null)}
                        className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-secondary"
                      >
                        <X className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </div>
                    <div className="space-y-2">
                      {allCars.filter(c => !cars.some(selected => selected?.id === c.id)).slice(0, 10).map((car) => (
                        <button
                          key={car.id}
                          onClick={() => addCar(car, slot)}
                          className="flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-secondary"
                        >
                          <img
                            src={car.images?.[0] || '/placeholder-car.jpg'}
                            alt={`${car.brand} ${car.model}`}
                            className="h-12 w-16 rounded object-cover"
                          />
                          <div>
                            <p className="text-sm font-medium text-foreground">{car.brand} {car.model}</p>
                            <p className="text-xs text-muted-foreground">{car.year} • {car.price?.toLocaleString()} ₾</p>
                          </div>
                        </button>
                      ))}
                      {allCars.length === 0 && (
                        <p className="py-4 text-center text-sm text-muted-foreground">{t('compare.noCarsFound')}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Comparison table */}
        {cars.length >= 2 ? (
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="p-4 text-left text-sm font-semibold text-muted-foreground">{t('car.parameter')}</th>
                  {cars.map((car, i) => (
                    <th key={i} className="p-4 text-center text-sm font-semibold text-foreground">
                      {car.brand} {car.model}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {compareSpecs.map((spec, specIndex) => (
                  <tr key={specIndex} className="border-b border-border last:border-0">
                    <td className="p-4 text-sm font-medium text-muted-foreground">{spec.label}</td>
                    {cars.map((car, carIndex) => {
                      const isBest = getBestValue(spec, carIndex)
                      return (
                        <td
                          key={carIndex}
                          className={`p-4 text-center text-sm ${
                            isBest ? 'bg-green-500/10 font-semibold text-green-600' : 'text-foreground'
                          }`}
                        >
                          <div className="flex items-center justify-center gap-2">
                            {isBest && <Check className="h-4 w-4 text-green-500" />}
                            {spec.getValue(car)}
                          </div>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 py-16">
            <Minus className="h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold text-foreground">{t('compare.noCarsSelected')}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{t('compare.noCarsDescription')}</p>
          </div>
        )}
      </div>
    </div>
  )
}
