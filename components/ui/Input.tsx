import { forwardRef, type InputHTMLAttributes } from 'react'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <label className="block">
        {label && (
          <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`input-premium ${error ? 'border-destructive ring-destructive/20' : ''} ${className}`}
          {...props}
        />
        {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}
      </label>
    )
  }
)

Input.displayName = 'Input'

export default Input
