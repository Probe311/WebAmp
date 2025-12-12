import { AuthCard } from '../components/AuthCard'
import { ForgotPasswordForm } from '../components/ForgotPasswordForm'
import { AuthView } from '../types'

interface Props {
  onSwitchView: (view: AuthView) => void
}

export function ForgotPasswordPage({ onSwitchView }: Props) {
  return (
    <AuthCard
      title="Mot de passe oublié"
      subtitle="Renseigne ton email pour recevoir un lien de réinitialisation."
      footer="Pense à vérifier tes spams si tu ne reçois rien."
    >
      <ForgotPasswordForm onBackToLogin={() => onSwitchView('login')} />
    </AuthCard>
  )
}

