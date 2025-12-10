# API WebSocket - WebAmp

Documentation complète du protocole de communication WebSocket entre le frontend et le native helper.

## 🔌 Connexion

### URL par défaut

```
ws://localhost:8765
```

Configurable via variable d'environnement `VITE_WEBSOCKET_URL`.

### Établissement de connexion

1. Le frontend se connecte automatiquement au démarrage
2. Le native helper accepte la connexion
3. Le frontend envoie automatiquement `getState` pour synchroniser l'état initial
4. Le serveur répond avec un message `state` contenant l'état complet

---

## 📨 Messages Client → Serveur

### `getState`

Récupère l'état complet du serveur (effets, ampli, paramètres).

```json
{
  "type": "getState"
}
```

**Réponse** : Message `state` (voir Messages Serveur → Client)

---

### `addEffect`

Ajoute un effet à la chaîne.

```json
{
  "type": "addEffect",
  "effectType": "distortion",
  "pedalId": "boss-ds1",
  "position": 0,
  "effectId": "effect-1234567890"
}
```

**Champs** :
- `effectType` : Type d'effet (`distortion`, `delay`, `reverb`, etc.)
- `pedalId` : ID de la pédale dans la bibliothèque
- `position` : Position dans la chaîne (0 = début)
- `effectId` : ID unique de l'effet (généré par le frontend)

**Réponse** : Message `ack` avec `messageId`

---

### `removeEffect`

Supprime un effet de la chaîne.

```json
{
  "type": "removeEffect",
  "effectId": "effect-1234567890"
}
```

**Champs** :
- `effectId` : ID de l'effet à supprimer

**Réponse** : Message `ack`

---

### `setParameter`

Modifie un paramètre d'un effet.

```json
{
  "type": "setParameter",
  "effectId": "effect-1234567890",
  "parameter": "gain",
  "value": 75.5
}
```

**Champs** :
- `effectId` : ID de l'effet
- `parameter` : Nom du paramètre
- `value` : Nouvelle valeur (nombre)

**Réponse** : Message `ack`

---

### `toggleBypass`

Active ou désactive un effet (bypass).

```json
{
  "type": "toggleBypass",
  "effectId": "effect-1234567890",
  "bypassed": true
}
```

**Champs** :
- `effectId` : ID de l'effet
- `bypassed` : `true` pour bypasser, `false` pour activer

**Réponse** : Message `ack`

---

### `moveEffect`

Déplace un effet dans la chaîne.

```json
{
  "type": "moveEffect",
  "effectId": "effect-1234567890",
  "fromPosition": 0,
  "toPosition": 2
}
```

**Champs** :
- `effectId` : ID de l'effet
- `fromPosition` : Position actuelle
- `toPosition` : Nouvelle position

**Réponse** : Message `ack`

---

### `clearEffects`

Supprime tous les effets de la chaîne.

```json
{
  "type": "clearEffects"
}
```

**Réponse** : Message `ack`

---

### `setAmplifier`

Sélectionne un amplificateur.

```json
{
  "type": "setAmplifier",
  "amplifierId": "fender-65-twin"
}
```

**Champs** :
- `amplifierId` : ID de l'amplificateur dans la bibliothèque

**Réponse** : Message `ack`

---

### `setAmplifierParameter`

Modifie un paramètre d'amplificateur.

```json
{
  "type": "setAmplifierParameter",
  "amplifierId": "fender-65-twin",
  "parameter": "volume",
  "value": 7.5
}
```

**Champs** :
- `amplifierId` : ID de l'amplificateur
- `parameter` : Nom du paramètre (`volume`, `gain`, `bass`, `middle`, `treble`, etc.)
- `value` : Nouvelle valeur

**Réponse** : Message `ack`

---

### `setAmplifierPower`

Allume ou éteint l'amplificateur.

```json
{
  "type": "setAmplifierPower",
  "amplifierId": "fender-65-twin",
  "powered": true
}
```

**Champs** :
- `amplifierId` : ID de l'amplificateur
- `powered` : `true` pour allumer, `false` pour éteindre

**Réponse** : Message `ack`

---

### `start` / `stop`

Démarre ou arrête le traitement audio.

```json
{
  "type": "start"
}
```

```json
{
  "type": "stop"
}
```

**Réponse** : Message `ack` + Message `status` avec `running: true/false`

---

### `getStats`

Demande les statistiques actuelles.

```json
{
  "type": "getStats"
}
```

**Réponse** : Message `stats` (voir Messages Serveur → Client)

