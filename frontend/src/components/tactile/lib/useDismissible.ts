import { useEffect, useRef, type RefObject } from 'react'

/**
 * Ferme un panneau flottant (menu, liste, popover) sur clic extérieur, toucher
 * extérieur ou `Échap`.
 *
 * Remplace les six copies inline qui existaient dans chaque menu : le rappel est
 * gardé dans une ref, donc un appelant qui recrée sa fonction à chaque rendu ne
 * réabonne pas les écouteurs.
 */
export function useDismissible<T extends HTMLElement>(
  open: boolean,
  onDismiss: () => void
): RefObject<T> {
  const containerRef = useRef<T>(null) as RefObject<T>
  const dismissRef = useRef(onDismiss)
  dismissRef.current = onDismiss

  useEffect(() => {
    if (!open) return

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const container = containerRef.current
      if (container && !container.contains(event.target as Node)) dismissRef.current()
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') dismissRef.current()
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('touchstart', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('touchstart', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  return containerRef
}
