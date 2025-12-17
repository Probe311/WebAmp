// Script pour ajouter les accords manquants dans Supabase
import { supabase } from '../services/supabase'
import { tablatureService } from '../services/tablatures'

export async function addMissingChordsToSupabase() {
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
        errorCount++
        continue
      }

      if (existingChord) {
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
        errorCount++
      } else {
        successCount++
      }
    } catch (error) {
      errorCount++
    }
    
    // Petite pause pour éviter de surcharger l'API
    await new Promise(resolve => setTimeout(resolve, 50))
  }

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
}

