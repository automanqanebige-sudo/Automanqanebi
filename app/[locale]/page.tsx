'use client'

import { useState, useMemo } from 'react'
import CarCard, { Car } from '@/components/CarCard'
import SearchFilters, { FilterState } from '@/components/SearchFilters'
import VipListingsSection from '@/components/VipListingsSection'

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
    transmission: 'Automatic',
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
    transmission: 'Automatic',
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
    transmission: 'Automatic',
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
    transmission: 'Automatic',
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
    transmission: 'Automatic',
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
    transmission: 'Manual',
    isVip: false,
    isFavorite: false,
  },
  {
    id: '7',
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80',
    price: 85000,
    year: 2024,
    brand: 'Tesla',
    model: 'Model S Plaid',
    location: 'Tbilisi, Georgia',
    mileage: 1500,
    fuelType: 'Electric',
    transmission: 'Automatic',
    isVip: true,
    isFavorite: false,
  },
  {
    id: '8',
    image: 'https://images.unsplash.com/photo-1542362567-b07e54358753?w=800&q=80',
    price: 18500,
    year: 2019,
    brand: 'Volkswagen',
    model: 'Golf GTI',
    location: 'Batumi, Georgia',
    mileage: 62000,
    fuelType: 'Diesel',
    transmission: 'Manual',
    isVip: false,
    isFavorite: false,
  },
]

const initialFilters: FilterState = {
  search: '',
  priceMin: '',
  priceMax: '',
  yearMin: '',
  yearMax: '',
  fuelType: '',
  transmission: '',
}

export default function Home() {
  const [cars, setCars] = useState<Car[]>(sampleCars)
  const [filters, setFilters] = useState<FilterState>(initialFilters)
  const [sortBy, setSortBy] = useState('newest')

  const handleFavoriteToggle = (id: string) => {
    setCars(prevCars =>
      prevCars.map(car =>
        car.id === id ? { ...car, isFavorite: !car.isFavorite } : car
      )
    )
  }

  const handleSearch = () => {
    // In a real app, this would trigger an API call
    // For now, filtering is handled reactively via useMemo
  }

  const handleReset = () => {
    setFilters(initialFilters)
  }

  // Separate VIP cars for the dedicated section
  const vipCars = useMemo(() => {
    return cars.filter(car => car.isVip)
  }, [cars])

  // Non-VIP cars for the regular listings (or all if no filters applied)
  const regularCars = useMemo(() => {
    return cars.filter(car => !car.isVip)
  }, [cars])

  const filteredAndSortedCars = useMemo(() => {
    let result = cars.filter(car => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const matchesSearch = 
          car.brand.toLowerCase().includes(searchLower) ||
          car.model.toLowerCase().includes(searchLower)
        if (!matchesSearch) return false
      }

      // Price filter
      if (filters.priceMin && car.price < Number(filters.priceMin)) return false
      if (filters.priceMax && car.price > Number(filters.priceMax)) return false

      // Year filter
      if (filters.yearMin && car.year < Number(filters.yearMin)) return false
      if (filters.yearMax && car.year > Number(filters.yearMax)) return false

      // Fuel type filter
      if (filters.fuelType && car.fuelType.toLowerCase() !== filters.fuelType.toLowerCase()) return false

      // Transmission filter
      if (filters.transmission && car.transmission?.toLowerCase() !== filters.transmission.toLowerCase()) return false

      return true
    })

    // Sort results
    switch (sortBy) {
      case 'price-low':
        result = [...result].sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        result = [...result].sort((a, b) => b.price - a.price)
        break
      case 'mileage':
        result = [...result].sort((a, b) => a.mileage - b.mileage)
        break
      case 'year':
        result = [...result].sort((a, b) => b.year - a.year)
        break
      case 'newest':
      default:
        // VIP cars first, then by year
        result = [...result].sort((a, b) => {
          if (a.isVip !== b.isVip) return a.isVip ? -1 : 1
          return b.year - a.year
        })
        break
    }

    return result
  }, [cars, filters, sortBy])

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-background py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground text-balance">
            Find Your Perfect Car
          </h1>
          <p className="mt-3 text-lg text-muted-foreground max-w-2xl">
            Browse thousands of quality vehicles from trusted sellers across Georgia
          </p>

          {/* Search and Filters */}
          <div className="mt-8">
            <SearchFilters
              filters={filters}
              onFiltersChange={setFilters}
              onSearch={handleSearch}
              onReset={handleReset}
            />
          </div>
        </div>
      </section>

      {/* VIP Listings Section */}
      <VipListingsSection 
        cars={vipCars} 
        onFavoriteToggle={handleFavoriteToggle} 
      />

      {/* Results Section */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Results Header */}
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-bold text-foreground">All Listings</h2>
            <span className="px-3 py-1 text-sm font-medium bg-secondary text-secondary-foreground rounded-full">
              {filteredAndSortedCars.length} cars
            </span>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <p className="text-muted-foreground">
              <span className="font-semibold text-foreground">{filteredAndSortedCars.length}</span>{' '}
              {filteredAndSortedCars.length === 1 ? 'car' : 'cars'} found
            </p>
            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-sm text-muted-foreground">
                Sort by:
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 rounded-lg border border-input bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
              >
                <option value="newest">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="mileage">Lowest Mileage</option>
                <option value="year">Newest Year</option>
              </select>
            </div>
          </div>

          {/* Car Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedCars.map((car) => (
              <CarCard
                key={car.id}
                car={car}
                onFavoriteToggle={handleFavoriteToggle}
              />
            ))}
          </div>

          {/* Empty State */}
          {filteredAndSortedCars.length === 0 && (
            <div className="text-center py-16 px-4">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center">
                <svg className="w-8 h-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No cars found</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                We couldn&apos;t find any cars matching your criteria. Try adjusting your filters or search term.
              </p>
              <button
                onClick={handleReset}
                className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}