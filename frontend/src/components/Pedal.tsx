import { ReactNode, useMemo } from 'react'

export type PedalSize = 'S' | 'M' | 'L' | 'XL' | 'XXL'

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
}

// Système de grille : largeur × hauteur (en unités de base de 200px)
const BASE_UNIT = 220
const HEIGHT_MULTIPLIER = 2
const SIZE_CONFIG: Record<PedalSize, { width: string; height: string; padding: string; fontSize: { brand: string; model: string } }> = {
  S: { 
    width: `${BASE_UNIT * 0.5}px`,
    height: `${BASE_UNIT * HEIGHT_MULTIPLIER}px`,
    padding: '0.4rem',
    fontSize: { brand: '0.45rem', model: '0.65rem' }
  },
  M: { 
    width: `${BASE_UNIT * 1}px`,
    height: `${BASE_UNIT * HEIGHT_MULTIPLIER}px`,
    padding: '0.5rem',
    fontSize: { brand: '0.5rem', model: '0.75rem' }
  },
  L: { 
    width: `${BASE_UNIT * 2}px`,
    height: `${BASE_UNIT * HEIGHT_MULTIPLIER}px`,
    padding: '0.6rem',
    fontSize: { brand: '0.55rem', model: '0.85rem' }
  },
  XL: { 
    width: `${BASE_UNIT * 3}px`,
    height: `${BASE_UNIT * HEIGHT_MULTIPLIER}px`,
    padding: '0.7rem',
    fontSize: { brand: '0.6rem', model: '0.95rem' }
  },
  XXL: { 
    width: `${BASE_UNIT * 4}px`,
    height: `${BASE_UNIT * HEIGHT_MULTIPLIER}px`,
    padding: '0.8rem',
    fontSize: { brand: '0.65rem', model: '1rem' }
  }
}

