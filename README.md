# WebAmp - Amplificateur Guitare/Basse Web + Native

Application de simulation d'amplificateur guitare/basse avec interface web moderne et traitement audio natif pour latence < 10ms.

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

- Dépendances JS gérées uniquement dans `frontend/` :
  - `cd frontend && npm install`
  - `npm run dev` (Vite écoute sur `http://localhost:10000`)
- Build natif (Release) :
  - `cd native && mkdir -p build && cd build`
  - `cmake ..` puis `cmake --build . --config Release`
- WebSocket natif par défaut : `ws://localhost:8765`
- Scripts Windows pratiques : `scripts/start-all.ps1`, `start-native.ps1`, `start-frontend.ps1`

## Fonctionnalités

- **Chaîne d'effets modulaire** : drag-drop, réordonnable
- **Amplis modélisés** : clean, crunch, high-gain
- **Pédales** : disto, drive, chorus, flanger, delay, reverb, EQ
- **IR Loader** : chargement d'impulse responses
- **Console + Master FX**
- **Système de presets**
- **Monitoring temps réel** : vu-mètres, latence, CPU

## Communication

- Frontend : `http://localhost:10000`
- WebSocket natif : `ws://localhost:8765` (ou TLS `wss://...` si configuré)
- Protocole : JSON (voir `shared/protocol/`)

## Latence cible

- Total : < 5-10 ms
- Audio callback : < 2-3 ms
- Communication : < 1-2 ms
- Rendu UI : < 1 ms

## Documentation utile

- `docs/GETTING_STARTED.md` : installation détaillée par OS
- `docs/ARCHITECTURE.md` : vue d'ensemble technique
- `docs/DESIGN_SYSTEM.md` : conventions UI
- `docs/COMPONENTS.md` : inventaire des composants
- `docs/REFERENCE_PEDALES.md` : référence des pédales générées

