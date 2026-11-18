import { PianoKeyboard } from '../components/tactile'
import { AppPageShell } from '../components/shell/AppPageShell'

/** Page clavier MIDI — fill fenêtre, pas de scroll / sous-titre. */
export function MidiKeyboardPage() {
  return (
    <AppPageShell fill className="!overflow-visible !px-2.5 !pb-2.5 !pt-2 sm:!px-3 sm:!pb-3 sm:!pt-2.5">
      <PianoKeyboard octave={3} enableSound className="h-full min-h-0 max-w-none" />
    </AppPageShell>
  )
}
