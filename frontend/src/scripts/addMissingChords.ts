// Script pour ajouter les accords manquants dans Supabase
import { supabase } from '../services/supabase'
import { tablatureService } from '../services/tablatures'

export async function addMissingChordsToSupabase() {
  console.log('🚀 Début de l\'ajout des accords manquants dans Supabase...')
  
  const chords = tablatureService.getAllChords()
  let successCount = 0
  let errorCount = 0
  let skippedCount = 0

  for (const chord of chords) {
    try {
      // Vérifier si l'accord existe déjà
      const { data: existingChord, error: checkError } = await supabase
        .from('chords')
        .select('id')
        .eq('name', chord.name)
        .maybeSingle()

      if (checkError && checkError.code !== 'PGRST116') {
        console.warn(`Erreur lors de la vérification de l'accord ${chord.name}:`, checkError)
        errorCount++
        continue
      }

      if (existingChord) {
        console.log(`⏭️  Accord ${chord.name} existe déjà, ignoré`)
        skippedCount++
        continue
      }

      // Créer l'accord
      const { error: insertError } = await supabase
        .from('chords')
        .insert({
          name: chord.name,
          frets: chord.frets,
          fingers: chord.fingers || [],
          base_fret: chord.baseFret || 0
        })

      if (insertError) {
        console.error(`Erreur lors de la création de l'accord ${chord.name}:`, insertError)
        errorCount++
      } else {
        console.log(`✓ Accord créé: ${chord.name}`)
        successCount++
      }
    } catch (error) {
      console.error(`Erreur lors du traitement de l'accord ${chord.name}:`, error)
      errorCount++
    }
    
    // Petite pause pour éviter de surcharger l'API
    await new Promise(resolve => setTimeout(resolve, 50))
  }

  console.log(`\n✅ Ajout terminé:`)
  console.log(`   - ${successCount} accords ajoutés avec succès`)
  console.log(`   - ${skippedCount} accords déjà existants (ignorés)`)
  console.log(`   - ${errorCount} erreurs`)
  
  return {
    success: errorCount === 0,
    successCount,
    skippedCount,
    errorCount
  }
}

// Exposer la fonction globalement pour la console
if (typeof window !== 'undefined') {
  (window as any).addMissingChordsToSupabase = addMissingChordsToSupabase
  console.log('✅ Fonction addMissingChordsToSupabase disponible globalement')
}

