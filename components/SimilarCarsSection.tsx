'use client'

import type { Car } from '@/components/CarCard'
import CarCard from '@/components/CarCard'
import { useLanguage } from '@/context/LanguageContext'

type SimilarCarsSectionProps = {
  cars: Car[]
}

export default function SimilarCarsSection({ cars }: SimilarCarsSectionProps) {
  const { t } = useLanguage()

  if (cars.length === 0) return null

  return (
    <section className="mt-12 border-t border-border pt-10">
      <h2 className="mb-6 text-2xl font-bold text-foreground">{t('car.similar')}</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cars.map((car) => (
          <CarCard key={car.id} car={car} />
        ))}
      </div>
    </section>
  )
}
