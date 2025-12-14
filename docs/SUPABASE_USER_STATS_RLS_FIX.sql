-- Script SQL pour corriger les politiques RLS de la table user_stats
-- À exécuter dans l'éditeur SQL de Supabase
-- Ce script corrige les erreurs 401 (Unauthorized) et 406 (Not Acceptable) pour user_stats

-- ============================================
-- USER_STATS (Statistiques utilisateur)
-- ============================================

-- Supprimer toutes les anciennes politiques
DROP POLICY IF EXISTS "Users can view their own stats" ON public.user_stats;
DROP POLICY IF EXISTS "Users can update their own stats" ON public.user_stats;
DROP POLICY IF EXISTS "Users can insert their own stats" ON public.user_stats;
DROP POLICY IF EXISTS "Authenticated users can view their own stats" ON public.user_stats;
DROP POLICY IF EXISTS "Authenticated users can update their own stats" ON public.user_stats;
DROP POLICY IF EXISTS "Authenticated users can insert their own stats" ON public.user_stats;
DROP POLICY IF EXISTS "Anyone can insert user stats" ON public.user_stats;

-- Vérifier que RLS est activé
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

-- Politique pour la lecture (SELECT) : Les utilisateurs authentifiés peuvent voir leurs propres stats
CREATE POLICY "Users can view their own stats"
  ON public.user_stats FOR SELECT
  USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- Politique pour la mise à jour (UPDATE) : Les utilisateurs authentifiés peuvent mettre à jour leurs propres stats
CREATE POLICY "Users can update their own stats"
  ON public.user_stats FOR UPDATE
  USING (auth.uid() IS NOT NULL AND auth.uid() = user_id)
  WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- Politique pour l'insertion (INSERT) : Les utilisateurs authentifiés peuvent créer leurs propres stats
CREATE POLICY "Users can insert their own stats"
  ON public.user_stats FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- Fonction pour créer automatiquement les stats si elles n'existent pas
CREATE OR REPLACE FUNCTION create_user_stats_if_not_exists()
RETURNS TRIGGER AS $$
BEGIN
  -- Vérifier si les stats existent déjà pour cet utilisateur
  IF NOT EXISTS (
    SELECT 1 FROM public.user_stats WHERE user_id = NEW.id
  ) THEN
    -- Créer les stats initiales
    INSERT INTO public.user_stats (
      user_id,
      total_xp,
      courses_completed,
      lessons_completed,
      quizzes_completed,
      badges,
      current_streak,
      last_activity_at
    ) VALUES (
      NEW.id,
      0,
      0,
      0,
      0,
      ARRAY[]::TEXT[],
      0,
      NOW()
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour créer automatiquement les stats lors de la création d'un utilisateur
DROP TRIGGER IF EXISTS create_user_stats_on_signup ON auth.users;
CREATE TRIGGER create_user_stats_on_signup
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_stats_if_not_exists();

-- Message de confirmation
DO $$
BEGIN
  RAISE NOTICE '✅ Les politiques RLS pour user_stats ont été corrigées avec succès !';
  RAISE NOTICE '✅ Les utilisateurs authentifiés peuvent maintenant lire, créer et mettre à jour leurs propres stats';
  RAISE NOTICE '✅ Un trigger a été créé pour créer automatiquement les stats lors de l''inscription';
END $$;

