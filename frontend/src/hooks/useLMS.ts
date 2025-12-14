// Hook React pour utiliser le service LMS
import { useState, useEffect } from 'react'
import { lmsService } from '../services/lms'
import { supabase, Course as CourseType, Lesson, UserProgress, UserStats } from '../services/supabase'

export function useLMS() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Vérifier l'utilisateur actuel
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setLoading(false)
    })

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  return {
    user,
    loading,
    isAuthenticated: !!user,
    userId: user?.id
  }
}

export function useCourses(filters?: {
  category?: string
  difficulty?: string
  search?: string
}) {
  const [courses, setCourses] = useState<CourseType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCourses = async () => {
      setLoading(true)
      const data = await lmsService.getCourses(filters)
      setCourses(data)
      setLoading(false)
    }

    loadCourses()
  }, [filters?.category, filters?.difficulty, filters?.search])

  return { courses, loading }
}

export function useCourse(courseId: string) {
  const [course, setCourse] = useState<(CourseType & { lessons: Lesson[] }) | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)

  // Exposer une fonction de rechargement
  const refresh = () => {
    console.log('🔄 Rechargement du cours:', courseId)
    setRefreshKey(prev => prev + 1)
  }

  useEffect(() => {
    const loadCourse = async () => {
      setLoading(true)
      console.log('📚 Chargement du cours:', courseId, 'refreshKey:', refreshKey)
      const data = await lmsService.getCourseWithLessons(courseId)
      console.log('📚 Cours chargé:', data ? { id: data.id, title: data.title, lessonsCount: data.lessons?.length } : null)
      if (data?.lessons) {
        console.log('📚 Titres des leçons:', data.lessons.map(l => ({ 
          id: l.id, 
          title: l.title, 
          descriptionPreview: l.description.substring(0, 100),
          hasFullTablature: l.description.includes('[fulltablature:')
        })))
        
        // Log détaillé pour la leçon de tablature
        const tablatureLesson = data.lessons.find(l => 
          l.title.includes('tablature') || 
          l.title.includes('progression complète') ||
          l.id === '913ebd57-4fc9-4162-b071-84647dbbf108'
        )
        if (tablatureLesson) {
          console.log('🎸 Leçon de tablature trouvée:', {
            id: tablatureLesson.id,
            title: tablatureLesson.title,
            description: tablatureLesson.description,
            hasFullTablatureTag: tablatureLesson.description.includes('[fulltablature:')
          })
        }
      }
      setCourse(data)
      setLoading(false)
    }

    if (courseId) {
      loadCourse()
    }
  }, [courseId, refreshKey])

  return { course, loading, refresh }
}

export function useUserProgress(userId: string | undefined, courseId: string) {
  const [progress, setProgress] = useState<UserProgress[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProgress = async () => {
      if (!userId) {
        setLoading(false)
        return
      }

      setLoading(true)
      const data = await lmsService.getUserProgress(userId, courseId)
      setProgress(data)
      setLoading(false)
    }

    loadProgress()
  }, [userId, courseId])

  return { progress, loading }
}

export function useUserStats(userId: string | undefined) {
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      if (!userId) {
        setLoading(false)
        return
      }

      // Vérifier que l'utilisateur est authentifié avant de charger les stats
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user || user.id !== userId) {
        setLoading(false)
        return
      }

      setLoading(true)
      const data = await lmsService.getUserStats(userId)
      setStats(data)
      setLoading(false)
    }

    loadStats()
  }, [userId])

  return { stats, loading }
}

export function useCurrentCourse(userId: string | undefined) {
  const [currentCourse, setCurrentCourse] = useState<(CourseType & { progress: number }) | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCurrentCourse = async () => {
      if (!userId) {
        setLoading(false)
        return
      }

      setLoading(true)
      
      // Récupérer toutes les progressions de l'utilisateur
      const { data: progressData, error: progressError } = await supabase
        .from('user_progress')
        .select('course_id, progress_percentage, is_completed, updated_at')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })

      if (progressError || !progressData || progressData.length === 0) {
        setLoading(false)
        return
      }

      // Trouver le cours non complété avec la progression la plus récente
      const inProgressCourse = progressData.find(p => !p.is_completed)
      
      if (!inProgressCourse) {
        setLoading(false)
        return
      }

      // Récupérer les détails du cours
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('id', inProgressCourse.course_id)
        .eq('is_published', true)
        .single()

      if (courseError || !courseData) {
        setLoading(false)
        return
      }

      setCurrentCourse({
        ...courseData,
        progress: inProgressCourse.progress_percentage
      })
      setLoading(false)
    }

    loadCurrentCourse()
  }, [userId])

  return { currentCourse, loading }
}

/**
 * Hook pour récupérer toutes les progressions de l'utilisateur pour tous les cours
 * Retourne un Map avec course_id comme clé et { progress, completed } comme valeur
 */
export function useAllCoursesProgress(userId: string | undefined) {
  const [progressMap, setProgressMap] = useState<Map<string, { progress: number; completed: boolean }>>(new Map())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadAllProgress = async () => {
      if (!userId) {
        setLoading(false)
        setProgressMap(new Map())
        return
      }

      setLoading(true)
      
      // Récupérer toutes les progressions de l'utilisateur, groupées par course_id
      // On prend la progression la plus récente pour chaque cours
      const { data: progressData, error: progressError } = await supabase
        .from('user_progress')
        .select('course_id, progress_percentage, is_completed, updated_at')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })

      if (progressError) {
        console.error('Error fetching all courses progress:', progressError)
        setLoading(false)
        return
      }

      // Créer un Map avec la progression la plus récente pour chaque cours
      const map = new Map<string, { progress: number; completed: boolean }>()
      
      if (progressData) {
        // Grouper par course_id et garder la progression la plus récente
        const progressByCourse = new Map<string, { course_id: string; progress_percentage: number; is_completed: boolean; updated_at: string }>()
        
        progressData.forEach((p: { course_id: string; progress_percentage: number; is_completed: boolean; updated_at: string }) => {
          const existing = progressByCourse.get(p.course_id)
          if (!existing || new Date(p.updated_at) > new Date(existing.updated_at)) {
            progressByCourse.set(p.course_id, p)
          }
        })
        
        // Convertir en Map avec les valeurs simplifiées
        progressByCourse.forEach((p, courseId) => {
          map.set(courseId, {
            progress: p.progress_percentage,
            completed: p.is_completed
          })
        })
      }

      setProgressMap(map)
      setLoading(false)
    }

    loadAllProgress()
  }, [userId])

  return { progressMap, loading }
}

