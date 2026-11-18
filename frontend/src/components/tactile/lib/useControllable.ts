import { useCallback, useState } from 'react'

/**
 * État contrôlé ou non contrôlé : si `value` est fourni, il fait foi et le
 * composant ne fait que notifier ; sinon l'état est local, initialisé par
 * `defaultValue`.
 */
export function useControllable<T>(
  value: T | undefined,
  defaultValue: T,
  onChange?: (next: T) => void
): [T, (next: T) => void] {
  const [inner, setInner] = useState(defaultValue)
  const isControlled = value !== undefined
  const set = useCallback(
    (next: T) => {
      if (!isControlled) setInner(next)
      onChange?.(next)
    },
    [isControlled, onChange]
  )
  return [isControlled ? value : inner, set]
}

export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))
