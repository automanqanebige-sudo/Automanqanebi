'use client'

import { Car, Truck, Bike } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import {
  VEHICLE_GROUPS,
  vehicleGroupLabelKey,
  type VehicleGroup,
} from '@/lib/vehicle-categories'

type VehicleGroupTabsProps = {
  value: VehicleGroup
  onChange: (group: VehicleGroup) => void
  className?: string
}

const GROUP_ICONS: Record<VehicleGroup, typeof Car> = {
  automobile: Car,
  special_tech: Truck,
  moto_tech: Bike,
}

export default function VehicleGroupTabs({ value, onChange, className = '' }: VehicleGroupTabsProps) {
  const { t } = useLanguage()

  return (
    <div
      className={`flex border-b border-border ${className}`}
      role="tablist"
      aria-label={t('filter.vehicleGroup.label')}
    >
      {VEHICLE_GROUPS.map((group) => {
        const active = value === group
        const Icon = GROUP_ICONS[group]
        return (
          <button
            key={group}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(group)}
            className={`relative flex flex-1 flex-col items-center gap-1.5 px-2 py-3 text-xs font-medium transition-colors sm:py-4 sm:text-sm ${
              active
                ? 'bg-primary/5 text-primary'
                : 'text-muted-foreground hover:bg-primary/5 hover:text-primary'
            }`}
          >
            <Icon className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={1.75} />
            <span className="text-center leading-tight">{t(vehicleGroupLabelKey(group))}</span>
            {active && (
              <span className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-primary sm:left-4 sm:right-4" />
            )}
          </button>
        )
      })}
    </div>
  )
}
