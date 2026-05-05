'use client'

import { use } from 'react'
import CarDetailsContent from '@/components/CarDetailsContent'

// In a real app this would come from an API/database
const carListings: Record<string, {
  id: string
  images: string[]
  price: number
  year: number
  brand: string
  model: string
  location: string
  mileage: number
  fuelType: string
  transmission: string
  isVip: boolean
  description: string
  color: string
  bodyType: string
  engineSize: string
  horsepower: number
  drivetrain: string
  doors: number
  condition: string
  features: string[]
  seller: {
    name: string
    avatar: string
    phone: string
    email: string
    memberSince: string
    totalListings: number
    verified: boolean
  }
  listedDate: string
}> = {
  '1': {
    id: '1',
    images: [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&q=80',
      'https://images.unsplash.com/photo-1556189250-72ba954cfc2b?w=1200&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80',
      'https://images.unsplash.com/photo-1542362567-b07e54358753?w=1200&q=80',
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1200&q=80',
    ],
    price: 45000,
    year: 2023,
    brand: 'BMW',
    model: 'M4 Competition',
    location: 'Tbilisi, Georgia',
    mileage: 12000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    isVip: true,
    description: `Immaculate 2023 BMW M4 Competition with the full M Performance package. This car is in showroom condition, always garaged and meticulously maintained.

The twin-turbo 3.0L inline-6 delivers exhilarating performance with 503 horsepower sent to the rear wheels through an 8-speed M Steptronic transmission. Carbon fiber roof and mirror caps give it an aggressive, race-inspired look.

Interior features full Merino leather upholstery in Yas Marina Blue, M Carbon bucket seats, head-up display, and the latest iDrive 8 infotainment system with a 14.9" curved display.

All service records available. Two sets of keys included. Non-smoker, no accidents.`,
    color: 'Isle of Man Green',
    bodyType: 'Coupe',
    engineSize: '3.0L Twin-Turbo I6',
    horsepower: 503,
    drivetrain: 'RWD',
    doors: 2,
    condition: 'Excellent',
    features: [
      'M Performance Package',
      'Carbon Fiber Roof',
      'Adaptive M Suspension',
      'M Carbon Ceramic Brakes',
      'Head-Up Display',
      'Harman Kardon Surround Sound',
      'Wireless Apple CarPlay',
      'Heated & Ventilated Seats',
      'Parking Assistant Plus',
      '360-Degree Camera',
      'LED Laser Headlights',
      'M Sport Exhaust',
    ],
    seller: {
      name: 'Giorgi Kapanadze',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
      phone: '+995 555 123 456',
      email: 'giorgi@example.com',
      memberSince: 'March 2021',
      totalListings: 12,
      verified: true,
    },
    listedDate: 'April 28, 2026',
  },
  '2': {
    id: '2',
    images: [
      'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=1200&q=80',
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1200&q=80',
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1200&q=80',
    ],
    price: 38500,
    year: 2022,
    brand: 'Mercedes-Benz',
    model: 'C300 AMG Line',
    location: 'Batumi, Georgia',
    mileage: 25000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    isVip: false,
    description: `Stunning 2022 Mercedes-Benz C300 with the AMG Line package. This car combines luxury, comfort, and performance in a beautiful package.

Powered by a refined 2.0L turbo four-cylinder producing 255 horsepower, paired with a smooth 9G-TRONIC automatic transmission. The AMG Line adds sporty body styling, 19" AMG wheels, and sport suspension.

The interior features MB-Tex upholstery, ambient lighting with 64 colors, MBUX infotainment with dual 11.9" screens, and Burmester surround sound system.

Full dealer service history. Garage kept. Excellent condition inside and out.`,
    color: 'Obsidian Black',
    bodyType: 'Sedan',
    engineSize: '2.0L Turbo I4',
    horsepower: 255,
    drivetrain: 'RWD',
    doors: 4,
    condition: 'Excellent',
    features: [
      'AMG Line Package',
      'Burmester Sound System',
      'MBUX with Dual Screens',
      '64-Color Ambient Lighting',
      'Wireless Charging',
      'Digital Key',
      'Heated Front Seats',
      'Active Parking Assist',
      'Blind Spot Assist',
      'LED Multibeam Headlights',
    ],
    seller: {
      name: 'Nino Gelashvili',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
      phone: '+995 555 789 012',
      email: 'nino@example.com',
      memberSince: 'January 2022',
      totalListings: 5,
      verified: true,
    },
    listedDate: 'May 1, 2026',
  },
}

// Default car data used when a specific ID is not found in the listings
const defaultCar = {
  id: 'default',
  images: [
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&q=80',
    'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200&q=80',
    'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=1200&q=80',
  ],
  price: 32000,
  year: 2022,
  brand: 'Audi',
  model: 'A5 Sportback',
  location: 'Tbilisi, Georgia',
  mileage: 30000,
  fuelType: 'Diesel',
  transmission: 'Automatic',
  isVip: false,
  description: `Well-maintained 2022 Audi A5 Sportback with premium features and low mileage. This car offers a perfect balance of sportiness and everyday practicality.

The 2.0L TDI engine delivers smooth and efficient performance, paired with Audi's renowned quattro all-wheel drive system and a 7-speed S tronic transmission.

Features include the Audi Virtual Cockpit, MMI Navigation Plus with touch response, leather sport seats, and the comprehensive driver assistance package.

Service history is complete and up to date. Ready for its new owner.`,
  color: 'Glacier White',
  bodyType: 'Sportback',
  engineSize: '2.0L TDI',
  horsepower: 190,
  drivetrain: 'AWD (quattro)',
  doors: 4,
  condition: 'Very Good',
  features: [
    'Audi Virtual Cockpit',
    'MMI Navigation Plus',
    'Leather Sport Seats',
    'quattro AWD',
    'LED Matrix Headlights',
    'Rear View Camera',
    'Parking Sensors',
    'Cruise Control',
  ],
  seller: {
    name: 'Davit Meladze',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80',
    phone: '+995 555 456 789',
    email: 'davit@example.com',
    memberSince: 'June 2023',
    totalListings: 3,
    verified: false,
  },
  listedDate: 'April 15, 2026',
}

export default function CarPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const car = carListings[id] || { ...defaultCar, id }

  return <CarDetailsContent car={car} />
}
