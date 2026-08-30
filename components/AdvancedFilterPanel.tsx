'use client'

import { RotateCcw } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { useCurrency } from '@/context/CurrencyContext'
import {
  CAR_COLORS,
  CAR_FEATURES,
  CUSTOMS_STATUSES,
  IMPORT_REGIONS,
  LISTING_TYPES,
  PRICE_SLIDER_MAX,
  type CarFeature,
  type FilterState,
} from '@/types/filters'
import FilterChipGroup from '@/components/FilterChipGroup'
import RangeFromTo from '@/components/RangeFromTo'
import {
  CUSTOMS_EMOJI,
  DRIVE_EMOJI,
  IMPORT_EMOJI,
  LISTING_EMOJI,
  STEERING_EMOJI,
  TRANSMISSION_EMOJI,
  withEmoji,
} from '@/lib/filter-emojis'

interface AdvancedFilterPanelProps {
  filters: FilterState
  onChange: (filters: FilterState) => void
  onApply: () => void
  onReset: () => void
  resultCount: number
  hideFooter?: boolean
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-3 text-sm font-semibold text-foreground">
      {children}
    </h3>
  )
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: { value: string; label: string }[]
  onChange: (v: string) => void
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="select-premium"
      >
        {options.map((o) => (
          <option key={o.value || '__any'} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default function AdvancedFilterPanel({
  filters,
  onChange,
  onApply,
  onReset,
  resultCount,
  hideFooter = false,
}: AdvancedFilterPanelProps) {
  const { t } = useLanguage()
  const { currency, fromBasePrice, toBasePrice } = useCurrency()
  const currentYear = new Date().getFullYear()

  const patch = (partial: Partial<FilterState>) => onChange({ ...filters, ...partial })

  const toggleFeature = (feature: CarFeature) => {
    const next = filters.features.includes(feature)
      ? filters.features.filter((f) => f !== feature)
      : [...filters.features, feature]
    patch({ features: next })
  }

  const transmissionOptions = [
    { value: '', label: t('search.allTransmission') },
    { value: 'automatic', label: withEmoji(TRANSMISSION_EMOJI.automatic, t('transmission.Automatic')) },
    { value: 'manual', label: withEmoji(TRANSMISSION_EMOJI.manual, t('transmission.Manual')) },
    {
      value: 'semi-automatic',
      label: withEmoji(TRANSMISSION_EMOJI['semi-automatic'], t('transmission.Semi-Automatic')),
    },
  ]

  const driveOptions = [
    { value: '', label: t('search.any') },
    { value: 'fwd', label: withEmoji(DRIVE_EMOJI.fwd, t('filter.drive.fwd')) },
    { value: 'rwd', label: withEmoji(DRIVE_EMOJI.rwd, t('filter.drive.rwd')) },
    { value: 'awd', label: withEmoji(DRIVE_EMOJI.awd, t('filter.drive.awd')) },
    { value: '4wd', label: withEmoji(DRIVE_EMOJI['4wd'], t('filter.drive.4wd')) },
  ]

  const steeringOptions = [
    { value: '', label: t('search.any') },
    { value: 'left', label: withEmoji(STEERING_EMOJI.left, t('filter.steering.left')) },
    { value: 'right', label: withEmoji(STEERING_EMOJI.right, t('filter.steering.right')) },
  ]

  const cylinderOptions = [
    { value: '', label: t('search.any') },
    ...['3', '4', '5', '6', '8', '10', '12'].map((v) => ({ value: v, label: v })),
  ]

  const doorOptions = [
    { value: '', label: t('search.any') },
    ...['2', '3', '4', '5'].map((v) => ({ value: v, label: v })),
  ]

  return (
    <div className="space-y-6">
      {/* Ranges */}
      <section>
        <SectionTitle>{t('filter.section.ranges')}</SectionTitle>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <RangeFromTo
            title={t('search.year')}
            fromLabel={t('search.from')}
            toLabel={t('search.to')}
            fromValue={filters.yearMin}
            toValue={filters.yearMax}
            onFromChange={(yearMin) => patch({ yearMin })}
            onToChange={(yearMax) => patch({ yearMax })}
            fromPlaceholder={String(currentYear - 20)}
            toPlaceholder={String(currentYear)}
            min={1980}
            max={currentYear + 1}
            step={1}
          />
          <RangeFromTo
            title={`${t('filter.section.price')} (${currency === 'GEL' ? '₾' : '$'})`}
            fromLabel={t('search.from')}
            toLabel={t('search.to')}
            fromValue={filters.priceMin ? String(fromBasePrice(filters.priceMin)) : ''}
            toValue={
              filters.priceMax === PRICE_SLIDER_MAX ? '' : String(fromBasePrice(filters.priceMax))
            }
            onFromChange={(v) => patch({ priceMin: toBasePrice(Number(v) || 0) })}
            onToChange={(v) =>
              patch({ priceMax: v ? toBasePrice(Number(v)) : PRICE_SLIDER_MAX })
            }
            fromPlaceholder="0"
            toPlaceholder={String(fromBasePrice(PRICE_SLIDER_MAX))}
            min={0}
            max={fromBasePrice(PRICE_SLIDER_MAX)}
            step={100}
          />
          <RangeFromTo
            title={t('search.mileage')}
            fromLabel={t('search.from')}
            toLabel={t('search.to')}
            fromValue={filters.mileageMin}
            toValue={filters.mileageMax}
            onFromChange={(mileageMin) => patch({ mileageMin })}
            onToChange={(mileageMax) => patch({ mileageMax })}
            fromPlaceholder="0"
            toPlaceholder="300000"
            min={0}
            max={500000}
            step={1000}
            suffix="km"
          />
        </div>
      </section>

      {/* Technical */}
      <section>
        <SectionTitle>{t('filter.section.technical')}</SectionTitle>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          <FilterSelect
            label={t('search.transmission')}
            value={filters.transmission}
            options={transmissionOptions}
            onChange={(transmission) => patch({ transmission })}
          />
          <FilterSelect
            label={t('filter.drive')}
            value={filters.driveType}
            options={driveOptions}
            onChange={(driveType) => patch({ driveType })}
          />
          <FilterSelect
            label={t('filter.steering')}
            value={filters.steering}
            options={steeringOptions}
            onChange={(steering) => patch({ steering })}
          />
          <FilterSelect
            label={t('filter.cylinders')}
            value={filters.cylinders}
            options={cylinderOptions}
            onChange={(cylinders) => patch({ cylinders })}
          />
          <FilterSelect
            label={t('filter.doors')}
            value={filters.doors}
            options={doorOptions}
            onChange={(doors) => patch({ doors })}
          />
        </div>
        <div className="mt-3 max-w-md">
          <RangeFromTo
            title={t('filter.engineVolume')}
            fromLabel={t('search.from')}
            toLabel={t('search.to')}
            fromValue={filters.engineVolumeMin}
            toValue={filters.engineVolumeMax}
            onFromChange={(engineVolumeMin) => patch({ engineVolumeMin, engineVolume: '' })}
            onToChange={(engineVolumeMax) => patch({ engineVolumeMax, engineVolume: '' })}
            fromPlaceholder="1.0"
            toPlaceholder="5.0"
            min={0.5}
            max={8}
            step={0.1}
            suffix="L"
          />
        </div>
      </section>

      {/* Features */}
      <section>
        <SectionTitle>{t('filter.section.features')}</SectionTitle>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {CAR_FEATURES.map((feature) => {
            const checked = filters.features.includes(feature)
            return (
              <label
                key={feature}
                className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
                  checked
                    ? 'border-primary bg-primary/10 text-foreground'
                    : 'border-input bg-background text-muted-foreground hover:border-primary/40'
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleFeature(feature)}
                  className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                />
                <span className="leading-tight">{t(`filter.feature.${feature}`)}</span>
              </label>
            )
          })}
        </div>
      </section>

      {/* Listing type */}
      <section>
        <SectionTitle>{t('filter.section.listingType')}</SectionTitle>
        <FilterChipGroup
          options={LISTING_TYPES.map((type) => ({
            value: type,
            label: type ? t(`filter.listing.${type}`) : t('filter.all'),
            emoji: LISTING_EMOJI[type || ''],
          }))}
          value={filters.listingType}
          onChange={(listingType) => patch({ listingType: listingType as FilterState['listingType'] })}
        />
      </section>

      {/* Import */}
      <section>
        <SectionTitle>{t('filter.section.import')}</SectionTitle>
        <FilterChipGroup
          options={IMPORT_REGIONS.map((region) => ({
            value: region,
            label: region ? t(`filter.import.${region}`) : t('filter.all'),
            emoji: IMPORT_EMOJI[region || ''],
          }))}
          value={filters.importRegion}
          onChange={(importRegion) => patch({ importRegion: importRegion as FilterState['importRegion'] })}
        />
      </section>

      {/* Customs */}
      <section>
        <SectionTitle>{t('filter.section.status')}</SectionTitle>
        <FilterChipGroup
          options={CUSTOMS_STATUSES.map((status) => ({
            value: status,
            label: status ? t(`filter.customs.${status}`) : t('filter.all'),
            emoji: CUSTOMS_EMOJI[status || ''],
          }))}
          value={filters.customsStatus}
          onChange={(customsStatus) =>
            patch({ customsStatus: customsStatus as FilterState['customsStatus'] })
          }
        />
      </section>

      {/* Colors */}
      <section>
        <SectionTitle>{t('filter.section.colors')}</SectionTitle>
        <div className="flex flex-wrap gap-2">
          {CAR_COLORS.map((color) => (
            <button
              key={color || 'all'}
              type="button"
              onClick={() => patch({ color })}
              className={`rounded-full px-3 py-2 text-sm font-medium transition-colors ${
                filters.color === color
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {color ? t(`filter.color.${color}`) : t('filter.color.all')}
            </button>
          ))}
        </div>
      </section>

      {/* Footer */}
      {!hideFooter && (
      <div className="flex flex-col gap-3 border-t border-border/60 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={onReset}
          className="btn-secondary rounded-xl px-4 py-2.5 text-sm"
        >
          <RotateCcw className="h-4 w-4" />
          {t('filter.clear')}
        </button>
        <p className="text-center text-sm text-muted-foreground sm:flex-1">
          <span className="font-semibold text-foreground">{resultCount}</span>{' '}
          {resultCount === 1 ? t('home.listing') : t('home.listings')} {t('home.found')}
        </p>
        <button
          type="button"
          onClick={onApply}
          className="btn-primary rounded-xl px-8 py-2.5"
        >
          {t('filter.apply')}
        </button>
      </div>
      )}
    </div>
  )
}
