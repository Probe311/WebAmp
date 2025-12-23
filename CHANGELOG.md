# Changelog

Tous les changements notables de ce projet seront documentés dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère à [Semantic Versioning](https://semver.org/lang/fr/).

## [1.2.0] - 2025-01-XX

### 🎉 Ajouté
- **DAW (Digital Audio Workstation) intégré** : Nouvelle page DAW complète
  - Arrangement avec pistes multiples
  - Piano Roll pour l'édition MIDI
  - Mixer avec contrôles de volume et effets par piste
  - Transport avec contrôle de lecture/arrêt
  - Bibliothèque d'instruments et d'effets
  - Outils d'édition (pointeur, crayon, gomme, zoom)
  - Personnalisation des pistes (nom, couleur, icône)
  - Support du snap grid et du zoom
  - Panneau inférieur avec onglets (Mixer, Piano Roll, Device Chain)

- **Nouveaux composants Home** :
  - `PedalOfTheDay` : Mise en avant d'une pédale du jour
  - `MusicianSpotlight` : Spotlight sur des musiciens
  - `EffectSpotlight` : Mise en avant d'effets
  - `CreationInspiration` : Inspiration pour la création

- **Système de contact et support** :
  - Nouveau composant `ContactSupportModal` pour contacter le support
  - Nouvelle fonction Supabase Edge `contact-support` pour l'envoi d'emails
  - Service `contact.ts` pour gérer les demandes de contact
  - Intégration dans la HomePage avec bouton flottant

- **Nouveaux composants UI** :
  - `Checkbox` : Composant checkbox réutilisable
  - `MainBlock` : Bloc principal avec style neumorphic
  - `SearchBar` : Barre de recherche réutilisable

- **Nouvelles données** :
  - `effectsInfo.ts` : Informations sur les effets
  - `musicians.ts` : Données sur les musiciens
  - `trackIcons.tsx` : Icônes pour les pistes DAW

### 🔧 Amélioré
- **HomePage** : Interface améliorée avec grille Bento et nouveaux composants
- **Navigation** : Ajout de la page DAW dans la navigation
- **Design System** : Améliorations du design system avec nouveaux composants

### 📚 Documentation
- Mise à jour de `DESIGN_SYSTEM.md`
- Mise à jour de `ROADMAP.md`

### ✅ Vérifications
- Aucune erreur TypeScript
- Build de production réussi (9.66s)
- Code prêt pour le déploiement

### 📝 Notes
- **Déploiement des fonctions Supabase** : La fonction `contact-support` doit être déployée manuellement avec Supabase CLI :
  ```bash
  supabase functions deploy contact-support
  ```

## [1.1.6] - 2025-01-XX

### ✅ Maintenance
- Build de production réussi (11.35s)
- Aucune erreur TypeScript
- Code prêt pour le déploiement

## [1.1.5] - 2025-01-XX

### 🐛 Corrigé
- **Variables d'environnement Vercel** : Amélioration de la gestion des variables d'environnement
  - Messages d'erreur améliorés indiquant qu'un redéploiement est nécessaire
  - Ajout de logs de debug en développement
  - Création d'un guide complet pour la configuration des variables Vercel (`docs/VERCEL_ENV_VARS.md`)
  - Mise à jour de la documentation de déploiement

### 📚 Documentation
- Nouveau guide : `docs/VERCEL_ENV_VARS.md` - Guide complet pour configurer les variables d'environnement dans Vercel
- Mise à jour de `docs/DEPLOYMENT.md` avec les instructions détaillées pour les variables d'environnement

### ✅ Vérifications
- Aucune erreur TypeScript
- Build de production réussi (9.32s)
- Code prêt pour le déploiement

## [1.1.4] - 2025-01-XX

### 🔧 Amélioré
- **Service d'images** : Simplification du service d'images
  - Suppression du support Unsplash
  - Focus sur Pexels et Pixabay uniquement
  - Code plus simple et maintenable

### ✅ Vérifications
- Aucune erreur TypeScript
- Build de production réussi (10.08s)
- Code prêt pour le déploiement

## [1.1.3] - 2025-01-XX

### 🐛 Corrigé
- **Correction de toutes les erreurs TypeScript** :
  - Correction des erreurs dans DrumMachineContext.tsx
  - Correction des erreurs supabase possibly null dans useLMS.ts
  - Correction des erreurs dans AdminPage.tsx, GalleryPage.tsx, LearnPage.tsx
  - Correction des erreurs dans les services (dlcPackGenerator, gallery, gemini, imageService)
  - Correction des erreurs dans les utils (abcConverter, tonePackLoader)
  - Exclusion des fichiers utilitaires Node.js du build (migrationHelper, saveBrandLogos)

### 🧹 Nettoyage
- Nettoyage du code et build de production
- Suppression des fichiers temporaires

## [1.1.2] - 2025-12-13

### 🎨 Amélioré
- **Système de couleurs unifié** : 
  - Ajout de `accentColor` dans `PedalComponentProps` pour cohérence
  - Support de `accentColor` dans tous les composants de pédales
  - Utilisation cohérente des couleurs dans toute l'interface
- **Composant Loader** : Nouveau composant de chargement avec animation
- **Préférences utilisateur** : Système de préférences pour contrôler l'affichage des modales

### 🧹 Nettoyage
- Suppression de tous les scripts de migration temporaires (`fix*.js`)
- Code plus propre et maintenable

### 📚 Documentation
- Mise à jour des dates dans le CHANGELOG
- Documentation du système de couleurs unifié

## [1.1.1] - 2025-12-12

### 🐛 Corrigé
- Correction des dépendances manquantes dans les `useCallback` :
  - `createPedalEffect` dans `PedalLibraryModal.tsx` : ajout de `loadTone` dans les dépendances
  - `handleProfileSelect` dans `App.tsx` : ajout de `setSelectedAmplifier` et `setAmplifierParameters` dans les dépendances
- Élimination des stale closures potentielles
- Conformité aux règles ESLint pour les hooks React

## [1.1.0] - 2025-12-09

### 🎉 Ajouté
- **Boîte à rythmes intégrée** : Machine à rythmes complète avec interface compacte et modal plein écran
- **Layout Bento Grid** : Nouveau layout responsive avec grille adaptative pour la boîte à rythmes
- **Fonctions utilitaires optimisées** : 
  - `pedalControlHelpers.ts` : Analyse des types de contrôles de pédales
  - `pedalboardSync.ts` : Synchronisation unifiée WebSocket/Audio
  - `profileLoader.ts` : Chargement séquentiel de profils/presets

### ✨ Amélioré
- **Optimisation du code** : 
  - Suppression des doublons de code (~200 lignes)
  - Consolidation de la logique de chargement de presets/profils
  - Extraction de la logique répétitive dans des fonctions utilitaires
  - Optimisation des `useMemo` répétitifs
- **Architecture** :
  - Meilleure séparation des responsabilités
  - Code plus maintenable et réutilisable
  - Réduction de la complexité cyclomatique

### 🐛 Corrigé
- Correction de l'interface `SortableEffectProps` dupliquée dans `Pedalboard.tsx`
- Correction de la logique de synchronisation WebSocket/Audio
- Amélioration de la gestion des erreurs dans le chargement de profils

### 📚 Documentation
- Mise à jour de l'architecture avec les nouvelles fonctionnalités
- Documentation des nouvelles fonctions utilitaires
- Guide d'optimisation du code

## [1.0.0] - 2025-12-01

### 🎉 Version initiale
- 80+ pédales d'effets
- Amplificateurs modélisés (Fender, Marshall, Mesa Boogie, etc.)
- Chaîne d'effets modulaire avec drag & drop
- Système de presets avec Supabase
- Upload d'IR personnalisées
- Monitoring temps réel (vu-mètres, latence, CPU)
- Design neumorphic moderne
- Backend Supabase (DB, auth, storage)

