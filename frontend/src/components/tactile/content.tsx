import { useState, type ReactNode } from 'react'
import {
  ArrowUpRight,
  Copy,
  Maximize2,
  Pause,
  Play,
  Quote as QuoteIcon,
  SkipBack,
  SkipForward,
  Volume2,
} from 'lucide-react'
import { cx } from '../ui/cx'
import { Panel } from './primitives'
import { SURFACES, TACTILE } from './tokens'

/* --------------------------------------------------------------------------
   Carte
   -------------------------------------------------------------------------- */

export type CardVariant = 'raised' | 'inset' | 'flat'

export interface CardProps {
  title?: string
  subtitle?: string
  children: ReactNode
  variant?: CardVariant
  /** Contenu aligné à droite de l'en-tête. */
  action?: ReactNode
  footer?: ReactNode
  className?: string
}

export function Card({ title, subtitle, children, variant = 'raised', action, footer, className }: CardProps) {
  return (
    <Panel
      depth={variant === 'inset' ? 'inset' : variant === 'flat' ? 'flatSm' : 'flat'}
      className={cx('flex select-none flex-col gap-4 rounded-3xl bg-[color:var(--neu-bg)] p-6', className)}
    >
      {(title || subtitle || action) && (
        <div className="flex items-start justify-between gap-4">
          <div>
            {title && <h4 className="text-sm font-bold text-[color:var(--neu-text)]">{title}</h4>}
            {subtitle && <p className="mt-0.5 text-xs text-[color:var(--neu-text-faint)]">{subtitle}</p>}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}

      <div className="text-xs leading-relaxed text-[color:var(--neu-text-muted)]">{children}</div>

      {footer && <div className="mt-auto border-t border-[color:var(--neu-edge)] pt-3">{footer}</div>}
    </Panel>
  )
}

/* --------------------------------------------------------------------------
   Tuile
   -------------------------------------------------------------------------- */

export interface TileProps {
  title: string
  description?: string
  icon?: ReactNode
  badge?: ReactNode
  onClick?: () => void
  active?: boolean
  className?: string
}

export function Tile({ title, description, icon, badge, onClick, active = false, className }: TileProps) {
  const content = (
    <>
      <span className="flex items-start justify-between gap-2">
        <span
          className="grid h-10 w-10 shrink-0 place-items-center rounded-[var(--td-radius-card)]"
          style={{ color: TACTILE.accent, ...SURFACES.flatSm }}
        >
          {icon}
        </span>
        <span className="flex items-center gap-1.5">
          {badge}
          {onClick && <ArrowUpRight className="h-4 w-4 text-[color:var(--neu-text-faint)]" aria-hidden="true" />}
        </span>
      </span>
      <span className="block">
        <span className="block text-sm font-bold text-[color:var(--neu-text)]">{title}</span>
        {description && <span className="mt-1 block text-xs leading-relaxed text-[color:var(--neu-text-muted)]">{description}</span>}
      </span>
    </>
  )

  const shared = cx('flex flex-col justify-between gap-3 select-none rounded-[var(--td-radius-panel)] p-5 transition-shadow', className)

  if (!onClick) {
    return (
      <Panel depth={active ? 'pressed' : 'flat'} className={shared}>
        {content}
      </Panel>
    )
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cx(shared, 'cursor-pointer text-left')}
      style={active ? SURFACES.pressed : SURFACES.flat}
    >
      {content}
    </button>
  )
}

/* --------------------------------------------------------------------------
   Citation
   -------------------------------------------------------------------------- */

export interface QuoteBlockProps {
  quote: string
  author: string
  role?: string
  source?: string
  className?: string
}

export function QuoteBlock({ quote, author, role, source, className }: QuoteBlockProps) {
  return (
    <Panel depth="flat" className={cx('flex select-none flex-col gap-4 rounded-[var(--td-radius-panel)] p-6', className)}>
      <span className="grid h-10 w-10 place-items-center rounded-full" style={{ color: TACTILE.accent, ...SURFACES.inset }}>
        <QuoteIcon className="h-5 w-5 fill-current" />
      </span>

      <blockquote className="text-sm font-medium italic leading-relaxed text-[color:var(--neu-text)]">« {quote} »</blockquote>

      <figcaption className="flex items-center gap-3 border-t border-[color:var(--neu-edge)] pt-3">
        <span className="grid h-8 w-8 place-items-center rounded-full text-xs font-bold text-[color:var(--neu-text)]" style={SURFACES.flatSm}>
          {author.charAt(0)}
        </span>
        <span className="flex flex-col">
          <cite className="text-xs font-bold not-italic text-[color:var(--neu-text)]">{author}</cite>
          {(role || source) && (
            <span className="text-[10px] text-[color:var(--neu-text-faint)]">
              {[role, source].filter(Boolean).join(' · ')}
            </span>
          )}
        </span>
      </figcaption>
    </Panel>
  )
}

/* --------------------------------------------------------------------------
   Lecteur média
   -------------------------------------------------------------------------- */

