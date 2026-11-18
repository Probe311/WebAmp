export type AppId =
  | 'home'
  | 'pedalboard'
  | 'amplifier'
  | 'daw'
  | 'mixing'
  | 'midi'
  | 'drummachine'
  | 'looper'
  | 'metronome'
  | 'chords'
  | 'tuner'
  /** Slot dock « Outils » (menu) — plus une fenêtre. */
  | 'practice'
  | 'learn'
  | 'gallery'
  | 'settings'
  | 'account'
  | 'admin'
  /** @deprecated legacy — migré vers pedalboard */
  | 'webamp'

const APP_IDS = new Set<string>([
  'home',
  'pedalboard',
  'amplifier',
  'daw',
  'mixing',
  'midi',
  'drummachine',
  'looper',
  'metronome',
  'chords',
  'tuner',
  'practice',
  'learn',
  'gallery',
  'settings',
  'account',
  'admin',
  'webamp',
])

/** Normalise les ids persistés (ex. `webamp` → `pedalboard`). */
export function normalizeAppId(raw: string): AppId | null {
  if (raw === 'webamp') return 'pedalboard'
  /** Ancienne page Outils à onglets → Accords. */
  if (raw === 'practice') return 'chords'
  if (!APP_IDS.has(raw)) return null
  return raw as AppId
}

/** Colonnes et lignes de la grille du bureau (unités de 1/12). */
export const GRID = 12

/** Gouttière entre deux fenêtres voisines, en pixels. */
export const WINDOW_GAP = 8

/** Rectangle d'une fenêtre, exprimé en unités de grille 1/12. */
export interface DesktopRect {
  col: number
  row: number
  w: number
  h: number
}

export interface SizePreset {
  id: SizeId
  /** Libellé fractionnaire affiché dans le sélecteur. */
  label: string
  /** Nom accessible complet. */
  name: string
  w: number
  h: number
}

export type SizeId =
  | 'full'
  | 'three-quarters'
  | 'two-thirds'
  | 'four-fifths-half'
  | 'half-width'
  | 'half-height'
  | 'full-third-h'
  | 'half-third-h'
  /** 50% × 50% (grille 12) — défaut Ampli. */
  | 'half-mid-h'
  | 'third'
  | 'third-quarter-h'
  | 'third-third-h'
  | 'quarter'
  | 'quarter-square'
  | 'quarter-tile'

export type SnapZone =
  | 'full'
  | 'left'
  | 'right'
  | 'top'
  | 'bottom'
  | 'tl'
  | 'tr'
  | 'bl'
  | 'br'

export interface OpenWindow {
  id: string
  appId: AppId
  rect: DesktopRect
  /** Épinglée : reste au-dessus des autres et n'est jamais évincée. */
  pinned: boolean
  focused: boolean
  /** Repliée dans le dock : toujours « ouverte » (icône orange), pas focus. */
  minimized: boolean
  /** timestamp pour LRU à max 4 fenêtres */
  lastFocusedAt: number
}

export const MAX_WINDOWS = 4
export const WORKSPACE_STORAGE_KEY = 'webamp-workspace-v2'
export const LEGACY_WORKSPACE_STORAGE_KEY = 'webamp-workspace-v1'

export const APP_LABELS: Record<AppId, string> = {
  home: 'Accueil',
  pedalboard: 'Pedalboard',
  amplifier: 'Ampli',
  daw: 'Studio',
  mixing: 'Mixage',
  midi: 'Clavier MIDI',
  drummachine: 'Rythme',
  looper: 'Looper',
  metronome: 'Métronome',
  chords: 'Accords',
  tuner: 'Accordeur',
  practice: 'Outils',
  learn: 'Apprendre',
  gallery: 'Gallerie',
  settings: 'Paramètres',
  account: 'Compte',
  admin: 'Admin',
  webamp: 'Pedalboard',
}

/** Ordre dock (sans séparateurs — layout dans AppDock). */
export const DOCK_APP_IDS: AppId[] = [
  'home',
  'pedalboard',
  'amplifier',
  'daw',
  'mixing',
  'midi',
  'drummachine',
  'looper',
  'practice',
  'learn',
  'gallery',
  'settings',
  'account',
]

/** Apps ouvertes via le menu Outils (pas le slot `practice`). */
export const TOOL_APP_IDS: readonly AppId[] = ['chords', 'tuner', 'metronome']

