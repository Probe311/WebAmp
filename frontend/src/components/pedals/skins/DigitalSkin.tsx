import type { PedalModel } from '../../../data/pedals'
import type { PedalComponentProps } from '../types'
import { UltraSkin } from './UltraSkin'

/** Digital → Ultra (plus de fond SVG). */
export function DigitalSkin(props: PedalComponentProps & { model: PedalModel }) {
  return <UltraSkin {...props} />
}
