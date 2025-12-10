import { evaluatePasswordStrength } from '../utils/passwordStrength'

interface Props {
  password: string
  className?: string
  showRecommendations?: boolean
}

export function PasswordStrengthMeter({ password, className, showRecommendations = true }: Props) {
  const strength = evaluatePasswordStrength(password)
  const width = password ? Math.max(8, strength.score) : 0

  const getBarColor = () => {
    if (strength.score > 90) return 'rgba(34, 197, 94, 0.8)'
    if (strength.score >= 80) return 'rgba(234, 179, 8, 0.8)'
    if (strength.score >= 70) return 'rgba(249, 115, 22, 0.8)'
    return 'rgba(239, 68, 68, 0.8)'
  }

  const getTextColor = () => {
    if (strength.score > 90) return 'rgba(34, 197, 94, 0.9)'
    if (strength.score >= 80) return 'rgba(234, 179, 8, 0.9)'
    if (strength.score >= 70) return 'rgba(249, 115, 22, 0.9)'
    return 'rgba(239, 68, 68, 0.9)'
  }

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-2">
        <span 
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: 'rgba(0, 0, 0, 0.7)', letterSpacing: '0.5px' }}
        >
          Force du mot de passe
        </span>
        <span 
          className="text-xs font-bold uppercase"
          style={{ color: getTextColor() }}
        >
          {strength.label}
        </span>
      </div>
      <div 
        className="h-2 w-full rounded-full overflow-hidden"
        style={{
          boxShadow: 'inset 2px 2px 4px rgba(0, 0, 0, 0.05), inset -2px -2px 4px rgba(255, 255, 255, 0.8)',
          backgroundColor: '#EBECF0'
        }}
      >
        <div
          className="h-full transition-all duration-300 ease-out rounded-full"
          style={{ 
            width: `${width}%`,
            backgroundColor: getBarColor(),
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
          }}
        />
      </div>
      {showRecommendations && strength.recommendations.length > 0 && (
        <ul className="mt-3 text-xs space-y-1.5">
          {strength.recommendations.map((tip) => (
            <li key={tip} className="flex items-center gap-2">
              <span 
                className="inline-block h-1.5 w-1.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
              />
              <span style={{ color: 'rgba(0, 0, 0, 0.6)' }}>
                {tip}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

