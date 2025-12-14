// Adaptateur pour convertir les données Supabase en format Tutorial
import { Course, Lesson, QuizQuestion, CourseReward } from '../services/supabase'
import { Tutorial, TutorialStep, QuizQuestion as TutorialQuizQuestion } from '../data/tutorials'

export function courseToTutorial(
  course: Course,
  lessons: Lesson[] = [],
  quizQuestions: QuizQuestion[] = [],
  rewards: CourseReward | null = null
): Tutorial {
  const steps: TutorialStep[] = lessons.map(lesson => ({
    id: lesson.id,
    title: lesson.title,
    description: lesson.description,
    action: lesson.action_type && lesson.action_target ? {
      type: lesson.action_type as 'addPedal' | 'setParameter' | 'loadPreset' | 'test',
      target: lesson.action_target,
      value: lesson.action_value
    } : undefined
  }))

  const quiz: TutorialQuizQuestion[] = quizQuestions.map(q => ({
    id: q.id,
    question: q.question,
    options: q.options,
    correctAnswer: q.correct_answer,
    explanation: q.explanation || ''
  }))

  return {
    id: course.id,
    title: course.title,
    description: course.description || '',
    category: course.category as any,
    difficulty: course.difficulty as any,
    duration: course.duration || 0,
    type: course.type as any,
    icon: course.icon || 'BookOpen',
    tags: course.tags || [],
    content: {
      steps: steps.length > 0 ? steps : undefined,
      quiz: quiz.length > 0 ? quiz : undefined
    },
    rewards: {
      xp: rewards?.xp || 0,
      badges: rewards?.badges || []
    }
  }
}

