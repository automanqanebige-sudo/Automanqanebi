'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { Star, ChevronDown, Search } from 'lucide-react'
import { carBrands, TOP_BRAND_NAMES } from '@/data/car-brands'
import { useLanguage } from '@/context/LanguageContext'

type BrandFilterProps = {
  selectedBrand: string
  selectedModel: string
  onBrandChange: (brand: string) => void
  onModelChange: (model: string) => void
}

function BrandLogo({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <span className="flex h-full w-full items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
        {alt.charAt(0).toUpperCase()}
      </span>
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={40}
      height={40}
      className="h-full w-full object-contain"
      onError={() => setFailed(true)}
      unoptimized
    />
  )
}

export default function BrandFilter({
  selectedBrand,
  selectedModel,
  onBrandChange,
  onModelChange,
}: BrandFilterProps) {
  const { t } = useLanguage()
  const [showAll, setShowAll] = useState(false)
  const [query, setQuery] = useState('')

  const sortedBrands = useMemo(
    () => [...carBrands].sort((a, b) => a.brand.localeCompare(b.brand)),
    []
  )

  const filteredBrands = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return sortedBrands
    return sortedBrands.filter((b) => b.brand.toLowerCase().includes(q))
  }, [sortedBrands, query])

  const models = carBrands.find((b) => b.brand === selectedBrand)?.models ?? []

  const selectClass =
    'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/40'

  return (
    <div className="rounded-2xl bg-slate-900 p-5 shadow-inner sm:p-6">
      <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-white">
        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
        {t('search.topBrands')}
      </h3>

      <div className="mb-6 grid grid-cols-5 gap-3 md:grid-cols-5">
        {TOP_BRAND_NAMES.map((brand) => {
          const item = carBrands.find((b) => b.brand === brand)
          if (!item) return null

          const selected = selectedBrand === brand

          return (
            <button
              key={brand}
              type="button"
              onClick={() => {
                onBrandChange(selected ? '' : brand)
              }}
              className={`flex flex-col items-center gap-2 rounded-2xl p-2 transition-all hover:-translate-y-0.5 ${
                selected ? 'ring-2 ring-amber-400' : ''
              }`}
              aria-pressed={selected}
            >
              <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl bg-white p-3 shadow-sm">
                <BrandLogo src={item.logo} alt={item.brand} />
              </div>
              <span className="max-w-full truncate text-center text-[11px] font-medium text-white">
                {item.brand}
              </span>
            </button>
          )
        })}
      </div>

      <h3 className="mb-2 text-sm font-semibold text-white">{t('search.allBrands')}</h3>
      <select
        value={selectedBrand}
        onChange={(e) => {
          onBrandChange(e.target.value)
        }}
        className={`${selectClass} mb-4`}
      >
        <option value="" className="bg-slate-900 text-white">
          {t('search.selectBrand')}
        </option>
        {sortedBrands.map((brand) => (
          <option key={brand.brand} value={brand.brand} className="bg-slate-900 text-white">
            {brand.brand}
          </option>
        ))}
      </select>

      <button
        type="button"
        onClick={() => setShowAll((v) => !v)}
        className="mb-4 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/10"
        aria-expanded={showAll}
      >
        {t('search.allBrands')}
        <ChevronDown className={`h-4 w-4 transition-transform ${showAll ? 'rotate-180' : ''}`} />
      </button>

      {showAll && (
        <div className="mb-4">
          <div className="relative mb-3">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('search.selectBrand')}
              className={`${selectClass} pl-10`}
            />
          </div>
          <div className="grid max-h-72 grid-cols-4 gap-2 overflow-y-auto pr-1 sm:grid-cols-5 md:grid-cols-6">
            {filteredBrands.map((item) => {
              const selected = selectedBrand === item.brand
              return (
                <button
                  key={item.brand}
                  type="button"
                  onClick={() => {
                    onBrandChange(selected ? '' : item.brand)
                  }}
                  className={`flex flex-col items-center gap-1.5 rounded-xl p-1.5 transition-all hover:-translate-y-0.5 ${
                    selected ? 'ring-2 ring-amber-400' : ''
                  }`}
                  aria-pressed={selected}
                  title={item.brand}
                >
                  <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl bg-white p-2 shadow-sm">
                    <BrandLogo src={item.logo} alt={item.brand} />
                  </div>
                  <span className="max-w-full truncate text-center text-[10px] font-medium text-white">
                    {item.brand}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {selectedBrand && (
        <>
          <h3 className="mb-2 text-sm font-semibold text-white">{t('search.model')}</h3>
          <select
            value={selectedModel}
            onChange={(e) => onModelChange(e.target.value)}
            className={selectClass}
          >
            <option value="" className="bg-slate-900 text-white">
              {t('search.selectModel')}
            </option>
            {models.map((model) => (
              <option key={model} value={model} className="bg-slate-900 text-white">
                {model}
              </option>
            ))}
          </select>
        </>
      )}
    </div>
  )
}
