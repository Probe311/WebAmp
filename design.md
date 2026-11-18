# Tactile Neumorphic Design System — Spécification de Design (`design.md`)

Ce document formalise les fondations visuelles, les jetons de conception (*design tokens*), les règles d'élévation, la typographie, l'architecture des composants et les standards d'interaction du **Tactile Neumorphic Design System**.

---

## 1. Philosophie & Principes Directeurs

Le système repose sur un **neumorphisme tactile clair et précis**, pensé à la fois pour les interfaces applicatives modernes et le contrôle matériel audio/studio :

1. **Matière unifiée & relief par la lumière** : Les composants émergent ou s'encastrent directement dans la surface de base (`#e4ebf5`) grâce à une double source de lumière (haut-gauche claire, bas-droite ombrée), sans bordures dures ni contrastes agressifs.
2. **Hiérarchie tactile claire** :
   - **Extrudé (`.neu-flat`, `.neu-convex`)** : Éléments interactifs au repos, cartes, boutons, potentiomètres, touches.
   - **Encastré (`.neu-inset`, `.neu-pressed`)** : Champs de saisie, pistes de sliders/faders, puits de VU-mètres, écrans d'analyse, états actifs enfoncés.
3. **Discipline géométrique stricte** :
   - **`rounded-full` (Pill)** obligatoire pour tous les CTA, boutons d'action, badges, tags et contrôles segmentés.
   - **`rounded-3xl` (`24px`)** pour les cartes, conteneurs de modules studio, modales et docks flottants.
4. **Signal chromatique maîtrisé** : Une toile monochrome bleu-gris froid (`#e4ebf5`) ponctuée d'un unique accent énergétique **Orange Studio (`#F26A1B`)** réservé aux actions primaires, témoins LED actifs, aiguilles de mesure et états sélectionnés.

---

## 2. Stack Technique & Architecture

- **Framework** : React 19 + TypeScript strict (`tsc --noEmit`)
- **Build & Dev** : Vite (`@vitejs/plugin-react`)
- **Styling** : Tailwind CSS v4 (`@tailwindcss/vite`, `@import "tailwindcss";` + `@theme`)
- **Iconographie** : `lucide-react`
- **Animations** : `motion` + transitions CSS matérielles
- **Métrologie Audio** : `vu-meter-react` + moteur Web Audio / simulateur `useAudioSimulator`
- **Double distribution synchronisée** :
  - **Modulaire** : `src/components/{audio,forms,navigation,feedback,content,utilities}/*` réexportés via `src/components/index.ts`.
  - **Unifiée (Single-file)** : `src/NeumorphicDesignSystem.tsx` exportant `NEU_TOKENS`, les 71 composants unitaires, le hook `useAudioSimulator` et l'ensemble des types/interfaces TypeScript (172 symboles exportés).

---

## 3. Fondations Visuelles & Design Tokens

### 3.1 Palette Chromatique

Les jetons programmatiques sont exposés via `NEU_TOKENS` et les variables CSS de `src/index.css` :

| Rôle | Token / Variable | Valeur | Usage |
| :--- | :--- | :--- | :--- |
| **Surface principale** | `--neu-bg` / `--color-surface` | `#e4ebf5` | Fond de page, surface de base des cartes et boutons |
| **Surface encastrée (well)** | `.neu-inset` | `#e0e7f1` | Champs de saisie, pistes de sliders, zones creusées |
| **Surface enfoncée (active)** | `.neu-pressed` | `#dfe6f0` | État pressé, onglet actif encastré |
| **Piste / Scrollbar track** | — | `#dbe4ef` | Glissières encastrées et rails de défilement |
| **Accent primaire** | `--color-accent` | `#F26A1B` | CTA primaires, LEDs actives, curseurs, anneaux de focus |
| **Accent survol** | `--color-accent-hover` | `#E05A0D` | Hover des actions primaires |
| **Dégradé Accent CTA** | `.neu-accent-btn` | `#ff7a2b` → `#e25a0e` | Boutons primaires en relief à 145° |
| **Danger / Clipping** | `--color-danger` | `#E11D48` | Actions destructives, erreurs, crêtes audio `+dB` |
| **Texte principal** | `NEU_TOKENS.colors.textMain` | `#1e293b` (`slate-800` / `slate-700`) | Titres, libellés principaux, valeurs numériques |
| **Texte secondaire** | `NEU_TOKENS.colors.textMuted` | `#64748b` (`slate-500`) | Sous-titres, descriptions, graduations techniques |
| **Ombre foncée** | `--neu-shadow-dark` | `rgba(163, 177, 198, 0.65)` | Ombre portée bas-droite |
| **Lumière haute** | `--neu-shadow-light` | `rgba(255, 255, 255, 0.92)` | Reflet spéculaire haut-gauche |

