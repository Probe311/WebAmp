/**
 * Tone stack ampli navigateur (bass/mid/treble/presence + master).
 * Inserté entre la sortie pedalboard et destination.
 * ponytail: 1 chaîne globale — plafond sans cab IR ; upgrade = NAM native.
 */

export class AmpToneStack {
  private ctx: AudioContext
  private input: GainNode
  private bass: BiquadFilterNode
  private mid: BiquadFilterNode
  private treble: BiquadFilterNode
  private presence: BiquadFilterNode
  private master: GainNode
  private connected = false

  constructor(ctx: AudioContext) {
    this.ctx = ctx
    this.input = ctx.createGain()
    this.bass = ctx.createBiquadFilter()
    this.bass.type = 'lowshelf'
    this.bass.frequency.value = 120
    this.mid = ctx.createBiquadFilter()
    this.mid.type = 'peaking'
    this.mid.frequency.value = 800
    this.mid.Q.value = 0.8
    this.treble = ctx.createBiquadFilter()
    this.treble.type = 'highshelf'
    this.treble.frequency.value = 3200
    this.presence = ctx.createBiquadFilter()
    this.presence.type = 'peaking'
    this.presence.frequency.value = 4000
    this.presence.Q.value = 0.7
    this.master = ctx.createGain()

    this.input
      .connect(this.bass)
      .connect(this.mid)
      .connect(this.treble)
      .connect(this.presence)
      .connect(this.master)
  }

  isAttached(): boolean {
    return this.connected
  }

  /** Branche entre source (ex. engine output) et destination (sans casser les autres taps). */
  attach(source: AudioNode, destination: AudioNode = this.ctx.destination): void {
    if (this.connected) return
    try {
      source.disconnect(destination)
    } catch {
      /* pas encore connecté à destination */
    }
    source.connect(this.input)
    this.master.connect(destination)
    this.connected = true
  }

  /** Re-route la sortie (ex. vers bus Mix) sans retoucher l'entrée. */
  routeTo(destination: AudioNode): void {
    try {
      this.master.disconnect()
    } catch {
      /* ignore */
    }
    this.master.connect(destination)
  }

  /** Params ampli 0–10 → dB / gain. */
  applyParameters(params: Record<string, number>, powered: boolean): void {
    const toDb = (v: number | undefined, def = 5) => ((v ?? def) - 5) * 2.4
    this.bass.gain.value = toDb(params.bass)
    this.mid.gain.value = toDb(params.middle ?? params.mid)
    this.treble.gain.value = toDb(params.treble)
    this.presence.gain.value = toDb(params.presence ?? params.tone, 5)
    const masterKnob = params.master ?? params.volume ?? 5
    const gain = powered ? Math.max(0.0001, (masterKnob / 10) * 1.2) : 0.0001
    this.master.gain.setTargetAtTime(gain, this.ctx.currentTime, 0.03)
  }
}

let sharedStack: AmpToneStack | null = null

export function getAmpToneStack(ctx: AudioContext): AmpToneStack {
  if (!sharedStack) sharedStack = new AmpToneStack(ctx)
  return sharedStack
}
