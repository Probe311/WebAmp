# Design System Neumorphic - WebAmp

## Vue d'ensemble

Le design système neumorphic de WebAmp utilise un style "soft UI" où les éléments semblent être légèrement embossés ou debossés depuis le fond blanc. Ce style crée une interface moderne, tactile et élégante.

## Principes de base

### Couleurs

#### Mode clair
- **Fond principal** : `#ffffff` (blanc pur)
- **Fond alternatif** : `#f5f5f5` (gris très clair)
- **Texte principal** : `rgba(0, 0, 0, 0.85)` (noir avec opacité) / `text-black/85`
- **Texte secondaire** : `rgba(0, 0, 0, 0.7)` / `text-black/70`
- **Texte atténué** : `rgba(0, 0, 0, 0.5)` / `text-black/50`

#### Mode sombre
- **Fond principal** : `dark:bg-gray-700` (`#374151`)
- **Fond alternatif** : `dark:bg-gray-600` (`#4b5563`)
- **Fond panels/modals** : `dark:bg-gray-800` (`#1f2937`)
- **Texte principal** : `dark:text-white/90`
- **Texte secondaire** : `dark:text-white/70`
- **Texte atténué** : `dark:text-white/50`

#### Couleurs d'accent IA
- **Couleur secondaire IA** : `#d23cfb` (magenta/violet)
- **Couleur complémentaire IA** : `#fb923c` (orange)
- **Dégradé IA standard** : `from-[#d23cfb] to-[#fb923c]` (magenta vers orange)
- **Dégradé IA hover** : `from-[#c02ae8] to-[#f07a2a]` (versions plus foncées)
- **Usage** : Boutons et éléments IA (AI Tone Assistant, AI Beat Architect)

### Ombres Neumorphic

Le style neumorphic utilise des ombres doubles (light et dark) pour créer l'effet 3D :

#### Mode clair
- **Ombre claire** (haut/gauche) : `rgba(255, 255, 255, 0.9)` à `rgba(255, 255, 255, 1)`
- **Ombre sombre** (bas/droite) : `rgba(0, 0, 0, 0.08)` à `rgba(0, 0, 0, 0.12)`
- **Ombres inset** (pour effet pressed) : combinaison d'ombres claires et sombres vers l'intérieur

#### Mode sombre
- **Ombre claire** (haut/gauche) : `rgba(60, 60, 60, 0.5)` à `rgba(70, 70, 70, 0.6)`
- **Ombre sombre** (bas/droite) : `rgba(0, 0, 0, 0.5)` à `rgba(0, 0, 0, 0.6)`
- **Ombres inset** : `inset 2px 2px 4px rgba(0, 0, 0, 0.5), inset -2px -2px 4px rgba(60, 60, 60, 0.5)`

**Règle importante** : Toutes les ombres dark mode doivent utiliser `rgba(60, 60, 60, 0.5)` pour les ombres claires et `rgba(0, 0, 0, 0.5)` pour les ombres sombres. Pour les hover, utiliser `rgba(70, 70, 70, 0.6)` et `rgba(0, 0, 0, 0.6)`.

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

### Dropdown

Implémentation : `frontend/src/components/Dropdown.tsx`

- Fond : `bg-white` / `dark:bg-gray-700`
- Ombres neumorphic standard
- Texte : `text-sm font-medium`
- Min height : `44px` (touch target)
- Menu déroulant : ombres plus prononcées avec bordure inset `rgba(60, 60, 60, 0.8)` en dark mode

### Accordion

Implémentation : `frontend/src/components/Accordion.tsx`

- Fond : `bg-white` / `dark:bg-gray-700`
- Titre : `text-sm font-medium`
- Ombres neumorphic standard
- État ouvert : ombres inset
- Min height bouton : `44px`

### Modal

Implémentation : `frontend/src/components/Modal.tsx`

- Fond : `bg-white` / `dark:bg-gray-800`
- Ombres :
  - Mode clair : `8px 8px 16px rgba(0, 0, 0, 0.1), -8px -8px 16px rgba(255, 255, 255, 0.9), inset 0 0 0 1px rgba(255, 255, 255, 0.8)`
  - Mode sombre : `8px 8px 16px rgba(0, 0, 0, 0.5), -8px -8px 16px rgba(60, 60, 60, 0.5), inset 0 0 0 1px rgba(60, 60, 60, 0.8)`
- Bouton fermer : style CTA avec min 44x44px

### Indicateur de force de mot de passe

Implémentation : `frontend/src/auth/components/PasswordStrengthMeter.tsx`

- Track : `bg-[#EBECF0]` / `dark:bg-gray-600`
- Ombres inset neumorphic
- Barre de progression : couleur selon score (rouge < 70, orange 70-79, jaune 80-89, vert > 90)
- Labels : `text-xs font-semibold uppercase` avec support dark mode

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

