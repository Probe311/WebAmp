import { cx } from '../ui/cx'

/**
 * Puce de filtre commune aux filtres d'apprentissage.
 *
 * Au repos : léger relief. Sélectionnée : enfoncée (`neu-pressed`) + accent.
 * Une seule définition pour `DifficultyFilter` et `CategoryTabs`, qui
 * dupliquaient la même chaîne de classes.
 */
export const FILTER_ROW_CLASS = 'custom-scrollbar flex items-center gap-2 overflow-x-auto pb-2'

export function filterChipClass(isActive: boolean): string {
  return cx(
    'flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all duration-150 touch-manipulation',
    'cursor-pointer focus-visible:ring-2 focus-visible:ring-[color:var(--neu-accent)]/40',
    isActive
      ? 'neu-pressed font-semibold text-[color:var(--neu-accent)]'
      : 'neu-flat-sm text-[color:var(--neu-text-muted)] hover:text-[color:var(--neu-text)]'
  )
}
