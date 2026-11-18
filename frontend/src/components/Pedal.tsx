import { Children, Fragment, isValidElement, ReactNode, useMemo } from 'react'
import { PedalBrandHeader } from './pedals/PedalBrandHeader'
import { PedalAuroraBg } from './pedals/skins/PedalAuroraBg'
import type { PedalEngageStyle, PedalFootShape, PedalLedSide } from '../utils/brandPedalChrome'

// Type pour les enfants React avec vérification de type
type ReactChildWithProps = {
  type?: { displayName?: string }
  props?: { className?: string; children?: ReactNode }
} & ReactNode

/** Aplatit Fragments (y compris ceux issus de useMemo(() => <>…</>)) */
function flattenChildren(children: ReactNode): ReactNode[] {
  return Children.toArray(children).flatMap((child) => {
    if (isValidElement(child) && child.type === Fragment) {
      return flattenChildren((child.props as { children?: ReactNode }).children)
    }
    return [child]
  })
}

/** 2 potards → 1+1 sur 2 lignes (empilés) */
function TwoKnobsLayout({ items }: { items: ReactNode[] }) {
  return (
    <>
      {items.slice(0, 2).map((child, index) => (
        <div key={index} className="flex w-full min-w-0 justify-center items-center">
          {child}
        </div>
      ))}
    </>
  )
}

/** 3 potards → toujours 2+1 (ligne 2 knobs, 3e centré) — ex. RAT / DS-1 */
function ThreeKnobsLayout({ items }: { items: ReactNode[] }) {
  return (
    <>
      {items.slice(0, 2).map((child, index) => (
        <div key={index} className="flex min-w-0 justify-center items-center">
          {child}
        </div>
      ))}
      {items.slice(2, 3).map((child, index) => (
        <div
          key={index + 2}
          className="col-span-2 flex min-w-0 justify-center items-center"
        >
          {child}
        </div>
      ))}
    </>
  )
}

function PedalSeparator() {
  return <div className="shrink-0 h-px w-full bg-zinc-300/50 dark:bg-zinc-600/40" aria-hidden />
}

/** LED : off = grise ; on = accent + halo / pulse « vivant ». */
function PedalLed({ on, accentColor }: { on: boolean; accentColor: string }) {
  return (
    <div
      role="status"
      aria-label={on ? 'On' : 'Off'}
      title={on ? 'On' : 'Off'}
      className={`relative w-2.5 h-2.5 shrink-0 ${on ? 'pedal-led-on' : ''}`}
      style={{ ['--pedal-led-accent' as string]: accentColor }}
    >
      {on && (
        <span
          className="pedal-led-halo absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
          aria-hidden
        />
      )}
      <span
        className={`absolute inset-0 rounded-full border transition-colors duration-300 ${
          on ? 'border-transparent pedal-led-core' : 'border-black/15'
        }`}
        style={{
          background: on ? accentColor : '#9ca3af',
          boxShadow: on ? undefined : 'none',
        }}
      />
    </div>
  )
}

export type PedalSize = 'S' | 'M' | 'L' | 'XL' | 'XXL'
export type { PedalEngageStyle, PedalFootShape, PedalLedSide }

export interface PedalProps {
  brand?: string
  model?: string
  color?: string
  accentColor?: string
  size?: PedalSize
  bypassed?: boolean
  children?: ReactNode
  className?: string
  onClick?: () => void
  onBypassToggle?: () => void
  showFootswitch?: boolean
  bottomActions?: ReactNode
  /** Fond Aurora (React Bits) — WebAmp */
  auroraBg?: boolean
  /** Statut pied — par marque (glow | led) */
  engageStyle?: PedalEngageStyle
  ledSide?: PedalLedSide
  /** Forme CTA — round | square (radius) | rect (radius) */
  footShape?: PedalFootShape
}

