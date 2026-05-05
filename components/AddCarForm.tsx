'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { 
  Upload, 
  X, 
  Car, 
  DollarSign, 
  Calendar, 
  Gauge, 
  Fuel, 
  FileText,
  ImagePlus,
  Check,
  AlertCircle,
  Loader2
} from 'lucide-react'

const brands = [
  'Audi', 'BMW', 'Mercedes-Benz', 'Toyota', 'Honda', 'Ford', 'Chevrolet', 
  'Volkswagen', 'Nissan', 'Hyundai', 'Kia', 'Mazda', 'Subaru', 'Lexus',
  'Porsche', 'Tesla', 'Jeep', 'Land Rover', 'Volvo', 'Jaguar', 'Other'
]

const fuelTypes = [
  { value: 'petrol', label: 'Petrol' },
  { value: 'diesel', label: 'Diesel' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'electric', label: 'Electric' },
  { value: 'lpg', label: 'LPG' },
]

const transmissionTypes = [
  { value: 'automatic', label: 'Automatic' },
  { value: 'manual', label: 'Manual' },
  { value: 'semi-automatic', label: 'Semi-Automatic' },
]

const currentYear = new Date().getFullYear()
const years = Array.from({ length: 40 }, (_, i) => currentYear - i)

type FormData = {
  title: string
  price: string
  brand: string
  model: string
  year: string
  mileage: string
  fuelType: string
  transmission: string
  description: string
  images: File[]
}

type FormErrors = Partial<Record<keyof FormData, string>>

