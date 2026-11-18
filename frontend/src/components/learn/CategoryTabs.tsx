import { TutorialCategory, categoryLabels, categoryIcons } from '../../data/tutorials'
import * as LucideIcons from 'lucide-react'
import { LucideIcon } from 'lucide-react'
import { FILTER_ROW_CLASS, filterChipClass } from './filterChip'

interface CategoryTabsProps {
  categories: TutorialCategory[]
  activeCategory: TutorialCategory | 'all'
  onCategoryChange: (category: TutorialCategory | 'all') => void
}

/** Filtre de typologie — même puce que `DifficultyFilter`. */
export function CategoryTabs({ categories, activeCategory, onCategoryChange }: CategoryTabsProps) {
  return (
    <div className={FILTER_ROW_CLASS}>
      <button
        type="button"
        aria-pressed={activeCategory === 'all'}
        onClick={() => onCategoryChange('all')}
        className={filterChipClass(activeCategory === 'all')}
      >
        Tous
      </button>

      {categories.map((category) => {
        const iconName = categoryIcons[category] || 'BookOpen'
        const Icon = (LucideIcons[iconName as keyof typeof LucideIcons] || LucideIcons.BookOpen) as LucideIcon
        const isActive = activeCategory === category

        return (
          <button
            key={category}
            type="button"
            aria-pressed={isActive}
            onClick={() => onCategoryChange(category)}
            className={filterChipClass(isActive)}
          >
            <Icon size={16} aria-hidden="true" />
            <span>{categoryLabels[category]}</span>
          </button>
        )
      })}
    </div>
  )
}
