/**
 * Script principal pour importer tous les cours dans Supabase
 * Consolide toutes les fonctionnalités d'import en un seul script
 */

import { supabase } from '../services/supabase'
import { addSongCoursesToSupabase } from './addSongCourses'
import { addMissingChordsToSupabase } from './addMissingChords'

/**
 * Importe tous les cours dans Supabase
 * - Ajoute les accords manquants
 * - Ajoute les cours de chansons
 */
export async function importAllCourses() {
  try {
    const chordsResult = await addMissingChordsToSupabase()
    
    // 2. Ajouter les cours de chansons
    const coursesResult = await addSongCoursesToSupabase()
    
    if (coursesResult.errorCount > 0 && coursesResult.successCount === 0) {
      return { success: false, error: coursesResult.message }
    }

    return {
      success: true,
      chords: chordsResult,
      courses: coursesResult
    }
  } catch (error) {
    return { success: false, error }
  }
}

/**
 * Supprime tous les cours et les réimporte
 */
export async function resetAndImportAllCourses() {
  try {
    const deleteResult = await deleteAllCourses()
    
    if (!deleteResult.success) {
      return { success: false, error: deleteResult.error }
    }

    const importResult = await importAllCourses()
    
    if (!importResult.success) {
      return { success: false, error: importResult.error }
    }

    return {
      success: true,
      delete: deleteResult,
      import: importResult
    }
  } catch (error) {
    return { success: false, error }
  }
}

/**
 * Supprime tous les cours et leurs données associées
 */
async function deleteAllCourses() {
  try {
    // Supprimer dans l'ordre pour respecter les contraintes de clés étrangères

    // 1. Supprimer les associations
    await supabase.from('course_tablatures').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('course_chords').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('course_artists').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('course_prerequisites').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('course_rewards').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    
    // 2. Supprimer les tentatives de quiz
    await supabase.from('user_quiz_attempts').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    
    // 3. Supprimer les progressions utilisateur
    await supabase.from('user_progress').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    
    // 4. Supprimer les questions de quiz
    await supabase.from('quiz_questions').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    
    // 5. Supprimer les leçons
    await supabase.from('lessons').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    
    // 6. Supprimer les cours
    const { error: coursesError } = await supabase.from('courses').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    
    if (coursesError) {
      return { success: false, error: coursesError }
    }

    return { success: true }
  } catch (error) {
    return { success: false, error }
  }
}

// Exposer les fonctions globalement pour la console du navigateur
if (typeof window !== 'undefined') {
  ;(window as any).importAllCourses = importAllCourses
  ;(window as any).resetAndImportAllCourses = resetAndImportAllCourses
}

