import { useId } from 'react'
import type { AmpArchetype, EquipmentSurfaceConfig, MeshPattern } from '../types'
import { EQUIPMENT_FINISHES, resolveSurfaceColor } from '../tokens'
import { AMP_DIMENSIONS, headGoldJackSvg } from '../layouts'

export interface AmpChassisProps {
  variant: AmpArchetype
  surface?: EquipmentSurfaceConfig
  accentColor: string
  alt: string
  className?: string
}

function meshPattern(uid: string, mesh: MeshPattern | undefined, color: string) {
  switch (mesh) {
    case 'honeycomb-mesh':
      return (
        <pattern id={`mesh-${uid}`} width="20" height="17.32" patternUnits="userSpaceOnUse">
          <rect width="20" height="17.32" fill="#27272a" />
          <polygon points="5,1 13,1 17,8.66 13,16.32 5,16.32 1,8.66" fill="#09090b" stroke={color} strokeWidth="0.9" />
        </pattern>
      )
    case 'diamond-mesh':
      return (
        <pattern id={`mesh-${uid}`} width="10" height="10" patternUnits="userSpaceOnUse">
          <rect width="10" height="10" fill="#09090b" />
          <path d="M0 5 L5 0 L10 5 L5 10 Z" fill="none" stroke={color} strokeWidth="0.9" />
        </pattern>
      )
    case 'perforated-metal':
      return (
        <pattern id={`mesh-${uid}`} width="8" height="8" patternUnits="userSpaceOnUse">
          <rect width="8" height="8" fill={color} />
          <circle cx="4" cy="4" r="2" fill="#09090b" />
        </pattern>
      )
    case 'metal-mesh':
    case 'speaker-cloth':
    case 'woven-fabric':
    case 'vintage-grill-cloth':
    default:
      return (
        <pattern id={`mesh-${uid}`} width="6" height="6" patternUnits="userSpaceOnUse">
          <rect width="6" height="6" fill="#111114" />
          <line x1="0" y1="3" x2="6" y2="3" stroke={color} strokeWidth="0.9" opacity="0.6" />
          <line x1="3" y1="0" x2="3" y2="6" stroke={color} strokeWidth="0.9" opacity="0.4" />
        </pattern>
      )
  }
}

interface AmpGeo {
  cab: { x: number; y: number; w: number; h: number }
  grille: { x: number; y: number; w: number; h: number }
  plate: { x: number; y: number; w: number; h: number }
  handle: boolean
  jack: { x: number; y: number }
}

const GEO: Record<AmpArchetype, AmpGeo> = {
  'head-gold': {
    cab: { x: 14, y: 18, w: 752, h: 305 },
    grille: { x: 38, y: 42, w: 704, h: 172 },
    plate: { x: 40, y: 220, w: 700, h: 94 },
    handle: true,
    jack: { x: 663, y: 269 },
  },
  'head-citrus': {
    cab: { x: 14, y: 18, w: 752, h: 326 },
    grille: { x: 86, y: 190, w: 608, h: 114 },
    plate: { x: 44, y: 44, w: 692, h: 130 },
    handle: true,
    jack: { x: 671, y: 264 },
  },
  'head-silver': {
    cab: { x: 14, y: 18, w: 732, h: 326 },
    grille: { x: 38, y: 42, w: 684, h: 174 },
    plate: { x: 38, y: 222, w: 684, h: 96 },
    handle: true,
    jack: { x: 70, y: 266 },
  },
  'head-black': {
    cab: { x: 14, y: 18, w: 752, h: 305 },
    grille: { x: 38, y: 42, w: 704, h: 172 },
    plate: { x: 40, y: 220, w: 700, h: 94 },
    handle: true,
    jack: { x: 705, y: 250 },
  },
  lunchbox: {
    cab: { x: 12, y: 16, w: 496, h: 226 },
    grille: { x: 24, y: 28, w: 472, h: 108 },
    plate: { x: 24, y: 146, w: 472, h: 82 },
    handle: true,
    jack: { x: 470, y: 178 },
  },
  combo: {
    cab: { x: 14, y: 40, w: 592, h: 462 },
    grille: { x: 26, y: 58, w: 568, h: 288 },
    plate: { x: 26, y: 358, w: 568, h: 106 },
    handle: true,
    jack: { x: 560, y: 404 },
  },
  'combo-twin': {
    cab: { x: 14, y: 40, w: 672, h: 502 },
    grille: { x: 26, y: 58, w: 648, h: 306 },
    plate: { x: 26, y: 376, w: 648, h: 140 },
    handle: true,
    jack: { x: 640, y: 440 },
  },
  rack: {
    cab: { x: 12, y: 12, w: 616, h: 296 },
    grille: { x: 24, y: 34, w: 300, h: 120 },
    plate: { x: 24, y: 190, w: 592, h: 104 },
    handle: false,
    jack: { x: 580, y: 240 },
  },
}

