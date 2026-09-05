'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { ImagePlus, Loader2, X } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { validateCarImageFile } from '@/lib/upload-car-image'

interface CarImageUploadProps {
  existingUrl?: string
  urlFallback: string
  onUrlFallbackChange: (url: string) => void
  onFileChange: (file: File | null) => void
  disabled?: boolean
}

export default function CarImageUpload({
  existingUrl,
  urlFallback,
  onUrlFallbackChange,
  onFileChange,
  disabled,
}: CarImageUploadProps) {
  const { t } = useLanguage()
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string>(existingUrl || '')
  const [fileError, setFileError] = useState('')

  useEffect(() => {
    if (existingUrl) setPreview(existingUrl)
  }, [existingUrl])

  useEffect(() => {
    return () => {
      if (preview.startsWith('blob:')) URL.revokeObjectURL(preview)
    }
  }, [preview])

  const handleFile = (file: File | null) => {
    setFileError('')
    if (!file) {
      onFileChange(null)
      setPreview(existingUrl || urlFallback || '')
      return
    }

    const validation = validateCarImageFile(file)
    if (validation === 'invalidType') {
      setFileError(t('upload.errorType'))
      return
    }
    if (validation === 'tooLarge') {
      setFileError(t('upload.errorSize'))
      return
    }

    if (preview.startsWith('blob:')) URL.revokeObjectURL(preview)
    setPreview(URL.createObjectURL(file))
    onFileChange(file)
  }

  const clearImage = () => {
    if (preview.startsWith('blob:')) URL.revokeObjectURL(preview)
    setPreview('')
    onFileChange(null)
    onUrlFallbackChange('')
    if (inputRef.current) inputRef.current.value = ''
  }

  const displayUrl = preview || urlFallback

  return (
    <div className="space-y-3">
      <label className="block text-xs font-medium text-muted-foreground">
        {t('upload.photo')}
      </label>

      {displayUrl ? (
        <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-border bg-muted">
          <Image
            src={displayUrl}
            alt={t('upload.preview')}
            fill
            className="object-cover"
            unoptimized={displayUrl.startsWith('blob:')}
            sizes="(max-width: 768px) 100vw, 640px"
          />
          {!disabled && (
            <button
              type="button"
              onClick={clearImage}
              className="absolute right-3 top-3 rounded-full bg-background/90 p-2 shadow-md transition-colors hover:bg-background"
              aria-label={t('upload.remove')}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      ) : (
        <button
          type="button"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
          className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-secondary/30 px-6 py-10 transition-colors hover:border-primary/50 hover:bg-secondary/50 disabled:opacity-60"
        >
          <ImagePlus className="h-10 w-10 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">{t('upload.clickOrDrop')}</span>
          <span className="text-xs text-muted-foreground">{t('upload.hint')}</span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        disabled={disabled}
        onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
      />

      {displayUrl && !disabled && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="text-sm font-medium text-primary hover:underline"
        >
          {t('upload.change')}
        </button>
      )}

      <div>
        <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
          {t('addCar.imageUrl')}
        </label>
        <input
          type="url"
          placeholder="https://..."
          value={urlFallback}
          disabled={disabled}
          onChange={(e) => onUrlFallbackChange(e.target.value)}
          className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-all focus:ring-2 focus:ring-primary disabled:opacity-60"
        />
        <p className="mt-1 text-xs text-muted-foreground">{t('upload.urlFallback')}</p>
      </div>

      {fileError && (
        <p className="text-sm text-destructive">{fileError}</p>
      )}
    </div>
  )
}

export function UploadingOverlay({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center gap-2 rounded-lg bg-primary/10 px-4 py-3 text-sm font-medium text-primary">
      <Loader2 className="h-4 w-4 animate-spin" />
      {label}
    </div>
  )
}
