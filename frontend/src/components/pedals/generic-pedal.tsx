import { useMemo } from 'react'
import { pedalLibrary } from '../../data/pedals'
import type { PedalComponentProps } from './types'
import { PedalSkinView } from './skins'

/**
 * Pédale data-driven : skin selon model.ui.skin (flat | ultra | eq | digital | art | wah | industrial).
 */
export function createGenericPedal(pedalId: string) {
  function GenericPedal(props: PedalComponentProps) {
    const model = useMemo(() => pedalLibrary.find((p) => p.id === pedalId), [])
    if (!model) return null
    return <PedalSkinView model={model} {...props} />
  }

  GenericPedal.displayName = `GenericPedal(${pedalId})`
  return GenericPedal
}
