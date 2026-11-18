/**
 * Habillage partagé des panneaux de monitoring.
 *
 * Les trois panneaux (simple, détaillé, système) répétaient les mêmes cartes,
 * pastilles d'icône, pistes de barre et couleurs de seuil en dur. Ces classes
 * sont désormais définies une seule fois, sur les tokens du design system.
 *
 * Reliefs : `neu-flat-lg` / `neu-inset` (ombres bleu-gris 163/177/198) et non
 * `--td-elevation-*` (ombres noires) — sinon les cartes détonnent au milieu des
 * autres surfaces du shell.
 */

export const MONITORING_CARD = 'neu-flat-lg neu-card p-6'

export const MONITORING_ICON_BUBBLE =
  'neu-inset grid h-10 w-10 shrink-0 place-items-center rounded-full text-[color:var(--neu-text-muted)]'

export const MONITORING_TRACK =
  'neu-inset h-3 w-full overflow-hidden rounded-full'

export interface Thresholds {
  /** Au-delà : avertissement. */
  good: number
  /** Au-delà : critique. */
  warning: number
}

export type StatusLevel = 'nominal' | 'warning' | 'critical'

export function statusLevel(value: number, thresholds: Thresholds): StatusLevel {
  if (value >= thresholds.warning) return 'critical'
  if (value >= thresholds.good) return 'warning'
  return 'nominal'
}

const TEXT_BY_LEVEL: Record<StatusLevel, string> = {
  nominal: 'text-[var(--td-success)]',
  warning: 'text-[var(--td-warning)]',
  critical: 'text-[var(--td-danger)]',
}

const FILL_BY_LEVEL: Record<StatusLevel, string> = {
  nominal: 'bg-[var(--td-success)]',
  warning: 'bg-[var(--td-warning)]',
  critical: 'bg-[var(--td-danger)]',
}

/** Classe de couleur de texte pour une mesure comparée à ses seuils. */
export function statusTextClass(value: number, thresholds: Thresholds): string {
  return TEXT_BY_LEVEL[statusLevel(value, thresholds)]
}

/** Classe de remplissage de barre pour une mesure comparée à ses seuils. */
export function statusBarClass(value: number, thresholds: Thresholds): string {
  return FILL_BY_LEVEL[statusLevel(value, thresholds)]
}

/** Mesure indisponible : gris neutre, jamais la couleur « nominal ». */
export const MONITORING_UNAVAILABLE = 'text-[color:var(--neu-text-faint)]'
