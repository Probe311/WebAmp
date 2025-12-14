import { useState, useMemo, useEffect } from 'react'
import { TutorialCard } from '../components/learn/TutorialCard'
import { CategoryTabs } from '../components/learn/CategoryTabs'
import { DifficultyFilter } from '../components/learn/DifficultyFilter'
import { SearchBar } from '../components/learn/SearchBar'
import { ProgressBadge } from '../components/learn/ProgressBadge'
import { CourseViewer } from '../components/learn/CourseViewer'
import { LMSDashboard } from '../components/learn/LMSDashboard'
import { Block } from '../components/Block'
import { Loader } from '../components/Loader'
import { useLMS, useCourses, useUserStats, useAllCoursesProgress } from '../hooks/useLMS'
import { lmsService } from '../services/lms'
import { courseToTutorial } from '../utils/courseAdapter'
import type { Course, CourseReward } from '../services/supabase'
import type { TutorialCategory, TutorialDifficulty } from '../data/tutorials'

export function LearnPage() {
  const { userId, isAuthenticated } = useLMS()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<TutorialCategory | 'all'>('all')
  const [activeDifficulty, setActiveDifficulty] = useState<TutorialDifficulty | 'all'>('all')
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)

  // Récupérer les cours depuis Supabase
  const { courses, loading: coursesLoading } = useCourses({
    category: activeCategory !== 'all' ? activeCategory : undefined,
    difficulty: activeDifficulty !== 'all' ? activeDifficulty : undefined,
    search: searchQuery || undefined
  })

  // Récupérer les statistiques utilisateur
  const { stats } = useUserStats(userId)

  // Récupérer toutes les progressions de l'utilisateur
  const { progressMap } = useAllCoursesProgress(userId)

  // Récupérer les récompenses pour tous les cours
  const [rewardsMap, setRewardsMap] = useState<Map<string, CourseReward>>(new Map())
  
  useEffect(() => {
    const loadRewards = async () => {
      if (courses.length === 0) {
        setRewardsMap(new Map())
        return
      }
      
      try {
        // Récupérer toutes les récompenses en une seule requête
        const courseIds = courses.map(c => c.id)
        const rewards = await lmsService.getAllCourseRewards(courseIds)
        setRewardsMap(rewards)
      } catch (error) {
        console.error('Error loading rewards:', error)
        setRewardsMap(new Map())
      }
    }
    
    loadRewards()
  }, [courses])

  // Récupérer toutes les catégories uniques
  const categories = useMemo(() => {
    const cats = new Set<string>()
    courses.forEach((course) => cats.add(course.category))
    return Array.from(cats) as TutorialCategory[]
  }, [courses])

  // Trier les cours par difficulté puis alphabétique
  const sortedCourses = useMemo(() => {
    const difficultyOrder: Record<string, number> = {
      beginner: 1,
      intermediate: 2,
      advanced: 3,
      pro: 4,
    }

    return [...courses].sort((a, b) => {
      const diffA = difficultyOrder[a.difficulty] || 0
      const diffB = difficultyOrder[b.difficulty] || 0
      if (diffA !== diffB) {
        return diffA - diffB
      }
      return a.title.localeCompare(b.title, 'fr', { sensitivity: 'base' })
    })
  }, [courses])

  const handleStartCourse = async (courseId: string) => {
    const course = courses.find(c => c.id === courseId)
    if (course) {
      setSelectedCourse(course)
    }
  }

  const handleBack = () => {
    setSelectedCourse(null)
  }

  // Si un cours est sélectionné, afficher le viewer
  if (selectedCourse) {
    return <CourseViewer courseId={selectedCourse.id} onBack={handleBack} />
  }

  const totalXP = stats?.total_xp || 0
  const completedCount = stats?.courses_completed || 0
  const totalCount = courses.length

  return (
    <div className="h-full overflow-y-auto p-6 pb-32">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-black/85 dark:text-white/90 mb-6">
          Apprendre
        </h1>
        
        <Block className="p-6">
          {/* Barre de recherche */}
          <div className="mb-4">
            <SearchBar 
              value={searchQuery} 
              onChange={setSearchQuery}
              placeholder="Rechercher un tutoriel, guide ou preset..."
            />
          </div>

          {/* Dashboard LMS si authentifié */}
          {isAuthenticated && userId && (
            <div className="mb-6">
              <LMSDashboard userId={userId} />
            </div>
          )}

          {/* Badge de progression */}
          <div className="mb-4">
            <ProgressBadge 
              xp={totalXP}
              completedCount={completedCount}
              totalCount={totalCount}
            />
          </div>

          {/* Filtres */}
          <div className="mb-6 space-y-4">
            {/* Filtre par niveau */}
            <div>
              <h3 className="text-sm font-medium text-black/70 dark:text-white/70 mb-2">
                Niveau
              </h3>
              <DifficultyFilter
                activeDifficulty={activeDifficulty}
                onDifficultyChange={setActiveDifficulty}
              />
            </div>

            {/* Filtre par typologie */}
            <div>
              <h3 className="text-sm font-medium text-black/70 dark:text-white/70 mb-2">
                Typologie
              </h3>
              <CategoryTabs
                categories={categories}
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
              />
            </div>
          </div>

          {/* Contenu */}
          {coursesLoading ? (
            <div className="p-12">
              <Loader size="md" text="Chargement des cours..." showText={true} />
            </div>
          ) : sortedCourses.length === 0 ? (
            <div className="p-12">
              <div className="flex flex-col items-center justify-center text-center">
                <p className="text-lg text-black/70 dark:text-white/70 mb-2">
                  Aucun cours trouvé
                </p>
                <p className="text-sm text-black/50 dark:text-white/50">
                  Essayez de modifier vos critères de recherche
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedCourses.map((course) => {
                // Convertir Course en Tutorial pour TutorialCard
                const tutorial = courseToTutorial(course, [], [], rewardsMap.get(course.id) || null)
                
                // Récupérer la progression de l'utilisateur pour ce cours
                const userProgress = progressMap.get(course.id)
                const progress = userProgress?.progress || 0
                const completed = userProgress?.completed || false
                
                // Calculer l'XP gagnée basée sur la progression
                const reward = rewardsMap.get(course.id)
                const totalXP = reward?.xp || tutorial.rewards.xp || 0
                const earnedXP = Math.floor((progress / 100) * totalXP)
                
                return (
                  <TutorialCard
                    key={course.id}
                    tutorial={tutorial}
                    progress={progress}
                    completed={completed}
                    earnedXP={earnedXP}
                    onStart={handleStartCourse}
                  />
                )
              })}
            </div>
          )}
        </Block>
      </div>
    </div>
  )
}
