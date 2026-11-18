/**
 * Types partagés de la session audio.
 *
 * `Effect` vivait auparavant dans `components/Pedalboard.tsx`. Il est défini ici
 * pour que la session audio puisse exister indépendamment de l'UI et des
 * fenêtres : l'état métier audio ne doit jamais dépendre d'un composant dont le
 * démontage arrête le signal.
 */

export interface Effect {
  id: string
  type: string
  pedalId: string
  name: string
  bypassed: boolean
  parameters: Record<string, number>
}
