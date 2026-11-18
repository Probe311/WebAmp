/** Pistes session partagées Studio ↔ Mixage (noms + couleurs alignés). */

export type SessionTrackKind = 'audio' | 'midi'

export interface SessionTrackDef {
  id: string
  name: string
  color: string
  kind: SessionTrackKind
}

export const SESSION_TRACKS: readonly SessionTrackDef[] = [
  { id: 'guitar', name: 'Guitar', color: '#F26A1B', kind: 'audio' },
  { id: 'bass', name: 'Bass', color: '#8B5CF6', kind: 'audio' },
  { id: 'drums', name: 'Drums', color: '#3B82F6', kind: 'midi' },
  { id: 'loops', name: 'Loops', color: '#22C55E', kind: 'audio' },
  { id: 'mic', name: 'Mic', color: '#EC4899', kind: 'audio' },
] as const

export const MASTER_TRACK_ID = 'master'

export interface SessionChannelState {
  volume: number
  pan: number
  muted: boolean
  solo: boolean
  armed: boolean
}

export function defaultChannelState(index = 0): SessionChannelState {
  return {
    volume: 0.7 + (index % 3) * 0.05,
    pan: index === 1 ? -0.2 : index === 3 ? 0.15 : 0,
    muted: false,
    solo: false,
    armed: false,
  }
}

export function initialChannelMap(): Record<string, SessionChannelState> {
  const map: Record<string, SessionChannelState> = {}
  SESSION_TRACKS.forEach((t, i) => {
    map[t.id] = defaultChannelState(i)
  })
  map[MASTER_TRACK_ID] = { volume: 0.85, pan: 0, muted: false, solo: false, armed: false }
  return map
}
