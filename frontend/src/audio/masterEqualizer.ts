import { clamp } from '../utils/number'

/**
 * MasterEqualizer
 * Traitement global post-pedalboard :
 * - Gain d'entrée / sortie
 * - Compresseur global
 * - Saturation (drive) avec mix
 * - Égalisation 4 bandes (low / mid / high / air)
 * - Stéréo width (mid/side)
 * - Réverb légère (space) optionnelle
 * - Phase flip
 *
 * Tous les réglages sont exposés pour être pilotés par l'UI (SimpleView / AdvancedView).
 */
export class MasterEqualizer {
  private ctx: AudioContext

  private inputGain: GainNode
  private compressor: DynamicsCompressorNode
  private driveNode: WaveShaperNode
  private driveWet: GainNode
  private driveDry: GainNode
  private biasGain: GainNode
  private toneShelf: BiquadFilterNode

  private lowShelf: BiquadFilterNode
  private midPeaking: BiquadFilterNode
  private highShelf: BiquadFilterNode
  private airShelf: BiquadFilterNode

  private widthSplitter: ChannelSplitterNode
  private midGain: GainNode
  private sideGain: GainNode
  private widthMerger: ChannelMergerNode
  private phaseInvertL: GainNode
  private phaseInvertR: GainNode

  private spaceConvolver: ConvolverNode
  private spaceDry: GainNode
  private spaceWet: GainNode

  private outputGain: GainNode

  private panel1Active = true
  private panel2Active = true
  private panel3Active = true

  constructor(ctx: AudioContext) {
    this.ctx = ctx

    this.inputGain = ctx.createGain()
    this.compressor = ctx.createDynamicsCompressor()
    this.compressor.threshold.value = -24
    this.compressor.knee.value = 6
    this.compressor.ratio.value = 2.5
    this.compressor.attack.value = 0.01
    this.compressor.release.value = 0.1

    this.biasGain = ctx.createGain()
    this.biasGain.gain.value = 0

    this.driveNode = ctx.createWaveShaper()
    this.driveWet = ctx.createGain()
    this.driveDry = ctx.createGain()
    this.driveWet.gain.value = 0.5
    this.driveDry.gain.value = 0.5
    this.toneShelf = ctx.createBiquadFilter()
    this.toneShelf.type = 'highshelf'
    this.toneShelf.frequency.value = 3500

    this.lowShelf = ctx.createBiquadFilter()
    this.lowShelf.type = 'lowshelf'
    this.lowShelf.frequency.value = 120

    this.midPeaking = ctx.createBiquadFilter()
    this.midPeaking.type = 'peaking'
    this.midPeaking.frequency.value = 1000
    this.midPeaking.Q.value = 0.9

    this.highShelf = ctx.createBiquadFilter()
    this.highShelf.type = 'highshelf'
    this.highShelf.frequency.value = 4000

    this.airShelf = ctx.createBiquadFilter()
    this.airShelf.type = 'highshelf'
    this.airShelf.frequency.value = 10000

    this.widthSplitter = ctx.createChannelSplitter(2)
    this.midGain = ctx.createGain()
    this.sideGain = ctx.createGain()
    this.widthMerger = ctx.createChannelMerger(2)

    this.phaseInvertL = ctx.createGain()
    this.phaseInvertR = ctx.createGain()
    this.phaseInvertL.gain.value = 1
    this.phaseInvertR.gain.value = 1

    this.spaceConvolver = ctx.createConvolver()
    this.spaceConvolver.buffer = this.createSpaceIR(0.25)
    this.spaceDry = ctx.createGain()
    this.spaceWet = ctx.createGain()
    this.spaceDry.gain.value = 1
    this.spaceWet.gain.value = 0.0

    this.outputGain = ctx.createGain()

    this.buildGraph()
    this.updateDriveCurve(0.3, 0)
    this.setWidth(50)
  }

