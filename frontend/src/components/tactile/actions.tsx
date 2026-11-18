import { useState, type AnchorHTMLAttributes, type FormEvent, type ReactNode } from 'react'
import {
  ArrowUpRight,
  Check,
  ChevronDown,
  Contrast,
  Github,
  Linkedin,
  Link as LinkIcon,
  Mail,
  MoreVertical,
  Share2,
  Sliders,
  Twitter,
  Type,
  Youtube,
} from 'lucide-react'
import { cx } from '../ui/cx'
import { useDismissible } from './lib/useDismissible'
import { MenuItem, MenuLabel, MenuSeparator, MenuSurface, Panel, SegmentedPills } from './primitives'
import { SURFACES, TACTILE } from './tokens'

/* --------------------------------------------------------------------------
   Paramètres d'affichage
   -------------------------------------------------------------------------- */

export type FontScale = 'sm' | 'md' | 'lg'
export type ContrastMode = 'normal' | 'high'

export interface DisplaySettingsProps {
  fontScale: FontScale
  onFontScaleChange: (scale: FontScale) => void
  contrast: ContrastMode
  onContrastChange: (mode: ContrastMode) => void
  className?: string
}

export function DisplaySettings({
  fontScale,
  onFontScaleChange,
  contrast,
  onContrastChange,
  className,
}: DisplaySettingsProps) {
  return (
    <Panel depth="flat" className={cx('w-full max-w-sm select-none rounded-[var(--td-radius-panel)] p-5', className)}>
      <div className="mb-4 flex items-center gap-2 border-b border-[color:var(--neu-edge)] pb-2">
        <Sliders className="h-4 w-4" style={{ color: TACTILE.accent }} />
        <h4 className="text-xs font-bold uppercase tracking-wider text-[color:var(--neu-text)]">Paramètres d'affichage</h4>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-1.5 text-xs font-medium text-[color:var(--neu-text-muted)]">
            <Type className="h-3.5 w-3.5" aria-hidden="true" /> Taille de texte
          </span>
          <SegmentedPills
            label="Taille de texte"
            size="sm"
            value={fontScale}
            onChange={onFontScaleChange}
            options={[
              { value: 'sm', label: 'S' },
              { value: 'md', label: 'M' },
              { value: 'lg', label: 'L' },
            ]}
          />
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-1.5 text-xs font-medium text-[color:var(--neu-text-muted)]">
            <Contrast className="h-3.5 w-3.5" aria-hidden="true" /> Contraste
          </span>
          <SegmentedPills
            label="Contraste"
            size="sm"
            value={contrast}
            onChange={onContrastChange}
            options={[
              { value: 'normal', label: 'Normal' },
              { value: 'high', label: 'Élevé' },
            ]}
          />
        </div>
      </div>
    </Panel>
  )
}

/* --------------------------------------------------------------------------
   Menu d'actions
   -------------------------------------------------------------------------- */

export interface ActionMenuItem {
  id: string
  label: string
  icon?: ReactNode
  danger?: boolean
  disabled?: boolean
  onSelect?: () => void
}

export interface ActionMenuProps {
  items: readonly ActionMenuItem[]
  /** Nom accessible du déclencheur. */
  label?: string
  /** Bouton texte au lieu du bouton-icône. */
  triggerLabel?: string
  className?: string
}

/** Menu d'actions local : état d'ouverture, fermeture au clic extérieur, Échap. */
export function ActionMenu({
  items,
  label = "Menu d'actions",
  triggerLabel,
  className,
}: ActionMenuProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useDismissible<HTMLDivElement>(open, () => setOpen(false))

  return (
    <div ref={containerRef} className={cx('relative inline-block select-none', className)}>
      <button
        type="button"
        aria-label={triggerLabel ? undefined : label}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((current) => !current)}
        className={cx(
          'flex cursor-pointer items-center gap-2 rounded-full text-xs font-semibold transition-colors',
          triggerLabel ? 'px-4 py-2' : 'grid h-9 w-9 place-items-center',
          open ? 'text-[color:var(--neu-accent)]' : 'text-[color:var(--neu-text)]'
        )}
        style={open ? SURFACES.pressed : SURFACES.flatSm}
      >
        {triggerLabel ?? <MoreVertical className="h-4 w-4" />}
        {triggerLabel && (
          <ChevronDown className={cx('h-3.5 w-3.5 text-[color:var(--neu-text-faint)] transition-transform', open && 'rotate-180')} />
        )}
      </button>

      {open && (
        <MenuSurface align="end">
          {items.map((item) => (
            <MenuItem
              key={item.id}
              icon={item.icon}
              danger={item.danger}
              disabled={item.disabled}
              onSelect={() => {
                item.onSelect?.()
                setOpen(false)
              }}
            >
              {item.label}
            </MenuItem>
          ))}
        </MenuSurface>
      )}
    </div>
  )
}

