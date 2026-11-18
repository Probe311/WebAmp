import {
  APP_DEFAULT_SIZE,
  GRID,
  MAX_WINDOWS,
  SIZE_BY_ID,
  WINDOW_SIZES,
  normalizeAppId,
  type DesktopRect,
  type OpenWindow,
  type SizeId,
  type SnapZone,
} from './types'

/** Ramène un rectangle dans les bornes du bureau, tailles comprises. */
export function clampRect(r: DesktopRect): DesktopRect {
  const w = Math.min(GRID, Math.max(1, Math.round(r.w)))
  const h = Math.min(GRID, Math.max(1, Math.round(r.h)))
  return {
    w,
    h,
    col: Math.min(GRID - w, Math.max(0, Math.round(r.col))),
    row: Math.min(GRID - h, Math.max(0, Math.round(r.row))),
  }
}

/** Applique une taille (l'un des 8 presets) en conservant le coin haut-gauche. */
export function rectForSize(rect: DesktopRect, sizeId: SizeId): DesktopRect {
  const preset = WINDOW_SIZES.find((s) => s.id === sizeId)
  if (!preset) return clampRect(rect)
  return clampRect({ col: rect.col, row: rect.row, w: preset.w, h: preset.h })
}

/** Identifie la taille d'un rectangle, ou `null` s'il ne correspond à aucun preset. */
export function sizeIdForRect(rect: DesktopRect): SizeId | null {
  const match = WINDOW_SIZES.find((s) => s.w === rect.w && s.h === rect.h)
  return match ? match.id : null
}

const ZONE_RECTS: Record<SnapZone, DesktopRect> = {
  full: { col: 0, row: 0, w: 12, h: 12 },
  left: { col: 0, row: 0, w: 6, h: 12 },
  right: { col: 6, row: 0, w: 6, h: 12 },
  top: { col: 0, row: 0, w: 12, h: 6 },
  bottom: { col: 0, row: 6, w: 12, h: 6 },
  tl: { col: 0, row: 0, w: 6, h: 6 },
  tr: { col: 6, row: 0, w: 6, h: 6 },
  bl: { col: 0, row: 6, w: 6, h: 6 },
  br: { col: 6, row: 6, w: 6, h: 6 },
}

export function rectForSnap(zone: SnapZone): DesktopRect {
  return { ...ZONE_RECTS[zone] }
}

/** Bande d’accroche (ratio du bureau). 0.18 était trop large → half-screen collé en permanence. */
export const SNAP_EDGE = 0.07

export function snapZoneFromPoint(nx: number, ny: number): SnapZone | null {
  const edge = SNAP_EDGE
  const nearL = nx < edge
  const nearR = nx > 1 - edge
  const nearT = ny < edge
  const nearB = ny > 1 - edge
  if (!nearL && !nearR && !nearT && !nearB) return null
  if (nearL && nearT) return 'tl'
  if (nearR && nearT) return 'tr'
  if (nearL && nearB) return 'bl'
  if (nearR && nearB) return 'br'
  if (nearL) return 'left'
  if (nearR) return 'right'
  if (nearT) return 'top'
  return 'bottom'
}

export function overlaps(a: DesktopRect, b: DesktopRect): boolean {
  return a.col < b.col + b.w && b.col < a.col + a.w && a.row < b.row + b.h && b.row < a.row + a.h
}

export function isSameRect(a: DesktopRect, b: DesktopRect): boolean {
  return a.col === b.col && a.row === b.row && a.w === b.w && a.h === b.h
}

/** Déplacement libre : delta en unités de grille, aligné et borné. */
export function rectAfterDrag(origin: DesktopRect, dxCells: number, dyCells: number): DesktopRect {
  return clampRect({
    ...origin,
    col: origin.col + Math.round(dxCells),
    row: origin.row + Math.round(dyCells),
  })
}

/** Poignées de redimensionnement : bords et coins. */
export type ResizeEdge = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw'

/** Taille minimale d'une fenêtre, en unités de grille. */
export const MIN_WINDOW_W = 3
export const MIN_WINDOW_H = 3

