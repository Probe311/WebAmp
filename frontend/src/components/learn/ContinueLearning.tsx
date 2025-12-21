import { BookOpen, Play } from 'lucide-react'
import { Block } from '../Block'
import { useCurrentCourse, useAllCoursesProgress, useCourses } from '../../hooks/useLMS'
import { useAuth } from '../../auth/AuthProvider'
import { useMemo, useState, useEffect } from 'react'
import { imageService, ImageSearchResult } from '../../services/imageService'

interface ContinueLearningProps {
  onNavigateToLearn?: () => void
}

export function ContinueLearning({ onNavigateToLearn }: ContinueLearningProps) {
  const { user } = useAuth()
  const { currentCourse, loading: courseLoading } = useCurrentCourse(user?.id)
  const { progressMap } = useAllCoursesProgress(user?.id)
  const { courses, loading: coursesLoading } = useCourses()
  const [backgroundImage, setBackgroundImage] = useState<ImageSearchResult | null>(null)

  // Cours recommandé calculé à partir de la progression globale
  const recommendedCourse = useMemo(() => {
    if (!courses || courses.length === 0) return null

    // Filtrer d'abord les cours non complétés
    const notCompleted = courses.filter((course) => {
      const prog = progressMap.get(course.id)
      return !prog || !prog.completed
    })

    const pool = notCompleted.length > 0 ? notCompleted : courses

    const difficultyOrder: Record<string, number> = {
      beginner: 1,
      intermediate: 2,
      advanced: 3,
      pro: 4
    }

    return [...pool].sort((a, b) => {
      const diffA = difficultyOrder[a.difficulty] || 0
      const diffB = difficultyOrder[b.difficulty] || 0
      if (diffA !== diffB) return diffA - diffB
      return a.title.localeCompare(b.title, 'fr', { sensitivity: 'base' })
    })[0]
  }, [courses, progressMap])

  // Charger l'image de fond basée sur le cours actuel ou recommandé
  useEffect(() => {
    const loadBackgroundImage = async () => {
      const courseToUse = currentCourse || recommendedCourse
      
      try {
        let image: ImageSearchResult | null = null
        
        if (courseToUse) {
          // Image spécifique au cours
          image = await imageService.getImageForCourse(
            courseToUse.title,
            courseToUse.category
          )
        } else {
          // Image générique pour l'apprentissage de la guitare
          const results = await imageService.searchImages('guitar lesson music education', 1)
          image = results.length > 0 ? results[0] : null
        }
        
        setBackgroundImage(image)
      } catch (error) {
        console.error('Erreur lors du chargement de l\'image:', error)
        setBackgroundImage(null)
      }
    }

    loadBackgroundImage()
  }, [currentCourse?.id, recommendedCourse?.id])

  const handleResume = () => {
    if (onNavigateToLearn) {
      onNavigateToLearn()
    }
  }

  const handleStart = () => {
    if (onNavigateToLearn) {
      onNavigateToLearn()
    }
  }

  // Si l'utilisateur n'est pas connecté, afficher un message d'invitation
  if (!user) {
    return (
      <Block className="md:col-span-2 lg:col-span-2 min-h-[280px] relative overflow-hidden">
        {/* Image de fond */}
        {backgroundImage && (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 dark:opacity-10 transition-opacity duration-500"
              style={{
                backgroundImage: `url(${backgroundImage.url})`,
              }}
            />
            {/* Overlay pour améliorer la lisibilité */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-white/50 to-white/50 dark:from-gray-800/50 dark:via-gray-800/50 dark:to-gray-800/50" />
          </>
        )}
        
        {/* Contenu */}
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen size={18} className="text-orange-500 dark:text-orange-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-orange-500 dark:text-orange-400">
              Continue Learning
            </span>
          </div>
          <h2 className="text-2xl font-bold text-black/85 dark:text-white/90 mb-2">
            Commencez votre apprentissage
          </h2>
          <p className="text-sm text-black/70 dark:text-white/70 mb-4">
            Connectez-vous pour accéder à nos cours et suivre votre progression.
          </p>
          <button
            onClick={handleStart}
            className="px-4 py-2 bg-orange-500 text-white rounded-xl text-sm font-medium shadow-[2px_2px_4px_rgba(0,0,0,0.2)] hover:shadow-[3px_3px_6px_rgba(0,0,0,0.3)] transition-all duration-200 flex items-center gap-2"
          >
            <Play size={16} />
            Découvrir les cours
          </button>
        </div>
      </Block>
    )
  }

  // Si chargement en cours
  if (courseLoading || coursesLoading) {
    return (
      <Block className="md:col-span-2 lg:col-span-2 min-h-[280px]">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen size={18} className="text-orange-500 dark:text-orange-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-orange-500 dark:text-orange-400">
            Continue Learning
          </span>
        </div>
        <div className="text-center text-black/50 dark:text-white/50 py-8">
          Chargement...
        </div>
      </Block>
    )
  }

  // Si l'utilisateur a un cours en cours
  if (currentCourse) {
    return (
      <Block className="md:col-span-2 lg:col-span-2 min-h-[280px] relative overflow-hidden">
        {/* Image de fond */}
        {backgroundImage && (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 dark:opacity-10 transition-opacity duration-500"
              style={{
                backgroundImage: `url(${backgroundImage.url})`,
              }}
            />
            {/* Overlay pour améliorer la lisibilité */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/10 to-white/50 dark:from-gray-800/50 dark:via-gray-800/50 dark:to-gray-800/50" />
          </>
        )}
        
        {/* Contenu */}
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen size={18} className="text-orange-500 dark:text-orange-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-orange-500 dark:text-orange-400">
              Continue Learning
            </span>
          </div>
          <h2 className="text-2xl font-bold text-black/85 dark:text-white/90 mb-2">
            {currentCourse.title}
          </h2>
          <p className="text-sm text-black/70 dark:text-white/70 mb-4">
            {currentCourse.description || 'Continuez votre apprentissage'}
          </p>
          
          {/* Barre de progression */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-black/70 dark:text-white/70">Progression</span>
              <span className="text-xs font-bold text-black/85 dark:text-white/90">
                {Math.round(currentCourse.progress)}%
              </span>
            </div>
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(currentCourse.progress, 100)}%` }}
              />
            </div>
          </div>

          <button
            onClick={handleResume}
            className="px-4 py-2 bg-orange-500 text-white rounded-xl text-sm font-medium shadow-[2px_2px_4px_rgba(0,0,0,0.2)] hover:shadow-[3px_3px_6px_rgba(0,0,0,0.3)] transition-all duration-200 flex items-center gap-2"
          >
            <Play size={16} />
            Continuer
          </button>
        </div>
      </Block>
    )
  }

  if (recommendedCourse) {
    return (
      <Block className="md:col-span-2 lg:col-span-2 min-h-[280px] relative overflow-hidden">
        {/* Image de fond */}
        {backgroundImage && (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 dark:opacity-10 transition-opacity duration-500"
              style={{
                backgroundImage: `url(${backgroundImage.url})`,
              }}
            />
            {/* Overlay pour améliorer la lisibilité */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-white/50 to-white/50 dark:from-gray-800/50 dark:via-gray-800/50 dark:to-gray-800/50" />
          </>
        )}
        
        {/* Contenu */}
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen size={18} className="text-orange-500 dark:text-orange-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-orange-500 dark:text-orange-400">
              Continue Learning
            </span>
          </div>
          <h2 className="text-2xl font-bold text-black/85 dark:text-white/90 mb-2">
            {recommendedCourse.title}
          </h2>
          <p className="text-sm text-black/70 dark:text-white/70 mb-4">
            {recommendedCourse.description || 'Commencez votre parcours d\'apprentissage'}
          </p>
          <button
            onClick={handleStart}
            className="px-4 py-2 bg-orange-500 text-white rounded-xl text-sm font-medium shadow-[2px_2px_4px_rgba(0,0,0,0.2)] hover:shadow-[3px_3px_6px_rgba(0,0,0,0.3)] transition-all duration-200 flex items-center gap-2"
          >
            <Play size={16} />
            Commencer
          </button>
        </div>
      </Block>
    )
  }

  // Par défaut, afficher un message générique
  return (
    <Block className="md:col-span-2 lg:col-span-2 min-h-[280px] relative overflow-hidden">
      {/* Image de fond */}
      {backgroundImage && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 dark:opacity-10 transition-opacity duration-500"
            style={{
              backgroundImage: `url(${backgroundImage.url})`,
            }}
          />
          {/* Overlay pour améliorer la lisibilité */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/60 to-white/80 dark:from-gray-800/90 dark:via-gray-800/80 dark:to-gray-800/90" />
        </>
      )}
      
      {/* Contenu */}
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen size={18} className="text-orange-500 dark:text-orange-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-orange-500 dark:text-orange-400">
            Continue Learning
          </span>
        </div>
        <h2 className="text-2xl font-bold text-black/85 dark:text-white/90 mb-2">
          Explorez nos cours
        </h2>
        <p className="text-sm text-black/70 dark:text-white/70 mb-4">
          Découvrez notre catalogue de cours pour améliorer vos compétences musicales.
        </p>
        <button
          onClick={handleStart}
          className="px-4 py-2 bg-orange-500 text-white rounded-xl text-sm font-medium shadow-[2px_2px_4px_rgba(0,0,0,0.2)] hover:shadow-[3px_3px_6px_rgba(0,0,0,0.3)] transition-all duration-200 flex items-center gap-2"
        >
          <Play size={16} />
          Voir les cours
        </button>
      </div>
    </Block>
  )
}