> **Règle d'isolation visuelle** : Aucune palette sombre/néon ou skeuomorphique héritée (`#00F5D4`, `#9FA3A8`, `.skeuo-*`) ne doit coexister avec le thème `#e4ebf5`.

---

### 3.2 Élévations & Classes Utilitaires Neumorphiques

Toutes les élévations utilisent une lumière directionnelle à **145°** (haut-gauche vers bas-droite) :

| Classe CSS | Effet visuel | Définition (`box-shadow` & `background`) |
| :--- | :--- | :--- |
| `.neu-flat` | Relief standard | Fond `#e4ebf5` · `6px 6px 14px rgba(163,177,198,0.65), -6px -6px 14px rgba(255,255,255,0.92)` |
| `.neu-flat-sm` | Micro-relief | Fond `#e4ebf5` · `3px 3px 7px rgba(163,177,198,0.6), -3px -3px 7px rgba(255,255,255,0.9)` |
| `.neu-flat-lg` | Grand relief (modales, cartes maîtresses) | Fond `#e4ebf5` · `10px 10px 24px rgba(163,177,198,0.7), -10px -10px 24px rgba(255,255,255,0.95)` |
| `.neu-convex` | Surface bombée tactile (boutons ronds, caps) | Dégradé `145deg, #f0f5fc, #d8e0ec` · ombre `.neu-flat` |
| `.neu-inset` | Cavité / encastrement | Fond `#e0e7f1` · `inset 4px 4px 9px rgba(163,177,198,0.68), inset -4px -4px 9px rgba(255,255,255,0.9)` |
| `.neu-pressed` | État pressé / verrouillé | Fond `#dfe6f0` · `inset 3px 3px 7px rgba(155,170,192,0.72), inset -3px -3px 7px rgba(255,255,255,0.92)` |
| `.neu-accent-btn` | Bouton primaire orange | Dégradé `145deg, #ff7a2b, #e25a0e`, texte `#ffffff`, ombre orange diffusée + reflet interne ; s'inverse en `inset` sur `:active` |

---

### 3.3 Typographie

Trois familles Google Fonts configurées dans `index.html` et mappées via `@theme` :

| Token | Famille | Usage |
| :--- | :--- | :--- |
| `--font-sans` | **DM Sans** (`400`–`700`) | Corps de texte, libellés de formulaires, navigation, descriptions |
| `--font-display` | **Plus Jakarta Sans** (`500`–`800`) | Titres de sections, en-têtes de cartes, branding |
| `--font-mono` | **JetBrains Mono** (`400`, `600`, `700`) | Valeurs dBFS/VU, fréquences Hz, timecodes `MM:SS:FF`, BPM, code inspecteur |

**Règles typographiques** :
- Les lectures numériques temps réel (dB, BPM, timecode, potentiomètres) utilisent systématiquement `font-mono tabular-nums` afin d'éviter tout saut de mise en page lors des animations.
- Les micro-labels matériels (canaux, contrôles studio) adoptent une casse majuscule espacée (`text-[10px]` à `text-xs`, `tracking-wider` / `tracking-widest`, `font-semibold`).

---

### 3.4 Rayons de Courbure & Espacements

- **Conteneurs & Cartes** : `rounded-3xl` (`24px`) — valeur `NEU_TOKENS.radii.card`.
- **Panneaux secondaires / Fenêtres internes** : `rounded-2xl` (`16px`).
- **Boutons, CTA, Badges, Tags, Inputs Pill, Segmented** : `rounded-full` — valeur `NEU_TOKENS.radii.cta`.
- **Pads & Touches matérielles** : `rounded-xl` (`12px`) avec dépressions internes.
- **Respiration des ombres** : Tout élément portant `.neu-flat` ou `.neu-flat-lg` nécessite une marge/padding parent suffisant (`>= 12px` à `24px`) pour ne jamais couper les ombres externes contre un `overflow-hidden`.

---

