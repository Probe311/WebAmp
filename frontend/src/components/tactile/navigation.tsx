import type { ReactNode } from 'react'
import { Check, ChevronLeft, ChevronRight, Home, ListFilter } from 'lucide-react'
import { cx } from '../ui/cx'
import { Panel, SegmentedPills } from './primitives'

/* --------------------------------------------------------------------------
   Onglets
   -------------------------------------------------------------------------- */

export interface TabItem {
  id: string
  label: string
  icon?: ReactNode
  /** Pastille numérique ou texte après le libellé. */
  badge?: ReactNode
}

export interface TabBarProps {
  items: readonly TabItem[]
  value: string
  onChange: (id: string) => void
  /** Nom accessible de la barre. */
  label: string
  /** `pill` : piste creuse ; `underline` : onglets soulignés. */
  variant?: 'pill' | 'underline'
  className?: string
}

/**
 * Une seule barre d'onglets pour les trois variantes qui existaient
 * (Navigation, Tab, Tabnav) : même sémantique `tablist`, deux habillages.
 */
export function TabBar({ items, value, onChange, label, variant = 'pill', className }: TabBarProps) {
  if (variant === 'pill') {
    return (
      <SegmentedPills
        label={label}
        variant="tablist"
        value={value}
        onChange={onChange}
        className={className}
        options={items.map((item) => ({
          value: item.id,
          label: (
            <span className="flex items-center gap-1.5">
              {item.icon}
              {item.label}
              {item.badge !== undefined && (
                <span className="neu-inset rounded-full px-1.5 py-0.5 text-[10px] font-bold">
                  {item.badge}
                </span>
              )}
            </span>
          ),
        }))}
      />
    )
  }

  return (
    <div role="tablist" aria-label={label} className={cx('flex items-center gap-1 overflow-x-auto', className)}>
      {items.map((item) => {
        const isActive = item.id === value
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(item.id)}
            className={cx(
              'flex shrink-0 cursor-pointer items-center gap-2 whitespace-nowrap rounded-2xl px-3.5 py-1.5 text-xs font-medium transition-colors',
              isActive
                ? 'border-b-2 border-[color:var(--neu-accent)] font-bold text-[color:var(--neu-text)]'
                : 'text-[color:var(--neu-text-muted)] hover:text-[color:var(--neu-text)]'
            )}
          >
            {item.label}
            {item.badge !== undefined && (
              <span className="font-mono text-[10px] text-[color:var(--neu-text-faint)]">({item.badge})</span>
            )}
          </button>
        )
      })}
    </div>
  )
}

/* --------------------------------------------------------------------------
   Fil d'Ariane
   -------------------------------------------------------------------------- */

export interface BreadcrumbItem {
  label: string
  href?: string
}

export interface BreadcrumbsProps {
  items: readonly BreadcrumbItem[]
  /** Dernier élément non cliquable. */
  currentLabel?: string
  className?: string
}

export function Breadcrumbs({ items, currentLabel, className }: BreadcrumbsProps) {
  return (
    <nav aria-label="Fil d'Ariane" className={cx('flex select-none items-center gap-2', className)}>
      <a
        href="/"
        aria-label="Accueil"
        title="Accueil"
        className="neu-flat-sm grid h-8 w-8 shrink-0 place-items-center rounded-full text-[color:var(--neu-text-muted)] transition-colors hover:text-[color:var(--neu-accent)]"
      >
        <Home className="h-3.5 w-3.5" />
      </a>

      {items.map((item) => (
        <span key={item.label} className="flex items-center gap-2">
          <ChevronRight className="h-3.5 w-3.5 shrink-0 text-[color:var(--neu-text-faint)]" aria-hidden="true" />
          <a
            href={item.href ?? '#'}
            className="whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium text-[color:var(--neu-text-muted)] transition-colors hover:neu-flat-sm hover:text-[color:var(--neu-text)]"
          >
            {item.label}
          </a>
        </span>
      ))}

      {currentLabel && (
        <span className="flex items-center gap-2">
          <ChevronRight className="h-3.5 w-3.5 shrink-0 text-[color:var(--neu-text-faint)]" aria-hidden="true" />
          <span
            aria-current="page"
            className="neu-inset whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold text-[color:var(--neu-accent)]"
          >
            {currentLabel}
          </span>
        </span>
      )}
    </nav>
  )
}

/* --------------------------------------------------------------------------
   Pagination
   -------------------------------------------------------------------------- */

export interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  /** Nombre de pages affichées de part et d'autre de la page courante. */
  siblings?: number
  className?: string
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblings = 1,
  className,
}: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1).filter(
    (page) => page === 1 || page === totalPages || Math.abs(page - currentPage) <= siblings
  )

  const stepButton = (direction: -1 | 1, disabled: boolean, label: string) => (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onPageChange(currentPage + direction)}
      aria-label={label}
      title={label}
      className="grid h-8 w-8 cursor-pointer place-items-center rounded-full text-[color:var(--neu-text-muted)] transition-colors hover:text-[color:var(--neu-accent)] disabled:cursor-not-allowed disabled:opacity-30"
    >
      {direction === -1 ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
    </button>
  )

  return (
    <nav
      aria-label="Pagination"
      className={cx(
        'neu-inset inline-flex select-none items-center gap-1.5 rounded-full p-1.5',
        className
      )}
    >
      {stepButton(-1, currentPage <= 1, 'Page précédente')}

      {pages.map((page, index) => {
        const previousPage = pages[index - 1]
        const isActive = page === currentPage
        return (
          <span key={page} className="flex items-center gap-1.5">
            {previousPage !== undefined && page - previousPage > 1 && (
              <span className="px-1 text-xs text-[color:var(--neu-text-faint)]">…</span>
            )}
            <button
              type="button"
              aria-current={isActive ? 'page' : undefined}
              onClick={() => onPageChange(page)}
              className={cx(
                'grid h-8 w-8 cursor-pointer place-items-center rounded-full font-mono text-xs font-bold transition-colors',
                isActive
                  ? 'neu-flat text-[color:var(--neu-accent)]'
                  : 'text-[color:var(--neu-text-muted)] hover:text-[color:var(--neu-text)]'
              )}
            >
              {page}
            </button>
          </span>
        )
      })}

      {stepButton(1, currentPage >= totalPages, 'Page suivante')}
    </nav>
  )
}

/* --------------------------------------------------------------------------
   Étapes
   -------------------------------------------------------------------------- */

export interface Step {
  title: string
  description?: string
}

export interface StepperProps {
  steps: readonly Step[]
  /** Index (0-based) de l'étape courante. */
  currentStep: number
  onStepClick?: (index: number) => void
  className?: string
}

export function Stepper({ steps, currentStep, onStepClick, className }: StepperProps) {
  return (
    <ol className={cx('flex w-full select-none items-start', className)}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep
        const isCurrent = index === currentStep
        return (
          <li key={step.title} className="flex flex-1 items-start">
            <button
              type="button"
              onClick={() => onStepClick?.(index)}
              aria-current={isCurrent ? 'step' : undefined}
              className="flex cursor-pointer flex-col items-center gap-2 text-center"
            >
              <span
                className={cx(
                  'grid h-9 w-9 place-items-center rounded-full font-mono text-xs font-bold transition-shadow',
                  isCompleted
                    ? 'neu-accent-btn text-white'
                    : isCurrent
                      ? 'neu-pressed text-[color:var(--neu-accent)]'
                      : 'neu-flat text-[color:var(--neu-text-faint)]'
                )}
              >
                {isCompleted ? <Check className="h-4 w-4 stroke-[3]" /> : index + 1}
              </span>
              <span
                className={cx(
                  'whitespace-nowrap text-xs font-semibold',
                  isCurrent
                    ? 'text-[color:var(--neu-accent)]'
                    : isCompleted
                      ? 'text-[color:var(--neu-text)]'
                      : 'text-[color:var(--neu-text-faint)]'
                )}
              >
                {step.title}
              </span>
              {step.description && (
                <span className="hidden text-[10px] text-[color:var(--neu-text-faint)] sm:block">{step.description}</span>
              )}
            </button>

            {index < steps.length - 1 && (
              <span
                aria-hidden="true"
                className="neu-inset mx-3 mt-4 h-1 flex-1 overflow-hidden rounded-full"
              >
                <span
                  className="block h-full rounded-full bg-[color:var(--neu-accent)] transition-[width] duration-300"
                  style={{ width: isCompleted ? '100%' : '0%' }}
                />
              </span>
            )}
          </li>
        )
      })}
    </ol>
  )
}

/* --------------------------------------------------------------------------
   Navigation latérale
   -------------------------------------------------------------------------- */

export interface SideNavigationItem {
  id: string
  label: string
  icon?: ReactNode
  badge?: ReactNode
}

export interface SideNavigationSection {
  title?: string
  items: readonly SideNavigationItem[]
}

export interface SideNavigationProps {
  sections: readonly SideNavigationSection[]
  activeId?: string
  onSelect?: (id: string) => void
  label: string
  className?: string
}

