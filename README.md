# 🎸 WebAmp

Application de simulation d'amplificateur guitare/basse avec interface web moderne et traitement audio natif pour latence < 10ms.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Probe311/WebAmp)

## 🏷️ Technologies

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC?logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?logo=vercel&logoColor=white)
![C++](https://img.shields.io/badge/C++-17-00599C?logo=c%2B%2B&logoColor=white)
![WebSocket](https://img.shields.io/badge/WebSocket-Real--time-010101?logo=socket.io&logoColor=white)

## ✨ Fonctionnalités

- 🎛️ **100+ pédales d'effets** : Distortion, overdrive, fuzz, chorus, delay, reverb, EQ, etc.
- 🔊 **Amplificateurs modélisés** : Fender, Marshall, Mesa Boogie, Orange, Vox, etc.
- 🔄 **Chaîne d'effets modulaire** : Drag & drop, réordonnable
- 🥁 **Machine à rythmes intégrée** : Boîte à rythmes complète avec interface compacte
- 💾 **Système de presets** : Sauvegarde et chargement avec Supabase
- 📤 **Upload d'IR** : Impulse responses personnalisées
- 📊 **Monitoring temps réel** : Vu-mètres, latence, CPU usage
- 🎨 **Design neumorphic** : Interface moderne et tactile avec layout Bento Grid
- ☁️ **Backend Supabase** : Base de données, authentification, storage
- ⚡ **Code optimisé** : Architecture modulaire avec fonctions utilitaires réutilisables

## Architecture

```
WebAmp/
├── native/           # Native Helper C++ (ASIO/WASAPI/CoreAudio)
│   ├── src/          # Code source C++
│   ├── include/      # Headers
│   └── CMakeLists.txt
├── frontend/         # Interface React/TypeScript
│   ├── src/
│   ├── public/
│   └── package.json
├── shared/           # Protocoles de communication
│   └── protocol/     # Messages WebSocket
└── docs/             # Documentation
```

## Démarrage rapide

### Pour les utilisateurs finaux

1. **Utiliser la webapp seule** : Accédez à l'application déployée sur Vercel
2. **Pour une latence optimale** : Installez le Native Helper depuis les paramètres de l'application

### Pour les développeurs

- Dépendances JS gérées uniquement dans `frontend/` :
  - `cd frontend && npm install`
  - `npm run dev` (Vite écoute sur `http://localhost:10000`)
- Build natif (Release) :
  - `cd native && mkdir -p build && cd build`
  - `cmake ..` puis `cmake --build . --config Release`
- WebSocket natif par défaut : `ws://localhost:8765`

### Packaging du Native Helper

Voir [native/README_PACKAGING.md](native/README_PACKAGING.md) pour les instructions de packaging.

## Fonctionnalités

- **Chaîne d'effets modulaire** : drag-drop, réordonnable
- **Amplis modélisés** : clean, crunch, high-gain
- **Pédales** : disto, drive, chorus, flanger, delay, reverb, EQ
- **IR Loader** : chargement d'impulse responses
- **Console + Master FX**
- **Système de presets**
- **Monitoring temps réel** : vu-mètres, latence, CPU

## 🚀 Déploiement

### Frontend (Vercel)

Le frontend est déployé automatiquement sur Vercel à chaque push sur `main`.

**Configuration requise :**
- Variables d'environnement Vercel :
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
  - `VITE_WEBSOCKET_URL` (pour dev local)
- Variables optionnelles (selon les fonctionnalités activées) :
  - `VITE_GEMINI_API_KEY`
  - `VITE_PEXELS_API_KEY`
  - `VITE_PIXABAY_API_KEY`
  - `VITE_FREESOUND_CLIENT_ID`
  - `VITE_FREESOUND_CLIENT_SECRET`

Pour la liste complète et les rappels “build-time”, voir `docs/VERCEL_ENV_VARS.md`.

Voir [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) pour le guide de déploiement.

### Base de données (Supabase)

- PostgreSQL avec Row Level Security (RLS)
- Authentification utilisateur
- Storage pour les Impulse Responses
- API REST automatique

Voir [supabase/README.md](supabase/README.md) pour la configuration.

#### Secrets Supabase (Edge Function `contact-support`)

Le endpoint `supabase/functions/contact-support` utilise des secrets côté Supabase, notamment :
- `RESEND_API_KEY`
- `CONTACT_EMAIL`
- `RESEND_FROM_EMAIL` (optionnel, fallback à `noreply@webamp.app`)

## 🔌 Communication

- **Frontend** : `http://localhost:10000` (dev) ou déployé sur Vercel
- **WebSocket natif** : `ws://localhost:8765` (local uniquement)
- **Protocole** : JSON (voir `shared/protocol/`)
- **Supabase** : API REST + Realtime

## Latence cible

- Total : < 5-10 ms
- Audio callback : < 2-3 ms
- Communication : < 1-2 ms
- Rendu UI : < 1 ms

## 📚 Documentation

Voir [docs/README.md](docs/README.md) pour la documentation complète.

### Guides principaux

- **[Démarrage rapide](docs/GETTING_STARTED.md)** - Installation et premier lancement
- **[Architecture](docs/ARCHITECTURE.md)** - Vue d'ensemble technique
- **[Déploiement](docs/DEPLOYMENT.md)** - Guide de déploiement
- **[Design System](docs/DESIGN_SYSTEM.md)** - Conventions UI neumorphic
- **[API WebSocket](docs/API.md)** - Protocole de communication

### Références

- **[Pédales](docs/REFERENCE_PEDALES.md)** - Liste complète des pédales
- **[Amplificateurs](docs/REFERENCE_AMPLIS.md)** - Liste complète des amplis
- **[Composants](docs/COMPONENTS.md)** - Documentation des composants React

## 🛠️ Technologies

- **Frontend** : React 18, TypeScript, Vite, Tailwind CSS
- **Backend** : C++ (Native Helper), WebSocket
- **Base de données** : Supabase (PostgreSQL)
- **Déploiement** : Vercel (Frontend), Supabase Cloud (DB)
- **Audio** : WASAPI (Windows), ASIO, CoreAudio (macOS), PipeWire (Linux)

