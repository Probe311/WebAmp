import { DrumMachinePanel } from '../components/drummachine/DrumMachinePanel'
import { Block } from '../components/Block'

export function DrumMachinePage() {
  return (
    <div className="h-full overflow-y-auto custom-scrollbar p-6 pb-32">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-black/85 dark:text-white/90 mb-2">
          Boîte à rythmes
        </h1>
        <p className="text-sm text-black/70 dark:text-white/70 mb-6">
          Créez vos propres rythmes avec cette boîte à rythmes virtuelle complète
        </p>
        {/* Layout Bento Grid */}
        <div className="grid grid-cols-1 gap-4">
          {/* Drum Machine - Grande carte */}
          <Block>
            <DrumMachinePanel />
          </Block>
        </div>
      </div>
    </div>
  )
}

