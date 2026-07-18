import type { Service, WorkSchedule } from '@/types/service'
import { WORK_DAY_KEYS } from '@/types/service'
import type { RentalSubService, RentalTransportType } from '@/types/rental-transport'

export type ServiceListingFormValues = {
  name: string
  category: Service['category']
  location: string
  phone: string
  bio: string
  /** Cover + gallery URLs (first = cover). */
  imageUrls: string[]
  price: string
  oldPrice: string
  newPrice: string
  promoUntil: string
  latitude: string
  longitude: string
  workSchedule: WorkSchedule
  open24Hours: boolean
  rentalTransportTypes: RentalTransportType[]
  rentalSubServices: RentalSubService[]
  rentalPricePerDay: string
  rentalPricePerMonth: string
  rentalMinDays: string
  withDriver: boolean
}

export const DEFAULT_WORK_SCHEDULE: WorkSchedule = {
  mon: { closed: false, open: '09:00', close: '18:00' },
  tue: { closed: false, open: '09:00', close: '18:00' },
  wed: { closed: false, open: '09:00', close: '18:00' },
  thu: { closed: false, open: '09:00', close: '18:00' },
  fri: { closed: false, open: '09:00', close: '18:00' },
  sat: { closed: false, open: '10:00', close: '16:00' },
  sun: { closed: true, open: '10:00', close: '16:00' },
}

export function scheduleFor24Hours(): WorkSchedule {
  return Object.fromEntries(
    WORK_DAY_KEYS.map((day) => [day, { closed: false, open: '00:00', close: '23:59' }])
  ) as WorkSchedule
}

export function isSchedule24Hours(schedule: WorkSchedule): boolean {
  return WORK_DAY_KEYS.every((day) => {
    const row = schedule[day]
    return !row.closed && row.open === '00:00' && (row.close === '23:59' || row.close === '24:00')
  })
}

export function emptyServiceFormValues(): ServiceListingFormValues {
  return {
    name: '',
    category: 'other',
    location: '',
    phone: '',
    bio: '',
    imageUrls: [],
    price: '',
    oldPrice: '',
    newPrice: '',
    promoUntil: '',
    latitude: '',
    longitude: '',
    workSchedule: structuredClone(DEFAULT_WORK_SCHEDULE),
    open24Hours: false,
    rentalTransportTypes: [],
    rentalSubServices: [],
    rentalPricePerDay: '',
    rentalPricePerMonth: '',
    rentalMinDays: '',
    withDriver: false,
  }
}

function parseOptionalNumber(value: string): number | undefined {
  const trimmed = value.trim()
  if (!trimmed) return undefined
  const num = Number(trimmed)
  return Number.isFinite(num) && num >= 0 ? num : undefined
}

function parseOptionalCoord(value: string): number | undefined {
  const trimmed = value.trim()
  if (!trimmed) return undefined
  const num = Number(trimmed)
  return Number.isFinite(num) ? num : undefined
}

export function serviceFormValuesToPayload(values: ServiceListingFormValues, imageUrls?: string[]) {
  const isRental = values.category === 'rental'
  const rentalPriceDay = parseOptionalNumber(values.rentalPricePerDay)
  const images = (imageUrls ?? values.imageUrls).map((url) => url.trim()).filter(Boolean)
  const primary = images[0]

  return {
    name: values.name.trim(),
    category: values.category,
    location: values.location.trim(),
    phone: values.phone.trim(),
    bio: values.bio.trim() || undefined,
    description: values.bio.trim() || undefined,
    image: primary || undefined,
    images: images.length > 0 ? images : undefined,
    price: isRental ? rentalPriceDay ?? parseOptionalNumber(values.price) : parseOptionalNumber(values.price),
    oldPrice: parseOptionalNumber(values.oldPrice),
    newPrice: parseOptionalNumber(values.newPrice),
    promoUntil: values.promoUntil.trim() || undefined,
    latitude: parseOptionalCoord(values.latitude),
    longitude: parseOptionalCoord(values.longitude),
    workSchedule: values.workSchedule,
    open24Hours: values.open24Hours,
    ...(isRental
      ? {
          rentalTransportTypes:
            values.rentalTransportTypes.length > 0 ? values.rentalTransportTypes : undefined,
          rentalSubServices:
            values.rentalSubServices.length > 0 ? values.rentalSubServices : undefined,
          rentalPricePerDay: rentalPriceDay,
          rentalPricePerMonth: parseOptionalNumber(values.rentalPricePerMonth),
          rentalMinDays: parseOptionalNumber(values.rentalMinDays),
          withDriver: values.withDriver || undefined,
        }
      : {}),
  }
}

export function serviceToFormValues(service: Service): ServiceListingFormValues {
  const imageUrls =
    service.images?.length
      ? service.images
      : service.image
        ? [service.image]
        : []

  return {
    name: service.name,
    category: service.category,
    location: service.location,
    phone: service.phone,
    bio: service.bio || service.description || '',
    imageUrls,
    price: service.price != null ? String(service.price) : '',
    oldPrice: service.oldPrice != null ? String(service.oldPrice) : '',
    newPrice: service.newPrice != null ? String(service.newPrice) : '',
    promoUntil: service.promoUntil || '',
    latitude: service.latitude != null ? String(service.latitude) : '',
    longitude: service.longitude != null ? String(service.longitude) : '',
    workSchedule: service.workSchedule
      ? structuredClone(service.workSchedule)
      : structuredClone(DEFAULT_WORK_SCHEDULE),
    open24Hours:
      service.open24Hours ??
      (service.workSchedule ? isSchedule24Hours(service.workSchedule) : false),
    rentalTransportTypes: service.rentalTransportTypes ?? [],
    rentalSubServices: service.rentalSubServices ?? [],
    rentalPricePerDay:
      service.rentalPricePerDay != null ? String(service.rentalPricePerDay) : '',
    rentalPricePerMonth:
      service.rentalPricePerMonth != null ? String(service.rentalPricePerMonth) : '',
    rentalMinDays: service.rentalMinDays != null ? String(service.rentalMinDays) : '',
    withDriver: service.withDriver ?? false,
  }
}
