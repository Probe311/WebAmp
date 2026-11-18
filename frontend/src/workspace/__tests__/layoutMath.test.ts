import { describe, it, expect } from 'vitest'
import {
  clampRect,
  findFreeRect,
  isSameRect,
  normalizeAfterClose,
  overlaps,
  rectAfterDrag,
  rectAfterResize,
  rectForSize,
  rectForSnap,
  rectFromLegacyPlacement,
  sanitizeWindows,
  sizeIdForRect,
  snapZoneFromPoint,
  splitForNewWindow,
  suggestRect,
  zIndexFor,
} from '../layoutMath'
import { MAX_WINDOWS, WINDOW_SIZES, type OpenWindow } from '../types'

const win = (
  partial: Partial<OpenWindow> & Pick<OpenWindow, 'id' | 'appId'>
): OpenWindow => ({
  rect: { col: 0, row: 0, w: 12, h: 12 },
  pinned: false,
  focused: false,
  minimized: false,
  lastFocusedAt: 0,
  ...partial,
})

describe('clampRect', () => {
  it('borne le rectangle au bureau', () => {
    expect(clampRect({ col: -3, row: 20, w: 8, h: 8 })).toEqual({ col: 0, row: 4, w: 8, h: 8 })
    expect(clampRect({ col: 0, row: 0, w: 99, h: 0 })).toEqual({ col: 0, row: 0, w: 12, h: 1 })
  })
})

describe('tailles', () => {
  it('expose les presets et les applique', () => {
    expect(WINDOW_SIZES.length).toBeGreaterThanOrEqual(8)
    for (const size of WINDOW_SIZES) {
      const rect = rectForSize({ col: 0, row: 0, w: 12, h: 12 }, size.id)
      expect(rect).toMatchObject({ w: size.w, h: size.h })
      expect(sizeIdForRect(rect)).toBe(size.id)
    }
  })

  it('conserve le coin haut-gauche et borne le débordement', () => {
    // La colonne est conservée ; la hauteur pleine force la ligne 0.
    expect(rectForSize({ col: 2, row: 2, w: 6, h: 6 }, 'quarter')).toEqual({
      col: 2,
      row: 0,
      w: 3,
      h: 12,
    })
    // Une fenêtre en bas à droite remonte quand la taille dépasse le bureau.
    expect(rectForSize({ col: 6, row: 6, w: 6, h: 6 }, 'quarter')).toEqual({
      col: 6,
      row: 0,
      w: 3,
      h: 12,
    })
  })

  it('rend null pour un rectangle hors presets', () => {
    expect(sizeIdForRect({ col: 0, row: 0, w: 5, h: 7 })).toBeNull()
  })
})

describe('ancrage', () => {
  it('convertit les zones en rectangles', () => {
    expect(rectForSnap('left')).toEqual({ col: 0, row: 0, w: 6, h: 12 })
    expect(rectForSnap('br')).toEqual({ col: 6, row: 6, w: 6, h: 6 })
    expect(rectForSnap('full')).toEqual({ col: 0, row: 0, w: 12, h: 12 })
  })

  it('détecte les zones depuis un point normalisé', () => {
    expect(snapZoneFromPoint(0.5, 0.5)).toBeNull()
    expect(snapZoneFromPoint(0.05, 0.05)).toBe('tl')
    expect(snapZoneFromPoint(0.95, 0.5)).toBe('right')
    expect(snapZoneFromPoint(0.5, 0.95)).toBe('bottom')
    // hors bande étroite (~7 %) : pas de half-screen accidentel
    expect(snapZoneFromPoint(0.12, 0.5)).toBeNull()
    expect(snapZoneFromPoint(0.5, 0.12)).toBeNull()
  })
})

describe('déplacement', () => {
  it('aligne le déplacement sur la grille et borne', () => {
    const origin = { col: 2, row: 2, w: 6, h: 6 }
    expect(rectAfterDrag(origin, 1.4, 2.6)).toEqual({ col: 3, row: 5, w: 6, h: 6 })
    expect(rectAfterDrag(origin, -10, -10)).toEqual({ col: 0, row: 0, w: 6, h: 6 })
    expect(rectAfterDrag(origin, 10, 10)).toEqual({ col: 6, row: 6, w: 6, h: 6 })
  })

  it('détecte le chevauchement', () => {
    const a = { col: 0, row: 0, w: 6, h: 12 }
    expect(overlaps(a, { col: 5, row: 0, w: 6, h: 12 })).toBe(true)
    expect(overlaps(a, { col: 6, row: 0, w: 6, h: 12 })).toBe(false)
  })
})

