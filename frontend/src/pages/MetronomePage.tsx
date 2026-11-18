import { useState } from 'react'
import { AppPageShell } from '../components/shell/AppPageShell'
import { TempoTap } from '../components/tactile'

/** Métronome 4×3 — TempoTap plain, sans scroll. */
export function MetronomePage() {
  const [bpm, setBpm] = useState(124)

  return (
    <AppPageShell fill className="!overflow-hidden !px-2.5 !pb-2.5 !pt-2 sm:!px-2.5 sm:!pb-2.5 sm:!pt-2">
      <TempoTap
        bpm={bpm}
        onBpmChange={setBpm}
        timeSignature="4/4"
        enableClick
        label="MÉTRONOME & TAP TEMPO"
        variant="plain"
        className="min-h-0 flex-1"
      />
    </AppPageShell>
  )
}
