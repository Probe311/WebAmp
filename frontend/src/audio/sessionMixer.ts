/**
 * Bus session partagés Mix ↔ DAW (SESSION_TRACKS + master).
 * ponytail: 1 mixer global ; sources branchées via getTrackInput.
 * Patch : chaque bus se scinde Main L / Main R + send Mon (bus monitor dédié).
 */

import { MASTER_TRACK_ID, SESSION_TRACKS, type SessionChannelState } from './sessionTracks'
import { MasterEqualizer } from './masterEqualizer'
import { getAmpToneStack } from './ampToneStack'
import { peekSharedEngine } from './audioSession'
import { setInstrumentBus } from './sessionInstrumentBus'

export interface TrackBus {
  input: GainNode
  muteGain: GainNode
  pan: StereoPannerNode
  analyser: AnalyserNode
  mainL: GainNode
  mainR: GainNode
  monSend: GainNode
}

export interface PatchOutputState {
  left: boolean
  right: boolean
  mon: boolean
}

export interface MonitorBusState {
  volume: number
  mute: boolean
  dim: boolean
}

const DIM_GAIN = 0.25

const DEFAULT_PATCH: PatchOutputState = { left: true, right: true, mon: false }
const DEFAULT_MONITOR: MonitorBusState = { volume: 1, mute: false, dim: false }

class SessionMixer {
  private ctx: AudioContext | null = null
  private tracks = new Map<string, TrackBus>()
  private masterGain: GainNode | null = null
  private masterMute: GainNode | null = null
  private masterAnalyser: AnalyserNode | null = null
  private eq: MasterEqualizer | null = null
  private levelsBuf = new Uint8Array(32)

  // Bus monitor (patch Mon + MonitorController)
  private monitorGain: GainNode | null = null
  private patchState = new Map<string, PatchOutputState>()
  private monitorState: MonitorBusState = { ...DEFAULT_MONITOR }
  private drumSink: ((node: AudioNode | null) => void) | null = null

  ensure(ctx: AudioContext): void {
    if (this.ctx === ctx && this.masterGain) return
    this.ctx = ctx
    this.tracks.clear()

    this.eq = new MasterEqualizer(ctx)
    this.masterMute = ctx.createGain()
    this.masterGain = ctx.createGain()
    this.masterAnalyser = ctx.createAnalyser()
    this.masterAnalyser.fftSize = 256

    this.eq.getOutput().connect(this.masterMute)
    this.masterMute.connect(this.masterGain)
    this.masterGain.connect(this.masterAnalyser)
    this.masterGain.connect(ctx.destination)

    this.makeMonitorBus(ctx)

    for (const track of SESSION_TRACKS) {
      this.tracks.set(track.id, this.makeBus(ctx, track.id))
    }
    this.applyMonitor(this.monitorState)
    this.attachDrums()
    this.attachGuitar()
    setInstrumentBus(this.tracks.get('drums')?.input ?? null)
  }

  /**
   * Chaîne ampli/pedalboard → bus Guitar, décidée par la session.
   * Aucune page ne branche ni ne débranche la guitare.
   */
  private attachGuitar(): void {
    const ctx = this.ctx
    const guitarIn = this.tracks.get('guitar')?.input
    const engineOut = peekSharedEngine()?.getOutput() ?? null
    // La chaîne est un singleton lié à un seul contexte : inutile (et invalide) sinon.
    if (!ctx || !guitarIn || !engineOut || engineOut.context !== ctx) return
    const stack = getAmpToneStack(ctx)
    if (!stack.isAttached()) {
      // attach() coupe la liaison directe sortie → destination (sinon double chemin)
      stack.attach(engineOut, ctx.destination)
    }
    stack.routeTo(guitarIn)
  }

  /**
   * La sortie batterie s'enregistre une seule fois (session).
   * Le mixer la branche sur le bus Drums : plus aucune page ne gère ce routing,
   * donc un démontage de Mix/DAW ne peut plus la renvoyer sur la destination.
   */
  registerDrumOutput(sink: ((node: AudioNode | null) => void) | null): void {
    this.drumSink = sink
    this.attachDrums()
  }

  private attachDrums(): void {
    const bus = this.tracks.get('drums')?.input
    if (this.drumSink && bus) this.drumSink(bus)
  }

  /** Bus monitor : simple gain (volume/mute/DIM) alimenté par les sends Mon. */
  private makeMonitorBus(ctx: AudioContext): void {
    this.monitorGain = ctx.createGain()
    this.monitorGain.connect(ctx.destination)
  }

