/**
 * Moteur de disposition : positions normalisées (0-100 %) calculées par
 * archétype, au lieu de coordonnées écrites à la main pour 281 appareils.
 */
import type { AmpArchetype, PedalArchetype } from './types'

export interface Slot {
  x: number
  y: number
}

export interface KnobSlot extends Slot {
  size: number
}

/* ============================ Pédales ============================ */

export const PEDAL_DIMENSIONS: Record<PedalArchetype, { width: number; height: number }> = {
  compact: { width: 300, height: 460 },
  'compact-wide': { width: 380, height: 460 },
  mini: { width: 220, height: 360 },
  sliders: { width: 270, height: 500 },
  eq: { width: 540, height: 400 },
  treadle: { width: 300, height: 520 },
  expression: { width: 260, height: 420 },
  looper: { width: 380, height: 470 },
  desktop: { width: 520, height: 300 },
  tuner: { width: 240, height: 400 },
}

/** Zone de branding (nom de gamme) par archétype. */
export const PEDAL_BRANDING: Record<PedalArchetype, Slot> = {
  compact: { x: 50, y: 58 },
  'compact-wide': { x: 50, y: 58 },
  mini: { x: 50, y: 56 },
  sliders: { x: 50, y: 60 },
  eq: { x: 27, y: 20 },
  treadle: { x: 50, y: 55 },
  expression: { x: 50, y: 55 },
  looper: { x: 50, y: 57 },
  desktop: { x: 50, y: 55 },
  tuner: { x: 50, y: 55 },
}

/** Pied (footswitch) par archétype. */
export const PEDAL_FOOT: Record<PedalArchetype, Slot> = {
  compact: { x: 50, y: 81 },
  'compact-wide': { x: 50, y: 81 },
  mini: { x: 50, y: 78 },
  sliders: { x: 50, y: 86 },
  eq: { x: 50, y: 84 },
  treadle: { x: 50, y: 86 },
  expression: { x: 50, y: 82 },
  looper: { x: 50, y: 84 },
  desktop: { x: 50, y: 78 },
  tuner: { x: 50, y: 82 },
}

/** LED de statut par archétype (position + variante de chrome). */
export const PEDAL_LED: Record<PedalArchetype, Slot> = {
  compact: { x: 50, y: 6 },
  'compact-wide': { x: 50, y: 6 },
  mini: { x: 50, y: 6 },
  sliders: { x: 79, y: 85 },
  eq: { x: 59, y: 83 },
  treadle: { x: 62, y: 80 },
  expression: { x: 62, y: 76 },
  looper: { x: 78, y: 80 },
  desktop: { x: 82, y: 72 },
  tuner: { x: 50, y: 12 },
}

function row(count: number, xs: number[], y: number, size: number): KnobSlot[] {
  const picked = count >= xs.length ? xs : xs.slice(0, count)
  return picked.map((x) => ({ x, y, size }))
}

/**
 * Grille de potentiomètres : 1 → centré, 2 → 1 ligne, 3 → 2+1 (classique),
 * 4 → 2×2, 5 → 3+2, 6+ → 3×2 puis débordement sur 3 colonnes.
 */
