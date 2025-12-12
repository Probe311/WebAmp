import { FormEvent, useState } from 'react'
import { useAuth } from '../AuthProvider'
import { AuthField } from './AuthField'

interface Props {
  onBackToLogin?: () => void
}

export function ForgotPasswordForm({ onBackToLogin }: Props) {
  const { resetPassword, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

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
      />

      {message && (
        <p className="text-sm font-medium" style={{ color: 'rgba(34, 197, 94, 0.9)' }}>
          {message}
        </p>
      )}

      <div className="flex items-center justify-start pt-1">
        <button
          type="button"
          onClick={onBackToLogin}
          className="text-sm font-medium transition-colors hover:opacity-80"
          style={{ color: 'rgba(0, 0, 0, 0.7)' }}
        >
          Retour à la connexion
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
        {loading ? 'Envoi...' : 'Réinitialiser le mot de passe'}
      </button>
    </form>
  )
}

