import '@testing-library/jest-dom'

// Minimal Web Audio stub for jsdom
class FakeAudioContext {
  destination = {}
  createGain() {
    return { connect() {}, gain: { value: 1 } }
  }
  createBiquadFilter() {
    return { connect() {}, type: 'peaking', frequency: { value: 1000 }, Q: { value: 1 }, gain: { value: 0 } }
  }
  createWaveShaper() {
    return { connect() {}, curve: null, oversample: 'none' }
  }
  createDelay() {
    return { connect() {}, delayTime: { value: 0 } }
  }
  createOscillator() {
    return { connect() {}, start() {}, stop() {}, frequency: { value: 440 }, type: 'sine' }
  }
  close() {
    return Promise.resolve()
  }
}

// @ts-expect-error jsdom polyfill
globalThis.AudioContext = globalThis.AudioContext || FakeAudioContext
// @ts-expect-error jsdom polyfill
globalThis.webkitAudioContext = globalThis.webkitAudioContext || FakeAudioContext
