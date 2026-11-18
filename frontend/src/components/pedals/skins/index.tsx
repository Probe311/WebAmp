import type { PedalModel } from '../../../data/pedals'
import type { PedalComponentProps } from '../types'
import { FlatSkin } from './FlatSkin'
import { UltraSkin } from './UltraSkin'
import { EqSkin } from './EqSkin'
import { DigitalSkin } from './DigitalSkin'
import { ArtSkin } from './ArtSkin'
import { WahSkin } from './WahSkin'
import { IndustrialSkin } from './IndustrialSkin'

export function PedalSkinView(props: PedalComponentProps & { model: PedalModel }) {
  const skin = props.model.ui?.skin || 'flat'
  switch (skin) {
    case 'ultra':
      return <UltraSkin {...props} />
    case 'eq':
      return <EqSkin {...props} />
    case 'digital':
      return <DigitalSkin {...props} />
    case 'art':
      return <ArtSkin {...props} />
    case 'wah':
      return <WahSkin {...props} />
    case 'industrial':
      return <IndustrialSkin {...props} />
    case 'flat':
    default:
      return <FlatSkin {...props} />
  }
}
