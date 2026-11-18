/**
 * Design system matériel WebAmp — types & validation.
 *
 * Une `EquipmentDefinition` décrit intégralement un appareil en marque blanche :
 * châssis, surface, branding, contrôles, LED et dimensions. Le rendu est assuré
 * par `EquipmentShell` — aucun composant par modèle.
 */

export type EquipmentType = 'pedal' | 'amplifier'

/** Archétypes de pédales (géométrie de châssis, pas de marque). */
export type PedalArchetype =
  | 'compact'
  | 'compact-wide'
  | 'mini'
  | 'sliders'
  | 'eq'
  | 'treadle'
  | 'expression'
  | 'looper'
  | 'desktop'
  | 'tuner'

/** Archétypes d'amplis. */
export type AmpArchetype =
  | 'head-gold'
  | 'head-citrus'
  | 'head-silver'
  | 'head-black'
  | 'lunchbox'
  | 'combo'
  | 'combo-twin'
  | 'rack'

export type ChassisVariant = PedalArchetype | AmpArchetype

/* --- Couleurs --- */
export type ClassicColorId =
  | 'black'
  | 'white'
  | 'cream-ivory'
  | 'silver'
  | 'chrome'
  | 'gold'
  | 'grey'
  | 'anthracite'

export type VintageColorId =
  | 'british-racing-green'
  | 'burgundy'
  | 'wine-red'
  | 'mustard-yellow'
  | 'vintage-orange'
  | 'seafoam-green'
  | 'turquoise'
  | 'baby-blue'
  | 'vintage-brown'
  | 'olive-green'

export type ModernColorId =
  | 'webamp-orange'
  | 'electric-blue'
  | 'neon-green'
  | 'hot-pink'
  | 'purple'
  | 'magenta'
  | 'crimson'
  | 'coral'
  | 'yellow'
  | 'metallic-blue'
  | 'gunmetal'

export type EquipmentColorId = ClassicColorId | VintageColorId | ModernColorId

export type EnclosureTexture =
  | 'smooth'
  | 'matte'
  | 'glossy'
  | 'satin'
  | 'brushed-metal'
  | 'anodized-metal'
  | 'powder-coated'
  | 'hammered-metal'
  | 'textured-paint'
  | 'aged-worn'
  | 'tolex'
  | 'wood-grain'
  | 'carbon-fiber'

export type MeshPattern =
  | 'metal-mesh'
  | 'perforated-metal'
  | 'honeycomb-mesh'
  | 'speaker-cloth'
  | 'woven-fabric'
  | 'diamond-mesh'
  | 'vintage-grill-cloth'

export type EquipmentMaterial =
  | 'aluminum'
  | 'chrome'
  | 'steel'
  | 'brass'
  | 'abs-plastic'
  | 'tolex'
  | 'natural-wood'
  | 'rubber'

export type EquipmentFinish =
  | 'gloss'
  | 'matte'
  | 'satin'
  | 'brushed'
  | 'polished'
  | 'powder-coated'
  | 'chrome-plated'
  | 'gold-plated'
  | 'aged'
  | 'aged-worn'

/* --- Contrôles --- */
export type KnobAppearance =
  | 'classic'
  | 'classic-round'
  | 'vintage-round'
  | 'metal'
  | 'aluminum'
  | 'chrome'
  | 'black-silver'
  | 'gold'
  | 'cream'
  | 'chicken-head'
  | 'pointer'
  | 'skirted'
  | 'dome'
  | 'flat-top'
  | 'mini'
  | 'large'
  | 'colored'
  | 'translucent'
  | 'led-ring'
  | 'thumbwheel'

export type IndicatorStyle =
  | 'white-pointer'
  | 'black-pointer'
  | 'colored-pointer'
  | 'dot'
  | 'line'
  | 'notch'
  | 'pointer'
  | 'numbered-scale'
  | 'printed-scale'
  | 'led-position'

export type SliderShape =
  | 'classic'
  | 'short'
  | 'long'
  | 'mini'
  | 't-bar'
  | 'knurled'
  | 'recessed'
  | 'led-fader'
  | 'eq-vertical-led'
  | 'phaser-horizontal'
  | 'walrus-horizontal'