/**
 * Redimensionnement par une poignée : le bord (ou coin) saisi bouge,
 * le bord opposé reste fixe. Delta en unités de grille, taille minimale
 * et bornes du bureau respectées.
 */
export function rectAfterResize(
  origin: DesktopRect,
  edge: ResizeEdge,
  dxCells: number,
  dyCells: number,
  minW = MIN_WINDOW_W,
  minH = MIN_WINDOW_H
): DesktopRect {
  const dx = Math.round(dxCells)
  const dy = Math.round(dyCells)
  const right = origin.col + origin.w
  const bottom = origin.row + origin.h
  let { col, row, w, h } = origin
  const mw = Math.max(MIN_WINDOW_W, minW)
  const mh = Math.max(MIN_WINDOW_H, minH)

  if (edge.includes('e')) w = Math.max(mw, Math.min(GRID - col, origin.w + dx))
  if (edge.includes('s')) h = Math.max(mh, Math.min(GRID - row, origin.h + dy))

  if (edge.includes('w')) {
    col = Math.max(0, Math.min(right - mw, origin.col + dx))
    w = right - col
  }
  if (edge.includes('n')) {
    row = Math.max(0, Math.min(bottom - mh, origin.row + dy))
    h = bottom - row
  }

  return clampRect({ col, row, w, h })
}

/** Cherche un emplacement libre pour une w×h donnée, en balayant le bureau. */
export function findFreeRect(
  windows: OpenWindow[],
  w: number,
  h: number,
  ignoreId?: string
): DesktopRect | null {
  const occupied = windows.filter((win) => win.id !== ignoreId).map((win) => win.rect)
  for (let row = 0; row <= GRID - h; row += 1) {
    for (let col = 0; col <= GRID - w; col += 1) {
      const candidate = clampRect({ col, row, w, h })
      if (!occupied.some((r) => overlaps(r, candidate))) return candidate
    }
  }
  return null
}

/**
 * Emplacement de la prochaine fenêtre.
 * `@param preferred` — taille souhaitée (sinon plein écran si bureau vide).
 */
export function suggestRect(
  windows: OpenWindow[],
  preferred: Pick<DesktopRect, 'w' | 'h'> = { w: GRID, h: GRID }
): DesktopRect {
  const w = Math.min(GRID, Math.max(1, preferred.w))
  const h = Math.min(GRID, Math.max(1, preferred.h))

  if (windows.length === 0) {
    // Ancrage haut-gauche — comportement bureau classique.
    return clampRect({ col: 0, row: 0, w, h })
  }

  // Un plein écran cède sa moitié droite à la nouvelle (cf. splitForNewWindow).
  if (windows.some((win) => win.rect.w === GRID && win.rect.h === GRID)) {
    const rw = Math.min(6, w)
    const rh = Math.min(GRID, h)
    return clampRect({ col: 6, row: 0, w: rw, h: rh })
  }

  return (
    findFreeRect(windows, w, h) ??
    findFreeRect(windows, 6, 12) ??
    findFreeRect(windows, 6, 6) ??
    findFreeRect(windows, 12, 6) ??
    clampRect({ col: windows.length * 2, row: windows.length * 2, w, h })
  )
}

/** Réduit une fenêtre plein écran à la moitié gauche pour accueillir la nouvelle. */
export function splitForNewWindow(windows: OpenWindow[]): OpenWindow[] {
  if (windows.length !== 1) return windows
  const [only] = windows
  if (only.rect.w !== GRID || only.rect.h !== GRID) return windows
  return [{ ...only, rect: { col: 0, row: 0, w: 6, h: GRID }, focused: false }]
}

/** Après fermeture : une seule fenêtre restante reprend tout le bureau. */
export function normalizeAfterClose(windows: OpenWindow[]): OpenWindow[] {
  if (windows.length === 1) {
    const only = windows[0]
    return [
      {
        ...only,
        rect: { col: 0, row: 0, w: GRID, h: GRID },
        focused: !only.minimized,
      },
    ]
  }
  const visibleFocused = windows.some((w) => w.focused && !w.minimized)
  if (windows.length > 0 && !visibleFocused) {
    const newest = [...windows]
      .filter((w) => !w.minimized)
      .sort((a, b) => b.lastFocusedAt - a.lastFocusedAt)[0]
    if (!newest) return windows.map((w) => ({ ...w, focused: false }))
    return windows.map((w) => ({ ...w, focused: w.id === newest.id }))
  }
  return windows
}

