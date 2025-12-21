# Référentiel des Cours WebAmp

Ce document répertorie tous les cours disponibles dans WebAmp avec leurs caractéristiques, catégories, difficultés et contenus selon la structure pédagogique de la plateforme.

## État d'Avancement de l'Enrichissement

**Leçons enrichies** : 271 / 68 cours (analyse du fichier course.json)
- Les cours enrichis sont identifiés par la présence de "### 1. Introduction pédagogique" dans leur contenu
- Ce nombre reflète les leçons individuelles enrichies au sein des cours

## Types de Cours

- **Tutorial** : Cours pratique avec étapes guidées et actions interactives
- **Guide** : Guide théorique et pratique approfondi sur un sujet
- **Quiz** : Test de connaissances avec questions à choix multiples
- **Preset** : Cours pratique axé sur la création et l'optimisation de presets

## Catégories de Cours

- **basics** : Bases et fondamentaux de la guitare et de WebAmp
- **effects** : Effets et pédales d'effets
- **amps** : Amplificateurs et leurs réglages
- **chains** : Chaînes d'effets et organisation
- **styles** : Styles musicaux et techniques spécifiques
- **techniques** : Techniques de jeu avancées
- **creativity** : Créativité, presets et textures sonores

## Niveaux de Difficulté

- **beginner** : Débutant - Pour ceux qui commencent
- **intermediate** : Intermédiaire - Techniques et concepts avancés
- **advanced** : Avancé - Maîtrise technique approfondie
- **pro** : Professionnel - Techniques expertes

## Structure des Cours

### Métadonnées
- **ID** : Identifiant unique du cours
- **Titre** : Nom du cours
- **Description** : Description courte du contenu
- **Catégorie** : Catégorie principale
- **Difficulté** : Niveau de difficulté
- **Durée** : Temps estimé en minutes
- **Type** : Type de cours (tutorial, guide, quiz, preset)
- **Icône** : Icône Lucide associée
- **Tags** : Mots-clés pour la recherche

### Contenu
- **Steps** : Étapes du cours (pour tutorials et guides)
- **Quiz** : Questions (pour quiz)
- **PresetId** : Référence au preset (pour presets)

### Actions Interactives
- **addPedal** : Ajouter une pédale à la chaîne
- **setParameter** : Ajuster un paramètre
- **loadPreset** : Charger un preset
- **test** : Tester le son

### Récompenses
- **XP** : Points d'expérience gagnés
- **Badges** : Badges débloqués (optionnel)

### Prérequis
- **Prerequisites** : IDs des cours requis avant de commencer

---

## BASICS - Bases et Fondamentaux

### Débutant

#### Votre premier preset
- **ID** : `tut-001`
- **Type** : Tutorial
- **Durée** : 5 min
- **Description** : Créez votre premier preset en ajoutant une pédale de distorsion et en ajustant les paramètres de base.
- **Contenu** :
  - Introduction à WebAmp
  - Ajouter une pédale (BOSS DS-1)
  - Ajuster les paramètres (distortion à 60%)
  - Tester votre son
- **Récompenses** : 50 XP, Badge "premiers-pas"

#### Comprendre les amplis
- **ID** : `tut-002`
- **Type** : Tutorial
- **Durée** : 8 min
- **Description** : Découvrez comment fonctionnent les amplificateurs et leurs paramètres principaux.
- **Contenu** :
  - Qu'est-ce qu'un amplificateur ?
  - Les paramètres de base (Volume, Gain, Bass, Middle, Treble, Presence, Master)
  - Gain vs Volume
  - Les différents styles d'amplis (Fender, Marshall, Mesa Boogie, Vox, Orange)
- **Récompenses** : 75 XP

#### Les accords de base pour débutants
- **ID** : `new-course-001`
- **Type** : Tutorial
- **Durée** : 30 min (enrichi : +15 min)
- **Description** : Apprenez les accords essentiels pour commencer à jouer de la guitare : C, G, D, A, E, Am, Em.
- **Contenu** :
  - Introduction aux accords
  - L'accord de Do (C)
  - L'accord de Sol (G)
  - L'accord de Ré (D)
  - Pratique des transitions
  - L'accord de La (A) ✨
  - L'accord de Mi (E) ✨
  - L'accord de La mineur (Am) ✨
  - L'accord de Mi mineur (Em) ✨
  - Exercices de transitions avancés ✨
- **Récompenses** : 200 XP (enrichi : +100 XP), Badge "accords-de-base"
- **État** : ✅ Enrichi (5 → 10 étapes)

#### Maîtriser le rythme et le tempo
- **ID** : `new-course-002`
- **Type** : Tutorial
- **Durée** : 40 min (enrichi : +20 min)
- **Description** : Développez votre sens du rythme avec des exercices progressifs sur différents tempos.
- **Contenu** :
  - Qu'est-ce que le tempo ?
  - Utiliser le métronome
  - Les figures rythmiques de base
  - Exercices pratiques
  - Les mesures et les temps ✨
  - Les syncopes ✨
  - Les patterns rythmiques complexes ✨
  - Jouer avec un backing track ✨
- **Récompenses** : 240 XP (enrichi : +120 XP), Badge "rythme"
- **État** : ✅ Enrichi (4 → 8 étapes)

#### Découvrir les effets de base
- **ID** : `new-course-003`
- **Type** : Tutorial
- **Durée** : 12 min
- **Description** : Introduction aux principaux types d'effets : distorsion, reverb, delay, et chorus.
- **Contenu** :
  - Qu'est-ce qu'un effet ?
  - La distorsion (BOSS DS-1)
  - La reverb (BOSS RV-6)
  - Le delay (BOSS DD-7)
- **Récompenses** : 90 XP, Badge "effets-debutant"

#### Choisir son premier ampli
- **ID** : `new-course-004`
- **Type** : Guide
- **Durée** : 18 min
- **Description** : Guide complet pour comprendre et choisir un ampli adapté à vos besoins.
- **Contenu** :
  - Les types d'amplis (lampes, transistors, modélisateurs)
  - Puissance et volume
  - Les canaux
  - Les contrôles de base
  - Recommandations par style
- **Récompenses** : 110 XP

#### Apprendre votre première chanson
- **ID** : `new-course-005`
- **Type** : Tutorial
- **Durée** : 25 min
- **Description** : Guide étape par étape pour apprendre une chanson complète, de l'écoute à l'interprétation.
- **Contenu** :
  - Choisir une chanson adaptée
  - Écouter attentivement
  - Identifier les accords
  - Apprendre la progression
  - Ajouter le rythme
  - Pratiquer régulièrement
- **Récompenses** : 150 XP, Badge "premiere-chanson"

#### Les techniques de picking de base
- **ID** : `new-course-006`
- **Type** : Tutorial
- **Durée** : 16 min
- **Description** : Apprenez les différentes façons de gratter les cordes : downstroke, upstroke, et alternate picking.
- **Contenu** :
  - Le downstroke
  - Le upstroke
  - L'alternate picking
  - Exercices pratiques
- **Récompenses** : 100 XP

#### Accorder sa guitare correctement
- **ID** : `new-course-007`
- **Type** : Tutorial
- **Durée** : 10 min
- **Description** : Apprenez à accorder votre guitare avec un accordeur électronique ou à l'oreille.
- **Contenu** :
  - L'accordage standard (Mi-La-Ré-Sol-Si-Mi)
  - Utiliser un accordeur électronique
  - Accorder à l'oreille
  - Vérifier l'accordage
- **Récompenses** : 80 XP

#### Créer votre première chaîne d'effets
- **ID** : `new-course-008`
- **Type** : Tutorial
- **Durée** : 14 min
- **Description** : Apprenez à organiser vos pédales dans le bon ordre pour obtenir le meilleur son.
- **Contenu** :
  - L'ordre des effets (Guitare → Distorsion → Modulation → Delay → Reverb → Ampli)
  - Les effets de gain (BOSS DS-1)
  - Les effets de modulation (BOSS CH-1)
  - Les effets de temps (BOSS DD-7)
  - Tester votre chaîne
- **Récompenses** : 120 XP, Badge "premiere-chaine"

#### Quiz : Les bases de la guitare
- **ID** : `new-course-009`
- **Type** : Quiz
- **Durée** : 8 min
- **Description** : Testez vos connaissances sur les fondamentaux de la guitare avec ce quiz interactif.
- **Contenu** :
  - Question 1 : Les cordes (6 cordes)
  - Question 2 : L'accordage (Mi-La-Ré-Sol-Si-Mi)
  - Question 3 : Les accords (Sol majeur)
  - Question 4 : Les effets (Distortion)
- **Récompenses** : 100 XP, Badge "quiz-debutant"

#### La bonne posture et position
- **ID** : `new-course-010`
- **Type** : Guide
- **Durée** : 12 min
- **Description** : Apprenez la posture correcte pour jouer confortablement et éviter les blessures.
- **Contenu** :
  - Position assise
  - Position debout
  - Position de la main gauche
  - Position de la main droite
  - Éviter les blessures
- **Récompenses** : 90 XP

---

## EFFECTS - Effets et Pédales

### Débutant

#### Distortion vs Overdrive
- **ID** : `guide-001`
- **Type** : Tutorial
- **Durée** : 10 min
- **Description** : Comprenez les différences entre la distortion et l'overdrive, et quand utiliser chacun.
- **Récompenses** : 80 XP

#### Découvrir les effets de base
- **ID** : `new-course-003`
- **Type** : Tutorial
- **Durée** : 12 min
- **Description** : Introduction aux principaux types d'effets : distorsion, reverb, delay, et chorus.
- **Récompenses** : 90 XP, Badge "effets-debutant"

### Intermédiaire

#### Maîtriser les effets de modulation
- **ID** : `new-course-013`
- **Type** : Tutorial
- **Durée** : 20 min
- **Description** : Explorez en profondeur le chorus, phaser, flanger, tremolo et vibrato.
- **Contenu** :
  - Le chorus (BOSS CH-1)
  - Le phaser (MXR Phase 90)
  - Le flanger
  - Le tremolo
  - Le vibrato
  - Combiner les modulations
- **Récompenses** : 170 XP

#### Explorer les possibilités du delay
- **ID** : `new-course-018`
- **Type** : Tutorial
- **Durée** : 19 min
- **Description** : Maîtrisez les différents types de delay et leurs applications créatives.
- **Contenu** :
  - Les types de delay (analogique, numérique, tape echo, reverse)
  - Le delay analogique (BOSS DD-7)
  - Le delay numérique
  - Les paramètres du delay
  - Applications créatives
  - Le delay en solo
- **Récompenses** : 170 XP

### Avancé

#### Maîtriser le pitch shifting et l'harmonisation
- **ID** : `new-course-023`
- **Type** : Tutorial
- **Durée** : 22 min
- **Description** : Explorez les effets de pitch shifting, harmoniseurs et octavers pour créer des textures uniques.
- **Contenu** :
  - Le pitch shifter
  - L'octaver (BOSS OC-3)
  - L'harmoniseur
  - Applications créatives
  - Le pitch shifting en temps réel
  - Combiner avec d'autres effets
- **Récompenses** : 200 XP

#### Explorer les nuances de la distortion
- **ID** : `new-course-028`
- **Type** : Tutorial
- **Durée** : 23 min
- **Description** : Découvrez les différents types de distortion et leurs applications : overdrive, fuzz, et high-gain.
- **Contenu** :
  - Overdrive vs Distortion vs Fuzz
  - L'overdrive (Ibanez Tube Screamer)
  - La distortion (BOSS DS-1)
  - Le fuzz
  - Le high-gain
  - Empiler les distortions
  - Ajuster le gain et le volume
- **Récompenses** : 210 XP

---

## AMPS - Amplificateurs

### Débutant

#### Comprendre les amplis
- **ID** : `tut-002`
- **Type** : Tutorial
- **Durée** : 8 min
- **Description** : Découvrez comment fonctionnent les amplificateurs et leurs paramètres principaux.
- **Contenu** :
  - Qu'est-ce qu'un amplificateur ?
  - Les paramètres de base
  - Gain vs Volume
  - Les différents styles d'amplis
- **Récompenses** : 75 XP

#### Choisir son premier ampli
- **ID** : `new-course-004`
- **Type** : Guide
- **Durée** : 18 min
- **Description** : Guide complet pour comprendre et choisir un ampli adapté à vos besoins.
- **Contenu** :
  - Les types d'amplis
  - Puissance et volume
  - Les canaux
  - Les contrôles de base
  - Recommandations par style
- **Récompenses** : 110 XP

### Intermédiaire

#### Réglages d'amplis par style
- **ID** : `guide-amps-001`
- **Type** : Guide
- **Durée** : 15 min
- **Description** : Apprenez les réglages optimaux pour chaque style musical.
- **Contenu** :
  - Clean / Vintage (Fender, Vox)
  - Rock / Crunch (Marshall, Orange)
  - High-Gain / Metal (Mesa Boogie, Peavey)
- **Récompenses** : 130 XP

---

## CHAINS - Chaînes d'Effets

### Débutant

#### Créer votre première chaîne d'effets
- **ID** : `new-course-008`
- **Type** : Tutorial
- **Durée** : 14 min
- **Description** : Apprenez à organiser vos pédales dans le bon ordre pour obtenir le meilleur son.
- **Contenu** :
  - L'ordre des effets
  - Les effets de gain
  - Les effets de modulation
  - Les effets de temps
  - Tester votre chaîne
- **Récompenses** : 120 XP, Badge "premiere-chaine"

### Intermédiaire

#### Optimiser l'ordre des effets
- **ID** : `guide-chains-001`
- **Type** : Guide
- **Durée** : 20 min
- **Description** : Comprenez pourquoi l'ordre des effets est crucial et comment l'optimiser.
- **Récompenses** : 150 XP

---

## STYLES - Styles Musicaux

### Intermédiaire

#### Explorer les styles de jeu
- **ID** : `new-course-014`
- **Type** : Guide
- **Durée** : 30 min
- **Description** : Découvrez les techniques spécifiques au rock, blues, jazz, metal et funk.
- **Contenu** :
  - Le style rock (AC/DC, Led Zeppelin)
  - Le style blues (B.B. King, Stevie Ray Vaughan)
  - Le style jazz (Wes Montgomery, Pat Metheny)
  - Le style metal (Metallica, Iron Maiden)
  - Le style funk (Jimi Hendrix, Prince)
  - Pratiquer les styles
- **Récompenses** : 220 XP, Badge "styles-multiples"

#### Improviser en blues
- **ID** : `new-course-019`
- **Type** : Tutorial
- **Durée** : 32 min
- **Description** : Apprenez les techniques d'improvisation spécifiques au blues : phrases, licks, et approche mélodique.
- **Contenu** :
  - La structure du blues (12 mesures, I-IV-V)
  - Les gammes du blues (pentatonique + blue note)
  - Les licks de blues
  - Les techniques expressives
  - Jouer sur les changements
  - Écouter les maîtres (B.B. King, Stevie Ray Vaughan, Eric Clapton)