/* --------------------------------------------------------------------------
   Inscription à la lettre d'information
   -------------------------------------------------------------------------- */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export interface NewsletterSignupProps {
  title?: string
  description?: string
  onSubmit?: (email: string) => void
  className?: string
}

export function NewsletterSignup({
  title = "Lettre d'information",
  description = 'Restez informé des mises à jour du design system.',
  onSubmit,
  className,
}: NewsletterSignupProps) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string>()
  const [subscribed, setSubscribed] = useState(false)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!EMAIL_PATTERN.test(email.trim())) {
      setError('Adresse email invalide')
      return
    }
    setError(undefined)
    setSubscribed(true)
    onSubmit?.(email.trim())
  }

  return (
    <Panel depth="flat" className={cx('flex w-full max-w-lg select-none flex-col gap-5 rounded-[var(--td-radius-panel)] p-6', className)}>
      <div>
        <h4 className="text-sm font-bold text-[color:var(--neu-text)]">{title}</h4>
        <p className="mt-1 text-xs text-[color:var(--neu-text-muted)]">{description}</p>
      </div>

      {subscribed ? (
        <p
          role="status"
          className="flex items-center gap-2 rounded-full p-3 text-xs font-semibold text-emerald-600"
          style={SURFACES.inset}
        >
          <Check className="h-4 w-4" aria-hidden="true" />
          Merci, votre inscription est enregistrée.
        </p>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative flex w-full items-center">
            <Mail className="pointer-events-none absolute left-4 h-4 w-4 text-[color:var(--neu-text-faint)]" aria-hidden="true" />
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="votre.email@domaine.fr"
              aria-label="Adresse email"
              aria-invalid={error ? true : undefined}
              className="w-full rounded-full bg-[color:var(--neu-bg)] py-2.5 pl-10 pr-4 text-xs text-[color:var(--neu-text)] outline-none placeholder:text-[color:var(--neu-text-faint)] focus:ring-2 focus:ring-[#f26a1b]/40"
              style={SURFACES.inset}
            />
          </div>
          <button
            type="submit"
            className="shrink-0 cursor-pointer rounded-full px-4 py-2 text-xs font-semibold text-white"
            style={{
              background: `linear-gradient(135deg, #ff7a2d, ${TACTILE.accent})`,
              boxShadow: '4px 4px 12px rgba(242, 106, 27, 0.35)',
            }}
          >
            S'abonner
          </button>
        </form>
      )}

      {error && (
        <p role="alert" className="px-1 text-xs text-rose-500">
          {error}
        </p>
      )}

      <div className="flex items-center justify-between gap-3 border-t border-[color:var(--neu-edge)] pt-3">
        <span className="text-[11px] font-semibold text-[color:var(--neu-text-muted)]">Nous suivre</span>
        <div className="flex items-center gap-2">
          {[
            { icon: <Twitter className="h-4 w-4" />, label: 'Twitter' },
            { icon: <Github className="h-4 w-4" />, label: 'GitHub' },
            { icon: <Linkedin className="h-4 w-4" />, label: 'LinkedIn' },
            { icon: <Youtube className="h-4 w-4" />, label: 'YouTube' },
          ].map((social) => (
            <a
              key={social.label}
              href="#"
              aria-label={social.label}
              title={social.label}
              className="grid h-8 w-8 place-items-center rounded-full text-[color:var(--neu-text-muted)] transition-colors hover:text-[color:var(--neu-accent)]"
              style={SURFACES.flatSm}
            >
              {social.icon}
            </a>
          ))}
        </div>
      </div>
    </Panel>
  )
}

/* --------------------------------------------------------------------------
   Lien
   -------------------------------------------------------------------------- */

export interface TextLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: 'inline' | 'pill'
  /** Ouvre dans un nouvel onglet et ajoute l'icône de sortie. */
  external?: boolean
}

export function TextLink({
  children,
  href = '#',
  variant = 'inline',
  external = false,
  className,
  ...rest
}: TextLinkProps) {
  const linkProps = external ? { target: '_blank', rel: 'noreferrer noopener' } : {}

  if (variant === 'pill') {
    return (
      <a
        href={href}
        className={cx(
          'inline-flex cursor-pointer items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold text-[color:var(--neu-text)] transition-colors hover:text-[color:var(--neu-accent)]',
          className
        )}
        style={SURFACES.flatSm}
        {...linkProps}
        {...rest}
      >
        {children}
        {external && <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />}
      </a>
    )
  }

  return (
    <a
      href={href}
      className={cx(
        'inline-flex cursor-pointer items-center gap-1 font-semibold underline-offset-4 hover:underline',
        className
      )}
      style={{ color: TACTILE.accent }}
      {...linkProps}
      {...rest}
    >
      {children}
      {external && <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />}
    </a>
  )
}

