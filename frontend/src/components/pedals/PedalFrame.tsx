import { ReactNode, useMemo } from 'react'
import { Pedal, PedalSize, PedalProps } from '../Pedal'
import { PedalModel } from '../../data/pedals'
import { resolveBrandPedalChrome } from '../../utils/brandPedalChrome'

export interface PedalFrameProps extends Omit<PedalProps, 'brand' | 'model' | 'accentColor' | 'size'> {
  model: PedalModel
  size?: PedalSize
  layout?: 'default' | 'flex' | 'grid' | 'eq' | 'two-knobs' | 'three-knobs' | 'four-knobs' | 'switch-selector-with-knobs' | 'l-grid-3x2' | 'gmajor2'
  children: ReactNode
}

// Fonction helper pour déterminer la taille de la pédale selon le nombre de contrôles
export function determinePedalSize(pedalModel: PedalModel): PedalSize {
  const paramCount = Object.keys(pedalModel.parameters).length
  
  const horizontalSliders = Object.values(pedalModel.parameters).filter(
    p => p.controlType === 'slider' && p.orientation === 'horizontal'
  ).length
  
  const switchSelectors = Object.values(pedalModel.parameters).filter(
    p => p.controlType === 'switch-selector'
  ).length

  const hasManyModeSwitch = Object.values(pedalModel.parameters).some(
    p => p.controlType === 'switch-selector' && p.labels && p.labels.length >= 6
  )
  
  // Compter les knobs uniquement
  const knobs = Object.values(pedalModel.parameters).filter(
    p => !p.controlType || p.controlType === 'knob'
  ).length
  
  // Détecter les switches verticaux et horizontaux qui nécessitent plus d'espace
  const switches = Object.values(pedalModel.parameters).filter(
    p => p.controlType === 'switch-vertical' || p.controlType === 'switch-horizontal'
  ).length

  // Envelope filters / wah sans treadle → taille 1
  if (
    pedalModel.id === 'ehx-q-tron' ||
    pedalModel.id === 'mutron-iii' ||
    pedalModel.id === 'boss-aw3' ||
    pedalModel.id === 'digitech-synth-wah'
  ) {
    return 'M'
  }

  // RV-6 → taille 2 (L)
  if (pedalModel.id === 'boss-rv6') return 'L'

  // Flint, G-Major 2, wah treadle → M + shell-1-5x
  if (
    pedalModel.id === 'strymon-flint' ||
    pedalModel.id === 'tc-gmajor2' ||
    pedalModel.type === 'wah'
  ) {
    return 'M'
  }

  // Switch multi-modes (6+) → XL (Oceans 11, etc.)
  if (hasManyModeSwitch) return 'XL'
  
  // EQ : largeur proportionnelle aux bandes (faders compact)
  // 10-band → XL (690) · GE-7 → L (460) · programmable → L · ParaEQ → M (230)
  if (pedalModel.type === 'eq') {
    const eqBands = Object.entries(pedalModel.parameters).filter(
      ([name]) => name.toLowerCase() !== 'level'
    ).length
    const totalSliders = Object.values(pedalModel.parameters).filter(
      p => p.controlType === 'slider'
    ).length

    if (eqBands >= 10) return 'XL'
    if (eqBands >= 5) return 'L'
    if (totalSliders >= 4) return 'M'
    return 'M'
  }

  // Sliders horizontaux (Walrus Fundamental) → M ; largeur 1.5× appliquée via has-horizontal-sliders
  if (horizontalSliders > 0) return 'M'
  
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
    if (knobs >= 5) return 'L'
    if (knobs >= 3) return 'M'
    if (knobs === 1) return 'M' // 1 knob avec switch-selector
    return 'M' // Minimum M même pour 2 knobs
  }
  
  if (paramCount >= 7) return 'XL'
  
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
  showFootswitch: _showFootswitch = true,
  bottomActions,
  ...rest
}: PedalFrameProps) {
  void _showFootswitch
  const pedalSize = useMemo(() => size || determinePedalSize(model), [size, model])
  const chrome = useMemo(() => {
    const base = resolveBrandPedalChrome(model.brand)
    return {
      engageStyle: model.ui?.engageStyle ?? base.engageStyle,
      ledSide: model.ui?.ledSide ?? base.ledSide,
      footShape: model.ui?.footShape ?? base.footShape,
    }
  }, [model])
  
  // Couleur principale de la pédale - utilisée de manière cohérente partout
  const accentColor = model.accentColor
  
  // Déterminer les classes CSS selon le layout
  const layoutClasses = useMemo(() => {
    const classes: string[] = []

    // Largeur 1.5× (Flint, wah treadle, G-Major 2) — RV-6 = L (taille 2)
    const shell15 =
      model.id === 'strymon-flint' ||
      model.id === 'tc-gmajor2' ||
      (model.type === 'wah' &&
        model.id !== 'ehx-q-tron' &&
        model.id !== 'mutron-iii' &&
        model.id !== 'boss-aw3' &&
        model.id !== 'digitech-synth-wah')
    if (shell15) classes.push('shell-1-5x')
    
    switch (layout) {
      case 'flex':
        classes.push('use-flex-layout')
        break
      case 'eq':
        classes.push('is-eq-pedal')
        break
      case 'two-knobs':
        classes.push('has-two-knobs')
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
      default: {
        const params = Object.values(model.parameters)
        const hasHorizontalSliders = params.some(
          p => p.controlType === 'slider' && p.orientation === 'horizontal'
        )
        if (hasHorizontalSliders) {
          classes.push('has-horizontal-sliders')
        }
        const knobs = params.filter(p => !p.controlType || p.controlType === 'knob')
        const nonKnobs = params.filter(
          p => p.controlType && p.controlType !== 'knob'
        )
        // 2 potards → 1+1 empilés ; 3 → 2+1 (RAT / DS-1)
        if (knobs.length === 2 && nonKnobs.length === 0) {
          classes.push('has-two-knobs')
        } else if (knobs.length === 3 && nonKnobs.length === 0) {
          classes.push('has-three-knobs')
        }
        break
      }
    }
    
    return classes.join(' ')
  }, [layout, model])
  
  return (
    <Pedal
      brand={model.brand}
      model={model.model}
      accentColor={accentColor}
      size={pedalSize}
      bypassed={bypassed}
      className={`${layoutClasses} ${className}`.trim()}
      onClick={onClick}
      onBypassToggle={onBypassToggle}
      showFootswitch={true}
      bottomActions={bottomActions}
      auroraBg={model.brand === 'WebAmp'}
      engageStyle={chrome.engageStyle}
      ledSide={chrome.ledSide}
      footShape={chrome.footShape}
      {...rest}
    >
      {children}
    </Pedal>
  )
}

