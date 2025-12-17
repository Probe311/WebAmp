// Script pour ajouter 15 nouveaux cours de chansons dans Supabase
import { supabase } from '../services/supabase'
import { tablatureService } from '../services/tablatures'

interface SongCourse {
  title: string
  description: string
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  duration: number
  type: 'tutorial'
  icon: string
  tags: string[]
  artist: string
  steps: Array<{
    title: string
    description: string
    chords?: string[]
    tablature?: any
  }>
  rewards: {
    xp: number
    badges?: string[]
  }
}

export const songCourses: SongCourse[] = [
  // POP
  {
    title: 'Apprendre "Shake It Off" - Taylor Swift',
    description: 'Apprenez ce tube pop énergique de Taylor Swift avec des accords simples et un rythme entraînant.',
    category: 'styles',
    difficulty: 'beginner',
    duration: 20,
    type: 'tutorial',
    icon: 'Music',
    tags: ['pop', 'taylor swift', 'débutant', 'chanson'],
    artist: 'Taylor Swift',
    steps: [
      {
        title: 'Introduction',
        description: `"Shake It Off" est un single de Taylor Swift sorti en 2014. C'est une chanson pop énergique parfaite pour débuter.

[artist:Taylor Swift]

La chanson utilise seulement 4 accords dans une progression répétitive, ce qui la rend idéale pour les guitaristes débutants.`,
        chords: ['C', 'G', 'Am', 'F']
      },
      {
        title: 'Les accords',
        description: `La progression principale utilise ces 4 accords :

[chord:C]
[chord:G]
[chord:Am]
[chord:F]

Progression complète :
C - G - Am - F (répété tout au long de la chanson)

Ces accords sont tous des accords de base que vous connaissez déjà !`,
        chords: ['C', 'G', 'Am', 'F']
      },
      {
        title: 'Le rythme',
        description: `Le pattern de strumming est simple et régulier :

Pattern de base :
↓ ↓ ↑ ↓ ↑
(1  2  3  4)

• Commencez par un downstroke sur le premier temps
• Ajoutez un upstroke léger sur le "et" du deuxième temps
• Continuez avec ce pattern régulier

Astuce : La chanson est en 4/4, donc comptez 1-2-3-4 pour chaque mesure.`
      },
      {
        title: 'La tablature',
        description: `La tablature complète est disponible ci-dessous :

[fulltablature:shake-it-off-001]

La tablature est automatiquement chargée en fonction du titre et de l'artiste du cours.`
      },
      {
        title: 'Reproduire le son',
        description: `Pour recréer le son pop de Taylor Swift dans WebAmp :

Ampli : Fender Clean
• Gain : 3-4 (son très clean)
• Bass : 5-6
• Middle : 6-7
• Treble : 6-7

Effets :
1. Compresseur léger
   • Threshold : -15dB
   • Ratio : 3:1
   • Attack : Rapide
   • Release : Moyen

2. Reverb légère
   • Size : Petit
   • Decay : 1-2 secondes
   • Mix : 20-30%

Expérimentez avec ces réglages pour trouver votre son pop parfait !`
      }
    ],
    rewards: { xp: 200, badges: ['pop-star'] }
  },
  {
    title: 'Apprendre "Bad Guy" - Billie Eilish',
    description: 'Apprenez ce hit moderne de Billie Eilish avec ses accords simples mais efficaces.',
    category: 'styles',
    difficulty: 'beginner',
    duration: 25,
    type: 'tutorial',
    icon: 'Music',
    tags: ['pop', 'billie eilish', 'débutant', 'moderne'],
    artist: 'Billie Eilish',
    steps: [
      {
        title: 'Introduction',
        description: `"Bad Guy" est un single de Billie Eilish sorti en 2019. C'est une chanson pop alternative avec un groove minimaliste.

[artist:Billie Eilish]

La chanson utilise une progression d'accords très simple, parfaite pour les débutants.`,
        chords: ['Em', 'C']
      },
      {
        title: 'Les accords',
        description: `La progression principale utilise seulement 2 accords :

[chord:Em]
[chord:C]

Progression complète :
Em - C (répété tout au long de la chanson)

C'est l'une des progressions les plus simples que vous puissiez apprendre !`,
        chords: ['Em', 'C']
      },
      {
        title: 'Le rythme',
        description: `Le pattern de strumming est très simple et répétitif :

Pattern de base :
↓ - ↓ ↑ -
(1   2  3)

• Un downstroke sur le premier temps
• Un downstroke sur le deuxième temps
• Un upstroke léger sur le "et" du troisième temps
• Pause sur le quatrième temps

Astuce : Gardez le rythme simple et régulier, c'est la clé de cette chanson.`
      },
      {
        title: 'La tablature',
        description: `La tablature complète est chargée depuis Songsterr :

[fulltablature:bad-guy-001]

La tablature est automatiquement chargée depuis Songsterr en fonction du titre et de l'artiste du cours.`
      },
      {
        title: 'Reproduire le son moderne dans WebAmp',
        description: `Pour recréer le son moderne de Billie Eilish dans WebAmp :

Ampli : Clean avec saturation légère
• Gain : 4-5
• Bass : 6-7
• Middle : 5-6
• Treble : 6-7

Effets :
1. Compresseur
   • Threshold : -20dB
   • Ratio : 4:1
   • Attack : Rapide
   • Release : Rapide

2. Reverb avec modulation
   • Size : Moyen
   • Decay : 2-3 secondes
   • Mix : 30-40%

3. Delay subtil
   • Time : 300ms
   • Feedback : 20%
   • Mix : 15-20%

Expérimentez pour créer votre propre son !`
      }
    ],
    rewards: { xp: 180, badges: ['bad-guy'] }
  },
  // COUNTRY
  {
    title: 'Apprendre "Wagon Wheel" - Old Crow Medicine Show',
    description: 'Apprenez ce classique country-folk avec ses accords simples et son rythme entraînant.',
    category: 'styles',
    difficulty: 'beginner',
    duration: 30,
    type: 'tutorial',
    icon: 'Music',
    tags: ['country', 'folk', 'débutant', 'classique'],
    artist: 'Old Crow Medicine Show',
    steps: [
      {
        title: 'Introduction',
        description: `"Wagon Wheel" est une chanson country-folk de Old Crow Medicine Show, basée sur un fragment de Bob Dylan.

[artist:Old Crow Medicine Show]

C'est une chanson parfaite pour apprendre le style country avec des accords simples.`,
        chords: ['G', 'D', 'Em', 'C']
      },
      {
        title: 'Les accords',
        description: `La progression principale utilise ces 4 accords :

[chord:G]
[chord:D]
[chord:Em]
[chord:C]

Progression complète :
G - D - Em - C
G - D - C - G

Ces accords sont tous des accords de base !`,
        chords: ['G', 'D', 'Em', 'C']
      },
      {
        title: 'Le rythme',
        description: `Le pattern de strumming country typique :

Pattern de base :
↓ ↓ ↑ ↑ ↓ ↑
(1  2  3  4)

• Commencez par un downstroke sur le premier temps
• Ajoutez un upstroke léger sur le "et" du deuxième temps
• Continuez avec ce pattern régulier

Astuce : Le rythme country est souvent plus "bouncy" et rythmé que le pop.`
      },
      {
        title: 'La tablature',
        description: `La tablature complète est chargée depuis Songsterr :

[fulltablature:wagon-wheel-001]

La tablature est automatiquement chargée depuis Songsterr en fonction du titre et de l'artiste du cours.`
      },
      {
        title: 'Reproduire le son country dans WebAmp',
        description: `Pour recréer le son country dans WebAmp :

Ampli : Fender Clean
• Gain : 3-4 (son très clean)
• Bass : 4-5
• Middle : 6-7
• Treble : 5-6

Effets :
1. Compresseur
   • Threshold : -18dB
   • Ratio : 3:1
   • Attack : Moyen
   • Release : Moyen

2. Reverb légère
   • Size : Petit
   • Decay : 1-2 secondes
   • Mix : 20-25%

3. Tremolo léger (optionnel)
   • Speed : 4-5 Hz
   • Depth : 20-30%

Expérimentez pour trouver votre son country !`
      }
    ],
    rewards: { xp: 220, badges: ['country-star'] }
  },
  {
    title: 'Apprendre "Jolene" - Dolly Parton',
    description: 'Apprenez ce classique country de Dolly Parton avec sa progression d\'accords caractéristique.',
    category: 'styles',
    difficulty: 'intermediate',
    duration: 35,
    type: 'tutorial',
    icon: 'Music',
    tags: ['country', 'dolly parton', 'intermédiaire', 'classique'],
    artist: 'Dolly Parton',
    steps: [
      {
        title: 'Introduction',
        description: `"Jolene" est une chanson country de Dolly Parton sortie en 1973. C'est un classique intemporel.

[artist:Dolly Parton]

La chanson utilise une progression d'accords caractéristique du country.`,
        chords: ['Am', 'C', 'G', 'F']
      },
      {
        title: 'Les accords',
        description: `La progression principale utilise ces 4 accords :

[chord:Am]
[chord:C]
[chord:G]
[chord:F]

Progression complète :
Am - C - G - F
Am - C - G - F

Notez l'utilisation de l'accord Am mineur qui donne cette couleur particulière.`,
        chords: ['Am', 'C', 'G', 'F']
      },
      {
        title: 'Le rythme',
        description: `"Jolene" est souvent jouée en fingerpicking :

Pattern de base (pouce-index-majeur-annulaire) :
P - I - M - A
(1  2  3  4)

• Le pouce joue les cordes graves
• Les autres doigts jouent les cordes aiguës
• Pattern répétitif et régulier

Astuce : Commencez lentement et augmentez progressivement la vitesse.`
      },
      {
        title: 'La tablature',
        description: `La tablature complète est chargée depuis Songsterr :

[fulltablature:jolene-001]

La tablature est automatiquement chargée depuis Songsterr en fonction du titre et de l'artiste du cours.`
      },
      {
        title: 'Reproduire le son country classique dans WebAmp',
        description: `Pour recréer le son country classique dans WebAmp :

Ampli : Fender Clean
• Gain : 3-4
• Bass : 5-6
• Middle : 6-7
• Treble : 5-6

Effets :
1. Compresseur
   • Threshold : -20dB
   • Ratio : 3:1
   • Attack : Moyen
   • Release : Moyen

2. Reverb légère
   • Size : Petit
   • Decay : 1-2 secondes
   • Mix : 20-25%

Expérimentez pour trouver votre son !`
      }
    ],
    rewards: { xp: 250, badges: ['country-legend'] }
  },
  // ROCK
  {
    title: 'Apprendre "Smoke on the Water" - Deep Purple',
    description: 'Apprenez ce riff légendaire de Deep Purple, l\'un des riffs les plus célèbres du rock.',
    category: 'styles',
    difficulty: 'beginner',
    duration: 25,
    type: 'tutorial',
    icon: 'Music',
    tags: ['rock', 'deep purple', 'débutant', 'riff'],
    artist: 'Deep Purple',
    steps: [
      {
        title: 'Introduction',
        description: `"Smoke on the Water" est une chanson de Deep Purple sortie en 1972. Son riff est l'un des plus célèbres de l'histoire du rock.

[artist:Deep Purple]

Le riff est simple mais efficace, parfait pour débuter le rock.`,
        chords: []
      },
      {
        title: 'Le rythme',
        description: `Le riff principal utilise ces notes sur la corde de La (A) :

Pattern de base :
0-3-5 / 0-3-6-5 / 0-3-5-3-0

• Commencez sur la corde A à vide (0)
• Jouez la case 3, puis la case 5
• Répétez ce pattern

Astuce : Le riff est joué sur une seule corde, ce qui le rend facile à apprendre.`
      },
      {
        title: 'Le rythme',
        description: `Le rythme du riff est régulier et puissant :

Pattern rythmique :
↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓
(1  2  3  4  5  6  7  8)

• Jouez chaque note avec un downstroke ferme
• Gardez le rythme régulier et puissant
• Le riff se répète tout au long de la chanson

Astuce : Utilisez un métronome pour garder le tempo régulier.`
      },
      {
        title: 'La tablature',
        description: `La tablature complète est chargée depuis Songsterr :

[fulltablature:smoke-on-the-water-001]

La tablature est automatiquement chargée depuis Songsterr en fonction du titre et de l'artiste du cours.`
      },
      {
        title: 'Reproduire le son rock classique dans WebAmp',
        description: `Pour recréer le son rock classique de Deep Purple dans WebAmp :

Ampli : Marshall JCM800
• Gain : 7-8 (distortion moyenne)
• Bass : 6-7
• Middle : 5-6
• Treble : 6-7

Effets :
1. Distortion
   • Gain : 6-7
   • Tone : 5-6
   • Level : 7-8

2. Reverb légère
   • Size : Moyen
   • Decay : 2-3 secondes
   • Mix : 25-30%

Expérimentez pour trouver votre son rock !`
      }
    ],
    rewards: { xp: 200, badges: ['rock-star'] }
  },
  {
    title: 'Apprendre "Seven Nation Army" - The White Stripes',
    description: 'Apprenez ce riff iconique de The White Stripes avec son groove puissant.',
    category: 'styles',
    difficulty: 'intermediate',
    duration: 30,
    type: 'tutorial',
    icon: 'Music',
    tags: ['rock', 'the white stripes', 'intermédiaire', 'riff'],
    artist: 'The White Stripes',
    steps: [
      {
        title: 'Introduction',
        description: `"Seven Nation Army" est une chanson de The White Stripes sortie en 2003. Son riff est devenu un classique.

[artist:The White Stripes]

Le riff utilise un effet d'octave pour créer ce son caractéristique.`,
        chords: []
      },
      {
        title: 'Le rythme',
        description: `Le riff principal utilise ces notes :

Pattern de base :
E|--7--7--10--7--5--3--0--

• Commencez sur la corde E grave
• Jouez la case 7, puis 7, puis 10, puis 7, puis 5, puis 3, puis 0
• Le riff se répète tout au long de la chanson

Astuce : Le riff est joué avec un effet d'octave pour créer ce son grave caractéristique.`
      },
      {
        title: 'Le rythme',
        description: `Le rythme du riff est puissant et régulier :

Pattern rythmique :
↓ ↓ ↓ ↓ ↓ ↓ ↓
(1  2  3  4  5  6  7)

• Jouez chaque note avec un downstroke ferme
• Gardez le rythme régulier et puissant
• Le riff crée un groove hypnotique

Astuce : Le rythme est la clé de cette chanson.`
      },
      {
        title: 'La tablature',
        description: `La tablature complète est chargée depuis Songsterr :

[fulltablature:seven-nation-army-001]

La tablature est automatiquement chargée depuis Songsterr en fonction du titre et de l'artiste du cours.`
      },
      {
        title: 'Reproduire le son garage rock dans WebAmp',
        description: `Pour recréer le son garage rock de The White Stripes dans WebAmp :

Ampli : Fender avec saturation
• Gain : 6-7
• Bass : 7-8
• Middle : 5-6
• Treble : 6-7

Effets :
1. Octaver (pour le son grave)
   • Octave : -1
   • Mix : 50-60%

2. Distortion légère
   • Gain : 5-6
   • Tone : 5-6
   • Level : 7-8

3. Reverb légère
   • Size : Petit
   • Decay : 1-2 secondes
   • Mix : 20-25%

Expérimentez pour trouver votre son !`
      }
    ],
    rewards: { xp: 250, badges: ['garage-rock'] }
  },
  // METAL
  {
    title: 'Apprendre "Enter Sandman" - Metallica',
    description: 'Apprenez ce classique du metal de Metallica avec ses power chords puissants.',
    category: 'styles',
    difficulty: 'intermediate',
    duration: 40,
    type: 'tutorial',
    icon: 'Music',
    tags: ['metal', 'metallica', 'intermédiaire', 'power chords'],
    artist: 'Metallica',
    steps: [
      {
        title: 'Introduction',
        description: `"Enter Sandman" est une chanson de Metallica sortie en 1991. C'est un classique du metal moderne.

[artist:Metallica]

La chanson utilise des power chords (accords de puissance) caractéristiques du metal.`,
        chords: ['E5', 'B5', 'C5', 'G5']
      },
      {
        title: 'Les power chords',
        description: `La progression principale utilise ces power chords :

[chord:E5]
[chord:B5]
[chord:C5]
[chord:G5]

Progression complète :
E5 - B5 - C5 - G5
E5 - B5 - C5 - G5

Les power chords sont des accords simplifiés avec seulement la fondamentale et la quinte.`,
        chords: ['E5', 'B5', 'C5', 'G5']
      },
      {
        title: 'Le rythme',
        description: `Le pattern de strumming est puissant et régulier :

Pattern de base :
↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓
(1  2  3  4  5  6  7  8)

• Jouez chaque power chord avec un downstroke ferme
• Gardez le rythme régulier et puissant
• Le rythme crée un groove puissant

Astuce : Les power chords nécessitent une distorsion pour sonner correctement.`
      },
      {
        title: 'La tablature',
        description: `La tablature complète est chargée depuis Songsterr :

[fulltablature:enter-sandman-001]

La tablature est automatiquement chargée depuis Songsterr en fonction du titre et de l'artiste du cours.`
      },
      {
        title: 'Reproduire le son metal dans WebAmp',
        description: `Pour recréer le son metal de Metallica dans WebAmp :

Ampli : Mesa Boogie Dual Rectifier
• Gain : 8-9 (distortion élevée)
• Bass : 7-8
• Middle : 5-6
• Treble : 7-8

Effets :
1. Distortion
   • Gain : 8-9
   • Tone : 6-7
   • Level : 8-9

2. Noise Gate (pour réduire le bruit)
   • Threshold : -30dB
   • Attack : Rapide
   • Release : Rapide

3. Reverb légère
   • Size : Grand
   • Decay : 2-3 secondes
   • Mix : 20-25%

Expérimentez pour trouver votre son metal !`
      }
    ],
    rewards: { xp: 300, badges: ['metal-head'] }
  },
  {
    title: 'Apprendre "Master of Puppets" - Metallica',
    description: 'Apprenez ce classique du thrash metal avec ses riffs complexes et rapides.',
    category: 'styles',
    difficulty: 'advanced',
    duration: 50,
    type: 'tutorial',
    icon: 'Music',
    tags: ['metal', 'metallica', 'avancé', 'thrash'],
    artist: 'Metallica',
    steps: [
      {
        title: 'Introduction',
        description: `"Master of Puppets" est une chanson de Metallica sortie en 1986. C'est un classique du thrash metal.

[artist:Metallica]

La chanson utilise des riffs complexes et rapides, nécessitant une bonne technique.`,
        chords: []
      },
      {
        title: 'Le rythme',
        description: `Le riff principal utilise des power chords et des palm mutes :

Pattern de base :
E|--0-0-0-0-0-0-0-0--3-3-3-3-3-3-3-3--

• Commencez avec des palm mutes sur la corde E grave
• Jouez la case 0 avec des palm mutes
• Puis jouez la case 3 avec des palm mutes
• Le riff nécessite une technique de palm mute maîtrisée

Astuce : Les palm mutes créent ce son caractéristique du thrash metal.`
      },
      {
        title: 'Le rythme',
        description: `Le palm mute est essentiel pour ce riff :

Technique :
• Placez le côté de votre main droite sur les cordes près du chevalet
• Jouez les notes avec votre médiator
• Les cordes doivent être étouffées pour créer ce son sourd

Astuce : Pratiquez le palm mute lentement avant d'augmenter la vitesse.`
      },
      {
        title: 'La tablature',
        description: `La tablature complète est chargée depuis Songsterr :

[fulltablature:master-of-puppets-001]

La tablature est automatiquement chargée depuis Songsterr en fonction du titre et de l'artiste du cours.`
      },
      {
        title: 'Reproduire le son thrash metal dans WebAmp',
        description: `Pour recréer le son thrash metal dans WebAmp :

Ampli : Mesa Boogie Dual Rectifier
• Gain : 9-10 (distortion maximale)
• Bass : 8-9
• Middle : 4-5
• Treble : 8-9

Effets :
1. Distortion
   • Gain : 9-10
   • Tone : 7-8
   • Level : 9-10

2. Noise Gate
   • Threshold : -35dB
   • Attack : Rapide
   • Release : Rapide

3. Reverb légère
   • Size : Grand
   • Decay : 2-3 secondes
   • Mix : 15-20%

Expérimentez pour trouver votre son thrash !`
      }
    ],
    rewards: { xp: 400, badges: ['thrash-master'] }
  },
  // Ajoutons plus de variété
  {
    title: 'Apprendre "Hotel California" - Eagles',
    description: 'Apprenez ce classique du rock avec ses accords complexes et son solo légendaire.',
    category: 'styles',
    difficulty: 'advanced',
    duration: 45,
    type: 'tutorial',
    icon: 'Music',
    tags: ['rock', 'eagles', 'avancé', 'classique'],
    artist: 'Eagles',
    steps: [
      {
        title: 'Introduction',
        description: `"Hotel California" est une chanson des Eagles sortie en 1976. C'est un classique intemporel.

[artist:Eagles]

La chanson utilise une progression d'accords complexe et un solo légendaire.`,
        chords: ['Bm', 'F#', 'A', 'E', 'G', 'D', 'Em', 'F#']
      },
      {
        title: 'Les accords',
        description: `La progression principale utilise ces accords :

[chord:Bm]
[chord:F#]
[chord:A]
[chord:E]
[chord:G]
[chord:D]
[chord:Em]
[chord:F#]

Progression complète :
Bm - F# - A - E
G - D - Em - F#

Cette progression nécessite une bonne maîtrise des accords barrés.`,
        chords: ['Bm', 'F#', 'A', 'E', 'G', 'D', 'Em', 'F#']
      },
      {
        title: 'Le rythme',
        description: `"Hotel California" est souvent jouée en fingerpicking :

Pattern de base :
P - I - M - A - M - I
(1  2  3  4  5  6)

• Le pouce joue les cordes graves
• Les autres doigts jouent les cordes aiguës
• Pattern complexe et mélodique

Astuce : Commencez très lentement et augmentez progressivement la vitesse.`
      },
      {
        title: 'La tablature',
        description: `La tablature complète est chargée depuis Songsterr :

[fulltablature:hotel-california-001]

La tablature est automatiquement chargée depuis Songsterr en fonction du titre et de l'artiste du cours.`
      },
      {
        title: 'Reproduire le son rock classique dans WebAmp',
        description: `Pour recréer le son rock classique des Eagles dans WebAmp :

Ampli : Fender Clean avec saturation légère
• Gain : 4-5
• Bass : 5-6
• Middle : 6-7
• Treble : 6-7

Effets :
1. Compresseur
   • Threshold : -18dB
   • Ratio : 3:1
   • Attack : Moyen
   • Release : Moyen

2. Reverb
   • Size : Moyen
   • Decay : 2-3 secondes
   • Mix : 30-40%

3. Delay léger
   • Time : 250ms
   • Feedback : 20%
   • Mix : 15-20%

Expérimentez pour trouver votre son !`
      }
    ],
    rewards: { xp: 350, badges: ['rock-legend'] }
  },
  {
    title: 'Apprendre "Black" - Pearl Jam',
    description: 'Apprenez ce classique du grunge avec ses accords émotionnels et sa progression puissante.',
    category: 'styles',
    difficulty: 'intermediate',
    duration: 35,
    type: 'tutorial',
    icon: 'Music',
    tags: ['rock', 'pearl jam', 'intermédiaire', 'grunge'],
    artist: 'Pearl Jam',
    steps: [
      {
        title: 'Introduction',
        description: `"Black" est une chanson de Pearl Jam sortie en 1991. C'est un classique du grunge.

[artist:Pearl Jam]

La chanson utilise une progression d'accords émotionnelle et puissante.`,
        chords: ['D', 'F', 'G', 'C', 'Am']
      },
      {
        title: 'Les accords',
        description: `La progression principale utilise ces accords :

[chord:D]
[chord:F]
[chord:G]
[chord:C]
[chord:Am]

Progression complète :
D - F - G - C
Am - F - G - C

Cette progression crée une atmosphère émotionnelle caractéristique.`,
        chords: ['D', 'F', 'G', 'C', 'Am']
      },
      {
        title: 'Le rythme',
        description: `Le pattern de strumming est émotionnel et puissant :

Pattern de base :
↓ ↓ ↑ ↓ ↑ ↓ ↑
(1  2  3  4  5  6  7)

• Commencez par un downstroke sur le premier temps
• Ajoutez des upstrokes légers pour créer du mouvement
• Le rythme crée une atmosphère émotionnelle

Astuce : Le rythme doit être expressif et émotionnel.`
      },
      {
        title: 'La tablature',
        description: `La tablature complète est chargée depuis Songsterr :

[fulltablature:black-001]

La tablature est automatiquement chargée depuis Songsterr en fonction du titre et de l'artiste du cours.`
      },
      {
        title: 'Reproduire le son grunge dans WebAmp',
        description: `Pour recréer le son grunge de Pearl Jam dans WebAmp :

Ampli : Marshall avec saturation
• Gain : 6-7
• Bass : 7-8
• Middle : 5-6
• Treble : 6-7

Effets :
1. Distortion
   • Gain : 6-7
   • Tone : 5-6
   • Level : 7-8

2. Reverb
   • Size : Moyen
   • Decay : 2-3 secondes
   • Mix : 30-40%

3. Delay léger
   • Time : 300ms
   • Feedback : 25%
   • Mix : 20-25%

Expérimentez pour trouver votre son grunge !`
      }
    ],
    rewards: { xp: 280, badges: ['grunge-star'] }
  },
  {
    title: 'Apprendre "Free Bird" - Lynyrd Skynyrd',
    description: 'Apprenez ce classique du southern rock avec ses accords et son solo légendaire.',
    category: 'styles',
    difficulty: 'advanced',
    duration: 50,
    type: 'tutorial',
    icon: 'Music',
    tags: ['rock', 'lynyrd skynyrd', 'avancé', 'southern rock'],
    artist: 'Lynyrd Skynyrd',
    steps: [
      {
        title: 'Introduction',
        description: `"Free Bird" est une chanson de Lynyrd Skynyrd sortie en 1973. C'est un classique du southern rock.

[artist:Lynyrd Skynyrd]

La chanson utilise une progression d'accords caractéristique et un solo légendaire.`,
        chords: ['G', 'C', 'D', 'Am', 'F']
      },
      {
        title: 'Les accords',
        description: `La progression principale utilise ces accords :

[chord:G]
[chord:C]
[chord:D]
[chord:Am]
[chord:F]

Progression complète :
G - C - D - G
Am - F - C - G

Cette progression crée une atmosphère caractéristique du southern rock.`,
        chords: ['G', 'C', 'D', 'Am', 'F']
      },
      {
        title: 'Le rythme',
        description: `"Free Bird" contient l'un des solos les plus célèbres du rock :

Le solo utilise :
• Des gammes pentatoniques
• Des bends et vibratos
• Des techniques avancées de solo

Astuce : Le solo nécessite une bonne maîtrise technique et de l'endurance.`
      },
      {
        title: 'La tablature',
        description: `La tablature complète est chargée depuis Songsterr :

[fulltablature:free-bird-001]

La tablature est automatiquement chargée depuis Songsterr en fonction du titre et de l'artiste du cours.`
      },
      {
        title: 'Reproduire le son southern rock dans WebAmp',
        description: `Pour recréer le son southern rock dans WebAmp :

Ampli : Fender avec saturation
• Gain : 5-6
• Bass : 6-7
• Middle : 6-7
• Treble : 7-8

Effets :
1. Overdrive
   • Gain : 5-6
   • Tone : 6-7
   • Level : 7-8

2. Reverb
   • Size : Moyen
   • Decay : 2-3 secondes
   • Mix : 30-40%

3. Delay
   • Time : 300ms
   • Feedback : 30%
   • Mix : 25-30%

Expérimentez pour trouver votre son !`
      }
    ],
    rewards: { xp: 400, badges: ['southern-rock'] }
  },
  {
    title: 'Apprendre "Sweet Home Alabama" - Lynyrd Skynyrd',
    description: 'Apprenez ce classique du southern rock avec son riff caractéristique.',
    category: 'styles',
    difficulty: 'intermediate',
    duration: 30,
    type: 'tutorial',
    icon: 'Music',
    tags: ['rock', 'lynyrd skynyrd', 'intermédiaire', 'southern rock'],
    artist: 'Lynyrd Skynyrd',
    steps: [
      {
        title: 'Introduction',
        description: `"Sweet Home Alabama" est une chanson de Lynyrd Skynyrd sortie en 1974. C'est un classique du southern rock.

[artist:Lynyrd Skynyrd]

La chanson utilise un riff caractéristique et des accords simples.`,
        chords: ['D', 'C', 'G']
      },
      {
        title: 'Les accords',
        description: `La progression principale utilise seulement 3 accords :

[chord:D]
[chord:C]
[chord:G]

Progression complète :
D - C - G
D - C - G

Cette progression simple crée un son caractéristique.`,
        chords: ['D', 'C', 'G']
      },
      {
        title: 'Le rythme',
        description: `Le riff principal utilise ces notes :

Pattern de base :
D|--0-2-0-2-0-2-0-2--

• Commencez sur la corde D
• Jouez la case 0, puis 2, puis 0, puis 2
• Le riff se répète tout au long de la chanson

Astuce : Le riff est simple mais efficace.`
      },
      {
        title: 'La tablature',
        description: `La tablature complète est chargée depuis Songsterr :

[fulltablature:sweet-home-alabama-001]

La tablature est automatiquement chargée depuis Songsterr en fonction du titre et de l'artiste du cours.`
      },
      {
        title: 'Reproduire le son southern rock dans WebAmp',
        description: `Pour recréer le son southern rock dans WebAmp :

Ampli : Fender avec saturation
• Gain : 5-6
• Bass : 6-7
• Middle : 6-7
• Treble : 7-8

Effets :
1. Overdrive
   • Gain : 5-6
   • Tone : 6-7
   • Level : 7-8

2. Reverb
   • Size : Moyen
   • Decay : 2-3 secondes
   • Mix : 30-40%

Expérimentez pour trouver votre son !`
      }
    ],
    rewards: { xp: 250, badges: ['southern-rock'] }
  },
  {
    title: 'Apprendre "Nothing Else Matters" - Metallica',
    description: 'Apprenez cette ballade metal de Metallica avec ses accords et son solo émotionnel.',
    category: 'styles',
    difficulty: 'intermediate',
    duration: 40,
    type: 'tutorial',
    icon: 'Music',
    tags: ['metal', 'metallica', 'intermédiaire', 'ballade'],
    artist: 'Metallica',
    steps: [
      {
        title: 'Introduction',
        description: `"Nothing Else Matters" est une ballade de Metallica sortie en 1991. C'est une chanson émotionnelle.

[artist:Metallica]

La chanson utilise une progression d'accords simple mais efficace.`,
        chords: ['Em', 'C', 'G', 'D']
      },
      {
        title: 'Les accords',
        description: `La progression principale utilise ces accords :

[chord:Em]
[chord:C]
[chord:G]
[chord:D]

Progression complète :
Em - C - G - D
Em - C - G - D

Cette progression crée une atmosphère émotionnelle.`,
        chords: ['Em', 'C', 'G', 'D']
      },
      {
        title: 'Le rythme',
        description: `"Nothing Else Matters" est souvent jouée en fingerpicking :

Pattern de base :
P - I - M - A - M - I
(1  2  3  4  5  6)

• Le pouce joue les cordes graves
• Les autres doigts jouent les cordes aiguës
• Pattern mélodique et émotionnel

Astuce : Le fingerpicking crée cette atmosphère émotionnelle.`
      },
      {
        title: 'La tablature',
        description: `La tablature complète est chargée depuis Songsterr :

[fulltablature:nothing-else-matters-001]

La tablature est automatiquement chargée depuis Songsterr en fonction du titre et de l'artiste du cours.`
      },
      {
        title: 'Reproduire le son ballade metal dans WebAmp',
        description: `Pour recréer le son ballade metal dans WebAmp :

Ampli : Clean avec saturation légère
• Gain : 4-5
• Bass : 5-6
• Middle : 6-7
• Treble : 6-7

Effets :
1. Reverb
   • Size : Grand
   • Decay : 3-4 secondes
   • Mix : 40-50%

2. Delay
   • Time : 400ms
   • Feedback : 30%
   • Mix : 25-30%

3. Chorus léger
   • Rate : 1-2 Hz
   • Depth : 30-40%
   • Mix : 20-30%

Expérimentez pour trouver votre son !`
      }
    ],
    rewards: { xp: 300, badges: ['metal-ballad'] }
  },
  {
    title: 'Apprendre "Thunderstruck" - AC/DC',
    description: 'Apprenez ce classique du hard rock avec son riff caractéristique et puissant.',
    category: 'styles',
    difficulty: 'intermediate',
    duration: 35,
    type: 'tutorial',
    icon: 'Music',
    tags: ['rock', 'ac/dc', 'intermédiaire', 'hard rock'],
    artist: 'AC/DC',
    steps: [
      {
        title: 'Introduction',
        description: `"Thunderstruck" est une chanson d'AC/DC sortie en 1990. C'est un classique du hard rock.

[artist:AC/DC]

La chanson utilise un riff caractéristique et puissant.`,
        chords: []
      },
      {
        title: 'Le rythme',
        description: `Le riff principal utilise ces notes :

Pattern de base :
E|--0-0-0-0-3-3-3-3-5-5-5-5-3-3-3-3--

• Commencez sur la corde E grave
• Jouez la case 0, puis 3, puis 5, puis 3
• Le riff se répète tout au long de la chanson

Astuce : Le riff nécessite une bonne technique de main droite.`
      },
      {
        title: 'Le rythme',
        description: `Le rythme du riff est puissant et régulier :

Pattern rythmique :
↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓
(1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16)

• Jouez chaque note avec un downstroke ferme
• Gardez le rythme régulier et puissant
• Le riff crée un groove puissant

Astuce : Le rythme est la clé de cette chanson.`
      },
      {
        title: 'La tablature',
        description: `La tablature complète est chargée depuis Songsterr :

[fulltablature:thunderstruck-001]

La tablature est automatiquement chargée depuis Songsterr en fonction du titre et de l'artiste du cours.`
      },
      {
        title: 'Reproduire le son hard rock dans WebAmp',
        description: `Pour recréer le son hard rock d'AC/DC dans WebAmp :

Ampli : Marshall JCM800
• Gain : 7-8
• Bass : 7-8
• Middle : 5-6
• Treble : 7-8

Effets :
1. Distortion
   • Gain : 7-8
   • Tone : 6-7
   • Level : 8-9

2. Reverb légère
   • Size : Moyen
   • Decay : 2-3 secondes
   • Mix : 20-25%

Expérimentez pour trouver votre son hard rock !`
      }
    ],
    rewards: { xp: 280, badges: ['hard-rock'] }
  },
  {
    title: 'Apprendre "Back in Black" - AC/DC',
    description: 'Apprenez ce classique du hard rock avec son riff puissant et caractéristique.',
    category: 'styles',
    difficulty: 'intermediate',
    duration: 30,
    type: 'tutorial',
    icon: 'Music',
    tags: ['rock', 'ac/dc', 'intermédiaire', 'hard rock'],
    artist: 'AC/DC',
    steps: [
      {
        title: 'Introduction',
        description: `"Back in Black" est une chanson d'AC/DC sortie en 1980. C'est un classique du hard rock.

[artist:AC/DC]

La chanson utilise un riff puissant et caractéristique.`,
        chords: ['E5', 'D5', 'A5']
      },
      {
        title: 'Les power chords',
        description: `La progression principale utilise ces power chords :

[chord:E5]
[chord:D5]
[chord:A5]

Progression complète :
E5 - D5 - A5 - E5
E5 - D5 - A5 - E5

Les power chords créent ce son puissant caractéristique.`,
        chords: ['E5', 'D5', 'A5']
      },
      {
        title: 'Le rythme',
        description: `Le pattern de strumming est puissant et régulier :

Pattern de base :
↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓
(1  2  3  4  5  6  7  8)

• Jouez chaque power chord avec un downstroke ferme
• Gardez le rythme régulier et puissant
• Le rythme crée un groove puissant

Astuce : Les power chords nécessitent une distorsion pour sonner correctement.`
      },
      {
        title: 'La tablature',
        description: `La tablature complète est chargée depuis Songsterr :

[fulltablature:back-in-black-001]

La tablature est automatiquement chargée depuis Songsterr en fonction du titre et de l'artiste du cours.`
      },
      {
        title: 'Reproduire le son hard rock dans WebAmp',
        description: `Pour recréer le son hard rock d'AC/DC dans WebAmp :

Ampli : Marshall JCM800
• Gain : 7-8
• Bass : 7-8
• Middle : 5-6
• Treble : 7-8

Effets :
1. Distortion
   • Gain : 7-8
   • Tone : 6-7
   • Level : 8-9

2. Reverb légère
   • Size : Moyen
   • Decay : 2-3 secondes
   • Mix : 20-25%

Expérimentez pour trouver votre son hard rock !`
      }
    ],
    rewards: { xp: 250, badges: ['hard-rock'] }
  },
  {
    title: 'Apprendre "Zombie" - The Cranberries',
    description: 'Apprenez ce classique du rock alternatif avec ses accords et son rythme caractéristique.',
    category: 'styles',
    difficulty: 'intermediate',
    duration: 35,
    type: 'tutorial',
    icon: 'Music',
    tags: ['rock', 'the cranberries', 'intermédiaire', 'alternatif'],
    artist: 'The Cranberries',
    steps: [
      {
        title: 'Introduction',
        description: `"Zombie" est une chanson de The Cranberries sortie en 1994. C'est un classique du rock alternatif.

[artist:The Cranberries]

La chanson utilise une progression d'accords simple mais efficace.`,
        chords: ['Em', 'C', 'G', 'D']
      },
      {
        title: 'Les accords',
        description: `La progression principale utilise ces accords :

[chord:Em]
[chord:C]
[chord:G]
[chord:D]

Progression complète :
Em - C - G - D
Em - C - G - D

Cette progression crée une atmosphère caractéristique.`,
        chords: ['Em', 'C', 'G', 'D']
      },
      {
        title: 'Le rythme',
        description: `Le pattern de strumming est caractéristique :

Pattern de base :
↓ ↓ ↑ ↓ ↑ ↓ ↑
(1  2  3  4  5  6  7)

• Commencez par un downstroke sur le premier temps
• Ajoutez des upstrokes légers pour créer du mouvement
• Le rythme crée une atmosphère caractéristique

Astuce : Le rythme doit être expressif et régulier.`
      },
      {
        title: 'La tablature',
        description: `La tablature complète est chargée depuis Songsterr :

[fulltablature:zombie-001]

La tablature est automatiquement chargée depuis Songsterr en fonction du titre et de l'artiste du cours.`
      },
      {
        title: 'Reproduire le son rock alternatif dans WebAmp',
        description: `Pour recréer le son rock alternatif dans WebAmp :

Ampli : Fender avec saturation
• Gain : 5-6
• Bass : 6-7
• Middle : 6-7
• Treble : 6-7

Effets :
1. Distortion légère
   • Gain : 5-6
   • Tone : 5-6
   • Level : 7-8

2. Reverb
   • Size : Moyen
   • Decay : 2-3 secondes
   • Mix : 30-40%

3. Delay léger
   • Time : 300ms
   • Feedback : 25%
   • Mix : 20-25%

Expérimentez pour trouver votre son !`
      }
    ],
    rewards: { xp: 280, badges: ['alt-rock'] }
  }
]

