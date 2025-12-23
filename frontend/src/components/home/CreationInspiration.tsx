import React from 'react'
import { Block } from '../Block'
import { Sparkles } from 'lucide-react'

/**
 * Composant placeholder utilisé lorsqu'une référence à CreationInspiration est présente.
 * Remplacez/complétez ce composant si un design spécifique est nécessaire.
 */
export function CreationInspiration() {
  return (
    <Block className="min-h-[220px] flex flex-col items-center justify-center text-center gap-3">
      <div className="flex items-center gap-2 text-orange-500">
        <Sparkles size={18} />
        <span className="text-sm font-semibold uppercase tracking-wider">Inspiration</span>
      </div>
      <p className="text-black/70 dark:text-white/70 text-sm max-w-md">
        Une section &quot;Creation Inspiration&quot; sera bientôt disponible ici.
      </p>
    </Block>
  )
}

export default CreationInspiration

