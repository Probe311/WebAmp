import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react'
import { cx } from '../ui/cx'
import { NEU_TOKENS, type SurfaceDepth } from './tokens'

/* --------------------------------------------------------------------------
   Surfaces
   -------------------------------------------------------------------------- */

export interface PanelProps extends HTMLAttributes<HTMLDivElement> {
  /** Profondeur perçue : relief (`flat*`) ou creux (`inset`, `pressed`). */
  depth?: SurfaceDepth
}

/** Conteneur du design system tactile. La forme se règle via `className`. */
export function Panel({ depth = 'flat', className, children, ...rest }: PanelProps) {
  const surface =
    depth === 'inset'
      ? NEU_TOKENS.surfaces.inset
      : depth === 'pressed'
        ? NEU_TOKENS.surfaces.pressed
        : depth === 'flatSm'
          ? NEU_TOKENS.surfaces.flatSm
          : depth === 'flatLg'
            ? NEU_TOKENS.surfaces.flatLg
            : NEU_TOKENS.surfaces.flat

  return (
    <div
      className={cx(surface, 'border border-[color:var(--neu-edge)] bg-[color:var(--neu-bg)]', className)}
      {...rest}
    >
      {children}
    </div>
  )
}

/* --------------------------------------------------------------------------
   Bouton-icône
   -------------------------------------------------------------------------- */

export type IconActionSize = 'sm' | 'md' | 'lg'
export type IconActionTone = 'neutral' | 'accent' | 'danger'

const ICON_SIZE_CLASSES: Record<IconActionSize, string> = {
  sm: 'h-7 w-7 rounded-full',
  md: 'h-9 w-9 rounded-full',
  lg: 'h-10 w-10 rounded-2xl',
}

const ICON_TONE_CLASSES: Record<IconActionTone, string> = {
  neutral: 'text-[color:var(--neu-text-muted)] hover:text-[color:var(--neu-text)]',
  accent: 'text-[color:var(--neu-accent)] hover:text-[color:var(--neu-accent-hover)]',
  danger: 'text-[color:var(--neu-text-muted)] hover:text-rose-500',
}

export interface IconActionProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label' | 'children'> {
  /** Nom accessible : devient `aria-label` et `title`. */
  label: string
  size?: IconActionSize
  tone?: IconActionTone
  /** Relâché (relief) ou enfoncé (creux) : rend aussi `aria-pressed`. */
  pressed?: boolean
  children: ReactNode
}

export function IconAction({
  label,
  size = 'md',
  tone = 'neutral',
  pressed,
  className,
  children,
  type = 'button',
  ...rest
}: IconActionProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      aria-pressed={pressed}
      className={cx(
        'inline-grid shrink-0 cursor-pointer select-none place-items-center transition-[color,box-shadow] duration-150',
        'disabled:cursor-not-allowed disabled:opacity-50',
        pressed ? 'neu-pressed' : 'neu-flat-sm',
        ICON_SIZE_CLASSES[size],
        ICON_TONE_CLASSES[tone],
        className
      )}
      {...rest}
    >
      {children}
    </button>
  )
}

/* --------------------------------------------------------------------------
   Sélecteur segmenté
   -------------------------------------------------------------------------- */

export interface SegmentedPillsOption<T extends string> {
  value: T
  label: ReactNode
  title?: string
  disabled?: boolean
}

export interface SegmentedPillsProps<T extends string> {
  options: readonly SegmentedPillsOption<T>[]
  value: T
  onChange: (value: T) => void
  /** Nom accessible du groupe. */
  label: string
  size?: 'sm' | 'md'
  /** `tablist` rend les items en `role="tab"` + `aria-selected`. */
  variant?: 'group' | 'tablist'
  className?: string
}

const SEGMENT_SIZE_CLASSES = {
  sm: { track: 'gap-1 p-1', item: 'px-3 py-1 text-xs' },
  md: { track: 'gap-1.5 p-1.5', item: 'px-4 py-1.5 text-sm' },
}

/**
 * Un seul contrôle segmenté pour toute la bibliothèque : les quatre versions
 * qui coexistaient (AudioLevelIndicator, Display, Segmented, Tab) étaient le
 * même composant recopié.
 */
