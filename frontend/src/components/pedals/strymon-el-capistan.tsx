import { useMemo } from 'react'
import { pedalLibrary } from '../../data/pedals'
import { PedalFrame } from './PedalFrame'
import { Potentiometer } from '../Potentiometer'
import type { PedalComponentProps } from './types'

const pedalId = 'strymon-el-capistan'

/**
 * Composant complet de la pédale Strymon El Capistan
 * Layout spécial : 3 knobs en haut, 2 en bas
 */
export function StrymonElCapistanPedal({ 
  values = {}, 
  onChange, 
  bypassed = false,
  onBypassToggle,
  bottomActions
}: PedalComponentProps) {
  const model = useMemo(() => pedalLibrary.find((p) => p.id === pedalId), [])
  
  if (!model) return null

  const controls = useMemo(() => {
    return Object.entries(model.parameters).map(([name, def]) => {
      const value = values[name] ?? def.default ?? 0
      return (
        <Potentiometer
          key={name}
          label={def.label}
          value={value}
          min={def.min}
          max={def.max}
          color={model.accentColor}
          onChange={(v) => onChange?.(name, v)}
        />
      )
    })
  }, [model, values, onChange])

  // 3 knobs en haut, 2 en bas
  const topRow = controls.slice(0, 3)
  const bottomRow = controls.slice(3)

  const layoutControls = useMemo(() => (
    <div className="flex flex-col w-full items-center">
      <div className="flex flex-row justify-center items-center gap-2 w-full">
        {topRow}
      </div>
      <div className="flex flex-row justify-center items-center gap-2 w-full">
        {bottomRow}
      </div>
    </div>
  ), [topRow, bottomRow])

  return (
    <PedalFrame
      model={model}
      layout="flex"
      bypassed={bypassed}
      onBypassToggle={onBypassToggle}
      showFootswitch={false}
      bottomActions={bottomActions}
    >
      {layoutControls}
    </PedalFrame>
  )
}

// Export pour compatibilité avec l'ancien système
export const StrymonElCapistanControls = ({
  values = {},
  onChange,
}: PedalComponentProps) => {
  const model = pedalLibrary.find((p) => p.id === pedalId)
  if (!model) return null
  const params = model.parameters
  
  const controls = Object.entries(params).map(([name, def]) => {
    const value = values[name] ?? def.default ?? 0
    return (
      <Potentiometer
        key={name}
        label={def.label}
        value={value}
        min={def.min}
        max={def.max}
        color={model.accentColor}
        onChange={(v) => onChange?.(name, v)}
      />
    )
  })
  
  const topRow = controls.slice(0, 3)
  const bottomRow = controls.slice(3)
  
  return (
    <div className="flex flex-col w-full items-center">
      <div className="flex flex-row justify-center items-center gap-2 w-full">
        {topRow}
      </div>
      <div className="flex flex-row justify-center items-center gap-2 w-full">
        {bottomRow}
      </div>
    </div>
  )
}

export default StrymonElCapistanPedal

