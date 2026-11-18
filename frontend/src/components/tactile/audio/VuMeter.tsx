import { useEffect, useId, useRef, useState } from 'react'
import { cx } from '../../ui/cx'
import { describeArc, describeSector, polarToCartesian } from '../lib/geometry'
import {
  angleToRatio,
  BallisticsProcessor,
  ratioToAngle,
  rmsToDbfs,
  VU_MAX_ANGLE,
  VU_MIN_ANGLE,
  vuDbToAngle,
} from '../lib/vuBallistics'
import { TACTILE } from '../tokens'

type MeterChannel = 'mono' | 'left' | 'right'

export interface VuMeterOptions {
  /** Largeur de la carte en pixels. */
  width?: number
  /** Durée de maintien de la crête allumée, en ms. */
  peakHoldMs?: number
  /** Durée d'extinction de la crête après maintien, en ms. */
  peakFadeMs?: number
  /** Angle à partir duquel la crête s'allume. */
  clipThresholdDeg?: number
  needleColor?: string
}

const DEFAULTS: Required<VuMeterOptions> = {
  width: 330,
  peakHoldMs: 1000,
  peakFadeMs: 2500,
  clipThresholdDeg: 21,
  needleColor: TACTILE.accent,
}

const ARC_CENTER = 100
const ARC_RADIUS = 114
const ARC_BASELINE = 140

const MARKS: Array<{ vu: number; angle: number; major: boolean }> = [
  { vu: -25, angle: -25, major: true },
  { vu: -20, angle: -23, major: false },
  { vu: -10, angle: -16, major: false },
  { vu: -7, angle: -12, major: false },
  { vu: -5, angle: -8, major: false },
  { vu: -3, angle: -3, major: false },
  { vu: -2, angle: 0, major: false },
  { vu: -1, angle: 3.5, major: false },
  { vu: 0, angle: 8, major: true },
  { vu: 1, angle: 13, major: false },
  { vu: 2, angle: 18, major: false },
  { vu: 3, angle: 25, major: true },
]

const LABELS = MARKS.filter((mark) => mark.vu > -25)

interface VuMeterChannelProps {
  channel: MeterChannel
  label: string
  referenceLevel: number
  audioContext?: AudioContext | null
  sourceNode?: AudioNode | null
  /** Niveau contrôlé en dB (VU) quand aucun nœud audio n'est fourni. */
  value?: number
  /** Angle contrôlé en degrés, prioritaire sur `value`. */
  angle?: number
  peak?: boolean
  options: Required<VuMeterOptions>
}

/**
 * Un canal de VU-mètre. L'aiguille suit les échantillons du nœud audio quand il
 * est fourni, sinon la valeur contrôlée, avec l'inertie d'un mouvement
 * balistique réel.
 */
