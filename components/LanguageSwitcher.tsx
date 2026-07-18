'use client'

import Image from 'next/image'
import { Language, useLanguage } from '@/context/LanguageContext'

const languageOptions: { code: Language; flagSrc: string; label: string }[] = [
  { code: 'ka', flagSrc: '/flags/ka.svg', label: 'ქართული' },
  { code: 'ru', flagSrc: '/flags/ru.svg', label: 'Русский' },
  { code: 'en', flagSrc: '/flags/en.svg', label: 'English' },
]

type LanguageSwitcherProps = {
  variant?: 'compact' | 'mobile'
}

export default function LanguageSwitcher({ variant = 'compact' }: LanguageSwitcherProps) {
  const { language, setLanguage, t } = useLanguage()

  if (variant === 'mobile') {
    return (
      <div className="flex items-center gap-2 rounded-lg px-3 py-2">
        <span className="text-sm text-muted-foreground">{t('nav.language')}:</span>
        <div className="flex gap-1.5">
          {languageOptions.map((option) => {
            const active = language === option.code
            return (
              <button
                key={option.code}
                type="button"
                onClick={() => setLanguage(option.code)}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-sm transition-all ${
                  active
                    ? 'border-primary bg-primary/10 ring-1 ring-primary/25'
                    : 'border-border bg-background hover:bg-secondary'
                }`}
                aria-label={option.label}
                title={option.label}
                aria-pressed={active}
              >
                <FlagIcon src={option.flagSrc} label={option.label} size="md" />
                <span className={active ? 'font-medium text-foreground' : 'text-muted-foreground'}>
                  {option.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div
      className="flex items-center rounded-lg border border-border bg-background p-0.5"
      role="group"
      aria-label={t('nav.language')}
    >
      {languageOptions.map((option) => {
        const active = language === option.code
        return (
          <button
            key={option.code}
            type="button"
            onClick={() => setLanguage(option.code)}
            className={`rounded-md p-1 transition-all ${
              active
                ? 'bg-primary/15 ring-1 ring-primary/25'
                : 'opacity-70 hover:bg-secondary hover:opacity-100'
            }`}
            aria-label={option.label}
            title={option.label}
            aria-pressed={active}
          >
            <FlagIcon src={option.flagSrc} label={option.label} size="sm" />
          </button>
        )
      })}
    </div>
  )
}

function FlagIcon({
  src,
  label,
  size,
}: {
  src: string
  label: string
  size: 'sm' | 'md'
}) {
  const dims = size === 'sm' ? { w: 22, h: 16, className: 'h-4 w-[22px]' } : { w: 26, h: 18, className: 'h-[18px] w-[26px]' }

  return (
    <Image
      src={src}
      alt={label}
      width={dims.w}
      height={dims.h}
      className={`${dims.className} rounded-[3px] object-contain shadow-sm ring-1 ring-black/10`}
    />
  )
}

export { languageOptions }
