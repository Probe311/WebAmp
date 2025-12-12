import { FormEvent, useMemo, useState } from 'react'
import { useAuth } from '../AuthProvider'
import { evaluatePasswordStrength } from '../utils/passwordStrength'
import { AuthField } from './AuthField'
import { PasswordStrengthMeter } from './PasswordStrengthMeter'
import { LogoutButton } from './LogoutButton'

export function AccountPanel() {
  const { user, updatePassword, loading } = useAuth()
  const [newPassword, setNewPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const strength = useMemo(() => evaluatePasswordStrength(newPassword), [newPassword])

  if (!user) {
    return (
      <div className="space-y-4">
        <p className="text-sm" style={{ color: 'rgba(0, 0, 0, 0.7)' }}>
          Connecte-toi pour accéder à ton compte.
        </p>
      </div>
    )
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage(null)
    setError(null)

    if (newPassword !== confirm) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }

    if (strength.score < 70) {
      setError('Choisis un mot de passe plus robuste (score minimum 70).')
      return
    }

    try {
      await updatePassword(newPassword)
      setMessage('Mot de passe mis à jour.')
      setNewPassword('')
      setConfirm('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Impossible de mettre à jour le mot de passe.')
    }
  }

  return (
    <div className="space-y-6">
      <div 
        className="rounded-xl px-4 py-3"
        style={{
          backgroundColor: '#f5f5f5',
          boxShadow: 'inset 2px 2px 4px rgba(0, 0, 0, 0.05), inset -2px -2px 4px rgba(255, 255, 255, 0.8)'
        }}
      >
        <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'rgba(0, 0, 0, 0.7)', letterSpacing: '0.5px' }}>
          Connecté en tant que
        </p>
        <p className="text-base font-semibold" style={{ color: 'rgba(0, 0, 0, 0.85)' }}>
          {user.email}
        </p>
        {user.last_sign_in_at && (
          <p className="text-xs mt-2" style={{ color: 'rgba(0, 0, 0, 0.5)' }}>
            Dernière connexion : {new Date(user.last_sign_in_at).toLocaleString('fr-FR')}
          </p>
        )}
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <AuthField
          label="Nouveau mot de passe"
          type="password"
          name="new-password"
          autoComplete="new-password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />

        <PasswordStrengthMeter password={newPassword} />

        <AuthField
          label="Confirmation"
          type="password"
          name="new-password-confirm"
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          error={error || undefined}
        />

        {message && (
          <p className="text-sm font-medium" style={{ color: 'rgba(34, 197, 94, 0.9)' }}>
            {message}
          </p>
        )}

        <div className="flex flex-col gap-3 pt-1">
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
            {loading ? 'Mise à jour...' : 'Mettre à jour le mot de passe'}
          </button>
          <LogoutButton />
        </div>
      </form>
    </div>
  )
}

