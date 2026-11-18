import { useId } from 'react'
import type { EnclosureTexture, EquipmentSurfaceConfig, PedalArchetype } from '../types'
import { EQUIPMENT_FINISHES, resolveSurfaceColor } from '../tokens'
import { PEDAL_DIMENSIONS } from '../layouts'
import { WalrusChrome } from './WalrusChrome'
import { WebampChrome } from './WebampChrome'

export interface PedalChassisProps {
  variant: PedalArchetype
  surface?: EquipmentSurfaceConfig
  accentColor: string
  alt: string
  className?: string
  /** Dimensions réelles de la définition (un modèle peut réduire le canevas). */
  dimensions?: { width: number; height: number }
  /** Habillage constructeur (marque licenciée), dessiné par-dessus le boîtier. */
  chrome?: {
    kind: 'walrus-fundamental' | 'webamp-classic'
    modelName: string
    sliderYs: number[]
    sliderLength: number
    footNote?: string
    /** Ligne de gamme sérigraphiée (« OVER DRIVE »). */
    series?: string
    /** Mention latérale de façade (« DIR OUT »). */
    sideNote?: string
    /** Pictogrammes de forme d'onde sous le dernier potentiomètre. */
    waveGlyphs?: boolean
    /** Bloc accordeur sérigraphié (écran de note, échelle PITCH). */
    tunerDisplay?: boolean
    /** Bloc de commandes dans la couleur du boîtier (EQ-700). */
    faceTone?: 'body'
    /** Sous-échelle sérigraphiée par knob (MIN/MAX si absente). */
    knobScales?: Record<string, { left: string; right: string }>
    /** Faders verticaux (EQ) : centre, longueur et libellé. */
    sliders?: { x: number; y: number; length: number; label: string }[]
    /** Molette FX : libellés crantés près du bouton. */
    rotaryLabels?: { x: number; y: number; size: number; label: string; options: string[] }[]
    /** Knobs (id, centre % + taille px), pour le bandeau de commandes Webamp. */
    knobs?: { id?: string; x: number; y: number; size: number }[]
    /** Ordonnées (%) des sélecteurs (hors footswitch). */
    switchYs?: number[]
    /** Ordonnée (%) du footswitch, pour caler le pad Webamp. */
    footY?: number
  }
}

interface Box {
  x: number
  y: number
  w: number
  h: number
  rx: number
}

/** Encombrement du boîtier (en px du canevas de l'archétype). */
const BODY: Record<PedalArchetype, Box> = {
  compact: { x: 18, y: 8, w: 264, h: 450, rx: 16 },
  'compact-wide': { x: 18, y: 8, w: 344, h: 450, rx: 16 },
  mini: { x: 12, y: 10, w: 196, h: 338, rx: 12 },
  sliders: { x: 10, y: 15, w: 250, h: 476, rx: 16 },
  eq: { x: 10, y: 14, w: 520, h: 374, rx: 14 },
  treadle: { x: 14, y: 10, w: 272, h: 494, rx: 18 },
  expression: { x: 12, y: 10, w: 236, h: 396, rx: 16 },
  looper: { x: 14, y: 10, w: 352, h: 448, rx: 16 },
  desktop: { x: 10, y: 10, w: 500, h: 278, rx: 14 },
  tuner: { x: 10, y: 10, w: 220, h: 378, rx: 12 },
}

