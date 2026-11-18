import { useState } from 'react'
import { LoginForm } from '../components/LoginForm'
import { SignupForm } from '../components/SignupForm'
import { ForgotPasswordForm } from '../components/ForgotPasswordForm'
import { AuthMusicScene } from '../components/AuthMusicScene'
import type { AuthView } from '../types'

type GateView = Exclude<AuthView, 'account'>

interface Props {
  initialView?: GateView
  onAuthenticated: () => void
}

const COPY: Record<GateView, { title: string; switchLabel?: string; switchAction?: GateView }> = {
  login: {
    title: 'Connexion à webamp.',
    switchLabel: 'Créer un compte',
    switchAction: 'signup',
  },
  signup: {
    title: 'Créer un compte webamp.',
    switchLabel: 'Se connecter',
    switchAction: 'login',
  },
  forgot: {
    title: 'Réinitialiser le mot de passe.',
  },
}

/**
 * Porte d’entrée plein écran — aucun chrome app (dock / workspace).
 * Layout type référence (carte à droite + scène thématique).
 */
export function AuthGate({ initialView = 'login', onAuthenticated }: Props) {
  const [view, setView] = useState<GateView>(initialView)
  const copy = COPY[view]

  return (
    <div className="neu-bg relative flex min-h-screen w-full flex-col overflow-hidden">
      <AuthMusicScene />

      <header className="relative z-10 flex items-center px-6 py-5 sm:px-10">
        <p
          className="hello-write select-none text-2xl lowercase leading-none text-[color:var(--neu-accent)]"
          aria-label="webamp"
        >
          <span className="hello-write__ink" aria-hidden>
            webamp
          </span>
        </p>
      </header>

      <main className="relative z-10 flex flex-1 items-center justify-center px-4 pb-10 sm:justify-end sm:px-10 lg:px-16 xl:px-24">
        <div className="w-full max-w-[420px]">
          <div className="neu-flat-lg space-y-7 rounded-[var(--neu-radius-card)] bg-[color:var(--neu-bg)] p-8 sm:p-10">
            <header className="space-y-2">
              <h1 className="text-[1.65rem] font-semibold leading-tight tracking-tight text-[color:var(--neu-text)] sm:text-[1.85rem]">
                {copy.title}
              </h1>
              {copy.switchAction && copy.switchLabel && (
                <p className="text-sm text-[color:var(--neu-text-muted)]">
                  {view === 'login' ? 'Nouveau ?' : 'Déjà un compte ?'}{' '}
                  <button
                    type="button"
                    onClick={() => setView(copy.switchAction!)}
                    className="font-semibold text-[color:var(--neu-accent)] transition-colors hover:text-[color:var(--neu-accent-hover)]"
                  >
                    {copy.switchLabel}
                  </button>
                </p>
              )}
              {view === 'forgot' && (
                <p className="text-sm text-[color:var(--neu-text-muted)]">
                  On t’envoie un lien pour choisir un nouveau mot de passe.
                </p>
              )}
            </header>

            {view === 'login' && (
              <LoginForm
                layout="gate"
                onForgotPassword={() => setView('forgot')}
                onSwitchSignup={() => setView('signup')}
                onSuccess={onAuthenticated}
              />
            )}
            {view === 'signup' && (
              <SignupForm
                layout="gate"
                onSwitchLogin={() => setView('login')}
                onSuccess={onAuthenticated}
                onEmailSent={() => setView('login')}
              />
            )}
            {view === 'forgot' && (
              <ForgotPasswordForm layout="gate" onBackToLogin={() => setView('login')} />
            )}
          </div>

          <p className="mt-6 text-center text-xs text-[color:var(--neu-text-faint)] sm:text-left">
            Amplis, pédales et studio — dans ton navigateur.
          </p>
        </div>
      </main>
    </div>
  )
}
