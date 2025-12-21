# Documentation WebAmp

Bienvenue dans la documentation complète de WebAmp, une application de simulation d'amplificateur guitare/basse avec interface web moderne et traitement audio natif pour une latence < 10ms.

## 📚 Navigation

### 🚀 Démarrage rapide
- **[Guide de démarrage](GETTING_STARTED.md)** - Installation, build et premier lancement
- **[Architecture](ARCHITECTURE.md)** - Vue d'ensemble de l'architecture technique
- **[Design System](DESIGN_SYSTEM.md)** - Guide du design system neumorphic

### 🛠️ Développement
- **[Composants](COMPONENTS.md)** - Documentation des composants React
- **[API WebSocket](API.md)** - Protocole de communication front/back
- **[Optimisations](OPTIMIZATION.md)** - Guide des optimisations du code
- **[Déploiement](DEPLOYMENT.md)** - Guide de déploiement et options d'hébergement
- **[Sécurité RLS](RLS_SECURITY_GUIDE.md)** - Guide des politiques de sécurité Supabase

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
├── shared/             # Code partagé
│   └── protocol/       # Protocole WebSocket
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
git clone <repository-url>
cd WebAmp

# 2. Installer les dépendances frontend
cd frontend
npm install

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

## 📝 Contribution

Pour contribuer au projet, consultez :
1. [Architecture](ARCHITECTURE.md) pour comprendre la structure
2. [Design System](DESIGN_SYSTEM.md) pour les conventions UI
3. [Roadmap](ROADMAP.md) pour voir les fonctionnalités prévues

---

## 📄 Licence

[À définir]

---

**Dernière mise à jour** : 2024