/** Tailles de fenêtre, dans l'ordre du sélecteur. */
export const WINDOW_SIZES: SizePreset[] = [
  { id: 'full', label: '1', name: 'Plein écran', w: 12, h: 12 },
  { id: 'three-quarters', label: '3/4', name: 'Trois quarts', w: 9, h: 12 },
  { id: 'two-thirds', label: '2/3', name: 'Deux tiers', w: 8, h: 12 },
  /** ~83% × ~67% (grille 12) — défaut Rythme 10×8. */
  { id: 'four-fifths-half', label: '⅘×½', name: 'Quatre cinquièmes largeur demi hauteur', w: 10, h: 8 },
  { id: 'half-width', label: '2/4', name: 'Moitié de largeur', w: 6, h: 12 },
  { id: 'half-height', label: '1/2', name: 'Moitié de hauteur', w: 12, h: 6 },
  { id: 'full-third-h', label: '⅓h', name: 'Pleine largeur tiers hauteur', w: 12, h: 4 },
  { id: 'half-third-h', label: '½×⅓', name: 'Demi largeur tiers hauteur', w: 6, h: 4 },
  { id: 'half-mid-h', label: '½×½', name: 'Demi largeur demi hauteur', w: 6, h: 6 },
  { id: 'third', label: '1/3', name: 'Un tiers', w: 4, h: 12 },
  /** 33% × 25% (grille 12). */
  { id: 'third-quarter-h', label: '⅓×¼', name: 'Tiers largeur quart hauteur', w: 4, h: 3 },
  /** 33% × 33% — Accords (+1h vs Accordeur / Métronome). */
  { id: 'third-third-h', label: '⅓×⅓', name: 'Tiers largeur tiers hauteur', w: 4, h: 4 },
  { id: 'quarter', label: '1/4', name: 'Un quart', w: 3, h: 12 },
  { id: 'quarter-square', label: '¼', name: 'Quart carré', w: 6, h: 6 },
  { id: 'quarter-tile', label: '⅙', name: 'Tuile quart', w: 3, h: 3 },
]

export const SIZE_BY_ID: Record<SizeId, SizePreset> = WINDOW_SIZES.reduce(
  (acc, s) => ({ ...acc, [s.id]: s }),
  {} as Record<SizeId, SizePreset>
)

/**
 * Taille d'ouverture par app (preset grille 12×12).
 * Outils larges → plein / 3/4 ; panneaux → 1/2 ; clavier → bande horizontale.
 */
/** Taille mini (grille) — évite de couper le contenu (ex. clavier MIDI). */
export const APP_MIN_SIZE: Partial<Record<AppId, { w: number; h: number }>> = {
  /** 50% × 33% grille (même footprint que défaut). */
  midi: { w: 6, h: 4 },
  /** 50% × 50% — chrome compact. */
  amplifier: { w: 6, h: 6 },
  /** 33% × 25% grille (même footprint que défaut). */
  looper: { w: 4, h: 3 },
  /** 10×8 — une unité de plus que l’ancien 10×7 pour ne pas couper TOM3. */
  drummachine: { w: 10, h: 8 },
  /** Accords 4×4 ; Accordeur / Métronome 4×3. */
  chords: { w: 4, h: 4 },
  tuner: { w: 4, h: 3 },
  metronome: { w: 4, h: 3 },
}

export const APP_DEFAULT_SIZE: Record<AppId, SizeId> = {
  home: 'full',
  pedalboard: 'half-height',
  amplifier: 'half-mid-h',
  daw: 'two-thirds',
  mixing: 'half-width',
  /** 50% largeur × 33% hauteur (`half-third-h` = 6×4). */
  midi: 'half-third-h',
  drummachine: 'four-fifths-half',
  looper: 'third-quarter-h',
  /** 4×3 (`third-quarter-h`). */
  metronome: 'third-quarter-h',
  /** 4×4 (`third-third-h`) — +1h. */
  chords: 'third-third-h',
  tuner: 'third-quarter-h',
  practice: 'third-third-h',
  learn: 'two-thirds',
  gallery: 'three-quarters',
  settings: 'half-width',
  account: 'half-width',
  admin: 'three-quarters',
  webamp: 'half-height',
}
