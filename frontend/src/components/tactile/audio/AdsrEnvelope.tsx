import { Spline } from 'lucide-react'
import { cx } from '../../ui/cx'
import { RangeField } from '../forms/RangeField'
import { Panel, SegmentedPills } from '../primitives'

export interface AdsrValues {
  /** Attaque, décroissance, relâchement : en millisecondes. */
  attack: number
  decay: number
  /** Niveau de maintien 0 → 1. */
  sustain: number
  release: number
}

export type AdsrPresetName = 'Pluck' | 'Pad' | 'Lead' | 'Bass'

export const ADSR_PRESETS: Record<AdsrPresetName, AdsrValues> = {
  Pluck: { attack: 2, decay: 180, sustain: 0, release: 120 },
  Pad: { attack: 900, decay: 600, sustain: 0.8, release: 1500 },
  Lead: { attack: 10, decay: 200, sustain: 0.7, release: 250 },
  Bass: { attack: 5, decay: 300, sustain: 0.5, release: 100 },
}

const MAX_MS = 2000
const VIEW_W = 320
const VIEW_H = 120
const PAD = 8
const SLOT = (VIEW_W - 2 * PAD) / 4

/** Points du tracé : chaque phase occupe au plus un quart de la largeur. */
export function envelopePoints({ attack, decay, sustain, release }: AdsrValues): Array<[number, number]> {
  const top = PAD
  const bottom = VIEW_H - PAD
  const level = (amount: number) => bottom - amount * (bottom - top)
  const width = (ms: number) => (Math.min(MAX_MS, Math.max(0, ms)) / MAX_MS) * SLOT
  const attackEnd = PAD + width(attack)
  const decayEnd = attackEnd + width(decay)
  const sustainEnd = decayEnd + SLOT
  return [
    [PAD, bottom],
    [attackEnd, top],
    [decayEnd, level(sustain)],
    [sustainEnd, level(sustain)],
    [sustainEnd + width(release), bottom],
  ]
}

export interface AdsrEnvelopeProps {
  value: AdsrValues
  onChange: (value: AdsrValues) => void
  label?: string
  className?: string
}

/** Enveloppe ADSR : tracé SVG, quatre curseurs et préréglages. */
export function AdsrEnvelope({ value, onChange, label = 'ENVELOPPE ADSR', className }: AdsrEnvelopeProps) {
  const points = envelopePoints(value)
  const line = points.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
  const area = `${line} ${points[points.length - 1][0].toFixed(1)},${VIEW_H - PAD} ${PAD},${VIEW_H - PAD}`
  const presetNames = Object.keys(ADSR_PRESETS) as AdsrPresetName[]
  const activePreset = presetNames.find((name) =>
    (Object.keys(value) as Array<keyof AdsrValues>).every((key) => ADSR_PRESETS[name][key] === value[key])
  )

  return (
    <Panel depth="flat" className={cx('flex w-full max-w-md flex-col gap-4 rounded-3xl p-5', className)}>
      <div className="flex items-center gap-2.5 border-b border-[color:var(--neu-edge)] pb-3">
        <span className="neu-flat-sm grid h-8 w-8 place-items-center rounded-full text-[color:var(--neu-accent)]">
          <Spline className="h-4 w-4" />
        </span>
        <h4 className="text-xs font-bold tracking-tight text-[color:var(--neu-text)]">{label}</h4>
      </div>

      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        role="img"
        aria-label={`Enveloppe : attaque ${value.attack} ms, décroissance ${value.decay} ms, maintien ${Math.round(value.sustain * 100)} %, relâchement ${value.release} ms`}
        className="block h-auto w-full rounded-2xl neu-inset"
      >
        {[1, 2, 3].map((i) => (
          <line key={i} x1={PAD + SLOT * i} x2={PAD + SLOT * i} y1={PAD} y2={VIEW_H - PAD} stroke="var(--neu-bg-hollow)" strokeDasharray="3 3" />
        ))}
        <polygon points={area} fill="var(--neu-accent-soft)" />
        <polyline points={line} fill="none" stroke="var(--neu-accent)" strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
        {points.slice(1, 4).map(([x, y], index) => (
          <circle key={index} cx={x} cy={y} r={4} fill="var(--neu-bg)" stroke="var(--neu-accent)" strokeWidth={2} />
        ))}
      </svg>

      <SegmentedPills
        label="Préréglages"
        size="sm"
        value={activePreset ?? ('' as AdsrPresetName)}
        onChange={(name) => onChange({ ...ADSR_PRESETS[name] })}
        options={presetNames.map((name) => ({ value: name, label: name }))}
      />

      <div className="grid grid-cols-2 gap-x-5 gap-y-3">
        <RangeField label="Attaque" unit="ms" min={0} max={MAX_MS} step={1} value={value.attack} onChange={(attack) => onChange({ ...value, attack })} />
        <RangeField label="Décroissance" unit="ms" min={0} max={MAX_MS} step={1} value={value.decay} onChange={(decay) => onChange({ ...value, decay })} />
        <RangeField
          label="Maintien"
          unit="%"
          value={Math.round(value.sustain * 100)}
          onChange={(percent) => onChange({ ...value, sustain: percent / 100 })}
        />
        <RangeField label="Relâchement" unit="ms" min={0} max={MAX_MS} step={1} value={value.release} onChange={(release) => onChange({ ...value, release })} />
      </div>
    </Panel>
  )
}