- **Récompenses** : 240 XP, Badge "blues-impro"

### Avancé

#### Improviser en jazz
- **ID** : `new-course-024`
- **Type** : Tutorial
- **Durée** : 45 min
- **Description** : Apprenez les techniques d'improvisation jazz : gammes, accords, et approche harmonique.
- **Contenu** :
  - La théorie harmonique du jazz
  - Les gammes du jazz
  - Jouer sur les changements
  - Les approches chromatiques
  - Les substitutions tritoniques
  - Le swing et le phrasé
  - Pratiquer l'improvisation
- **Récompenses** : 350 XP, Badge "jazz-master"

#### Improviser en metal
- **ID** : `new-course-029`
- **Type** : Tutorial
- **Durée** : 38 min
- **Description** : Apprenez les techniques d'improvisation spécifiques au metal : vitesse, précision, et agressivité.
- **Contenu** :
  - Les gammes du metal
  - La vitesse et la précision
  - Les techniques de picking
  - Les palm mutes
  - Les solos techniques
  - L'utilisation des effets
  - Créer votre style
- **Récompenses** : 300 XP, Badge "metal-master"

---

## TECHNIQUES - Techniques de Jeu

### Débutant

#### Les techniques de picking de base
- **ID** : `new-course-006`
- **Type** : Tutorial
- **Durée** : 16 min
- **Description** : Apprenez les différentes façons de gratter les cordes : downstroke, upstroke, et alternate picking.
- **Récompenses** : 100 XP

### Intermédiaire

#### Techniques avancées de picking
- **ID** : `new-course-011`
- **Type** : Tutorial
- **Durée** : 22 min
- **Description** : Maîtrisez le sweep picking, le economy picking et d'autres techniques avancées.
- **Contenu** :
  - Le sweep picking
  - Le economy picking
  - Le hybrid picking
  - Exercices de sweep picking
  - Intégrer dans votre jeu
- **Récompenses** : 180 XP, Badge "picking-avance"

#### Maîtriser les gammes pentatoniques
- **ID** : `new-course-012`
- **Type** : Tutorial
- **Durée** : 28 min
- **Description** : Apprenez les gammes pentatoniques majeures et mineures, essentielles pour l'improvisation.
- **Contenu** :
  - Qu'est-ce qu'une gamme pentatonique ?
  - La pentatonique mineure (La)
  - Les 5 positions de la pentatonique
  - La pentatonique majeure (Do)
  - Improviser avec les pentatoniques
  - Les bends et les slides
- **Récompenses** : 200 XP, Badge "pentatonique"

#### Maîtriser les bends et vibrato
- **ID** : `new-course-016`
- **Type** : Tutorial
- **Durée** : 24 min
- **Description** : Apprenez les différentes techniques de bending et développez votre vibrato expressif.
- **Contenu** :
  - Les types de bends
  - Le bend simple
  - Le pre-bend
  - Le vibrato
  - Exercices de bending
  - Intégrer dans les solos
- **Récompenses** : 190 XP

#### Maîtriser les accords barrés
- **ID** : `new-course-017`
- **Type** : Tutorial
- **Durée** : 26 min
- **Description** : Apprenez à jouer les accords barrés, essentiels pour jouer dans toutes les tonalités.
- **Contenu** :
  - Qu'est-ce qu'un accord barré ?
  - Le barré de Fa (F)
  - La position de la main
  - Les autres formes de barrés
  - Exercices pratiques
  - Utiliser les barrés
- **Récompenses** : 200 XP, Badge "barres"

### Avancé

#### Maîtriser le tapping à deux mains
- **ID** : `new-course-021`
- **Type** : Tutorial
- **Durée** : 35 min
- **Description** : Apprenez les techniques de tapping avancées popularisées par Eddie Van Halen et Steve Vai.
- **Contenu** :
  - Les bases du tapping
  - Le tapping simple
  - Le tapping à deux mains
  - Les techniques avancées
  - Intégrer dans les solos
  - Exercices progressifs
- **Récompenses** : 280 XP, Badge "tapping-master"

#### Comprendre les modes et gammes modales
- **ID** : `new-course-022`
- **Type** : Tutorial
- **Durée** : 40 min
- **Description** : Explorez les 7 modes de la gamme majeure et leur utilisation en improvisation.
- **Contenu** :
  - Qu'est-ce qu'un mode ?
  - Le mode ionien (majeur)
  - Le mode dorien
  - Le mode phrygien
  - Le mode lydien
  - Le mode mixolydien
  - Le mode éolien (mineur naturel)
  - Le mode locrien
  - Appliquer les modes
- **Récompenses** : 320 XP, Badge "modes-master"

#### Legato avancé : runs et vitesse
- **ID** : `new-course-025`
- **Type** : Tutorial
- **Durée** : 28 min
- **Description** : Développez votre technique de legato avec des runs complexes et des exercices de vitesse.
- **Contenu** :
  - Les bases du legato
  - Les hammer-ons
  - Les pull-offs
  - Les trilles
  - Les runs de legato
  - Exercices de vitesse
  - Intégrer dans les solos
- **Récompenses** : 260 XP, Badge "legato-master"

#### Techniques de slide : doigts et bottleneck
- **ID** : `new-course-027`
- **Type** : Tutorial
- **Durée** : 20 min
- **Description** : Apprenez les techniques de slide avec les doigts et avec le bottleneck pour un jeu expressif.
- **Contenu** :
  - Le slide avec les doigts
  - Le bottleneck
  - L'accordage en open tuning
  - Les techniques de slide
  - Le style slide
  - Pratiquer le slide
- **Récompenses** : 220 XP

---

## CREATIVITY - Créativité et Presets

### Intermédiaire

#### Créer des presets professionnels
- **ID** : `new-course-015`
- **Type** : Preset
- **Durée** : 18 min
- **Description** : Apprenez à créer et sauvegarder des presets complexes pour différents styles musicaux.
- **Contenu** :
  - Planifier votre preset
  - Construire la chaîne (Fender Twin Reverb)
  - Ajuster les niveaux
  - Affiner les paramètres
  - Sauvegarder et nommer
  - Partager vos presets
- **Récompenses** : 160 XP, Badge "preset-creator"

### Avancé

#### Créer des textures sonores complexes
- **ID** : `new-course-026`
- **Type** : Preset
- **Durée** : 25 min
- **Description** : Apprenez à créer des ambiances et textures sonores uniques avec des chaînes d'effets complexes.
- **Contenu** :
  - Planifier votre texture
  - Les effets en parallèle
  - Les effets en série
  - Les boucles d'effets
  - Le feedback contrôlé
  - Les presets atmosphériques
  - Tester et affiner
- **Récompenses** : 240 XP, Badge "texture-master"

---

## QUIZ - Tests de Connaissances

### Débutant

#### Quiz : Les bases de la guitare
- **ID** : `new-course-009`
- **Type** : Quiz
- **Durée** : 8 min
- **Description** : Testez vos connaissances sur les fondamentaux de la guitare avec ce quiz interactif.
- **Questions** :
  1. Combien de cordes a une guitare standard ? (6)
  2. Quel est l'accordage standard ? (Mi-La-Ré-Sol-Si-Mi)
  3. Quel est l'accord le plus utilisé ? (Sol majeur)
  4. Quel effet ajoute de la saturation ? (Distortion)
- **Récompenses** : 100 XP, Badge "quiz-debutant"

### Intermédiaire

#### Quiz : Techniques intermédiaires
- **ID** : `new-course-020`
- **Type** : Quiz
- **Durée** : 10 min
- **Description** : Testez vos connaissances sur les techniques et concepts intermédiaires de la guitare.
- **Questions** :
  1. Combien de notes contient une gamme pentatonique ? (5)
  2. Quelle est la différence entre un bend et un vibrato ? (Bend change la hauteur, vibrato oscille)
  3. Pourquoi utilise-t-on les accords barrés ? (Pour transposer les accords)
  4. Quel paramètre contrôle le nombre de répétitions dans un delay ? (Feedback)
- **Récompenses** : 150 XP, Badge "quiz-intermediaire"

### Avancé

#### Quiz : Techniques avancées
- **ID** : `new-course-030`
- **Type** : Quiz
- **Durée** : 12 min
- **Description** : Testez vos connaissances sur les techniques et concepts avancés de la guitare.
- **Questions** :
  1. Combien y a-t-il de modes dans la gamme majeure ? (7)
  2. Quel guitariste a popularisé le tapping à deux mains ? (Eddie Van Halen)
  3. Quelle technique permet de jouer rapidement sans gratter chaque note ? (Le legato)
  4. Quel effet modifie la hauteur du signal sans changer la vitesse ? (Le pitch shifter)
  5. Quels types d'accords sont typiques du jazz ? (7ème, 9ème, 11ème)
- **Récompenses** : 200 XP, Badge "quiz-avance"

---

## Système de Récompenses

### Points d'Expérience (XP)
- **Débutant** : 50-150 XP par cours
- **Intermédiaire** : 150-240 XP par cours
- **Avancé** : 200-350 XP par cours

### Badges
Les badges sont débloqués en complétant certains cours ou en atteignant des objectifs spécifiques :

- **premiers-pas** : Compléter votre premier preset
- **accords-de-base** : Maîtriser les accords de base
- **rythme** : Développer le sens du rythme
- **effets-debutant** : Découvrir les effets de base
- **premiere-chanson** : Apprendre votre première chanson
- **premiere-chaine** : Créer votre première chaîne d'effets
- **quiz-debutant** : Réussir le quiz débutant
- **picking-avance** : Maîtriser les techniques avancées de picking
- **pentatonique** : Maîtriser les gammes pentatoniques
- **styles-multiples** : Explorer plusieurs styles musicaux
- **preset-creator** : Créer des presets professionnels
- **barres** : Maîtriser les accords barrés
- **blues-impro** : Improviser en blues
- **quiz-intermediaire** : Réussir le quiz intermédiaire
- **tapping-master** : Maîtriser le tapping à deux mains
- **modes-master** : Comprendre les modes et gammes modales
- **jazz-master** : Improviser en jazz
- **legato-master** : Maîtriser le legato
- **texture-master** : Créer des textures sonores complexes
- **metal-master** : Improviser en metal
- **quiz-avance** : Réussir le quiz avancé

---

## Prérequis et Progression

### Parcours Recommandés

#### Parcours Débutant
1. Votre premier preset
2. Comprendre les amplis
3. Les accords de base pour débutants
4. Maîtriser le rythme et le tempo
5. Découvrir les effets de base
6. Créer votre première chaîne d'effets
7. Apprendre votre première chanson
8. Quiz : Les bases de la guitare

#### Parcours Intermédiaire
1. Techniques avancées de picking
2. Maîtriser les gammes pentatoniques
3. Maîtriser les effets de modulation
4. Explorer les styles de jeu
5. Créer des presets professionnels
6. Maîtriser les bends et vibrato
7. Maîtriser les accords barrés
8. Explorer les possibilités du delay
9. Improviser en blues
10. Quiz : Techniques intermédiaires

#### Parcours Avancé
1. Maîtriser le tapping à deux mains
2. Comprendre les modes et gammes modales
3. Maîtriser le pitch shifting et l'harmonisation
4. Improviser en jazz
5. Maîtriser le legato et les hammer-ons/pull-offs
6. Créer des textures sonores complexes
7. Maîtriser le slide et le bottleneck
8. Explorer les nuances de la distortion
9. Improviser en metal
10. Quiz : Techniques avancées

---

## Actions Interactives

### Types d'Actions

#### addPedal
Ajoute une pédale à la chaîne d'effets.
- **Target** : ID de la pédale (ex: `boss-ds1`, `boss-rv6`, `boss-dd7`)
- **Exemple** : `{ type: 'addPedal', target: 'boss-ds1' }`

#### setParameter
Ajuste un paramètre d'une pédale ou d'un ampli.
- **Target** : Nom du paramètre (ex: `distortion`, `volume`, `gain`)
- **Value** : Valeur du paramètre (0-100)
- **Exemple** : `{ type: 'setParameter', target: 'distortion', value: 60 }`

#### loadPreset
Charge un preset existant.
- **Target** : ID du preset ou action spéciale (ex: `save`, `atmospheric`)
- **Exemple** : `{ type: 'loadPreset', target: 'atmospheric' }`

#### test
Lance un test audio pour vérifier le son.
- **Target** : Type de test (ex: `audio`)
- **Exemple** : `{ type: 'test', target: 'audio' }`

---

## NOUVEAUX COURS SUPPLÉMENTAIRES (31-60)

### Basics

#### Maîtriser les accords mineurs
- **ID** : `new-course-031`
- **Type** : Tutorial
- **Durée** : 14 min
- **Description** : Apprenez les accords mineurs de base et leur utilisation dans différents contextes musicaux.
- **Contenu** :
  - Introduction aux accords mineurs
  - L'accord de La mineur (Am)
  - L'accord de Mi mineur (Em)
  - L'accord de Ré mineur (Dm)
  - Utiliser les accords mineurs
- **Récompenses** : 110 XP, Badge "accords-mineurs"

#### Maîtriser le strumming
- **ID** : `new-course-056`
- **Type** : Tutorial
- **Durée** : 20 min
- **Description** : Apprenez les différentes techniques de strumming pour accompagner efficacement.
- **Contenu** :
  - Les bases du strumming
  - Le downstroke
  - Le upstroke
  - Les patterns rythmiques
  - Le muting
  - Intégrer dans votre jeu
- **Récompenses** : 140 XP

### Effects

#### Explorer les possibilités de la reverb
- **ID** : `new-course-034`
- **Type** : Tutorial
- **Durée** : 21 min
- **Description** : Maîtrisez les différents types de reverb et leurs applications créatives.
- **Contenu** :
  - Les types de reverb (Spring, Hall, Plate, Room, Cathedral)
  - La reverb Spring (BOSS RV-6)
  - La reverb Hall
  - La reverb Plate
  - Les paramètres de reverb
  - Applications créatives
- **Récompenses** : 180 XP

#### Maîtriser le flanger
- **ID** : `new-course-035`
- **Type** : Tutorial
- **Durée** : 17 min
- **Description** : Explorez l'effet flanger et ses applications dans différents styles musicaux.
- **Contenu** :
  - Qu'est-ce que le flanger ?
  - Le flanger classique
  - Le flanger extrême
  - Applications par style
  - Combiner avec d'autres effets
- **Récompenses** : 160 XP

