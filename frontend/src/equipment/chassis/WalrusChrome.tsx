/**
 * Habillage constructeur de la série Walrus Audio Fundamental.
 *
 * Reproduit la face réelle (droits image obtenus) : double liseré coloré,
 * emblème en haut, vis le long des faders, sérigraphie
 * « WALRUS AUDIO® / FUNDAMENTAL / MODÈLE », LED carrée câblée au footswitch.
 * Repère : celui du canevas `compact-wide` réduit (304 × 460 pour la série).
 */

import { WALRUS_LOGO_PATHS, WALRUS_LOGO_VIEWBOX } from './walrusLogo'

const CREAM = '#EDE4D0'

/** Ordonnée du centre de l'emblème (dans le repère du canevas). */
const EMBLEM_Y = 42
/** Rayon du cercle : agrandi pour que le logo reste lisible à 304 px de large. */
const EMBLEM_RADIUS = 15.5
/** Hauteur du logo : doit tenir dans le cercle avec ~3 px de marge. */
const LOGO_HEIGHT = 23

export interface WalrusChromeProps {
  accent: string
  modelName: string
  /** Ordonnées (%) des faders, pour aligner les vis et les glissières. */
  sliderYs: number[]
  /** Longueur réelle d'un fader (px du canevas) : la gorge s'y aligne. */
  sliderLength: number
  /** Mention sous le footswitch (« HOLD FOR TAP MODE »). */
  footNote?: string
  /** Largeur/hauteur du canevas du châssis. */
  width: number
  height: number
}

export function WalrusChrome({
  accent,
  modelName,
  sliderYs,
  sliderLength,
  footNote,
  width,
  height,
}: WalrusChromeProps) {
  const cx = width / 2
  const railWidth = sliderLength + 12
  const shortName = modelName.replace(/^Fundamental\s+/i, '').toUpperCase()
  const y = (pct: number) => (pct / 100) * height
  // Le SVG fourni est en 216 × 239,67 : on le met à l'échelle par la hauteur,
  // puis on le centre sur l'emblème.
  const logoScale = LOGO_HEIGHT / WALRUS_LOGO_VIEWBOX.height
  const logoWidth = WALRUS_LOGO_VIEWBOX.width * logoScale

  return (
    <g data-chrome="walrus-fundamental">
      {/* Double liseré : couleur de série + filet crème */}
      <rect
        x={26}
        y={16}
        width={width - 52}
        height={height - 26}
        rx={9}
        fill="none"
        stroke={accent}
        strokeWidth={2.4}
      />
      <rect
        x={31}
        y={21}
        width={width - 62}
        height={height - 36}
        rx={6}
        fill="none"
        stroke={CREAM}
        strokeWidth={1.4}
        opacity={0.95}
      />

      {/* Emblème : trait + logo Walrus Audio (sans flèches) */}
      <g stroke={accent} strokeWidth={1.4} fill="none">
        <line x1={cx - 72} y1={EMBLEM_Y} x2={cx - 23} y2={EMBLEM_Y} />
        <line x1={cx + 23} y1={EMBLEM_Y} x2={cx + 72} y2={EMBLEM_Y} />
        <circle cx={cx} cy={EMBLEM_Y} r={EMBLEM_RADIUS} strokeWidth={1.6} />
      </g>
      <g
        transform={`translate(${cx - logoWidth / 2} ${EMBLEM_Y - LOGO_HEIGHT / 2}) scale(${logoScale})`}
        fill={accent}
      >
        {WALRUS_LOGO_PATHS.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>

      {/* Glissières et vis des faders */}
      {sliderYs.map((pct, i) => (
        <g key={i}>
          <rect
            x={cx - railWidth / 2}
            y={y(pct) - 6}
            width={railWidth}
            height={12}
            rx={6}
            fill="#1b1b1f"
            stroke="#000"
            strokeWidth={0.8}
            opacity={0.95}
          />
          {/* Reflet supérieur, rentré de la valeur du rayon de la gorge pour
              qu'il ne dépasse jamais ses extrémités arrondies. */}
          <rect
            x={cx - railWidth / 2 + 7}
            y={y(pct) - 5.4}
            width={railWidth - 14}
            height={1.6}
            rx={0.8}
            fill="#ffffff"
            opacity={0.12}
          />
          {[cx - railWidth / 2 - 12, cx + railWidth / 2 + 12].map((sx) => (
            <g key={sx}>
              <circle cx={sx} cy={y(pct)} r={4.6} fill="#171717" stroke="#000" strokeWidth={0.8} />
              <circle cx={sx} cy={y(pct)} r={1.4} fill="#000" />
            </g>
          ))}
        </g>
      ))}

      {/* Sérigraphie */}
      <g fill={CREAM} textAnchor="middle" fontFamily="ui-sans-serif, system-ui, sans-serif">
        <text x={cx} y={y(57.5)} fontSize={8} fontWeight={700} letterSpacing={1.4}>
          WALRUS AUDIO®
        </text>
        <text x={cx} y={y(62)} fontSize={15} fontWeight={900} letterSpacing={0.4}>
          FUNDAMENTAL
        </text>
        <text
          x={cx}
          y={y(70.5)}
          fontSize={shortName.length > 8 ? 30 : shortName.length > 6 ? 34 : 38}
          fontWeight={900}
          letterSpacing={0.4}
          fill="none"
          stroke={accent}
          strokeWidth={1.6}
        >
          {shortName}
        </text>
      </g>

      {/* Câblage footswitch → LED */}
      <path
        d={`M${cx} ${y(81)} L${cx} ${y(86.5)} L${width * 0.78 - 13} ${y(86.5)}`}
        stroke={accent}
        strokeWidth={1.2}
        fill="none"
        opacity={0.85}
      />
      {/* Logement de la LED : cerclage crème, comme sur la série (l'accent
          reste réservé au liseré, à l'emblème et à la sérigraphie). */}
      <rect
        x={width * 0.78 - 13}
        y={y(86.5) - 13}
        width={26}
        height={26}
        rx={4.5}
        fill="rgba(0,0,0,0.4)"
        stroke={CREAM}
        strokeWidth={1.2}
        opacity={0.85}
      />

      {/* Mention de pied (« HOLD FOR TAP MODE ») */}
      {footNote &&
        (() => {
          const words = footNote.split(' ')
          const lines = [words.slice(0, 2).join(' '), words.slice(2).join(' ')]
          return lines.map((line, i) =>
            line ? (
              <text
                key={i}
                x={44}
                y={y(89.5 + i * 4)}
                fill={CREAM}
                fontSize={6.5}
                fontWeight={700}
                letterSpacing={0.7}
              >
                {line}
              </text>
            ) : null
          )
        })()}
    </g>
  )
}
