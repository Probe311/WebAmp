import { SettingsPanel } from '../components/SettingsPanel'
import { Block } from '../components/Block'

export function SettingsPage() {
  return (
    <div className="h-full overflow-y-auto p-6 pb-32">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-black/85 dark:text-white/90 mb-6">
          Paramètres
        </h1>
        <Block>
          <SettingsPanel />
        </Block>
      </div>
    </div>
  )
}

