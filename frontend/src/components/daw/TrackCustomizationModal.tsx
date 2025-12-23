import React, { useState, useEffect } from 'react'
import {
  Piano,
  Activity,
  Guitar,
  Drum,
  Music,
  Radio,
  Waves,
  Zap,
  Mic,
  Headphones,
  Disc,
  RadioReceiver,
  type LucideIcon
} from 'lucide-react'
import { Modal } from '../Modal'
import { CTA } from '../CTA'
import { DawTrack } from '../../types/daw'

// Helper function pour obtenir une couleur avec opacité
const getColorWithOpacity = (colorClass: string, opacity: number = 0.2): string => {
  // Extraire la couleur de la classe Tailwind (ex: bg-blue-500 -> blue-500)
  const colorName = colorClass.replace('bg-', '').replace('-500', '')
  
  // Mapping des couleurs Tailwind vers les valeurs hex
  const colorMap: Record<string, string> = {
    'blue': '#3b82f6',
    'green': '#10b981',
    'red': '#ef4444',
    'yellow': '#eab308',
    'purple': '#a855f7',
    'pink': '#ec4899',
    'orange': '#f97316',
    'indigo': '#6366f1',
    'teal': '#14b8a6',
    'cyan': '#06b6d4',
  }
  
  const baseColor = colorMap[colorName] || '#6b7280' // gray par défaut
  const r = parseInt(baseColor.slice(1, 3), 16)
  const g = parseInt(baseColor.slice(3, 5), 16)
  const b = parseInt(baseColor.slice(5, 7), 16)
  
  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}

interface TrackCustomizationModalProps {
  isOpen: boolean
  onClose: () => void
  track: DawTrack | null
  isNewTrack?: boolean
  onSave: (updates: { name: string; color: string; iconName: string; type?: 'audio' | 'midi' | 'drums' }) => void
}

const AVAILABLE_ICONS: { name: string; icon: LucideIcon; label: string }[] = [
  { name: 'Piano', icon: Piano, label: 'Piano' },
  { name: 'Activity', icon: Activity, label: 'Waveform' },
  { name: 'Guitar', icon: Guitar, label: 'Guitar' },
  { name: 'Drum', icon: Drum, label: 'Drums' },
  { name: 'Music', icon: Music, label: 'Music' },
  { name: 'Radio', icon: Radio, label: 'Radio' },
  { name: 'Waves', icon: Waves, label: 'Waves' },
  { name: 'Zap', icon: Zap, label: 'Zap' },
  { name: 'Mic', icon: Mic, label: 'Microphone' },
  { name: 'Headphones', icon: Headphones, label: 'Headphones' },
  { name: 'Disc', icon: Disc, label: 'Disc' },
  { name: 'RadioReceiver', icon: RadioReceiver, label: 'Receiver' }
]

const AVAILABLE_COLORS = [
  { name: 'red', value: 'bg-red-500', text: 'text-red-500' },
  { name: 'orange', value: 'bg-orange-500', text: 'text-orange-500' },
  { name: 'amber', value: 'bg-amber-500', text: 'text-amber-500' },
  { name: 'yellow', value: 'bg-yellow-500', text: 'text-yellow-500' },
  { name: 'lime', value: 'bg-lime-500', text: 'text-lime-500' },
  { name: 'green', value: 'bg-green-500', text: 'text-green-500' },
  { name: 'emerald', value: 'bg-emerald-500', text: 'text-emerald-500' },
  { name: 'teal', value: 'bg-teal-500', text: 'text-teal-500' },
  { name: 'cyan', value: 'bg-cyan-500', text: 'text-cyan-500' },
  { name: 'sky', value: 'bg-sky-500', text: 'text-sky-500' },
  { name: 'blue', value: 'bg-blue-500', text: 'text-blue-500' },
  { name: 'indigo', value: 'bg-indigo-500', text: 'text-indigo-500' },
  { name: 'violet', value: 'bg-violet-500', text: 'text-violet-500' },
  { name: 'purple', value: 'bg-purple-500', text: 'text-purple-500' },
  { name: 'fuchsia', value: 'bg-fuchsia-500', text: 'text-fuchsia-500' },
  { name: 'pink', value: 'bg-pink-500', text: 'text-pink-500' },
  { name: 'rose', value: 'bg-rose-500', text: 'text-rose-500' }
]