const FOOTSWITCH_SIZE: Record<PedalSize, string> = {
  S: '40px',
  M: '55px',
  L: '70px',
  XL: '85px',
  XXL: '100px'
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
  bottomActions
}: PedalProps) {
  const config = useMemo(() => SIZE_CONFIG[size], [size])
  const footswitchSize = useMemo(() => FOOTSWITCH_SIZE[size], [size])
  const hasBottomActions = !!bottomActions
  const shouldShowBottomBar = showFootswitch || hasBottomActions
  
  // Détecter si la pédale a 3 knobs uniquement
  const hasThreeKnobs = useMemo(() => {
    // Priorité à la classe passée depuis Pedalboard
    if (className.includes('has-three-knobs')) return true
    // Sinon, vérifier les enfants rendus
    if (!children) return false
    const childArray = Array.isArray(children) ? children : [children]
    return childArray.filter((child: any) => 
      child?.type?.displayName === 'Potentiometer' || 
      child?.props?.className?.includes('potentiometer-container')
    ).length === 3
  }, [children, className])

  return (
    <div 
      className={`bg-white dark:bg-gray-800 border-[3px] rounded-2xl flex flex-col cursor-pointer transition-all duration-300 shadow-neumorphic dark:shadow-neumorphic-dark relative overflow-hidden shrink-0 hover:-translate-y-0.5 hover:shadow-neumorphic-hover dark:hover:shadow-neumorphic-dark-hover ${
        bypassed ? 'opacity-50 grayscale-[0.7]' : ''
      } ${className}`.trim()}
      onClick={onClick}
      style={{
        width: config.width,
        height: config.height,
        padding: config.padding,
        borderColor: accentColor
      }}
    >
      {(brand || model) && (
        <div className="flex flex-row justify-between pb-1.5 border-b border-black/10 dark:border-white/10 shrink-0 relative">
          <div className="flex-1 flex flex-col items-center select-none">
            {brand && (
              <div 
                className="text-black/75 dark:text-white/75 uppercase tracking-[0.5px] mb-0.5 font-bold"
                style={{ fontSize: config.fontSize.brand }}
              >
                {brand}
              </div>
            )}
            {model && (
              <div 
                className="font-extrabold text-black/95 dark:text-white/95 text-center leading-tight"
                style={{ fontSize: config.fontSize.model }}
              >
                {model}
              </div>
            )}
          </div>
        </div>
      )}
      
      {children && (
        <div className={`flex-1 ${className.includes('use-flex-layout') ? 'flex flex-col gap-3' : 'grid gap-1'} ${className.includes('has-horizontal-sliders') ? 'mb-4' : 'mb-2'} pt-4  overflow-hidden min-h-0 max-w-full ${
          className.includes('use-flex-layout')
            ? ''
            : className.includes('is-eq-pedal')
            ? 'grid-flow-col auto-cols-[minmax(40px,1fr)] justify-items-center gap-2'
            : className.includes('is-gmajor2')
            ? 'grid-cols-1 gap-2'
            : className.includes('has-l-grid-3x2')
            ? 'grid-cols-3 grid-flow-row gap-3 justify-items-center auto-rows-auto'
            : className.includes('has-switch-selector-with-knobs')
            ? 'grid-cols-1 gap-2'
            : hasThreeKnobs 
            ? 'grid-cols-2 justify-items-center auto-rows-auto' 
            : '[&:has(.progress-bar-horizontal)]:grid-cols-1 [&:has(.progress-bar-horizontal)]:gap-2 [&:has(.progress-bar-horizontal)]:py-0.5 [&:has(.progress-bar-container.progress-bar-vertical:not(.progress-bar-horizontal))]:grid-cols-3 [&:has(.progress-bar-container.progress-bar-vertical:not(.progress-bar-horizontal))]:gap-3 [&:has(.slider-horizontal)]:grid-cols-1 [&:has(.slider-horizontal)]:gap-2 [&:has(.slider-horizontal)]:py-0.5 [&:has(.slider-vertical:not(.slider-horizontal))]:grid-cols-3 [&:has(.slider-vertical:not(.slider-horizontal))]:gap-3 grid-cols-[repeat(auto-fit,minmax(60px,1fr))]'
        }`}>
          {className.includes('is-gmajor2') ? (
            Array.isArray(children) ? (
              <>
                {/* Knobs en premier */}
                {children.filter((child: any) => 
                  !child?.props?.className?.includes('switch-selector-full-width')
                ).map((knob: any, index: number) => (
                  <div key={`knob-${index}`} className="col-span-full w-full max-w-full overflow-hidden flex justify-center items-center mb-2">
                    {knob}
                  </div>
                ))}
                {/* Switch-selector en dessous */}
                {children.filter((child: any) => 
                  child?.props?.className?.includes('switch-selector-full-width')
                ).map((switchSelector: any, index: number) => (
                  <div key={`switch-selector-${index}`} className="col-span-full w-full max-w-full overflow-hidden">
                    {switchSelector}
                  </div>
                ))}
              </>
            ) : <div className="max-w-full overflow-hidden">{children}</div>
          ) : className.includes('has-switch-selector-with-knobs') ? (
            Array.isArray(children) ? (
              <>
                {/* Switch-selectors pleine largeur */}
                {children.filter((child: any) => 
                  child?.props?.className?.includes('switch-selector-full-width')
                ).map((switchSelector: any, index: number) => (
                  <div key={`switch-selector-${index}`} className="col-span-full w-full max-w-full overflow-hidden mb-2">
                    {switchSelector}
                  </div>
                ))}
                {/* Knobs en grille sur la ligne suivante */}
                {(() => {
                  const knobs = children.filter((child: any) => 
                    !child?.props?.className?.includes('switch-selector-full-width')
                  )
                  if (knobs.length === 0) return null
                  // Pour has-l-grid-3x2, les knobs sont directement dans la grille parente (pas de sous-grille)
                  if (className.includes('has-l-grid-3x2')) {
                    // Les knobs sont directement dans la grille parente qui a déjà grid-cols-3
                    return knobs.map((knob: any, knobIndex: number) => (
                      <div key={knobIndex} className="overflow-hidden flex justify-center items-center">
                        {knob}
                      </div>
                    ))
                  }
                  return (
                    <div 
                      key="knobs-row" 
                      className={`col-span-full grid gap-3 w-full justify-items-center ${
                        knobs.length === 1 ? 'grid-cols-1' :
                        knobs.length === 2 ? 'grid-cols-2' :
                        knobs.length === 3 ? 'grid-cols-3' :
                        knobs.length === 4 ? 'grid-cols-4' :
                        knobs.length >= 5 ? 'grid-cols-5' : 'grid-cols-2'
                      }`}
                    >
                      {knobs.map((knob: any, knobIndex: number) => (
                        <div key={knobIndex} className="max-w-full overflow-hidden flex justify-center items-center">
                          {knob}
                        </div>
                      ))}
                    </div>
                  )
                })()}
              </>
            ) : <div className="max-w-full overflow-hidden">{children}</div>
          ) : className.includes('has-l-grid-3x2') ? (
            Array.isArray(children) ? (
              // Pour has-l-grid-3x2, même logique que has-three-knobs mais en 3x2
              // Chaque enfant prend 1 colonne, répartition horizontale ligne par ligne
              children.map((child: any, index: number) => (
                <div key={index} className="overflow-hidden flex justify-center items-center">
                  {child}
                </div>
              ))
            ) : <div className="max-w-full overflow-hidden">{children}</div>
          ) : hasThreeKnobs ? (
            <>
              {Array.isArray(children) ? children.map((child: any, index: number) => (
                <div
                  key={index}
                  className={`max-w-full overflow-hidden ${index === 2 ? 'col-span-2 justify-self-center' : ''}`}
                >
                  {child}
                </div>
              )) : children}
            </>
          ) : (
            Array.isArray(children) ? (
              <div 
                className={`col-span-full grid gap-3 w-full justify-items-center ${
                  children.length === 1 ? 'grid-cols-1' :
                  children.length === 2 ? 'grid-cols-2' :
                  children.length === 3 ? 'grid-cols-3' :
                  children.length === 4 ? 'grid-cols-4' :
                  children.length >= 5 ? 'grid-cols-5' : 'grid-cols-2'
                }`}
              >
                {children.map((child: any, index: number) => (
                  <div key={index} className="max-w-full overflow-hidden flex justify-center items-center">
                    {child}
                  </div>
                ))}
              </div>
            ) : <div className="max-w-full overflow-hidden">{children}</div>
          )}
        </div>
      )}

      {shouldShowBottomBar && (
        <div className={`flex ${showFootswitch ? 'justify-between' : 'justify-start'} items-center pt-1.5 pb-1.5 border-t border-black/10 dark:border-white/10 shrink-0 h-20`}>
          <div className="flex items-center w-full">
            {bottomActions}
          </div>
          {showFootswitch && (
            <button 
              onClick={(e) => {
                e.stopPropagation()
                onBypassToggle?.()
              }}
              className="rounded-full cursor-pointer flex items-center justify-center transition-all duration-200 p-0 touch-manipulation"
              style={{ 
                width: footswitchSize,
                height: footswitchSize,
                minWidth: '44px',
                minHeight: '44px',
                backgroundColor: bypassed ? '#333' : '#ffffff',
                borderColor: accentColor,
                borderWidth: '2px',
                borderStyle: 'solid',
                boxShadow: bypassed 
                  ? 'inset 3px 3px 6px rgba(0, 0, 0, 0.3), inset -3px -3px 6px rgba(255, 255, 255, 0.1)'
                  : '2px 2px 4px rgba(0, 0, 0, 0.08), -2px -2px 4px rgba(255, 255, 255, 0.9), 0 0 0 1px ' + accentColor
              }}
              onMouseEnter={(e) => {
                if (!bypassed) {
                  e.currentTarget.style.boxShadow = '3px 3px 6px rgba(0, 0, 0, 0.1), -3px -3px 6px rgba(255, 255, 255, 1), 0 0 0 1px ' + accentColor
                  e.currentTarget.style.transform = 'scale(1.05)'
                }
              }}
              onMouseLeave={(e) => {
                if (!bypassed) {
                  e.currentTarget.style.boxShadow = '2px 2px 4px rgba(0, 0, 0, 0.08), -2px -2px 4px rgba(255, 255, 255, 0.9), 0 0 0 1px ' + accentColor
                  e.currentTarget.style.transform = 'scale(1)'
                }
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.boxShadow = 'inset 2px 2px 4px rgba(0, 0, 0, 0.1), inset -2px -2px 4px rgba(255, 255, 255, 0.5)'
                e.currentTarget.style.transform = 'scale(0.95)'
              }}
              onMouseUp={(e) => {
                if (bypassed) {
                  e.currentTarget.style.boxShadow = 'inset 3px 3px 6px rgba(0, 0, 0, 0.3), inset -3px -3px 6px rgba(255, 255, 255, 0.1)'
                } else {
                  e.currentTarget.style.boxShadow = '2px 2px 4px rgba(0, 0, 0, 0.08), -2px -2px 4px rgba(255, 255, 255, 0.9), 0 0 0 1px ' + accentColor
                }
                e.currentTarget.style.transform = 'scale(1)'
              }}
              onTouchStart={(e) => {
                e.stopPropagation()
                const target = e.currentTarget
                target.style.boxShadow = 'inset 2px 2px 4px rgba(0, 0, 0, 0.1), inset -2px -2px 4px rgba(255, 255, 255, 0.5)'
                target.style.transform = 'scale(0.95)'
              }}
              onTouchEnd={(e) => {
                e.stopPropagation()
                const target = e.currentTarget
                onBypassToggle?.()
                if (bypassed) {
                  target.style.boxShadow = 'inset 3px 3px 6px rgba(0, 0, 0, 0.3), inset -3px -3px 6px rgba(255, 255, 255, 0.1)'
                } else {
                  target.style.boxShadow = '2px 2px 4px rgba(0, 0, 0, 0.08), -2px -2px 4px rgba(255, 255, 255, 0.9), 0 0 0 1px ' + accentColor
                }
                target.style.transform = 'scale(1)'
              }}
            >
              <div 
                className={`rounded-full transition-all duration-200 ${
                  size === 'L' || size === 'XL' || size === 'XXL' ? 'w-3.5 h-3.5' : 'w-3 h-3'
                }`}
                style={{ 
                  backgroundColor: bypassed ? '#666' : accentColor
                }}
              />
            </button>
          )}
        </div>
      )}
    </div>
  )
}
