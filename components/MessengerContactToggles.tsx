'use client'

import WhatsAppIcon from '@/components/icons/WhatsAppIcon'
import ViberIcon from '@/components/icons/ViberIcon'
import { useLanguage } from '@/context/LanguageContext'

type MessengerContactTogglesProps = {
  whatsApp: boolean
  viber: boolean
  onWhatsAppChange: (value: boolean) => void
  onViberChange: (value: boolean) => void
  disabled?: boolean
}

export default function MessengerContactToggles({
  whatsApp,
  viber,
  onWhatsAppChange,
  onViberChange,
  disabled = false,
}: MessengerContactTogglesProps) {
  const { t } = useLanguage()

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        disabled={disabled}
        onClick={() => onWhatsAppChange(!whatsApp)}
        aria-pressed={whatsApp}
        className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-all ${
          whatsApp
            ? 'border-[#25D366]/50 bg-[#25D366]/10 text-[#128C7E] ring-2 ring-[#25D366]/25'
            : 'border-border bg-background text-muted-foreground hover:border-[#25D366]/30 hover:bg-[#25D366]/5'
        } disabled:opacity-60`}
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#25D366] text-white">
          <WhatsAppIcon className="h-4 w-4" />
        </span>
        WhatsApp
        {whatsApp && <span className="text-xs opacity-80">✓</span>}
      </button>

      <button
        type="button"
        disabled={disabled}
        onClick={() => onViberChange(!viber)}
        aria-pressed={viber}
        className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-all ${
          viber
            ? 'border-[#7360f2]/50 bg-[#7360f2]/10 text-[#5b4bc4] ring-2 ring-[#7360f2]/25'
            : 'border-border bg-background text-muted-foreground hover:border-[#7360f2]/30 hover:bg-[#7360f2]/5'
        } disabled:opacity-60`}
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#7360f2] text-white">
          <ViberIcon className="h-4 w-4" />
        </span>
        Viber
        {viber && <span className="text-xs opacity-80">✓</span>}
      </button>

      <p className="w-full text-xs text-muted-foreground">{t('addCar.messengerHint')}</p>
    </div>
  )
}
