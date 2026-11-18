/**
 * Design system matériel WebAmp — point d'entrée.
 *
 * - `definitions/pedals` / `definitions/amplifiers` : les 281 appareils
 *   générés en marque blanche depuis le catalogue.
 * - `EquipmentShell` : rendu unique (châssis + branding + contrôles).
 */
export * from './types'
export * from './tokens'
export * from './branding'
export * from './layouts'
export * from './families'
export * from './controls'
export { PedalChassis } from './chassis/PedalChassis'
export { AmpChassis } from './chassis/AmpChassis'
export { EquipmentShell } from './EquipmentShell'
export type { EquipmentShellProps } from './EquipmentShell'
export { buildPedalDefinition } from './factories/pedalDefinition'
export { buildAmpDefinition } from './factories/ampDefinition'
export {
  pedalEquipment,
  pedalEquipmentList,
  pedalEquipmentCount,
  availablePedalEquipmentList,
  availablePedalEquipmentCount,
} from './definitions/pedals'
export { ampEquipment, ampEquipmentList, ampEquipmentCount } from './definitions/amplifiers'
export { EquipmentPedalView, createEquipmentPedal } from './EquipmentPedal'
export { AmpHeadView } from './AmpHeadView'
