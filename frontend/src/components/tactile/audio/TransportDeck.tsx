import { useEffect, useRef, useState } from 'react'
import { Circle, Pause, Play, Repeat, SkipBack, SkipForward, Square } from 'lucide-react'
import { cx } from '../../ui/cx'
import { useControllable } from '../lib/useControllable'

const FPS = 30
const SEEK_SECONDS = 5

/** Secondes → `MM:SS:FF` (images à 30 i/s). */
export function formatTimecode(seconds: number): string {
  const safe = Math.max(0, seconds)
  const mm = Math.floor(safe / 60)
  const ss = Math.floor(safe % 60)
  const ff = Math.floor((safe % 1) * FPS)
  return [mm, ss, ff].map((part) => String(part).padStart(2, '0')).join(':')
}

export interface TransportDeckProps {
  playing?: boolean
  /** Alias kit. */
  isPlaying?: boolean
  defaultPlaying?: boolean
  onPlayingChange?: (playing: boolean) => void
  onPlayPause?: (playing: boolean) => void
  recording?: boolean
  isRecording?: boolean
  defaultRecording?: boolean
  onRecordingChange?: (recording: boolean) => void
  onRecord?: (recording: boolean) => void
  looping?: boolean
  isLooping?: boolean
  defaultLooping?: boolean
  onLoopingChange?: (looping: boolean) => void
  onLoop?: (looping: boolean) => void
  /** Position en secondes. Absente : le deck avance seul pendant la lecture. */
  time?: number
  timecode?: string
  onSeek?: (seconds: number) => void
  onRewind?: () => void
  onForward?: () => void
  onStop?: () => void
  bpm?: number
  label?: string
  showDisplay?: boolean
  className?: string
}

