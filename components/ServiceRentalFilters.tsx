'use client'

import { useLanguage } from '@/context/LanguageContext'
import FilterChipGroup from '@/components/FilterChipGroup'
import { RENTAL_SUB_EMOJI, RENTAL_TRANSPORT_EMOJI } from '@/lib/filter-emojis'
import {
  RENTAL_SUB_SERVICES,
  RENTAL_SUB_TRANSPORT,
  RENTAL_TRANSPORT_TYPES,
  type RentalSubService,
  type RentalTransportType,
  type ServiceRentalFilterState,
} from '@/types/rental-transport'

type ServiceRentalFiltersProps = {
  filters: ServiceRentalFilterState
  onChange: (filters: ServiceRentalFilterState) => void
}

function subMatchesTransport(sub: RentalSubService, transport: RentalTransportType): boolean {
  if (sub === 'longTermLease' || sub === 'withDriverRental') return true
  return RENTAL_SUB_TRANSPORT[sub] === transport
}

export default function ServiceRentalFilters({ filters, onChange }: ServiceRentalFiltersProps) {
  const { t } = useLanguage()

  const patch = (partial: Partial<ServiceRentalFilterState>) =>
    onChange({ ...filters, ...partial })

  const visibleSubServices = filters.transport
    ? RENTAL_SUB_SERVICES.filter((sub) =>
        subMatchesTransport(sub, filters.transport as RentalTransportType)
      )
    : RENTAL_SUB_SERVICES

  return (
    <div className="mb-6 space-y-4 rounded-2xl border border-primary/20 bg-primary/5 p-4 sm:p-5">
      <div>
        <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <span aria-hidden>🔑</span>
          {t('services.rentalFiltersTitle')}
        </h3>
        <p className="mt-0.5 text-xs text-muted-foreground">{t('services.rentalFiltersHint')}</p>
      </div>

      <div>
        <p className="mb-2 text-xs font-medium text-muted-foreground">🚗 {t('services.rentalTransport')}</p>
        <FilterChipGroup
          rounded="lg"
          options={[
            { value: '', label: t('filter.all'), emoji: '🌐' },
            ...RENTAL_TRANSPORT_TYPES.map((type) => ({
              value: type,
              label: t(`services.rentalTransport.${type}`),
              emoji: RENTAL_TRANSPORT_EMOJI[type],
            })),
          ]}
          value={filters.transport}
          onChange={(transport) =>
            patch({
              transport: transport as RentalTransportType | '',
              subService:
                filters.subService &&
                transport &&
                !subMatchesTransport(filters.subService, transport as RentalTransportType)
                  ? ''
                  : filters.subService,
            })
          }
        />
      </div>

      <div>
        <p className="mb-2 text-xs font-medium text-muted-foreground">📋 {t('services.rentalSubService')}</p>
        <FilterChipGroup
          rounded="lg"
          options={[
            { value: '', label: t('filter.all'), emoji: '🌐' },
            ...visibleSubServices.map((sub) => ({
              value: sub,
              label: t(`services.sub.${sub}`),
              emoji: RENTAL_SUB_EMOJI[sub],
            })),
          ]}
          value={filters.subService}
          onChange={(subService) => patch({ subService: subService as RentalSubService | '' })}
        />
      </div>

      <div>
        <p className="mb-2 text-xs font-medium text-muted-foreground">🧑‍✈️ {t('services.rentalWithDriver')}</p>
        <FilterChipGroup
          rounded="lg"
          options={[
            { value: '', label: t('filter.all'), emoji: '🌐' },
            { value: 'yes', label: t('services.rentalWithDriverYes'), emoji: '✅' },
            { value: 'no', label: t('services.rentalWithDriverNo'), emoji: '🚫' },
          ]}
          value={filters.withDriver}
          onChange={(withDriver) => patch({ withDriver: (withDriver || '') as '' | 'yes' | 'no' })}
        />
      </div>
    </div>
  )
}
