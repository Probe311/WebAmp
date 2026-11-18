import { useEffect, useId, useState, type ReactNode } from 'react'
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Cookie,
  Info,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react'
import { cx } from '../ui/cx'
import { IconAction, Panel } from './primitives'
import { SURFACES, TACTILE } from './tokens'

/* --------------------------------------------------------------------------
   Accordéon
   -------------------------------------------------------------------------- */

export interface AccordionItem {
  id: string
  title: string
  content: ReactNode
}

export interface AccordionProps {
  items: readonly AccordionItem[]
  /** Identifiant ouvert au montage. */
  defaultOpenId?: string
  allowMultiple?: boolean
  className?: string
}

export function Accordion({ items, defaultOpenId, allowMultiple = false, className }: AccordionProps) {
  const [openIds, setOpenIds] = useState<string[]>(defaultOpenId ? [defaultOpenId] : [])
  const baseId = useId()

  const toggle = (id: string) => {
    setOpenIds((current) => {
      if (current.includes(id)) return current.filter((openId) => openId !== id)
      return allowMultiple ? [...current, id] : [id]
    })
  }

  return (
    <div className={cx('flex w-full select-none flex-col gap-3', className)}>
      {items.map((item) => {
        const isOpen = openIds.includes(item.id)
        const panelId = `${baseId}-${item.id}`
        return (
          <div
            key={item.id}
            className={cx(
              'overflow-hidden rounded-2xl p-4 transition-all duration-200',
              isOpen ? 'neu-inset' : 'neu-flat'
            )}
          >
            <button
              type="button"
              onClick={() => toggle(item.id)}
              aria-expanded={isOpen}
              aria-controls={panelId}
              className="flex w-full cursor-pointer items-center justify-between gap-3 text-left"
            >
              <span
                className={cx(
                  'text-sm font-bold',
                  isOpen ? 'text-[color:var(--neu-accent)]' : 'text-[color:var(--neu-text)]'
                )}
              >
                {item.title}
              </span>
              <span
                className={cx(
                  'grid h-7 w-7 shrink-0 place-items-center rounded-full transition-transform',
                  isOpen
                    ? 'neu-flat-sm rotate-180 text-[color:var(--neu-accent)]'
                    : 'neu-inset text-[color:var(--neu-text-faint)]'
                )}
              >
                <ChevronDown className="h-4 w-4" />
              </span>
            </button>

            {isOpen && (
              <div
                id={panelId}
                className="mt-3 border-t border-[color:var(--neu-edge)] pt-3 text-xs leading-relaxed text-[color:var(--neu-text-muted)]"
              >
                {item.content}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

/* --------------------------------------------------------------------------
   Alertes
   -------------------------------------------------------------------------- */

export type AlertVariant = 'info' | 'success' | 'warning' | 'error'

const ALERT_STYLES: Record<AlertVariant, { icon: ReactNode; border: string }> = {
  info: { icon: <Info className="h-5 w-5 text-sky-500" />, border: 'border-sky-300' },
  success: { icon: <CheckCircle2 className="h-5 w-5 text-emerald-500" />, border: 'border-emerald-300' },
  warning: {
    icon: <AlertTriangle className="h-5 w-5 text-[color:var(--neu-accent)]" />,
    border: 'border-[color:var(--neu-accent)]/40',
  },
  error: { icon: <AlertCircle className="h-5 w-5 text-rose-500" />, border: 'border-rose-300' },
}

export interface AlertProps {
  title?: string
  message: ReactNode
  variant?: AlertVariant
  onDismiss?: () => void
  className?: string
}

export function Alert({ title, message, variant = 'info', onDismiss, className }: AlertProps) {
  const style = ALERT_STYLES[variant]

  return (
    <Panel
      role="alert"
      depth="flat"
      className={cx('flex w-full items-start gap-3.5 rounded-2xl border-l-4 p-4', style.border, className)}
    >
      <span className="neu-inset grid h-8 w-8 shrink-0 place-items-center rounded-full">
        {style.icon}
      </span>
      <div className="min-w-0 flex-1 pr-2">
        {title && <h5 className="mb-0.5 text-xs font-bold text-[color:var(--neu-text)]">{title}</h5>}
        <div className="text-xs leading-relaxed text-[color:var(--neu-text-muted)]">{message}</div>
      </div>
      {onDismiss && (
        <IconAction label="Fermer l'alerte" size="sm" onClick={onDismiss}>
          <X className="h-3.5 w-3.5" />
        </IconAction>
      )}
    </Panel>
  )
}

export interface NoticeBannerProps {
  title?: string
  message: ReactNode
  actionLabel?: string
  onAction?: () => void
  onDismiss?: () => void
  className?: string
}

/** Bandeau d'annonce horizontal, avec action optionnelle. */
export function NoticeBanner({
  title = 'Information',
  message,
  actionLabel,
  onAction,
  onDismiss,
  className,
}: NoticeBannerProps) {
  return (
    <Panel
      depth="flat"
      className={cx('flex w-full flex-col items-center justify-between gap-4 rounded-[var(--td-radius-panel)] p-4 sm:flex-row', className)}
    >
      <div className="flex items-center gap-3.5">
        <span
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-white"
          style={{ backgroundColor: TACTILE.accent, boxShadow: `0 0 12px rgba(242, 106, 27, 0.5)` }}
        >
          <AlertCircle className="h-5 w-5" />
        </span>
        <p className="text-xs text-[color:var(--neu-text-muted)]">
          <span className="mr-2 text-xs font-bold uppercase tracking-wide" style={{ color: TACTILE.accent }}>
            {title} —
          </span>
          {message}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {actionLabel && onAction && (
          <button
            type="button"
            onClick={onAction}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold text-white"
            style={{
              background: `linear-gradient(135deg, #ff7a2d, ${TACTILE.accent})`,
              boxShadow: '4px 4px 12px rgba(242, 106, 27, 0.35)',
            }}
          >
            {actionLabel}
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        )}
        {onDismiss && (
          <IconAction label="Ignorer le bandeau" size="sm" onClick={onDismiss}>
            <X className="h-4 w-4" />
          </IconAction>
        )}
      </div>
    </Panel>
  )
}

/* --------------------------------------------------------------------------
   Pastilles
   -------------------------------------------------------------------------- */

export type BadgeVariant = 'neutral' | 'accent' | 'success' | 'warning' | 'danger'

const BADGE_STYLES: Record<BadgeVariant, { chip: string; dot: string }> = {
  neutral: { chip: 'text-[color:var(--neu-text-muted)]', dot: 'bg-slate-400' },
  accent: { chip: 'font-bold text-[color:var(--neu-accent)]', dot: 'bg-[color:var(--neu-accent)]' },
  success: { chip: 'font-semibold text-emerald-600', dot: 'bg-emerald-500' },
  warning: { chip: 'font-semibold text-amber-600', dot: 'bg-amber-500' },
  danger: { chip: 'font-semibold text-rose-600', dot: 'bg-rose-500' },
}

export interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
  size?: 'sm' | 'md'
  /** Ajoute une pastille de couleur devant le libellé. */
  dot?: boolean
  className?: string
}

export function Badge({ children, variant = 'neutral', size = 'md', dot = false, className }: BadgeProps) {
  const style = BADGE_STYLES[variant]

  return (
    <span
      className={cx(
        'inline-flex select-none items-center gap-1.5 whitespace-nowrap rounded-full font-medium',
        size === 'sm' ? 'px-2.5 py-0.5 text-[10px]' : 'px-3.5 py-1 text-xs',
        style.chip,
        className
      )}
      style={variant === 'neutral' ? SURFACES.inset : SURFACES.flatSm}
    >
      {dot && <span className={cx('h-1.5 w-1.5 rounded-full', style.dot)} aria-hidden="true" />}
      {children}
    </span>
  )
}

export interface TagProps {
  label: string
  onRemove?: () => void
  onClick?: () => void
  active?: boolean
  className?: string
}

export function Tag({ label, onRemove, onClick, active = false, className }: TagProps) {
  return (
    <span
      className={cx(
        'inline-flex select-none items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-semibold tracking-wide transition-colors',
        onClick && 'cursor-pointer',
        active ? '' : 'text-[color:var(--neu-text)] hover:text-[color:var(--neu-text)]',
        className
      )}
      style={active ? { color: TACTILE.accent, ...SURFACES.pressed } : SURFACES.flatSm}
      onClick={onClick}
    >
      {label}
      {onRemove && (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            onRemove()
          }}
          aria-label={`Retirer ${label}`}
          title={`Retirer ${label}`}
          className="cursor-pointer rounded-full p-0.5 text-[color:var(--neu-text-faint)] transition-colors hover:text-[color:var(--neu-text)]"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </span>
  )
}

/* --------------------------------------------------------------------------
   Encarts
   -------------------------------------------------------------------------- */

export interface CalloutProps {
  title?: string
  children: ReactNode
  icon?: ReactNode
  action?: ReactNode
  className?: string
}

export function Callout({ title = 'Conseil', children, icon, action, className }: CalloutProps) {
  return (
    <Panel depth="flat" className={cx('flex flex-col items-start justify-between gap-4 rounded-[var(--td-radius-panel)] p-5 sm:flex-row', className)}>
      <div className="flex items-start gap-3.5">
        <span
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full"
          style={{ color: TACTILE.accent, ...SURFACES.flat }}
        >
          {icon ?? <Sparkles className="h-5 w-5" />}
        </span>
        <div>
          {title && (
            <h4 className="mb-1 text-xs font-bold uppercase tracking-wide text-[color:var(--neu-text)]">{title}</h4>
          )}
          <div className="text-xs leading-relaxed text-[color:var(--neu-text-muted)]">{children}</div>
        </div>
      </div>
      {action && <div className="shrink-0 self-end sm:self-center">{action}</div>}
    </Panel>
  )
}

export interface StatHighlightProps {
  value: ReactNode
  label?: string
  description?: string
  accent?: boolean
  className?: string
}

export function StatHighlight({ value, label, description, accent = true, className }: StatHighlightProps) {
  return (
    <Panel depth="flat" className={cx('flex select-none flex-col items-center rounded-[var(--td-radius-panel)] p-6 text-center', className)}>
      <div
        className={cx('mb-2 font-mono text-3xl font-extrabold tracking-tight sm:text-4xl', !accent && 'text-[color:var(--neu-text)]')}
        style={accent ? { color: TACTILE.accent, textShadow: '0 2px 8px rgba(242, 106, 27, 0.3)' } : undefined}
      >
        {value}
      </div>
      {label && <h4 className="text-xs font-bold uppercase tracking-wider text-[color:var(--neu-text)]">{label}</h4>}
      {description && <p className="mt-1 max-w-xs text-xs text-[color:var(--neu-text-muted)]">{description}</p>}
    </Panel>
  )
}

/* --------------------------------------------------------------------------
   Infobulle
   -------------------------------------------------------------------------- */

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right'

const TOOLTIP_POSITIONS: Record<TooltipPosition, string> = {
  top: 'bottom-full left-1/2 mb-2.5 -translate-x-1/2',
  bottom: 'top-full left-1/2 mt-2.5 -translate-x-1/2',
  left: 'right-full top-1/2 mr-2.5 -translate-y-1/2',
  right: 'left-full top-1/2 ml-2.5 -translate-y-1/2',
}

export interface TooltipProps {
  content: ReactNode
  children: ReactNode
  position?: TooltipPosition
  className?: string
}

/** Infobulle au survol et au focus : décrite par `aria-describedby`. */
export function Tooltip({ content, children, position = 'top', className }: TooltipProps) {
  const [visible, setVisible] = useState(false)
  const tooltipId = useId()

  return (
    <span
      className={cx('relative inline-flex items-center', className)}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
      aria-describedby={visible ? tooltipId : undefined}
    >
      {children}
      {visible && (
        <span
          role="tooltip"
          id={tooltipId}
          className={cx(
            'pointer-events-none absolute z-50 whitespace-nowrap rounded-[var(--td-radius-well)] border border-[color:var(--neu-edge)] bg-[color:var(--neu-bg)] px-3 py-1.5 text-[11px] font-semibold text-[color:var(--neu-text)]',
            TOOLTIP_POSITIONS[position]
          )}
          style={SURFACES.flatLg}
        >
          {content}
        </span>
      )}
    </span>
  )
}

/* --------------------------------------------------------------------------
   Boîte de confirmation
   -------------------------------------------------------------------------- */

export interface ConfirmDialogProps {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children?: ReactNode
  confirmLabel?: string
  cancelLabel?: string
  /** Style l'action de confirmation en rouge. */
  danger?: boolean
  onConfirm?: () => void
  className?: string
}

export function ConfirmDialog({
  open,
  onClose,
  title,
  description,
  children,
  confirmLabel = 'Confirmer',
  cancelLabel = 'Annuler',
  danger = false,
  onConfirm,
  className,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!open) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-[color:var(--neu-text)]/40 p-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cx('w-full max-w-lg', className)}
      >
        <Panel depth="flatLg" className="flex flex-col gap-4 rounded-3xl border border-[color:var(--neu-edge)] bg-[color:var(--neu-bg)] p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-[color:var(--neu-text)]">{title}</h3>
              {description && <p className="mt-0.5 text-xs text-[color:var(--neu-text-faint)]">{description}</p>}
            </div>
            <IconAction label="Fermer" size="md" onClick={onClose}>
              <X className="h-4 w-4" />
            </IconAction>
          </div>

          {children && <div className="py-2 text-xs leading-relaxed text-[color:var(--neu-text-muted)]">{children}</div>}

          <div className="flex items-center justify-end gap-3 border-t border-[color:var(--neu-edge)] pt-3">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-full px-4 py-1.5 text-xs font-semibold text-[color:var(--neu-text-muted)] transition-colors hover:text-[color:var(--neu-text)]"
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={() => {
                onConfirm?.()
                onClose()
              }}
              className={cx(
                'cursor-pointer rounded-full px-6 py-2.5 text-sm font-semibold text-white',
                danger
                  ? 'bg-gradient-to-r from-rose-500 to-red-600 shadow-[4px_4px_12px_rgba(244,63,94,0.35)]'
                  : 'neu-accent-btn'
              )}
            >
              {confirmLabel}
            </button>
          </div>
        </Panel>
      </div>
    </div>
  )
}

/* --------------------------------------------------------------------------
   Bandeau de consentement
   -------------------------------------------------------------------------- */

export interface ConsentBannerProps {
  title?: string
  message?: string
  onAcceptAll?: () => void
  onRejectAll?: () => void
  onCustomize?: () => void
  className?: string
}

export function ConsentBanner({
  title = 'Gestion de la confidentialité',
  message = "Nous utilisons des cookies strictement nécessaires au rendu de l'interface et à la mémorisation de vos préférences d'affichage.",
  onAcceptAll,
  onRejectAll,
  onCustomize,
  className,
}: ConsentBannerProps) {
  const [dismissed, setDismissed] = useState(false)
  if (dismissed) return null

  return (
    <Panel
      depth="flat"
      className={cx('flex w-full max-w-2xl flex-col items-center justify-between gap-6 rounded-[var(--td-radius-panel)] p-6 sm:flex-row', className)}
    >
      <div className="flex items-start gap-4">
        <span
          className="grid h-12 w-12 shrink-0 place-items-center rounded-full"
          style={{ color: TACTILE.accent, ...SURFACES.flat }}
        >
          <Cookie className="h-6 w-6" />
        </span>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-[color:var(--neu-text)]">{title}</h4>
            <ShieldCheck className="h-4 w-4 text-emerald-500" aria-hidden="true" />
          </div>
          <p className="mt-1 text-xs leading-relaxed text-[color:var(--neu-text-muted)]">{message}</p>
        </div>
      </div>

      <div className="flex w-full shrink-0 flex-wrap items-center justify-end gap-2.5 sm:w-auto sm:flex-nowrap">
        <button
          type="button"
          onClick={() => {
            onRejectAll?.()
            setDismissed(true)
          }}
          className="cursor-pointer rounded-full px-4 py-1.5 text-xs font-semibold text-[color:var(--neu-text-muted)] hover:text-[color:var(--neu-text)]"
        >
          Refuser
        </button>
        <button
          type="button"
          onClick={() => onCustomize?.()}
          className="cursor-pointer rounded-full px-4 py-1.5 text-xs font-medium text-[color:var(--neu-text)]"
          style={SURFACES.flatSm}
        >
          Personnaliser
        </button>
        <button
          type="button"
          onClick={() => {
            onAcceptAll?.()
            setDismissed(true)
          }}
          className="cursor-pointer rounded-full px-4 py-1.5 text-xs font-semibold text-white"
          style={{
            background: `linear-gradient(135deg, #ff7a2d, ${TACTILE.accent})`,
            boxShadow: '4px 4px 12px rgba(242, 106, 27, 0.35)',
          }}
        >
          Tout accepter
        </button>
      </div>
    </Panel>
  )
}
