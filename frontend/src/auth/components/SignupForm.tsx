import { FormEvent, useMemo, useState } from 'react'
import { useAuth } from '../AuthProvider'
import { AuthField } from './AuthField'
import { PasswordStrengthMeter } from './PasswordStrengthMeter'
import { evaluatePasswordStrength } from '../utils/passwordStrength'
import { CTA } from '../../components/CTA'

interface Props {
  onSwitchLogin?: () => void
  onSuccess?: () => void
  onEmailSent?: () => void
}

export function SignupForm({ onSwitchLogin, onSuccess, onEmailSent }: Props) {
  const { signUp, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)

  const strength = useMemo(() => evaluatePasswordStrength(password), [password])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    if (password !== confirm) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }

    if (strength.score < 70) {
      setError('Choisis un mot de passe plus robuste (score minimum 70).')
      return
    }

    try {
      const isImmediatelyLoggedIn = await signUp(email.trim(), password)
      if (isImmediatelyLoggedIn) {
        // Utilisateur connecté immédiatement
        onSuccess?.()
      } else {
        // Email de confirmation envoyé, rediriger vers login
        onEmailSent?.()
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Impossible de créer le compte.'
      setError(errorMsg.includes('API key') || errorMsg.includes('Invalid')
        ? 'Configuration incorrecte. Contacte le support.'
        : errorMsg)
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
        autoComplete="new-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <PasswordStrengthMeter password={password} />

      <AuthField
        label="Confirmation"
        type="password"
        name="password-confirm"
        autoComplete="new-password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        required
        error={error || undefined}
      />

      <div className="flex items-center justify-start pt-1">
        <button
          type="button"
          onClick={onSwitchLogin}
          className="text-sm font-medium transition-colors hover:opacity-80 text-black/70 dark:text-white/70"
        >
          Déjà un compte ?
        </button>
      </div>

      <CTA
        variant="important"
        disabled={loading}
        className="w-full"
        type="submit"
      >
        {loading ? 'Création en cours...' : 'Créer mon compte'}
      </CTA>
    </form>
  )
}

