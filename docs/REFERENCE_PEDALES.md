# Listing des Pédales et leurs Réglages

Ce document répertorie toutes les pédales disponibles dans WebAmp avec leurs différents réglages (knobs, sliders, switches, etc.) selon les spécifications constructeur.

## Types de Contrôles

- **Knob** : Potentiomètre rotatif (par défaut)
- **Slider** : Curseur horizontal ou vertical
- **Switch Selector** : Sélecteur avec plusieurs positions (labels et icônes)
- **Switch** : Interrupteur vertical ou horizontal

## Types de Bypass

- **True Bypass** : Le signal original est préservé hors effet (pas d'altération)
- **Buffered Bypass** : Bypass avec buffer interne (peut affecter le signal)
- **Relay Bypass** : Bypass par relais (qualité proche du true bypass)

## 🎨 Règles de Disposition UI

### Positionnement des Knobs

- **3 Knobs uniquement** : Disposition en grille 2x2 avec le 3ème knob centré en bas (classe CSS `has-three-knobs`)
- **2 Knobs ou moins** : Disposition horizontale centrée
- **4+ Knobs** : Disposition en grille adaptative selon l'espace disponible
- **Knobs + Switch Selector** : Switch Selector pleine largeur en haut, knobs en grille en dessous (classe CSS `has-switch-selector-with-knobs`)

### Sliders Horizontaux

- **Sliders horizontaux** : Affichés en colonne verticale avec marge supplémentaire (`mb-4`) avant les boutons d'action
- **Couleur** : Utilise `accentColor` de la pédale pour l'harmonie visuelle

### Égaliseurs (EQ)

- **Toutes les bandes en colonnes** : Affichage en colonnes verticales côte à côte
- **Contrôle Level séparé** : Le paramètre "level" (s'il existe) est affiché séparément à droite
- **Taille adaptative** :
  - 10+ bandes → Taille XXL
  - 7-9 bandes → Taille XL
  - 5-6 bandes → Taille L
  - 3-4 bandes → Taille M

### Taille des Pédales

- **Minimum M** : Toutes les pédales ont au minimum la taille M
- **Taille adaptative** : Déterminée automatiquement selon le nombre et type de contrôles

### Dispositions UI Confirmées

#### Pédales avec 3 Knobs uniquement
- **Disposition** : Grille 2x2 avec le 3ème knob centré en bas
- **Exemples** : BOSS DS-1, Ibanez Tube Screamer, Pro Co RAT, Electro-Harmonix Big Muff, BOSS SD-1, Klon Centaur, etc.
- **Classe CSS** : `has-three-knobs`

#### Pédales avec Sliders Horizontaux
- **Disposition** : Sliders en colonne verticale avec marge `mb-4` avant les boutons d'action
- **Couleur** : Utilise `accentColor` de la pédale
- **Exemples** : Walrus Audio Fundamental Distortion, Walrus Audio Fundamental Drive, Walrus Audio Fundamental Fuzz, etc.

#### Pédales avec Switch Selector + Knobs
- **Disposition** : Switch Selector pleine largeur en haut, knobs en grille en dessous
- **Classe CSS** : `has-switch-selector-with-knobs`
- **Exemples** : Fulltone OCD, Walrus Audio Fundamental series, etc.

#### Égaliseurs (EQ)
- **BOSS GE-7** : 7 bandes en colonnes + Level séparé → Taille XL
- **MXR 10-Band EQ** : 10 bandes en colonnes + Level séparé → Taille XXL
- **Source Audio Programmable EQ** : 5 bandes en colonnes + Level séparé → Taille L
- **Empress ParaEQ** : 3 bandes en colonnes + Level séparé → Taille M

#### Pédales avec 4+ Knobs
- **Disposition** : Grille adaptative selon l'espace disponible
- **Exemples** : ZVEX Fuzz Factory (5 knobs), BOSS CH-1 (4 knobs), Ibanez Jemini (4 knobs), etc.

#### Pédales avec 2 Knobs ou moins
- **Disposition** : Horizontale centrée
- **Exemples** : Dunlop Fuzz Face (2 knobs), BOSS OD-1 (2 knobs), etc.

---

## DISTORTION

### BOSS DS-1
- **Type** : Distortion iconique
- **Style** : Vintage
- **Bypass** : Buffered bypass (buffer interne, pas de true bypass)
- **Réglages** :
  - `Distortion` : Knob (gain/sustain, continuum analogique, passage du son clair à saturé)
  - `Tone` : Knob (filtre tonal aigus/graves)
  - `Level` : Knob (volume de sortie)
- **Fonctions** : Commutateur au pied active l'effet, LED "Check" s'allume en mode effet
- **Réglages recommandés** :
  - ⚒️ **Rock classique / hard rock** : Gain 12–14h, Tone 11–12h, Level 12h → Grain serré, attaque précise
  - 🕳️ **Grunge / alternative** : Gain 14–15h, Tone 10–11h (un peu plus sombre), Level ajuster → Texture sale et épaisse, esprit Rat/DS-1
- **Checklist** : ✅ Fichier | 🎶 Audio | 🎛️ UI

### Pro Co RAT
- **Type** : Distortion polyvalente
- **Style** : Vintage
- **Bypass** : True bypass (signal non altéré quand désactivé)
- **Réglages** :
  - `Distortion` : Knob (niveau de saturation)
  - `Filter` : Knob (filtre passe-bas, tournez horaire pour atténuer les aigus)
  - `Volume` : Knob (volume de sortie)
- **Fonctions** : Commutateur au pied enclenche/désenclenche, LED incorporée indique l'effet actif
- **Réglages recommandés** :
  - ⚒️ **Rock classique / hard rock** : Distortion 12–14h, Filter 11–12h, Volume 12h → Grain serré, attaque précise
  - 🕳️ **Grunge / alternative** : Distortion 14–15h, Filter 10–11h (un peu plus sombre), Volume ajuster → Texture sale et épaisse, esprit Rat/DS-1
- **Checklist** : ✅ Fichier | 🎶 Audio | 🎛️ UI

### Ibanez Tube Screamer TS-9
- **Type** : Overdrive classique
- **Style** : Vintage
- **Bypass** : True bypass (généralement)
- **Réglages** :
  - `Drive` : Knob (degré d'overdrive)
  - `Tone` : Knob (coupe/boost des haut-médiums/aigus)
  - `Level` : Knob (volume de sortie)
- **Fonctions** : Commutateur électronique (FET) au pied active l'effet, LED allumée indique l'effet enclenché
- **Réglages recommandés** :
  - 🎯 **Son clair légèrement crunchy** : Drive 9h, Tone 12h, Level ajuster à l'unité → Parfait blues / pop / funky rock, style Tube Screamer classique
  - 🔥 **Booster un ampli ou une disto** : Drive 8–9h (quasi minimal), Tone 13h (plus d'aigus pour percer), Level 15–16h (boost de volume) → Pour solos ou riffs avec plus de présence, style SRV
  - 🧱 **Overdrive principal rock** : Drive 12–13h, Tone 12–14h, Level 12h → Son saturé rock classique
- **Checklist** : ✅ Fichier | 🎶 Audio | 🎛️ UI

### Electro-Harmonix Big Muff Pi
- **Type** : Fuzz/distortion légendaire
- **Style** : Vintage
- **Bypass** : True bypass (signal original préservé hors effet)
- **Réglages** :
  - `Sustain` : Knob (gain/fuzz)
  - `Tone` : Knob (balance graves/aigus)
  - `Volume` : Knob (niveau de sortie)
- **Fonctions** : Commutateur au pied true bypass, LED s'allume quand l'effet est actif
- **Variantes** : US, Ram's Head, Triangle, Pi, etc.
- **Réglages recommandés** :
  - 🧨 **Big Muff – gros mur de son** : Sustain 13–15h, Tone 12h, Volume 12–14h → Stoner / doom / shoegaze, son massif avec scoop médiums, style Smashing Pumpkins / QOTSA
- **Checklist** : ✅ Fichier | 🎶 Audio | 🎛️ UI

### Walrus Audio Fundamental Distortion
- **Type** : Distorsion 3 modes
- **Style** : Modern
- **Bypass** : True bypass (LED de bypass)
- **Réglages** :
  - `Gain` : Slider horizontal (quantité de distorsion)
  - `Tone` : Slider horizontal (filtre tonal après distorsion)
  - `Vol` : Slider horizontal (volume de sortie)
  - `Mode` : Switch Selector (0-2, défaut: 1)
    - **DARK** : Clipping silicium asymétrique + coupe-bas
    - **SI** : Clipping silicium classique
    - **LED** : Clipping via diodes LED, son plus dynamique
- **Réglages recommandés** :
  - ⚒️ **Rock classique / hard rock** : Gain 12–14h, Tone 11–12h, Vol 12h, Mode SI → Grain serré, attaque précise
  - 🕳️ **Grunge / alternative** : Gain 14–15h, Tone 10–11h (un peu plus sombre), Vol ajuster, Mode DARK → Texture sale et épaisse
  - ⚔️ **Metal** : Gain 13–15h, Tone ajuster (Basses 13h, Médiums 11h léger creux, Aigus 13h), Vol ajuster, Mode LED → Son dynamique et percutant
- **Checklist** : ✅ Fichier | 🎶 Audio | 🎛️ UI

### Ibanez Jemini Distortion
- **Type** : Distorsion double canal
- **Style** : Modern
- **Bypass** : True bypass
- **Réglages** :
  - `Gain A` : Knob (saturation canal A)
  - `Gain B` : Knob (saturation canal B)
  - `Tone` : Knob (équilibre tonal)
  - `Level` : Knob (volume de sortie)
- **Réglages recommandés** :
  - ⚒️ **Rock classique / hard rock** : Gain A/B 12–14h, Tone 11–12h, Level 12h → Grain serré, attaque précise
  - 🕳️ **Grunge / alternative** : Gain A/B 14–15h, Tone 10–11h (un peu plus sombre), Level ajuster → Texture sale et épaisse
- **Checklist** : ✅ Fichier | 🎶 Audio | 🎛️ UI

### Vox Satchurator
- **Type** : Distortion signature Satriani
- **Style** : Modern
- **Bypass** : True bypass
- **Réglages** :
  - `Gain` : Knob (niveau de distorsion)
  - `Tone` : Knob (EQ haute fréquence)
  - `Volume` : Knob (niveau de sortie)
- **Réglages recommandés** :
  - ⚒️ **Rock classique / hard rock** : Gain 12–14h, Tone 11–12h, Volume 12h → Grain serré, attaque précise
  - 🕳️ **Grunge / alternative** : Gain 14–15h, Tone 10–11h (un peu plus sombre), Volume ajuster → Texture sale et épaisse
- **Checklist** : ✅ Fichier | 🎶 Audio | 🎛️ UI

---

## OVERDRIVE

### BOSS SD-1
- **Type** : Super Overdrive classique
- **Style** : Vintage
- **Bypass** : Buffered bypass (buffer interne, pas de true bypass)
- **Réglages** :
  - `Drive` : Knob (gain/distorsion)
  - `Tone` : Knob (contrôle des aigus/mi-médiums, tournez horaire pour un son plus brillant)
  - `Level` : Knob (volume de sortie)
- **Fonctions** : Commutateur pied enclenche l'effet, LED "Check" indique ON
- **Réglages recommandés** :
  - 🎯 **Son clair légèrement crunchy** : Drive 9h, Tone 12h, Level ajuster à l'unité → Parfait blues / pop / funky rock
  - 🔥 **Booster un ampli ou une disto** : Drive 8–9h (quasi minimal), Tone 13h (plus d'aigus pour percer), Level 15–16h (boost de volume) → Pour solos ou riffs avec plus de présence
  - 🧱 **Overdrive principal rock** : Drive 12–13h, Tone 12–14h, Level 12h → Son saturé rock classique
- **Checklist** : ✅ Fichier | 🎶 Audio | 🎛️ UI

### Fulltone OCD
- **Type** : Overdrive boutique polyvalente
- **Style** : Boutique
- **Bypass** : True bypass (aucune perte de son hors effet)
- **Réglages** :
  - `Drive` : Knob (gain, augmente la saturation)
  - `Tone` : Knob (mode tonal, ajuste les aigus)
  - `Volume` : Knob (niveau de sortie)
- **Fonctions** : Commutateur 2 positions HP/LP (High Peak/Low Peak)
  - **HP** : Plus de bas-médiums et volume, type Marshall/Vox
  - **LP** : Médiums neutres type tweed Fender
- **Réglages recommandés** :
  - 🎯 **Son clair légèrement crunchy** : Drive 9h, Tone 12h, Volume ajuster à l'unité, Mode HP → Parfait blues / pop / funky rock
  - 🔥 **Booster un ampli ou une disto** : Drive 8–9h (quasi minimal), Tone 13h (plus d'aigus pour percer), Volume 15–16h (boost de volume), Mode HP → Pour solos ou riffs avec plus de présence
  - 🧱 **Overdrive principal rock** : Drive 12–13h, Tone 12–14h, Volume 12h, Mode HP → Son saturé rock classique
- **Checklist** : ✅ Fichier | 🎶 Audio | 🎛️ UI

### Klon Centaur
- **Type** : Overdrive transparent mythique
- **Style** : Boutique
- **Bypass** : Buffered bypass (circuit interne avec buffer, conception non true bypass)
- **Réglages** :
  - `Gain` : Knob (augmente le gain et mélange du son propre vers saturé)
  - `Treble` : Knob (contrôle des aigus)
  - `Output` : Knob (niveau de sortie)
- **Fonctions** : Pas de LED (le contournement n'altère pas le son propre)
- **Réglages recommandés** :
  - 🎯 **Son clair légèrement crunchy** : Gain 9h, Treble 12h, Output ajuster à l'unité → Parfait blues / pop / funky rock, overdrive transparent
  - 🔥 **Booster un ampli ou une disto** : Gain 8–9h (quasi minimal), Treble 13h (plus d'aigus pour percer), Output 15–16h (boost de volume) → Pour solos ou riffs avec plus de présence
  - 🧱 **Overdrive principal rock** : Gain 12–13h, Treble 12–14h, Output 12h → Son saturé rock classique avec transparence
- **Checklist** : ✅ Fichier | 🎶 Audio | 🎛️ UI

### Ibanez TS Mini
- **Type** : Overdrive compact
- **Style** : Modern
- **Bypass** : True bypass
- **Réglages** :
  - `Drive` : Knob (gain)
  - `Tone` : Knob (aigus)
  - `Level` : Knob (volume)
- **Fonctions** : Identique à TS9 en version mini, LED ON
- **Réglages recommandés** :
  - 🎯 **Son clair légèrement crunchy** : Drive 9h, Tone 12h, Level ajuster à l'unité → Parfait blues / pop / funky rock
  - 🔥 **Booster un ampli ou une disto** : Drive 8–9h (quasi minimal), Tone 13h (plus d'aigus pour percer), Level 15–16h (boost de volume) → Pour solos ou riffs avec plus de présence
  - 🧱 **Overdrive principal rock** : Drive 12–13h, Tone 12–14h, Level 12h → Son saturé rock classique
- **Checklist** : ✅ Fichier | 🎶 Audio | 🎛️ UI

### Walrus Audio Fundamental Drive
- **Type** : Overdrive 3 modes
- **Style** : Modern
- **Bypass** : True bypass (pédale enclenchée, LED de bypass)
- **Réglages** :
  - `Gain` : Slider horizontal (niveau de drive)
  - `Tone` : Slider horizontal (filtre tonal)
  - `Vol` : Slider horizontal (volume de sortie)
  - `Mode` : Switch Selector (0-2, défaut: 0)
    - **SMOOTH** : Overdrive doux au silicium
    - **CRUNCH** : Clipping silicium plus dur pour du grain
    - **BRIGHT** : Combine Crunch avec coupure des basses pour plus de brillance
- **Réglages recommandés** :
  - 🎯 **Son clair légèrement crunchy** : Gain 9h, Tone 12h, Vol ajuster à l'unité, Mode SMOOTH → Parfait blues / pop / funky rock
  - 🔥 **Booster un ampli ou une disto** : Gain 8–9h (quasi minimal), Tone 13h (plus d'aigus pour percer), Vol 15–16h (boost de volume), Mode BRIGHT → Pour solos ou riffs avec plus de présence
  - 🧱 **Overdrive principal rock** : Gain 12–13h, Tone 12–14h, Vol 12h, Mode CRUNCH → Son saturé rock classique avec grain
- **Checklist** : ✅ Fichier | 🎶 Audio | 🎛️ UI

### BOSS OD-1
- **Type** : Overdrive historique
- **Style** : Vintage
- **Bypass** : Buffered bypass
- **Réglages** :
  - `Overdrive` : Knob (niveau de drive)
  - `Level` : Knob (volume de sortie)
- **Réglages recommandés** :
  - 🎯 **Son clair légèrement crunchy** : Overdrive 9h, Level ajuster à l'unité → Parfait blues / pop / funky rock
  - 🔥 **Booster un ampli ou une disto** : Overdrive 8–9h (quasi minimal), Level 15–16h (boost de volume) → Pour solos ou riffs avec plus de présence
  - 🧱 **Overdrive principal rock** : Overdrive 12–13h, Level 12h → Son saturé rock classique
- **Checklist** : ✅ Fichier | 🎶 Audio | 🎛️ UI

### Mesa Boogie Grid Slammer
- **Type** : Overdrive serré
- **Style** : Modern
- **Bypass** : True bypass
- **Réglages** :
  - `Gain` : Knob (drive)
  - `Tone` : Knob (EQ)
  - `Level` : Knob (volume)
- **Réglages recommandés** :
  - 🎯 **Son clair légèrement crunchy** : Gain 9h, Tone 12h, Level ajuster à l'unité → Parfait blues / pop / funky rock
  - 🔥 **Booster un ampli ou une disto** : Gain 8–9h (quasi minimal), Tone 13h (plus d'aigus pour percer), Level 15–16h (boost de volume) → Pour solos ou riffs avec plus de présence
  - 🧱 **Overdrive principal rock** : Gain 12–13h, Tone 12–14h, Level 12h → Son saturé rock classique, serré et précis
- **Checklist** : ✅ Fichier | 🎶 Audio | 🎛️ UI

### JHS AT Drive
- **Type** : Overdrive signature Andy Timmons
- **Style** : Modern
- **Bypass** : True bypass
- **Réglages** :
  - `Drive` : Knob (gain)
  - `Tone` : Knob (équilibre tonal)
  - `Level` : Knob (volume)
- **Réglages recommandés** :
  - 🎯 **Son clair légèrement crunchy** : Drive 9h, Tone 12h, Level ajuster à l'unité → Parfait blues / pop / funky rock
  - 🔥 **Booster un ampli ou une disto** : Drive 8–9h (quasi minimal), Tone 13h (plus d'aigus pour percer), Level 15–16h (boost de volume) → Pour solos ou riffs avec plus de présence, style Andy Timmons
  - 🧱 **Overdrive principal rock** : Drive 12–13h, Tone 12–14h, Level 12h → Son saturé rock classique, expressif
- **Checklist** : ✅ Fichier | 🎶 Audio | 🎛️ UI

---

## FUZZ

### Dunlop Fuzz Face (JHF1)
- **Type** : Fuzz vintage iconique
- **Style** : Vintage
- **Bypass** : True bypass ("Hardwire Bypass")
- **Réglages** :
  - `Fuzz` : Knob (intensité du fuzz, CW plus saturé)
  - `Volume` : Knob (son de sortie)
- **Fonctions** : Versions géminium ou silicium (notamment Jimi Hendrix Model)
- **Réglages recommandés** :
  - 🌫️ **Fuzz Face vintage (germanium) – chaud et réactif** : Fuzz max (17h–max), Volume 12h, Volume guitare à 7–8 → Son clair-crunch magique, idéal pour lead psyché / blues rock 70s, style Hendrix
- **Checklist** : ✅ Fichier | 🎶 Audio | 🎛️ UI

### ZVEX Fuzz Factory
- **Type** : Fuzz extrême 5 contrôles
- **Style** : Boutique
- **Bypass** : True bypass
- **Réglages** :
  - `Gate` : Knob (coupe le bruit, CW ferme la porte)
  - `Comp` : Knob (attaque/compression, CV/plus de compression)
  - `Drive` : Knob (gain fuzz)
  - `Stab` : Knob (stabilité/feedback, bas cause oscillations)
  - `Volume` : Knob (niveau de sortie)
- **Fonctions** : Commutateur externe pour fonctions EXP ou Sub-octave sur version Vextronix
- **Réglages recommandés** :
  - 🦾 **Fuzz moderne type "velcro"** : Gate 14–16h, Drive 12–14h, Comp 13–15h, Stab ajuster selon stabilité souhaitée, Volume ajuster → Texture glitch, inspirée de la Fuzz Factory, son instable et oscillant
- **Checklist** : ✅ Fichier | 🎶 Audio | 🎛️ UI

### Electro-Harmonix Big Muff
- **Type** : Fuzz sustain
- **Style** : Vintage
- **Bypass** : True bypass
- **Réglages** :
  - `Sustain` : Knob (gain/fuzz)
  - `Tone` : Knob (balance graves/aigus)
  - `Volume` : Knob (niveau de sortie)
- **Réglages recommandés** :
  - 🧨 **Big Muff – gros mur de son** : Sustain 13–15h, Tone 12h, Volume 12–14h → Stoner / doom / shoegaze, son massif avec scoop médiums, style Smashing Pumpkins / QOTSA
- **Checklist** : ✅ Fichier | 🎶 Audio | 🎛️ UI

### Walrus Audio Fundamental Fuzz
- **Type** : Fuzz 3 modes moderne
- **Style** : Modern
- **Bypass** : True bypass
- **Réglages** :
  - `Gain` : Slider horizontal (niveau de fuzz)
  - `Tone` : Slider horizontal (filtre après fuzz)
  - `Vol` : Slider horizontal (volume de sortie)
  - `Mode` : Switch Selector (0-2, défaut: 1)
    - **GATE** : Polarisation basse, son "haché/gate"
    - **CLASSIC** : Fuzz classique avec scoop médiums
    - **MID+** : Boost médiums
- **Réglages recommandés** :
  - 🌫️ **Fuzz Face vintage** : Gain max (17h–max), Tone 12h, Vol 12h, Mode CLASSIC, Volume guitare à 7–8 → Son clair-crunch magique, idéal pour lead psyché / blues rock 70s
  - 🧨 **Big Muff – gros mur de son** : Gain 13–15h, Tone 12h, Vol 12–14h, Mode CLASSIC → Stoner / doom / shoegaze, son massif avec scoop médiums
  - 🦾 **Fuzz moderne type "velcro"** : Gain 12–14h, Tone ajuster, Vol ajuster, Mode GATE → Texture glitch, son haché et instable
- **Checklist** : ✅ Fichier | 🎶 Audio | 🎛️ UI

---

## CHORUS

### BOSS CH-1 Super Chorus
- **Type** : Chorus stéréo
- **Style** : Vintage
- **Bypass** : Buffered bypass (buffer BOSS)
- **Réglages** :
  - `Rate` : Knob (vitesse LFO)
  - `Depth` : Knob (profondeur LFO)
  - `Equalizer` : Knob (filtre tonal médiums/aigus)
  - `Level` : Knob (volume effet)
- **Fonctions** : Commutateur Normal/Effect au pied, LED "Check" ON en mode effet
- **Checklist** : ✅ Fichier | 🎶 Audio | 🎛️ UI

### Electro-Harmonix Small Clone
- **Type** : Chorus analogique simple
- **Style** : Vintage
- **Bypass** : True bypass
- **Réglages** :
  - `Rate` : Knob (vitesse)
  - `Depth` : Knob (amplitude)
- **Fonctions** : Switch (bouton) Chorus/Vibrato (le mode vibrato utilise Rate/Depth)
- **Checklist** : ✅ Fichier | 🎶 Audio | 🎛️ UI

### Walrus Audio Fundamental Chorus
- **Type** : Chorus numérique 3 modes
- **Style** : Modern
- **Bypass** : Buffered bypass
- **Réglages** :
  - `Rate` : Slider horizontal (vitesse)
  - `Depth` : Slider horizontal (profondeur)
  - `Mix` : Slider horizontal (mix sec/effet)
  - `Mode` : Switch Selector (0-2, défaut: 1)
    - **LIGHT** : Chorus doux, analog style
    - **MEDIUM** : Multi-tap modéré
    - **HEAVY** : Chorus trilinéaire prononcé
- **Checklist** : ✅ Fichier | 🎶 Audio | 🎛️ UI

### Electro-Harmonix Oceans 11
- **Type** : Multi-effets (Chorus/Vibrato + Reverb)
- **Style** : Boutique
- **Bypass** : True bypass
- **Réglages** :
  - `Rate` : Knob (vitesse de modulation)
  - `Depth` : Knob (profondeur)
  - `Mix` : Knob (mix dry/wet)
- **Fonctions** : 11 modes (via bouton Mode) incluent plusieurs types de chorus, vibrato, flanger, etc.
- **Checklist** : ✅ Fichier | 🎶 Audio | 🎛️ UI

### BOSS CE-1 Chorus Ensemble
- **Type** : Chorus/vibrato stéréo vintage
- **Style** : Vintage
- **Bypass** : Buffered bypass (BOSS)
- **Réglages** :
  - `Rate` : Knob (vitesse)
  - `Depth` : Knob (intensité)
  - `Level` : Knob (mix/volume) en mode chorus
- **Fonctions** : Commutateur Chorus/Vibrato change de type d'effet, LED intégrée signale le mode
- **Checklist** : ✅ Fichier | 🎶 Audio | 🎛️ UI

### BOSS CE-2
- **Type** : Chorus analogique
- **Style** : Vintage
- **Bypass** : Buffered bypass
- **Réglages** :
  - `Rate` : Knob (vitesse LFO)
  - `Depth` : Knob (profondeur LFO)
- **Checklist** : ✅ Fichier | 🎶 Audio | 🎛️ UI

### Eventide Harmonizer (Pedal)
- **Type** : Harmonizer / Pitch
- **Style** : Modern
- **Bypass** : True bypass
- **Réglages** :
  - `Mix` : Knob (dry/wet)
  - `Shift` : Knob (intervalle -12 à +12)
  - `Feedback` : Knob (réinjection)
- **Checklist** : ✅ Fichier | 🎶 Audio | 🎛️ UI

### MXR Analog Chorus
- **Type** : Chorus analogique chaud
- **Style** : Modern
- **Bypass** : True bypass (modèles récents) ou buffer selon version
- **Réglages** :
  - `Rate` : Knob (vitesse)
  - `Depth` : Knob (profondeur)
  - `Level` : Knob (volume)
- **Fonctions** : Tout asservi à un circuit analogue BBD
- **Checklist** : ✅ Fichier | 🎶 Audio | 🎛️ UI

---

## DELAY

### BOSS DD-3 Digital Delay
- **Type** : Delay numérique classique
- **Style** : Vintage
- **Bypass** : Buffered bypass (BOSS)
- **Réglages** :
  - `Time` : Knob (temps de retard, 12,5 ms à 800 ms)
  - `Feedback` : Knob (nombre de répétitions)
  - `Level` : Knob (mix dry/effet)
- **Fonctions** : Sélecteur Memory pour délais courts/moyens/longs (S/M/L), bouton TAP tempo en maintenant appuyé
- **Checklist** : ✅ Fichier | 🎶 Audio | 🎛️ UI

### TC Electronic Flashback
- **Type** : Delay multi-mode
- **Style** : Modern
- **Bypass** : Variable selon modèle
- **Réglages** :
  - `Time` : Knob (temps retard)
  - `Feedback` : Knob (répétitions)
  - `Mix` : Knob (mix sec/effet)
- **Fonctions** : Molette ou switch de type pour sélectionner mode delay (Analog, Tape, Looper…)
- **Checklist** : ✅ Fichier | 🎶 Audio | 🎛️ UI

### Walrus Audio Fundamental Delay
- **Type** : Delay multi-mode (Digital/Analog/Reverse)
- **Style** : Modern
- **Bypass** : Buffered bypass
- **Réglages** :
  - `Time` : Slider horizontal (0–1000 ms max, ~1 s)
  - `Feedback` : Slider horizontal (répétitions)
  - `Mix` : Slider horizontal (mix dry/effet)
  - `Mode` : Switch Selector (0-2, défaut: 0)
    - **DIGITAL** : Retour clair numérique
    - **ANALOG** : Imitation BBD filtre
    - **REVERSE** : Écho inversé
- **Checklist** : ✅ Fichier | 🎶 Audio | 🎛️ UI

### Strymon TimeLine
- **Type** : Delay professionnel multi-mode
- **Style** : Boutique
- **Bypass** : Bypass vrai (relay) ou optionnel (selon mode)
- **Réglages** :
  - `Time` : Knob (temps retard)
  - `Repeats` : Knob (feedback/répétitions)
  - `Mix` : Knob (mix sec/effet)
- **Fonctions** : 12 algorithmes (Tape, Analog, Reverse, etc) accessibles, tap tempo, 200 presets, looper 30 s
- **Checklist** : ✅ Fichier | 🎶 Audio | 🎛️ UI

### Maestro Echoplex EP-3
- **Type** : Delay à bande (tube)
- **Style** : Vintage
- **Bypass** : Variable
- **Réglages** :
  - `Time` : Knob (contrôle de la vitesse du bandeau, donc du retard)
  - `Repeat` : Knob (nombre de répétitions)
  - `Mix/Level` : Knob (volume output)
- **Fonctions** : Interrupteur Echo/Repeat/Bypass, son chaud
- **Checklist** : ✅ Fichier | 🎶 Audio | 🎛️ UI

### Binson Echorec
- **Type** : Delay à disque magnétique
- **Style** : Vintage
- **Bypass** : Variable
- **Réglages** :
  - `Repeat` : Knob (niveau de feedback)
  - `Tone` : Knob (réglage tonal)
- **Fonctions** : Sélecteur de têtes de lecture (4,6,8 heads) qui change la plage de retard. Aucun "Time" chiffré, chaque position donne un délai caractéristique
- **Checklist** : ✅ Fichier | 🎶 Audio | 🎛️ UI

### Electro-Harmonix Deluxe Memory Man
- **Type** : Delay analogique doux
- **Style** : Vintage
- **Bypass** : True bypass ou buffer (dépend version)
- **Réglages** :
  - `Delay` : Knob (temps retard, ~0–300 ms)
  - `Feedback` : Knob (répétitions)
  - `Blend` : Knob (mix dry/effet)
- **Checklist** : ✅ Fichier | 🎶 Audio | 🎛️ UI

### Roland Space Echo (RE-201)
- **Type** : Echo bande à ressorts
- **Style** : Vintage
- **Bypass** : True bypass (à relais)
- **Réglages** :
  - `Repeat` : Knob (intensité du feedback)
  - `Intensity` : Knob (combine volume et feedback selon model)
  - `Echo Volume` : Knob (mix sec/effet)
- **Fonctions** : Sélecteurs de têtes (3/5/8) pour régler le délai
- **Checklist** : ✅ Fichier | 🎶 Audio | 🎛️ UI

### TC Electronic 2290 (Rack)
- **Type** : Delay digital précis
- **Style** : Modern
- **Bypass** : Variable
- **Réglages** :
  - `Delay` : Knob (temps retard en ms)
  - `Feedback` : Knob (0–100%, en pratique ~0–45%)
  - `Mix` : Knob (0–100%)
- **Checklist** : ✅ Fichier | 🎶 Audio | 🎛️ UI

### Vox Time Machine Delay
- **Type** : Delay signature Satriani
- **Style** : Modern
- **Bypass** : True bypass
- **Réglages** :
  - `Time` : Knob (temps de retard)
  - `Feedback` : Knob (répétitions)
  - `Mix` : Knob (mix dry/effet)
- **Checklist** : ✅ Fichier | 🎶 Audio | 🎛️ UI

---

## REVERB

### BOSS RV-6
- **Type** : Reverb multi-mode
- **Style** : Modern
- **Bypass** : Buffered bypass (BOSS)
- **Réglages** :
  - `Decay` : Knob (durée de réverb)
  - `Tone` : Knob (brillance globale)
  - `Level` : Knob (mix sec/effet)
- **Fonctions** : Sélecteur de modes (Hall, Spring, Modulate, Halo…)
- **Checklist** : ✅ Fichier | 🎶 Audio | 🎛️ UI

### Electro-Harmonix Holy Grail
- **Type** : Reverb spring simple
- **Style** : Vintage
- **Bypass** : True bypass
- **Réglages** :
  - `Reverb` : Knob (mix level)
- **Fonctions** : Combinateurs interne spring, commutateur (Off/On) au pied, LED ON
- **Checklist** : ✅ Fichier | 🎶 Audio | 🎛️ UI

### Walrus Audio Fundamental Reverb
- **Type** : Reverb 3 modes
- **Style** : Modern
- **Bypass** : Buffered bypass (mode Trails disponible)
- **Réglages** :
  - `Decay` : Slider horizontal (durée de réverbération)
  - `Tone` : Slider horizontal (brillance de la réverbération)
  - `Mix` : Slider horizontal (mix sec/effet)
  - `Mode` : Switch Selector (0-2, défaut: 0)
    - **HALL** : Ambiance grande salle
    - **SPRING** : Ressorts
    - **PLATE** : Analogique dense
- **Checklist** : ✅ Fichier | 🎶 Audio | 🎛️ UI

### Strymon BigSky
- **Type** : Reverb professionnel multi-mode
- **Style** : Boutique
- **Bypass** : Bypass relais
- **Réglages** :
  - `Decay` : Knob (durée)
  - `Tone` : Knob (brillance)
  - `Mix` : Knob (mix)
- **Fonctions** : 12 algorithmes (Plateaux, Hall, Shimmer, Cloud…), presets, Lo-Fi…
- **Checklist** : ✅ Fichier | 🎶 Audio | 🎛️ UI

### Neunaber Ambient Reverb
- **Type** : Reverb ambient stéréo
- **Style** : Modern
- **Bypass** : True bypass
- **Réglages** :
  - `Mix` : Knob (dry/wet)
  - `Decay` : Knob (durée)
  - `Tone` : Knob (brillance)
- **Checklist** : ✅ Fichier | 🎶 Audio | 🎛️ UI

---

## FLANGER

### BOSS BF-3
- **Type** : Flanger stéréo
- **Style** : Modern
- **Bypass** : Buffered bypass (BOSS)
- **Réglages** :
  - `Rate` : Knob (vitesse LFO)
  - `Depth` : Knob (profondeur LFO)
  - `Manual` : Knob (décalage de point initial du délai)
  - `Resonance` : Knob (feedback du filtre)
- **Checklist** : ✅ Fichier | 🎶 Audio | 🎛️ UI

### Electro-Harmonix Electric Mistress
- **Type** : Flanger/Chorus vintage
- **Style** : Vintage
- **Bypass** : True bypass sur modèle clone ou relai
- **Réglages** :
  - `Rate` : Knob (vitesse)
  - `Range` : Knob (plage de délai / largeur du phasing)
  - `Color` : Knob (équilibre tonal/résonance)
- **Checklist** : ✅ Fichier | 🎶 Audio | 🎛️ UI

### Walrus Audio Fundamental Flanger
- **Type** : Flanger moderne
- **Style** : Modern
- **Bypass** : Buffered bypass
- **Réglages** :
  - `Rate` : Slider horizontal (vitesse LFO)
  - `Depth` : Slider horizontal (profondeur LFO)
  - `Feedback` : Slider horizontal (réinjection du signal)
- **Checklist** : ✅ Fichier | 🎶 Audio | 🎛️ UI

### Mooer E-Lady
- **Type** : Flanger compact
- **Style** : Modern
- **Bypass** : Buffer interne (pas true bypass)
- **Réglages** :
  - `Rate` : Knob (vitesse)
  - `Range` : Knob (plage)
  - `Color` : Knob (couleur)
- **Checklist** : ✅ Fichier | 🎶 Audio | 🎛️ UI

### MXR Flanger 117 (Uni-Vibe)
- **Type** : Flanger analogique type Uni-Vibe
- **Style** : Vintage
- **Bypass** : True bypass (modèle MF-117 originel)
- **Réglages** :
  - `Rate` : Knob (vitesse)
  - `Width` : Knob (plage/étendue)
  - `Regen` : Knob (feedback)
  - `Manual` : Knob (offset de phase)
- **Checklist** : ✅ Fichier | 🎶 Audio | 🎛️ UI

---

## TREMOLO

### BOSS TR-2
- **Type** : Tremolo classique
- **Style** : Vintage
- **Bypass** : Buffered bypass (BOSS)
- **Réglages** :
  - `Rate` : Knob (vitesse LFO)
  - `Depth` : Knob (profondeur)
  - `Wave` : Knob (forme d'onde: 0=sine, 1=square)
- **Checklist** : ✅ Fichier | 🎶 Audio | 🎛️ UI

### Killswitch (Stutter)
- **Type** : Tremolo / Mute momentané
- **Style** : Modern
- **Bypass** : True bypass
- **Réglages** :
  - `Speed` : Knob (vitesse de répétition)
  - `Depth` : Knob (profondeur, 100% pour mute total)
- **Checklist** : ✅ Fichier | 🎶 Audio | 🎛️ UI

### Walrus Audio Fundamental Tremolo
- **Type** : Tremolo optique 3 formes
- **Style** : Modern
- **Bypass** : True bypass
- **Réglages** :
  - `Rate` : Slider horizontal (vitesse)
  - `Depth` : Slider horizontal (profondeur)
  - `Vol` : Slider horizontal (volume)
  - `Wave` : Switch Selector (0-2, défaut: 0)
    - **SINE** : Forme sinusoïdale
    - **SQUARE** : Forme carrée
    - **RANDOM** : Forme aléatoire (comme triangle, carrée, aléatoire)
- **Checklist** : ✅ Fichier | 🎶 Audio | 🎛️ UI

### Fulltone Supa-Trem
- **Type** : Tremolo boutique optique
- **Style** : Boutique
- **Bypass** : True bypass
- **Réglages** :
  - `Speed` : Knob (vitesse)
  - `Depth` : Knob (profondeur)
  - `Volume` : Knob (sortie)
- **Fonctions** : Commutateur On/Off
- **Checklist** : ✅ Fichier | 🎶 Audio | 🎛️ UI

### Strymon Flint
- **Type** : Tremolo + Reverb
- **Style** : Boutique
- **Bypass** : Bypass relais
- **Réglages** :
  - `Rate` : Knob (vitesse)
  - `Depth` : Knob (profondeur)
  - `Intensity` : Knob (mix reverb)
- **Fonctions** : 3 formes (bias Reissue, Harmonic, Square) et 3 types reverb disponibles
- **Checklist** : ✅ Fichier | 🎶 Audio | 🎛️ UI

---

## PHASER

### BOSS PH-3
- **Type** : Phaser multi-mode
- **Style** : Modern
- **Bypass** : Buffer interne (BOSS)
- **Réglages** :
  - `Rate` : Knob (vitesse LFO)
  - `Depth` : Knob (profondeur)
  - `Resonance` : Knob (feedback notch)
- **Fonctions** : Sélecteur de mode (8 options incluant Uni-Vibe, 4/8 stg, step, +fx)
- **Checklist** : ✅ Fichier | 🎶 Audio | 🎛️ UI

### Electro-Harmonix Small Stone
- **Type** : Phaser vintage simple
- **Style** : Vintage
- **Bypass** : True bypass
- **Réglages** :
  - `Rate` : Knob (vitesse)
  - `Color` : Knob (fréquence centrale)
- **Fonctions** : Mode Color (on/off pour accent)
- **Checklist** : ✅ Fichier | 🎶 Audio | 🎛️ UI

### Mooer Phase 90
- **Type** : Phaser compact
- **Style** : Modern
- **Bypass** : Buffer interne (pas true bypass)
- **Réglages** :
  - `Rate` : Knob (vitesse)
  - `Depth` : Knob (profondeur)
- **Note** : Variante modèle Paul Gilbert sans Depth
- **Checklist** : ✅ Fichier | 🎶 Audio | 🎛️ UI

### Walrus Audio Fundamental Phaser
- **Type** : Phaser digital 3 modes
- **Style** : Modern
- **Bypass** : True bypass
- **Réglages** :
  - `Rate` : Slider horizontal (vitesse)
  - `Feedback` : Slider horizontal (réinjection)
  - `Depth` : Slider horizontal (profondeur)
  - `Mode` : Switch Selector (0-2, défaut: 1)
    - **LIGHT** : Phaser léger
    - **MEDIUM** : Phaser modéré
    - **HEAVY** : Phaser intense
- **Checklist** : ✅ Fichier | 🎶 Audio | 🎛️ UI

### MXR Phase 90
- **Type** : Phaser 4 étages classique
- **Style** : Vintage
- **Bypass** : True bypass (version Classic)
- **Réglages** :
  - `Rate` : Knob (vitesse)
  - `Mix` : Knob (volume/level)
- **Checklist** : ✅ Fichier | 🎶 Audio | 🎛️ UI

### Morley Bad Horsie Wah
- **Type** : Wah optique
- **Style** : Modern
- **Bypass** : True bypass
- **Réglages** :
  - `Sweep` : Knob (plage de wah)
  - `Level` : Knob (volume)
- **Checklist** : ✅ Fichier | 🎶 Audio | 🎛️ UI

---

## EQ (ÉGALISEURS)

### BOSS GE-7
- **Type** : Égaliseur graphique 7 bandes
- **Style** : Vintage
- **Bypass** : Buffer interne (BOSS)
- **Réglages** :
  - `100Hz` : Slider vertical (±15 dB, défaut: 0)
  - `200Hz` : Slider vertical (±15 dB, défaut: 0)
  - `400Hz` : Slider vertical (±15 dB, défaut: 0)
  - `800Hz` : Slider vertical (±15 dB, défaut: 0)
  - `1.6kHz` : Slider vertical (±15 dB, défaut: 0)
  - `3.2kHz` : Slider vertical (±15 dB, défaut: 0)
  - `6.4kHz` : Slider vertical (±15 dB, défaut: 0)
  - `Level` : Slider vertical (volume général, 0-100, défaut: 50)
- **Checklist** : ✅ Fichier | 🎶 Audio | 🎛️ UI

### MXR 10-Band EQ
- **Type** : Égaliseur graphique 10 bandes
- **Style** : Modern
- **Bypass** : True bypass sur la plupart des modèles
- **Réglages** :
  - `31Hz` : Slider vertical (±12 dB, défaut: 0)
  - `62Hz` : Slider vertical (±12 dB, défaut: 0)
  - `125Hz` : Slider vertical (±12 dB, défaut: 0)
  - `250Hz` : Slider vertical (±12 dB, défaut: 0)
  - `500Hz` : Slider vertical (±12 dB, défaut: 0)
  - `1kHz` : Slider vertical (±12 dB, défaut: 0)
  - `2kHz` : Slider vertical (±12 dB, défaut: 0)
  - `4kHz` : Slider vertical (±12 dB, défaut: 0)
  - `8kHz` : Slider vertical (±12 dB, défaut: 0)
  - `16kHz` : Slider vertical (±12 dB, défaut: 0)
  - `Level` : Slider vertical (0–100%, défaut: 50)
- **Checklist** : ✅ Fichier | 🎶 Audio | 🎛️ UI

### Source Audio Programmable EQ
- **Type** : EQ paramétrique programmable
- **Style** : Boutique
- **Bypass** : Sélecteur relay, choix true/buffered
- **Réglages** :
  - `Low` : Slider vertical (±18 dB, défaut: 0)
  - `Low Mid` : Slider vertical (±18 dB, défaut: 0)
  - `Mid` : Slider vertical (±18 dB, défaut: 0)
  - `High Mid` : Slider vertical (±18 dB, défaut: 0)
  - `High` : Slider vertical (±18 dB, défaut: 0)
  - `Level` : Slider vertical (volume, défaut: 50)
- **Fonctions** : Permet réglages de fréquence/Q via application, stocke presets
- **Checklist** : ✅ Fichier | 🎶 Audio | 🎛️ UI

### Empress ParaEQ
- **Type** : EQ paramétrique 3 bandes
- **Style** : Boutique
- **Bypass** : True bypass
- **Réglages** :
  - `Low` : Slider vertical (±12 dB, défaut: 0)
  - `Mid` : Slider vertical (±12 dB, défaut: 0)
  - `High` : Slider vertical (±12 dB, défaut: 0)
  - `Level` : Slider vertical (volume, défaut: 50)
- **Fonctions** : Commandes de fréquence et Q par crans poussoir
- **Checklist** : ✅ Fichier | 🎶 Audio | 🎛️ UI

---

## WAH

### Vox V847 Wah
- **Type** : Wah vintage
- **Style** : Vintage
- **Bypass** : Buffer interne avec 3PDT
- **Réglages** :
  - `Sweep` : Knob (pédale, filtre modulable)
  - `Q` : Knob (résonance, intensité du pic)
  - `Level` : Knob (potard de volume de sortie, sur certains clones)
- **Fonctions** : Switch au pied pour activer/désactiver l'effet
- **Checklist** : ✅ Fichier | 🎶 Audio | 🎛️ UI

### Dunlop Cry Baby (GCB-95)
- **Type** : Wah moderne classique
- **Style** : Modern
- **Bypass** : True bypass (3PDT)
- **Réglages** :
  - `Sweep` : Knob (pédale de filtrage)
  - `Q` : Knob (résonance, ~0–100)
  - `Volume` : Knob (modèles mini/boost)
- **Fonctions** : Lampes ou buffers internes selon versions
- **Checklist** : ✅ Fichier | 🎶 Audio | 🎛️ UI

### Dunlop Slash Wah SW95
- **Type** : Wah signature Slash
- **Style** : Boutique
- **Bypass** : True bypass
- **Réglages** :
  - `Sweep` : Knob (filtre)
  - `Q` : Knob (résonance)
  - `Boost` : Knob (0–15 dB, gain max ~+15 dB)
- **Checklist** : ✅ Fichier | 🎶 Audio | 🎛️ UI

### Dunlop MXR EVH Signature Wah
- **Type** : Wah Eddie Van Halen
- **Style** : Modern
- **Bypass** : True bypass
- **Réglages** :
  - `Sweep` : Knob (filtre)
  - `Q` : Knob (résonance)
  - `Volume` : Knob (sortie)
- **Fonctions** : Commutateur On/Off
- **Checklist** : ✅ Fichier | 🎶 Audio | 🎛️ UI

### Dunlop MXR KH95 Wah
- **Type** : Wah signature Kirk Hammett
- **Style** : Modern
- **Bypass** : True bypass
- **Réglages** :
  - `Sweep` : Knob (filtre)
  - `Q` : Knob (résonance)
  - `Gain` : Knob (boost interne)
- **Fonctions** : Active un boost interne (jusqu'à +30 dB) au clic
- **Checklist** : ✅ Fichier | 🎶 Audio | 🎛️ UI

### RMC Custom Wah
- **Type** : Wah boutique
- **Style** : Boutique
- **Bypass** : True bypass
- **Réglages** :
  - `Sweep` : Knob (filtre)
  - `Q` : Knob (résonance)
  - `Bass` : Knob (filtre grave)
- **Checklist** : ✅ Fichier | 🎶 Audio | 🎛️ UI

---

## BOOST

### Colorsound Power Booster (Nucleus)
- **Type** : Boost vintage transparent
- **Style** : Vintage
- **Bypass** : True bypass
- **Réglages** :
  - `Gain` : Knob (boost de signal)
  - `Treble` : Knob (coupe/boost ±20 dB)
  - `Bass` : Knob (±20 dB)
- **Fonctions** : Boost interne élevé (~+15 dB ou plus)
- **Checklist** : ✅ Fichier | 🎶 Audio | 🎛️ UI

### Custom Clean Boost
- **Type** : Boost moderne
- **Style** : Modern
- **Bypass** : True bypass (typique)
- **Réglages** :
  - `Level` : Knob (niveau de boost)
  - `Tone` : Knob (filtre tonal)
- **Fonctions** : Conçu pour relever le gain sans distorsion
- **Checklist** : ✅ Fichier | 🎶 Audio | 🎛️ UI

### MXR MC-402 Boost/OD
- **Type** : Boost + Overdrive combinés
- **Style** : Modern
- **Bypass** : True bypass
- **Réglages** :
  - `Boost` : Knob (volume d'entrée boosté)
  - `Drive` : Knob (niveau d'overdrive)
  - `Tone` : Knob (filtre tonal)
- **Fonctions** : Commutation Boost/Drive
- **Checklist** : ✅ Fichier | 🎶 Audio | 🎛️ UI

### Treble Booster (Rangemaster)
- **Type** : Boost aigu
- **Style** : Vintage
- **Bypass** : True bypass
- **Réglages** :
  - `Boost` : Knob (niveau d'augmentation)
  - `Level` : Knob (volume de sortie)
- **Checklist** : ✅ Fichier | 🎶 Audio | 🎛️ UI

---

## COMPRESSEUR

### MXR Dyna Comp
- **Type** : Compresseur simple
- **Style** : Vintage
- **Bypass** : True bypass
- **Réglages** :
  - `Output` : Knob (niveau de sortie)
  - `Sensitivity` : Knob (seuil d'entrée)
- **Fonctions** : Pour lisser la dynamique
- **Checklist** : ✅ Fichier | 🎶 Audio | 🎛️ UI

---

## OCTAVER / VIBE / PITCH / ROTARY

### Roger Mayer Octavia
- **Type** : Fuzz + octave supérieure
- **Style** : Vintage
- **Bypass** : Variable
- **Réglages** :
  - `Fuzz` : Knob (gain fuzz)
  - `Octave` : Knob (niveau octave supérieure)
  - `Level` : Knob (volume)
- **Fonctions** : On/off par footswitch, son saturé type Hendrix
- **Checklist** : ✅ Fichier | 🎶 Audio | 🎛️ UI

### Shin-ei Uni-Vibe
- **Type** : Vibrato/phaser à lampes
- **Style** : Vintage
- **Bypass** : Buffer interne (simulateur de Rotary)
- **Réglages** :
  - `Speed` : Knob (vitesse)
  - `Intensity` : Knob (profondeur)
  - `Mix` : Knob (quelque versions ont Mix)
- **Fonctions** : Commutateur Vibrato/Chorus
- **Checklist** : ✅ Fichier | 🎶 Audio | 🎛️ UI

### DigiTech Whammy
- **Type** : Pitch-shifter au pied
- **Style** : Modern
- **Bypass** : True bypass
- **Réglages** :
  - `Interval` : Knob (−12…+12 demi-tons)
  - `Mix` : Knob (dry/wet)
  - `Tracking` : Knob (sensibilité 1–100%)
- **Fonctions** : Pédale à inclinaison change l'intervalle
- **Checklist** : ✅ Fichier | 🎶 Audio | 🎛️ UI

### Leslie Rotary Simulator
- **Type** : Simulation d'enceinte rotative
- **Style** : Boutique
- **Bypass** : Bypass buffer
- **Réglages** :
  - `Speed` : Knob (vitesse)
  - `Depth` : Knob (profondeur)
  - `Mix` : Knob (mix)
- **Fonctions** : Modes chorale/rotary via switch interne
- **Checklist** : ✅ Fichier | 🎶 Audio | 🎛️ UI

---

## VOLUME / NOISE GATE / MULTIFX

### BOSS FV/25 Volume/Expression
- **Type** : Pédale volume/expression
- **Style** : Modern
- **Bypass** : Buffer BOSS
- **Réglages** :
  - `Volume` : Knob (niveau)
  - `Taper` : Knob (courbe)
- **Fonctions** : Entrées/sorties séparées Volume et Exp
- **Checklist** : ✅ Fichier | 🎶 Audio | 🎛️ UI

### ISP Decimator II
- **Type** : Noise Gate haute performance
- **Style** : Modern
- **Bypass** : True bypass
- **Réglages** :
  - `Threshold` : Knob (seuil de suppression du bruit)
  - `Release` : Knob (durée de relâchement du gate)
- **Fonctions** : Pour rig high-gain
- **Checklist** : ✅ Fichier | 🎶 Audio | 🎛️ UI

### TC Electronic G-Major 2
- **Type** : Multi-effets rack (Delay/Chorus/Flanger/Pitch/Reverb/Comp)
- **Style** : Modern
- **Bypass** : Bypass (ou switch normal/effect)
- **Réglages** :
  - `Mix` : Knob (mix multi-effet)
  - `Type` : Switch Selector (0-5, défaut: 2)
    - Positions : DELAY, CHORUS, FLANGE, PITCH, REVERB, COMP
  - `Level` : Knob (volume)
- **Fonctions** : Fonctions avancées (notamment 200 presets rack, écran LCD)
- **Checklist** : ✅ Fichier | 🎶 Audio | 🎛️ UI

---

## 📊 Statistiques

- **Total de pédales** : 60+
- **Types de pédales** : 20 catégories
- **Types de contrôles** : 4 (Knob, Slider, Switch Selector, Switch)
- **Types de bypass** : 3 (True Bypass, Buffered Bypass, Relay Bypass)

### 🎯 État d'Implémentation Web Audio API

- ✅ **Pédales implémentées** : 60+ (100%)
- ✅ **Types d'effets supportés** : 19/20 (95%)
  - ✅ Overdrive, Distortion, Fuzz
  - ✅ Chorus, Flanger, Phaser, Tremolo
  - ✅ Delay, Reverb
  - ✅ EQ, Compressor, Noise Gate
  - ✅ Wah (AudioWorklet), Boost (Nodes natifs)
  - ✅ Octaver, Uni-Vibe, Pitch Shifter, Rotary (AudioWorklet)
  - ✅ Volume (Nodes natifs)
  - ⏳ Multifx (routing disponible, presets à implémenter)

### 🏗️ Architecture AudioWorklet

Les effets avancés utilisent **AudioWorkletProcessor** pour un DSP sample-accurate impossible avec les nodes standards :

#### 🎸 WAH (Vox, Cry Baby, Slash, KH95, RMC)
- **Processor** : `wah-processor.js`
- **DSP** : Filtre bandpass modulé (300Hz → 2kHz)
- **Technique** : Équation différentielle en temps réel
- **Algorithme** : `bp += w * (x - bp - hp * Q)` avec `w = 2πf/sampleRate`
- **Configurations spécifiques** : Chaque pédale utilise ses propres plages de fréquences (ex: Vox: sweep 300-2000 Hz default 800, Cry Baby: sweep 400-2300 Hz default 900)
- **Plages Q** : Vox (2-10 default 6), Cry Baby (4-12 default 7), Slash (4-12 default 8), EVH (3-10 default 6), KH95 (5-12 default 9), RMC (4-12 default 8)

#### 🎵 OCTAVIA (Roger Mayer)
- **Processor** : `octavia-processor.js`
- **DSP** : Redressement demi-onde + waveshaping + LPF 1kHz
- **Technique** : `Math.abs()` pour octave supérieure + `Math.tanh()` pour fuzz
- **Algorithme** : `halfWave = x > 0 ? x : 0` puis mix avec signal fuzzé

#### 🌊 UNI-VIBE (Shin-Ei)
- **Processor** : `univibe-processor.js`
- **DSP** : 4 filtres all-pass modulés par LFO sinusoïdal
- **Technique** : `y[n] = -a*x[n] + x[n-1] + a*y[n-1]` avec `a` modulé par LFO
- **Algorithme** : 4 étages en série, coefficient `a` variant selon `sin(phase)`

#### 🎹 PITCH SHIFTER / WHAMMY (DigiTech)
- **Processor** : `pitch-shifter-processor.js`
- **DSP** : Granular synthesis avec buffers circulaires
- **Technique** : Interpolation linéaire + ratio de pitch `2^(interval/12)`
- **Algorithme** : Buffer circulaire + read index avancé selon ratio

#### 🎡 ROTARY / LESLIE
- **Processor** : `rotary-processor.js`
- **DSP** : Doppler effect + crossfade horn/drum
- **Technique** : Délais modulés par LFO + crossfade dynamique
- **Algorithme** : 2 buffers (horn 5-8ms, drum 10-15ms) + crossfade selon LFO

#### 🎼 OCTAVER POLYPHONIQUE
- **Processor** : `octaver-processor.js`
- **DSP** : Pitch shifting pour octave -1, 0, +1
- **Technique** : Granular synthesis simplifiée
- **Algorithme** : Ratio 0.5x (-1 octave), 1x (original), 2x (+1 octave)

### 📁 Fichiers AudioWorklet

- **`public/worklets/wah-processor.js`** : 🎸 Processor WAH
- **`public/worklets/octavia-processor.js`** : 🎵 Processor Octavia
- **`public/worklets/univibe-processor.js`** : 🌊 Processor Uni-Vibe
- **`public/worklets/pitch-shifter-processor.js`** : 🎹 Processor Pitch Shifter
- **`public/worklets/rotary-processor.js`** : 🎡 Processor Rotary
- **`public/worklets/octaver-processor.js`** : 🎼 Processor Octaver
- **`frontend/src/audio/workletEffects.ts`** : 🔧 Wrappers TypeScript pour AudioWorklet

---

## 🎛️ Configuration Web Audio API

### 🏗️ Architecture du Pedalboard

L'implémentation Web Audio API suit cette architecture de routing modulaire :

```
🎤 Input → 🚪 NoiseGate → 📉 Compressor → 🎚️ EQ → 🎸 Wah → 📈 Boost
      → 🔥 Overdrive → ⚡ Distortion → 🤘 Fuzz → 🎵 Octaver → 🌊 Uni-Vibe
      → 🎹 Pitch → 🎡 Rotary → 🌀 Chorus → 🌫️ Flanger → 🌪️ Phaser → 🎚️ Tremolo
      → ⏱️ Delay → 🌌 Reverb → 🔊 Volume → 🏛️ CabSimulator → 🔊 Output
```

**Technologies utilisées** :
- **Web Audio API** : Routing, gain, filtres, convolution, delay (nodes standards)
- **AudioWorkletProcessor** : DSP temps réel pour effets avancés (WAH, Octavia, Uni-Vibe, Pitch, Rotary, Octaver)
- **Graph modulaire** : Routing dynamique via `PedalboardEngine`

### ✅ Implémentations Web Audio API

Tous les effets sont implémentés avec Web Audio API native (sans frameworks externes) :

#### 🔥 Overdrive
- **Node** : `WaveShaperNode` avec courbe asymétrique tube-like
- **Filtre** : `BiquadFilterNode` (lowpass) pour le tone
- **Mapping** : Drive (0-100) → 0.3-10, Tone (0-100) → 200-8000 Hz
- **Configurations spécifiques** : Chaque pédale utilise ses propres plages min/max/default (ex: TS9: drive 0.1-0.75 default 0.4, Klon: gain 0.05-0.6 default 0.25)
- **Status** : ✅ Implémenté avec support modes (SMOOTH, CRUNCH, BRIGHT)

#### ⚡ Distortion
- **Node** : `WaveShaperNode` avec courbe agressive
- **Filtre** : `BiquadFilterNode` (lowpass) pour le tone
- **Mapping** : Distortion (0-100) → 0.1-20, Tone (0-100) → 200-8000 Hz
- **Configurations spécifiques** : Chaque pédale utilise ses propres plages min/max/default (ex: DS-1: distortion 0.2-0.85 default 0.55, RAT: distortion 0.3-1.0 default 0.7)
- **Caractéristiques fréquentielles** : DS-1 (mid-scooped), RAT (fat mids), Big Muff (scooped mids)
- **Status** : ✅ Implémenté avec support modes (DARK, SI, LED)

#### 🤘 Fuzz
- **Node** : `WaveShaperNode` avec hard clipping (tanh)
- **Filtre** : `BiquadFilterNode` (lowpass) pour le tone
- **Gate** : Optionnel avec `AnalyserNode` pour gate dynamique
- **Mapping** : Fuzz (0-100) → 0.5-30, Tone (0-100) → 200-6000 Hz
- **Configurations spécifiques** : Chaque pédale utilise ses propres plages min/max/default (ex: Fuzz Face: fuzz 0.4-1.0 default 0.75, Big Muff: sustain 0.4-1.0 default 0.75)
- **Caractéristiques fréquentielles** : Fuzz Face (warm, vintage, dynamic), Big Muff (scooped mids, huge sustain), Fuzz Factory (unstable, oscillating)
- **Status** : ✅ Implémenté avec support modes (GATE, CLASSIC, MID+)

#### 🎚️ EQ
- **Nodes** : 3× `BiquadFilterNode` (lowshelf, peaking, highshelf)
- **Fréquences** : 200 Hz (bass), 1000 Hz (mid), 3000 Hz (treble)
- **Mapping** : ±15 dB pour chaque bande
- **Status** : ✅ Implémenté (3 bandes : Bass, Mid, Treble)

#### 📉 Compressor
- **Node** : `DynamicsCompressorNode` natif
- **Mapping** : Sensitivity (0-100) → -60 to 0 dB, Output (0-100) → 0-2
- **Status** : ✅ Implémenté

#### 🌀 Chorus
- **Nodes** : `DelayNode` + `OscillatorNode` (LFO) + `ChannelMergerNode`
- **Delay** : 20ms fixe, modulé par LFO
- **Mapping** : Rate (0-100) → 0.1-10 Hz, Depth (0-100) → 0.001-0.02
- **Configurations spécifiques** : Chaque pédale utilise ses propres plages min/max/default (ex: CH-1: rate 0.2-6 default 1.6, Small Clone: rate 0.1-4 default 1.2)
- **Caractéristiques fréquentielles** : CH-1 (digital, bright), Small Clone (warm, deep, analog), CE-1 (classic warm analog)
- **Status** : ✅ Implémenté avec support modes (LIGHT, MEDIUM, HEAVY)

#### 🌫️ Flanger
- **Nodes** : `DelayNode` + `OscillatorNode` (LFO) + feedback loop
- **Delay** : 5ms fixe, modulé par LFO
- **Mapping** : Rate (0-100) → 0.1-5 Hz, Feedback (0-100) → 0-0.8
- **Configurations spécifiques** : Chaque pédale utilise ses propres plages min/max/default (ex: BF-3: rate 0.1-8 default 0.8, Electric Mistress: rate 0.1-7 default 1.1)
- **Status** : ✅ Implémenté

#### 🌪️ Phaser
- **Nodes** : 4× `BiquadFilterNode` (allpass) + `OscillatorNode` (LFO)
- **Fréquences** : 800, 1000, 1200, 1400 Hz modulées
- **Mapping** : Rate (0-100) → 0.1-5 Hz, Depth (0-100) → 0-1
- **Configurations spécifiques** : Chaque pédale utilise ses propres plages min/max/default (ex: PH-3: rate 0.2-8 default 1.2, Small Stone: rate 0.2-7 default 1.1)
- **Status** : ✅ Implémenté

#### 🎚️ Tremolo
- **Nodes** : `GainNode` + `OscillatorNode` (LFO) + `ConstantSourceNode`
- **Formes d'onde** : Sine, Square, Sawtooth selon paramètre
- **Mapping** : Rate (0-100) → 0.5-15 Hz, Depth (0-100) → 0-1
- **Configurations spécifiques** : Chaque pédale utilise ses propres plages min/max/default (ex: TR-2: rate 0.1-12 default 4, Walrus: rate 0.1-12 default 5)
- **Status** : ✅ Implémenté avec support modes (SINE, SQUARE, SAWTOOTH)

#### ⏱️ Delay
- **Nodes** : `DelayNode` + feedback loop + `ChannelMergerNode`
- **Mapping** : Time (0-100) → 0.01-1 second, Feedback (0-100) → 0-0.9
- **Configurations spécifiques** : Chaque pédale utilise ses propres plages min/max/default (ex: DD-3: time 0.02-0.8 default 0.45, Timeline: time 0.01-2.0 default 0.45)
- **Caractéristiques fréquentielles** : DD-3 (clean digital), Echoplex (tape with preamp coloration), Memory Man (analog BBD, dark, modulated), RE-201 (tape echo with wow/flutter)
- **Status** : ✅ Implémenté avec support modes (DIGITAL, ANALOG, REVERSE) + IR personnalisées

#### 🌌 Reverb
- **Node** : `ConvolverNode` avec Impulse Response
- **IR** : Générée synthétiquement ou chargée depuis fichier
- **Mapping** : Decay (0-100) → 0.1-10 seconds, Mix (0-100) → 0-1
- **Configurations spécifiques** : Chaque pédale utilise ses propres plages min/max/default (ex: RV-6: decay 0.3-8.0 default 2.5, BigSky: decay 0.3-12.0 default 4.0)
- **Caractéristiques fréquentielles** : Holy Grail (spring), Walrus (modes: HALL large spacious, SPRING drippy boingy, PLATE bright metallic)
- **Status** : ✅ Implémenté avec support modes (HALL, SPRING, PLATE) + IR personnalisées

#### 🚪 Noise Gate
- **Nodes** : `AnalyserNode` + `GainNode` avec contrôle dynamique
- **Mapping** : Threshold (0-100) → -60 to -10 dB, Release (0-100) → 0.01-1 second
- **Status** : ✅ Implémenté

#### 🏛️ Cabinet Simulator
- **Node** : `ConvolverNode` avec IR de baffle
- **IR** : Chargée depuis fichier (4x12 Marshall, Fender Twin, etc.)
- **Status** : ✅ Implémenté (via IR personnalisées)

### 📁 Fichiers de Configuration

- **`frontend/src/audio/config.ts`** : ⚙️ Configuration globale et mapping des paramètres
- **`frontend/src/audio/effects.ts`** : 🎵 Implémentations des effets standards (Web Audio API nodes)
- **`frontend/src/audio/workletEffects.ts`** : 🎛️ Implémentations des effets avancés (AudioWorklet)
- **`frontend/src/audio/modeEffects.ts`** : 🎛️ Effets avec support des modes (switch-selector)
- **`frontend/src/audio/PedalboardEngine.ts`** : 🔧 Moteur de routing modulaire
- **`frontend/src/audio/__tests__/effects.test.ts`** : ✅ Tests unitaires
- **`frontend/src/hooks/usePedalboardEngine.ts`** : 🪝 Hook React pour gestion du moteur
- **`public/worklets/*.js`** : 🔧 AudioWorklet Processors (WAH, Octavia, Uni-Vibe, Pitch, Rotary, Octaver)

### Utilisation

```typescript
import { PedalboardEngine } from './audio/PedalboardEngine'
import { pedalLibrary } from './data/pedals'

// Créer le moteur
const engine = new PedalboardEngine()

// Ajouter un effet
const pedalModel = pedalLibrary.find(p => p.id === 'boss-ds1')
if (pedalModel) {
  await engine.addEffect(pedalModel, {
    distortion: 60,
    tone: 50,
    level: 70
  })
}

// Connecter une source audio
const source = audioCtx.createMediaStreamSource(stream)
source.connect(engine.getInput())

// Démarrer
await engine.start()
```

### 🎛️ Support des Modes (Switch-Selector)

Les pédales avec paramètre `mode` (switch-selector) utilisent des implémentations spécialisées :

#### 🔥 Overdrive avec modes
- **SMOOTH** 🌊 : Courbe douce au silicium
- **CRUNCH** ⚡ : Clipping silicium plus dur
- **BRIGHT** ☀️ : Crunch + coupe-bas

#### ⚡ Distortion avec modes
- **DARK** 🌑 : Clipping silicium asymétrique + coupe-bas
- **SI** 🔌 : Clipping silicium classique
- **LED** 💡 : Clipping via diodes LED, son plus dynamique

#### 🤘 Fuzz avec modes
- **GATE** 🚪 : Polarisation basse, son "haché/gate"
- **CLASSIC** 🎸 : Fuzz classique avec scoop médiums
- **MID+** 📈 : Boost médiums

#### 🌀 Chorus avec modes
- **LIGHT** 💫 : Chorus doux, analog style
- **MEDIUM** ⚖️ : Multi-tap modéré
- **HEAVY** 💥 : Chorus trilinéaire prononcé

#### ⏱️ Delay avec modes
- **DIGITAL** 💻 : Delay numérique propre
- **ANALOG** 📻 : Delay avec filtrage analogique
- **REVERSE** 🔄 : Delay inversé

#### 🌌 Reverb avec modes
- **HALL** 🏛️ : Grande salle
- **SPRING** 🪝 : Ressorts
- **PLATE** 🍽️ : Dense

#### 🎚️ Tremolo avec modes
- **SINE** 📈 : Forme d'onde sinusoïdale
- **SQUARE** ▢ : Forme d'onde carrée
- **SAWTOOTH** 🔺 : Forme d'onde en dents de scie

### 📤 Chargement d'IR Personnalisées

Les effets Reverb et Delay supportent le chargement d'Impulse Responses personnalisées :

- **Format supporté** : 📄 WAV, MP3, OGG
- **Interface** : 🔼 Bouton "Upload" sur les pédales Reverb/Delay
- **Stockage** : 💾 URL temporaire (blob) ou fichier local
- **Application** : 🔄 L'IR remplace l'IR synthétique par défaut

### ✅ Tests Unitaires

Tous les effets ont des tests unitaires dans `frontend/src/audio/__tests__/effects.test.ts` :

- ✅ 🔥 Overdrive
- ✅ ⚡ Distortion
- ✅ 🤘 Fuzz
- ✅ 🎚️ EQ
- ✅ 📉 Compressor
- ✅ 🌀 Chorus
- ✅ 🌫️ Flanger
- ✅ 🌪️ Phaser
- ✅ 🎚️ Tremolo
- ✅ ⏱️ Delay
- ✅ 🚪 Noise Gate

### 🔗 Intégration dans Pedalboard.tsx

Le `PedalboardEngine` est maintenant intégré dans le composant `Pedalboard.tsx` :

- ✅ 🔄 Synchronisation automatique des effets UI ↔ Audio
- ✅ ⚡ Mise à jour en temps réel des paramètres
- ✅ 🔌 Activation/désactivation (bypass) connectée
- ✅ 🎛️ Support des modes via switch-selector
- ✅ 📤 Chargement d'IR personnalisées via modal
- ✅ 🪝 Hook `usePedalboardEngine` pour la gestion du moteur

---

## 📊 État d'Avancement par Pédale

### ✅ Pédales avec Configuration Web Audio API Complète

#### 🔥 DISTORTION
- ✅ **BOSS DS-1** → `makeDistortion()` (distortion, tone, level)
- ✅ **Pro Co RAT** → `makeDistortion()` (distortion, filter, volume)
- ✅ **Ibanez Tube Screamer TS-9** → `makeOverdrive()` (drive, tone, level)
- ✅ **Electro-Harmonix Big Muff Pi** → `makeFuzz()` (sustain, tone, volume)
- ✅ **Walrus Audio Fundamental Distortion** → `makeDistortionWithMode()` (gain, tone, vol, mode: DARK/SI/LED)

#### 🔥 OVERDRIVE
- ✅ **BOSS SD-1** → `makeOverdrive()` (drive, tone, level)
- ✅ **Fulltone OCD** → `makeOverdrive()` (drive, tone, volume) + mode HP/LP
- ✅ **Klon Centaur** → `makeOverdrive()` (gain, treble, output)
- ✅ **Ibanez TS Mini** → `makeOverdrive()` (drive, tone, level)
- ✅ **Walrus Audio Fundamental Drive** → `makeOverdriveWithMode()` (gain, tone, vol, mode: SMOOTH/CRUNCH/BRIGHT)

#### 🤘 FUZZ
- ✅ **Dunlop Fuzz Face** → `makeFuzz()` (fuzz, volume)
- ✅ **ZVEX Fuzz Factory** → `makeFuzz()` (gate, comp, drive, stab, volume)
- ✅ **Electro-Harmonix Big Muff** → `makeFuzz()` (sustain, tone, volume)
- ✅ **Walrus Audio Fundamental Fuzz** → `makeFuzzWithMode()` (gain, tone, vol, mode: GATE/CLASSIC/MID+)

#### 🌀 CHORUS
- ✅ **BOSS CH-1 Super Chorus** → `makeChorus()` (rate, depth, equalizer, level)
- ✅ **Electro-Harmonix Small Clone** → `makeChorus()` (rate, depth)
- ✅ **Walrus Audio Fundamental Chorus** → `makeChorusWithMode()` (rate, depth, mix, mode: LIGHT/MEDIUM/HEAVY)
- ✅ **Electro-Harmonix Oceans 11** → `makeChorus()` (rate, depth, mix)
- ✅ **BOSS CE-1 Chorus Ensemble** → `makeChorus()` (rate, depth, level)
- ✅ **MXR Analog Chorus** → `makeChorus()` (rate, depth, level)

#### ⏱️ DELAY
- ✅ **BOSS DD-3 Digital Delay** → `makeDelay()` (time, feedback, level)
- ✅ **TC Electronic Flashback** → `makeDelay()` (time, feedback, mix)
- ✅ **Walrus Audio Fundamental Delay** → `makeDelayWithMode()` (time, feedback, mix, mode: DIGITAL/ANALOG/REVERSE)
- ✅ **Strymon TimeLine** → `makeDelay()` (time, repeats, mix)
- ✅ **Maestro Echoplex EP-3** → `makeDelay()` (time, repeat, mix/level)
- ✅ **Binson Echorec** → `makeDelay()` (repeat, tone)
- ✅ **Electro-Harmonix Deluxe Memory Man** → `makeDelay()` (delay, feedback, blend)
- ✅ **Roland Space Echo (RE-201)** → `makeDelay()` (repeat, intensity, echo volume)
- ✅ **TC Electronic 2290** → `makeDelay()` (delay, feedback, mix)

#### 🌌 REVERB
- ✅ **BOSS RV-6** → `makeReverb()` (decay, tone, level)
- ✅ **Electro-Harmonix Holy Grail** → `makeReverb()` (reverb)
- ✅ **Walrus Audio Fundamental Reverb** → `makeReverbWithMode()` (decay, tone, mix, mode: HALL/SPRING/PLATE)
- ✅ **Strymon BigSky** → `makeReverb()` (decay, tone, mix)

#### 🌫️ FLANGER
- ✅ **BOSS BF-3** → `makeFlanger()` (rate, depth, manual, resonance)
- ✅ **Electro-Harmonix Electric Mistress** → `makeFlanger()` (rate, range, color)
- ✅ **Walrus Audio Fundamental Flanger** → `makeFlanger()` (rate, depth, feedback)
- ✅ **Mooer E-Lady** → `makeFlanger()` (rate, range, color)
- ✅ **MXR Flanger 117** → `makeFlanger()` (rate, width, regen, manual)

#### 🎚️ TREMOLO
- ✅ **BOSS TR-2** → `makeTremolo()` (rate, depth, wave)
- ✅ **Walrus Audio Fundamental Tremolo** → `makeTremoloWithMode()` (rate, depth, vol, wave: SINE/SQUARE/RANDOM)
- ✅ **Fulltone Supa-Trem** → `makeTremolo()` (speed, depth, volume)
- ✅ **Strymon Flint** → `makeTremolo()` (rate, depth, intensity)

#### 🌪️ PHASER
- ✅ **BOSS PH-3** → `makePhaser()` (rate, depth, resonance)
- ✅ **Electro-Harmonix Small Stone** → `makePhaser()` (rate, color)
- ✅ **Mooer Phase 90** → `makePhaser()` (rate, depth)
- ✅ **Walrus Audio Fundamental Phaser** → `makePhaser()` (rate, feedback, depth, mode)
- ✅ **MXR Phase 90** → `makePhaser()` (rate, mix)

#### 🎚️ EQ
- ✅ **BOSS GE-7** → `makeEQ()` (7 bandes : 100Hz, 200Hz, 400Hz, 800Hz, 1.6kHz, 3.2kHz, 6.4kHz, level)
- ✅ **MXR 10-Band EQ** → `makeEQ()` (10 bandes : 31Hz à 16kHz, level)
- ✅ **Source Audio Programmable EQ** → `makeEQ()` (low, low mid, mid, high mid, high, level)
- ✅ **Empress ParaEQ** → `makeEQ()` (low, mid, high, level)

#### 📉 COMPRESSEUR
- ✅ **MXR Dyna Comp** → `makeCompressor()` (output, sensitivity)

#### 🚪 NOISE GATE
- ✅ **ISP Decimator II** → `makeNoiseGate()` (threshold, release)

### ✅ Pédales avec Configuration Web Audio API via AudioWorklet

#### 🎸 WAH (AudioWorklet)
- ✅ **Vox V847 Wah** → `makeWah()` (sweep, Q, level) - Filtre bandpass modulé
- ✅ **Dunlop Cry Baby (GCB-95)** → `makeWah()` (sweep, Q, volume)
- ✅ **Dunlop Slash Wah SW95** → `makeWah()` (sweep, Q, boost)
- ✅ **Dunlop MXR EVH Signature Wah** → `makeWah()` (sweep, Q, volume)
- ✅ **Dunlop MXR KH95 Wah** → `makeWah()` (sweep, Q, gain)
- ✅ **RMC Custom Wah** → `makeWah()` (sweep, Q, bass)

#### 📈 BOOST (Nodes natifs)
- ✅ **Colorsound Power Booster** → `makeBoost()` (gain, treble, bass) - Gain + EQ shelving
- ✅ **Custom Clean Boost** → `makeBoost()` (level, tone)
- ✅ **MXR MC-402 Boost/OD** → `makeBoost()` + `makeOverdrive()` (boost, drive, tone)

#### 🎵 OCTAVER / VIBE / PITCH / ROTARY (AudioWorklet)
- ✅ **Roger Mayer Octavia** → `makeOctavia()` (fuzz, octave, level) - Redressement demi-onde + fuzz
- ✅ **Shin-ei Uni-Vibe** → `makeUniVibe()` (speed, intensity, mix) - 4 all-pass modulés
- ✅ **DigiTech Whammy** → `makePitchShifter()` (interval, mix, tracking) - Granular pitch shifting
- ✅ **Leslie Rotary Simulator** → `makeRotary()` (speed, depth, mix) - Doppler effect + crossfade

#### 🔊 VOLUME (Nodes natifs)
- ✅ **BOSS FV/25 Volume/Expression** → `makeVolume()` (volume, taper) - Gain avec taper log/lin

#### 🎛️ MULTIFX
- ⏳ **TC Electronic G-Major 2** → Routing multi-effets disponible via `PedalboardEngine` (delay, chorus, flanger, pitch, reverb, comp)

---

*Document mis à jour selon les spécifications constructeur réelles et implémentations Web Audio API avec support des modes et IR personnalisées*

---

## 🗂️ Suivi des fichiers spécifiques (génération automatique)

Tous les composants dédiés ont été générés dans `frontend/src/components/pedals/` :

- [x] boss-ds1 → `frontend/src/components/pedals/boss-ds1.tsx`
- [x] proco-rat → `frontend/src/components/pedals/proco-rat.tsx`
- [x] ibanez-tube-screamer → `frontend/src/components/pedals/ibanez-tube-screamer.tsx`
- [x] electro-harmonix-big-muff → `frontend/src/components/pedals/electro-harmonix-big-muff.tsx`
- [x] walrus-audio-distortion → `frontend/src/components/pedals/walrus-audio-distortion.tsx`
- [x] boss-sd1 → `frontend/src/components/pedals/boss-sd1.tsx`
- [x] fulltone-ocd → `frontend/src/components/pedals/fulltone-ocd.tsx`
- [x] klon-centaur → `frontend/src/components/pedals/klon-centaur.tsx`
- [x] ibanez-tube-screamer-mini → `frontend/src/components/pedals/ibanez-tube-screamer-mini.tsx`
- [x] walrus-audio-drive → `frontend/src/components/pedals/walrus-audio-drive.tsx`
- [x] dunlop-fuzz-face → `frontend/src/components/pedals/dunlop-fuzz-face.tsx`
- [x] zvex-fuzz-factory → `frontend/src/components/pedals/zvex-fuzz-factory.tsx`
- [x] electro-harmonix-muff → `frontend/src/components/pedals/electro-harmonix-muff.tsx`
- [x] walrus-audio-fuzz → `frontend/src/components/pedals/walrus-audio-fuzz.tsx`
- [x] boss-ch1 → `frontend/src/components/pedals/boss-ch1.tsx`
- [x] electro-harmonix-small-clone → `frontend/src/components/pedals/electro-harmonix-small-clone.tsx`
- [x] walrus-audio-chorus → `frontend/src/components/pedals/walrus-audio-chorus.tsx`
- [x] electro-harmonix-oceans-11 → `frontend/src/components/pedals/electro-harmonix-oceans-11.tsx`
- [x] boss-ce1 → `frontend/src/components/pedals/boss-ce1.tsx`
- [x] mxr-analog-chorus → `frontend/src/components/pedals/mxr-analog-chorus.tsx`
- [x] boss-dd3 → `frontend/src/components/pedals/boss-dd3.tsx`
- [x] tc-electronic-flashback → `frontend/src/components/pedals/tc-electronic-flashback.tsx`
- [x] walrus-audio-delay → `frontend/src/components/pedals/walrus-audio-delay.tsx`
- [x] strymon-timeline → `frontend/src/components/pedals/strymon-timeline.tsx`
- [x] echoplex-tape-delay → `frontend/src/components/pedals/echoplex-tape-delay.tsx`
- [x] binson-echorec → `frontend/src/components/pedals/binson-echorec.tsx`
- [x] memory-man-delay → `frontend/src/components/pedals/memory-man-delay.tsx`
- [x] roland-space-echo → `frontend/src/components/pedals/roland-space-echo.tsx`
- [x] tc-delay → `frontend/src/components/pedals/tc-delay.tsx`
- [x] boss-rv6 → `frontend/src/components/pedals/boss-rv6.tsx`
- [x] electro-harmonix-holy-grail → `frontend/src/components/pedals/electro-harmonix-holy-grail.tsx`
- [x] walrus-audio-reverb → `frontend/src/components/pedals/walrus-audio-reverb.tsx`
- [x] strymon-bigsky → `frontend/src/components/pedals/strymon-bigsky.tsx`
- [x] boss-bf3 → `frontend/src/components/pedals/boss-bf3.tsx`
- [x] electro-harmonix-electric-mistress → `frontend/src/components/pedals/electro-harmonix-electric-mistress.tsx`
- [x] walrus-audio-flanger → `frontend/src/components/pedals/walrus-audio-flanger.tsx`
- [x] mooer-e-lady → `frontend/src/components/pedals/mooer-e-lady.tsx`
- [x] mxr-flanger-117 → `frontend/src/components/pedals/mxr-flanger-117.tsx`
- [x] boss-tr2 → `frontend/src/components/pedals/boss-tr2.tsx`
- [x] walrus-audio-tremolo → `frontend/src/components/pedals/walrus-audio-tremolo.tsx`
- [x] fulltone-supatrem → `frontend/src/components/pedals/fulltone-supatrem.tsx`
- [x] strymon-flint → `frontend/src/components/pedals/strymon-flint.tsx`
- [x] boss-ph3 → `frontend/src/components/pedals/boss-ph3.tsx`
- [x] electro-harmonix-small-stone → `frontend/src/components/pedals/electro-harmonix-small-stone.tsx`
- [x] mooer-phaser → `frontend/src/components/pedals/mooer-phaser.tsx`
- [x] walrus-audio-phaser → `frontend/src/components/pedals/walrus-audio-phaser.tsx`
- [x] mxr-phase90 → `frontend/src/components/pedals/mxr-phase90.tsx`
- [x] boss-ge7 → `frontend/src/components/pedals/boss-ge7.tsx`
- [x] mxr-10-band-eq → `frontend/src/components/pedals/mxr-10-band-eq.tsx`
- [x] source-audio-programmable-eq → `frontend/src/components/pedals/source-audio-programmable-eq.tsx`
- [x] empress-paraeq → `frontend/src/components/pedals/empress-paraeq.tsx`
- [x] vox-v847-wah → `frontend/src/components/pedals/vox-v847-wah.tsx`
- [x] cry-baby-wah → `frontend/src/components/pedals/cry-baby-wah.tsx`
- [x] slash-wah-sw95 → `frontend/src/components/pedals/slash-wah-sw95.tsx`
- [x] evh-wah → `frontend/src/components/pedals/evh-wah.tsx`
- [x] kh95-wah → `frontend/src/components/pedals/kh95-wah.tsx`
- [x] rmc-wah → `frontend/src/components/pedals/rmc-wah.tsx`
- [x] power-booster → `frontend/src/components/pedals/power-booster.tsx`
- [x] light-boost → `frontend/src/components/pedals/light-boost.tsx`
- [x] mxr-mc402 → `frontend/src/components/pedals/mxr-mc402.tsx`
- [x] mxr-dyna-comp → `frontend/src/components/pedals/mxr-dyna-comp.tsx`
- [x] octavia-fuzz → `frontend/src/components/pedals/octavia-fuzz.tsx`
- [x] univibe → `frontend/src/components/pedals/univibe.tsx`
- [x] digitech-whammy → `frontend/src/components/pedals/digitech-whammy.tsx`
- [x] leslie-rotary → `frontend/src/components/pedals/leslie-rotary.tsx`
- [x] boss-volume-expression → `frontend/src/components/pedals/boss-volume-expression.tsx`
- [x] noise-gate → `frontend/src/components/pedals/noise-gate.tsx`
- [x] tc-gmajor2 → `frontend/src/components/pedals/tc-gmajor2.tsx`
- [x] ibanez-jemini → `frontend/src/components/pedals/ibanez-jemini.tsx`
- [x] satchurator → `frontend/src/components/pedals/satchurator.tsx`
- [x] boss-od1 → `frontend/src/components/pedals/boss-od1.tsx`
- [x] mesa-grid-slammer → `frontend/src/components/pedals/mesa-grid-slammer.tsx`
- [x] jhs-at-drive → `frontend/src/components/pedals/jhs-at-drive.tsx`
- [x] boss-ce2 → `frontend/src/components/pedals/boss-ce2.tsx`
- [x] eventide-harmonizer → `frontend/src/components/pedals/eventide-harmonizer.tsx`
- [x] vox-time-machine → `frontend/src/components/pedals/vox-time-machine.tsx`
- [x] neunaber-reverb → `frontend/src/components/pedals/neunaber-reverb.tsx`
- [x] killswitch-stutter → `frontend/src/components/pedals/killswitch-stutter.tsx`
- [x] morley-bad-horsie → `frontend/src/components/pedals/morley-bad-horsie.tsx`
- [x] treble-booster → `frontend/src/components/pedals/treble-booster.tsx`
- [x] dunlop-crybaby-classic → `frontend/src/components/pedals/dunlop-crybaby-classic.tsx`

> Généré automatiquement via `scripts/generatePedalComponents.js` à partir du `pedalLibrary`.
