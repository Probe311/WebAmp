import { ReactNode, useEffect, useRef } from 'react'
import { useWorkspace } from '../../workspace/WorkspaceContext'
import { WINDOW_GAP } from '../../workspace/types'
import { AppWindow } from './AppWindow'
import { SnapHostProvider } from './SnapHost'

interface WindowGridProps {
  renderApp: (appId: string) => ReactNode
}

/**
 * Chaque fenêtre ajoute un demi-gap dans sa cellule : on le déduit du padding
 * pour que les bords L/R d'une fenêtre pleine coïncident avec l'entête
 * (`mx-[var(--td-shell-gap)]`).
 */
const EDGE = WINDOW_GAP / 2
/** Padding L/R (= top) : shell-gap − demi-gouttière fenêtre. */
const PAD_X = `calc(var(--td-shell-gap) - ${EDGE}px)`
const PAD_TOP = `calc(var(--td-shell-gap) - ${EDGE}px)`
/** Bas : place dock + pastille, sans décaler L/R. */
const PAD_BOTTOM = `calc(var(--td-dock-clearance) - ${EDGE}px)`

/** Filigrane du bureau vide : brand SVG, teinté via mask + `--neu-text`. */
const BRAND_LOGO = '/brand/webamp-logo.svg'

function DesktopBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
    >
      <div
        data-desktop-backdrop=""
        className="h-[140px] w-[280px] bg-[color:var(--neu-text)] opacity-[0.12] sm:h-[200px] sm:w-[400px]"
        style={{
          maskImage: `url(${BRAND_LOGO})`,
          WebkitMaskImage: `url(${BRAND_LOGO})`,
          maskRepeat: 'no-repeat',
          WebkitMaskRepeat: 'no-repeat',
          maskPosition: 'center',
          WebkitMaskPosition: 'center',
          maskSize: 'contain',
          WebkitMaskSize: 'contain',
        }}
      />
    </div>
  )
}

/**
 * Bureau : surface de positionnement absolu où chaque fenêtre est placée
 * par son rectangle (grille 12×12) et empilée selon son rang de focus.
 * Sans fenêtre ouverte, seul le fond au logo reste visible.
 */
export function WindowGrid({ renderApp }: WindowGridProps) {
  const { windows, setMobileLayout } = useWorkspace()
  const desktopRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const sync = () => setMobileLayout(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [setMobileLayout])

  // Ordre d'empilement : la plus récemment focalisée au-dessus.
  const stack = [...windows].sort((a, b) => a.lastFocusedAt - b.lastFocusedAt)

  return (
    <div
      // overflow-visible : neu-flat-lg / ring débordent (~24px) — overflow-clip les coupait au bord
      className="neu-bg neu-theme-transition absolute inset-0 overflow-visible"
      style={{
        paddingTop: PAD_TOP,
        paddingRight: PAD_X,
        paddingBottom: PAD_BOTTOM,
        paddingLeft: PAD_X,
      }}
    >
      <SnapHostProvider>
        {/* Zone d'affichage : les fenêtres et l'ancrage se mesurent sur elle. */}
        <div ref={desktopRef} className="relative h-full w-full">
          {(windows.length === 0 || windows.every((w) => w.minimized)) && <DesktopBackdrop />}
          {stack.map((win, index) => (
            <AppWindow key={win.id} window={win} index={index} desktopRef={desktopRef}>
              {renderApp(win.appId)}
            </AppWindow>
          ))}
        </div>
      </SnapHostProvider>
    </div>
  )
}
