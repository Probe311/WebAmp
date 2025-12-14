-- ============================================================================
-- Script de mise à jour Supabase pour l'intégration Songsterr
-- ============================================================================
-- Ce script ajoute les colonnes nécessaires pour stocker les données Songsterr
-- et crée les index pour améliorer les performances.
-- 
-- SÉCURITÉ : Ce script utilise IF NOT EXISTS pour éviter les erreurs si
-- les colonnes/index existent déjà. Il est sûr à exécuter plusieurs fois.
-- ============================================================================

BEGIN;

-- ============================================================================
-- 1. Ajout des colonnes Songsterr à la table tablatures
-- ============================================================================

-- Colonne pour stocker l'ID Songsterr (numérique)
ALTER TABLE IF EXISTS public.tablatures 
  ADD COLUMN IF NOT EXISTS songsterr_id INTEGER;

-- Colonne pour stocker l'URL Songsterr
ALTER TABLE IF EXISTS public.tablatures 
  ADD COLUMN IF NOT EXISTS songsterr_url TEXT;

-- Colonne pour stocker le slug (ID original comme "shake-it-off-001")
-- Permet de rechercher par slug même si l'ID principal est un UUID
ALTER TABLE IF EXISTS public.tablatures 
  ADD COLUMN IF NOT EXISTS slug TEXT;

-- ============================================================================
-- 2. Création des index pour améliorer les performances
-- ============================================================================

-- Index sur songsterr_id pour les recherches rapides par ID Songsterr
CREATE INDEX IF NOT EXISTS idx_tablatures_songsterr_id 
  ON public.tablatures(songsterr_id)
  WHERE songsterr_id IS NOT NULL;

-- Index sur slug pour les recherches par slug
CREATE INDEX IF NOT EXISTS idx_tablatures_slug 
  ON public.tablatures(slug)
  WHERE slug IS NOT NULL;

-- Index composite sur title et artist pour les recherches par titre/artiste
CREATE INDEX IF NOT EXISTS idx_tablatures_title_artist 
  ON public.tablatures(title, artist)
  WHERE title IS NOT NULL AND artist IS NOT NULL;

-- Index sur songsterr_url pour les recherches par URL
CREATE INDEX IF NOT EXISTS idx_tablatures_songsterr_url 
  ON public.tablatures(songsterr_url)
  WHERE songsterr_url IS NOT NULL;

-- ============================================================================
-- 3. Contrainte d'unicité sur slug (optionnel, décommentez si nécessaire)
-- ============================================================================

-- Créer une contrainte d'unicité sur slug si elle n'existe pas déjà
-- Note: Cette contrainte peut échouer si des slugs dupliqués existent déjà
-- Dans ce cas, nettoyez d'abord les doublons avant d'exécuter cette ligne
/*
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'tablatures_slug_unique'
  ) THEN
    ALTER TABLE public.tablatures 
      ADD CONSTRAINT tablatures_slug_unique UNIQUE (slug);
  END IF;
END $$;
*/

-- ============================================================================
-- 4. Mise à jour des politiques RLS (si nécessaire)
-- ============================================================================

-- Vérifier et créer une politique pour permettre l'insertion de tablatures
-- Cette politique permet à tous les utilisateurs authentifiés d'insérer des tablatures
-- (utile pour la sauvegarde automatique depuis Songsterr)
DO $$
BEGIN
  -- Vérifier si la politique existe déjà
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'tablatures' 
    AND policyname = 'Allow authenticated users to insert tablatures'
  ) THEN
    CREATE POLICY "Allow authenticated users to insert tablatures"
      ON public.tablatures
      FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;

  -- Vérifier si la politique pour les mises à jour existe
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'tablatures' 
    AND policyname = 'Allow authenticated users to update tablatures'
  ) THEN
    CREATE POLICY "Allow authenticated users to update tablatures"
      ON public.tablatures
      FOR UPDATE
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- ============================================================================
-- 5. Commentaires sur les colonnes pour la documentation
-- ============================================================================

COMMENT ON COLUMN public.tablatures.songsterr_id IS 
  'ID numérique de la tablature sur Songsterr (ex: 12345)';

COMMENT ON COLUMN public.tablatures.songsterr_url IS 
  'URL complète vers la tablature sur Songsterr';

COMMENT ON COLUMN public.tablatures.slug IS 
  'Slug unique de la tablature (ex: "shake-it-off-001") utilisé pour la recherche';

-- ============================================================================
-- 6. Fonction pour mettre à jour automatiquement updated_at
-- ============================================================================

-- Créer ou remplacer la fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_tablatures_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Créer le trigger si il n'existe pas déjà
DROP TRIGGER IF EXISTS update_tablatures_updated_at_trigger ON public.tablatures;
CREATE TRIGGER update_tablatures_updated_at_trigger
  BEFORE UPDATE ON public.tablatures
  FOR EACH ROW
  EXECUTE FUNCTION update_tablatures_updated_at();

-- ============================================================================
-- 7. Vérification de l'intégrité des données (optionnel)
-- ============================================================================

-- Vérifier qu'il n'y a pas de doublons de slug (affiche un avertissement)
DO $$
DECLARE
  duplicate_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO duplicate_count
  FROM (
    SELECT slug, COUNT(*) as cnt
    FROM public.tablatures
    WHERE slug IS NOT NULL
    GROUP BY slug
    HAVING COUNT(*) > 1
  ) duplicates;
  
  IF duplicate_count > 0 THEN
    RAISE NOTICE 'ATTENTION: % slugs dupliqués trouvés dans la table tablatures. Nettoyez-les avant d''ajouter la contrainte d''unicité.', duplicate_count;
  END IF;
END $$;

-- ============================================================================
-- 8. Statistiques et informations
-- ============================================================================

-- Analyser la table pour mettre à jour les statistiques du planificateur
ANALYZE public.tablatures;

-- Afficher un résumé des modifications
DO $$
DECLARE
  songsterr_count INTEGER;
  slug_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO songsterr_count
  FROM public.tablatures
  WHERE songsterr_id IS NOT NULL;
  
  SELECT COUNT(*) INTO slug_count
  FROM public.tablatures
  WHERE slug IS NOT NULL;
  
  RAISE NOTICE 'Mise à jour terminée avec succès!';
  RAISE NOTICE '- Tablatures avec songsterr_id: %', songsterr_count;
  RAISE NOTICE '- Tablatures avec slug: %', slug_count;
END $$;

COMMIT;

-- ============================================================================
-- FIN DU SCRIPT
-- ============================================================================
-- 
-- Ce script a :
-- 1. Ajouté les colonnes songsterr_id, songsterr_url et slug
-- 2. Créé les index pour améliorer les performances
-- 3. Configuré les politiques RLS pour permettre l'insertion/mise à jour
-- 4. Créé un trigger pour mettre à jour automatiquement updated_at
-- 5. Vérifié l'intégrité des données
-- 
-- Pour vérifier que tout fonctionne :
-- SELECT column_name, data_type, is_nullable 
-- FROM information_schema.columns 
-- WHERE table_name = 'tablatures' 
-- AND column_name IN ('songsterr_id', 'songsterr_url', 'slug');
-- ============================================================================