// Système de grille : largeur × hauteur min (unité de base)
// ponytail: hauteurs de board un peu irrégulières — upgrade path: align-items + mode hauteur fixe optionnel
const BASE_UNIT = 230
const HEIGHT_MULTIPLIER = 2
const SIZE_CONFIG: Record<PedalSize, { width: string; minHeight: string; padding: string; fontSize: { brand: string; model: string } }> = {
  S: {
    width: `${BASE_UNIT * 0.5}px`,
    minHeight: `${BASE_UNIT * HEIGHT_MULTIPLIER}px`,
    padding: '0.4rem',
    fontSize: { brand: '0.45rem', model: '0.65rem' },
  },
  M: {
    width: `${BASE_UNIT * 1}px`,
    minHeight: `${BASE_UNIT * HEIGHT_MULTIPLIER}px`,
    padding: '0.5rem',
    fontSize: { brand: '0.5rem', model: '0.75rem' },
  },
  L: {
    width: `${BASE_UNIT * 2}px`,
    minHeight: `${BASE_UNIT * HEIGHT_MULTIPLIER}px`,
    padding: '0.6rem',
    fontSize: { brand: '0.55rem', model: '0.85rem' },
  },
  XL: {
    width: `${BASE_UNIT * 3}px`,
    minHeight: `${BASE_UNIT * HEIGHT_MULTIPLIER}px`,
    padding: '0.7rem',
    fontSize: { brand: '0.6rem', model: '0.95rem' },
  },
  XXL: {
    width: `${BASE_UNIT * 4}px`,
    minHeight: `${BASE_UNIT * HEIGHT_MULTIPLIER}px`,
    padding: '0.8rem',
    fontSize: { brand: '0.65rem', model: '1rem' },
  },
}

const FOOTSWITCH_SIZE: Record<PedalSize, string> = {
  S: '40px',
  M: '48px',
  L: '56px',
  XL: '64px',
  XXL: '72px',
}

/** Fond teinté depuis la bordure (ton réduit, premium) */
function accentFill(hex: string): string {
  return `color-mix(in srgb, ${hex} 16%, #ebebef)`
}