  private buildGraph() {
    // Entrée -> comp -> bias -> drive -> mix -> EQ -> width/phase -> space -> out
    this.inputGain
      .connect(this.compressor)
      .connect(this.biasGain)

    // Drive dry/wet
    this.biasGain.connect(this.driveNode)
    this.biasGain.connect(this.driveDry)
    this.driveNode.connect(this.driveWet)

    // Mix drive
    const driveMix = this.ctx.createGain()
    this.driveWet.connect(driveMix)
    this.driveDry.connect(driveMix)

    // Tone post drive
    driveMix.connect(this.toneShelf)

    // EQ
    this.toneShelf
      .connect(this.lowShelf)
      .connect(this.midPeaking)
      .connect(this.highShelf)
      .connect(this.airShelf)

    // Width (mid/side)
    this.airShelf.connect(this.widthSplitter)
    this.widthSplitter.connect(this.midGain, 0)
    this.widthSplitter.connect(this.midGain, 1)
    this.widthSplitter.connect(this.sideGain, 0)
    this.widthSplitter.connect(this.sideGain, 1)

    this.midGain.connect(this.widthMerger, 0, 0)
    this.midGain.connect(this.widthMerger, 0, 1)
    this.sideGain.connect(this.widthMerger, 0, 0)
    this.sideGain.connect(this.widthMerger, 0, 1)

    // Phase + space
    this.widthMerger.connect(this.phaseInvertL, 0, 0)
    this.widthMerger.connect(this.phaseInvertR, 1, 0)

    const spaceSplitter = this.ctx.createChannelSplitter(2)
    this.phaseInvertL.connect(spaceSplitter, 0)
    this.phaseInvertR.connect(spaceSplitter, 0)

    const spaceMergerDry = this.ctx.createChannelMerger(2)
    const spaceMergerWet = this.ctx.createChannelMerger(2)

    spaceSplitter.connect(spaceMergerDry, 0, 0)
    spaceSplitter.connect(spaceMergerDry, 1, 1)

    spaceSplitter.connect(this.spaceConvolver, 0)
    this.spaceConvolver.connect(spaceMergerWet, 0, 0)
    this.spaceConvolver.connect(spaceMergerWet, 0, 1)

    spaceMergerDry.connect(this.spaceDry)
    spaceMergerWet.connect(this.spaceWet)

    // Mix space
    const spaceMix = this.ctx.createGain()
    this.spaceDry.connect(spaceMix)
    this.spaceWet.connect(spaceMix)

    spaceMix.connect(this.outputGain)
  }

