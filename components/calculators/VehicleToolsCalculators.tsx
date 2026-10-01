'use client'

import { useMemo, useState } from 'react'
import { Calculator } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import {
  estimateBankInstallment,
  estimateGeorgianCustoms,
  estimatePawnLoan,
} from '@/data/customs-rates-ge'

type VehicleToolsCalculatorsProps = {
  defaultYear?: number
  defaultEngineCc?: number
  defaultPrice?: number
  fuelType?: string
}

export default function VehicleToolsCalculators({
  defaultYear,
  defaultEngineCc,
  defaultPrice,
  fuelType,
}: VehicleToolsCalculatorsProps) {
  const { t } = useLanguage()
  const [tab, setTab] = useState<'customs' | 'loan' | 'pawn'>('customs')

  const [year, setYear] = useState(String(defaultYear ?? new Date().getFullYear() - 5))
  const [engineCc, setEngineCc] = useState(String(defaultEngineCc ?? 2000))
  const [price, setPrice] = useState(String(defaultPrice ?? 15000))
  const [downPct, setDownPct] = useState('20')
  const [months, setMonths] = useState('36')
  const [rate, setRate] = useState('14')
  const [appraisalPct, setAppraisalPct] = useState('60')
  const [pawnRate, setPawnRate] = useState('4')
  const [pawnMonths, setPawnMonths] = useState('6')

  const customs = useMemo(
    () =>
      estimateGeorgianCustoms({
        year: Number(year) || new Date().getFullYear(),
        engineCc: Number(engineCc) || 0,
        fuelType,
      }),
    [year, engineCc, fuelType]
  )

  const loan = useMemo(
    () =>
      estimateBankInstallment({
        price: Number(price) || 0,
        downPaymentPercent: Number(downPct) || 0,
        months: Number(months) || 1,
        annualRatePercent: Number(rate) || 0,
      }),
    [price, downPct, months, rate]
  )

  const pawn = useMemo(
    () =>
      estimatePawnLoan({
        price: Number(price) || 0,
        appraisalPercent: Number(appraisalPct) || 0,
        monthlyRatePercent: Number(pawnRate) || 0,
        months: Number(pawnMonths) || 1,
      }),
    [price, appraisalPct, pawnRate, pawnMonths]
  )

  const field =
    'w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground'

  return (
    <section className="rounded-2xl border border-border bg-card p-4 sm:p-5">
      <h2 className="flex items-center gap-2 text-lg font-bold text-foreground">
        <Calculator className="h-5 w-5 text-primary" />
        {t('tools.calculatorsTitle')}
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">{t('tools.calculatorsSubtitle')}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {(['customs', 'loan', 'pawn'] as const).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
              tab === key
                ? 'bg-primary text-primary-foreground'
                : 'border border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            {t(`tools.tab.${key}`)}
          </button>
        ))}
      </div>

      {tab === 'customs' && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="mb-1 block text-muted-foreground">{t('car.year')}</span>
            <input className={field} value={year} onChange={(e) => setYear(e.target.value)} type="number" />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-muted-foreground">{t('tools.engineCc')}</span>
            <input
              className={field}
              value={engineCc}
              onChange={(e) => setEngineCc(e.target.value)}
              type="number"
            />
          </label>
          <div className="sm:col-span-2 rounded-xl bg-primary/5 p-4">
            <p className="text-sm text-muted-foreground">{t('tools.estimatedCustoms')}</p>
            <p className="mt-1 text-2xl font-bold text-foreground">
              ≈ {customs.estimatedGel.toLocaleString('ka-GE')} ₾
            </p>
            <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
              {customs.breakdown.map((row) => (
                <li key={row.label}>
                  {t(`tools.breakdown.${row.label}`)}: {row.amount.toLocaleString('ka-GE')} ₾
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-amber-700 dark:text-amber-400">{t('tools.customsDisclaimer')}</p>
          </div>
        </div>
      )}

      {tab === 'loan' && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="mb-1 block text-muted-foreground">{t('addCar.price')}</span>
            <input className={field} value={price} onChange={(e) => setPrice(e.target.value)} type="number" />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-muted-foreground">{t('tools.downPayment')}</span>
            <input className={field} value={downPct} onChange={(e) => setDownPct(e.target.value)} type="number" />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-muted-foreground">{t('tools.months')}</span>
            <input className={field} value={months} onChange={(e) => setMonths(e.target.value)} type="number" />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-muted-foreground">{t('tools.annualRate')}</span>
            <input className={field} value={rate} onChange={(e) => setRate(e.target.value)} type="number" />
          </label>
          <div className="sm:col-span-2 rounded-xl bg-sky-500/5 p-4">
            <p className="text-sm text-muted-foreground">{t('tools.monthlyPayment')}</p>
            <p className="mt-1 text-2xl font-bold text-foreground">
              ≈ {loan.monthly.toLocaleString('ka-GE')} ₾
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              {t('tools.totalPay')}: {loan.total.toLocaleString('ka-GE')} ₾ · {t('tools.interest')}:{' '}
              {loan.interest.toLocaleString('ka-GE')} ₾
            </p>
          </div>
        </div>
      )}

      {tab === 'pawn' && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="mb-1 block text-muted-foreground">{t('addCar.price')}</span>
            <input className={field} value={price} onChange={(e) => setPrice(e.target.value)} type="number" />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-muted-foreground">{t('tools.appraisalPct')}</span>
            <input
              className={field}
              value={appraisalPct}
              onChange={(e) => setAppraisalPct(e.target.value)}
              type="number"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-muted-foreground">{t('tools.pawnMonthlyRate')}</span>
            <input className={field} value={pawnRate} onChange={(e) => setPawnRate(e.target.value)} type="number" />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-muted-foreground">{t('tools.months')}</span>
            <input
              className={field}
              value={pawnMonths}
              onChange={(e) => setPawnMonths(e.target.value)}
              type="number"
            />
          </label>
          <div className="sm:col-span-2 rounded-xl bg-amber-500/5 p-4">
            <p className="text-sm text-muted-foreground">{t('tools.pawnLoan')}</p>
            <p className="mt-1 text-2xl font-bold text-foreground">
              ≈ {pawn.loanAmount.toLocaleString('ka-GE')} ₾
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              {t('tools.monthlyInterest')}: {pawn.monthlyInterest.toLocaleString('ka-GE')} ₾ ·{' '}
              {t('tools.totalRepay')}: {pawn.totalRepay.toLocaleString('ka-GE')} ₾
            </p>
          </div>
        </div>
      )}
    </section>
  )
}