function VuMeterChannel({
  channel,
  label,
  referenceLevel,
  audioContext,
  sourceNode,
  value,
  angle,
  peak,
  options,
}: VuMeterChannelProps) {
  const gradientId = useId()
  const [needleAngle, setNeedleAngle] = useState(VU_MIN_ANGLE)
  const [peakIntensity, setPeakIntensity] = useState(0)

  const { clipThresholdDeg, needleColor, peakFadeMs, peakHoldMs, width } = options

  useEffect(() => {
    const ballistics = new BallisticsProcessor()
    let analyser: AnalyserNode | null = null
    let splitter: ChannelSplitterNode | null = null

    if (audioContext && sourceNode) {
      try {
        analyser = audioContext.createAnalyser()
        analyser.fftSize = 1024
        analyser.smoothingTimeConstant = 0
        if (channel !== 'mono') {
          splitter = audioContext.createChannelSplitter(2)
          sourceNode.connect(splitter)
          splitter.connect(analyser, channel === 'left' ? 0 : 1)
        } else {
          sourceNode.connect(analyser)
        }
      } catch {
        analyser = null
      }
    }

    // Le buffer est alloué une fois : le réallouer à chaque image créait un
    // déchet par frame sur les deux canaux.
    const buffer = analyser ? new Float32Array(analyser.fftSize) : null
    let frameId = 0
    let previousTime = 0
    let clipAt: number | null = null

    const renderFrame = (now: number) => {
      const deltaSeconds = previousTime ? Math.min(0.05, (now - previousTime) / 1000) : 0
      previousTime = now

      let targetRatio: number
      if (analyser && buffer) {
        analyser.getFloatTimeDomainData(buffer)
        targetRatio = ballistics.process(angleToRatio(vuDbToAngle(rmsToDbfs(buffer) - referenceLevel)), deltaSeconds)
      } else if (angle !== undefined) {
        targetRatio = angleToRatio(angle)
      } else if (value !== undefined) {
        targetRatio = ballistics.process(angleToRatio(vuDbToAngle(value)), deltaSeconds)
      } else {
        targetRatio = angleToRatio(VU_MIN_ANGLE)
      }

      const nextAngle = ratioToAngle(targetRatio)
      setNeedleAngle(nextAngle)

      if (peak || nextAngle >= clipThresholdDeg) clipAt = now

      let intensity = 0
      if (clipAt !== null) {
        const elapsed = now - clipAt
        intensity = elapsed <= peakHoldMs ? 1 : Math.max(0, 1 - (elapsed - peakHoldMs) / peakFadeMs)
      }
      setPeakIntensity(intensity <= 0.005 ? 0 : intensity)

      frameId = requestAnimationFrame(renderFrame)
    }

    frameId = requestAnimationFrame(renderFrame)

    return () => {
      cancelAnimationFrame(frameId)
      try {
        analyser?.disconnect()
        splitter?.disconnect()
      } catch {
        /* nœud déjà déconnecté */
      }
    }
  }, [audioContext, sourceNode, channel, referenceLevel, value, angle, peak, clipThresholdDeg, peakHoldMs, peakFadeMs])

  return (
    <div
      className="relative flex select-none flex-col items-center rounded-3xl border border-[color:var(--neu-edge)] neu-flat-lg p-6"
      style={{ width }}
    >
      <div
        className="relative flex h-36 w-full items-center justify-center overflow-hidden rounded-2xl border border-amber-200/50 p-2"
        style={{
          background: 'radial-gradient(ellipse at 50% 25%, #fffdf5 0%, #faecd2 55%, #eedac0 100%)',
          boxShadow:
            'inset 4px 4px 10px rgba(160, 175, 195, 0.65), inset -3px -3px 8px rgba(255, 255, 255, 0.9)',
        }}
      >
        <div className="pointer-events-none absolute inset-x-2 top-0 h-10 rounded-t-xl bg-gradient-to-b from-white/70 to-transparent" />

        <div
          className="pointer-events-none absolute right-4 top-3 z-10 flex h-4 w-4 items-center justify-center rounded-full transition-colors duration-100"
          role="img"
          aria-label={peakIntensity > 0.05 ? 'Crête' : 'Crête éteinte'}
          style={{
            backgroundColor: peakIntensity > 0.05 ? needleColor : '#d2bea3',
            boxShadow:
              peakIntensity > 0.05
                ? `0 0 ${16 * peakIntensity}px ${4 * peakIntensity}px rgba(242, 106, 27, ${0.75 * peakIntensity}), 0 0 6px #ea580c, inset 0 1px 2px #fff`
                : 'inset 1.5px 1.5px 3px rgba(140, 120, 100, 0.6)',
          }}
        >
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 rounded-full bg-white transition-opacity duration-150"
            style={{ opacity: peakIntensity }}
          />
        </div>

        <svg className="h-full w-full" viewBox="20 20 160 100" aria-hidden="true">
          <defs>
            <filter id={`needle-shadow-${gradientId}`} x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="1.8" dy="2.2" stdDeviation="1.5" floodColor="rgba(163, 177, 198, 0.75)" />
            </filter>
          </defs>

          <path d={describeSector(ARC_CENTER, ARC_BASELINE, ARC_RADIUS, ARC_RADIUS + 8, 8, 25)} fill="rgba(242, 106, 27, 0.28)" />
          <path
            d={describeArc(ARC_CENTER, ARC_BASELINE, ARC_RADIUS, VU_MIN_ANGLE, VU_MAX_ANGLE)}
            fill="none"
            stroke="#475569"
            strokeWidth="1.4"
            strokeLinecap="round"
          />

          {MARKS.map((mark) => {
            const outer = polarToCartesian(ARC_CENTER, ARC_BASELINE, ARC_RADIUS + 7, mark.angle)
            const inner = polarToCartesian(ARC_CENTER, ARC_BASELINE, ARC_RADIUS + 7 - (mark.major ? 10 : 6), mark.angle)
            return (
              <line
                key={`mark-${mark.vu}`}
                x1={outer.x}
                y1={outer.y}
                x2={inner.x}
                y2={inner.y}
                stroke={mark.vu <= 0 ? '#475569' : needleColor}
                strokeWidth={mark.major ? 1.5 : 1}
              />
            )
          })}

          {LABELS.map((mark) => {
            const point = polarToCartesian(ARC_CENTER, ARC_BASELINE, ARC_RADIUS + 14, mark.angle)
            return (
              <text
                key={`label-${mark.vu}`}
                x={point.x}
                y={point.y}
                fill={mark.vu <= 0 ? '#334155' : needleColor}
                fontSize={mark.vu === 0 ? '7.5' : '6.5'}
                fontWeight={mark.vu === 0 ? 'bold' : 'normal'}
                textAnchor="middle"
                fontFamily="monospace"
              >
                {Math.abs(mark.vu)}
              </text>
            )
          })}

          {[-28, 28].map((sign) => {
            const point = polarToCartesian(ARC_CENTER, ARC_BASELINE, ARC_RADIUS + 14, sign)
            return (
              <text
                key={sign}
                x={point.x}
                y={point.y}
                fill={sign < 0 ? '#475569' : needleColor}
                fontSize="9"
                fontWeight="bold"
                textAnchor="middle"
              >
                {sign < 0 ? '−' : '+'}
              </text>
            )
          })}

          <text
            x={ARC_CENTER}
            y={82}
            fill="#8392a7"
            fontSize="10"
            fontWeight="bold"
            textAnchor="middle"
            letterSpacing={3}
            fontFamily="sans-serif"
          >
            VU
          </text>

          <g
            filter={`url(#needle-shadow-${gradientId})`}
            style={{
              transformOrigin: `${ARC_CENTER}px ${ARC_BASELINE}px`,
              transform: `rotate(${needleAngle}deg)`,
              willChange: 'transform',
            }}
          >
            <polygon
              points={`${ARC_CENTER - 0.5},${ARC_BASELINE} ${ARC_CENTER + 0.5},${ARC_BASELINE} ${ARC_CENTER + 0.2},26 ${ARC_CENTER - 0.2},26`}
              fill={needleColor}
            />
            <circle cx={ARC_CENTER} cy={25} r={0.8} fill="#ffffff" />
          </g>

          <circle cx={ARC_CENTER} cy={ARC_BASELINE} r={12} fill="#1e293b" />
          <circle cx={ARC_CENTER} cy={ARC_BASELINE} r={8} fill="#334155" />
          <circle cx={ARC_CENTER} cy={ARC_BASELINE} r={3} fill="#64748b" />
        </svg>
      </div>

      <div className="mt-4 flex w-full flex-col items-center text-center">
        <div className="flex items-center gap-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--neu-accent)] shadow-[0_0_8px_var(--neu-accent)]" />
          <h4 className="text-sm font-extrabold uppercase tracking-wide text-[color:var(--neu-text)]">{label}</h4>
        </div>
        <span className="mt-1 font-mono text-xs font-medium text-[color:var(--neu-text-faint)]">0 VU = {referenceLevel} dBFS</span>
      </div>
    </div>
  )
}

