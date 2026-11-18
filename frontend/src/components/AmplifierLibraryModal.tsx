import { useMemo, useState } from 'react'
import { Music2, Radio } from 'lucide-react'
import { Modal } from './Modal'
import { Dropdown, DropdownOption } from './Dropdown'
import { useCatalog } from '../hooks/useCatalog'
import { SearchBar } from './SearchBar'
import {
  ampIndexInBrand,
  displayLabelForAmp,
} from '../equipment/branding'
import {
  genreLabel,
  resolveAmpGenre,
  type MusicGenre,
} from '../equipment/genres'

interface AmplifierLibraryModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectAmplifier: (amplifierId: string) => void
  selectedAmplifier?: string
  searchQuery?: string
}

export function AmplifierLibraryModal({ isOpen, onClose, onSelectAmplifier, selectedAmplifier, searchQuery = '' }: AmplifierLibraryModalProps) {
  const { amplifiers: amplifierLibrary } = useCatalog()
  const [selectedType, setSelectedType] = useState<string | undefined>(undefined)
  const [selectedGenre, setSelectedGenre] = useState<MusicGenre | undefined>(undefined)
  const [internalSearchQuery, setInternalSearchQuery] = useState('')

  const activeSearchQuery = searchQuery || internalSearchQuery

  const typeOptions = useMemo<DropdownOption[]>(() => {
    return [
      { value: '', label: 'Tous les types', icon: <Radio size={16} /> },
      { value: 'combo', label: 'Combo', icon: <Radio size={16} /> },
      { value: 'head', label: 'Head', icon: <Radio size={16} /> },
    ]
  }, [])

  const genreOptions = useMemo<DropdownOption[]>(() => {
    const genres = Array.from(
      new Set(amplifierLibrary.map((amp) => resolveAmpGenre(amp)))
    ).sort((a, b) => genreLabel(a).localeCompare(genreLabel(b), 'fr'))
    return [
      { value: '', label: 'Tous les styles', icon: <Music2 size={16} /> },
      ...genres.map((genre) => ({
        value: genre,
        label: genreLabel(genre),
        icon: <Music2 size={16} />,
      })),
    ]
  }, [amplifierLibrary])

  const filteredAmps = useMemo(() => {
    const q = activeSearchQuery.toLowerCase()
    return amplifierLibrary.filter((amp) => {
      const label = displayLabelForAmp(amp, ampIndexInBrand(amplifierLibrary, amp))
      const genre = resolveAmpGenre(amp)
      const matchesSearch =
        activeSearchQuery === '' ||
        label.brandName.toLowerCase().includes(q) ||
        label.modelName.toLowerCase().includes(q) ||
        label.sourceName.toLowerCase().includes(q) ||
        amp.type.toLowerCase().includes(q) ||
        genreLabel(genre).toLowerCase().includes(q) ||
        amp.description.toLowerCase().includes(q)
      const matchesType = selectedType === undefined || amp.type === selectedType
      const matchesGenre = selectedGenre === undefined || genre === selectedGenre
      return matchesSearch && matchesType && matchesGenre
    })
  }, [amplifierLibrary, activeSearchQuery, selectedType, selectedGenre])

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Bibliothèque d'Amplis"
      className="flex flex-col"
      bodyClassName="overflow-y-auto custom-scrollbar flex-1 p-5 min-h-0"
    >
      {!searchQuery && (
        <div className="p-4 border-b border-[var(--td-edge-panel)] shrink-0">
          <div className="mb-4">
            <SearchBar
              value={internalSearchQuery}
              onChange={setInternalSearchQuery}
              placeholder="Rechercher par modèle, type ou style..."
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--td-text-secondary)] mb-2">
                Type
              </label>
              <Dropdown
                options={typeOptions}
                value={selectedType || ''}
                placeholder="Tous les types"
                onChange={(value) => setSelectedType(value === '' ? undefined : value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--td-text-secondary)] mb-2">
                Style
              </label>
              <Dropdown
                options={genreOptions}
                value={selectedGenre || ''}
                placeholder="Tous les styles"
                onChange={(value) =>
                  setSelectedGenre(value === '' ? undefined : (value as MusicGenre))
                }
              />
            </div>
          </div>
        </div>
      )}

      <div className="overflow-y-auto custom-scrollbar flex-1 p-5 min-h-0">
        {filteredAmps.length === 0 ? (
          <div className="text-center py-12 text-[var(--td-text-muted)] text-base">
            Aucun ampli trouvé
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
            {filteredAmps.map((amp) => {
              const label = displayLabelForAmp(amp, ampIndexInBrand(amplifierLibrary, amp))
              const genre = resolveAmpGenre(amp)
              return (
                <button
                  key={amp.id}
                  onClick={() => {
                    onSelectAmplifier(amp.id)
                    onClose()
                  }}
                  className="bg-[var(--td-surface-elevated)] border-2 rounded-[var(--td-radius-lg)] p-0 cursor-pointer transition-all duration-300 overflow-hidden text-left"
                  style={{
                    borderColor: amp.color,
                    boxShadow:
                      selectedAmplifier === amp.id
                        ? 'var(--td-elevation-2), 0 0 0 2px ' + amp.color
                        : 'var(--td-elevation-1)',
                  }}
                  onMouseEnter={(e) => {
                    if (selectedAmplifier !== amp.id) {
                      e.currentTarget.style.boxShadow = 'var(--td-elevation-2)'
                      e.currentTarget.style.transform = 'translateY(-4px)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedAmplifier !== amp.id) {
                      e.currentTarget.style.boxShadow = 'var(--td-elevation-1)'
                      e.currentTarget.style.transform = 'translateY(0)'
                    }
                  }}
                  onMouseDown={(e) => {
                    e.currentTarget.style.boxShadow = 'var(--td-elevation-inset-sm)'
                    e.currentTarget.style.transform = 'scale(0.98)'
                  }}
                  onMouseUp={(e) => {
                    if (selectedAmplifier === amp.id) {
                      e.currentTarget.style.boxShadow =
                        'var(--td-elevation-2), 0 0 0 2px ' + amp.color
                    } else {
                      e.currentTarget.style.boxShadow = 'var(--td-elevation-1)'
                    }
                    e.currentTarget.style.transform = 'scale(1)'
                  }}
                >
                  <div
                    className="p-4 border-b border-[var(--td-edge-panel)]"
                    style={{ backgroundColor: amp.color }}
                  >
                    <div className="text-xs text-white/90 uppercase tracking-[1px] mb-1 font-semibold">
                      {label.brandName}
                    </div>
                    <div className="text-lg text-white font-bold mb-1">{label.modelName}</div>
                    <div className="text-[0.625rem] text-white/70 uppercase tracking-[0.5px]">
                      {amp.type === 'combo' ? 'Combo' : 'Head'} · {genreLabel(genre)}
                    </div>
                  </div>
                  <div className="px-3 py-3 text-xs text-[var(--td-text-muted)] leading-relaxed">
                    {amp.description}
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </Modal>
  )
}
