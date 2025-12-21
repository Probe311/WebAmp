// Fonctions utilitaires pour analyser les types de contrôles d'une pédale

export interface ControlTypeAnalysis {
  sliders: Array<[string, number]>
  switchSelectors: Array<[string, number]>
  others: Array<[string, number]>
  potentiometers: Array<[string, number]>
  hasThreeKnobs: boolean
  hasFourKnobs: boolean
  hasSwitchSelectorWithKnobs: boolean
  isEQ: boolean
}

/**
 * Analyse les paramètres d'une pédale pour déterminer les types de contrôles
 */
export interface PedalModelForAnalysis {
  type: string
  parameters: Record<string, {
    controlType?: string
    [key: string]: unknown
  }>
}

export function analyzeControlTypes(
  parameters: Record<string, number>,
  pedalModel: PedalModelForAnalysis
): ControlTypeAnalysis {
  const params = Object.entries(parameters)
  const isEQ = pedalModel.type === 'eq'
  
  const sliders = params.filter(([paramName]) => {
    const paramDef = pedalModel.parameters[paramName]
    return paramDef?.controlType === 'slider'
  })
  
  const switchSelectors = params.filter(([paramName]) => {
    const paramDef = pedalModel.parameters[paramName]
    return paramDef?.controlType === 'switch-selector'
  })
  
  const others = params.filter(([paramName]) => {
    const paramDef = pedalModel.parameters[paramName]
    return paramDef?.controlType !== 'slider' && paramDef?.controlType !== 'switch-selector'
  })
  
  const potentiometers = others.filter(([paramName]) => {
    const paramDef = pedalModel.parameters[paramName]
    const controlType = paramDef?.controlType || 'knob'
    return (controlType === 'knob' || !paramDef.controlType) && 
           paramDef?.controlType !== 'switch-vertical' && 
           paramDef?.controlType !== 'switch-horizontal'
  })
  
  const hasThreeKnobs = potentiometers.length === 3 && sliders.length === 0 && switchSelectors.length === 0 && !isEQ
  const hasFourKnobs = potentiometers.length === 4 && sliders.length === 0 && switchSelectors.length === 0 && !isEQ
  const hasSwitchSelectorWithKnobs = switchSelectors.length > 0 && potentiometers.length > 0 && sliders.length === 0 && !isEQ
  
  return {
    sliders,
    switchSelectors,
    others,
    potentiometers,
    hasThreeKnobs,
    hasFourKnobs,
    hasSwitchSelectorWithKnobs,
    isEQ
  }
}

/**
 * Analyse les paramètres d'une pédale depuis le modèle (pas seulement les valeurs initialisées)
 */
export function analyzeControlTypesFromModel(
  pedalModel: PedalModelForAnalysis
): Omit<ControlTypeAnalysis, 'sliders' | 'switchSelectors' | 'others' | 'potentiometers'> & {
  potentiometers: number
  hasFourKnobs: boolean
} {
  const params = Object.entries(pedalModel.parameters)
  const isEQ = pedalModel.type === 'eq'
  
  const sliders = params.filter(([, paramDef]) => {
    return paramDef?.controlType === 'slider'
  })
  
  const switchSelectors = params.filter(([, paramDef]) => {
    return paramDef?.controlType === 'switch-selector'
  })
  
  const others = params.filter(([, paramDef]) => {
    return paramDef?.controlType !== 'slider' && paramDef?.controlType !== 'switch-selector'
  })
  
  const potentiometers = others.filter(([, paramDef]) => {
    const controlType = paramDef?.controlType || 'knob'
    return (controlType === 'knob' || !paramDef.controlType) && 
           paramDef?.controlType !== 'switch-vertical' && 
           paramDef?.controlType !== 'switch-horizontal'
  })
  
  const hasThreeKnobs = potentiometers.length === 3 && sliders.length === 0 && switchSelectors.length === 0
  const hasFourKnobs = potentiometers.length === 4 && sliders.length === 0 && switchSelectors.length === 0
  const hasSwitchSelectorWithKnobs = switchSelectors.length > 0 && potentiometers.length > 0 && sliders.length === 0 && !isEQ
  
  return {
    hasThreeKnobs,
    hasFourKnobs,
    hasSwitchSelectorWithKnobs,
    isEQ,
    potentiometers: potentiometers.length
  }
}

/**
 * Détermine la taille des knobs en fonction du nombre de potentiomètres
 */
export function determineKnobSize(
  potentiometersCount: number,
  hasSwitchSelectorWithKnobs: boolean
): 'small' | 'medium' | 'large' {
  if (hasSwitchSelectorWithKnobs) {
    if (potentiometersCount === 1) return 'large'
    if (potentiometersCount === 2) return 'large'
    if (potentiometersCount === 3) return 'medium'
    return 'small'
  } else {
    if (potentiometersCount >= 5) return 'small'
    if (potentiometersCount <= 2) return 'large'
    return 'medium'
  }
}

