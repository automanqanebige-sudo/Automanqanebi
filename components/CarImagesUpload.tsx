'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { ImagePlus, X } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { MAX_CAR_IMAGES } from '@/lib/car-images'
import { validateCarImageFile } from '@/lib/upload-car-image'

export type ImageSlot = {
  id: string
  url: string
  file?: File
}

type CarImagesUploadProps = {
  slots: ImageSlot[]
  onChange: (slots: ImageSlot[]) => void
  disabled?: boolean
}

function newId() {
  return `img-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

export function urlsToSlots(urls: string[]): ImageSlot[] {
  return urls.filter(Boolean).map((url) => ({ id: newId(), url }))
}

export default function CarImagesUpload({ slots, onChange, disabled }: CarImagesUploadProps) {
  const { t } = useLanguage()
  const inputRef = useRef<HTMLInputElement>(null)
  const [fileError, setFileError] = useState('')

  useEffect(() => {
    return () => {
      slots.forEach((slot) => {
        if (slot.url.startsWith('blob:')) URL.revokeObjectURL(slot.url)
      })
    }
  }, [slots])

  const addFiles = (files: FileList | null) => {
    if (!files?.length) return
    setFileError('')

    const next = [...slots]
    for (const file of Array.from(files)) {
      if (next.length >= MAX_CAR_IMAGES) break

      const validation = validateCarImageFile(file)
      if (validation === 'invalidType') {
        setFileError(t('upload.errorType'))
        continue
      }
      if (validation === 'tooLarge') {
        setFileError(t('upload.errorSize'))
        continue
      }

      next.push({ id: newId(), url: URL.createObjectURL(file), file })
    }

    onChange(next)
    if (inputRef.current) inputRef.current.value = ''
  }

  const removeSlot = (id: string) => {
    const slot = slots.find((s) => s.id === id)
    if (slot?.url.startsWith('blob:')) URL.revokeObjectURL(slot.url)
    onChange(slots.filter((s) => s.id !== id))
  }

  const updateUrl = (id: string, url: string) => {
    onChange(slots.map((s) => (s.id === id ? { ...s, url, file: undefined } : s)))
  }

  const canAddMore = slots.length < MAX_CAR_IMAGES

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <label className="block text-xs font-medium text-muted-foreground">
          {t('upload.photos')}
        </label>
        <span className="text-xs text-muted-foreground">
          {slots.length}/{MAX_CAR_IMAGES}
        </span>
      </div>

      {slots.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {slots.map((slot, index) => (
            <div key={slot.id} className="space-y-2">
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-muted">
                <Image
                  src={slot.url}
                  alt={`${t('upload.preview')} ${index + 1}`}
                  fill
                  className="object-cover"
                  unoptimized={slot.url.startsWith('blob:')}
                  sizes="200px"
                />
                {!disabled && (
                  <button
                    type="button"
                    onClick={() => removeSlot(slot.id)}
                    className="absolute right-2 top-2 rounded-full bg-background/90 p-1.5 shadow-md hover:bg-background"
                    aria-label={t('upload.remove')}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
                {index === 0 && (
                  <span className="absolute bottom-2 left-2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
                    {t('upload.cover')}
                  </span>
                )}
              </div>
              <input
                type="url"
                placeholder="https://..."
                value={slot.file ? '' : slot.url.startsWith('blob:') ? '' : slot.url}
                disabled={disabled || Boolean(slot.file)}
                onChange={(e) => updateUrl(slot.id, e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-2 py-1.5 text-xs text-foreground outline-none focus:ring-2 focus:ring-primary disabled:opacity-60"
              />
            </div>
          ))}
        </div>
      )}

      {canAddMore && (
        <>
          <button
            type="button"
            disabled={disabled}
            onClick={() => inputRef.current?.click()}
            className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-secondary/30 px-6 py-8 transition-colors hover:border-primary/50 hover:bg-secondary/50 disabled:opacity-60"
          >
            <ImagePlus className="h-8 w-8 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">{t('upload.addPhotos')}</span>
            <span className="text-xs text-muted-foreground">{t('upload.hintMulti')}</span>
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="hidden"
            disabled={disabled}
            onChange={(e) => addFiles(e.target.files)}
          />
        </>
      )}

      {fileError && <p className="text-sm text-destructive">{fileError}</p>}
    </div>
  )
}
