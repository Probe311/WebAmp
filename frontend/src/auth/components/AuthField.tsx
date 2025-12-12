import { InputHTMLAttributes } from 'react'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
}

export function AuthField({ label, error, hint, className = '', ...inputProps }: Props) {
  const hasError = Boolean(error)

  return (
    <div className="space-y-1.5">
      <label 
        className="block text-xs font-semibold uppercase tracking-wider"
        style={{ color: 'rgba(0, 0, 0, 0.7)', letterSpacing: '0.5px' }}
      >
        {label}
      </label>
      <input
        {...inputProps}
        className={`w-full rounded-xl px-4 py-3 text-sm bg-white focus:outline-none transition-all ${className}`}
        style={{
          boxShadow: hasError
            ? 'inset 2px 2px 4px rgba(0, 0, 0, 0.05), inset -2px -2px 4px rgba(255, 255, 255, 0.8), 0 0 0 2px rgba(239, 68, 68, 0.3)'
            : 'inset 2px 2px 4px rgba(0, 0, 0, 0.05), inset -2px -2px 4px rgba(255, 255, 255, 0.8)',
          color: 'rgba(0, 0, 0, 0.85)'
        }}
        onFocus={(e) => {
          if (!hasError) {
            e.currentTarget.style.boxShadow = 'inset 3px 3px 6px rgba(0, 0, 0, 0.07), inset -3px -3px 6px rgba(255, 255, 255, 1)'
          }
        }}
        onBlur={(e) => {
          if (!hasError) {
            e.currentTarget.style.boxShadow = 'inset 2px 2px 4px rgba(0, 0, 0, 0.05), inset -2px -2px 4px rgba(255, 255, 255, 0.8)'
          }
        }}
      />
      {hint && !hasError && (
        <p className="text-xs" style={{ color: 'rgba(0, 0, 0, 0.5)' }}>
          {hint}
        </p>
      )}
      {hasError && (
        <p className="text-xs font-medium" style={{ color: 'rgba(239, 68, 68, 0.9)' }}>
          {error}
        </p>
      )}
    </div>
  )
}