  private makeBus(ctx: AudioContext, trackId: string): TrackBus {
    const input = ctx.createGain()
    const muteGain = ctx.createGain()
    const pan = ctx.createStereoPanner()
    const analyser = ctx.createAnalyser()
    analyser.fftSize = 256

    const split = ctx.createChannelSplitter(2)
    const mainL = ctx.createGain()
    const mainR = ctx.createGain()
    const monSend = ctx.createGain()

    input.connect(muteGain)
    muteGain.connect(pan)
    pan.connect(analyser)
    pan.connect(split)
    split.connect(mainL, 0)
    split.connect(mainR, 1)
    mainL.connect(this.eq!.getInput())
    mainR.connect(this.eq!.getInput())

    pan.connect(monSend)
    if (this.monitorGain) monSend.connect(this.monitorGain)

    const bus: TrackBus = { input, muteGain, pan, analyser, mainL, mainR, monSend }
    this.applyPatch(trackId, bus, this.patchState.get(trackId) ?? DEFAULT_PATCH)
    return bus
  }

  private applyPatch(trackId: string, bus: TrackBus, state: PatchOutputState): void {
    this.patchState.set(trackId, state)
    bus.mainL.gain.value = state.left ? 1 : 0
    bus.mainR.gain.value = state.right ? 1 : 0
    bus.monSend.gain.value = state.mon ? 1 : 0
  }

  getTrackInput(trackId: string): GainNode | null {
    return this.tracks.get(trackId)?.input ?? null
  }

  /** Patch matrix : Main L / Main R / Mon par piste (stocké même avant ensure). */
  setPatchOutputs(trackId: string, state: PatchOutputState): void {
    const bus = this.tracks.get(trackId)
    if (bus) this.applyPatch(trackId, bus, state)
    else this.patchState.set(trackId, state)
  }

  /** MonitorController réel : volume, mute, DIM (-12 dB). */
  setMonitor(state: MonitorBusState): void {
    this.monitorState = state
    this.applyMonitor(state)
  }

  private applyMonitor(state: MonitorBusState): void {
    if (!this.ctx || !this.monitorGain) return
    const target = state.mute ? 0 : Math.max(0, state.volume) * (state.dim ? DIM_GAIN : 1)
    this.monitorGain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.02)
  }

  applyChannel(id: string, state: SessionChannelState, channels: Record<string, SessionChannelState>): void {
    const anySolo = Object.entries(channels).some(
      ([key, ch]) => key !== MASTER_TRACK_ID && ch.solo
    )
    if (id === MASTER_TRACK_ID) {
      if (this.masterGain) this.masterGain.gain.value = state.muted ? 0.0001 : Math.max(0.0001, state.volume)
      if (this.masterMute) this.masterMute.gain.value = state.muted ? 0.0001 : 1
      return
    }
    const bus = this.tracks.get(id)
    if (!bus) return
    const silenced = state.muted || (anySolo && !state.solo)
    bus.muteGain.gain.value = silenced ? 0.0001 : Math.max(0.0001, state.volume)
    bus.pan.pan.value = Math.max(-1, Math.min(1, state.pan))
  }

  applyAll(channels: Record<string, SessionChannelState>): void {
    for (const id of Object.keys(channels)) {
      this.applyChannel(id, channels[id], channels)
    }
  }

  getEq(): MasterEqualizer | null {
    return this.eq
  }

  private readLevel(analyser: AnalyserNode): number {
    analyser.getByteTimeDomainData(this.levelsBuf)
    let sum = 0
    for (let i = 0; i < this.levelsBuf.length; i++) {
      const v = (this.levelsBuf[i] - 128) / 128
      sum += v * v
    }
    return Math.min(1, Math.sqrt(sum / this.levelsBuf.length) * 4)
  }

  getTrackLevel(trackId: string): number {
    const bus = this.tracks.get(trackId)
    return bus ? this.readLevel(bus.analyser) : 0
  }

  getMasterLevels(): { left: number; right: number; level: number } {
    if (!this.masterAnalyser) return { left: 0, right: 0, level: 0 }
    const level = this.readLevel(this.masterAnalyser)
    return { left: level * 0.95, right: level * 1.05, level }
  }
}

let shared: SessionMixer | null = null

export function getSessionMixer(): SessionMixer {
  if (!shared) shared = new SessionMixer()
  return shared
}
