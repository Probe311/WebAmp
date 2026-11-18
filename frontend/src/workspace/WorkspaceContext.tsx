import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from 'react'
import type { AppId, DesktopRect, OpenWindow, SizeId, SnapZone } from './types'
import {
  APP_DEFAULT_SIZE,
  GRID,
  LEGACY_WORKSPACE_STORAGE_KEY,
  MAX_WINDOWS,
  SIZE_BY_ID,
  WORKSPACE_STORAGE_KEY,
} from './types'
import {
  clampRect,
  normalizeAfterClose,
  rectForSize,
  rectForSnap,
  sanitizeWindows,
  splitForNewWindow,
  suggestRect,
} from './layoutMath'
import { cycleDockWindow } from './dockToggle'

interface WorkspaceContextValue {
  windows: OpenWindow[]
  focusedAppId: AppId | null
  isOpen: (appId: AppId) => boolean
  openApp: (appId: AppId) => void
  focusWindow: (windowId: string) => void
  closeWindow: (windowId: string) => void
  closeApp: (appId: AppId) => void
  /** Déplace / redimensionne librement (rectangle déjà aligné sur la grille). */
  setRect: (windowId: string, rect: DesktopRect) => void
  /** Applique l'une des 8 tailles en gardant le coin haut-gauche. */
  resizeWindow: (windowId: string, sizeId: SizeId) => void
  togglePinned: (windowId: string) => void
  snapWindow: (windowId: string, zone: SnapZone) => void
  isMobileLayout: boolean
  setMobileLayout: (v: boolean) => void
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null)

