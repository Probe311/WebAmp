# Design System Neumorphic - WebAmp

## Vue d'ensemble

Le design système neumorphic de WebAmp utilise un style "soft UI" où les éléments semblent être légèrement embossés ou debossés depuis le fond blanc. Ce style crée une interface moderne, tactile et élégante.

## Principes de base

### Couleurs

- **Fond principal** : `#ffffff` (blanc pur)
- **Fond alternatif** : `#f5f5f5` (gris très clair)
- **Texte principal** : `rgba(0, 0, 0, 0.85)` (noir avec opacité)
- **Texte secondaire** : `rgba(0, 0, 0, 0.7)`
- **Texte atténué** : `rgba(0, 0, 0, 0.5)`

### Ombres Neumorphic

Le style neumorphic utilise des ombres doubles (light et dark) pour créer l'effet 3D :

- **Ombre claire** (haut/gauche) : `rgba(255, 255, 255, 0.9)` à `rgba(255, 255, 255, 1)`
- **Ombre sombre** (bas/droite) : `rgba(0, 0, 0, 0.1)` à `rgba(0, 0, 0, 0.2)`
- **Ombres inset** (pour effet pressed) : combinaison d'ombres claires et sombres vers l'intérieur

### Distances d'ombres

- **Petite** : 4px
- **Moyenne** : 8px
- **Grande** : 12px

### Bordures arrondies

- **Petite** : 8px
- **Moyenne** : 12px
- **Grande** : 16px
- **Ronde** : 50% (pour les éléments circulaires)

## Composants

### Modules/Panels

Les modules principaux utilisent un style neumorphic embossed :

```css
background: #ffffff;
border-radius: 16px;
box-shadow: 
  8px 8px 16px rgba(0, 0, 0, 0.1),
  -8px -8px 16px rgba(255, 255, 255, 0.9),
  inset 0 0 0 1px rgba(255, 255, 255, 0.8);
```

### Knobs (Potentiomètres)

Implémentation : `frontend/src/components/Knob.tsx`

- Variantes visuelles via `variant` (`neutral`, `cream`, `black`, `chrome`, `orange`, `brushed`, `gold`) qui définissent le dégradé de face, l’ombre embossée, la couleur d’indicateur et des ticks.
- `color` (optionnel) force la couleur des ticks actifs, sinon celle du thème.
- Plage par défaut 0–100, course 270° (-135° à 135°). 28 ticks répartis en arc, activés jusqu’à l’angle courant.
- Interaction drag vertical (`ns-resize`), valeur arrondie. Pendant le drag, la valeur peut s’afficher si `showValue` est vrai.
- Accessibilité : `role="slider"`, `aria-valuenow|min|max`, gestion du focus (tabIndex).
- États : ombre embossée, pressé en inset, disabled → opacité + blocage des événements.
- Tailles (`size`) : `sm` 48x48px (tick radius 32), `md` 64x64px (42), `lg` 96x96px (60).

### Sliders

Implémentation : `frontend/src/components/Slider.tsx`

- Orientations : vertical par défaut ; horizontal via `orientation="horizontal"`.
- Track : fond `#EBECF0`, double ombre inset neumorphic, coins arrondis.
- Thumb : bloc arrondi embossé, bord 1px de la couleur (`color`, défaut `#3b82f6`), curseur `ns/ew-resize`, hover léger.
- Remplissage : overlay de progression teinté (couleur + alpha 0.2) depuis le bas (vertical) ou la gauche (horizontal).
- Interaction : drag souris/touch avec capture globale, valeur arrondie et clampée entre `min`/`max`, `no-select` pendant le drag.
- Label : uppercase, petit, gris.

### Switches

Implémentation : `frontend/src/components/Switch.tsx`

- Multi-positions, mapping linéaire entre `min` et `max` ; valeur courante affichée à droite (arrondie).
- Conteneur : panel embossé blanc (ombres neumorphic).
- Orientation : `vertical` par défaut (pions empilés), `horizontal` pour les toggles segmentés.
- Track horizontal : fond `#f5f5f5` + ombre inset ; vertical hérite du conteneur.
- Boutons : transitions d’échelle, états actifs :
  - Vertical : fond `rgba(0,0,0,0.2)` + ombre inset (pressed).
  - Horizontal : fond `rgba(0,0,0,0.2)` + ombre embossée.
  - Inactif vertical : fond `#f5f5f5` + petite ombre.
