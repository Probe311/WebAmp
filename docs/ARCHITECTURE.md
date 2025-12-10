# Architecture WebAmp

## Vue d'ensemble

WebAmp est une application hybride composée de :

1. **Native Helper (C++)** : Traitement audio temps réel
2. **Frontend Web (React/TypeScript)** : Interface utilisateur
3. **Communication WebSocket** : Liaison entre les deux

```
┌─────────────────┐
│   Frontend Web  │
│  (React/TS)     │
│  Port 10000     │
└────────┬────────┘
         │ WebSocket
         │ (Port 8765)
         ▼
┌─────────────────┐
│  Native Helper  │
│     (C++)       │
│                 │
│  ┌───────────┐  │
│  │Audio Driver│  │
│  │WASAPI/ASIO │  │
│  └─────┬─────┘  │
│        │        │
│  ┌─────▼─────┐  │
│  │DSP Pipeline│ │
│  │            │  │
│  │Effect Chain│ │
│  └────────────┘ │
└─────────────────┘
```

## Native Helper

### Structure

```
native/
├── include/          # Headers
│   ├── audio_engine.h
│   ├── audio_driver.h
│   ├── dsp_pipeline.h
│   ├── effect_chain.h
│   ├── effect_base.h
│   ├── websocket_server.h
│   ├── wasapi_driver.h
│   └── asio_driver.h
├── src/             # Implémentations
│   ├── main.cpp
│   ├── audio_engine.cpp
│   ├── dsp_pipeline.cpp
│   ├── effect_chain.cpp
│   ├── wasapi_driver.cpp
│   ├── asio_driver.cpp
│   └── websocket_server.cpp
└── CMakeLists.txt
```

### Composants principaux

#### AudioEngine
- Coordonne le driver audio et le pipeline DSP
- Gère le cycle de vie de l'application
- Point d'entrée principal

#### AudioDriver (Interface)
- Abstraction pour différents drivers (WASAPI, ASIO, CoreAudio, PipeWire)
- Gère les callbacks audio temps réel
- Mesure la latence

#### DSPPipeline
- Traite l'audio dans le callback
- Applique les gains d'entrée/sortie
- Gère les statistiques (CPU, peaks)

#### EffectChain
- Chaîne d'effets modulaire
- Thread-safe pour modifications à chaud
- Support des presets

#### WebSocketServer
- Communication avec le frontend
- Envoi/réception de messages JSON
- Gestion des reconnexions

## Frontend

### Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Pedalboard.tsx    # Chaîne d'effets
│   │   ├── Console.tsx       # Console (ampli, cab, micro)
│   │   └── StatsPanel.tsx    # Monitoring
│   ├── services/
│   │   └── websocket.ts      # Client WebSocket
│   ├── App.tsx
│   └── main.tsx
└── package.json
```

### Composants

#### Pedalboard
- Affichage de la chaîne d'effets
- Ajout/suppression d'effets
- Réordonnancement (drag-drop à venir)
- Contrôle des paramètres

#### Console
- Contrôles ampli (gain, volume, tone)
- Sélection de cabinet (IR)
- Position du micro

#### StatsPanel
- CPU usage
- Latence
- Vu-mètres (input/output)

## Communication

### Protocole WebSocket

Messages JSON bidirectionnels :

**Client → Serveur:**
- `start` / `stop`
- `setParameter`
- `addEffect` / `removeEffect`
- `getStats`

**Serveur → Client:**
- `status` (running state)
- `stats` (CPU, latence, peaks)
- `ack` / `error`

Voir [API WebSocket](API.md) pour les détails complets du protocole.

## ⚡ Performance & Latence

### Objectif : < 10 ms total

Répartition cible :
- **Audio callback** : 2-3 ms
- **Pipeline DSP** : 1-2 ms
- **Communication WebSocket** : 1-2 ms
- **Rendu UI** : < 1 ms
- **Buffer audio** : 2-3 ms

### Optimisations implémentées

1. ✅ **Buffer audio minimal** : 64-128 samples
2. ✅ **Mode exclusif** : WASAPI exclusive mode
3. ✅ **Pas d'allocation** : Dans le callback audio
4. ✅ **Lock-free** : Ring buffers pour communication
5. ✅ **Thread-safety** : Mutex uniquement hors callback

### Métriques actuelles

- **Latence moyenne** : 3-5 ms
- **CPU usage** : < 15% (avec 5-10 effets)
- **Stabilité** : Testé 24h+ sans crash

## 🔗 Voir aussi

- [Guide de Démarrage](GETTING_STARTED.md) - Installation et premier lancement
- [API WebSocket](API.md) - Protocole de communication détaillé
- [Roadmap](ROADMAP.md) - Prochaines étapes et fonctionnalités prévues