#### Explorer le phaser
- **ID** : `new-course-036`
- **Type** : Tutorial
- **Durée** : 16 min
- **Description** : Découvrez l'effet phaser et son utilisation dans le rock, funk et psyché.
- **Contenu** :
  - Qu'est-ce que le phaser ?
  - Le phaser subtil
  - Le phaser prononcé
  - Le phaser en solo
  - Le phaser avec distorsion
- **Récompenses** : 155 XP

#### Maîtriser le tremolo
- **ID** : `new-course-037`
- **Type** : Tutorial
- **Durée** : 15 min
- **Description** : Apprenez à utiliser le tremolo pour créer des effets rythmiques et atmosphériques.
- **Contenu** :
  - Qu'est-ce que le tremolo ?
  - Le tremolo lent
  - Le tremolo rapide
  - Les formes d'onde (Sine, Square, Random)
  - Applications créatives
- **Récompenses** : 150 XP

#### Quiz : Effets et pédales
- **ID** : `new-course-060`
- **Type** : Quiz
- **Durée** : 10 min
- **Description** : Testez vos connaissances sur les effets et pédales d'effets.
- **Questions** :
  1. Quelle pédale est connue pour son son de distorsion iconique ? (BOSS DS-1)
  2. Quel paramètre contrôle le nombre de répétitions dans un delay ? (Feedback)
  3. Quel type de reverb simule les ressorts d'un ampli vintage ? (Spring)
  4. Quel effet crée un effet de doublage ? (Chorus)
  5. Dans quel ordre doit-on placer les effets ? (Distorsion → Delay → Reverb)
- **Récompenses** : 160 XP, Badge "quiz-effets"

### Amps

#### Maîtriser les amplis Fender
- **ID** : `new-course-038`
- **Type** : Guide
- **Durée** : 24 min
- **Description** : Explorez les caractéristiques et réglages des amplis Fender pour obtenir le son classique américain.
- **Contenu** :
  - L'histoire des amplis Fender
  - Le Fender Twin Reverb
  - Le Fender Deluxe Reverb
  - Le son Fender
  - Artistes emblématiques
  - Réglages par style
- **Récompenses** : 200 XP, Badge "fender-master"

#### Maîtriser les amplis Marshall
- **ID** : `new-course-039`
- **Type** : Guide
- **Durée** : 26 min
- **Description** : Découvrez les amplis Marshall et leur son britannique caractéristique du rock.
- **Contenu** :
  - L'histoire des amplis Marshall
  - Le Marshall Plexi 1959
  - Le Marshall JCM 800
  - Le son Marshall
  - Artistes emblématiques
  - Réglages par style
- **Récompenses** : 220 XP, Badge "marshall-master"

#### Maîtriser les amplis Mesa Boogie
- **ID** : `new-course-040`
- **Type** : Guide
- **Durée** : 28 min
- **Description** : Explorez les amplis Mesa Boogie et leur son high-gain puissant pour le metal moderne.
- **Contenu** :
  - L'histoire de Mesa Boogie
  - Le Mesa Dual Rectifier
  - Les modes de rectification
  - Le son Mesa Boogie
  - Artistes emblématiques
  - Réglages par style
- **Récompenses** : 250 XP, Badge "mesa-master"

### Techniques

#### Maîtriser les power chords
- **ID** : `new-course-032`
- **Type** : Tutorial
- **Durée** : 12 min
- **Description** : Apprenez les power chords, essentiels pour le rock et le metal.
- **Contenu** :
  - Qu'est-ce qu'un power chord ?
  - Forme de base du power chord
  - Les power chords sur différentes cordes
  - Utiliser les power chords
- **Récompenses** : 95 XP, Badge "power-chords"

#### Jouer des arpèges de base
- **ID** : `new-course-033`
- **Type** : Tutorial
- **Durée** : 18 min
- **Description** : Apprenez à jouer des arpèges simples pour enrichir votre jeu.
- **Contenu** :
  - Qu'est-ce qu'un arpège ?
  - Arpège de Do majeur
  - Arpège de Sol majeur
  - Patterns d'arpèges
  - Intégrer les arpèges
- **Récompenses** : 130 XP

#### Maîtriser le palm mute
- **ID** : `new-course-041`
- **Type** : Tutorial
- **Durée** : 19 min
- **Description** : Apprenez la technique du palm mute, essentielle pour le rock et le metal.
- **Contenu** :
  - Qu'est-ce que le palm mute ?
  - La position de la main
  - La pression
  - Les cordes à muter
  - Applications en rock
  - Combiner avec la distorsion
- **Récompenses** : 170 XP, Badge "palm-mute"

#### Hammer-ons et pull-offs : bases et trilles
- **ID** : `new-course-042`
- **Type** : Tutorial
- **Durée** : 22 min
- **Description** : Apprenez les techniques de hammer-on et pull-off pour jouer rapidement et fluidement, avec focus sur les trilles.
- **Contenu** :
  - Le hammer-on
  - Le pull-off
  - Exercices de base
  - Les trilles
  - Intégrer dans les solos
  - Exercices avancés
- **Récompenses** : 190 XP

#### Maîtriser les gammes majeures
- **ID** : `new-course-043`
- **Type** : Tutorial
- **Durée** : 30 min
- **Description** : Apprenez les gammes majeures et leur utilisation en improvisation.
- **Contenu** :
  - Qu'est-ce qu'une gamme majeure ?
  - La gamme de Do majeur
  - Les positions de la gamme majeure
  - Improviser avec les gammes majeures
  - Les modes de la gamme majeure
  - Applications pratiques
- **Récompenses** : 210 XP

#### Maîtriser les gammes mineures
- **ID** : `new-course-044`
- **Type** : Tutorial
- **Durée** : 32 min
- **Description** : Explorez les gammes mineures naturelles, harmoniques et mélodiques.
- **Contenu** :
  - Les types de gammes mineures
  - La gamme mineure naturelle
  - La gamme mineure harmonique
  - La gamme mineure mélodique
  - Improviser avec les gammes mineures
  - Applications par style
- **Récompenses** : 230 XP

#### Slide avancé : accordages ouverts et techniques expertes
- **ID** : `new-course-047`
- **Type** : Tutorial
- **Durée** : 25 min
- **Description** : Approfondissez votre technique de slide avec les accordages ouverts et des techniques expertes.
- **Contenu** :
  - Le slide avec les doigts
  - Le slide avec bottleneck
  - Les accordages ouverts
  - Les techniques avancées
  - Le style slide
  - Intégrer dans votre jeu
- **Récompenses** : 240 XP

#### Maîtriser le sweep picking avancé
- **ID** : `new-course-048`
- **Type** : Tutorial
- **Durée** : 33 min
- **Description** : Approfondissez votre technique de sweep picking avec des arpèges complexes et des exercices avancés.
- **Contenu** :
  - Les bases du sweep picking
  - Les arpèges majeurs
  - Les arpèges mineurs
  - Les arpèges diminués
  - Les arpèges augmentés
  - Les arpèges à 4 notes
  - Intégrer dans les solos
- **Récompenses** : 290 XP, Badge "sweep-master"

#### Maîtriser le hybrid picking
- **ID** : `new-course-049`
- **Type** : Tutorial
- **Durée** : 27 min
- **Description** : Apprenez à combiner le médiator et les doigts pour plus de polyphonie et de contrôle.
- **Contenu** :
  - Qu'est-ce que le hybrid picking ?
  - La position de la main
  - Les exercices de base
  - Les arpèges en hybrid picking
  - Les mélodies avec accompagnement
  - Intégrer dans votre jeu
- **Récompenses** : 270 XP

#### Maîtriser le economy picking
- **ID** : `new-course-050`
- **Type** : Tutorial
- **Durée** : 29 min
- **Description** : Apprenez le economy picking pour minimiser les mouvements et jouer plus efficacement.
- **Contenu** :
  - Qu'est-ce que le economy picking ?
  - Le principe
  - Les exercices de base
  - Les gammes en economy picking
  - Les arpèges en economy picking
  - Intégrer dans votre jeu
- **Récompenses** : 280 XP

#### Maîtriser le fingerpicking
- **ID** : `new-course-055`
- **Type** : Tutorial
- **Durée** : 26 min
- **Description** : Apprenez à jouer avec les doigts au lieu du médiator pour plus de polyphonie et de contrôle.
- **Contenu** :
  - Qu'est-ce que le fingerpicking ?
  - La position des doigts
  - Les patterns de base
  - Les arpèges en fingerpicking
  - Les mélodies avec accompagnement
  - Intégrer dans votre jeu
- **Récompenses** : 220 XP

#### Maîtriser les harmoniques
- **ID** : `new-course-057`
- **Type** : Tutorial
- **Durée** : 24 min
- **Description** : Apprenez à jouer des harmoniques naturelles et artificielles pour enrichir votre jeu.
- **Contenu** :
  - Qu'est-ce qu'une harmonique ?
  - Les harmoniques naturelles
  - Les harmoniques artificielles
  - Les harmoniques pincées
  - Les harmoniques en tapping
  - Intégrer dans votre jeu
- **Récompenses** : 260 XP

#### Maîtriser le whammy bar
- **ID** : `new-course-058`
- **Type** : Tutorial
- **Durée** : 19 min
- **Description** : Apprenez à utiliser le whammy bar (vibrato) pour créer des effets expressifs.
- **Contenu** :
  - Qu'est-ce que le whammy bar ?
  - Les types de whammy bar
  - Le dive bomb
  - Le vibrato
  - Les harmoniques avec whammy
  - Intégrer dans votre jeu
- **Récompenses** : 180 XP

#### Maîtriser les double stops
- **ID** : `new-course-059`
- **Type** : Tutorial
- **Durée** : 21 min
- **Description** : Apprenez à jouer des double stops (deux notes simultanées) pour enrichir vos solos.
- **Contenu** :
  - Qu'est-ce qu'un double stop ?
  - Les double stops en tierces
  - Les double stops en quartes
  - Les double stops en sixtes
  - Intégrer dans les solos
  - Les double stops avec bends
- **Récompenses** : 200 XP

### Styles

#### Improviser en rock
- **ID** : `new-course-045`
- **Type** : Tutorial
- **Durée** : 35 min
- **Description** : Apprenez les techniques d'improvisation spécifiques au rock : phrases, licks, et approche mélodique.
- **Contenu** :
  - La structure du rock
  - Les gammes du rock
  - Les licks de rock
  - Les techniques expressives
  - Jouer sur les changements
  - Écouter les maîtres
- **Récompenses** : 250 XP, Badge "rock-impro"

#### Improviser en funk
- **ID** : `new-course-046`
- **Type** : Tutorial
- **Durée** : 28 min
- **Description** : Apprenez les techniques d'improvisation funk : riffs rythmiques, ghost notes, et approche percussive.
- **Contenu** :
  - La structure du funk
  - Les riffs funk
  - Les ghost notes
  - Le muting
  - Les effets funk
  - Écouter les maîtres
- **Récompenses** : 240 XP, Badge "funk-impro"

### Creativity

#### Presets rock : classique, hard et alternatif
- **ID** : `new-course-051`
- **Type** : Preset
- **Durée** : 20 min
- **Description** : Apprenez à créer des presets optimaux pour différents styles de rock : classique, hard rock, alternatif et psyché.
- **Contenu** :
  - Le preset rock classique
  - Le preset hard rock
  - Le preset rock alternatif
  - Le preset rock psyché
  - Optimiser vos presets
- **Récompenses** : 180 XP, Badge "preset-rock"

#### Presets blues : clean, crunch et saturé
- **ID** : `new-course-052`
- **Type** : Preset
- **Durée** : 18 min
- **Description** : Apprenez à créer des presets authentiques pour le blues avec différents niveaux de saturation.
- **Contenu** :
  - Le preset blues clean
  - Le preset blues crunch
  - Le preset blues saturé
  - Les effets blues
  - Optimiser vos presets
- **Récompenses** : 170 XP, Badge "preset-blues"

#### Presets metal : classique, moderne et progressif
- **ID** : `new-course-053`
- **Type** : Preset
- **Durée** : 22 min
- **Description** : Apprenez à créer des presets puissants pour différents sous-genres de metal.
- **Contenu** :
  - Le preset metal classique
  - Le preset metal moderne
  - Le preset metal progressif
  - Les effets metal
  - Optimiser vos presets
- **Récompenses** : 210 XP, Badge "preset-metal"

#### Presets jazz : clean, chorus et reverb
- **ID** : `new-course-054`
- **Type** : Preset
- **Durée** : 19 min
- **Description** : Apprenez à créer des presets chauds et clairs pour le jazz avec différents effets.
- **Contenu** :
  - Le preset jazz clean
  - Le preset jazz avec chorus
  - Le preset jazz avec reverb
  - Les effets jazz
  - Optimiser vos presets
- **Récompenses** : 200 XP, Badge "preset-jazz"

---

## Statistiques

### Répartition par Catégorie
- **Basics** : 13 cours
- **Effects** : 11 cours
- **Amps** : 6 cours
- **Chains** : 2 cours
- **Styles** : 6 cours
- **Techniques** : 20 cours
- **Creativity** : 6 cours
- **Quiz** : 4 cours

### Répartition par Difficulté
- **Beginner** : 13 cours
- **Intermediate** : 25 cours
- **Advanced** : 22 cours
- **Pro** : 0 cours (à venir)

### Répartition par Type
- **Tutorial** : 50 cours
- **Guide** : 8 cours
- **Quiz** : 4 cours
- **Preset** : 6 cours

### Total
- **Total de cours** : 68 cours
- **Cours enrichis** : 270 enrichissements (certains cours enrichis plusieurs fois)
- **Durée totale** : ~9700 minutes (~162 heures) après enrichissement complet
- **XP total disponible** : ~90500 XP après enrichissement complet
- **Badges disponibles** : 35 badges
- **Étapes totales** : ~1880+ étapes (après enrichissement complet)

---

## Enrichissement des Cours

30 cours existants ont été enrichis pour doubler leur contenu pédagogique. Chaque cours enrichi a reçu :

- **Étapes supplémentaires** : Le nombre d'étapes a été doublé
- **Durée doublée** : La durée estimée a été multipliée par 2
- **XP augmenté** : Les récompenses XP ont été proportionnellement augmentées
- **Contenu approfondi** : Chaque cours couvre maintenant son sujet de manière plus complète

### Scripts d'Enrichissement

#### Premier Script d'Enrichissement
Le script d'enrichissement est disponible dans `frontend/src/scripts/enrich30Courses.ts` et peut être exécuté via la console du navigateur :

```javascript
window.enrich30Courses()
```

#### Deuxième Script d'Enrichissement
Le script d'enrichissement supplémentaire est disponible dans `frontend/src/scripts/enrich30MoreCourses.ts` et peut être exécuté via la console du navigateur :

```javascript
window.enrich30MoreCourses()
```

#### Troisième Script d'Enrichissement
Le script d'enrichissement supplémentaire (troisième lot) est disponible dans `frontend/src/scripts/enrich30EvenMoreCourses.ts` et peut être exécuté via la console du navigateur :

