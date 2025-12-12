# Changelog

Tous les changements notables de ce projet seront documentés dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère à [Semantic Versioning](https://semver.org/lang/fr/).

## [1.1.1] - 2024-12-19

### 🐛 Corrigé
- Correction des dépendances manquantes dans les `useCallback` :
  - `createPedalEffect` dans `PedalLibraryModal.tsx` : ajout de `loadTone` dans les dépendances
  - `handleProfileSelect` dans `App.tsx` : ajout de `setSelectedAmplifier` et `setAmplifierParameters` dans les dépendances
- Élimination des stale closures potentielles
- Conformité aux règles ESLint pour les hooks React

## [1.1.0] - 2024-12-19

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

## [1.0.0] - 2024-XX-XX

### 🎉 Version initiale
- 100+ pédales d'effets
- Amplificateurs modélisés (Fender, Marshall, Mesa Boogie, etc.)
- Chaîne d'effets modulaire avec drag & drop
- Système de presets avec Supabase
- Upload d'IR personnalisées
- Monitoring temps réel (vu-mètres, latence, CPU)
- Design neumorphic moderne
- Backend Supabase (DB, auth, storage)

