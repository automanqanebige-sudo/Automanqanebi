'use client'

import { RotateCcw } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { useCurrency } from '@/context/CurrencyContext'
import {
  CAR_COLORS,
  CAR_FEATURES,
  COLOR_EMOJI,
  CUSTOMS_STATUSES,
  IMPORT_REGIONS,
  LISTING_TYPES,
  PRICE_SLIDER_MAX,
  type CarFeature,
  type FilterState,
} from '@/types/filters'

interface AdvancedFilterPanelProps {
  filters: FilterState
  onChange: (filters: FilterState) => void
  onApply: () => void
  onReset: () => void
  resultCount: number
}

const currentYear = new Date().getFullYear()

function SectionTitle({ icon, children }: { icon: string; children: React.ReactNode }) {
  return (
    <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
      <span aria-hidden>{icon}</span>
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
        className="w-full cursor-pointer appearance-none rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground transition-all focus:outline-none focus:ring-2 focus:ring-primary"
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
}: AdvancedFilterPanelProps) {
  const { t } = useLanguage()
  const { formatPrice } = useCurrency()

  const patch = (partial: Partial<FilterState>) => onChange({ ...filters, ...partial })

  const toggleFeature = (feature: CarFeature) => {
    const next = filters.features.includes(feature)
      ? filters.features.filter((f) => f !== feature)
      : [...filters.features, feature]
    patch({ features: next })
  }

  const yearOptions = [
    { value: '', label: t('search.any') },
    ...Array.from({ length: 35 }, (_, i) => ({
      value: String(currentYear - i),
      label: String(currentYear - i),
    })),
  ]

  const categoryOptions = [
    { value: '', label: t('search.any') },
    { value: 'car', label: t('filter.category.car') },
    { value: 'suv', label: t('filter.category.suv') },
    { value: 'van', label: t('filter.category.van') },
    { value: 'truck', label: t('filter.category.truck') },
    { value: 'motorcycle', label: t('filter.category.motorcycle') },
  ]

  const fuelOptions = [
    { value: '', label: t('search.allFuel') },
    { value: 'petrol', label: t('fuel.Petrol') },
    { value: 'diesel', label: t('fuel.Diesel') },
    { value: 'hybrid', label: t('fuel.Hybrid') },
    { value: 'electric', label: t('fuel.Electric') },
    { value: 'lpg', label: t('fuel.LPG') },
  ]

  const bodyOptions = [
    { value: '', label: t('search.any') },
    { value: 'sedan', label: t('filter.body.sedan') },
    { value: 'suv', label: t('filter.body.suv') },
    { value: 'hatchback', label: t('filter.body.hatchback') },
    { value: 'coupe', label: t('filter.body.coupe') },
    { value: 'wagon', label: t('filter.body.wagon') },
    { value: 'pickup', label: t('filter.body.pickup') },
    { value: 'van', label: t('filter.body.van') },
  ]

  const transmissionOptions = [
    { value: '', label: t('search.allTransmission') },
    { value: 'automatic', label: t('transmission.Automatic') },
    { value: 'manual', label: t('transmission.Manual') },
    { value: 'semi-automatic', label: t('transmission.Semi-Automatic') },
  ]

  const driveOptions = [
    { value: '', label: t('search.any') },
    { value: 'fwd', label: t('filter.drive.fwd') },
    { value: 'rwd', label: t('filter.drive.rwd') },
    { value: 'awd', label: t('filter.drive.awd') },
    { value: '4wd', label: t('filter.drive.4wd') },
  ]

  const steeringOptions = [
    { value: '', label: t('search.any') },
    { value: 'left', label: t('filter.steering.left') },
    { value: 'right', label: t('filter.steering.right') },
  ]

  const engineOptions = [
    { value: '', label: t('search.any') },
    ...['0.8', '1.0', '1.2', '1.4', '1.5', '1.6', '1.8', '2.0', '2.5', '2.9', '3.0', '3.5', '4.0', '5.0'].map(
      (v) => ({ value: v, label: `${v}L` })
    ),
  ]

  const cylinderOptions = [
    { value: '', label: t('search.any') },
    ...['3', '4', '5', '6', '8', '10', '12'].map((v) => ({ value: v, label: v })),
  ]

  const doorOptions = [
    { value: '', label: t('search.any') },
    ...['2', '3', '4', '5'].map((v) => ({ value: v, label: v })),
  ]

  const mileageOptions = [
    { value: '', label: t('search.any') },
    ...['10000', '30000', '50000', '75000', '100000', '150000', '200000'].map((v) => ({
      value: v,
      label: `${Number(v).toLocaleString('en-US')} km`,
    })),
  ]

  return (
    <div className="space-y-6">
      {/* Basic */}
      <section>
        <SectionTitle icon="🚗">{t('filter.section.basic')}</SectionTitle>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <FilterSelect
            label={t('filter.category')}
            value={filters.category}
            options={categoryOptions}
            onChange={(category) => patch({ category })}
          />
          <FilterSelect
            label={t('search.fuelType')}
            value={filters.fuelType}
            options={fuelOptions}
            onChange={(fuelType) => patch({ fuelType })}
          />
        </div>
      </section>

      {/* Price */}
      <section>
        <SectionTitle icon="💰">{t('filter.section.price')}</SectionTitle>
        <div className="grid grid-cols-2 gap-3 sm:max-w-md">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              {t('search.minPrice')}
            </label>
            <input
              type="number"
              min={0}
              max={filters.priceMax}
              value={filters.priceMin || ''}
              onChange={(e) => patch({ priceMin: Number(e.target.value) || 0 })}
              placeholder="0"
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              {t('search.maxPrice')}
            </label>
            <input
              type="number"
              min={filters.priceMin}
              max={PRICE_SLIDER_MAX}
              value={filters.priceMax === PRICE_SLIDER_MAX ? '' : filters.priceMax}
              onChange={(e) =>
                patch({ priceMax: Number(e.target.value) || PRICE_SLIDER_MAX })
              }
              placeholder={String(PRICE_SLIDER_MAX)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatPrice(filters.priceMin)}</span>
            <span>{formatPrice(filters.priceMax)}</span>
          </div>
          <div className="relative h-2">
            <div className="absolute inset-0 rounded-full bg-secondary" />
            <div
              className="absolute h-2 rounded-full bg-primary"
              style={{
                left: `${(filters.priceMin / PRICE_SLIDER_MAX) * 100}%`,
                right: `${100 - (filters.priceMax / PRICE_SLIDER_MAX) * 100}%`,
              }}
            />
            <input
              type="range"
              min={0}
              max={PRICE_SLIDER_MAX}
              step={1000}
              value={filters.priceMin}
              onChange={(e) => {
                const v = Number(e.target.value)
                patch({ priceMin: Math.min(v, filters.priceMax - 1000) })
              }}
              className="pointer-events-auto absolute inset-0 h-2 w-full cursor-pointer appearance-none bg-transparent [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
            />
            <input
              type="range"
              min={0}
              max={PRICE_SLIDER_MAX}
              step={1000}
              value={filters.priceMax}
              onChange={(e) => {
                const v = Number(e.target.value)
                patch({ priceMax: Math.max(v, filters.priceMin + 1000) })
              }}
              className="pointer-events-auto absolute inset-0 h-2 w-full cursor-pointer appearance-none bg-transparent [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
            />
          </div>
        </div>
      </section>

      {/* Technical */}
      <section>
        <SectionTitle icon="⚙️">{t('filter.section.technical')}</SectionTitle>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          <FilterSelect
            label={`${t('search.year')} (${t('search.from')})`}
            value={filters.yearMin}
            options={yearOptions}
            onChange={(yearMin) => patch({ yearMin })}
          />
          <FilterSelect
            label={`${t('search.year')} (${t('search.to')})`}
            value={filters.yearMax}
            options={yearOptions}
            onChange={(yearMax) => patch({ yearMax })}
          />
          <FilterSelect
            label={t('filter.body')}
            value={filters.bodyType}
            options={bodyOptions}
            onChange={(bodyType) => patch({ bodyType })}
          />
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
            label={t('filter.engineVolume')}
            value={filters.engineVolume}
            options={engineOptions}
            onChange={(engineVolume) => patch({ engineVolume })}
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
          <FilterSelect
            label={`${t('search.mileage')} (${t('search.from')})`}
            value={filters.mileageMin}
            options={mileageOptions}
            onChange={(mileageMin) => patch({ mileageMin })}
          />
          <FilterSelect
            label={`${t('search.mileage')} (${t('search.to')})`}
            value={filters.mileageMax}
            options={mileageOptions}
            onChange={(mileageMax) => patch({ mileageMax })}
          />
        </div>
      </section>

      {/* Features */}
      <section>
        <SectionTitle icon="⭐">{t('filter.section.features')}</SectionTitle>
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
        <SectionTitle icon="📢">{t('filter.section.listingType')}</SectionTitle>
        <div className="flex flex-wrap gap-2">
          {LISTING_TYPES.map((type) => (
            <button
              key={type || 'all'}
              type="button"
              onClick={() => patch({ listingType: type })}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                filters.listingType === type
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {type ? t(`filter.listing.${type}`) : t('filter.all')}
            </button>
          ))}
        </div>
      </section>

      {/* Import */}
      <section>
        <SectionTitle icon="🌍">{t('filter.section.import')}</SectionTitle>
        <div className="flex flex-wrap gap-2">
          {IMPORT_REGIONS.map((region) => (
            <button
              key={region || 'all'}
              type="button"
              onClick={() => patch({ importRegion: region })}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                filters.importRegion === region
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {region ? t(`filter.import.${region}`) : t('filter.all')}
            </button>
          ))}
        </div>
      </section>

      {/* Customs */}
      <section>
        <SectionTitle icon="📄">{t('filter.section.status')}</SectionTitle>
        <div className="flex flex-wrap gap-2">
          {CUSTOMS_STATUSES.map((status) => (
            <button
              key={status || 'all'}
              type="button"
              onClick={() => patch({ customsStatus: status })}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                filters.customsStatus === status
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {status ? t(`filter.customs.${status}`) : t('filter.all')}
            </button>
          ))}
        </div>
      </section>

      {/* Colors */}
      <section>
        <SectionTitle icon="🎨">{t('filter.section.colors')}</SectionTitle>
        <div className="flex flex-wrap gap-2">
          {CAR_COLORS.map((color) => (
            <button
              key={color || 'all'}
              type="button"
              onClick={() => patch({ color })}
              className={`flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium transition-colors ${
                filters.color === color
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {color && COLOR_EMOJI[color] ? (
                <span aria-hidden>{COLOR_EMOJI[color]}</span>
              ) : color ? null : (
                <span aria-hidden>🌈</span>
              )}
              {color ? t(`filter.color.${color}`) : t('filter.color.all')}
            </button>
          ))}
        </div>
      </section>

      {/* Footer */}
      <div className="flex flex-col gap-3 border-t border-border/60 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={onReset}
          className="flex items-center justify-center gap-2 rounded-lg border border-input bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-all hover:bg-secondary"
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
          className="rounded-xl bg-primary px-8 py-2.5 font-semibold text-primary-foreground transition-all hover:bg-primary/90"
        >
          {t('filter.apply')}
        </button>
      </div>
    </div>
  )
}
