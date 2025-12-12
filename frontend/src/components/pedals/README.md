# Architecture des Composants de Pédales

## Vue d'ensemble

Chaque pédale est maintenant un composant complet et autonome qui utilise :
- **PedalFrame** : Composant de trame (frame) qui gère la taille, position, blocs et layout
- **Composants d'interface** : Potentiometer, Slider, SwitchSelector, CTA, etc.

## Structure

### Composant de Trame : `PedalFrame`

Le composant `PedalFrame` encapsule toute la logique de :
- Détermination de la taille automatique selon les paramètres
- Gestion des layouts (default, flex, grid, eq, three-knobs, etc.)
- Affichage de la marque et du modèle
- Gestion du bypass et du footswitch
- Actions en bas de pédale

### Composants d'Interface

- **Potentiometer** : Pour les knobs/rotary controls
- **Slider** : Pour les sliders verticaux/horizontaux
- **SwitchSelector** : Pour les sélecteurs à plusieurs positions
- **CTA** : Pour les boutons d'action

## Création d'un Nouveau Composant de Pédale

### Template de Base

```tsx
import { useMemo } from 'react'
import { pedalLibrary } from '../../data/pedals'
import { PedalFrame } from './PedalFrame'
import { Potentiometer } from '../Potentiometer'
import { Slider } from '../Slider'
import { SwitchSelector } from '../SwitchSelector'
import type { PedalComponentProps } from './types'

const pedalId = 'nom-de-la-pedale'

/**
 * Composant complet de la pédale [Marque] [Modèle]
 * Description du layout spécial si applicable
 */
export function NomPedalPedal({ 
  values = {}, 
  onChange, 
  bypassed = false,
  onBypassToggle,
  bottomActions
}: PedalComponentProps) {
  const model = useMemo(() => pedalLibrary.find((p) => p.id === pedalId), [])
  
  if (!model) return null

  const controls = useMemo(() => {
    return Object.entries(model.parameters).map(([name, def]) => {
      const controlType = def.controlType || 'knob'
      const value = values[name] ?? def.default ?? 0

      if (controlType === 'slider') {
        return (
          <Slider
            key={name}
            label={def.label}
            value={value}
            min={def.min}
            max={def.max}
            orientation={def.orientation || 'vertical'}
            onChange={(v) => onChange?.(name, v)}
            color={model.accentColor}
          />
        )
      }

      if (controlType === 'switch-selector' && def.labels) {
        return (
          <SwitchSelector
            key={name}
            value={value}
            min={def.min}
            max={def.max}
            labels={def.labels}
            icons={def.icons}
            color={model.accentColor}
            onChange={(v) => onChange?.(name, v)}
          />
        )
      }

      return (
        <Potentiometer
          key={name}
          label={def.label}
          value={value}
          min={def.min}
          max={def.max}
          color={model.accentColor}
          onChange={(v) => onChange?.(name, v)}
        />
      )
    })
  }, [model, values, onChange])

  return (
    <PedalFrame
      model={model}
      layout="default" // ou 'flex', 'eq', 'three-knobs', etc.
      bypassed={bypassed}
      onBypassToggle={onBypassToggle}
      showFootswitch={false}
      bottomActions={bottomActions}
    >
      {controls}
    </PedalFrame>
  )
}

// Export pour compatibilité avec l'ancien système
export const NomPedalControls = ({
  values = {},
  onChange,
}: PedalComponentProps) => {
  const model = pedalLibrary.find((p) => p.id === pedalId)
  if (!model) return null
  
  // Même logique que dans le composant complet mais sans PedalFrame
  return (
    <>
      {/* Contrôles uniquement */}
    </>
  )
}

export default NomPedalPedal
```

### Layouts Disponibles

