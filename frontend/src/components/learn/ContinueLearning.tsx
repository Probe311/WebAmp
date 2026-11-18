import { BookOpen, Play } from 'lucide-react'
import { Block } from '../Block'
import { useCurrentCourse, useAllCoursesProgress, useCourses } from '../../hooks/useLMS'
import { useAuth } from '../../auth/AuthProvider'
import { useMemo, useState, useEffect, type ReactNode } from 'react'
import { imageService, ImageSearchResult } from '../../services/imageService'

interface ContinueLearningProps {
  onNavigateToLearn?: () => void
}

function LearningChrome({
  title,
  description,
  ctaLabel,
  onAction,
  progress,
}: {
  title: string
  description: string
  ctaLabel: string
  onAction: () => void
  progress?: number
}) {
  return (
    <div className="relative z-10">
      <div className="mb-4 flex items-center gap-2">
        <BookOpen size={18} className="text-[color:var(--neu-accent)]" />
        <span className="text-xs font-bold uppercase tracking-wider text-[color:var(--neu-accent)]">
          Continue Learning
        </span>
      </div>
      <h2 className="mb-2 text-2xl font-bold text-[color:var(--neu-text)]">{title}</h2>
      <p className="mb-4 text-sm text-[color:var(--neu-text-muted)]">{description}</p>

      {typeof progress === 'number' && (
        <div className="mb-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs text-[color:var(--neu-text-muted)]">Progression</span>
            <span className="text-xs font-bold text-[color:var(--neu-text)]">{Math.round(progress)}%</span>
          </div>
          <div className="neu-inset h-2 w-full overflow-hidden rounded-full">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[color:var(--neu-accent)] to-[color:var(--neu-accent-hover)] transition-all duration-500"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={onAction}
        className="neu-accent-btn neu-pill inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-transform duration-200 hover:-translate-y-0.5 active:scale-95"
      >
        <Play size={16} />
        {ctaLabel}
      </button>
    </div>
  )
}

function CardShell({
  backgroundImage,
  children,
}: {
  backgroundImage: ImageSearchResult | null
  children: ReactNode
}) {
  return (
    <Block className="relative min-h-[280px] md:col-span-2 lg:col-span-2">
      {backgroundImage && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl" aria-hidden>
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15 transition-opacity duration-500"
            style={{ backgroundImage: `url(${backgroundImage.url})` }}
          />
          <div className="absolute inset-0 bg-[color:var(--neu-bg)]/75" />
        </div>
      )}
      {children}
    </Block>
  )
}

export function ContinueLearning({ onNavigateToLearn }: ContinueLearningProps) {
  const { user } = useAuth()
  const { currentCourse, loading: courseLoading } = useCurrentCourse(user?.id)
  const { progressMap } = useAllCoursesProgress(user?.id)
  const { courses, loading: coursesLoading } = useCourses()
  const [backgroundImage, setBackgroundImage] = useState<ImageSearchResult | null>(null)

  const recommendedCourse = useMemo(() => {
    if (!courses || courses.length === 0) return null

    const notCompleted = courses.filter((course) => {
      const prog = progressMap.get(course.id)
      return !prog || !prog.completed
    })
    const pool = notCompleted.length > 0 ? notCompleted : courses
    const difficultyOrder: Record<string, number> = {
      beginner: 1,
      intermediate: 2,
      advanced: 3,
      pro: 4,
    }

    return [...pool].sort((a, b) => {
      const diffA = difficultyOrder[a.difficulty] || 0
      const diffB = difficultyOrder[b.difficulty] || 0
      if (diffA !== diffB) return diffA - diffB
      return a.title.localeCompare(b.title, 'fr', { sensitivity: 'base' })
    })[0]
  }, [courses, progressMap])

  useEffect(() => {
    const loadBackgroundImage = async () => {
      const courseToUse = currentCourse || recommendedCourse
      try {
        let image: ImageSearchResult | null = null
        if (courseToUse) {
          image = await imageService.getImageForCourse(courseToUse.title, courseToUse.category)
        } else {
          const results = await imageService.searchImages('guitar lesson music education', 1)
          image = results.length > 0 ? results[0] : null
        }
        setBackgroundImage(image)
      } catch (error) {
        console.error("Erreur lors du chargement de l'image:", error)
        setBackgroundImage(null)
      }
    }

    loadBackgroundImage()
  }, [currentCourse?.id, recommendedCourse?.id])

  const goLearn = () => onNavigateToLearn?.()

  if (!user) {
    return (
      <CardShell backgroundImage={backgroundImage}>
        <LearningChrome
          title="Commencez votre apprentissage"
          description="Connectez-vous pour accéder à nos cours et suivre votre progression."
          ctaLabel="Découvrir les cours"
          onAction={goLearn}
        />
      </CardShell>
    )
  }

  if (courseLoading || coursesLoading) {
    return (
      <Block className="min-h-[280px] md:col-span-2 lg:col-span-2">
        <div className="mb-4 flex items-center gap-2">
          <BookOpen size={18} className="text-[color:var(--neu-accent)]" />
          <span className="text-xs font-bold uppercase tracking-wider text-[color:var(--neu-accent)]">
            Continue Learning
          </span>
        </div>
        <div className="py-8 text-center text-[color:var(--neu-text-faint)]">Chargement...</div>
      </Block>
    )
  }

  if (currentCourse) {
    return (
      <CardShell backgroundImage={backgroundImage}>
        <LearningChrome
          title={currentCourse.title}
          description={currentCourse.description || 'Continuez votre apprentissage'}
          ctaLabel="Continuer"
          onAction={goLearn}
          progress={currentCourse.progress}
        />
      </CardShell>
    )
  }

  if (recommendedCourse) {
    return (
      <CardShell backgroundImage={backgroundImage}>
        <LearningChrome
          title={recommendedCourse.title}
          description={recommendedCourse.description || "Commencez votre parcours d'apprentissage"}
          ctaLabel="Commencer"
          onAction={goLearn}
        />
      </CardShell>
    )
  }

  return (
    <CardShell backgroundImage={backgroundImage}>
      <LearningChrome
        title="Explorez nos cours"
        description="Découvrez notre catalogue de cours pour améliorer vos compétences musicales."
        ctaLabel="Voir les cours"
        onAction={goLearn}
      />
    </CardShell>
  )
}
