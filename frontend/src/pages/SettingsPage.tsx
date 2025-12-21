import { SettingsPanel } from '../components/SettingsPanel'
import { Block } from '../components/Block'

export function SettingsPage() {
  return (
    <div className="h-full overflow-y-auto custom-scrollbar p-6 pb-32">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-black/85 dark:text-white/90 mb-2">
          Paramètres
        </h1>
        <p className="text-sm text-black/70 dark:text-white/70 mb-6">
          Configurez vos préférences d'application, thème, raccourcis clavier et plus encore
        </p>
        <Block>
          <SettingsPanel />
        </Block>
      </div>
    </div>
  )
}