## 4. Catalogue Complet des Composants (71 Composants + 1 Hook)

### 4.1 Audio & Studio de Musique (19 composants + 1 hook)

Conçus pour le routage, la synthèse, le mixage et la métrologie temps réel avec support tactile/souris (drag vertical/horizontal, molette, clic, audio Web Audio API optionnel).

| Composant | Rôle & Variantes principales |
| :--- | :--- |
| **`Potentiometer`** | Encodeur rotatif tactile (`size`: `'s' \| 'm' \| 'l'`), mode unipolaire ou `bipolar`, graduations radiales, lecture numérique + unité (`dB`, `Hz`, `%`). |
| **`VuMeter`** *(alias `VUMeter`, `UvMeter`)* | VU-mètre analogique calibré (`0 VU = -18 dBFS`), basé sur `vu-meter-react` et adapté neumorphisme (`theme`: `'neumorphic' \| 'dark' \| 'light'`), support stéréo/mono, Web Audio (`audioContext`/`sourceNode`) ou pilotage par angle/valeur, LED Peak Hold. |
| **`AudioLevelIndicator`** | Bargraphe de niveau stéréo ou mono (`isStereo`), 4 variantes visuelles (`'wide-pills' \| 'rounded-squares' \| 'dual-pills' \| 'standard'`), modes `'leds' \| 'fluid'`, maintien de crête (`peakHold`, `leftPeakHold`, `rightPeakHold`) et affichage dB. |
| **`TransportDeck`** | Console de transport complète : Play/Pause, Stop, Rewind, Forward, Record (armement rouge/orange), Loop, afficheur OLED/encastré timecode + BPM. |
| **`Power`** | Interrupteur d'alimentation studio (`variant`: `'button' \| 'rocker'`, `size`: `'s' \| 'm' \| 'l'`) avec témoin LED actif et statut. |
| **`JogWheel`** | Molette de scrubbing infinie haute précision (`size`: `'s' \| 'm' \| 'l'`, sensibilité configurable, lecture delta/position). |
| **`AudioGrid`** | Double usage (`variant`: `'speaker' \| 'pads'`) : grille acoustique perforée réactive au niveau (`'matrix' \| 'radial'`) ou matrice de pads déclenchables (`onPadTrigger`). |
| **`ChannelFader`** | Tranche de console verticale avec curseur linéaire à course fluide, panoramique (`pan`), boutons `M` (Mute), `S` (Solo), `R` (Arm), numéro de piste et bargraphe intégré. |
| **`Crossfader`** | Crossfader DJ horizontal A/B avec sélecteur de courbe (`'linear' \| 'smooth' \| 'cut'`). |
| **`WaveformDisplay`** | Visualiseur de forme d'onde interactif avec tête de lecture, scrubbing au clic (`onSeek`), boucle (`loopEnabled`) et durée. |
| **`StepSequencer`** | Séquenceur rythmique multipiste 16 pas synchronisé au `bpm`, déclenchement par cellule et tête de lecture animée. |
| **`SpectrumAnalyzer`** | Analyseur spectral RTA temps réel ou égaliseur graphique interactif (`mode`: `'rta' \| 'eq'`, bandes `EqBand` ajustables). |
| **`PianoKeyboard`** | Clavier maître multi-octaves tactile avec notes noires/blanches en relief, callback MIDI (`onNoteOn`/`onNoteOff`) et synthèse Web Audio intégrée (`enableSound`). |
| **`Oscilloscope`** | Moniteur de signal temps réel (`mode`: `'scope' \| 'phase'`), formes d'onde `'live' \| 'sine' \| 'saw' \| 'square'`. |
| **`TempoTap`** | Détecteur de BPM par Tap Tempo avec indicateur rythmique lumineux et sélecteur de signature (`'4/4' \| '3/4' \| '6/8' \| '7/8'`). |
| **`MonitorController`** | Contrôleur de monitoring studio (sélection de sources/enceintes, Dim, Mono, Mute, grand potentiomètre de volume). |
| **`AdsrEnvelope`** | Éditeur graphique d'enveloppe Attack / Decay / Sustain / Release manipulable par points et curseurs. |
| **`XYPad`** | Pavé tactile bidimensionnel (`x`, `y` normalisés) avec option de rappel au centre (`snapCenter`) pour modulation de filtres ou effets. |
| **`PatchMatrix`** | Matrice de routage modulaire entrées/sorties par broches lumineuses activables. |
| **`useAudioSimulator`** | Hook générant un flux audio réaliste (RMS, Peak, Peak Hold L/R, dBFS, angle VU et contrôle de gain/lecture) pour animer les instruments sans source externe. |

