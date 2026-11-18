/**
 * Les 44 amplis du catalogue, déclinés en marque blanche.
 * L'archétype (façade, grille, finition) est porté par la famille.
 */
import { amplifierLibrary } from '../../data/amplifiers'
import type { EquipmentDefinition } from '../types'
import { buildAmpDefinition } from '../factories/ampDefinition'


export const ampEquipment: Record<string, EquipmentDefinition> = {}
export const ampEquipmentList: EquipmentDefinition[] = []

amplifierLibrary.forEach((amp, index) => {
  const definition = buildAmpDefinition(amp, index)
  ampEquipment[amp.id] = definition
  ampEquipmentList.push(definition)
})

export const ampEquipmentCount = ampEquipmentList.length
