import { useCallback, useState } from 'react'
import { AppPageShell } from '../components/shell/AppPageShell'
import {
  AudioGrid,
  StepSequencer,
  SEQUENCER_PRESETS,
  type SequencerPattern,
} from '../components/tactile'
import { useDrumMachine, type DrumInstrument } from '../contexts/DrumMachineContext'

/** Mapping piste séquenceur / pads → instrument moteur (ordre cymbales → toms). */
const TRACK_INSTRUMENTS: DrumInstrument[] = [
  'crash',
  'ride',
  'chinese',
  'hihat',
  'openhat',
  'snare',
  'kick',
  'tom1',
  'tom2',
  'tom3',
  'tom4',
]

/** Boîte à rythmes : pads + matrice réactive + séquenceur 11 pistes. */
export function DrumMachinePage() {
  const { playSound } = useDrumMachine()
  const [pads, setPads] = useState<readonly number[]>([0, 1, 4])
  const [pattern, setPattern] = useState<SequencerPattern>(() =>
    SEQUENCER_PRESETS.rock.pattern.map((row) => [...row])
  )
  const [playing, setPlaying] = useState(false)
  const [bpm, setBpm] = useState(SEQUENCER_PRESETS.rock.bpm)
  const [pulse, setPulse] = useState(0)

  const bumpMatrix = useCallback(() => {
    setPulse((n) => n + 1)
  }, [])

  const onStep = useCallback(
    (_step: number, tracks: number[]) => {
      if (tracks.length > 0) bumpMatrix()
      for (const index of tracks) {
        const instrument = TRACK_INSTRUMENTS[index]
        if (instrument) playSound(instrument)
      }
    },
    [bumpMatrix, playSound]
  )

  return (
    <AppPageShell fill className="!overflow-visible">
      <div className="flex min-h-0 flex-1 flex-col gap-4 lg:flex-row lg:items-stretch">
        <div className="flex min-h-0 w-full shrink-0 flex-col p-1.5 lg:w-[min(100%,300px)]">
          <AudioGrid
            mode="momentary"
            active={pads}
            onActiveChange={setPads}
            pulse={pulse}
            className="h-full"
            onTrigger={(index) => {
              setPads((prev) => (prev.includes(index) ? prev : [...prev, index]))
              bumpMatrix()
              const instrument = TRACK_INSTRUMENTS[index % TRACK_INSTRUMENTS.length]
              if (instrument) playSound(instrument)
            }}
          />
        </div>
        <div className="flex min-h-0 min-w-0 flex-1 flex-col p-1.5">
          <StepSequencer
            pattern={pattern}
            onPatternChange={setPattern}
            isPlaying={playing}
            onPlayingChange={setPlaying}
            bpm={bpm}
            onBpmChange={setBpm}
            onStep={onStep}
            className="min-h-0 w-full flex-1"
          />
        </div>
      </div>
    </AppPageShell>
  )
}
