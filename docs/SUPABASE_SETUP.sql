-- Script SQL complet pour créer toutes les tables du LMS WebAmp
-- À exécuter dans l'éditeur SQL de Supabase

-- 1. Table courses (Cours)
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced', 'pro')),
  duration INTEGER,
  type TEXT NOT NULL CHECK (type IN ('tutorial', 'guide', 'quiz', 'preset')),
  icon TEXT,
  tags TEXT[],
  order_index INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Table lessons (Leçons/Étapes)
CREATE TABLE IF NOT EXISTS public.lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  content_type TEXT DEFAULT 'text' CHECK (content_type IN ('text', 'video', 'interactive')),
  order_index INTEGER NOT NULL,
  action_type TEXT,
  action_target TEXT,
  action_value JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(course_id, order_index)
);

-- 3. Table quiz_questions (Questions de quiz)
CREATE TABLE IF NOT EXISTS public.quiz_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  options TEXT[] NOT NULL,
  correct_answer INTEGER NOT NULL,
  explanation TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(course_id, order_index)
);

-- 4. Table course_rewards (Récompenses)
CREATE TABLE IF NOT EXISTS public.course_rewards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  xp INTEGER DEFAULT 0,
  badges TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Table user_progress (Progression utilisateur)
CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  time_spent INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, course_id, lesson_id)
);

-- 6. Table user_quiz_attempts (Tentatives de quiz)
CREATE TABLE IF NOT EXISTS public.user_quiz_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  total_questions INTEGER NOT NULL,
  correct_answers INTEGER NOT NULL,
  answers JSONB,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Table user_stats (Statistiques utilisateur)
CREATE TABLE IF NOT EXISTS public.user_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  total_xp INTEGER DEFAULT 0,
  courses_completed INTEGER DEFAULT 0,
  lessons_completed INTEGER DEFAULT 0,
  quizzes_completed INTEGER DEFAULT 0,
  badges TEXT[],
  current_streak INTEGER DEFAULT 0,
  last_activity_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Table course_prerequisites (Prérequis)
CREATE TABLE IF NOT EXISTS public.course_prerequisites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  prerequisite_course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(course_id, prerequisite_course_id)
);

-- 9. Table tablatures (Tablatures)
CREATE TABLE IF NOT EXISTS public.tablatures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  artist TEXT,
  tempo INTEGER,
  time_signature TEXT DEFAULT '4/4',
  key TEXT,
  preset_id TEXT,
  measures JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Table chords (Accords)
CREATE TABLE IF NOT EXISTS public.chords (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  frets INTEGER[] NOT NULL,
  fingers INTEGER[],
  base_fret INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. Table course_tablatures (Association cours ↔ tablatures)
CREATE TABLE IF NOT EXISTS public.course_tablatures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  tablature_id UUID REFERENCES public.tablatures(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(course_id, tablature_id, lesson_id)
);

-- 12. Table course_chords (Association cours ↔ accords)
CREATE TABLE IF NOT EXISTS public.course_chords (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  chord_id UUID REFERENCES public.chords(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(course_id, chord_id, lesson_id)
);

-- 13. Table course_artists (Association cours ↔ artistes)
CREATE TABLE IF NOT EXISTS public.course_artists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  artist_name TEXT NOT NULL,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
  musicbrainz_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(course_id, artist_name, lesson_id)
);

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_courses_category ON public.courses(category);
CREATE INDEX IF NOT EXISTS idx_courses_difficulty ON public.courses(difficulty);
CREATE INDEX IF NOT EXISTS idx_courses_is_published ON public.courses(is_published);
CREATE INDEX IF NOT EXISTS idx_lessons_course_id ON public.lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON public.user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_course_id ON public.user_progress(course_id);
CREATE INDEX IF NOT EXISTS idx_user_quiz_attempts_user_id ON public.user_quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_user_stats_user_id ON public.user_stats(user_id);

-- Activer RLS (Row Level Security)
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tablatures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chords ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour courses (lecture publique des cours publiés)
DROP POLICY IF EXISTS "Public courses are viewable by everyone" ON public.courses;
CREATE POLICY "Public courses are viewable by everyone"
  ON public.courses FOR SELECT
  USING (is_published = true);

-- Politique pour permettre l'insertion de cours (pour la migration et l'administration)
DROP POLICY IF EXISTS "Anyone can insert courses" ON public.courses;
CREATE POLICY "Anyone can insert courses"
  ON public.courses FOR INSERT
  WITH CHECK (true);