export interface VuMeterProps {
  layout?: 'mono' | 'stereo'
  label?: string
  rightLabel?: string
  referenceLevel?: number
  audioContext?: AudioContext | null
  sourceNode?: AudioNode | null
  /** Niveau VU (dB) du canal gauche / unique. */
  value?: number
  rightValue?: number
  /** Angle d'aiguille contrôlé, en degrés. */
  angle?: number
  rightAngle?: number
  /** Force l'allumage de la crête. */
  peak?: boolean
  options?: VuMeterOptions
  className?: string
}

/** VU-mètre analogique, un ou deux canaux. */
export function VuMeter({
  layout = 'stereo',
  label,
  rightLabel,
  referenceLevel = -18,
  audioContext = null,
  sourceNode = null,
  value = -5.5,
  rightValue = -6.8,
  angle,
  rightAngle,
  peak,
  options,
  className,
}: VuMeterProps) {
  const resolved = { ...DEFAULTS, ...options }
  const shared = {
    referenceLevel,
    audioContext,
    sourceNode,
    peak,
    options: resolved,
  }

  return (
    <div className={cx('flex select-none flex-wrap items-center justify-center gap-6', className)}>
      {layout === 'mono' ? (
        <VuMeterChannel {...shared} channel="mono" label={label ?? 'MONO'} value={value} angle={angle} />
      ) : (
        <>
          <VuMeterChannel {...shared} channel="left" label={label ?? 'CANAL GAUCHE (L)'} value={value} angle={angle} />
          <VuMeterChannel
            {...shared}
            channel="right"
            label={rightLabel ?? 'CANAL DROIT (R)'}
            value={rightValue}
            angle={rightAngle}
          />
        </>
      )}
    </div>
  )
}
