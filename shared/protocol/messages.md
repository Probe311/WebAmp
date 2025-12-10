# Protocole de Communication WebSocket

## Messages Client → Serveur

### Start/Stop
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

### Configuration
```json
{
  "type": "setParameter",
  "effectId": "effect-123",
  "parameter": "gain",
  "value": 75.5
}
```

```json
{
  "type": "addEffect",
  "effectType": "distortion",
  "pedalId": "boss-ds1",
  "position": 0
}
```

```json
{
  "type": "setAmplifier",
  "amplifierId": "fender-65-twin"
}
```

```json
{
  "type": "setAmplifierParameter",
  "amplifierId": "fender-65-twin",
  "parameter": "volume",
  "value": 7.5
}
```

```json
{
  "type": "removeEffect",
  "effectId": "effect-123"
}
```

```json
{
  "type": "moveEffect",
  "effectId": "effect-123",
  "toPosition": 2
}
```

```json
{
  "type": "toggleBypass",
  "effectId": "effect-123",
  "bypassed": true
}
```

### Requêtes
```json
{
  "type": "getStats"
}
```

## Messages Serveur → Client

### Status
```json
{
  "type": "status",
  "running": true
}
```

### Stats
```json
{
  "type": "stats",
  "cpu": 15.5,
  "latency": 3.2,
  "peakInput": -12.5,
  "peakOutput": -6.3
}
```

### Acknowledgment
```json
{
  "type": "ack"
}
```

### Error
```json
{
  "type": "error",
  "message": "Erreur description"
}
```

