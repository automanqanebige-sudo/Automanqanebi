export type FuelType = 'Gasoline' | 'Diesel' | 'Hybrid' | 'Electric' | 'LPG'
export type TransmissionType = 'Automatic' | 'Manual'
export type VehicleType = 'car' | 'moto' | 'atv'
export type ListingTier = 'platinum' | 'gold' | 'silver' | 'standard'

export interface Car {
  id?: string
  name?: string
  brand?: string
  model?: string
  price?: number
  image?: string
  images?: string[]
  year?: number
  description?: string
  mileage?: number // გარბენი კმ
  fuelType?: FuelType
  transmission?: TransmissionType
  location?: string
  createdAt?: Date | string
  vehicleType?: VehicleType
  tier?: ListingTier
  views?: number
  engineSize?: number // ძრავის მოცულობა
  color?: string
  driveType?: string // წამყვანი თვლები
  userId?: string
  phone?: string
  hasVIN?: boolean
  has360?: boolean
}

export interface Service {
  id: string
  name: string
  category: ServiceCategory
  location: string
  phone: string
  description?: string
  image?: string
}

export type ServiceCategory = 
  | 'tires' // საბურავები
  | 'locksmith' // კარის გაღება
  | 'electric' // ელექტრიკი
  | 'chemical' // ქიმწმენდა
  | 'towing' // ევაკუატორი
  | 'importer' // იმპორტიორი
  | 'mechanic' // მექანიკოსი
  | 'carwash' // ავტოდაბანვა
  | 'glass' // შუშა / ტონირება
  | 'insurance' // დაზღვევა
  | 'diagnostics' // დიაგნოსტიკა
  | 'detailing' // დეტეილინგი
  | 'tuning' // ტიუნინგი
  | 'other' // სხვა

export interface BlogPost {
  id: string
  title: string
  excerpt?: string
  content?: string
  category: 'market' | 'review' | 'electric' | 'news' | 'tips'
  image?: string
  views?: number
  createdAt: Date | string
}

export const serviceCategoryLabels: Record<ServiceCategory, string> = {
  tires: 'საბურავები',
  locksmith: 'კარის გაღება',
  electric: 'ელექტრიკი',
  chemical: 'ქიმწმენდა',
  towing: 'ევაკუატორი',
  importer: 'იმპორტიორი',
  mechanic: 'მექანიკოსი',
  carwash: 'ავტოდაბანვა',
  glass: 'შუშა / ტონირება',
  insurance: 'დაზღვევა',
  diagnostics: 'დიაგნოსტიკა',
  detailing: 'დეტეილინგი',
  tuning: 'ტიუნინგი',
  other: 'სხვა',
}

export const fuelTypeLabels: Record<FuelType, string> = {
  Gasoline: 'ბენზინი',
  Diesel: 'დიზელი',
  Hybrid: 'ჰიბრიდი',
  Electric: 'ელექტრო',
  LPG: 'გაზი',
}

export const tierColors: Record<ListingTier, string> = {
  platinum: 'bg-gradient-to-r from-indigo-500 to-purple-500',
  gold: 'bg-gradient-to-r from-amber-500 to-orange-500',
  silver: 'bg-gradient-to-r from-slate-400 to-slate-500',
  standard: 'bg-muted',
}

export const tierLabels: Record<ListingTier, string> = {
  platinum: 'PLATINUM',
  gold: 'GOLD', 
  silver: 'SILVER',
  standard: '',
}
