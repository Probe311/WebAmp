import { useState } from 'react'
import type { AuthView } from '../types'
import { AuthCard } from './AuthCard'
import { LoginForm } from './LoginForm'
import { SignupForm } from './SignupForm'
import { ForgotPasswordForm } from './ForgotPasswordForm'

const TITLES: Record<Exclude<AuthView, 'account'>, { title: string; subtitle: string }> = {
  login: { title: 'Connexion', subtitle: 'Accède à WebAmp.' },
  signup: { title: 'Créer un compte', subtitle: 'Sauvegarde presets, progression et préférences.' },
  forgot: { title: 'Mot de passe oublié', subtitle: 'On t’envoie un lien de réinitialisation.' },
}

interface Props {
  initialView?: Exclude<AuthView, 'account'>
  onAuthenticated?: () => void
}

/** Formulaires auth pour un compte non connecté (fenêtre Compte / deep-link LP). */
export function GuestAuthPanel({ initialView = 'login', onAuthenticated }: Props) {
  const [view, setView] = useState<Exclude<AuthView, 'account'>>(initialView)
  const meta = TITLES[view]

  return (
    <AuthCard title={meta.title} subtitle={meta.subtitle} showLogo={false}>
      {view === 'login' && (
        <LoginForm
          onForgotPassword={() => setView('forgot')}
          onSwitchSignup={() => setView('signup')}
          onSuccess={onAuthenticated}
        />
      )}
      {view === 'signup' && (
        <SignupForm
          onSwitchLogin={() => setView('login')}
          onSuccess={onAuthenticated}
          onEmailSent={() => setView('login')}
        />
      )}
      {view === 'forgot' && <ForgotPasswordForm onBackToLogin={() => setView('login')} />}
    </AuthCard>
  )
}