export type SliderScaleVariant =
  | 'linear-scale'
  | 'logarithmic-scale'
  | 'center-detent'
  | 'led-scale'
  | 'numeric-scale'
  | 'colored-track'

export type SwitchKind =
  | 'toggle'
  | 'mini-toggle'
  | 'paddle'
  | 'rocker'
  | 'push'
  | 'momentary'
  | 'latching'
  | 'footswitch'
  | 'stomp-pad'
  | 'rotary-selector'
  | 'slide-switch'
  | 'illuminated-button'
  | 'led-button'
  | 'metal-push'

export type LedColor = 'red' | 'green' | 'blue' | 'amber' | 'orange' | 'white' | 'rgb'
export type LedVariant = 'led' | 'jewel' | 'square' | 'led-ring'

export interface NormalizedPosition {
  /** Centre horizontal en % (0-100) du canevas appareil. */
  x: number
  /** Centre vertical en % (0-100). */
  y: number
}

export interface EquipmentDimensions {
  width: number
  height: number
}

export interface EquipmentSurfaceConfig {
  color?: EquipmentColorId
  customHex?: string
  texture?: EnclosureTexture
  mesh?: MeshPattern
  material?: EquipmentMaterial
  finish?: EquipmentFinish
  faceplateColor?: EquipmentColorId
  grilleColor?: string
  pipingColor?: string
}

export interface EquipmentKnobStyle {
  type: KnobAppearance
  size: number
  color?: string
  indicatorStyle?: IndicatorStyle
  labelColor?: string
  labelPosition?: 'bottom' | 'top' | 'none'
  hideValue?: boolean
}

export interface EquipmentKnobConfig {
  id: string
  label: string
  min: number
  max: number
  step?: number
  defaultValue: number
  unit?: string
  position: NormalizedPosition
  rotationMin?: number
  rotationMax?: number
  tooltip?: string
  style: EquipmentKnobStyle
}

export interface EquipmentSliderConfig {
  id: string
  label: string
  orientation: 'horizontal' | 'vertical'
  min: number
  max: number
  step?: number
  defaultValue: number
  unit?: string
  position: NormalizedPosition
  length: number
  styleType?: SliderShape
  scaleVariant?: SliderScaleVariant
  accentColor?: string
  labelColor?: string
  tooltip?: string
}

export interface EquipmentMultiSwitchConfig {
  id: string
  label: string
  options: string[]
  defaultValue: string
  position: NormalizedPosition
  width?: number
  /** Horizontal (barre) ou vertical (glissière crantée, chrome compact). */
  orientation?: 'horizontal' | 'vertical'
  /** Barre pleine largeur et libellés réduits (rangées MIC / MOD / AMP). */
  dense?: boolean
  labelColor?: string
  tooltip?: string
}

export interface EquipmentRotarySelectorConfig {
  id: string
  label: string
  options: string[]
  defaultValue: string
  position: NormalizedPosition
  size?: number
  knobStyle?: KnobAppearance
  labelColor?: string
  tooltip?: string
  /** Masque la ligne « FX : valeur » sous la molette (libellés sérigraphiés). */
  hideReadout?: boolean
}

export interface EquipmentSwitchStyle {
  orientation?: 'vertical' | 'horizontal'
  size?: number
  width?: number
  height?: number
  labelColor?: string
  rockerColor?: 'red' | 'black'
  accentColor?: string
}

export interface EquipmentSwitchConfig {
  id: string
  label: string
  type: SwitchKind
  defaultValue: boolean
  onLabel?: string
  offLabel?: string
  position: NormalizedPosition
  tooltip?: string
  options?: string[]
  style?: EquipmentSwitchStyle
}

export interface EquipmentLedConfig {
  id: string
  label: string
  linkedControlId?: string
  color: LedColor
  position: NormalizedPosition
  size?: number
  variant?: LedVariant
  labelColor?: string
  hideLabel?: boolean
}

export interface EquipmentSignalMeterConfig {
  id: string
  label: string
  direction: 'input' | 'output'
  position: NormalizedPosition
  size?: number
  variant?: 'led-bar' | 'vu-meter' | 'analog-needle-meter'
}

