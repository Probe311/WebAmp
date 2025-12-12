import { FormEvent, useMemo, useState } from 'react'
import { useAuth } from '../AuthProvider'
import { AuthField } from './AuthField'
import { PasswordStrengthMeter } from './PasswordStrengthMeter'
import { evaluatePasswordStrength } from '../utils/passwordStrength'

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
          className="text-sm font-medium transition-colors hover:opacity-80"
          style={{ color: 'rgba(0, 0, 0, 0.7)' }}
        >
          Déjà un compte ?
        </button>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-xl font-semibold text-white transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
        style={{
          background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.8) 100%)',
          boxShadow: loading
            ? 'inset 2px 2px 4px rgba(0, 0, 0, 0.3), inset -2px -2px 4px rgba(255, 255, 255, 0.1)'
            : '2px 2px 4px rgba(0, 0, 0, 0.2), -2px -2px 4px rgba(255, 255, 255, 0.1)',
          transform: loading ? 'scale(0.98)' : 'scale(1)'
        }}
        onMouseDown={(e) => {
          if (!loading) {
            e.currentTarget.style.transform = 'scale(0.98)'
            e.currentTarget.style.boxShadow = 'inset 2px 2px 4px rgba(0, 0, 0, 0.3), inset -2px -2px 4px rgba(255, 255, 255, 0.1)'
          }
        }}
        onMouseUp={(e) => {
          if (!loading) {
            e.currentTarget.style.transform = 'scale(1)'
            e.currentTarget.style.boxShadow = '2px 2px 4px rgba(0, 0, 0, 0.2), -2px -2px 4px rgba(255, 255, 255, 0.1)'
          }
        }}
        onMouseLeave={(e) => {
          if (!loading) {
            e.currentTarget.style.transform = 'scale(1)'
            e.currentTarget.style.boxShadow = '2px 2px 4px rgba(0, 0, 0, 0.2), -2px -2px 4px rgba(255, 255, 255, 0.1)'
          }
        }}
      >
        {loading ? 'Création en cours...' : 'Créer mon compte'}
      </button>
    </form>
  )
}

