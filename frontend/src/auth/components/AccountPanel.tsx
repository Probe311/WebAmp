import { FormEvent, useMemo, useState, useEffect } from 'react'
import {
  Music,
  Radio,
  Waves,
  Guitar,
  Headphones,
  Piano,
  Drum,
  CassetteTape,
  Mic,
  Speaker,
  Trash2,
  Square,
  Zap,
  Award,
  Trophy,
  Medal
} from 'lucide-react'
import { useAuth } from '../AuthProvider'
import { evaluatePasswordStrength } from '../utils/passwordStrength'
import { AuthField } from './AuthField'
import { PasswordStrengthMeter } from './PasswordStrengthMeter'
import { LogoutButton } from './LogoutButton'
import { CTA } from '../../components/CTA'
import { Toggle } from '../../components/Toggle'
import { getPreference, setPreference } from '../../utils/userPreferences'
import { formatDateTimeFrench } from '../../utils/dateFormatter'
import { Modal } from '../../components/Modal'
import { useUserStats } from '../../hooks/useLMS'

// Fonction pour obtenir une couleur unique basée sur le nom du badge
function getBadgeColor(badgeName: string): string {
  // Palette de couleurs variées
  const colors = [
    'text-orange-500 dark:text-orange-400',
    'text-amber-500 dark:text-amber-400',
    'text-blue-500 dark:text-blue-400',
    'text-emerald-500 dark:text-emerald-400',
    'text-purple-500 dark:text-purple-400',
    'text-rose-500 dark:text-rose-400',
    'text-pink-500 dark:text-pink-400',
    'text-indigo-500 dark:text-indigo-400',
    'text-cyan-500 dark:text-cyan-400',
    'text-teal-500 dark:text-teal-400',
    'text-lime-500 dark:text-lime-400',
    'text-yellow-500 dark:text-yellow-400',
    'text-red-500 dark:text-red-400',
    'text-violet-500 dark:text-violet-400',
    'text-fuchsia-500 dark:text-fuchsia-400',
  ]

  // Hash simple basé sur le nom du badge pour obtenir un index déterministe
  let hash = 0
  for (let i = 0; i < badgeName.length; i++) {
    const char = badgeName.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convertir en entier 32 bits
  }

  // Utiliser la valeur absolue du hash pour obtenir un index positif
  const index = Math.abs(hash) % colors.length
  return colors[index]
}

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
  const [avatarStyle, setAvatarStyle] = useState<string>('avatar-1')
  const [instruments, setInstruments] = useState<string[]>([''])
  const [pedals, setPedals] = useState<string[]>([''])
  const [amplifiers, setAmplifiers] = useState<string[]>([''])
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'profile' | 'equipment' | 'achievements'>('profile')
  const { stats, loading: statsLoading } = useUserStats(user?.id)
  
  // Charger les métadonnées existantes
  useEffect(() => {
    if (user?.user_metadata) {
      const metadata = user.user_metadata as any
      setFirstName(metadata.first_name || '')
      setLastName(metadata.last_name || '')
      setBirthDate(metadata.birth_date || '')

      if (typeof metadata.showThankYouMessage === 'boolean') {
        setShowThankYouMessage(metadata.showThankYouMessage)
      }

      if (typeof metadata.avatarStyle === 'string') {
        setAvatarStyle(metadata.avatarStyle)
      }

      if (Array.isArray(metadata.instruments) && metadata.instruments.length > 0) {
        setInstruments(metadata.instruments)
      }

      if (Array.isArray(metadata.pedals) && metadata.pedals.length > 0) {
        setPedals(metadata.pedals)
      }

      if (Array.isArray(metadata.amplifiers) && metadata.amplifiers.length > 0) {
        setAmplifiers(metadata.amplifiers)
      }
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

  const avatarOptions = useMemo(() => {
    const baseIcons = [
      Music,
      Radio,
      Waves,
      Guitar,
      Headphones,
      Piano,
      Drum,
      CassetteTape,
      Mic,
      Speaker
    ]
    const colorClasses = [
      'bg-orange-500 text-white',
      'bg-blue-500 text-white',
      'bg-emerald-500 text-white',
      'bg-purple-500 text-white',
      'bg-rose-500 text-white',
      'bg-amber-500 text-white'
    ]

    // Combinaisons icône/couleur
    const combos: Array<{ id: string; label: string; Icon: any; colorClass: string }> = []
    baseIcons.forEach((Icon, iconIndex) => {
      colorClasses.forEach((colorClass, colorIndex) => {
        const index = iconIndex * colorClasses.length + colorIndex
        combos.push({
          id: `avatar-${index + 1}`,
          label: `Avatar ${index + 1}`,
          Icon,
          colorClass
        })
      })
    })

    // Mélange pseudo-aléatoire mais déterministe pour casser les motifs trop réguliers
    for (let i = combos.length - 1; i > 0; i--) {
      const j = (i * 13 + 7) % (i + 1)
      const tmp = combos[i]
      combos[i] = combos[j]
      combos[j] = tmp
    }

    // Garde les 30 premiers pour la grille
    return combos.slice(0, 30)
  }, [])

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

    const sanitizedInstruments = instruments.map(i => i.trim()).filter(Boolean)
    const sanitizedPedals = pedals.map(p => p.trim()).filter(Boolean)
    const sanitizedAmplifiers = amplifiers.map(a => a.trim()).filter(Boolean)

    try {
      await updateUserMetadata({
        first_name: firstName,
        last_name: lastName,
        birth_date: birthDate,
        full_name: firstName && lastName ? `${firstName} ${lastName}` : undefined,
        showThankYouMessage,
        avatarStyle,
        instruments: sanitizedInstruments,
        pedals: sanitizedPedals,
        amplifiers: sanitizedAmplifiers
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

      {/* Onglets de navigation du compte */}
      <div className="flex gap-3 pt-4 border-t border-black/10 dark:border-white/10">
        <CTA
          type="button"
          variant="secondary"
          active={activeTab === 'profile'}
          onClick={() => setActiveTab('profile')}
          className="flex-1"
        >
          Infos personnelles
        </CTA>
        <CTA
          type="button"
          variant="secondary"
          active={activeTab === 'equipment'}
          onClick={() => setActiveTab('equipment')}
          className="flex-1"
        >
          Mon équipement
        </CTA>
        <CTA
          type="button"
          variant="secondary"
          active={activeTab === 'achievements'}
          onClick={() => setActiveTab('achievements')}
          className="flex-1"
        >
          Mes succès
        </CTA>
      </div>

      {/* Onglet Infos personnelles */}
      {activeTab === 'profile' && (
        <>
        <form className="space-y-6 pt-4" onSubmit={handleProfileSubmit}>
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-black/85 dark:text-white/90 mb-4">
              Infos personnelles
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
          </div>

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
              onChange={async (checked: boolean) => {
                setShowThankYouMessage(checked)
                setPreference('showThankYouMessage', checked)
                try {
                  await updateUserMetadata({
                    showThankYouMessage: checked
                  })
                } catch {
                  // échec silencieux, la préférence locale reste appliquée
                }
              }}
              labelLeft="Off"
              labelRight="On"
              mode="onoff"
            />
          </div>
        </div>

        {/* Section Sécurité */}
        <form className="space-y-5 pt-6 border-t border-black/10 dark:border-white/10" onSubmit={handleSubmit}>
            <h2 className="text-lg font-bold text-black/85 dark:text-white/90 mb-2">
              Sécurité
            </h2>

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
        </>
      )}

      {/* Onglet Mon équipement */}
      {activeTab === 'equipment' && (
        <form className="space-y-6 pt-4" onSubmit={handleProfileSubmit}>
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-black/85 dark:text-white/90">
              Mon équipement
            </h2>
            <p className="text-xs text-black/70 dark:text-white/70">
              Renseigne ton setup pour adapter les cours et les presets à ton matériel.
            </p>
          </div>

          {/* Section Profil musical */}
          <div className="space-y-5 pt-6 border-t border-black/10 dark:border-white/10">
            <h2 className="text-lg font-bold text-black/85 dark:text-white/90 mb-2">
              Profil musical
            </h2>

          {/* Avatar musical */}
          <div className="p-4 bg-[#f5f5f5] dark:bg-gray-700/50 rounded-lg border border-black/10 dark:border-white/10">
            <p className="text-sm font-medium text-black/85 dark:text-white/85 mb-1">
              Avatar
            </p>
            <p className="text-xs text-black/70 dark:text-white/70 mb-3">
              Choisis un avatar illustré pour te représenter dans WebAmp.
            </p>
            <div className="flex items-center gap-4">
              {(() => {
                const current =
                  avatarOptions.find(option => option.id === avatarStyle) ?? avatarOptions[0]
                const Icon = current.Icon
                return (
                  <>
                    <div
                      className={`w-14 h-14 rounded-full flex items-center justify-center ${current.colorClass}`}
                    >
                      <Icon size={28} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-xs text-black/70 dark:text-white/70">
                        {current.label}
                      </p>
                      <CTA
                        type="button"
                        variant="secondary"
                        onClick={() => setIsAvatarModalOpen(true)}
                        className="px-3 py-1.5 text-xs w-fit"
                      >
                        Choisir un avatar
                      </CTA>
                    </div>
                  </>
                )
              })()}
            </div>
          </div>

          {/* Instruments */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Guitar size={18} className="text-black/70 dark:text-white/70" />
              <p className="text-sm font-medium text-black/85 dark:text-white/85">
                Instruments principaux
              </p>
            </div>
            <div className="space-y-2">
              {instruments.map((value, index) => (
                <div key={index} className="flex gap-2">
                  <AuthField
                    label={`Instrument ${index + 1}`}
                    type="text"
                    name={`instrument-${index}`}
                    value={value}
                    onChange={(e) => {
                      const next = [...instruments]
                      next[index] = e.target.value
                      setInstruments(next)
                    }}
                    className="text-sm flex-1"
                  />
                  <CTA
                    type="button"
                    variant="icon-only"
                    icon={<Trash2 size={16} />}
                    onClick={() => {
                      const next = instruments.filter((_, i) => i !== index)
                      setInstruments(next.length ? next : [''])
                    }}
                    className="self-end mb-1"
                    title="Retirer cet instrument"
                  />
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setInstruments([...instruments, ''])}
              className="text-xs font-medium text-orange-600 dark:text-orange-400 hover:underline"
            >
              + Ajouter un instrument
            </button>
          </div>

          {/* Pédales */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Square size={18} className="text-black/70 dark:text-white/70" />
              <p className="text-sm font-medium text-black/85 dark:text-white/85">
                Pédales préférées
              </p>
            </div>
            <div className="space-y-2">
              {pedals.map((value, index) => (
                <div key={index} className="flex gap-2">
                  <AuthField
                    label={`Pédale ${index + 1}`}
                    type="text"
                    name={`pedal-${index}`}
                    value={value}
                    onChange={(e) => {
                      const next = [...pedals]
                      next[index] = e.target.value
                      setPedals(next)
                    }}
                    className="text-sm flex-1"
                  />
                  <CTA
                    type="button"
                    variant="icon-only"
                    icon={<Trash2 size={16} />}
                    onClick={() => {
                      const next = pedals.filter((_, i) => i !== index)
                      setPedals(next.length ? next : [''])
                    }}
                    className="self-end mb-1"
                    title="Retirer cette pédale"
                  />
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setPedals([...pedals, ''])}
              className="text-xs font-medium text-orange-600 dark:text-orange-400 hover:underline"
            >
              + Ajouter une pédale
            </button>
          </div>

          {/* Amplis */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Zap size={18} className="text-black/70 dark:text-white/70" />
              <p className="text-sm font-medium text-black/85 dark:text-white/85">
                Amplis favoris
              </p>
            </div>
            <div className="space-y-2">
              {amplifiers.map((value, index) => (
                <div key={index} className="flex gap-2">
                  <AuthField
                    label={`Ampli ${index + 1}`}
                    type="text"
                    name={`amplifier-${index}`}
                    value={value}
                    onChange={(e) => {
                      const next = [...amplifiers]
                      next[index] = e.target.value
                      setAmplifiers(next)
                    }}
                    className="text-sm flex-1"
                  />
                  <CTA
                    type="button"
                    variant="icon-only"
                    icon={<Trash2 size={16} />}
                    onClick={() => {
                      const next = amplifiers.filter((_, i) => i !== index)
                      setAmplifiers(next.length ? next : [''])
                    }}
                    className="self-end mb-1"
                    title="Retirer cet ampli"
                  />
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setAmplifiers([...amplifiers, ''])}
              className="text-xs font-medium text-orange-600 dark:text-orange-400 hover:underline"
            >
              + Ajouter un ampli
            </button>
          </div>
        </div>

        {/* Bouton de sauvegarde équipement */}
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
          {loading ? 'Mise à jour...' : 'Mettre à jour mon équipement'}
        </CTA>
      </form>
      )}

      {/* Onglet Mes succès (gamification) */}
      {activeTab === 'achievements' && (
        <div className="space-y-5 pt-4">
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-black/85 dark:text-white/90">
              Mes succès
            </h2>
            <p className="text-xs text-black/70 dark:text-white/70">
              Suis ta progression, ton XP et tes badges gagnés grâce aux cours WebAmp.
            </p>
          </div>

          {/* Statistiques principales */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-[#f5f5f5] dark:bg-gray-700/60 border border-black/10 dark:border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <Award className="text-orange-500 dark:text-orange-400" size={18} />
                <p className="text-xs font-semibold text-black/60 dark:text-white/60 uppercase">
                  XP total
                </p>
              </div>
              <p className="text-2xl font-bold text-orange-500 dark:text-orange-400">
                {statsLoading || !stats ? '—' : stats.total_xp}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#f5f5f5] dark:bg-gray-700/60 border border-black/10 dark:border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="text-emerald-500 dark:text-emerald-400" size={18} />
                <p className="text-xs font-semibold text-black/60 dark:text-white/60 uppercase">
                  Cours terminés
                </p>
              </div>
              <p className="text-2xl font-bold text-emerald-500 dark:text-emerald-400">
                {statsLoading || !stats ? '—' : stats.courses_completed}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#f5f5f5] dark:bg-gray-700/60 border border-black/10 dark:border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <Medal className="text-blue-500 dark:text-blue-400" size={18} />
                <p className="text-xs font-semibold text-black/60 dark:text-white/60 uppercase">
                  Leçons complétées
                </p>
              </div>
              <p className="text-2xl font-bold text-blue-500 dark:text-blue-400">
                {statsLoading || !stats ? '—' : stats.lessons_completed}
              </p>
            </div>
          </div>

          {/* Grille de badges avec médailles */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Medal size={18} className="text-black/70 dark:text-white/70" />
              <p className="text-sm font-medium text-black/85 dark:text-white/85">
                Badges débloqués
              </p>
            </div>
            {statsLoading && (
              <p className="text-xs text-black/60 dark:text-white/60">
                Chargement des succès...
              </p>
            )}
            {!statsLoading && stats && (!stats.badges || stats.badges.length === 0) && (
              <div className="p-6 rounded-xl bg-[#f5f5f5] dark:bg-gray-700/30 border border-black/10 dark:border-white/10 text-center">
                <Medal size={32} className="mx-auto mb-2 text-black/30 dark:text-white/30" />
                <p className="text-xs text-black/60 dark:text-white/60">
                  Aucun badge pour l'instant. Termine des cours et des leçons pour en débloquer !
                </p>
              </div>
            )}
            {!statsLoading && stats && stats.badges && stats.badges.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {stats.badges.map((badge: string) => (
                  <div
                    key={badge}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[#f5f5f5] dark:bg-gray-700/60 border border-black/10 dark:border-white/10 hover:border-orange-500/50 dark:hover:border-orange-500/50 transition"
                  >
                    <div className="relative">
                      <Medal
                        size={32}
                        className={getBadgeColor(badge)}
                      />
                    </div>
                    <p className="text-xs font-medium text-center text-black/85 dark:text-white/85">
                      {badge}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modale de sélection d'avatar */}
      <Modal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        title="Choisir un avatar"
        widthClassName="max-w-2xl"
        bodyClassName="p-6"
      >
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-4">
          {avatarOptions.map(option => {
            const Icon = option.Icon
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => {
                  setAvatarStyle(option.id)
                  setIsAvatarModalOpen(false)
                }}
                className={`flex flex-col items-center gap-2 p-2 rounded-xl border transition ${
                  avatarStyle === option.id
                    ? 'border-orange-500 bg-orange-500/10'
                    : 'border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10'
                }`}
              >
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center ${option.colorClass}`}
                >
                  <Icon size={28} />
                </div>
              </button>
            )
          })}
        </div>
      </Modal>
    </div>
  )
}