---

### 4.2 Formulaires & Saisies (13 composants)

| Composant | Spécificités & États |
| :--- | :--- |
| **`Button`** | Forme Pill (`rounded-full`). Variantes : `'primary'`, `'neutral'`, `'pressed'`, `'ghost'`, `'danger'`. Tailles : `'sm' \| 'md' \| 'lg'`. Support icône gauche/droite et état `isLoading`. |
| **`Input`** | Champ encastré (`.neu-inset`), mode `pill`, label, icône positionnable, `helperText` et état d'erreur visuel. |
| **`Password`** | Champ mot de passe avec bascule visibilité (`Eye` / `EyeOff`) et indicateur de sécurité. |
| **`Search`** | Barre de recherche Pill avec icône loupe et bouton de réinitialisation rapide (`showClear`). |
| **`Checkbox`** | Case à cocher tactile encastrée avec coche orange `#F26A1B`, libellé et description. |
| **`Radio`** | Groupe de boutons radio circulaires en relief/enfoncé avec pastille centrale lumineuse. |
| **`Toggle`** | Interrupteur glissant (`size`: `'sm' \| 'md' \| 'lg'`) sur rail encastré avec pastille convexe. |
| **`Range`** | Curseur horizontal continu avec piste remplie `#F26A1B`, poignée convexe et affichage d'unité. |
| **`Segmented`** | Sélecteur multi-options générique (`<T extends string>`) à capsule glissante (`size`: `'sm' \| 'md'`). |
| **`Select`** | Menu déroulant neumorphique personnalisé avec support d'icônes et options désactivées. |
| **`Combobox`** | Sélecteur filtrable avec recherche intégrée, regroupement par `category` et navigation clavier. |
| **`Upload`** | Zone de dépôt (*drag & drop*) encastrée avec contrôle de formats (`accept`), multi-fichiers et limite `maxSizeMb`. |
| **`Form`** | Conteneur de formulaire structuré assemblant `Input`, `Checkbox` et `Button`. |

---

### 4.3 Navigation & En-têtes (14 composants)

| Composant | Spécificités & États |
| :--- | :--- |
| **`Navigation`** | Barre de navigation horizontale avec item actif en relief ou encastré. |
| **`Header`** | En-tête complet avec identité, liens de navigation et CTA Pill (`Button`). |
| **`HeaderUser`** | En-tête de session affichant profil utilisateur, rôle, avatar et badge de notifications (`unreadCount`). |
| **`Breadcrumb`** | Fil d'Ariane épuré avec séparateurs chevrons et état courant accentué. |
| **`Pagination`** | Contrôle de pagination tactile avec boutons précédent/suivant et pages actives. |
| **`Stepper`** | Indicateur de progression multi-étapes interactif avec validation séquentielle. |
| **`Tab`** | Onglets principaux avec badges compteurs et icônes. |
| **`Tabnav`** | Barre d'onglets secondaire compacte avec compteurs intégrés. |
| **`Sidemenu`** | Menu latéral structuré en sections (`SidemenuSection`) avec badges et icônes. |
| **`Skiplink`** | Liens d'évitement accessibles (clavier / lecteurs d'écran) pour accès rapide au contenu. |
| **`Summary`** | Sommaire ancré hiérarchique (`level: 1 \| 2`) avec suivi de section active. |
| **`Translate`** | Sélecteur de langue avec drapeaux et menu déroulant. |
| **`NotchBar`** | Barre supérieure flottante inspirée Dynamic Island / Notch (`variant`: `'neumorphic' \| 'dark'`, `position`: `'top' \| 'relative'`, contrôles optionnels). |
| **`BottomDock`** | Dock inférieur flottant `rounded-3xl` avec icônes tactiles, badges et mise en avant de l'item actif. |

---

### 4.4 Feedback & Alertes (11 composants)

