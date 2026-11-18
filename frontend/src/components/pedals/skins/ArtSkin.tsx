import type { PedalModel } from '../../../data/pedals'
import type { PedalComponentProps } from '../types'
import { UltraSkin } from './UltraSkin'

/** Art → Ultra (plus de fond SVG). */
export function ArtSkin(props: PedalComponentProps & { model: PedalModel }) {
  return <UltraSkin {...props} />
}
