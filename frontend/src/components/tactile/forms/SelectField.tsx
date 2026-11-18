import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
  type Ref,
} from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown, Search as SearchIcon, X } from 'lucide-react'
import { cx } from '../../ui/cx'
import { useDismissible } from '../lib/useDismissible'
import { MenuItem, MenuLabel, MenuSurface } from '../primitives'

/** Déclencheur commun aux listes : pilule en relief qui s'enfonce quand elle est ouverte. */
function ListboxTrigger({
  open,
  onClick,
  invalid,
  children,
  trailing,
  disabled,
  buttonRef,
  'aria-label': ariaLabel,
}: {
  open: boolean
  onClick: () => void
  invalid?: boolean
  children: ReactNode
  trailing?: ReactNode
  disabled?: boolean
  buttonRef?: Ref<HTMLButtonElement>
  'aria-label'?: string
}) {
  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-expanded={open}
      aria-haspopup="listbox"
      className={cx(
        'flex w-full cursor-pointer items-center justify-between gap-2 rounded-full bg-[color:var(--neu-bg)] px-5 py-2.5',
        'text-left text-sm transition-shadow disabled:cursor-not-allowed disabled:opacity-50',
        invalid
          ? 'ring-2 ring-rose-400'
          : 'focus-visible:ring-2 focus-visible:ring-[color:var(--neu-accent)]/40',
        open ? 'neu-pressed text-[color:var(--neu-accent)]' : 'neu-flat text-[color:var(--neu-text)]'
      )}
    >
      <span className="flex min-w-0 items-center gap-2 truncate">{children}</span>
      <span className="flex shrink-0 items-center gap-1">
        {trailing}
        <ChevronDown
          className={cx('h-4 w-4 transition-transform duration-200', open ? 'rotate-180' : 'text-[color:var(--neu-text-faint)]')}
        />
      </span>
    </button>
  )
}

export interface SelectOption<T extends string = string> {
  value: T
  label: string
  icon?: ReactNode
  disabled?: boolean
}

export interface SelectFieldProps<T extends string = string> {
  options: readonly SelectOption<T>[]
  value: T | undefined
  onChange: (value: T) => void
  label?: string
  /** Libellé accessible si `label` est omis (ex. fenêtres outils sans texte visible). */
  'aria-label'?: string
  placeholder?: string
  disabled?: boolean
  error?: string
  className?: string
}

type MenuPos = { left: number; width: number; top?: number; bottom?: number; maxHeight: number }

