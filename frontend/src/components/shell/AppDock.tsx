import { useRef, useState } from 'react'
import { BottomDock, type DockEntry } from '../tactile/shell'
import { MenuItem, MenuSurface, useDismissible } from '../tactile'
import { useWorkspace } from '../../workspace/WorkspaceContext'
import { APP_LABELS, TOOL_APP_IDS, type AppId } from '../../workspace/types'
import { useDrumMachine } from '../../contexts/DrumMachineContext'
import { FaIcon, type FaIconName } from '../../icons/fa'
import { useAuth } from '../../auth/AuthProvider'
import { requestAuthGate } from '../../auth/authGateSession'

type DockSlot = { kind: 'app'; appId: AppId } | { kind: 'sep'; id: string }

const DOCK_SLOTS: DockSlot[] = [
  { kind: 'app', appId: 'home' },
  { kind: 'app', appId: 'pedalboard' },
  { kind: 'app', appId: 'amplifier' },
  { kind: 'app', appId: 'daw' },
  { kind: 'app', appId: 'mixing' },
  { kind: 'app', appId: 'midi' },
  { kind: 'app', appId: 'drummachine' },
  { kind: 'app', appId: 'looper' },
  { kind: 'sep', id: 'sep-learn' },
  { kind: 'app', appId: 'practice' },
  { kind: 'app', appId: 'learn' },
  { kind: 'app', appId: 'gallery' },
  { kind: 'sep', id: 'sep-system' },
  { kind: 'app', appId: 'settings' },
  { kind: 'app', appId: 'account' },
]

const APP_FA: Record<AppId, FaIconName> = {
  home: 'grid-2',
  pedalboard: 'dial-med-low',
  amplifier: 'amp-guitar',
  daw: 'waveform-lines',
  mixing: 'square-sliders-vertical',
  midi: 'piano-keyboard',
  drummachine: 'drum',
  looper: 'arrows-rotate-reverse',
  metronome: 'music',
  chords: 'music',
  tuner: 'wave-pulse',
  practice: 'screwdriver-wrench',
  learn: 'book-open',
  gallery: 'store',
  settings: 'gear',
  account: 'user',
  admin: 'shield',
  webamp: 'dial-med-low',
}

const TOOLS_MENU: { id: AppId; label: string }[] = [
  { id: 'chords', label: 'Accords' },
  { id: 'tuner', label: 'Accordeur' },
  { id: 'metronome', label: 'Métronome' },
]

function fa(name: FaIconName, className = 'h-5 w-5') {
  return <FaIcon icon={name} className={className} />
}

function isToolApp(id: AppId | null | undefined): boolean {
  return !!id && (TOOL_APP_IDS as readonly string[]).includes(id)
}

/**
 * Dock bas du shell — API workspace branchée sur le BottomDock neumorphique.
 */
export function AppDock({ isAdmin = false }: { isAdmin?: boolean }) {
  const { openApp, focusedAppId, windows } = useWorkspace()
  const { user } = useAuth()
  const { isActive: drumActive } = useDrumMachine()
  const [toolsOpen, setToolsOpen] = useState(false)
  const toolsCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const toolsRef = useDismissible<HTMLDivElement>(toolsOpen, () => setToolsOpen(false))

  const openToolsMenu = () => {
    if (toolsCloseTimer.current) {
      clearTimeout(toolsCloseTimer.current)
      toolsCloseTimer.current = null
    }
    setToolsOpen(true)
  }

  const scheduleCloseToolsMenu = () => {
    if (toolsCloseTimer.current) clearTimeout(toolsCloseTimer.current)
    toolsCloseTimer.current = setTimeout(() => setToolsOpen(false), 120)
  }

  const openAppIds = new Set<AppId>(
    windows.map((w) => (w.appId === 'webamp' ? 'pedalboard' : w.appId))
  )

  const slots: DockSlot[] = isAdmin
    ? [...DOCK_SLOTS, { kind: 'app', appId: 'admin' }]
    : DOCK_SLOTS

  const toolsWindowOpen = TOOL_APP_IDS.some((id) => openAppIds.has(id))
  const toolsFocused = isToolApp(focusedAppId)

  const openIds = slots
    .filter((s): s is { kind: 'app'; appId: AppId } => s.kind === 'app')
    .map((s) => s.appId)
    .filter((id) => (id === 'practice' ? toolsWindowOpen : openAppIds.has(id)))

  const focused = toolsFocused
    ? 'practice'
    : focusedAppId === 'webamp'
      ? 'pedalboard'
      : focusedAppId && openAppIds.has(focusedAppId)
        ? focusedAppId
        : ''

  const items: DockEntry[] = slots.map((slot): DockEntry => {
    if (slot.kind === 'sep') return { type: 'separator', id: slot.id }

    if (slot.appId === 'practice') {
      return {
        id: 'practice',
        label: APP_LABELS.practice,
        icon: fa(APP_FA.practice),
        containerRef: toolsRef,
        onMouseEnter: openToolsMenu,
        onMouseLeave: scheduleCloseToolsMenu,
        onSelect: () => {
          // Clic sur Outils alors qu'un outil est focus → replie (comme les autres apps).
          if (toolsFocused && focusedAppId && isToolApp(focusedAppId)) {
            openApp(focusedAppId)
            if (toolsCloseTimer.current) clearTimeout(toolsCloseTimer.current)
            setToolsOpen(false)
            return
          }
          setToolsOpen((v) => !v)
        },
        flyout: toolsOpen ? (
          <div role="menu" aria-label="Outils" onMouseEnter={openToolsMenu}>
            <MenuSurface anchored={false} widthClassName="w-44">
              {TOOLS_MENU.map((entry) => (
                <MenuItem
                  key={entry.id}
                  onSelect={() => {
                    if (toolsCloseTimer.current) clearTimeout(toolsCloseTimer.current)
                    setToolsOpen(false)
                    openApp(entry.id)
                  }}
                >
                  {entry.label}
                </MenuItem>
              ))}
            </MenuSurface>
          </div>
        ) : undefined,
      }
    }

    return {
      id: slot.appId,
      label: APP_LABELS[slot.appId],
      icon: fa(APP_FA[slot.appId]),
      badge: slot.appId === 'drummachine' && drumActive ? 1 : undefined,
    }
  })

  return (
    <div className="pointer-events-none fixed bottom-[var(--td-dock-offset,1rem)] left-1/2 z-[var(--td-z-dock,40)] -translate-x-1/2 pb-[env(safe-area-inset-bottom)]">
      <div className="pointer-events-auto">
        <BottomDock
          items={items}
          value={focused}
          openIds={openIds}
          onChange={(id) => {
            const appId = id as AppId
            if (appId === 'account' && !user) {
              requestAuthGate('login', 'account')
              return
            }
            openApp(appId)
          }}
          label="Applications WebAmp"
        />
      </div>
    </div>
  )
}
