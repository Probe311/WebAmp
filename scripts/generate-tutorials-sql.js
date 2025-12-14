// Script Node.js pour générer le SQL d'insertion des tutoriels
// Usage: node scripts/generate-tutorials-sql.js

const fs = require('fs');
const path = require('path');

// Lire le fichier tutorials.ts et extraire les données
const tutorialsPath = path.join(__dirname, '../frontend/src/data/tutorials.ts');
const tutorialsContent = fs.readFileSync(tutorialsPath, 'utf-8');

// Parser les tutoriels (méthode simple basée sur la structure)
function escapeSqlString(str) {
  if (!str) return '';
  return str.replace(/'/g, "''").replace(/\n/g, '\\n');
}

function generateSql() {
  // Pour simplifier, on va créer un script qui utilise une approche différente
  // On va créer des fonctions SQL qui peuvent être appelées avec les données JSON
  
  let sql = `-- Script SQL pour déployer toutes les leçons sur Supabase
-- Généré automatiquement depuis frontend/src/data/tutorials.ts
-- Date de génération: ${new Date().toISOString()}

-- 1. Mettre à jour la contrainte CHECK pour inclure 'pro' dans la difficulté
ALTER TABLE public.courses DROP CONSTRAINT IF EXISTS courses_difficulty_check;
ALTER TABLE public.courses ADD CONSTRAINT courses_difficulty_check 
  CHECK (difficulty IN ('beginner', 'intermediate', 'advanced', 'pro'));

-- 2. Fonction helper pour insérer un cours complet
CREATE OR REPLACE FUNCTION insert_course_with_content(
  p_title TEXT,
  p_description TEXT,
  p_category TEXT,
  p_difficulty TEXT,
  p_duration INTEGER,
  p_type TEXT,
  p_icon TEXT,
  p_tags TEXT[],
  p_order_index INTEGER,
  p_steps JSONB DEFAULT NULL,
  p_quiz_questions JSONB DEFAULT NULL,
  p_xp INTEGER DEFAULT 0,
  p_badges TEXT[] DEFAULT ARRAY[]::TEXT[],
  p_prerequisites TEXT[] DEFAULT ARRAY[]::TEXT[]
)
RETURNS UUID AS $$
DECLARE
  course_uuid UUID;
  step_item JSONB;
  quiz_item JSONB;
  prereq_id TEXT;
BEGIN
  -- Insérer le cours
  INSERT INTO public.courses (title, description, category, difficulty, duration, type, icon, tags, order_index, is_published)
  VALUES (p_title, p_description, p_category, p_difficulty, p_duration, p_type, p_icon, p_tags, p_order_index, true)
  RETURNING id INTO course_uuid;
  
  -- Insérer les leçons
  IF p_steps IS NOT NULL THEN
    FOR step_item IN SELECT * FROM jsonb_array_elements(p_steps)
    LOOP
      INSERT INTO public.lessons (course_id, title, description, order_index, action_type, action_target, action_value)
      VALUES (
        course_uuid,
        step_item->>'title',
        step_item->>'description',
        (step_item->>'order_index')::INTEGER,
        NULLIF(step_item->>'action_type', 'null'),
        NULLIF(step_item->>'action_target', 'null'),
        CASE 
          WHEN step_item->'action_value' IS NOT NULL AND step_item->'action_value' != 'null'::jsonb 
          THEN step_item->'action_value'
          ELSE NULL
        END
      );
    END LOOP;
  END IF;
  
  -- Insérer les questions de quiz
  IF p_quiz_questions IS NOT NULL THEN
    FOR quiz_item IN SELECT * FROM jsonb_array_elements(p_quiz_questions)
    LOOP
      INSERT INTO public.quiz_questions (course_id, question, options, correct_answer, explanation, order_index)
      VALUES (
        course_uuid,
        quiz_item->>'question',
        ARRAY(SELECT jsonb_array_elements_text(quiz_item->'options')),
        (quiz_item->>'correctAnswer')::INTEGER,
        quiz_item->>'explanation',
        (quiz_item->>'order_index')::INTEGER
      );
    END LOOP;
  END IF;
  
  -- Insérer les récompenses
  INSERT INTO public.course_rewards (course_id, xp, badges)
  VALUES (course_uuid, p_xp, p_badges);
  
  RETURN course_uuid;
END;
$$ LANGUAGE plpgsql;

-- Note: Ce script nécessite que vous importiez les données depuis tutorials.ts
-- Pour une solution complète, utilisez le script TypeScript generate_tutorials_sql.ts
-- qui génère directement tous les INSERT statements

-- Exemple d'utilisation de la fonction:
/*
SELECT insert_course_with_content(
  'Votre premier preset',
  'Créez votre premier preset en ajoutant une pédale de distorsion et en ajustant les paramètres de base.',
  'basics',
  'beginner',
  5,
  'tutorial',
  'Sparkles',
  ARRAY['débutant', 'preset', 'distortion'],
  0,
  '[
    {"title": "Introduction à WebAmp", "description": "Bienvenue dans WebAmp !", "order_index": 0},
    {"title": "Ajouter une pédale", "description": "Cliquez sur le bouton +", "order_index": 1, "action_type": "addPedal", "action_target": "boss-ds1"}
  ]'::jsonb,
  NULL,
  50,
  ARRAY['premiers-pas']
);
*/

DO $$
BEGIN
  RAISE NOTICE '⚠️  Ce fichier contient la fonction helper pour insérer les cours.';
  RAISE NOTICE '⚠️  Pour générer le SQL complet avec tous les tutoriels, exécutez:';
  RAISE NOTICE '⚠️  npx tsx frontend/src/scripts/generate_tutorials_sql.ts';
END $$;
`;

  return sql;
}

// Écrire le fichier SQL
const sql = generateSql();
const outputPath = path.join(__dirname, '../supabase/migrations/0002_seed_tutorials_helper.sql');
fs.writeFileSync(outputPath, sql, 'utf-8');
console.log(`✅ Fichier SQL helper généré: ${outputPath}`);
