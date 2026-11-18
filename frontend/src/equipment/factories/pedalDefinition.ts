/**
 * Factory : `PedalModel` (catalogue + paramètres audio) → `EquipmentDefinition`.
 * Les ids des paramètres sont conservés tels quels : aucun impact moteur audio.
 */
import type { PedalModel } from '../../data/pedals'
import type {
  EquipmentDefinition,
  EquipmentKnobConfig,
  NormalizedPosition,
  EquipmentMultiSwitchConfig,
  EquipmentRotarySelectorConfig,
  EquipmentSliderConfig,
  EquipmentSwitchConfig,
  IndicatorStyle,
  KnobAppearance,
  LedColor,
  PedalArchetype,
} from '../types'
import { PEDAL_LINES, whiteLabelForPedal } from '../branding'
import { resolvePedalFamily } from '../families'
import {
  PEDAL_DIMENSIONS,
  PEDAL_FOOT,
  PEDAL_LED,
  layoutHorizontalSliders,
  layoutKnobs,
  layoutPedalSwitches,
  layoutVerticalSliders,
} from '../layouts'

export interface PedalDefinitionOverrides {
  surface?: EquipmentDefinition['surfaceConfig']
  modelName?: string
  subtitle?: string
  hideOverlayText?: boolean
  /** Archétype imposé par la fiche réelle (wah, mini, boîtier large…). */
  chassis?: PedalArchetype
  knobStyle?: KnobAppearance
  indicator?: IndicatorStyle
  /** `null` = pédale d'origine sans LED. */
  ledColor?: LedColor | null
  /** Position du témoin relevée sur la photo. */
  ledPosition?: NormalizedPosition
  foot?: 'footswitch' | 'stomp-pad'
  /** Libellés sérigraphiés réels, par id de paramètre (ids audio inchangés). */
  labels?: Record<string, string>
  /** Sous-échelle de knob relevée sur la photo (DRY/OD, CUT/+BOOST, LO/HI…). */
  knobScales?: Record<string, { left: string; right: string }>
  /**
   * Placement imposé des contrôles (relevé photo), par id de paramètre :
   * centre en % du canevas et taille en px. Les ids audio restent inchangés.
   */
  controlPlacement?: Record<string, { x: number; y: number; size?: number; width?: number }>
  /** Ligne de gamme sérigraphiée sur l'habillage constructeur. */
  series?: string
  /** Mention latérale de façade (« DIR OUT »). */
  sideNote?: string
  /** Pictogrammes de forme d'onde sous le dernier potentiomètre. */
  waveGlyphs?: boolean
  /** Bloc accordeur sérigraphié (écran de note, échelle PITCH). */
  tunerDisplay?: boolean
  /** Bloc de commandes dans la couleur du boîtier au lieu du noir (EQ doré). */
  faceTone?: 'body'
  /** Faders sombres : piste et curseur neutres, sans témoin coloré (EQ). */
  faderTone?: 'dark'
  /** Sélecteur d'options vertical (glissière crantée du chrome compact). */
  verticalSelector?: boolean
  /** Sélecteurs horizontaux compacts (barre + libellés réduits). */
  denseSelectors?: boolean
  /** Sélecteur rotatif cranté (molette FX) à la place d'une barre. */
  rotarySelector?: boolean
  /**
   * `'knobs'` rend des knobs pour les paramètres déclarés en faders dans les
   * données (mêmes ids, même plage) : cas des EQ paramétriques à potentiomètres.
   */
  controlKind?: 'knobs'
  sourceUrl?: string
}

