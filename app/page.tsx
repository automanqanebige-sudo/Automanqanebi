'use client'

import { useState } from 'react'
import CarCard, { Car } from '@/components/CarCard'
import { Search, SlidersHorizontal } from 'lucide-react'

// Sample data for demonstration
const sampleCars: Car[] = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80',
    price: 45000,
    year: 2023,
    brand: 'BMW',
    model: 'M4 Competition',
    location: 'Tbilisi, Georgia',
    mileage: 12000,
    fuelType: 'Petrol',
    isVip: true,
    isFavorite: false,
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800&q=80',
    price: 38500,
    year: 2022,
    brand: 'Mercedes-Benz',
    model: 'C300 AMG',
    location: 'Batumi, Georgia',
    mileage: 25000,
    fuelType: 'Petrol',
    isVip: false,
    isFavorite: true,
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80',
    price: 52000,
    year: 2023,
    brand: 'Audi',
    model: 'RS5 Sportback',
    location: 'Tbilisi, Georgia',
    mileage: 8000,
    fuelType: 'Petrol',
    isVip: true,
    isFavorite: false,
  },
  {
    id: '4',
    image: 'https://images.unsplash.com/photo-1619682817481-e994891cd1f5?w=800&q=80',
    price: 28000,
    year: 2021,
    brand: 'Toyota',
    model: 'Camry Hybrid',
    location: 'Kutaisi, Georgia',
    mileage: 45000,
    fuelType: 'Hybrid',
    isVip: false,
    isFavorite: false,
  },
  {
    id: '5',
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&q=80',
    price: 67000,
    year: 2024,
    brand: 'Porsche',
    model: 'Cayenne',
    location: 'Tbilisi, Georgia',
    mileage: 3000,
    fuelType: 'Petrol',
    isVip: true,
    isFavorite: false,
  },
  {
    id: '6',
    image: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80',
    price: 22000,
    year: 2020,
    brand: 'Honda',
    model: 'Accord Sport',
    location: 'Rustavi, Georgia',
    mileage: 55000,
    fuelType: 'Petrol',
    isVip: false,
    isFavorite: false,
  },
]

export default function Home() {
  const [cars, setCars] = useState<Car[]>(sampleCars)
  const [searchQuery, setSearchQuery] = useState('')

  const handleFavoriteToggle = (id: string) => {
    setCars(prevCars =>
      prevCars.map(car =>
        car.id === id ? { ...car, isFavorite: !car.isFavorite } : car
      )
    )
  }

  const filteredCars = cars.filter(car => {
    const searchLower = searchQuery.toLowerCase()
    return (
      car.brand.toLowerCase().includes(searchLower) ||
      car.model.toLowerCase().includes(searchLower) ||
      car.location.toLowerCase().includes(searchLower)
    )
  })

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-background py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground text-balance">
            Find Your Perfect Car
          </h1>
          <p className="mt-3 text-lg text-muted-foreground max-w-2xl">
            Browse thousands of quality vehicles from trusted sellers across Georgia
          </p>

          {/* Search Bar */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by brand, model, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-input bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
              />
            </div>
            <button className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors">
              <SlidersHorizontal className="h-5 w-5" />
              <span>Filters</span>
            </button>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Results Header */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-muted-foreground">
              <span className="font-semibold text-foreground">{filteredCars.length}</span> cars found
            </p>
            <select className="px-4 py-2 rounded-lg border border-input bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="mileage">Lowest Mileage</option>
            </select>
          </div>

          {/* Car Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCars.map((car) => (
              <CarCard
                key={car.id}
                car={car}
                onFavoriteToggle={handleFavoriteToggle}
              />
            ))}
          </div>

          {/* Empty State */}
          {filteredCars.length === 0 && (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground">No cars found matching your search.</p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-4 text-primary hover:underline font-medium"
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
