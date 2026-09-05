'use client'

import Link from 'next/link'
import { Car, ShieldCheck, Search, Headphones } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

const FEATURES = [
  { icon: Search, titleKey: 'home.why.f1.title', descKey: 'home.why.f1.desc' },
  { icon: ShieldCheck, titleKey: 'home.why.f2.title', descKey: 'home.why.f2.desc' },
  { icon: Car, titleKey: 'home.why.f3.title', descKey: 'home.why.f3.desc' },
  { icon: Headphones, titleKey: 'home.why.f4.title', descKey: 'home.why.f4.desc' },
] as const

export default function HomeTrustCta() {
  const { t } = useLanguage()

  return (
    <>
      <section className="section-padding">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 text-center sm:mb-10">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {t('home.why.title')}
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
              {t('home.why.subtitle')}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map(({ icon: Icon, titleKey, descKey }) => (
              <div
                key={titleKey}
                className="rounded-2xl border border-border bg-card p-5 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover sm:p-6"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" aria-hidden />
                </div>
                <h3 className="text-base font-semibold text-foreground">{t(titleKey)}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{t(descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-12 sm:px-6 sm:pb-16 lg:px-8">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-2xl border border-border bg-surface-elevated px-6 py-10 text-center sm:px-10 sm:py-14">
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              background:
                'radial-gradient(ellipse 80% 60% at 50% 0%, hsl(var(--primary) / 0.35), transparent 70%)',
            }}
            aria-hidden
          />
          <div className="relative">
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {t('home.cta.title')}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-white/70 sm:text-base">
              {t('home.cta.subtitle')}
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/add-car" className="btn-primary w-full rounded-xl px-8 py-3.5 sm:w-auto">
                {t('home.cta.sell')}
              </Link>
              <Link
                href="/#search"
                className="inline-flex w-full items-center justify-center rounded-xl border border-white/20 bg-white/10 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/15 sm:w-auto"
              >
                {t('home.cta.browse')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
