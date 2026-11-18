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
        <h3 className="text-xl font-bold text-[var(--td-text-primary)]">
          Merci à Walrus Audio
        </h3>
        <p className="text-sm text-[var(--td-text-secondary)]">
          Nous remercions les marques pour leur soutien à WebAmp.
        </p>
        <button
          onClick={onClose}
          className="mt-4 px-6 py-3 bg-[var(--td-energy)] text-white rounded-[var(--td-radius-lg)] text-sm font-medium shadow-[var(--td-control-shadow)] hover:shadow-[var(--td-elevation-2)] transition-all duration-200"
        >
          Continuer
        </button>
      </div>
    </Modal>
  )
}

