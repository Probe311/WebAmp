import React from 'react'
import { pedalLibrary } from '../../data/pedals'
import { createEquipmentPedal } from '../../equipment/EquipmentPedal'
import type { PedalComponentProps } from './types'

/**
 * Registre des pédales : 100 % data-driven.
 * Chaque id du catalogue reçoit un composant généré par le design system
 * matériel (`equipment/`) — plus aucun composant écrit à la main.
 */
export const pedalComponents: Record<string, React.FC<PedalComponentProps>> = {}
export const pedalControls: Record<string, React.FC<PedalComponentProps>> = {}

for (const model of pedalLibrary) {
  const Component = createEquipmentPedal(model.id)
  pedalComponents[model.id] = Component
  pedalControls[model.id] = Component
}

export type PedalComponentsMap = typeof pedalComponents

export { PedalFrame, determinePedalSize } from './PedalFrame'
export type { PedalFrameProps } from './PedalFrame'
export type { PedalComponentProps } from './types'