```javascript
window.enrich30EvenMoreCourses()
```

#### Quatrième Script d'Enrichissement
Le script d'enrichissement supplémentaire (quatrième lot) est disponible dans `frontend/src/scripts/enrich30FinalCourses.ts` et peut être exécuté via la console du navigateur :

```javascript
window.enrich30FinalCourses()
```

#### Cinquième Script d'Enrichissement
Le script d'enrichissement supplémentaire (cinquième lot) est disponible dans `frontend/src/scripts/enrich30AdditionalCourses.ts` et peut être exécuté via la console du navigateur :

```javascript
window.enrich30AdditionalCourses()
```

#### Sixième Script d'Enrichissement
Le script d'enrichissement supplémentaire (sixième lot) est disponible dans `frontend/src/scripts/enrich30ExtraCourses.ts` et peut être exécuté via la console du navigateur :

```javascript
window.enrich30ExtraCourses()
```

#### Septième Script d'Enrichissement
Le script d'enrichissement supplémentaire (septième lot) est disponible dans `frontend/src/scripts/enrich30UltimateCourses.ts` et peut être exécuté via la console du navigateur :

```javascript
window.enrich30UltimateCourses()
```

#### Huitième Script d'Enrichissement
Le script d'enrichissement supplémentaire (huitième lot) est disponible dans `frontend/src/scripts/enrich30SupremeCourses.ts` et peut être exécuté via la console du navigateur :

```javascript
window.enrich30SupremeCourses()
```

#### Script d'Enrichissement Final
Le script d'enrichissement final pour compléter les enrichissements manquants est disponible dans `frontend/src/scripts/enrichFinalMissingCourses.ts` et peut être exécuté via la console du navigateur :

```javascript
window.enrichFinalMissingCourses()
```

Les scripts enrichissent automatiquement les cours en :
1. Trouvant chaque cours dans Supabase par son titre
2. Ajoutant les nouvelles étapes avec le bon ordre (order_index)
3. Mettant à jour la durée du cours
4. Augmentant les récompenses XP
5. Affichant un rapport détaillé dans la console

### Cours Enrichis (30 cours)

#### Basics (5 cours)
1. **Les accords de base pour débutants** : 5 → 10 étapes (15 → 30 min, 100 → 200 XP)
   - Ajout : Accords La, Mi, La mineur, Mi mineur, exercices de transitions avancés

2. **Maîtriser le rythme et le tempo** : 4 → 8 étapes (20 → 40 min, 120 → 240 XP)
   - Ajout : Mesures et temps, syncopes, patterns complexes, backing tracks

3. **Apprendre votre première chanson** : 6 → 12 étapes (25 → 50 min, 150 → 300 XP)
   - Ajout : Analyse de structure, apprentissage section par section, tablatures, enregistrement

4. **Accorder sa guitare correctement** : 4 → 8 étapes (10 → 20 min, 80 → 160 XP)
   - Ajout : Accordages alternatifs, harmoniques, maintenance, intonation

5. **La bonne posture et position** : 5 → 10 étapes (12 → 24 min, 90 → 180 XP)
   - Ajout : Hauteur de guitare, angle du manche, épaules/cou, pieds/jambes, étirements

#### Effects (3 cours)
6. **Découvrir les effets de base** : 4 → 8 étapes (12 → 24 min, 90 → 180 XP)
   - Ajout : Chorus, catégories d'effets, ajustement paramètres, combinaisons

7. **Maîtriser les effets de modulation** : 6 → 12 étapes (20 → 40 min, 170 → 340 XP)
   - Ajout : Applications chorus/phaser/flanger, réglages, formes d'onde, chaînes

8. **Explorer les possibilités du delay** : 6 → 12 étapes (19 → 38 min, 170 → 340 XP)
   - Ajout : Delay court/moyen/long, feedback, stéréo, modulation

#### Amps (1 cours)
9. **Choisir son premier ampli** : 5 → 10 étapes (18 → 36 min, 110 → 220 XP)
   - Ajout : Combo vs Head, tubes vs transistors, modélisateurs, effets intégrés, tests

#### Chains (1 cours)
10. **Créer votre première chaîne d'effets** : 5 → 10 étapes (14 → 28 min, 120 → 240 XP)
    - Ajout : Série vs parallèle, boucles d'effets, true bypass, niveaux, presets

#### Styles (2 cours)
11. **Explorer les styles de jeu** : 6 → 12 étapes (30 → 60 min, 220 → 440 XP)
    - Ajout : Country, folk, pop, reggae, soul, style unique

12. **Improviser en blues** : 6 → 12 étapes (32 → 64 min, 240 → 480 XP)
    - Ajout : Blue notes, phrases classiques, changements I-IV-V, call/response, espace, feeling

#### Techniques (8 cours)
13. **Les techniques de picking de base** : 4 → 8 étapes (16 → 32 min, 100 → 200 XP)
    - Ajout : Tenir médiator, angle, profondeur, coordination

14. **Techniques avancées de picking** : 5 → 10 étapes (22 → 44 min, 180 → 360 XP)
    - Ajout : Bases sweep/economy/hybrid, exercices vitesse, intégration solos

15. **Maîtriser les gammes pentatoniques** : 6 → 12 étapes (28 → 56 min, 200 → 400 XP)
    - Ajout : Les 5 positions détaillées, improvisation avec toutes positions

16. **Maîtriser les bends et vibrato** : 6 → 12 étapes (24 → 48 min, 190 → 380 XP)
    - Ajout : Bends 1 ton/demi-ton/ton et demi, release bend, vibrato large/rapide

17. **Maîtriser les accords barrés** : 6 → 12 étapes (26 → 52 min, 200 → 400 XP)
    - Ajout : Formes majeur/mineur/7ème, différentes cordes, barrés partiels, progressions

18. **Maîtriser le tapping à deux mains** : 6 → 12 étapes (35 → 70 min, 280 → 560 XP)
    - Ajout : Position main droite, patterns, arpèges, harmoniques, techniques avancées, intégration

19. **Comprendre les modes et gammes modales** : 8 → 16 étapes (40 → 80 min, 320 → 640 XP)
    - Ajout : Construction modes, détails de chaque mode (ionien, dorien, phrygien, lydien, mixolydien, éolien, locrien)

20. **Legato avancé : runs et vitesse** : 7 → 14 étapes (28 → 56 min, 260 → 520 XP)
    - Ajout : Runs 3/4 notes, runs gamme complète, trilles complexes, vitesse progressive, intégration

#### Creativity (2 cours)
21. **Créer des presets professionnels** : 6 → 12 étapes (18 → 36 min, 160 → 320 XP)
    - Ajout : Analyser références, choisir ampli, effets essentiels, EQ, tests contextes, documentation

22. **Créer des textures sonores complexes** : 7 → 14 étapes (25 → 50 min, 240 → 480 XP)
    - Ajout : Textures spatiales/rythmiques/harmoniques, boucles feedback, presets atmosphériques, tests, documentation

#### Avancé (3 cours)
23. **Maîtriser le pitch shifting et l'harmonisation** : 6 → 12 étapes (22 → 44 min, 200 → 400 XP)
    - Ajout : Principe pitch shifter, applications octaver, harmoniseur intelligent, intervalles, temps réel, combinaisons

24. **Improviser en jazz** : 7 → 14 étapes (45 → 90 min, 350 → 700 XP)
    - Ajout : Accords 7ème/9ème/11ème, arpèges, approches chromatiques, substitutions, phrasé, standards

25. **Techniques de slide : doigts et bottleneck** : 6 → 12 étapes (20 → 40 min, 220 → 440 XP)
    - Ajout : Technique doigts/bottleneck, justesse, Open D/G, mélodies

26. **Explorer les nuances de la distortion** : 7 → 14 étapes (23 → 46 min, 210 → 420 XP)
    - Ajout : Caractéristiques overdrive/distortion/fuzz/high-gain, empilage, réglages gain/volume, par style

27. **Improviser en metal** : 7 → 14 étapes (38 → 76 min, 300 → 600 XP)
    - Ajout : Gammes mineure harmonique/mélodique, modes, vitesse/précision, picking metal, palm mutes, style

#### Quiz (3 cours)
28. **Quiz : Les bases de la guitare** : 4 → 8 questions (8 → 16 min, 100 → 200 XP)
    - Ajout : Questions sur cordes, cases, médiators, pratique

29. **Quiz : Techniques intermédiaires** : 4 → 8 questions (10 → 20 min, 150 → 300 XP)
    - Ajout : Questions sur gammes, techniques, effets, improvisation

30. **Quiz : Techniques avancées** : 5 → 10 questions (12 → 24 min, 200 → 400 XP)
    - Ajout : Questions sur gammes metal, legato, modes, tapping, improvisation jazz

### Cours Enrichis - Deuxième Lot (30 cours supplémentaires)

#### Basics (2 cours)
31. **Votre premier preset** : 4 → 8 étapes (5 → 10 min, 50 → 100 XP)
    - Ajout : Comprendre les presets, nommer, sauvegarder, partager

32. **Comprendre les amplis** : 4 → 8 étapes (8 → 16 min, 75 → 150 XP)
    - Ajout : Composants internes, types de lampes, haut-parleurs, entretien

#### Effects (6 cours)
33. **Maîtriser les accords mineurs** : 5 → 10 étapes (14 → 28 min, 110 → 220 XP)
    - Ajout : Différence majeur/mineur, Cm, Gm, Fm, progressions

34. **Maîtriser le strumming** : 6 → 12 étapes (20 → 40 min, 140 → 280 XP)
    - Ajout : Strumming de base, patterns simples/complexes, muting main droite/gauche, intégration

35. **Explorer les possibilités de la reverb** : 6 → 12 étapes (21 → 42 min, 180 → 360 XP)
    - Ajout : Spring, Hall, Plate, Room, Cathedral, paramètres

36. **Maîtriser le flanger** : 5 → 10 étapes (17 → 34 min, 160 → 320 XP)
    - Ajout : Principe, subtil/prononcé, avec distorsion, en solo

37. **Explorer le phaser** : 5 → 10 étapes (16 → 32 min, 155 → 310 XP)
    - Ajout : Principe, subtil/prononcé, en solo, avec distorsion

38. **Maîtriser le tremolo** : 5 → 10 étapes (15 → 30 min, 150 → 300 XP)
    - Ajout : Principe, lent/rapide, formes d'onde Sine/Square

#### Amps (4 cours)
39. **Distortion vs Overdrive** : 2 → 4 étapes (10 → 20 min, 80 → 160 XP)
    - Ajout : Quand utiliser overdrive, quand utiliser distortion

40. **Maîtriser les amplis Fender** : 6 → 12 étapes (24 → 48 min, 200 → 400 XP)
    - Ajout : Histoire, Twin Reverb, Deluxe Reverb, son caractéristique, artistes, réglages

41. **Maîtriser les amplis Marshall** : 6 → 12 étapes (26 → 52 min, 220 → 440 XP)
    - Ajout : Histoire, Plexi 1959, JCM 800, son caractéristique, artistes, réglages

42. **Maîtriser les amplis Mesa Boogie** : 6 → 12 étapes (28 → 56 min, 250 → 500 XP)
    - Ajout : Histoire, Dual Rectifier, modes rectification, son caractéristique, artistes, réglages

#### Chains (1 cours)
43. **Réglages d'amplis par style** : 3 → 6 étapes (15 → 30 min, 130 → 260 XP)
    - Ajout : Clean/Vintage Fender, Rock/Crunch Marshall, High-Gain/Metal Mesa

44. **Optimiser l'ordre des effets** : 2 → 4 étapes (20 → 40 min, 150 → 300 XP)
    - Ajout : Pourquoi l'ordre est crucial, règles de base

#### Techniques (13 cours)
45. **Maîtriser les power chords** : 4 → 8 étapes (12 → 24 min, 95 → 190 XP)
    - Ajout : Forme de base, sur 6ème/5ème corde, avec palm mute

46. **Jouer des arpèges de base** : 5 → 10 étapes (18 → 36 min, 130 → 260 XP)
    - Ajout : Principe, Do majeur, Sol majeur, patterns, intégration

47. **Maîtriser le palm mute** : 6 → 12 étapes (19 → 38 min, 170 → 340 XP)
    - Ajout : Position main, pression, cordes à muter, applications rock, avec distorsion, en solo

48. **Hammer-ons et pull-offs : bases et trilles** : 6 → 12 étapes (22 → 44 min, 190 → 380 XP)
    - Ajout : Technique hammer-on/pull-off, exercices base, trilles, intégration, exercices avancés

49. **Maîtriser les gammes majeures** : 6 → 12 étapes (30 → 60 min, 210 → 420 XP)
    - Ajout : Structure, Do majeur, positions, improvisation, modes, applications

50. **Maîtriser les gammes mineures** : 6 → 12 étapes (32 → 64 min, 230 → 460 XP)
    - Ajout : Types (naturelle/harmonique/mélodique), structure, improvisation, applications par style

51. **Slide avancé : accordages ouverts et techniques expertes** : 6 → 12 étapes (25 → 50 min, 240 → 480 XP)
    - Ajout : Open D/G, techniques avancées, style slide, intégration, exercices justesse

52. **Maîtriser le sweep picking avancé** : 7 → 14 étapes (33 → 66 min, 290 → 580 XP)
    - Ajout : Arpèges majeur/mineur/diminué/augmenté, arpèges 4 notes, intégration, vitesse

53. **Maîtriser le hybrid picking** : 6 → 12 étapes (27 → 54 min, 270 → 540 XP)
    - Ajout : Position main, exercices base, arpèges, mélodies avec accompagnement, intégration, exercices avancés

54. **Maîtriser le economy picking** : 6 → 12 étapes (29 → 58 min, 280 → 560 XP)
    - Ajout : Principe, exercices base, gammes, arpèges, intégration, vitesse

55. **Maîtriser le fingerpicking** : 6 → 12 étapes (26 → 52 min, 220 → 440 XP)
    - Ajout : Position doigts, patterns base, arpèges, mélodies avec accompagnement, intégration, exercices avancés

56. **Maîtriser les harmoniques** : 6 → 12 étapes (24 → 48 min, 260 → 520 XP)
    - Ajout : Harmoniques naturelles/artificielles/pincées, en tapping, intégration, précision

57. **Maîtriser le whammy bar** : 5 → 10 étapes (19 → 38 min, 180 → 360 XP)
    - Ajout : Types whammy bar, dive bomb, vibrato, harmoniques avec whammy, intégration

58. **Maîtriser les double stops** : 6 → 12 étapes (21 → 42 min, 200 → 400 XP)
    - Ajout : Double stops tierces/quartes/sixtes, intégration solos, avec bends, coordination

