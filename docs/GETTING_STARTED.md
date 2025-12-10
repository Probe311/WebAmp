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
git clone <repository-url>
cd WebAmp
```

### 2. Installer les dépendances frontend

```bash
cd frontend
npm install
```

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

### Option 1 : Scripts PowerShell (Windows - Recommandé)

```powershell
# Démarrer tous les services
.\scripts\start-all.ps1

# Ou séparément:
.\scripts\start-native.ps1    # Native Helper uniquement
.\scripts\start-frontend.ps1  # Frontend uniquement
```

### Option 2 : Manuel

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

### URL WebSocket

Par défaut, le frontend se connecte à `ws://localhost:8765`.

Pour changer l'URL, créez un fichier `.env.local` dans `frontend/` :

```env
VITE_WEBSOCKET_URL=ws://votre-serveur:8765
```

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

## 📚 Prochaines étapes

- Consultez [Architecture](ARCHITECTURE.md) pour comprendre la structure
- Lisez [Design System](DESIGN_SYSTEM.md) pour les conventions UI
- Explorez [Composants](COMPONENTS.md) pour les composants disponibles
- Consultez [API WebSocket](API.md) pour le protocole de communication

---

**Besoin d'aide ?** Consultez les autres documents de la documentation ou ouvrez une issue sur GitHub.

