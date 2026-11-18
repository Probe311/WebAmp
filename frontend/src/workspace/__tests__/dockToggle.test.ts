import { describe, expect, it } from 'vitest'
import { cycleDockWindow, minimizeWindow } from '../dockToggle'
import type { OpenWindow } from '../types'

const win = (
  partial: Partial<OpenWindow> & Pick<OpenWindow, 'id' | 'appId'>
): OpenWindow => ({
  rect: { col: 0, row: 0, w: 6, h: 6 },
  pinned: false,
  focused: false,
  minimized: false,
  lastFocusedAt: 0,
  ...partial,
})

describe('cycleDockWindow', () => {
  it('replie la fenêtre focus au second clic dock', () => {
    const windows = [
      win({ id: 'a', appId: 'home', focused: true, lastFocusedAt: 2 }),
      win({ id: 'b', appId: 'learn', lastFocusedAt: 1 }),
    ]
    const out = cycleDockWindow(windows, 'a')
    expect(out.find((w) => w.id === 'a')).toMatchObject({ minimized: true, focused: false })
    expect(out.find((w) => w.id === 'b')).toMatchObject({ minimized: false, focused: true })
  })

  it('restaure une fenêtre repliée', () => {
    const windows = [win({ id: 'a', appId: 'home', minimized: true, focused: false })]
    const out = cycleDockWindow(windows, 'a')
    expect(out[0]).toMatchObject({ minimized: false, focused: true })
  })

  it('focus une fenêtre ouverte en arrière-plan sans la replier', () => {
    const windows = [
      win({ id: 'a', appId: 'home', focused: true, lastFocusedAt: 2 }),
      win({ id: 'b', appId: 'learn', lastFocusedAt: 1 }),
    ]
    const out = cycleDockWindow(windows, 'b')
    expect(out.find((w) => w.id === 'b')).toMatchObject({ focused: true, minimized: false })
    expect(out.find((w) => w.id === 'a')?.focused).toBe(false)
  })
})

describe('minimizeWindow', () => {
  it('laisse aucune focus si tout est replié', () => {
    const windows = [win({ id: 'a', appId: 'home', focused: true })]
    const out = minimizeWindow(windows, 'a')
    expect(out[0]).toMatchObject({ minimized: true, focused: false })
  })
})
