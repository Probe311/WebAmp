import { useEffect, useRef, useState } from 'react'
import { Eraser, ListMusic, Square, X } from 'lucide-react'
import { cx } from '../../ui/cx'
import { useControllable } from '../lib/useControllable'
import { useDismissible } from '../lib/useDismissible'

export const SEQUENCER_STEPS = 16

/**
 * Ordre kit : cymbales → charley → caisse claire → grosse caisse → toms.
 * Aligné sur `DrumInstrument` (legacy DrumMachinePanel).
 */
export const SEQUENCER_TRACKS = [
  'CRASH',
  'RIDE',
  'CHINA',
  'HH-CL',
  'OHAT',
  'SNARE',
  'KICK',
  'TOM1',
  'TOM2',
  'TOM3',
  'TOM4',
] as const

/** Une couleur par piste — même palette que `INSTRUMENT_COLORS` legacy. */
export const TRACK_COLORS = [
  '#f59e0b', // crash
  '#8b5cf6', // ride
  '#14b8a6', // china
  '#10b981', // hh-cl
  '#06b6d4', // ohat
  '#3b82f6', // snare
  '#ef4444', // kick
  '#ec4899', // tom1
  '#F26A1B', // tom2
  '#a855f7', // tom3
  '#64748b', // tom4 floor (plus grave)
] as const

/** Grille 11 pistes × 16 pas. */
export type SequencerPattern = boolean[][]

export type SequencerPreset =
  | 'house'
  | 'techno'
  | 'break'
  | 'rock'
  | 'funk'
  | 'hiphop'
  | 'jazz'
  | 'dnb'
  | 'disco'
  | 'latin'

const EMPTY = '................'
const parse = (rows: readonly string[]): SequencerPattern =>
  rows.map((row) => [...row.padEnd(SEQUENCER_STEPS, '.').slice(0, SEQUENCER_STEPS)].map((char) => char === 'x'))

const withTracks = (rows: readonly string[]): SequencerPattern => {
  const filled = [...rows]
  while (filled.length < SEQUENCER_TRACKS.length) filled.push(EMPTY)
  return parse(filled.slice(0, SEQUENCER_TRACKS.length))
}

/** Style préenregistré : BPM réaliste + grille 11×16. */
export interface SequencerPresetDef {
  bpm: number
  pattern: SequencerPattern
}

