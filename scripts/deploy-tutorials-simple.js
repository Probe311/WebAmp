/**
 * VERSION SIMPLIFIÉE - À copier-coller directement dans la console
 * 
 * UTILISATION:
 * 1. Copiez ce script COMPLET dans la console
 * 2. Copiez le tableau tutorials depuis tutorials.ts
 * 3. Exécutez: deployTutorials(tutorials)
 */

// ========== COLLEZ CE CODE DANS LA CONSOLE ==========

async function deployTutorials(tutorials) {
  console.log('🚀 Démarrage du déploiement...');
  
  // Obtenir le client Supabase
  let supabase;
  if (window.supabase) {
    supabase = window.supabase;
  } else if (window.getSupabaseClient) {
    supabase = window.getSupabaseClient();
  } else {
    // Créer le client avec les credentials
    const url = prompt('SUPABASE_URL:') || window.SUPABASE_URL;
    const key = prompt('SUPABASE_ANON_KEY:') || window.SUPABASE_ANON_KEY;
    if (!url || !key) {
      alert('❌ SUPABASE_URL et SUPABASE_ANON_KEY requis');
      return;
    }
    const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
    supabase = createClient(url, key);
  }

  const results = { courses: 0, lessons: 0, quizzes: 0, rewards: 0, errors: [] };
  const courseMap = new Map();

  // Fonction pour extraire les références
  const extractRefs = (text) => ({
    artists: (text.match(/\[artist:([^\]]+)\]/g) || []).map(m => m.replace(/\[artist:|\]/g, '')),
    chords: (text.match(/\[chord:([^\]]+)\]/g) || []).map(m => m.replace(/\[chord:|\]/g, '')),
    tabs: (text.match(/\[tablature:([^\]]+)\]/g) || []).map(m => m.replace(/\[tablature:|\]/g, ''))
  });

  // Créer/récupérer un accord
  const getChord = async (name) => {
    const { data } = await supabase.from('chords').select('id').eq('name', name.trim()).single();
    if (data) return data.id;
    const { data: newChord } = await supabase.from('chords').insert({
      name: name.trim(), frets: [0,0,0,0,0,0], base_fret: 0
    }).select('id').single();
    return newChord?.id;
  };

  for (let i = 0; i < tutorials.length; i++) {
    const t = tutorials[i];
    console.log(`[${i+1}/${tutorials.length}] ${t.title}`);

    try {
      // Créer le cours
      const { data: course, error: e1 } = await supabase.from('courses').insert({
        title: t.title, description: t.description, category: t.category,
        difficulty: t.difficulty, duration: t.duration, type: t.type,
        icon: t.icon, tags: t.tags, order_index: i, is_published: true
      }).select('id').single();

      if (e1) { results.errors.push(`Cours "${t.title}": ${e1.message}`); continue; }
      courseMap.set(t.id, course.id);
      results.courses++;

      // Créer les leçons
      if (t.content?.steps) {
        for (let j = 0; j < t.content.steps.length; j++) {
          const s = t.content.steps[j];
          const refs = extractRefs(s.description);
          
          const { data: lesson, error: e2 } = await supabase.from('lessons').insert({
            course_id: course.id, title: s.title, description: s.description,
            content_type: 'text', order_index: j,
            action_type: s.action?.type, action_target: s.action?.target,
            action_value: s.action?.value
          }).select('id').single();

          if (e2) { results.errors.push(`Leçon "${s.title}": ${e2.message}`); continue; }
          results.lessons++;

          // Artistes
          for (const a of refs.artists) {
            await supabase.from('course_artists').insert({
              course_id: course.id, lesson_id: lesson.id, artist_name: a
            }).catch(() => {});
          }

          // Accords
          for (const c of refs.chords) {
            const cid = await getChord(c);
            if (cid) await supabase.from('course_chords').insert({
              course_id: course.id, lesson_id: lesson.id, chord_id: cid
            }).catch(() => {});
          }
        }
      }

      // Quiz
      if (t.content?.quiz) {
        for (let j = 0; j < t.content.quiz.length; j++) {
          const q = t.content.quiz[j];
          await supabase.from('quiz_questions').insert({
            course_id: course.id, question: q.question, options: q.options,
            correct_answer: q.correctAnswer, explanation: q.explanation, order_index: j
          });
          results.quizzes++;
        }
      }

      // Récompenses
      await supabase.from('course_rewards').insert({
        course_id: course.id, xp: t.rewards.xp || 0, badges: t.rewards.badges || []
      });
      results.rewards++;

      // Prérequis
      if (t.prerequisites) {
        for (const pid of t.prerequisites) {
          const pcid = courseMap.get(pid);
          if (pcid) await supabase.from('course_prerequisites').insert({
            course_id: course.id, prerequisite_course_id: pcid
          }).catch(() => {});
        }
      }

      await new Promise(r => setTimeout(r, 50));
    } catch (err) {
      results.errors.push(`Erreur générale "${t.title}": ${err.message}`);
    }
  }

  console.log('\n📊 RÉSUMÉ:');
  console.log(`✅ Cours: ${results.courses} | Leçons: ${results.lessons} | Quiz: ${results.quizzes} | Récompenses: ${results.rewards}`);
  if (results.errors.length) {
    console.log(`\n❌ Erreurs (${results.errors.length}):`);
    results.errors.forEach(e => console.log(`  - ${e}`));
  }
  console.log('🎉 Terminé !');
  return results;
}

// Exporter pour utilisation
window.deployTutorials = deployTutorials;

console.log('✅ Script chargé ! Utilisez: deployTutorials(tutorials)');

// ========== FIN DU CODE ==========