export function layoutKnobs(count: number, archetype: PedalArchetype): KnobSlot[] {
  const wide = archetype === 'compact-wide' || archetype === 'looper' || archetype === 'desktop'
  const big = archetype === 'compact-wide' ? 50 : 54
  const small = archetype === 'compact-wide' ? 42 : 44

  if (archetype === 'mini') {
    const size = 38
    if (count <= 1) return [{ x: 50, y: 20, size: 42 }]
    if (count === 2) return row(2, [33, 67], 16, size)
    if (count === 3) return [...row(2, [33, 67], 15, size), { x: 50, y: 30, size: size - 4 }]
    return [...row(2, [33, 67], 14, size), ...row(2, [33, 67], 27, size)]
  }

  if (archetype === 'desktop') {
    const size = 38
    if (count <= 1) return [{ x: 50, y: 32, size: 42 }]
    if (count === 2) return row(2, [42, 58], 32, size)
    if (count === 3) return [...row(2, [34, 50], 30, size), { x: 66, y: 30, size }]
    if (count === 4) return row(4, [30, 43, 56, 69], 30, size)
    return row(count, [24, 35, 45, 55, 65, 76], 30, size)
  }

  if (archetype === 'treadle' || archetype === 'expression') {
    const size = 36
    if (count <= 0) return []
    if (count === 1) return [{ x: 50, y: 8, size: 42 }]
    if (count === 2) return row(2, [34, 66], 8, size)
    if (count === 3) return row(3, [26, 50, 74], 8, size)
    return row(count, [24, 42, 58, 76], 8, size)
  }

  if (archetype === 'tuner') {
    return count > 0 ? row(count, [38, 62], 32, 34) : []
  }

  if (archetype === 'eq' || archetype === 'sliders') {
    // Les faders occupent le centre ; les rares knobs vont sous le branding.
    if (count <= 0) return []
    if (count === 1) return [{ x: 50, y: 72, size: 34 }]
    return row(count, [40, 60, 78, 90], 72, 32)
  }

  // compact / compact-wide / looper
  if (count <= 1) return [{ x: 50, y: 20, size: 46 }]
  if (count === 2) return row(2, wide ? [34, 66] : [33, 67], 18, small)
  if (count === 3) {
    // Rangée haute remontée à 15 % : ses libellés ne touchent plus le knob bas,
    // et le knob bas reste à 32 % pour ne pas heurter la rangée de switches.
    return [...row(2, [30, 70], wide ? 15 : 17, big), { x: 50, y: 32, size: small }]
  }
  if (count === 4) {
    // 380 px de large : une seule rangée, comme les EQ/condenseurs réels.
    if (archetype === 'compact-wide') return row(4, [23, 41, 59, 77], 18, big)
    return [...row(2, [30, 70], 16, big), ...row(2, [30, 70], 33, big)]
  }
  if (count === 5) {
    return [...row(3, [22, 50, 78], 15, small), ...row(2, [36, 64], 31, small)]
  }
  // 6+
  return [...row(3, [22, 50, 78], 14, small), ...row(3, [22, 50, 78], 29, small)]
}

/** Positions horizontales (faders façon Walrus) — colonne verticale. */
export function layoutHorizontalSliders(
  count: number,
  archetype: PedalArchetype,
  startY?: number,
  step?: number
): Slot[] {
  const start = startY ?? (archetype === 'eq' ? 30 : 16)
  const gap = step ?? (count > 3 ? 9 : 10)
  return Array.from({ length: count }).map((_, i) => ({ x: 50, y: start + i * gap }))
}

/** Colonnes de faders verticaux (EQ). */
export function layoutVerticalSliders(count: number, archetype: PedalArchetype): Slot[] {
  const edge = archetype === 'eq' ? 7 : 20
  const span = 100 - edge * 2
  if (count <= 1) return [{ x: 50, y: 52 }]
  return Array.from({ length: count }).map((_, i) => ({
    x: edge + (span * i) / (count - 1),
    y: 52,
  }))
}

/**
 * Switches secondaires (mode, voicing…) : ligne médiane sous les knobs.
 * `knobSlots` permet de descendre la rangée si les libellés de knobs la
 * toucheraient (pédales compactes à 3 knobs + sélecteur de mode).
 */
export function layoutPedalSwitches(
  count: number,
  archetype: PedalArchetype,
  knobSlots: KnobSlot[] = [],
  sliderYs: number[] = []
): Slot[] {
  if (count <= 0) return []
  let y = archetype === 'sliders' ? 47 : archetype === 'looper' || archetype === 'desktop' ? 55 : 44
  if (knobSlots.length > 0) {
    const height = PEDAL_DIMENSIONS[archetype].height
    // Bas du dernier knob + 19 px de libellé/valeur + demi-hauteur de switch
    // + ~8 px de marge.
    const lowest = Math.max(...knobSlots.map((slot) => slot.y + ((slot.size / 2) / height) * 100))
    y = Math.max(y, lowest + (52 / height) * 100)
  }
  if (sliderYs.length > 0) {
    // Rangée de graduations sous le dernier fader (28 px) + demi-switch + marge.
    const height = PEDAL_DIMENSIONS[archetype].height
    y = Math.max(y, Math.max(...sliderYs) + (50 / height) * 100)
  }
  if (count === 1) return [{ x: 50, y }]
  return Array.from({ length: count }).map((_, i) => ({
    x: 30 + (40 * i) / Math.max(1, count - 1),
    y,
  }))
}

/* ============================= Amplis ============================= */

export const AMP_DIMENSIONS: Record<AmpArchetype, { width: number; height: number }> = {
  'head-gold': { width: 780, height: 340 },
  'head-citrus': { width: 780, height: 360 },
  'head-silver': { width: 760, height: 360 },
  'head-black': { width: 780, height: 340 },
  lunchbox: { width: 520, height: 260 },
  combo: { width: 620, height: 520 },
  'combo-twin': { width: 700, height: 560 },
  rack: { width: 640, height: 320 },
}

