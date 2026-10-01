'use client'

import WhatsAppIcon from '@/components/icons/WhatsAppIcon'
import ViberIcon from '@/components/icons/ViberIcon'
import { viberHref, whatsAppHref } from '@/lib/contact-links'

type MessengerContactButtonsProps = {
  phone: string
  whatsApp?: boolean
  viber?: boolean
  className?: string
}

export default function MessengerContactButtons({
  phone,
  whatsApp,
  viber,
  className = '',
}: MessengerContactButtonsProps) {
  const wa = whatsApp ? whatsAppHref(phone) : null
  const vb = viber ? viberHref(phone) : null

  if (!wa && !vb) return null

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {wa && (
        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#25D366]/40 bg-[#25D366]/10 px-4 py-3 text-sm font-semibold text-[#128C7E] transition-colors hover:bg-[#25D366]/20 sm:min-w-[140px] sm:flex-none"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#25D366] text-white">
            <WhatsAppIcon className="h-4 w-4" />
          </span>
          WhatsApp
        </a>
      )}
      {vb && (
        <a
          href={vb}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#7360f2]/40 bg-[#7360f2]/10 px-4 py-3 text-sm font-semibold text-[#5b4bc4] transition-colors hover:bg-[#7360f2]/20 sm:min-w-[140px] sm:flex-none"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#7360f2] text-white">
            <ViberIcon className="h-4 w-4" />
          </span>
          Viber
        </a>
      )}
    </div>
  )
}
