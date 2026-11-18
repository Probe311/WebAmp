import { useMemo, useRef, useState } from 'react'
import { Play } from 'lucide-react'
import { ChordDiagram } from '../components/learn/ChordDiagram'
import { CtaButton, SelectField } from '../components/tactile'
import { AppPageShell } from '../components/shell/AppPageShell'
import { CHORD_ROOTS, CHORD_QUALITIES, CHORD_DATABASE } from '../data/chords'
import type { Chord } from '../services/tablatures'

const ROOT_OPTIONS = CHORD_ROOTS.map((r) => ({ value: r, label: r }))
const QUALITY_OPTIONS = CHORD_QUALITIES.map((q) => ({ value: q, label: q }))

/** Accords ouverts EADGBE → MIDI. */
const OPEN_MIDI = [40, 45, 50, 55, 59, 64] as const
const midiToHz = (midi: number) => 440 * 2 ** ((midi - 69) / 12)

function chordFrequencies(chord: Chord): number[] {
  const base = chord.baseFret && chord.baseFret > 1 ? chord.baseFret - 1 : 0
  const freqs: number[] = []
  chord.frets.forEach((fret, i) => {
    if (fret < 0) return
    freqs.push(midiToHz(OPEN_MIDI[i] + base + fret))
  })
  return freqs
}

function playChordStrike(freqs: number[]) {
  const AudioCtor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
  if (!AudioCtor || freqs.length === 0) return
  const ctx = new AudioCtor()
  void ctx.resume()
  const now = ctx.currentTime
  freqs.forEach((hz, i) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'triangle'
    osc.frequency.value = hz
    const t0 = now + i * 0.035
    gain.gain.setValueAtTime(0, t0)
    gain.gain.linearRampToValueAtTime(0.12, t0 + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.001, t0 + 1.2)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(t0)
    osc.stop(t0 + 1.3)
  })
}

/** Dictionnaire d'accords — diagramme + lecture Web Audio. */
export function ChordsPage() {
  const [root, setRoot] = useState('C')
  const [quality, setQuality] = useState('Maj')
  const playingRef = useRef(false)

  const key = useMemo(() => `${root} ${quality}`, [root, quality])
  const chord = useMemo(() => CHORD_DATABASE[key] ?? null, [key])

  const play = () => {
    if (!chord || playingRef.current) return
    playingRef.current = true
    playChordStrike(chordFrequencies(chord))
    window.setTimeout(() => {
      playingRef.current = false
    }, 400)
  }

  return (
    <AppPageShell fill className="!overflow-hidden !px-2.5 !pb-2.5 !pt-2 sm:!px-2.5 sm:!pb-2.5 sm:!pt-2">
      <div className="flex min-h-0 flex-1 flex-col gap-2">
        <div className="grid shrink-0 grid-cols-[1fr_1fr_auto] gap-2">
          <SelectField aria-label="Fondamentale" options={ROOT_OPTIONS} value={root} onChange={setRoot} />
          <SelectField aria-label="Qualité" options={QUALITY_OPTIONS} value={quality} onChange={setQuality} />
          <CtaButton
            label="Jouer l'accord"
            size="m"
            tone="accent"
            onClick={play}
            disabled={!chord}
            className={!chord ? 'opacity-40' : undefined}
          >
            <Play className="h-4 w-4 fill-current" />
          </CtaButton>
        </div>

        <button
          type="button"
          onClick={play}
          disabled={!chord}
          className="neu-inset flex min-h-0 flex-1 cursor-pointer items-center justify-center overflow-hidden rounded-2xl p-2 disabled:cursor-default"
          aria-label={chord ? `Jouer ${chord.name}` : 'Accord indisponible'}
        >
          {chord ? (
            <ChordDiagram chord={chord} scale={0.95} compact />
          ) : (
            <p className="text-xs text-[color:var(--neu-text-muted)]">Accord indisponible</p>
          )}
        </button>
      </div>
    </AppPageShell>
  )
}
