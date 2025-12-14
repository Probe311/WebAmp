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

const Toggle: React.FC<ToggleProps> = (props) => {
  const isDark = document.documentElement.classList.contains('dark')
  
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
      console.warn('Toggle component expects exactly 2 options')
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
    const isOnOff = (
      (labelLeft?.toLowerCase() === 'off' && labelRight?.toLowerCase() === 'on') ||
      (labelLeft?.toLowerCase() === 'on' && labelRight?.toLowerCase() === 'off')
    )
    mode = isOnOff ? 'onoff' : 'choice'
  }
  
  // Couleurs selon le mode et l'état
  const isOnOffMode = mode === 'onoff'
  
  // Ombres neumorphic pour le track
  const trackShadow = isOnOffMode
    ? (isDark
        ? 'inset 2px 2px 4px rgba(0, 0, 0, 0.5), inset -2px -2px 4px rgba(60, 60, 60, 0.5)'
        : 'inset 2px 2px 4px rgba(0, 0, 0, 0.1), inset -2px -2px 4px rgba(255, 255, 255, 0.9)')
    : 'inset 2px 2px 4px rgba(0, 0, 0, 0.5), inset -2px -2px 4px rgba(60, 60, 60, 0.5)' // Mode choice avec ombres spécifiques
  
  // Ombres neumorphic pour le thumb (slider)
  const thumbShadow = isDark
    ? '2px 2px 4px rgba(0, 0, 0, 0.5), -2px -2px 4px rgba(60, 60, 60, 0.5)'
    : '2px 2px 4px rgba(0, 0, 0, 0.08), -2px -2px 4px rgba(255, 255, 255, 0.9)'
  
  // Pour le mode on/off : tout le track change de couleur
  // Pour le mode choice : background orange avec ombres
  const trackBackground = isOnOffMode
    ? (checked
        ? (isDark ? 'rgba(249, 115, 22, 0.3)' : 'rgba(249, 115, 22, 0.2)') // Orange pour actif
        : (isDark ? '#374151' : '#f5f5f5')) // Gris pour désactivé
    : 'rgba(249, 115, 22, 0.3)' // Orange pour mode choice
  
  // Couleur du thumb selon le mode
  const thumbBackground = isOnOffMode
    ? (checked
        ? (isDark ? 'rgba(249, 115, 22, 0.9)' : '#f97316') // Orange pour actif en mode on/off
        : (isDark ? '#6b7280' : '#9ca3af')) // Gris pour désactivé en mode on/off
    : (isDark ? 'rgba(249, 115, 22, 0.9)' : '#f97316') // Toujours orange en mode choice
  
  // Couleur du label actif (orange pour mode choice)
  const activeLabelColor = isOnOffMode
    ? undefined // Pas de couleur spéciale pour les labels en mode on/off
    : (isDark ? 'rgba(249, 115, 22, 0.9)' : '#f97316') // Orange pour le label actif en mode choice

  const handleToggle = () => {
    if (!disabled) {
      onChange(!checked)
    }
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Label gauche */}
      {labelLeft && (
        <label 
          className={`text-xs font-semibold uppercase tracking-wider transition-colors duration-200 cursor-pointer select-none shadow-none ${
            isOnOffMode
              ? (checked ? 'text-black/50 dark:text-white/50' : 'text-black/70 dark:text-white/70')
              : (checked ? 'text-black/70 dark:text-white/70' : '')
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          style={{ 
            boxShadow: 'none',
            color: !isOnOffMode && !checked && activeLabelColor ? activeLabelColor : undefined
          }}
          onClick={!disabled ? handleToggle : undefined}
        >
          <span className="toggle-left" style={{ boxShadow: 'none' }}>{labelLeft}</span>
        </label>
      )}
      
      {/* Toggle switch */}
      <button
        onClick={handleToggle}
        disabled={disabled}
        className={`
          relative w-10 h-5 rounded-full transition-all duration-300 ease-in-out 
          focus:outline-none touch-manipulation overflow-hidden
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${!disabled ? 'hover:scale-105' : ''}
        `}
        style={{
          background: trackBackground,
          boxShadow: trackShadow
        }}
        aria-pressed={checked}
        aria-disabled={disabled}
        role="switch"
      >
        {/* Slider (thumb) */}
        <div
          className="absolute top-0.5 w-4 h-4 rounded-full transition-all duration-300 ease-in-out z-10"
          style={{
            left: checked ? 'calc(100% - 16px - 2px)' : '2px',
            background: thumbBackground,
            boxShadow: thumbShadow
          }}
        />
      </button>
      
      {/* Label droit */}
      {labelRight && (
        <label 
          className={`text-xs font-semibold uppercase tracking-wider transition-colors duration-200 cursor-pointer select-none shadow-none ${
            isOnOffMode
              ? (checked ? 'text-black/70 dark:text-white/70' : 'text-black/50 dark:text-white/50')
              : (checked ? '' : 'text-black/70 dark:text-white/70')
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          style={{ 
            boxShadow: 'none',
            color: !isOnOffMode && checked && activeLabelColor ? activeLabelColor : undefined
          }}
          onClick={!disabled ? handleToggle : undefined}
        >
          <span className="toggle-right" style={{ boxShadow: 'none' }}>{labelRight}</span>
        </label>
      )}
    </div>
  )
}

export default Toggle
export { Toggle }
