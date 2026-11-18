import { AmplifierSelector } from '../components/AmplifierSelector'
import { AppPageShell } from '../components/shell/AppPageShell'

interface AmplifierPageProps {
  selectedAmplifier?: string
  onAmplifierChange?: (ampId: string) => void
  onParametersChange?: (params: Record<string, number>) => void
  hasPedals?: boolean
}

/** Page dédiée : sélection et réglages d'ampli. */
export function AmplifierPage({
  selectedAmplifier,
  onAmplifierChange,
  onParametersChange,
  hasPedals = false,
}: AmplifierPageProps) {
  return (
    <AppPageShell fill className="!p-0">
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <AmplifierSelector
          selectedAmplifier={selectedAmplifier}
          onAmplifierChange={onAmplifierChange}
          onParametersChange={onParametersChange}
          hasPedals={hasPedals}
        />
      </div>
    </AppPageShell>
  )
}
