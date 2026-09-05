'use client'

import FilterChipGroup from '@/components/FilterChipGroup'
import { useLanguage } from '@/context/LanguageContext'
import {
  DISC_BOLT_PATTERNS,
  DISC_CONDITIONS,
  DISC_DIAMETERS,
  DISC_MATERIALS,
  type ServiceDiscFilterState,
} from '@/types/disc-filters'

type ServiceDiscFiltersProps = {
  filters: ServiceDiscFilterState
  onChange: (next: ServiceDiscFilterState) => void
}

export default function ServiceDiscFilters({ filters, onChange }: ServiceDiscFiltersProps) {
  const { t } = useLanguage()

  const patch = (partial: Partial<ServiceDiscFilterState>) => onChange({ ...filters, ...partial })

  return (
    <div className="mb-6 space-y-4 rounded-2xl border border-border bg-card p-4 sm:p-5">
      <div>
        <h3 className="text-sm font-semibold text-foreground">{t('services.discFiltersTitle')}</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">{t('services.discFiltersHint')}</p>
      </div>

      <div>
        <p className="mb-2 text-xs font-medium text-muted-foreground">
          {t('services.discDiameter')}
        </p>
        <FilterChipGroup
          rounded="lg"
          options={[
            { value: '', label: t('filter.all') },
            ...DISC_DIAMETERS.map((d) => ({ value: d, label: `R${d}` })),
          ]}
          value={filters.diameter}
          onChange={(diameter) =>
            patch({ diameter: diameter as ServiceDiscFilterState['diameter'] })
          }
        />
      </div>

      <div>
        <p className="mb-2 text-xs font-medium text-muted-foreground">
          {t('services.discBoltPattern')}
        </p>
        <FilterChipGroup
          rounded="lg"
          options={[
            { value: '', label: t('filter.all') },
            ...DISC_BOLT_PATTERNS.map((p) => ({ value: p, label: p })),
          ]}
          value={filters.boltPattern}
          onChange={(boltPattern) =>
            patch({ boltPattern: boltPattern as ServiceDiscFilterState['boltPattern'] })
          }
        />
      </div>

      <div>
        <p className="mb-2 text-xs font-medium text-muted-foreground">
          {t('services.discMaterial')}
        </p>
        <FilterChipGroup
          rounded="lg"
          options={[
            { value: '', label: t('filter.all') },
            ...DISC_MATERIALS.map((m) => ({
              value: m,
              label: t(`services.discMaterial.${m}`),
            })),
          ]}
          value={filters.material}
          onChange={(material) =>
            patch({ material: material as ServiceDiscFilterState['material'] })
          }
        />
      </div>

      <div>
        <p className="mb-2 text-xs font-medium text-muted-foreground">
          {t('services.discCondition')}
        </p>
        <FilterChipGroup
          rounded="lg"
          options={[
            { value: '', label: t('filter.all') },
            ...DISC_CONDITIONS.map((c) => ({
              value: c,
              label: t(`services.discCondition.${c}`),
            })),
          ]}
          value={filters.condition}
          onChange={(condition) =>
            patch({ condition: condition as ServiceDiscFilterState['condition'] })
          }
        />
      </div>
    </div>
  )
}