/** Construit la définition d'une pédale (family + overrides éventuels). */
export function buildPedalDefinition(
  model: PedalModel,
  indexInType: number,
  overrides: PedalDefinitionOverrides = {}
): EquipmentDefinition {
  const family = resolvePedalFamily(model)
  const label = whiteLabelForPedal(model, indexInType)
  /** Série Fundamental (marque licenciée) : habillage constructeur complet. */
  const walrus = model.brand === 'Walrus Audio' && model.model.startsWith('Fundamental')
  /**
   * Marque licenciée : nom constructeur affiché tel quel, quel que soit le
   * modèle (sinon une Walrus hors série Fundamental prenait un code généré
   * « type + numéro d'ordre » à la place de son nom).
   */
  const licensed = model.brand === 'Walrus Audio'
  /** Gamme maison Webamp Classic : habillage constructeur dédié. */
  const webamp = model.brand === 'Webamp Classic'
  // La gamme maison partage le boîtier compact et le gabarit des Walrus, quel
  // que soit l'archétype d'origine : une seule taille pour toute la gamme.
  const chassis = webamp ? 'compact' : (overrides.chassis ?? family.chassis)
  const archetypeDims = PEDAL_DIMENSIONS[chassis]
  const seriesDims = {
    width: Math.round(PEDAL_DIMENSIONS['compact-wide'].width * 0.8),
    height: PEDAL_DIMENSIONS['compact-wide'].height,
  }
  // Série Walrus et gamme Webamp Classic : même boîtier 304 × 460 (20 % plus
  // étroit que l'archétype) — sert aussi aux longueurs de faders.
  const dims = walrus || webamp ? seriesDims : archetypeDims

  const entries = Object.entries(model.parameters)
  const forceKnobs = overrides.controlKind === 'knobs'
  const knobs = entries.filter(
    ([, def]) => !def.controlType || def.controlType === 'knob' || (forceKnobs && def.controlType === 'slider')
  )
  const horizontalSliders = entries.filter(
    ([, def]) => !forceKnobs && def.controlType === 'slider' && def.orientation === 'horizontal'
  )
  const verticalSliders = entries.filter(
    ([, def]) => !forceKnobs && def.controlType === 'slider' && def.orientation !== 'horizontal'
  )
  const selectors = entries.filter(([, def]) => def.controlType === 'switch-selector')
  const switches = entries.filter(
    ([, def]) => def.controlType === 'switch-vertical' || def.controlType === 'switch-horizontal'
  )

  const knobSlots = layoutKnobs(knobs.length, chassis)
  const controls: EquipmentKnobConfig[] = knobs.map(([id, def], i) => {
    const slot = knobSlots[i] ?? { x: 50, y: 20, size: 40 }
    const placed = overrides.controlPlacement?.[id]
    return {
      id,
      label: overrides.labels?.[id] ?? def.label,
      min: def.min,
      max: def.max,
      step: 1,
      defaultValue: def.default,
      unit: def.max <= 10 ? '' : '%',
      // Gamme maison : rangée de knobs légèrement descendue pour dégager la LED
      // du bloc de commandes, comme sur les photos de la série.
      position: { x: placed?.x ?? slot.x, y: (placed?.y ?? slot.y) + (webamp ? 2.2 : 0) },
      tooltip: overrides.labels?.[id] ?? def.label,
      style: {
        type: overrides.knobStyle ?? family.knobStyle,
        // La gamme maison impose ses tailles relevées sur les photos (pas
        // d'échelle héritée de l'archétype d'origine).
        size: Math.round((placed?.size ?? slot.size) * (webamp ? 1 : family.knobScale)),
        indicatorStyle: overrides.indicator ?? family.indicator,
        // Le bandeau Webamp est toujours noir : libellés crème, au-dessus du
        // knob comme sur les photos (MIN/MAX sont dessinés par l'habillage).
        labelColor: webamp ? (overrides.faceTone === 'body' ? '#0b0b0c' : '#efece1') : undefined,
        labelPosition: webamp ? 'top' : 'bottom',
        hideValue: webamp || undefined,
      },
    }
  })

  // Walrus : faders descendus à 18,5 % pour dégager le logo.
  const hSlots = layoutHorizontalSliders(
    horizontalSliders.length,
    chassis,
    walrus ? 18.5 : undefined
  )
  const vSlots = layoutVerticalSliders(verticalSliders.length, chassis)
  const sliders: EquipmentSliderConfig[] = [
    ...horizontalSliders.map(([id, def], i) => ({
      id,
      label: overrides.labels?.[id] ?? def.label,
      orientation: 'horizontal' as const,
      min: def.min,
      max: def.max,
      step: 1,
      defaultValue: def.default,
      unit: def.max <= 12 && def.min < 0 ? ' dB' : '%',
      position: hSlots[i] ?? { x: 50, y: 16 },
      length: Math.round(dims.width * 0.62),
      styleType: walrus ? ('walrus-horizontal' as const) : ('phaser-horizontal' as const),
      labelColor: '#f5e6df',
    })),
    ...verticalSliders.map(([id, def], i) => {
      const placed = overrides.controlPlacement?.[id]
      const slot = vSlots[i] ?? { x: 50, y: 52 }
      return {
        id,
        label: overrides.labels?.[id] ?? def.label,
        orientation: 'vertical' as const,
        min: def.min,
        max: def.max,
        step: 1,
        defaultValue: def.default,
        unit: def.min < 0 ? ' dB' : '%',
        position: { x: placed?.x ?? slot.x, y: placed?.y ?? slot.y },
        // Un placement de fader utilise `size` comme longueur du rail.
        length: placed?.size ?? Math.round(dims.height * (family.chassis === 'eq' ? 0.33 : 0.42)),
        // Faders sombres (EQ doré) : plus de piste ni de témoin colorés.
        styleType: overrides.faderTone === 'dark' ? ('classic' as const) : ('eq-vertical-led' as const),
        accentColor: overrides.faderTone === 'dark' ? '#141416' : undefined,
        scaleVariant: def.min < 0 ? ('center-detent' as const) : ('linear-scale' as const),
        labelColor: webamp
          ? overrides.faceTone === 'body'
            ? '#0b0b0c'
            : '#efece1'
          : '#0f172a',
      }
    }),
  ]

  const switchSlots = layoutPedalSwitches(
    selectors.length + switches.length,
    chassis,
    knobSlots,
    hSlots.map((slot) => slot.y)
  )

  const rotarySelectors: EquipmentRotarySelectorConfig[] | undefined =
    webamp && overrides.rotarySelector
      ? selectors.map(([id, def]) => {
          const options = def.labels && def.labels.length > 0 ? def.labels : ['A', 'B']
          const placed = overrides.controlPlacement?.[id]
          return {
            id,
            label: overrides.labels?.[id] ?? def.label,
            options,
            defaultValue: options[Math.min(Math.max(def.default, 0), options.length - 1)] ?? options[0],
            position: placed ? { x: placed.x, y: placed.y } : { x: 50, y: 44 },
            size: placed?.size ?? 46,
            labelColor: '#efece1',
            hideReadout: true,
          }
        })
      : undefined

  const multiSwitches: EquipmentMultiSwitchConfig[] = rotarySelectors
    ? []
    : selectors.map(([id, def], i) => {
    const options = def.labels && def.labels.length > 0 ? def.labels : ['A', 'B']
    const defaultOption = options[Math.min(Math.max(def.default, 0), options.length - 1)] ?? options[0]
    const placed = overrides.controlPlacement?.[id]
    return {
      id,
      label: def.label,
      options,
      defaultValue: defaultOption,
      position: placed ? { x: placed.x, y: placed.y } : (switchSlots[i] ?? { x: 50, y: 44 }),
      width: placed?.width ?? Math.round(dims.width * 0.58),
      orientation: webamp && overrides.verticalSelector ? 'vertical' : undefined,
      dense: webamp && overrides.denseSelectors ? true : undefined,
      labelColor: '#f5e6df',
    }
  })

  const toggleSwitches: EquipmentSwitchConfig[] = switches.map(([id, def], i) => ({
    id,
    label: def.label,
    type: 'toggle',
    defaultValue: def.default > 0,
    onLabel: 'ON',
    offLabel: 'OFF',
    position: switchSlots[selectors.length + i] ?? { x: 50, y: 44 },
  }))

  const chrome: EquipmentDefinition['chrome'] = walrus
    ? { kind: 'walrus-fundamental', footNote: model.type === 'delay' ? 'HOLD FOR TAP MODE' : undefined }
    : webamp
      ? {
          kind: 'webamp-classic',
          series: overrides.series ?? PEDAL_LINES[model.type] ?? 'EFFECT',
          sideNote: overrides.sideNote,
          waveGlyphs: overrides.waveGlyphs,
          tunerDisplay: overrides.tunerDisplay,
          faceTone: overrides.faceTone,
          knobScales: overrides.knobScales,
          sliders: sliders
            .filter((slider) => slider.orientation === 'vertical')
            .map((slider) => ({
              x: slider.position.x,
              y: slider.position.y,
              length: slider.length,
              label: slider.label,
            })),
          rotaryLabels: rotarySelectors?.map((sel) => ({
            x: sel.position.x,
            y: sel.position.y,
            size: sel.size ?? 46,
            label: sel.label,
            options: sel.options,
          })),
        }
      : undefined

  const activeSwitch: EquipmentSwitchConfig = {
    id: 'active',
    label: 'Effet',
    type: overrides.foot ?? family.foot,
    defaultValue: true,
    onLabel: 'ON',
    offLabel: 'BYPASS',
    // Gamme maison : le footswitch occupe le tiers bas du boîtier (le pad de
    // l'habillage se cale dessus, cf. `WebampChrome`).
    position: webamp ? { x: 50, y: 84.5 } : PEDAL_FOOT[chassis],
    // Le pad Webamp est plus bas et un peu moins haut : l'habillage place le
    // badge du code au-dessus de lui (cf. `WebampChrome`).
    style: webamp ? { width: 210, height: 90 } : undefined,
  }

  return {
    id: model.id,
    name: overrides.modelName ?? (licensed || webamp ? model.model : label.modelName),
    type: 'pedal',
    chassisVariant: chassis,
    surfaceConfig: { ...family.surface, ...overrides.surface },
    dimensions: dims,
    chrome,
    accentColor: model.accentColor,
    branding: {
      brandName: licensed ? 'Walrus Audio' : webamp ? 'Webamp Classic' : label.brandName,
      modelName: overrides.modelName ?? (licensed || webamp ? model.model : label.modelName),
      subtitle:
        overrides.subtitle ??
        (walrus
          ? 'Fundamental Series'
          : licensed
            ? PEDAL_LINES[model.type] ?? 'Walrus Audio'
            : webamp
              ? 'Classic Series'
              : label.subtitle),
      showWhiteLogoBadge: false,
      hideOverlayText: overrides.hideOverlayText ?? (walrus || webamp),
      sourceName: label.sourceName,
      sourceUrl: overrides.sourceUrl,
    },
    controls,
    sliders: sliders.length > 0 ? sliders : undefined,
    multiSwitches: multiSwitches.length > 0 ? multiSwitches : undefined,
    rotarySelectors,
    switches: [...toggleSwitches, activeSwitch],
    leds:
      overrides.ledColor === null
        ? []
        : [
            {
              id: 'statusLed',
              label: 'STATUS',
              linkedControlId: 'active',
              color: walrus ? 'white' : (overrides.ledColor ?? family.ledColor),
              // Le bandeau Webamp place le témoin sous « ON/BATT ».
              position: overrides.ledPosition ?? (walrus ? { x: 78, y: 86.5 } : webamp ? { x: 50, y: 8.5 } : PEDAL_LED[chassis]),
              size: walrus ? 13 : webamp ? 10 : chassis === 'eq' ? 10 : 12,
              variant: walrus || chassis === 'sliders' ? 'square' : 'led',
              hideLabel: true,
            },
          ],
    description: model.description,
  }
}