export async function addSongCoursesToSupabase() {
  let successCount = 0
  let errorCount = 0
  let skippedCount = 0

  for (const course of songCourses) {
    try {
      // 1. Vérifier si le cours existe déjà (par titre)
      const { data: existingCourse } = await supabase
        .from('courses')
        .select('id, title')
        .eq('title', course.title)
        .eq('type', 'tutorial')
        .maybeSingle()

      if (existingCourse) {
        skippedCount++
        continue
      }

      // 2. Créer le cours
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .insert({
          title: course.title,
          description: course.description,
          category: course.category,
          difficulty: course.difficulty,
          duration: course.duration,
          type: course.type,
          icon: course.icon,
          tags: course.tags,
          is_published: true
        })
        .select()
        .single()

      if (courseError) {
        errorCount++
        continue
      }

      // 2. Créer les récompenses
      await supabase
        .from('course_rewards')
        .insert({
          course_id: courseData.id,
          xp: course.rewards.xp,
          badges: course.rewards.badges || []
        })

      // 3. Créer les leçons
      for (let i = 0; i < course.steps.length; i++) {
        const step = course.steps[i]
        
        const { data: lesson, error: lessonError } = await supabase
          .from('lessons')
          .insert({
            course_id: courseData.id,
            title: step.title,
            description: step.description,
            content_type: 'text',
            order_index: i
          })
          .select()
          .single()

        if (lessonError) {
          continue
        }

        // Extraire les références d'accords
        if (step.chords) {
          for (const chordName of step.chords) {
            const chord = tablatureService.getChord(chordName)
            if (chord) {
              // Chercher l'accord dans Supabase
              let existingChord = null
              const { data: chordData, error: chordError } = await supabase
                .from('chords')
                .select('id')
                .eq('name', chordName)
                .maybeSingle()

              if (chordError && chordError.code !== 'PGRST116') {
                // On ignore les erreurs de recherche d'accord pour ne pas polluer la console
              } else if (chordData) {
                existingChord = chordData
              }

              // Si l'accord n'existe pas, le créer
              if (!existingChord) {
                const { data: newChord, error: insertError } = await supabase
                  .from('chords')
                  .insert({
                    name: chord.name,
                    frets: chord.frets,
                    fingers: chord.fingers || [],
                    base_fret: chord.baseFret || 0
                  })
                  .select()
                  .single()

                if (insertError) {
                  continue
                }
                existingChord = newChord
              }

              // Associer l'accord au cours et à la leçon
              if (existingChord) {
                const { error: associationError } = await supabase
                  .from('course_chords')
                  .upsert({
                    course_id: courseData.id,
                    chord_id: existingChord.id,
                    lesson_id: lesson.id
                  }, {
                    onConflict: 'course_id,chord_id,lesson_id'
                  })

                if (associationError && associationError.code !== '23505') {
                  // On ignore les erreurs d'association déjà existantes
                }
              }
            } else {
              // Accord non trouvé dans le service local, on ignore
            }
          }
        }

        // Extraire les références d'artistes
        const artistMatch = step.description.match(/\[artist:([^\]]+)\]/)
        if (artistMatch) {
          await supabase
            .from('course_artists')
            .upsert({
              course_id: courseData.id,
              artist_name: artistMatch[1],
              lesson_id: lesson.id
            }, {
              onConflict: 'course_id,artist_name,lesson_id'
            })
        }

        // Extraire les références de tablatures
        const tablatureMatch = step.description.match(/\[fulltablature:([^\]]+)\]/)
        if (tablatureMatch) {
          const tablatureSlug = tablatureMatch[1] // Ex: "shake-it-off-001"
          
          // Mapping des slugs vers les IDs Songsterr connus
          // Format: slug -> songsterrId
          const songsterrIdMap: Record<string, number> = {
            'shake-it-off-001': 468698
            // Ajouter d'autres mappings ici au fur et à mesure
          }
          
          const songsterrId = songsterrIdMap[tablatureSlug]
          
          // Extraire le titre de la chanson depuis le titre du cours
          const songTitleMatch = course.title.match(/Apprendre\s+["'](.+?)["']/i)
          const songTitle = songTitleMatch ? songTitleMatch[1] : null
          const artistName = course.artist || (artistMatch ? artistMatch[1] : null)
          
          // Construire l'URL Songsterr si on a l'ID
          const songsterrUrl = songsterrId 
            ? `https://www.songsterr.com/a/wsa/taylor-swift-shake-it-off-tab-s${songsterrId}t1`
            : null
          
          // Vérifier si la tablature existe déjà (par slug)
          const { data: existingTablature } = await supabase
            .from('tablatures')
            .select('id')
            .eq('slug', tablatureSlug)
            .maybeSingle()
          
          // Générer un UUID pour l'ID si la tablature n'existe pas
          // Sinon, utiliser l'ID existant
          let tablatureUuid: string
          if (existingTablature) {
            tablatureUuid = existingTablature.id
          } else {
            // Générer un UUID v4
            tablatureUuid = crypto.randomUUID()
          }
          
          // Note: On ne cherche pas Songsterr ici car CORS bloque les appels depuis le navigateur
          // Le composant FullTablatureViewer fera l'appel Songsterr au moment de l'affichage
          
          // Si la tablature n'existe pas encore, la créer
          if (!existingTablature) {
            const { error: tablatureError } = await supabase
              .from('tablatures')
              .insert({
                id: tablatureUuid,
                title: songTitle || course.title,
                artist: artistName,
                slug: tablatureSlug,
                songsterr_id: songsterrId || null,
                songsterr_url: songsterrUrl || null,
                measures: [],
                updated_at: new Date().toISOString()
              })
            
            if (tablatureError) {
              // On ignore les erreurs de création de tablature pour ne pas polluer la console
            }
          } else {
            // Mettre à jour l'ID Songsterr si on l'a et qu'il n'est pas déjà défini
            if (songsterrId) {
              const { data: currentTablature } = await supabase
                .from('tablatures')
                .select('songsterr_id')
                .eq('id', tablatureUuid)
                .single()
              
              if (!currentTablature?.songsterr_id) {
                const { error: updateError } = await supabase
                  .from('tablatures')
                  .update({
                    songsterr_id: songsterrId,
                    songsterr_url: songsterrUrl
                  })
                  .eq('id', tablatureUuid)
                
                if (updateError) {
                  // On ignore les erreurs de mise à jour de Songsterr
                }
              }
            }
          }
          
          // Associer la tablature au cours et à la leçon (utiliser l'UUID)
          const { error: tablatureAssociationError } = await supabase
            .from('course_tablatures')
            .upsert({
              course_id: courseData.id,
              tablature_id: tablatureUuid,
              lesson_id: lesson.id
            }, {
              onConflict: 'course_id,tablature_id,lesson_id'
            })
          
          if (tablatureAssociationError) {
            // On ignore les erreurs d'association pour ne pas polluer la console
          }
        }
      }

      // Associer l'artiste au cours (au niveau du cours, pas seulement de la leçon)
      if (course.artist) {
        await supabase
          .from('course_artists')
          .upsert({
            course_id: courseData.id,
            artist_name: course.artist,
            lesson_id: null // Association au niveau du cours
          }, {
            onConflict: 'course_id,artist_name,lesson_id'
          })
      }

      successCount++
    } catch (error) {
      errorCount++
    }
    
    // Petite pause pour éviter de surcharger l'API
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  return { 
    success: successCount > 0, 
    successCount,
    skippedCount,
    errorCount,
    message: `${successCount} cours ajoutés avec succès${skippedCount > 0 ? `, ${skippedCount} ignorés` : ''}${errorCount > 0 ? `, ${errorCount} erreurs` : ''}`
  }
}

// Exposer la fonction globalement pour la console
if (typeof window !== 'undefined') {
  (window as any).addSongCoursesToSupabase = addSongCoursesToSupabase
}

