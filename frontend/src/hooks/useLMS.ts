// Hook React pour utiliser le service LMS
import { useState, useEffect } from 'react'
import { lmsService } from '../services/lms'
import { Course as CourseType, Lesson, UserProgress, UserStats, supabase } from '../services/supabase'
import { useAuth } from '../auth'

export function useLMS() {
  // On s'appuie sur le système d'auth global (AuthProvider)
  const { user, loading, authEnabled } = useAuth()

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
    setRefreshKey(prev => prev + 1)
  }

  useEffect(() => {
    const loadCourse = async () => {
      setLoading(true)
      const data = await lmsService.getCourseWithLessons(courseId)
      if (data?.lessons) {
        const tablatureLesson = data.lessons.find(l => 
          l.title.includes('tablature') || 
          l.title.includes('progression complète') ||
          l.id === '913ebd57-4fc9-4162-b071-84647dbbf108'
        )
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

export function useUserStats(userId: string | undefined, refreshKey: number = 0) {
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      if (!userId) {
        setLoading(false)
        return
      }

      setLoading(true)
      const data = await lmsService.getUserStats(userId)
      setStats(data)
      setLoading(false)
    }

    loadStats()
  }, [userId, refreshKey])

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
      
      if (!supabase) {
        setLoading(false)
        return
      }
      
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
      if (!supabase) {
        setLoading(false)
        return
      }
      
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
export function useAllCoursesProgress(userId: string | undefined, refreshKey: number = 0) {
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
      
      if (!supabase) {
        setLoading(false)
        return
      }
      
      // Récupérer toutes les progressions de l'utilisateur, groupées par course_id
      // On prend la progression la plus récente pour chaque cours
      const { data: progressData, error: progressError } = await supabase
        .from('user_progress')
        .select('course_id, progress_percentage, is_completed, updated_at')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })

      if (progressError) {
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
  }, [userId, refreshKey])

  return { progressMap, loading }
}

