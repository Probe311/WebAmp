/**
 * Script de déploiement des tutoriels vers Supabase
 * 
 * INSTRUCTIONS :
 * 1. Ouvrez la console du navigateur sur votre application WebAmp
 * 2. Assurez-vous d'être connecté à Supabase (le client doit être disponible)
 * 3. Copiez-collez ce script complet dans la console
 * 4. Copiez-collez le tableau `tutorials` depuis tutorials.ts
 * 5. Exécutez : deployTutorialsToSupabase(tutorials)
 * 
 * OU utilisez directement avec les données :
 * - Importez le fichier tutorials.ts dans votre app
 * - Exécutez : deployTutorialsToSupabase(window.tutorialsData)
 */

async function deployTutorialsToSupabase(tutorialsData) {
  // Récupérer le client Supabase depuis l'application
  // Assurez-vous que Supabase est initialisé dans votre app
  const supabase = window.supabase || getSupabaseClient();
  
  if (!supabase) {
    throw new Error('Client Supabase non trouvé. Assurez-vous que Supabase est initialisé.');
  }

  console.log(`🚀 Début du déploiement de ${tutorialsData.length} tutoriels...`);

  const results = {
    courses: { created: 0, errors: 0 },
    lessons: { created: 0, errors: 0 },
    quizzes: { created: 0, errors: 0 },
    rewards: { created: 0, errors: 0 },
    prerequisites: { created: 0, errors: 0 },
    artists: { created: 0, errors: 0 },
    chords: { created: 0, errors: 0 },
    tablatures: { created: 0, errors: 0 },
  };

  // Map pour stocker les IDs de cours créés (ancien ID -> nouveau UUID)
  const courseIdMap = new Map();

  // Fonction pour extraire les références depuis le texte
  function extractReferences(text) {
    const artists = [];
    const chords = [];
    const tablatures = [];
    
    // Extraire [artist:Nom]
    const artistMatches = text.match(/\[artist:([^\]]+)\]/g);
    if (artistMatches) {
      artistMatches.forEach(match => {
        const name = match.replace(/\[artist:|\]/g, '');
        if (!artists.includes(name)) artists.push(name);
      });
    }
    
    // Extraire [chord:Nom]
    const chordMatches = text.match(/\[chord:([^\]]+)\]/g);
    if (chordMatches) {
      chordMatches.forEach(match => {
        const name = match.replace(/\[chord:|\]/g, '');
        if (!chords.includes(name)) chords.push(name);
      });
    }
    
    // Extraire [tablature:id]
    const tabMatches = text.match(/\[tablature:([^\]]+)\]/g);
    if (tabMatches) {
      tabMatches.forEach(match => {
        const id = match.replace(/\[tablature:|\]/g, '');
        if (!tablatures.includes(id)) tablatures.push(id);
      });
    }
    
    return { artists, chords, tablatures };
  }

  // Fonction pour créer ou récupérer un accord
  async function getOrCreateChord(chordName) {
    // Normaliser le nom de l'accord (ex: "E" -> "E", "Am" -> "Am")
    const normalizedName = chordName.trim();
    
    // Chercher l'accord existant
    const { data: existing } = await supabase
      .from('chords')
      .select('id')
      .eq('name', normalizedName)
      .single();
    
    if (existing) {
      return existing.id;
    }
    
    // Si l'accord n'existe pas, on le crée avec des valeurs par défaut
    // Note: Vous devrez peut-être ajuster les frets selon vos besoins
    const defaultFrets = [0, 0, 0, 0, 0, 0]; // À adapter selon l'accord
    
    const { data: newChord, error } = await supabase
      .from('chords')
      .insert({
        name: normalizedName,
        frets: defaultFrets,
        base_fret: 0,
      })
      .select('id')
      .single();
    
    if (error) {
      console.warn(`⚠️ Erreur lors de la création de l'accord ${normalizedName}:`, error);
      return null;
    }
    
    results.chords.created++;
    return newChord.id;
  }

  // Traiter chaque tutoriel
  for (let i = 0; i < tutorialsData.length; i++) {
    const tutorial = tutorialsData[i];
    console.log(`\n📚 Traitement du tutoriel ${i + 1}/${tutorialsData.length}: ${tutorial.title}`);

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
          order_index: i,
          is_published: true,
        })
        .select('id')
        .single();

      if (courseError) {
        console.error(`❌ Erreur lors de la création du cours "${tutorial.title}":`, courseError);
        results.courses.errors++;
        continue;
      }

      courseIdMap.set(tutorial.id, course.id);
      results.courses.created++;
      console.log(`✅ Cours créé: ${course.id}`);

      // 2. Créer les leçons (steps)
      if (tutorial.content?.steps) {
        for (let stepIndex = 0; stepIndex < tutorial.content.steps.length; stepIndex++) {
          const step = tutorial.content.steps[stepIndex];
          
          // Extraire les références depuis la description
          const refs = extractReferences(step.description);
          
          const { data: lesson, error: lessonError } = await supabase
            .from('lessons')
            .insert({
              course_id: course.id,
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
            console.error(`❌ Erreur lors de la création de la leçon "${step.title}":`, lessonError);
            results.lessons.errors++;
            continue;
          }

          results.lessons.created++;

          // Associer les artistes
          for (const artistName of refs.artists) {
            const { error: artistError } = await supabase
              .from('course_artists')
              .insert({
                course_id: course.id,
                lesson_id: lesson.id,
                artist_name: artistName,
              });

            if (artistError && !artistError.message.includes('duplicate')) {
              console.warn(`⚠️ Erreur lors de l'association de l'artiste "${artistName}":`, artistError);
            } else {
              results.artists.created++;
            }
          }

          // Associer les accords
          for (const chordName of refs.chords) {
            const chordId = await getOrCreateChord(chordName);
            if (chordId) {
              const { error: chordError } = await supabase
                .from('course_chords')
                .insert({
                  course_id: course.id,
                  lesson_id: lesson.id,
                  chord_id: chordId,
                });

              if (chordError && !chordError.message.includes('duplicate')) {
                console.warn(`⚠️ Erreur lors de l'association de l'accord "${chordName}":`, chordError);
              } else {
                results.chords.created++;
              }
            }
          }

          // Associer les tablatures (si elles existent déjà dans la DB)
          for (const tabId of refs.tablatures) {
            // Chercher la tablature par un identifiant ou titre
            // Note: Vous devrez peut-être adapter cette logique selon votre structure
            const { data: tablature } = await supabase
              .from('tablatures')
              .select('id')
              .eq('id', tabId)
              .single();

            if (tablature) {
              const { error: tabError } = await supabase
                .from('course_tablatures')
                .insert({
                  course_id: course.id,
                  lesson_id: lesson.id,
                  tablature_id: tablature.id,
                });

              if (tabError && !tabError.message.includes('duplicate')) {
                console.warn(`⚠️ Erreur lors de l'association de la tablature "${tabId}":`, tabError);
              } else {
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
              course_id: course.id,
              question: question.question,
              options: question.options,
              correct_answer: question.correctAnswer,
              explanation: question.explanation,
              order_index: quizIndex,
            });

          if (quizError) {
            console.error(`❌ Erreur lors de la création de la question de quiz:`, quizError);
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
          course_id: course.id,
          xp: tutorial.rewards.xp || 0,
          badges: tutorial.rewards.badges || [],
        });

      if (rewardError) {
        console.error(`❌ Erreur lors de la création des récompenses:`, rewardError);
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
                course_id: course.id,
                prerequisite_course_id: prereqCourseId,
              });

            if (prereqError && !prereqError.message.includes('duplicate')) {
              console.warn(`⚠️ Erreur lors de la création du prérequis:`, prereqError);
            } else {
              results.prerequisites.created++;
            }
          } else {
            console.warn(`⚠️ Prérequis "${prereqId}" non trouvé (cours pas encore créé)`);
          }
        }
      }

      // Petite pause pour éviter de surcharger l'API
      await new Promise(resolve => setTimeout(resolve, 100));

    } catch (error) {
      console.error(`❌ Erreur générale pour le tutoriel "${tutorial.title}":`, error);
    }
  }

  // Résumé final
  console.log('\n' + '='.repeat(60));
  console.log('📊 RÉSUMÉ DU DÉPLOIEMENT');
  console.log('='.repeat(60));
  console.log(`✅ Cours créés: ${results.courses.created} (erreurs: ${results.courses.errors})`);
  console.log(`✅ Leçons créées: ${results.lessons.created} (erreurs: ${results.lessons.errors})`);
  console.log(`✅ Questions de quiz créées: ${results.quizzes.created} (erreurs: ${results.quizzes.errors})`);
  console.log(`✅ Récompenses créées: ${results.rewards.created} (erreurs: ${results.rewards.errors})`);
  console.log(`✅ Prérequis créés: ${results.prerequisites.created} (erreurs: ${results.prerequisites.errors})`);
  console.log(`✅ Artistes associés: ${results.artists.created}`);
  console.log(`✅ Accords créés/associés: ${results.chords.created}`);
  console.log(`✅ Tablatures associées: ${results.tablatures.created}`);
  console.log('='.repeat(60));
  console.log('🎉 Déploiement terminé !');

  return results;
}

