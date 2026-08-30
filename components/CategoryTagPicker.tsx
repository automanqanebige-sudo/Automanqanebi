'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Plus, X } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

export type CategoryTagOption = {
  value: string
  label: string
}

type CategoryTagGridProps = {
  options: CategoryTagOption[]
  value: string
  onChange: (value: string) => void
  className?: string
  /** When false, clicking the active tag keeps it selected (filter UX). */
  allowDeselect?: boolean
  /** Two-column grid on mobile; flex wrap from sm up */
  mobileGrid?: boolean
}

export function CategoryTagGrid({
  options,
  value,
  onChange,
  className = '',
  allowDeselect = false,
  mobileGrid = false,
}: CategoryTagGridProps) {
  const containerClass = mobileGrid
    ? `grid grid-cols-2 gap-2 sm:flex sm:flex-wrap ${className}`
    : `flex flex-wrap gap-2 ${className}`

  return (
    <div className={containerClass}>
      {options.map((option) => {
        const selected = value === option.value
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(selected && allowDeselect ? '' : option.value)}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-2.5 text-left text-xs font-medium shadow-sm transition-colors sm:px-3 sm:text-sm ${
              mobileGrid ? 'min-h-[44px] w-full sm:min-h-0 sm:w-auto sm:text-left' : ''
            } ${
              selected
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-white text-foreground hover:border-primary/40 hover:bg-primary/5'
            }`}
          >
            <Plus
              className={`h-3.5 w-3.5 shrink-0 ${selected ? 'text-primary-foreground' : 'text-muted-foreground'}`}
              strokeWidth={2.5}
            />
            <span className="min-w-0 flex-1 leading-snug">{option.label}</span>
          </button>
        )
      })}
    </div>
  )
}

type CategoryTagPickerSheetProps = {
  open: boolean
  onClose: () => void
  title: string
  options: CategoryTagOption[]
  value: string
  onConfirm: (value: string) => void
}

export function CategoryTagPickerSheet({
  open,
  onClose,
  title,
  options,
  value,
  onConfirm,
}: CategoryTagPickerSheetProps) {
  const { t } = useLanguage()
  const [draft, setDraft] = useState(value)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (open) setDraft(value)
  }, [open, value])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  if (!open || !mounted) return null

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center">
      <button
        type="button"
        aria-label={t('picker.close')}
        className="absolute inset-0 z-0 bg-black/40"
        onClick={onClose}
      />

      <div
        className="relative z-10 flex max-h-[85vh] w-full max-w-lg flex-col rounded-t-2xl bg-white shadow-xl sm:rounded-2xl"
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-center border-b border-border px-4 py-4">
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

        <div className="overflow-y-auto px-4 py-4">
          <CategoryTagGrid options={options} value={draft} onChange={setDraft} allowDeselect />
        </div>

        <div className="shrink-0 border-t border-border p-4">
          <button
            type="button"
            onClick={() => {
              onConfirm(draft)
              onClose()
            }}
            className="w-full rounded-xl bg-[#1e2433] py-3.5 text-base font-semibold text-white transition-opacity hover:opacity-90"
          >
            {t('picker.select')}
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

type CategoryTagPickerFieldProps = {
  label: string
  placeholder: string
  selectedLabel: string
  onOpen: () => void
}

export function CategoryTagPickerField({
  label,
  placeholder,
  selectedLabel,
  onOpen,
}: CategoryTagPickerFieldProps) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className={`flex w-full items-center justify-between rounded-xl border px-4 py-3.5 text-left transition-colors ${
        selectedLabel
          ? 'border-primary bg-primary/5 hover:border-primary'
          : 'border-border bg-white hover:border-primary/40'
      }`}
    >
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <span className={`text-sm font-medium ${selectedLabel ? 'text-primary' : 'text-muted-foreground'}`}>
        {selectedLabel || placeholder}
      </span>
    </button>
  )
}
