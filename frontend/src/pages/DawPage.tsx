import { useEffect, useMemo, useRef, useState } from 'react'
import { Plus } from 'lucide-react'
import { AppPageShell } from '../components/shell/AppPageShell'
import {
  AudioLevelMeter,
  JogWheel,
  Panel,
  PianoKeyboard,
  PillButton,
  SegmentedPills,
  SpectrumKnob,
  TempoTap,
  TransportDeck,
  WaveformDisplay,
  demoPeaks,
} from '../components/tactile'
import { SESSION_TRACKS, type SessionTrackDef } from '../audio/sessionTracks'
import { usePedalboardEngine } from '../hooks/usePedalboardEngine'
import { getSessionMixer } from '../audio/sessionMixer'
import { getLooperSessionBuffer } from '../audio/looperSession'
import { useDrumMachine } from '../contexts/DrumMachineContext'
import { generateWaveformData } from '../components/looper/utils'
import { clipsFor, createClip, type SessionClip } from '../audio/sessionClips'

type StudioTab = 'arrangement' | 'edition' | 'transport' | 'midi'

const STUDIO_TABS = [
  { value: 'arrangement' as const, label: 'Arrangement' },
  { value: 'edition' as const, label: 'Édition' },
  { value: 'transport' as const, label: 'Transport' },
  { value: 'midi' as const, label: 'MIDI' },
]

const DURATION = 8
const clamp01 = (n: number) => Math.min(1, Math.max(0, n))

interface LaneState {
  muted: boolean
  solo: boolean
  volume: number
}

function MidiLaneBlocks({ color, position }: { color: string; position: number }) {
  const blocks = [
    { left: 8, w: 14 },
    { left: 28, w: 10 },
    { left: 45, w: 18 },
    { left: 70, w: 12 },
  ]
  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl neu-inset">
      {blocks.map((b, i) => (
        <div
          key={i}
          className="absolute top-2 bottom-2 rounded-md opacity-90"
          style={{
            left: `${b.left}%`,
            width: `${b.w}%`,
            background: color,
          }}
        />
      ))}
      <div
        className="pointer-events-none absolute inset-y-0 w-0.5 bg-[color:var(--neu-accent)]"
        style={{ left: `${position * 100}%` }}
      />
    </div>
  )
}

