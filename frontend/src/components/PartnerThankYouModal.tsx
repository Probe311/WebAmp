import { Modal } from './Modal'
import walrusLogo from '../assets/logos/walrus.svg'

interface PartnerThankYouModalProps {
  isOpen: boolean
  onClose: () => void
}

export function PartnerThankYouModal({ isOpen, onClose }: PartnerThankYouModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Remerciement à nos partenaires"
      widthClassName="max-w-md"
      bodyClassName="p-6"
    >
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="w-32 h-32 flex items-center justify-center mb-4">
          <img
            src={walrusLogo}
            alt="Walrus Audio"
            className="w-full h-full object-contain opacity-80 dark:opacity-100 dark:brightness-0 dark:invert"
          />
        </div>
        <h3 className="text-xl font-bold text-black/85 dark:text-white/90">
          Merci à Walrus Audio
        </h3>
        <p className="text-sm text-black/70 dark:text-white/70">
          Nous remercions les marques pour leur soutien à WebAmp.
        </p>
        <button
          onClick={onClose}
          className="mt-4 px-6 py-3 bg-orange-500 dark:bg-orange-600 text-white rounded-xl text-sm font-medium shadow-[2px_2px_4px_rgba(0,0,0,0.2)] hover:shadow-[3px_3px_6px_rgba(0,0,0,0.3)] transition-all duration-200"
        >
          Continuer
        </button>
      </div>
    </Modal>
  )
}