export interface EquipmentBrandingConfig {
  brandName: string
  modelName: string
  subtitle?: string
  showWhiteLogoBadge?: boolean
  tone?: 'light' | 'dark'
  badgePosition?: NormalizedPosition
  modelPosition?: NormalizedPosition
  subtitlePosition?: NormalizedPosition
  decorativeLines?: boolean
  hideOverlayText?: boolean
  /** Mémoire interne : jamais rendu à l'écran. */
  sourceName?: string
  /** Fiche constructeur du modèle réel (recherche web, documentation). */
  sourceUrl?: string
}

export interface EquipmentDefinition {
  id: string
  name: string
  type: EquipmentType
  chassisVariant: ChassisVariant
  surfaceConfig?: EquipmentSurfaceConfig
  dimensions: EquipmentDimensions
  branding: EquipmentBrandingConfig
  controls: EquipmentKnobConfig[]
  sliders?: EquipmentSliderConfig[]
  multiSwitches?: EquipmentMultiSwitchConfig[]
  rotarySelectors?: EquipmentRotarySelectorConfig[]
  switches: EquipmentSwitchConfig[]
  leds: EquipmentLedConfig[]
  signalMeters?: EquipmentSignalMeterConfig[]
  /** Habillage constructeur (marque licenciée) dessiné par le châssis. */
  chrome?: {
    kind: 'walrus-fundamental' | 'webamp-classic'
    /** Mention sérigraphiée sous le footswitch (« HOLD FOR TAP MODE »). */
    footNote?: string
    /** Ligne de gamme sérigraphiée (« OVER DRIVE »). */
    series?: string
    /** Mention latérale de la façade (« DIR OUT »). */
    sideNote?: string
    /** Pictogrammes de forme d'onde sous le dernier potentiomètre. */
    waveGlyphs?: boolean
    /** Bloc accordeur sérigraphié (écran de note, échelle PITCH, témoins). */
    tunerDisplay?: boolean
    /** Bloc de commandes dans la couleur du boîtier au lieu du noir (EQ-700). */
    faceTone?: 'body'
    /** Sous-échelle sérigraphiée par knob (MIN/MAX si absente). */
    knobScales?: Record<string, { left: string; right: string }>
    /** Faders verticaux (EQ) : centre, longueur et libellé sérigraphié. */
    sliders?: { x: number; y: number; length: number; label: string }[]
    /** Molette FX : libellés crantés dessinés en colonne près du bouton. */
    rotaryLabels?: {
      x: number
      y: number
      size: number
      label: string
      options: string[]
    }[]
  }
  /** Teinte de série du modèle (liseré, sérigraphie). */
  accentColor?: string
  description?: string
}

export interface EquipmentValidationResult {
  valid: boolean
  errors: string[]
  definition?: EquipmentDefinition
}

function isValidCoordinate(pos: unknown): pos is NormalizedPosition {
  if (!pos || typeof pos !== 'object') return false
  const p = pos as Record<string, unknown>
  return (
    typeof p.x === 'number' &&
    Number.isFinite(p.x) &&
    p.x >= 0 &&
    p.x <= 100 &&
    typeof p.y === 'number' &&
    Number.isFinite(p.y) &&
    p.y >= 0 &&
    p.y <= 100
  )
}

