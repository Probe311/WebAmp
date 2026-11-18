import type { PedalModel } from '../../../data/pedals'
import type { PedalComponentProps } from '../types'
import { UltraSkin } from './UltraSkin'

/** Industrial → Ultra (plus de fond SVG / cadres). */
export function IndustrialSkin(props: PedalComponentProps & { model: PedalModel }) {
  return <UltraSkin {...props} />
}