### Boutons (CTA)

Implémentation : `frontend/src/components/CTA.tsx`

**IMPORTANT** : Tous les boutons doivent utiliser le composant `CTA` au lieu de créer des boutons custom.

#### Variantes
- `variant="primary"` : Bouton principal (défaut)
- `variant="secondary"` : Bouton secondaire avec fond `#f5f5f5` / `dark:bg-gray-600`
- `variant="icon-only"` : Bouton avec icône uniquement (min 44x44px)
- `active={true}` : État actif avec ombres inset

#### Couleur secondaire IA
- **Couleur** : `#d23cfb` (magenta/violet)
- **Usage** : Boutons et éléments liés aux fonctionnalités IA
- **Dégradé standard** : `from-[#d23cfb] to-[#fb923c]` (magenta vers orange)
- **Dégradé hover** : `from-[#c02ae8] to-[#f07a2a]` (versions plus foncées)

#### Styles

**Mode clair** :
```css
background: #ffffff;
box-shadow: 
  2px 2px 4px rgba(0, 0, 0, 0.08),
  -2px -2px 4px rgba(255, 255, 255, 0.9);
border: 2px solid rgba(0, 0, 0, 0.15);
```

**Mode sombre** :
```css
background: #374151; /* gray-700 */
box-shadow: 
  2px 2px 4px rgba(0, 0, 0, 0.5),
  -2px -2px 4px rgba(60, 60, 60, 0.5);
border: 2px solid rgba(255, 255, 255, 0.15);
```

**Hover** :
- Mode clair : `3px 3px 6px rgba(0, 0, 0, 0.12), -3px -3px 6px rgba(255, 255, 255, 1)`
- Mode sombre : `3px 3px 6px rgba(0, 0, 0, 0.6), -3px -3px 6px rgba(70, 70, 70, 0.6)`
- Transform : `translateY(-2px)`

**Active** :
- Scale : `0.95`
- Ombres inset selon le mode

**État actif** (`active={true}`) :
- Fond : `rgba(0, 0, 0, 0.08)` / `dark:bg-white/10`
- Bordure : `rgba(0, 0, 0, 0.3)` / `dark:border-white/30`
- Ombres inset

### Champs de saisie (Inputs)

Implémentation : `frontend/src/auth/components/AuthField.tsx`

**IMPORTANT** : Tous les champs de saisie doivent utiliser le composant `AuthField` pour la cohérence.

#### Styles

**Mode clair** :
```css
background: #ffffff;
box-shadow: 
  inset 2px 2px 4px rgba(0, 0, 0, 0.05),
  inset -2px -2px 4px rgba(255, 255, 255, 0.8);
color: rgba(0, 0, 0, 0.85);
border-radius: 12px;
padding: 12px 16px;
font-size: 14px;
```

**Mode sombre** :
```css
background: #374151; /* gray-700 */
box-shadow: 
  inset 2px 2px 4px rgba(0, 0, 0, 0.5),
  inset -2px -2px 4px rgba(60, 60, 60, 0.5);
color: rgba(255, 255, 255, 0.9);
```

**Focus** :
- Mode clair : `inset 3px 3px 6px rgba(0, 0, 0, 0.07), inset -3px -3px 6px rgba(255, 255, 255, 1)`
- Mode sombre : `inset 3px 3px 6px rgba(0, 0, 0, 0.6), inset -3px -3px 6px rgba(70, 70, 70, 0.6)`

**Erreur** :
- Bordure : `0 0 0 2px rgba(239, 68, 68, 0.3)`
- Texte d'erreur : `text-red-500` / `dark:text-red-400`

#### Labels
- Style : `text-xs font-semibold uppercase tracking-wider`
- Couleur : `text-black/70` / `dark:text-white/70`
- Letter-spacing : `0.5px`

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

## Règles de développement

### Utilisation des composants

1. **Boutons** : Toujours utiliser `CTA` au lieu de créer des boutons custom
2. **Champs de saisie** : Toujours utiliser `AuthField` pour les formulaires
3. **Dropdowns** : Utiliser le composant `Dropdown` avec les options appropriées
4. **Modals** : Utiliser le composant `Modal` avec les props standardisées

### Dark Mode

1. **Ombres** : Toujours utiliser les valeurs standardisées :
   - Normales : `rgba(60, 60, 60, 0.5)` et `rgba(0, 0, 0, 0.5)`
   - Hover : `rgba(70, 70, 70, 0.6)` et `rgba(0, 0, 0, 0.6)`
   - Inset : `inset 2px 2px 4px rgba(0, 0, 0, 0.5), inset -2px -2px 4px rgba(60, 60, 60, 0.5)`