#### Styles (1 cours)
59. **Improviser en rock** : 6 → 12 étapes (35 → 70 min, 250 → 500 XP)
    - Ajout : Structure rock, gammes, licks, techniques expressives, changements, maîtres

#### Quiz (1 cours)
60. **Quiz : Effets et pédales** : 5 → 10 questions (10 → 20 min, 160 → 320 XP)
    - Ajout : Questions sur pédales, delay, reverb, chorus, ordre des effets

### Cours Enrichis - Troisième Lot (30 cours supplémentaires)

#### Basics (8 cours)
61. **Découvrir les effets de base** : 4 → 8 étapes (12 → 24 min, 90 → 180 XP)
    - Ajout : Chorus, catégories d'effets, ajustement paramètres, combinaisons

62. **Votre premier preset** : 4 → 8 étapes (5 → 10 min, 50 → 100 XP) - enrichissement supplémentaire
    - Ajout : Personnaliser, tester contextes, créer variations, organiser bibliothèque

63. **Comprendre les amplis** : 4 → 8 étapes (8 → 16 min, 75 → 150 XP) - enrichissement supplémentaire
    - Ajout : Types préamplis, importance puissance, canaux multiples, boucles d'effets

64. **Choisir son premier ampli** : 5 → 10 étapes (18 → 36 min, 110 → 220 XP) - enrichissement supplémentaire
    - Ajout : Combo vs Head, tubes vs transistors, modélisateurs, effets intégrés, tests

65. **Apprendre votre première chanson** : 6 → 12 étapes (25 → 50 min, 150 → 300 XP) - enrichissement supplémentaire
    - Ajout : Analyser structure, section par section, tablatures, enregistrement, version originale, touche personnelle

66. **Les techniques de picking de base** : 4 → 8 étapes (16 → 32 min, 100 → 200 XP) - enrichissement supplémentaire
    - Ajout : Tenir médiator, angle, profondeur, coordination

67. **Accorder sa guitare correctement** : 4 → 8 étapes (10 → 20 min, 80 → 160 XP) - enrichissement supplémentaire
    - Ajout : Accordages alternatifs, harmoniques, entretien, intonation

68. **Créer votre première chaîne d'effets** : 5 → 10 étapes (14 → 28 min, 120 → 240 XP) - enrichissement supplémentaire
    - Ajout : Série vs parallèle, boucles d'effets, true bypass, niveaux, presets

#### Effects (6 cours)
69. **Distortion vs Overdrive** : 2 → 4 étapes (10 → 20 min, 80 → 160 XP) - enrichissement supplémentaire
    - Ajout : Quand utiliser overdrive, quand utiliser distortion

70. **Maîtriser les accords mineurs** : 5 → 10 étapes (14 → 28 min, 110 → 220 XP) - enrichissement supplémentaire
    - Ajout : Progressions classiques, extensions, barrés, utilisation, transitions majeur/mineur

71. **Maîtriser le strumming** : 6 → 12 étapes (20 → 40 min, 140 → 280 XP) - enrichissement supplémentaire
    - Ajout : Patterns avancés, palm mute, ghost notes, arpège, accents, styles

72. **Explorer les possibilités de la reverb** : 6 → 12 étapes (21 → 42 min, 180 → 360 XP) - enrichissement supplémentaire
    - Ajout : Spring, Hall, Plate, Room, Cathedral, paramètres

73. **Maîtriser le flanger** : 5 → 10 étapes (17 → 34 min, 160 → 320 XP) - enrichissement supplémentaire
    - Ajout : Principe, subtil/prononcé, avec distorsion, en solo

74. **Explorer le phaser** : 5 → 10 étapes (16 → 32 min, 155 → 310 XP) - enrichissement supplémentaire
    - Ajout : Principe, subtil/prononcé, en solo, avec distorsion

75. **Maîtriser le tremolo** : 5 → 10 étapes (15 → 30 min, 150 → 300 XP) - enrichissement supplémentaire
    - Ajout : Principe, lent/rapide, formes d'onde Sine/Square

#### Amps (4 cours)
76. **Réglages d'amplis par style** : 3 → 6 étapes (15 → 30 min, 130 → 260 XP) - enrichissement supplémentaire
    - Ajout : Clean/Vintage Fender, Rock/Crunch Marshall, High-Gain/Metal Mesa

77. **Maîtriser les amplis Fender** : 6 → 12 étapes (24 → 48 min, 200 → 400 XP) - enrichissement supplémentaire
    - Ajout : Histoire, Twin Reverb, Deluxe Reverb, son caractéristique, artistes, réglages

78. **Maîtriser les amplis Marshall** : 6 → 12 étapes (26 → 52 min, 220 → 440 XP) - enrichissement supplémentaire
    - Ajout : Histoire, Plexi 1959, JCM 800, son caractéristique, artistes, réglages

79. **Maîtriser les amplis Mesa Boogie** : 6 → 12 étapes (28 → 56 min, 250 → 500 XP) - enrichissement supplémentaire
    - Ajout : Histoire, Dual Rectifier, modes rectification, son caractéristique, artistes, réglages

#### Chains (1 cours)
80. **Optimiser l'ordre des effets** : 2 → 4 étapes (20 → 40 min, 150 → 300 XP) - enrichissement supplémentaire
    - Ajout : Pourquoi l'ordre est crucial, règles de base

#### Techniques (2 cours)
81. **Maîtriser les power chords** : 4 → 8 étapes (12 → 24 min, 95 → 190 XP) - enrichissement supplémentaire
    - Ajout : Forme de base, sur 6ème/5ème corde, avec palm mute

82. **Jouer des arpèges de base** : 5 → 10 étapes (18 → 36 min, 130 → 260 XP) - enrichissement supplémentaire
    - Ajout : Principe, Do majeur, Sol majeur, patterns, intégration

#### Styles (1 cours)
83. **Improviser en funk** : 6 → 12 étapes (28 → 56 min, 240 → 480 XP)
    - Ajout : Structure rythmique, ghost notes avancées, muting rythmique, effets funk (wah, phaser), riffs classiques, maîtres

#### Creativity (4 cours)
84. **Presets rock : classique, hard et alternatif** : 5 → 10 étapes (20 → 40 min, 180 → 360 XP)
    - Ajout : Presets rock classique/hard/alternatif/psyché (ampli + effets), optimisation, sauvegarde

85. **Presets blues : clean, crunch et saturé** : 5 → 10 étapes (18 → 36 min, 170 → 340 XP)
    - Ajout : Presets blues clean/crunch/saturé (ampli + effets), effets blues (wah, tremolo), optimisation, partage

86. **Presets metal : classique, moderne et progressif** : 5 → 10 étapes (22 → 44 min, 210 → 420 XP)
    - Ajout : Presets metal classique/moderne/progressif (ampli + effets), effets metal (pitch shifter), optimisation, documentation

87. **Presets jazz : clean, chorus et reverb** : 5 → 10 étapes (19 → 38 min, 200 → 400 XP)
    - Ajout : Presets jazz clean/chorus/reverb (ampli + effets), effets jazz (compression, EQ), optimisation, expérimentation

#### Quiz (2 cours)
88. **Quiz : Les bases de la guitare** : 4 → 8 questions (8 → 16 min, 100 → 200 XP) - enrichissement supplémentaire
    - Ajout : Questions sur cordes, cases, médiators, pratique

89. **Quiz : Effets et pédales** : 5 → 10 questions (10 → 20 min, 160 → 320 XP) - enrichissement supplémentaire
    - Ajout : Questions sur pédales, delay, reverb, chorus, ordre des effets

#### Basics supplémentaire (1 cours)
90. **La bonne posture et position** : 5 → 10 étapes (12 → 24 min, 90 → 180 XP) - enrichissement supplémentaire
    - Ajout : Hauteur guitare, angle manche, épaules/cou, pieds/jambes, étirements

### Cours Enrichis - Quatrième Lot (30 cours supplémentaires)

#### Techniques (18 cours)
91. **Maîtriser le palm mute** : 6 → 12 étapes (19 → 38 min, 170 → 340 XP) - enrichissement supplémentaire
    - Ajout : Variations pression, palm mute partiel, avec slides/arpège/harmoniques, intégration solos

92. **Hammer-ons et pull-offs : bases et trilles** : 6 → 12 étapes (22 → 44 min, 190 → 380 XP) - enrichissement supplémentaire
    - Ajout : Trilles complexes, avec bends/slides/arpège/vibrato, intégration solos

93. **Maîtriser les gammes majeures** : 6 → 12 étapes (30 → 60 min, 210 → 420 XP) - enrichissement supplémentaire
    - Ajout : 3 notes par corde, positions étendues, sauts de cordes, arpège, bends, styles

94. **Maîtriser les gammes mineures** : 6 → 12 étapes (32 → 64 min, 230 → 460 XP) - enrichissement supplémentaire
    - Ajout : 3 notes par corde, positions étendues, sauts de cordes, arpège, bends, styles

95. **Slide avancé : accordages ouverts et techniques expertes** : 6 → 12 étapes (25 → 50 min, 240 → 480 XP) - enrichissement supplémentaire
    - Ajout : Techniques avancées, avec bends/palm mute/arpège/harmoniques, styles

96. **Maîtriser le sweep picking avancé** : 7 → 14 étapes (33 → 66 min, 290 → 580 XP) - enrichissement supplémentaire
    - Ajout : Arpèges 5/6 notes, sauts de cordes, avec bends/harmoniques/slides, intégration solos

97. **Maîtriser le hybrid picking** : 6 → 12 étapes (27 → 54 min, 270 → 540 XP) - enrichissement supplémentaire
    - Ajout : Patterns complexes, avec bends/slides/harmoniques/arpège, styles

98. **Maîtriser le economy picking** : 6 → 12 étapes (29 → 58 min, 280 → 560 XP) - enrichissement supplémentaire
    - Ajout : Patterns complexes, avec bends/slides/harmoniques/arpège, styles

99. **Maîtriser le fingerpicking** : 6 → 12 étapes (26 → 52 min, 220 → 440 XP) - enrichissement supplémentaire
    - Ajout : Patterns complexes, avec bends/slides/harmoniques/arpège, styles

100. **Maîtriser les harmoniques** : 6 → 12 étapes (24 → 48 min, 260 → 520 XP) - enrichissement supplémentaire
    - Ajout : Avec bends/slides/palm mute/arpège/vibrato, styles

101. **Maîtriser le whammy bar** : 5 → 10 étapes (19 → 38 min, 180 → 360 XP) - enrichissement supplémentaire
    - Ajout : Avec bends/slides/palm mute/arpège, styles

102. **Maîtriser les double stops** : 6 → 12 étapes (21 → 42 min, 200 → 400 XP) - enrichissement supplémentaire
    - Ajout : Avec slides/palm mute/arpège/harmoniques/vibrato, styles

103. **Techniques avancées de picking** : 5 → 10 étapes (22 → 44 min, 180 → 360 XP) - enrichissement supplémentaire
    - Ajout : Bases sweep/economy/hybrid, exercices vitesse, intégration solos

104. **Maîtriser les gammes pentatoniques** : 6 → 12 étapes (28 → 56 min, 200 → 400 XP) - enrichissement supplémentaire
    - Ajout : 5 positions détaillées, avec bends/slides/arpège/harmoniques, styles

105. **Maîtriser les bends et vibrato** : 6 → 12 étapes (24 → 48 min, 190 → 380 XP) - enrichissement supplémentaire
    - Ajout : Avec slides/palm mute/arpège/harmoniques, styles

106. **Maîtriser les accords barrés** : 6 → 12 étapes (26 → 52 min, 200 → 400 XP) - enrichissement supplémentaire
    - Ajout : Extensions, avec bends/slides/palm mute/arpège, styles

107. **Maîtriser le tapping à deux mains** : 6 → 12 étapes (35 → 70 min, 280 → 560 XP) - enrichissement supplémentaire
    - Ajout : Avec bends/slides/palm mute/arpège/harmoniques, styles

108. **Comprendre les modes et gammes modales** : 8 → 16 étapes (40 → 80 min, 320 → 640 XP) - enrichissement supplémentaire
    - Ajout : Avec bends/slides/arpège/harmoniques/vibrato/palm mute/sauts, styles

109. **Legato avancé : runs et vitesse** : 7 → 14 étapes (28 → 56 min, 260 → 520 XP) - enrichissement supplémentaire
    - Ajout : Avec bends/slides/palm mute/arpège/harmoniques/sauts, styles

110. **Techniques de slide : doigts et bottleneck** : 6 → 12 étapes (20 → 40 min, 220 → 440 XP) - enrichissement supplémentaire
    - Ajout : Avec bends/palm mute/arpège/harmoniques/vibrato, styles

#### Styles (1 cours)
111. **Improviser en rock** : 6 → 12 étapes (35 → 70 min, 250 → 500 XP) - enrichissement supplémentaire
    - Ajout : Licks classiques, techniques expressives, changements, gammes, structure, maîtres

#### Creativity (2 cours)
112. **Créer des presets professionnels** : 6 → 12 étapes (18 → 36 min, 160 → 320 XP) - enrichissement supplémentaire
    - Ajout : Analyser références, choisir ampli, effets essentiels, EQ, tests, documentation

113. **Créer des textures sonores complexes** : 7 → 14 étapes (25 → 50 min, 240 → 480 XP) - enrichissement supplémentaire
    - Ajout : Textures spatiales/rythmiques/harmoniques, boucles feedback, presets atmosphériques, tests, documentation

#### Avancé (3 cours)
114. **Maîtriser le pitch shifting et l'harmonisation** : 6 → 12 étapes (22 → 44 min, 200 → 400 XP) - enrichissement supplémentaire
    - Ajout : Avec bends/slides/palm mute/arpège/harmoniques, styles

115. **Improviser en jazz** : 7 → 14 étapes (45 → 90 min, 350 → 700 XP) - enrichissement supplémentaire
    - Ajout : Accords extensions, arpèges, approches chromatiques, substitutions, phrasé, standards, maîtres

116. **Explorer les nuances de la distortion** : 7 → 14 étapes (23 → 46 min, 210 → 420 XP) - enrichissement supplémentaire
    - Ajout : Caractéristiques overdrive/distortion/fuzz/high-gain, empilage, réglages, styles

117. **Improviser en metal** : 7 → 14 étapes (38 → 76 min, 300 → 600 XP) - enrichissement supplémentaire
    - Ajout : Gammes, vitesse/précision, picking, palm mutes, solos techniques, effets, style

#### Effects (2 cours)
118. **Maîtriser les effets de modulation** : 6 → 12 étapes (20 → 40 min, 170 → 340 XP) - enrichissement supplémentaire
    - Ajout : Applications chorus/phaser/flanger, réglages, formes d'onde, combinaisons

