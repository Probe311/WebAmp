/**
 * Factory : `AmplifierModel` → `EquipmentDefinition`.
 * Les paramètres 0–10 (volume/gain/bass/middle/treble/presence/master…) sont
 * conservés tels quels : le tone stack audio les lit directement.
 */
import type { AmplifierModel } from '../../data/amplifiers'
import type { EquipmentDefinition, EquipmentSwitchConfig } from '../types'
import { whiteLabelForAmp } from '../branding'
import { resolveAmpFamily } from '../families'
import {
  AMP_BRANDING,
  AMP_DIMENSIONS,
  headGoldChannelSlot,
  layoutAmpKnobs,
  layoutAmpSwitches,
} from '../layouts'

export function buildAmpDefinition(
  amp: AmplifierModel,
  indexInBrand: number,
  overrides: Partial<Pick<EquipmentDefinition, 'surfaceConfig'>> = {}
): EquipmentDefinition {
  const family = resolveAmpFamily(amp)
  const dims = AMP_DIMENSIONS[family.chassis]
  const label = whiteLabelForAmp(amp, indexInBrand, family.chassis)
  const isHeadGold = family.chassis === 'head-gold'

  const entries = Object.entries(amp.parameters).filter(([, def]) => Boolean(def))
  const slots = layoutAmpKnobs(entries.length, family.chassis)

  const controls = entries.map(([name, def], i) => {
    const slot = slots[i] ?? { x: 50, y: 76, size: 28 }
    return {
      id: name,
      label: name === 'middle' ? 'MIDDLE' : name.toUpperCase(),
      min: def?.min ?? 0,
      max: def?.max ?? 10,
      step: 1,
      defaultValue: def?.default ?? 5,
      unit: '',
      position: { x: slot.x, y: slot.y },
      tooltip: name,
      style: {
        type: family.knobStyle,
        size: slot.size,
        indicatorStyle: family.indicator,
        labelPosition: 'bottom' as const,
        // Faceplate source : pas de chiffre sous le label
        hideValue: isHeadGold,
      },
    }
  })

  const rockerSize = isHeadGold ? 34 : family.chassis === 'lunchbox' ? 26 : 28
  const rockerSlots = layoutAmpSwitches(2, family.chassis)

  const switches: EquipmentSwitchConfig[] = [
    {
      id: 'power',
      label: 'POWER',
      type: 'rocker',
      defaultValue: true,
      onLabel: 'ON',
      offLabel: 'OFF',
      position: rockerSlots[0],
      style: { rockerColor: 'red', size: rockerSize },
    },
    {
      id: 'cabinet',
      label: 'CABINET',
      type: 'rocker',
      defaultValue: true,
      onLabel: 'ON',
      offLabel: 'OFF',
      position: rockerSlots[1],
      style: { rockerColor: 'black', size: rockerSize },
    },
  ]

  if ('gain' in amp.parameters || 'master' in amp.parameters) {
    switches.push({
      id: 'channel',
      label: 'CHANNEL',
      type: isHeadGold ? 'illuminated-button' : 'toggle',
      defaultValue: false,
      onLabel: 'DRIVE',
      offLabel: 'CLEAN',
      position: isHeadGold
        ? headGoldChannelSlot()
        : layoutAmpSwitches(3, family.chassis)[2] ?? { x: 24, y: 76 },
      style: { size: isHeadGold ? 18 : family.chassis === 'lunchbox' ? 22 : 24 },
    })
  }

  const powerSwitch = switches[0]

  return {
    id: amp.id,
    name: label.modelName,
    type: 'amplifier',
    chassisVariant: family.chassis,
    surfaceConfig: { ...family.surface, ...overrides.surfaceConfig },
    dimensions: dims,
    branding: {
      brandName: 'WebAmp',
      modelName: label.modelName,
      subtitle: label.subtitle,
      showWhiteLogoBadge: false,
      modelPosition: AMP_BRANDING[family.chassis],
      tone: 'light',
      sourceName: label.sourceName,
    },
    controls,
    switches,
    leds: [
      {
        id: 'powerLed',
        label: 'PWR',
        linkedControlId: powerSwitch.id,
        color: family.ledColor,
        // Au-dessus du corps rocker (labels absolus → offset stable)
        position: {
          x: powerSwitch.position.x,
          y: powerSwitch.position.y - (isHeadGold ? 10 : 8),
        },
        size: isHeadGold ? 10 : 9,
        variant: family.chassis === 'head-citrus' || isHeadGold ? 'jewel' : 'led',
        hideLabel: true,
      },
    ],
    description: amp.description,
  }
}