/** Valide une définition (utilisée par le shell et par les tests). */
export function validateEquipmentDefinition(input: unknown): EquipmentValidationResult {
  const errors: string[] = []
  if (!input || typeof input !== 'object') {
    return { valid: false, errors: ['Equipment definition must be a non-null object.'] }
  }

  const def = input as Partial<EquipmentDefinition>
  if (!def.id || typeof def.id !== 'string' || !def.id.trim()) {
    errors.push('Equipment "id" must be a non-empty string.')
  }
  if (!def.name || typeof def.name !== 'string' || !def.name.trim()) {
    errors.push('Equipment "name" must be a non-empty string.')
  }
  if (def.type !== 'pedal' && def.type !== 'amplifier') {
    errors.push('Equipment "type" must be "pedal" or "amplifier".')
  }
  if (!def.chassisVariant) {
    errors.push('Equipment must define a "chassisVariant".')
  }
  if (
    !def.dimensions ||
    typeof def.dimensions.width !== 'number' ||
    typeof def.dimensions.height !== 'number' ||
    def.dimensions.width <= 0 ||
    def.dimensions.height <= 0
  ) {
    errors.push('Equipment "dimensions" must define positive numeric width and height.')
  }
  if (!def.branding || typeof def.branding.brandName !== 'string' || typeof def.branding.modelName !== 'string') {
    errors.push('Equipment "branding" must define brandName and modelName.')
  }

  const seen = new Set<string>()
  const claim = (id: string | undefined, label: string, idx: number) => {
    if (!id || typeof id !== 'string') {
      errors.push(`${label} at index ${idx} is missing a valid string "id".`)
      return
    }
    if (seen.has(id)) errors.push(`Duplicate control id "${id}".`)
    else seen.add(id)
  }

  if (!Array.isArray(def.controls)) {
    errors.push('Equipment "controls" must be an array.')
  } else {
    def.controls.forEach((ctrl, idx) => {
      claim(ctrl?.id, 'Control', idx)
      if (!ctrl || typeof ctrl.min !== 'number' || typeof ctrl.max !== 'number' || ctrl.min >= ctrl.max) {
        errors.push(`Control "${ctrl?.id ?? idx}" must have numeric min < max.`)
      } else if (
        typeof ctrl.defaultValue !== 'number' ||
        ctrl.defaultValue < ctrl.min ||
        ctrl.defaultValue > ctrl.max
      ) {
        errors.push(`Control "${ctrl.id}" defaultValue must fall within [min, max].`)
      }
      if (!isValidCoordinate(ctrl?.position)) {
        errors.push(`Control "${ctrl?.id ?? idx}" position must use normalized coordinates within 0-100.`)
      }
      if (!ctrl?.style || typeof ctrl.style.size !== 'number' || ctrl.style.size <= 0) {
        errors.push(`Control "${ctrl?.id ?? idx}" must define a positive style.size.`)
      }
    })
  }

  def.sliders?.forEach((sl, idx) => {
    claim(sl?.id, 'Slider', idx)
    if (typeof sl?.min !== 'number' || typeof sl?.max !== 'number' || sl.min >= sl.max) {
      errors.push(`Slider "${sl?.id ?? idx}" must have numeric min < max.`)
    } else if (sl.defaultValue < sl.min || sl.defaultValue > sl.max) {
      errors.push(`Slider "${sl.id}" defaultValue must fall within [min, max].`)
    }
    if (!isValidCoordinate(sl?.position)) {
      errors.push(`Slider "${sl?.id ?? idx}" position must use normalized coordinates within 0-100.`)
    }
  })

  def.multiSwitches?.forEach((ms, idx) => {
    claim(ms?.id, 'MultiSwitch', idx)
    if (!Array.isArray(ms?.options) || ms.options.length < 2) {
      errors.push(`MultiSwitch "${ms?.id ?? idx}" must have at least 2 options.`)
    }
    if (!isValidCoordinate(ms?.position)) {
      errors.push(`MultiSwitch "${ms?.id ?? idx}" position must use normalized coordinates within 0-100.`)
    }
  })

  def.rotarySelectors?.forEach((sel, idx) => {
    claim(sel?.id, 'RotarySelector', idx)
    if (!Array.isArray(sel?.options) || sel.options.length < 2) {
      errors.push(`RotarySelector "${sel?.id ?? idx}" must have at least 2 options.`)
    }
    if (!isValidCoordinate(sel?.position)) {
      errors.push(`RotarySelector "${sel?.id ?? idx}" position must use normalized coordinates within 0-100.`)
    }
  })

  if (!Array.isArray(def.switches)) {
    errors.push('Equipment "switches" must be an array.')
  } else {
    def.switches.forEach((sw, idx) => {
      claim(sw?.id, 'Switch', idx)
      if (!isValidCoordinate(sw?.position)) {
        errors.push(`Switch "${sw?.id ?? idx}" position must use normalized coordinates within 0-100.`)
      }
    })
  }

  if (!Array.isArray(def.leds)) {
    errors.push('Equipment "leds" must be an array.')
  } else {
    def.leds.forEach((led, idx) => {
      claim(led?.id, 'LED', idx)
      if (!isValidCoordinate(led?.position)) {
        errors.push(`LED "${led?.id ?? idx}" position must use normalized coordinates within 0-100.`)
      }
    })
  }

  if (errors.length > 0) return { valid: false, errors }
  return { valid: true, errors: [], definition: def as EquipmentDefinition }
}
