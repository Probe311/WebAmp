/**
 * Bus de destination des instruments joués en direct (clavier).
 * La session décide de la cible ; aucune page ne branche/débranche un instrument.
 */

type Listener = (bus: AudioNode | null) => void

let bus: AudioNode | null = null
const listeners = new Set<Listener>()

export function setInstrumentBus(node: AudioNode | null): void {
  if (bus === node) return
  bus = node
  listeners.forEach((listener) => listener(node))
}

export function getInstrumentBus(): AudioNode | null {
  return bus
}

export function subscribeInstrumentBus(listener: Listener): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}
