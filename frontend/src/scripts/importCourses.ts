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
  console.log('🚀 Début de l\'importation de tous les cours dans Supabase...')
  
  try {
    // 1. S'assurer que tous les accords de base sont présents
    console.log('📝 Étape 1/2 : Ajout des accords manquants...')
    const chordsResult = await addMissingChordsToSupabase()
    
    // Note: Même si tous les accords existent déjà (skippedCount > 0), c'est un succès
    if (chordsResult.errorCount > 0) {
      console.warn(`⚠️ ${chordsResult.errorCount} erreurs lors de l'ajout des accords, mais on continue...`)
    }
    
    console.log('✅ Accords vérifiés:', {
      ajoutés: chordsResult.successCount,
      existants: chordsResult.skippedCount,
      erreurs: chordsResult.errorCount
    })
    
    // 2. Ajouter les cours de chansons
    console.log('📝 Étape 2/2 : Ajout des cours de chansons...')
    const coursesResult = await addSongCoursesToSupabase()
    
    if (coursesResult.errorCount > 0 && coursesResult.successCount === 0) {
      console.error('❌ Erreur lors de l\'ajout des cours:', coursesResult.message)
      return { success: false, error: coursesResult.message }
    }
    
    console.log('\n✅ Importation terminée avec succès !')
    console.log(`   - ${coursesResult.successCount} cours ajoutés`)
    console.log(`   - ${coursesResult.skippedCount} cours déjà existants (ignorés)`)
    console.log(`   - ${coursesResult.errorCount} erreurs`)
    
    return {
      success: true,
      chords: chordsResult,
      courses: coursesResult
    }
  } catch (error) {
    console.error('❌ Erreur lors de l\'importation:', error)
    return { success: false, error }
  }
}

/**
 * Supprime tous les cours et les réimporte
 */
export async function resetAndImportAllCourses() {
  console.log('🔄 Début du reset et réimportation de tous les cours...')
  
  try {
    // 1. Supprimer tous les cours
    console.log('🗑️ Étape 1/3 : Suppression de tous les cours...')
    const deleteResult = await deleteAllCourses()
    
    if (!deleteResult.success) {
      console.error('❌ Erreur lors de la suppression:', deleteResult.error)
      return { success: false, error: deleteResult.error }
    }
    
    console.log('✅ Tous les cours supprimés')
    
    // 2. Réimporter tous les cours
    console.log('📤 Étape 2/3 : Réimportation des cours...')
    const importResult = await importAllCourses()
    
    if (!importResult.success) {
      console.error('❌ Erreur lors de la réimportation:', importResult.error)
      return { success: false, error: importResult.error }
    }
    
    console.log('\n✅ Reset et réimportation terminés avec succès !')
    console.log('💡 Rechargez la page pour voir les changements.')
    
    return {
      success: true,
      delete: deleteResult,
      import: importResult
    }
  } catch (error) {
    console.error('❌ Erreur lors du reset:', error)
    return { success: false, error }
  }
}

/**
 * Supprime tous les cours et leurs données associées
 */
async function deleteAllCourses() {
  console.log('🗑️ Suppression de tous les cours et données associées...')
  
  try {
    // Supprimer dans l'ordre pour respecter les contraintes de clés étrangères
    
    // 1. Supprimer les associations
    console.log('   📝 Suppression des associations...')
    await supabase.from('course_tablatures').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('course_chords').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('course_artists').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('course_prerequisites').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('course_rewards').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    
    // 2. Supprimer les tentatives de quiz
    console.log('   📝 Suppression des tentatives de quiz...')
    await supabase.from('user_quiz_attempts').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    
    // 3. Supprimer les progressions utilisateur
    console.log('   📝 Suppression des progressions utilisateur...')
    await supabase.from('user_progress').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    
    // 4. Supprimer les questions de quiz
    console.log('   📝 Suppression des questions de quiz...')
    await supabase.from('quiz_questions').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    
    // 5. Supprimer les leçons
    console.log('   📝 Suppression des leçons...')
    await supabase.from('lessons').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    
    // 6. Supprimer les cours
    console.log('   📝 Suppression des cours...')
    const { error: coursesError } = await supabase.from('courses').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    
    if (coursesError) {
      console.error('❌ Erreur lors de la suppression des cours:', coursesError)
      return { success: false, error: coursesError }
    }
    
    console.log('✅ Tous les cours ont été supprimés avec succès !')
    return { success: true }
  } catch (error) {
    console.error('❌ Erreur lors de la suppression:', error)
    return { success: false, error }
  }
}

// Exposer les fonctions globalement pour la console du navigateur
if (typeof window !== 'undefined') {
  ;(window as any).importAllCourses = importAllCourses
  ;(window as any).resetAndImportAllCourses = resetAndImportAllCourses
  console.log('✅ Scripts d\'import disponibles globalement:')
  console.log('   - importAllCourses() : Importer tous les cours')
  console.log('   - resetAndImportAllCourses() : Reset et réimportation complète')
}

