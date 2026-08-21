'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Columns2, X } from 'lucide-react'
import { useCompare, COMPARE_MAX } from '@/context/CompareContext'
import { useLanguage } from '@/context/LanguageContext'

export default function CompareBar() {
  const { t } = useLanguage()
  const { ids, count, clearCompare } = useCompare()
  const pathname = usePathname()

  if (count === 0 || pathname.startsWith('/compare')) return null

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[4.5rem] z-40 flex justify-center px-3 md:bottom-6">
      <div className="pointer-events-auto flex max-w-lg items-center gap-2 rounded-2xl border border-border bg-card/95 px-3 py-2.5 shadow-xl backdrop-blur">
        <Columns2 className="h-4 w-4 shrink-0 text-primary" />
        <p className="min-w-0 flex-1 text-sm text-foreground">
          {t('compare.barCount')
            .replace('{n}', String(count))
            .replace('{max}', String(COMPARE_MAX))}
        </p>
        <Link
          href={`/compare?ids=${ids.join(',')}`}
          className="shrink-0 rounded-xl bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
        >
          {t('compare.open')}
        </Link>
        <button
          type="button"
          onClick={clearCompare}
          className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
          aria-label={t('compare.clear')}
          title={t('compare.clear')}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