2. **Couleurs de fond** :
   - Panels principaux : `dark:bg-gray-700`
   - Modals : `dark:bg-gray-800`
   - Boutons secondaires : `dark:bg-gray-600`

3. **Couleurs de texte** :
   - Principal : `dark:text-white/90`
   - Secondaire : `dark:text-white/70`
   - Atténué : `dark:text-white/50`

### Accessibilité

- Tous les éléments interactifs doivent avoir une taille minimale de 44x44px (touch target)
- Utiliser `touch-manipulation` pour améliorer les interactions tactiles
- Les labels doivent être associés correctement aux inputs
- Utiliser les attributs ARIA appropriés (role, aria-label, etc.)

### Performance

- Utiliser `transition-all duration-200` pour les transitions
- Éviter les animations complexes sur les éléments fréquemment mis à jour
- Utiliser `will-change` avec parcimonie

## Navigation

### Bottom Navigation

Implémentation : `frontend/src/components/BottomNavigation.tsx`

- Position : Fixe en bas de l'écran, centrée horizontalement avec `bottom-6 left-1/2 -translate-x-1/2`
- Style : Conteneur neumorphic avec ombres doubles, arrondi `rounded-3xl`
- Icônes : Taille 24px, strokeWidth 2 (normal) ou 2.5 (actif)
- État actif :
  - Fond orange `bg-orange-500`
  - Ombre avec glow : `shadow-[0_0_20px_rgba(245,158,11,0.5)]`
  - Translation vers le haut : `translate-y-[-4px]`
- Labels : Affichés uniquement au hover ou quand actif, position absolue en bas (`-bottom-4`)
- Pages disponibles : Home, WebAmp, Looper, Practice, Learn, Mixing, DrumMachine, Settings, Account

### Layout des pages

Toutes les pages utilisent un layout uniforme :

- **Padding** : `p-6` (24px) sur tous les côtés
- **Padding bas** : `pb-32` (128px) pour laisser de l'espace à la navigation
- **Largeur maximale** : `max-w-7xl mx-auto` pour tous les conteneurs
- **Layout Bento** : Grille flexible avec `grid` et `gap-4` pour l'espacement entre les cartes

## Composants audio

### Tuner

Implémentation : `frontend/src/components/Tuner.tsx`

- Affichage principal : Cercle de 192px (w-48 h-48) avec bordure 4px
- Note : Texte 7xl (72px) en gras, centré
- Indicateur de cent : Barre horizontale avec zone verte centrale (20% de largeur)
- Couleurs selon précision :
  - Vert : < 5 cents (accordé)
  - Jaune : 5-20 cents
  - Rouge : > 20 cents
- Dropdown pour sélection de l'accordage en haut

### Métronome

Implémentation : `frontend/src/components/Metronome.tsx`

- Affichage BPM : Texte 8xl (96px) en gras
- Contrôles BPM :
  - Boutons +/- avec chevrons (w-12 h-12)
  - Slider horizontal (w-64)
- Indicateurs de beat : Barres verticales (w-3 h-12) qui s'illuminent en orange
- Contrôles de transport : Bouton Play/Pause circulaire (w-20 h-20), bouton Stop
- Informations : Signature rythmique et beat actuel affichés en bas

### Table de mixage audio

Implémentation : `frontend/src/components/mixing/AudioMixingTable.tsx`

- Layout : Grille avec colonnes pour chaque piste + colonne master
- Chaque piste contient :
  - Nom de la piste avec indicateur de couleur
  - Boutons Mute (M) et Solo (S) compacts
  - Fader vertical pour le volume (min-h-[200px])
  - Knob pour le pan (size="sm")
  - Vu-mètre vertical (h-20) avec code couleur
- Colonne Master :
  - Contrôles similaires aux pistes
  - Bouton Mute master
  - Fader vertical pour le volume master
  - Vu-mètre master
- En-tête Master :
  - Contrôles master avec slider horizontal
  - Bouton Monitor
- États des boutons :
  - Mute actif : `bg-red-500` avec ombre inset
  - Solo actif : `bg-yellow-500` avec ombre inset
  - Inactif : Style neumorphic standard

## Uniformisation des conteneurs

### Largeurs et marges

Toutes les pages suivent les mêmes règles :

- **Padding de page** : `p-6` (24px)
- **Padding bas** : `pb-32` (128px) pour laisser de l'espace à la navigation
- **Largeur maximale** : `max-w-7xl` (1280px) avec `mx-auto` pour centrer
- **Espacement entre cartes** : `gap-4` (16px) dans les grilles

### Layout Bento

Les pages utilisent un système de grille flexible :

- **Grille principale** : `grid grid-cols-1 lg:grid-cols-12` pour les layouts complexes
- **Cartes** : Style neumorphic standard avec `rounded-2xl`
- **Responsive** : Adaptation automatique selon la taille d'écran

