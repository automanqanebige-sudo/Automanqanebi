'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { AlertCircle, CheckCircle2, Hash, Loader2, Search } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { isValidVinFormat, normalizeVin, type VinDecodeResult } from '@/lib/vin'

type VinCheckerProps = {
  compact?: boolean
  showServicesLink?: boolean
  className?: string
}

export default function VinChecker({
  compact = false,
  showServicesLink = true,
  className = '',
}: VinCheckerProps) {
  const { t } = useLanguage()
  const [vin, setVin] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<VinDecodeResult | null>(null)
  const [clientError, setClientError] = useState('')

  const handleCheck = async (e?: FormEvent) => {
    e?.preventDefault()
    setClientError('')
    setResult(null)

    const normalized = normalizeVin(vin)
    setVin(normalized)

    if (!isValidVinFormat(normalized)) {
      setClientError(t('vin.invalidFormat'))
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/vin/${encodeURIComponent(normalized)}`)
      const data = (await res.json()) as VinDecodeResult

      if (!res.ok || !data.valid) {
        if (data.error === 'invalid_format') setClientError(t('vin.invalidFormat'))
        else if (data.error === 'not_found') setClientError(t('vin.notFound'))
        else setClientError(t('vin.error'))
        setResult(data)
        return
      }

      setResult(data)
    } catch {
      setClientError(t('vin.error'))
    } finally {
      setLoading(false)
    }
  }

  const detailRows = result?.valid
    ? [
        result.make && { label: t('vin.make'), value: result.make },
        result.model && { label: t('vin.model'), value: result.model },
        result.modelYear && { label: t('vin.year'), value: result.modelYear },
        result.bodyClass && { label: t('vin.body'), value: result.bodyClass },
        result.engineCylinders &&
          result.displacementL && {
            label: t('vin.engine'),
            value: `${result.displacementL}L · ${result.engineCylinders} ${t('vin.cylinders')}`,
          },
        result.fuelType && { label: t('vin.fuel'), value: result.fuelType },
        result.driveType && { label: t('vin.drive'), value: result.driveType },
        result.plantCountry && { label: t('vin.country'), value: result.plantCountry },
      ].filter(Boolean) as { label: string; value: string }[]
    : []

  return (
    <div
      className={`rounded-2xl border border-border bg-card shadow-sm ${
        compact ? 'p-4 sm:p-5' : 'p-5 sm:p-6'
      } ${className}`}
    >
      <div className="mb-4 flex items-start gap-3">
        <div className="rounded-xl bg-primary/10 p-2.5">
          <Hash className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className={`font-bold text-foreground ${compact ? 'text-base' : 'text-lg'}`}>
            {t('vin.title')}
          </h2>
          <p className="mt-0.5 text-sm text-muted-foreground">{t('vin.subtitle')}</p>
        </div>
      </div>

      <form onSubmit={handleCheck} className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={vin}
          onChange={(e) => {
            setVin(e.target.value.toUpperCase())
            setClientError('')
            setResult(null)
          }}
          maxLength={17}
          placeholder={t('vin.placeholder')}
          className="flex-1 rounded-xl border border-input bg-background px-4 py-3 font-mono text-sm uppercase tracking-wider text-foreground outline-none transition-all focus:ring-2 focus:ring-primary"
          aria-label={t('vin.placeholder')}
        />
        <button
          type="submit"
          disabled={loading || vin.trim().length === 0}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {t('vin.checking')}
            </>
          ) : (
            <>
              <Search className="h-4 w-4" />
              {t('vin.check')}
            </>
          )}
        </button>
      </form>

      {clientError && (
        <div className="mt-4 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {clientError}
        </div>
      )}

      {result?.valid && (
        <div className="mt-4 overflow-hidden rounded-xl border border-primary/25 bg-primary/5">
          <div className="flex items-center gap-2 border-b border-primary/15 px-4 py-3">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">{t('vin.valid')}</span>
            <span className="ml-auto font-mono text-xs text-muted-foreground">{result.vin}</span>
          </div>
          {detailRows.length > 0 && (
            <dl className="grid gap-3 p-4 sm:grid-cols-2">
              {detailRows.map((row) => (
                <div key={row.label}>
                  <dt className="text-xs text-muted-foreground">{row.label}</dt>
                  <dd className="text-sm font-medium text-foreground">{row.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      )}

      {showServicesLink && (
        <p className="mt-4 text-xs text-muted-foreground">
          {t('vin.servicesHint')}{' '}
          <Link
            href="/services?q=VIN&category=registration"
            className="font-medium text-primary hover:underline"
          >
            {t('vin.findServices')}
          </Link>
        </p>
      )}
    </div>
  )
}
