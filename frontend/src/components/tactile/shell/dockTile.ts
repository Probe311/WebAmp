/** Accent dock / chrome fenêtre — forcé #F26A1B (y compris en dark). */
export const DOCK_ORANGE = '#F26A1B'

/**
 * Tuile neu — même contrat que le kit :
 * idle  → neu-flat
 * actif → neu-pressed + texte orange + ring
 */
export const DOCK_TILE_CLASS =
  'relative inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-xl md:rounded-2xl transition-all duration-200 neu-flat text-[color:var(--neu-text-muted)] hover:text-[color:var(--neu-text)] active:neu-pressed'

/** Actif : classes littérales Tailwind (pas d'interpolation). */
export const DOCK_TILE_ACTIVE_CLASS =
  'neu-pressed text-[#F26A1B] ring-2 ring-[#F26A1B]/30'

/**
 * Chrome fenêtre — aligné sur `tactile/shell/Window`.
 * Idle sans box-shadow (sinon coupe dans un well / au bord title bar).
 * Carré arrondi `rounded-lg` (pas cercle).
 */
export const WINDOW_CHROME_TILE_CLASS =
  'inline-grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-lg bg-transparent text-[color:var(--neu-text-muted)] transition-colors duration-150 hover:bg-[color:var(--neu-bg-track)] hover:text-[color:var(--neu-text)] active:neu-pressed disabled:cursor-not-allowed disabled:opacity-50'

/** Toolbar contrôles — flex simple, pas de neu-inset (le well clipait les ombres). */
export const WINDOW_CHROME_TOOLBAR_CLASS = 'flex shrink-0 items-center gap-0.5'

/** @deprecated alias — ne plus envelopper les tuiles dans un well inset. */
export const WINDOW_CHROME_GROUP_CLASS = WINDOW_CHROME_TOOLBAR_CLASS
