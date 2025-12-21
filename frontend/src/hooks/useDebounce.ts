/**
 * Hook personnalisé pour le debouncing
 */

import { useEffect, useRef, useCallback } from 'react'

/**
 * Crée une fonction debounced qui attend un délai avant d'exécuter la fonction
 * 
 * @param fn - La fonction à debouncer
 * @param delay - Le délai en millisecondes
 * @returns La fonction debounced
 */
export function useDebouncedCallback<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number
): T {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const debouncedFn = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        fn(...args)
      }, delay)
    },
    [fn, delay]
  ) as T

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return debouncedFn
}

