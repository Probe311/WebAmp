import { Search, Filter } from 'lucide-react'
import { Block } from '../Block'

export interface GalleryFilter {
  category: 'all' | 'brands' | 'styles' | 'courses'
  premium: 'all' | 'premium' // Retiré 'free' - boutique uniquement
}

interface GalleryFiltersProps {
  searchQuery: string
  filter: GalleryFilter
  onSearchChange: (query: string) => void
  onFilterChange: (filter: GalleryFilter) => void
}

export function GalleryFilters({
  searchQuery,
  filter,
  onSearchChange,
  onFilterChange
}: GalleryFiltersProps) {
  const handleCategoryChange = (category: GalleryFilter['category']) => {
    onFilterChange({ ...filter, category })
  }

  const handlePremiumChange = (premium: GalleryFilter['premium']) => {
    onFilterChange({ ...filter, premium })
  }

  return (
    <Block className="p-4">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Recherche */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black/40 dark:text-white/40" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Rechercher un pack..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-gray-800 border border-black/10 dark:border-white/10 text-black dark:text-white placeholder-black/40 dark:placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Filtres */}
        <div className="flex items-center gap-2">
          <Filter className="text-black/60 dark:text-white/60" size={20} />
          
          {/* Catégorie */}
          <select
            value={filter.category}
            onChange={(e) => handleCategoryChange(e.target.value as GalleryFilter['category'])}
            className="px-4 py-2 rounded-xl bg-white dark:bg-gray-800 border border-black/10 dark:border-white/10 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">Toutes les catégories</option>
            <option value="brands">Marques</option>
            <option value="styles">Styles</option>
            <option value="courses">Cours</option>
          </select>

          {/* Premium - Boutique uniquement */}
          <select
            value={filter.premium}
            onChange={(e) => handlePremiumChange(e.target.value as GalleryFilter['premium'])}
            className="px-4 py-2 rounded-xl bg-white dark:bg-gray-800 border border-black/10 dark:border-white/10 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">Tous les packs</option>
            <option value="premium">Premium</option>
          </select>
        </div>
      </div>
    </Block>
  )
}

