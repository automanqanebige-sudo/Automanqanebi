'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

type BottomSheetProps = {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  footer?: ReactNode
  /** max height of the sheet body */
  className?: string
}

export default function BottomSheet({
  open,
  onClose,
  title,
  children,
  footer,
  className = '',
}: BottomSheetProps) {
  const { t } = useLanguage()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  if (!open || !mounted) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <button
        type="button"
        aria-label={t('picker.close')}
        className="absolute inset-0 z-0 bg-black/45 backdrop-blur-[2px] transition-opacity duration-300"
        onClick={onClose}
      />

      <div
        className={`relative z-10 flex max-h-[92vh] w-full max-w-2xl flex-col rounded-t-2xl border border-border bg-card shadow-card-hover page-enter sm:max-h-[85vh] sm:rounded-2xl ${className}`}
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
      >
        <div className="relative flex shrink-0 items-center justify-center border-b border-border px-4 py-4">
          <div className="absolute left-1/2 top-2 h-1 w-10 -translate-x-1/2 rounded-full bg-border sm:hidden" />
          <h2 className="text-base font-semibold text-foreground">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label={t('picker.close')}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6">
          {children}
        </div>

        {footer && (
          <div className="shrink-0 border-t border-border bg-card/95 p-4 backdrop-blur-sm">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}
