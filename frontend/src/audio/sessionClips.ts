/** Clips d'arrangement minimaux (positions normalisées 0–1 du transport). */

export interface SessionClip {
  id: string
  trackId: string
  start: number
  end: number
}

let clipCounter = 0

export function createClip(trackId: string, start: number, length: number): SessionClip {
  const boundedStart = Math.min(1, Math.max(0, start))
  clipCounter += 1
  return {
    id: `clip-${trackId}-${clipCounter}`,
    trackId,
    start: boundedStart,
    end: Math.min(1, boundedStart + length),
  }
}

export function clipsFor(clips: SessionClip[], trackId: string): SessionClip[] {
  return clips.filter((clip) => clip.trackId === trackId)
}
