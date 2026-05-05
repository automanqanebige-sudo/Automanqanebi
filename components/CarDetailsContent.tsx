'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Heart,
  Share2,
  MapPin,
  Gauge,
  Fuel,
  Calendar,
  Cog,
  Crown,
  Phone,
  MessageCircle,
  Mail,
  Shield,
  Clock,
  ArrowLeft,
  CheckCircle2,
  Car,
  Palette,
  DoorOpen,
  Zap,
} from 'lucide-react'
import ImageGallery from './ImageGallery'

interface CarDetail {
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
}

interface CarDetailsContentProps {
  car: CarDetail
}

export default function CarDetailsContent({ car }: CarDetailsContentProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [showPhone, setShowPhone] = useState(false)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const formatMileage = (mileage: number) => {
    return new Intl.NumberFormat('en-US').format(mileage) + ' km'
  }

  const specs = [
    { icon: Calendar, label: 'Year', value: car.year.toString() },
    { icon: Gauge, label: 'Mileage', value: formatMileage(car.mileage) },
    { icon: Fuel, label: 'Fuel Type', value: car.fuelType },
    { icon: Cog, label: 'Transmission', value: car.transmission },
    { icon: Zap, label: 'Engine', value: car.engineSize },
    { icon: Car, label: 'Body Type', value: car.bodyType },
    { icon: Palette, label: 'Color', value: car.color },
    { icon: DoorOpen, label: 'Doors', value: car.doors.toString() },
    { icon: Gauge, label: 'Horsepower', value: `${car.horsepower} HP` },
    { icon: Cog, label: 'Drivetrain', value: car.drivetrain },
  ]

  return (
    <main className="min-h-screen bg-background">
      {/* Top Bar */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm font-medium">Back to listings</span>
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 text-sm font-medium ${
                isFavorite
                  ? 'bg-red-50 border-red-200 text-red-600'
                  : 'border-border bg-card text-muted-foreground hover:text-foreground hover:border-foreground/20'
              }`}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
              {isFavorite ? 'Saved' : 'Save'}
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-all duration-200 text-sm font-medium"
              aria-label="Share listing"
            >
              <Share2 className="h-4 w-4" />
              Share
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Gallery + Details */}
          <div className="flex-1 min-w-0">
            {/* Image Gallery */}
            <ImageGallery
              images={car.images}
              alt={`${car.year} ${car.brand} ${car.model}`}
            />

            {/* Title + Price (Mobile) */}
            <div className="mt-6 lg:hidden">
              <div className="flex items-start justify-between gap-4">
                <div>
                  {car.isVip && (
                    <span className="inline-flex items-center gap-1.5 bg-amber-500 text-white px-2.5 py-1 rounded-full text-xs font-semibold mb-3">
                      <Crown className="h-3.5 w-3.5" />
                      VIP
                    </span>
                  )}
                  <h1 className="text-2xl font-bold text-foreground">
                    {car.year} {car.brand} {car.model}
                  </h1>
                  <div className="flex items-center gap-1.5 mt-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{car.location}</span>
                  </div>
                </div>
              </div>
              <p className="text-3xl font-bold text-primary mt-4">{formatPrice(car.price)}</p>
            </div>

            {/* Specs Grid */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-foreground mb-4">Specifications</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {specs.map((spec) => (
                  <div
                    key={spec.label}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card border border-border text-center hover:border-primary/30 hover:shadow-sm transition-all duration-200"
                  >
                    <div className="p-2 rounded-lg bg-primary/10">
                      <spec.icon className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-xs text-muted-foreground">{spec.label}</span>
                    <span className="text-sm font-semibold text-foreground">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-foreground mb-4">Description</h2>
              <div className="bg-card border border-border rounded-xl p-6">
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {car.description}
                </p>
              </div>
            </div>

            {/* Features */}
            {car.features.length > 0 && (
              <div className="mt-8">
                <h2 className="text-lg font-semibold text-foreground mb-4">Features</h2>
                <div className="bg-card border border-border rounded-xl p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {car.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2.5">
                        <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                        <span className="text-sm text-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="w-full lg:w-[380px] flex-shrink-0">
            <div className="lg:sticky lg:top-24 flex flex-col gap-6">
              {/* Price Card (Desktop) */}
              <div className="hidden lg:block bg-card border border-border rounded-xl p-6 shadow-sm">
                {car.isVip && (
                  <span className="inline-flex items-center gap-1.5 bg-amber-500 text-white px-2.5 py-1 rounded-full text-xs font-semibold mb-3">
                    <Crown className="h-3.5 w-3.5" />
                    VIP Listing
                  </span>
                )}
                <h1 className="text-xl font-bold text-foreground">
                  {car.year} {car.brand} {car.model}
                </h1>
                <div className="flex items-center gap-1.5 mt-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{car.location}</span>
                </div>
                <p className="text-3xl font-bold text-primary mt-4">{formatPrice(car.price)}</p>

                {/* Quick Specs */}
                <div className="grid grid-cols-2 gap-3 mt-5 pt-5 border-t border-border">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Gauge className="h-4 w-4" />
                    <span className="text-sm">{formatMileage(car.mileage)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Fuel className="h-4 w-4" />
                    <span className="text-sm">{car.fuelType}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Cog className="h-4 w-4" />
                    <span className="text-sm">{car.transmission}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">{car.year}</span>
                  </div>
                </div>
              </div>

              {/* Seller Card */}
              <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
                  Seller Information
                </h3>
                <div className="flex items-center gap-4">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden bg-muted flex-shrink-0">
                    <Image
                      src={car.seller.avatar}
                      alt={car.seller.name}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground truncate">{car.seller.name}</span>
                      {car.seller.verified && (
                        <Shield className="h-4 w-4 text-primary flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {car.seller.totalListings} listings
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Member since {car.seller.memberSince}</span>
                </div>

                {/* Contact Buttons */}
                <div className="flex flex-col gap-3 mt-6">
                  <button
                    onClick={() => setShowPhone(!showPhone)}
                    className="flex items-center justify-center gap-2.5 w-full px-5 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors shadow-sm"
                  >
                    <Phone className="h-5 w-5" />
                    {showPhone ? car.seller.phone : 'Show Phone Number'}
                  </button>
                  <button className="flex items-center justify-center gap-2.5 w-full px-5 py-3 rounded-xl border-2 border-primary text-primary font-semibold hover:bg-primary/5 transition-colors">
                    <MessageCircle className="h-5 w-5" />
                    Send Message
                  </button>
                  <button className="flex items-center justify-center gap-2.5 w-full px-5 py-3 rounded-xl border border-border text-muted-foreground font-medium hover:text-foreground hover:border-foreground/20 transition-colors">
                    <Mail className="h-5 w-5" />
                    Email Seller
                  </button>
                </div>
              </div>

              {/* Safety Tips */}
              <div className="bg-primary/5 border border-primary/15 rounded-xl p-5">
                <h4 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
                  <Shield className="h-4 w-4 text-primary" />
                  Safety Tips
                </h4>
                <ul className="space-y-2">
                  {[
                    'Meet in a public, well-lit place',
                    'Inspect the car thoroughly before buying',
                    'Verify all documents and ownership',
                    'Never wire money to unknown sellers',
                  ].map((tip) => (
                    <li key={tip} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary mt-0.5 flex-shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Listed Date */}
              <p className="text-xs text-muted-foreground text-center">
                Listed on {car.listedDate}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
