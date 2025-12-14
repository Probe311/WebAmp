// Service LMS pour gérer les cours et la progression
import { supabase, Course, Lesson, QuizQuestion, UserProgress, UserStats, UserQuizAttempt, CourseReward } from './supabase'

class LMSService {
  /**
   * Récupère tous les cours publiés
   */
  async getCourses(filters?: {
    category?: string
    difficulty?: string
    search?: string
  }): Promise<Course[]> {
    let query = supabase
      .from('courses')
      .select('*')
      .eq('is_published', true)
      .order('order_index', { ascending: true })

    if (filters?.category) {
      query = query.eq('category', filters.category)
    }

    if (filters?.difficulty) {
      query = query.eq('difficulty', filters.difficulty)
    }

    if (filters?.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,tags.cs.{${filters.search}}`)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching courses:', error)
      return []
    }

    return data || []
  }

  /**
   * Récupère un cours par ID avec ses leçons
   */
  async getCourseWithLessons(courseId: string): Promise<Course & { lessons: Lesson[] } | null> {
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('*')
      .eq('id', courseId)
      .eq('is_published', true)
      .single()

    if (courseError || !course) {
      console.error('Error fetching course:', courseError)
      return null
    }

    const { data: lessons, error: lessonsError } = await supabase
      .from('lessons')
      .select('*')
      .eq('course_id', courseId)
      .order('order_index', { ascending: true })

    if (lessonsError) {
      console.error('Error fetching lessons:', lessonsError)
    }

    return {
      ...course,
      lessons: lessons || []
    }
  }

  /**
   * Récupère les questions d'un quiz
   */
  async getQuizQuestions(courseId: string): Promise<QuizQuestion[]> {
    const { data, error } = await supabase
      .from('quiz_questions')
      .select('*')
      .eq('course_id', courseId)
      .order('order_index', { ascending: true })

    if (error) {
      console.error('Error fetching quiz questions:', error)
      return []
    }

    return data || []
  }

  /**
   * Récupère la progression d'un utilisateur pour un cours
   */
  async getUserProgress(userId: string, courseId: string): Promise<UserProgress[]> {
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('course_id', courseId)

    if (error) {
      console.error('Error fetching user progress:', error)
      return []
    }

    return data || []
  }

  /**
   * Met à jour la progression d'un utilisateur
   */
  async updateProgress(
    userId: string,
    courseId: string,
    lessonId: string | null,
    progress: number,
    isCompleted: boolean = false
  ): Promise<UserProgress | null> {
    const progressData = {
      user_id: userId,
      course_id: courseId,
      lesson_id: lessonId,
      progress_percentage: progress,
      is_completed: isCompleted,
      completed_at: isCompleted ? new Date().toISOString() : null,
      updated_at: new Date().toISOString()
    }

    // Vérifier si une entrée existe déjà
    const { data: existing } = await supabase
      .from('user_progress')
      .select('id')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .eq('lesson_id', lessonId)
      .single()

    let result
    if (existing) {
      // Mettre à jour
      const { data, error } = await supabase
        .from('user_progress')
        .update(progressData)
        .eq('id', existing.id)
        .select()
        .single()

      if (error) {
        console.error('Error updating progress:', error)
        return null
      }
      result = data
    } else {
      // Créer
      const { data, error } = await supabase
        .from('user_progress')
        .insert(progressData)
        .select()
        .single()

      if (error) {
        console.error('Error creating progress:', error)
        return null
      }
      result = data
    }

    // Mettre à jour les statistiques utilisateur
    await this.updateUserStats(userId)

    return result
  }

  /**
   * Enregistre une tentative de quiz
   */
  async saveQuizAttempt(
    userId: string,
    courseId: string,
    score: number,
    totalQuestions: number,
    correctAnswers: number,
    answers: Record<string, number>
  ): Promise<UserQuizAttempt | null> {
    const { data, error } = await supabase
      .from('user_quiz_attempts')
      .insert({
        user_id: userId,
        course_id: courseId,
        score,
        total_questions: totalQuestions,
        correct_answers: correctAnswers,
        answers
      })
      .select()
      .single()

    if (error) {
      console.error('Error saving quiz attempt:', error)
      return null
    }

    // Mettre à jour les statistiques
    await this.updateUserStats(userId)

    return data
  }

  /**
   * Récupère les statistiques d'un utilisateur
   * Note: RLS garantit que seul l'utilisateur authentifié peut voir ses propres stats
   */
  async getUserStats(userId: string): Promise<UserStats | null> {
    const { data, error } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()

    if (error) {
      // Créer les stats si elles n'existent pas (code PGRST116 = no rows returned)
      if (error.code === 'PGRST116' || error.code === '42P01') {
        return await this.createUserStats(userId)
      }
      console.error('Error fetching user stats:', error)
      return null
    }

    // Si aucune donnée, créer les stats
    if (!data) {
      return await this.createUserStats(userId)
    }

    return data
  }

  /**
   * Crée les statistiques initiales pour un utilisateur
   * Note: RLS garantit que seul l'utilisateur authentifié peut créer ses propres stats
   */
  async createUserStats(userId: string): Promise<UserStats | null> {
    // Utiliser upsert pour éviter les erreurs si les stats existent déjà
    const { data, error } = await supabase
      .from('user_stats')
      .upsert({
        user_id: userId,
        total_xp: 0,
        courses_completed: 0,
        lessons_completed: 0,
        quizzes_completed: 0,
        badges: [],
        current_streak: 0,
        last_activity_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating user stats:', error)
      return null
    }

    return data
  }

  /**
   * Met à jour les statistiques d'un utilisateur
   */
  async updateUserStats(userId: string): Promise<void> {
    // Calculer les statistiques depuis les tables de progression
    const { data: progress } = await supabase
      .from('user_progress')
      .select('course_id, is_completed')
      .eq('user_id', userId)

    const { data: quizAttempts } = await supabase
      .from('user_quiz_attempts')
      .select('course_id')
      .eq('user_id', userId)

    const { data: rewards } = await supabase
      .from('course_rewards')
      .select('xp, badges')
      .in('course_id', progress?.filter(p => p.is_completed).map(p => p.course_id) || [])

    const totalXP = rewards?.reduce((sum, r) => sum + (r.xp || 0), 0) || 0
    const coursesCompleted = new Set(progress?.filter(p => p.is_completed).map(p => p.course_id)).size
    const lessonsCompleted = progress?.filter(p => p.is_completed).length || 0
    const quizzesCompleted = new Set(quizAttempts?.map(q => q.course_id)).size
    const badges = rewards?.flatMap(r => r.badges || []).filter((v, i, a) => a.indexOf(v) === i) || []

    await supabase
      .from('user_stats')
      .upsert({
        user_id: userId,
        total_xp: totalXP,
        courses_completed: coursesCompleted,
        lessons_completed: lessonsCompleted,
        quizzes_completed: quizzesCompleted,
        badges,
        last_activity_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
  }

  /**
   * Récupère les récompenses d'un cours
   */
  async getCourseRewards(courseId: string): Promise<CourseReward | null> {
    const { data, error } = await supabase
      .from('course_rewards')
      .select('*')
      .eq('course_id', courseId)
      .single()

    if (error) {
      console.error('Error fetching course rewards:', error)
      return null
    }

    return data
  }

  /**
   * Récupère toutes les récompenses pour une liste de cours en une seule requête
   */
  async getAllCourseRewards(courseIds: string[]): Promise<Map<string, CourseReward>> {
    if (courseIds.length === 0) {
      return new Map()
    }

    const { data, error } = await supabase
      .from('course_rewards')
      .select('*')
      .in('course_id', courseIds)

    if (error) {
      console.error('Error fetching all course rewards:', error)
      return new Map()
    }

    // Convertir en Map pour un accès rapide
    const rewardsMap = new Map<string, CourseReward>()
    if (data) {
      data.forEach((reward) => {
        rewardsMap.set(reward.course_id, reward)
      })
    }

    return rewardsMap
  }

  /**
   * Récupère une tablature par ID ou slug
   */
  async getTablature(tablatureId: string): Promise<any | null> {
    // Détecter si c'est un UUID (format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(tablatureId)
    
    let data: any = null
    let error: any = null

    if (isUUID) {
      // Chercher par ID (UUID)
      const result = await supabase
        .from('tablatures')
        .select('*')
        .eq('id', tablatureId)
        .maybeSingle()
      data = result.data
      error = result.error
    } else {
      // Chercher directement par slug (évite l'erreur 400 avec un UUID invalide)
      const result = await supabase
        .from('tablatures')
        .select('*')
        .eq('slug', tablatureId)
        .maybeSingle()
      data = result.data
      error = result.error
      
      // Si pas trouvé par slug, essayer par ID au cas où
      if (!data && !error) {
        const idResult = await supabase
          .from('tablatures')
          .select('*')
          .eq('id', tablatureId)
          .maybeSingle()
        if (idResult.data) {
          data = idResult.data
        }
      }
    }

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching tablature:', error)
      return null
    }

    return data
  }

  /**
   * Récupère les mesures d'une tablature avec pagination
   * @param tablatureId ID de la tablature
   * @param page Numéro de page (commence à 0)
   * @param pageSize Nombre de mesures par page
   */
  async getTablatureMeasures(
    tablatureId: string,
    page: number = 0,
    pageSize: number = 16
  ): Promise<{ measures: any[]; total: number; hasMore: boolean }> {
    const { data, error } = await supabase
      .from('tablatures')
      .select('measures')
      .eq('id', tablatureId)
      .single()

    if (error || !data) {
      console.error('Error fetching tablature measures:', error)
      return { measures: [], total: 0, hasMore: false }
    }

    const allMeasures = data.measures || []
    const total = allMeasures.length
    const startIndex = page * pageSize
    const endIndex = startIndex + pageSize
    const measures = allMeasures.slice(startIndex, endIndex)
    const hasMore = endIndex < total

    return {
      measures,
      total,
      hasMore
    }
  }

  /**
   * Récupère les tablatures associées à un cours ou une leçon
   * @param courseId ID du cours
   * @param lessonId ID de la leçon (optionnel)
   */
  async getCourseTablatures(courseId: string, lessonId?: string): Promise<any[]> {
    let query = supabase
      .from('course_tablatures')
      .select(`
        tablature_id,
        tablatures (*)
      `)
      .eq('course_id', courseId)

    if (lessonId) {
      query = query.eq('lesson_id', lessonId)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching course tablatures:', error)
      return []
    }

    return (data || []).map((item: any) => item.tablatures).filter(Boolean)
  }

  /**
   * Génère un UUID v4 basé sur un seed (pour avoir des IDs déterministes)
   * ou utilise directement le slug si le schéma accepte TEXT
   */
  private generateTablatureId(slug: string): string {
    // Pour l'instant, on utilise le slug directement
    // Si le schéma Supabase utilise UUID, il faudra générer un UUID déterministe
    // ou modifier le schéma pour accepter TEXT
    return slug
  }

  /**
   * Sauvegarde une tablature dans Supabase
   * @param tablatureData Données de la tablature à sauvegarder
   */
  async saveTablature(tablatureData: {
    id: string
    title: string
    artist?: string
    tempo?: number
    time_signature?: string
    key?: string
    preset_id?: string
    measures?: any[]
    songsterrUrl?: string
    songsterrId?: number
  }): Promise<{ success: boolean; error?: any }> {
    try {
      // Extraire l'ID Songsterr depuis l'URL si disponible
      let songsterrId = tablatureData.songsterrId
      if (!songsterrId && tablatureData.songsterrUrl) {
        const match = tablatureData.songsterrUrl.match(/tab-s(\d+)/)
        if (match) {
          songsterrId = parseInt(match[1], 10)
        }
      }

      // Générer l'ID de la tablature (utiliser le slug fourni ou générer un UUID)
      const tablatureId = this.generateTablatureId(tablatureData.id)

      const insertData: any = {
        id: tablatureId,
        title: tablatureData.title,
        artist: tablatureData.artist || null,
        tempo: tablatureData.tempo || null,
        time_signature: tablatureData.time_signature || '4/4',
        key: tablatureData.key || null,
        preset_id: tablatureData.preset_id || null,
        measures: tablatureData.measures || [],
        songsterr_id: songsterrId || null,
        songsterr_url: tablatureData.songsterrUrl || null,
        slug: tablatureData.id, // Stocker le slug original
        updated_at: new Date().toISOString()
      }

      const { error } = await supabase
        .from('tablatures')
        .upsert(insertData, {
          onConflict: 'id'
        })

      if (error) {
        console.error('Error saving tablature:', error)
        // Si l'erreur est due au type UUID, essayer avec slug comme ID alternatif
        if (error.code === '22P02' || error.message?.includes('invalid input syntax for type uuid')) {
          console.warn('UUID error, trying to use slug as alternative identifier')
          // Essayer de trouver par slug d'abord
          const { data: existing } = await supabase
            .from('tablatures')
            .select('id')
            .eq('slug', tablatureData.id)
            .maybeSingle()
          
          if (existing) {
            // Mettre à jour l'existante
            const { error: updateError } = await supabase
              .from('tablatures')
              .update({
                ...insertData,
                id: existing.id // Garder l'ID UUID existant
              })
              .eq('id', existing.id)
            
            if (updateError) {
              console.error('Error updating existing tablature:', updateError)
              return { success: false, error: updateError }
            }
            return { success: true }
          }
        }
        return { success: false, error }
      }

      return { success: true }
    } catch (error) {
      console.error('Error saving tablature:', error)
      return { success: false, error }
    }
  }

  /**
   * Associe une tablature à un cours et une leçon
   * @param courseId ID du cours
   * @param tablatureId ID de la tablature
   * @param lessonId ID de la leçon (optionnel)
   */
  async associateTablatureToCourse(
    courseId: string,
    tablatureId: string,
    lessonId?: string
  ): Promise<{ success: boolean; error?: any }> {
    try {
      const { error } = await supabase
        .from('course_tablatures')
        .upsert({
          course_id: courseId,
          tablature_id: tablatureId,
          lesson_id: lessonId || null
        }, {
          onConflict: 'course_id,tablature_id,lesson_id'
        })

      if (error) {
        console.error('Error associating tablature to course:', error)
        return { success: false, error }
      }

      return { success: true }
    } catch (error) {
      console.error('Error associating tablature to course:', error)
      return { success: false, error }
    }
  }
}

export const lmsService = new LMSService()

