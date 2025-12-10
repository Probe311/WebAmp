/// <reference types="vitest" />
/// <reference types="@testing-library/jest-dom" />

import { expect, afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers)

// Mock Web Audio API
const globalAny = globalThis as any

globalAny.AudioContext = class MockAudioContext {
  sampleRate = 44100
  currentTime = 0
  destination: AudioDestinationNode
  state: AudioContextState = 'running'

  constructor() {
    this.destination = {
      channelCount: 2,
      connect: vi.fn(),
      disconnect: vi.fn()
    } as any
  }

  createGain() {
    return {
      gain: { value: 1.0 },
      connect: vi.fn(),
      disconnect: vi.fn()
    } as any
  }

  createWaveShaper() {
    return {
      curve: null,
      oversample: 'none',
      connect: vi.fn(),
      disconnect: vi.fn()
    } as any
  }

  createBiquadFilter() {
    return {
      type: 'lowpass',
      frequency: { value: 350 },
      Q: { value: 1 },
      connect: vi.fn(),
      disconnect: vi.fn()
    } as any
  }

  createDelay() {
    return {
      delayTime: { value: 0 },
      connect: vi.fn(),
      disconnect: vi.fn()
    } as any
  }

  createConvolver() {
    return {
      buffer: null,
      connect: vi.fn(),
      disconnect: vi.fn()
    } as any
  }

  createOscillator() {
    return {
      type: 'sine',
      frequency: { value: 440 },
      start: vi.fn(),
      stop: vi.fn(),
      connect: vi.fn(),
      disconnect: vi.fn()
    } as any
  }

  createScriptProcessor() {
    return {
      onaudioprocess: null,
      connect: vi.fn(),
      disconnect: vi.fn()
    } as any
  }

  createAnalyser() {
    return {
      fftSize: 2048,
      frequencyBinCount: 1024,
      getByteFrequencyData: vi.fn(),
      connect: vi.fn(),
      disconnect: vi.fn()
    } as any
  }

  createChannelMerger() {
    return {
      connect: vi.fn(),
      disconnect: vi.fn()
    } as any
  }

  decodeAudioData() {
    return Promise.resolve({
      sampleRate: 44100,
      length: 44100,
      getChannelData: () => new Float32Array(44100)
    } as unknown as AudioBuffer)
  }
} as any

// Cleanup after each test
afterEach(() => {
  cleanup()
})

