import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cx } from '../../ui/cx'
import { getInstrumentBus, subscribeInstrumentBus } from '../../../audio/sessionInstrumentBus'

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
const WHITE_SEMITONES = [0, 2, 4, 5, 7, 9, 11]
const BLACK_AFTER = new Set([0, 1, 3, 4, 5])
const OCTAVES = 2
const WHITE_COUNT = OCTAVES * 7
const BLACK_WIDTH = (100 / WHITE_COUNT) * 0.6
const MIN_OCTAVE = 0
const MAX_OCTAVE = 6
const PITCH_BEND_CENTS = 200
const VIBRATO_CENTS = 60

const midiToFrequency = (midi: number) => 440 * 2 ** ((midi - 69) / 12)
const midiToName = (midi: number) => `${NOTE_NAMES[midi % 12]}${Math.floor(midi / 12) - 1}`

interface Voice {
  ctx: AudioContext
  osc: OscillatorNode
  gain: GainNode
  lfo: OscillatorNode
  depth: GainNode
}

export interface PianoKeyboardProps {
  octave?: number
  defaultOctave?: number
  onOctaveChange?: (octave: number) => void
  /** Son WebAudio (pas de CTA UI — toujours actif si true). */
  enableSound?: boolean
  defaultSound?: boolean
  onSoundChange?: (enabled: boolean) => void
  onNoteOn?: (midi: number, frequency: number) => void
  onNoteOff?: (midi: number) => void
  onPitchChange?: (pitch: number) => void
  onModChange?: (mod: number) => void
  /** Contexte hôte (ex. moteur session) — par défaut contexte interne au clavier. */
  audioContext?: AudioContext
  /** @deprecated titre = barre de fenêtre shell */
  label?: string
  className?: string
}

const octBtn =
  'inline-grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-xl neu-cta-flat text-[color:var(--neu-text)] transition-shadow disabled:opacity-40'

/**
 * Clavier 2 octaves Softube/NEU — fill fenêtre, pas de scroll, curseurs pitch/mod.
 */
