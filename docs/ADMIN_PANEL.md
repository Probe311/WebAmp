# 🛡️ Panneau d'Administration - Documentation

## Vue d'ensemble

Le panneau d'administration permet de gérer l'ensemble du contenu de WebAmp depuis l'interface frontend. L'accès est réservé à l'utilisateur dont l'UUID Auth correspond à `VITE_ADMIN_UUID` (défini par environnement, jamais hardcodé dans le dépôt).

## Accès

1. Définir `VITE_ADMIN_UUID` dans `frontend/.env.local` (dev) ou Vercel (prod) — voir [`.env.example`](../frontend/.env.example)
2. **Bouton Admin** : visible uniquement si `auth.uid` = `ADMIN_UUID` (`frontend/src/config/constants.ts`)
3. **Redirection** : tentative non autorisée → home + message d'erreur
4. Renforcer côté Supabase avec RLS (`is_admin()` / rôles) — le check UI seul ne suffit pas

## Sections d'administration

### 1. Marques (`brands`)
- **CRUD complet** : Créer, lire, modifier, supprimer
- **Service** : `adminService.getBrands()`, `createBrand()`, `updateBrand()`, `deleteBrand()`
- **Table** : `public.brands`

### 2. Amplis (`amplifiers`)
- **CRUD complet** : Créer, lire, modifier, supprimer
- **Gestion des paramètres** : `updateAmplifierParameters()`
- **Service** : `adminService.getAmplifiers()`, `createAmplifier()`, `updateAmplifier()`, `deleteAmplifier()`
- **Table** : `public.amplifiers` + `public.amplifier_parameters`

### 3. Pédales (`pedals`)
- **CRUD complet** : Créer, lire, modifier, supprimer
- **Gestion des paramètres** : `updatePedalParameters()`
- **Service** : `adminService.getPedals()`, `createPedal()`, `updatePedal()`, `deletePedal()`
- **Table** : `public.pedals` + `public.pedal_parameters`

### 4. Configurations (`presets`)
- **CRUD complet** : Créer, lire, modifier, supprimer
- **Service** : `adminService.getPresets()`, `createPreset()`, `updatePreset()`, `deletePreset()`
- **Table** : `public.presets`

### 5. Cours (`courses`)
- **CRUD complet** : Créer, lire, modifier, supprimer
- **Service** : `adminService.getCourses()`, `createCourse()`, `updateCourse()`, `deleteCourse()`
- **Table** : `public.courses`

### 6. Leçons (`lessons`)
- **CRUD complet** : Créer, lire, modifier, supprimer
- **Filtrage par cours** : `getLessons(courseId?)`
- **Service** : `adminService.getLessons()`, `createLesson()`, `updateLesson()`, `deleteLesson()`
- **Table** : `public.lessons`

### 7. Packs (`dlc_packs`)
- **CRUD complet** : Créer, lire, modifier, supprimer
- **Service** : `adminService.getDLCPacks()`, `createDLCPack()`, `updateDLCPack()`, `deleteDLCPack()`
- **Table** : `public.dlc_packs`

### 8. Fonctionnalités (`feature_flags`)
- **CRUD complet** : Créer, lire, modifier, supprimer
- **Toggle en temps réel** : Activation/désactivation directe depuis l'interface
- **Service** : `adminService.getFeatureFlags()`, `createFeatureFlag()`, `updateFeatureFlag()`, `deleteFeatureFlag()`
- **Table** : `public.feature_flags`

## Feature Flags

### Utilisation dans l'application

Les feature flags peuvent être utilisés de deux manières :

#### 1. Hook React (recommandé)
```typescript
import { useFeatureFlags } from '../hooks/useFeatureFlags'

function MyComponent() {
  const { isEnabled, loading } = useFeatureFlags()
  
  if (loading) return <div>Chargement...</div>
  
  if (!isEnabled('ai_tone_assistant')) {
    return <div>Fonctionnalité désactivée</div>
  }
  
  return <AIToneAssistant />
}
```

#### 2. Utilitaire synchrone (avec cache)
```typescript
import { isFeatureEnabledSync } from '../utils/featureFlags'

function MyComponent() {
  const showFeature = isFeatureEnabledSync('ai_tone_assistant', true)
  
  return showFeature ? <AIToneAssistant /> : null
}
```

### Feature Flags par défaut

Les feature flags suivants sont créés automatiquement lors de la migration :

- `ai_tone_assistant` : Assistant IA de Tones
- `ai_beat_architect` : Architecte de Rythmes IA
- `gallery_marketplace` : Marketplace de Presets
- `dlc_packs` : Packs DLC
- `advanced_effects` : Effets Avancés
- `nam_support` : Support NAM

