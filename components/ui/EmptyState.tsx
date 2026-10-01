import type { ReactNode } from 'react'
import Link from 'next/link'

type EmptyStateProps = {
  icon?: ReactNode
  title: string
  description?: string
  actionLabel?: string
  actionHref?: string
  onAction?: () => void
  className?: string
}

export default function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  className = '',
}: EmptyStateProps) {
  const action =
    actionLabel && actionHref ? (
      <Link href={actionHref} className="btn-primary mt-6 rounded-xl px-6 py-2.5">
        {actionLabel}
      </Link>
    ) : actionLabel && onAction ? (
      <button type="button" onClick={onAction} className="btn-primary mt-6 rounded-xl px-6 py-2.5">
        {actionLabel}
      </button>
    ) : null

  return (
    <div
      className={`rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center shadow-card ${className}`}
    >
      {icon && (
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      {description && <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{description}</p>}
      {action}
    </div>
  )
}