export function Pedal({
  brand = '',
  model = '',
  color: _color = '#ffffff',
  accentColor = '#fff',
  size = 'M',
  bypassed = false,
  children,
  className = '',
  onClick,
  onBypassToggle,
  showFootswitch = true,
  bottomActions,
  auroraBg = false,
  engageStyle = 'glow',
  ledSide = 'left',
  footShape = 'round',
}: PedalProps) {
  const useLed = engageStyle === 'led'
  const engaged = !bypassed
  const config = useMemo(() => SIZE_CONFIG[size], [size])
  const footDim = useMemo(() => {
    const base = parseInt(FOOTSWITCH_SIZE[size], 10)
    if (footShape === 'rect') {
      return { width: Math.round(base * 1.45), height: Math.round(base * 0.78), radius: 10 }
    }
    if (footShape === 'square') {
      return { width: base, height: base, radius: 10 }
    }
    return { width: base, height: base, radius: 9999 }
  }, [size, footShape])

  // Composition fixe : pied toujours présent (CTA + LED|glow), calqué WebAmp
  // showFootswitch legacy ignoré — toutes les pédales ont le pied
  void showFootswitch
  const showActivation = true
  const showFoot = true
  const showHead = !!(brand || model)

  const childList = useMemo(() => flattenChildren(children), [children])

  const hasTwoKnobs = useMemo(() => {
    if (className.includes('has-two-knobs')) return true
    if (className.includes('has-three-knobs') || className.includes('has-four-knobs')) return false
    if (childList.length === 2) return true
    return false
  }, [childList, className])

  const hasThreeKnobs = useMemo(() => {
    if (className.includes('has-three-knobs')) return true
    if (className.includes('has-two-knobs')) return false
    if (childList.length === 3) return true
    return childList.filter((child: unknown) => {
      if (typeof child === 'object' && child !== null) {
        const childObj = child as ReactChildWithProps
        return (
          childObj?.type?.displayName === 'Potentiometer' ||
          childObj?.props?.className?.includes('potentiometer-container')
        )
      }
      return false
    }).length === 3
  }, [childList, className])

  const hasFourKnobs = useMemo(() => {
    if (className.includes('has-four-knobs')) return true
    if (childList.length === 4 && !className.includes('has-three-knobs')) return true
    return childList.filter((child: unknown) => {
      if (typeof child === 'object' && child !== null) {
        const childObj = child as ReactChildWithProps
        return (
          childObj?.type?.displayName === 'Potentiometer' ||
          childObj?.props?.className?.includes('potentiometer-container')
        )
      }
      return false
    }).length === 4
  }, [childList, className])

  const isEq = className.includes('is-eq-pedal')
  const hasHorizontalSliders = className.includes('has-horizontal-sliders')
  const useFlexLayout = className.includes('use-flex-layout')
  const shellWide15 = hasHorizontalSliders || className.includes('shell-1-5x')
  const shellWidth = shellWide15 ? `${BASE_UNIT * 1.5}px` : config.width

  const toggleBypass = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation()
    onBypassToggle?.()
  }

  const controlsBody = (() => {
    if (!children) return null
    if (useFlexLayout) {
      return (
        <div
          className={`flex w-full flex-col items-center ${
            className.includes('is-wah-pedal') ? 'h-full min-h-0 flex-1 self-stretch' : ''
          }`}
        >
          {children}
        </div>
      )
    }
    if (className.includes('is-gmajor2')) {
      if (childList.length === 0) return <div className="max-w-full overflow-hidden">{children}</div>
      return (
        <>
          {childList
            .filter((child: unknown) => {
              if (typeof child === 'object' && child !== null) {
                return !(child as ReactChildWithProps)?.props?.className?.includes(
                  'switch-selector-full-width'
                )
              }
              return false
            })
            .map((knob: ReactNode, index: number) => (
              <div
                key={`knob-${index}`}
                className="col-span-full w-full max-w-full overflow-hidden flex justify-center items-center mb-2"
              >
                {knob}
              </div>
            ))}
          {childList
            .filter((child: unknown) => {
              if (typeof child === 'object' && child !== null) {
                return (child as ReactChildWithProps)?.props?.className?.includes(
                  'switch-selector-full-width'
                )
              }
              return false
            })
            .map((switchSelector: ReactNode, index: number) => (
              <div
                key={`switch-selector-${index}`}
                className="col-span-full w-full max-w-full overflow-hidden"
              >
                {switchSelector}
              </div>
            ))}
        </>
      )
    }
    if (className.includes('has-switch-selector-with-knobs')) {
      if (childList.length === 0) return <div className="max-w-full overflow-hidden">{children}</div>
      const switches = childList.filter((child: unknown) => {
        if (typeof child === 'object' && child !== null) {
          return (child as ReactChildWithProps)?.props?.className?.includes(
            'switch-selector-full-width'
          )
        }
        return false
      })
      const knobs = childList.filter((child: unknown) => {
        if (typeof child === 'object' && child !== null) {
          return !(child as ReactChildWithProps)?.props?.className?.includes(
            'switch-selector-full-width'
          )
        }
        return false
      })
      return (
        <>
          {switches.map((switchSelector: ReactNode, index: number) => (
            <div
              key={`switch-selector-${index}`}
              className="col-span-full w-full max-w-full overflow-hidden mb-2"
            >
              {switchSelector}
            </div>
          ))}
          {knobs.length === 0 ? null : className.includes('has-l-grid-3x2') ? (
            knobs.map((knob: ReactNode, knobIndex: number) => (
              <div key={knobIndex} className="overflow-hidden flex justify-center items-center">
                {knob}
              </div>
            ))
          ) : knobs.length === 3 ? (
            <div
              key="knobs-row"
              className="col-span-full grid grid-cols-2 gap-3 w-full justify-items-center"
            >
              <ThreeKnobsLayout items={knobs} />
            </div>
          ) : (
            <div
              key="knobs-row"
              className={`col-span-full grid gap-3 w-full justify-items-center ${
                knobs.length === 1
                  ? 'grid-cols-1'
                  : knobs.length === 2
                    ? 'grid-cols-2'
                    : knobs.length === 4
                      ? 'grid-cols-4'
                      : knobs.length >= 5
                        ? 'grid-cols-5'
                        : 'grid-cols-2'
              }`}
            >
              {knobs.map((knob: ReactNode, knobIndex: number) => (
                <div
                  key={knobIndex}
                  className="max-w-full overflow-hidden flex justify-center items-center"
                >
                  {knob}
                </div>
              ))}
            </div>
          )}
        </>
      )
    }
    if (className.includes('has-l-grid-3x2')) {
      if (childList.length === 0) return <div className="max-w-full overflow-hidden">{children}</div>
      return childList.map((child: ReactNode, index: number) => (
        <div key={index} className="overflow-hidden flex justify-center items-center">
          {child}
        </div>
      ))
    }
    if (hasTwoKnobs) return <TwoKnobsLayout items={childList} />
    if (hasThreeKnobs) return <ThreeKnobsLayout items={childList} />
    if (hasFourKnobs) {
      return (
        <>
          {childList.slice(0, 2).map((child: ReactNode, index: number) => (
            <div
              key={index}
              className="max-w-full overflow-hidden flex justify-center items-center"
            >
              {child}
            </div>
          ))}
          {childList.slice(2, 4).map((child: ReactNode, index: number) => (
            <div
              key={index + 2}
              className="max-w-full overflow-hidden flex justify-center items-center"
            >
              {child}
            </div>
          ))}
        </>
      )
    }
    if (childList.length === 3) {
      return (
        <div className="col-span-full grid grid-cols-2 gap-3 w-full justify-items-center">
          <ThreeKnobsLayout items={childList} />
        </div>
      )
    }
    if (childList.length > 0) {
      return (
        <div
          className={`col-span-full grid gap-3 w-full justify-items-center ${
            childList.length === 1
              ? 'grid-cols-1'
              : childList.length === 2
                ? 'grid-cols-1'
                : childList.length === 4
                  ? 'grid-cols-4'
                  : childList.length >= 5
                    ? 'grid-cols-5'
                    : 'grid-cols-2'
          }`}
        >
          {childList.map((child: ReactNode, index: number) => (
            <div
              key={index}
              className="max-w-full overflow-hidden flex justify-center items-center"
            >
              {child}
            </div>
          ))}
        </div>
      )
    }
    return <div className="max-w-full overflow-hidden">{children}</div>
  })()

  return (
    <div
      className={`border-[3px] rounded-[var(--td-radius-card)] flex flex-col cursor-pointer transition-all duration-200 shadow-sm relative shrink-0 overflow-visible hover:-translate-y-0.5 ${
        hasHorizontalSliders ? '[&_.slider-horizontal]:w-[80%] [&_.slider-horizontal]:mx-auto' : ''
      } ${className}`.trim()}
      onClick={onClick}
      style={{
        width: shellWidth,
        minHeight: config.minHeight,
        padding: config.padding,
        borderColor: accentColor,
        backgroundColor: accentFill(accentColor),
      }}
    >
      {auroraBg && <PedalAuroraBg accent={accentColor} />}

      {/* 1. Tête — marque / logo certifié + modèle */}
      {showHead && (
        <header className="relative z-10 shrink-0 px-0.5 pt-0.5 pb-1.5 overflow-hidden">
          <PedalBrandHeader
            brand={brand}
            model={model}
            brandClassName="[&_div]:line-clamp-2"
            modelClassName="line-clamp-2 break-words px-1"
          />
        </header>
      )}

      {showHead && <div className="relative z-10"><PedalSeparator /></div>}

      {/* 2. Réglages */}
      {children && (
        <div
          className={`relative z-10 flex-1 min-h-0 ${useFlexLayout ? 'flex flex-col gap-2 items-stretch' : 'grid gap-1'} ${
            isEq ? 'py-2 items-stretch' : 'py-3'
          } overflow-visible max-w-full ${
            className.includes('is-wah-pedal') ? '!py-1' : ''
          } ${
            useFlexLayout
              ? 'w-full'
              : className.includes('is-eq-pedal')
                ? 'grid-flow-col auto-cols-[minmax(44px,1fr)] justify-items-center gap-2 content-center'
                : className.includes('is-gmajor2')
                  ? 'grid-cols-1 gap-2'
                  : className.includes('has-l-grid-3x2')
                    ? 'grid-cols-3 grid-flow-row gap-3 justify-items-center auto-rows-auto'
                    : className.includes('has-switch-selector-with-knobs')
                      ? 'grid-cols-1 gap-2'
                      : hasTwoKnobs
                        ? 'grid-cols-1 justify-items-center auto-rows-auto gap-3'
                        : hasThreeKnobs
                          ? 'grid-cols-2 justify-items-center auto-rows-auto gap-3'
                          : hasFourKnobs
                            ? 'grid-cols-2 justify-items-center auto-rows-auto gap-3'
                            : '[&:has(.progress-bar-horizontal)]:grid-cols-1 [&:has(.progress-bar-horizontal)]:gap-2 [&:has(.progress-bar-horizontal)]:py-0.5 [&:has(.progress-bar-container.progress-bar-vertical:not(.progress-bar-horizontal))]:grid-cols-3 [&:has(.progress-bar-container.progress-bar-vertical:not(.progress-bar-horizontal))]:gap-3 [&:has(.slider-horizontal)]:grid-cols-1 [&:has(.slider-horizontal)]:gap-2 [&:has(.slider-horizontal)]:py-0.5 [&:has(.slider-vertical:not(.slider-horizontal))]:grid-cols-3 [&:has(.slider-vertical:not(.slider-horizontal))]:gap-3 grid-cols-[repeat(auto-fit,minmax(60px,1fr))]'
          }`}
        >
          {controlsBody}
        </div>
      )}

      {/* 3. Pied — calqué WebAmp : CTA centré + LED (L/R) ou glow actif/off */}
      {showFoot && (
        <>
          <div className="relative z-10">
            <PedalSeparator />
          </div>
          <footer className="relative z-10 shrink-0 flex flex-col gap-1.5 pt-2 pb-1.5">
            {bottomActions && (
              <div className="flex items-center justify-center w-full min-w-0 px-0.5">
                {bottomActions}
              </div>
            )}

            <div className="relative flex items-center justify-center min-h-[3.5rem] w-full">
              {useLed && ledSide === 'left' && (
                <div className="absolute left-2 top-1/2 -translate-y-1/2">
                  <PedalLed on={engaged} accentColor={accentColor} />
                </div>
              )}
              {useLed && ledSide === 'right' && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  <PedalLed on={engaged} accentColor={accentColor} />
                </div>
              )}

              {showActivation && (
                <button
                  type="button"
                  aria-label={bypassed ? 'Activer' : 'Bypass'}
                  aria-pressed={engaged}
                  title={bypassed ? 'Activer' : 'Bypass'}
                  onClick={toggleBypass}
                  className="cursor-pointer flex items-center justify-center transition-all duration-200 p-0 touch-manipulation shrink-0 active:scale-95"
                  style={{
                    width: footDim.width,
                    height: footDim.height,
                    minWidth: '44px',
                    minHeight: '36px',
                    borderRadius: footDim.radius,
                    // Bouton toujours blanc — statut = LED (ou glow bordure en mode glow)
                    backgroundColor: '#ffffff',
                    borderColor: engaged ? accentColor : '#a1a1aa',
                    borderWidth: '3px',
                    borderStyle: 'solid',
                    boxShadow: engaged
                      ? useLed
                        ? `0 2px 6px rgba(0,0,0,0.1), 0 0 0 1px ${accentColor}40`
                        : `0 0 16px ${accentColor}, 0 0 5px ${accentColor}, 0 2px 6px rgba(0,0,0,0.08)`
                      : 'inset 1px 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
                  }}
                />
              )}
            </div>
          </footer>
        </>
      )}
      <style>{`
        @keyframes pedal-led-core-pulse {
          0%, 100% {
            transform: scale(1);
            filter: brightness(1);
            box-shadow: 0 0 4px var(--pedal-led-accent), 0 0 1px var(--pedal-led-accent);
          }
          40% {
            transform: scale(1.12);
            filter: brightness(1.25);
            box-shadow: 0 0 10px var(--pedal-led-accent), 0 0 3px #fff;
          }
          55% {
            transform: scale(1.04);
            filter: brightness(0.95);
            box-shadow: 0 0 5px var(--pedal-led-accent);
          }
          70% {
            transform: scale(1.14);
            filter: brightness(1.3);
            box-shadow: 0 0 12px var(--pedal-led-accent), 0 0 4px #fff;
          }
        }
        @keyframes pedal-led-halo-breathe {
          0%, 100% {
            width: 10px; height: 10px; opacity: 0.55;
          }
          35% {
            width: 22px; height: 22px; opacity: 0.28;
          }
          50% {
            width: 16px; height: 16px; opacity: 0.4;
          }
          75% {
            width: 26px; height: 26px; opacity: 0.18;
          }
        }
        .pedal-led-core {
          animation: pedal-led-core-pulse 2.1s ease-in-out infinite;
        }
        .pedal-led-halo {
          background: radial-gradient(circle, var(--pedal-led-accent) 0%, transparent 70%);
          animation: pedal-led-halo-breathe 2.1s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .pedal-led-core, .pedal-led-halo { animation: none; }
          .pedal-led-core {
            box-shadow: 0 0 8px var(--pedal-led-accent), 0 0 2px var(--pedal-led-accent);
          }
        }
      `}</style>
    </div>
  )
}
