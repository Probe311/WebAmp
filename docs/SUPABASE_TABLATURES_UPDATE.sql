-- Script pour mettre à jour la table tablatures pour accepter des IDs TEXT
-- et permettre l'intégration avec Songsterr

-- Modifier le type de l'ID pour accepter des strings (comme "shake-it-off-001")
-- Note: Si vous avez déjà des données, vous devrez peut-être migrer les UUIDs existants

-- Option 1: Si vous n'avez pas encore de données dans la table tablatures
-- Vous pouvez simplement modifier le schéma :
ALTER TABLE IF EXISTS public.tablatures 
  ALTER COLUMN id TYPE TEXT;

-- Option 2: Si vous avez déjà des données UUID, créer une nouvelle colonne et migrer
-- (décommentez si nécessaire)
/*
ALTER TABLE IF EXISTS public.tablatures 
  ADD COLUMN IF NOT EXISTS id_text TEXT UNIQUE;

-- Migrer les IDs existants si nécessaire
-- UPDATE public.tablatures SET id_text = id::TEXT WHERE id_text IS NULL;

-- Puis changer la clé primaire (nécessite de supprimer les contraintes)
-- ALTER TABLE public.tablatures DROP CONSTRAINT tablatures_pkey;
-- ALTER TABLE public.tablatures DROP COLUMN id;
-- ALTER TABLE public.tablatures RENAME COLUMN id_text TO id;
-- ALTER TABLE public.tablatures ADD PRIMARY KEY (id);
*/

-- Ajouter une colonne pour stocker l'ID Songsterr (optionnel)
ALTER TABLE IF EXISTS public.tablatures 
  ADD COLUMN IF NOT EXISTS songsterr_id INTEGER;

-- Ajouter une colonne pour stocker l'URL Songsterr
ALTER TABLE IF EXISTS public.tablatures 
  ADD COLUMN IF NOT EXISTS songsterr_url TEXT;

-- Créer un index sur songsterr_id pour les recherches rapides
CREATE INDEX IF NOT EXISTS idx_tablatures_songsterr_id 
  ON public.tablatures(songsterr_id);

-- Créer un index sur le titre et l'artiste pour les recherches
CREATE INDEX IF NOT EXISTS idx_tablatures_title_artist 
  ON public.tablatures(title, artist);