describe('redimensionnement', () => {
  const origin = { col: 3, row: 3, w: 6, h: 6 }

  it('déplace un seul bord, le bord opposé reste fixe', () => {
    expect(rectAfterResize(origin, 'e', 2, 5)).toEqual({ col: 3, row: 3, w: 8, h: 6 })
    expect(rectAfterResize(origin, 's', 5, 2)).toEqual({ col: 3, row: 3, w: 6, h: 8 })
    expect(rectAfterResize(origin, 'w', -2, 0)).toEqual({ col: 1, row: 3, w: 8, h: 6 })
    expect(rectAfterResize(origin, 'n', 0, -2)).toEqual({ col: 3, row: 1, w: 6, h: 8 })
  })

  it('redimensionne les coins sur les deux axes', () => {
    expect(rectAfterResize(origin, 'se', 1, 1)).toEqual({ col: 3, row: 3, w: 7, h: 7 })
    expect(rectAfterResize(origin, 'nw', -1, -1)).toEqual({ col: 2, row: 2, w: 7, h: 7 })
  })

  it('respecte la taille minimale', () => {
    expect(rectAfterResize(origin, 'w', 99, 0)).toEqual({ col: 6, row: 3, w: 3, h: 6 })
    expect(rectAfterResize(origin, 'n', 0, 99)).toEqual({ col: 3, row: 6, w: 6, h: 3 })
    expect(rectAfterResize(origin, 'e', -99, 0)).toEqual({ col: 3, row: 3, w: 3, h: 6 })
  })

  it('ne déborde pas du bureau', () => {
    expect(rectAfterResize(origin, 'e', 99, 0)).toEqual({ col: 3, row: 3, w: 9, h: 6 })
    expect(rectAfterResize(origin, 'n', 0, -99)).toEqual({ col: 3, row: 0, w: 6, h: 9 })
    expect(rectAfterResize(origin, 'w', -99, 0)).toEqual({ col: 0, row: 3, w: 9, h: 6 })
  })
})

describe('placement des fenêtres', () => {
  it('trouve la moitié droite libre quand la gauche est prise', () => {
    const windows = [
      win({ id: 'a', appId: 'home', rect: { col: 0, row: 0, w: 6, h: 12 }, focused: true }),
    ]
    expect(findFreeRect(windows, 6, 12)).toEqual({ col: 6, row: 0, w: 6, h: 12 })
    expect(findFreeRect(windows, 12, 12)).toBeNull()
  })

  it('suggère plein, puis une moitié', () => {
    expect(suggestRect([])).toEqual({ col: 0, row: 0, w: 12, h: 12 })
    const windows = [win({ id: 'a', appId: 'home', focused: true })]
    expect(isSameRect(suggestRect(windows), { col: 6, row: 0, w: 6, h: 12 })).toBe(true)
  })

  it('réduit une fenêtre plein écran pour accueillir la suivante', () => {
    const before = [win({ id: '1', appId: 'home', focused: true })]
    const after = splitForNewWindow(before)
    expect(after[0].rect).toEqual({ col: 0, row: 0, w: 6, h: 12 })
    expect(after[0].focused).toBe(false)
  })

  it('ne touche pas un bureau déjà partagé', () => {
    const before = [
      win({ id: '1', appId: 'home', rect: { col: 0, row: 0, w: 6, h: 12 }, focused: true }),
    ]
    expect(splitForNewWindow(before)).toBe(before)
  })
})

describe('normalisation', () => {
  it('remet la dernière fenêtre en plein écran', () => {
    const out = normalizeAfterClose([
      win({ id: 'x', appId: 'home', rect: { col: 0, row: 0, w: 6, h: 6 } }),
    ])
    expect(out[0].rect).toEqual({ col: 0, row: 0, w: 12, h: 12 })
    expect(out[0].focused).toBe(true)
  })

  it('refocalise la plus récente quand plus aucune ne l’est', () => {
    const out = normalizeAfterClose([
      win({ id: 'old', appId: 'home', lastFocusedAt: 1 }),
      win({ id: 'new', appId: 'learn', lastFocusedAt: 9 }),
    ])
    expect(out.find((w) => w.focused)?.id).toBe('new')
    expect(out[0].rect).toEqual({ col: 0, row: 0, w: 12, h: 12 })
  })

  it('place les fenêtres épinglées devant', () => {
    const plain = win({ id: 'a', appId: 'home' })
    const pinned = win({ id: 'b', appId: 'learn', pinned: true })
    expect(zIndexFor(pinned, 0)).toBeGreaterThan(zIndexFor(plain, 3))
  })
})

describe('persistance', () => {
  it('migre l’ancien modèle half/quarter', () => {
    expect(rectFromLegacyPlacement({ kind: 'half', edge: 'right' })).toEqual({
      col: 6,
      row: 0,
      w: 6,
      h: 12,
    })
    expect(rectFromLegacyPlacement({ kind: 'quarter', corner: 'bl' })).toEqual({
      col: 0,
      row: 6,
      w: 6,
      h: 6,
    })
  })

  it('assainit une sauvegarde corrompue', () => {
    expect(sanitizeWindows('nope')).toBeNull()
    // Un bureau vidé volontairement est restauré vide, pas remplacé par un défaut.
    expect(sanitizeWindows([])).toEqual([])
    const out = sanitizeWindows([
      { id: 'a', appId: 'home', placement: { kind: 'full' } },
      { id: 'b', appId: 'learn', rect: { col: 99, row: -2, w: 6, h: 6 }, pinned: true },
      { garbage: true },
    ])
    expect(out).not.toBeNull()
    expect(out).toHaveLength(2)
    expect(out?.[0].rect).toEqual({ col: 0, row: 0, w: 12, h: 12 })
    expect(out?.[1].rect).toEqual({ col: 6, row: 0, w: 6, h: 6 })
    expect(out?.[1].pinned).toBe(true)
  })

  it('plafonne le nombre de fenêtres restaurées', () => {
    const raw = Array.from({ length: 7 }, (_, i) => ({
      id: `w${i}`,
      appId: 'home',
      rect: { col: 0, row: 0, w: 6, h: 6 },
    }))
    expect(sanitizeWindows(raw)).toHaveLength(MAX_WINDOWS)
  })
})