  private createSpaceIR(duration: number) {
    const rate = this.ctx.sampleRate
    const length = Math.max(1, Math.floor(duration * rate))
    const impulse = this.ctx.createBuffer(2, length, rate)
    for (let channel = 0; channel < 2; channel++) {
      const data = impulse.getChannelData(channel)
      for (let i = 0; i < length; i++) {
        // Exponential decay noise
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 3)
      }
    }
    return impulse
  }

  private updateDriveCurve(amount: number, bias: number) {
    const k = amount * 10 + 1
    const n = 1024
    const curve = new Float32Array(n)
    const deg = Math.PI / 180
    for (let i = 0; i < n; i++) {
      const x = (i * 2) / n - 1 + bias
      curve[i] = (3 + k) * x * 20 * deg / (Math.PI + k * Math.abs(x))
    }
    this.driveNode.curve = curve
  }

  getInput(): AudioNode {
    return this.inputGain
  }

  getOutput(): AudioNode {
    return this.outputGain
  }

  // Section: Panel 1 (Input / Width / Clip / Phase)
  setInput(value: number) {
    const linear = clamp(value / 50, 0, 2) // 0..2
    this.inputGain.gain.setTargetAtTime(this.panel1Active ? linear : 1, this.ctx.currentTime, 0.01)
  }

  setWidth(value: number) {
    // 0 = mono, 50 = normal, 100 = élargi
    const normalized = clamp(value, 0, 100)
    const side = (normalized - 50) / 50 // -1..+1
    const midGain = 1
    const sideGain = 1 + side
    this.midGain.gain.setTargetAtTime(this.panel1Active ? midGain : 1, this.ctx.currentTime, 0.01)
    this.sideGain.gain.setTargetAtTime(this.panel1Active ? sideGain : 0, this.ctx.currentTime, 0.01)
  }

  setClip(enabled: boolean) {
    // Si clip activé, réduire la sortie du drive pour limiter
    this.driveWet.gain.setTargetAtTime(enabled ? 0.6 : 1, this.ctx.currentTime, 0.01)
  }

  setPhase(enabled: boolean) {
    const val = enabled ? -1 : 1
    this.phaseInvertL.gain.value = val
    this.phaseInvertR.gain.value = val
  }

  setPanel1Active(active: boolean) {
    this.panel1Active = active
    this.setInput(50)
    this.setWidth(50)
  }

  // Section: Panel 2 (EQ)
  private mapEq(value: number) {
    // -12dB .. +12dB
    return clamp((value - 50) / 50 * 12, -12, 12)
  }

  setEqLow(value: number) {
    const db = this.panel2Active ? this.mapEq(value) : 0
    this.lowShelf.gain.setTargetAtTime(db, this.ctx.currentTime, 0.01)
  }

  setEqMid(value: number) {
    const db = this.panel2Active ? this.mapEq(value) : 0
    this.midPeaking.gain.setTargetAtTime(db, this.ctx.currentTime, 0.01)
  }

  setEqHigh(value: number) {
    const db = this.panel2Active ? this.mapEq(value) : 0
    this.highShelf.gain.setTargetAtTime(db, this.ctx.currentTime, 0.01)
  }

  setEqAir(value: number) {
    const db = this.panel2Active ? this.mapEq(value) : 0
    this.airShelf.gain.setTargetAtTime(db, this.ctx.currentTime, 0.01)
  }

  setSpeedMode(mode: 'Fast' | 'Slow') {
    const fast = mode === 'Fast'
    this.compressor.attack.setTargetAtTime(fast ? 0.005 : 0.02, this.ctx.currentTime, 0.01)
    this.compressor.release.setTargetAtTime(fast ? 0.08 : 0.2, this.ctx.currentTime, 0.01)
  }

  setPanel2Active(active: boolean) {
    this.panel2Active = active
    if (!active) {
      this.setEqLow(50)
      this.setEqMid(50)
      this.setEqHigh(50)
      this.setEqAir(50)
    }
  }

  // Section: Panel 3 (Drive / Tone)
  setDrive(value: number) {
    const amount = clamp(value / 100, 0, 1)
    this.updateDriveCurve(amount, this.biasGain.gain.value)
  }

  setMix(value: number) {
    const wet = clamp(value / 100, 0, 1)
    this.driveWet.gain.setTargetAtTime(this.panel3Active ? wet : 0, this.ctx.currentTime, 0.01)
    this.driveDry.gain.setTargetAtTime(this.panel3Active ? 1 - wet : 1, this.ctx.currentTime, 0.01)
  }

  setBias(value: number) {
    const bias = clamp((value - 50) / 50, -0.5, 0.5)
    this.biasGain.gain.setTargetAtTime(bias, this.ctx.currentTime, 0.01)
    this.updateDriveCurve(clamp((this.driveWet.gain.value) * 1, 0, 1), bias)
  }

  setTone(value: number) {
    const db = (value - 50) / 50 * 10
    this.toneShelf.gain.setTargetAtTime(this.panel3Active ? db : 0, this.ctx.currentTime, 0.01)
  }

  setHqMode(enabled: boolean) {
    // HQ : adoucir la courbe pour moins d'aliasing
    const amount = enabled ? 0.5 : 0.8
    this.updateDriveCurve(amount, this.biasGain.gain.value)
  }

  setPanel3Active(active: boolean) {
    this.panel3Active = active
    if (!active) {
      this.setMix(0)
      this.setDrive(0)
      this.setTone(50)
    }
  }

  // Advanced controls (compressor)
  setAttack(value: number) {
    this.compressor.attack.setTargetAtTime(clamp(value / 100, 0.001, 1), this.ctx.currentTime, 0.01)
  }
  setRelease(value: number) {
    this.compressor.release.setTargetAtTime(clamp(value / 100, 0.005, 1.5), this.ctx.currentTime, 0.01)
  }
  setRatio(value: number) {
    this.compressor.ratio.setTargetAtTime(clamp(1 + (value / 100) * 19, 1, 20), this.ctx.currentTime, 0.01)
  }
  setThresh(value: number) {
    const thresh = -60 + (value / 100) * 40 // -60..-20
    this.compressor.threshold.setTargetAtTime(thresh, this.ctx.currentTime, 0.01)
  }
  setKnee(value: number) {
    this.compressor.knee.setTargetAtTime(clamp(value / 100 * 40, 0, 40), this.ctx.currentTime, 0.01)
  }
  setMakeup(value: number) {
    const linear = 0.5 + (value / 100) * 1.5 // 0.5..2
    this.outputGain.gain.setTargetAtTime(linear, this.ctx.currentTime, 0.01)
  }
  setDynamicsActive(active: boolean) {
    this.compressor.threshold.setTargetAtTime(active ? this.compressor.threshold.value : 0, this.ctx.currentTime, 0.01)
  }

  // Space / Reverb
  setDepth(value: number) {
    const wet = clamp(value / 100, 0, 0.5)
    this.spaceWet.gain.setTargetAtTime(wet, this.ctx.currentTime, 0.05)
    this.spaceDry.gain.setTargetAtTime(1 - wet, this.ctx.currentTime, 0.05)
  }
  setReverbType(type: string) {
    const duration = type === 'Hall' ? 1.5 : type === 'Plate' ? 0.9 : 0.35
    this.spaceConvolver.buffer = this.createSpaceIR(duration)
  }
  setStereoMode(mode: string) {
    if (mode === 'Mono') {
      this.setWidth(0)
    } else if (mode === 'Wide') {
      this.setWidth(80)
    } else {
      this.setWidth(50)
    }
  }
  setSpaceActive(active: boolean) {
    if (!active) {
      this.setDepth(0)
    }
  }

  // Master
  setMaster(value: number) {
    const linear = clamp(value / 100, 0, 1.5)
    this.outputGain.gain.setTargetAtTime(linear, this.ctx.currentTime, 0.01)
  }

  // Saturation advanced
  setSatMix(value: number) {
    this.setMix(value)
  }
  setTexture(value: number) {
    // texture = légère variation de drive curve
    const amount = clamp((value / 100) * 0.8, 0, 0.8)
    this.updateDriveCurve(amount, this.biasGain.gain.value)
  }
  setSaturationActive(active: boolean) {
    if (!active) {
      this.setMix(0)
    }
  }

  // EQ toggle
  setEqActive(active: boolean) {
    this.panel2Active = active
    if (!active) {
      this.setEqLow(50)
      this.setEqMid(50)
      this.setEqHigh(50)
      this.setEqAir(50)
    }
  }
}

