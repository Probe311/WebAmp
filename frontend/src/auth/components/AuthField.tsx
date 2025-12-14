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
        className="block text-xs font-semibold uppercase tracking-wider text-black/70 dark:text-white/70"
        style={{ letterSpacing: '0.5px' }}
      >
        {label}
      </label>
      <input
        {...inputProps}
        className={`w-full rounded-xl px-4 py-3 text-sm bg-white dark:bg-gray-700 text-black/85 dark:text-white/90 focus:outline-none transition-all ${className}`}
        style={{
          boxShadow: hasError
            ? document.documentElement.classList.contains('dark')
              ? 'inset 2px 2px 4px rgba(0, 0, 0, 0.5), inset -2px -2px 4px rgba(60, 60, 60, 0.5), 0 0 0 2px rgba(239, 68, 68, 0.3)'
              : 'inset 2px 2px 4px rgba(0, 0, 0, 0.05), inset -2px -2px 4px rgba(255, 255, 255, 0.8), 0 0 0 2px rgba(239, 68, 68, 0.3)'
            : document.documentElement.classList.contains('dark')
              ? 'inset 2px 2px 4px rgba(0, 0, 0, 0.5), inset -2px -2px 4px rgba(60, 60, 60, 0.5)'
              : 'inset 2px 2px 4px rgba(0, 0, 0, 0.05), inset -2px -2px 4px rgba(255, 255, 255, 0.8)'
        }}
        onFocus={(e) => {
          if (!hasError) {
            e.currentTarget.style.boxShadow = document.documentElement.classList.contains('dark')
              ? 'inset 3px 3px 6px rgba(0, 0, 0, 0.6), inset -3px -3px 6px rgba(70, 70, 70, 0.6)'
              : 'inset 3px 3px 6px rgba(0, 0, 0, 0.07), inset -3px -3px 6px rgba(255, 255, 255, 1)'
          }
        }}
        onBlur={(e) => {
          if (!hasError) {
            e.currentTarget.style.boxShadow = document.documentElement.classList.contains('dark')
              ? 'inset 2px 2px 4px rgba(0, 0, 0, 0.5), inset -2px -2px 4px rgba(60, 60, 60, 0.5)'
              : 'inset 2px 2px 4px rgba(0, 0, 0, 0.05), inset -2px -2px 4px rgba(255, 255, 255, 0.8)'
          }
        }}
      />
      {hint && !hasError && (
        <p className="text-xs text-black/50 dark:text-white/50">
          {hint}
        </p>
      )}
      {hasError && (
        <p className="text-xs font-medium text-red-500 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  )
}

