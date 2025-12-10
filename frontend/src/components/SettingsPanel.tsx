import { useState } from 'react'
import { Volume2, Mic, Headphones, Monitor, Globe, Moon, Sun, Keyboard } from 'lucide-react'
import { Dropdown, DropdownOption } from './Dropdown'
import { CTA } from './CTA'
import { useTheme } from '../contexts/ThemeContext'
import { KeyboardShortcutsConfig } from './KeyboardShortcutsConfig'

interface SettingsPanelProps {
  onClose?: () => void
}

export function SettingsPanel({ onClose }: SettingsPanelProps) {
  const { theme, setTheme } = useTheme()
  const [audioDevice, setAudioDevice] = useState<string>('default')
  const [sampleRate, setSampleRate] = useState<string>('44100')
  const [bufferSize, setBufferSize] = useState<string>('128')
  const [language, setLanguage] = useState<string>('fr')
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false)

  const audioDeviceOptions: DropdownOption[] = [
    { value: 'default', label: 'Périphérique par défaut', icon: <Monitor size={16} /> },
    { value: 'asio', label: 'ASIO Driver', icon: <Headphones size={16} /> },
    { value: 'wasapi', label: 'WASAPI (Exclusif)', icon: <Volume2 size={16} /> }
  ]

  const sampleRateOptions: DropdownOption[] = [
    { value: '44100', label: '44.1 kHz' },
    { value: '48000', label: '48 kHz' },
    { value: '96000', label: '96 kHz' },
    { value: '192000', label: '192 kHz' }
  ]

  const bufferSizeOptions: DropdownOption[] = [
    { value: '64', label: '64 samples (1.5 ms @ 44.1kHz)' },
    { value: '128', label: '128 samples (2.9 ms @ 44.1kHz)' },
    { value: '256', label: '256 samples (5.8 ms @ 44.1kHz)' },
    { value: '512', label: '512 samples (11.6 ms @ 44.1kHz)' }
  ]

  const languageOptions: DropdownOption[] = [
    { value: 'fr', label: 'Français', icon: <Globe size={16} /> },
    { value: 'en', label: 'English', icon: <Globe size={16} /> }
  ]

  return (
    <div className="space-y-6">
      {/* Section Audio */}
      <section>
        <h3 className="text-lg font-semibold text-black/85 dark:text-white/90 mb-4 flex items-center gap-2">
          <Mic size={20} className="text-black/60 dark:text-white/60" />
          Configuration Audio
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-2">
              Périphérique audio
            </label>
            <Dropdown
              options={audioDeviceOptions}
              value={audioDevice}
              onChange={(value) => setAudioDevice(value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-2">
              Fréquence d'échantillonnage
            </label>
            <Dropdown
              options={sampleRateOptions}
              value={sampleRate}
              onChange={(value) => setSampleRate(value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-2">
              Taille du buffer
            </label>
            <Dropdown
              options={bufferSizeOptions}
              value={bufferSize}
              onChange={(value) => setBufferSize(value)}
            />
            <p className="text-xs text-black/50 dark:text-white/50 mt-2">
              Plus petit = moins de latence mais plus de charge CPU
            </p>
          </div>
        </div>
      </section>

      {/* Section Interface */}
      <section>
        <h3 className="text-lg font-semibold text-black/85 dark:text-white/90 mb-4 flex items-center gap-2">
          <Monitor size={20} className="text-black/60 dark:text-white/60" />
          Interface
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-2">
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
            <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-2">
              Langue
            </label>
            <Dropdown
              options={languageOptions}
              value={language}
              onChange={(value) => setLanguage(value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-2">
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
        </div>
      </section>

      <KeyboardShortcutsConfig
        isOpen={showKeyboardShortcuts}
        onClose={() => setShowKeyboardShortcuts(false)}
      />

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-black/10 dark:border-white/10">
        <CTA
          variant="primary"
          onClick={() => {
            // Le thème est déjà sauvegardé automatiquement via le contexte
            console.log('Paramètres sauvegardés', {
              audioDevice,
              sampleRate,
              bufferSize,
              theme,
              language
            })
            if (onClose) onClose()
          }}
          className="flex-1"
        >
          Enregistrer
        </CTA>
        <CTA
          variant="secondary"
          onClick={onClose}
          className="flex-1"
        >
          Annuler
        </CTA>
      </div>
    </div>
  )
}

