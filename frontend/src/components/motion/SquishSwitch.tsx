import { usePrefersReducedMotion } from './usePrefersReducedMotion'

interface SquishSwitchProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}

export function SquishSwitch({ label, checked, onChange }: SquishSwitchProps) {
  const reduced = usePrefersReducedMotion()

  return (
    <div className="flex items-center justify-center gap-1">
      {label ? (
        <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--td-text-muted)]">
          {label}
        </span>
      ) : null}

      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`
          relative h-6 w-11 touch-manipulation rounded-[var(--td-radius-pill)]
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--td-focus)] focus-visible:ring-offset-2
          ${checked ? 'bg-[var(--td-accent-strong)]' : 'bg-[var(--td-surface-inset)]'}
          ${reduced ? '' : 'transition-colors duration-[var(--td-duration-slow)]'}
        `}
        style={{
          boxShadow: checked ? 'var(--td-elevation-inset-sm)' : 'var(--td-control-shadow-pressed)'
        }}
        aria-pressed={checked}
        aria-label={label || (checked ? 'Activé' : 'Désactivé')}
      >
        <span
          className={`
            absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-[var(--td-surface-elevated)]
            ${reduced ? '' : 'transition-transform duration-[var(--td-duration-slow)] ease-[var(--td-ease-spring)]'}
            ${checked ? 'translate-x-5 scale-x-110' : 'translate-x-0 scale-x-100'}
            active:scale-x-125
          `}
          style={{
            boxShadow: 'var(--td-elevation-1)'
          }}
        />
      </button>
    </div>
  )
}