function texturePattern(uid: string, texture: EnclosureTexture | undefined, base: string) {
  switch (texture) {
    case 'brushed-metal':
    case 'anodized-metal':
      return (
        <pattern id={`tex-${uid}`} width="40" height="4" patternUnits="userSpaceOnUse">
          <rect width="40" height="4" fill={base} />
          <line x1="0" y1="1" x2="40" y2="1" stroke="rgba(255,255,255,0.12)" strokeWidth="0.7" />
          <line x1="0" y1="3" x2="40" y2="3" stroke="rgba(0,0,0,0.12)" strokeWidth="0.7" />
        </pattern>
      )
    case 'carbon-fiber':
      return (
        <pattern id={`tex-${uid}`} width="8" height="8" patternUnits="userSpaceOnUse">
          <rect width="8" height="8" fill="#18181b" />
          <rect width="4" height="4" fill="#27272a" />
          <rect x="4" y="4" width="4" height="4" fill="#27272a" />
        </pattern>
      )
    case 'wood-grain':
      return (
        <pattern id={`tex-${uid}`} width="60" height="12" patternUnits="userSpaceOnUse">
          <rect width="60" height="12" fill={base} />
          <path d="M0 3 Q15 1 30 3 T60 3" fill="none" stroke="rgba(0,0,0,0.22)" strokeWidth="1" />
          <path d="M0 9 Q20 11 40 9 T60 9" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" />
        </pattern>
      )
    case 'tolex':
      return (
        <pattern id={`tex-${uid}`} width="8" height="8" patternUnits="userSpaceOnUse">
          <rect width="8" height="8" fill={base} />
          <circle cx="2" cy="2" r="1.1" fill="rgba(0,0,0,0.22)" />
          <circle cx="6" cy="6" r="1.1" fill="rgba(255,255,255,0.06)" />
        </pattern>
      )
    case 'hammered-metal':
    case 'powder-coated':
    case 'textured-paint':
    case 'aged-worn':
      return (
        <pattern id={`tex-${uid}`} width="10" height="10" patternUnits="userSpaceOnUse">
          <rect width="10" height="10" fill={base} />
          <circle cx="3" cy="3" r="1.8" fill="rgba(255,255,255,0.07)" />
          <circle cx="7.5" cy="7.5" r="2.1" fill="rgba(0,0,0,0.12)" />
        </pattern>
      )
    default:
      return (
        <pattern id={`tex-${uid}`} width="10" height="10" patternUnits="userSpaceOnUse">
          <rect width="10" height="10" fill={base} />
        </pattern>
      )
  }
}

/**
 * Châssis de pédale paramétré : un seul composant pour les 10 archétypes.
 * Aucune marque réelle n'est dessinée — uniquement la silhouette et la surface.
 */