## Installation

### 1. Créer les tables

Exécuter la migration SQL dans Supabase :

```sql
-- Voir : supabase/migrations/001_admin_tables.sql
```

Ou via le SQL Editor de Supabase :
1. Ouvrir `supabase/migrations/001_admin_tables.sql`
2. Copier le contenu
3. Coller dans le SQL Editor
4. Exécuter

### 2. Vérifier l'accès admin

L'UUID admin vient de l'environnement :
```typescript
// frontend/src/config/constants.ts
export const ADMIN_UUID = (import.meta.env.VITE_ADMIN_UUID || '').trim()
```

Sans `VITE_ADMIN_UUID`, aucun utilisateur n'a l'UI admin.

## Structure des fichiers

```
frontend/src/
├── pages/
│   └── AdminPage.tsx          # Page principale d'administration
├── services/
│   └── admin.ts               # Service CRUD pour toutes les entités
├── hooks/
│   └── useFeatureFlags.ts    # Hook React pour les feature flags
└── utils/
    └── featureFlags.ts        # Utilitaire synchrone pour les feature flags

supabase/migrations/
└── 001_admin_tables.sql       # Migration SQL pour les tables admin
```

## Fonctionnalités implémentées

### ✅ Complètement fonctionnel
- ✅ Affichage de toutes les entités
- ✅ Suppression avec confirmation
- ✅ Toggle des feature flags en temps réel
- ✅ Compteurs d'éléments par section
- ✅ Gestion d'erreurs avec toasts
- ✅ États de chargement
- ✅ Messages d'état vide

### 🚧 À implémenter
- ⏳ Formulaires de création
- ⏳ Formulaires d'édition
- ⏳ Validation des données
- ⏳ Upload d'images (logos, thumbnails)
- ⏳ Éditeur de paramètres pour amplis/pédales

## Sécurité

### RLS (Row Level Security)

Appliquer [supabase/migrations/20260320_admin_rls.sql](../supabase/migrations/20260320_admin_rls.sql) :

- **Lecture** : contenu publié / public selon table
- **Écriture catalogue** : `is_admin()` uniquement (`user_roles`)
- **UI** : `VITE_ADMIN_UUID` — complémentaire, insuffisant seul

Voir [RLS_SECURITY_GUIDE.md](RLS_SECURITY_GUIDE.md) et [SECURITY.md](../SECURITY.md).

```sql
INSERT INTO public.user_roles (user_id, role)
VALUES ('YOUR_AUTH_UUID', 'admin')
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
```

## Utilisation des Feature Flags

### Exemple : Masquer une fonctionnalité

```typescript
import { useFeatureFlags } from '../hooks/useFeatureFlags'

function GalleryPage() {
  const { isEnabled } = useFeatureFlags()
  
  // Masquer la marketplace si désactivée
  if (!isEnabled('gallery_marketplace')) {
    return <div>Marketplace temporairement indisponible</div>
  }
  
  return <Marketplace />
}
```

### Exemple : Activer/désactiver un composant

```typescript
import { isFeatureEnabledSync } from '../utils/featureFlags'

function WebAmpPage() {
  const showAIAssistant = isFeatureEnabledSync('ai_tone_assistant', true)
  
  return (
    <div>
      <Pedalboard />
      {showAIAssistant && <AIToneAssistantButton />}
    </div>
  )
}
```

## Dépannage

### Les tables n'existent pas
- Exécuter la migration `001_admin_tables.sql`
- Vérifier dans Supabase que les tables sont créées

### Erreur "permission denied"
- Vérifier les politiques RLS dans Supabase
- Vérifier que l'utilisateur est bien l'admin (UUID)

### Les feature flags ne se mettent pas à jour
- Vérifier que les subscriptions Supabase fonctionnent
- Vérifier la connexion WebSocket
- Forcer le refresh : `refreshFeatureFlags()`

### Le bouton Admin n'apparaît pas
- Vérifier que `VITE_ADMIN_UUID` est défini et égal à l’UUID Auth de l’utilisateur
- Vérifier que l'utilisateur est bien connecté
- Après changement d’env Vercel : redeploy (build time)

## Prochaines étapes

1. **Formulaires de création/édition** : Implémenter les modales avec validation
2. **Upload de fichiers** : Gérer les logos, images, thumbnails
3. **Éditeur de paramètres** : Interface pour gérer les paramètres d'amplis/pédales
4. **Historique** : Logs des modifications admin
5. **Permissions** : Système de rôles plus avancé

