'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { Megaphone, Pencil, Plus, Trash2 } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/context/AuthContext'
import { SERVICE_CATEGORIES } from '@/types/service'
import type { ServiceCategoryAd, ServiceCategoryAdInput } from '@/types/service-category-ad'
import {
  createServiceCategoryAd,
  deleteServiceCategoryAd,
  updateServiceCategoryAd,
} from '@/lib/service-category-ads-firestore'
import { uploadServiceImage } from '@/lib/upload-service-image'

type AdminServiceAdsPanelProps = {
  ads: ServiceCategoryAd[]
  onChange: () => void
  categoryLabel: (cat: string) => string
}

const emptyForm = (): ServiceCategoryAdInput => ({
  name: '',
  category: 'all',
  location: '',
  phone: '',
  description: '',
  image: '',
  price: undefined,
  oldPrice: undefined,
  newPrice: undefined,
  promoUntil: '',
  linkUrl: '',
  active: true,
  sortOrder: 0,
})

function parseNum(value: string): number | undefined {
  const n = Number(value.trim())
  return value.trim() && Number.isFinite(n) && n >= 0 ? n : undefined
}

export default function AdminServiceAdsPanel({
  ads,
  onChange,
  categoryLabel,
}: AdminServiceAdsPanelProps) {
  const { t } = useLanguage()
  const { user } = useAuth()
  const fileRef = useRef<HTMLInputElement>(null)

  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<ServiceCategoryAdInput>(emptyForm())
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyForm())
    setError('')
    setShowForm(true)
  }

  const openEdit = (ad: ServiceCategoryAd) => {
    setEditingId(ad.id)
    setForm({
      name: ad.name,
      category: ad.category,
      location: ad.location,
      phone: ad.phone,
      description: ad.description ?? '',
      image: ad.image ?? '',
      price: ad.price,
      oldPrice: ad.oldPrice,
      newPrice: ad.newPrice,
      promoUntil: ad.promoUntil ?? '',
      linkUrl: ad.linkUrl ?? '',
      active: ad.active,
      sortOrder: ad.sortOrder,
    })
    setError('')
    setShowForm(true)
  }

  const handleImage = async (file: File | null) => {
    if (!file || !user) return
    setUploading(true)
    setError('')
    try {
      const url = await uploadServiceImage(file, user.uid)
      setForm((prev) => ({ ...prev, image: url }))
    } catch {
      setError(t('admin.adFormError'))
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.location.trim() || !form.phone.trim()) {
      setError(t('services.formRequired'))
      return
    }

    setSaving(true)
    setError('')
    try {
      const payload: ServiceCategoryAdInput = {
        ...form,
        name: form.name.trim(),
        location: form.location.trim(),
        phone: form.phone.trim(),
        description: form.description?.trim() || undefined,
        image: form.image?.trim() || undefined,
        promoUntil: form.promoUntil?.trim() || undefined,
        linkUrl: form.linkUrl?.trim() || undefined,
      }

      if (editingId) {
        await updateServiceCategoryAd(editingId, payload)
      } else {
        await createServiceCategoryAd(payload)
      }

      setShowForm(false)
      setEditingId(null)
      setForm(emptyForm())
      onChange()
    } catch {
      setError(t('admin.adFormError'))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm(t('profile.deleteConfirm'))) return
    await deleteServiceCategoryAd(id)
    onChange()
  }

  const toggleActive = async (ad: ServiceCategoryAd) => {
    await updateServiceCategoryAd(ad.id, { active: !ad.active })
    onChange()
  }

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">{t('admin.adSectionHint')}</p>
        <button
          type="button"
          onClick={openCreate}
          className="btn-primary inline-flex rounded-xl px-4 py-2 text-sm"
        >
          <Plus className="h-4 w-4" />
          {t('admin.adAdd')}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 space-y-4 rounded-xl border border-primary/20 bg-card p-4 sm:p-5"
        >
          <h3 className="flex items-center gap-2 font-semibold text-foreground">
            <Megaphone className="h-4 w-4 text-primary" />
            {editingId ? t('admin.adEdit') : t('admin.adAdd')}
          </h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="mb-1 block text-sm font-medium">{t('services.formName')}</span>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                required
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium">{t('services.formCategory')}</span>
              <select
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value as ServiceCategoryAdInput['category'] })
                }
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="all">{t('services.all')}</option>
                {SERVICE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {categoryLabel(cat)}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium">{t('admin.adSortOrder')}</span>
              <input
                type="number"
                value={form.sortOrder}
                onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) || 0 })}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium">{t('services.formLocation')}</span>
              <input
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                required
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium">{t('services.formPhone')}</span>
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                required
              />
            </label>

            <label className="block sm:col-span-2">
              <span className="mb-1 block text-sm font-medium">{t('services.formDescription')}</span>
              <textarea
                value={form.description ?? ''}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              />
            </label>

            <label className="block sm:col-span-2">
              <span className="mb-1 block text-sm font-medium">{t('admin.adLinkUrl')}</span>
              <input
                value={form.linkUrl ?? ''}
                onChange={(e) => setForm({ ...form, linkUrl: e.target.value })}
                placeholder="https://..."
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium">{t('services.formPrice')}</span>
              <input
                value={form.price ?? ''}
                onChange={(e) => setForm({ ...form, price: parseNum(e.target.value) })}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium">{t('services.formNewPrice')}</span>
              <input
                value={form.newPrice ?? ''}
                onChange={(e) => setForm({ ...form, newPrice: parseNum(e.target.value) })}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              />
            </label>

            <label className="block sm:col-span-2">
              <span className="mb-1 block text-sm font-medium">{t('services.formSectionPhoto')}</span>
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => handleImage(e.target.files?.[0] ?? null)}
              />
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="rounded-lg border border-border px-3 py-2 text-sm hover:bg-secondary"
                >
                  {uploading ? t('services.formSubmitting') : t('upload.clickOrDrop')}
                </button>
                {form.image && (
                  <div className="relative h-16 w-24 overflow-hidden rounded-lg border border-border">
                    <Image src={form.image} alt="" fill className="object-cover" sizes="96px" />
                  </div>
                )}
              </div>
            </label>

            <label className="flex items-center gap-2 sm:col-span-2">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm({ ...form, active: e.target.checked })}
                className="rounded border-input"
              />
              <span className="text-sm">{t('admin.adActive')}</span>
            </label>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              disabled={saving || uploading}
              className="btn-primary rounded-xl px-4 py-2 text-sm disabled:opacity-60"
            >
              {saving ? t('services.formSaving') : t('services.formSave')}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false)
                setEditingId(null)
              }}
              className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-secondary"
            >
              {t('admin.adCancel')}
            </button>
          </div>
        </form>
      )}

      {ads.length === 0 ? (
        <p className="text-muted-foreground">{t('admin.noAds')}</p>
      ) : (
        <ul className="space-y-3">
          {ads.map((ad) => (
            <li
              key={ad.id}
              className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-foreground">{ad.name}</p>
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    {ad.category === 'all' ? t('services.all') : categoryLabel(ad.category)}
                  </span>
                  {!ad.active && (
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                      {t('admin.adInactive')}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{ad.location}</p>
                <p className="text-xs text-muted-foreground">{ad.phone}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => toggleActive(ad)}
                  className="rounded-lg border border-border px-3 py-2 text-sm hover:bg-secondary"
                >
                  {ad.active ? t('admin.adDeactivate') : t('admin.adActivate')}
                </button>
                <button
                  type="button"
                  onClick={() => openEdit(ad)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-primary/30 px-3 py-2 text-sm text-primary hover:bg-primary/10"
                >
                  <Pencil className="h-4 w-4" />
                  {t('profile.edit')}
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(ad.id)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-destructive/30 px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                  {t('profile.delete')}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