/** 10 styles — BPM genre + lignes dans l’ordre `SEQUENCER_TRACKS` (TOM4 = floor). */
export const SEQUENCER_PRESETS: Record<SequencerPreset, SequencerPresetDef> = {
  house: {
    bpm: 124,
    pattern: withTracks([
      '..............x.',
      EMPTY,
      EMPTY,
      '..x...x...x...x.',
      '...x..x....x....',
      '....x.......x...',
      'x...x...x...x...',
      EMPTY,
      EMPTY,
      EMPTY,
      EMPTY, // tom4
    ]),
  },
  techno: {
    bpm: 130,
    pattern: withTracks([
      '............x...',
      EMPTY,
      EMPTY,
      'x.x.x.x.x.x.x.x.',
      '..x..x..x..x..x.',
      '....x.......x...',
      'x...x...x...x...',
      '....x...........',
      '........x.......',
      '............x...',
      EMPTY,
    ]),
  },
  break: {
    bpm: 140,
    pattern: withTracks([
      '..............x.',
      EMPTY,
      EMPTY,
      'x.x.x.x.x.x.x.x.',
      '......x.......x.',
      '....x..x.x..x...',
      'x.....x...x.....',
      '..x.............',
      '......x.........',
      '..........x.....',
      '............x...',
    ]),
  },
  rock: {
    bpm: 110,
    pattern: withTracks([
      'x...............', // crash on 1
      EMPTY,
      EMPTY,
      'x.x.x.x.x.x.x.x.', // charley 8ths
      EMPTY,
      '....x.......x...', // snare 2 & 4
      'x...x...x...x...', // kick classique
      '............x...', // fill toms
      '.............x..',
      '..............x.',
      '...............x', // floor tom (plus grave)
    ]),
  },
  funk: {
    bpm: 95,
    pattern: withTracks([
      EMPTY,
      EMPTY,
      EMPTY,
      'x.x...x.x.x.x.x.',
      '...x........x...',
      '....x.....x...x.',
      'x..x..x.x..x....',
      EMPTY,
      EMPTY,
      EMPTY,
      EMPTY,
    ]),
  },
  hiphop: {
    bpm: 90,
    pattern: withTracks([
      EMPTY,
      EMPTY,
      EMPTY,
      'x.x.x.x.x.x.x.x.',
      '..............x.',
      '....x.......x...',
      'x..x....x.x.....',
      EMPTY,
      EMPTY,
      EMPTY,
      EMPTY,
    ]),
  },
  jazz: {
    bpm: 140,
    pattern: withTracks([
      EMPTY,
      'x.x.x.x.x.x.x.x.',
      EMPTY,
      EMPTY,
      '......x.......x.',
      '....x.......x...',
      'x.......x.......',
      EMPTY,
      EMPTY,
      EMPTY,
      EMPTY,
    ]),
  },
  dnb: {
    bpm: 174,
    pattern: withTracks([
      '..............x.',
      EMPTY,
      EMPTY,
      'x.x.x.x.x.x.x.x.',
      '..x...x...x...x.',
      '..x...x.x.x...x.',
      'x..x.x..x..x.x..',
      '............x...',
      '.............x..',
      '..............x.',
      '...............x',
    ]),
  },
  disco: {
    bpm: 120,
    pattern: withTracks([
      'x...............',
      EMPTY,
      EMPTY,
      'x.x.x.x.x.x.x.x.',
      '......x.......x.',
      '....x.......x...',
      'x...x...x...x...',
      EMPTY,
      EMPTY,
      EMPTY,
      EMPTY,
    ]),
  },
  latin: {
    bpm: 115,
    pattern: withTracks([
      EMPTY,
      '..x...x...x...x.',
      '..............x.',
      'x.x.x.x.x.x.x.x.',
      '....x.......x...',
      '..x...x...x...x.',
      'x.......x.x.....',
      '........x.......',
      '..........x.....',
      '............x...',
      '..............x.',
    ]),
  },
}

export const emptyPattern = (): SequencerPattern =>
  SEQUENCER_TRACKS.map(() => Array<boolean>(SEQUENCER_STEPS).fill(false))

export const PRESET_OPTIONS: { value: SequencerPreset; label: string; bpm: number }[] = (
  Object.keys(SEQUENCER_PRESETS) as SequencerPreset[]
).map((value) => ({
  value,
  label: (
    {
      house: 'House',
      techno: 'Techno',
      break: 'Break',
      rock: 'Rock',
      funk: 'Funk',
      hiphop: 'Hip-Hop',
      jazz: 'Jazz',
      dnb: 'D&B',
      disco: 'Disco',
      latin: 'Latin',
    } as const
  )[value],
  bpm: SEQUENCER_PRESETS[value].bpm,
}))

const MIN_BPM = 60
const MAX_BPM = 200
const clampBpm = (value: number) => Math.min(MAX_BPM, Math.max(MIN_BPM, Math.round(value)))

export interface StepSequencerProps {
  pattern?: SequencerPattern
  defaultPattern?: SequencerPattern
  onPatternChange?: (pattern: SequencerPattern) => void
  playing?: boolean
  isPlaying?: boolean
  defaultPlaying?: boolean
  onPlayingChange?: (playing: boolean) => void
  bpm?: number
  defaultBpm?: number
  onBpmChange?: (bpm: number) => void
  onStep?: (step: number, tracks: number[]) => void
  label?: string
  className?: string
}