export function PianoKeyboard({
  octave: octaveProp,
  defaultOctave = 3,
  onOctaveChange,
  enableSound,
  defaultSound = false,
  onNoteOn,
  onNoteOff,
  onPitchChange,
  onModChange,
  audioContext,
  className,
}: PianoKeyboardProps) {
  const [octave, setOctave] = useState(octaveProp ?? defaultOctave)
  const sound = enableSound ?? defaultSound
  const [pitch, setPitch] = useState(0) // bipolar : 0 = 50 % (centre)
  const [mod, setMod] = useState(0.5)
  const [held, setHeld] = useState<ReadonlySet<number>>(new Set())

  useEffect(() => {
    if (octaveProp != null) setOctave(octaveProp)
  }, [octaveProp])

  const audioRef = useRef<AudioContext | null>(null)
  const voices = useRef(new Map<number, Voice>())
  const pitchRef = useRef(pitch)
  const modRef = useRef(mod)
  pitchRef.current = pitch
  modRef.current = mod

  const baseMidi = 12 * (octave + 1)
  const rangeLabel = `${midiToName(baseMidi)} – ${midiToName(baseMidi + OCTAVES * 12 - 1)}`

  const startVoice = useCallback((midi: number) => {
    if (voices.current.has(midi)) return
    // Destination décidée par la session (bus instrument), jamais par la page
    const bus = getInstrumentBus()
    const busCtx = bus?.context as AudioContext | undefined
    const ctx = audioContext ?? busCtx ?? (audioRef.current ??= new AudioContext())
    void ctx.resume()
    const osc = ctx.createOscillator()
    const lfo = ctx.createOscillator()
    const depth = ctx.createGain()
    const gain = ctx.createGain()
    osc.type = 'triangle'
    osc.frequency.value = midiToFrequency(midi)
    osc.detune.value = pitchRef.current * PITCH_BEND_CENTS
    lfo.frequency.value = 5.5
    depth.gain.value = modRef.current * VIBRATO_CENTS
    gain.gain.setValueAtTime(0, ctx.currentTime)
    gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.01)
    lfo.connect(depth)
    depth.connect(osc.detune)
    osc.connect(gain)
    const target = bus && bus.context === ctx ? bus : ctx.destination
    try {
      gain.connect(target)
    } catch {
      // bus d'un contexte fermé : la voix reste audible sur la destination
      gain.connect(ctx.destination)
    }
    osc.start()
    lfo.start()
    voices.current.set(midi, { ctx, osc, gain, lfo, depth })
  }, [audioContext])

  // Le bus de session change (ouverture/fermeture Mix, DAW) : on ré-achemine
  // les voix tenues au lieu de les laisser sur l'ancien bus.
  useEffect(() => {
    return subscribeInstrumentBus((bus) => {
      voices.current.forEach((voice) => {
        try {
          voice.gain.disconnect()
          voice.gain.connect(bus && bus.context === voice.ctx ? bus : voice.ctx.destination)
        } catch {
          /* contexte fermé : la voix va s'éteindre d'elle-même */
        }
      })
    })
  }, [])

  const stopVoice = useCallback((midi: number) => {
    const voice = voices.current.get(midi)
    if (!voice) return
    voices.current.delete(midi)
    // Le contexte est celui de la voix : il peut venir de la session, pas de audioRef
    const ctx = voice.ctx
    voice.gain.gain.setTargetAtTime(0, ctx.currentTime, 0.04)
    voice.osc.stop(ctx.currentTime + 0.3)
    voice.lfo.stop(ctx.currentTime + 0.3)
  }, [])

  const press = (midi: number) => {
    if (held.has(midi)) return
    setHeld((previous) => new Set(previous).add(midi))
    if (sound) startVoice(midi)
    onNoteOn?.(midi, midiToFrequency(midi))
  }

  const release = (midi: number) => {
    if (!held.has(midi)) return
    setHeld((previous) => {
      const next = new Set(previous)
      next.delete(midi)
      return next
    })
    stopVoice(midi)
    onNoteOff?.(midi)
  }

  useEffect(() => {
    voices.current.forEach(({ osc }) => (osc.detune.value = pitch * PITCH_BEND_CENTS))
  }, [pitch])
  useEffect(() => {
    voices.current.forEach(({ depth }) => (depth.gain.value = mod * VIBRATO_CENTS))
  }, [mod])

  useEffect(() => {
    const active = voices.current
    return () => {
      active.forEach(({ osc, lfo }) => {
        osc.stop()
        lfo.stop()
      })
      active.clear()
      // audioRef n'est rempli que si le contexte appartient au clavier
      void audioRef.current?.close()
      audioRef.current = null
    }
  }, [])

  const keyHandlers = (midi: number) => ({
    onPointerDown: (event: PointerEvent<HTMLButtonElement>) => {
      event.preventDefault()
      event.currentTarget.releasePointerCapture?.(event.pointerId)
      press(midi)
    },
    onPointerEnter: (event: PointerEvent<HTMLButtonElement>) => event.buttons === 1 && press(midi),
    onPointerUp: () => release(midi),
    onPointerLeave: () => release(midi),
    onPointerCancel: () => release(midi),
    onBlur: () => release(midi),
    onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => {
      if ((event.key === ' ' || event.key === 'Enter') && !event.repeat) {
        event.preventDefault()
        press(midi)
      }
    },
    onKeyUp: (event: KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === ' ' || event.key === 'Enter') release(midi)
    },
  })

  const shiftOctave = (delta: number) => {
    held.forEach((midi) => {
      stopVoice(midi)
      onNoteOff?.(midi)
    })
    setHeld(new Set())
    setOctave((current) => {
      const next = Math.min(MAX_OCTAVE, Math.max(MIN_OCTAVE, current + delta))
      onOctaveChange?.(next)
      return next
    })
  }

  const whiteKeys = Array.from({ length: WHITE_COUNT }, (_, index) => ({
    index,
    midi: baseMidi + Math.floor(index / 7) * 12 + WHITE_SEMITONES[index % 7],
  }))

  return (
    <div
      className={cx(
        // pas de double chrome fenêtre : fill + coins bas = well contenu
        'flex h-full min-h-0 w-full min-w-0 select-none flex-col gap-2',
        className
      )}
    >
      <div className="flex shrink-0 items-center justify-between gap-2">
        <span className="neu-inset rounded-2xl px-2 py-1 font-mono text-[10px] font-bold text-[color:var(--neu-accent)]">
          {rangeLabel}
        </span>

        <div className="neu-inset flex items-center gap-1 rounded-2xl p-1.5">
          <button
            type="button"
            aria-label="Octave inférieure"
            disabled={octave <= MIN_OCTAVE}
            onClick={() => shiftOctave(-1)}
            className={octBtn}
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <span className="min-w-12 px-1 text-center font-mono text-[10px] font-bold tabular-nums text-[color:var(--neu-text)]">
            OCT {octave}
          </span>
          <button
            type="button"
            aria-label="Octave supérieure"
            disabled={octave >= MAX_OCTAVE}
            onClick={() => shiftOctave(1)}
            className={octBtn}
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 gap-2">
        {/* Pitch + Mod dans le même well Softube */}
        <div className="neu-inset flex shrink-0 gap-1 rounded-2xl px-1.5 py-2">
          <VerticalSlider
            label="PITCH"
            value={pitch}
            bipolar
            onChange={(v) => {
              setPitch(v)
              onPitchChange?.(v)
            }}
            onRelease={() => {
              setPitch(0)
              onPitchChange?.(0)
            }}
          />
          <VerticalSlider
            label="MOD"
            value={mod}
            onChange={(v) => {
              setMod(v)
              onModChange?.(v)
            }}
          />
        </div>

        <div className="relative flex min-h-0 min-w-0 flex-1 overflow-hidden rounded-2xl neu-inset p-1.5">
          <div className="relative flex h-full min-h-0 w-full gap-[3px]">
            {whiteKeys.map(({ index, midi }) => {
              const first = index === 0
              const last = index === WHITE_COUNT - 1
              return (
              <button
                key={midi}
                type="button"
                aria-label={midiToName(midi)}
                aria-pressed={held.has(midi)}
                className={cx(
                  'flex flex-1 cursor-pointer touch-none items-end justify-center pb-1.5 text-[9px] font-bold text-[color:var(--neu-piano-white-label)] transition-[box-shadow,background-color] duration-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--neu-accent)]/60',
                  // 1re / dernière : coins extérieurs alignés au well ; milieu : bas seulement
                  first && 'rounded-l-xl rounded-br-lg',
                  last && 'rounded-r-xl rounded-bl-lg',
                  !first && !last && 'rounded-b-lg',
                  held.has(midi)
                    ? 'neu-pressed bg-[color:var(--neu-piano-white-held)]'
                    : 'neu-cta-flat bg-[color:var(--neu-piano-white)]'
                )}
                {...keyHandlers(midi)}
              >
                {index % 7 === 0 ? midiToName(midi) : ''}
              </button>
              )
            })}

            {whiteKeys
              .filter(({ index }) => BLACK_AFTER.has(index % 7))
              .map(({ index, midi }) => {
                const blackMidi = midi + 1
                return (
                  <button
                    key={blackMidi}
                    type="button"
                    aria-label={midiToName(blackMidi)}
                    aria-pressed={held.has(blackMidi)}
                    className={cx(
                      'absolute top-0 z-10 h-[58%] cursor-pointer touch-none rounded-b-md transition-[box-shadow,background] duration-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--neu-accent)]/60',
                      held.has(blackMidi)
                        ? 'bg-[color:var(--neu-accent)] shadow-[0_2px_8px_var(--neu-accent-glow)]'
                        : 'bg-gradient-to-b from-[color:var(--neu-piano-black-from)] to-[color:var(--neu-piano-black-to)] shadow-[var(--neu-piano-black-shadow)]'
                    )}
                    style={{
                      width: `${BLACK_WIDTH}%`,
                      left: `${((index + 1) / WHITE_COUNT) * 100 - BLACK_WIDTH / 2}%`,
                    }}
                    {...keyHandlers(blackMidi)}
                  />
                )
              })}
          </div>
        </div>
      </div>
    </div>
  )
}