export interface MediaPlayerProps {
  title: string
  subtitle?: string
  category?: string
  durationLabel?: string
  /** Progression en pourcentage, contrôlée par l'appelant. */
  progress?: number
  onSeek?: (percentage: number) => void
  isPlaying?: boolean
  onTogglePlay?: () => void
  className?: string
}

/**
 * Carte de lecture. Aucune fausse progression : `progress` et `isPlaying`
 * viennent de l'appelant, qui seul sait ce qui joue réellement.
 */
export function MediaPlayer({
  title,
  subtitle,
  category = 'Audio',
  durationLabel = '00:00',
  progress = 0,
  onSeek,
  isPlaying = false,
  onTogglePlay,
  className,
}: MediaPlayerProps) {
  return (
    <Panel depth="flat" className={cx('w-full max-w-md select-none rounded-[var(--td-radius-panel)] p-5', className)}>
      <div
        className="relative flex h-44 w-full items-center justify-center overflow-hidden rounded-[var(--td-radius-card)] bg-gradient-to-br from-slate-800 to-slate-900 text-white"
        style={SURFACES.inset}
      >
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center gap-1.5 px-4 opacity-20">
          {Array.from({ length: 24 }, (_, index) => (
            <span
              key={index}
              aria-hidden="true"
              className="w-1 rounded-full"
              style={{
                backgroundColor: TACTILE.accent,
                height: `${Math.sin(index * 0.7) * 40 + 50}%`,
              }}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={onTogglePlay}
          aria-label={isPlaying ? 'Pause' : 'Lecture'}
          title={isPlaying ? 'Pause' : 'Lecture'}
          className="relative z-10 grid h-14 w-14 cursor-pointer place-items-center rounded-full"
          style={{ color: TACTILE.accent, ...SURFACES.flat }}
        >
          {isPlaying ? <Pause className="h-6 w-6 fill-current" /> : <Play className="ml-1 h-6 w-6 fill-current" />}
        </button>

        <span className="absolute bottom-3 left-4 font-mono text-[10px] text-[color:var(--neu-text-faint)]">{category}</span>
        <Maximize2 className="absolute bottom-3 right-4 h-3.5 w-3.5 text-[color:var(--neu-text-faint)]" aria-hidden="true" />
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <div>
          <h4 className="text-sm font-bold text-[color:var(--neu-text)]">{title}</h4>
          {subtitle && <span className="text-xs text-[color:var(--neu-text-faint)]">{subtitle}</span>}
        </div>
        <span className="flex items-center gap-1.5 text-[color:var(--neu-text-muted)]">
          <Volume2 className="h-4 w-4" aria-hidden="true" />
          <span className="font-mono text-xs">100 %</span>
        </span>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <span className="font-mono text-[10px] text-[color:var(--neu-text-faint)]">{Math.round(progress)} %</span>
        <div
          role="progressbar"
          aria-label="Progression de la lecture"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
          onClick={(event) => {
            if (!onSeek) return
            const rect = event.currentTarget.getBoundingClientRect()
            onSeek(Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100)))
          }}
          className={cx('relative h-2 flex-1 rounded-full', onSeek && 'cursor-pointer')}
          style={SURFACES.inset}
        >
          <span
            className="absolute inset-y-0 left-0 rounded-full"
            style={{ width: `${progress}%`, backgroundColor: TACTILE.accent }}
          />
        </div>
        <span className="font-mono text-[10px] text-[color:var(--neu-text-faint)]">{durationLabel}</span>
      </div>

      <div className="mt-4 flex items-center justify-center gap-4">
        {[
          { icon: <SkipBack className="h-4 w-4" />, label: 'Précédent', delta: -10 },
          { icon: <SkipForward className="h-4 w-4" />, label: 'Suivant', delta: 10 },
        ].map((control) => (
          <button
            key={control.label}
            type="button"
            aria-label={control.label}
            title={control.label}
            onClick={() => onSeek?.(Math.max(0, Math.min(100, progress + control.delta)))}
            className="grid h-8 w-8 cursor-pointer place-items-center rounded-full text-[color:var(--neu-text-muted)] hover:text-[color:var(--neu-accent)]"
            style={SURFACES.flatSm}
          >
            {control.icon}
          </button>
        ))}
      </div>
    </Panel>
  )
}

/* --------------------------------------------------------------------------
   Tableau
   -------------------------------------------------------------------------- */

export interface DataColumn<T> {
  key: string
  header: string
  align?: 'left' | 'center' | 'right'
  render?: (row: T) => ReactNode
}

export interface DataTableProps<T extends Record<string, unknown>> {
  columns: readonly DataColumn<T>[]
  rows: readonly T[]
  caption?: string
  /** Clé d'identification stable ; à défaut, l'index de ligne. */
  rowKey?: keyof T
  className?: string
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  rows,
  caption,
  rowKey,
  className,
}: DataTableProps<T>) {
  const alignment = (align?: 'left' | 'center' | 'right') =>
    align === 'right' ? 'text-right tabular-nums' : align === 'center' ? 'text-center' : 'text-left'

  return (
    <Panel depth="flat" className={cx('w-full overflow-x-auto rounded-[var(--td-radius-panel)] p-4', className)}>
      {caption && (
        <h4 className="mb-3 px-2 text-xs font-bold uppercase tracking-wider text-[color:var(--neu-text)]">{caption}</h4>
      )}
      <table className="w-full select-none border-collapse text-left">
        <thead>
          <tr className="border-b border-[color:var(--neu-edge)]">
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={cx('px-4 py-3 text-xs font-bold uppercase tracking-wider text-[color:var(--neu-text-muted)]', alignment(column.align))}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {rows.map((row, index) => (
            <tr
              key={rowKey ? String(row[rowKey]) : index}
              className="text-xs text-[color:var(--neu-text)] transition-colors hover:bg-[color:var(--neu-text)]/5"
            >
              {columns.map((column) => (
                <td key={column.key} className={cx('px-4 py-3.5 font-medium', alignment(column.align))}>
                  {column.render ? column.render(row) : (row[column.key] as ReactNode)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Panel>
  )
}

/* --------------------------------------------------------------------------
   Transcription
   -------------------------------------------------------------------------- */

export interface TranscriptSegment {
  time: string
  speaker: string
  text: string
}

export interface TranscriptProps {
  segments: readonly TranscriptSegment[]
  title?: string
  className?: string
}

export function Transcript({ segments, title = 'Transcription', className }: TranscriptProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [copied, setCopied] = useState(false)

  const copyAll = async () => {
    const text = segments.map((segment) => `[${segment.time}] ${segment.speaker}: ${segment.text}`).join('\n')
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <Panel depth="flat" className={cx('flex w-full max-w-xl flex-col gap-4 rounded-[var(--td-radius-panel)] p-6', className)}>
      <div className="flex items-center justify-between gap-3 border-b border-[color:var(--neu-edge)] pb-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[color:var(--neu-text)]">{title}</h4>
        <button
          type="button"
          onClick={copyAll}
          className="flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold text-[color:var(--neu-text-muted)] hover:text-[color:var(--neu-text)]"
          style={SURFACES.flatSm}
        >
          <Copy className={cx('h-3.5 w-3.5', copied && 'text-emerald-500')} />
          {copied ? 'Copié' : 'Copier'}
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {segments.map((segment, index) => {
          const isActive = index === activeIndex
          return (
            <button
              key={`${segment.time}-${segment.speaker}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-current={isActive ? 'true' : undefined}
              className="cursor-pointer rounded-[var(--td-radius-card)] p-3.5 text-left transition-shadow"
              style={
                isActive
                  ? { ...SURFACES.inset, borderLeft: `2px solid ${TACTILE.accent}` }
                  : { boxShadow: 'none' }
              }
            >
              <span className="mb-1 flex items-center justify-between">
                <span className="text-[11px] font-bold text-[color:var(--neu-text)]">{segment.speaker}</span>
                <span
                  className="rounded-full px-2 py-0.5 font-mono text-[10px] font-bold"
                  style={{ color: TACTILE.accent, ...SURFACES.flatSm }}
                >
                  {segment.time}
                </span>
              </span>
              <span className="block text-xs leading-relaxed text-[color:var(--neu-text-muted)]">{segment.text}</span>
            </button>
          )
        })}
      </div>
    </Panel>
  )
}

/* --------------------------------------------------------------------------
   Logo
   -------------------------------------------------------------------------- */

export interface BrandLogoProps {
  name?: string
  symbol?: string
  subtitle?: string
  shape?: 'squircle' | 'circle' | 'pill'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const LOGO_SHAPES = {
  squircle: 'rounded-[var(--td-radius-card)]',
  circle: 'rounded-full',
  pill: 'rounded-full px-4',
}

const LOGO_SIZES = {
  sm: { box: 'h-10 w-10', symbol: 'text-sm', name: 'text-sm' },
  md: { box: 'h-16 w-16', symbol: 'text-xl', name: 'text-base' },
  lg: { box: 'h-24 w-24', symbol: 'text-3xl', name: 'text-xl' },
}

export function BrandLogo({
  name = 'Tactile',
  symbol = 'Ui',
  subtitle,
  shape = 'squircle',
  size = 'md',
  className,
}: BrandLogoProps) {
  const sizing = LOGO_SIZES[size]

  return (
    <div className={cx('inline-flex select-none items-center gap-3.5', className)}>
      <div
        className={cx(
          'relative grid place-items-center border border-[color:var(--neu-edge)] font-extrabold',
          LOGO_SHAPES[shape],
          sizing.box
        )}
        style={SURFACES.flat}
      >
        <span
          className={cx('bg-clip-text text-transparent', sizing.symbol)}
          style={{ backgroundImage: 'linear-gradient(135deg, #ff7a2d, #f26a1b)' }}
        >
          {symbol}
        </span>
        <span className="pointer-events-none absolute inset-x-2 top-1 h-1/3 rounded-t-[var(--td-radius-well)] bg-white/40" />
      </div>

      {(name || subtitle) && (
        <div className="flex flex-col">
          {name && <span className={cx('font-bold leading-tight tracking-tight text-[color:var(--neu-text)]', sizing.name)}>{name}</span>}
          {subtitle && (
            <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: TACTILE.accent }}>
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
