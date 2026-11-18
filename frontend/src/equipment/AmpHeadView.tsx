import { useMemo, useState } from 'react'
import { ampEquipment } from './definitions/amplifiers'
import { EquipmentShell } from './EquipmentShell'

export interface AmpHeadViewProps {
  /** Id catalogue de l'ampli (archétype + surface résolus automatiquement). */
  ampId: string
  values: Record<string, number>
  isPowered: boolean
  onParameterChange: (name: string, value: number) => void
  onPowerChange: (next: boolean) => void
  maxWidth?: number | string
  className?: string
}

/**
 * Vue ampli en marque blanche : châssis + façade + contrôles data-driven.
 * La logique audio (tone stack, NAM, WebSocket) reste dans `AmplifierSelector`.
 */
export function AmpHeadView({
  ampId,
  values,
  isPowered,
  onParameterChange,
  onPowerChange,
  maxWidth,
  className = '',
}: AmpHeadViewProps) {
  const definition = ampEquipment[ampId]
  const defaults = useMemo(
    () => ({
      cabinet: definition?.switches.find((s) => s.id === 'cabinet')?.defaultValue ?? true,
      channel: definition?.switches.find((s) => s.id === 'channel')?.defaultValue ?? false,
    }),
    [definition]
  )
  const [cabinet, setCabinet] = useState(defaults.cabinet)
  const [channel, setChannel] = useState(defaults.channel)

  if (!definition) return null

  const switchStates: Record<string, boolean> = {
    power: isPowered,
    cabinet,
    channel,
  }

  const handleSwitchChange = (id: string, checked: boolean) => {
    if (id === 'power') {
      onPowerChange(checked)
      return
    }
    if (id === 'cabinet') {
      setCabinet(checked)
      return
    }
    if (id === 'channel') setChannel(checked)
  }

  return (
    <EquipmentShell
      definition={definition}
      values={values}
      switchStates={switchStates}
      onControlChange={onParameterChange}
      onSwitchChange={handleSwitchChange}
      maxWidth={maxWidth ?? '100%'}
      className={className}
    />
  )
}