- **`default`** : Layout automatique basé sur les contrôles
- **`flex`** : Layout flex personnalisé (ex: Oceans 11, Fuzz Factory)
- **`eq`** : Layout pour égaliseurs (sliders verticaux)
- **`three-knobs`** : Layout spécial pour 3 knobs
- **`switch-selector-with-knobs`** : Switch-selector en haut, knobs en dessous
- **`l-grid-3x2`** : Grille 3x2 pour pédales de taille L
- **`gmajor2`** : Layout spécial pour TC G-Major 2

## Exemples

### Pédales Simples (3 knobs)
- **BOSS DS-1** : 3 knobs en ligne, Layout: `default`
- **BOSS SD-1** : 3 knobs en ligne, Layout: `default`
- **Ibanez Tube Screamer** : 3 knobs en ligne, Layout: `default`

### Pédale avec Layout Flex (ZVEX Fuzz Factory)
- 3 knobs sur la première ligne, 2 sur la deuxième
- Layout: `flex`
- Layout personnalisé dans le JSX

### Égaliseur (BOSS GE-7)
- Sliders verticaux pour les bandes
- Slider level séparé
- Layout: `eq`

### Pédales avec Switch-Selector
- **Electro-Harmonix Oceans 11** : Switch-selector en haut (pleine largeur), 3 knobs en ligne horizontale, Layout: `flex`
- **BOSS RV-6** : Switch-selector en haut (pleine largeur), 3 knobs en ligne horizontale, Layout: `flex`
- **Strymon Flint** : 2 switch-selectors en haut (pleine largeur), 3 knobs en ligne horizontale, Layout: `flex`

## Pédales Refactorisées

Les pédales suivantes utilisent la nouvelle architecture avec `PedalFrame` :

### Pédales Simples (1-4 knobs)
✅ Boss DS-1  
✅ Boss SD-1  
✅ Boss DD-3  
✅ Boss CH-1  
✅ Boss CE-1  
✅ Boss CE-2  
✅ Boss BF-3 (4 knobs)  
✅ Boss OD-1  
✅ Boss TR-2  
✅ Ibanez Tube Screamer  
✅ Ibanez Tube Screamer Mini  
✅ Pro Co RAT  
✅ Electro-Harmonix Big Muff (4 knobs)  
✅ Electro-Harmonix Small Clone (2 knobs)  
✅ Electro-Harmonix Small Stone (1 knob)  
✅ Electro-Harmonix Holy Grail (2 knobs)  
✅ Electro-Harmonix Electric Mistress (3 knobs)  
✅ Klon Centaur  
✅ Fulltone OCD (4 knobs)  
✅ Fulltone Supa-Trem (3 knobs)  
✅ Dunlop Fuzz Face (2 knobs)  
✅ MXR Phase 90 (1 knob)  
✅ MXR Analog Chorus  
✅ MXR Dyna Comp (2 knobs)  
✅ MXR Flanger 117 (4 knobs)  
✅ Mooer Phaser (3 knobs)  
✅ Mooer E-Lady (2 knobs)  
✅ Walrus Audio Flanger (3 knobs)  
✅ JHS AT Drive (3 knobs)  
✅ Mesa Grid Slammer (3 knobs)  
✅ Satchurator (3 knobs)  
✅ Treble Booster (1 knob)  
✅ Power Booster (1 knob)  
✅ Light Boost (1 knob)  
✅ Octavia Fuzz (2 knobs)  
✅ Electro-Harmonix Muff (4 knobs)  
✅ MXR MC402 (2 knobs)  
✅ Univibe (4 knobs)  
✅ Ibanez Jemini (6 knobs - 2 canaux)  
✅ Vox Time Machine (3 knobs)  
✅ Memory Man Delay (4 knobs)  
✅ TC Delay (3 knobs)  
✅ Echoplex Tape Delay (3 knobs)  
✅ Binson Echorec (4 knobs)  
✅ Roland Space Echo (5 knobs)  
✅ Leslie Rotary (4 knobs)  
✅ Digitech Whammy (1 knob + switch-selector)  
✅ Boss Volume/Expression (1 knob)  
✅ Noise Gate (2 knobs)  
✅ Killswitch Stutter (1 knob)  
✅ Morley Bad Horsie (1 knob)  
✅ Vox V847 Wah (1 knob)  
✅ Cry Baby Wah (1 knob)  
✅ Slash Wah SW95 (1 knob)  
✅ EVH Wah (1 knob)  
✅ KH95 Wah (1 knob)  
✅ RMC Wah (1 knob)  
✅ Dunlop Crybaby Classic (1 knob)  
✅ Eventide Harmonizer (3 knobs)  
✅ Moog MF Ring (4 knobs avec marges ajustées)  
✅ ZVEX Lo-Fi Junky (4 knobs en grille 2x2)  
✅ Red Panda Bitmap (3 knobs avec marges ajustées)  
✅ Surfybear Metal (3 knobs avec marges ajustées)  
✅ Strymon BigSky Shimmer (5 knobs avec marges ajustées)  
✅ Boss TU-3 (Tuner avec détection audio complexe - layout flex, taille L)  