/** Liste déroulante simple, sans filtre. Menu en portal (pas coupé par overflow fenêtre). */
export function SelectField<T extends string = string>({
  options,
  value,
  onChange,
  label,
  'aria-label': ariaLabel,
  placeholder = 'Sélectionner…',
  disabled = false,
  error,
  className,
}: SelectFieldProps<T>) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState<MenuPos | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const selected = options.find((option) => option.value === value)

  useLayoutEffect(() => {
    if (!open || !buttonRef.current) {
      setPos(null)
      return
    }
    const place = () => {
      const r = buttonRef.current!.getBoundingClientRect()
      const gap = 8
      const spaceBelow = window.innerHeight - r.bottom - gap
      const spaceAbove = r.top - gap
      const preferAbove = spaceBelow < 160 && spaceAbove > spaceBelow
      const maxHeight = Math.min(240, Math.max(96, preferAbove ? spaceAbove : spaceBelow))
      setPos(
        preferAbove
          ? { left: r.left, width: r.width, bottom: window.innerHeight - r.top + gap, maxHeight }
          : { left: r.left, width: r.width, top: r.bottom + gap, maxHeight }
      )
    }
    place()
    window.addEventListener('resize', place)
    window.addEventListener('scroll', place, true)
    return () => {
      window.removeEventListener('resize', place)
      window.removeEventListener('scroll', place, true)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node
      if (containerRef.current?.contains(target) || menuRef.current?.contains(target)) return
      setOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('touchstart', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('touchstart', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <div ref={containerRef} className={cx('relative flex w-full select-none flex-col gap-1.5', className)}>
      {label && <span className="px-1 text-xs font-semibold text-[color:var(--neu-text-muted)]">{label}</span>}

      <ListboxTrigger
        open={open}
        onClick={() => setOpen((current) => !current)}
        invalid={Boolean(error)}
        disabled={disabled}
        trailing={selected?.icon}
        buttonRef={buttonRef}
        aria-label={ariaLabel ?? label}
      >
        <span className={cx('truncate', selected ? 'font-medium' : 'text-[color:var(--neu-text-faint)]')}>
          {selected ? selected.label : placeholder}
        </span>
      </ListboxTrigger>

      {open &&
        pos &&
        createPortal(
          <div
            ref={menuRef}
            role="listbox"
            style={{
              position: 'fixed',
              left: pos.left,
              width: pos.width,
              top: pos.top,
              bottom: pos.bottom,
              zIndex: 200,
              maxHeight: pos.maxHeight,
            }}
          >
            <MenuSurface anchored={false} widthClassName="w-full" className="!max-h-full">
              {options.map((option) => (
                <MenuItem
                  key={option.value}
                  selected={option.value === value}
                  disabled={option.disabled}
                  icon={option.icon}
                  onSelect={() => {
                    onChange(option.value)
                    setOpen(false)
                  }}
                >
                  {option.label}
                </MenuItem>
              ))}
            </MenuSurface>
          </div>,
          document.body
        )}

      {error && (
        <p role="alert" className="px-2 text-xs font-medium text-rose-500">
          {error}
        </p>
      )}
    </div>
  )
}

export interface ComboboxOption<T extends string = string> extends SelectOption<T> {
  /** Précision affichée après le libellé et incluse dans le filtre. */
  category?: string
}

export interface ComboboxFieldProps<T extends string = string> {
  options: readonly ComboboxOption<T>[]
  value: T | undefined
  onChange: (value: T) => void
  label?: string
  placeholder?: string
  className?: string
}

/** Liste déroulante filtrable, pour les catalogues longs. */
export function ComboboxField<T extends string = string>({
  options,
  value,
  onChange,
  label,
  placeholder = 'Rechercher ou sélectionner…',
  className,
}: ComboboxFieldProps<T>) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const containerRef = useDismissible<HTMLDivElement>(open, () => {
    setOpen(false)
    setQuery('')
  })

  const selected = options.find((option) => option.value === value)
  const normalizedQuery = query.trim().toLowerCase()
  const matches = normalizedQuery
    ? options.filter(
        (option) =>
          option.label.toLowerCase().includes(normalizedQuery) ||
          option.category?.toLowerCase().includes(normalizedQuery)
      )
    : options

  return (
    <div ref={containerRef} className={cx('relative flex w-full select-none flex-col gap-1.5', className)}>
      {label && <span className="px-1 text-xs font-semibold text-[color:var(--neu-text-muted)]">{label}</span>}

      <div className="flex items-center gap-1.5">
        {open ? (
          <div className="neu-pressed flex w-full items-center gap-2 rounded-full px-4 py-2 ring-2 ring-[color:var(--neu-accent)]/30">
            <SearchIcon className="h-4 w-4 shrink-0 text-[color:var(--neu-text-faint)]" />
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Taper pour filtrer…"
              aria-label="Filtrer les options"
              className="w-full min-w-0 bg-transparent text-sm text-[color:var(--neu-text)] outline-none placeholder:text-[color:var(--neu-text-faint)]"
            />
            <button
              type="button"
              onClick={() => {
                setOpen(false)
                setQuery('')
              }}
              aria-label="Fermer la liste"
              className="shrink-0 cursor-pointer p-1 text-[color:var(--neu-text-faint)] hover:text-[color:var(--neu-text)]"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <>
            <ListboxTrigger open={false} onClick={() => setOpen(true)}>
              <span className={cx('truncate', selected ? 'font-medium' : 'text-[color:var(--neu-text-faint)]')}>
                {selected ? selected.label : placeholder}
              </span>
            </ListboxTrigger>
            {selected && (
              <button
                type="button"
                onClick={() => onChange('' as T)}
                aria-label="Effacer la sélection"
                title="Effacer la sélection"
                className="neu-flat-sm grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-full text-[color:var(--neu-text-faint)] transition-colors hover:text-rose-500"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </>
        )}
      </div>

      {open && (
        <MenuSurface widthClassName="w-full">
          <MenuLabel>
            {matches.length} résultat{matches.length > 1 ? 's' : ''}
          </MenuLabel>
          {matches.length === 0 ? (
            <p className="py-4 text-center text-xs text-[color:var(--neu-text-faint)]">Aucun résultat</p>
          ) : (
            matches.map((option) => (
              <MenuItem
                key={option.value}
                selected={option.value === value}
                disabled={option.disabled}
                icon={option.icon}
                meta={option.category}
                onSelect={() => {
                  onChange(option.value)
                  setOpen(false)
                  setQuery('')
                }}
              >
                {option.label}
              </MenuItem>
            ))
          )}
        </MenuSurface>
      )}
    </div>
  )
}

export interface LanguageOption {
  code: string
  label: string
  flag: string
}

const DEFAULT_LANGUAGES: readonly LanguageOption[] = [
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
]

export interface LanguageMenuProps {
  languages?: readonly LanguageOption[]
  value: string
  onChange: (code: string) => void
  className?: string
}

/** Sélecteur de langue compact (drapeau + code). */
export function LanguageMenu({ languages = DEFAULT_LANGUAGES, value, onChange, className }: LanguageMenuProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useDismissible<HTMLDivElement>(open, () => setOpen(false))
  const active = languages.find((language) => language.code === value) ?? languages[0]

  return (
    <div ref={containerRef} className={cx('relative inline-block select-none', className)}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={`Langue : ${active.label}`}
        className={cx(
          'flex cursor-pointer items-center gap-2 rounded-full bg-[color:var(--neu-bg)] px-3.5 py-1.5 text-xs font-semibold',
          open ? 'neu-pressed text-[color:var(--neu-accent)]' : 'neu-flat text-[color:var(--neu-text)]'
        )}
      >
        <span aria-hidden="true">{active.flag}</span>
        <span className="font-mono text-[11px] uppercase">{active.code}</span>
        <ChevronDown className={cx('h-3.5 w-3.5 transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <MenuSurface align="end" widthClassName="w-40">
          {languages.map((language) => (
            <MenuItem
              key={language.code}
              selected={language.code === value}
              icon={<span aria-hidden="true">{language.flag}</span>}
              onSelect={() => {
                onChange(language.code)
                setOpen(false)
              }}
            >
              {language.label}
            </MenuItem>
          ))}
        </MenuSurface>
      )}
    </div>
  )
}
