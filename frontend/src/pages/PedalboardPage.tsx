import { Pedalboard } from '../components/Pedalboard'
import { useDrumMachine } from '../contexts/DrumMachineContext'
import { DrumMachineCompact } from '../components/drummachine/DrumMachineCompact'
import { AppPageShell } from '../components/shell/AppPageShell'

interface PedalboardPageProps {
  searchQuery?: string
  librarySearchQuery?: string
  autoOpenLibrary?: boolean
  onLibraryOpened?: () => void
  currentAmplifierId?: string
  currentPedalIds: string[]
  onAddEffectRef?: (fn: (pedalId: string) => void) => void
  onClearEffectsRef?: (fn: () => void) => void
  onEffectsChange?: (pedalIds: string[]) => void
  peakInput: number
  onExpandDrumMachine?: () => void
  onOpenProfiles?: () => void
}

/** Page dédiée : chaîne d'effets / pedalboard. */
export function PedalboardPage({
  searchQuery = '',
  librarySearchQuery = '',
  autoOpenLibrary = false,
  onLibraryOpened,
  currentAmplifierId,
  currentPedalIds,
  onAddEffectRef,
  onClearEffectsRef,
  onEffectsChange,
  peakInput,
  onExpandDrumMachine,
  onOpenProfiles,
}: PedalboardPageProps) {
  const { isActive: isDrumMachineActive } = useDrumMachine()

  return (
    <AppPageShell fill>
      <div
        className={`grid min-h-0 flex-1 gap-3 ${
          isDrumMachineActive ? 'grid-cols-1 md:grid-cols-4' : 'grid-cols-1'
        }`}
      >
        <div
          className={`flex min-h-0 flex-col ${
            isDrumMachineActive ? 'md:col-span-3' : ''
          }`}
        >
          <Pedalboard
            searchQuery={searchQuery}
            librarySearchQuery={librarySearchQuery}
            autoOpenLibrary={autoOpenLibrary}
            onLibraryOpened={onLibraryOpened}
            onAddEffectRef={onAddEffectRef}
            onClearEffectsRef={onClearEffectsRef}
            onEffectsChange={onEffectsChange}
            currentPedalIds={currentPedalIds}
            currentAmplifierId={currentAmplifierId}
            peakInput={peakInput}
            onOpenProfiles={onOpenProfiles}
          />
        </div>

        {isDrumMachineActive && (
          <div className="flex min-h-0 flex-col md:col-span-1">
            <DrumMachineCompact onExpand={() => onExpandDrumMachine?.()} />
          </div>
        )}
      </div>
    </AppPageShell>
  )
}