-- Politiques RLS pour lessons (lecture publique)
DROP POLICY IF EXISTS "Lessons are viewable by everyone" ON public.lessons;
CREATE POLICY "Lessons are viewable by everyone"
  ON public.lessons FOR SELECT
  USING (true);

-- Politique pour permettre l'insertion de leçons
DROP POLICY IF EXISTS "Anyone can insert lessons" ON public.lessons;
CREATE POLICY "Anyone can insert lessons"
  ON public.lessons FOR INSERT
  WITH CHECK (true);

-- Politiques RLS pour quiz_questions (lecture publique)
DROP POLICY IF EXISTS "Quiz questions are viewable by everyone" ON public.quiz_questions;
CREATE POLICY "Quiz questions are viewable by everyone"
  ON public.quiz_questions FOR SELECT
  USING (true);

-- Politique pour permettre l'insertion de questions de quiz
DROP POLICY IF EXISTS "Anyone can insert quiz questions" ON public.quiz_questions;
CREATE POLICY "Anyone can insert quiz questions"
  ON public.quiz_questions FOR INSERT
  WITH CHECK (true);

-- Politiques RLS pour course_rewards (lecture publique)
DROP POLICY IF EXISTS "Course rewards are viewable by everyone" ON public.course_rewards;
CREATE POLICY "Course rewards are viewable by everyone"
  ON public.course_rewards FOR SELECT
  USING (true);

-- Politique pour permettre l'insertion de récompenses
DROP POLICY IF EXISTS "Anyone can insert course rewards" ON public.course_rewards;
CREATE POLICY "Anyone can insert course rewards"
  ON public.course_rewards FOR INSERT
  WITH CHECK (true);

-- Politiques RLS pour user_progress (utilisateurs peuvent voir/modifier leur propre progression)
DROP POLICY IF EXISTS "Users can view their own progress" ON public.user_progress;
CREATE POLICY "Users can view their own progress"
  ON public.user_progress FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own progress" ON public.user_progress;
CREATE POLICY "Users can update their own progress"
  ON public.user_progress FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own progress" ON public.user_progress;
CREATE POLICY "Users can insert their own progress"
  ON public.user_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Politiques RLS pour user_quiz_attempts (utilisateurs peuvent voir/insérer leurs propres tentatives)
DROP POLICY IF EXISTS "Users can view their own quiz attempts" ON public.user_quiz_attempts;
CREATE POLICY "Users can view their own quiz attempts"
  ON public.user_quiz_attempts FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own quiz attempts" ON public.user_quiz_attempts;
CREATE POLICY "Users can insert their own quiz attempts"
  ON public.user_quiz_attempts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Politiques RLS pour user_stats (utilisateurs peuvent voir/modifier leurs propres stats)
DROP POLICY IF EXISTS "Users can view their own stats" ON public.user_stats;
CREATE POLICY "Users can view their own stats"
  ON public.user_stats FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own stats" ON public.user_stats;
CREATE POLICY "Users can update their own stats"
  ON public.user_stats FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own stats" ON public.user_stats;
CREATE POLICY "Users can insert their own stats"
  ON public.user_stats FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Politiques RLS pour tablatures (lecture publique)
DROP POLICY IF EXISTS "Tablatures are viewable by everyone" ON public.tablatures;
CREATE POLICY "Tablatures are viewable by everyone"
  ON public.tablatures FOR SELECT
  USING (true);

