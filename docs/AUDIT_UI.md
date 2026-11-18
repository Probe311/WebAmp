# Audit UI/UX — état réel avant refonte Desktop

Document de référence du Lot 0. Toutes les valeurs sont mesurées sur le dépôt
`App/frontend` ; rien n'y est estimé.

## 1. Périmètre

Le dépôt contient deux applications distinctes :

| Dossier | Rôle | Stack |
|---|---|---|
| `App/` | produit (`frontend`, `native`, `supabase`) | React 18, TS 5.2, Vite 5, Tailwind 3.4 |
| `Site/` | landing marketing | React 19, Tailwind v4 |

Les chemins `frontend/src/...` de la spec correspondent à `App/frontend/src/...`.
Le dossier `shared/` décrit dans le README n'existe pas : le protocole WebSocket
est défini dans `src/services/websocket.ts`.

## 2. Shell desktop : ce qui existe

- `src/workspace/types.ts` — `AppId` (11 modules), `WindowPlacement` =
  `full | half(edge) | quarter(corner)`, `MAX_WINDOWS = 4`,
  clé `webamp-workspace-v1`.
- `src/workspace/layoutMath.ts` — logique pure de snap, 9 tests unitaires.
- `src/workspace/WorkspaceContext.tsx` (250 l.) — état des fenêtres, persistance
  localStorage à chaque changement (sans debounce, sans validation du JSON relu).
- `src/components/shell/` — `WindowGrid` (grille CSS `1fr 1fr / 1fr 1fr`),
  `AppWindow` (fenêtre en `grid-area`, drag de titre limité au calcul de snap),
  `AppDock` (+ `components/motion/Dock` pour la magnification), `SnapHost`,
  `SnapOverlay`.
- `src/contexts/ThemeContext.tsx` — `light | dark` uniquement, clé
  `webamp-theme`, pas de suivi `prefers-color-scheme`.

Écart avec la cible : pas de `x/y/w/h`, pas de resize, pas de minimise, pas de
z-index, pas d'instance multiple, pas de navigation clavier de fenêtres, pas de
palette de commandes, un seul workspace implicite.

## 3. Audio et cycle de vie des fenêtres (corrigé au Lot 1)

Constat d'origine :

| Problème | Emplacement |
|---|---|
| `Pedalboard` détenait `effects` en `useState` | `Pedalboard.tsx:378` |
| `usePedalboardEngine` créait un `PedalboardEngine` par appel puis `dispose()` au démontage | `hooks/usePedalboardEngine.ts` |
| `PedalboardEngine` n'était pas un singleton (aucun `getInstance`) | `audio/PedalboardEngine.ts` |
| 4 appelants = jusqu'à 4 moteurs/AudioContext | `Pedalboard`, `Tuner`, `Metronome`, `Looper` |
| `App.tsx` entretenait un moteur parallèle (`engineRef`) | `App.tsx` |

Conséquence : `WindowGrid` ne rend que les fenêtres ouvertes ; fermer la fenêtre
WebAmp démontait la chaîne d'effets et détruisait le moteur, donc **coupait le
signal**. La règle « fermer une fenêtre ≠ arrêter l'audio » était impossible.

État après Lot 1 : moteur unique (`audio/audioSession.ts`), état audio porté par
`AudioSessionProvider` au-dessus du workspace, plus aucun `dispose()` sur
démontage. Couvert par `audio/__tests__/audioSession.test.tsx`.

Reste ouvert : `Metronome` et `Looper` gardent un moteur interne lié à leur
montage (`audio/metronome.ts`, `audio/looper.ts`). Leur état ne survit pas encore
à la fermeture de fenêtre — prévu au Lot 4 (migration des modules).

## 4. Modales = futures fenêtres

À convertir en fenêtres ou en panneaux ancrés lors de la migration des modules :

`PedalLibraryModal`, `AmplifierLibraryModal`, `IRUploadModal`, `AuthModal`,
`SettingsPanel`, `EqualizerPanel`, `RoomSimulator`, `Tuner`, `Metronome`,
`Looper`, `KeyboardShortcutsConfig`, `StatsPanel`, `MonitoringPanel`.