export function PedalChassis({
  variant,
  surface,
  accentColor,
  alt,
  className = '',
  chrome,
  dimensions,
}: PedalChassisProps) {
  const uid = useId().replace(/:/g, '')
  const dims = dimensions ?? PEDAL_DIMENSIONS[variant]
  const color = resolveSurfaceColor(surface, 'anthracite')
  const finish = EQUIPMENT_FINISHES[surface?.finish ?? 'satin']
  const base = BODY[variant]
  // Les largeurs restent relatives au canevas : une définition peut réduire celui-ci.
  const body = { ...base, w: base.w + (dims.width - PEDAL_DIMENSIONS[variant].width) }
  const isEQ = variant === 'eq'
  const isTreadle = variant === 'treadle' || variant === 'expression'

  return (
    <svg
      viewBox={`0 0 ${dims.width} ${dims.height}`}
      role="img"
      aria-label={alt}
      data-chassis={variant}
      data-surface-color={surface?.color ?? 'anthracite'}
      data-surface-finish={finish.id}
      className={`pointer-events-none absolute inset-0 h-full w-full select-none ${className}`}
    >
      <defs>
        {texturePattern(uid, surface?.texture ?? (isEQ ? 'brushed-metal' : 'powder-coated'), color.hex)}
        <linearGradient id={`sheen-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={`rgba(255,255,255,${finish.glossOpacity})`} />
          <stop offset="46%" stopColor="rgba(255,255,255,0)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.3)" />
        </linearGradient>
        <linearGradient id={`top-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color.highlight} stopOpacity="0.55" />
          <stop offset="100%" stopColor={color.hex} stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`jack-${uid}`} cx="30%" cy="25%" r="80%">
          <stop offset="0%" stopColor="#f8fafc" />
          <stop offset="55%" stopColor="#94a3b8" />
          <stop offset="100%" stopColor="#334155" />
        </radialGradient>
      </defs>

      {/* Pieds / patins */}
      {!isTreadle && variant !== 'desktop' && !chrome && (
        <>
          <rect x={body.x + 22} y={body.y + body.h - 2} width={26} height={10} rx={4} fill="#09090b" />
          <rect x={body.x + body.w - 48} y={body.y + body.h - 2} width={26} height={10} rx={4} fill="#09090b" />
        </>
      )}

      {/* Corps */}
      <rect
        x={body.x}
        y={body.y}
        width={body.w}
        height={body.h}
        rx={body.rx}
        fill={`url(#tex-${uid})`}
        stroke={color.shadow}
        strokeWidth="2"
      />
      <rect x={body.x} y={body.y} width={body.w} height={body.h} rx={body.rx} fill={`url(#sheen-${uid})`} />
      <rect
        x={body.x + 5}
        y={body.y + 5}
        width={body.w - 10}
        height={body.h - 10}
        rx={Math.max(6, body.rx - 4)}
        fill="none"
        stroke={finish.borderStyle}
        strokeWidth="1.3"
      />

      {/* Plaque supérieure (contrôles) */}
      {!isEQ && variant !== 'desktop' && !chrome && (
        <rect
          x={body.x + 7}
          y={body.y + 6}
          width={body.w - 14}
          height={body.h * (isTreadle ? 0.13 : 0.32)}
          rx={Math.max(6, body.rx - 6)}
          fill={`url(#top-${uid})`}
        />
      )}

      {/* Faders guides EQ */}
      {isEQ && (
        <g opacity="0.18" stroke="#475569" strokeWidth="0.7">
          {[40, 75, 110, 145, 180, 215, 250, 285, 320, 355].map((y) => (
            <line key={y} x1={body.x + 12} y1={y} x2={body.x + body.w - 12} y2={y} />
          ))}
        </g>
      )}

      {/* Zone du pad caoutchouc */}
      {!isEQ && !isTreadle && variant !== 'desktop' && variant !== 'tuner' && !chrome && (
        <rect
          x={body.x + 9}
          y={body.y + body.h * 0.67}
          width={body.w - 18}
          height={body.h * 0.28}
          rx={9}
          fill="#09090b"
          opacity="0.22"
        />
      )}

      {/* Plaque de pédale d'expression / wah */}
      {isTreadle && (
        <>
          <polygon
            points={`${body.x + 14},${body.y + body.h * 0.47} ${body.x + body.w - 14},${body.y + body.h * 0.44} ${body.x + body.w - 22},${body.y + body.h * 0.9} ${body.x + 22},${body.y + body.h * 0.93}`}
            fill={color.shadow}
            opacity="0.55"
            stroke="#09090b"
            strokeWidth="2"
          />
          <polygon
            points={`${body.x + 22},${body.y + body.h * 0.49} ${body.x + body.w - 22},${body.y + body.h * 0.46} ${body.x + body.w - 29},${body.y + body.h * 0.87} ${body.x + 29},${body.y + body.h * 0.9}`}
            fill={`url(#tex-${uid})`}
            opacity="0.9"
            stroke={color.highlight}
            strokeOpacity="0.25"
            strokeWidth="1.4"
          />
          <rect x={body.x + 4} y={body.y + body.h * 0.44} width={body.w - 8} height="5" rx="2.5" fill="#52525b" />
        </>
      )}

      {/* Habillage constructeur */}
      {chrome?.kind === 'webamp-classic' && (
        <WebampChrome
          bodyColor={color.hex}
          series={chrome.series ?? 'EFFECT'}
          modelName={chrome.modelName}
          knobs={chrome.knobs ?? []}
          switchYs={chrome.switchYs ?? []}
          footY={chrome.footY}
          sideNote={chrome.sideNote}
          waveGlyphs={chrome.waveGlyphs}
          tunerDisplay={chrome.tunerDisplay}
          faceTone={chrome.faceTone}
          knobScales={chrome.knobScales}
          sliders={chrome.sliders}
          rotaryLabels={chrome.rotaryLabels}
          width={dims.width}
          height={dims.height}
        />
      )}
      {chrome?.kind === 'walrus-fundamental' && (
        <WalrusChrome
          accent={accentColor}
          modelName={chrome.modelName}
          sliderYs={chrome.sliderYs}
          sliderLength={chrome.sliderLength}
          footNote={chrome.footNote}
          width={dims.width}
          height={dims.height}
        />
      )}

      {/* Vis de fixation */}
      {!chrome &&
        [
          [body.x + 12, body.y + 14],
          [body.x + body.w - 12, body.y + 14],
          [body.x + 12, body.y + body.h - 14],
          [body.x + body.w - 12, body.y + body.h - 14],
        ].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="3" fill="#94a3b8" stroke="#1e293b" strokeWidth="1" />
        ))}

      {/* Témoin d'accent (liseré de gamme) */}
      {!chrome && (
        <rect
          x={body.x + 10}
          y={body.y + body.h - 12}
          width={body.w - 20}
          height="2.5"
          rx="1.25"
          fill={accentColor}
          opacity="0.55"
        />
      )}
    </svg>
  )
}
