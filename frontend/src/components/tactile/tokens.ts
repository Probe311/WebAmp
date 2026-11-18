import type { CSSProperties } from 'react'

/**
 * Palette et profondeurs du design system tactile.
 *
 * Source de vérité : alignée sur `--neu-*` (`styles/neu-tokens.css`).
 * Un composant ne doit jamais réécrire ses ombres / couleurs en hex.
 */

/** API publique tokens (nom du kit fourni). */
export const NEU_TOKENS = {
  colors: {
    accent: 'var(--neu-accent)',
    accentHover: 'var(--neu-accent-hover)',
    accentSoft: 'var(--neu-accent-soft)',
    background: 'var(--neu-bg)',
    backgroundTrack: 'var(--neu-bg-track)',
    backgroundHollow: 'var(--neu-bg-hollow)',
    textMain: 'var(--neu-text)',
    textMuted: 'var(--neu-text-muted)',
    textFaint: 'var(--neu-text-faint)',
    edge: 'var(--neu-edge)',
  },
  radii: {
    /** Carré arrondi (squircle) — CTA & tuiles action */
    cta: 'rounded-2xl',
    /** Round pour conteneurs, cards & docks */
    card: 'rounded-3xl',
    control: 'rounded-2xl',
    /** Pastilles / badges uniquement */
    pill: 'rounded-full',
  },
  motion: {
    fast: 'var(--neu-duration-fast)',
    base: 'var(--neu-duration-base)',
    slow: 'var(--neu-duration-slow)',
    ease: 'var(--neu-ease)',
    theme: 'neu-theme-transition',
  },
  /** Classes utilitaires CSS (voir neu-tokens.css) */
  surfaces: {
    flat: 'neu-flat',
    flatSm: 'neu-flat-sm',
    flatLg: 'neu-flat-lg',
    inset: 'neu-inset',
    pressed: 'neu-pressed',
    convex: 'neu-convex',
    accentBtn: 'neu-accent-btn',
    bg: 'neu-bg',
    bgTrack: 'neu-bg-track',
  },
} as const

/** Valeurs résolues pour inline styles / canvas SVG (hors CSS vars quand nécessaire). */
/** Hex kit (SVG / canvas / WebAudio UI) — light only ; surfaces CSS via --neu-*. */
export const TACTILE = {
  accent: '#F26A1B',
  accentStrong: '#e0590e',
  accentSoft: 'rgba(242, 106, 27, 0.12)',
  surface: '#e4ebf5',
  surfaceTrack: '#dbe4ef',
  surfaceHollow: '#c8d4e4',
  text: '#1e293b',
  textMuted: '#64748b',
  textFaint: '#94a3b8',
  edge: 'rgba(255, 255, 255, 0.8)',
} as const

const SHADOW_DARK = '163, 177, 198'
const SHADOW_LIGHT = '255, 255, 255'

/** Profondeur perçue d'un conteneur : relief (`flat*`) ou creux (`inset`). */
export type SurfaceDepth = 'flat' | 'flatSm' | 'flatLg' | 'inset' | 'pressed'

export const SURFACES: Record<SurfaceDepth, CSSProperties> = {
  flat: {
    boxShadow: `6px 6px 14px rgba(${SHADOW_DARK}, 0.55), -6px -6px 14px rgba(${SHADOW_LIGHT}, 0.95)`,
  },
  flatSm: {
    boxShadow: `3px 3px 8px rgba(${SHADOW_DARK}, 0.5), -3px -3px 8px rgba(${SHADOW_LIGHT}, 0.9)`,
  },
  flatLg: {
    boxShadow: `10px 10px 24px rgba(${SHADOW_DARK}, 0.6), -10px -10px 24px rgba(${SHADOW_LIGHT}, 0.95)`,
  },
  inset: {
    boxShadow: `inset 2px 2px 5px rgba(${SHADOW_DARK}, 0.65), inset -2px -2px 5px rgba(${SHADOW_LIGHT}, 0.95)`,
  },
  pressed: {
    boxShadow: `inset 3px 3px 7px rgba(${SHADOW_DARK}, 0.7), inset -3px -3px 7px rgba(${SHADOW_LIGHT}, 0.9)`,
  },
}

/** Ombre portée accentuée (bouton principal, voyants allumés). */
export const ACCENT_GLOW = `0 0 10px ${TACTILE.accent}`

/** Map taille kit (s/m/l) → taille tactile (sm/md/lg). */
export type NeuSize = 's' | 'm' | 'l'
export type TactileSize = 'sm' | 'md' | 'lg'

export function neuSize(size: NeuSize | TactileSize = 'm'): TactileSize {
  if (size === 's' || size === 'sm') return 'sm'
  if (size === 'l' || size === 'lg') return 'lg'
  return 'md'
}
