# Guide de Tests - WebAmp

Ce document explique comment exécuter et écrire des tests pour WebAmp.

## Structure des Tests

### Frontend (TypeScript/React)
- **Framework** : Vitest
- **Location** : `frontend/src/**/__tests__/` et `frontend/src/test/`
- **Configuration** : `frontend/vitest.config.ts`

### Native (C++)
- **Framework** : Google Test (gtest)
- **Location** : `native/tests/`
- **Configuration** : `native/tests/CMakeLists.txt`

## Exécution des Tests

### Frontend

```bash
cd frontend
npm install  # Installer les dépendances de test
npm test              # Exécuter tous les tests
npm run test:ui       # Interface graphique
npm run test:coverage # Avec couverture de code
```

### Native

```bash
cd native
mkdir build
cd build
cmake -DBUILD_TESTS=ON ..
cmake --build .
ctest                 # Exécuter tous les tests
ctest --verbose       # Mode verbeux
```

## Types de Tests

### 1. Tests d'Effets DSP (Frontend)
- **Fichier** : `frontend/src/audio/__tests__/effects.test.ts`
- **Couverture** : Tous les effets Web Audio API
- **Tests** : Création, paramètres, limites

### 2. Tests d'Effets DSP (Native)
- **Fichier** : `native/tests/test_effects.cpp`
- **Couverture** : Tous les effets C++
- **Tests** : Traitement audio, paramètres, bypass

### 3. Tests du Pipeline DSP
- **Fichier** : `native/tests/test_dsp_pipeline.cpp`
- **Couverture** : Pipeline principal, latence, CPU
- **Tests** : Latence < 5ms, CPU < 15%, sample rates élevés

### 4. Tests de la Chaîne d'Effets
- **Fichier** : `native/tests/test_effect_chain.cpp`
- **Couverture** : Chaîne d'effets, jusqu'à 20 effets
- **Tests** : Add/remove, move, swap, presets

### 5. Tests d'Intégration WebSocket
- **Fichier** : `frontend/src/services/__tests__/websocket.test.ts`
- **Couverture** : Client WebSocket, messages, retry
- **Tests** : Connexion, envoi, réception, reconnexion

### 6. Tests de Performance
- **Fichier** : `frontend/src/test/performance.test.ts`, `native/tests/test_performance.cpp`
- **Couverture** : Latence, CPU, mémoire
- **Tests** : Vérification des objectifs de performance

### 7. Tests de Charge (Stress Tests)
- **Fichier** : `frontend/src/test/stress.test.ts`
- **Couverture** : 20 effets, changements rapides
- **Tests** : Limites, robustesse

### 8. Tests de Compatibilité Navigateurs
- **Fichier** : `frontend/src/test/browser-compatibility.test.ts`
- **Couverture** : Web Audio API, WebSocket, ES6
- **Tests** : Support des APIs nécessaires

## Écrire de Nouveaux Tests

### Frontend (Vitest)

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { makeOverdrive } from '../effects'

describe('MyEffect', () => {
  let audioCtx: AudioContext

  beforeEach(() => {
    audioCtx = new AudioContext()
  })

  it('should create effect', () => {
    const effect = makeOverdrive(audioCtx, 50, 50, 50)
    expect(effect.input).toBeDefined()
    expect(effect.output).toBeDefined()
  })
})
```

### Native (Google Test)

```cpp
#include <gtest/gtest.h>
#include "effects/distortion.h"

TEST(MyEffectTest, BasicFunctionality) {
    auto effect = std::make_shared<DistortionEffect>();
    effect->setSampleRate(44100);
    
    std::vector<float> input(128, 0.3f);
    std::vector<float> output(128);
    
    effect->process(input.data(), output.data(), 128);
    
    EXPECT_NE(output[0], 0.0f);
}
```

## Couverture de Code

### Frontend
```bash
npm run test:coverage
```
Rapport généré dans `frontend/coverage/`

### Native
Utiliser gcov avec CMake :
```bash
cmake -DCMAKE_BUILD_TYPE=Debug -DBUILD_TESTS=ON ..
cmake --build .
ctest
gcov src/*.cpp
```

## Tests CI/CD

Les tests peuvent être intégrés dans un pipeline CI/CD :
- GitHub Actions
- GitLab CI
- Jenkins

Exemple GitHub Actions :
```yaml
- name: Run Frontend Tests
  run: |
    cd frontend
    npm test

- name: Run Native Tests
  run: |
    cd native/build
    cmake -DBUILD_TESTS=ON ..
    cmake --build .
    ctest
```

## Notes

- Les tests audio nécessitent des mocks pour Web Audio API
- Les tests natifs peuvent nécessiter des périphériques audio (peuvent être mockés)
- Les tests de performance sont sensibles à la machine hôte
- Les tests de compatibilité navigateurs peuvent nécessiter Playwright/Puppeteer