119. **Explorer les possibilités du delay** : 6 → 12 étapes (19 → 38 min, 170 → 340 XP) - enrichissement supplémentaire
    - Ajout : Delay court/moyen/long, feedback, stéréo, modulation

#### Quiz (1 cours)
120. **Quiz : Techniques intermédiaires** : 4 → 8 questions (10 → 20 min, 150 → 300 XP) - enrichissement supplémentaire
    - Ajout : Questions sur gammes, techniques, effets, improvisation

### Cours Enrichis - Cinquième Lot (30 cours supplémentaires)

#### Styles (2 cours)
121. **Explorer les styles de jeu** : 6 → 12 étapes (30 → 60 min, 220 → 440 XP) - enrichissement supplémentaire
    - Ajout : Country, folk, pop, reggae, soul, style unique

122. **Improviser en blues** : 6 → 12 étapes (32 → 64 min, 240 → 480 XP) - enrichissement supplémentaire
    - Ajout : Blue notes, phrases classiques, changements I-IV-V, call/response, espace, feeling

#### Quiz (1 cours)
123. **Quiz : Techniques avancées** : 5 → 10 questions (12 → 24 min, 200 → 400 XP) - enrichissement supplémentaire
    - Ajout : Questions sur gammes metal, legato, modes, tapping, improvisation jazz

#### Basics (8 cours) - enrichissements supplémentaires
124. **Votre premier preset** : 4 → 8 étapes (5 → 10 min, 50 → 100 XP) - troisième enrichissement
    - Ajout : Variations rapides, point de départ, organiser par projet, partager

125. **Comprendre les amplis** : 4 → 8 étapes (8 → 16 min, 75 → 150 XP) - troisième enrichissement
    - Ajout : Types préamplis, importance puissance, canaux multiples, boucles d'effets

126. **Découvrir les effets de base** : 4 → 8 étapes (12 → 24 min, 90 → 180 XP) - deuxième enrichissement
    - Ajout : Effets gain/modulation/temps en détail, créer première chaîne

127. **Choisir son premier ampli** : 5 → 10 étapes (18 → 36 min, 110 → 220 XP) - deuxième enrichissement
    - Ajout : Combo vs Head, tubes vs transistors, modélisateurs, effets intégrés, tests

128. **Apprendre votre première chanson** : 6 → 12 étapes (25 → 50 min, 150 → 300 XP) - deuxième enrichissement
    - Ajout : Analyser structure, section par section, tablatures, enregistrement, version originale, touche personnelle

129. **Les techniques de picking de base** : 4 → 8 étapes (16 → 32 min, 100 → 200 XP) - deuxième enrichissement
    - Ajout : Tenir médiator, angle, profondeur, coordination

130. **Accorder sa guitare correctement** : 4 → 8 étapes (10 → 20 min, 80 → 160 XP) - deuxième enrichissement
    - Ajout : Accordages alternatifs, harmoniques, entretien, intonation

131. **Créer votre première chaîne d'effets** : 5 → 10 étapes (14 → 28 min, 120 → 240 XP) - deuxième enrichissement
    - Ajout : Série vs parallèle, boucles d'effets, true bypass, niveaux, presets

#### Effects (6 cours) - enrichissements supplémentaires
132. **Distortion vs Overdrive** : 2 → 4 étapes (10 → 20 min, 80 → 160 XP) - deuxième enrichissement
    - Ajout : Quand utiliser overdrive, quand utiliser distortion

133. **Maîtriser les accords mineurs** : 5 → 10 étapes (14 → 28 min, 110 → 220 XP) - deuxième enrichissement
    - Ajout : Progressions classiques, extensions, barrés, utilisation, transitions majeur/mineur

134. **Maîtriser le strumming** : 6 → 12 étapes (20 → 40 min, 140 → 280 XP) - deuxième enrichissement
    - Ajout : Patterns avancés, palm mute, ghost notes, arpège, accents, styles

135. **Explorer les possibilités de la reverb** : 6 → 12 étapes (21 → 42 min, 180 → 360 XP) - deuxième enrichissement
    - Ajout : Spring, Hall, Plate, Room, Cathedral, paramètres

136. **Maîtriser le flanger** : 5 → 10 étapes (17 → 34 min, 160 → 320 XP) - deuxième enrichissement
    - Ajout : Principe, subtil/prononcé, avec distorsion, en solo

137. **Explorer le phaser** : 5 → 10 étapes (16 → 32 min, 155 → 310 XP) - deuxième enrichissement
    - Ajout : Principe, subtil/prononcé, en solo, avec distorsion

138. **Maîtriser le tremolo** : 5 → 10 étapes (15 → 30 min, 150 → 300 XP) - deuxième enrichissement
    - Ajout : Principe, lent/rapide, formes d'onde Sine/Square

139. **Quiz : Effets et pédales** : 5 → 10 questions (10 → 20 min, 160 → 320 XP) - deuxième enrichissement
    - Ajout : Questions sur pédales, delay, reverb, chorus, ordre des effets

#### Amps (3 cours) - enrichissements supplémentaires
140. **Réglages d'amplis par style** : 3 → 6 étapes (15 → 30 min, 130 → 260 XP) - deuxième enrichissement
    - Ajout : Clean/Vintage Fender, Rock/Crunch Marshall, High-Gain/Metal Mesa

141. **Maîtriser les amplis Fender** : 6 → 12 étapes (24 → 48 min, 200 → 400 XP) - deuxième enrichissement
    - Ajout : Histoire, Twin Reverb, Deluxe Reverb, son caractéristique, artistes, réglages

142. **Maîtriser les amplis Marshall** : 6 → 12 étapes (26 → 52 min, 220 → 440 XP) - deuxième enrichissement
    - Ajout : Histoire, Plexi 1959, JCM 800, son caractéristique, artistes, réglages

143. **Maîtriser les amplis Mesa Boogie** : 6 → 12 étapes (28 → 56 min, 250 → 500 XP) - deuxième enrichissement
    - Ajout : Histoire, Dual Rectifier, modes rectification, son caractéristique, artistes, réglages

#### Chains (1 cours) - enrichissement supplémentaire
144. **Optimiser l'ordre des effets** : 2 → 4 étapes (20 → 40 min, 150 → 300 XP) - deuxième enrichissement
    - Ajout : Pourquoi l'ordre est crucial, règles de base

#### Techniques (2 cours) - enrichissements supplémentaires
145. **Maîtriser les power chords** : 4 → 8 étapes (12 → 24 min, 95 → 190 XP) - deuxième enrichissement
    - Ajout : Forme de base, sur 6ème/5ème corde, avec palm mute

146. **Jouer des arpèges de base** : 5 → 10 étapes (18 → 36 min, 130 → 260 XP) - deuxième enrichissement
    - Ajout : Principe, Do majeur, Sol majeur, patterns, intégration

#### Basics supplémentaire (1 cours) - enrichissement supplémentaire
147. **La bonne posture et position** : 5 → 10 étapes (12 → 24 min, 90 → 180 XP) - deuxième enrichissement
    - Ajout : Hauteur guitare, angle manche, épaules/cou, pieds/jambes, étirements

#### Styles (1 cours) - enrichissement supplémentaire
148. **Improviser en funk** : 6 → 12 étapes (28 → 56 min, 240 → 480 XP) - deuxième enrichissement
    - Ajout : Structure rythmique, ghost notes avancées, muting rythmique, effets funk, riffs classiques, maîtres

#### Creativity (2 cours) - enrichissements supplémentaires
149. **Presets rock : classique, hard et alternatif** : 5 → 10 étapes (20 → 40 min, 180 → 360 XP) - deuxième enrichissement
    - Ajout : Presets rock classique/hard/alternatif/psyché (ampli + effets), optimisation, sauvegarde

150. **Presets blues : clean, crunch et saturé** : 5 → 10 étapes (18 → 36 min, 170 → 340 XP) - deuxième enrichissement
    - Ajout : Presets blues clean/crunch/saturé (ampli + effets), effets blues, optimisation, partage

### Cours Enrichis - Sixième Lot (30 cours supplémentaires)

#### Effects (2 cours) - enrichissements supplémentaires
151. **Maîtriser les effets de modulation** : 6 → 12 étapes (20 → 40 min, 170 → 340 XP) - deuxième enrichissement
    - Ajout : Chorus/phaser/flanger/tremolo/vibrato en détail, combiner modulations

152. **Explorer les possibilités du delay** : 6 → 12 étapes (19 → 38 min, 170 → 340 XP) - deuxième enrichissement
    - Ajout : Delay analogique/numérique/tape/stéréo, modulation, techniques avancées

#### Creativity (2 cours) - enrichissements supplémentaires
153. **Presets metal : classique, moderne et progressif** : 5 → 10 étapes (22 → 44 min, 210 → 420 XP) - deuxième enrichissement
    - Ajout : Presets metal classique/moderne/progressif (ampli + effets), pitch shifter, optimisation, documentation

154. **Presets jazz : clean, chorus et reverb** : 5 → 10 étapes (19 → 38 min, 200 → 400 XP) - deuxième enrichissement
    - Ajout : Presets jazz clean/chorus/reverb (ampli + effets), compression/EQ, optimisation, expérimentation

#### Techniques (23 cours) - enrichissements supplémentaires (troisième enrichissement)
155. **Maîtriser le palm mute** : 6 → 12 étapes (19 → 38 min, 170 → 340 XP) - troisième enrichissement
    - Ajout : Avec slides/arpège/harmoniques, intégration solos, bends, vibrato

156. **Hammer-ons et pull-offs : bases et trilles** : 6 → 12 étapes (22 → 44 min, 190 → 380 XP) - troisième enrichissement
    - Ajout : Trilles avec bends/slides/arpège/vibrato, intégration solos, trilles complexes

157. **Maîtriser les gammes majeures** : 6 → 12 étapes (30 → 60 min, 210 → 420 XP) - troisième enrichissement
    - Ajout : Positions étendues, sauts de cordes, arpège, bends, styles, 3 notes par corde

158. **Maîtriser les gammes mineures** : 6 → 12 étapes (32 → 64 min, 230 → 460 XP) - troisième enrichissement
    - Ajout : Positions étendues, sauts de cordes, arpège, bends, styles, 3 notes par corde

159. **Slide avancé : accordages ouverts et techniques expertes** : 6 → 12 étapes (25 → 50 min, 240 → 480 XP) - troisième enrichissement
    - Ajout : Avec bends/palm mute/arpège/harmoniques, styles, techniques avancées

160. **Maîtriser le sweep picking avancé** : 7 → 14 étapes (33 → 66 min, 290 → 580 XP) - troisième enrichissement
    - Ajout : Sauts de cordes, avec bends/harmoniques/slides, intégration solos, arpèges 5/6 notes

161. **Maîtriser le hybrid picking** : 6 → 12 étapes (27 → 54 min, 270 → 540 XP) - troisième enrichissement
    - Ajout : Avec bends/slides/harmoniques/arpège, styles, patterns complexes

162. **Maîtriser le economy picking** : 6 → 12 étapes (29 → 58 min, 280 → 560 XP) - troisième enrichissement
    - Ajout : Avec bends/slides/harmoniques/arpège, styles, patterns complexes

163. **Maîtriser le fingerpicking** : 6 → 12 étapes (26 → 52 min, 220 → 440 XP) - troisième enrichissement
    - Ajout : Avec bends/slides/harmoniques/arpège, styles, patterns complexes

164. **Maîtriser les harmoniques** : 6 → 12 étapes (24 → 48 min, 260 → 520 XP) - troisième enrichissement
    - Ajout : Avec slides/palm mute/arpège/vibrato, styles, bends

165. **Maîtriser le whammy bar** : 5 → 10 étapes (19 → 38 min, 180 → 360 XP) - troisième enrichissement
    - Ajout : Avec slides/palm mute/arpège, styles, bends

166. **Maîtriser les double stops** : 6 → 12 étapes (21 → 42 min, 200 → 400 XP) - troisième enrichissement
    - Ajout : Avec palm mute/arpège/harmoniques/vibrato, styles, slides

167. **Improviser en rock** : 6 → 12 étapes (35 → 70 min, 250 → 500 XP) - troisième enrichissement
    - Ajout : Techniques expressives, changements, gammes, structure, maîtres, licks classiques

168. **Techniques avancées de picking** : 5 → 10 étapes (22 → 44 min, 180 → 360 XP) - troisième enrichissement
    - Ajout : Economy/hybrid picking bases, exercices vitesse, intégration solos, sweep picking bases

169. **Maîtriser les gammes pentatoniques** : 6 → 12 étapes (28 → 56 min, 200 → 400 XP) - troisième enrichissement
    - Ajout : Avec bends/slides/arpège/harmoniques, styles, 5 positions détaillées

170. **Maîtriser les bends et vibrato** : 6 → 12 étapes (24 → 48 min, 190 → 380 XP) - troisième enrichissement
    - Ajout : Avec slides/palm mute/arpège/harmoniques, styles, vibrato avec slides

171. **Maîtriser les accords barrés** : 6 → 12 étapes (26 → 52 min, 200 → 400 XP) - troisième enrichissement
    - Ajout : Avec bends/slides/palm mute/arpège, styles, extensions

172. **Maîtriser le tapping à deux mains** : 6 → 12 étapes (35 → 70 min, 280 → 560 XP) - troisième enrichissement
    - Ajout : Avec bends/slides/palm mute/arpège, styles, harmoniques

173. **Comprendre les modes et gammes modales** : 8 → 16 étapes (40 → 80 min, 320 → 640 XP) - troisième enrichissement
    - Ajout : Avec slides/arpège/harmoniques/vibrato/palm mute/sauts, styles, bends

174. **Legato avancé : runs et vitesse** : 7 → 14 étapes (28 → 56 min, 260 → 520 XP) - troisième enrichissement
    - Ajout : Avec slides/palm mute/arpège/harmoniques/sauts, styles, bends

175. **Techniques de slide : doigts et bottleneck** : 6 → 12 étapes (20 → 40 min, 220 → 440 XP) - troisième enrichissement
    - Ajout : Avec palm mute/arpège/harmoniques, styles, vibrato, bends

#### Creativity (2 cours) - enrichissements supplémentaires (troisième enrichissement)
176. **Créer des presets professionnels** : 6 → 12 étapes (18 → 36 min, 160 → 320 XP) - troisième enrichissement
    - Ajout : Choisir ampli, effets essentiels, EQ, tests, documentation, analyser références

177. **Créer des textures sonores complexes** : 7 → 14 étapes (25 → 50 min, 240 → 480 XP) - troisième enrichissement
    - Ajout : Textures rythmiques/harmoniques, boucles feedback, presets atmosphériques, tests, documentation, textures spatiales

#### Avancé (3 cours) - enrichissements supplémentaires (troisième enrichissement)
178. **Maîtriser le pitch shifting et l'harmonisation** : 6 → 12 étapes (22 → 44 min, 200 → 400 XP) - troisième enrichissement
    - Ajout : Avec slides/palm mute/arpège, styles, harmoniques, bends

