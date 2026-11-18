import { useCallback, useEffect, useMemo, useState } from 'react'
import { AppPageShell } from '../components/shell/AppPageShell'
import {
  AudioLevelMeter,
  ChannelFader,
  DEFAULT_EQ_BANDS,
  DEFAULT_MONITOR_STATE,
  EMPTY_PATCH,
  MonitorController,
  Oscilloscope,
  PatchMatrix,
  Power,
  SegmentedPills,
  SelectField,
  SpectrumAnalyzer,
  SpectrumKnob,
  type EqBand,
  type MonitorState,
  type PatchGrid,
} from '../components/tactile'
import {
  MASTER_TRACK_ID,
  SESSION_TRACKS,
  initialChannelMap,
  type SessionChannelState,
} from '../audio/sessionTracks'
import { WebSocketClient } from '../services/websocket'
import { usePedalboardEngine } from '../hooks/usePedalboardEngine'
import { getSessionMixer } from '../audio/sessionMixer'
import { getPreference, saveUserPreferences } from '../utils/userPreferences'
import { useDrumMachine } from '../contexts/DrumMachineContext'

interface MixingConsolePageProps {
  stats?: {
    cpu: number
    latency: number
    peakInput: number
    peakOutput: number
  }
}

type MixTab = 'console' | 'eq' | 'analyse'

const MIX_TABS = [
  { value: 'console' as const, label: 'Console' },
  { value: 'eq' as const, label: 'EQ' },
  { value: 'analyse' as const, label: 'Analyse' },
]

const OUTPUT_OPTIONS = [
  { value: 'headphones', label: 'Headphones' },
  { value: 'speakers', label: 'Speakers' },
  { value: 'interface', label: 'Interface' },
] as const

const BUFFER_OPTIONS = [
  { value: '128', label: '128' },
  { value: '256', label: '256' },
  { value: '512', label: '512' },
] as const

const PATCH_INS = SESSION_TRACKS.map((t) => t.name)
const PATCH_OUTS = ['Main L', 'Main R', 'Mon'] as const

