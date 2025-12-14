/**
 * SCRIPT POUR CONSOLE NAVIGATEUR - Déploiement des tutoriels vers Supabase
 * 
 * INSTRUCTIONS RAPIDES:
 * 1. Ouvrez la console du navigateur (F12) sur votre app WebAmp
 * 2. Copiez-collez ce script COMPLET dans la console
 * 3. Copiez-collez ensuite le tableau tutorials depuis tutorials.ts
 * 4. Exécutez: deployTutorials(tutorials)
 */

(async function() {
  'use strict';

  // ============================================
  // CONFIGURATION SUPABASE
  // ============================================
  // Si vous avez déjà le client Supabase dans votre app, utilisez-le :
  // const supabase = window.supabase || getSupabaseClient();
  
  // Sinon, configurez ici vos credentials Supabase :
  const SUPABASE_URL = window.SUPABASE_URL || prompt('Entrez votre SUPABASE_URL:');
  const SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY || prompt('Entrez votre SUPABASE_ANON_KEY:');
  
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('❌ SUPABASE_URL et SUPABASE_ANON_KEY sont requis');
    return;
  }

  // Créer le client Supabase
  const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // ============================================
  // FONCTIONS UTILITAIRES
  // ============================================

  function extractReferences(text) {
    const artists = [];
    const chords = [];
    const tablatures = [];
    
    if (!text) return { artists, chords, tablatures };
    
    const artistMatches = text.match(/\[artist:([^\]]+)\]/g);
    if (artistMatches) {
      artistMatches.forEach(match => {
        const name = match.replace(/\[artist:|\]/g, '');
        if (!artists.includes(name)) artists.push(name);
      });
    }
    
    const chordMatches = text.match(/\[chord:([^\]]+)\]/g);
    if (chordMatches) {
      chordMatches.forEach(match => {
        const name = match.replace(/\[chord:|\]/g, '');
        if (!chords.includes(name)) chords.push(name);
      });
    }
    
    const tabMatches = text.match(/\[tablature:([^\]]+)\]/g);
    if (tabMatches) {
      tabMatches.forEach(match => {
        const id = match.replace(/\[tablature:|\]/g, '');
        if (!tablatures.includes(id)) tablatures.push(id);
      });
    }
    
    return { artists, chords, tablatures };
  }

  async function getOrCreateChord(supabase, chordName) {
    const normalizedName = chordName.trim();
    
    const { data: existing } = await supabase
      .from('chords')
      .select('id')
      .eq('name', normalizedName)
      .single();
    
    if (existing) {
      return existing.id;
    }
    
    // Créer l'accord avec des valeurs par défaut
    // Note: Vous devrez peut-être ajuster les frets selon vos besoins
    const { data: newChord, error } = await supabase
      .from('chords')
      .insert({
        name: normalizedName,
        frets: [0, 0, 0, 0, 0, 0],
        base_fret: 0,
      })
      .select('id')
      .single();
    
    if (error) {
      console.warn(`⚠️ Erreur création accord ${normalizedName}:`, error.message);
      return null;
    }
    
    return newChord.id;
  }

  // ============================================
  // FONCTION PRINCIPALE DE DÉPLOIEMENT
  // ============================================

  async function deployTutorials(tutorialsData) {
    console.log(`🚀 Début du déploiement de ${tutorialsData.length} tutoriels...\n`);

    const results = {
      courses: { created: 0, errors: 0, skipped: 0 },
      lessons: { created: 0, errors: 0 },
      quizzes: { created: 0, errors: 0 },
      rewards: { created: 0, errors: 0 },
      prerequisites: { created: 0, errors: 0 },
      artists: { created: 0, errors: 0 },
      chords: { created: 0, errors: 0 },
      tablatures: { created: 0, errors: 0 },
    };

    const courseIdMap = new Map();

    for (let i = 0; i < tutorialsData.length; i++) {
      const tutorial = tutorialsData[i];
      const progress = `[${i + 1}/${tutorialsData.length}]`;
      console.log(`\n${progress} 📚 ${tutorial.title}`);

      try {
        // Vérifier si le cours existe déjà (par titre)
        const { data: existingCourse } = await supabase
          .from('courses')
          .select('id')
          .eq('title', tutorial.title)
          .single();

        let courseId;
        if (existingCourse) {
          courseId = existingCourse.id;
          courseIdMap.set(tutorial.id, courseId);
          results.courses.skipped++;
          console.log(`   ⏭️  Cours déjà existant, ignoré`);
          continue;
        }

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
            order_index: i,
            is_published: true,
          })
          .select('id')
          .single();

        if (courseError) {
          console.error(`   ❌ Erreur cours:`, courseError.message);
          results.courses.errors++;
          continue;
        }

        courseId = course.id;
        courseIdMap.set(tutorial.id, courseId);
        results.courses.created++;
        console.log(`   ✅ Cours créé: ${courseId.substring(0, 8)}...`);

        // 2. Créer les leçons
        if (tutorial.content?.steps) {
          for (let stepIndex = 0; stepIndex < tutorial.content.steps.length; stepIndex++) {
            const step = tutorial.content.steps[stepIndex];
            const refs = extractReferences(step.description);
            
            const { data: lesson, error: lessonError } = await supabase
              .from('lessons')
              .insert({
                course_id: courseId,
                title: step.title,
                description: step.description,
                content_type: 'text',
                order_index: stepIndex,
                action_type: step.action?.type || null,
                action_target: step.action?.target || null,
                action_value: step.action?.value || null,
              })
              .select('id')
              .single();

            if (lessonError) {
              console.error(`   ❌ Erreur leçon "${step.title}":`, lessonError.message);
              results.lessons.errors++;
              continue;
            }

            results.lessons.created++;

            // Associer les artistes
            for (const artistName of refs.artists) {
              const { error } = await supabase
                .from('course_artists')
                .insert({
                  course_id: courseId,
                  lesson_id: lesson.id,
                  artist_name: artistName,
                });

              if (error && !error.message.includes('duplicate')) {
                results.artists.errors++;
              } else if (!error) {
                results.artists.created++;
              }
            }

            // Associer les accords
            for (const chordName of refs.chords) {
              const chordId = await getOrCreateChord(supabase, chordName);
              if (chordId) {
                const { error } = await supabase
                  .from('course_chords')
                  .insert({
                    course_id: courseId,
                    lesson_id: lesson.id,
                    chord_id: chordId,
                  });

                if (error && !error.message.includes('duplicate')) {
                  results.chords.errors++;
                } else if (!error) {
                  results.chords.created++;
                }
              }
            }

            // Associer les tablatures
            for (const tabId of refs.tablatures) {
              const { data: tablature } = await supabase
                .from('tablatures')
                .select('id')
                .eq('id', tabId)
                .single();

              if (tablature) {
                const { error } = await supabase
                  .from('course_tablatures')
                  .insert({
                    course_id: courseId,
                    lesson_id: lesson.id,
                    tablature_id: tablature.id,
                  });

                if (error && !error.message.includes('duplicate')) {
                  results.tablatures.errors++;
                } else if (!error) {
                  results.tablatures.created++;
                }
              }
            }
          }
        }

        // 3. Créer les questions de quiz
        if (tutorial.content?.quiz) {
          for (let quizIndex = 0; quizIndex < tutorial.content.quiz.length; quizIndex++) {
            const question = tutorial.content.quiz[quizIndex];
            
            const { error: quizError } = await supabase
              .from('quiz_questions')
              .insert({
                course_id: courseId,
                question: question.question,
                options: question.options,
                correct_answer: question.correctAnswer,
                explanation: question.explanation,
                order_index: quizIndex,
              });

            if (quizError) {
              console.error(`   ❌ Erreur question quiz:`, quizError.message);
              results.quizzes.errors++;
              continue;
            }

            results.quizzes.created++;
          }
        }

        // 4. Créer les récompenses
        const { error: rewardError } = await supabase
          .from('course_rewards')
          .insert({
            course_id: courseId,
            xp: tutorial.rewards.xp || 0,
            badges: tutorial.rewards.badges || [],
          });

        if (rewardError) {
          console.error(`   ❌ Erreur récompenses:`, rewardError.message);
          results.rewards.errors++;
        } else {
          results.rewards.created++;
        }

        // 5. Créer les prérequis
        if (tutorial.prerequisites && tutorial.prerequisites.length > 0) {
          for (const prereqId of tutorial.prerequisites) {
            const prereqCourseId = courseIdMap.get(prereqId);
            if (prereqCourseId) {
              const { error: prereqError } = await supabase
                .from('course_prerequisites')
                .insert({
                  course_id: courseId,
                  prerequisite_course_id: prereqCourseId,
                });

              if (error && !prereqError.message.includes('duplicate')) {
                results.prerequisites.errors++;
              } else if (!prereqError) {
                results.prerequisites.created++;
              }
            } else {
              console.warn(`   ⚠️  Prérequis "${prereqId}" non trouvé`);
            }
          }
        }

        // Petite pause pour éviter de surcharger l'API
        await new Promise(resolve => setTimeout(resolve, 50));

      } catch (error) {
        console.error(`   ❌ Erreur générale:`, error);
      }
    }

    // Résumé final
    console.log('\n' + '='.repeat(70));
    console.log('📊 RÉSUMÉ DU DÉPLOIEMENT');
    console.log('='.repeat(70));
    console.log(`✅ Cours créés: ${results.courses.created} | Ignorés: ${results.courses.skipped} | Erreurs: ${results.courses.errors}`);
    console.log(`✅ Leçons créées: ${results.lessons.created} | Erreurs: ${results.lessons.errors}`);
    console.log(`✅ Questions quiz créées: ${results.quizzes.created} | Erreurs: ${results.quizzes.errors}`);
    console.log(`✅ Récompenses créées: ${results.rewards.created} | Erreurs: ${results.rewards.errors}`);
    console.log(`✅ Prérequis créés: ${results.prerequisites.created} | Erreurs: ${results.prerequisites.errors}`);
    console.log(`✅ Artistes associés: ${results.artists.created} | Erreurs: ${results.artists.errors}`);
    console.log(`✅ Accords créés/associés: ${results.chords.created} | Erreurs: ${results.chords.errors}`);
    console.log(`✅ Tablatures associées: ${results.tablatures.created} | Erreurs: ${results.tablatures.errors}`);
    console.log('='.repeat(70));
    console.log('🎉 Déploiement terminé !');

    return results;
  }

  // Exporter la fonction
  window.deployTutorials = deployTutorials;

  console.log(`
✅ Script chargé avec succès !

📖 UTILISATION:
1. Copiez le tableau tutorials depuis tutorials.ts
2. Exécutez: deployTutorials(tutorials)

OU si vous avez déjà les données dans votre app:
   deployTutorials(window.tutorialsData);
`);

})();
