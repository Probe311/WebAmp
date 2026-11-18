import { useState, useEffect, useCallback } from 'react'
import { Mic, Monitor, Moon, Sun, Keyboard } from 'lucide-react'
import { Dropdown, DropdownOption } from './Dropdown'
import { CTA } from './CTA'
import { useTheme } from '../contexts/ThemeContext'
import { KeyboardShortcutsConfig } from './KeyboardShortcutsConfig'
import { Switch } from './Switch'
import { getUserPreferences, saveUserPreferences } from '../utils/userPreferences'

interface SettingsPanelProps {
  onClose?: () => void
}

export function SettingsPanel({ onClose }: SettingsPanelProps) {
  const { theme, setTheme } = useTheme()
  const prefs = getUserPreferences()
  const [audioDevice, setAudioDevice] = useState(prefs.audioDeviceId)
  const [sampleRate, setSampleRate] = useState(String(prefs.sampleRate))
  const [bufferSize, setBufferSize] = useState(String(prefs.bufferSize))
  const [deviceOptions, setDeviceOptions] = useState<DropdownOption[]>([
    { value: 'default', label: 'Périphérique par défaut', icon: <Monitor size={16} /> },
  ])
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false)
  const [showThankYouMessage, setShowThankYouMessage] = useState(prefs.showThankYouMessage)
  const [savedHint, setSavedHint] = useState<string | null>(null)
  const sampleRateNeedsReload = Number(sampleRate) !== prefs.sampleRate

  const loadDevices = useCallback(async () => {
    if (!navigator.mediaDevices?.enumerateDevices) return
    try {
      // Permission pour obtenir les labels
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        stream.getTracks().forEach((t) => t.stop())
      } catch {
        /* ignore */
      }
      const devices = await navigator.mediaDevices.enumerateDevices()
      const inputs = devices.filter((d) => d.kind === 'audioinput')
      setDeviceOptions([
        { value: 'default', label: 'Périphérique par défaut', icon: <Monitor size={16} /> },
        ...inputs.map((d) => ({
          value: d.deviceId,
          label: d.label || `Micro ${d.deviceId.slice(0, 8)}`,
          icon: <Mic size={16} />,
        })),
      ])
    } catch {
      /* ignore */
    }
  }, [])

  useEffect(() => {
    void loadDevices()
  }, [loadDevices])

  const sampleRateOptions: DropdownOption[] = [
    { value: '44100', label: '44.1 kHz' },
    { value: '48000', label: '48 kHz' },
    { value: '96000', label: '96 kHz' },
  ]

  const bufferSizeOptions: DropdownOption[] = [
    { value: '64', label: '64 samples' },
    { value: '128', label: '128 samples' },
    { value: '256', label: '256 samples' },
    { value: '512', label: '512 samples' },
  ]

  const handleSave = () => {
    saveUserPreferences({
      audioDeviceId: audioDevice,
      sampleRate: Number(sampleRate),
      bufferSize: Number(bufferSize),
      showThankYouMessage,
    })
    setSavedHint(
      'Préférences enregistrées. Sample rate appliqué au prochain démarrage audio (bouton ci-dessous si l’audio tourne déjà).'
    )
    onClose?.()
  }

  // Seul moyen réel : le moteur partagé lit la pref à sa création.
  const handleApplySampleRate = () => {
    saveUserPreferences({ sampleRate: Number(sampleRate), bufferSize: Number(bufferSize) })
    window.location.reload()
  }

  return (
    <div className="space-y-6">
      <section>
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-[color:var(--neu-text)]">
          <Mic size={20} className="text-[color:var(--neu-text-muted)]" />
          Configuration Audio
        </h3>
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-[color:var(--neu-text-muted)]">
              Entrée micro (navigateur)
            </label>
            <Dropdown
              options={deviceOptions}
              value={audioDevice}
              onChange={(value) => setAudioDevice(value)}
            />
            <p className="mt-2 text-xs text-[color:var(--neu-text-faint)]">
              ASIO / WASAPI exclusif : lancez le Native Helper.
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[color:var(--neu-text-muted)]">
              Fréquence d&apos;échantillonnage
            </label>
            <Dropdown
              options={sampleRateOptions}
              value={sampleRate}
              onChange={(value) => setSampleRate(value)}
            />
            <p className="mt-2 text-xs text-[color:var(--neu-text-faint)]">
              Lu au démarrage du moteur audio : un redémarrage est requis pour l’appliquer.
            </p>
            {sampleRateNeedsReload && (
              <CTA variant="secondary" onClick={handleApplySampleRate} className="mt-2 w-full">
                Appliquer et recharger l’audio
              </CTA>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[color:var(--neu-text-muted)]">
              Taille du buffer
            </label>
            <Dropdown
              options={bufferSizeOptions}
              value={bufferSize}
              onChange={(value) => setBufferSize(value)}
            />
            <p className="mt-2 text-xs text-[color:var(--neu-text-faint)]">
              Buffer : Native Helper uniquement (pas appliqué à chaud par le navigateur). Plus petit = moins de latence.
            </p>
          </div>
          {savedHint && (
            <p className="text-xs text-[color:var(--neu-accent)]">{savedHint}</p>
          )}
        </div>
      </section>

      <section>
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-[color:var(--neu-text)]">
          <Monitor size={20} className="text-[color:var(--neu-text-muted)]" />
          Interface
        </h3>
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-[color:var(--neu-text-muted)]">
              Thème
            </label>
            <div className="flex gap-2">
              <CTA
                variant="secondary"
                icon={<Sun size={18} />}
                onClick={() => setTheme('light')}
                active={theme === 'light'}
                className="flex-1"
              >
                Clair
              </CTA>
              <CTA
                variant="secondary"
                icon={<Moon size={18} />}
                onClick={() => setTheme('dark')}
                active={theme === 'dark'}
                className="flex-1"
              >
                Sombre
              </CTA>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[color:var(--neu-text-muted)]">
              Raccourcis clavier
            </label>
            <CTA
              variant="secondary"
              icon={<Keyboard size={18} />}
              onClick={() => setShowKeyboardShortcuts(true)}
              className="w-full"
            >
              Configurer les raccourcis
            </CTA>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex-1">
              <label className="mb-1 block text-sm font-medium text-[color:var(--neu-text-muted)]">
                Message de remerciements
              </label>
              <p className="text-xs text-[color:var(--neu-text-faint)]">
                Afficher le message de remerciements à la connexion
              </p>
            </div>
            <Switch
              label=""
              checked={showThankYouMessage}
              onChange={(checked) => {
                setShowThankYouMessage(checked)
                saveUserPreferences({ showThankYouMessage: checked })
              }}
            />
          </div>
        </div>
      </section>

      <KeyboardShortcutsConfig
        isOpen={showKeyboardShortcuts}
        onClose={() => setShowKeyboardShortcuts(false)}
      />

      <div className="flex gap-3 border-t border-black/10 pt-4 dark:border-white/10">
        <CTA variant="primary" onClick={handleSave} className="flex-1">
          Enregistrer
        </CTA>
        <CTA variant="secondary" onClick={onClose} className="flex-1">
          Annuler
        </CTA>
      </div>
    </div>
  )
}
