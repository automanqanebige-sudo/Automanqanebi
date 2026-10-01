'use client'

import Link from 'next/link'
import Image from 'next/image'
import { SITE_LOGO_MAIN, SITE_LOGO_TLD } from '@/lib/site'

type SiteLogoProps = {
  className?: string
  compact?: boolean
}

export default function SiteLogo({ className = '', compact = false }: SiteLogoProps) {
  return (
    <Link
      href="/"
      className={`inline-flex shrink-0 items-center gap-2 rounded-full bg-primary px-3 py-1.5 shadow-sm transition-opacity hover:opacity-95 sm:gap-2.5 sm:px-4 sm:py-2 ${className}`}
    >
      <Image
        src="/logo.png"
        alt={`${SITE_LOGO_MAIN}${SITE_LOGO_TLD}`}
        width={compact ? 32 : 40}
        height={compact ? 32 : 40}
        className={`shrink-0 rounded-full bg-white object-contain p-0.5 ${compact ? 'h-8 w-8' : 'h-9 w-9 sm:h-10 sm:w-10'}`}
        priority
      />
      <span className="font-bold leading-none tracking-tight text-primary-foreground">
        <span className={compact ? 'text-sm sm:text-base' : 'text-base sm:text-lg'}>
          {SITE_LOGO_MAIN}
        </span>
        <span className={compact ? 'text-xs sm:text-sm' : 'text-sm sm:text-base'}>
          {SITE_LOGO_TLD}
        </span>
      </span>
    </Link>
  )
}
