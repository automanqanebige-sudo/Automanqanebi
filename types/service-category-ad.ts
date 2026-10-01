import type { ServiceCategory } from '@/types/service-category'

export type ServiceCategoryAdCategory = ServiceCategory | 'all'

export type ServiceCategoryAd = {
  id: string
  name: string
  category: ServiceCategoryAdCategory
  location: string
  phone: string
  description?: string
  image?: string
  price?: number
  oldPrice?: number
  newPrice?: number
  promoUntil?: string
  linkUrl?: string
  active: boolean
  sortOrder: number
}

export type ServiceCategoryAdInput = Omit<ServiceCategoryAd, 'id'>
