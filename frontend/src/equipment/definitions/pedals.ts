/**
 * Les pédales du catalogue, déclinées en marque blanche.
 *
 * Aucune définition n'est écrite à la main : la factory applique l'archétype de
 * la famille, puis la fiche de recherche web (`specs/research.ts`) précise la
 * couleur, la finition, les knobs, la LED, le châssis et les libellés réels.
 */
import { isPedalAvailable, pedalLibrary } from '../../data/pedals'
import type { EquipmentDefinition } from '../types'
import { buildPedalDefinition, type PedalDefinitionOverrides } from '../factories/pedalDefinition'
import { PEDAL_RESEARCH } from '../specs'

function overridesFor(id: string): PedalDefinitionOverrides {
  const research = PEDAL_RESEARCH[id]
  if (!research) return {}
  return {
    surface: {
      color: research.color,
      customHex: research.customHex,
      texture: research.texture,
      finish: research.finish,
      material: research.material,
    },
    chassis: research.chassis,
    knobStyle: research.knob,
    indicator: research.indicator,
    ledColor: research.led,
    ledPosition: research.ledPlacement,
    foot: research.foot,
    labels: research.labels,
    knobScales: research.knobScales,
    controlKind: research.controlKind,
    controlPlacement: research.placements,
    series: research.series,
    sideNote: research.sideNote,
    waveGlyphs: research.waveGlyphs,
    tunerDisplay: research.tunerDisplay,
    faceTone: research.faceTone,
    faderTone: research.faderTone,
    verticalSelector: research.verticalSelector,
    denseSelectors: research.denseSelectors,
    rotarySelector: research.rotarySelector,
    sourceUrl: research.url,
  }
}

const counters: Record<string, number> = {}

export const pedalEquipment: Record<string, EquipmentDefinition> = {}
export const pedalEquipmentList: EquipmentDefinition[] = []
/** Définitions affichables : seules les marques validées sont proposées. */
export const availablePedalEquipmentList: EquipmentDefinition[] = []

for (const model of pedalLibrary) {
  const index = counters[model.type] ?? 0
  counters[model.type] = index + 1
  const definition = buildPedalDefinition(model, index, overridesFor(model.id))
  pedalEquipment[model.id] = definition
  pedalEquipmentList.push(definition)
  if (isPedalAvailable(model)) availablePedalEquipmentList.push(definition)
}

export const pedalEquipmentCount = pedalEquipmentList.length
export const availablePedalEquipmentCount = availablePedalEquipmentList.length

/** Modèles du catalogue pour lesquels une fiche constructeur a été relevée. */
export const researchedPedalCount = pedalEquipmentList.filter((d) => Boolean(d.branding.sourceUrl)).length
