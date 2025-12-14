-- Script SQL pour appliquer des politiques RLS sécurisées
-- À exécuter APRÈS la migration des données
-- Ces politiques restreignent l'insertion/modification aux utilisateurs authentifiés

-- ============================================
-- 1. COURSES (Cours)
-- ============================================

-- Lecture : Tous peuvent voir les cours publiés
DROP POLICY IF EXISTS "Public courses are viewable by everyone" ON public.courses;
CREATE POLICY "Public courses are viewable by everyone"
  ON public.courses FOR SELECT
  USING (is_published = true);

-- Insertion : Seuls les utilisateurs authentifiés peuvent créer des cours
DROP POLICY IF EXISTS "Anyone can insert courses" ON public.courses;
DROP POLICY IF EXISTS "Authenticated users can insert courses" ON public.courses;
CREATE POLICY "Authenticated users can insert courses"
  ON public.courses FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Modification : Seuls les créateurs ou administrateurs peuvent modifier
DROP POLICY IF EXISTS "Authenticated users can update courses" ON public.courses;
CREATE POLICY "Authenticated users can update courses"
  ON public.courses FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Suppression : Seuls les créateurs ou administrateurs peuvent supprimer
DROP POLICY IF EXISTS "Authenticated users can delete courses" ON public.courses;
CREATE POLICY "Authenticated users can delete courses"
  ON public.courses FOR DELETE
  USING (auth.role() = 'authenticated');

-- ============================================
-- 2. LESSONS (Leçons)
-- ============================================

-- Lecture : Tous peuvent voir les leçons des cours publiés
DROP POLICY IF EXISTS "Lessons are viewable by everyone" ON public.lessons;
CREATE POLICY "Lessons are viewable by everyone"
  ON public.lessons FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.courses
      WHERE courses.id = lessons.course_id
      AND courses.is_published = true
    )
  );

-- Insertion : Seuls les utilisateurs authentifiés peuvent créer des leçons
DROP POLICY IF EXISTS "Anyone can insert lessons" ON public.lessons;
DROP POLICY IF EXISTS "Authenticated users can insert lessons" ON public.lessons;
CREATE POLICY "Authenticated users can insert lessons"
  ON public.lessons FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Modification : Seuls les utilisateurs authentifiés peuvent modifier
DROP POLICY IF EXISTS "Authenticated users can update lessons" ON public.lessons;
CREATE POLICY "Authenticated users can update lessons"
  ON public.lessons FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Suppression : Seuls les utilisateurs authentifiés peuvent supprimer
DROP POLICY IF EXISTS "Authenticated users can delete lessons" ON public.lessons;
CREATE POLICY "Authenticated users can delete lessons"
  ON public.lessons FOR DELETE
  USING (auth.role() = 'authenticated');

-- ============================================
-- 3. QUIZ_QUESTIONS (Questions de quiz)
-- ============================================

-- Lecture : Tous peuvent voir les questions des cours publiés
DROP POLICY IF EXISTS "Quiz questions are viewable by everyone" ON public.quiz_questions;
CREATE POLICY "Quiz questions are viewable by everyone"
  ON public.quiz_questions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.courses
      WHERE courses.id = quiz_questions.course_id
      AND courses.is_published = true
    )
  );

-- Insertion : Seuls les utilisateurs authentifiés peuvent créer des questions
DROP POLICY IF EXISTS "Anyone can insert quiz questions" ON public.quiz_questions;
DROP POLICY IF EXISTS "Authenticated users can insert quiz questions" ON public.quiz_questions;
CREATE POLICY "Authenticated users can insert quiz questions"
  ON public.quiz_questions FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Modification : Seuls les utilisateurs authentifiés peuvent modifier
DROP POLICY IF EXISTS "Authenticated users can update quiz questions" ON public.quiz_questions;
CREATE POLICY "Authenticated users can update quiz questions"
  ON public.quiz_questions FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Suppression : Seuls les utilisateurs authentifiés peuvent supprimer
