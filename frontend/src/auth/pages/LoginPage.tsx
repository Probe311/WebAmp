import { AuthCard } from '../components/AuthCard'
import { LoginForm } from '../components/LoginForm'
import { AuthView } from '../types'

interface Props {
  onSwitchView: (view: AuthView) => void
}

export function LoginPage({ onSwitchView }: Props) {
  return (
    <AuthCard
      title="Connexion"
      subtitle="Accède à ton pedalboard."
      footer="Protège ton compte avec un mot de passe robuste pour éviter les mauvaises surprises."
    >
      <LoginForm
        onForgotPassword={() => onSwitchView('forgot')}
        onSwitchSignup={() => onSwitchView('signup')}
      />
    </AuthCard>
  )
}

