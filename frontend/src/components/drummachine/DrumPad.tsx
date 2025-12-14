import { memo } from 'react'
import { DrumInstrument } from '../../contexts/DrumMachineContext'

export const INSTRUMENTS_COMPACT: DrumInstrument[] = ['kick', 'snare', 'hihat', 'openhat', 'crash', 'ride', 'tom1', 'tom2', 'tom3']

export const INSTRUMENT_LABELS: Record<DrumInstrument, string> = {
  kick: 'Kick',
  snare: 'Snare',
  hihat: 'Hi-Hat',
  openhat: 'Open Hat',
  crash: 'Crash',
  ride: 'Ride',
  tom1: 'Tom 1',
  tom2: 'Tom 2',
  tom3: 'Tom 3'
}

export const INSTRUMENT_COLORS: Record<DrumInstrument, string> = {
  kick: '#ef4444',
  snare: '#3b82f6',
  hihat: '#10b981',
  openhat: '#06b6d4',
  crash: '#f59e0b',
  ride: '#8b5cf6',
  tom1: '#ec4899',
  tom2: '#f97316',
  tom3: '#a855f7'
}

interface DrumPadProps {
  instrument: DrumInstrument
  isActive: boolean // Actif = joué en ce moment
  isStepActive: boolean // Actif dans le pattern
  onClick: () => void
  size?: 'small' | 'medium' | 'large'
  showLabel?: boolean
  className?: string
}

function DrumPadComponent({
  instrument,
  isActive,
  isStepActive,
  onClick,
  size = 'medium',
  showLabel = true,
  className = ''
}: DrumPadProps) {
  const textSizeClasses = {
    small: 'text-[10px]',
    medium: 'text-xs',
    large: 'text-sm'
  }

  const heightClasses = {
    small: '', // Hauteur gérée par aspect-square dans className
    medium: 'h-10',
    large: 'h-12'
  }

  return (
    <button
      onClick={onClick}
      className={`
        relative rounded-lg transition-all duration-150 touch-manipulation
        flex flex-col items-center justify-center
        border-2
        ${textSizeClasses[size]}
        ${heightClasses[size]}
        ${isActive 
          ? 'scale-105 shadow-lg z-10' 
          : 'hover:scale-105'
        }
        ${isStepActive 
          ? 'opacity-100' 
          : 'opacity-50 bg-gray-200 dark:bg-gray-600'
        }
        ${className}
      `}
      style={{
        backgroundColor: isStepActive ? INSTRUMENT_COLORS[instrument] : undefined,
        borderColor: isStepActive ? INSTRUMENT_COLORS[instrument] : 'rgba(0,0,0,0.1)',
        boxShadow: isActive
          ? `0 0 20px ${INSTRUMENT_COLORS[instrument]}, 0 0 30px ${INSTRUMENT_COLORS[instrument]}80, inset 0 0 15px ${INSTRUMENT_COLORS[instrument]}90`
          : isStepActive
          ? `0 4px 12px ${INSTRUMENT_COLORS[instrument]}50`
          : undefined,
        outline: isActive ? `2px solid ${INSTRUMENT_COLORS[instrument]}` : undefined,
        outlineOffset: isActive ? '2px' : undefined
      }}
      title={INSTRUMENT_LABELS[instrument]}
    >
      {/* Effet de brillance pour le pad actif */}
      {isActive && (
        <>
          <div
            className="absolute inset-0 rounded animate-pulse"
            style={{
              background: `radial-gradient(circle at center, ${INSTRUMENT_COLORS[instrument]}90 0%, transparent 70%)`,
              boxShadow: `inset 0 0 20px ${INSTRUMENT_COLORS[instrument]}`
            }}
          />
          <div
            className="absolute inset-0 rounded"
            style={{
              background: `linear-gradient(135deg, ${INSTRUMENT_COLORS[instrument]}80 0%, transparent 60%)`
            }}
          />
        </>
      )}
      
      {/* Label de l'instrument */}
      {showLabel && (
        <span className={`
          relative z-10 font-bold uppercase tracking-wider
          drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]
          ${isStepActive ? 'text-white' : 'text-black/70 dark:text-white/70'}
        `}>
          {INSTRUMENT_LABELS[instrument].split(' ')[0]}
        </span>
      )}
      
      {/* Indicateur de step actif (seulement si pas de label) */}
      {!showLabel && isStepActive && !isActive && (
        <div
          className="absolute top-1 right-1 w-2 h-2 rounded-full"
          style={{ backgroundColor: INSTRUMENT_COLORS[instrument] }}
        />
      )}
    </button>
  )
}

// Optimisation : mémoriser le composant pour éviter les re-renders inutiles
export const DrumPad = memo(DrumPadComponent, (prevProps, nextProps) => {
  // Ne re-rendre que si les props importantes changent
  return (
    prevProps.instrument === nextProps.instrument &&
    prevProps.isActive === nextProps.isActive &&
    prevProps.isStepActive === nextProps.isStepActive &&
    prevProps.size === nextProps.size &&
    prevProps.showLabel === nextProps.showLabel &&
    prevProps.className === nextProps.className &&
    prevProps.onClick === nextProps.onClick
  )
})

