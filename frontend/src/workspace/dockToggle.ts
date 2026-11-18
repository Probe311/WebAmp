import type { OpenWindow } from './types'

/** Replie une fenêtre et recentre le focus sur la plus récente encore visible. */
export function minimizeWindow(windows: OpenWindow[], windowId: string): OpenWindow[] {
  const next = windows.map((w) =>
    w.id === windowId ? { ...w, minimized: true, focused: false } : w
  )
  if (next.some((w) => w.focused && !w.minimized)) return next

  const candidate = [...next]
    .filter((w) => !w.minimized)
    .sort((a, b) => b.lastFocusedAt - a.lastFocusedAt)[0]
  if (!candidate) return next

  const now = Date.now()
  return next.map((w) => ({
    ...w,
    focused: w.id === candidate.id,
    lastFocusedAt: w.id === candidate.id ? now : w.lastFocusedAt,
  }))
}

/**
 * Clic dock sur une app déjà ouverte :
 * - repliée → restore + focus
 * - focus → minimize
 * - ouverte en arrière-plan → focus
 */
export function cycleDockWindow(windows: OpenWindow[], windowId: string): OpenWindow[] {
  const existing = windows.find((w) => w.id === windowId)
  if (!existing) return windows

  const now = Date.now()

  if (existing.minimized) {
    return windows.map((w) => ({
      ...w,
      minimized: w.id === windowId ? false : w.minimized,
      focused: w.id === windowId,
      lastFocusedAt: w.id === windowId ? now : w.lastFocusedAt,
    }))
  }

  if (existing.focused) return minimizeWindow(windows, windowId)

  return windows.map((w) => ({
    ...w,
    focused: w.id === windowId,
    lastFocusedAt: w.id === windowId ? now : w.lastFocusedAt,
  }))
}
