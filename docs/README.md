# Documentation WebAmp

Bienvenue dans la documentation complète de WebAmp, une application de simulation d'amplificateur guitare/basse avec interface web moderne et traitement audio natif pour une latence < 10ms.

## 📚 Navigation

### 🚀 Démarrage rapide
- **[Guide de démarrage](GETTING_STARTED.md)** - Installation, build et premier lancement
- **[Architecture](ARCHITECTURE.md)** - Vue d'ensemble de l'architecture technique
- **[Design System](DESIGN_SYSTEM.md)** - Guide du design system neumorphic

### Développement
- **[Composants](COMPONENTS.md)** - Documentation des composants React
- **[API WebSocket](API.md)** - Protocole de communication front/back
- **[Optimisations](OPTIMIZATION.md)** - Guide des optimisations du code
- **[Déploiement](DEPLOYMENT.md)** - Guide de déploiement et options d'hébergement
- **[Variables d’env Vercel](VERCEL_ENV_VARS.md)** - Liste et règles (pas de secrets en clair)
- **[Sécurité RLS](RLS_SECURITY_GUIDE.md)** - Politiques Supabase
- **[SECURITY.md](../SECURITY.md)** - Secrets, signalement, admin UUID
- **[Protection GitHub `main`](GITHUB_BRANCH_PROTECTION.md)** - Branch protection, labels, homepage
- **[Smoke CTA → Auth](SMOKE_CTA_AUTH.md)** - Tunnel LP « Ouvrir webamp » → login app

### 📖 Référence
- **[Pédales](REFERENCE_PEDALES.md)** - Liste complète des pédales disponibles
- **[Amplificateurs](REFERENCE_AMPLIS.md)** - Liste complète des amplificateurs disponibles
- **[Cours](REFERENCE_COURS.md)** - Référentiel complet des cours

### 🔧 Administration
- **[Administration des Cours](ADMIN_COURS.md)** - Gestion des cours et packs DLC

### 🗺️ Roadmap
- **[Roadmap](ROADMAP.md)** - Prochaines étapes et fonctionnalités prévues

---

## 🎯 Vue d'ensemble

WebAmp est une application hybride composée de :

1. **Native Helper (C++)** : Traitement audio temps réel avec latence minimale
2. **Frontend Web (React/TypeScript)** : Interface utilisateur moderne avec design neumorphic
3. **Communication WebSocket** : Liaison bidirectionnelle entre frontend et backend

### Fonctionnalités principales

- ✅ **Chaîne d'effets modulaire** : Drag & drop, réordonnable
- ✅ **100+ pédales d'effets** : Distortion, overdrive, fuzz, chorus, delay, reverb, EQ, etc.
- ✅ **Amplificateurs modélisés** : Fender, Marshall, Mesa Boogie, Orange, Vox, etc.
- ✅ **IR Loader** : Chargement d'impulse responses personnalisées (Supabase Storage)
- ✅ **Système de presets** : Sauvegarde et chargement avec Supabase
- ✅ **Authentification** : Connexion/inscription avec Supabase Auth
- ✅ **Partage de presets** : Presets publics/privés avec favoris
- ✅ **Monitoring temps réel** : Vu-mètres, latence, CPU usage
- ✅ **Design neumorphic** : Interface moderne et tactile
- ✅ **Déploiement Vercel** : Frontend déployé automatiquement

---

## 🏗️ Structure du projet

```
WebAmp/
├── native/              # Native Helper C++ (traitement audio)
│   ├── src/            # Code source C++
│   ├── include/        # Headers
│   └── CMakeLists.txt
├── frontend/           # Interface React/TypeScript
│   ├── src/
│   │   ├── components/ # Composants React
│   │   ├── services/   # Services (WebSocket, etc.)
│   │   ├── data/       # Données (pédales, amplis)
│   │   └── styles/     # Styles CSS
│   └── package.json
├── supabase/           # Migrations, Edge Functions, seeds
└── docs/               # Documentation
```

---

## 🚀 Démarrage rapide

### Prérequis

- **Node.js 18+** et npm
- **CMake 3.20+**
- **Visual Studio 2019+** (Windows) ou **Xcode** (macOS) ou **GCC/Clang** (Linux)

### Installation

```bash
# 1. Cloner le repository
git clone https://github.com/Probe311/WebAmp.git
cd WebAmp

# 2. Installer les dépendances frontend + env local
cd frontend
npm install
cp .env.example .env.local
# Éditer .env.local (placeholders → vos clés ; ne jamais committer)

# 3. Build le native helper
cd ../native
mkdir build && cd build
cmake .. -G "Visual Studio 17 2022" -A x64  # Windows
# ou
cmake .. -DCMAKE_BUILD_TYPE=Release          # macOS/Linux
cmake --build . --config Release
```

### Lancement

```bash
# Terminal 1: Native Helper
.\native\build\Release\webamp_native.exe

# Terminal 2: Frontend
cd frontend
npm run dev
```

**Accès** :
- Frontend : http://localhost:10000
- WebSocket : ws://localhost:8765

---

## Contribution

1. [CONTRIBUTING.md](../CONTRIBUTING.md) — workflow PR et standards
2. [SECURITY.md](../SECURITY.md) — secrets et signalement
3. [Architecture](ARCHITECTURE.md) · [Design System](DESIGN_SYSTEM.md) · [Roadmap](ROADMAP.md)

---

## Licence

[MIT](../LICENSE)

---

**Dernière mise à jour** : 2026

