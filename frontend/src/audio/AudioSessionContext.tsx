/**
 * Session audio : moteur unique + état métier audio qui survit aux fenêtres.
 *
 * Le provider est monté au niveau de l'application (au-dessus du Workspace),
 * donc fermer une fenêtre ne peut plus détruire l'état des effets ni le moteur.
 * L'état interne de module (Metronome/Looper) reste encore lié à son montage :
 * il relève de la migration des modules (Lot 4).
 */

import {
  createContext,
  useContext,
  useMemo,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction
} from 'react'
import type { PedalboardEngine } from './PedalboardEngine'
import { getSharedEngine } from './audioSession'
import type { Effect } from './types'

export interface AudioSessionValue {
  /** Moteur audio unique de l'application (instancié une seule fois). */
  engine: PedalboardEngine
  /** Chaîne d'effets du pedalboard, conservée hors du cycle de vie des fenêtres. */
  effects: Effect[]
  setEffects: Dispatch<SetStateAction<Effect[]>>
  /** Ampli sélectionné et ses paramètres, mêmes garanties de survie. */
  amplifierId: string | null
  setAmplifierId: Dispatch<SetStateAction<string | null>>
  amplifierParameters: Record<string, number>
  setAmplifierParameters: Dispatch<SetStateAction<Record<string, number>>>
}

const AudioSessionContext = createContext<AudioSessionValue | undefined>(undefined)

export function AudioSessionProvider({ children }: { children: ReactNode }) {
  // `getSharedEngine` est idempotent : StrictMode peut rendre deux fois sans
  // créer deux moteurs. Aucun nettoyage ici, c'est le cœur de la garantie.
  const engine = useMemo(() => getSharedEngine(), [])
  const [effects, setEffects] = useState<Effect[]>([])
  const [amplifierId, setAmplifierId] = useState<string | null>(null)
  const [amplifierParameters, setAmplifierParameters] = useState<Record<string, number>>({})

  const value = useMemo<AudioSessionValue>(
    () => ({
      engine,
      effects,
      setEffects,
      amplifierId,
      setAmplifierId,
      amplifierParameters,
      setAmplifierParameters
    }),
    [engine, effects, amplifierId, amplifierParameters]
  )

  return <AudioSessionContext.Provider value={value}>{children}</AudioSessionContext.Provider>
}

export function useAudioSession(): AudioSessionValue {
  const context = useContext(AudioSessionContext)
  if (context === undefined) {
    throw new Error('useAudioSession must be used within an AudioSessionProvider')
  }
  return context
}
