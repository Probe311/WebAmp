# Guide de Démarrage - WebAmp

Ce guide vous aidera à installer, compiler et lancer WebAmp pour la première fois.

## 📋 Prérequis

### Système

**Windows :**
- Windows 10/11 (64-bit)
- Visual Studio 2019+ ou Build Tools
- CMake 3.20+
- Windows SDK

**macOS :**
- macOS 10.15+
- Xcode Command Line Tools
- CMake 3.20+

**Linux :**
- Ubuntu 20.04+ / Debian 11+ / Fedora 34+
- GCC 9+ ou Clang 10+
- CMake 3.20+
- PipeWire development libraries (optionnel, pour support audio)

### Logiciels

- **Node.js 18+** : [Télécharger](https://nodejs.org/)
- **npm** : Inclus avec Node.js
- **Git** : [Télécharger](https://git-scm.com/)

---

## 🔧 Installation

### 1. Cloner le repository

```bash
git clone https://github.com/Probe311/WebAmp.git
cd WebAmp
```

### 2. Installer les dépendances frontend

```bash
cd frontend
npm install
cp .env.example .env.local
```

Éditez `.env.local` avec **vos** valeurs Supabase (et APIs optionnelles).  
Ne committez jamais ce fichier. Modèle : [`../frontend/.env.example`](../frontend/.env.example) · [SECURITY.md](../SECURITY.md).

### 3. Build le Native Helper

#### Windows (Visual Studio)

```powershell
cd native
mkdir build
cd build
cmake .. -G "Visual Studio 17 2022" -A x64
cmake --build . --config Release
```

L'exécutable sera dans `native/build/Release/webamp_native.exe`

#### Windows (MinGW)

```bash
cd native
mkdir build
cd build
cmake .. -G "MinGW Makefiles"
cmake --build . --config Release
```

#### macOS/Linux

```bash
cd native
mkdir build
cd build
cmake .. -DCMAKE_BUILD_TYPE=Release
cmake --build .
```

L'exécutable sera dans `native/build/webamp_native`

---

## 🚀 Lancement

#### Terminal 1 : Native Helper

```bash
# Windows
.\native\build\Release\webamp_native.exe

# macOS/Linux
./native/build/webamp_native
```

Le serveur WebSocket démarre sur le port **8765** par défaut.

#### Terminal 2 : Frontend

```bash
cd frontend
npm run dev
```

Le frontend sera accessible sur **http://localhost:10000**

---

## ⚙️ Configuration

### Variables d’environnement

Fichier `frontend/.env.local` (gitignored) :

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_WEBSOCKET_URL=ws://localhost:8765
# VITE_ADMIN_UUID=your-auth-user-uuid
```

Toute variable `VITE_*` est visible dans le bundle JS. Secrets serveur → Supabase / Vercel, pas ici.

### Driver Audio

Le native helper essaie automatiquement les drivers dans cet ordre :
1. ASIO (si disponible)
2. WASAPI (Windows)
3. CoreAudio (macOS)
4. PipeWire (Linux)

Pour forcer un driver spécifique :

```bash
webamp_native.exe WASAPI
webamp_native.exe ASIO
```

### Port WebSocket

Pour changer le port WebSocket, modifiez dans `native/src/main.cpp` :

```cpp
server.initialize(8765); // Changer le port ici
```

Et mettez à jour la configuration frontend (voir ci-dessus).

---

## 🧪 Vérification

Une fois lancé, vous devriez voir :

1. **Native Helper** : Message "WebSocket server started on port 8765"
2. **Frontend** : Interface WebAmp dans le navigateur
3. **Connexion** : Indicateur de connexion WebSocket (dans la console du navigateur)

### Test rapide

1. Cliquez sur "Ajouter une pédale" dans le pedalboard
2. Sélectionnez une pédale (ex: BOSS DS-1)
3. Ajustez les paramètres
4. Vérifiez que les changements sont reflétés en temps réel

---

## 🔍 Dépannage

### Erreur "Exécutable non trouvé"

**Cause** : Le build n'a pas été effectué.

**Solution** :
```bash
cd native/build
cmake --build . --config Release
```

### Erreur "CMake non trouvé"

**Cause** : CMake n'est pas dans le PATH.

**Solution** :
- Installez CMake et ajoutez-le au PATH
- Ou utilisez Visual Studio Developer Command Prompt (Windows)

### Erreur "Port déjà utilisé"

**Cause** : Un autre processus utilise le port 8765 ou 10000.

**Solution** :
- Arrêtez le processus utilisant le port
- Ou changez les ports dans la configuration

### Erreur audio "Impossible d'initialiser l'engine audio"

**Cause** : Problème avec les drivers audio.

**Solution** :
- Vérifiez que les drivers audio sont installés
- Essayez un driver spécifique : `webamp_native.exe WASAPI`
- Vérifiez les permissions audio (Windows)

### Erreur de connexion WebSocket

**Cause** : Le native helper n'est pas démarré ou port incorrect.

**Solution** :
- Vérifiez que le native helper est démarré
- Vérifiez le port (8765 par défaut)
- Vérifiez le firewall
- Vérifiez l'URL dans la configuration frontend

### Latence élevée

**Cause** : Configuration audio sous-optimale.

**Solution** :
- Réduisez la taille du buffer dans le driver
- Utilisez ASIO si disponible (latence plus faible)
- Vérifiez la configuration audio système

---

## 🔧 Options de Build Avancées

### Options CMake

- `BUILD_ASIO` : Activer le support ASIO (Windows, défaut: ON)
- `BUILD_WASAPI` : Activer le support WASAPI (Windows, défaut: ON)
- `BUILD_COREAUDIO` : Activer le support CoreAudio (macOS, défaut: ON si Apple)
- `BUILD_PIPEWIRE` : Activer le support PipeWire (Linux, défaut: ON si disponible)
- `USE_ASIO_SDK` : Utiliser l'ASIO SDK (nécessite SDK dans `native/third_party/asio/`)

### Drivers Audio

**Windows :**
- **WASAPI** : Toujours disponible, mode exclusif pour latence minimale
- **ASIO** : Nécessite ASIO SDK et un driver ASIO installé (ex: ASIO4ALL)

**macOS :**
- **CoreAudio** : Natif, utilise AudioUnit HAL pour latence minimale

**Linux :**
- **PipeWire** : Support natif avec émulation JACK automatique si configuré

**Détection automatique :**
- Windows : ASIO → WASAPI (fallback)
- macOS : CoreAudio
- Linux : PipeWire

### Troubleshooting Build

**ASIO ne fonctionne pas :**
- Vérifier que l'ASIO SDK est dans `native/third_party/asio/`
- Vérifier que `USE_ASIO_SDK=ON` est défini
- Vérifier qu'un driver ASIO est installé (ex: ASIO4ALL)

**PipeWire non détecté :**
- Installer libpipewire-dev
- Vérifier que PipeWire est en cours d'exécution : `systemctl --user status pipewire`

**CoreAudio erreurs :**
- Vérifier les permissions microphone dans les Préférences Système
- Vérifier qu'aucune autre application n'utilise exclusivement l'audio

---

## 📚 Prochaines étapes

- Consultez [Architecture](ARCHITECTURE.md) pour comprendre la structure
- Lisez [Design System](DESIGN_SYSTEM.md) pour les conventions UI
- Explorez [Composants](COMPONENTS.md) pour les composants disponibles
- Consultez [API WebSocket](API.md) pour le protocole de communication
- Voir [Déploiement](DEPLOYMENT.md) pour déployer l'application

---

**Besoin d'aide ?** Consultez les autres documents de la documentation ou ouvrez une issue sur GitHub.

