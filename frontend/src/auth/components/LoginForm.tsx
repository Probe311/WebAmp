import { FormEvent, useState } from 'react'
import { useAuth } from '../AuthProvider'
import { AuthField } from './AuthField'
import { CTA } from '../../components/CTA'

interface Props {
  onForgotPassword?: () => void
  onSwitchSignup?: () => void
  onSuccess?: () => void
  /** `gate` = layout référence (forgot au-dessus du MDP, pas de liens bas). */
  layout?: 'default' | 'gate'
}

export function LoginForm({
  onForgotPassword,
  onSwitchSignup,
  onSuccess,
  layout = 'default',
}: Props) {
  const { login, loading, authEnabled } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const gate = layout === 'gate'

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    try {
      if (!authEnabled) {
        setError(
          'Authentification non configurée. Ajoute VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY dans frontend/.env.local.',
        )
        return
      }
      await login(email.trim(), password)
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
        className={gate ? 'rounded-[var(--neu-radius-control)]' : undefined}
      />

      {gate ? (
        <div className="space-y-1.5">
          <div className="flex items-end justify-between gap-3">
            <span className="block text-xs font-semibold uppercase tracking-[0.5px] text-[color:var(--neu-text-muted)]">
              Mot de passe
            </span>
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-xs font-semibold text-[color:var(--neu-accent)] transition-colors hover:text-[color:var(--neu-accent-hover)]"
            >
              Mot de passe oublié ?
            </button>
          </div>
          <AuthField
            label=""
            type="password"
            name="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            error={error || undefined}
            className="rounded-[var(--neu-radius-control)]"
          />
        </div>
      ) : (
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
      )}

      {!gate && (
        <div className="flex items-center justify-between pt-1">
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-sm font-medium text-[color:var(--neu-text-muted)] transition-colors hover:text-[color:var(--neu-accent)]"
          >
            Mot de passe oublié ?
          </button>
          <button
            type="button"
            onClick={onSwitchSignup}
            className="text-sm font-medium text-[color:var(--neu-text-muted)] transition-colors hover:text-[color:var(--neu-accent)]"
          >
            Créer un compte
          </button>
        </div>
      )}

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