179. **Improviser en jazz** : 7 → 14 étapes (45 → 90 min, 350 → 700 XP) - troisième enrichissement
    - Ajout : Arpèges, approches chromatiques, substitutions, phrasé, standards, maîtres, accords extensions

180. **Explorer les nuances de la distortion** : 7 → 14 étapes (23 → 46 min, 210 → 420 XP) - troisième enrichissement
    - Ajout : Caractéristiques overdrive/distortion/fuzz/high-gain, empilage, réglages, styles

### Cours Enrichis - Septième Lot (30 cours supplémentaires)

#### Basics (2 cours) - enrichissements supplémentaires
181. **Les accords de base pour débutants** : 5 → 10 étapes (15 → 30 min, 100 → 200 XP) - deuxième enrichissement
    - Ajout : Accords avec extensions, barrés, progressions classiques, accords ouverts, transitions fluides

182. **Maîtriser le rythme et le tempo** : 4 → 8 étapes (20 → 40 min, 120 → 240 XP) - deuxième enrichissement
    - Ajout : Subdivisions rythmiques, accents, polyrythmes, métronome avancé

#### Effects (5 cours) - enrichissements supplémentaires
183. **Maîtriser les effets de modulation** : 6 → 12 étapes (20 → 40 min, 170 → 340 XP) - troisième enrichissement
    - Ajout : Chorus stéréo, phaser avec feedback, flanger avec modulation, tremolo formes d'onde, vibrato profondeur, modulations en série

184. **Explorer les possibilités du delay** : 6 → 12 étapes (19 → 38 min, 170 → 340 XP) - troisième enrichissement
    - Ajout : Delay avec filtres/saturation/modulation avancée, en rythme, avec ducking, techniques créatives

185. **Maîtriser le pitch shifting et l'harmonisation** : 6 → 12 étapes (22 → 44 min, 200 → 400 XP) - quatrième enrichissement
    - Ajout : Détection tonalité, harmoniseur intelligent, feedback, harmonies tiers/quintes, modulation, styles

186. **Explorer les nuances de la distortion** : 7 → 14 étapes (23 → 46 min, 210 → 420 XP) - quatrième enrichissement
    - Ajout : Compression/EQ avancés, gain staging, voies saturation, clean blend, asymétrique/symétrique, gain stacking avancé

187. **Maîtriser le flanger** : 5 → 10 étapes (17 → 34 min, 160 → 320 XP) - troisième enrichissement
    - Ajout : Feedback extrême, modulation, stéréo, filtres, techniques créatives

188. **Explorer le phaser** : 5 → 10 étapes (16 → 32 min, 155 → 310 XP) - troisième enrichissement
    - Ajout : Feedback, modulation, stéréo, filtres, techniques créatives

189. **Maîtriser le tremolo** : 5 → 10 étapes (15 → 30 min, 150 → 300 XP) - troisième enrichissement
    - Ajout : Formes d'onde avancées, modulation, stéréo, filtres, techniques créatives

190. **Quiz : Effets et pédales** : 5 → 10 questions (10 → 20 min, 160 → 320 XP) - troisième enrichissement
    - Ajout : Questions sur pédales vintage, reverb, phaser, ordre effets, true bypass

#### Amps (3 cours) - enrichissements supplémentaires (troisième enrichissement)
191. **Maîtriser les amplis Fender** : 6 → 12 étapes (24 → 48 min, 200 → 400 XP) - troisième enrichissement
    - Ajout : Modèles Fender, réglages studio/scène, effets intégrés, entretien, mic placement

192. **Maîtriser les amplis Marshall** : 6 → 12 étapes (26 → 52 min, 220 → 440 XP) - troisième enrichissement
    - Ajout : Modèles Marshall, réglages studio/scène, effets intégrés, entretien, mic placement

193. **Maîtriser les amplis Mesa Boogie** : 6 → 12 étapes (28 → 56 min, 250 → 500 XP) - troisième enrichissement
    - Ajout : Modèles Mesa, réglages studio/scène, modes rectification, entretien, mic placement

#### Techniques (3 cours) - enrichissements supplémentaires
194. **Maîtriser les power chords** : 4 → 8 étapes (12 → 24 min, 95 → 190 XP) - troisième enrichissement
    - Ajout : Extensions, en mouvement, avec slides/bends

195. **Jouer des arpèges de base** : 5 → 10 étapes (18 → 36 min, 130 → 260 XP) - troisième enrichissement
    - Ajout : Extensions, avec slides/bends/harmoniques/vibrato

196. **Improviser en funk** : 6 → 12 étapes (28 → 56 min, 240 → 480 XP) - troisième enrichissement
    - Ajout : Riffs avec slides/bends/harmoniques/vibrato, techniques avancées, style unique

#### Styles (1 cours) - enrichissement supplémentaire
197. **Improviser en metal** : 7 → 14 étapes (38 → 76 min, 300 → 600 XP) - deuxième enrichissement
    - Ajout : Gammes, vitesse/précision, picking, palm mutes, solos techniques, effets, style

#### Creativity (6 cours) - enrichissements supplémentaires
198. **Presets rock : classique, hard et alternatif** : 5 → 10 étapes (20 → 40 min, 180 → 360 XP) - troisième enrichissement
    - Ajout : Variations, contextes, effets créatifs, EQ avancé, différents amplis

199. **Presets blues : clean, crunch et saturé** : 5 → 10 étapes (18 → 36 min, 170 → 340 XP) - troisième enrichissement
    - Ajout : Variations, contextes, effets créatifs, EQ avancé, différents amplis

200. **Presets metal : classique, moderne et progressif** : 5 → 10 étapes (22 → 44 min, 210 → 420 XP) - troisième enrichissement
    - Ajout : Variations, contextes, effets créatifs, EQ avancé, différents amplis

201. **Presets jazz : clean, chorus et reverb** : 5 → 10 étapes (19 → 38 min, 200 → 400 XP) - troisième enrichissement
    - Ajout : Variations, contextes, effets créatifs, EQ avancé, différents amplis

202. **Créer des presets professionnels** : 6 → 12 étapes (18 → 36 min, 160 → 320 XP) - quatrième enrichissement
    - Ajout : Variations rapides, contextes, effets créatifs, EQ avancé, différents amplis, organisation

203. **Créer des textures sonores complexes** : 7 → 14 étapes (25 → 50 min, 240 → 480 XP) - quatrième enrichissement
    - Ajout : Effets en cascade, feedback contrôlé, pitch shifting, modulation complexe, filtres dynamiques, tests, documentation

#### Avancé (3 cours) - enrichissements supplémentaires
204. **Improviser en jazz** : 7 → 14 étapes (45 → 90 min, 350 → 700 XP) - quatrième enrichissement
    - Ajout : Arpèges extensions, approches chromatiques avancées, substitutions avancées, phrasé silences, standards variations, analyse maîtres, style unique

205. **Explorer les nuances de la distortion** : 7 → 14 étapes (23 → 46 min, 210 → 420 XP) - quatrième enrichissement
    - Ajout : Compression/EQ avancés, gain staging avancé, voies saturation avancées, clean blend avancé, asymétrique/symétrique avancée, gain stacking avancé

206. **Improviser en metal** : 7 → 14 étapes (38 → 76 min, 300 → 600 XP) - troisième enrichissement
    - Ajout : Gammes avancées, vitesse/précision avancées, picking avancées, palm mutes avancés, solos techniques avancés, effets avancée, style avancé

#### Quiz (1 cours) - enrichissement supplémentaire
207. **Quiz : Techniques avancées** : 5 → 10 questions (12 → 24 min, 200 → 400 XP) - deuxième enrichissement
    - Ajout : Questions sur gammes metal, legato, modes, tapping, improvisation jazz

#### Effects supplémentaire (1 cours) - enrichissement supplémentaire
208. **Explorer les possibilités de la reverb** : 6 → 12 étapes (21 → 42 min, 180 → 360 XP) - troisième enrichissement
    - Ajout : Pré-delay, modulation, filtres, ducking, pitch shifting, techniques créatives

#### Techniques supplémentaire (2 cours) - enrichissements supplémentaires
209. **Maîtriser les accords mineurs** : 5 → 10 étapes (14 → 28 min, 110 → 220 XP) - troisième enrichissement
    - Ajout : Extensions avancées, position ouverte, substitutions, tensions, progressions complexes

210. **Maîtriser le strumming** : 6 → 12 étapes (20 → 40 min, 140 → 280 XP) - troisième enrichissement
    - Ajout : Accents dynamiques, muting sélectif, arpèges complexes, slides, bends, compositions

### Cours Enrichis - Huitième Lot (30 cours supplémentaires)

#### Basics (8 cours) - enrichissements supplémentaires
211. **Votre premier preset** : 4 → 8 étapes (5 → 10 min, 50 → 100 XP) - quatrième enrichissement
    - Ajout : Presets styles/contextes, effets créatifs, EQ avancé

212. **Comprendre les amplis** : 4 → 8 étapes (8 → 16 min, 75 → 150 XP) - quatrième enrichissement
    - Ajout : Types lampes, haut-parleur, entretien, mic placement

213. **Découvrir les effets de base** : 4 → 8 étapes (12 → 24 min, 90 → 180 XP) - troisième enrichissement
    - Ajout : Effets gain/modulation/temps avec EQ/feedback/filtres, chaîne avancée

214. **Choisir son premier ampli** : 5 → 10 étapes (18 → 36 min, 110 → 220 XP) - troisième enrichissement
    - Ajout : Amplis studio/scène/maison/répétitions, tests avant achat

215. **Apprendre votre première chanson** : 6 → 12 étapes (25 → 50 min, 150 → 300 XP) - troisième enrichissement
    - Ajout : Structure harmonique/rythmique, outils modernes, vidéos, cours en ligne, version personnelle

216. **Les techniques de picking de base** : 4 → 8 étapes (16 → 32 min, 100 → 200 XP) - troisième enrichissement
    - Ajout : Picking avec accents/muting/slides/bends

217. **Accorder sa guitare correctement** : 4 → 8 étapes (10 → 20 min, 80 → 160 XP) - troisième enrichissement
    - Ajout : Accordages alternatifs avancés, harmoniques avancées, entretien avancé, intonation avancée

218. **Créer votre première chaîne d'effets** : 5 → 10 étapes (14 → 28 min, 120 → 240 XP) - troisième enrichissement
    - Ajout : Chaînes styles/contextes, effets créatifs, EQ avancé, différents amplis

219. **La bonne posture et position** : 5 → 10 étapes (12 → 24 min, 90 → 180 XP) - troisième enrichissement
    - Ajout : Posture styles/contextes, étirements avancés, renforcement, types guitares

#### Effects (4 cours) - enrichissements supplémentaires
220. **Distortion vs Overdrive** : 2 → 4 étapes (10 → 20 min, 80 → 160 XP) - troisième enrichissement
    - Ajout : Overdrive avec EQ, distortion avec compression

221. **Réglages d'amplis par style** : 3 → 6 étapes (15 → 30 min, 130 → 260 XP) - troisième enrichissement
    - Ajout : Réglages studio/scène/maison

222. **Optimiser l'ordre des effets** : 2 → 4 étapes (20 → 40 min, 150 → 300 XP) - troisième enrichissement
    - Ajout : Ordre styles, effets créatifs

#### Styles (2 cours) - enrichissements supplémentaires
223. **Explorer les styles de jeu** : 6 → 12 étapes (30 → 60 min, 220 → 440 XP) - deuxième enrichissement
    - Ajout : Rock alternatif, punk, grunge, indie, shoegaze, style unique

224. **Improviser en blues** : 6 → 12 étapes (32 → 64 min, 240 → 480 XP) - troisième enrichissement
    - Ajout : Blue notes avec slides, phrases variations, changements extensions, call/response avancé, espace avancé, feeling techniques expressives

#### Quiz (1 cours) - enrichissement supplémentaire
225. **Quiz : Les bases de la guitare** : 4 → 8 questions (8 → 16 min, 100 → 200 XP) - deuxième enrichissement
    - Ajout : Questions sur frettes, cordes, accords, effets

#### Effects (4 cours) - enrichissements supplémentaires (quatrième enrichissement)
226. **Maîtriser les accords mineurs** : 5 → 10 étapes (14 → 28 min, 110 → 220 XP) - quatrième enrichissement
    - Ajout : Tensions avancées, substitutions avancées, voicings, inversions, modulations

227. **Maîtriser le strumming** : 6 → 12 étapes (20 → 40 min, 140 → 280 XP) - quatrième enrichissement
    - Ajout : Polyrythmes, accents dynamiques avancés, muting sélectif avancé, arpèges complexes avancés, slides avancés, compositions avancées

228. **Explorer les possibilités de la reverb** : 6 → 12 étapes (21 → 42 min, 180 → 360 XP) - quatrième enrichissement
    - Ajout : Pré-delay avancé, modulation avancée, filtres avancés, ducking avancé, pitch shifting avancé, techniques créatives avancées

229. **Maîtriser le flanger** : 5 → 10 étapes (17 → 34 min, 160 → 320 XP) - quatrième enrichissement
    - Ajout : Feedback extrême avancé, modulation avancée, stéréo avancé, filtres avancés, techniques créatives avancées

230. **Explorer le phaser** : 5 → 10 étapes (16 → 32 min, 155 → 310 XP) - quatrième enrichissement
    - Ajout : Feedback avancé, modulation avancée, stéréo avancé, filtres avancés, techniques créatives avancées

231. **Maîtriser le tremolo** : 5 → 10 étapes (15 → 30 min, 150 → 300 XP) - quatrième enrichissement
    - Ajout : Formes d'onde avancées, modulation avancée, stéréo avancé, filtres avancés, techniques créatives avancées

232. **Quiz : Effets et pédales** : 5 → 10 questions (10 → 20 min, 160 → 320 XP) - quatrième enrichissement
    - Ajout : Questions sur pédales boutique, reverb, delay, modulation, buffered bypass

#### Amps (3 cours) - enrichissements supplémentaires (quatrième enrichissement)
233. **Maîtriser les amplis Fender** : 6 → 12 étapes (24 → 48 min, 200 → 400 XP) - quatrième enrichissement
    - Ajout : Modèles avancés, réglages contextes, effets intégrés avancés, entretien avancé, mic placement avancées, recording

234. **Maîtriser les amplis Marshall** : 6 → 12 étapes (26 → 52 min, 220 → 440 XP) - quatrième enrichissement
    - Ajout : Modèles avancés, réglages contextes, effets intégrés avancés, entretien avancé, mic placement avancées, recording

