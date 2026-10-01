import { RENTAL_SUB_TRANSPORT, type RentalSubService } from '@/types/rental-transport'

export function catalogItemHref(
  sectionKey: string,
  itemId: string,
  nameLabel: string,
  defaultCategory: string
): string {
  if (sectionKey === 'rental') {
    const sub = itemId as RentalSubService
    const transport = RENTAL_SUB_TRANSPORT[sub]
    const params = new URLSearchParams({ category: 'rental', sub })
    if (transport) params.set('transport', transport)
    return `/services?${params.toString()}`
  }
  const params = new URLSearchParams({
    q: nameLabel,
    category: defaultCategory,
  })
  return `/services?${params.toString()}`
}