-- Politique pour permettre l'insertion de tablatures
DROP POLICY IF EXISTS "Anyone can insert tablatures" ON public.tablatures;
CREATE POLICY "Anyone can insert tablatures"
  ON public.tablatures FOR INSERT
  WITH CHECK (true);

-- Politiques RLS pour chords (lecture publique)
DROP POLICY IF EXISTS "Chords are viewable by everyone" ON public.chords;
CREATE POLICY "Chords are viewable by everyone"
  ON public.chords FOR SELECT
  USING (true);

-- Politique pour permettre l'insertion d'accords
DROP POLICY IF EXISTS "Anyone can insert chords" ON public.chords;
CREATE POLICY "Anyone can insert chords"
  ON public.chords FOR INSERT
  WITH CHECK (true);

-- Politiques RLS pour les tables d'association (lecture publique)
-- course_tablatures
DROP POLICY IF EXISTS "Course tablatures are viewable by everyone" ON public.course_tablatures;
CREATE POLICY "Course tablatures are viewable by everyone"
  ON public.course_tablatures FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Anyone can insert course tablatures" ON public.course_tablatures;
CREATE POLICY "Anyone can insert course tablatures"
  ON public.course_tablatures FOR INSERT
  WITH CHECK (true);

-- course_chords
DROP POLICY IF EXISTS "Course chords are viewable by everyone" ON public.course_chords;
CREATE POLICY "Course chords are viewable by everyone"
  ON public.course_chords FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Anyone can insert course chords" ON public.course_chords;
CREATE POLICY "Anyone can insert course chords"
  ON public.course_chords FOR INSERT
  WITH CHECK (true);

-- course_artists
DROP POLICY IF EXISTS "Course artists are viewable by everyone" ON public.course_artists;
CREATE POLICY "Course artists are viewable by everyone"
  ON public.course_artists FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Anyone can insert course artists" ON public.course_artists;
CREATE POLICY "Anyone can insert course artists"
  ON public.course_artists FOR INSERT
  WITH CHECK (true);

-- course_prerequisites
DROP POLICY IF EXISTS "Course prerequisites are viewable by everyone" ON public.course_prerequisites;
CREATE POLICY "Course prerequisites are viewable by everyone"
  ON public.course_prerequisites FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Anyone can insert course prerequisites" ON public.course_prerequisites;
CREATE POLICY "Anyone can insert course prerequisites"
  ON public.course_prerequisites FOR INSERT
  WITH CHECK (true);

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour mettre à jour updated_at
DROP TRIGGER IF EXISTS update_courses_updated_at ON public.courses;
CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON public.courses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_lessons_updated_at ON public.lessons;
CREATE TRIGGER update_lessons_updated_at
  BEFORE UPDATE ON public.lessons
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_progress_updated_at ON public.user_progress;
CREATE TRIGGER update_user_progress_updated_at
  BEFORE UPDATE ON public.user_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_stats_updated_at ON public.user_stats;
CREATE TRIGGER update_user_stats_updated_at
  BEFORE UPDATE ON public.user_stats
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Fonction pour calculer le pourcentage de progression d'un cours
CREATE OR REPLACE FUNCTION get_course_progress(user_uuid UUID, course_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
  total_lessons INTEGER;
  completed_lessons INTEGER;
BEGIN
  SELECT COUNT(*) INTO total_lessons
  FROM public.lessons
  WHERE course_id = course_uuid;
  
  SELECT COUNT(*) INTO completed_lessons
  FROM public.user_progress
  WHERE user_id = user_uuid
    AND course_id = course_uuid
    AND is_completed = true;
  
  IF total_lessons = 0 THEN
    RETURN 0;
  END IF;
  
  RETURN (completed_lessons * 100) / total_lessons;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Message de confirmation
DO $$
BEGIN
  RAISE NOTICE '✅ Toutes les tables du LMS WebAmp ont été créées avec succès !';
  RAISE NOTICE '✅ Les politiques RLS ont été configurées';
  RAISE NOTICE '✅ Les index ont été créés pour optimiser les performances';
  RAISE NOTICE '✅ Les triggers pour updated_at ont été configurés';
END $$;