export function TrackCustomizationModal({
  isOpen,
  onClose,
  track,
  isNewTrack = false,
  onSave
}: TrackCustomizationModalProps) {
  const [trackName, setTrackName] = useState(track?.name || '')
  const [selectedColor, setSelectedColor] = useState(
    track?.color || 'bg-red-500'
  )
  const [selectedIcon, setSelectedIcon] = useState(
    track?.iconName || (track?.type === 'midi' || track?.type === 'drums' ? 'Piano' : 'Activity')
  )
  const [trackType, setTrackType] = useState<'audio' | 'midi' | 'drums'>(
    track?.type || 'midi'
  )

  // Reset form when modal opens/closes or track changes
  useEffect(() => {
    if (isOpen) {
      if (track) {
        setTrackName(track.name)
        setSelectedColor(track.color)
        setSelectedIcon(track.iconName || (track.type === 'midi' || track.type === 'drums' ? 'Piano' : 'Activity'))
        setTrackType(track.type)
      } else if (isNewTrack) {
        setTrackName('')
        setSelectedColor('bg-red-500')
        setSelectedIcon('Piano')
        setTrackType('midi')
      }
    }
  }, [isOpen, track, isNewTrack])

  if (!track && !isNewTrack) return null

  const handleSave = () => {
    if (!trackName.trim()) {
      return // Ne pas sauvegarder si le nom est vide
    }
    onSave({ 
      name: trackName.trim(), 
      color: selectedColor, 
      iconName: selectedIcon,
      type: isNewTrack ? trackType : undefined
    })
    onClose()
  }

  const selectedIconData = AVAILABLE_ICONS.find((i) => i.name === selectedIcon) || AVAILABLE_ICONS[0]
  const IconComponent = selectedIconData.icon

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={isNewTrack ? "Créer une nouvelle piste" : "Personnaliser la piste"} 
      widthClassName="max-w-2xl"
    >
      <div className="space-y-6">
        {/* Name Input */}
        <div>
          <label className="text-sm font-bold uppercase tracking-widest text-black/70 dark:text-white/70 mb-2 block">
            Nom de la piste
          </label>
          <input
            type="text"
            value={trackName}
            onChange={(e) => setTrackName(e.target.value)}
            placeholder="Entrez le nom de la piste..."
            className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-900 border border-black/10 dark:border-white/10 text-black dark:text-white placeholder:text-black/30 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-orange-500"
            autoFocus={isNewTrack}
          />
        </div>

        {/* Type Selection (only for new tracks) */}
        {isNewTrack && (
          <div>
            <label className="text-sm font-bold uppercase tracking-widest text-black/70 dark:text-white/70 mb-3 block">
              Type
            </label>
            <div className="flex gap-2">
              {(['audio', 'midi', 'drums'] as const).map((type) => (
                <CTA
                  key={type}
                  variant={trackType === type ? 'important' : 'secondary'}
                  active={trackType === type}
                  onClick={() => setTrackType(type)}
                  className="flex-1"
                >
                  {type === 'audio' ? 'Audio' : type === 'midi' ? 'MIDI' : 'Drums'}
                </CTA>
              ))}
            </div>
          </div>
        )}

        {/* Preview */}
        <div className="flex items-center justify-center p-6 bg-white dark:bg-gray-900 rounded-xl border border-black/10 dark:border-white/10">
          <div className="flex items-center gap-4">
            <div
              className={`w-16 h-16 rounded-lg flex items-center justify-center ${selectedColor.replace('bg-', 'text-')}`}
              style={{ backgroundColor: getColorWithOpacity(selectedColor, 0.2) }}
            >
              <IconComponent size={32} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-black dark:text-white">
                {trackName || 'Nouvelle piste'}
              </h3>
              <p className="text-sm text-black/50 dark:text-white/50">
                {selectedIconData.label} • {selectedColor.replace('bg-', '').replace('-500', '')}
                {isNewTrack && ` • ${trackType}`}
              </p>
            </div>
          </div>
        </div>

        {/* Icon Selection */}
        <div>
          <label className="text-sm font-bold uppercase tracking-widest text-black/70 dark:text-white/70 mb-3 block">
            Icône
          </label>
          <div className="grid grid-cols-6 gap-2">
            {AVAILABLE_ICONS.map((iconData) => {
              const Icon = iconData.icon
              const isSelected = selectedIcon === iconData.name
              return (
                <button
                  key={iconData.name}
                  onClick={() => setSelectedIcon(iconData.name)}
                  className={`p-3 rounded-xl transition-all ${
                    isSelected
                      ? 'ring-2 ring-orange-500'
                      : 'hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                  style={{
                    background: isSelected
                      ? 'rgba(245, 158, 11, 0.1)'
                      : 'transparent'
                  }}
                >
                  <Icon size={24} className="mx-auto text-black dark:text-white" />
                </button>
              )
            })}
          </div>
        </div>

        {/* Color Selection */}
        <div>
          <label className="text-sm font-bold uppercase tracking-widest text-black/70 dark:text-white/70 mb-3 block">
            Couleur
          </label>
          <div className="grid grid-cols-9 gap-2">
            {AVAILABLE_COLORS.map((color) => {
              const isSelected = selectedColor === color.value
              return (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color.value)}
                  className={`w-10 h-10 rounded-lg ${color.value} transition-all ${
                    isSelected ? 'ring-2 ring-black dark:ring-white scale-110' : 'hover:scale-105'
                  }`}
                  title={color.name}
                />
              )
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-black/10 dark:border-white/10">
          <CTA variant="secondary" onClick={onClose}>
            Annuler
          </CTA>
          <CTA 
            variant="primary" 
            onClick={handleSave}
            disabled={!trackName.trim()}
          >
            {isNewTrack ? 'Créer' : 'Enregistrer'}
          </CTA>
        </div>
      </div>
    </Modal>
  )
}

