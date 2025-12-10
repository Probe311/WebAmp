# Instructions pour appliquer la migration Supabase

## Étape 1 : Appliquer le schéma SQL

1. **Ouvrir le SQL Editor dans Supabase** :
   - Aller sur https://obsatctfkwanwxextiyz.supabase.co
   - Se connecter à votre projet
   - Cliquer sur "SQL Editor" dans le menu de gauche

2. **Copier le contenu de la migration** :
   - Ouvrir le fichier `supabase/migrations/0001_schema.sql`
   - Copier tout le contenu (Ctrl+A, Ctrl+C)

3. **Exécuter la migration** :
   - Coller le SQL dans l'éditeur Supabase
   - Cliquer sur "Run" ou appuyer sur Ctrl+Enter
   - Vérifier qu'il n'y a pas d'erreurs

## Étape 2 : Créer le bucket Storage

1. **Aller dans Storage** :
   - Cliquer sur "Storage" dans le menu de gauche
   - Cliquer sur "Create bucket"

2. **Configurer le bucket** :
   - **Nom** : `ir`
   - **Public bucket** : ❌ Désactivé (privé)
   - Cliquer sur "Create bucket"

3. **Configurer les politiques Storage** (optionnel, déjà dans la migration) :
   - Les politiques RLS pour le bucket sont définies dans la migration SQL
   - Si nécessaire, vérifier dans "Policies" du bucket

## Étape 3 : Exécuter le seed

Depuis le dossier `frontend/`, exécuter :

```powershell
$env:NODE_PATH="D:\Github\WebAmp\frontend\node_modules"
$env:SUPABASE_URL="https://obsatctfkwanwxextiyz.supabase.co"
$env:SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ic2F0Y3Rma3dhbnd4ZXh0aXl6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTM0NDgzMiwiZXhwIjoyMDgwOTIwODMyfQ.ejssoqVNQEgycnnhLeTKiWQGckeQIkv-E-bmhpDJjEk"
npx tsx ../supabase/seed/seed_catalog.ts
```

Ou créer un script PowerShell `supabase/seed.ps1` :

```powershell
$env:NODE_PATH="D:\Github\WebAmp\frontend\node_modules"
$env:SUPABASE_URL="https://obsatctfkwanwxextiyz.supabase.co"
$env:SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ic2F0Y3Rma3dhbnd4ZXh0aXl6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTM0NDgzMiwiZXhwIjoyMDgwOTIwODMyfQ.ejssoqVNQEgycnnhLeTKiWQGckeQIkv-E-bmhpDJjEk"
cd frontend
npx tsx ../supabase/seed/seed_catalog.ts
```

## Vérification

Après le seed, vérifier dans Supabase :
- **Table Editor** → `pedals` : doit contenir ~100+ pédales
- **Table Editor** → `amplifiers` : doit contenir ~50+ amplis
- **Storage** → `ir` : bucket créé et accessible

## Prochaines étapes

Une fois la migration et le seed terminés :
1. ✅ Les données seront disponibles dans Supabase
2. ✅ Le frontend pourra charger les pédales/amplis depuis Supabase
3. ✅ Les utilisateurs pourront créer/sauvegarder des presets
4. ✅ Les IR pourront être uploadées dans le bucket

