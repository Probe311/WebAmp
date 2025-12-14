# Supabase Edge Functions

Ce dossier contient les Edge Functions Supabase pour contourner les restrictions CORS et effectuer des appels API côté serveur.

## Structure

```
functions/
├── _shared/          # Code partagé entre les fonctions
│   └── cors.ts      # Service CORS réutilisable
├── songsterr/        # Fonction pour les appels Songsterr
│   └── index.ts
└── README.md         # Ce fichier
```

## Déploiement

### Prérequis

1. Installer Supabase CLI : https://supabase.com/docs/guides/cli
2. Se connecter à votre projet : `supabase login`
3. Lier votre projet : `supabase link --project-ref your-project-ref`

### Déployer une fonction

```bash
# Déployer la fonction songsterr
supabase functions deploy songsterr

# Déployer toutes les fonctions
supabase functions deploy
```

### Tester localement

```bash
# Démarrer l'environnement local
supabase start

# Tester la fonction songsterr
curl -X POST http://localhost:54321/functions/v1/songsterr \
  -H "Content-Type: application/json" \
  -d '{"action": "search", "query": "shake it off taylor swift"}'
```

## Fonctions disponibles

### songsterr

Endpoint pour les appels à l'API Songsterr.

**Actions disponibles :**
- `search`: Recherche une chanson par titre et artiste
- `getTabData`: Récupère les données complètes d'une tablature par ID

**Exemple de requête :**

```json
{
  "action": "search",
  "query": "shake it off taylor swift"
}
```

```json
{
  "action": "getTabData",
  "tabId": 468698
}
```

**Réponse :**

```json
{
  "success": true,
  "data": { ... }
}
```

## Service CORS partagé

Le service `_shared/cors.ts` fournit des utilitaires pour gérer CORS de manière standardisée :

- `createCorsPreflightResponse()`: Crée une réponse OPTIONS
- `addCorsHeaders()`: Ajoute les en-têtes CORS à une réponse
- `createCorsJsonResponse()`: Crée une réponse JSON avec CORS
- `createCorsErrorResponse()`: Crée une réponse d'erreur avec CORS
- `handleCors()`: Gère automatiquement CORS pour un handler

## Ajouter une nouvelle fonction

1. Créer un nouveau dossier dans `functions/`
2. Créer un fichier `index.ts` avec votre handler
3. Utiliser `handleCors()` pour gérer CORS automatiquement
4. Déployer avec `supabase functions deploy <nom-fonction>`