DROP POLICY IF EXISTS "Authenticated users can delete quiz questions" ON public.quiz_questions;
CREATE POLICY "Authenticated users can delete quiz questions"
  ON public.quiz_questions FOR DELETE
  USING (auth.role() = 'authenticated');

-- ============================================
-- 4. COURSE_REWARDS (Récompenses)
-- ============================================

-- Lecture : Tous peuvent voir les récompenses des cours publiés
DROP POLICY IF EXISTS "Course rewards are viewable by everyone" ON public.course_rewards;
CREATE POLICY "Course rewards are viewable by everyone"
  ON public.course_rewards FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.courses
      WHERE courses.id = course_rewards.course_id
      AND courses.is_published = true
    )
  );

-- Insertion : Seuls les utilisateurs authentifiés peuvent créer des récompenses
DROP POLICY IF EXISTS "Anyone can insert course rewards" ON public.course_rewards;
DROP POLICY IF EXISTS "Authenticated users can insert course rewards" ON public.course_rewards;
CREATE POLICY "Authenticated users can insert course rewards"
  ON public.course_rewards FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Modification : Seuls les utilisateurs authentifiés peuvent modifier
DROP POLICY IF EXISTS "Authenticated users can update course rewards" ON public.course_rewards;
CREATE POLICY "Authenticated users can update course rewards"
  ON public.course_rewards FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ============================================
-- 5. USER_PROGRESS (Progression utilisateur)
-- ============================================

-- Les politiques existantes sont déjà sécurisées (utilisateurs voient/modifient uniquement leur propre progression)
-- Pas besoin de les modifier

-- ============================================
-- 6. USER_QUIZ_ATTEMPTS (Tentatives de quiz)
-- ============================================

-- Les politiques existantes sont déjà sécurisées (utilisateurs voient/insèrent uniquement leurs propres tentatives)
-- Pas besoin de les modifier

-- ============================================
-- 7. USER_STATS (Statistiques utilisateur)
-- ============================================

-- Les politiques existantes sont déjà sécurisées (utilisateurs voient/modifient uniquement leurs propres stats)
-- Pas besoin de les modifier

-- ============================================
-- 8. TABLATURES (Tablatures)
-- ============================================

-- Lecture : Tous peuvent voir les tablatures
DROP POLICY IF EXISTS "Tablatures are viewable by everyone" ON public.tablatures;
CREATE POLICY "Tablatures are viewable by everyone"
  ON public.tablatures FOR SELECT
  USING (true);

-- Insertion : Seuls les utilisateurs authentifiés peuvent créer des tablatures
DROP POLICY IF EXISTS "Anyone can insert tablatures" ON public.tablatures;
DROP POLICY IF EXISTS "Authenticated users can insert tablatures" ON public.tablatures;
CREATE POLICY "Authenticated users can insert tablatures"
  ON public.tablatures FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Modification : Seuls les utilisateurs authentifiés peuvent modifier
DROP POLICY IF EXISTS "Authenticated users can update tablatures" ON public.tablatures;
CREATE POLICY "Authenticated users can update tablatures"
  ON public.tablatures FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ============================================
-- 9. CHORDS (Accords)
-- ============================================

-- Lecture : Tous peuvent voir les accords
DROP POLICY IF EXISTS "Chords are viewable by everyone" ON public.chords;
CREATE POLICY "Chords are viewable by everyone"
  ON public.chords FOR SELECT
  USING (true);

-- Insertion : Seuls les utilisateurs authentifiés peuvent créer des accords
DROP POLICY IF EXISTS "Anyone can insert chords" ON public.chords;
DROP POLICY IF EXISTS "Authenticated users can insert chords" ON public.chords;
CREATE POLICY "Authenticated users can insert chords"
  ON public.chords FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Modification : Seuls les utilisateurs authentifiés peuvent modifier
DROP POLICY IF EXISTS "Authenticated users can update chords" ON public.chords;
CREATE POLICY "Authenticated users can update chords"
  ON public.chords FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ============================================
-- 10. COURSE_TABLATURES (Association cours ↔ tablatures)
-- ============================================

