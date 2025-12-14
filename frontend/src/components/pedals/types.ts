/**
 * Types partagés pour les composants de pédales
 */

export interface PedalComponentProps {
  values?: Record<string, number>
  onChange?: (param: string, value: number) => void
  bypassed?: boolean
  onBypassToggle?: () => void
  bottomActions?: React.ReactNode
  accentColor?: string // Couleur principale de la pédale - utilisée de manière cohérente partout
}

