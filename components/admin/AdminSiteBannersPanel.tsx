'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { ImageIcon, Pencil, Plus, Trash2, Video } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/context/AuthContext'
import {
  BANNER_MEDIA_TYPES,
  BANNER_PLACEMENTS,
  BANNER_SIZES,
  type BannerMediaType,
  type BannerPlacement,
  type BannerSize,
  type SiteBanner,
  type SiteBannerInput,
} from '@/types/site-banner'
import {
  createSiteBanner,
  deleteSiteBanner,
  updateSiteBanner,
} from '@/lib/site-banners-firestore'
import { uploadBannerImage, uploadBannerVideo } from '@/lib/upload-banner-media'
import { bannerHasMedia, isBannerScheduleActive } from '@/lib/site-banner-utils'

type AdminSiteBannersPanelProps = {
  banners: SiteBanner[]
  onChange: () => void
}

const emptyForm = (): SiteBannerInput => ({
  name: '',
  title: '',
  subtitle: '',
  placement: 'home_mid',
  size: 'large',
  mediaType: 'image',
  imageUrl: '',
  videoUrl: '',
  slideUrls: [],
  linkUrl: '',
  linkLabel: '',
  altText: '',
  backgroundColor: '',
  startsAt: '',
  expiresAt: '',
  active: true,
  sortOrder: 0,
  openInNewTab: true,
})

function toLocalDatetime(iso?: string): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso.slice(0, 16)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function fromLocalDatetime(value: string): string | undefined {
  const v = value.trim()
  if (!v) return undefined
  const d = new Date(v)
  return Number.isNaN(d.getTime()) ? v : d.toISOString()
}

