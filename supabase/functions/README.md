# Supabase Edge Functions

Ce dossier contient les Edge Functions Supabase pour contourner les restrictions CORS et effectuer des appels API côté serveur.

## Structure

```
functions/
├── _shared/          # Code partagé entre les fonctions
│   └── cors.ts      # Service CORS réutilisable
└── README.md         # Ce fichier
```

## Déploiement

### Prérequis

1. Installer Supabase CLI : https://supabase.com/docs/guides/cli
2. Se connecter à votre projet : `supabase login`
3. Lier votre projet : `supabase link --project-ref your-project-ref`

### Déployer une fonction

```bash
# Déployer toutes les fonctions
supabase functions deploy
```

### Tester localement

```bash
# Démarrer l'environnement local
supabase start
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

