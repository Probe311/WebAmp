/**
 * Buffer boucle partagé session (Looper → DAW / Mix).
 * ponytail: module global — plafond 1 buffer ; upgrade = LooperContext.
 */

let sessionBuffer: AudioBuffer | null = null

export function setLooperSessionBuffer(buffer: AudioBuffer | null): void {
  sessionBuffer = buffer
}

export function getLooperSessionBuffer(): AudioBuffer | null {
  return sessionBuffer
}
