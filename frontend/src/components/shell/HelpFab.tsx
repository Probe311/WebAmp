import { useState } from 'react'
import { ContactSupportModal } from '../ContactSupportModal'
import { DOCK_TILE_CLASS } from '../tactile/shell/dockTile'
import { FaIcon } from '../../icons/fa'
import { cx } from '../ui/cx'

/** CTA Aide — toujours visible, bas-droite (même tuile que le dock). */
export function HelpFab() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="pointer-events-none fixed bottom-6 right-6 z-[var(--td-z-dock,40)] pb-[env(safe-area-inset-bottom)]">
        <button
          type="button"
          title="Contact & Support"
          aria-label="Contact & Support"
          onClick={() => setOpen(true)}
          className={cx('pointer-events-auto', DOCK_TILE_CLASS)}
        >
          <FaIcon icon="circle-question" className="h-5 w-5" />
        </button>
      </div>

      <ContactSupportModal isOpen={open} onClose={() => setOpen(false)} />
    </>
  )
}