/** Curseur vertical Softube — piste inset + pouce orange. */
function VerticalSlider({
  label,
  value,
  bipolar = false,
  onChange,
  onRelease,
}: {
  label: string
  value: number
  bipolar?: boolean
  onChange: (v: number) => void
  onRelease?: () => void
}) {
  const trackRef = useRef<HTMLDivElement>(null)

  const valueFromY = (clientY: number) => {
    const el = trackRef.current
    if (!el) return value
    const rect = el.getBoundingClientRect()
    const t = 1 - (clientY - rect.top) / rect.height
    const clamped = Math.max(0, Math.min(1, t))
    if (bipolar) return Number((clamped * 2 - 1).toFixed(3))
    return Number(clamped.toFixed(3))
  }

  const thumbTop = bipolar ? `${((1 - value) / 2) * 100}%` : `${(1 - value) * 100}%`

  return (
    <div className="flex w-7 shrink-0 flex-col items-center gap-1">
      <div
        ref={trackRef}
        role="slider"
        tabIndex={0}
        aria-label={label}
        aria-valuemin={bipolar ? -100 : 0}
        aria-valuemax={100}
        aria-valuenow={Math.round(value * 100)}
        className="relative min-h-0 w-3.5 flex-1 cursor-ns-resize touch-none rounded-full bg-[color:var(--neu-bg)] shadow-[inset_2px_2px_5px_rgba(var(--neu-shadow-dark),0.65),inset_-2px_-2px_5px_rgba(var(--neu-shadow-light),0.9)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--neu-accent)]/50"
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId)
          onChange(valueFromY(e.clientY))
        }}
        onPointerMove={(e) => {
          if (e.buttons === 0) return
          onChange(valueFromY(e.clientY))
        }}
        onPointerUp={() => onRelease?.()}
        onPointerCancel={() => onRelease?.()}
      >
        {bipolar && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0.5 top-1/2 h-px -translate-y-1/2 bg-[color:var(--neu-edge)]"
          />
        )}
        <span
          aria-hidden
          className="pointer-events-none absolute left-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[color:var(--neu-accent)] shadow-[0_1px_4px_var(--neu-accent-glow)]"
          style={{ top: thumbTop }}
        />
      </div>
      <span className="text-[7px] font-bold tracking-wider text-[color:var(--neu-text-faint)]">{label}</span>
    </div>
  )
}
