import { useMemo } from 'react'
import { pedalLibrary } from '../../data/pedals'
import { PedalFrame } from './PedalFrame'
import { Slider } from '../Slider'
import type { PedalComponentProps } from './types'

const pedalId = 'boss-ge7'

/**
 * Composant complet de la pédale BOSS GE-7 (Equalizer 7 bandes)
 * Layout spécial : sliders verticaux pour les bandes EQ + slider level séparé
 */
export function BossGe7Pedal({ 
  values = {}, 
  onChange, 
  bypassed = false,
  onBypassToggle,
  bottomActions
}: PedalComponentProps) {
  const model = useMemo(() => pedalLibrary.find((p) => p.id === pedalId), [])
  
  if (!model) return null

  // Séparer les bandes EQ du contrôle level
  const { bands, level } = useMemo(() => {
    const bands: Array<[string, any]> = []
    let levelParam: [string, any] | null = null

    Object.entries(model.parameters).forEach(([name, def]) => {
      if (name.toLowerCase() === 'level') {
        levelParam = [name, def]
      } else {
        bands.push([name, def])
      }
    })

    return { bands, level: levelParam }
  }, [model.parameters])

  const levelDef: any = level ? level[1] : null
  const levelName = level ? level[0] : null

  const controls = useMemo(() => (
    <div className="flex items-end gap-2 w-full">
      {/* Colonnes des bandes EQ */}
      <div className="flex items-end gap-1.5 flex-1 justify-center">
        {bands.map(([name, def]) => {
          const value = values[name] ?? def.default ?? 0
          return (
            <Slider
              key={name}
              label={def.label}
              value={value}
              min={def.min}
              max={def.max}
              orientation="vertical"
              onChange={(v) => onChange?.(name, v)}
              color={model.accentColor}
            />
          )
        })}
      </div>
      {/* Contrôle level séparé si présent */}
      {level && levelDef && levelName && (
        <div className="ml-2">
          <Slider
            label={levelDef.label || 'Level'}
            value={values[levelName] ?? levelDef.default ?? 0}
            min={levelDef.min ?? 0}
            max={levelDef.max ?? 100}
            orientation="vertical"
            onChange={(v) => onChange?.(levelName, v)}
            color={model.accentColor}
          />
        </div>
      )}
    </div>
  ), [bands, level, levelDef, levelName, values, onChange, model])

  return (
    <PedalFrame
      model={model}
      layout="eq"
      bypassed={bypassed}
      onBypassToggle={onBypassToggle}
      showFootswitch={false}
      bottomActions={bottomActions}
    >
      {controls}
    </PedalFrame>
  )
}

// Export pour compatibilité avec l'ancien système
export const BossGe7Controls = ({
  values = {},
  onChange,
}: PedalComponentProps) => {
  const model = pedalLibrary.find((p) => p.id === pedalId)
  if (!model) return null

  const { bands, level } = useMemo(() => {
    const bands: Array<[string, any]> = []
    let levelParam: [string, any] | null = null

    Object.entries(model.parameters).forEach(([name, def]) => {
      if (name.toLowerCase() === 'level') {
        levelParam = [name, def]
      } else {
        bands.push([name, def])
      }
    })

    return { bands, level: levelParam }
  }, [model.parameters])

  const levelDef: any = level ? level[1] : null
  const levelName = level ? level[0] : null

  return (
    <div className="flex items-end gap-2 w-full">
      <div className="flex items-end gap-1.5 flex-1 justify-center">
        {bands.map(([name, def]) => {
          const value = values[name] ?? def.default ?? 0
          return (
            <Slider
              key={name}
              label={def.label}
              value={value}
              min={def.min}
              max={def.max}
              orientation="vertical"
              onChange={(v) => onChange?.(name, v)}
              color={model.accentColor}
            />
          )
        })}
      </div>
      {level && levelDef && levelName && (
        <div className="ml-2">
          <Slider
            label={levelDef.label || 'Level'}
            value={values[levelName] ?? levelDef.default ?? 0}
            min={levelDef.min ?? 0}
            max={levelDef.max ?? 100}
            orientation="vertical"
            onChange={(v) => onChange?.(levelName, v)}
            color={model.accentColor}
          />
        </div>
      )}
    </div>
  )
}

export default BossGe7Pedal