/**
 * Ordre d'empilement : fond < dock (20) < fenêtres < épinglées < header (100).
 * Les fenêtres passent devant le dock (ombre dock ne recouvre pas les fenêtres).
 */
export const Z_WINDOW = 40
export const Z_WINDOW_PINNED = 70

export function zIndexFor(window: OpenWindow, index: number): number {
  const base = window.pinned ? Z_WINDOW_PINNED : Z_WINDOW
  return base + index
}

const LEGACY_HALF: Record<string, DesktopRect> = {
  left: { col: 0, row: 0, w: 6, h: 12 },
  right: { col: 6, row: 0, w: 6, h: 12 },
  top: { col: 0, row: 0, w: 12, h: 6 },
  bottom: { col: 0, row: 6, w: 12, h: 6 },
}

const LEGACY_CORNER: Record<string, DesktopRect> = {
  tl: { col: 0, row: 0, w: 6, h: 6 },
  tr: { col: 6, row: 0, w: 6, h: 6 },
  bl: { col: 0, row: 6, w: 6, h: 6 },
  br: { col: 6, row: 6, w: 6, h: 6 },
}

/** Convertit l'ancien modèle `{kind: 'half' | 'quarter' | 'full'}` en rectangle. */
export function rectFromLegacyPlacement(placement: unknown): DesktopRect {
  if (!placement || typeof placement !== 'object') {
    return { col: 0, row: 0, w: GRID, h: GRID }
  }
  const p = placement as { kind?: string; edge?: string; corner?: string }
  if (p.kind === 'half' && p.edge && LEGACY_HALF[p.edge]) return { ...LEGACY_HALF[p.edge] }
  if (p.kind === 'quarter' && p.corner && LEGACY_CORNER[p.corner]) {
    return { ...LEGACY_CORNER[p.corner] }
  }
  return { col: 0, row: 0, w: GRID, h: GRID }
}

function isRect(value: unknown): value is DesktopRect {
  if (!value || typeof value !== 'object') return false
  const r = value as Record<string, unknown>
  return ['col', 'row', 'w', 'h'].every((k) => typeof r[k] === 'number' && Number.isFinite(r[k]))
}

export function sanitizeWindows(raw: unknown): OpenWindow[] | null {
  if (!Array.isArray(raw)) return null
  const out: OpenWindow[] = []
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue
    const w = item as Record<string, unknown>
    if (typeof w.id !== 'string' || typeof w.appId !== 'string') continue
    const appId = normalizeAppId(w.appId)
    if (!appId) continue
    let rect = isRect(w.rect) ? clampRect(w.rect) : rectFromLegacyPlacement(w.placement)
    // Accords : footprint 4×4 (legacy Pratique / ancien 4×3 / trop grand).
    if (appId === 'chords' && (rect.w !== 4 || rect.h !== 4)) {
      const preset = SIZE_BY_ID[APP_DEFAULT_SIZE.chords]
      rect = clampRect({ col: rect.col, row: rect.row, w: preset.w, h: preset.h })
    }
    out.push({
      id: w.id,
      appId,
      rect,
      pinned: w.pinned === true,
      focused: w.focused === true,
      minimized: w.minimized === true,
      lastFocusedAt: typeof w.lastFocusedAt === 'number' ? w.lastFocusedAt : 0,
    })
  }
  // Un tableau vide est un bureau volontairement vide, pas une sauvegarde invalide.
  if (out.length === 0) return raw.length === 0 ? [] : null
  if (!out.some((w) => w.focused && !w.minimized)) {
    const visible = out.find((w) => !w.minimized)
    if (visible) {
      for (let i = 0; i < out.length; i++) {
        out[i] = { ...out[i], focused: out[i].id === visible.id }
      }
    } else {
      for (let i = 0; i < out.length; i++) out[i] = { ...out[i], focused: false }
    }
  }
  return out.slice(0, MAX_WINDOWS)
}
