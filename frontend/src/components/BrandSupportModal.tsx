import { Modal } from './Modal'
import { BadgeCheck } from 'lucide-react'
import { brandCertifications, getCertifiedBrandFullLogo } from '../utils/certificationStatus'

interface BrandSupportModalProps {
  isOpen: boolean
  onClose: () => void
}

// Récupérer toutes les marques certifiées depuis la configuration
const supportingBrands = Object.keys(brandCertifications)
  .filter(brandName => brandCertifications[brandName].status === 'certified')
  .map(brandName => ({
    name: brandName,
    logo: getCertifiedBrandFullLogo(brandName)!,
    status: brandCertifications[brandName].status
  }))

export function BrandSupportModal({ isOpen, onClose }: BrandSupportModalProps) {
  const handleClose = () => {
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Remerciements"
      widthClassName="max-w-3xl"
      showCloseButton={true}
    >
      <div className="p-6 space-y-6">
        {/* Texte de remerciement */}
        <div className="text-center space-y-4">
          <h3 className="text-xl font-semibold text-[var(--td-text-primary)]">
            Merci à :
          </h3>
          <p className="text-base text-[var(--td-text-secondary)] leading-relaxed">
            WebAmp est fier de collaborer avec des marques de renom qui soutiennent notre projet 
            et certifient leurs équipements pour garantir une qualité sonore optimale.
          </p>
        </div>

        {/* Explication sur les icônes de certification */}
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-[var(--td-control-track)]/50 rounded-[var(--td-radius-sm)] border border-[var(--td-edge-panel)]">
            <BadgeCheck className="w-6 h-6 text-[var(--td-success)] flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-[var(--td-text-primary)] mb-1">
                Matériel certifié
              </p>
              <p className="text-sm text-[var(--td-text-secondary)]">
                Le matériel certifié par les marques partenaires est identifiable par l'icône suivante :{' '}
                <span className="inline-flex items-center">
                  <BadgeCheck className="w-4 h-4 text-[var(--td-success)] mx-1" />
                </span>
              </p>
              <p className="text-sm text-[var(--td-text-secondary)]">
                Ces équipements ont été validés et approuvés par les fabricants pour garantir une reproduction fidèle de leurs caractéristiques sonores.
              </p>
            </div>
          </div>
        </div>

        {/* Grille des logos */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-[var(--td-text-primary)] text-center">
            Marques partenaires
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {supportingBrands.map((brand) => (
              <div
                key={brand.name}
                className="flex flex-col items-center justify-center p-4 bg-[var(--td-surface-elevated)] rounded-[var(--td-radius-sm)] border border-[var(--td-edge-panel)] hover:shadow-lg transition-shadow duration-200 relative"
              >
                <img
                  src={brand.logo}
                  alt={`Logo ${brand.name}`}
                  className="max-h-16 max-w-full object-contain dark:brightness-0 dark:invert"
                />
                <div className="absolute top-2 right-2">
                  <BadgeCheck 
                    className="w-4 h-4 text-[var(--td-success)]"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bouton de fermeture */}
        <div className="flex justify-center pt-4">
          <button
            onClick={handleClose}
            className="px-6 py-3 bg-[var(--td-primary-strong)] text-[var(--td-on-primary)] rounded-[var(--td-radius-sm)] font-medium transition-all duration-200 hover:opacity-90 active:scale-95"
            style={{
              boxShadow: 'var(--td-elevation-1)'
            }}
          >
            Continuer
          </button>
        </div>
      </div>
    </Modal>
  )
}

