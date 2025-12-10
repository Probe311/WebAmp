// Script to generate one TSX component per pedal from pedalLibrary
// Usage: node scripts/generatePedalComponents.js

const fs = require('fs')
const path = require('path')

const pedalIds = [
  'boss-ds1','proco-rat','ibanez-tube-screamer','electro-harmonix-big-muff','walrus-audio-distortion',
  'boss-sd1','fulltone-ocd','klon-centaur','ibanez-tube-screamer-mini','walrus-audio-drive',
  'dunlop-fuzz-face','zvex-fuzz-factory','electro-harmonix-muff','walrus-audio-fuzz',
  'boss-ch1','electro-harmonix-small-clone','walrus-audio-chorus','electro-harmonix-oceans-11','boss-ce1','mxr-analog-chorus',
  'boss-dd3','tc-electronic-flashback','walrus-audio-delay','strymon-timeline','echoplex-tape-delay','binson-echorec','memory-man-delay','roland-space-echo','tc-delay',
  'boss-rv6','electro-harmonix-holy-grail','walrus-audio-reverb','strymon-bigsky',
  'boss-bf3','electro-harmonix-electric-mistress','walrus-audio-flanger','mooer-e-lady','mxr-flanger-117',
  'boss-tr2','walrus-audio-tremolo','fulltone-supatrem','strymon-flint',
  'boss-ph3','electro-harmonix-small-stone','mooer-phaser','walrus-audio-phaser','mxr-phase90',
  'boss-ge7','mxr-10-band-eq','source-audio-programmable-eq','empress-paraeq',
  'vox-v847-wah','cry-baby-wah','slash-wah-sw95','evh-wah','kh95-wah','rmc-wah',
  'power-booster','light-boost','mxr-mc402',
  'mxr-dyna-comp',
  'octavia-fuzz','univibe','digitech-whammy','leslie-rotary',
  'boss-volume-expression','noise-gate','tc-gmajor2',
  // Pédales supplémentaires
  'ibanez-jemini','eventide-harmonizer','morley-bad-horsie','satchurator','vox-time-machine',
  'dunlop-crybaby-classic','killswitch-stutter','treble-booster','mesa-grid-slammer',
  'boss-ce2','boss-od1','jhs-at-drive','neunaber-reverb'
]

const outDir = path.join(__dirname, '../frontend/src/components/pedals')
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })

const toPascal = (str) =>
  str
    .replace(/(^|[-_])(\w)/g, (_, __, c) => (c || '').toUpperCase())
    .replace(/[^a-zA-Z0-9]/g, '')

const template = (id) => {
  const pascal = toPascal(id)
  const compName = `${pascal}Pedal`
  const controlsName = `${pascal}Controls`

  return `
import React from 'react'
import { pedalLibrary } from '../../data/pedals'
import { Pedal } from '../Pedal'
import { Potentiometer } from '../Potentiometer'
import { Slider } from '../Slider'
import { SwitchSelector } from '../SwitchSelector'

export interface PedalComponentProps {
  values?: Record<string, number>
  onChange?: (param: string, value: number) => void
  bypassed?: boolean
}

const pedalId = '${id}'

const buildControls = (
  params: Record<string, any>,
  values: Record<string, number>,
  onChange?: (param: string, value: number) => void
) => {
  return Object.entries(params).map(([name, def]) => {
    const controlType = (def as any).controlType || 'knob'
    const value = values[name] ?? (def as any).default ?? 0

    if (controlType === 'slider') {
      const orientation = (def as any).orientation || 'vertical'
      return (
        <Slider
          key={name}
          label={(def as any).label}
          value={value}
          min={(def as any).min}
          max={(def as any).max}
          orientation={orientation}
          onChange={(v) => onChange?.(name, v)}
          color={(def as any).color}
        />
      )
    }

    if (controlType === 'switch-selector' && (def as any).labels) {
      return (
        <SwitchSelector
          key={name}
          value={value}
          min={(def as any).min}
          max={(def as any).max}
          labels={(def as any).labels}
          icons={(def as any).icons}
          color={(def as any).color}
          onChange={(v) => onChange?.(name, v)}
        />
      )
    }

    return (
      <Potentiometer
        key={name}
        label={(def as any).label}
        value={value}
        min={(def as any).min}
        max={(def as any).max}
        color={(def as any).color}
        onChange={(v) => onChange?.(name, v)}
      />
    )
  })
}

export const ${controlsName} = ({
  values = {},
  onChange,
}: PedalComponentProps) => {
  const model = pedalLibrary.find((p) => p.id === pedalId)
  if (!model) return null
  const params = model.parameters
  return <>{buildControls(params, values, onChange)}</>
}

export const ${compName} = ({ values = {}, onChange, bypassed = false }: PedalComponentProps) => {
  const model = pedalLibrary.find((p) => p.id === pedalId)
  if (!model) return null
  const params = model.parameters

  return (
    <Pedal
      brand={model.brand}
      model={model.model}
      color={model.color}
      accentColor={model.accentColor}
      style={model.style as any}
      bypassed={bypassed}
      showFootswitch={false}
    >
      {buildControls(params, values, onChange)}
    </Pedal>
  )
}

export default ${compName}
`
}

pedalIds.forEach((id) => {
  const filePath = path.join(outDir, `${id}.tsx`)
  fs.writeFileSync(filePath, template(id), 'utf8')
})

console.log('Generated', pedalIds.length, 'pedal component files in', outDir)

