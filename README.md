# WebAmp

Simulation d’ampli guitare/basse : frontend React + helper audio natif (latence cible sous 10 ms).

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Probe311/WebAmp)

**App :** [app.webamp.studio](https://app.webamp.studio) · **Contribuer :** [CONTRIBUTING.md](CONTRIBUTING.md) · **Sécurité :** [SECURITY.md](SECURITY.md) · **Code de conduite :** [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)

## Stack

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC?logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?logo=vercel&logoColor=white)
![C++](https://img.shields.io/badge/C++-17-00599C?logo=c%2B%2B&logoColor=white)

## Fonctionnalités

- 100+ pédales d’effets, amplis modélisés, chaîne drag & drop
- Machine à rythmes, presets Supabase, upload d’IR
- Monitoring temps réel, design neumorphic
- Helper C++ optionnel (WASAPI / ASIO / CoreAudio / PipeWire)

## Architecture

```
WebAmp/
├── native/      # Helper C++ (ASIO/WASAPI/CoreAudio)
├── frontend/    # React / TypeScript / Vite
├── supabase/    # Migrations, Edge Functions
└── docs/        # Documentation
```

## Démarrage rapide

### Utilisateurs

1. Ouvrir [app.webamp.studio](https://app.webamp.studio)
2. Pour la latence minimale : installer le Native Helper depuis les réglages

### Développeurs

```bash
git clone https://github.com/Probe311/WebAmp.git
cd WebAmp/frontend
npm install
cp .env.example .env.local   # placeholders → vos clés
npm run dev                  # http://localhost:10000
```

Build natif (optionnel) : voir [docs/GETTING_STARTED.md](docs/GETTING_STARTED.md) et [native/README_PACKAGING.md](native/README_PACKAGING.md).  
WebSocket local par défaut : `ws://localhost:8765`.

Issues labellisées `good first issue` / `help wanted` : bons points d’entrée.

## Sécurité

Voir [SECURITY.md](SECURITY.md). Modèle d’env : [frontend/.env.example](frontend/.env.example).  
Toute variable `VITE_*` est dans le bundle navigateur — **jamais** de secrets serveur (`service_role`, Gemini, Resend, OAuth client secret).

Si fuite dans l’historique : [scripts/PURGE_GIT_SECRETS.md](scripts/PURGE_GIT_SECRETS.md) + rotation dashboard obligatoire.

## Déploiement

Frontend : Vercel (push sur `main`). Variables obligatoires :

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Optionnelles (client / publiques uniquement) : `VITE_WEBSOCKET_URL`, `VITE_ADMIN_UUID`, `VITE_PEXELS_API_KEY`, `VITE_PIXABAY_API_KEY`, `VITE_FREESOUND_API_KEY`, `VITE_FREESOUND_CLIENT_ID`.

Secrets Edge (dashboard Supabase, pas `VITE_*`) : `GEMINI_API_KEY`, `RESEND_API_KEY`, `CONTACT_EMAIL`, `RESEND_FROM_EMAIL`, `CORS_ALLOWED_ORIGINS`, `FREESOUND_CLIENT_SECRET`.

Détails : [docs/VERCEL_ENV_VARS.md](docs/VERCEL_ENV_VARS.md), [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md), [supabase/README.md](supabase/README.md).

## Documentation

- [docs/README.md](docs/README.md) — index
- [GETTING_STARTED](docs/GETTING_STARTED.md) · [ARCHITECTURE](docs/ARCHITECTURE.md) · [DESIGN_SYSTEM](docs/DESIGN_SYSTEM.md)
- [API WebSocket](docs/API.md) · [REFERENCE_PEDALES](docs/REFERENCE_PEDALES.md) · [REFERENCE_AMPLIS](docs/REFERENCE_AMPLIS.md)

## Licence

[MIT](LICENSE) — en contribuant, vous acceptez que vos contributions soient sous cette licence.
