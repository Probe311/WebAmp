import { AuthCard } from '../components/AuthCard'
import { SignupForm } from '../components/SignupForm'
import { AuthView } from '../types'

interface Props {
  onSwitchView: (view: AuthView) => void
}

export function SignupPage({ onSwitchView }: Props) {
  return (
    <AuthCard
      title="Créer un compte"
      subtitle="Synchronise tes sessions."
      showLogo
      footer="Astuce : un mot de passe > 12 caractères avec lettres, chiffres et symboles est recommandé."
    >
      <SignupForm
        onSwitchLogin={() => onSwitchView('login')}
        onSuccess={() => {
          // Ne rien faire - AppWithAuth redirigera automatiquement si l'utilisateur est connecté
        }}
        onEmailSent={() => {
          // Après l'envoi de l'email de confirmation, rediriger vers login
          onSwitchView('login')
        }}
      />
    </AuthCard>
  )
}

