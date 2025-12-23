import React from 'react'
import { SlidersHorizontal, Music, Zap } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import { DawTrack, MidiNote } from '../../types/daw'
import { Mixer } from './Mixer'
import { PianoRoll } from './PianoRoll'
import { WaveformEditor } from './WaveformEditor'
import { DeviceChain } from './DeviceChain'
import { CTA } from '../CTA'
import { Block } from '../Block'

export type BottomTab = 'mixer' | 'editor' | 'device'

interface BottomPanelProps {
  activeTab: BottomTab
  onTabChange: (tab: BottomTab) => void
  tracks: DawTrack[]
  selectedTrackId: string | null
  selectedTrack: DawTrack | undefined
  onTrackSelect: (id: string) => void
  onTrackUpdate: (id: string, updates: Partial<DawTrack>) => void
  meters: Record<string, number>
  masterVolume: number
  onMasterVolumeChange: (volume: number) => void
  getMidiNotes: () => MidiNote[]
}

export function BottomPanel({
  activeTab,
  onTabChange,
  tracks,
  selectedTrackId,
  selectedTrack,
  onTrackSelect,
  onTrackUpdate,
  meters,
  masterVolume,
  onMasterVolumeChange,
  getMidiNotes
}: BottomPanelProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <Block className="h-80 flex flex-col shrink-0 p-0">
      {/* Header */}
      <div className="py-4 border-b border-black/10 dark:border-white/10 flex items-center gap-3">
        <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500 dark:text-orange-400">
          {activeTab === 'mixer' ? (
            <SlidersHorizontal size={20} />
          ) : activeTab === 'editor' ? (
            <Music size={20} />
          ) : (
            <Zap size={20} />
          )}
        </div>
        <span className="text-sm font-bold uppercase tracking-widest text-black dark:text-white">
          {activeTab === 'mixer' ? 'Mixer' : activeTab === 'editor' ? 'Editor' : 'Chain'}
        </span>
      </div>

      {/* Content Area */}
      <div className="py-4 flex flex-col gap-4 flex-1 min-h-0">
        {/* Tabs */}
        <div className="flex items-center gap-2">
          {[
            { id: 'mixer' as BottomTab, icon: SlidersHorizontal, label: 'Mixer' },
            { id: 'editor' as BottomTab, icon: Music, label: 'Editor' },
            { id: 'device' as BottomTab, icon: Zap, label: 'Chain' }
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <CTA
                key={tab.id}
                variant={tab.id === activeTab ? 'important' : 'secondary'}
                active={tab.id === activeTab}
                icon={<Icon size={16} />}
                onClick={() => onTabChange(tab.id)}
                className="flex-1 py-2"
                title={tab.label}
              />
            )
          })}
        </div>

        {/* Selected Track Badge */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold text-black/50 dark:text-white/50 uppercase tracking-widest">
            Sélectionné :
          </span>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-gray-700 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05),inset_-2px_-2px_4px_rgba(255,255,255,0.8)] dark:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.5),inset_-2px_-2px_4px_rgba(60,60,60,0.5)]">
            <div
              className={`w-2 h-2 rounded-full ${selectedTrack?.color || 'bg-gray-500'}`}
            />
            <span className="text-xs font-bold text-black/85 dark:text-white/90">
              {selectedTrack?.name || 'Aucun'}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-x-auto">
        {activeTab === 'mixer' && (
          <Mixer
            tracks={tracks}
            selectedTrackId={selectedTrackId}
            onTrackSelect={onTrackSelect}
            onTrackUpdate={onTrackUpdate}
            meters={meters}
            masterVolume={masterVolume}
            onMasterVolumeChange={onMasterVolumeChange}
          />
        )}
        {activeTab === 'device' && (
          <div className="h-full w-full">
            {selectedTrack ? (
              <DeviceChain trackName={selectedTrack.name} />
            ) : (
              <div className="flex items-center justify-center h-full text-black/50 dark:text-white/50">
                Sélectionnez une piste pour éditer la chaîne
              </div>
            )}
          </div>
        )}
        {activeTab === 'editor' && (
          <div className="h-full w-full">
            {selectedTrack ? (
              selectedTrack.type === 'midi' || selectedTrack.type === 'drums' ? (
                <PianoRoll
                  notes={getMidiNotes()}
                  onAddNote={(n) => {
                    // Add note logic
                  }}
                  onRemoveNote={(i) => {
                    // Remove note logic
                  }}
                />
              ) : (
                <WaveformEditor color={selectedTrack.color} />
              )
            ) : (
              <div className="flex items-center justify-center h-full text-black/50 dark:text-white/50">
                Sélectionnez une piste pour éditer
              </div>
            )}
          </div>
        )}
        </div>
      </div>
    </Block>
  )
}

