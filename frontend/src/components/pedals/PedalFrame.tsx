import { ReactNode, useMemo } from 'react'
import { Pedal, PedalSize, PedalProps } from '../Pedal'
import { PedalModel } from '../../data/pedals'

export interface PedalFrameProps extends Omit<PedalProps, 'brand' | 'model' | 'accentColor' | 'size'> {
  model: PedalModel
  size?: PedalSize
  layout?: 'default' | 'flex' | 'grid' | 'eq' | 'three-knobs' | 'four-knobs' | 'switch-selector-with-knobs' | 'l-grid-3x2' | 'gmajor2'
  children: ReactNode
}

// Fonction helper pour déterminer la taille de la pédale selon le nombre de contrôles
export function determinePedalSize(pedalModel: PedalModel): PedalSize {
  // Oceans 11 : taille XL forcée
  if (pedalModel.id === 'electro-harmonix-oceans-11') {
    return 'XL'
  }
  
  const paramCount = Object.keys(pedalModel.parameters).length
  
  const horizontalSliders = Object.values(pedalModel.parameters).filter(
    p => p.controlType === 'slider' && p.orientation === 'horizontal'
  ).length
  
  const switchSelectors = Object.values(pedalModel.parameters).filter(
    p => p.controlType === 'switch-selector'
  ).length
  
  // Compter les knobs uniquement
  const knobs = Object.values(pedalModel.parameters).filter(
    p => !p.controlType || p.controlType === 'knob'
  ).length
  
  // Détecter les switches verticaux et horizontaux qui nécessitent plus d'espace
  const switches = Object.values(pedalModel.parameters).filter(
    p => p.controlType === 'switch-vertical' || p.controlType === 'switch-horizontal'
  ).length
  
  // Les EQ doivent avoir une taille adaptée au nombre de bandes
  if (pedalModel.type === 'eq') {
    // Compter uniquement les bandes (exclure level)
    const eqBands = Object.entries(pedalModel.parameters).filter(
      ([name]) => name.toLowerCase() !== 'level'
    ).length
    const totalSliders = Object.values(pedalModel.parameters).filter(
      p => p.controlType === 'slider'
    ).length
    
    if (eqBands >= 10) return 'XXL'
    if (eqBands >= 7) return 'XL'
    if (eqBands >= 5) return 'L'
    // ParaEQ a 4 sliders (3 bandes + level), besoin de L pour tout afficher
    if (totalSliders >= 4) return 'L'
    return 'M' // Minimum M pour les EQ
  }
  
  // Si la pédale contient des switches, utiliser au minimum 'M' pour éviter le débordement
  if (switches > 0) {
    if (paramCount >= 5) return 'L'
    return 'M'
  }
  
  // Si la pédale contient des switch-selectors
  if (switchSelectors > 0) {
    if (switchSelectors >= 2) {
      // Plusieurs switch-selectors nécessitent plus d'espace
      if (knobs >= 3) return 'L'
      if (knobs >= 2) return 'L' // 2 knobs + 2 switch-selectors = L
      return 'M'
    }
    // Un seul switch-selector
    // Si le switch-selector a beaucoup de positions (6+), utiliser L
    const switchSelectorWithManyPositions = Object.values(pedalModel.parameters).some(
      p => p.controlType === 'switch-selector' && p.labels && p.labels.length >= 6
    )
    if (switchSelectorWithManyPositions && knobs >= 2) return 'L'
    if (knobs >= 5) return 'L'
    if (knobs >= 3) return 'M'
    if (knobs === 1) return 'M' // 1 knob avec switch-selector
    return 'M' // Minimum M même pour 2 knobs
  }
  
  if (paramCount >= 7) return 'XL'
  
  if (horizontalSliders > 0 || switchSelectors > 0) {
    if (paramCount >= 5) return 'L'
    return 'M'
  }
  
  // Pour les pédales avec uniquement des knobs
  if (knobs >= 5) return 'L'
  if (knobs >= 4) return 'M'
  if (knobs >= 2) return 'M'
  
  // Plus jamais de taille S - minimum M pour toutes les pédales
  return 'M'
}

export function PedalFrame({
  model,
  size,
  layout = 'default',
  bypassed = false,
  children,
  className = '',
  onClick,
  onBypassToggle,
  showFootswitch = true,
  bottomActions,
  ...rest
}: PedalFrameProps) {
  const pedalSize = useMemo(() => size || determinePedalSize(model), [size, model])
  
  // Déterminer les classes CSS selon le layout
  const layoutClasses = useMemo(() => {
    const classes: string[] = []
    
    switch (layout) {
      case 'flex':
        classes.push('use-flex-layout')
        break
      case 'eq':
        classes.push('is-eq-pedal')
        break
      case 'three-knobs':
        classes.push('has-three-knobs')
        break
      case 'four-knobs':
        classes.push('has-four-knobs')
        break
      case 'switch-selector-with-knobs':
        classes.push('has-switch-selector-with-knobs')
        break
      case 'l-grid-3x2':
        classes.push('has-l-grid-3x2')
        break
      case 'gmajor2':
        classes.push('is-gmajor2')
        break
      default:
        // Détecter automatiquement certains layouts
        const hasHorizontalSliders = Object.values(model.parameters).some(
          p => p.controlType === 'slider' && p.orientation === 'horizontal'
        )
        if (hasHorizontalSliders) {
          classes.push('has-horizontal-sliders')
        }
    }
    
    return classes.join(' ')
  }, [layout, model])
  
  return (
    <Pedal
      brand={model.brand}
      model={model.model}
      accentColor={model.accentColor}
      size={pedalSize}
      bypassed={bypassed}
      className={`${layoutClasses} ${className}`.trim()}
      onClick={onClick}
      onBypassToggle={onBypassToggle}
      showFootswitch={showFootswitch}
      bottomActions={bottomActions}
      {...rest}
    >
      {children}
    </Pedal>
  )
}