export default function AddCarForm() {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    price: '',
    brand: '',
    model: '',
    year: '',
    mileage: '',
    fuelType: '',
    transmission: '',
    description: '',
    images: [],
  })
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    // Limit to 10 images total
    const remainingSlots = 10 - formData.images.length
    const filesToAdd = files.slice(0, remainingSlots)

    // Create preview URLs
    const newPreviews = filesToAdd.map(file => URL.createObjectURL(file))
    
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...filesToAdd]
    }))
    setImagePreviews(prev => [...prev, ...newPreviews])
    
    if (errors.images) {
      setErrors(prev => ({ ...prev, images: undefined }))
    }
  }

  const removeImage = (index: number) => {
    // Revoke the object URL to free memory
    URL.revokeObjectURL(imagePreviews[index])
    
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.title.trim()) newErrors.title = 'Title is required'
    if (!formData.price.trim()) newErrors.price = 'Price is required'
    else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = 'Please enter a valid price'
    }
    if (!formData.brand) newErrors.brand = 'Brand is required'
    if (!formData.model.trim()) newErrors.model = 'Model is required'
    if (!formData.year) newErrors.year = 'Year is required'
    if (!formData.mileage.trim()) newErrors.mileage = 'Mileage is required'
    else if (isNaN(Number(formData.mileage)) || Number(formData.mileage) < 0) {
      newErrors.mileage = 'Please enter a valid mileage'
    }
    if (!formData.fuelType) newErrors.fuelType = 'Fuel type is required'
    if (!formData.transmission) newErrors.transmission = 'Transmission is required'
    if (formData.images.length === 0) newErrors.images = 'At least one image is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsSubmitting(false)
    setSubmitSuccess(true)
    
    // Reset form after success
    setTimeout(() => {
      setFormData({
        title: '',
        price: '',
        brand: '',
        model: '',
        year: '',
        mileage: '',
        fuelType: '',
        transmission: '',
        description: '',
        images: [],
      })
      imagePreviews.forEach(url => URL.revokeObjectURL(url))
      setImagePreviews([])
      setSubmitSuccess(false)
    }, 3000)
  }

  if (submitSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mb-6">
          <Check className="h-10 w-10 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Listing Submitted!</h2>
        <p className="text-muted-foreground max-w-md">
          Your car listing has been submitted successfully. It will be reviewed and published shortly.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Image Upload Section */}
      <section className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <ImagePlus className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Photos</h2>
            <p className="text-sm text-muted-foreground">Add up to 10 photos of your car</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {/* Image Previews */}
          {imagePreviews.map((preview, index) => (
            <div 
              key={index}
              className="relative aspect-[4/3] rounded-lg overflow-hidden border border-border group"
            >
              <Image
                src={preview}
                alt={`Car image ${index + 1}`}
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/80"
                aria-label="Remove image"
              >
                <X className="h-4 w-4" />
              </button>
              {index === 0 && (
                <span className="absolute bottom-2 left-2 rounded bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
                  Main
                </span>
              )}
            </div>
          ))}

          {/* Upload Button */}
          {formData.images.length < 10 && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`aspect-[4/3] rounded-lg border-2 border-dashed transition-colors flex flex-col items-center justify-center gap-2 ${
                errors.images 
                  ? 'border-red-400 bg-red-50' 
                  : 'border-border hover:border-primary hover:bg-primary/5'
              }`}
            >
              <Upload className={`h-6 w-6 ${errors.images ? 'text-red-500' : 'text-muted-foreground'}`} />
              <span className={`text-sm font-medium ${errors.images ? 'text-red-500' : 'text-muted-foreground'}`}>
                Add Photo
              </span>
            </button>
          )}
        </div>

        {errors.images && (
          <p className="mt-3 flex items-center gap-1.5 text-sm text-red-500">
            <AlertCircle className="h-4 w-4" />
            {errors.images}
          </p>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          className="hidden"
        />
      </section>

      {/* Basic Information */}
      <section className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Car className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Basic Information</h2>
            <p className="text-sm text-muted-foreground">Tell us about your car</p>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {/* Title */}
          <div className="sm:col-span-2">
            <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">
              Listing Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., 2020 BMW X5 M Sport - Excellent Condition"
              className={`w-full rounded-lg border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
                errors.title ? 'border-red-400' : 'border-input'
              }`}
            />
            {errors.title && (
              <p className="mt-1.5 flex items-center gap-1 text-sm text-red-500">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.title}
              </p>
            )}
          </div>

          {/* Brand */}
          <div>
            <label htmlFor="brand" className="block text-sm font-medium text-foreground mb-2">
              Brand
            </label>
            <select
              id="brand"
              name="brand"
              value={formData.brand}
              onChange={handleInputChange}
              className={`w-full rounded-lg border bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
                errors.brand ? 'border-red-400' : 'border-input'
              } ${!formData.brand && 'text-muted-foreground'}`}
            >
              <option value="">Select brand</option>
              {brands.map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
            {errors.brand && (
              <p className="mt-1.5 flex items-center gap-1 text-sm text-red-500">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.brand}
              </p>
            )}
          </div>

          {/* Model */}
          <div>
            <label htmlFor="model" className="block text-sm font-medium text-foreground mb-2">
              Model
            </label>
            <input
              type="text"
              id="model"
              name="model"
              value={formData.model}
              onChange={handleInputChange}
              placeholder="e.g., X5, Camry, A4"
              className={`w-full rounded-lg border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
                errors.model ? 'border-red-400' : 'border-input'
              }`}
            />
            {errors.model && (
              <p className="mt-1.5 flex items-center gap-1 text-sm text-red-500">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.model}
              </p>
            )}
          </div>

          {/* Year */}
          <div>
            <label htmlFor="year" className="block text-sm font-medium text-foreground mb-2">
              Year
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <select
                id="year"
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                className={`w-full rounded-lg border bg-background pl-10 pr-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
                  errors.year ? 'border-red-400' : 'border-input'
                } ${!formData.year && 'text-muted-foreground'}`}
              >
                <option value="">Select year</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            {errors.year && (
              <p className="mt-1.5 flex items-center gap-1 text-sm text-red-500">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.year}
              </p>
            )}
          </div>

          {/* Price */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-foreground mb-2">
              Price (USD)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="25000"
                className={`w-full rounded-lg border bg-background pl-10 pr-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
                  errors.price ? 'border-red-400' : 'border-input'
                }`}
              />
            </div>
            {errors.price && (
              <p className="mt-1.5 flex items-center gap-1 text-sm text-red-500">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.price}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Technical Details */}
      <section className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Gauge className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Technical Details</h2>
            <p className="text-sm text-muted-foreground">Specifications and features</p>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Mileage */}
          <div>
            <label htmlFor="mileage" className="block text-sm font-medium text-foreground mb-2">
              Mileage (km)
            </label>
            <div className="relative">
              <Gauge className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                id="mileage"
                name="mileage"
                value={formData.mileage}
                onChange={handleInputChange}
                placeholder="50000"
                className={`w-full rounded-lg border bg-background pl-10 pr-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
                  errors.mileage ? 'border-red-400' : 'border-input'
                }`}
              />
            </div>
            {errors.mileage && (
              <p className="mt-1.5 flex items-center gap-1 text-sm text-red-500">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.mileage}
              </p>
            )}
          </div>

          {/* Fuel Type */}
          <div>
            <label htmlFor="fuelType" className="block text-sm font-medium text-foreground mb-2">
              Fuel Type
            </label>
            <div className="relative">
              <Fuel className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <select
                id="fuelType"
                name="fuelType"
                value={formData.fuelType}
                onChange={handleInputChange}
                className={`w-full rounded-lg border bg-background pl-10 pr-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
                  errors.fuelType ? 'border-red-400' : 'border-input'
                } ${!formData.fuelType && 'text-muted-foreground'}`}
              >
                <option value="">Select fuel type</option>
                {fuelTypes.map(fuel => (
                  <option key={fuel.value} value={fuel.value}>{fuel.label}</option>
                ))}
              </select>
            </div>
            {errors.fuelType && (
              <p className="mt-1.5 flex items-center gap-1 text-sm text-red-500">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.fuelType}
              </p>
            )}
          </div>

          {/* Transmission */}
          <div>
            <label htmlFor="transmission" className="block text-sm font-medium text-foreground mb-2">
              Transmission
            </label>
            <select
              id="transmission"
              name="transmission"
              value={formData.transmission}
              onChange={handleInputChange}
              className={`w-full rounded-lg border bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
                errors.transmission ? 'border-red-400' : 'border-input'
              } ${!formData.transmission && 'text-muted-foreground'}`}
            >
              <option value="">Select transmission</option>
              {transmissionTypes.map(trans => (
                <option key={trans.value} value={trans.value}>{trans.label}</option>
              ))}
            </select>
            {errors.transmission && (
              <p className="mt-1.5 flex items-center gap-1 text-sm text-red-500">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.transmission}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Description */}
      <section className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Description</h2>
            <p className="text-sm text-muted-foreground">Add details about your car</p>
          </div>
        </div>

        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          rows={5}
          placeholder="Describe your car's condition, features, history, and any additional information buyers should know..."
          className="w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
        />
        <p className="mt-2 text-sm text-muted-foreground">
          {formData.description.length}/2000 characters
        </p>
      </section>

      {/* Submit Button */}
      <div className="flex flex-col sm:flex-row gap-4 sm:justify-end">
        <button
          type="button"
          className="rounded-lg border border-border bg-card px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
        >
          Save as Draft
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center justify-center gap-2 rounded-lg bg-primary px-8 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Check className="h-4 w-4" />
              Submit Listing
            </>
          )}
        </button>
      </div>
    </form>
  )
}
