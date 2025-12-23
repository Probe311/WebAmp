import { Looper } from '../components/Looper'
import { Block } from '../components/Block'

export function LooperPage() {
  return (
    <div className="h-full overflow-y-auto custom-scrollbar p-6 pb-24">
      <div className="w-full">
        <h1 className="text-3xl font-bold text-black/85 dark:text-white/90 mb-2">
          Looper
        </h1>
        <p className="text-sm text-black/70 dark:text-white/70 mb-6">
          Enregistrez et superposez des boucles audio pour créer vos compositions
        </p>
        {/* Layout Bento Grid */}
        <div className="grid grid-cols-1 gap-4">
          {/* Looper - Grande carte */}
          <Block>
            <Looper />
          </Block>
        </div>
      </div>
    </div>
  )
}