/**
 * Châssis d'ampli paramétré : silhouette + grille + façade.
 */
export function AmpChassis({ variant, surface, accentColor, alt, className = '' }: AmpChassisProps) {
  const uid = useId().replace(/:/g, '')
  const dims = AMP_DIMENSIONS[variant]
  const color = resolveSurfaceColor(surface, 'black')
  const finish = EQUIPMENT_FINISHES[surface?.finish ?? 'matte']
  const faceplate = resolveSurfaceColor({ color: surface?.faceplateColor ?? 'silver' }, 'silver')
  const geo =
    variant === 'head-gold' ? { ...GEO[variant], jack: headGoldJackSvg() } : GEO[variant]
  const isRack = variant === 'rack'

  return (
    <svg
      viewBox={`0 0 ${dims.width} ${dims.height}`}
      role="img"
      aria-label={alt}
      data-chassis={variant}
      className={`pointer-events-none absolute inset-0 h-full w-full select-none ${className}`}
    >
      <defs>
        <pattern id={`tolex-${uid}`} width="8" height="8" patternUnits="userSpaceOnUse">
          <rect width="8" height="8" fill={color.hex} />
          <circle cx="2" cy="2" r="1.1" fill="rgba(0,0,0,0.22)" />
          <circle cx="6" cy="6" r="1.1" fill="rgba(255,255,255,0.06)" />
        </pattern>
        <linearGradient id={`plate-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={faceplate.highlight} />
          <stop offset="45%" stopColor={faceplate.hex} />
          <stop offset="100%" stopColor={faceplate.shadow} />
        </linearGradient>
        <linearGradient id={`cab-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color.highlight} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color.shadow} stopOpacity="0.35" />
        </linearGradient>
        <radialGradient id={`jack-${uid}`} cx="30%" cy="25%" r="80%">
          <stop offset="0%" stopColor="#f8fafc" />
          <stop offset="55%" stopColor="#94a3b8" />
          <stop offset="100%" stopColor="#334155" />
        </radialGradient>
        {meshPattern(uid, surface?.mesh ?? (isRack ? 'perforated-metal' : 'woven-fabric'), surface?.grilleColor ?? '#3f3f46')}
      </defs>

      {/* Poignée */}
      {geo.handle && (
        <>
          <path
            d={`M${dims.width / 2 - 130} ${geo.cab.y + 4} C${dims.width / 2 - 110} ${geo.cab.y - 14}, ${dims.width / 2 + 110} ${geo.cab.y - 14}, ${dims.width / 2 + 130} ${geo.cab.y + 4} Z`}
            fill="#18181b"
            stroke="#09090b"
            strokeWidth="2"
          />
          <rect x={dims.width / 2 - 118} y={geo.cab.y - 6} width="30" height="9" rx="3" fill="#27272a" />
          <rect x={dims.width / 2 + 88} y={geo.cab.y - 6} width="30" height="9" rx="3" fill="#27272a" />
        </>
      )}

      {/* Pieds */}
      <rect x={geo.cab.x + 44} y={geo.cab.y + geo.cab.h - 4} width="46" height="16" rx="4" fill="#09090b" />
      <rect x={geo.cab.x + geo.cab.w - 90} y={geo.cab.y + geo.cab.h - 4} width="46" height="16" rx="4" fill="#09090b" />

      {/* Caisson */}
      <rect
        x={geo.cab.x}
        y={geo.cab.y}
        width={geo.cab.w}
        height={geo.cab.h}
        rx={16}
        fill={isRack ? color.hex : `url(#tolex-${uid})`}
        stroke="#09090b"
        strokeWidth="2.5"
      />
      {!isRack && (
        <rect x={geo.cab.x} y={geo.cab.y} width={geo.cab.w} height={geo.cab.h} rx={16} fill={`url(#cab-${uid})`} />
      )}

      {/* Coins renforcés */}
      {!isRack &&
        [
          ['M', geo.cab.x + 6, geo.cab.y + 40, 0],
          ['M', geo.cab.x + geo.cab.w - 6, geo.cab.y + 40, 1],
        ].map(([_, x, y, i]) => (
          <path
            key={String(i)}
            d={`M${Number(x)} ${Number(y)} L${Number(x) + (Number(i) === 0 ? 38 : -38)} ${Number(y)} L${Number(x) + (Number(i) === 0 ? 38 : -38)} ${Number(y) - 18} Q${Number(x)} ${Number(y) - 18} ${Number(x)} ${Number(y)} Z`}
            fill="#09090b"
            opacity="0.85"
          />
        ))}

      {/* Panneau avant (faceplate) */}
      <rect
        x={geo.plate.x}
        y={geo.plate.y}
        width={geo.plate.w}
        height={geo.plate.h}
        rx={4}
        fill={`url(#plate-${uid})`}
        stroke="#18181b"
        strokeWidth="2"
        opacity={variant === 'head-citrus' ? 1 : 0.98}
      />
      <line
        x1={geo.plate.x + 2}
        y1={geo.plate.y + 3}
        x2={geo.plate.x + geo.plate.w - 2}
        y2={geo.plate.y + 3}
        stroke="rgba(255,255,255,0.55)"
        strokeWidth="1"
      />

      {/* Grille */}
      <rect
        x={geo.grille.x}
        y={geo.grille.y}
        width={geo.grille.w}
        height={geo.grille.h}
        rx={6}
        fill={`url(#mesh-${uid})`}
        stroke={surface?.pipingColor ?? '#f8fafc'}
        strokeWidth="3"
      />

      {/* Cadre / piping de la grille */}
      <rect
        x={geo.grille.x + 6}
        y={geo.grille.y + 6}
        width={geo.grille.w - 12}
        height={geo.grille.h - 12}
        rx={4}
        fill="none"
        stroke="rgba(255,255,255,0.16)"
        strokeWidth="1.2"
      />

      {/* Jack d'entrée (+ label INPUT sur head-gold, style façade source) */}
      {variant === 'head-gold' && (
        <text
          x={geo.jack.x}
          y={geo.jack.y - Math.max(14, dims.width * 0.022)}
          textAnchor="middle"
          fill="#1c1917"
          fontSize={Math.max(7, dims.width * 0.011)}
          fontWeight="700"
          letterSpacing="0.12em"
          style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}
        >
          INPUT
        </text>
      )}
      <circle cx={geo.jack.x} cy={geo.jack.y} r={Math.max(9, dims.width * 0.016)} fill={`url(#jack-${uid})`} stroke="#18181b" strokeWidth="1.5" />
      <circle cx={geo.jack.x} cy={geo.jack.y} r={Math.max(4, dims.width * 0.007)} fill="#09090b" />

      {/* Liseré d'accent de gamme */}
      <rect
        x={geo.plate.x + 6}
        y={geo.plate.y + geo.plate.h - 4}
        width={geo.plate.w - 12}
        height="2"
        rx="1"
        fill={accentColor}
        opacity="0.7"
      />

      {/* Écran (rack / modélisateurs) */}
      {isRack && (
        <>
          <rect x={geo.grille.x + 10} y={geo.grille.y + 10} width={geo.grille.w - 20} height={geo.grille.h - 20} rx={4} fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
          <rect x={geo.grille.x + 24} y={geo.grille.y + 26} width={geo.grille.w - 48} height={8} rx={4} fill={accentColor} opacity="0.55" />
          <rect x={geo.grille.x + 24} y={geo.grille.y + 44} width={geo.grille.w - 120} height={5} rx={2.5} fill="#38bdf8" opacity="0.35" />
        </>
      )}

      {/* Piping + finition */}
      <rect
        x={geo.cab.x + 6}
        y={geo.cab.y + 6}
        width={geo.cab.w - 12}
        height={geo.cab.h - 12}
        rx={12}
        fill="none"
        stroke={finish.borderStyle}
        strokeWidth="1.2"
      />
    </svg>
  )
}
