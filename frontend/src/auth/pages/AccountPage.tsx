import { AuthCard } from '../components/AuthCard'
import { AccountPanel } from '../components/AccountPanel'
import { AuthView } from '../types'

interface Props {
  onSwitchView?: (view: AuthView) => void
}

export function AccountPage({ onSwitchView }: Props) {
  return (
    <AuthCard
      title="Mon compte"
      subtitle="Gère ton mot de passe et déconnecte-toi en un clic."
      footer={
        <div className="flex items-center justify-between">
          <span className="text-[color:var(--neu-text-muted)]">Besoin de changer de compte ?</span>
          {onSwitchView && (
            <button
              type="button"
              onClick={() => onSwitchView('login')}
              className="text-sm font-medium text-[color:var(--neu-text-muted)] transition-colors hover:text-[color:var(--neu-accent)]"
            >
              Revenir à la connexion
            </button>
          )}
        </div>
      }
    >
      <AccountPanel />
    </AuthCard>
  )
}