| Composant | Spécificités & États |
| :--- | :--- |
| **`Accordion`** | Panneaux dépliables (`allowMultiple`) à ouverture fluide. |
| **`Alert`** | Bandeau d'alerte (`'info' \| 'success' \| 'warning' \| 'error'`) avec fermeture optionnelle. |
| **`Notice`** | Notification persistante avec bouton d'action CTA et bouton de fermeture. |
| **`Badge`** | Pastille `rounded-full` (`'neutral' \| 'accent' \| 'success' \| 'warning' \| 'danger'`, `size`: `'sm' \| 'md'`, point lumineux `dot`). |
| **`Tag`** | Étiquette interactive `rounded-full` cliquable et supprimable (`onRemove`). |
| **`Callout`** | Bloc de mise en avant encadré avec icône et action dédiée. |
| **`Highlight`** | Carte statistique / métrique clé avec mise en valeur optionnelle (`accent`). |
| **`Tooltip`** | Info-bulle positionnable (`'top' \| 'bottom' \| 'left' \| 'right'`). |
| **`Modal`** | Fenêtre modale `.neu-flat-lg` sur fond adouci, actions Confirmer / Annuler via `Button`. |
| **`Consent`** | Bannière de consentement cookies/confidentialité avec choix Accepter / Refuser / Personnaliser. |
| **`Window`** | Fenêtre studio flottante déplaçable et redimensionnable (`initialWidth`, `initialHeight`, `initialX`, `initialY`). |

---

### 4.5 Médias & Contenu (7 composants)

| Composant | Spécificités & États |
| :--- | :--- |
| **`Card`** | Conteneur `rounded-3xl` à 4 variantes d'élévation (`'raised' \| 'inset' \| 'clay' \| 'flat'`), slot `action` et `footer`. |
| **`Tile`** | Tuile interactive cliquable avec icône, badge et état `active`. |
| **`Quote`** | Citation éditoriale mise en forme avec auteur, rôle et source. |
| **`Content`** | Bloc de présentation média/article avec catégorie et durée. |
| **`Table`** | Tableau générique typé (`<T>`) avec alignement de colonnes et rendu personnalisé. |
| **`Transcription`** | Lecteur de transcription horodatée multi-intervenants (`time`, `speaker`, `text`). |
| **`Logo`** | Emblème de marque configurable (`shape`: `'squircle' \| 'circle' \| 'pill'`, `size`: `'sm' \| 'md' \| 'lg'`). |

---

### 4.6 Utilitaires & Actions (7 composants)

| Composant | Spécificités & États |
| :--- | :--- |
| **`Display`** | Panneau de préférences d'accessibilité visuelle (taille de police `'sm' \| 'md' \| 'lg'` et contraste `'normal' \| 'high'`). |
| **`Download`** | Carte de téléchargement de fichier affichant nom, extension, poids et bouton d'action. |
| **`Dropdown`** | Menu contextuel d'actions (`DropdownAction` avec support `danger` et `disabled`). |
| **`Follow`** | Module d'abonnement / newsletter avec saisie email et validation. |
| **`Footer`** | Pied de page structuré avec marque et mention copyright. |
| **`Link`** | Lien hypertexte stylisé (`variant`: `'inline' \| 'pill' \| 'subtle'`, indicateur externe `isExternal`). |
| **`Share`** | Module de partage rapide avec copie du lien et canaux sociaux. |

---

## 5. Règles d'Accessibilité, d'Interaction & de Qualité

1. **États interactifs complets** : Chaque contrôle cliquable distingue visuellement le repos (`.neu-flat`), le survol (légère élévation/luminosité), la pression (`.neu-pressed` / `.neu-inset`), le focus clavier (anneau `#F26A1B`) et l'état désactivé (`opacity-50 pointer-events-none`).
2. **Contraste & lisibilité** : Le texte principal sur `#e4ebf5` utilise `#1e293b` / `#334155` (ratio supérieur au seuil WCAG AA pour les textes courants) et les labels blancs sur `#F26A1B` exploitent un dégradé foncé à `#e25a0e`.
3. **Ergonomie studio** : Les contrôles rotatifs (`Potentiometer`, `JogWheel`), linéaires (`ChannelFader`, `Crossfader`, `Range`) et plans (`XYPad`, `AdsrEnvelope`) supportent les événements pointeur unifiés (`PointerEvent` souris + tactile) et le verrouillage fluide pendant le glisser.
4. **Synchronisation modulaire / monofichier** : Toute évolution d'un composant dans `src/components/` doit être reflétée à l'identique dans `src/NeumorphicDesignSystem.tsx` afin de garantir la parité à 100 %.