export function SideNavigation({ sections, activeId, onSelect, label, className }: SideNavigationProps) {
  return (
    <nav aria-label={label} className={cx('w-64 select-none', className)}>
      <Panel depth="flat" className="flex flex-col gap-6 rounded-3xl p-4">
        {sections.map((section) => (
          <div key={section.title ?? section.items[0]?.id} className="flex flex-col gap-1.5">
            {section.title && (
              <span className="mb-1 px-3 text-[10px] font-bold uppercase tracking-wider text-[color:var(--neu-text-faint)]">
                {section.title}
              </span>
            )}
            {section.items.map((item) => {
              const isActive = item.id === activeId
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-current={isActive ? 'page' : undefined}
                  onClick={() => onSelect?.(item.id)}
                  className={cx(
                    'flex w-full cursor-pointer items-center justify-between gap-2 rounded-full px-4 py-2.5 text-xs font-semibold tracking-wide transition-colors',
                    isActive
                      ? 'neu-pressed text-[color:var(--neu-accent)]'
                      : 'text-[color:var(--neu-text-muted)] hover:text-[color:var(--neu-text)]'
                  )}
                >
                  <span className="flex min-w-0 items-center gap-3">
                    {item.icon && <span className="shrink-0">{item.icon}</span>}
                    <span className="truncate">{item.label}</span>
                  </span>
                  {item.badge !== undefined && (
                    <span
                      className={cx(
                        'rounded-full px-2 py-0.5 font-mono text-[10px] font-bold',
                        isActive
                          ? 'bg-[color:var(--neu-accent)] text-white'
                          : 'neu-inset text-[color:var(--neu-text-muted)]'
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        ))}
      </Panel>
    </nav>
  )
}

/* --------------------------------------------------------------------------
   Liens d'évitement
   -------------------------------------------------------------------------- */

export interface SkipLink {
  label: string
  targetId: string
}

export interface SkipLinksProps {
  links?: readonly SkipLink[]
  className?: string
}

const DEFAULT_SKIP_LINKS: readonly SkipLink[] = [
  { label: 'Aller au contenu principal', targetId: 'main-content' },
  { label: 'Aller à la navigation', targetId: 'main-navigation' },
]

/** Liens invisibles jusqu'au focus clavier, puis ancrés en haut de la page. */
export function SkipLinks({ links = DEFAULT_SKIP_LINKS, className }: SkipLinksProps) {
  return (
    <div className={cx('pointer-events-none fixed left-1/2 top-3 z-[100] flex -translate-x-1/2 gap-2', className)}>
      {links.map((link) => (
        <a
          key={link.targetId}
          href={`#${link.targetId}`}
          className="neu-flat pointer-events-auto -translate-y-20 rounded-full px-5 py-2.5 text-xs font-bold tracking-wide text-[color:var(--neu-accent)] outline-none ring-2 ring-[color:var(--neu-accent)] transition-transform duration-200 focus:translate-y-0"
        >
          {link.label}
        </a>
      ))}
    </div>
  )
}

/* --------------------------------------------------------------------------
   Sommaire
   -------------------------------------------------------------------------- */

export interface PageOutlineItem {
  id: string
  title: string
  level?: 1 | 2
}

export interface PageOutlineProps {
  items: readonly PageOutlineItem[]
  activeId?: string
  onSelect?: (id: string) => void
  title?: string
  className?: string
}

export function PageOutline({
  items,
  activeId,
  onSelect,
  title = 'Sommaire de la page',
  className,
}: PageOutlineProps) {
  return (
    <nav aria-label={title} className={cx('w-full max-w-sm select-none', className)}>
      <Panel depth="flat" className="rounded-3xl p-5">
        <div className="mb-3 flex items-center gap-2 border-b border-[color:var(--neu-edge)] pb-2">
          <ListFilter className="h-4 w-4 text-[color:var(--neu-accent)]" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-[color:var(--neu-text)]">{title}</h4>
        </div>

        <ul className="flex flex-col gap-1.5">
          {items.map((item) => {
            const isActive = item.id === activeId
            return (
              <li key={item.id}>
                <button
                  type="button"
                  aria-current={isActive ? 'location' : undefined}
                  onClick={() => onSelect?.(item.id)}
                  className={cx(
                    'flex w-full cursor-pointer items-center gap-2 rounded-full px-3 py-1.5 text-left text-xs transition-colors',
                    item.level === 2 ? 'pl-6' : '',
                    isActive
                      ? 'neu-pressed font-bold text-[color:var(--neu-accent)]'
                      : 'font-medium text-[color:var(--neu-text-muted)] hover:text-[color:var(--neu-text)]'
                  )}
                >
                  <span
                    className={cx(
                      'h-1.5 w-1.5 shrink-0 rounded-full',
                      isActive ? 'bg-[color:var(--neu-accent)]' : 'bg-[color:var(--neu-bg-hollow)]'
                    )}
                  />
                  <span className="truncate">{item.title}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </Panel>
    </nav>
  )
}