/**
 * head-gold plaque SVG : x40 w700 y220 h94 / viewBox 780×340
 * centre plaque Y = (220+47)/340 ≈ 78.5 %
 * Rangée DSL-like : [POWER][CABINET] · knobs · [CH] · [INPUT]
 */
export const HEAD_GOLD_FACE = {
  /** Centre corps des contrôles = centre plaque. */
  y: 78.5,
  /** 2 rockers à gauche. */
  left: 12,
  rockerStep: 5.2,
  /** Jack INPUT à droite. */
  right: 88,
  /** Channel push juste avant le jack. */
  channelX: 81.5,
  gapAfterRockers: 6,
  gapBeforeChannel: 5,
  knob: 35,
  viewW: 780,
  viewH: 340,
} as const

/** Bande de façade (potards) par archétype. */
export const AMP_PANEL: Record<AmpArchetype, { y: number; x0: number; x1: number; knob: number }> = {
  'head-gold': {
    y: HEAD_GOLD_FACE.y,
    // après 2 rockers + gap → avant channel − gap
    x0: HEAD_GOLD_FACE.left + HEAD_GOLD_FACE.rockerStep + HEAD_GOLD_FACE.gapAfterRockers,
    x1: HEAD_GOLD_FACE.channelX - HEAD_GOLD_FACE.gapBeforeChannel,
    knob: HEAD_GOLD_FACE.knob,
  },
  'head-citrus': { y: 74, x0: 31, x1: 78, knob: 30 },
  'head-silver': { y: 76, x0: 19, x1: 79, knob: 30 },
  'head-black': { y: 78.5, x0: 24, x1: 78, knob: 30 },
  lunchbox: { y: 70, x0: 30, x1: 70, knob: 30 },
  combo: { y: 66, x0: 20, x1: 80, knob: 26 },
  'combo-twin': { y: 68, x0: 18, x1: 82, knob: 26 },
  rack: { y: 72, x0: 24, x1: 78, knob: 26 },
}

/** Jack head-gold en coords SVG — dérivé de HEAD_GOLD_FACE (même référentiel %). */
export function headGoldJackSvg(): { x: number; y: number } {
  return {
    x: (HEAD_GOLD_FACE.right / 100) * HEAD_GOLD_FACE.viewW,
    y: (HEAD_GOLD_FACE.y / 100) * HEAD_GOLD_FACE.viewH,
  }
}

/** Slot channel push head-gold. */
export function headGoldChannelSlot(): Slot {
  return { x: HEAD_GOLD_FACE.channelX, y: HEAD_GOLD_FACE.y }
}

/** Rangée de potentiomètres d'ampli (façade). */
export function layoutAmpKnobs(count: number, archetype: AmpArchetype): KnobSlot[] {
  const panel = AMP_PANEL[archetype]
  if (count <= 0) return []
  if (count === 1) return [{ x: 50, y: panel.y, size: panel.knob }]
  return Array.from({ length: count }).map((_, i) => ({
    x: panel.x0 + ((panel.x1 - panel.x0) * i) / (count - 1),
    y: panel.y,
    size: panel.knob,
  }))
}

/** Switches d'ampli (power, cabinet) — head-gold = 2 rockers only. */
export function layoutAmpSwitches(count: number, archetype: AmpArchetype): Slot[] {
  const panel = AMP_PANEL[archetype]
  if (archetype === 'head-gold') {
    return Array.from({ length: count }).map((_, i) => ({
      x: HEAD_GOLD_FACE.left + i * HEAD_GOLD_FACE.rockerStep,
      y: HEAD_GOLD_FACE.y,
    }))
  }
  const startX = archetype === 'lunchbox' ? 16 : archetype === 'combo' || archetype === 'combo-twin' ? 8 : 9.5
  const step = archetype === 'lunchbox' ? 12 : 4.6
  if (count <= 0) return []
  return Array.from({ length: count }).map((_, i) => ({
    x: startX + i * step,
    y: panel.y - (archetype === 'lunchbox' ? 6 : 1),
  }))
}

/** Branding ampli : badge sur la grille. */
export const AMP_BRANDING: Record<AmpArchetype, Slot> = {
  'head-gold': { x: 50, y: 32 },
  'head-citrus': { x: 26, y: 22 },
  'head-silver': { x: 50, y: 30 },
  'head-black': { x: 50, y: 32 },
  lunchbox: { x: 50, y: 30 },
  combo: { x: 50, y: 26 },
  'combo-twin': { x: 50, y: 24 },
  rack: { x: 30, y: 24 },
}
