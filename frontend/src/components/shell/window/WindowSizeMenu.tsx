import { useEffect, useId, useRef, useState } from 'react'
import { FaIcon } from '../../../icons/fa'
import { GRID, WINDOW_SIZES, type SizeId } from '../../../workspace/types'
import { cx } from '../../ui/cx'
import { WINDOW_CHROME_TILE_CLASS } from '../../tactile/shell/dockTile'

interface WindowSizeMenuProps {
  sizeId: SizeId | null
  onSelect: (sizeId: SizeId) => void
  disabled?: boolean
}

/** Sélecteur des 8 tailles — panneau NEU. */
export function WindowSizeMenu({ sizeId, onSelect, disabled }: WindowSizeMenuProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const menuId = useId()

  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: globalThis.PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        title="Taille de la fenêtre"
        aria-label="Taille de la fenêtre"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        aria-pressed={open}
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        onPointerDown={(e) => e.stopPropagation()}
        className={cx(
          WINDOW_CHROME_TILE_CLASS,
          open && 'neu-pressed text-[#F26A1B] ring-2 ring-[#F26A1B]/30'
        )}
      >
        <FaIcon icon="arrow-up-right-and-arrow-down-left-from-center" className="h-3 w-3" />
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          aria-label="Tailles de la fenêtre"
          className="neu-flat-lg absolute right-0 top-full z-50 mt-1.5 grid w-[176px] grid-cols-4 gap-1.5 rounded-xl border border-[color:var(--neu-edge)] p-1.5"
          onPointerDown={(e) => e.stopPropagation()}
        >
          {WINDOW_SIZES.map((size) => {
            const active = size.id === sizeId
            return (
              <button
                key={size.id}
                type="button"
                role="menuitemradio"
                aria-checked={active}
                title={size.name}
                onClick={() => {
                  onSelect(size.id)
                  setOpen(false)
                }}
                className={cx(
                  'flex flex-col items-center gap-1 rounded-xl px-1 py-1.5 text-[10px] font-semibold transition-all duration-200',
                  active
                    ? 'neu-pressed text-[#F26A1B] ring-2 ring-[#F26A1B]/30'
                    : 'neu-flat text-[color:var(--neu-text-muted)] hover:text-[color:var(--neu-text)] active:neu-pressed'
                )}
              >
                <span
                  aria-hidden="true"
                  className={cx(
                    'block rounded-[3px] border',
                    active ? 'border-[#F26A1B]' : 'border-current'
                  )}
                  style={{
                    width: `${Math.round((size.w / GRID) * 22)}px`,
                    height: `${Math.round((size.h / GRID) * 22)}px`,
                  }}
                />
                <span>{size.label}</span>
                <span className="sr-only">{size.name}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
