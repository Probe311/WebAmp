# Conversion JSON de Tablature

## Format JSON d'entrée

Le format JSON attendu correspond à celui de `docs/tabs/Shake it off.json` :

```json
{
  "title": "Shake It Off",
  "artist": "Taylor Swift",
  "tracks": [
    {
      "name": "Electric Guitar",
      "instrument": "electricGuitar",
      "tuning": ["E", "A", "D", "G", "B", "E"],  // Array de strings
      "tempo": 160,
      "timeSignature": "4/4",
      "measures": [
        {
          "number": 1,  // Pas "id"
          "notes": [
            {
              "measure": 21,
              "position": 0,
              "string": 1,  // 1-6 (1=E grave, 6=E aigu)
              "fret": 0,   // Peut être null
              "x": 1097.87,  // Position X en pixels absolus
              "y": 1.52
            }
          ],
          "chords": []
        }
      ]
    }
  ]
}
```

## Format de sortie

La fonction `convertJsonTablatureToSongData` convertit le JSON au format attendu par les composants :

- **tuning**: Array → String (`"E A D G B E"`)
- **number** → **id** pour les mesures
- **x** (pixels absolus) → **x** (pourcentage 0-100)
- **fret: null** → filtré (notes ignorées)
- **lines**: Générées automatiquement si absentes (80 tirets)
- **chords**: Convertis depuis la structure JSON

## Utilisation

```typescript
import { convertJsonTablatureToSongData } from './CourseTablatureViewer';

// Charger le JSON
const jsonData = await fetch('/docs/tabs/Shake it off.json').then(r => r.json());

// Convertir
const songData = convertJsonTablatureToSongData(jsonData);

// Utiliser dans CourseTablatureViewer
setSongData(songData);
```

## Notes importantes

1. **Position X**: Les valeurs `x` du JSON sont en pixels absolus. La fonction suppose une largeur de mesure de ~1250px pour la conversion en pourcentage.

2. **Fret null**: Les notes avec `fret: null` sont automatiquement filtrées et ne sont pas affichées.

3. **Lines**: Si les mesures n'ont pas de `lines`, elles sont générées automatiquement avec 80 tirets (`-`) pour chaque corde.

4. **Chords**: Les chords sont extraits depuis `chords[0].frets[]` et convertis en string (format: `"1:0, 3:0"`).

