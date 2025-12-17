import { useState } from 'react'
import { TunerComponent } from '../components/Tuner'
import { Metronome } from '../components/Metronome'
import { Block } from '../components/Block'

export function PracticePage() {
  const [activeTab, setActiveTab] = useState<'tuner' | 'metronome'>('tuner')

  return (
    <div className="h-full overflow-y-auto custom-scrollbar p-6 pb-32">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-black/85 dark:text-white/90 mb-6">
          Pratique
        </h1>
        {/* Layout Bento Grid */}
        <div className="grid grid-cols-1 gap-4">
          {/* Tabs et Content - Grande carte */}
          <Block>
            {/* Tabs */}
            <div className="flex items-center gap-2 mb-6 bg-white dark:bg-gray-700 p-1.5 rounded-full shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] dark:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.5),inset_-2px_-2px_5px_rgba(60,60,60,0.5)]">
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
                aria-label="Tuner"
                style={{ minHeight: '44px' }}
              >
                Tuner
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
                aria-label="Metronome"
                style={{ minHeight: '44px' }}
              >
                Metronome
              </button>
            </div>

            {/* Content */}
            {activeTab === 'tuner' ? <TunerComponent /> : <Metronome />}
          </Block>
        </div>
      </div>
    </div>
  )
}

