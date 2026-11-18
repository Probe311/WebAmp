import { useState, type ReactNode } from 'react'
import { Bell, LogOut, Settings, User } from 'lucide-react'
import { cx } from '../../ui/cx'
import { useDismissible } from '../lib/useDismissible'
import { MenuItem, MenuSeparator, MenuSurface } from '../primitives'

export interface HeaderLink {
  id: string
  label: string
  href: string
}

export interface AppHeaderProps {
  /** Logo / nom de marque. */
  brand: ReactNode
  links?: readonly HeaderLink[]
  /** Id du lien actif (`aria-current`). */
  activeLink?: string
  cta?: { label: string; onClick: () => void }
  /** Zone droite libre, typiquement `<HeaderUser />`. */
  children?: ReactNode
  className?: string
}

export function AppHeader({ brand, links = [], activeLink, cta, children, className }: AppHeaderProps) {
  return (
    <header
      className={cx(
        'neu-flat flex items-center gap-6 rounded-3xl border border-[color:var(--neu-edge)] px-6 py-3.5 sm:rounded-full',
        className
      )}
    >
      <div className="text-sm font-extrabold tracking-tight text-[color:var(--neu-text)]">{brand}</div>

      <nav aria-label="Principal" className="flex flex-1 items-center gap-1">
        {links.map((link) => {
          const isActive = link.id === activeLink
          return (
            <a
              key={link.id}
              href={link.href}
              aria-current={isActive ? 'page' : undefined}
              className={cx(
                'rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors',
                isActive ? 'neu-pressed text-[color:var(--neu-accent)]' : 'text-[color:var(--neu-text-muted)] hover:text-[color:var(--neu-text)]'
              )}
            >
              {link.label}
            </a>
          )
        })}
      </nav>

      {cta && (
        <button
          type="button"
          onClick={cta.onClick}
          className="neu-accent-btn cursor-pointer rounded-full px-5 py-2 text-xs font-bold text-white"
        >
          {cta.label}
        </button>
      )}
      {children}
    </header>
  )
}

export interface HeaderUserProps {
  name: string
  email?: string
  /** URL d'avatar ; sinon initiales. */
  avatarSrc?: string
  /** Notifications non lues (0 = masquée). */
  notifications?: number
  onNotifications?: () => void
  onProfile?: () => void
  onSettings?: () => void
  onLogout?: () => void
}

export function HeaderUser({
  name,
  email,
  avatarSrc,
  notifications = 0,
  onNotifications,
  onProfile,
  onSettings,
  onLogout,
}: HeaderUserProps) {
  const [open, setOpen] = useState(false)
  const ref = useDismissible<HTMLDivElement>(open, () => setOpen(false))
  const run = (fn?: () => void) => () => {
    setOpen(false)
    fn?.()
  }
  const initials = name
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        aria-label={notifications ? `Notifications (${notifications} non lues)` : 'Notifications'}
        onClick={onNotifications}
        className="neu-flat-sm relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-[color:var(--neu-text-muted)] transition-colors hover:text-[color:var(--neu-text)] active:scale-95"
      >
        <Bell size={15} />
        {notifications > 0 && (
          <span className="neu-accent-btn absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-bold text-white">
            {notifications > 99 ? '99+' : notifications}
          </span>
        )}
      </button>

      <div ref={ref} className="relative">
        <button
          type="button"
          aria-label={`Menu de ${name}`}
          aria-haspopup="menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className={cx(
            'flex h-9 w-9 cursor-pointer items-center justify-center overflow-hidden rounded-full text-[11px] font-bold text-[color:var(--neu-text-muted)]',
            open ? 'neu-pressed' : 'neu-flat-sm'
          )}
        >
          {avatarSrc ? <img src={avatarSrc} alt="" className="h-full w-full object-cover" /> : initials}
        </button>

        {open && (
          <div role="menu">
            <MenuSurface align="end" widthClassName="w-56">
              <div className="px-3 py-2">
                <p className="truncate text-xs font-bold text-[color:var(--neu-text)]">{name}</p>
                {email && <p className="truncate text-[10px] text-[color:var(--neu-text-faint)]">{email}</p>}
              </div>
              <MenuSeparator />
              <MenuItem icon={<User size={13} />} onSelect={run(onProfile)}>
                Profil
              </MenuItem>
              <MenuItem icon={<Settings size={13} />} onSelect={run(onSettings)}>
                Paramètres
              </MenuItem>
              <MenuSeparator />
              <MenuItem danger icon={<LogOut size={13} />} onSelect={run(onLogout)}>
                Déconnexion
              </MenuItem>
            </MenuSurface>
          </div>
        )}
      </div>
    </div>
  )
}
