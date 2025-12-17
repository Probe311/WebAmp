// Helper pour faciliter la migration des données vers Supabase
// À utiliser depuis la console du navigateur ou un script Node.js

import { supabase } from '../services/supabase'
import { tutorials } from '../data/tutorials'
import { tablatureService } from '../services/tablatures'

/**
 * Migre un seul tutoriel vers Supabase
 */
export async function migrateSingleTutorial(tutorialId: string) {
  const tutorial = tutorials.find(t => t.id === tutorialId)
  if (!tutorial) {
    return false
  }

  try {
    // 1. Créer le cours
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .insert({
        title: tutorial.title,
        description: tutorial.description,
        category: tutorial.category,
        difficulty: tutorial.difficulty,
        duration: tutorial.duration,
        type: tutorial.type,
        icon: tutorial.icon,
        tags: tutorial.tags,
        is_published: true
      })
      .select()
      .single()

    if (courseError) {
      return false
    }

    // 2. Créer les récompenses
    if (tutorial.rewards) {
      await supabase
        .from('course_rewards')
        .insert({
          course_id: course.id,
          xp: tutorial.rewards.xp,
          badges: tutorial.rewards.badges || []
        })
    }

    // 3. Créer les leçons
    if (tutorial.content?.steps) {
      for (let i = 0; i < tutorial.content.steps.length; i++) {
        const step = tutorial.content.steps[i]
        
        const { data: lesson, error: lessonError } = await supabase
          .from('lessons')
          .insert({
            course_id: course.id,
            title: step.title,
            description: step.description,
            content_type: 'text',
            order_index: i,
            action_type: step.action?.type || null,
            action_target: step.action?.target || null,
            action_value: step.action?.value || null
          })
          .select()
          .single()

        if (lessonError) {
          continue
        }

        // Extraire les références d'accords
        const chordMatches = step.description.matchAll(/\[chord:([^\]]+)\]/g)
        for (const match of chordMatches) {
          const chordName = match[1]
          const chord = tablatureService.getChord(chordName)
          if (chord) {
            let { data: existingChord } = await supabase
              .from('chords')
              .select('id')
              .eq('name', chordName)
              .single()

            if (!existingChord) {
              const { data: newChord } = await supabase
                .from('chords')
                .insert({
                  name: chord.name,
                  frets: chord.frets,
                  fingers: chord.fingers || [],
                  base_fret: chord.baseFret || 0
                })
                .select()
                .single()
              existingChord = newChord
            }

            if (existingChord) {
              await supabase
                .from('course_chords')
                .insert({
                  course_id: course.id,
                  chord_id: existingChord.id,
                  lesson_id: lesson.id
                })
            }
          }
        }

        // Extraire les références de tablatures
        const tabMatch = step.description.match(/\[tablature:([^\]]+)\]/)
        if (tabMatch) {
          const tabId = tabMatch[1]
          const tablature = tablatureService.getTablature(tabId)
          if (tablature) {
            const { data: newTab } = await supabase
              .from('tablatures')
              .insert({
                title: tablature.title,
                artist: tablature.artist || null,
                tempo: tablature.tempo || null,
                time_signature: tablature.timeSignature || null,
                key: tablature.key || null,
                preset_id: tablature.presetId || null,
                measures: tablature.measures
              })
              .select()
              .single()

            if (newTab) {
              await supabase
                .from('course_tablatures')
                .insert({
                  course_id: course.id,
                  tablature_id: newTab.id,
                  lesson_id: lesson.id
                })
            }
          }
        }

        // Extraire les références d'artistes
        const artistMatch = step.description.match(/\[artist:([^\]]+)\]/)
        if (artistMatch) {
          await supabase
            .from('course_artists')
            .insert({
              course_id: course.id,
              artist_name: artistMatch[1],
              lesson_id: lesson.id
            })
        }
      }
    }

    // 4. Créer les questions de quiz
    if (tutorial.content?.quiz) {
      for (let i = 0; i < tutorial.content.quiz.length; i++) {
        const question = tutorial.content.quiz[i]
        
        await supabase
          .from('quiz_questions')
          .insert({
            course_id: course.id,
            question: question.question,
            options: question.options,
            correct_answer: question.correctAnswer,
            explanation: question.explanation,
            order_index: i
          })
      }
    }

    return true
  } catch (error) {
    return false
  }
}

/**
 * Migre tous les tutoriels vers Supabase
 */
export async function migrateAllTutorials() {
  let successCount = 0
  let errorCount = 0

  for (const tutorial of tutorials) {
    const success = await migrateSingleTutorial(tutorial.id)
    if (success) {
      successCount++
    } else {
      errorCount++
    }
    
    // Petite pause pour éviter de surcharger l'API
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  return { successCount, errorCount }
}

/**
 * Migre tous les accords vers Supabase
 */
export async function migrateAllChords() {
  const chords = tablatureService.getAllChords()
  let successCount = 0
  let errorCount = 0

  for (const chord of chords) {
    const { error } = await supabase
      .from('chords')
      .upsert({
        name: chord.name,
        frets: chord.frets,
        fingers: chord.fingers || [],
        base_fret: chord.baseFret || 0
      }, {
        onConflict: 'name'
      })

    if (error) {
      errorCount++
    } else {
      successCount++
    }
  }

  return { successCount, errorCount }
}

/**
 * Vérifie si un tutoriel existe déjà dans Supabase
 */
export async function tutorialExists(tutorialId: string): Promise<boolean> {
  const tutorial = tutorials.find(t => t.id === tutorialId)
  if (!tutorial) return false

  const { data } = await supabase
    .from('courses')
    .select('id')
    .eq('title', tutorial.title)
    .single()

  return !!data
}

/**
 * Compte les cours existants dans Supabase
 */
export async function countCourses(): Promise<number> {
  const { count } = await supabase
    .from('courses')
    .select('*', { count: 'exact', head: true })
  
  return count || 0
}

// Exposer les fonctions globalement pour accès depuis la console
if (typeof window !== 'undefined') {
  (window as any).migrateAllChords = migrateAllChords
  ;(window as any).migrateAllTutorials = migrateAllTutorials
  ;(window as any).migrateSingleTutorial = migrateSingleTutorial
  ;(window as any).countCourses = countCourses
}
