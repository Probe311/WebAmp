import { useState } from 'react'
import { AuthCard } from '../components/AuthCard'
import { LoginForm } from '../components/LoginForm'
import { AuthView } from '../types'
import { BrandSupportModal } from '../../components/BrandSupportModal'
import { BadgeCheck } from 'lucide-react'

interface Props {
  onSwitchView: (view: AuthView) => void
}

export function LoginPage({ onSwitchView }: Props) {
  const [showBrandModal, setShowBrandModal] = useState(false)

  return (
    <>
      <AuthCard
        title="Connexion"
        subtitle="Accède à ton pedalboard."
        footer={
          <div className="space-y-2">
            <p>Protège ton compte avec un mot de passe robuste pour éviter les mauvaises surprises.</p>
            <button
              type="button"
              onClick={() => setShowBrandModal(true)}
              className="flex items-center gap-2 text-xs font-medium transition-colors hover:opacity-80 text-black/60 dark:text-white/60 hover:text-emerald-600 dark:hover:text-emerald-400"
            >
              <BadgeCheck size={14} />
              Voir nos partenaires
            </button>
          </div>
        }
      >
        <LoginForm
          onForgotPassword={() => onSwitchView('forgot')}
          onSwitchSignup={() => onSwitchView('signup')}
        />
      </AuthCard>
      <BrandSupportModal
        isOpen={showBrandModal}
        onClose={() => setShowBrandModal(false)}
      />
    </>
  )
}