### Pédales avec Switch-Selector
✅ Boss PH-3  
✅ Boss RV-6  
✅ Strymon Flint  
✅ Electro-Harmonix Oceans 11  

### Pédales avec Layout Flex
✅ ZVEX Fuzz Factory (3+2 knobs)  
✅ Strymon El Capistan (3+2 knobs)  
✅ Strymon Timeline (5 knobs)  
✅ Strymon BigSky (5 knobs avec marges ajustées)  
✅ Neunaber Reverb (3 knobs)  
✅ Walrus Audio Distortion (sliders horizontaux + switch-selector)  
✅ Walrus Audio Drive (sliders horizontaux + switch-selector)  
✅ Walrus Audio Fuzz (sliders horizontaux + switch-selector)  
✅ Walrus Audio Chorus (sliders horizontaux + switch-selector)  
✅ Walrus Audio Delay (sliders horizontaux + switch-selector)  
✅ Walrus Audio Reverb (sliders horizontaux + switch-selector)  
✅ Walrus Audio Phaser (sliders horizontaux + switch-selector)  
✅ Walrus Audio Tremolo (sliders horizontaux + switch-selector)  
✅ Walrus Audio Ambient (sliders horizontaux + switch-selector)  

### Égaliseurs — 4 pédales
✅ Boss GE-7 (7 bandes)  
✅ MXR 10-Band EQ (10 bandes)  
✅ Source Audio Programmable EQ (bandes + level)  
✅ Empress Paraeq (bandes + level)  

### Multi-Effets
✅ TC Electronic Flashback  
✅ TC G-Major 2 (layout spécial)  

**Total : 89 pédales refactorisées**

🎉 **Toutes les pédales sont maintenant refactorisées !** 

- ✅ La pédale Boss TU-3 a été intégrée avec succès en conservant toute sa logique audio complexe (détection de pitch, AudioContext, etc.)
- ✅ Toutes les pédales utilisent maintenant la nouvelle architecture `PedalFrame`
- ✅ Le système de fallback dans `Pedalboard.tsx` reste disponible pour compatibilité mais ne devrait plus être nécessaire

## Migration depuis l'Ancien Système

1. Importer `PedalFrame` et les types depuis `./types`
2. Créer le composant complet `NomPedalPedal`
3. Utiliser `useMemo` pour optimiser les calculs
4. Garder `NomPedalControls` pour compatibilité
5. Ajouter le composant complet dans `index.ts` dans `pedalComponents`

## Avantages de la Nouvelle Architecture

1. **Modularité** : Chaque pédale est autonome et précise
2. **Réutilisabilité** : Composants d'interface standardisés
3. **Maintenabilité** : Code plus clair et organisé
4. **Performance** : Optimisations avec `useMemo`
5. **Type Safety** : Types partagés pour cohérence