export function SegmentedPills<T extends string>({
  options,
  value,
  onChange,
  label,
  size = 'md',
  variant = 'group',
  className,
}: SegmentedPillsProps<T>) {
  const sizing = SEGMENT_SIZE_CLASSES[size]

  return (
    <div
      role={variant === 'tablist' ? 'tablist' : 'group'}
      aria-label={label}
      className={cx(
        'neu-inset inline-flex select-none items-center rounded-full',
        sizing.track,
        className
      )}
    >
      {options.map((option) => {
        const isActive = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            role={variant === 'tablist' ? 'tab' : undefined}
            aria-selected={variant === 'tablist' ? isActive : undefined}
            aria-pressed={variant === 'group' ? isActive : undefined}
            disabled={option.disabled}
            title={option.title}
            onClick={() => onChange(option.value)}
            className={cx(
              'inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-full font-medium transition-all duration-150',
              'disabled:cursor-not-allowed disabled:opacity-40',
              sizing.item,
              isActive
                ? 'neu-flat scale-[1.02] font-semibold text-[color:var(--neu-accent)]'
                : 'text-[color:var(--neu-text-muted)] hover:text-[color:var(--neu-text)] active:neu-pressed'
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

/* --------------------------------------------------------------------------
   Menus flottants
   -------------------------------------------------------------------------- */

export type MenuAlign = 'start' | 'end'

export interface MenuSurfaceProps {
  align?: MenuAlign
  /** `below` = sous le trigger (défaut) ; `above` = au-dessus (dock bas). */
  side?: 'below' | 'above'
  /** Si false, le parent gère le positionnement (ex. dock flyout). */
  anchored?: boolean
  widthClassName?: string
  className?: string
  children: ReactNode
}

/** Panneau de menu partagé par tous les popovers (select, combobox, partage). */
export function MenuSurface({
  align = 'start',
  side = 'below',
  anchored = true,
  widthClassName = 'w-48',
  className,
  children,
}: MenuSurfaceProps) {
  return (
    <div
      className={cx(
        'neu-flat-lg z-50 flex max-h-60 flex-col gap-1 overflow-y-auto rounded-2xl border border-[color:var(--neu-edge)] p-2',
        anchored && 'absolute',
        anchored && (side === 'above' ? 'bottom-full mb-2' : 'top-full mt-2'),
        anchored && (align === 'end' ? 'right-0' : 'left-0'),
        widthClassName,
        className
      )}
    >
      {children}
    </div>
  )
}

export interface MenuItemProps {
  children: ReactNode
  onSelect: () => void
  icon?: ReactNode
  /** Affiche une coche : l'élément correspond à la valeur courante. */
  selected?: boolean
  danger?: boolean
  disabled?: boolean
  /** Contenu secondaire aligné à droite (compteur, raccourci…). */
  meta?: ReactNode
}

export function MenuItem({ children, onSelect, icon, selected, danger, disabled, meta }: MenuItemProps) {
  return (
    <button
      type="button"
      role="menuitem"
      disabled={disabled}
      onClick={onSelect}
      className={cx(
        'flex w-full cursor-pointer items-center gap-2.5 rounded-full px-3 py-2 text-left text-xs font-medium transition-all',
        'disabled:cursor-not-allowed disabled:opacity-40',
        danger
          ? 'text-rose-500 hover:neu-flat-sm'
          : selected
            ? 'neu-pressed font-semibold text-[color:var(--neu-accent)]'
            : 'text-[color:var(--neu-text-muted)] hover:neu-flat-sm hover:text-[color:var(--neu-text)]'
      )}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span className="flex-1 truncate">{children}</span>
      {selected && <span className="shrink-0 text-[10px] text-[color:var(--neu-accent)]">✓</span>}
      {meta && <span className="shrink-0 text-[10px] font-normal text-[color:var(--neu-text-faint)]">{meta}</span>}
    </button>
  )
}

export function MenuLabel({ children }: { children: ReactNode }) {
  return (
    <span className="px-1 text-[10px] font-bold uppercase tracking-wider text-[color:var(--neu-text-faint)]">
      {children}
    </span>
  )
}

export function MenuSeparator() {
  return <div className="my-1 h-px bg-[color:var(--neu-edge)]" role="separator" />
}