- Pastille verticale : cercle 10px, actif plus sombre avec ombre interne.
- Label : uppercase, `rgba(0,0,0,0.7)`.

### Switch Selector (Contrôles segmentés)

Style neumorphic pour les contrôles segmentés (Fast/Slow/Auto, etc.) :

- Track : fond `#f5f5f5` avec ombres inset
- Boutons : transparents par défaut
- État actif : fond blanc `#ffffff` avec ombres embossed

### Pédales

Les modules de pédales utilisent un style neumorphic tout en conservant les couleurs spécifiques aux marques :

- **Fond** : `#ffffff` (neumorphic)
- **Bordure** : couleur de la marque (via `accentColor`)
- **Texte** : noir avec opacité (au lieu de blanc)
- **Footswitch** : style neumorphic avec couleur d'accent

**Conservation des variables** :
- Les couleurs (`color`, `accentColor`) sont conservées et appliquées via `borderColor`
- Les tailles (`size`) sont conservées selon le système de grille (S, M, L, XL)

### Boutons

Les boutons utilisent un style neumorphic embossed :

```css
background: #ffffff;
box-shadow: 
  2px 2px 4px rgba(0, 0, 0, 0.08),
  -2px -2px 4px rgba(255, 255, 255, 0.9);
```

Au hover :
```css
box-shadow: 
  3px 3px 6px rgba(0, 0, 0, 0.1),
  -3px -3px 6px rgba(255, 255, 255, 1);
```

### Champs de saisie

Les inputs utilisent un style neumorphic inset :

```css
background: #ffffff;
box-shadow: 
  inset 2px 2px 4px rgba(0, 0, 0, 0.05),
  inset -2px -2px 4px rgba(255, 255, 255, 0.8);
```

## États interactifs

### Hover
- Légère augmentation des ombres
- Légère transformation (scale ou translateY)

### Active/Pressed
- Ombres inversées (inset) pour effet debossed
- Légère réduction de taille (scale 0.95-0.98)

### Focus
- Outline discret avec ombre
- Augmentation légère des ombres

## Typographie

- **Famille** : 'Inter', system-ui, sans-serif
- **Poids** : 400 (normal), 600 (medium), 700 (bold)
- **Transformation** : uppercase pour les labels
- **Letter-spacing** : 0.5px pour les labels

## Espacements

- **XS** : 0.25rem (4px)
- **SM** : 0.5rem (8px)
- **MD** : 0.75rem (12px)
- **LG** : 1rem (16px)
- **XL** : 1.5rem (24px)

## Transitions

- **Rapide** : 0.1s ease
- **Normale** : 0.2s ease
- **Lente** : 0.3s ease

## Fichiers du design système

- `frontend/src/styles/neumorphic-design-system.css` : Variables et classes utilitaires
- `frontend/src/index.css` : Styles globaux
- `frontend/src/App.css` : Layout principal
- Composants individuels : Chaque composant a son propre fichier CSS avec styles neumorphic

## Personnalisation par marque/pédale

Les couleurs et tailles spécifiques aux pédales sont conservées via :

1. **Props du composant Pedal** :
   - `color` : couleur de fond (maintenant blanc avec style neumorphic)
   - `accentColor` : couleur de bordure et accents
   - `size` : taille selon grille (S, M, L, XL)

2. **Props des contrôles** :
   - `color` : couleur d'accent pour les knobs, switches, etc.
   - `size` : taille pour les knobs (small, medium, large)

Ces variables sont appliquées via les styles inline dans les composants React, préservant ainsi la personnalisation tout en utilisant le style neumorphic de base.

## Cohérence avec l'image de référence

Le design système a été créé pour correspondre à l'interface de référence montrant :
- Modules blancs avec coins arrondis
- Effet neumorphic (embossed/debossed)
- Knobs blancs avec indicateurs noirs
- Sliders avec handles gris foncés
- Toggle switches horizontaux (ADV)
- Contrôles segmentés (Fast/Slow/Auto)
- Graphiques EQ avec lignes colorées

Tous les composants ont été mis à jour pour refléter ce style tout en conservant la flexibilité pour les personnalisations par marque.

