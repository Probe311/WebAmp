import { useState } from 'react'
import { cabinetLibrary, CabinetModel } from '../data/cabinets'
import { Modal } from './Modal'
import { Slider } from './Slider'

interface CabinetSelectorProps {
  selectedCabinets: string[]
  onCabinetsChange: (cabinetIds: string[]) => void
  onMixChange: (mixes: number[]) => void
  mixes: number[]
}

export function CabinetSelector({
  selectedCabinets,
  onCabinetsChange,
  onMixChange,
  mixes
}: CabinetSelectorProps) {
  const [showModal, setShowModal] = useState(false)
  const [selectedBrand, setSelectedBrand] = useState<string | undefined>(undefined)

  const selectedCabinetModels = selectedCabinets
    .map(id => cabinetLibrary.find(c => c.id === id))
    .filter(Boolean) as CabinetModel[]

  const brands = Array.from(new Set(cabinetLibrary.map(c => c.brand)))

  const handleSelectCabinet = (cabinetId: string) => {
    if (selectedCabinets.includes(cabinetId)) {
      // Retirer
      const newCabinets = selectedCabinets.filter(id => id !== cabinetId)
      const newMixes = mixes.filter((_, i) => selectedCabinets[i] !== cabinetId)
      onCabinetsChange(newCabinets)
      onMixChange(newMixes)
    } else {
      // Ajouter (max 4 cabinets pour mix)
      if (selectedCabinets.length < 4) {
        onCabinetsChange([...selectedCabinets, cabinetId])
        onMixChange([...mixes, 100 / (selectedCabinets.length + 1)])
      }
    }
  }

  const handleMixChange = (index: number, value: number) => {
    const newMixes = [...mixes]
    newMixes[index] = value
    onMixChange(newMixes)
  }

  return (
    <div className="cabinet-selector">
      <button
        onClick={() => setShowModal(true)}
        className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
      >
        Cabinets ({selectedCabinets.length})
      </button>

      {selectedCabinetModels.length > 0 && (
        <div className="mt-2 space-y-2">
          {selectedCabinetModels.map((cabinet, index) => (
            <div key={cabinet.id} className="flex items-center gap-2">
              <span className="text-sm text-black/70 dark:text-white/70">
                {cabinet.brand} {cabinet.model}
              </span>
              <Slider
                value={mixes[index] || 50}
                min={0}
                max={100}
                label="Mix"
                onChange={(value) => handleMixChange(index, value)}
              />
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Sélectionner un Cabinet"
      >
        <div className="space-y-4">
          <select
            value={selectedBrand || ''}
            onChange={(e) => setSelectedBrand(e.target.value || undefined)}
            className="w-full px-3 py-2 rounded-lg bg-white dark:bg-gray-700 border border-black/10 dark:border-white/10"
          >
            <option value="">Toutes les marques</option>
            {brands.map(brand => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>

          <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto">
            {cabinetLibrary
              .filter(c => !selectedBrand || c.brand === selectedBrand)
              .map(cabinet => (
                <button
                  key={cabinet.id}
                  onClick={() => handleSelectCabinet(cabinet.id)}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    selectedCabinets.includes(cabinet.id)
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="font-semibold text-black dark:text-white">
                    {cabinet.brand} {cabinet.model}
                  </div>
                  <div className="text-sm text-black/70 dark:text-white/70 mt-1">
                    {cabinet.type} - {cabinet.speakers.join(', ')}
                  </div>
                  <div className="text-xs text-black/50 dark:text-white/50 mt-1">
                    {cabinet.description}
                  </div>
                </button>
              ))}
          </div>
        </div>
      </Modal>
    </div>
  )
}

