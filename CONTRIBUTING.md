# Contribuer à WebAmp

Merci de votre intérêt. Ce guide vise un flux simple pour un dépôt opensource participatif.

## Avant de coder

1. Cherchez une issue existante ou ouvrez-en une pour discuter (surtout pour les grosses features).
2. Les labels `good first issue` et `help wanted` sont de bons points d’entrée.
3. Lisez [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) et [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md) si vous touchez à l’UI.
4. Respectez le [Code of Conduct](CODE_OF_CONDUCT.md).

## Setup local

```bash
git clone https://github.com/VOTRE_USERNAME/WebAmp.git
cd WebAmp
cd frontend
npm install
cp .env.example .env.local
```

Renseignez `.env.local` avec **vos** clés (jamais celles d’un autre environnement). Détails : [SECURITY.md](SECURITY.md), [frontend/.env.example](frontend/.env.example).

```bash
npm run dev          # http://localhost:10000
npm run lint
npm test
npm run build
```

Helper natif (optionnel) : [docs/GETTING_STARTED.md](docs/GETTING_STARTED.md).

## Workflow Git

1. Fork du dépôt
2. Branche depuis `main` : `feature/description-courte` ou `fix/description-courte`
3. Commits atomiques, messages clairs (Conventional Commits encouragés) :

```
feat: ajouter la pédale X
fix: corriger la reconnexion WebSocket
docs: clarifier le setup env
refactor: extraire le service presets
test: couvrir PedalboardEngine
```

4. Push sur votre fork
5. Pull Request vers `main` du dépôt upstream

## Standards

### Frontend (React / TypeScript)

- TypeScript strict, pas de `any` nouveau sans justification
- Composants fonctionnels + hooks
- Respect du design neumorphic (`docs/DESIGN_SYSTEM.md`)
- PascalCase composants, camelCase fonctions
- `npm run lint` au vert avant la PR

### Native (C++)

- C++17+, CMake
- Documenter les APIs publiques
- Ajouter un test / check minimal si vous changez la logique audio ou le protocole

### Documentation

- Mettre à jour `docs/` si le comportement change
- Pas de secrets, UUID personnels, ni clés dans les exemples — placeholders uniquement (`YOUR_PROJECT`, `<anon>`, etc.)

## Pull Requests

- Titre clair + description (problème → solution → comment tester)
- Captures / GIFs pour les changements UI
- Une PR = un sujet (évitez les fourre-tout)
- Indiquer les breaking changes et les nouvelles variables d’env

## Bugs

Ouvrir une issue avec : description, steps to reproduce, attendu vs actuel, OS / navigateur / version.

## Features

Issue avec label `enhancement`, motivation, et périmètre. Attendez un retour avant un gros chantier.

## Licence

En contribuant, vous acceptez que vos contributions soient sous [licence MIT](LICENSE).
