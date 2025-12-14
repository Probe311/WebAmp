import { FormEvent, useMemo, useState, useEffect } from 'react'
import { useAuth } from '../AuthProvider'
import { evaluatePasswordStrength } from '../utils/passwordStrength'
import { AuthField } from './AuthField'
import { PasswordStrengthMeter } from './PasswordStrengthMeter'
import { LogoutButton } from './LogoutButton'
import { CTA } from '../../components/CTA'
import { Toggle } from '../../components/Toggle'
import { getPreference, setPreference } from '../../utils/userPreferences'
import { formatDateTimeFrench } from '../../utils/dateFormatter'

export function AccountPanel() {
  const { user, updatePassword, updateUserMetadata, loading } = useAuth()
  const [newPassword, setNewPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  // Champs de profil
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [profileMessage, setProfileMessage] = useState<string | null>(null)
  const [profileError, setProfileError] = useState<string | null>(null)
  
  // Préférences
  const [showThankYouMessage, setShowThankYouMessage] = useState(true)
  
  // Charger les métadonnées existantes
  useEffect(() => {
    if (user?.user_metadata) {
      setFirstName(user.user_metadata.first_name || '')
      setLastName(user.user_metadata.last_name || '')
      setBirthDate(user.user_metadata.birth_date || '')
    }
  }, [user])
  
  // Charger les préférences utilisateur
  useEffect(() => {
    if (user) {
      const preference = getPreference('showThankYouMessage')
      setShowThankYouMessage(preference)
    }
  }, [user])

  const strength = useMemo(() => evaluatePasswordStrength(newPassword), [newPassword])

  if (!user) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-black/70 dark:text-white/70">
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

  const handleProfileSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setProfileMessage(null)
    setProfileError(null)

    try {
      await updateUserMetadata({
        first_name: firstName,
        last_name: lastName,
        birth_date: birthDate,
        full_name: firstName && lastName ? `${firstName} ${lastName}` : undefined
      })
      setProfileMessage('Profil mis à jour.')
    } catch (err) {
      setProfileError(err instanceof Error ? err.message : 'Impossible de mettre à jour le profil.')
    }
  }

  return (
    <div className="space-y-6">
      <div 
        className="rounded-xl px-4 py-3 bg-[#f5f5f5] dark:bg-gray-700"
        style={{
          boxShadow: document.documentElement.classList.contains('dark')
            ? 'inset 2px 2px 4px rgba(0, 0, 0, 0.5), inset -2px -2px 4px rgba(60, 60, 60, 0.5)'
            : 'inset 2px 2px 4px rgba(0, 0, 0, 0.05), inset -2px -2px 4px rgba(255, 255, 255, 0.8)'
        }}
      >
        <p className="text-xs font-semibold uppercase tracking-wider mb-1 text-black/70 dark:text-white/70" style={{ letterSpacing: '0.5px' }}>
          Connecté en tant que
        </p>
        <p className="text-base font-semibold text-black/85 dark:text-white/90">
          {user.email}
        </p>
        {user.last_sign_in_at && (
          <p className="text-xs mt-2 text-black/50 dark:text-white/50">
            Dernière connexion : {formatDateTimeFrench(user.last_sign_in_at)}
          </p>
        )}
      </div>

      {/* Formulaire de profil */}
      <form className="space-y-5" onSubmit={handleProfileSubmit}>
        <h2 className="text-lg font-bold text-black/85 dark:text-white/90 mb-4">
          Informations personnelles
        </h2>
        
        <AuthField
          label="Prénom"
          type="text"
          name="first-name"
          autoComplete="given-name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />

        <AuthField
          label="Nom"
          type="text"
          name="last-name"
          autoComplete="family-name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />

        <AuthField
          label="Date de naissance"
          type="date"
          name="birth-date"
          autoComplete="bday"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
        />

        {profileMessage && (
          <p className="text-sm font-medium text-green-600 dark:text-green-400">
            {profileMessage}
          </p>
        )}

        {profileError && (
          <p className="text-sm font-medium text-red-500 dark:text-red-400">
            {profileError}
          </p>
        )}

        <CTA
          type="submit"
          variant="primary"
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Mise à jour...' : 'Mettre à jour le profil'}
        </CTA>
      </form>

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
          <p className="text-sm font-medium text-green-600 dark:text-green-400">
            {message}
          </p>
        )}

        <div className="flex flex-col gap-3 pt-1">
          <CTA
            type="submit"
            variant="primary"
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Mise à jour...' : 'Mettre à jour le mot de passe'}
          </CTA>
          <LogoutButton />
        </div>
      </form>

      {/* Section Préférences */}
      <div className="space-y-5 pt-6 border-t border-black/10 dark:border-white/10">
        <h2 className="text-lg font-bold text-black/85 dark:text-white/90 mb-4">
          Préférences
        </h2>
        
        <div className="flex items-center justify-between p-4 bg-[#f5f5f5] dark:bg-gray-700/50 rounded-lg border border-black/10 dark:border-white/10">
          <div className="flex-1">
            <p className="text-sm font-medium text-black/85 dark:text-white/85 mb-1">
              Afficher le message de remerciement
            </p>
            <p className="text-xs text-black/70 dark:text-white/70">
              Affiche la modale de remerciement aux partenaires lors de la connexion
            </p>
          </div>
          <Toggle
            checked={showThankYouMessage}
            onChange={(checked: boolean) => {
              setShowThankYouMessage(checked)
              setPreference('showThankYouMessage', checked)
            }}
            labelLeft="Off"
            labelRight="On"
            mode="onoff"
          />
        </div>
      </div>
    </div>
  )
}