---

## 📥 Messages Serveur → Client

### `ack`

Confirmation qu'un message a été reçu et traité.

```json
{
  "type": "ack",
  "messageId": "msg-1234567890-1234567890"
}
```

**Champs** :
- `messageId` : ID du message original (si présent)

---

### `error`

Erreur lors du traitement d'un message.

```json
{
  "type": "error",
  "message": "Effet non trouvé",
  "messageId": "msg-1234567890-1234567890"
}
```

**Champs** :
- `message` : Description de l'erreur
- `messageId` : ID du message qui a causé l'erreur (si présent)

---

### `status`

État du serveur (running/stopped).

```json
{
  "type": "status",
  "running": true
}
```

**Champs** :
- `running` : `true` si le traitement audio est actif, `false` sinon

**Envoi** : Automatique lors des changements d'état

---

### `stats`

Statistiques de performance.

```json
{
  "type": "stats",
  "cpu": 15.5,
  "latency": 3.2,
  "peakInput": -12.5,
  "peakOutput": -6.3
}
```

**Champs** :
- `cpu` : Utilisation CPU en pourcentage
- `latency` : Latence totale en millisecondes
- `peakInput` : Pic d'entrée en dB
- `peakOutput` : Pic de sortie en dB

**Envoi** : Périodique (toutes les 100ms environ)

---

### `state`

État complet du serveur (réponse à `getState`).

```json
{
  "type": "state",
  "amplifierId": "fender-65-twin",
  "amplifierParameters": {
    "volume": 7.5,
    "gain": 5.0,
    "bass": 5.0,
    "middle": 5.0,
    "treble": 5.0
  },
  "effects": [
    {
      "id": "effect-1234567890",
      "type": "distortion",
      "pedalId": "boss-ds1",
      "bypassed": false,
      "parameters": {
        "distortion": 50,
        "tone": 50,
        "level": 50
      },
      "position": 0
    }
  ]
}
```

**Champs** :
- `amplifierId` : ID de l'amplificateur actuel (ou `null`)
- `amplifierParameters` : Paramètres de l'amplificateur
- `effects` : Liste des effets dans l'ordre

**Envoi** : En réponse à `getState` ou après reconnexion

---

## 🔄 Système d'Acknowledgment

### Principe

Pour les messages critiques, le frontend peut demander un acknowledgment :

```typescript
await ws.send({
  type: 'addEffect',
  effectType: 'distortion',
  pedalId: 'boss-ds1',
  position: 0,
  effectId: 'effect-123'
}, true) // requireAck = true
```

Le serveur répondra avec un message `ack` contenant le `messageId`.

### Timeout

Si aucun `ack` n'est reçu dans les 5 secondes, une erreur est levée.

### Messages sans acknowledgment

Certains messages n'ont pas besoin d'acknowledgment :
- `getState` : La réponse `state` sert de confirmation
- `getStats` : La réponse `stats` sert de confirmation

---

## 🛡️ Gestion d'erreur

### Erreurs de connexion

En cas d'erreur de connexion, le frontend :
1. Tente de se reconnecter automatiquement (backoff exponentiel)
2. Met en queue les messages pendant la déconnexion
3. Envoie automatiquement `getState` après reconnexion

### Erreurs de message

Si le serveur renvoie un message `error` :
1. Le frontend log l'erreur dans la console
2. La promesse est rejetée (si acknowledgment requis)
3. L'utilisateur peut être notifié (à implémenter)

---

## 📝 Exemples

### Ajouter une pédale et modifier un paramètre

```typescript
// 1. Ajouter l'effet
await ws.send({
  type: 'addEffect',
  effectType: 'distortion',
  pedalId: 'boss-ds1',
  position: 0,
  effectId: 'effect-123'
}, true)

// 2. Modifier un paramètre
await ws.send({
  type: 'setParameter',
  effectId: 'effect-123',
  parameter: 'distortion',
  value: 75
}, true)
```

### Synchronisation initiale

```typescript
// Le frontend envoie automatiquement au démarrage
ws.send({ type: 'getState' }, false)

// Le serveur répond avec l'état complet
// Le frontend reconstruit l'UI depuis cet état
```

---

## 🔗 Voir aussi

- [Architecture](ARCHITECTURE.md) - Vue d'ensemble de l'architecture
- [Composants](COMPONENTS.md) - Documentation des composants React
- [Protocole détaillé](../shared/protocol/messages.md) - Spécification technique complète

