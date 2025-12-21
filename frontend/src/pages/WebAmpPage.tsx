import { Pedalboard } from '../components/Pedalboard'
import { AmplifierSelector } from '../components/AmplifierSelector'
import { useDrumMachine } from '../contexts/DrumMachineContext'
import { DrumMachineCompact } from '../components/drummachine/DrumMachineCompact'
import { Block } from '../components/Block'

interface WebAmpPageProps {
  searchQuery?: string
  selectedAmplifier?: string
  onAmplifierChange?: (ampId: string) => void
  onParametersChange?: (params: Record<string, number>) => void
  currentPedalIds: string[]
  onAddEffectRef?: (fn: (pedalId: string) => void) => void
  onClearEffectsRef?: (fn: () => void) => void
  onEffectsChange?: (pedalIds: string[]) => void
  peakInput: number
  onExpandDrumMachine?: () => void
  onOpenProfiles?: () => void
}

export function WebAmpPage({
  searchQuery = '',
  selectedAmplifier,
  onAmplifierChange,
  onParametersChange,
  currentPedalIds,
  onAddEffectRef,
  onClearEffectsRef,
  onEffectsChange,
  peakInput,
  onExpandDrumMachine,
  onOpenProfiles
}: WebAmpPageProps) {
  const { isActive: isDrumMachineActive } = useDrumMachine()

  return (
    <div className="h-full overflow-y-auto custom-scrollbar p-6 pb-32">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-black/85 dark:text-white/90 mb-2">
          WebAmp
        </h1>
        <p className="text-sm text-black/70 dark:text-white/70 mb-6">
          Simulateur de pedalboard avec pédales d'effets et amplificateurs virtuels
        </p>
        {/* Layout Bento Grid - 2 lignes */}
        <div 
          className={`grid grid-rows-[1fr_1fr] gap-4 transition-all duration-300 ${
            isDrumMachineActive 
              ? 'grid-cols-1 md:grid-cols-4' 
              : 'grid-cols-1'
          }`}
        >
          {/* Ligne 1 : Pedalboard */}
          <Block 
            className={`row-span-1 flex flex-col overflow-hidden transition-all duration-300 ${
              isDrumMachineActive 
                ? 'col-span-1 md:col-span-3' 
                : 'col-span-1'
            }`}
          >
            <Pedalboard 
              searchQuery={searchQuery}
              onAddEffectRef={onAddEffectRef}
              onClearEffectsRef={onClearEffectsRef}
              onEffectsChange={onEffectsChange}
              currentPedalIds={currentPedalIds}
              currentAmplifierId={selectedAmplifier}
              peakInput={peakInput}
              onOpenProfiles={onOpenProfiles}
            />
          </Block>
          
          {/* Boîte à rythmes compacte */}
          {isDrumMachineActive && (
            <div className="col-span-1 row-span-1 flex flex-col min-h-0">
              <DrumMachineCompact onExpand={() => {
                onExpandDrumMachine?.()
              }} />
            </div>
          )}
          
          {/* Ligne 2 : AmplifierSelector */}
          <Block 
            className={`row-span-1 flex flex-col overflow-hidden transition-all duration-300 ${
              isDrumMachineActive 
                ? 'col-span-1 md:col-span-4' 
                : 'col-span-1'
            }`}
          >
            <AmplifierSelector 
              selectedAmplifier={selectedAmplifier}
              onAmplifierChange={onAmplifierChange}
              onParametersChange={onParametersChange}
              hasPedals={currentPedalIds.length > 0}
            />
          </Block>
        </div>
      </div>
    </div>
  )
}