export default function AdminSiteBannersPanel({ banners, onChange }: AdminSiteBannersPanelProps) {
  const { t } = useLanguage()
  const { user } = useAuth()
  const imageRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLInputElement>(null)
  const slideRef = useRef<HTMLInputElement>(null)

  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<SiteBannerInput>(emptyForm())
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyForm())
    setError('')
    setShowForm(true)
  }

  const openEdit = (banner: SiteBanner) => {
    setEditingId(banner.id)
    setForm({
      name: banner.name,
      title: banner.title ?? '',
      subtitle: banner.subtitle ?? '',
      placement: banner.placement,
      size: banner.size,
      mediaType: banner.mediaType,
      imageUrl: banner.imageUrl ?? '',
      videoUrl: banner.videoUrl ?? '',
      slideUrls: banner.slideUrls ?? [],
      linkUrl: banner.linkUrl ?? '',
      linkLabel: banner.linkLabel ?? '',
      altText: banner.altText ?? '',
      backgroundColor: banner.backgroundColor ?? '',
      startsAt: toLocalDatetime(banner.startsAt),
      expiresAt: toLocalDatetime(banner.expiresAt),
      active: banner.active,
      sortOrder: banner.sortOrder,
      openInNewTab: banner.openInNewTab,
    })
    setError('')
    setShowForm(true)
  }

  const handleImageUpload = async (file: File | null) => {
    if (!file || !user) return
    setUploading(true)
    setError('')
    try {
      const url = await uploadBannerImage(file, user.uid)
      setForm((prev) => ({ ...prev, imageUrl: url }))
    } catch {
      setError(t('admin.bannerFormError'))
    } finally {
      setUploading(false)
    }
  }

  const handleVideoUpload = async (file: File | null) => {
    if (!file || !user) return
    setUploading(true)
    setError('')
    try {
      const url = await uploadBannerVideo(file, user.uid)
      setForm((prev) => ({ ...prev, videoUrl: url }))
    } catch {
      setError(t('admin.bannerFormError'))
    } finally {
      setUploading(false)
    }
  }

  const handleSlideUpload = async (file: File | null) => {
    if (!file || !user) return
    setUploading(true)
    setError('')
    try {
      const url = await uploadBannerImage(file, user.uid)
      setForm((prev) => ({ ...prev, slideUrls: [...(prev.slideUrls ?? []), url] }))
    } catch {
      setError(t('admin.bannerFormError'))
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) {
      setError(t('admin.bannerNameRequired'))
      return
    }
    if (!bannerHasMedia({ ...form, id: 'x' } as SiteBanner) && !form.title?.trim()) {
      setError(t('admin.bannerMediaRequired'))
      return
    }

    setSaving(true)
    setError('')
    try {
      const payload: SiteBannerInput = {
        ...form,
        name: form.name.trim(),
        title: form.title?.trim() || undefined,
        subtitle: form.subtitle?.trim() || undefined,
        imageUrl: form.imageUrl?.trim() || undefined,
        videoUrl: form.videoUrl?.trim() || undefined,
        slideUrls: form.slideUrls?.filter(Boolean) ?? [],
        linkUrl: form.linkUrl?.trim() || undefined,
        linkLabel: form.linkLabel?.trim() || undefined,
        altText: form.altText?.trim() || undefined,
        backgroundColor: form.backgroundColor?.trim() || undefined,
        startsAt: fromLocalDatetime(form.startsAt ?? ''),
        expiresAt: fromLocalDatetime(form.expiresAt ?? ''),
        sortOrder: Number(form.sortOrder) || 0,
      }

      if (editingId) {
        await updateSiteBanner(editingId, payload)
      } else {
        await createSiteBanner(payload)
      }
      setShowForm(false)
      onChange()
    } catch {
      setError(t('admin.bannerFormError'))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm(t('profile.deleteConfirm'))) return
    await deleteSiteBanner(id)
    onChange()
  }

  const toggleActive = async (banner: SiteBanner) => {
    await updateSiteBanner(banner.id, { active: !banner.active })
    onChange()
  }

  const fieldClass =
    'w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary'

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground">{t('admin.bannerTitle')}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{t('admin.bannerHint')}</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="btn-primary inline-flex rounded-xl px-4 py-2 text-sm"
        >
          <Plus className="h-4 w-4" />
          {t('admin.bannerAdd')}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-xl border border-border bg-card p-4 sm:p-6"
        >
          <h3 className="font-semibold text-foreground">
            {editingId ? t('admin.bannerEdit') : t('admin.bannerAdd')}
          </h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="mb-1 block text-sm font-medium">{t('admin.bannerName')} *</span>
              <input
                className={fieldClass}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder={t('admin.bannerNamePlaceholder')}
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium">{t('admin.bannerDisplayTitle')}</span>
              <input
                className={fieldClass}
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium">{t('admin.bannerSubtitle')}</span>
              <input
                className={fieldClass}
                value={form.subtitle}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium">{t('admin.bannerPlacement')} *</span>
              <select
                className={fieldClass}
                value={form.placement}
                onChange={(e) => setForm({ ...form, placement: e.target.value as BannerPlacement })}
              >
                {BANNER_PLACEMENTS.map((p) => (
                  <option key={p} value={p}>
                    {t(`admin.bannerPlacement.${p}`)}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium">{t('admin.bannerSize')} *</span>
              <select
                className={fieldClass}
                value={form.size}
                onChange={(e) => setForm({ ...form, size: e.target.value as BannerSize })}
              >
                {BANNER_SIZES.map((s) => (
                  <option key={s} value={s}>
                    {t(`admin.bannerSize.${s}`)}
                  </option>
                ))}
              </select>
            </label>

            <label className="block sm:col-span-2">
              <span className="mb-1 block text-sm font-medium">{t('admin.bannerMediaType')} *</span>
              <div className="flex flex-wrap gap-2">
                {BANNER_MEDIA_TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setForm({ ...form, mediaType: type as BannerMediaType })}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                      form.mediaType === type
                        ? 'bg-primary text-primary-foreground'
                        : 'border border-border bg-background text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {t(`admin.bannerMedia.${type}`)}
                  </button>
                ))}
              </div>
            </label>

            {form.mediaType === 'image' && (
              <div className="block sm:col-span-2">
                <span className="mb-1 block text-sm font-medium">{t('admin.bannerImage')}</span>
                <div className="flex flex-wrap items-center gap-3">
                  <input
                    ref={imageRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e.target.files?.[0] ?? null)}
                  />
                  <button
                    type="button"
                    onClick={() => imageRef.current?.click()}
                    disabled={uploading}
                    className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm hover:bg-secondary"
                  >
                    <ImageIcon className="h-4 w-4" />
                    {uploading ? t('auth.loading') : t('admin.bannerUploadImage')}
                  </button>
                  {form.imageUrl && (
                    <div className="relative h-16 w-28 overflow-hidden rounded-lg border border-border">
                      <Image src={form.imageUrl} alt="" fill className="object-cover" />
                    </div>
                  )}
                </div>
              </div>
            )}

            {form.mediaType === 'video' && (
              <div className="block sm:col-span-2">
                <span className="mb-1 block text-sm font-medium">{t('admin.bannerVideo')}</span>
                <div className="flex flex-wrap items-center gap-3">
                  <input
                    ref={videoRef}
                    type="file"
                    accept="video/mp4,video/webm,video/quicktime"
                    className="hidden"
                    onChange={(e) => handleVideoUpload(e.target.files?.[0] ?? null)}
                  />
                  <button
                    type="button"
                    onClick={() => videoRef.current?.click()}
                    disabled={uploading}
                    className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm hover:bg-secondary"
                  >
                    <Video className="h-4 w-4" />
                    {uploading ? t('auth.loading') : t('admin.bannerUploadVideo')}
                  </button>
                  {form.videoUrl && (
                    <video src={form.videoUrl} className="h-20 max-w-[200px] rounded-lg" muted playsInline />
                  )}
                </div>
              </div>
            )}

            {form.mediaType === 'slideshow' && (
              <div className="block sm:col-span-2">
                <span className="mb-1 block text-sm font-medium">{t('admin.bannerSlides')}</span>
                <input
                  ref={slideRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="hidden"
                  onChange={(e) => handleSlideUpload(e.target.files?.[0] ?? null)}
                />
                <button
                  type="button"
                  onClick={() => slideRef.current?.click()}
                  disabled={uploading}
                  className="mb-3 inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm hover:bg-secondary"
                >
                  <Plus className="h-4 w-4" />
                  {t('admin.bannerAddSlide')}
                </button>
                <div className="flex flex-wrap gap-2">
                  {(form.slideUrls ?? []).map((url, i) => (
                    <div key={url} className="relative h-16 w-24 overflow-hidden rounded-lg border border-border">
                      <Image src={url} alt="" fill className="object-cover" />
                      <button
                        type="button"
                        onClick={() =>
                          setForm({
                            ...form,
                            slideUrls: form.slideUrls?.filter((_, idx) => idx !== i),
                          })
                        }
                        className="absolute right-0 top-0 bg-destructive/90 p-0.5 text-white"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <label className="block">
              <span className="mb-1 block text-sm font-medium">{t('admin.adLinkUrl')}</span>
              <input
                className={fieldClass}
                value={form.linkUrl}
                onChange={(e) => setForm({ ...form, linkUrl: e.target.value })}
                placeholder="https://"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium">{t('admin.bannerLinkLabel')}</span>
              <input
                className={fieldClass}
                value={form.linkLabel}
                onChange={(e) => setForm({ ...form, linkLabel: e.target.value })}
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium">{t('admin.bannerAltText')}</span>
              <input
                className={fieldClass}
                value={form.altText}
                onChange={(e) => setForm({ ...form, altText: e.target.value })}
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium">{t('admin.bannerBgColor')}</span>
              <input
                className={fieldClass}
                value={form.backgroundColor}
                onChange={(e) => setForm({ ...form, backgroundColor: e.target.value })}
                placeholder="#000000"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium">{t('admin.bannerStartsAt')}</span>
              <input
                type="datetime-local"
                className={fieldClass}
                value={form.startsAt}
                onChange={(e) => setForm({ ...form, startsAt: e.target.value })}
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium">{t('admin.bannerExpiresAt')}</span>
              <input
                type="datetime-local"
                className={fieldClass}
                value={form.expiresAt}
                onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
              />
              <button
                type="button"
                className="mt-2 text-xs font-medium text-primary hover:underline"
                onClick={() => {
                  const d = new Date()
                  d.setMonth(d.getMonth() + 1)
                  setForm({ ...form, expiresAt: toLocalDatetime(d.toISOString()) })
                }}
              >
                {t('admin.bannerPreset1Month')}
              </button>
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium">{t('admin.adSortOrder')}</span>
              <input
                type="number"
                className={fieldClass}
                value={form.sortOrder}
                onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) || 0 })}
              />
            </label>

            <label className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm({ ...form, active: e.target.checked })}
                className="h-4 w-4 rounded border-input"
              />
              <span className="text-sm">{t('admin.adActive')}</span>
            </label>

            <label className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                checked={form.openInNewTab}
                onChange={(e) => setForm({ ...form, openInNewTab: e.target.checked })}
                className="h-4 w-4 rounded border-input"
              />
              <span className="text-sm">{t('admin.bannerNewTab')}</span>
            </label>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              disabled={saving || uploading}
              className="btn-primary rounded-xl px-4 py-2 text-sm disabled:opacity-50"
            >
              {saving ? t('auth.loading') : t('profile.settings.save')}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-secondary"
            >
              {t('admin.adCancel')}
            </button>
          </div>
        </form>
      )}

      {banners.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border px-6 py-10 text-center text-muted-foreground">
          {t('admin.bannerEmpty')}
        </p>
      ) : (
        <div className="space-y-3">
          {banners.map((banner) => {
            const scheduled = isBannerScheduleActive(banner)
            return (
              <div
                key={banner.id}
                className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-foreground">{banner.name}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {t(`admin.bannerPlacement.${banner.placement}`)} ·{' '}
                    {t(`admin.bannerSize.${banner.size}`)} ·{' '}
                    {t(`admin.bannerMedia.${banner.mediaType}`)}
                  </p>
                  {banner.expiresAt && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {t('admin.bannerUntil')}: {new Date(banner.expiresAt).toLocaleString('ka-GE')}
                    </p>
                  )}
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        banner.active && scheduled
                          ? 'bg-primary/10 text-primary'
                          : 'bg-secondary text-muted-foreground'
                      }`}
                    >
                      {banner.active
                        ? scheduled
                          ? t('admin.adActive')
                          : t('admin.bannerScheduled')
                        : t('admin.adInactive')}
                    </span>
                  </div>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => toggleActive(banner)}
                    className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-secondary"
                  >
                    {banner.active ? t('admin.adDeactivate') : t('admin.adActivate')}
                  </button>
                  <button
                    type="button"
                    onClick={() => openEdit(banner)}
                    className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-secondary"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    {t('profile.edit')}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(banner.id)}
                    className="inline-flex items-center gap-1 rounded-lg border border-destructive/30 px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
