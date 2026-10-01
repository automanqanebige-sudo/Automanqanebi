'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { SITE_LOGO_MAIN, SITE_LOGO_TLD } from '@/lib/site'

const MIN_DISPLAY_MS = 400
const MAX_DISPLAY_MS = 1200

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    const started = Date.now()
    let cancelled = false

    const finish = () => {
      if (cancelled) return
      const elapsed = Date.now() - started
      const remaining = Math.max(0, MIN_DISPLAY_MS - elapsed)

      setTimeout(() => {
        if (cancelled) return
        setFadeOut(true)
        setTimeout(() => {
          if (!cancelled) setVisible(false)
        }, 350)
      }, remaining)
    }

    if (document.readyState === 'complete') {
      finish()
    } else {
      window.addEventListener('load', finish, { once: true })
    }

    const safety = setTimeout(finish, MAX_DISPLAY_MS)

    return () => {
      cancelled = true
      clearTimeout(safety)
      window.removeEventListener('load', finish)
    }
  }, [])

  if (!visible) return null

  return (
    <div
      className={`fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[hsl(var(--surface-elevated))] transition-opacity duration-300 ${
        fadeOut ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
      aria-hidden={fadeOut}
      role="presentation"
    >
      <div className="flex flex-col items-center gap-6 animate-scale-in">
        <div className="relative">
          <div className="absolute -inset-4 rounded-full bg-primary/10 blur-xl" />
          <Image
            src="/logo.png"
            alt=""
            width={72}
            height={72}
            priority
            className="relative h-[72px] w-[72px] rounded-2xl object-contain"
          />
        </div>

        <div className="text-center">
          <p className="text-xl font-bold tracking-tight text-white">
            {SITE_LOGO_MAIN}
            <span className="text-primary">{SITE_LOGO_TLD}</span>
          </p>
          <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-white/50">
            Automotive Marketplace
          </p>
        </div>

        <div className="relative h-0.5 w-32 overflow-hidden rounded-full bg-white/10">
          <div className="absolute inset-y-0 w-1/3 rounded-full bg-primary animate-loader-line" />
        </div>
      </div>
    </div>
  )
}
