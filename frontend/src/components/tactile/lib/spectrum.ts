/**
 * Rampe de couleurs d'un spectre audio (bleu → violet → rouge → orange → vert →
 * cyan), utilisée pour allumer les graduations d'un potentiomètre.
 */
const STOPS: Array<{ position: number; rgb: [number, number, number] }> = [
  { position: 0.0, rgb: [59, 130, 246] },
  { position: 0.12, rgb: [139, 92, 246] },
  { position: 0.24, rgb: [217, 70, 239] },
  { position: 0.36, rgb: [244, 63, 94] },
  { position: 0.48, rgb: [239, 68, 68] },
  { position: 0.58, rgb: [249, 115, 22] },
  { position: 0.7, rgb: [234, 179, 8] },
  { position: 0.82, rgb: [34, 197, 94] },
  { position: 0.92, rgb: [6, 182, 212] },
  { position: 1.0, rgb: [37, 99, 235] },
]

const clamp01 = (value: number) => Math.min(1, Math.max(0, value))

/** Couleur `rgb(...)` pour une position normalisée 0 → 1 sur la rampe. */
export function spectrumColor(t: number): string {
  const position = clamp01(t)
  const upperIndex = STOPS.findIndex((stop) => stop.position >= position)
  const upper = STOPS[upperIndex === -1 ? STOPS.length - 1 : upperIndex]
  const lower = STOPS[Math.max(0, (upperIndex === -1 ? STOPS.length - 1 : upperIndex) - 1)]

  const span = upper.position - lower.position
  const ratio = span === 0 ? 0 : (position - lower.position) / span

  const mix = (channel: 0 | 1 | 2) =>
    Math.round(lower.rgb[channel] + ratio * (upper.rgb[channel] - lower.rgb[channel]))

  return `rgb(${mix(0)}, ${mix(1)}, ${mix(2)})`
}