function TrackHeader({
  track,
  state,
  selected,
  onSelect,
  onPatch,
}: {
  track: SessionTrackDef
  state: LaneState
  selected: boolean
  onSelect: () => void
  onPatch: (patch: Partial<LaneState>) => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex w-[148px] shrink-0 flex-col gap-1.5 rounded-2xl border border-[color:var(--neu-edge)] p-2 text-left transition-shadow ${
        selected ? 'ring-2 ring-[#F26A1B]/40' : ''
      } neu-flat`}
    >
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: track.color }} />
        <span className="truncate text-xs font-bold text-[color:var(--neu-text)]">{track.name}</span>
      </div>
      <div className="flex items-center gap-1">
        <button
          type="button"
          aria-label={`Mute ${track.name}`}
          aria-pressed={state.muted}
          onClick={(e) => {
            e.stopPropagation()
            onPatch({ muted: !state.muted })
          }}
          className={`h-6 w-6 rounded-full text-[10px] font-bold ${
            state.muted ? 'neu-pressed text-[var(--td-danger)]' : 'neu-flat-sm text-[color:var(--neu-text-faint)]'
          }`}
        >
          M
        </button>
        <button
          type="button"
          aria-label={`Solo ${track.name}`}
          aria-pressed={state.solo}
          onClick={(e) => {
            e.stopPropagation()
            onPatch({ solo: !state.solo })
          }}
          className={`h-6 w-6 rounded-full text-[10px] font-bold ${
            state.solo ? 'neu-pressed text-amber-600' : 'neu-flat-sm text-[color:var(--neu-text-faint)]'
          }`}
        >
          S
        </button>
      </div>
      <SpectrumKnob
        size="sm"
        label="VOL"
        value={Math.round(state.volume * 100)}
        onChange={(v) => onPatch({ volume: v / 100 })}
        className="scale-90 origin-left"
      />
    </button>
  )
}

/** Studio NEU : Arrangement · Édition · Transport · MIDI — bus session + looper. */
export function DawPage() {
  const { engine, start } = usePedalboardEngine()
  const mixer = useMemo(() => getSessionMixer(), [])
  const {
    outputRouted: drumRouted,
    setBpm: setDrumBpm,
    setIsPlaying: setDrumPlaying,
  } = useDrumMachine()
  const loopSourceRef = useRef<AudioBufferSourceNode | null>(null)
  const playStartRef = useRef(0)
  const playOriginRef = useRef(0)

  const [tab, setTab] = useState<StudioTab>('arrangement')
  const [tracks, setTracks] = useState(() =>
    SESSION_TRACKS.map((t) => ({
      ...t,
      muted: false,
      solo: false,
      volume: 0.75,
    }))
  )
  const [selectedId, setSelectedId] = useState(SESSION_TRACKS[0].id)
  const [playing, setPlaying] = useState(false)
  const [bpm, setBpm] = useState(120)
  const [position, setPosition] = useState(0)
  const [jog, setJog] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [masterLevels, setMasterLevels] = useState({ left: 0, right: 0 })
  const [loopPeaks, setLoopPeaks] = useState<number[]>(() => demoPeaks(160))
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null)
  const [clips, setClips] = useState<SessionClip[]>([])

  const peaks = loopPeaks
  const overviewPeaks = useMemo(() => loopPeaks.slice(0, 96), [loopPeaks])

  const selected = tracks.find((t) => t.id === selectedId) ?? tracks[0]

  useEffect(() => {
    let cancelled = false
    const boot = async () => {
      try {
        await start()
        const ctx = engine.getAudioContext()
        if (!ctx || cancelled) return
        // Guitare + batterie branchées par la session, pas par cette page
        mixer.ensure(ctx)
        setAudioCtx(ctx)
        const buf = getLooperSessionBuffer()
        if (buf) {
          const data = buf.getChannelData(0)
          setLoopPeaks(generateWaveformData(data, 160).map((p) => Math.min(1, p / 100)))
        }
      } catch {
        /* ignore */
      }
    }
    void boot()
    return () => {
      cancelled = true
      loopSourceRef.current?.stop()
      loopSourceRef.current = null
    }
  }, [engine, start, mixer])

  useEffect(() => {
    const id = window.setInterval(() => {
      const m = mixer.getMasterLevels()
      setMasterLevels({ left: m.left, right: m.right })
      const buf = getLooperSessionBuffer()
      if (buf && !playing) {
        const data = buf.getChannelData(0)
        setLoopPeaks(generateWaveformData(data, 160).map((p) => Math.min(1, p / 100)))
      }
    }, 100)
    return () => window.clearInterval(id)
  }, [mixer, playing])

  // Lecture du looper : seulement dans la fenêtre du clip (sinon tout le transport).
  useEffect(() => {
    if (!playing) return
    const ctx = engine.getAudioContext()
    if (!ctx) return
    const loopClip = clips.find((clip) => clip.trackId === 'loops')

    const syncLoops = (pos: number) => {
      const buf = getLooperSessionBuffer()
      const loopsIn = mixer.getTrackInput('loops')
      if (!buf || !loopsIn) return
      const active = !loopClip || (pos >= loopClip.start && pos < loopClip.end)
      if (active && !loopSourceRef.current) {
        const src = ctx.createBufferSource()
        src.buffer = buf
        src.loop = true
        src.connect(loopsIn)
        src.start()
        loopSourceRef.current = src
      } else if (!active && loopSourceRef.current) {
        stopLoopSource()
      }
    }

    syncLoops(playOriginRef.current)
    let raf = 0
    const tick = () => {
      const elapsed = ctx.currentTime - playStartRef.current
      const next = clamp01(playOriginRef.current + elapsed / DURATION)
      setPosition(next)
      setJog(next * 360)
      syncLoops(next)
      if (next >= 1) {
        stopLoopSource()
        setDrumPlaying(false)
        setPlaying(false)
        return
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [playing, engine, mixer, clips, setDrumPlaying])

  const stopLoopSource = () => {
    try {
      loopSourceRef.current?.stop()
    } catch {
      /* ignore */
    }
    loopSourceRef.current = null
  }

  const setPlayingSafe = async (next: boolean) => {
    if (!next) {
      stopLoopSource()
      setDrumPlaying(false)
      setPlaying(false)
      return
    }
    await start()
    const ctx = engine.getAudioContext()
    if (!ctx) return
    if (ctx.state === 'suspended') await ctx.resume()
    mixer.ensure(ctx)
    stopLoopSource()
    // Batterie : pattern réel synchronisé au BPM du transport (bus Drums du mixer).
    setDrumBpm(bpm)
    setDrumPlaying(true)
    playStartRef.current = ctx.currentTime
    playOriginRef.current = position >= 1 ? 0 : position
    if (position >= 1) {
      setPosition(0)
      setJog(0)
    }
    setPlaying(true)
  }

  const seekPosition = (next: number) => {
    const bounded = clamp01(next)
    setPosition(bounded)
    setJog(bounded * 360)
    if (playing) {
      playOriginRef.current = bounded
      playStartRef.current = engine.getAudioContext()?.currentTime ?? 0
    }
  }

  const addClip = () => {
    // Seule la lane Loops pilote la lecture : pas de clip décoratif ailleurs
    const length = Math.min(1, (4 * 60) / bpm / DURATION)
    setClips((prev) => [...prev, createClip('loops', position >= 1 ? 0 : position, length)])
  }

  const removeClip = (id: string) => {
    setClips((prev) => prev.filter((clip) => clip.id !== id))
  }

  const patchTrack = (id: string, patch: Partial<LaneState>) => {
    setTracks((prev) => {
      const updated = prev.map((t) => (t.id === id ? { ...t, ...patch } : t))
      const busId = SESSION_TRACKS.find((t) => t.id === id)?.id
      if (busId) {
        const t = updated.find((x) => x.id === id)
        if (t) {
          mixer.applyChannel(
            busId,
            { volume: t.volume, pan: 0, muted: t.muted, solo: t.solo, armed: false },
            Object.fromEntries(
              updated.map((x) => [
                x.id,
                { volume: x.volume, pan: 0, muted: x.muted, solo: x.solo, armed: false },
              ])
            )
          )
        }
      }
      return updated
    })
  }

  const addTrack = () => {
    const n = tracks.length + 1
    const id = `track-${n}`
    setTracks((prev) => [
      ...prev,
      {
        id,
        name: `Piste ${n}`,
        color: '#94A3B8',
        kind: 'audio' as const,
        muted: false,
        solo: false,
        volume: 0.7,
      },
    ])
    setSelectedId(id)
  }

  return (
    <AppPageShell description="Arrangement, édition, transport, MIDI" fill>
      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden">
        <div className="flex flex-wrap items-center gap-3">
          <SegmentedPills label="Vue studio" options={STUDIO_TABS} value={tab} onChange={setTab} />
          {(tab === 'arrangement' || tab === 'transport') && (
            <span className="font-mono text-xs font-bold tabular-nums text-[color:var(--neu-text-muted)]">
              {bpm.toFixed(1)} BPM · 4/4
            </span>
          )}
        </div>

        {audioCtx && drumRouted === 'destination' && (
          <p className="shrink-0 text-[10px] font-bold text-[var(--td-danger)]">
            Batterie hors bus Mix (Tone déjà initialisé sur un autre contexte) : Mute Mix ne la coupe pas.
          </p>
        )}

        {(tab === 'arrangement' || tab === 'edition') && (
          <TransportDeck
            playing={playing}
            onPlayingChange={(v) => void setPlayingSafe(v)}
            onStop={() => {
              void setPlayingSafe(false)
              seekPosition(0)
            }}
            bpm={bpm}
            time={position * DURATION}
            onSeek={(seconds) => seekPosition(seconds / DURATION)}
            className="shrink-0"
          />
        )}

        {tab === 'arrangement' && (
          <div className="flex min-h-0 flex-1 gap-2 overflow-hidden">
            <div className="custom-scrollbar flex min-h-0 min-w-0 flex-1 flex-col gap-2 overflow-y-auto">
              {tracks.map((track) => (
                <div key={track.id} className="flex min-h-[72px] gap-2">
                  <TrackHeader
                    track={track}
                    state={track}
                    selected={track.id === selectedId}
                    onSelect={() => setSelectedId(track.id)}
                    onPatch={(patch) => patchTrack(track.id, patch)}
                  />
                  <div className="relative min-w-0 flex-1">
                    {track.kind === 'midi' ? (
                      <MidiLaneBlocks color={track.color} position={position} />
                    ) : (
                      <div className="relative h-full min-h-[72px]">
                        <WaveformDisplay
                          peaks={track.id === 'loops' ? peaks : demoPeaks(160)}
                          position={position}
                          onSeek={seekPosition}
                          hideTransport
                          className="!h-full !min-h-[72px] !p-1"
                        />
                        <div
                          className="pointer-events-none absolute inset-x-0 top-0 h-0.5"
                          style={{ background: track.color }}
                        />
                      </div>
                    )}
                    {clipsFor(clips, track.id).map((clip) => (
                      <button
                        key={clip.id}
                        type="button"
                        onClick={() => removeClip(clip.id)}
                        aria-label={`Retirer le clip ${track.name}`}
                        title="Retirer le clip"
                        className="absolute top-1 bottom-1 rounded-md border border-[color:var(--neu-accent)] bg-[color:var(--neu-accent)]/25"
                        style={{
                          left: `${clip.start * 100}%`,
                          width: `${Math.max(1.5, (clip.end - clip.start) * 100)}%`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              ))}
              <PillButton variant="neutral" iconLeft={<Plus className="h-4 w-4" />} onClick={addTrack}>
                Ajouter une piste
              </PillButton>
            </div>
            <AudioLevelMeter
              standalone
              showControls={false}
              isStereo
              leftLevel={masterLevels.left}
              rightLevel={masterLevels.right}
              label="OUT"
              height={280}
              className="w-[72px] shrink-0"
            />
          </div>
        )}

        {tab === 'arrangement' && (
          <div className="flex shrink-0 items-center gap-3 border-t border-[color:var(--neu-edge)] pt-2">
            <PillButton variant="neutral" size="sm" onClick={addClip}>
              Clip boucle + (1 mesure)
            </PillButton>
            <label className="flex items-center gap-2 text-[10px] font-bold text-[color:var(--neu-text-muted)]">
              Zoom
              <input
                type="range"
                min={1}
                max={4}
                step={0.5}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-24 accent-[color:var(--neu-accent)]"
              />
            </label>
            <div className="min-w-0 flex-1">
              <WaveformDisplay
                peaks={overviewPeaks}
                position={position}
                onSeek={seekPosition}
                loop={[0.1, 0.85]}
                hideTransport
                className="!p-1"
              />
            </div>
          </div>
        )}

        {tab === 'edition' && (
          <div className="flex min-h-0 flex-1 flex-wrap items-stretch gap-3 overflow-hidden">
            <Panel depth="flat" className="flex min-h-0 min-w-0 flex-1 flex-col gap-2 rounded-3xl p-3">
              <p className="text-xs font-bold text-[color:var(--neu-text)]">
                Édition — <span style={{ color: selected.color }}>{selected.name}</span>
              </p>
              <div className="min-h-0 flex-1">
                <WaveformDisplay
                  peaks={peaks}
                  position={position}
                  onSeek={seekPosition}
                  hideTransport
                  className="h-full"
                />
              </div>
            </Panel>
            <JogWheel
              size="sm"
              label="SCRUB"
              unit=""
              showReadout={false}
              value={jog}
              onChange={(value, delta) => {
                setJog(value)
                if (delta != null && delta !== 0) setPosition((p) => clamp01(p + delta * 0.004))
                else setPosition(clamp01((((value % 360) + 360) % 360) / 360))
              }}
            />
          </div>
        )}

        {tab === 'transport' && (
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4 overflow-auto p-2">
            <TransportDeck
              playing={playing}
              onPlayingChange={(v) => void setPlayingSafe(v)}
              onStop={() => {
                void setPlayingSafe(false)
                seekPosition(0)
              }}
              bpm={bpm}
              time={position * DURATION}
              onSeek={(seconds) => seekPosition(seconds / DURATION)}
              className="w-full max-w-xl"
            />
            <div className="flex flex-wrap items-start justify-center gap-4">
              <TempoTap bpm={bpm} onBpmChange={setBpm} enableClick label="TEMPO" />
              <JogWheel
                size="md"
                label="JOG"
                unit=""
                showReadout={false}
                value={jog}
                onChange={(value, delta) => {
                  setJog(value)
                  if (delta != null && delta !== 0) setPosition((p) => clamp01(p + delta * 0.004))
                  else setPosition(clamp01((((value % 360) + 360) % 360) / 360))
                }}
              />
            </div>
          </div>
        )}

        {tab === 'midi' && (
          <div className="flex min-h-0 flex-1 flex-col justify-end overflow-hidden">
            <p className="mb-2 text-xs font-bold text-[color:var(--neu-text-muted)]">
              Clavier — piste {tracks.find((t) => t.kind === 'midi')?.name ?? selected.name}
            </p>
            <PianoKeyboard enableSound audioContext={audioCtx ?? undefined} label="CLAVIER MIDI" />
          </div>
        )}
      </div>
    </AppPageShell>
  )
}
