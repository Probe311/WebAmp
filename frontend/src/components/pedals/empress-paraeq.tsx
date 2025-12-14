
import { useMemo } from 'react'
import { pedalLibrary } from '../../data/pedals'
import { PedalFrame } from './PedalFrame'
import { Slider } from '../Slider'
import type { PedalComponentProps } from './types'

const pedalId = 'empress-paraeq'

/**
 * Composant complet de la pédale Empress Paraeq
 * Layout EQ : sliders verticaux pour les bandes EQ + contrôle level séparé
 */
export function EmpressParaeqPedal({ 
  values = {}, 
  onChange, 
  bypassed = false,
  onBypassToggle,
  bottomActions
,
  accentColor}: PedalComponentProps) {
  const model = useMemo(() => pedalLibrary.find((p) => p.id === pedalId), [])
  
  if (!model) return null

  // Utiliser accentColor depuis les props, avec fallback sur model.accentColor
  const pedalAccentColor = accentColor || model.accentColor

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
      <div className="flex items-end gap-2 flex-1 justify-center">
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
              color={pedalAccentColor}
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
            color={pedalAccentColor}
          />
        </div>
      )}
    </div>
  ), [bands, level, levelDef, levelName, values, onChange, model.accentColor])

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
export const EmpressParaeqControls = ({
  values = {},
  onChange,
  accentColor,
}: PedalComponentProps) => {
  const model = pedalLibrary.find((p) => p.id === pedalId)
  if (!model) return null

  // Utiliser accentColor depuis les props, avec fallback sur model.accentColor
  const pedalAccentColor = accentColor || model.accentColor

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

  return (
    <div className="flex items-end gap-2 w-full">
      {/* Colonnes des bandes EQ */}
      <div className="flex items-end gap-2 flex-1 justify-center">
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
              color={pedalAccentColor}
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
            color={pedalAccentColor}
          />
        </div>
      )}
    </div>
  )
}

export default EmpressParaeqPedal

