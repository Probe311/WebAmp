import { FormEvent, useState } from 'react'
import { useAuth } from '../AuthProvider'
import { AuthField } from './AuthField'
import { CTA } from '../../components/CTA'

interface Props {
  onForgotPassword?: () => void
  onSwitchSignup?: () => void
  onSuccess?: () => void
}

export function LoginForm({ onForgotPassword, onSwitchSignup, onSuccess }: Props) {
  const { login, loading, authEnabled } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    try {
      if (!authEnabled) {
        setError('Authentification non configurée. Ajoute VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY dans frontend/.env.local.')
        return
      }
      await login(email.trim(), password)
      // Le onSuccess n'est plus nécessaire car AppWithAuth redirige automatiquement
      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Impossible de te connecter.')
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <AuthField
        label="Email"
        type="email"
        name="email"
        autoComplete="email"
        placeholder="ton@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <AuthField
        label="Mot de passe"
        type="password"
        name="password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        error={error || undefined}
      />

      <div className="flex items-center justify-between pt-1">
        <button
          type="button"
          onClick={onForgotPassword}
          className="text-sm font-medium transition-colors hover:opacity-80 text-black/60 dark:text-white/60"
        >
          Mot de passe oublié ?
        </button>
        <button
          type="button"
          onClick={onSwitchSignup}
          className="text-sm font-medium transition-colors hover:opacity-80 text-black/70 dark:text-white/70"
        >
          Créer un compte
        </button>
      </div>

      <CTA
        variant="important"
        disabled={loading || !authEnabled}
        className="w-full"
        type="submit"
        title={!authEnabled ? 'Configure les variables Supabase pour activer la connexion' : undefined}
      >
        {!authEnabled ? 'Auth non configurée' : loading ? 'Connexion...' : 'Se connecter'}
      </CTA>
    </form>
  )
}

