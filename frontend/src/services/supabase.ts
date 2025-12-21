/**
 * Service Supabase pour le LMS
 * 
 * @deprecated Utilisez getSupabaseClient() depuis lib/supabase.ts à la place
 * Ce fichier est conservé pour compatibilité avec le code existant
 */

import { getSupabaseClient, requireSupabaseClient } from '../lib/supabase'
import type { SupabaseClient } from '@supabase/supabase-js'

// Ré-exporter le client centralisé
export const supabase = getSupabaseClient()

/**
 * @deprecated Utilisez requireSupabaseClient() depuis lib/supabase.ts
 */
export function getSupabaseClientOrThrow(): SupabaseClient {
  return requireSupabaseClient()
}

// Types pour les tables Supabase
export interface Course {
  id: string
  title: string
  description: string | null
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  duration: number | null
  type: 'tutorial' | 'guide' | 'quiz' | 'preset'
  icon: string | null
  tags: string[] | null
  order_index: number
  is_published: boolean
  is_premium?: boolean
  price?: number
  pack_id?: string | null // Référence au pack DLC si le cours fait partie d'un pack
  created_at: string
  updated_at: string
}

export interface Lesson {
  id: string
  course_id: string
  title: string
  /**
   * Description de la leçon. Peut contenir :
   * - Texte simple
   * - Tags spéciaux : [chord:C], [artist:Nom], [tablature:id]
   * - Blocs HTML/SVG : [html]...contenu HTML/SVG...[/html]
   * 
   * Exemple :
   * ```
   * Voici un diagramme de solo :
   * [html]
   * <svg>...</svg>
   * [/html]
   * Travaille ce passage lentement.
   * ```
   */
  description: string
  content_type: 'text' | 'video' | 'interactive'
  order_index: number
  action_type: string | null
  action_target: string | null
  action_value: unknown
  created_at: string
  updated_at: string
}

export interface QuizQuestion {
  id: string
  course_id: string
  question: string
  options: string[]
  correct_answer: number
  explanation: string | null
  order_index: number
  created_at: string
}

export interface CourseReward {
  id: string
  course_id: string
  xp: number
  badges: string[] | null
  created_at: string
}

export interface UserProgress {
  id: string
  user_id: string
  course_id: string
  lesson_id: string | null
  progress_percentage: number
  is_completed: boolean
  completed_at: string | null
  time_spent: number
  created_at: string
  updated_at: string
}

export interface UserQuizAttempt {
  id: string
  user_id: string
  course_id: string
  score: number
  total_questions: number
  correct_answers: number
  answers: Record<string, number>
  completed_at: string
}

export interface UserStats {
  id: string
  user_id: string
  total_xp: number
  courses_completed: number
  lessons_completed: number
  quizzes_completed: number
  badges: string[] | null
  current_streak: number
  last_activity_at: string | null
  created_at: string
  updated_at: string
}

export interface Tablature {
  id: string
  title: string
  artist: string | null
  tempo: number | null
  time_signature: string | null
  key: string | null
  preset_id: string | null
  measures: unknown[]
  songsterr_id: number | null
  songsterr_url: string | null
  slug: string | null
  created_at: string
  updated_at: string
}

export interface Chord {
  id: string
  name: string
  frets: number[]
  fingers: number[] | null
  base_fret: number
  created_at: string
}

