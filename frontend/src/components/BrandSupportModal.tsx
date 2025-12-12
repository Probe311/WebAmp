import { Modal } from './Modal'
import { BadgeCheck } from 'lucide-react'
import walrusLogo from '../assets/logos/walrus.svg'

interface BrandSupportModalProps {
  isOpen: boolean
  onClose: () => void
}

const supportingBrands = [
  { name: 'Walrus', logo: walrusLogo }
  // Ajouter d'autres marques ici au fur et à mesure
]

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
          <h3 className="text-xl font-semibold text-black/85 dark:text-white/90">
            Merci à nos partenaires !
          </h3>
          <p className="text-base text-black/70 dark:text-white/70 leading-relaxed">
            WebAmp est fier de collaborer avec des marques de renom qui soutiennent notre projet 
            et certifient leurs équipements pour garantir une qualité sonore optimale.
          </p>
        </div>

        {/* Explication sur l'icône de certification */}
        <div className="flex items-start gap-3 p-4 bg-[#f5f5f5] dark:bg-gray-700/50 rounded-lg border border-black/10 dark:border-white/10">
          <BadgeCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-black/85 dark:text-white/85 mb-1">
              Matériel certifié
            </p>
            <p className="text-sm text-black/70 dark:text-white/70">
              Le matériel certifié par les marques partenaires est identifiable par l'icône suivante :{' '}
              <span className="inline-flex items-center">
                <BadgeCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mx-1" />
              </span>
            </p>
            <p className="text-sm text-black/70 dark:text-white/70">
              Ces équipements ont été validés et approuvés par les fabricants pour garantir une reproduction fidèle de leurs caractéristiques sonores.
            </p>
          </div>
        </div>

        {/* Grille des logos */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-black/85 dark:text-white/90 text-center">
            Marques partenaires
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {supportingBrands.map((brand) => (
              <div
                key={brand.name}
                className="flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-800 rounded-lg border border-black/10 dark:border-white/10 hover:shadow-lg transition-shadow duration-200"
              >
                <img
                  src={brand.logo}
                  alt={`Logo ${brand.name}`}
                  className="max-h-16 max-w-full object-contain dark:brightness-0 dark:invert"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Bouton de fermeture */}
        <div className="flex justify-center pt-4">
          <button
            onClick={handleClose}
            className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium transition-all duration-200 hover:opacity-90 active:scale-95"
            style={{
              boxShadow: document.documentElement.classList.contains('dark')
                ? '2px 2px 4px rgba(0, 0, 0, 0.5), -2px -2px 4px rgba(60, 60, 60, 0.5)'
                : '2px 2px 4px rgba(0, 0, 0, 0.08), -2px -2px 4px rgba(255, 255, 255, 0.9)'
            }}
          >
            Continuer
          </button>
        </div>
      </div>
    </Modal>
  )
}

