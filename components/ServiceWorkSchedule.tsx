'use client'

import { Clock } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { scheduleFor24Hours } from '@/lib/service-listing'
import type { DayKey, WorkSchedule } from '@/types/service'
import { WORK_DAY_KEYS } from '@/types/service'

type ServiceWorkScheduleProps = {
  value: WorkSchedule
  onChange: (schedule: WorkSchedule) => void
  open24Hours: boolean
  onOpen24HoursChange: (open24Hours: boolean) => void
  disabled?: boolean
}

function inputClass(disabled?: boolean) {
  return `rounded-lg border border-input bg-background px-2.5 py-2 text-sm text-foreground outline-none transition-all focus:ring-2 focus:ring-primary disabled:opacity-60 ${disabled ? '' : ''}`
}

export default function ServiceWorkSchedule({
  value,
  onChange,
  open24Hours,
  onOpen24HoursChange,
  disabled,
}: ServiceWorkScheduleProps) {
  const { t } = useLanguage()

  const updateDay = (day: DayKey, patch: Partial<WorkSchedule[DayKey]>) => {
    onChange({
      ...value,
      [day]: { ...value[day], ...patch },
    })
  }

  const handle24HoursToggle = (checked: boolean) => {
    onOpen24HoursChange(checked)
    if (checked) {
      onChange(scheduleFor24Hours())
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Clock className="h-4 w-4 text-primary" />
          {t('services.formWorkSchedule')}
        </div>
        <label
          className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
            open24Hours
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-border bg-background text-muted-foreground hover:bg-secondary'
          } ${disabled ? 'pointer-events-none opacity-60' : ''}`}
        >
          <input
            type="checkbox"
            checked={open24Hours}
            disabled={disabled}
            onChange={(e) => handle24HoursToggle(e.target.checked)}
            className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
          />
          {t('services.formOpen24Hours')}
        </label>
      </div>

      {open24Hours ? (
        <div className="rounded-xl border border-primary/25 bg-primary/5 px-4 py-3 text-sm font-semibold text-primary">
          {t('services.open24HoursLabel')}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border">
          <div className="hidden grid-cols-[1fr_auto_auto_auto] gap-3 border-b border-border bg-secondary/40 px-4 py-2 text-xs font-medium text-muted-foreground sm:grid">
            <span>{t('services.formScheduleDay')}</span>
            <span className="w-28 text-center">{t('services.formScheduleOpen')}</span>
            <span className="w-28 text-center">{t('services.formScheduleClose')}</span>
            <span className="w-20 text-center">{t('services.formScheduleClosed')}</span>
          </div>

          {WORK_DAY_KEYS.map((day) => {
            const row = value[day]
            return (
              <div
                key={day}
                className="grid gap-3 border-b border-border px-4 py-3 last:border-b-0 sm:grid-cols-[1fr_auto_auto_auto] sm:items-center"
              >
                <span className="text-sm font-medium text-foreground">
                  {t(`services.day.${day}`)}
                </span>

                <input
                  type="time"
                  value={row.open}
                  disabled={disabled || row.closed}
                  onChange={(e) => updateDay(day, { open: e.target.value })}
                  className={`${inputClass(disabled)} w-full sm:w-28`}
                />

                <input
                  type="time"
                  value={row.close}
                  disabled={disabled || row.closed}
                  onChange={(e) => updateDay(day, { close: e.target.value })}
                  className={`${inputClass(disabled)} w-full sm:w-28`}
                />

                <label className="flex items-center justify-start gap-2 text-sm text-muted-foreground sm:justify-center">
                  <input
                    type="checkbox"
                    checked={row.closed}
                    disabled={disabled}
                    onChange={(e) => updateDay(day, { closed: e.target.checked })}
                    className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                  />
                  <span className="sm:hidden">{t('services.formScheduleClosed')}</span>
                </label>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