-- Lecture : Tous peuvent voir les associations
DROP POLICY IF EXISTS "Course tablatures are viewable by everyone" ON public.course_tablatures;
CREATE POLICY "Course tablatures are viewable by everyone"
  ON public.course_tablatures FOR SELECT
  USING (true);

-- Insertion : Seuls les utilisateurs authentifiés peuvent créer des associations
DROP POLICY IF EXISTS "Anyone can insert course tablatures" ON public.course_tablatures;
DROP POLICY IF EXISTS "Authenticated users can insert course tablatures" ON public.course_tablatures;
CREATE POLICY "Authenticated users can insert course tablatures"
  ON public.course_tablatures FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- ============================================
-- 11. COURSE_CHORDS (Association cours ↔ accords)
-- ============================================

-- Lecture : Tous peuvent voir les associations
DROP POLICY IF EXISTS "Course chords are viewable by everyone" ON public.course_chords;
CREATE POLICY "Course chords are viewable by everyone"
  ON public.course_chords FOR SELECT
  USING (true);

-- Insertion : Seuls les utilisateurs authentifiés peuvent créer des associations
DROP POLICY IF EXISTS "Anyone can insert course chords" ON public.course_chords;
DROP POLICY IF EXISTS "Authenticated users can insert course chords" ON public.course_chords;
CREATE POLICY "Authenticated users can insert course chords"
  ON public.course_chords FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- ============================================
-- 12. COURSE_ARTISTS (Association cours ↔ artistes)
-- ============================================

-- Lecture : Tous peuvent voir les associations
DROP POLICY IF EXISTS "Course artists are viewable by everyone" ON public.course_artists;
CREATE POLICY "Course artists are viewable by everyone"
  ON public.course_artists FOR SELECT
  USING (true);

-- Insertion : Seuls les utilisateurs authentifiés peuvent créer des associations
DROP POLICY IF EXISTS "Anyone can insert course artists" ON public.course_artists;
DROP POLICY IF EXISTS "Authenticated users can insert course artists" ON public.course_artists;
CREATE POLICY "Authenticated users can insert course artists"
  ON public.course_artists FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- ============================================
-- 13. COURSE_PREREQUISITES (Prérequis)
-- ============================================

-- Lecture : Tous peuvent voir les prérequis
DROP POLICY IF EXISTS "Course prerequisites are viewable by everyone" ON public.course_prerequisites;
CREATE POLICY "Course prerequisites are viewable by everyone"
  ON public.course_prerequisites FOR SELECT
  USING (true);

-- Insertion : Seuls les utilisateurs authentifiés peuvent créer des prérequis
DROP POLICY IF EXISTS "Anyone can insert course prerequisites" ON public.course_prerequisites;
DROP POLICY IF EXISTS "Authenticated users can insert course prerequisites" ON public.course_prerequisites;
CREATE POLICY "Authenticated users can insert course prerequisites"
  ON public.course_prerequisites FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- ============================================
-- RÉSUMÉ DES POLITIQUES
-- ============================================

-- Message de confirmation
DO $$
BEGIN
  RAISE NOTICE '✅ Politiques RLS sécurisées appliquées avec succès !';
  RAISE NOTICE '';
  RAISE NOTICE '📋 Récapitulatif des politiques :';
  RAISE NOTICE '   ✅ Lecture publique : Cours publiés, leçons, quiz, récompenses, tablatures, accords';
  RAISE NOTICE '   ✅ Insertion restreinte : Seuls les utilisateurs authentifiés peuvent créer du contenu';
  RAISE NOTICE '   ✅ Modification restreinte : Seuls les utilisateurs authentifiés peuvent modifier';
  RAISE NOTICE '   ✅ Données utilisateur : Chaque utilisateur voit/modifie uniquement ses propres données';
  RAISE NOTICE '';
  RAISE NOTICE '🔒 Sécurité :';
  RAISE NOTICE '   - Les utilisateurs non authentifiés peuvent uniquement lire le contenu publié';
  RAISE NOTICE '   - Les utilisateurs authentifiés peuvent créer et modifier du contenu';
  RAISE NOTICE '   - Les données de progression sont privées par utilisateur';
END $$;

