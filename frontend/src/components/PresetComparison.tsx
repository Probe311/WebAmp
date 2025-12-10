import { useState } from 'react'
import { Modal } from './Modal'
import { CTA } from './CTA'
import { Play, Pause, RotateCcw } from 'lucide-react'
import { Effect } from './Pedalboard'
// PresetExport non utilisé, import supprimé
import { useToast } from './notifications/ToastProvider'

interface PresetComparisonProps {
  isOpen: boolean
  onClose: () => void
  presetA: {
    name: string
    amplifierId?: string
    effects: Effect[]
  }
  presetB: {
    name: string
    amplifierId?: string
    effects: Effect[]
  }
  onLoadPreset: (preset: { amplifierId?: string; effects: Effect[] }) => void
}

export function PresetComparison({
  isOpen,
  onClose,
  presetA,
  presetB,
  onLoadPreset
}: PresetComparisonProps) {
  const { showToast } = useToast()
  const [activePreset, setActivePreset] = useState<'A' | 'B' | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const handleLoadA = () => {
    onLoadPreset({
      amplifierId: presetA.amplifierId,
      effects: presetA.effects
    })
    setActivePreset('A')
    showToast({
      variant: 'success',
      title: 'Preset A chargé',
      message: `Le preset "${presetA.name}" a été chargé`
    })
  }

  const handleLoadB = () => {
    onLoadPreset({
      amplifierId: presetB.amplifierId,
      effects: presetB.effects
    })
    setActivePreset('B')
    showToast({
      variant: 'success',
      title: 'Preset B chargé',
      message: `Le preset "${presetB.name}" a été chargé`
    })
  }

  const handleTogglePlayback = () => {
    setIsPlaying(!isPlaying)
    // TODO: Implémenter la lecture alternée A/B
  }

  const handleReset = () => {
    setActivePreset(null)
    setIsPlaying(false)
  }

  const getDifferences = () => {
    const differences: string[] = []
    
    // Comparer les amplis
    if (presetA.amplifierId !== presetB.amplifierId) {
      differences.push(`Ampli: ${presetA.amplifierId || 'Aucun'} vs ${presetB.amplifierId || 'Aucun'}`)
    }
    
    // Comparer le nombre d'effets
    if (presetA.effects.length !== presetB.effects.length) {
      differences.push(`Nombre d'effets: ${presetA.effects.length} vs ${presetB.effects.length}`)
    }
    
    // Comparer les types d'effets
    const typesA = presetA.effects.map(e => e.type).sort()
    const typesB = presetB.effects.map(e => e.type).sort()
    if (JSON.stringify(typesA) !== JSON.stringify(typesB)) {
      differences.push('Types d\'effets différents')
    }
    
    return differences
  }

  const differences = getDifferences()

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Comparaison A/B de presets"
      className="max-w-4xl"
    >
      <div className="space-y-6">
        {/* Contrôles */}
        <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-700 rounded-xl border border-black/10 dark:border-white/10">
          <div className="flex items-center gap-3">
            <CTA
              variant="primary"
              icon={isPlaying ? <Pause size={18} /> : <Play size={18} />}
              onClick={handleTogglePlayback}
              active={isPlaying}
            >
              {isPlaying ? 'Pause' : 'Lecture A/B'}
            </CTA>
            <CTA
              variant="secondary"
              icon={<RotateCcw size={18} />}
              onClick={handleReset}
            >
              Réinitialiser
            </CTA>
          </div>
        </div>

        {/* Comparaison */}
        <div className="grid grid-cols-2 gap-6">
          {/* Preset A */}
          <div className={`p-6 rounded-xl border-2 transition-all ${
            activePreset === 'A'
              ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
              : 'border-black/10 dark:border-white/10 bg-white dark:bg-gray-700'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-black dark:text-white">
                Preset A: {presetA.name}
              </h3>
              {activePreset === 'A' && (
                <span className="px-3 py-1 bg-green-500 text-white rounded-full text-xs font-semibold">
                  Actif
                </span>
              )}
            </div>
            
            <div className="space-y-3 mb-4">
              <div className="text-sm text-black/70 dark:text-white/70">
                <strong>Ampli:</strong> {presetA.amplifierId || 'Aucun'}
              </div>
              <div className="text-sm text-black/70 dark:text-white/70">
                <strong>Effets:</strong> {presetA.effects.length}
              </div>
              <div className="text-sm text-black/70 dark:text-white/70">
                <strong>Types:</strong> {presetA.effects.map(e => e.type).join(', ')}
              </div>
            </div>
            
            <CTA
              variant="primary"
              onClick={handleLoadA}
              className="w-full"
            >
              Charger Preset A
            </CTA>
          </div>

          {/* Preset B */}
          <div className={`p-6 rounded-xl border-2 transition-all ${
            activePreset === 'B'
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-black/10 dark:border-white/10 bg-white dark:bg-gray-700'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-black dark:text-white">
                Preset B: {presetB.name}
              </h3>
              {activePreset === 'B' && (
                <span className="px-3 py-1 bg-blue-500 text-white rounded-full text-xs font-semibold">
                  Actif
                </span>
              )}
            </div>
            
            <div className="space-y-3 mb-4">
              <div className="text-sm text-black/70 dark:text-white/70">
                <strong>Ampli:</strong> {presetB.amplifierId || 'Aucun'}
              </div>
              <div className="text-sm text-black/70 dark:text-white/70">
                <strong>Effets:</strong> {presetB.effects.length}
              </div>
              <div className="text-sm text-black/70 dark:text-white/70">
                <strong>Types:</strong> {presetB.effects.map(e => e.type).join(', ')}
              </div>
            </div>
            
            <CTA
              variant="primary"
              onClick={handleLoadB}
              className="w-full"
            >
              Charger Preset B
            </CTA>
          </div>
        </div>

        {/* Différences */}
        {differences.length > 0 && (
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800">
            <h4 className="font-semibold text-black dark:text-white mb-2">
              Différences détectées:
            </h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-black/70 dark:text-white/70">
              {differences.map((diff, index) => (
                <li key={index}>{diff}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex justify-end">
          <CTA variant="secondary" onClick={onClose}>
            Fermer
          </CTA>
        </div>
      </div>
    </Modal>
  )
}

