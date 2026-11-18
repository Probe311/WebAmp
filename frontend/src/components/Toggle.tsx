import React from 'react'
import { LucideIcon } from 'lucide-react'

// Nouvelle interface (recommandée)
interface TogglePropsNew {
  checked: boolean
  onChange: (checked: boolean) => void
  labelLeft?: string
  labelRight?: string
  disabled?: boolean
  className?: string
  mode?: 'onoff' | 'choice' // Mode explicite, sinon détection automatique
}

// Ancienne interface (rétrocompatibilité)
interface TogglePropsLegacy {
  options: string[]
  value: string
  onChange: (value: string) => void
  label?: string
  icons?: [LucideIcon?, LucideIcon?]
  disabled?: boolean
  className?: string
  mode?: 'onoff' | 'choice' // Mode explicite, sinon détection automatique
}

type ToggleProps = TogglePropsNew | TogglePropsLegacy

/**
 * Interrupteur à deux positions.
 *
 * Les couleurs viennent des tokens (`--td-success`, `--td-danger`, `--td-primary`)
 * donc le thème sombre suit la classe `dark` sans relecture du DOM.
 */
const Toggle: React.FC<ToggleProps> = (props) => {
  // Détection de l'interface utilisée
  const isLegacyInterface = 'options' in props && 'value' in props

  // Variables pour la nouvelle interface
  let checked: boolean
  let labelLeft: string | undefined
  let labelRight: string | undefined
  let onChange: (checked: boolean) => void
  let disabled: boolean
  let className: string
  let mode: 'onoff' | 'choice' | undefined

  if (isLegacyInterface) {
    // Conversion de l'ancienne interface vers la nouvelle
    const legacyProps = props as TogglePropsLegacy
    if (legacyProps.options.length !== 2) {
      return null
    }
    const [leftOption, rightOption] = legacyProps.options
    checked = legacyProps.value.toLowerCase() === rightOption.toLowerCase()
    labelLeft = leftOption
    labelRight = rightOption
    onChange = (newChecked: boolean) => {
      legacyProps.onChange(newChecked ? rightOption : leftOption)
    }
    disabled = legacyProps.disabled || false
    className = legacyProps.className || ''
    mode = legacyProps.mode || undefined // Pas de mode par défaut, on détectera automatiquement
  } else {
    // Nouvelle interface
    const newProps = props as TogglePropsNew
    checked = newProps.checked
    labelLeft = newProps.labelLeft
    labelRight = newProps.labelRight
    onChange = newProps.onChange
    disabled = newProps.disabled || false
    className = newProps.className || ''
    mode = newProps.mode || undefined // Pas de mode par défaut, on détectera automatiquement
  }

  // Détection automatique du mode si non spécifié
  if (!mode) {
    const isOnOff =
      (labelLeft?.toLowerCase() === 'off' && labelRight?.toLowerCase() === 'on') ||
      (labelLeft?.toLowerCase() === 'on' && labelRight?.toLowerCase() === 'off')
    mode = isOnOff ? 'onoff' : 'choice'
  }

  const isOnOffMode = mode === 'onoff'

  // Tokens : le track s'enfonce, le pouce reste en relief.
  const trackBackground = isOnOffMode
    ? checked
      ? 'var(--td-success-surface)'
      : 'var(--td-danger-surface)'
    : 'var(--td-surface-selected)'

  const thumbBackground = isOnOffMode
    ? checked
      ? 'var(--td-success)'
      : 'var(--td-danger)'
    : 'var(--td-primary)'

  const activeLabelColor = isOnOffMode ? undefined : 'var(--td-primary)'

  const handleToggle = () => {
    if (!disabled) {
      onChange(!checked)
    }
  }

  const labelClass = `text-xs font-semibold uppercase tracking-wider transition-colors duration-[var(--td-duration-base)] cursor-pointer select-none ${
    disabled ? 'cursor-not-allowed opacity-50' : ''
  }`

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Label gauche */}
      {labelLeft && (
        <label
          className={`${labelClass} ${!disabled ? '' : ''}`}
          style={{
            color: isOnOffMode
              ? checked
                ? 'var(--td-text-muted)'
                : 'var(--td-danger)'
              : activeLabelColor
          }}
          onClick={!disabled ? handleToggle : undefined}
        >
          <span className="toggle-left">{labelLeft}</span>
        </label>
      )}

      {/* Toggle switch */}
      <button
        onClick={handleToggle}
        disabled={disabled}
        className={`
          relative h-5 w-10 overflow-hidden rounded-[var(--td-radius-pill)]
          transition-transform duration-[var(--td-duration-slow)] ease-[var(--td-ease-spring)]
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--td-focus)] focus-visible:ring-offset-2
          touch-manipulation
          ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer enabled:hover:scale-105'}
        `}
        style={{
          background: trackBackground,
          boxShadow: 'var(--td-control-shadow-pressed)'
        }}
        aria-pressed={checked}
        aria-disabled={disabled}
        role="switch"
      >
        {/* Slider (thumb) */}
        <div
          className="absolute top-0.5 z-10 h-4 w-4 rounded-full transition-[left] duration-[var(--td-duration-slow)] ease-[var(--td-ease-spring)]"
          style={{
            left: checked ? 'calc(100% - 16px - 2px)' : '2px',
            background: thumbBackground,
            boxShadow: 'var(--td-control-shadow)'
          }}
        />
      </button>

      {/* Label droit */}
      {labelRight && (
        <label
          className={labelClass}
          style={{
            color: isOnOffMode
              ? checked
                ? 'var(--td-success)'
                : 'var(--td-text-muted)'
              : activeLabelColor
          }}
          onClick={!disabled ? handleToggle : undefined}
        >
          <span className="toggle-right">{labelRight}</span>
        </label>
      )}
    </div>
  )
}

export default Toggle
export { Toggle }
