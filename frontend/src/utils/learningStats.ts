import type { CourseReward } from '../services/supabase'

/**
 * Structure de progression simplifiée par cours, telle que renvoyée par useAllCoursesProgress
 */
export interface CourseProgressSummary {
  progress: number
  completed: boolean
}

/**
 * Calcule l'XP totale gagnée à partir de la progression utilisateur et des récompenses de cours.
 * On ne compte que les cours complétés (completed = true).
 */
export function computeTotalXPFromProgress(
  progressMap: Map<string, CourseProgressSummary>,
  rewardsMap: Map<string, CourseReward>
): number {
  return Array.from(progressMap.entries()).reduce((sum, [courseId, prog]) => {
    if (!prog.completed) return sum
    const reward = rewardsMap.get(courseId)
    const courseXP = reward?.xp || 0
    return sum + courseXP
  }, 0)
}

/**
 * Calcule le nombre de cours complétés à partir de la progression.
 */
export function computeCompletedCoursesCount(
  progressMap: Map<string, CourseProgressSummary>
): number {
  return Array.from(progressMap.values()).filter((p) => p.completed).length
}