/** Mixage NEU : bus réels SessionMixer + EQ master. */
export function MixingConsolePage({ stats }: MixingConsolePageProps) {
  const ws = useMemo(() => WebSocketClient.getInstance(), [])
  const { engine, start } = usePedalboardEngine()
  const mixer = useMemo(() => getSessionMixer(), [])
  // Attachement batterie géré par la session (SessionMixer.registerDrumOutput)
  const { outputRouted: drumRouted } = useDrumMachine()

  const [tab, setTab] = useState<MixTab>('console')
  const [channels, setChannels] = useState(initialChannelMap)
  const [eq, setEq] = useState<EqBand[]>(() => [...DEFAULT_EQ_BANDS])
  const [eqPowered, setEqPowered] = useState(true)
  const [bandGains, setBandGains] = useState({ low: 55, mid: 50, high: 58, presence: 52, brillance: 48 })
  const [output, setOutput] = useState<(typeof OUTPUT_OPTIONS)[number]['value']>('headphones')
  const [buffer, setBuffer] = useState<(typeof BUFFER_OPTIONS)[number]['value']>(() => {
    const n = String(getPreference('bufferSize') || 256)
    return (BUFFER_OPTIONS.some((o) => o.value === n) ? n : '256') as (typeof BUFFER_OPTIONS)[number]['value']
  })
  const [monitor, setMonitor] = useState<MonitorState>(DEFAULT_MONITOR_STATE)
  // Défaut = Main L/R connectés partout, Mon coupé (comportement sonore historique)
  const [patch, setPatch] = useState<PatchGrid>(() =>
    EMPTY_PATCH(PATCH_INS.length, PATCH_OUTS.length).map(() => [true, true, false])
  )
  const [levels, setLevels] = useState<Record<string, number>>({})
  const [masterLevels, setMasterLevels] = useState({ left: 0, right: 0, level: 0 })
  const [mixerReady, setMixerReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    const boot = async () => {
      try {
        await start()
        const ctx = engine.getAudioContext()
        if (!ctx || cancelled) return
        // Guitare + batterie branchées par la session, pas par cette page
        mixer.ensure(ctx)
        setMixerReady(true)
        mixer.applyAll(channels)
      } catch {
        /* ignore */
      }
    }
    void boot()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- init once
  }, [engine, start, mixer])

  useEffect(() => {
    mixer.applyAll(channels)
  }, [channels, mixer])

  // Patch matrix réel : Main L / Main R coupent les canaux, Mon alimente le bus monitor.
  useEffect(() => {
    SESSION_TRACKS.forEach((track, index) => {
      mixer.setPatchOutputs(track.id, {
        left: patch[index]?.[0] === true,
        right: patch[index]?.[1] === true,
        mon: patch[index]?.[2] === true,
      })
    })
  }, [patch, mixer])

  // MonitorController réel : volume / mute / DIM sur le bus monitor.
  useEffect(() => {
    mixer.setMonitor(monitor)
  }, [monitor, mixer])

  useEffect(() => {
    const id = window.setInterval(() => {
      const next: Record<string, number> = {}
      for (const t of SESSION_TRACKS) next[t.id] = mixer.getTrackLevel(t.id)
      setLevels(next)
      setMasterLevels(mixer.getMasterLevels())
    }, 50)
    return () => window.clearInterval(id)
  }, [mixer])

  const send = useCallback(
    (parameter: string, value: number | boolean) => {
      if (!ws.isConnected()) return
      void ws.send({ type: 'setEqualizerParameter', parameter, value })
    },
    [ws]
  )

  const patchChannel = (id: string, next: Partial<SessionChannelState>) => {
    setChannels((prev) => {
      const updated = { ...prev, [id]: { ...prev[id], ...next } }
      mixer.applyAll(updated)
      return updated
    })
  }

  const handleEqChange = useCallback(
    (bands: EqBand[]) => {
      setEq(bands)
      const masterEq = mixer.getEq()
      bands.forEach((band, index) => {
        send(`eqBand${index}Freq`, band.freq)
        send(`eqBand${index}Gain`, band.gain)
        send(`eqBand${index}Q`, band.q)
        if (!masterEq) return
        if (index === 0) masterEq.setEqLow(50 + band.gain * 2)
        if (index === 1) masterEq.setEqMid(50 + band.gain * 2)
        if (index === 2) masterEq.setEqHigh(50 + band.gain * 2)
        if (index === 3) masterEq.setEqAir(50 + band.gain * 2)
      })
    },
    [send, mixer]
  )

  const applyBandGain = (key: keyof typeof bandGains, label: string, v: number) => {
    setBandGains((prev) => ({ ...prev, [key]: v }))
    send(`eq${label}`, v)
    const masterEq = mixer.getEq()
    if (!masterEq || !eqPowered) return
    if (key === 'low') masterEq.setEqLow(v)
    if (key === 'mid') masterEq.setEqMid(v)
    if (key === 'high') masterEq.setEqHigh(v)
    if (key === 'presence' || key === 'brillance') masterEq.setEqAir(v)
  }

  return (
    <AppPageShell description="Console, EQ, analyse" fill>
      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden">
        <SegmentedPills label="Vue mixage" options={MIX_TABS} value={tab} onChange={setTab} className="w-fit self-start" />

        {tab === 'console' && (
          <div className="custom-scrollbar flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto pb-2">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {SESSION_TRACKS.map((track) => {
                const ch = channels[track.id]
                return (
                  <div key={track.id} className="shrink-0" style={{ borderTop: `3px solid ${track.color}` }}>
                    <ChannelFader
                      label={track.name}
                      volume={ch.volume}
                      onVolumeChange={(volume) => patchChannel(track.id, { volume })}
                      pan={ch.pan}
                      onPanChange={(pan) => patchChannel(track.id, { pan })}
                      muted={ch.muted}
                      onMutedChange={(muted) => patchChannel(track.id, { muted })}
                      solo={ch.solo}
                      onSoloChange={(solo) => patchChannel(track.id, { solo })}
                      armed={ch.armed}
                      onArmedChange={(armed) => patchChannel(track.id, { armed })}
                      level={levels[track.id] ?? 0}
                    />
                    {track.id === 'drums' && mixerReady && drumRouted === 'destination' && (
                      <p className="mt-1 max-w-[104px] text-[9px] font-bold leading-tight text-rose-500">
                        Hors bus Mix — Mute ne coupe pas la batterie
                      </p>
                    )}
                  </div>
                )
              })}
              <div className="flex shrink-0 gap-2 border-l border-[color:var(--neu-edge)] pl-2">
                <ChannelFader
                  label="Master"
                  volume={channels[MASTER_TRACK_ID].volume}
                  onVolumeChange={(volume) => patchChannel(MASTER_TRACK_ID, { volume })}
                  pan={channels[MASTER_TRACK_ID].pan}
                  onPanChange={(pan) => patchChannel(MASTER_TRACK_ID, { pan })}
                  muted={channels[MASTER_TRACK_ID].muted}
                  onMutedChange={(muted) => patchChannel(MASTER_TRACK_ID, { muted })}
                  solo={channels[MASTER_TRACK_ID].solo}
                  onSoloChange={(solo) => patchChannel(MASTER_TRACK_ID, { solo })}
                  level={masterLevels.level}
                />
                <AudioLevelMeter
                  standalone
                  showControls={false}
                  isStereo
                  leftLevel={stats ? Math.min(1, (stats.peakInput + 60) / 60) : masterLevels.left}
                  rightLevel={stats ? Math.min(1, (stats.peakOutput + 60) / 60) : masterLevels.right}
                  label="MASTER"
                  height={200}
                  className="w-[88px] shrink-0"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-end gap-3 border-t border-[color:var(--neu-edge)] pt-3">
              <SelectField
                label="Output"
                options={OUTPUT_OPTIONS}
                value={output}
                onChange={setOutput}
                className="w-[160px]"
              />
              <SelectField
                label="Buffer"
                options={BUFFER_OPTIONS}
                value={buffer}
                onChange={(v) => {
                  setBuffer(v)
                  // Le buffer Web Audio n'est pas réglable ; il ne concerne que le Native Helper.
                  saveUserPreferences({ bufferSize: Number(v) })
                }}
                className="w-[120px]"
              />
              <div className="ml-auto flex items-center gap-2 rounded-full neu-inset px-3 py-2">
                <span className="h-2 w-2 rounded-full bg-[var(--td-success)] shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
                <span className="text-[11px] font-bold text-[color:var(--neu-text)]">Bus session actifs</span>
              </div>
            </div>
          </div>
        )}

        {tab === 'eq' && (
          <div className="custom-scrollbar flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto">
            <div className="flex items-center gap-3">
              <Power
                size="sm"
                powered={eqPowered}
                onPoweredChange={(next) => {
                  setEqPowered(next)
                  send('eqActive', next)
                  mixer.getEq()?.setPanel2Active(next)
                }}
                label="EQ"
              />
            </div>
            <div className={`min-h-0 flex-1 ${eqPowered ? '' : 'pointer-events-none opacity-40'}`}>
              <SpectrumAnalyzer eq={eq} onEqChange={handleEqChange} live label="ÉGALISEUR PARAMÉTRIQUE" />
            </div>
            <div
              className={`flex flex-wrap items-end justify-center gap-3 pb-1 ${
                eqPowered ? '' : 'pointer-events-none opacity-40'
              }`}
            >
              {(
                [
                  ['low', 'LOW'],
                  ['mid', 'MID'],
                  ['high', 'HIGH'],
                  ['presence', 'PRESENCE'],
                  ['brillance', 'BRILLANCE'],
                ] as const
              ).map(([key, label]) => (
                <SpectrumKnob
                  key={key}
                  size="sm"
                  label={label}
                  value={bandGains[key]}
                  onChange={(v) => applyBandGain(key, label, v)}
                  disabled={!eqPowered}
                />
              ))}
            </div>
          </div>
        )}

        {tab === 'analyse' && (
          <div className="custom-scrollbar flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto lg:flex-row">
            <div className="min-h-0 min-w-0 flex-1">
              <Oscilloscope label="ANALYSE SIGNAL" className="h-full min-h-[200px]" />
            </div>
            <div className="flex w-full shrink-0 flex-col gap-3 lg:w-[280px]">
              <MonitorController value={monitor} onChange={setMonitor} preampAvailable={false} />
              <PatchMatrix
                inputs={PATCH_INS}
                outputs={[...PATCH_OUTS]}
                value={patch}
                onChange={setPatch}
                label="ROUTING"
              />
              <p className="text-[10px] text-[color:var(--neu-text-faint)]">
                Patch : Main L/R coupent réellement le canal ; Mon = bus monitor (niveau/MUTE/DIM).
                Préampli (+48V/PAD/Ø/HPF) : interface native requise.
              </p>
            </div>
          </div>
        )}
      </div>
    </AppPageShell>
  )
}
