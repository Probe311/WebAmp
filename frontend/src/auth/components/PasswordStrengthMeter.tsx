import { evaluatePasswordStrength } from '../utils/passwordStrength'

interface Props {
  password: string
  className?: string
  showRecommendations?: boolean
}

export function PasswordStrengthMeter({ password, className, showRecommendations = true }: Props) {
  const strength = evaluatePasswordStrength(password)
  const width = password ? Math.max(8, strength.score) : 0

  /* Sémantique de force : danger → accent → avertissement → succès. */
  const color =
    strength.score > 90
      ? 'var(--td-success)'
      : strength.score >= 80
        ? 'var(--td-warning)'
        : strength.score >= 70
          ? 'var(--neu-accent)'
          : 'var(--td-danger)'

  return (
    <div className={className}>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-[0.5px] text-[color:var(--neu-text-muted)]">
          Force du mot de passe
        </span>
        <span className="text-xs font-bold uppercase" style={{ color }}>
          {strength.label}
        </span>
      </div>
      <div
        className="neu-inset h-2 w-full overflow-hidden rounded-full bg-[color:var(--neu-bg-track)]"
        role="progressbar"
        aria-valuenow={strength.score}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Force du mot de passe"
      >
        <div
          className="h-full rounded-full transition-all duration-300 ease-out"
          style={{ width: `${width}%`, backgroundColor: color }}
        />
      </div>
      {showRecommendations && strength.recommendations.length > 0 && (
        <ul className="mt-3 space-y-1.5 text-xs">
          {strength.recommendations.map((tip) => (
            <li key={tip} className="flex items-center gap-2">
              <span className="inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[color:var(--neu-text-faint)]" />
              <span className="text-[color:var(--neu-text-muted)]">{tip}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
