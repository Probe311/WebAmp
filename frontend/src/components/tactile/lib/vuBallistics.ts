/** Échelle et inertie d'un VU-mètre analogique (course -25° → +25°). */

export const VU_MIN_ANGLE = -25
export const VU_MAX_ANGLE = 25
export const VU_SWEEP = VU_MAX_ANGLE - VU_MIN_ANGLE

/**
 * Correspondance VU → angle, recalée sur les repères imprimés d'un vu-mètre
 * (compression de l'échelle en fin de course).
 */
export function vuDbToAngle(vuDb: number): number {
  if (vuDb <= -20) return VU_MIN_ANGLE
  if (vuDb >= 3) return VU_MAX_ANGLE
  if (vuDb <= -10) return -23 + ((vuDb + 20) / 10) * 7
  if (vuDb <= -7) return -16 + ((vuDb + 10) / 3) * 4
  if (vuDb <= -5) return -12 + ((vuDb + 7) / 2) * 4
  if (vuDb <= -3) return -8 + ((vuDb + 5) / 2) * 5
  if (vuDb <= -2) return -3 + ((vuDb + 3) / 1) * 3
  if (vuDb <= -1) return 0 + ((vuDb + 2) / 1) * 3.5
  if (vuDb <= 0) return 3.5 + ((vuDb + 1) / 1) * 4.5
  if (vuDb <= 1) return 8 + (vuDb / 1) * 5
  if (vuDb <= 2) return 13 + ((vuDb - 1) / 1) * 5
  return 18 + ((vuDb - 2) / 1) * 7
}

/** Position normalisée 0 → 1 pour un angle de l'aiguille. */
export function angleToRatio(angle: number): number {
  return (angle - VU_MIN_ANGLE) / VU_SWEEP
}

/** Angle pour une position normalisée 0 → 1. */
export function ratioToAngle(ratio: number): number {
  return VU_MIN_ANGLE + Math.min(1, Math.max(0, ratio)) * VU_SWEEP
}

/**
 * Inertie d'aiguille : montée et descente suivies séparément, comme un vrai
 * mouvement balistique, pour éviter les sauts d'une image à l'autre.
 */
export class BallisticsProcessor {
  private level = 0

  constructor(
    private readonly attackSeconds = 0.3,
    private readonly releaseSeconds = 0.3
  ) {}

  process(target: number, deltaSeconds: number): number {
    const time = this.level < target ? this.attackSeconds : this.releaseSeconds
    const coefficient = 1 - Math.exp(-deltaSeconds / time)
    this.level += (target - this.level) * coefficient
    return this.level
  }

  reset(): void {
    this.level = 0
  }
}

/** RMS d'un buffer temporel → dBFS, borné pour éviter `-Infinity`. */
export function rmsToDbfs(buffer: Float32Array): number {
  let sumSquares = 0
  for (let i = 0; i < buffer.length; i += 1) sumSquares += buffer[i] * buffer[i]
  const rms = Math.sqrt(sumSquares / buffer.length)
  return 20 * Math.log10(Math.max(rms, 1e-5))
}