/** Séquenceur 10×16 Softube/NEU — play carré arrondi, pads fluid, presets modale. */
export function StepSequencer({
  pattern,
  defaultPattern = SEQUENCER_PRESETS.rock.pattern,
  onPatternChange,
  playing,
  isPlaying: isPlayingProp,
  defaultPlaying = false,
  onPlayingChange,
  bpm: bpmProp,
  defaultBpm = SEQUENCER_PRESETS.rock.bpm,
  onBpmChange,
  onStep,
  label = 'SÉQUENCEUR 16 STEPS',
  className,
}: StepSequencerProps) {
  const [grid, setGrid] = useControllable(pattern, defaultPattern, onPatternChange)
  const playingSource = isPlayingProp ?? playing
  const [isPlaying, setPlaying] = useControllable(playingSource, defaultPlaying, onPlayingChange)
  const [bpm, setBpm] = useControllable(bpmProp, defaultBpm, onBpmChange)
  const [step, setStep] = useState(-1)
  const [preset, setPreset] = useState<SequencerPreset | null>('rock')
  const [presetsOpen, setPresetsOpen] = useState(false)
  const presetsPanelRef = useDismissible<HTMLDivElement>(presetsOpen, () => setPresetsOpen(false))

  const live = useRef({ grid, onStep })
  live.current = { grid, onStep }

  useEffect(() => {
    if (!isPlaying) {
      setStep(-1)
      return
    }
    let current = -1
    const tick = () => {
      current = (current + 1) % SEQUENCER_STEPS
      setStep(current)
      const tracks = live.current.grid.flatMap((row, index) => (row[current] ? [index] : []))
      live.current.onStep?.(current, tracks)
    }
    tick()
    const id = window.setInterval(tick, 60000 / bpm / 4)
    return () => window.clearInterval(id)
  }, [isPlaying, bpm])

  const nudgeBpm = (delta: number) => setBpm(clampBpm(bpm + delta))

  const toggle = (track: number, index: number) => {
    setPreset(null)
    setGrid(grid.map((row, t) => (t === track ? row.map((on, i) => (i === index ? !on : on)) : row)))
  }

  const applyPreset = (next: SequencerPreset) => {
    const def = SEQUENCER_PRESETS[next]
    setPreset(next)
    setGrid(def.pattern.map((row) => [...row]))
    setBpm(def.bpm)
    setPresetsOpen(false)
  }

  const stepLabel = step < 0 ? `— / ${SEQUENCER_STEPS}` : `${step + 1} / ${SEQUENCER_STEPS}`
  const presetLabel = preset ? PRESET_OPTIONS.find((option) => option.value === preset)?.label : null

  return (
    <div
      className={cx(
        // pas de neu-window imbriqué : l’ombre externe est coupée par WindowFrame overflow-hidden
        'flex h-full min-h-0 w-full flex-col gap-2 rounded-[var(--td-radius-panel)] border border-[color:var(--neu-edge)] bg-[color:var(--neu-bg)] p-3',
        className
      )}
    >
      <header className="flex shrink-0 flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            aria-label={isPlaying ? 'Stop' : 'Lecture'}
            aria-pressed={isPlaying}
            onClick={() => setPlaying(!isPlaying)}
            className={cx(
              'inline-grid h-11 w-11 shrink-0 cursor-pointer place-items-center rounded-2xl transition-shadow',
              isPlaying
                ? 'neu-accent-btn'
                : 'neu-cta-flat text-[color:var(--neu-accent)]'
            )}
          >
            {isPlaying ? (
              <Square className="h-3.5 w-3.5 fill-current" />
            ) : (
              <span className="ml-0.5 border-y-[6px] border-l-[10px] border-y-transparent border-l-current" />
            )}
          </button>
          <p
            className="font-mono text-[11px] font-bold tabular-nums text-[color:var(--neu-text-muted)]"
            aria-label={label}
          >
            {bpm} BPM <span className="text-[color:var(--neu-text-faint)]">·</span> PAS {stepLabel}
            {presetLabel ? (
              <>
                {' '}
                <span className="text-[color:var(--neu-text-faint)]">·</span> {presetLabel}
              </>
            ) : null}
          </p>
        </div>

        <div className="relative flex items-center gap-1.5">
          <div
            className="flex h-8 items-center gap-0.5 rounded-xl neu-cta-flat px-1"
            role="group"
            aria-label="Tempo BPM"
          >
            <button
              type="button"
              aria-label="Diminuer le BPM"
              disabled={bpm <= MIN_BPM}
              onClick={() => nudgeBpm(-1)}
              className="inline-grid h-6 w-6 cursor-pointer place-items-center rounded-lg text-[color:var(--neu-text-muted)] transition-shadow hover:text-[color:var(--neu-text)] active:neu-pressed disabled:cursor-not-allowed disabled:opacity-40"
            >
              <span className="text-sm font-bold leading-none">−</span>
            </button>
            <input
              type="number"
              min={MIN_BPM}
              max={MAX_BPM}
              value={bpm}
              aria-label="BPM"
              onChange={(event) => {
                const next = Number(event.target.value)
                if (!Number.isNaN(next)) setBpm(clampBpm(next))
              }}
              className="w-10 appearance-none border-0 bg-transparent text-center font-mono text-[11px] font-bold tabular-nums text-[color:var(--neu-text)] outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            <button
              type="button"
              aria-label="Augmenter le BPM"
              disabled={bpm >= MAX_BPM}
              onClick={() => nudgeBpm(1)}
              className="inline-grid h-6 w-6 cursor-pointer place-items-center rounded-lg text-[color:var(--neu-text-muted)] transition-shadow hover:text-[color:var(--neu-text)] active:neu-pressed disabled:cursor-not-allowed disabled:opacity-40"
            >
              <span className="text-sm font-bold leading-none">+</span>
            </button>
          </div>
          <button
            type="button"
            aria-label="Styles préenregistrés"
            aria-expanded={presetsOpen}
            aria-haspopup="dialog"
            onClick={() => setPresetsOpen((open) => !open)}
            className={cx(
              'inline-grid h-8 w-8 cursor-pointer place-items-center rounded-xl transition-shadow',
              presetsOpen
                ? 'neu-pressed text-[color:var(--neu-accent)]'
                : 'neu-cta-flat text-[color:var(--neu-text-muted)] hover:text-[color:var(--neu-text)] active:neu-pressed'
            )}
          >
            <ListMusic className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            aria-label="Vider le motif"
            onClick={() => {
              setPreset(null)
              setGrid(emptyPattern())
            }}
            className="inline-grid h-8 w-8 cursor-pointer place-items-center rounded-xl neu-cta-flat text-[color:var(--neu-text-muted)] transition-shadow hover:text-[color:var(--neu-text)] active:neu-pressed"
          >
            <Eraser className="h-3.5 w-3.5" />
          </button>

          {presetsOpen ? (
            <div
              ref={presetsPanelRef}
              role="dialog"
              aria-label="Styles préenregistrés"
              className="neu-flat-lg absolute right-0 top-full z-40 mt-2 w-[min(100vw-2rem,18rem)] rounded-2xl border border-[color:var(--neu-edge)] p-3"
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[color:var(--neu-text-muted)]">
                  10 styles
                </p>
                <button
                  type="button"
                  aria-label="Fermer"
                  onClick={() => setPresetsOpen(false)}
                  className="inline-grid h-6 w-6 place-items-center rounded-lg text-[color:var(--neu-text-faint)] hover:text-[color:var(--neu-text)]"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {PRESET_OPTIONS.map(({ value, label: optionLabel, bpm: presetBpm }) => {
                  const selected = preset === value
                  return (
                    <button
                      key={value}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => applyPreset(value)}
                      className={cx(
                        'flex min-h-9 cursor-pointer flex-col justify-center rounded-xl px-2.5 py-1.5 text-left neu-cta-flat transition-shadow active:neu-pressed',
                        selected
                          ? 'text-[color:var(--neu-accent)]'
                          : 'text-[color:var(--neu-text)] hover:text-[color:var(--neu-accent)]'
                      )}
                    >
                      <span className="text-xs font-bold">{optionLabel}</span>
                      <span className="font-mono text-[9px] font-bold tabular-nums text-[color:var(--neu-text-faint)]">
                        {presetBpm} BPM
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          ) : null}
        </div>
      </header>

      {/* Bleed ombres léger ; gaps resserrés pour 11 pistes sans scroll vertical */}
      <div className="custom-scrollbar min-h-0 flex-1 overflow-x-auto overflow-y-auto px-1 pb-1.5 pt-0.5">
        <div
          role="grid"
          aria-label="Séquenceur"
          className="grid w-full min-w-[36rem] gap-x-1.5 gap-y-1"
          style={{
            // largeur colonnes inchangée → cases aspect-square stables
            gridTemplateColumns: `4.75rem repeat(${SEQUENCER_STEPS}, minmax(0, 1fr))`,
          }}
        >
          <div aria-hidden className="col-start-1 row-start-1" />
          {Array.from({ length: SEQUENCER_STEPS }, (_, index) => (
            <div
              key={`head-${index}`}
              className={cx(
                'col-start-auto row-start-1 flex flex-col items-center gap-0.5',
                index % 4 === 3 && index !== SEQUENCER_STEPS - 1 && 'mr-1'
              )}
              style={{ gridColumn: index + 2 }}
            >
              <span
                className={cx(
                  'h-2 w-2 rounded-full transition-colors',
                  index === step
                    ? 'bg-[color:var(--neu-accent)] shadow-[0_0_6px_var(--neu-accent)]'
                    : 'bg-[color:var(--neu-bg-hollow)]'
                )}
              />
              <span
                className={cx(
                  'font-mono text-[9px] font-bold',
                  index === step ? 'text-[color:var(--neu-accent)]' : 'text-[color:var(--neu-text-faint)]'
                )}
              >
                {index + 1}
              </span>
            </div>
          ))}

          {SEQUENCER_TRACKS.map((name, track) => {
            const armed = grid[track]?.some(Boolean)
            const color = TRACK_COLORS[track]
            const row = track + 2
            return (
              <div key={name} role="row" className="contents">
                <div
                  role="rowheader"
                  className={cx(
                    'flex h-full min-h-0 items-center justify-between gap-1 self-stretch rounded-xl px-2 py-1 font-mono text-[9px] font-bold tracking-wider',
                    armed
                      ? 'neu-cta-flat text-[color:var(--neu-text)]'
                      : 'neu-inset text-[color:var(--neu-text-muted)]'
                  )}
                  style={{ gridColumn: 1, gridRow: row }}
                >
                  <span className="truncate">{name}</span>
                  <span
                    aria-hidden
                    className={cx(
                      'h-1.5 w-1.5 shrink-0 rounded-full',
                      !armed && 'bg-[color:var(--neu-bg-hollow)]'
                    )}
                    style={
                      armed
                        ? { backgroundColor: color, boxShadow: `0 0 5px ${color}` }
                        : undefined
                    }
                  />
                </div>
                {Array.from({ length: SEQUENCER_STEPS }, (_, index) => {
                  const on = !!grid[track]?.[index]
                  const here = index === step
                  // lecture sur case armée → inverse (carré couleur, LED éteinte)
                  const hit = on && here
                  return (
                    <button
                      key={`${name}-${index}`}
                      type="button"
                      role="gridcell"
                      aria-label={`${name} pas ${index + 1}`}
                      aria-pressed={on}
                      onClick={() => toggle(track, index)}
                      className={cx(
                        'grid aspect-square w-full min-w-0 place-items-center rounded-xl transition-[box-shadow,background-color,opacity] duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--neu-accent)]/60',
                        index % 4 === 3 && index !== SEQUENCER_STEPS - 1 && 'mr-1',
                        // défaut = fond classique ; hit lecture = invert couleur
                        hit ? undefined : on ? 'neu-pressed' : 'neu-cta-flat',
                        here && !hit && 'ring-1 ring-[color:var(--neu-accent)]/50'
                      )}
                      style={{
                        gridColumn: index + 2,
                        gridRow: row,
                        ...(hit
                          ? {
                              backgroundColor: color,
                              boxShadow: `inset 2px 2px 4px rgba(0,0,0,0.28), 0 0 10px ${color}66`,
                            }
                          : undefined),
                      }}
                    >
                      <span
                        aria-hidden
                        className={cx(
                          'block h-0.5 w-[55%] max-w-3.5 rounded-full',
                          hit
                            ? 'bg-black/25'
                            : on
                              ? undefined
                              : 'bg-[color:var(--neu-bg-hollow)]'
                        )}
                        style={
                          on && !hit
                            ? { backgroundColor: color, boxShadow: `0 0 6px ${color}` }
                            : undefined
                        }
                      />
                    </button>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
