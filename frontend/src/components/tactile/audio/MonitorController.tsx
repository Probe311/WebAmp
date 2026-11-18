import type { ReactNode } from 'react'
import { SlidersHorizontal, Volume1, VolumeX } from 'lucide-react'
import { cx } from '../../ui/cx'
import { Panel, SegmentedPills } from '../primitives'

export type MonitorSource = 'mic' | 'line' | 'inst' | 'usb'
export type MonitorBus = 'A' | 'B'

export interface MonitorState {
  source: MonitorSource
  /** Alimentation fantôme +48 V (micro uniquement). */
  phantom: boolean
  pad: boolean
  /** Inversion de phase. */
  phase: boolean
  /** Filtre passe-haut. */
  hpf: boolean
  monitor: MonitorBus
  /** Niveau du bus monitor (0–1). */
  volume: number
  dim: boolean
  mute: boolean
}

export const DEFAULT_MONITOR_STATE: MonitorState = {
  source: 'mic',
  phantom: false,
  pad: false,
  phase: false,
  hpf: false,
  monitor: 'A',
  volume: 1,
  dim: false,
  mute: false,
}

type ToggleKey = 'phantom' | 'pad' | 'phase' | 'hpf' | 'dim' | 'mute'

export interface MonitorControllerProps {
  value: MonitorState
  onChange: (value: MonitorState) => void
  label?: string
  className?: string
  /** false : pas de préampli matériel (navigateur) → +48V/PAD/Ø/HPF désactivés. */
  preampAvailable?: boolean
}

interface KeyProps {
  label: string
  active: boolean
  onToggle: () => void
  disabled?: boolean
  danger?: boolean
  icon?: ReactNode
}

/** Touche à voyant : creuse et allumée quand elle est active. */
function Key({ label, active, onToggle, disabled, danger, icon }: KeyProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      disabled={disabled}
      onClick={onToggle}
      className={cx(
        'flex min-h-11 flex-1 cursor-pointer select-none flex-col items-center justify-center gap-1 rounded-2xl px-2 py-1.5 text-[11px] font-bold transition-[color,box-shadow] duration-150 disabled:cursor-not-allowed disabled:opacity-40',
        active
          ? cx('neu-pressed', danger ? 'text-rose-500' : 'text-[color:var(--neu-accent)]')
          : 'neu-flat-sm text-[color:var(--neu-text-muted)]'
      )}
    >
      <span
        aria-hidden="true"
        className={cx(
          'h-1.5 w-1.5 rounded-full',
          active
            ? danger
              ? 'bg-rose-500 shadow-[0_0_6px_#f43f5e]'
              : 'bg-[color:var(--neu-accent)] shadow-[0_0_6px_var(--neu-accent)]'
            : 'bg-[color:var(--neu-bg-hollow)]'
        )}
      />
      <span className="flex items-center gap-1">
        {icon}
        {label}
      </span>
    </button>
  )
}

const SECTION_TITLE = 'text-[10px] font-bold uppercase tracking-wider text-[color:var(--neu-text-faint)]'

/**
 * Contrôleur d'entrée et de monitoring d'une interface audio.
 * Le +48 V n'est actif que sur l'entrée micro : on le coupe en changeant de
 * source, une alimentation fantôme sur une entrée ligne/instrument peut
 * endommager le matériel branché.
 */
export function MonitorController({
  value,
  onChange,
  label = 'ENTRÉE & MONITORING',
  className,
  preampAvailable = true,
}: MonitorControllerProps) {
  const patch = (changes: Partial<MonitorState>) => onChange({ ...value, ...changes })
  const toggle = (key: ToggleKey) => patch({ [key]: !value[key] } as Partial<MonitorState>)

  return (
    <Panel depth="flat" className={cx('flex w-full max-w-md flex-col gap-4 rounded-3xl p-5', className)}>
      <div className="flex items-center gap-2.5 border-b border-[color:var(--neu-edge)] pb-3">
        <span className="neu-flat-sm grid h-8 w-8 place-items-center rounded-full text-[color:var(--neu-accent)]">
          <SlidersHorizontal className="h-4 w-4" />
        </span>
        <h4 className="text-xs font-bold tracking-tight text-[color:var(--neu-text)]">{label}</h4>
      </div>

      <section className="flex flex-col gap-2">
        <span className={SECTION_TITLE}>Source</span>
        <SegmentedPills
          label="Source d'entrée"
          size="sm"
          value={value.source}
          onChange={(source) => patch({ source, phantom: source === 'mic' && value.phantom })}
          options={[
            { value: 'mic', label: 'MIC' },
            { value: 'line', label: 'LINE' },
            { value: 'inst', label: 'INST' },
            { value: 'usb', label: 'USB' },
          ]}
        />
      </section>

      <section className="flex flex-col gap-2">
        <span className={SECTION_TITLE}>Préampli</span>
        <div className="flex gap-2.5">
          <Key label="+48V" danger active={value.phantom} disabled={!preampAvailable || value.source !== 'mic'} onToggle={() => toggle('phantom')} />
          <Key label="PAD" active={value.pad} disabled={!preampAvailable || value.source === 'usb'} onToggle={() => toggle('pad')} />
          <Key label="Ø" active={value.phase} disabled={!preampAvailable} onToggle={() => toggle('phase')} />
          <Key label="HPF" active={value.hpf} disabled={!preampAvailable} onToggle={() => toggle('hpf')} />
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <span className={SECTION_TITLE}>Sortie monitor</span>
        <SegmentedPills
          label="Enceintes"
          size="sm"
          value={value.monitor}
          onChange={(monitor) => patch({ monitor })}
          options={[
            { value: 'A', label: 'Monitor A' },
            { value: 'B', label: 'Monitor B' },
          ]}
        />
        <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[color:var(--neu-text-faint)]">
          NIVEAU
          <input
            type="range"
            min={0}
            max={100}
            value={Math.round(value.volume * 100)}
            onChange={(e) => patch({ volume: Number(e.target.value) / 100 })}
            className="w-full accent-[color:var(--neu-accent)]"
            aria-label="Niveau monitor"
          />
        </label>
        <div className="flex gap-2.5">
          <Key label="DIM" icon={<Volume1 className="h-3 w-3" />} active={value.dim} onToggle={() => toggle('dim')} />
          <Key label="MUTE" danger icon={<VolumeX className="h-3 w-3" />} active={value.mute} onToggle={() => toggle('mute')} />
        </div>
      </section>
    </Panel>
  )
}
