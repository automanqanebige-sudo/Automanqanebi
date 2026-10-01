'use client'

import { useEffect, useState } from 'react'
import { Save } from 'lucide-react'
import { HERO_VARIANTS } from '@/data/hero-backgrounds'
import { useLanguage } from '@/context/LanguageContext'
import { useSiteSettings } from '@/context/SiteSettingsContext'
import { saveSiteSettings } from '@/lib/site-settings-firestore'
import type { SiteSettings } from '@/types/site-settings'

export default function AdminSiteSettingsPanel() {
  const { t, language } = useLanguage()
  const { settings, refresh } = useSiteSettings()
  const [form, setForm] = useState<SiteSettings>(settings)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setForm(settings)
  }, [settings])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSaved(false)
    try {
      await saveSiteSettings(form)
      await refresh()
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch {
      setError(t('admin.settingsError'))
    } finally {
      setSaving(false)
    }
  }

  const label = (v: (typeof HERO_VARIANTS)[0]) =>
    language === 'ka' ? v.nameKa : v.nameEn

  return (
    <form onSubmit={handleSave} className="max-w-2xl space-y-6">
      <p className="text-sm text-muted-foreground">{t('admin.settingsHint')}</p>

      <section className="space-y-3 rounded-xl border border-border bg-card p-4">
        <h3 className="font-semibold text-foreground">{t('admin.settingsContact')}</h3>
        <label className="block">
          <span className="mb-1 block text-sm">{t('footer.contact')} — Email</span>
          <input
            value={form.contactEmail}
            onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm">{t('footer.contact')} — {t('services.formPhone')}</span>
          <input
            value={form.contactPhone}
            onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
          />
        </label>
      </section>

      <section className="space-y-3 rounded-xl border border-border bg-card p-4">
        <h3 className="font-semibold text-foreground">{t('admin.settingsSocial')}</h3>
        {(['facebookUrl', 'instagramUrl', 'youtubeUrl'] as const).map((key) => (
          <label key={key} className="block">
            <span className="mb-1 block text-sm capitalize">{key.replace('Url', '')}</span>
            <input
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              placeholder="https://"
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            />
          </label>
        ))}
      </section>

      <section className="space-y-3 rounded-xl border border-border bg-card p-4">
        <h3 className="font-semibold text-foreground">{t('admin.settingsHero')}</h3>
        <select
          value={form.heroVariantId}
          onChange={(e) => setForm({ ...form, heroVariantId: e.target.value })}
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
        >
          {HERO_VARIANTS.map((v) => (
            <option key={v.id} value={v.id}>
              {v.id} — {label(v)}
            </option>
          ))}
        </select>
      </section>

      <section className="space-y-3 rounded-xl border border-border bg-card p-4">
        <h3 className="font-semibold text-foreground">{t('admin.settingsMaintenance')}</h3>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.maintenanceMode}
            onChange={(e) => setForm({ ...form, maintenanceMode: e.target.checked })}
            className="rounded border-input"
          />
          <span className="text-sm">{t('admin.settingsMaintenanceOn')}</span>
        </label>
        <label className="block">
          <span className="mb-1 block text-sm">ქართული</span>
          <textarea
            value={form.maintenanceMessageKa}
            onChange={(e) => setForm({ ...form, maintenanceMessageKa: e.target.value })}
            rows={2}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm">English</span>
          <textarea
            value={form.maintenanceMessageEn}
            onChange={(e) => setForm({ ...form, maintenanceMessageEn: e.target.value })}
            rows={2}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm">Русский</span>
          <textarea
            value={form.maintenanceMessageRu}
            onChange={(e) => setForm({ ...form, maintenanceMessageRu: e.target.value })}
            rows={2}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
          />
        </label>
      </section>

      {error && <p className="text-sm text-destructive">{error}</p>}
      {saved && <p className="text-sm font-medium text-primary">{t('admin.settingsSaved')}</p>}

      <button
        type="submit"
        disabled={saving}
        className="btn-primary inline-flex rounded-xl px-5 py-2.5 text-sm disabled:opacity-60"
      >
        <Save className="h-4 w-4" />
        {saving ? t('services.formSaving') : t('services.formSave')}
      </button>
    </form>
  )
}