/** Console de transport : lecture, arrêt, navigation, enregistrement, boucle. */
export function TransportDeck({
  playing,
  isPlaying: isPlayingAlias,
  defaultPlaying = false,
  onPlayingChange,
  onPlayPause,
  recording,
  isRecording: isRecordingAlias,
  defaultRecording = false,
  onRecordingChange,
  onRecord,
  looping,
  isLooping: isLoopingAlias,
  defaultLooping = false,
  onLoopingChange,
  onLoop,
  time,
  timecode,
  onSeek,
  onRewind,
  onForward,
  onStop,
  bpm = 120,
  label = 'TRANSPORT DECK',
  showDisplay = true,
  className,
}: TransportDeckProps) {
  const [isPlaying, setPlaying] = useControllable(
    playing ?? isPlayingAlias,
    defaultPlaying,
    (next) => {
      onPlayingChange?.(next)
      onPlayPause?.(next)
    }
  )
  const [isRecording, setRecording] = useControllable(
    recording ?? isRecordingAlias,
    defaultRecording,
    (next) => {
      onRecordingChange?.(next)
      onRecord?.(next)
    }
  )
  const [isLooping, setLooping] = useControllable(
    looping ?? isLoopingAlias,
    defaultLooping,
    (next) => {
      onLoopingChange?.(next)
      onLoop?.(next)
    }
  )
  const [innerTime, setInnerTime] = useState(0)
  const current = time ?? innerTime
  const currentRef = useRef(current)
  currentRef.current = current

  useEffect(() => {
    if (!isPlaying || time !== undefined) return
    const id = window.setInterval(() => setInnerTime((value) => value + 0.1), 100)
    return () => window.clearInterval(id)
  }, [isPlaying, time])

  const seek = (seconds: number) => {
    const next = Math.max(0, seconds)
    if (time === undefined) setInnerTime(next)
    onSeek?.(next)
  }

  const stop = () => {
    setPlaying(false)
    setRecording(false)
    seek(0)
    onStop?.()
  }

  const toggleRecord = () => {
    const next = !isRecording
    setRecording(next)
    if (next) setPlaying(true)
  }

  const displayTime = timecode ?? formatTimecode(current)
  const status = isRecording ? 'REC' : isPlaying ? 'PLAY' : 'STOP'

  return (
    <div
      role="group"
      aria-label="Transport audio"
      className={cx(
        'neu-flat flex w-full max-w-md select-none flex-col gap-4 rounded-3xl border border-[color:var(--neu-edge)] p-5 sm:p-6',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className={cx(
              'h-2.5 w-2.5 rounded-full transition-all',
              isRecording
                ? 'animate-pulse bg-rose-500 shadow-[0_0_8px_#f43f5e]'
                : isPlaying
                  ? 'bg-[color:var(--neu-accent)] shadow-[0_0_8px_var(--neu-accent)]'
                  : 'bg-[color:var(--neu-text-faint)]'
            )}
          />
          <span className="text-[11px] font-bold uppercase tracking-wider text-[color:var(--neu-text)]">
            {label}
          </span>
        </div>

        <span className="neu-inset rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold text-[color:var(--neu-text-muted)]">
          {bpm} BPM · 4/4
        </span>
      </div>

      {showDisplay && (
        <div className="neu-inset flex w-full items-center justify-between rounded-2xl border border-[color:var(--neu-bg-hollow)]/60 px-5 py-3.5">
          <div className="flex flex-col">
            <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-[color:var(--neu-text-faint)]">
              Timecode Master
            </span>
            <output
              aria-label="Position"
              className="font-mono text-xl font-extrabold tabular-nums tracking-wider text-[color:var(--neu-text)] sm:text-2xl"
            >
              {displayTime}
            </output>
          </div>

          <div className="flex flex-col items-end gap-1">
            <span
              className={cx(
                'rounded-full px-2.5 py-0.5 font-mono text-[9px] font-bold uppercase',
                isRecording
                  ? 'bg-rose-500/15 text-rose-600'
                  : isPlaying
                    ? 'bg-[color:var(--neu-accent-soft)] text-[color:var(--neu-accent)]'
                    : 'neu-flat-sm text-[color:var(--neu-text-faint)]'
              )}
            >
              {status}
            </span>
            <span className="font-mono text-[9px] text-[color:var(--neu-text-faint)]">48 kHz / 24-bit</span>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between gap-2 pt-1 sm:gap-3">
        <button
          type="button"
          aria-label="Boucle"
          aria-pressed={isLooping}
          title="Boucle (Loop)"
          onClick={() => setLooping(!isLooping)}
          className={cx(
            'flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-all duration-150',
            isLooping
              ? 'neu-pressed text-[color:var(--neu-accent)]'
              : 'neu-flat text-[color:var(--neu-text-muted)] hover:text-[color:var(--neu-text)] active:neu-pressed'
          )}
        >
          <Repeat className="h-4 w-4" />
        </button>

        <button
          type="button"
          aria-label="Rembobiner"
          title="Rembobiner (-5s)"
          onClick={() => {
            seek(currentRef.current - SEEK_SECONDS)
            onRewind?.()
          }}
          className="neu-flat flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-[color:var(--neu-text-muted)] transition-all duration-150 hover:text-[color:var(--neu-accent)] active:neu-pressed"
        >
          <SkipBack className="h-4 w-4 fill-current" />
        </button>

        <button
          type="button"
          aria-label="Arrêter"
          title="Arrêter (Stop)"
          onClick={stop}
          className="neu-flat flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-[color:var(--neu-text-muted)] transition-all duration-150 hover:text-[color:var(--neu-text)] active:neu-pressed"
        >
          <Square className="h-4 w-4 fill-current" />
        </button>

        <button
          type="button"
          aria-label={isPlaying ? 'Pause' : 'Lecture'}
          aria-pressed={isPlaying}
          title={isPlaying ? 'Pause' : 'Lecture (Play)'}
          onClick={() => setPlaying(!isPlaying)}
          className={cx(
            'flex h-14 w-14 cursor-pointer items-center justify-center rounded-full transition-all duration-150',
            isPlaying
              ? 'neu-accent-btn scale-[1.03]'
              : 'neu-flat text-[color:var(--neu-accent)] hover:scale-105 active:neu-pressed'
          )}
        >
          {isPlaying ? <Pause className="h-6 w-6 fill-current" /> : <Play className="ml-0.5 h-6 w-6 fill-current" />}
        </button>

        <button
          type="button"
          aria-label="Avancer"
          title="Avance rapide (+5s)"
          onClick={() => {
            seek(currentRef.current + SEEK_SECONDS)
            onForward?.()
          }}
          className="neu-flat flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-[color:var(--neu-text-muted)] transition-all duration-150 hover:text-[color:var(--neu-accent)] active:neu-pressed"
        >
          <SkipForward className="h-4 w-4 fill-current" />
        </button>

        <button
          type="button"
          aria-label="Enregistrer"
          aria-pressed={isRecording}
          title="Enregistrer (Rec)"
          onClick={toggleRecord}
          className={cx(
            'flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-all duration-150',
            isRecording
              ? 'neu-pressed text-rose-500 ring-2 ring-rose-400/50'
              : 'neu-flat text-rose-500/75 hover:text-rose-600 active:neu-pressed'
          )}
        >
          <Circle className={cx('h-4 w-4 fill-current', isRecording && 'animate-pulse')} />
        </button>
      </div>
    </div>
  )
}
