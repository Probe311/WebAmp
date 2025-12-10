# Guide de Contribution - WebAmp

Merci de votre intérêt pour contribuer à WebAmp ! 🎸

## 🚀 Démarrage rapide

1. Fork le repository
2. Cloner votre fork : `git clone https://github.com/VOTRE_USERNAME/WebAmp.git`
3. Créer une branche : `git checkout -b feature/ma-fonctionnalite`
4. Installer les dépendances : `cd frontend && npm install`
5. Faire vos modifications
6. Tester : `npm run build && npm test`
7. Commiter : `git commit -m "Ajout de ma fonctionnalité"`
8. Pousser : `git push origin feature/ma-fonctionnalite`
9. Créer une Pull Request

## 📋 Standards de code

### Frontend (React/TypeScript)

- **TypeScript strict** : Tous les fichiers doivent être typés
- **ESLint** : Respecter les règles ESLint (`npm run lint`)
- **Composants** : Utiliser des composants fonctionnels avec hooks
- **Design System** : Respecter le design neumorphic (voir `docs/DESIGN_SYSTEM.md`)
- **Nommage** : PascalCase pour les composants, camelCase pour les fonctions

### Backend (C++)

- **Style** : Suivre les conventions C++ modernes (C++17+)
- **Commentaires** : Documenter les fonctions publiques
- **CMake** : Utiliser CMake pour le build
- **Tests** : Ajouter des tests pour les nouvelles fonctionnalités

## 🧪 Tests

```bash
# Frontend
cd frontend
npm test

# Avec coverage
npm run test:coverage
```

## 📝 Commits

Utiliser des messages de commit clairs :

```
feat: Ajout d'une nouvelle pédale
fix: Correction du bug de latence
docs: Mise à jour de la documentation
refactor: Refactorisation du composant Pedalboard
test: Ajout de tests pour les presets
```

## 🔍 Pull Requests

- **Titre clair** : Décrire brièvement la modification
- **Description** : Expliquer le problème résolu et la solution
- **Tests** : Vérifier que tous les tests passent
- **Documentation** : Mettre à jour la doc si nécessaire

## 📚 Documentation

- Mettre à jour `docs/` si vous ajoutez/modifiez des fonctionnalités
- Ajouter des commentaires JSDoc pour les fonctions complexes
- Mettre à jour `README.md` si nécessaire

## 🐛 Signaler un bug

1. Vérifier que le bug n'a pas déjà été signalé
2. Créer une issue avec :
   - Description du bug
   - Steps to reproduce
   - Comportement attendu vs actuel
   - Environnement (OS, navigateur, version)

## 💡 Proposer une fonctionnalité

1. Créer une issue avec le label "enhancement"
2. Décrire la fonctionnalité et son utilité
3. Discuter avec les mainteneurs avant de coder

## 📄 Licence

En contribuant, vous acceptez que vos contributions soient sous licence MIT.

Merci ! 🎉

