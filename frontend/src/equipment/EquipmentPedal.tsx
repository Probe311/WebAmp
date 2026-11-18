import { useMemo, useState } from 'react'
import type { PedalComponentProps } from '../components/pedals/types'
import { pedalEquipment } from './definitions/pedals'
import { EquipmentShell } from './EquipmentShell'

/**
 * Adaptateur `PedalComponentProps` → `EquipmentShell`.
 * Conserve l'API attendue par le pedalboard (values / onChange / bypassed /
 * bottomActions) : les ids audio ne bougent pas.
 */
export function EquipmentPedalView({
  pedalId,
  values,
  onChange,
  bypassed = false,
  onBypassToggle,
  bottomActions,
  accentColor,
}: PedalComponentProps & { pedalId: string }) {
  const definition = pedalEquipment[pedalId]

  const defaults = useMemo(() => {
    const multi: Record<string, string> = {}
    const toggles: Record<string, boolean> = {}
    definition?.multiSwitches?.forEach((ms) => {
      multi[ms.id] = ms.defaultValue
    })
    definition?.switches?.forEach((sw) => {
      if (sw.id !== 'active') toggles[sw.id] = sw.defaultValue
    })
    return { multi, toggles }
  }, [definition])

  const [multiValues, setMultiValues] = useState<Record<string, string>>(defaults.multi)
  const [toggles, setToggles] = useState<Record<string, boolean>>(defaults.toggles)

  if (!definition) return null

  const switchStates: Record<string, boolean> = { ...toggles, active: !bypassed }

  const handleControlChange = (id: string, value: number) => {
    onChange?.(id, value)
  }

  const handleSwitchChange = (id: string, checked: boolean) => {
    if (id === 'active') {
      if (checked === bypassed) onBypassToggle?.()
      return
    }
    setToggles((prev) => ({ ...prev, [id]: checked }))
  }

  const handleMultiSwitchChange = (id: string, value: string) => {
    setMultiValues((prev) => ({ ...prev, [id]: value }))
    const ms = definition.multiSwitches?.find((m) => m.id === id)
    const index = ms ? ms.options.indexOf(value) : -1
    if (index >= 0) onChange?.(id, index)
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <EquipmentShell
        definition={definition}
        values={values ?? {}}
        multiValues={multiValues}
        switchStates={switchStates}
        onControlChange={handleControlChange}
        onMultiSwitchChange={handleMultiSwitchChange}
        onSwitchChange={handleSwitchChange}
        accentColor={accentColor}
        maxWidth={definition.dimensions.width}
      />
      {bottomActions && <div className="w-full max-w-[260px] px-1">{bottomActions}</div>}
    </div>
  )
}

/** Fabrique un composant de pédale data-driven pour un id du catalogue. */
export function createEquipmentPedal(pedalId: string) {
  function EquipmentPedal(props: PedalComponentProps) {
    return <EquipmentPedalView pedalId={pedalId} {...props} />
  }
  EquipmentPedal.displayName = `EquipmentPedal(${pedalId})`
  return EquipmentPedal
}
