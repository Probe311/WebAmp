// Service Supabase pour le LMS
import { createClient } from '@supabase/supabase-js'

// Configuration Supabase (à remplacer par vos vraies valeurs)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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
  created_at: string
  updated_at: string
}

export interface Lesson {
  id: string
  course_id: string
  title: string
  description: string
  content_type: 'text' | 'video' | 'interactive'
  order_index: number
  action_type: string | null
  action_target: string | null
  action_value: any
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
  measures: any[]
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

