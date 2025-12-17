/**
 * Script pour nettoyer les cours et leçons en double dans Supabase
 * Supprime les doublons en gardant le cours le plus récent (ou le premier créé)
 */

import { supabase } from '../services/supabase'

/**
 * Supprime les cours en double en gardant le plus récent
 */
export async function cleanDuplicateCourses() {
  try {
    // 1. Trouver tous les cours de chansons (type 'tutorial' avec titre commençant par "Apprendre")
    const { data: allCourses, error: coursesError } = await supabase
      .from('courses')
      .select('id, title, created_at')
      .eq('type', 'tutorial')
      .like('title', 'Apprendre%')
      .order('created_at', { ascending: false })

    if (coursesError) {
      return { success: false, error: coursesError }
    }

    if (!allCourses || allCourses.length === 0) {
      return { success: true, deleted: 0 }
    }

    // 2. Grouper par titre pour trouver les doublons
    const coursesByTitle = new Map<string, typeof allCourses>()
    
    for (const course of allCourses) {
      const title = course.title.trim() // Normaliser les espaces
      if (!coursesByTitle.has(title)) {
        coursesByTitle.set(title, [])
      }
      coursesByTitle.get(title)!.push(course)
    }

    // 3. Identifier les doublons et garder le plus récent
    let deletedCount = 0
    const coursesToDelete: string[] = []

    for (const [title, courses] of coursesByTitle.entries()) {
      if (courses.length > 1) {
        // Trier par date de création (plus récent en premier)
        const sortedCourses = courses.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        
        // Garder le premier (le plus récent) et marquer les autres pour suppression
        const courseToKeep = sortedCourses[0]
        const duplicatesToDelete = sortedCourses.slice(1)

        for (const duplicate of duplicatesToDelete) {
          coursesToDelete.push(duplicate.id)
        }
        
        deletedCount += duplicatesToDelete.length
      }
    }

    if (coursesToDelete.length === 0) {
      return { success: true, deleted: 0 }
    }

    // 4. Supprimer les associations d'abord (par batch pour être plus efficace)
    
    // Supprimer les associations de tablatures
    const { error: tablatureError } = await supabase
      .from('course_tablatures')
      .delete()
      .in('course_id', coursesToDelete)
    if (tablatureError) {/* noop */}

    // Supprimer les associations d'accords
    const { error: chordsError } = await supabase
      .from('course_chords')
      .delete()
      .in('course_id', coursesToDelete)
    if (chordsError) {/* noop */}

    // Supprimer les associations d'artistes
    const { error: artistsError } = await supabase
      .from('course_artists')
      .delete()
      .in('course_id', coursesToDelete)
    if (artistsError) {/* noop */}

    // Supprimer les récompenses
    const { error: rewardsError } = await supabase
      .from('course_rewards')
      .delete()
      .in('course_id', coursesToDelete)
    if (rewardsError) {/* noop */}

    // Supprimer les progressions utilisateur
    const { error: progressError } = await supabase
      .from('user_progress')
      .delete()
      .in('course_id', coursesToDelete)
    if (progressError) {/* noop */}

    // Supprimer les tentatives de quiz
    const { error: quizError } = await supabase
      .from('user_quiz_attempts')
      .delete()
      .in('course_id', coursesToDelete)
    if (quizError) {/* noop */}

    // Supprimer les leçons
    const { error: lessonsError } = await supabase
      .from('lessons')
      .delete()
      .in('course_id', coursesToDelete)
    if (lessonsError) {
      return { success: false, error: lessonsError }
    }

    // 5. Supprimer les cours en double
    const { error: deleteError } = await supabase
      .from('courses')
      .delete()
      .in('id', coursesToDelete)

    if (deleteError) {
      return { success: false, error: deleteError }
    }

    return { success: true, deleted: deletedCount }
  } catch (error) {
    return { success: false, error }
  }
}

/**
 * Supprime TOUS les cours de chansons et les réimporte proprement
 * Utilisez cette fonction si vous voulez un reset complet
 */
export async function deleteAllSongCourses() {
  try {
    // 1. Trouver tous les cours de chansons
    const { data: allCourses, error: coursesError } = await supabase
      .from('courses')
      .select('id')
      .eq('type', 'tutorial')
      .like('title', 'Apprendre%')

    if (coursesError) {
      return { success: false, error: coursesError }
    }

    if (!allCourses || allCourses.length === 0) {
      return { success: true, deleted: 0 }
    }

    const courseIds = allCourses.map(c => c.id)

    // 2. Supprimer toutes les associations
    await supabase.from('course_tablatures').delete().in('course_id', courseIds)
    await supabase.from('course_chords').delete().in('course_id', courseIds)
    await supabase.from('course_artists').delete().in('course_id', courseIds)
    await supabase.from('course_rewards').delete().in('course_id', courseIds)
    await supabase.from('user_progress').delete().in('course_id', courseIds)
    await supabase.from('user_quiz_attempts').delete().in('course_id', courseIds)
    await supabase.from('lessons').delete().in('course_id', courseIds)

    // 3. Supprimer les cours
    const { error: deleteError } = await supabase
      .from('courses')
      .delete()
      .in('id', courseIds)

    if (deleteError) {
      return { success: false, error: deleteError }
    }

    return { success: true, deleted: courseIds.length }
  } catch (error) {
    return { success: false, error }
  }
}

/**
 * Affiche un résumé des doublons sans les supprimer
 */
export async function checkDuplicateCourses() {
  try {
    const { data: allCourses, error: coursesError } = await supabase
      .from('courses')
      .select('id, title, created_at')
      .eq('type', 'tutorial')
      .like('title', 'Apprendre%')
      .order('created_at', { ascending: false })

    if (coursesError) {
      return { success: false, error: coursesError }
    }

    if (!allCourses || allCourses.length === 0) {
      return { success: true, duplicates: [] }
    }

    const coursesByTitle = new Map<string, typeof allCourses>()
    
    for (const course of allCourses) {
      const title = course.title
      if (!coursesByTitle.has(title)) {
        coursesByTitle.set(title, [])
      }
      coursesByTitle.get(title)!.push(course)
    }

    const duplicates: Array<{ title: string; count: number; ids: string[] }> = []

    for (const [title, courses] of coursesByTitle.entries()) {
      if (courses.length > 1) {
        duplicates.push({
          title,
          count: courses.length,
          ids: courses.map(c => c.id)
        })
      }
    }

    return { success: true, duplicates }
  } catch (error) {
    return { success: false, error }
  }
}

// Exposer les fonctions globalement pour la console du navigateur
if (typeof window !== 'undefined') {
  ;(window as any).cleanDuplicateCourses = cleanDuplicateCourses
  ;(window as any).checkDuplicateCourses = checkDuplicateCourses
  ;(window as any).deleteAllSongCourses = deleteAllSongCourses
}

