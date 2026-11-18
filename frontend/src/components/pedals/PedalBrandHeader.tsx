import { BadgeCheck } from 'lucide-react'
import {
  getCertifiedBrandSmallLogo,
  hasCertificationStatus,
} from '../../utils/certificationStatus'

/**
 * Header marque : logo certifié + BadgeCheck (pattern Walrus) ou texte.
 */
export function PedalBrandHeader({
  brand,
  model,
  brandClassName = '',
  modelClassName = '',
}: {
  brand: string
  model?: string
  brandClassName?: string
  modelClassName?: string
}) {
  const certified = hasCertificationStatus(brand)
  const logo = certified ? getCertifiedBrandSmallLogo(brand) : null

  return (
    <div className="flex flex-col items-center select-none min-w-0 w-full">
      {certified && logo ? (
        <div className={`flex items-center justify-center gap-1 mb-0.5 ${brandClassName}`}>
          <img
            src={logo}
            alt={brand}
            className="h-3.5 object-contain brightness-0"
            style={{ maxWidth: '64px' }}
          />
          <BadgeCheck className="w-2.5 h-2.5 flex-shrink-0 text-emerald-600/90" aria-hidden />
          <span className="sr-only">Matériel certifié</span>
        </div>
      ) : (
        <div
          className={`uppercase tracking-[0.5px] mb-0.5 font-medium text-center text-[10px] ${brandClassName}`}
          style={{ color: '#1C1C1E' }}
        >
          {brand}
        </div>
      )}
      {model && (
        <div
          className={`font-semibold text-center leading-tight text-[0.75rem] sm:text-sm ${modelClassName}`}
          style={{ color: '#1C1C1E' }}
        >
          {model}
        </div>
      )}
    </div>
  )
}
