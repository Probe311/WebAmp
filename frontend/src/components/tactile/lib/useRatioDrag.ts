import { useRef, type PointerEvent } from 'react'
import { clamp } from './useControllable'

/**
 * Glissement relatif à un élément : renvoie la position du pointeur en
 * fractions 0 → 1 (x de gauche à droite, y de haut en bas). Le pointeur est
 * capturé, donc le geste continue hors de l'élément.
 */
export function useRatioDrag<T extends HTMLElement>(
  onRatio: (x: number, y: number, event: PointerEvent<T>, phase: 'start' | 'move' | 'end') => void,
  disabled = false
) {
  const ref = useRef<T>(null)
  const active = useRef(false)

  const emit = (event: PointerEvent<T>, phase: 'start' | 'move' | 'end') => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect || !rect.width || !rect.height) return
    onRatio(
      clamp((event.clientX - rect.left) / rect.width, 0, 1),
      clamp((event.clientY - rect.top) / rect.height, 0, 1),
      event,
      phase
    )
  }

  return {
    ref,
    handlers: {
      onPointerDown: (event: PointerEvent<T>) => {
        if (disabled || event.button !== 0) return
        event.currentTarget.setPointerCapture?.(event.pointerId)
        active.current = true
        emit(event, 'start')
      },
      onPointerMove: (event: PointerEvent<T>) => {
        if (active.current) emit(event, 'move')
      },
      onPointerUp: (event: PointerEvent<T>) => {
        if (!active.current) return
        active.current = false
        event.currentTarget.releasePointerCapture?.(event.pointerId)
        emit(event, 'end')
      },
      onPointerCancel: (event: PointerEvent<T>) => {
        if (!active.current) return
        active.current = false
        emit(event, 'end')
      },
    },
  }
}
