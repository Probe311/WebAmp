-- Script pour intégrer Songsterr dans la base de données
-- Ce script ajoute les colonnes nécessaires pour stocker les données Songsterr

-- 1. Ajouter les colonnes Songsterr à la table tablatures
ALTER TABLE IF EXISTS public.tablatures 
  ADD COLUMN IF NOT EXISTS songsterr_id INTEGER;

ALTER TABLE IF EXISTS public.tablatures 
  ADD COLUMN IF NOT EXISTS songsterr_url TEXT;

-- 2. Créer des index pour améliorer les performances de recherche
CREATE INDEX IF NOT EXISTS idx_tablatures_songsterr_id 
  ON public.tablatures(songsterr_id);

CREATE INDEX IF NOT EXISTS idx_tablatures_title_artist 
  ON public.tablatures(title, artist);

CREATE INDEX IF NOT EXISTS idx_tablatures_songsterr_url 
  ON public.tablatures(songsterr_url);

-- 3. Mettre à jour les politiques RLS pour permettre la sauvegarde des tablatures Songsterr
-- (Les politiques existantes devraient déjà permettre l'insertion, mais on s'assure qu'elles sont correctes)

-- Note: Si vous avez besoin de modifier le type de l'ID de UUID à TEXT pour utiliser des IDs comme "shake-it-off-001",
-- vous pouvez utiliser le script suivant (ATTENTION: cela nécessite de supprimer les données existantes ou de migrer) :

/*
-- Option pour changer l'ID en TEXT (à utiliser avec précaution)
-- 1. Sauvegarder les données existantes
-- 2. Supprimer les contraintes de clé étrangère
ALTER TABLE IF EXISTS public.course_tablatures 
  DROP CONSTRAINT IF EXISTS course_tablatures_tablature_id_fkey;

-- 3. Créer une nouvelle table avec TEXT comme ID
CREATE TABLE IF NOT EXISTS public.tablatures_new (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  artist TEXT,
  tempo INTEGER,
  time_signature TEXT DEFAULT '4/4',
  key TEXT,
  preset_id TEXT,
  measures JSONB NOT NULL,
  songsterr_id INTEGER,
  songsterr_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Migrer les données (si nécessaire)
-- INSERT INTO public.tablatures_new SELECT * FROM public.tablatures;

-- 5. Remplacer l'ancienne table
-- DROP TABLE public.tablatures;
-- ALTER TABLE public.tablatures_new RENAME TO tablatures;

-- 6. Recréer les contraintes
-- ALTER TABLE public.course_tablatures 
--   ADD CONSTRAINT course_tablatures_tablature_id_fkey 
--   FOREIGN KEY (tablature_id) REFERENCES public.tablatures(id) ON DELETE CASCADE;
*/

-- Pour l'instant, on garde UUID comme ID et on génère un UUID pour chaque tablature
-- L'ID original (comme "shake-it-off-001") peut être stocké dans une colonne séparée si nécessaire

-- Ajouter une colonne pour stocker l'ID original (slug) si nécessaire
ALTER TABLE IF EXISTS public.tablatures 
  ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;

CREATE INDEX IF NOT EXISTS idx_tablatures_slug 
  ON public.tablatures(slug);

