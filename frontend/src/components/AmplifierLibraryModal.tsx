import { useMemo, useState } from 'react'
import { Search, Building2, Radio } from 'lucide-react'
import { Modal } from './Modal'
import { Dropdown, DropdownOption } from './Dropdown'
import { useCatalog } from '../hooks/useCatalog'

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
  const [selectedBrand, setSelectedBrand] = useState<string | undefined>(undefined)
  const [internalSearchQuery, setInternalSearchQuery] = useState('')

  const activeSearchQuery = searchQuery || internalSearchQuery

  // Options pour le type d'ampli (combo/head)
  const typeOptions = useMemo<DropdownOption[]>(() => {
    return [
      { value: '', label: 'Tous les styles', icon: <Radio size={16} /> },
      { value: 'combo', label: 'Combo', icon: <Radio size={16} /> },
      { value: 'head', label: 'Head', icon: <Radio size={16} /> }
    ]
  }, [])

  // Marques uniques pour le dropdown
  const brandOptions = useMemo<DropdownOption[]>(() => {
    const brands = Array.from(new Set(amplifierLibrary.map(amp => amp.brand))).sort()
    return [
      { value: '', label: 'Toutes les marques', icon: <Building2 size={16} /> },
      ...brands.map(brand => ({
        value: brand,
        label: brand,
        icon: <Building2 size={16} />
      }))
    ]
  }, [])

  const filteredAmps = useMemo(
    () => {
      return amplifierLibrary.filter(amp => {
        const matchesSearch = activeSearchQuery === '' || 
          amp.brand.toLowerCase().includes(activeSearchQuery.toLowerCase()) ||
          amp.model.toLowerCase().includes(activeSearchQuery.toLowerCase()) ||
          amp.type.toLowerCase().includes(activeSearchQuery.toLowerCase()) ||
          amp.description.toLowerCase().includes(activeSearchQuery.toLowerCase())
        const matchesType = selectedType === undefined || amp.type === selectedType
        const matchesBrand = selectedBrand === undefined || amp.brand === selectedBrand
        return matchesSearch && matchesType && matchesBrand
      })
    },
    [activeSearchQuery, selectedType, selectedBrand]
  )

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Bibliothèque d'Amplis"
      className="flex flex-col"
      bodyClassName="overflow-y-auto flex-1 p-4 min-h-0"
    >
      {!searchQuery && (
        <div className="p-4 border-b border-black/10 dark:border-white/10 shrink-0">
          <div className="relative flex items-center mb-4">
            <Search size={18} className="absolute left-4 text-black/40 dark:text-white/40 pointer-events-none" />
            <input
              type="text"
              placeholder="Rechercher par marque, modèle ou type..."
              value={internalSearchQuery}
              onChange={(e) => setInternalSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-[#f5f5f5] dark:bg-gray-700 border-2 border-black/10 dark:border-white/10 rounded-lg text-black/85 dark:text-white/85 text-sm transition-all duration-200 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05),inset_-2px_-2px_4px_rgba(255,255,255,0.8)] dark:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.5),inset_-2px_-2px_4px_rgba(60,60,60,0.5)] focus:outline-none focus:border-black/20 dark:focus:border-white/20 focus:bg-white dark:focus:bg-gray-600 focus:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.08),inset_-2px_-2px_4px_rgba(255,255,255,1),0_0_0_2px_rgba(0,0,0,0.05)] dark:focus:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.6),inset_-2px_-2px_4px_rgba(70,70,70,0.6),0_0_0_2px_rgba(255,255,255,0.1)] placeholder:text-black/40 dark:placeholder:text-white/40"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-2">
                Style d'ampli
              </label>
              <Dropdown
                options={typeOptions}
                value={selectedType || ''}
                placeholder="Tous les styles"
                onChange={(value) => setSelectedType(value === '' ? undefined : value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-2">
                Marque
              </label>
              <Dropdown
                options={brandOptions}
                value={selectedBrand || ''}
                placeholder="Toutes les marques"
                onChange={(value) => setSelectedBrand(value === '' ? undefined : value)}
              />
            </div>
          </div>
        </div>
      )}

      <div className="overflow-y-auto flex-1 p-4 min-h-0">
        {filteredAmps.length === 0 ? (
          <div className="text-center py-12 text-black/50 dark:text-white/50 text-base">
            Aucun ampli trouvé
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
        {filteredAmps.map(amp => (
          <button
            key={amp.id}
            onClick={() => {
              onSelectAmplifier(amp.id)
              onClose()
            }}
            className="bg-white dark:bg-gray-800 border-2 rounded-xl p-0 cursor-pointer transition-all duration-300 overflow-hidden text-left"
            style={{ 
              borderColor: amp.color,
              boxShadow: document.documentElement.classList.contains('dark')
                ? (selectedAmplifier === amp.id 
                  ? '8px 8px 16px rgba(0, 0, 0, 0.5), -8px -8px 16px rgba(40, 40, 40, 0.5), inset 0 0 0 1px rgba(60, 60, 60, 0.8), 0 0 0 2px ' + amp.color
                  : '2px 2px 4px rgba(0, 0, 0, 0.5), -2px -2px 4px rgba(60, 60, 60, 0.5)')
                : (selectedAmplifier === amp.id 
                  ? '8px 8px 16px rgba(0, 0, 0, 0.15), -8px -8px 16px rgba(255, 255, 255, 0.9), inset 0 0 0 1px rgba(255, 255, 255, 0.8), 0 0 0 2px ' + amp.color
                  : '2px 2px 4px rgba(0, 0, 0, 0.08), -2px -2px 4px rgba(255, 255, 255, 0.9)')
            }}
            onMouseEnter={(e) => {
              if (selectedAmplifier !== amp.id) {
                e.currentTarget.style.boxShadow = document.documentElement.classList.contains('dark')
                  ? '3px 3px 6px rgba(0, 0, 0, 0.6), -3px -3px 6px rgba(70, 70, 70, 0.6)'
                  : '3px 3px 6px rgba(0, 0, 0, 0.1), -3px -3px 6px rgba(255, 255, 255, 1)'
                e.currentTarget.style.transform = 'translateY(-4px)'
              }
            }}
            onMouseLeave={(e) => {
              if (selectedAmplifier !== amp.id) {
                e.currentTarget.style.boxShadow = document.documentElement.classList.contains('dark')
                  ? '2px 2px 4px rgba(0, 0, 0, 0.5), -2px -2px 4px rgba(60, 60, 60, 0.5)'
                  : '2px 2px 4px rgba(0, 0, 0, 0.08), -2px -2px 4px rgba(255, 255, 255, 0.9)'
                e.currentTarget.style.transform = 'translateY(0)'
              }
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.boxShadow = document.documentElement.classList.contains('dark')
                ? 'inset 2px 2px 4px rgba(0, 0, 0, 0.5), inset -2px -2px 4px rgba(60, 60, 60, 0.5)'
                : 'inset 2px 2px 4px rgba(0, 0, 0, 0.1), inset -2px -2px 4px rgba(255, 255, 255, 0.5)'
              e.currentTarget.style.transform = 'scale(0.98)'
            }}
            onMouseUp={(e) => {
              if (selectedAmplifier === amp.id) {
                e.currentTarget.style.boxShadow = document.documentElement.classList.contains('dark')
                  ? '8px 8px 16px rgba(0, 0, 0, 0.5), -8px -8px 16px rgba(40, 40, 40, 0.5), inset 0 0 0 1px rgba(60, 60, 60, 0.8), 0 0 0 2px ' + amp.color
                  : '8px 8px 16px rgba(0, 0, 0, 0.15), -8px -8px 16px rgba(255, 255, 255, 0.9), inset 0 0 0 1px rgba(255, 255, 255, 0.8), 0 0 0 2px ' + amp.color
              } else {
                e.currentTarget.style.boxShadow = document.documentElement.classList.contains('dark')
                  ? '2px 2px 4px rgba(0, 0, 0, 0.5), -2px -2px 4px rgba(60, 60, 60, 0.5)'
                  : '2px 2px 4px rgba(0, 0, 0, 0.08), -2px -2px 4px rgba(255, 255, 255, 0.9)'
              }
              e.currentTarget.style.transform = 'scale(1)'
            }}
          >
            <div className="p-4 border-b border-black/10 dark:border-white/10" style={{ backgroundColor: amp.color }}>
              <div className="text-xs text-white/90 uppercase tracking-[1px] mb-1 font-semibold">{amp.brand}</div>
              <div className="text-lg text-white font-bold mb-1">{amp.model}</div>
              <div className="text-[0.625rem] text-white/70 uppercase tracking-[0.5px]">{amp.type === 'combo' ? 'Combo' : 'Head'}</div>
            </div>
            <div className="px-3 py-3 text-xs text-black/60 dark:text-white/60 leading-relaxed">{amp.description}</div>
          </button>
        ))}
          </div>
        )}
      </div>
    </Modal>
  )
}