// Fonction helper pour obtenir le client Supabase
function getSupabaseClient() {
  // Essayer différentes façons d'obtenir le client Supabase
  if (window.supabase) return window.supabase;
  
  // Si vous utilisez un module ES6, vous pouvez l'importer ainsi :
  // import { getSupabaseClient } from './lib/supabaseClient';
  // const supabase = getSupabaseClient();
  
  // Sinon, créez le client directement avec vos credentials
  if (window.supabaseUrl && window.supabaseAnonKey) {
    return window.supabase.createClient(window.supabaseUrl, window.supabaseAnonKey);
  }
  
  console.error('❌ Impossible de trouver le client Supabase. Options:');
  console.log('1. Assurez-vous que window.supabase existe');
  console.log('2. Ou définissez window.supabaseUrl et window.supabaseAnonKey');
  console.log('3. Ou importez getSupabaseClient depuis votre app');
  
  return null;
}

// Exporter pour utilisation
if (typeof window !== 'undefined') {
  window.deployTutorialsToSupabase = deployTutorialsToSupabase;
}

// Instructions d'utilisation
console.log(`
📖 INSTRUCTIONS D'UTILISATION:

1. Assurez-vous d'avoir accès au client Supabase dans la console:
   - Option A: window.supabase doit exister
   - Option B: Définissez window.supabaseUrl et window.supabaseAnonKey
   - Option C: Importez getSupabaseClient depuis votre app

2. Copiez le tableau tutorials depuis tutorials.ts:
   const tutorials = [ /* ... */ ];

3. Exécutez le script:
   deployTutorialsToSupabase(tutorials);

OU si vous avez déjà les données dans votre app:
   deployTutorialsToSupabase(window.tutorialsData);
`);