function uid() {
  return `w-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

function loadPersisted(): OpenWindow[] | null {
  try {
    const raw = localStorage.getItem(WORKSPACE_STORAGE_KEY)
    if (raw) {
      // `[]` est valide : l'utilisateur a fermé toutes ses fenêtres.
      const windows = sanitizeWindows(JSON.parse(raw))
      if (windows) return windows
    }
    const legacy = localStorage.getItem(LEGACY_WORKSPACE_STORAGE_KEY)
    if (legacy) {
      const windows = sanitizeWindows(JSON.parse(legacy))
      if (windows) return windows
    }
  } catch {
    /* ignore */
  }
  return null
}

function makeWindow(appId: AppId, rect: DesktopRect, focused = true): OpenWindow {
  return {
    id: uid(),
    appId,
    rect,
    pinned: false,
    focused,
    minimized: false,
    lastFocusedAt: Date.now(),
  }
}

/** Bureau vide au premier lancement : aucune fenêtre, seulement le fond. */
function defaultWindows(): OpenWindow[] {
  return []
}

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [windows, setWindows] = useState<OpenWindow[]>(() => loadPersisted() ?? defaultWindows())
  const [isMobileLayout, setMobileLayout] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem(WORKSPACE_STORAGE_KEY, JSON.stringify(windows))
    } catch {
      /* ignore */
    }
  }, [windows])

  useEffect(() => {
    if (!isMobileLayout) return
    setWindows((prev) => {
      const focused = prev.find((w) => w.focused) ?? prev[0]
      if (!focused) return prev
      return [
        {
          ...focused,
          rect: { col: 0, row: 0, w: GRID, h: GRID },
          focused: true,
          lastFocusedAt: Date.now(),
        },
      ]
    })
  }, [isMobileLayout])

  const isOpen = useCallback(
    (appId: AppId) => windows.some((w) => w.appId === appId),
    [windows]
  )

  const focusWindow = useCallback((windowId: string) => {
    setWindows((prev) =>
      prev.map((w) => ({
        ...w,
        minimized: w.id === windowId ? false : w.minimized,
        focused: w.id === windowId,
        lastFocusedAt: w.id === windowId ? Date.now() : w.lastFocusedAt,
      }))
    )
  }, [])

  const openApp = useCallback(
    (appId: AppId) => {
      setWindows((prev) => {
        const existing = prev.find((w) => w.appId === appId)
        if (existing) {
          let next = cycleDockWindow(prev, existing.id)
          // Accords : ramener au footprint 4×4 si encore en 4×3 (session chaude).
          if (appId === 'chords') {
            const preset = SIZE_BY_ID[APP_DEFAULT_SIZE.chords]
            next = next.map((w) =>
              w.appId === 'chords' && (w.rect.w !== preset.w || w.rect.h !== preset.h)
                ? {
                    ...w,
                    rect: clampRect({
                      col: w.rect.col,
                      row: w.rect.row,
                      w: preset.w,
                      h: preset.h,
                    }),
                  }
                : w
            )
          }
          return next
        }

        if (isMobileLayout) {
          return [makeWindow(appId, { col: 0, row: 0, w: GRID, h: GRID })]
        }

        let base = splitForNewWindow(prev)
        if (base.length >= MAX_WINDOWS) {
          // Une fenêtre épinglée n'est jamais évincée ; une repliée non plus prioritaire.
          const lru = [...base]
            .filter((w) => !w.focused && !w.pinned)
            .sort((a, b) => a.lastFocusedAt - b.lastFocusedAt)[0]
          if (lru) base = base.filter((w) => w.id !== lru.id)
        }

        const preset = SIZE_BY_ID[APP_DEFAULT_SIZE[appId]] ?? SIZE_BY_ID.full
        const created = makeWindow(appId, suggestRect(base, { w: preset.w, h: preset.h }))
        return [
          ...base.map((w) => ({ ...w, focused: false })),
          created,
        ]
      })
    },
    [isMobileLayout]
  )

  // Fermer la dernière fenêtre laisse un bureau vide (l'accueil est fermable).
  const closeWindow = useCallback((windowId: string) => {
    setWindows((prev) => normalizeAfterClose(prev.filter((w) => w.id !== windowId)))
  }, [])

  const closeApp = useCallback((appId: AppId) => {
    setWindows((prev) => normalizeAfterClose(prev.filter((w) => w.appId !== appId)))
  }, [])

  const setRect = useCallback(
    (windowId: string, rect: DesktopRect) => {
      setWindows((prev) =>
        prev.map((w) =>
          w.id === windowId
            ? {
                ...w,
                rect: clampRect(
                  isMobileLayout ? { col: 0, row: 0, w: GRID, h: GRID } : rect
                ),
                minimized: false,
                focused: true,
                lastFocusedAt: Date.now(),
              }
            : w
        )
      )
    },
    [isMobileLayout]
  )

  const resizeWindow = useCallback(
    (windowId: string, sizeId: SizeId) => {
      setWindows((prev) =>
        prev.map((w) =>
          w.id === windowId
            ? {
                ...w,
                rect: rectForSize(w.rect, sizeId),
                minimized: false,
                focused: true,
                lastFocusedAt: Date.now(),
              }
            : w
        )
      )
    },
    []
  )

  const togglePinned = useCallback((windowId: string) => {
    setWindows((prev) =>
      prev.map((w) =>
        w.id === windowId
          ? {
              ...w,
              pinned: !w.pinned,
              minimized: false,
              focused: true,
              lastFocusedAt: Date.now(),
            }
          : w
      )
    )
  }, [])

  const snapWindow = useCallback(
    (windowId: string, zone: SnapZone) => {
      setRect(windowId, rectForSnap(zone))
    },
    [setRect]
  )

  const focusedAppId = useMemo(
    () => windows.find((w) => w.focused && !w.minimized)?.appId ?? null,
    [windows]
  )

  const value = useMemo(
    () => ({
      windows,
      focusedAppId,
      isOpen,
      openApp,
      focusWindow,
      closeWindow,
      closeApp,
      setRect,
      resizeWindow,
      togglePinned,
      snapWindow,
      isMobileLayout,
      setMobileLayout,
    }),
    [
      windows,
      focusedAppId,
      isOpen,
      openApp,
      focusWindow,
      closeWindow,
      closeApp,
      setRect,
      resizeWindow,
      togglePinned,
      snapWindow,
      isMobileLayout,
    ]
  )

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>
}

export function useWorkspace() {
  const ctx = useContext(WorkspaceContext)
  if (!ctx) throw new Error('useWorkspace must be used within WorkspaceProvider')
  return ctx
}
