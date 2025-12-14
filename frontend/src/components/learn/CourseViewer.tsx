// Composant pour afficher un cours complet avec ses leçons depuis Supabase
import { useEffect, useState } from 'react'
import { useCourse, useLMS } from '../../hooks/useLMS'
import { lmsService } from '../../services/lms'
import { TutorialViewer } from './TutorialViewer'
import { QuizViewer } from './QuizViewer'
import { Loader } from '../Loader'
import { courseToTutorial } from '../../utils/courseAdapter'
import { Tutorial } from '../../data/tutorials'

interface CourseViewerProps {
  courseId: string
  onBack: () => void
}

export function CourseViewer({ courseId, onBack }: CourseViewerProps) {
  const { course, loading, refresh } = useCourse(courseId)
  const { userId } = useLMS()
  const [tutorial, setTutorial] = useState<Tutorial | null>(null)

  // Exposer la fonction refresh globalement pour les scripts de correction
  useEffect(() => {
    if (typeof window !== 'undefined') {
      ;(window as any).refreshCourse = refresh
      console.log('✅ Fonction refreshCourse exposée globalement')
    }
  }, [refresh])

  useEffect(() => {
    const loadCourseData = async () => {
      if (!course) return

      console.log('📚 CourseViewer - Chargement des données du cours:', {
        courseId,
        courseTitle: course.title,
        lessonsCount: course.lessons?.length,
        lessons: course.lessons?.map((l: any) => ({ id: l.id, title: l.title, descriptionPreview: l.description.substring(0, 100) }))
      })

      // Charger les questions de quiz si c'est un quiz
      let quizQuestions: any[] = []
      if (course.type === 'quiz') {
        quizQuestions = await lmsService.getQuizQuestions(courseId)
      }

      // Charger les récompenses
      const rewards = await lmsService.getCourseRewards(courseId)

      // Convertir en format Tutorial
      const tutorialData = courseToTutorial(course, course.lessons, quizQuestions, rewards)
      console.log('📚 CourseViewer - Tutorial créé:', {
        id: tutorialData.id,
        title: tutorialData.title,
        stepsCount: tutorialData.content?.steps?.length,
        steps: tutorialData.content?.steps?.map(s => ({ id: s.id, title: s.title, descriptionPreview: s.description.substring(0, 100) }))
      })
      setTutorial(tutorialData)
    }

    loadCourseData()
  }, [course, courseId])

  if (loading || !tutorial) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader size="md" text="Chargement du cours..." showText={true} />
      </div>
    )
  }

  if (tutorial.type === 'quiz') {
    return (
      <QuizViewer
        tutorial={tutorial}
        onBack={onBack}
        onComplete={async (_tutorialId, score) => {
          if (userId) {
            const quizQuestions = await lmsService.getQuizQuestions(courseId)
            await lmsService.saveQuizAttempt(
              userId,
              courseId,
              score,
              quizQuestions.length,
              Math.round((score / 100) * quizQuestions.length),
              {} // TODO: Sauvegarder les réponses individuelles
            )
          }
          onBack()
        }}
      />
    )
  }

  return (
    <TutorialViewer
      tutorial={tutorial}
      onBack={onBack}
      onComplete={async (_tutorialId) => {
        if (userId && course) {
          // Marquer le cours comme complété
          await lmsService.updateProgress(
            userId,
            courseId,
            null,
            100,
            true
          )
        }
        onBack()
      }}
      onLoadPreset={(presetId) => {
        console.log('Charger preset:', presetId)
      }}
      onAddPedal={(pedalId) => {
        console.log('Ajouter pédale:', pedalId)
      }}
    />
  )
}

