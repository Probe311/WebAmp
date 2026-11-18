import { Block } from './Block'
import { LogoLoop } from './motion'
import { brandCertifications, getCertifiedBrandFullLogo } from '../utils/certificationStatus'

const LOGOS = Object.keys(brandCertifications)
  .filter(brandName => brandCertifications[brandName].status === 'certified')
  .map(brandName => ({
    name: brandName,
    src: getCertifiedBrandFullLogo(brandName)!
  }))

interface PartnerLogosCarouselProps {
  /** Si true, le composant sera enveloppé dans un Block */
  withBlock?: boolean
}

export function PartnerLogosCarousel({ withBlock = false }: PartnerLogosCarouselProps) {
  const content = (
    <LogoLoop
      logos={LOGOS}
      className="min-h-[5rem]"
      imgClassName="neu-logo h-20 w-auto max-w-[160px] object-contain"
    />
  )

  if (withBlock) {
    return (
      <Block className="w-full overflow-hidden" spotlight glare>
        {content}
      </Block>
    )
  }

  return <div className="w-full h-full overflow-hidden flex items-center">{content}</div>
}
