# Composants React - WebAmp

Documentation complète des composants React utilisés dans WebAmp.

## 📚 Navigation

- [Composants de base](#composants-de-base) - Knob, Slider, Switch, etc.
- [Composants layout](#composants-layout) - Pedal, Panel, etc.
- [Composants modaux](#composants-modaux) - Modals, Library modals
- [Composants utilitaires](#composants-utilitaires) - CTA, ProgressBar, etc.

---

## Composants de base

## Potentiometer (Potentiomètre Rond)

Composant potentiomètre rond avec couleur variable et tailles configurables.

### Props

- `value: number` - Valeur actuelle (requis)
- `min?: number` - Valeur minimale (défaut: 0)
- `max?: number` - Valeur maximale (défaut: 100)
- `label?: string` - Label affiché au-dessus
- `color?: string` - Couleur du potentiomètre (défaut: '#fff')
- `size?: 'small' | 'medium' | 'large'` - Taille du potentiomètre (défaut: 'medium')
- `step?: number` - Pas d'incrémentation (défaut: 1)
- `onChange: (value: number) => void` - Callback appelé lors du changement (requis)
- `disabled?: boolean` - Désactive le composant (défaut: false)
- `className?: string` - Classes CSS supplémentaires

### Exemple

```tsx
import { Potentiometer } from './components'

<Potentiometer
  value={50}
  min={0}
  max={100}
  label="Volume"
  color="#ff6b6b"
  size="medium"
  onChange={(value) => console.log(value)}
/>
```

## ProgressBar (Barre de Progression)

Composant barre de progression verticale ou horizontale avec couleur variable. Peut être interactive (manuelle) ou en lecture seule.

### Props

- `value: number` - Valeur actuelle (requis)
- `min?: number` - Valeur minimale (défaut: 0)
- `max?: number` - Valeur maximale (défaut: 100)
- `label?: string` - Label affiché
- `color?: string` - Couleur de la barre (défaut: '#fff')
- `orientation?: 'vertical' | 'horizontal'` - Orientation (défaut: 'vertical')
- `height?: string` - Hauteur personnalisée (ex: '150px')
- `width?: string` - Largeur personnalisée (ex: '300px')
- `showValue?: boolean` - Afficher la valeur numérique (défaut: false)
- `onChange?: (value: number) => void` - Callback pour rendre la barre interactive
- `disabled?: boolean` - Désactive le composant (défaut: false)
- `className?: string` - Classes CSS supplémentaires

### Exemple

```tsx
import { ProgressBar } from './components'

// Barre verticale interactive
<ProgressBar
  value={75}
  min={0}
  max={100}
  label="Gain"
  color="#4ecdc4"
  orientation="vertical"
  showValue={true}
  onChange={(value) => console.log(value)}
/>

// Barre horizontale en lecture seule
<ProgressBar
  value={60}
  label="CPU"
  color="#ff6b6b"
  orientation="horizontal"
  showValue={true}
/>
```

## Pedal (Pédale)

Composant pédale réutilisable avec couleur variable et tailles configurables.

### Props

- `brand?: string` - Marque de la pédale
- `model?: string` - Modèle de la pédale
- `color?: string` - Couleur de fond (défaut: 'rgba(20, 20, 20, 0.95)')
- `accentColor?: string` - Couleur d'accentuation (bordure, footswitch) (défaut: '#fff')
- `size?: 'S' | 'M' | 'L' | 'XL'` - Taille de la pédale (défaut: 'M')
- `bypassed?: boolean` - État bypass (défaut: false)
- `children?: ReactNode` - Contenu de la pédale (contrôles, etc.)
- `className?: string` - Classes CSS supplémentaires
- `onClick?: () => void` - Callback au clic sur la pédale
- `onBypassToggle?: () => void` - Callback au clic sur le footswitch
- `showFootswitch?: boolean` - Afficher le footswitch (défaut: true)

### Tailles (système de grille)

Les tailles suivent un système de grille basé sur des unités de 200px :

- **S**: 0.5 × 2 = 100px × 440px
- **M**: 1 × 2 = 200px × 440px (taille actuelle)
- **L**: 2 × 2 = 440px × 440px
- **XL**: 3 × 2 = 600px × 440px

### Exemple

```tsx
import { Pedal, Potentiometer, ProgressBar } from './components'

<Pedal
  brand="Boss"
  model="DS-1"
  color="rgba(40, 40, 40, 0.95)"
  accentColor="#ff6b6b"
  size="M"
  bypassed={false}
  onBypassToggle={() => console.log('Toggle bypass')}
>
  <Potentiometer
    value={50}
    label="Drive"
    color="#ff6b6b"
    onChange={(value) => console.log(value)}
  />
  <ProgressBar
    value={75}
    label="Level"
    color="#ff6b6b"
    orientation="vertical"
    onChange={(value) => console.log(value)}
  />
</Pedal>
```

## 🎨 Design System

Tous les composants respectent le [Design System Neumorphic](DESIGN_SYSTEM.md) :
- Fond blanc avec ombres neumorphic
- Transitions fluides
- États hover/active/pressed
- Support dark mode

## ⚡ Optimisations

Tous les composants sont optimisés avec :
- ✅ **useMemo** pour les calculs coûteux
- ✅ **useCallback** pour les handlers d'événements
- ✅ **Réduction des re-renders** inutiles
- ✅ **Support du mode désactivé**
- ✅ **Accessibilité** (ARIA labels, keyboard navigation)
- ✅ **Validation des paramètres** (clamp min/max)
- ✅ **TypeScript strict** avec types complets

## 🔗 Voir aussi

- [Design System](DESIGN_SYSTEM.md) - Guide du design system neumorphic
- [Architecture](ARCHITECTURE.md) - Vue d'ensemble de l'architecture
- [API WebSocket](API.md) - Communication front/back

