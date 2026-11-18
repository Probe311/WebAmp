import { FormEvent, useState } from 'react'
import { useAuth } from '../AuthProvider'
import { AuthField } from './AuthField'
import { CTA } from '../../components/CTA'

interface Props {
  onBackToLogin?: () => void
  layout?: 'default' | 'gate'
}

export function ForgotPasswordForm({ onBackToLogin, layout = 'default' }: Props) {
  const { resetPassword, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const gate = layout === 'gate'

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage(null)
    setError(null)
    try {
      await resetPassword(email.trim())
      setMessage('Un e-mail de réinitialisation vient de t\'être envoyé.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Impossible d\'envoyer l\'e-mail.')
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
        error={error || undefined}
        className={gate ? 'rounded-[var(--neu-radius-control)]' : undefined}
      />

      {message && (
        <p className="text-sm font-medium text-[color:var(--td-success)]">
          {message}
        </p>
      )}

      <div className="flex items-center justify-start pt-1">
        <button
          type="button"
          onClick={onBackToLogin}
          className="text-sm font-medium text-[color:var(--neu-text-muted)] transition-colors hover:text-[color:var(--neu-accent)]"
        >
          Retour à la connexion
        </button>
      </div>

      <CTA
        variant="important"
        disabled={loading}
        className="w-full"
        type="submit"
      >
        {loading ? 'Envoi...' : 'Réinitialiser le mot de passe'}
      </CTA>
    </form>
  )
}

