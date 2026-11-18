import { useCallback, useState } from 'react'
import { availablePedals } from '../data/pedals'
import { pedalComponents } from '../components/pedals'

/**
 * Page démo : grille de toutes les pédales du catalogue, sans chrome UI.
 * Accès : /#pedals-demo
 */
export function PedalsDemoPage() {
  const [valuesByPedal, setValuesByPedal] = useState<Record<string, Record<string, number>>>({})
  const [bypassedByPedal, setBypassedByPedal] = useState<Record<string, boolean>>({})

  const handleChange = useCallback((pedalId: string, param: string, value: number) => {
    setValuesByPedal((prev) => ({
      ...prev,
      [pedalId]: { ...prev[pedalId], [param]: value },
    }))
  }, [])

  const handleBypass = useCallback((pedalId: string) => {
    setBypassedByPedal((prev) => {
      const current = prev[pedalId] ?? true
      return { ...prev, [pedalId]: !current }
    })
  }, [])

  return (
    <div className="min-h-screen bg-neutral-200 dark:bg-neutral-900 p-6">
      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
        {availablePedals.length} pédales disponibles · {Object.keys(pedalComponents).length} composants
      </p>
      <div className="flex flex-wrap gap-6 items-start content-start">
        {availablePedals.map((model) => {
          const PedalComponent = pedalComponents[model.id]
          if (!PedalComponent) return null

          return (
            <div key={model.id} className="shrink-0">
              <PedalComponent
                accentColor={model.accentColor}
                bypassed={bypassedByPedal[model.id] ?? true}
                onBypassToggle={() => handleBypass(model.id)}
                values={valuesByPedal[model.id]}
                onChange={(param, value) => handleChange(model.id, param, value)}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
