import { TutorialCategory, categoryLabels, categoryIcons } from '../../data/tutorials'
import * as LucideIcons from 'lucide-react'
import { LucideIcon } from 'lucide-react'

interface CategoryTabsProps {
  categories: TutorialCategory[]
  activeCategory: TutorialCategory | 'all'
  onCategoryChange: (category: TutorialCategory | 'all') => void
}

export function CategoryTabs({ categories, activeCategory, onCategoryChange }: CategoryTabsProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {/* Tous */}
      <button
        onClick={() => onCategoryChange('all')}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
          transition-all duration-200 whitespace-nowrap touch-manipulation
          ${activeCategory === 'all'
            ? 'bg-orange-500 text-white shadow-lg'
            : 'bg-white dark:bg-gray-700 text-black/70 dark:text-white/70 hover:bg-gray-100 dark:hover:bg-gray-600'
          }
        `}
      >
        Tous
      </button>

      {/* Catégories */}
      {categories.map((category) => {
        const iconName = categoryIcons[category] || 'BookOpen'
        const Icon = (LucideIcons[iconName as keyof typeof LucideIcons] || LucideIcons.BookOpen) as LucideIcon
        const isActive = activeCategory === category

        return (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
              transition-all duration-200 whitespace-nowrap touch-manipulation
              ${isActive
                ? 'bg-orange-500 text-white shadow-lg'
                : 'bg-white dark:bg-gray-700 text-black/70 dark:text-white/70 hover:bg-gray-100 dark:hover:bg-gray-600'
              }
            `}
          >
            <Icon size={16} />
            <span>{categoryLabels[category]}</span>
          </button>
        )
      })}
    </div>
  )
}