## 5. Dette de taille (impact direct sur les fenêtres flottantes)

| Fichier | Lignes |
|---|---|
| `src/pages/AdminPage.tsx` | 2948 |
| `src/pages/MixingConsolePage.tsx` | 757 |
| `src/pages/DawPage.tsx` | 358 |
| `src/pages/LearnPage.tsx` | 302 |
| `src/components/Pedalboard.tsx` | ~1048 |
| `src/App.tsx` | 365 |

Ces modules imposent des tailles minimales de fenêtre : ils ne peuvent pas être
rendus dans un quart d'écran sans régression fonctionnelle. `AdminPage` reste
hors périmètre flottant au premier passage.

## 6. Accessibilité et cohérence visuelle (mesuré)

| Indicateur | Valeur |
|---|---|
| Occurrences `focus-visible` | 3 |
| `aria-label` | 45 |
| `bg-white` codés en dur | 273 |
| `orange-500` / `#f97316` codés en dur | 191 |
| Tokens néomorphiques | 1 fichier de 98 lignes, blancs/gris uniquement |

Ratios de contraste calculés sur les valeurs proposées par la spec (texte
normal = 4,5:1, composant d'interface = 3:1) :

| Combinaison | Ratio | Verdict |
|---|---|---|
| `text-muted #747B89` sur base `#E9EBF0` | 3,57 | échoue → `#5C6373` (5,05) |
| `text-muted` sur inset `#E1E4EB` | 3,34 | échoue → `#5C6373` (4,73) |
| `primary #9255ED` en texte | 3,71 | icône/bordures/grand texte seulement |
| blanc sur `#9255ED` | 4,43 | limite → `--td-primary-strong #7F3FDB` (5,78) |
| `energy #F28A36` en texte | 2,08 | interdit → aplat avec encre `#20232D` (6,32) |
| blanc sur `secondary #E34F9B` | 3,58 | aplat/grand texte seulement |
| `surface-raised` vs `base` (light) | 1,08 | l'élévation seule ne distingue rien |
| dark : texte secondaire sur base | 5,69 → 15,84 | conforme |

Le néomorphisme clair ne peut donc pas porter seul la frontière d'un contrôle :
il faut un token d'arête dédié (`#7B8499` = 3,14 sur base, `#6E7690` = 3,39 en
dark pour les contrôles). Le focus `#9255ED` (3,71) et `#A879FF` (5,73 en dark)
sont valides comme indicateur non-textuel.

## 7. Baseline de build et de tests

- `npm run build` : vert en 8,99 s. Chunk `App` = 1 177,48 kB (304,62 kB gzip),
  plus gros chunk de l'application ; `vendor-icons` 563 kB. Le parse de ce chunk
  sur le thread principal est le premier risque de fluidité du drag de fenêtres.
- `npx tsc --noEmit` : vert (1 erreur corrigée : `DrumSampleSelector` `chinese`).
- `npx vitest run` : 10 suites, 4 en échec — toutes préexistantes et sans lien
  avec le Lot 1 :
  - `audio/__tests__/effects.test.ts` et `audio/__tests__/PedalboardEngine.test.ts`
    : `ReferenceError: AudioContext is not defined` (environnement jsdom, aucun
    AudioContext simulé dans `src/test/setup.ts`) ;
  - `utils/__tests__/profileLoader.test.ts` : `require('../profileMapper')`
    échoue en contexte ESM.
- Baseline perceptuelle (LCP, FPS pendant drag) : **non mesurée**. Elle exige une
  session navigateur avec instrumentation ; à relever avant le Lot 3 pour que
  le gain du window manager soit démontrable.

## 8. Ordre de correction retenu

1. Lot 0 — build et typage verts (fait).
2. Lot 1 — session audio hors du cycle de vie des fenêtres (fait).
3. Lot 2 — tokens sémantiques, thème `system`, primitives.
4. Lot 3 — window manager v2 (registre de modules, validation de persistance).
5. Lot 4 — migration des modules, `AdminPage` en dernier.
