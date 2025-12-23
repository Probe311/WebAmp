import React from 'react'
import {
  Piano,
  Activity,
  Guitar,
  Drum,
  Music,
  Radio,
  Waves,
  Zap,
  Mic,
  Headphones,
  Disc,
  RadioReceiver,
  type LucideIcon
} from 'lucide-react'

const ICON_MAP: Record<string, LucideIcon> = {
  Piano,
  Activity,
  Guitar,
  Drum,
  Music,
  Radio,
  Waves,
  Zap,
  Mic,
  Headphones,
  Disc,
  RadioReceiver
}

export function getTrackIcon(iconName?: string, trackType?: 'audio' | 'midi' | 'drums'): LucideIcon {
  if (iconName && ICON_MAP[iconName]) {
    return ICON_MAP[iconName]
  }
  // Fallback selon le type de track
  if (trackType === 'midi' || trackType === 'drums') {
    return Piano
  }
  return Activity
}

export function TrackIcon({
  iconName,
  trackType,
  size = 14,
  className = ''
}: {
  iconName?: string
  trackType?: 'audio' | 'midi' | 'drums'
  size?: number
  className?: string
}) {
  const Icon = getTrackIcon(iconName, trackType)
  return <Icon size={size} className={className} />
}

