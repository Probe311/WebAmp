import { useState, useMemo } from 'react'
import { TunerComponent } from '../components/Tuner'
import { Metronome } from '../components/Metronome'
import { Block } from '../components/Block'
import { ChordDiagram } from '../components/learn/ChordDiagram'
import { CHORD_ROOTS, CHORD_QUALITIES, CHORD_DATABASE } from '../data/chords'

export function PracticePage() {
  const [activeTab, setActiveTab] = useState<'chords' | 'tuner' | 'metronome'>('chords')
  const [selectedRoot, setSelectedRoot] = useState<string>('C')
  const [selectedQuality, setSelectedQuality] = useState<string>('Maj')

  const currentChordKey = useMemo(() => {
    return `${selectedRoot} ${selectedQuality}`
  }, [selectedRoot, selectedQuality])

  const currentChord = useMemo(() => {
    return CHORD_DATABASE[currentChordKey] || null
  }, [currentChordKey])

  return (
    <div className="h-full overflow-y-auto custom-scrollbar p-6 pb-32">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-black/85 dark:text-white/90 mb-2">
          Pratique
        </h1>
        <p className="text-sm text-black/70 dark:text-white/70 mb-6">
          Outils d'entraînement : accordeur, métronome et dictionnaire d'accords
        </p>
        {/* Layout Bento Grid */}
        <div className="grid grid-cols-1 gap-4">
          {/* Tabs et Content - Grande carte */}
          <Block>
            {/* Tabs */}
            <div className="flex items-center gap-2 mb-6 bg-white dark:bg-gray-700 p-1.5 rounded-full shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] dark:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.5),inset_-2px_-2px_5px_rgba(60,60,60,0.5)]">
              <button
                onClick={() => setActiveTab('chords')}
                onTouchStart={(e) => {
                  e.preventDefault()
                  setActiveTab('chords')
                }}
                className={`
                  flex-1 px-6 py-3 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-200
                  touch-manipulation focus:outline-none select-none
                  ${activeTab === 'chords' 
                    ? 'bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200 shadow-[3px_3px_6px_#b8b9be,-3px_-3px_6px_#ffffff] dark:shadow-[3px_3px_6px_rgba(0,0,0,0.6),-3px_-3px_6px_rgba(60,60,60,0.6)]' 
                    : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 bg-transparent'
                  }
                `}
                aria-label="Accords"
                style={{ minHeight: '44px' }}
              >
                Accords
              </button>
              <button
                onClick={() => setActiveTab('tuner')}
                onTouchStart={(e) => {
                  e.preventDefault()
                  setActiveTab('tuner')
                }}
                className={`
                  flex-1 px-6 py-3 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-200
                  touch-manipulation focus:outline-none select-none
                  ${activeTab === 'tuner' 
                    ? 'bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200 shadow-[3px_3px_6px_#b8b9be,-3px_-3px_6px_#ffffff] dark:shadow-[3px_3px_6px_rgba(0,0,0,0.6),-3px_-3px_6px_rgba(60,60,60,0.6)]' 
                    : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 bg-transparent'
                  }
                `}
                aria-label="Accordeur"
                style={{ minHeight: '44px' }}
              >
                Accordeur
              </button>
              <button
                onClick={() => setActiveTab('metronome')}
                onTouchStart={(e) => {
                  e.preventDefault()
                  setActiveTab('metronome')
                }}
                className={`
                  flex-1 px-6 py-3 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-200
                  touch-manipulation focus:outline-none select-none
                  ${activeTab === 'metronome' 
                    ? 'bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200 shadow-[3px_3px_6px_#b8b9be,-3px_-3px_6px_#ffffff] dark:shadow-[3px_3px_6px_rgba(0,0,0,0.6),-3px_-3px_6px_rgba(60,60,60,0.6)]' 
                    : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 bg-transparent'
                  }
                `}
                aria-label="Métronome"
                style={{ minHeight: '44px' }}
              >
                Métronome
              </button>
            </div>

            {/* Content */}
            {activeTab === 'chords' && (
              <div className="w-full max-w-2xl mx-auto flex flex-col md:flex-row gap-8 items-center justify-center py-8">
                <div className="flex flex-col gap-4 w-48">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-neutral-500 dark:text-gray-400 uppercase tracking-widest px-2">Fondamentale</label>
                    <select 
                      value={selectedRoot} 
                      onChange={(e) => setSelectedRoot(e.target.value)}
                      className="bg-gray-800 border border-white/5 rounded-xl p-3 text-white focus:outline-none focus:border-orange-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                    >
                      {CHORD_ROOTS.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-neutral-500 dark:text-gray-400 uppercase tracking-widest px-2">Qualité</label>
                    <select 
                      value={selectedQuality} 
                      onChange={(e) => setSelectedQuality(e.target.value)}
                      className="bg-gray-800 border border-white/5 rounded-xl p-3 text-white focus:outline-none focus:border-orange-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                    >
                      {CHORD_QUALITIES.map(q => <option key={q} value={q}>{q}</option>)}
                    </select>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center min-h-[300px]">
                  {currentChord ? (
                    <div className="overflow-hidden max-w-full">
                      <ChordDiagram chord={currentChord} scale={1.2} />
                    </div>
                  ) : (
                    <div className="text-neutral-500 dark:text-gray-400 text-sm">Accord non disponible</div>
                  )}
                </div>
              </div>
            )}
            {activeTab === 'tuner' && <TunerComponent />}
            {activeTab === 'metronome' && <Metronome />}
          </Block>
        </div>
      </div>
    </div>
  )
}

