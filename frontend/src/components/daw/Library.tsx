import React, { useState, useEffect, useCallback } from 'react'
import { Layers, Folder, Music, Zap, FolderOpen, Loader2, Play, Pause, Download } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import { CTA } from '../CTA'
import { Block } from '../Block'
import { SearchBar } from '../SearchBar'
import { freesoundService, type FreesoundSound } from '../../services/freesound'

interface LibraryFolder {
  name: string
  count: number
  query: string
  sounds?: FreesoundSound[]
}

interface LibraryProps {
  folders?: LibraryFolder[]
  onSampleSelect?: (sample: FreesoundSound) => void
}

const DEFAULT_FOLDERS: LibraryFolder[] = [
  { name: 'Drums', count: 0, query: 'drum kick snare hihat' },
  { name: 'Bass & 808s', count: 0, query: 'bass 808 sub' },
  { name: 'Synths', count: 0, query: 'synthesizer synth pad lead' },
  { name: 'FX & Risers', count: 0, query: 'fx riser sweep impact' }
]

export function Library({ folders, onSampleSelect }: LibraryProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [activeTab, setActiveTab] = useState<'Samples' | 'Plugins' | 'Project'>('Samples')
  const [searchQuery, setSearchQuery] = useState('')
  const [libraryFolders, setLibraryFolders] = useState<LibraryFolder[]>(folders || DEFAULT_FOLDERS)
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null)
  const [sounds, setSounds] = useState<FreesoundSound[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [playingSoundId, setPlayingSoundId] = useState<number | null>(null)
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null)

  // Charger les samples pour une catégorie
  const loadFolderSounds = async (folder: LibraryFolder) => {
    if (folder.sounds && folder.sounds.length > 0) {
      setSounds(folder.sounds)
      setSelectedFolder(folder.name)
      return
    }

    setLoading(true)
    setError(null)
    try {
      const result = await freesoundService.searchSounds(folder.query, {
        filter: '(license:"Attribution" OR license:"Creative Commons 0") duration:[0 TO 10]',
        sort: 'downloads_desc',
        pageSize: 20,
        fields: 'id,name,tags,description,license,previews,username,duration,samplerate'
      })

      const updatedFolders = libraryFolders.map(f =>
        f.name === folder.name
          ? { ...f, sounds: result.results, count: result.count }
          : f
      )
      setLibraryFolders(updatedFolders)
      setSounds(result.results)
      setSelectedFolder(folder.name)
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des samples')
      console.error('Error loading sounds:', err)
    } finally {
      setLoading(false)
    }
  }

  // Recherche de samples
  const searchSounds = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSounds([])
      setSelectedFolder(null)
      return
    }

    setLoading(true)
    setError(null)
    try {
      const result = await freesoundService.searchSounds(query, {
        filter: '(license:"Attribution" OR license:"Creative Commons 0")',
        sort: 'downloads_desc',
        pageSize: 20,
        fields: 'id,name,tags,description,license,previews,username,duration,samplerate'
      })
      setSounds(result.results)
      setSelectedFolder(null)
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la recherche')
      console.error('Error searching sounds:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Gérer la recherche
  useEffect(() => {
    if (searchQuery.trim()) {
      const timeoutId = setTimeout(() => {
        searchSounds(searchQuery)
      }, 500)
      return () => clearTimeout(timeoutId)
    } else if (selectedFolder) {
      const folder = libraryFolders.find(f => f.name === selectedFolder)
      if (folder && folder.sounds) {
        setSounds(folder.sounds)
      }
    } else {
      setSounds([])
    }
  }, [searchQuery, selectedFolder, libraryFolders, searchSounds])

  // Jouer un preview
  const playPreview = (sound: FreesoundSound) => {
    if (audioElement) {
      audioElement.pause()
      audioElement.src = ''
    }

    const previewUrl = sound.previews?.['preview-hq-mp3'] || sound.previews?.['preview-lq-mp3']
    if (!previewUrl) return

    const audio = new Audio(previewUrl)
    audio.play()
    setAudioElement(audio)
    setPlayingSoundId(sound.id)

    audio.onended = () => {
      setPlayingSoundId(null)
      setAudioElement(null)
    }

    audio.onerror = () => {
      setPlayingSoundId(null)
      setAudioElement(null)
    }
  }

  // Arrêter la lecture
  const stopPreview = () => {
    if (audioElement) {
      audioElement.pause()
      audioElement.src = ''
      setAudioElement(null)
    }
    setPlayingSoundId(null)
  }

  return (
    <Block className="w-72 flex flex-col shrink-0 p-0">
      <div className="py-4 border-b border-black/10 dark:border-white/10 flex items-center gap-3 shrink-0">
        <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500 dark:text-orange-400">
          <Layers size={20} />
        </div>
        <span className="text-sm font-bold uppercase tracking-widest text-black dark:text-white">
          Library
        </span>
      </div>

      <div className="py-4 flex flex-col gap-4 flex-1 min-h-0">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Rechercher..."
        />

        <div className="flex items-center gap-2">
          {([
            { id: 'Samples' as const, icon: Music, label: 'Samples' },
            { id: 'Plugins' as const, icon: Zap, label: 'Plugins' },
            { id: 'Project' as const, icon: FolderOpen, label: 'Project' }
          ]).map((tab) => {
            const Icon = tab.icon
            return (
              <CTA
                key={tab.id}
                variant={tab.id === activeTab ? 'important' : 'secondary'}
                active={tab.id === activeTab}
                icon={<Icon size={16} />}
                onClick={() => setActiveTab(tab.id)}
                className="flex-1 py-2"
                title={tab.label}
              />
            )
          })}
        </div>

        <div className="flex-1 overflow-hidden space-y-1">
          {activeTab === 'Samples' && (
            <>
              {!searchQuery && (
                <>
                  {libraryFolders.map((folder, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 rounded-xl cursor-pointer group transition-all"
                      onClick={() => loadFolderSounds(folder)}
                      style={{
                        border: '1px solid transparent',
                        background: selectedFolder === folder.name
                          ? isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                          : 'transparent'
                      }}
                      onMouseEnter={(e) => {
                        if (selectedFolder !== folder.name) {
                          e.currentTarget.style.background = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
                          e.currentTarget.style.borderColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.1)'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedFolder !== folder.name) {
                          e.currentTarget.style.background = 'transparent'
                          e.currentTarget.style.borderColor = 'transparent'
                        }
                      }}
                    >
                      <div className="flex items-center gap-3 text-black/70 dark:text-white/70 group-hover:text-black dark:group-hover:text-white">
                        <Folder
                          size={16}
                          className="text-orange-500/70 dark:text-orange-400/70 group-hover:text-orange-500 dark:group-hover:text-orange-400"
                        />
                        <span className="text-sm font-medium">{folder.name}</span>
                      </div>
                      <span
                        className="text-[10px] px-2 py-1 rounded-md"
                        style={{
                          color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
                          background: isDark ? '#111827' : '#f5f5f5'
                        }}
                      >
                        {folder.count || '...'}
                      </span>
                    </div>
                  ))}
                </>
              )}

              {loading && (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="animate-spin text-orange-500" size={24} />
                </div>
              )}

              {error && (
                <div className="p-3 rounded-xl bg-red-500/10 text-red-500 text-xs">
                  {error}
                </div>
              )}

              {sounds.length > 0 && (
                <div className="space-y-1">
                  {sounds.map((sound) => (
                    <div
                      key={sound.id}
                      className="flex items-center gap-2 p-2 rounded-lg cursor-pointer group transition-all hover:bg-black/5 dark:hover:bg-white/5"
                      onClick={() => onSampleSelect?.(sound)}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          if (playingSoundId === sound.id) {
                            stopPreview()
                          } else {
                            playPreview(sound)
                          }
                        }}
                        className="p-1.5 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                        title="Aperçu"
                      >
                        {playingSoundId === sound.id ? (
                          <Pause size={12} className="text-orange-500" />
                        ) : (
                          <Play size={12} className="text-black/70 dark:text-white/70" />
                        )}
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-black dark:text-white truncate">
                          {sound.name}
                        </div>
                        <div className="text-[10px] text-black/50 dark:text-white/50">
                          {sound.duration.toFixed(1)}s • {sound.username}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!loading && !error && sounds.length === 0 && searchQuery && (
                <div className="p-4 text-center text-xs text-black/50 dark:text-white/50">
                  Aucun résultat trouvé
                </div>
              )}
            </>
          )}

          {activeTab === 'Plugins' && (
            <div className="p-4 text-center text-xs text-black/50 dark:text-white/50">
              Plugins à venir
            </div>
          )}

          {activeTab === 'Project' && (
            <div className="p-4 text-center text-xs text-black/50 dark:text-white/50">
              Projets à venir
            </div>
          )}
        </div>
      </div>
    </Block>
  )
}