/* --------------------------------------------------------------------------
   Partage
   -------------------------------------------------------------------------- */

export interface ShareMenuProps {
  url: string
  title?: string
  className?: string
}

export function ShareMenu({ url, title = 'Design system tactile', className }: ShareMenuProps) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const containerRef = useDismissible<HTMLDivElement>(open, () => setOpen(false))

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  const targets = [
    { label: 'Twitter', href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}` },
    { label: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}` },
  ]

  return (
    <div ref={containerRef} className={cx('relative inline-block select-none', className)}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-haspopup="menu"
        className={cx(
          'flex cursor-pointer items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold',
          open ? 'text-[color:var(--neu-accent)]' : 'text-[color:var(--neu-text)]'
        )}
        style={open ? SURFACES.pressed : SURFACES.flat}
      >
        <Share2 className="h-4 w-4" style={{ color: TACTILE.accent }} aria-hidden="true" />
        Partager
      </button>

      {open && (
        <MenuSurface align="start" widthClassName="w-64">
          <MenuLabel>Partager sur</MenuLabel>
          {targets.map((target) => (
            <MenuItem
              key={target.label}
              icon={<ArrowUpRight className="h-3.5 w-3.5" />}
              onSelect={() => window.open(target.href, '_blank', 'noopener,noreferrer')}
            >
              {target.label}
            </MenuItem>
          ))}
          <MenuSeparator />
          <MenuItem icon={<LinkIcon className="h-3.5 w-3.5" />} meta={copied ? 'Copié' : 'Copier'} onSelect={copy}>
            {url}
          </MenuItem>
        </MenuSurface>
      )}
    </div>
  )
}

/* --------------------------------------------------------------------------
   Pied de page
   -------------------------------------------------------------------------- */

export interface FooterColumn {
  title: string
  links: readonly { label: string; href: string }[]
}

export interface SiteFooterProps {
  brandName?: string
  description?: string
  columns?: readonly FooterColumn[]
  copyright?: string
  className?: string
}

const DEFAULT_COLUMNS: readonly FooterColumn[] = [
  {
    title: 'Composants',
    links: [
      { label: 'Formulaires', href: '#forms' },
      { label: 'Audio', href: '#audio' },
      { label: 'Navigation', href: '#navigation' },
      { label: 'Retours utilisateur', href: '#feedback' },
    ],
  },
  {
    title: 'Ressources',
    links: [
      { label: 'Tokens', href: '#tokens' },
      { label: 'Accessibilité', href: '#a11y' },
      { label: 'Notes de version', href: '#release' },
    ],
  },
]

export function SiteFooter({
  brandName = 'Tactile DS',
  description = 'Bibliothèque de composants React en neumorphisme tactile.',
  columns = DEFAULT_COLUMNS,
  copyright = `© ${new Date().getFullYear()} ${brandName}`,
  className,
}: SiteFooterProps) {
  return (
    <Panel depth="flat" className={cx('w-full select-none rounded-[var(--td-radius-panel)] p-8', className)}>
      <div className="mb-8 grid grid-cols-1 gap-8 border-b border-[color:var(--neu-edge)] pb-8 sm:grid-cols-2 md:grid-cols-3">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span
              className="grid h-7 w-7 place-items-center rounded-full text-xs font-bold"
              style={{ color: TACTILE.accent, ...SURFACES.flatSm }}
            >
              T
            </span>
            <span className="text-sm font-bold tracking-tight text-[color:var(--neu-text)]">{brandName}</span>
          </div>
          <p className="text-xs leading-relaxed text-[color:var(--neu-text-muted)]">{description}</p>
        </div>

        {columns.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <h5 className="mb-3 text-xs font-bold uppercase tracking-wider text-[color:var(--neu-text)]">{column.title}</h5>
            <ul className="flex flex-col gap-2 text-xs text-[color:var(--neu-text-muted)]">
              {column.links.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="transition-colors hover:text-[color:var(--neu-accent)]">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="flex flex-col items-center justify-between gap-4 text-xs text-[color:var(--neu-text-faint)] sm:flex-row">
        <span>{copyright}</span>
        <span className="flex items-center gap-2">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: TACTILE.accent, boxShadow: `0 0 6px ${TACTILE.accent}` }}
            aria-hidden="true"
          />
          <span className="font-mono text-[11px]">Accent {TACTILE.accent}</span>
        </span>
      </div>
    </Panel>
  )
}