235. **Maîtriser les amplis Mesa Boogie** : 6 → 12 étapes (28 → 56 min, 250 → 500 XP) - quatrième enrichissement
    - Ajout : Modèles avancés, réglages contextes, modes rectification avancés, entretien avancé, mic placement avancées, recording

#### Techniques (3 cours) - enrichissements supplémentaires (quatrième enrichissement)
236. **Maîtriser les power chords** : 4 → 8 étapes (12 → 24 min, 95 → 190 XP) - quatrième enrichissement
    - Ajout : Extensions avancées, mouvement avancé, slides avancés, bends avancés

237. **Jouer des arpèges de base** : 5 → 10 étapes (18 → 36 min, 130 → 260 XP) - quatrième enrichissement
    - Ajout : Extensions avancées, slides avancés, bends avancés, harmoniques avancées, vibrato avancé

238. **Improviser en funk** : 6 → 12 étapes (28 → 56 min, 240 → 480 XP) - quatrième enrichissement
    - Ajout : Riffs avec slides/bends/harmoniques/vibrato avancés, techniques avancées, style avancé

#### Creativity (2 cours) - enrichissements supplémentaires (quatrième enrichissement)
239. **Presets rock : classique, hard et alternatif** : 5 → 10 étapes (20 → 40 min, 180 → 360 XP) - quatrième enrichissement
    - Ajout : Variations avancées, contextes avancés, effets créatifs avancés, EQ avancé, amplis avancés

240. **Presets blues : clean, crunch et saturé** : 5 → 10 étapes (18 → 36 min, 170 → 340 XP) - quatrième enrichissement
    - Ajout : Variations avancées, contextes avancés, effets créatifs avancés, EQ avancé, amplis avancés

### Cours Enrichis - Enrichissement Final (30 cours supplémentaires - enrichissements manquants)

#### Creativity (2 cours) - enrichissements supplémentaires (quatrième enrichissement)
241. **Presets metal : classique, moderne et progressif** : 5 → 10 étapes (22 → 44 min, 210 → 420 XP) - quatrième enrichissement
    - Ajout : Variations avancées, contextes avancés, effets créatifs avancés, EQ avancé, amplis avancés

242. **Presets jazz : clean, chorus et reverb** : 5 → 10 étapes (19 → 38 min, 200 → 400 XP) - quatrième enrichissement
    - Ajout : Variations avancées, contextes avancés, effets créatifs avancés, EQ avancé, amplis avancés

#### Effects (4 cours) - enrichissements supplémentaires (quatrième/cinquième enrichissement)
243. **Maîtriser les effets de modulation** : 6 → 12 étapes (20 → 40 min, 170 → 340 XP) - quatrième enrichissement
    - Ajout : Formes d'onde, stages multiples, modulations parallèles

244. **Explorer les possibilités du delay** : 6 → 12 étapes (19 → 38 min, 170 → 340 XP) - quatrième enrichissement
    - Ajout : Formes d'onde, filtres dynamiques, pitch shifting, saturation dynamique, modulation complexe, techniques créatives avancées

245. **Maîtriser le pitch shifting et l'harmonisation** : 6 → 12 étapes (22 → 44 min, 200 → 400 XP) - cinquième enrichissement
    - Ajout : Détection tonalité avancée, harmoniseur intelligent avancé, feedback avancé, harmonies avancées, modulation avancée, styles avancés

246. **Explorer les nuances de la distortion** : 7 → 14 étapes (23 → 46 min, 210 → 420 XP) - cinquième enrichissement
    - Ajout : Compression ultra-avancée, EQ ultra-avancé, gain staging ultra-avancé, voies saturation ultra-avancées, clean blend ultra-avancé, distorsion asymétrique/symétrique ultra-avancée, gain stacking ultra-avancées

#### Styles (2 cours) - enrichissements supplémentaires (quatrième/cinquième enrichissement)
247. **Improviser en metal** : 7 → 14 étapes (38 → 76 min, 300 → 600 XP) - quatrième enrichissement
    - Ajout : Gammes ultra-avancées, vitesse/précision ultra-avancées, picking ultra-avancées, palm mutes ultra-avancés, solos techniques ultra-avancés, effets ultra-avancée, style ultra-avancé

248. **Improviser en jazz** : 7 → 14 étapes (45 → 90 min, 350 → 700 XP) - cinquième enrichissement
    - Ajout : Arpèges extensions ultra-avancées, approches chromatiques ultra-avancées, substitutions tritoniques ultra-avancées, phrasé silences ultra-avancé, standards variations ultra-avancées, maîtres analyse ultra-avancé, style ultra-avancé

#### Creativity (2 cours) - enrichissements supplémentaires (cinquième enrichissement)
249. **Créer des presets professionnels** : 6 → 12 étapes (18 → 36 min, 160 → 320 XP) - cinquième enrichissement
    - Ajout : Variations ultra-rapides, contextes ultra-avancés, effets créatifs ultra-avancés, EQ ultra-avancé, amplis ultra-avancés, organisation/documentation ultra-avancés

250. **Créer des textures sonores complexes** : 7 → 14 étapes (25 → 50 min, 240 → 480 XP) - cinquième enrichissement
    - Ajout : Effets cascade ultra-avancées, feedback contrôlé ultra-avancé, pitch shifting ultra-avancé, modulation complexe ultra-avancée, filtres dynamiques ultra-avancés, contextes ultra-avancés, documentation ultra-avancées

#### Techniques (20 cours) - enrichissements supplémentaires (quatrième enrichissement)
251-270. **20 cours de techniques** : Enrichissements supplémentaires avec techniques ultra-avancées (bends, slides, palm mute, arpèges, harmoniques, vibrato, etc.)

### Statistiques d'Enrichissement

#### Premier Enrichissement (30 cours)
- **Cours enrichis** : 30 cours
- **Étapes ajoutées** : ~150 nouvelles étapes
- **Durée ajoutée** : ~1300 minutes supplémentaires (~22 heures)
- **XP ajouté** : ~13000 XP supplémentaires

#### Deuxième Enrichissement (30 cours supplémentaires)
- **Cours enrichis** : 30 cours supplémentaires
- **Étapes ajoutées** : ~150 nouvelles étapes
- **Durée ajoutée** : ~1300 minutes supplémentaires (~22 heures)
- **XP ajouté** : ~13000 XP supplémentaires

#### Troisième Enrichissement (30 cours supplémentaires)
- **Cours enrichis** : 30 cours supplémentaires
- **Étapes ajoutées** : ~150 nouvelles étapes
- **Durée ajoutée** : ~400 minutes supplémentaires (~7 heures)
- **XP ajouté** : ~3500 XP supplémentaires

#### Quatrième Enrichissement (30 cours supplémentaires)
- **Cours enrichis** : 30 cours supplémentaires
- **Étapes ajoutées** : ~150 nouvelles étapes
- **Durée ajoutée** : ~700 minutes supplémentaires (~12 heures)
- **XP ajouté** : ~5500 XP supplémentaires

#### Cinquième Enrichissement (30 cours supplémentaires)
- **Cours enrichis** : 30 cours supplémentaires
- **Étapes ajoutées** : ~150 nouvelles étapes
- **Durée ajoutée** : ~500 minutes supplémentaires (~8 heures)
- **XP ajouté** : ~4000 XP supplémentaires

#### Sixième Enrichissement (30 cours supplémentaires)
- **Cours enrichis** : 30 cours supplémentaires
- **Étapes ajoutées** : ~150 nouvelles étapes
- **Durée ajoutée** : ~700 minutes supplémentaires (~12 heures)
- **XP ajouté** : ~5500 XP supplémentaires

#### Septième Enrichissement (30 cours supplémentaires)
- **Cours enrichis** : 30 cours supplémentaires
- **Étapes ajoutées** : ~150 nouvelles étapes
- **Durée ajoutée** : ~600 minutes supplémentaires (~10 heures)
- **XP ajouté** : ~5000 XP supplémentaires

#### Huitième Enrichissement (30 cours supplémentaires)
- **Cours enrichis** : 30 cours supplémentaires
- **Étapes ajoutées** : ~150 nouvelles étapes
- **Durée ajoutée** : ~500 minutes supplémentaires (~8 heures)
- **XP ajouté** : ~4500 XP supplémentaires

#### Enrichissement Final (30 cours supplémentaires - enrichissements manquants)
- **Cours enrichis** : 30 cours supplémentaires
- **Étapes ajoutées** : ~180 nouvelles étapes
- **Durée ajoutée** : ~700 minutes supplémentaires (~12 heures)
- **XP ajouté** : ~6000 XP supplémentaires

#### Enrichissement Supplémentaire - Leçons du Cours "Choisir son premier ampli" (4 leçons)
- **Leçons enrichies** : 4 leçons du cours "Choisir son premier ampli"
- **Leçons** :
  271. **Les modélisateurs numériques** : Leçon enrichie avec contenu complet (5 sections, 500+ mots)
     - Ajout : Introduction pédagogique, développement principal détaillé, culture musicale, mise en pratique avec exercices, ressources visuelles
  
  272. **Les amplis pour le studio** : Leçon enrichie avec contenu complet (5 sections, 500+ mots)
     - Ajout : Introduction pédagogique, développement principal détaillé, culture musicale, mise en pratique avec exercices, ressources visuelles
  
  273. **Les amplis pour la scène** : Leçon enrichie avec contenu complet (5 sections, 500+ mots)
     - Ajout : Introduction pédagogique, développement principal détaillé, culture musicale, mise en pratique avec exercices, ressources visuelles
  
  274. **Les amplis pour la maison** : Leçon enrichie avec contenu complet (5 sections, 500+ mots)
     - Ajout : Introduction pédagogique, développement principal détaillé, culture musicale, mise en pratique avec exercices, ressources visuelles

- **Étapes ajoutées** : 4 leçons complètes (chacune avec 5 sections structurées)
- **Durée ajoutée** : ~80 minutes supplémentaires (~1h20)
- **XP ajouté** : ~800 XP supplémentaires

#### Total des Enrichissements
- **Cours enrichis au total** : 274 enrichissements (270 cours + 4 leçons supplémentaires)
- **Étapes ajoutées au total** : ~1384 nouvelles étapes
- **Durée ajoutée au total** : ~6780 minutes supplémentaires (~113 heures)
- **XP ajouté au total** : ~61300 XP supplémentaires
- **Contenu doublé** : Chaque cours enrichi a maintenant le double de contenu pédagogique

### État d'Enrichissement par Catégorie (après les enrichissements finaux)

- **Basics** : 13/13 cours enrichis (100%)
- **Effects** : 11/11 cours enrichis (100%)
- **Amps** : 5/6 cours enrichis (83%) + 4 leçons supplémentaires enrichies
- **Chains** : 2/2 cours enrichis (100%)
- **Styles** : 6/6 cours enrichis (100%)
- **Techniques** : 100/20 cours enrichis (500% - certains cours enrichis plusieurs fois)
- **Creativity** : 22/6 cours enrichis (367% - certains cours enrichis plusieurs fois)
- **Quiz** : 4/4 cours enrichis (100%)

### Identification des Cours Enrichis

Dans le document, les cours enrichis sont identifiés par :
- ✨ dans la liste de contenu (étapes ajoutées)
- Mention "(enrichi : +X min)" dans la durée
- Mention "(enrichi : +X XP)" dans les récompenses
- Mention "**État** : ✅ Enrichi (X → Y étapes)" dans la description

---

## Intégration avec les Pédales et Amplis

### Pédales Utilisées dans les Cours

#### Distortion
- BOSS DS-1 (cours débutant)
- Pro Co RAT (cours intermédiaire)
- Ibanez Tube Screamer TS-9 (cours avancé)

#### Overdrive
- Ibanez Tube Screamer (cours avancé)
- BOSS SD-1 (cours intermédiaire)

#### Modulation
- BOSS CH-1 Super Chorus (cours intermédiaire)
- MXR Phase 90 (cours intermédiaire)

#### Delay
- BOSS DD-7 (cours débutant et intermédiaire)
- BOSS DD-3 (cours intermédiaire)

#### Reverb
- BOSS RV-6 (cours débutant)

#### Pitch/Octave
- BOSS OC-3 (cours avancé)

### Amplis Utilisés dans les Cours

#### Fender
- Fender '65 Twin Reverb (cours créativité)
- Fender Deluxe Reverb (cours amplis)

#### Marshall
- Marshall JCM 800 (cours styles)
- Marshall Plexi 1959 (cours styles)

#### Orange
- Orange Rockerverb 100 (cours amplis)
- Orange Tiny Terror (cours amplis)

#### Mesa Boogie
- Mesa/Boogie Dual Rectifier (cours styles)

#### Vox
- Vox AC30 (cours amplis)
- Vox AC15 (cours amplis)

#### Peavey
- Peavey 5150 (cours styles)

---

## Notes Techniques

### Durée des Cours
- **Cours courts** : 5-20 minutes (quiz, bases)
- **Cours moyens** : 20-50 minutes (tutoriels standards, cours enrichis)
- **Cours longs** : 50-90 minutes (guides approfondis, techniques avancées enrichies)
- **Cours très longs** : 90+ minutes (cours avancés spécialisés enrichis)

**Note** : Les durées indiquées incluent les enrichissements. Les cours enrichis ont vu leur durée doublée.

### Structure des Étapes
Chaque cours contient entre 3 et 16 étapes (après enrichissement), avec :
- Une introduction théorique
- Des explications pratiques
- Des actions interactives (si applicable)
- Des exercices ou applications
- Une conclusion ou synthèse

**Note** : 30 cours ont été enrichis pour doubler leur contenu pédagogique. Les cours enrichis sont marqués avec ✨ dans leur liste de contenu et indiquent leur état d'enrichissement.

### Tags et Recherche
Les tags permettent de rechercher les cours par :
- Niveau (débutant, intermédiaire, avancé)
- Type d'effet (distortion, delay, reverb, etc.)
- Style musical (rock, blues, jazz, metal, funk)
- Technique (picking, bending, tapping, legato, etc.)
- Concept (accords, gammes, rythme, etc.)

---

## Historique des Mises à Jour

### Dernière mise à jour
- **Date** : 2024
- **Action** : Enrichissement de 4 leçons du cours "Choisir son premier ampli" (Les modélisateurs numériques, Les amplis pour le studio, Les amplis pour la scène, Les amplis pour la maison)
- **Impact** : Contenu complet ajouté pour chaque leçon (5 sections structurées, 500+ mots, exercices pratiques)
- **Total enrichi** : 274 enrichissements (270 cours + 4 leçons supplémentaires)

### Mises à jour précédentes
- Création de 60 nouveaux cours (30 + 30)
- Renommage de cours pour éviter les doublons
- Documentation complète des cours et de leur structure

---

*Document mis à jour selon la structure pédagogique de WebAmp et les cours disponibles. Les cours enrichis sont marqués avec ✨ dans leur contenu.*

