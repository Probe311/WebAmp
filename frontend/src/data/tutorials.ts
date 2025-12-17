// Base de données des tutoriels et guides éducatifs pour WebAmp

export type TutorialCategory = 
  | 'effects' 
  | 'amps' 
  | 'chains' 
  | 'styles' 
  | 'techniques' 
  | 'creativity'
  | 'basics' // Pour les tutoriels de base/débutant

export type TutorialDifficulty = 'beginner' | 'intermediate' | 'advanced' | 'pro'

export type TutorialType = 'tutorial' | 'guide' | 'quiz' | 'preset'

export interface Tutorial {
  id: string
  title: string
  description: string
  category: TutorialCategory
  difficulty: TutorialDifficulty
  duration: number // en minutes
  type: TutorialType
  icon: string // Nom de l'icône Lucide
  tags: string[]
  content?: {
    steps?: TutorialStep[]
    presetId?: string
    quiz?: QuizQuestion[]
  }
  prerequisites?: string[] // IDs de tutoriels requis
  rewards: {
    xp: number
    badges?: string[]
  }
}

export interface TutorialStep {
  id: string
  title: string
  description: string
  action?: {
    type: 'addPedal' | 'setParameter' | 'loadPreset' | 'test'
    target: string
    value?: any
  }
}

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

export const tutorials: Tutorial[] = [
  // Tutoriels Débutant
  {
    id: 'tut-001',
    title: 'Votre premier preset',
    description: 'Créez votre premier preset en ajoutant une pédale de distorsion et en ajustant les paramètres de base.',
    category: 'basics',
    difficulty: 'beginner',
    duration: 5,
    type: 'tutorial',
    icon: 'Sparkles',
    tags: ['débutant', 'preset', 'distortion'],
    content: {
      steps: [
        {
          id: 'step-1',
          title: 'Introduction à WebAmp',
          description: 'Bienvenue dans WebAmp ! Cette application vous permet de créer des chaînes d\'effets pour votre guitare.',
        },
        {
          id: 'step-2',
          title: 'Ajouter une pédale',
          description: 'Cliquez sur le bouton "+" pour ajouter votre première pédale. Commençons par une distorsion.',
          action: {
            type: 'addPedal',
            target: 'boss-ds1',
          },
        },
        {
          id: 'step-3',
          title: 'Ajuster les paramètres',
          description: `Ajustez le niveau de distorsion à environ 60% pour un son équilibré.

Astuce : Commencez avec des valeurs modérées (40-60%) et ajustez selon vos préférences. Un niveau trop élevé peut créer de la distorsion excessive, tandis qu'un niveau trop faible peut manquer de punch.`,
          action: {
            type: 'setParameter',
            target: 'distortion',
            value: 60,
          },
        },
        {
          id: 'step-4',
          title: 'Tester votre son',
          description: 'Jouez quelques notes pour tester votre nouveau preset !',
          action: {
            type: 'test',
            target: 'audio',
          },
        },
      ],
    },
    rewards: {
      xp: 50,
      badges: ['premiers-pas'],
    },
  },
  {
    id: 'tut-002',
    title: 'Comprendre les amplis',
    description: 'Découvrez comment fonctionnent les amplificateurs et leurs paramètres principaux.',
    category: 'basics',
    difficulty: 'beginner',
    duration: 8,
    type: 'tutorial',
    icon: 'Radio',
    tags: ['amplis', 'bases', 'paramètres'],
    content: {
      steps: [
        {
          id: 'step-1',
          title: 'Qu\'est-ce qu\'un amplificateur ?',
          description: `Un amplificateur (ou "ampli") est un appareil qui augmente le signal électrique de votre guitare pour le rendre audible à travers un haut-parleur.

Il existe deux types principaux :
• Les amplis combo : ampli et haut-parleur dans un seul boîtier
• Les amplis "head" : ampli séparé du haut-parleur (cabinet)

Dans WebAmp, vous pouvez simuler différents modèles d'amplis célèbres comme les Fender, Marshall, Mesa Boogie, etc.`,
        },
        {
          id: 'step-2',
          title: 'Les paramètres de base',
          description: `La plupart des amplis ont des contrôles similaires :

• Volume/Gain : Contrôle le niveau de sortie et la saturation
• Bass : Ajuste les fréquences graves (basses)
• Middle : Ajuste les fréquences médiums (moyennes)
• Treble : Ajuste les fréquences aiguës (hautes)
• Presence : Affine les aigus supérieurs pour plus de clarté
• Master : Contrôle le volume général de sortie

Ces contrôles permettent de sculpter votre son selon vos préférences.`,
        },
        {
          id: 'step-3',
          title: 'Gain vs Volume',
          description: `Il est important de comprendre la différence entre Gain et Volume :

• Gain : Contrôle la quantité de distorsion/saturation. Plus le gain est élevé, plus le son est saturé et "crunchy"
• Volume/Master : Contrôle uniquement le niveau sonore sans ajouter de distorsion

Pour un son clean (clair), gardez le gain bas et augmentez le volume.
Pour un son saturé, augmentez le gain.`,
        },
        {
          id: 'step-4',
          title: 'Les différents styles d\'amplis',
          description: `Chaque marque d'ampli a sa propre caractéristique sonore :

• Fender : Son clair et cristallin, idéal pour le blues et le rock
  → Artistes emblématiques : [artist:Stevie Ray Vaughan], [artist:Eric Clapton]
• Marshall : Son chaud et saturé, emblématique du rock classique
  → Artistes emblématiques : [artist:Jimi Hendrix], [artist:Slash]
• Mesa Boogie : Son high-gain puissant, parfait pour le metal
  → Artistes emblématiques : [artist:Metallica], [artist:Dream Theater]
• Vox : Son britannique caractéristique avec des médiums prononcés
  → Artistes emblématiques : [artist:The Beatles], [artist:Queen]
• Orange : Son chaud et vintage avec beaucoup de caractère
  → Artistes emblématiques : [artist:Jimmy Page], [artist:Noel Gallagher]

Expérimentez avec différents amplis pour trouver celui qui correspond à votre style !`,
        },
      ],
    },
    rewards: {
      xp: 75,
    },
  },

  // Guides Effets
  {
    id: 'guide-001',
    title: 'Distortion vs Overdrive',
    description: 'Comprenez les différences entre la distortion et l\'overdrive, et quand utiliser chacun.',
    category: 'effects',
    difficulty: 'intermediate',
    duration: 10,
    type: 'tutorial',
    icon: 'Zap',
    tags: ['distortion', 'overdrive', 'comparaison'],
    content: {
      steps: [
        {
          id: 'step-1',
          title: 'Qu\'est-ce que l\'Overdrive ?',
          description: `L'overdrive simule la saturation naturelle d'un ampli à tubes poussé à fond. Il produit une distorsion douce et chaleureuse qui préserve les caractéristiques de votre guitare.

Caractéristiques :
• Son plus naturel et organique
• Conserve la dynamique de votre jeu
• Ajoute de la chaleur sans masquer les détails
• Idéal pour le blues, le rock classique et le country

Exemples célèbres : Tube Screamer (Ibanez TS9), Klon Centaur, Blues Driver (BOSS BD-2)`,
        },
        {
          id: 'step-2',
          title: 'Qu\'est-ce que la Distortion ?',
          description: `La distortion produit une saturation plus agressive et comprimée. Elle "écrase" le signal pour créer un son plus dense et puissant.

Caractéristiques :
• Son plus agressif et comprimé
• Réduit la dynamique pour un son constant
• Masque certains détails du jeu original
• Idéal pour le rock, le metal et les solos percutants

Exemples célèbres : DS-1 (BOSS), RAT (Pro Co), Metal Zone (BOSS MT-2)`,
        },
        {
          id: 'step-3',
          title: 'Quand utiliser l\'Overdrive ?',
          description: `Utilisez l'overdrive quand vous voulez :

• Un son chaud et naturel qui respire
• Conserver la dynamique de votre jeu (nuances entre notes douces et fortes)
• Ajouter de la "crunch" sans perdre en clarté
• Créer des sons blues, rock classique ou country

L'overdrive fonctionne particulièrement bien avec des amplis déjà légèrement saturés, car il "boost" la saturation existante plutôt que de la créer.`,
        },
        {
          id: 'step-4',
          title: 'Quand utiliser la Distortion ?',
          description: `Utilisez la distortion quand vous voulez :

• Un son agressif et puissant
• Un sustain long pour les solos
• Un son constant et comprimé
• Créer des sons rock, metal ou punk

La distortion fonctionne mieux avec des amplis clean, car elle apporte toute la saturation nécessaire. Elle peut aussi être utilisée pour des effets créatifs comme le "fuzz".`,
        },
        {
          id: 'step-5',
          title: 'Combiner Overdrive et Distortion',
          description: `Vous pouvez combiner les deux effets ! Une technique courante consiste à :

1. Placer un overdrive en premier (gain faible, volume élevé) pour "booster" le signal
2. Ajouter une distortion après pour la saturation principale

Cette combinaison crée un son très puissant et chaud, souvent utilisé en metal moderne. L'overdrive agit comme un "boost" qui pousse la distortion pour plus de sustain et de présence.`,
        },
      ],
    },
    rewards: {
      xp: 100,
      badges: ['maitre-distortion'],
    },
  },
  {
    id: 'guide-002',
    title: 'Guide complet du Delay',
    description: 'Tout ce que vous devez savoir sur le delay : types, paramètres, et techniques d\'utilisation.',
    category: 'effects',
    difficulty: 'intermediate',
    duration: 12,
    type: 'tutorial',
    icon: 'RotateCcw',
    tags: ['delay', 'modulation', 'temps'],
    content: {
      steps: [
        {
          id: 'step-1',
          title: 'Qu\'est-ce que le Delay ?',
          description: `Le delay (ou "écho") enregistre votre signal et le rejoue après un délai. C'est l'un des effets les plus utilisés en guitare.

Le delay crée des répétitions de votre son, comme un écho dans une grotte. Contrairement à la reverb qui crée un espace ambiant, le delay produit des répétitions distinctes et audibles.

Types de delay courants :
• Analog Delay : Son chaud et vintage
• Digital Delay : Son propre et précis
• Tape Delay : Simulation de bande magnétique avec saturation`,
        },
        {
          id: 'step-2',
          title: 'Les paramètres du Delay',
          description: `Les principaux paramètres du delay sont :

• Time/Delay : Le temps entre le signal original et la répétition (en millisecondes ou en notes musicales)
• Feedback/Repeat : Le nombre de répétitions (de 0 à 100%)
• Mix/Wet : Le niveau du signal delayé par rapport au signal original (dry)
• Modulation : Ajoute un effet de vibrato aux répétitions (optionnel)

Règle d'or : Le Time détermine le rythme, le Feedback détermine l'intensité, et le Mix détermine la présence.`,
        },
        {
          id: 'step-3',
          title: 'Réglages par style musical',
          description: `Voici des réglages typiques selon le style :

Rock Classique :
• Time : 300-400ms (ou 1/4 de note)
• Feedback : 30-40%
• Mix : 20-30%
→ Crée un doublage subtil

Ambient/Post-Rock :
• Time : 500-800ms
• Feedback : 60-80%
• Mix : 40-50%
→ Crée des textures atmosphériques

Slapback (Rockabilly) :
• Time : 100-150ms
• Feedback : 10-20%
• Mix : 30-40%
→ Crée un écho court et sec`,
        },
        {
          id: 'step-4',
          title: 'Techniques avancées',
          description: `Techniques créatives avec le delay :

1. Ping-Pong Delay : Utilisez un delay stéréo pour créer un effet de va-et-vient entre les enceintes

2. Delay en tempo : Synchronisez le delay avec le tempo de la chanson pour des répétitions rythmiques

3. Delay court + Reverb : Combinez un delay court (100-200ms) avec une reverb pour plus de profondeur

4. Feedback élevé : Augmentez le feedback à 80-90% pour créer des boucles infinies (attention au volume !)

5. Delay sur les solos : Un delay court (200-300ms) avec peu de feedback ajoute de la présence aux solos`,
        },
        {
          id: 'step-5',
          title: 'Où placer le Delay dans la chaîne ?',
          description: `L'ordre des effets est crucial ! Voici où placer le delay :

Règle générale : Le delay se place APRÈS la distorsion/overdrive mais AVANT la reverb.

Chaîne recommandée :
Guitare → Distortion → Delay → Reverb → Ampli

Pourquoi ? Le delay répète le son déjà saturé, créant des échos cohérents. Si vous placez le delay avant la distorsion, chaque répétition sera saturée différemment, ce qui peut créer de la confusion.

Exception : Pour un effet "dirty delay" (delay saturé), placez-le avant la distorsion.`,
        },
      ],
    },
    rewards: {
      xp: 120,
    },
  },
  {
    id: 'guide-003',
    title: 'Maîtriser la Reverb',
    description: 'Explorez les différents types de reverb et leurs applications musicales.',
    category: 'effects',
    difficulty: 'intermediate',
    duration: 10,
    type: 'tutorial',
    icon: 'Cloud',
    tags: ['reverb', 'espace', 'ambiance'],
    content: {
      steps: [
        {
          id: 'step-1',
          title: 'Qu\'est-ce que la Reverb ?',
          description: `La reverb (réverbération) simule l'acoustique d'un espace. Quand vous jouez dans une salle de concert ou une cathédrale, le son rebondit sur les murs, créant des réflexions qui se mélangent avec le son direct.

La reverb ajoute de la profondeur et de l'espace à votre son, le faisant paraître moins "sec" et plus naturel.

Types de reverb courants :
• Room : Petite pièce, reverb courte
• Hall : Grande salle, reverb longue
• Plate : Reverb artificielle créée par une plaque métallique
• Spring : Reverb à ressorts (typique des amplis vintage)`,
        },
        {
          id: 'step-2',
          title: 'Les paramètres de la Reverb',
          description: `Les principaux paramètres sont :

• Size/Room Size : La taille de l'espace simulé (petit = sec, grand = spacieux)
• Decay/Time : La durée de la reverb avant qu'elle ne disparaisse
• Mix/Wet : Le niveau de la reverb par rapport au signal original
• Pre-Delay : Le temps avant que la reverb ne commence (simule la distance aux murs)
• Damping : L'amortissement des fréquences aiguës (plus élevé = son plus sombre)

Astuce : Commencez avec un Mix faible (10-20%) et augmentez progressivement.`,
        },
        {
          id: 'step-3',
          title: 'Réglages par contexte',
          description: `Voici des réglages adaptés selon le contexte :

Rythme (rythmique) :
• Size : Petit à moyen
• Decay : Court (1-2 secondes)
• Mix : 15-25%
→ Ajoute de la présence sans masquer le rythme

Solo :
• Size : Moyen à grand
• Decay : Moyen (2-4 secondes)
• Mix : 25-35%
→ Crée de l'espace et du sustain

Ambient/Atmosphérique :
• Size : Très grand
• Decay : Long (4+ secondes)
• Mix : 40-50%
→ Crée une texture immersive

Dry (sec) :
• Mix : 5-10% ou désactivé
→ Pour un son direct et percussif`,
        },
        {
          id: 'step-4',
          title: 'Où placer la Reverb ?',
          description: `La reverb se place généralement EN DERNIER dans la chaîne d'effets, juste avant l'ampli.

Chaîne recommandée :
Guitare → Distortion → Delay → Reverb → Ampli

Pourquoi en dernier ? La reverb doit traiter tous les autres effets pour créer un espace cohérent. Si vous placez la reverb avant la distorsion, chaque répétition sera saturée, créant un son confus.

Exception : Pour un effet "dirty reverb" (reverb saturée), placez-la avant la distorsion. C'est un effet créatif utilisé dans le shoegaze et le post-rock.`,
        },
        {
          id: 'step-5',
          title: 'Erreurs courantes à éviter',
          description: `Voici les erreurs les plus courantes avec la reverb :

1. Trop de Mix : Une reverb trop présente masque votre jeu et rend le son "boueux"
   → Solution : Gardez le Mix entre 15-30% sauf pour des effets spéciaux

2. Reverb sur tous les instruments : Si chaque instrument a sa propre reverb, le mix devient confus
   → Solution : Utilisez une reverb globale ou réservez-la aux éléments principaux

3. Reverb trop longue sur les rythmes : Une reverb longue sur les parties rythmiques crée de la confusion
   → Solution : Utilisez une reverb courte (Room) pour les rythmes

4. Ignorer le Pre-Delay : Sans pre-delay, la reverb commence immédiatement, ce qui sonne artificiel
   → Solution : Ajustez le Pre-Delay à 20-50ms pour plus de naturel`,
        },
      ],
    },
    rewards: {
      xp: 100,
    },
  },

  // Guides Chaînes d'effets
  {
    id: 'chain-001',
    title: 'L\'ordre des effets',
    description: 'Apprenez les règles générales pour ordonner vos effets dans la chaîne.',
    category: 'chains',
    difficulty: 'intermediate',
    duration: 15,
    type: 'tutorial',
    icon: 'Layers',
    tags: ['ordre', 'chaîne', 'règles'],
    content: {
      steps: [
        {
          id: 'step-1',
          title: 'Pourquoi l\'ordre est important',
          description: `L'ordre des effets dans votre chaîne a un impact énorme sur le son final. Chaque effet traite le signal qui sort de l'effet précédent, donc leur ordre détermine comment ils interagissent.

Exemple : Un delay avant une distorsion créera des répétitions saturées. Un delay après une distorsion créera des répétitions propres qui seront ensuite saturées différemment.

Règle d'or : Il n'y a pas de "bon" ou "mauvais" ordre, mais il y a des conventions qui fonctionnent bien dans la plupart des cas.`,
        },
        {
          id: 'step-2',
          title: 'L\'ordre classique',
          description: `Voici l'ordre classique recommandé pour la plupart des styles :

1. Tuner (accordeur)
2. Compression / Noise Gate
3. Wah / Envelope Filter
4. Distortion / Overdrive / Fuzz
5. Modulation (Chorus, Flanger, Phaser)
6. Delay
7. Reverb
8. Volume / Boost

Cet ordre respecte la logique : d'abord les effets de dynamique, puis la saturation, puis les effets de modulation, puis les effets de temps, et enfin le volume.

Note : Dans WebAmp, vous pouvez réorganiser les effets par drag & drop pour expérimenter !`,
        },
        {
          id: 'step-3',
          title: 'Effets avant la distorsion',
          description: `Ces effets se placent généralement AVANT la distorsion :

• Wah / Envelope Filter : Le wah fonctionne mieux avec un signal propre
• Compression : Compresse le signal avant la saturation pour un son plus uniforme
• Octaver / Pitch Shifter : Les effets de pitch fonctionnent mieux sur un signal propre
• Boost : Un boost avant la distorsion augmente le gain et la saturation

Pourquoi avant ? Ces effets modifient le signal de base. Une fois saturé, le signal devient moins réactif aux changements de dynamique ou de pitch.`,
        },
        {
          id: 'step-4',
          title: 'Effets après la distorsion',
          description: `Ces effets se placent généralement APRÈS la distorsion :

• Modulation (Chorus, Flanger, Phaser) : Ajoutent du mouvement au son saturé
• Delay : Répète le son déjà saturé pour des échos cohérents
• Reverb : Ajoute de l'espace au son final
• EQ : Sculpte les fréquences du son saturé

Pourquoi après ? Ces effets travaillent mieux sur un signal déjà traité. Le delay répète le son saturé, la reverb crée un espace autour du son final, et la modulation ajoute du mouvement sans affecter la saturation de base.`,
        },
        {
          id: 'step-5',
          title: 'Exceptions et effets créatifs',
          description: `N'hésitez pas à expérimenter ! Voici des ordres alternatifs créatifs :

1. Delay avant Distortion (Dirty Delay) :
   → Crée des répétitions saturées, utilisé en shoegaze

2. Reverb avant Distortion (Dirty Reverb) :
   → Crée une texture saturée et atmosphérique

3. Modulation avant Distortion :
   → La modulation est saturée, créant un son plus agressif

4. Multiple Distortions en série :
   → Overdrive → Distortion → Fuzz pour un son ultra-saturé

5. Delay dans la boucle d'effets (FX Loop) :
   → Si votre ampli a une boucle d'effets, placez delay/reverb dedans pour qu'ils soient après la préamplification

Rappelez-vous : Les règles sont faites pour être brisées ! Expérimentez pour trouver votre son unique.`,
        },
      ],
    },
    rewards: {
      xp: 150,
      badges: ['maitre-chaine'],
    },
  },

  // Presets éducatifs
  {
    id: 'preset-001',
    title: 'Son Blues Classique',
    description: 'Preset pré-configuré avec overdrive, delay et reverb. Découvrez pourquoi cet ordre fonctionne si bien.',
    category: 'styles',
    difficulty: 'beginner',
    duration: 3,
    type: 'preset',
    icon: 'Music',
    tags: ['blues', 'preset', 'overdrive'],
    content: {
      presetId: 'blues-classic',
    },
    rewards: {
      xp: 30,
    },
  },
  {
    id: 'preset-002',
    title: 'Son Metal Moderne',
    description: 'Configuration high-gain avec distortion, noise gate et reverb pour un son metal puissant.',
    category: 'styles',
    difficulty: 'intermediate',
    duration: 5,
    type: 'preset',
    icon: 'Zap',
    tags: ['metal', 'preset', 'high-gain'],
    content: {
      presetId: 'metal-modern',
    },
    rewards: {
      xp: 50,
    },
  },

  // Quiz
  {
    id: 'quiz-001',
    title: 'Quiz : Reconnaître les effets',
    description: 'Testez vos connaissances en identifiant les effets à l\'oreille.',
    category: 'effects',
    difficulty: 'intermediate',
    duration: 5,
    type: 'quiz',
    icon: 'HelpCircle',
    tags: ['quiz', 'effets', 'test'],
    content: {
      quiz: [
        {
          id: 'q1',
          question: 'Quel effet produit un son "doublé" avec des échos répétés ?',
          options: ['Reverb', 'Delay', 'Chorus', 'Flanger'],
          correctAnswer: 1,
          explanation: 'Le delay produit des échos répétés du signal original, créant un effet de "doublage".',
        },
        {
          id: 'q2',
          question: 'Quel effet ajoute de la profondeur et de l\'espace au son ?',
          options: ['Distortion', 'Reverb', 'Overdrive', 'Compressor'],
          correctAnswer: 1,
          explanation: 'La reverb simule l\'acoustique d\'un espace, ajoutant de la profondeur et de l\'ambiance.',
        },
        {
          id: 'q3',
          question: 'Quelle est la principale différence entre Overdrive et Distortion ?',
          options: [
            'L\'overdrive est plus agressif que la distortion',
            'L\'overdrive préserve la dynamique, la distortion la compresse',
            'La distortion fonctionne uniquement avec les amplis à tubes',
            'Il n\'y a aucune différence'
          ],
          correctAnswer: 1,
          explanation: 'L\'overdrive préserve la dynamique naturelle de votre jeu, tandis que la distortion compresse le signal pour un son plus constant et agressif.',
        },
        {
          id: 'q4',
          question: 'Dans quel ordre devriez-vous placer vos effets ?',
          options: [
            'Delay → Distortion → Reverb',
            'Distortion → Delay → Reverb',
            'Reverb → Delay → Distortion',
            'L\'ordre n\'a pas d\'importance'
          ],
          correctAnswer: 1,
          explanation: 'L\'ordre classique est : Distortion → Delay → Reverb. Le delay répète le son saturé, et la reverb ajoute de l\'espace au son final.',
        },
        {
          id: 'q5',
          question: 'Quel paramètre du Delay contrôle le nombre de répétitions ?',
          options: ['Time', 'Feedback', 'Mix', 'Modulation'],
          correctAnswer: 1,
          explanation: 'Le Feedback (ou Repeat) contrôle le nombre de répétitions. Plus il est élevé, plus il y a d\'échos.',
        },
        {
          id: 'q6',
          question: 'Quel type de reverb est typique des amplis Fender vintage ?',
          options: ['Hall', 'Plate', 'Spring', 'Room'],
          correctAnswer: 2,
          explanation: 'Les amplis Fender vintage utilisent une reverb à ressorts (Spring), qui produit un son caractéristique chaud et organique.',
        },
      ],
    },
    rewards: {
      xp: 75,
    },
  },

  // Tutoriels Débutant supplémentaires
  {
    id: 'tut-003',
    title: 'Naviguer dans WebAmp',
    description: 'Apprenez à utiliser l\'interface de WebAmp : ajouter des pédales, réorganiser la chaîne, et sauvegarder vos presets.',
    category: 'basics',
    difficulty: 'beginner',
    duration: 10,
    type: 'tutorial',
    icon: 'Layers',
    tags: ['interface', 'navigation', 'bases'],
    content: {
      steps: [
        {
          id: 'step-1',
          title: 'Découvrir l\'interface',
          description: `WebAmp est organisé en plusieurs sections principales :

• Le Pédalier : Zone centrale où vous ajoutez et organisez vos effets
• Le Sélecteur d'Ampli : En bas, pour choisir et configurer votre amplificateur
• La Navigation : En bas de l'écran pour accéder aux différentes pages

Prenez le temps d'explorer chaque section pour vous familiariser avec l'interface.`,
        },
        {
          id: 'step-2',
          title: 'Ajouter une pédale',
          description: `Pour ajouter une pédale à votre pédalier :

1. Cliquez sur le bouton "+" dans le pédalier
2. Une bibliothèque de pédales s'ouvre
3. Utilisez la barre de recherche pour trouver rapidement une pédale
4. Cliquez sur la pédale désirée pour l'ajouter

Les pédales sont organisées par type : Distortion, Overdrive, Delay, Reverb, etc.`,
        },
        {
          id: 'step-3',
          title: 'Réorganiser les pédales',
          description: `L'ordre des pédales est crucial ! Pour réorganiser :

1. Cliquez et maintenez sur une pédale
2. Glissez-la à la position désirée
3. Relâchez pour la placer

L'ordre détermine comment les effets se combinent. Expérimentez pour trouver le meilleur ordre pour votre son !`,
        },
        {
          id: 'step-4',
          title: 'Ajuster les paramètres',
          description: `Chaque pédale a ses propres paramètres :

• Cliquez sur une pédale pour voir ses contrôles
• Utilisez les boutons rotatifs (knobs) pour ajuster les valeurs
• Certaines pédales ont des switches pour changer de mode

Astuce : Commencez avec les valeurs par défaut, puis ajustez progressivement selon vos préférences.`,
        },
        {
          id: 'step-5',
          title: 'Activer/Désactiver une pédale',
          description: `Pour tester l'effet d'une pédale sans la supprimer :

• Cliquez sur le bouton "Bypass" de la pédale (généralement en bas)
• La pédale est désactivée mais reste dans la chaîne
• Cliquez à nouveau pour la réactiver

C'est très utile pour comparer votre son avec et sans un effet particulier !`,
        },
        {
          id: 'step-6',
          title: 'Sauvegarder votre preset',
          description: `Une fois que vous avez créé un son que vous aimez :

1. Allez dans les paramètres ou utilisez le menu de preset
2. Cliquez sur "Sauvegarder"
3. Donnez un nom à votre preset
4. Ajoutez des tags pour le retrouver facilement

Vos presets sont sauvegardés et peuvent être rechargés à tout moment !`,
        },
      ],
    },
    rewards: {
      xp: 80,
    },
  },
  {
    id: 'tut-004',
    title: 'Les bases de l\'EQ',
    description: 'Comprenez l\'égaliseur et comment sculpter votre son avec les fréquences.',
    category: 'basics',
    difficulty: 'beginner',
    duration: 8,
    type: 'tutorial',
    icon: 'Gauge',
    tags: ['eq', 'fréquences', 'bases'],
    content: {
      steps: [
        {
          id: 'step-1',
          title: 'Qu\'est-ce que l\'EQ ?',
          description: `L'égaliseur (EQ) vous permet d'ajuster le niveau de différentes fréquences dans votre signal.

Pensez-y comme un contrôle de volume pour chaque "couleur" du son :
• Les graves (Bass) : Les sons profonds et puissants
• Les médiums (Mid) : Les sons au milieu, où se trouve la plupart de la présence
• Les aigus (Treble) : Les sons brillants et perçants

Chaque fréquence a son rôle dans le mix final.`,
        },
        {
          id: 'step-2',
          title: 'Les bandes de fréquences',
          description: `Un EQ typique contrôle plusieurs bandes :

• Low (Graves) : 20-250 Hz - La profondeur et la puissance
• Low-Mid : 250-500 Hz - Le corps et la chaleur
• Mid : 500-2000 Hz - La présence et la clarté
• High-Mid : 2000-4000 Hz - La définition et la morsure
• High (Aigus) : 4000-20000 Hz - La brillance et l'air

En ajustant ces bandes, vous sculptez votre son.`,
        },
        {
          id: 'step-3',
          title: 'Techniques de base',
          description: `Voici quelques techniques essentielles :

1. Cut plutôt que Boost : Réduire les fréquences indésirables est souvent plus efficace que d'augmenter les bonnes

2. Le "Scoop" : Réduire les médiums (500-2000 Hz) pour un son plus "creux", populaire en metal

3. Le "Mid Boost" : Augmenter les médiums pour que la guitare perce dans le mix

4. Éviter la boue : Réduire les graves excessifs (sous 100 Hz) pour éviter que le son devienne "boueux"`,
        },
        {
          id: 'step-4',
          title: 'EQ dans la chaîne',
          description: `Où placer l'EQ dans votre chaîne ?

Avant la distorsion :
• Sculpte le signal avant la saturation
• Utile pour éliminer les fréquences indésirables avant qu'elles ne soient amplifiées

Après la distorsion :
• Sculpte le son final saturé
• Plus commun et souvent plus efficace
• Permet de corriger les problèmes créés par la distorsion

Expérimentez les deux positions pour voir laquelle fonctionne le mieux pour vous !`,
        },
      ],
    },
    rewards: {
      xp: 70,
    },
  },

  // Guides Effets supplémentaires
  {
    id: 'guide-004',
    title: 'Maîtriser le Chorus',
    description: 'Découvrez comment utiliser le chorus pour ajouter de la profondeur et du mouvement à votre son.',
    category: 'effects',
    difficulty: 'intermediate',
    duration: 10,
    type: 'tutorial',
    icon: 'Waves',
    tags: ['chorus', 'modulation', 'profondeur'],
    content: {
      steps: [
        {
          id: 'step-1',
          title: 'Qu\'est-ce que le Chorus ?',
          description: `Le chorus crée l'illusion de plusieurs guitares jouant en même temps. Il duplique votre signal, le décale légèrement en pitch et en temps, puis le mélange avec l'original.

Résultat : Un son plus large, plus riche et plus "profond" qui semble venir de plusieurs sources.

Le chorus est l'un des effets de modulation les plus populaires, utilisé dans tous les genres musicaux.`,
        },
        {
          id: 'step-2',
          title: 'Les paramètres du Chorus',
          description: `Les principaux paramètres sont :

• Rate/Speed : La vitesse de la modulation (lent = subtil, rapide = évident)
• Depth : L'intensité de la modulation (faible = doux, élevé = prononcé)
• Mix/Blend : Le niveau du signal choré par rapport à l'original
• Delay : Le délai entre l'original et la copie (généralement fixe)

Réglages typiques :
• Rate : 0.5-2 Hz pour un chorus classique
• Depth : 30-50% pour un effet subtil
• Mix : 30-50% pour un équilibre naturel`,
        },
        {
          id: 'step-3',
          title: 'Applications musicales',
          description: `Le chorus est utilisé pour :

Clean Guitars (Guitares claires) :
• Ajoute de la richesse et de la profondeur
• Rend le son moins "sec" et plus intéressant
• Idéal pour les arpèges et les accords

Saturated Guitars (Guitares saturées) :
• Ajoute du mouvement au son saturé
• Crée un son plus large et moins "direct"
• Populaire dans le rock des années 80

Bass :
• Ajoute de la présence et de la définition
• Rend la basse plus "audible" dans le mix
• Utilisé avec parcimonie (Mix faible)`,
        },
        {
          id: 'step-4',
          title: 'Où placer le Chorus ?',
          description: `Placement recommandé :

Après la distorsion :
• Le chorus traite le son saturé
• Crée un mouvement sur le son final
• Plus commun et souvent plus efficace

Avant la distorsion :
• Le chorus est saturé avec le signal
• Crée un son plus agressif et "dirty"
• Effet créatif utilisé dans certains styles

Dans la boucle d'effets (FX Loop) :
• Si votre ampli a une boucle d'effets
• Le chorus traite le son après la préamplification
• Souvent le meilleur placement pour un son naturel`,
        },
        {
          id: 'step-5',
          title: 'Erreurs courantes',
          description: `À éviter :

1. Trop de Mix : Un chorus trop présent sonne artificiel et "cheesy"
   → Solution : Gardez le Mix entre 30-50%

2. Rate trop rapide : Un chorus trop rapide crée un effet de vibrato indésirable
   → Solution : Utilisez un Rate entre 0.5-2 Hz

3. Chorus sur tout : Le chorus sur chaque instrument crée un son confus
   → Solution : Utilisez-le sélectivement, pas partout

4. Ignorer le contexte : Un chorus qui fonctionne en solo peut ne pas fonctionner dans un mix
   → Solution : Testez toujours dans le contexte du mix complet`,
        },
      ],
    },
    rewards: {
      xp: 100,
    },
  },
  {
    id: 'guide-005',
    title: 'Guide complet du Fuzz',
    description: 'Explorez le monde du fuzz : l\'effet de distorsion le plus extrême et caractéristique.',
    category: 'effects',
    difficulty: 'intermediate',
    duration: 12,
    type: 'tutorial',
    icon: 'Zap',
    tags: ['fuzz', 'distortion', 'extrême'],
    content: {
      steps: [
        {
          id: 'step-1',
          title: 'Qu\'est-ce que le Fuzz ?',
          description: `Le fuzz est une forme extrême de distorsion qui "écrase" le signal en créant une onde carrée. Il produit un son agressif, compressé et très saturé.

Caractéristiques du fuzz :
• Sustain très long
• Son "carré" et agressif
• Compression extrême
• Sensible au volume de la guitare

Le fuzz est né dans les années 60 et reste populaire aujourd'hui, notamment dans le rock psychédélique et le stoner rock.`,
        },
        {
          id: 'step-2',
          title: 'Types de Fuzz',
          description: `Il existe plusieurs types de fuzz :

Fuzz Face (Vintage) :
• Son chaud et organique
• Sensible au volume de la guitare
• Idéal pour les solos blues et rock classique
• Exemple : Fuzz Face (Dunlop)

Big Muff (Moderne) :
• Son plus agressif et comprimé
• Moins sensible au volume
• Idéal pour les power chords et les riffs
• Exemple : Big Muff Pi (Electro-Harmonix)

Octave Fuzz :
• Ajoute une octave au-dessus ou en dessous
• Son très agressif et unique
• Utilisé dans le rock psychédélique`,
        },
        {
          id: 'step-3',
          title: 'Les paramètres',
          description: `Les paramètres typiques du fuzz :

• Fuzz/Sustain : Le niveau de saturation (généralement très élevé)
• Tone : La couleur du son (souvent avec un "scoop" des médiums)
• Volume : Le niveau de sortie

Astuce importante : Le fuzz réagit fortement au volume de votre guitare. Réduire le volume de la guitare peut donner un son plus clean, tandis qu'un volume maximum donne le fuzz complet.`,
        },
        {
          id: 'step-4',
          title: 'Techniques d\'utilisation',
          description: `Techniques pour maîtriser le fuzz :

1. Volume de la guitare : Utilisez le volume de votre guitare comme un contrôle de gain
   → Volume max = Fuzz complet
   → Volume réduit = Son plus clean avec un peu de saturation

2. Placement dans la chaîne : Le fuzz fonctionne mieux en premier dans la chaîne
   → Avant les autres effets de distorsion
   → Avant le wah (le wah après le fuzz crée un son très agressif)

3. Combinaison avec d'autres effets :
   • Fuzz → Delay : Crée des échos saturés
   • Fuzz → Reverb : Crée une texture atmosphérique
   • Octaver → Fuzz : Crée un son très agressif

4. Éviter la boue : Le fuzz peut créer beaucoup de graves. Utilisez un EQ après pour nettoyer si nécessaire.`,
        },
        {
          id: 'step-5',
          title: 'Styles musicaux',
          description: `Le fuzz est utilisé dans plusieurs styles :

Rock Psychédélique :
• Son saturé et "spatial"
• Souvent combiné avec delay et reverb
• Exemples : Jimi Hendrix, Pink Floyd

Stoner Rock / Doom Metal :
• Fuzz très agressif et lourd
• Beaucoup de sustain pour les riffs lents
• Exemples : Black Sabbath, Sleep

Blues Rock :
• Fuzz subtil pour les solos
• Utilisation du volume de la guitare pour contrôler l'intensité
• Exemples : Stevie Ray Vaughan, Eric Clapton

Indie Rock :
• Fuzz pour les riffs et les leads
• Son moins extrême, plus "musical"`,
        },
      ],
    },
    rewards: {
      xp: 120,
      badges: ['maitre-fuzz'],
    },
  },
  {
    id: 'guide-006',
    title: 'Comprendre la Compression',
    description: 'Découvrez comment la compression contrôle la dynamique de votre son.',
    category: 'effects',
    difficulty: 'intermediate',
    duration: 10,
    type: 'tutorial',
    icon: 'Gauge',
    tags: ['compression', 'dynamique', 'niveau'],
    content: {
      steps: [
        {
          id: 'step-1',
          title: 'Qu\'est-ce que la Compression ?',
          description: `La compression réduit la différence entre les sons forts et les sons faibles. Elle "écrase" la dynamique pour créer un son plus uniforme.

Comment ça fonctionne :
• Quand le signal dépasse un seuil (threshold), le compresseur réduit le volume
• Les sons forts sont réduits, les sons faibles restent identiques
• Résultat : Un son plus constant et uniforme

La compression est utilisée partout en musique moderne pour créer des sons "polished" et professionnels.`,
        },
        {
          id: 'step-2',
          title: 'Les paramètres',
          description: `Les principaux paramètres sont :

• Threshold : Le niveau au-dessus duquel la compression commence
• Ratio : L'intensité de la compression (2:1 = doux, 10:1 = fort)
• Attack : La vitesse à laquelle la compression commence
• Release : La vitesse à laquelle la compression se relâche
• Makeup Gain : Le volume ajouté après compression pour compenser la perte

Réglages typiques pour guitare :
• Ratio : 3:1 à 6:1 (compression modérée)
• Attack : Moyen (10-30ms)
• Release : Moyen à rapide (50-200ms)
• Threshold : Ajusté selon votre jeu`,
        },
        {
          id: 'step-3',
          title: 'Applications',
          description: `La compression est utilisée pour :

Clean Guitars :
• Uniformise le niveau entre les cordes
• Ajoute de la présence et de la clarté
• Rend le son plus "polished"

Saturated Guitars :
• La distorsion compresse déjà naturellement
• Compression supplémentaire pour plus de sustain
• Crée un son très constant

Fingerpicking / Fingerstyle :
• Uniformise les différences de volume entre les doigts
• Rend chaque note plus audible
• Essentiel pour un son professionnel

Lead Guitars :
• Ajoute du sustain pour les solos
• Rend chaque note plus présente
• Crée un son plus "lisse"`,
        },
        {
          id: 'step-4',
          title: 'Où placer la Compression ?',
          description: `Placement recommandé :

En début de chaîne :
• Compresse le signal avant les autres effets
• Uniformise le signal avant la saturation
• Plus commun pour les guitares clean

Après la distorsion :
• La distorsion compresse déjà naturellement
• Compression supplémentaire pour plus de contrôle
• Moins commun mais peut être utile

Dans la boucle d'effets :
• Compresse le son après la préamplification
• Plus de contrôle sur le son final
• Souvent le meilleur placement`,
        },
        {
          id: 'step-5',
          title: 'Erreurs courantes',
          description: `À éviter :

1. Trop de compression : Un son trop compressé perd sa vie et sa dynamique
   → Solution : Utilisez la compression avec parcimonie

2. Attack trop rapide : Peut supprimer l'attaque naturelle des notes
   → Solution : Utilisez un Attack moyen pour préserver l'attaque

3. Ignorer le Release : Un Release mal réglé peut créer des "pompes" indésirables
   → Solution : Ajustez le Release selon le tempo de la musique

4. Compression partout : La compression sur chaque instrument crée un son "plat"
   → Solution : Utilisez-la sélectivement`,
        },
      ],
    },
    rewards: {
      xp: 100,
    },
  },
  {
    id: 'guide-007',
    title: 'Maîtriser le Flanger',
    description: 'Découvrez le flanger : un effet de modulation unique qui crée des sons "whooshing" caractéristiques.',
    category: 'effects',
    difficulty: 'intermediate',
    duration: 10,
    type: 'tutorial',
    icon: 'Waves',
    tags: ['flanger', 'modulation', 'whoosh'],
    content: {
      steps: [
        {
          id: 'step-1',
          title: 'Qu\'est-ce que le Flanger ?',
          description: `Le flanger crée un effet "whooshing" caractéristique en mélangeant votre signal avec une copie légèrement retardée et modulée.

Le son typique du flanger :
• Un effet de "swoosh" ou "whoosh"
• Des fréquences qui "voyagent" de haut en bas
• Un son "métallique" et spatial

Le flanger est né dans les années 60 quand les ingénieurs du studio touchaient les bobines de bande magnétique pour créer un effet unique.`,
        },
        {
          id: 'step-2',
          title: 'Les paramètres',
          description: `Les principaux paramètres sont :

• Rate/Speed : La vitesse de la modulation (lent = subtil, rapide = évident)
• Depth : L'intensité de la modulation
• Feedback/Regen : La quantité de signal renvoyée (crée plus d'intensité)
• Mix : Le niveau du signal flangé

Réglages typiques :
• Rate : 0.1-1 Hz pour un effet subtil, 1-5 Hz pour un effet évident
• Depth : 50-80% pour un effet prononcé
• Feedback : 30-50% pour un son classique
• Mix : 50% pour un équilibre`,
        },
        {
          id: 'step-3',
          title: 'Applications musicales',
          description: `Le flanger est utilisé pour :

Clean Guitars :
• Ajoute du mouvement et de l'intérêt
• Crée un son spatial et "voyageur"
• Populaire dans le funk et la pop

Saturated Guitars :
• Ajoute du mouvement au son saturé
• Crée un son plus "vivant"
• Utilisé dans le rock et le metal

Effets spéciaux :
• Crée des transitions dramatiques
• Ajoute de l'ambiance aux intros et breaks
• Effet "jet plane" caractéristique`,
        },
        {
          id: 'step-4',
          title: 'Flanger vs Chorus',
          description: `Différences principales :

Flanger :
• Effet plus intense et "métallique"
• Feedback plus prononcé
• Son plus "whooshing"
• Utilisé pour des effets plus évidents

Chorus :
• Effet plus subtil et "doublant"
• Pas de feedback
• Son plus "doublé" et large
• Utilisé pour ajouter de la profondeur

Quand utiliser lequel ?
• Flanger : Pour des effets évidents et créatifs
• Chorus : Pour ajouter de la profondeur de manière subtile`,
        },
        {
          id: 'step-5',
          title: 'Techniques avancées',
          description: `Techniques créatives :

1. Flanger lent avec Feedback élevé :
   → Crée un son "voyageur" très intense
   → Idéal pour les intros et les breaks

2. Flanger rapide avec Depth faible :
   → Crée un effet subtil de mouvement
   → Ajoute de l'intérêt sans être trop évident

3. Flanger sur les solos :
   → Ajoute du mouvement et de la présence
   → Rend le solo plus "vivant"

4. Flanger stéréo :
   → Crée un effet de va-et-vient entre les enceintes
   → Très spatial et immersif`,
        },
      ],
    },
    rewards: {
      xp: 100,
    },
  },
  {
    id: 'guide-008',
    title: 'Guide du Phaser',
    description: 'Explorez le phaser : un effet de modulation qui crée des "notches" de fréquences en mouvement.',
    category: 'effects',
    difficulty: 'intermediate',
    duration: 10,
    type: 'tutorial',
    icon: 'CircleDot',
    tags: ['phaser', 'modulation', 'notch'],
    content: {
      steps: [
        {
          id: 'step-1',
          title: 'Qu\'est-ce que le Phaser ?',
          description: `Le phaser crée des "notches" de fréquences qui se déplacent dans le spectre. Il produit un effet de "swoosh" similaire au flanger mais plus subtil.

Comment ça fonctionne :
• Le phaser déplace des "notches" (coupures de fréquences) à travers le spectre
• Ces notches créent un effet de mouvement et de "swoosh"
• Le son semble "voyager" à travers les fréquences

Le phaser est plus subtil que le flanger et crée un effet plus "organique".`,
        },
        {
          id: 'step-2',
          title: 'Les paramètres',
          description: `Les principaux paramètres sont :

• Rate/Speed : La vitesse de la modulation
• Depth : L'intensité de l'effet
• Feedback/Resonance : La quantité de signal renvoyée (crée plus d'intensité)
• Stages : Le nombre de notches (4, 6, 8, 12 stages)

Réglages typiques :
• Rate : 0.5-2 Hz pour un effet subtil
• Depth : 50-80% pour un effet prononcé
• Feedback : 20-40% pour un son classique
• Stages : 4-6 pour un son subtil, 8-12 pour un son plus intense`,
        },
        {
          id: 'step-3',
          title: 'Applications musicales',
          description: `Le phaser est utilisé pour :

Clean Guitars :
• Ajoute du mouvement subtil
• Crée un son "voyageur" et intéressant
• Populaire dans le funk et la soul

Saturated Guitars :
• Ajoute du mouvement au son saturé
• Crée un son plus "vivant"
• Utilisé dans le rock classique

Effets spéciaux :
• Crée des transitions créatives
• Ajoute de l'ambiance aux intros
• Effet "swoosh" caractéristique`,
        },
        {
          id: 'step-4',
          title: 'Phaser vs Flanger',
          description: `Différences principales :

Phaser :
• Effet plus subtil et "organique"
• Crée des notches de fréquences
• Son plus "swoosh" doux
• Moins intense que le flanger

Flanger :
• Effet plus intense et "métallique"
• Utilise un delay modulé
• Son plus "whoosh" agressif
• Plus évident que le phaser

Quand utiliser lequel ?
• Phaser : Pour des effets subtils et organiques
• Flanger : Pour des effets plus évidents et créatifs`,
        },
        {
          id: 'step-5',
          title: 'Techniques d\'utilisation',
          description: `Techniques pour maîtriser le phaser :

1. Phaser lent avec Depth moyen :
   → Crée un mouvement subtil et organique
   → Idéal pour les parties rythmiques

2. Phaser rapide avec Depth élevé :
   → Crée un effet plus évident et créatif
   → Idéal pour les solos et les breaks

3. Phaser avec Feedback élevé :
   → Crée un son plus intense et "voyageur"
   → Attention à ne pas en abuser

4. Phaser stéréo :
   → Crée un effet de va-et-vient entre les enceintes
   → Très spatial et immersif`,
        },
      ],
    },
    rewards: {
      xp: 100,
    },
  },
  {
    id: 'guide-009',
    title: 'Maîtriser le Wah-Wah',
    description: 'Découvrez le wah-wah : l\'un des effets les plus expressifs et reconnaissables de la guitare.',
    category: 'effects',
    difficulty: 'intermediate',
    duration: 12,
    type: 'tutorial',
    icon: 'Circle',
    tags: ['wah', 'expression', 'filtre'],
    content: {
      steps: [
        {
          id: 'step-1',
          title: 'Qu\'est-ce que le Wah-Wah ?',
          description: `Le wah-wah est un filtre passe-bande modulé manuellement. En bougeant la pédale, vous contrôlez quelle fréquence est accentuée, créant le son caractéristique "wah-wah".

Le son typique :
• Un filtre qui "voyage" de bas en haut
• Son "wah" caractéristique
• Très expressif et contrôlable

Le wah-wah est l'un des effets les plus expressifs car vous contrôlez directement le son avec votre pied.`,
        },
        {
          id: 'step-2',
          title: 'Les paramètres',
          description: `Les principaux paramètres sont :

• Position de la pédale : Contrôle la fréquence accentuée (bas = graves, haut = aigus)
• Range : La plage de fréquences couvertes
• Q/Resonance : La largeur du filtre (étroit = plus prononcé, large = plus subtil)

Types de wah :
• Cry Baby : Le wah classique, son chaud
• Vox : Son plus brillant et agressif
• Auto-Wah : Wah automatique contrôlé par l'enveloppe du signal`,
        },
        {
          id: 'step-3',
          title: 'Techniques de base',
          description: `Techniques essentielles :

1. Le "Rock" : Balancez la pédale d'avant en arrière en rythme
   → Crée un effet rythmique
   → Synchronisé avec le tempo

2. Le "Sweep" : Balayez lentement de bas en haut
   → Crée un effet de montée
   → Idéal pour les intros et les transitions

3. La position fixe : Gardez la pédale à une position spécifique
   → Utilise le wah comme un filtre fixe
   → Sculpte le son sans mouvement

4. Le "Quack" : Positionnez le wah dans les médiums-aigus
   → Crée un son "quack" caractéristique
   → Populaire dans le funk`,
        },
        {
          id: 'step-4',
          title: 'Où placer le Wah ?',
          description: `Placement recommandé :

Avant la distorsion (classique) :
• Le wah sculpte le signal avant la saturation
• Son plus "classique" et contrôlable
• Plus commun et souvent préféré

Après la distorsion :
• Le wah sculpte le son déjà saturé
• Son plus agressif et intense
• Moins commun mais créatif

Expérimentez les deux positions pour trouver votre préférence !`,
        },
        {
          id: 'step-5',
          title: 'Applications musicales',
          description: `Le wah-wah est utilisé pour :

Funk :
• Le "quack" caractéristique
• Rythmes syncopés avec le wah
• Essentiel pour le son funk

Rock Classique :
• Solos expressifs
• Effets rythmiques
• Ajoute de l'émotion

Metal :
• Riffs agressifs avec le wah
• Solos techniques
• Crée de la présence

Blues :
• Expression subtile
• Ajoute de l'émotion aux solos
• Contrôle manuel expressif`,
        },
        {
          id: 'step-6',
          title: 'Erreurs courantes',
          description: `À éviter :

1. Trop de mouvement : Un wah trop agité peut être distrayant
   → Solution : Utilisez-le avec parcimonie et intention

2. Mauvaise synchronisation : Le wah désynchronisé avec le rythme sonne mal
   → Solution : Synchronisez le mouvement avec le tempo

3. Ignorer la position fixe : Le wah n'est pas seulement pour le mouvement
   → Solution : Expérimentez avec des positions fixes

4. Placement incorrect : Le wah au mauvais endroit peut créer un son confus
   → Solution : Testez avant et après la distorsion`,
        },
      ],
    },
    rewards: {
      xp: 120,
    },
  },
  {
    id: 'guide-010',
    title: 'Comprendre le Tremolo',
    description: 'Découvrez le tremolo : un effet de modulation d\'amplitude qui crée un effet de "pulsation".',
    category: 'effects',
    difficulty: 'intermediate',
    duration: 8,
    type: 'tutorial',
    icon: 'Waves',
    tags: ['tremolo', 'modulation', 'amplitude'],
    content: {
      steps: [
        {
          id: 'step-1',
          title: 'Qu\'est-ce que le Tremolo ?',
          description: `Le tremolo module l'amplitude (volume) du signal de manière répétitive. Il crée un effet de "pulsation" ou de "vibration" du volume.

Le son typique :
• Le volume monte et descend de manière répétitive
• Crée un effet rythmique
• Son "vintage" caractéristique

Le tremolo est souvent confondu avec le vibrato (qui module la hauteur), mais ce sont deux effets différents.`,
        },
        {
          id: 'step-2',
          title: 'Les paramètres',
          description: `Les principaux paramètres sont :

• Rate/Speed : La vitesse de la pulsation (lent = subtil, rapide = évident)
• Depth : L'intensité de la modulation (faible = subtil, élevé = prononcé)
• Waveform : La forme de l'onde (sinus = doux, carré = abrupt)

Réglages typiques :
• Rate : 2-8 Hz pour un effet rythmique
• Depth : 30-70% pour un effet audible mais pas trop intense
• Waveform : Sinus pour un son doux, carré pour un son plus agressif`,
        },
        {
          id: 'step-3',
          title: 'Applications musicales',
          description: `Le tremolo est utilisé pour :

Clean Guitars :
• Ajoute du mouvement et de l'intérêt
• Crée un son rythmique
• Populaire dans le surf rock et le country

Saturated Guitars :
• Ajoute du mouvement au son saturé
• Crée un effet rythmique unique
• Utilisé dans le rock alternatif

Ambient :
• Tremolo lent pour créer de l'ambiance
• Ajoute de la texture
• Crée un effet "respirant"`,
        },
        {
          id: 'step-4',
          title: 'Techniques d\'utilisation',
          description: `Techniques pour maîtriser le tremolo :

1. Synchronisation avec le tempo :
   → Ajustez le Rate pour correspondre au tempo
   → Crée un effet rythmique cohérent

2. Tremolo subtil :
   → Rate lent avec Depth faible
   → Ajoute du mouvement sans être trop évident

3. Tremolo évident :
   → Rate rapide avec Depth élevé
   → Crée un effet créatif et unique

4. Combinaison avec d'autres effets :
   • Tremolo → Reverb : Crée une texture atmosphérique
   • Tremolo → Delay : Crée des pulsations répétées`,
        },
      ],
    },
    rewards: {
      xp: 80,
    },
  },

  // Tutoriels Techniques
  {
    id: 'tech-001',
    title: 'Créer un son de lead',
    description: 'Apprenez à créer un son de guitare lead percutant et expressif pour vos solos.',
    category: 'techniques',
    difficulty: 'intermediate',
    duration: 15,
    type: 'tutorial',
    icon: 'Music',
    tags: ['lead', 'solo', 'technique'],
    content: {
      steps: [
        {
          id: 'step-1',
          title: 'Les bases du son lead',
          description: `Un bon son de lead doit :
• Percer dans le mix sans être trop agressif
• Avoir du sustain pour les notes longues
• Être expressif et réactif à votre jeu
• Avoir de la présence sans être trop aigu

Le son lead est généralement plus saturé que le son rythmique mais pas au point de perdre en clarté.`,
        },
        {
          id: 'step-2',
          title: 'Configuration de base',
          description: `Chaîne recommandée pour un son lead :

1. Overdrive ou Distortion modérée
   → Gain : 60-80% pour de la saturation sans perte de clarté
   → Tone : Ajusté pour de la présence

2. Compression (optionnel)
   → Ajoute du sustain
   → Uniformise le niveau

3. Delay court
   → Time : 200-300ms
   → Feedback : 20-30%
   → Mix : 20-30%
   → Ajoute de la présence sans masquer

4. Reverb légère
   → Size : Moyen
   → Decay : 2-3 secondes
   → Mix : 20-30%
   → Ajoute de l'espace`,
        },
        {
          id: 'step-3',
          title: 'Réglage de l\'ampli',
          description: `Pour un son lead :

Gain : Modéré à élevé
→ Assez de saturation pour le sustain
→ Pas trop pour garder la clarté

Médiums : Légèrement boostés
→ Les médiums font "percer" la guitare dans le mix
→ Évitez de trop réduire les médiums

Aigus : Modérés
→ Assez pour la présence
→ Pas trop pour éviter la dureté

Presence : Légèrement boostée
→ Ajoute de la clarté et de la définition`,
        },
        {
          id: 'step-4',
          title: 'Techniques de jeu',
          description: `Techniques pour maximiser votre son lead :

1. Vibrato : Ajoutez du vibrato aux notes longues pour plus d'expression

2. Bends : Les bends sont plus expressifs avec un bon sustain

3. Legato : Le legato (hammer-ons, pull-offs) fonctionne mieux avec de la compression

4. Dynamics : Variez votre attaque pour créer de la dynamique même avec de la saturation

5. Palm Muting : Utilisez le palm muting pour créer des contrastes`,
        },
        {
          id: 'step-5',
          title: 'Erreurs courantes',
          description: `À éviter :

1. Trop de saturation : Perd la clarté et la définition
   → Solution : Utilisez une saturation modérée

2. Pas assez de médiums : Le son ne perce pas dans le mix
   → Solution : Boostez légèrement les médiums

3. Trop de reverb : Masque le jeu et crée de la confusion
   → Solution : Utilisez une reverb légère (20-30%)

4. Delay trop présent : Masque les notes individuelles
   → Solution : Gardez le Mix du delay à 20-30%`,
        },
      ],
    },
    rewards: {
      xp: 150,
    },
  },
  {
    id: 'tech-002',
    title: 'Créer un son rythmique puissant',
    description: 'Apprenez à créer un son de guitare rythmique qui soutient le mix sans le dominer.',
    category: 'techniques',
    difficulty: 'intermediate',
    duration: 12,
    type: 'tutorial',
    icon: 'Music',
    tags: ['rythme', 'power-chords', 'technique'],
    content: {
      steps: [
        {
          id: 'step-1',
          title: 'Les bases du son rythmique',
          description: `Un bon son rythmique doit :
• Soutenir le mix sans le dominer
• Avoir de la présence sans être trop agressif
• Être cohérent et uniforme
• Fonctionner bien avec la basse et la batterie

Le son rythmique est généralement moins saturé que le son lead et a souvent moins de reverb.`,
        },
        {
          id: 'step-2',
          title: 'Configuration de base',
          description: `Chaîne recommandée pour un son rythmique :

1. Overdrive ou Distortion légère à modérée
   → Gain : 40-60% pour de la saturation sans perte de clarté
   → Tone : Équilibré

2. Compression (optionnel)
   → Uniformise le niveau entre les accords
   → Rend le son plus cohérent

3. EQ
   → Réduire légèrement les graves (pour laisser de la place à la basse)
   → Boost légèrement les médiums (pour la présence)
   → Aigus modérés

4. Reverb légère ou absente
   → Si reverb : Size petit, Decay court, Mix faible (10-20%)
   → Trop de reverb crée de la confusion sur les parties rythmiques`,
        },
        {
          id: 'step-3',
          title: 'Réglage de l\'ampli',
          description: `Pour un son rythmique :

Gain : Légèrement saturé
→ Assez pour le "crunch" mais pas trop pour garder la clarté

Graves : Modérés
→ Assez pour le corps mais pas trop pour laisser de la place à la basse

Médiums : Légèrement boostés
→ Les médiums donnent la présence rythmique
→ Essentiels pour que la guitare soit audible

Aigus : Modérés
→ Assez pour la clarté
→ Pas trop pour éviter la dureté`,
        },
        {
          id: 'step-4',
          title: 'Techniques de jeu',
          description: `Techniques pour maximiser votre son rythmique :

1. Palm Muting : Crée des contrastes et de la définition
   → Utilisez-le sur les notes basses des accords

2. Accords ouverts vs fermés : Variez pour créer de l'intérêt
   → Accords ouverts : Plus de résonance
   → Accords fermés : Plus de punch

3. Dynamics : Variez votre attaque
   → Notes douces vs notes fortes créent de la dynamique

4. Timing : La précision rythmique est cruciale
   → Un son rythmique doit être "tight" et précis`,
        },
        {
          id: 'step-5',
          title: 'Dans le contexte du mix',
          description: `Le son rythmique doit fonctionner avec :

La Basse :
• Réduisez les graves de la guitare pour laisser de la place
• Les médiums de la guitare complètent les graves de la basse

La Batterie :
• Le son rythmique doit être synchronisé avec la grosse caisse
• Évitez les fréquences qui entrent en conflit avec la caisse claire

Les Autres Guitares :
• Si plusieurs guitares : Variez légèrement les sons
• Une guitare peut être plus saturée, l'autre plus clean`,
        },
      ],
    },
    rewards: {
      xp: 120,
    },
  },

  // Tutoriels Styles musicaux
  {
    id: 'style-001',
    title: 'Son Blues Classique',
    description: 'Créez le son blues emblématique avec overdrive, delay et reverb.',
    category: 'styles',
    difficulty: 'beginner',
    duration: 10,
    type: 'tutorial',
    icon: 'Music',
    tags: ['blues', 'overdrive', 'style'],
    content: {
      steps: [
        {
          id: 'step-1',
          title: 'Les caractéristiques du son blues',
          description: `Le son blues classique se caractérise par :
• Une saturation douce et chaleureuse (overdrive plutôt que distortion)
• De la reverb pour l'espace
• Un delay subtil pour la présence
• Un son expressif et réactif au jeu

Le blues privilégie l'expression et la dynamique plutôt qu'une saturation agressive.`,
        },
        {
          id: 'step-2',
          title: 'Configuration de la chaîne',
          description: `Chaîne recommandée :

1. Overdrive (Tube Screamer ou équivalent)
   → Drive : 40-60%
   → Tone : 50-60% (légèrement boosté)
   → Level : 60-80%

2. Delay
   → Time : 300-400ms
   → Feedback : 20-30%
   → Mix : 20-30%

3. Reverb
   → Size : Moyen
   → Decay : 2-3 secondes
   → Mix : 25-35%`,
        },
        {
          id: 'step-3',
          title: 'Réglage de l\'ampli',
          description: `Pour un son blues :

Ampli : Fender ou équivalent (son clean chaud)
→ Gain : Légèrement saturé (3-5 sur 10)
→ Bass : 5-6
→ Middle : 6-7 (boosté pour la présence)
→ Treble : 5-6
→ Reverb : 3-4 (si l'ampli a une reverb intégrée)

Le son doit être chaud et expressif, pas trop saturé.`,
        },
        {
          id: 'step-4',
          title: 'Techniques de jeu blues',
          description: `Techniques essentielles :

1. Bends expressifs : Les bends sont au cœur du blues
   → Utilisez le vibrato après les bends

2. Dynamics : Variez votre attaque
   → Notes douces vs notes fortes créent de l'émotion

3. Slides et Hammer-ons : Ajoutent de la fluidité
   → Créez des transitions fluides entre les notes

4. Utilisation du volume : Réduisez le volume de la guitare pour un son plus clean
   → Augmentez pour plus de saturation`,
        },
      ],
    },
    rewards: {
      xp: 100,
    },
  },
  {
    id: 'style-002',
    title: 'Son Metal Moderne',
    description: 'Créez un son metal puissant avec distortion, noise gate et reverb.',
    category: 'styles',
    difficulty: 'intermediate',
    duration: 12,
    type: 'tutorial',
    icon: 'Zap',
    tags: ['metal', 'distortion', 'high-gain'],
    content: {
      steps: [
        {
          id: 'step-1',
          title: 'Les caractéristiques du son metal',
          description: `Le son metal moderne se caractérise par :
• Une saturation très élevée (high-gain)
• Beaucoup de sustain
• Des médiums "scoopés" (réduits)
• Un son agressif et puissant
• Un noise gate pour contrôler le bruit

Le metal privilégie la puissance et l'agressivité.`,
        },
        {
          id: 'step-2',
          title: 'Configuration de la chaîne',
          description: `Chaîne recommandée :

1. Noise Gate
   → Threshold : Ajusté pour éliminer le bruit
   → Attack : Rapide
   → Release : Moyen

2. Distortion (High-Gain)
   → Gain : 70-90%
   → Tone : Ajusté (souvent avec médiums réduits)
   → Level : 70-80%

3. EQ (après distorsion)
   → Réduire les médiums (scoop)
   → Boost légèrement les graves et aigus

4. Reverb légère
   → Size : Moyen
   → Decay : 2-3 secondes
   → Mix : 15-25%`,
        },
        {
          id: 'step-3',
          title: 'Réglage de l\'ampli',
          description: `Pour un son metal :

Ampli : Mesa Boogie, Peavey 5150, ou équivalent
→ Gain : Très élevé (7-9 sur 10)
→ Bass : 6-7
→ Middle : 3-4 (réduit pour le "scoop")
→ Treble : 6-7
→ Presence : 5-6

Le son doit être agressif et puissant avec beaucoup de sustain.`,
        },
        {
          id: 'step-4',
          title: 'Techniques de jeu metal',
          description: `Techniques essentielles :

1. Palm Muting : Essentiel pour les riffs
   → Crée de la définition et du punch
   → Utilisez-le sur les notes basses

2. Power Chords : La base du metal
   → Jouez-les avec précision et punch
   → Variez entre palm muting et accords ouverts

3. Tremolo Picking : Pour les parties rapides
   → Technique d'alternance rapide
   → Nécessite de la précision

4. Harmonics : Ajoutez des harmonics artificielles
   → Crée des accents et de l'intérêt`,
        },
      ],
    },
    rewards: {
      xp: 120,
    },
  },
  {
    id: 'style-003',
    title: 'Son Rock Classique',
    description: 'Créez le son rock emblématique des années 70-80 avec overdrive et modulation.',
    category: 'styles',
    difficulty: 'intermediate',
    duration: 10,
    type: 'tutorial',
    icon: 'Music',
    tags: ['rock', 'overdrive', 'chorus'],
    content: {
      steps: [
        {
          id: 'step-1',
          title: 'Les caractéristiques du son rock',
          description: `Le son rock classique se caractérise par :
• Une saturation modérée (overdrive)
• De la modulation (chorus, flanger)
• Un delay subtil
• Un son chaud et expressif

Le rock classique privilégie un son équilibré et musical.`,
        },
        {
          id: 'step-2',
          title: 'Configuration de la chaîne',
          description: `Chaîne recommandée :

1. Overdrive
   → Drive : 50-70%
   → Tone : 50-60%
   → Level : 60-80%

2. Chorus
   → Rate : 1-2 Hz
   → Depth : 40-50%
   → Mix : 30-40%

3. Delay
   → Time : 300-400ms
   → Feedback : 30-40%
   → Mix : 20-30%

4. Reverb
   → Size : Moyen
   → Decay : 2-3 secondes
   → Mix : 25-35%`,
        },
        {
          id: 'step-3',
          title: 'Réglage de l\'ampli',
          description: `Pour un son rock :

Ampli : Marshall ou équivalent
→ Gain : Modéré (5-7 sur 10)
→ Bass : 5-6
→ Middle : 6-7
→ Treble : 5-6

Le son doit être chaud, équilibré et expressif.`,
        },
      ],
    },
    rewards: {
      xp: 100,
    },
  },

  // Tutoriels Créativité
  {
    id: 'crea-001',
    title: 'Expérimenter avec l\'ordre des effets',
    description: 'Découvrez comment briser les règles conventionnelles pour créer des sons uniques.',
    category: 'creativity',
    difficulty: 'advanced',
    duration: 15,
    type: 'tutorial',
    icon: 'Sparkles',
    tags: ['créativité', 'expérimentation', 'ordre'],
    content: {
      steps: [
        {
          id: 'step-1',
          title: 'Pourquoi expérimenter ?',
          description: `Les règles conventionnelles sont des guides, pas des lois absolues. En expérimentant avec l'ordre des effets, vous pouvez découvrir des sons uniques et créatifs.

L'expérimentation vous permet de :
• Créer des sons uniques
• Développer votre propre style
• Trouver des combinaisons inattendues
• Pousser les limites créatives`,
        },
        {
          id: 'step-2',
          title: 'Combinaisons créatives',
          description: `Voici des combinaisons créatives à essayer :

1. Reverb → Distortion (Dirty Reverb)
   → Crée une texture saturée et atmosphérique
   → Populaire dans le shoegaze

2. Delay → Distortion (Dirty Delay)
   → Les répétitions sont saturées
   → Crée un effet unique

3. Chorus → Distortion
   → La modulation est saturée
   → Crée un son plus agressif

4. Multiple Distortions
   → Overdrive → Distortion → Fuzz
   → Crée un son ultra-saturé

5. Modulation en série
   → Chorus → Flanger → Phaser
   → Crée un mouvement complexe`,
        },
        {
          id: 'step-3',
          title: 'Techniques avancées',
          description: `Techniques pour pousser la créativité :

1. Feedback Loops : Créez des boucles de feedback
   → Attention au volume !

2. Extreme Settings : Poussez les paramètres à l'extrême
   → Découvrez ce qui se passe

3. Combinaisons multiples : Empilez plusieurs effets similaires
   → Delay → Delay → Delay pour des échos complexes

4. Contrôles inversés : Utilisez les contrôles de manière non conventionnelle
   → Feedback négatif, etc.`,
        },
      ],
    },
    rewards: {
      xp: 150,
      badges: ['créatif'],
    },
  },

  // Quiz supplémentaires
  {
    id: 'quiz-002',
    title: 'Quiz : Les effets de modulation',
    description: 'Testez vos connaissances sur les effets de modulation (chorus, flanger, phaser).',
    category: 'effects',
    difficulty: 'intermediate',
    duration: 8,
    type: 'quiz',
    icon: 'HelpCircle',
    tags: ['quiz', 'modulation', 'test'],
    content: {
      quiz: [
        {
          id: 'q1',
          question: 'Quel effet crée un son "doublé" en dupliquant le signal ?',
          options: ['Flanger', 'Chorus', 'Phaser', 'Tremolo'],
          correctAnswer: 1,
          explanation: 'Le chorus duplique le signal et le décale légèrement, créant l\'illusion de plusieurs guitares.',
        },
        {
          id: 'q2',
          question: 'Quel effet utilise un delay modulé pour créer un son "whooshing" ?',
          options: ['Chorus', 'Flanger', 'Phaser', 'Tremolo'],
          correctAnswer: 1,
          explanation: 'Le flanger utilise un delay modulé avec feedback pour créer l\'effet "whooshing" caractéristique.',
        },
        {
          id: 'q3',
          question: 'Quel effet crée des "notches" de fréquences en mouvement ?',
          options: ['Chorus', 'Flanger', 'Phaser', 'Tremolo'],
          correctAnswer: 2,
          explanation: 'Le phaser crée des notches de fréquences qui se déplacent dans le spectre.',
        },
        {
          id: 'q4',
          question: 'Quel effet module l\'amplitude (volume) du signal ?',
          options: ['Chorus', 'Flanger', 'Phaser', 'Tremolo'],
          correctAnswer: 3,
          explanation: 'Le tremolo module l\'amplitude du signal, créant un effet de pulsation du volume.',
        },
        {
          id: 'q5',
          question: 'Où placez-vous généralement les effets de modulation dans la chaîne ?',
          options: [
            'Avant la distorsion',
            'Après la distorsion mais avant le delay',
            'Après le delay',
            'Cela dépend de l\'effet'
          ],
          correctAnswer: 1,
          explanation: 'Les effets de modulation se placent généralement après la distorsion mais avant le delay et la reverb.',
        },
      ],
    },
    rewards: {
      xp: 100,
    },
  },
  {
    id: 'quiz-003',
    title: 'Quiz : Les amplis et leurs caractéristiques',
    description: 'Testez vos connaissances sur les différents types d\'amplis et leurs sons caractéristiques.',
    category: 'amps',
    difficulty: 'intermediate',
    duration: 8,
    type: 'quiz',
    icon: 'HelpCircle',
    tags: ['quiz', 'amplis', 'test'],
    content: {
      quiz: [
        {
          id: 'q1',
          question: 'Quelle marque d\'ampli est réputée pour son son clair et cristallin ?',
          options: ['Marshall', 'Fender', 'Mesa Boogie', 'Orange'],
          correctAnswer: 1,
          explanation: 'Fender est réputé pour son son clair et cristallin, idéal pour le blues et le rock.',
        },
        {
          id: 'q2',
          question: 'Quelle marque d\'ampli est emblématique du rock classique avec son son chaud et saturé ?',
          options: ['Fender', 'Marshall', 'Vox', 'Orange'],
          correctAnswer: 1,
          explanation: 'Marshall est emblématique du rock classique avec son son chaud et saturé.',
        },
        {
          id: 'q3',
          question: 'Quelle marque d\'ampli est réputée pour son son high-gain puissant, idéal pour le metal ?',
          options: ['Fender', 'Marshall', 'Mesa Boogie', 'Vox'],
          correctAnswer: 2,
          explanation: 'Mesa Boogie est réputé pour son son high-gain puissant, parfait pour le metal.',
        },
        {
          id: 'q4',
          question: 'Quelle est la différence principale entre Gain et Volume sur un ampli ?',
          options: [
            'Il n\'y a pas de différence',
            'Le Gain contrôle la saturation, le Volume contrôle le niveau',
            'Le Volume contrôle la saturation, le Gain contrôle le niveau',
            'Ils contrôlent tous les deux la saturation'
          ],
          correctAnswer: 1,
          explanation: 'Le Gain contrôle la quantité de saturation, tandis que le Volume contrôle uniquement le niveau sonore.',
        },
        {
          id: 'q5',
          question: 'Quel type d\'ampli a l\'ampli et le haut-parleur dans un seul boîtier ?',
          options: ['Head', 'Combo', 'Cabinet', 'Stack'],
          correctAnswer: 1,
          explanation: 'Un combo a l\'ampli et le haut-parleur dans un seul boîtier, contrairement à un head qui est séparé.',
        },
      ],
    },
    rewards: {
      xp: 100,
    },
  },

  // Tutoriels Amplis supplémentaires
  {
    id: 'amp-001',
    title: 'Choisir le bon ampli pour votre style',
    description: 'Apprenez à sélectionner l\'ampli qui correspond à votre style musical.',
    category: 'amps',
    difficulty: 'intermediate',
    duration: 12,
    type: 'tutorial',
    icon: 'Radio',
    tags: ['amplis', 'choix', 'style'],
    content: {
      steps: [
        {
          id: 'step-1',
          title: 'Comprendre les différents types',
          description: `Il existe plusieurs types d'amplis, chacun avec ses caractéristiques :

Amplis Clean (Fender, Vox) :
• Son clair et cristallin
• Idéal pour le blues, le country, le jazz
• Fonctionnent bien avec des pédales d'effets

Amplis Crunch (Marshall, Orange) :
• Son chaud et légèrement saturé
• Idéal pour le rock classique
• Bon équilibre entre clean et saturé

Amplis High-Gain (Mesa Boogie, Peavey) :
• Son très saturé et agressif
• Idéal pour le metal et le hard rock
• Beaucoup de sustain et de puissance`,
        },
        {
          id: 'step-2',
          title: 'Facteurs à considérer',
          description: `Lors du choix d'un ampli, considérez :

1. Votre style musical
   → Quel genre jouez-vous principalement ?
   → Avez-vous besoin d'un son clean ou saturé ?

2. Le contexte d'utilisation
   → Jouez-vous à la maison ou en concert ?
   → Besoin de beaucoup de volume ou non ?

3. Votre budget
   → Les amplis varient considérablement en prix
   → WebAmp vous permet d'expérimenter sans investir

4. Vos pédales
   → Certains amplis fonctionnent mieux avec des pédales
   → D'autres ont un son intégré qui ne nécessite pas de pédales`,
        },
        {
          id: 'step-3',
          title: 'Recommandations par style',
          description: `Voici des recommandations par style :

Blues :
• Fender (Twin Reverb, Deluxe Reverb)
• Son clean chaud qui prend bien les pédales
• Overdrive pour la saturation

Rock Classique :
• Marshall (JCM800, Plexi)
• Son crunch caractéristique
• Overdrive pour booster

Metal :
• Mesa Boogie (Dual Rectifier, Mark V)
• Peavey (5150, 6505)
• Son high-gain puissant

Jazz :
• Fender (Twin Reverb)
• Vox (AC30)
• Son clean et clair`,
        },
        {
          id: 'step-4',
          title: 'Expérimenter dans WebAmp',
          description: `WebAmp vous permet d'expérimenter avec différents amplis sans investir :

1. Testez différents modèles
   → Comparez les sons
   → Trouvez celui qui vous convient

2. Ajustez les paramètres
   → Expérimentez avec Gain, Bass, Middle, Treble
   → Découvrez comment chaque paramètre affecte le son

3. Combinez avec des pédales
   → Testez différents amplis avec vos pédales préférées
   → Découvrez les meilleures combinaisons

4. Sauvegardez vos configurations
   → Créez des presets pour chaque style
   → Retrouvez facilement vos sons préférés`,
        },
      ],
    },
    rewards: {
      xp: 120,
    },
  },
  {
    id: 'amp-002',
    title: 'Optimiser les paramètres de votre ampli',
    description: 'Apprenez à régler votre ampli pour obtenir le meilleur son possible.',
    category: 'amps',
    difficulty: 'intermediate',
    duration: 10,
    type: 'tutorial',
    icon: 'Gauge',
    tags: ['amplis', 'réglages', 'optimisation'],
    content: {
      steps: [
        {
          id: 'step-1',
          title: 'Commencer avec des réglages neutres',
          description: `Commencez toujours avec des réglages neutres (5 sur 10 ou 50%) :

• Gain : 5
• Bass : 5
• Middle : 5
• Treble : 5
• Presence : 5

Ces réglages neutres vous donnent une base équilibrée à partir de laquelle vous pouvez ajuster selon vos préférences.`,
        },
        {
          id: 'step-2',
          title: 'Ajuster le Gain',
          description: `Le Gain contrôle la saturation :

Pour un son Clean :
• Gain : 2-4 sur 10
• Son clair et cristallin
• Idéal pour le blues et le jazz

Pour un son Crunch :
• Gain : 5-7 sur 10
• Son légèrement saturé
• Idéal pour le rock classique

Pour un son High-Gain :
• Gain : 7-10 sur 10
• Son très saturé
• Idéal pour le metal

Astuce : Augmentez progressivement le gain jusqu'à obtenir le niveau de saturation désiré.`,
        },
        {
          id: 'step-3',
          title: 'Sculpter avec l\'EQ',
          description: `L'EQ vous permet de sculpter votre son :

Bass (Graves) :
• Augmentez pour plus de profondeur et de puissance
• Réduisez si le son devient "boueux"
• Typiquement : 4-7 sur 10

Middle (Médiums) :
• Augmentez pour que la guitare "perce" dans le mix
• Réduisez pour un son plus "creux" (scoop)
• Typiquement : 5-7 sur 10

Treble (Aigus) :
• Augmentez pour plus de clarté et de présence
• Réduisez si le son devient trop dur
• Typiquement : 5-7 sur 10

Presence :
• Affine les aigus supérieurs
• Ajoute de la clarté et de la définition
• Typiquement : 5-6 sur 10`,
        },
        {
          id: 'step-4',
          title: 'Techniques d\'ajustement',
          description: `Techniques pour optimiser vos réglages :

1. Ajustez un paramètre à la fois
   → Changez un paramètre, écoutez, puis ajustez le suivant
   → Cela vous permet d'entendre l'effet de chaque paramètre

2. Testez dans le contexte du mix
   → Un son qui sonne bien seul peut ne pas fonctionner dans un mix
   → Testez avec d'autres instruments si possible

3. Évitez les extrêmes
   → Les réglages extrêmes (0 ou 10) créent souvent des problèmes
   → Restez généralement entre 3 et 8

4. Prenez des notes
   → Notez vos réglages préférés
   → Créez des presets pour différents contextes`,
        },
      ],
    },
    rewards: {
      xp: 100,
    },
  },

  // Tutoriels Chaînes supplémentaires
  {
    id: 'chain-002',
    title: 'Créer une chaîne pour le studio',
    description: 'Apprenez à créer une chaîne d\'effets optimisée pour l\'enregistrement en studio.',
    category: 'chains',
    difficulty: 'advanced',
    duration: 15,
    type: 'tutorial',
    icon: 'Layers',
    tags: ['studio', 'enregistrement', 'chaîne'],
    content: {
      steps: [
        {
          id: 'step-1',
          title: 'Différences studio vs live',
          description: `Les chaînes pour le studio diffèrent de celles pour le live :

Studio :
• Plus de contrôle et de précision
• Possibilité d'utiliser plus d'effets
• Focus sur la qualité du son enregistré
• Possibilité de traiter après l'enregistrement

Live :
• Simplicité et fiabilité
• Moins d'effets pour éviter les problèmes
• Focus sur la performance
• Son doit être bon immédiatement`,
        },
        {
          id: 'step-2',
          title: 'Chaîne recommandée pour le studio',
          description: `Chaîne optimisée pour l'enregistrement :

1. Noise Gate (si nécessaire)
   → Élimine le bruit de fond
   → Important pour les sons saturés

2. Compression légère
   → Uniformise le niveau
   → Ajoute de la cohérence

3. Distortion/Overdrive
   → Saturation principale
   → Ajustée pour le mix final

4. EQ
   → Sculpte le son
   → Élimine les fréquences problématiques

5. Modulation (optionnel)
   → Chorus, Flanger, Phaser
   → Ajoute du mouvement

6. Delay
   → Time ajusté au tempo
   → Mix plus présent qu'en live

7. Reverb
   → Ajoute de l'espace
   → Peut être ajoutée après l'enregistrement`,
        },
        {
          id: 'step-3',
          title: 'Techniques d\'enregistrement',
          description: `Techniques pour optimiser l'enregistrement :

1. Enregistrez dry et wet séparément
   → Enregistrez le signal original (dry)
   → Enregistrez le signal avec effets (wet)
   → Vous pouvez mixer après

2. Utilisez moins d'effets qu'en live
   → Vous pouvez ajouter des effets après l'enregistrement
   → Gardez les effets essentiels seulement

3. Testez dans le contexte du mix
   → Un son qui sonne bien seul peut ne pas fonctionner dans le mix
   → Ajustez selon le contexte

4. Prenez des notes
   → Notez tous vos réglages
   → Vous pourrez les reproduire plus tard`,
        },
      ],
    },
    rewards: {
      xp: 150,
    },
  },
  {
    id: 'chain-003',
    title: 'Créer une chaîne pour le live',
    description: 'Apprenez à créer une chaîne d\'effets optimisée pour les performances live.',
    category: 'chains',
    difficulty: 'intermediate',
    duration: 12,
    type: 'tutorial',
    icon: 'Music',
    tags: ['live', 'performance', 'chaîne'],
    content: {
      steps: [
        {
          id: 'step-1',
          title: 'Priorités pour le live',
          description: `Pour le live, les priorités sont :

1. Simplicité
   → Moins d'effets = moins de problèmes
   → Chaîne simple et fiable

2. Fiabilité
   → Évitez les effets qui peuvent causer des problèmes
   → Testez tout avant le concert

3. Contrôle
   → Accès facile aux contrôles essentiels
   → Pédales de bypass pour activer/désactiver rapidement

4. Volume
   → Son qui perce dans le mix
   → Pas trop de reverb qui peut créer de la confusion`,
        },
        {
          id: 'step-2',
          title: 'Chaîne recommandée pour le live',
          description: `Chaîne optimisée pour les performances :

1. Tuner
   → Accordez rapidement entre les chansons
   → Peut servir de mute

2. Wah (si nécessaire)
   → Pour les effets expressifs
   → Facile à contrôler avec le pied

3. Overdrive/Distortion
   → Saturation principale
   → Contrôle facile du gain

4. Delay (optionnel)
   → Time synchronisé au tempo
   → Mix plus faible qu'en studio

5. Reverb légère (optionnel)
   → Ajoute de l'espace
   → Mix très faible (10-20%)`,
        },
        {
          id: 'step-3',
          title: 'Techniques pour le live',
          description: `Techniques pour optimiser votre performance :

1. Préparez vos presets
   → Créez des presets pour chaque chanson
   → Testez-les avant le concert

2. Utilisez des pédales de bypass
   → Activez/désactivez rapidement les effets
   → Créez des contrastes dynamiques

3. Testez votre son dans la salle
   → Arrivez tôt pour soundcheck
   → Ajustez selon l'acoustique de la salle

4. Gardez un backup
   → Ayez un preset de secours
   → Simple et fiable`,
        },
      ],
    },
    rewards: {
      xp: 120,
    },
  },

  // Tutoriels Techniques supplémentaires
  {
    id: 'tech-003',
    title: 'Utiliser le Noise Gate efficacement',
    description: 'Apprenez à utiliser le noise gate pour éliminer le bruit sans affecter votre jeu.',
    category: 'techniques',
    difficulty: 'intermediate',
    duration: 10,
    type: 'tutorial',
    icon: 'Shield',
    tags: ['noise-gate', 'bruit', 'technique'],
    content: {
      steps: [
        {
          id: 'step-1',
          title: 'Qu\'est-ce qu\'un Noise Gate ?',
          description: `Un noise gate ferme le signal quand il est en dessous d'un certain seuil. Il élimine le bruit de fond quand vous ne jouez pas.

Utilisations principales :
• Éliminer le bruit de fond des sons saturés
• Créer des silences nets entre les notes
• Réduire le feedback

Le noise gate est essentiel pour les sons high-gain qui génèrent beaucoup de bruit.`,
        },
        {
          id: 'step-2',
          title: 'Les paramètres',
          description: `Les principaux paramètres sont :

• Threshold : Le niveau au-dessous duquel le gate se ferme
• Attack : La vitesse à laquelle le gate s'ouvre
• Release : La vitesse à laquelle le gate se ferme
• Hold : Le temps minimum pendant lequel le gate reste ouvert

Réglages typiques :
• Threshold : Ajusté juste au-dessus du niveau de bruit
• Attack : Rapide (1-5ms) pour ne pas couper l'attaque
• Release : Moyen (50-200ms) pour un son naturel
• Hold : Court (10-50ms) pour éviter les coupures`,
        },
        {
          id: 'step-3',
          title: 'Techniques d\'ajustement',
          description: `Techniques pour régler le noise gate :

1. Commencez avec un Threshold bas
   → Augmentez progressivement jusqu'à ce que le bruit soit éliminé
   → Attention à ne pas couper les notes faibles

2. Ajustez l'Attack
   → Trop rapide : Peut couper l'attaque des notes
   → Trop lent : Le bruit passe avant que le gate ne se ferme

3. Ajustez le Release
   → Trop rapide : Crée des coupures abruptes
   → Trop lent : Le bruit passe après les notes

4. Testez avec votre jeu
   → Jouez des notes faibles et fortes
   → Assurez-vous que tout passe correctement`,
        },
        {
          id: 'step-4',
          title: 'Où placer le Noise Gate ?',
          description: `Placement recommandé :

Avant la distorsion :
• Élimine le bruit avant qu'il ne soit amplifié
• Plus efficace pour réduire le bruit total
• Placement classique

Après la distorsion :
• Élimine le bruit généré par la distorsion
• Moins efficace mais peut être nécessaire
• Utilisé quand le bruit vient de la distorsion

Expérimentez les deux positions pour trouver celle qui fonctionne le mieux pour vous !`,
        },
      ],
    },
    rewards: {
      xp: 100,
    },
  },

  // Tutoriels enrichis avec tablatures et artistes
  {
    id: 'learn-001',
    title: 'Apprendre les accords de base',
    description: 'Découvrez les accords essentiels de la guitare et apprenez à les jouer avec des diagrammes interactifs.',
    category: 'basics',
    difficulty: 'beginner',
    duration: 15,
    type: 'tutorial',
    icon: 'Music',
    tags: ['accords', 'débutant', 'tablature'],
    content: {
      steps: [
        {
          id: 'step-1',
          title: 'Introduction aux accords',
          description: `Un accord est un groupe de notes jouées simultanément. Les accords sont la base de la musique de guitare.

Les accords de base que vous devez connaître :
• Accords majeurs : C, D, E, G, A
• Accords mineurs : Am, Dm, Em
• Accords de 7ème : C7, G7, A7

Ces accords vous permettront de jouer des milliers de chansons !`,
        },
        {
          id: 'step-2',
          title: 'Lire un diagramme d\'accord',
          description: `Un diagramme d'accord montre :
• Les 6 cordes de la guitare (de gauche à droite : E grave, A, D, G, B, E aigu)
• Les frettes (lignes horizontales)
• Où placer vos doigts (cercles avec numéros)
• Les cordes à ne pas jouer (marquées ×)
• Les cordes à vide (marquées O)

Les numéros dans les cercles indiquent quel doigt utiliser :
• 1 = Index
• 2 = Majeur
• 3 = Annulaire
• 4 = Auriculaire`,
        },
        {
          id: 'step-3',
          title: 'Accord de Do majeur (C)',
          description: `L'accord de C est l'un des plus importants :

[chord:C]

Position des doigts :
• Corde A (5ème) : Case 3 avec l'annulaire (doigt 3)
• Corde D (4ème) : Case 2 avec le majeur (doigt 2)
• Corde B (2ème) : Case 1 avec l'index (doigt 1)
• Corde E aigu (1ère) : À vide (O)

Ne jouez PAS les cordes E grave (6ème) et G (3ème).

C'est un accord très utilisé dans de nombreuses chansons ! Pratiquez-le jusqu'à ce que chaque note sonne clairement.`,
        },
        {
          id: 'step-4',
          title: 'Accord de La mineur (Am)',
          description: `L'accord de Am est très commun :

[chord:Am]

Position des doigts :
• Corde A (5ème) : À vide (O)
• Corde D (4ème) : Case 2 avec le majeur (doigt 2)
• Corde G (3ème) : Case 2 avec l'annulaire (doigt 3)
• Corde B (2ème) : Case 1 avec l'index (doigt 1)
• Corde E aigu (1ère) : À vide (O)

Ne jouez PAS la corde E grave (6ème).

Am est souvent utilisé avec C, F et G dans les progressions pop et rock. C'est un accord facile à jouer et très polyvalent !`,
        },
        {
          id: 'step-5',
          title: 'Pratiquer les transitions',
          description: `Pour bien jouer des chansons, vous devez maîtriser les transitions entre accords :

1. Commencez lentement
   → Changez d'accord une fois par seconde
   → Assurez-vous que chaque accord sonne clairement

2. Utilisez un métronome
   → Commencez à 60 BPM
   → Augmentez progressivement la vitesse

3. Pratiquez les progressions courantes
   → C - Am - F - G (progression pop classique)
   → Am - Dm - G - C (progression mineure)
   → E - A - D - G (progression en quarte)

4. Ne vous découragez pas
   → Les transitions deviennent naturelles avec la pratique
   → Concentrez-vous sur la précision, pas la vitesse`,
        },
      ],
    },
    rewards: {
      xp: 150,
      badges: ['maitre-accords'],
    },
  },
  {
    id: 'learn-002',
    title: 'Étudier le style d\'un artiste',
    description: 'Apprenez à analyser le style d\'un artiste et à recréer son son avec WebAmp.',
    category: 'techniques',
    difficulty: 'intermediate',
    duration: 20,
    type: 'tutorial',
    icon: 'User',
    tags: ['artiste', 'style', 'analyse'],
    content: {
      steps: [
        {
          id: 'step-1',
          title: 'Pourquoi étudier les artistes ?',
          description: `Étudier le style d'un artiste vous permet de :
• Comprendre comment créer certains sons
• Apprendre de nouvelles techniques
• Développer votre propre style en vous inspirant
• Rejouer vos chansons préférées

Chaque grand guitariste a développé un son unique en combinant :
• Des effets spécifiques
• Des techniques de jeu particulières
• Des choix d'amplis et de guitares
• Une approche musicale personnelle`,
        },
        {
          id: 'step-2',
          title: 'Analyser le matériel utilisé',
          description: `Pour comprendre le son d'un artiste, recherchez :

1. Les amplis utilisés
   • Fender = Son clean/blues
   • Marshall = Son rock classique
   • Mesa Boogie = Son metal/high-gain

2. Les pédales d'effets
   • Quels effets sont utilisés ?
   • Dans quel ordre ?
   • Quels sont les réglages typiques ?

3. Les techniques de jeu
   • Fingerpicking ou médiator ?
   • Palm muting ?
   • Slides, bends, vibrato ?

4. Le contexte musical
   • Style de musique
   • Époque
   • Influences`,
        },
        {
          id: 'step-3',
          title: 'Recréer le son dans WebAmp',
          description: `Une fois que vous avez analysé le matériel, recréez le son dans WebAmp :

1. Choisissez l'ampli approprié
   → Sélectionnez un ampli qui correspond au style de l'artiste
   → Ajustez les paramètres de base (Gain, EQ)

2. Ajoutez les effets dans le bon ordre
   → Respectez l'ordre classique ou celui utilisé par l'artiste
   → Commencez avec les réglages par défaut

3. Ajustez les paramètres
   → Écoutez des enregistrements de l'artiste
   → Ajustez progressivement chaque paramètre
   → Comparez avec le son original

4. Sauvegardez votre preset
   → Donnez-lui un nom descriptif (ex: "Jimi Hendrix - Purple Haze")
   → Ajoutez des tags pour le retrouver facilement`,
        },
        {
          id: 'step-4',
          title: 'Exemple : Son Blues Classique',
          description: `Voici comment recréer un son blues classique :

Ampli : Fender Twin Reverb
• Gain : 3-4 sur 10 (son clean légèrement saturé)
• Bass : 5-6
• Middle : 6-7 (boosté pour la présence)
• Treble : 5-6

Effets :
1. Overdrive (Tube Screamer)
   • Drive : 40-60%
   • Tone : 50-60%
   • Level : 60-80%

2. Delay
   • Time : 300-400ms
   • Feedback : 20-30%
   • Mix : 20-30%

3. Reverb
   • Size : Moyen
   • Decay : 2-3 secondes
   • Mix : 25-35%

Techniques : Utilisez beaucoup de bends et de vibrato pour l'expression.`,
        },
        {
          id: 'step-5',
          title: 'Développer votre propre style',
          description: `Une fois que vous maîtrisez les sons des autres artistes :

1. Expérimentez
   → Mélangez des éléments de différents artistes
   → Essayez des combinaisons inattendues
   → Poussez les limites créatives

2. Trouvez votre voix
   → Qu'est-ce qui vous distingue ?
   → Quels effets vous inspirent ?
   → Quelle approche musicale vous correspond ?

3. Documentez vos découvertes
   → Créez des presets pour vos sons uniques
   → Notez ce qui fonctionne et ce qui ne fonctionne pas
   → Partagez avec d'autres musiciens

4. Continuez d'apprendre
   → Étudiez toujours de nouveaux artistes
   → Restez curieux et ouvert
   → La musique est un voyage sans fin !`,
        },
      ],
    },
    rewards: {
      xp: 200,
      badges: ['analyste-artiste'],
    },
  },
  {
    id: 'learn-003',
    title: 'Apprendre une chanson complète',
    description: 'Suivez un guide complet pour apprendre une chanson de A à Z avec tablatures et presets.',
    category: 'techniques',
    difficulty: 'intermediate',
    duration: 25,
    type: 'tutorial',
    icon: 'Music',
    tags: ['chanson', 'tablature', 'apprentissage'],
    content: {
      steps: [
        {
          id: 'step-1',
          title: 'Choisir une chanson adaptée',
          description: `Pour bien apprendre, choisissez une chanson :

1. À votre niveau
   • Débutant : Chansons avec peu d'accords (3-4 accords)
   • Intermédiaire : Chansons avec techniques variées
   • Avancé : Chansons complexes avec solos

2. Que vous aimez
   • Vous serez plus motivé
   • Vous comprendrez mieux le contexte musical

3. Avec des ressources disponibles
   • Tablatures disponibles
   • Enregistrements de qualité
   • Vidéos tutoriels (optionnel)

Exemples pour débutants :
• "Wonderwall" - Oasis (4 accords)
• "Horse with No Name" - America (2 accords)
• "Knockin' on Heaven's Door" - Bob Dylan (4 accords)`,
        },
        {
          id: 'step-2',
          title: 'Analyser la structure',
          description: `Avant de commencer à jouer, analysez la structure de la chanson :

1. Identifiez les sections
   • Intro
   • Verses (couplets)
   • Chorus (refrain)
   • Bridge (pont)
   • Solo
   • Outro

2. Identifiez les accords utilisés
   • Quels accords sont dans chaque section ?
   • Y a-t-il des variations ?
   • Quelle est la progression d'accords ?

3. Identifiez le rythme
   • Quel est le tempo ?
   • Quelle est la signature rythmique ?
   • Y a-t-il des patterns rythmiques spécifiques ?

4. Identifiez les techniques
   • Strumming ou fingerpicking ?
   • Palm muting ?
   • Slides, bends, hammer-ons ?`,
        },
        {
          id: 'step-3',
          title: 'Apprendre section par section',
          description: `N'apprenez pas toute la chanson d'un coup. Procédez section par section :

1. Commencez par l'intro
   • C'est souvent la partie la plus reconnaissable
   • Elle vous donne le ton de la chanson

2. Apprenez le verse
   • Répétez jusqu'à ce que ce soit fluide
   • Maîtrisez les transitions entre accords

3. Apprenez le chorus
   • C'est souvent la partie la plus importante
   • Pratiquez jusqu'à la perfection

4. Ajoutez les autres sections
   • Bridge, solo, etc.
   • Une fois que vous maîtrisez chaque section

5. Assemblez le tout
   • Jouez la chanson complète
   • Travaillez les transitions entre sections`,
        },
        {
          id: 'step-4',
          title: 'Utiliser les tablatures',
          description: `Les tablatures vous montrent exactement où placer vos doigts :

1. Lisez la tablature
   • Les lignes représentent les cordes
   • Les chiffres représentent les frettes
   • Lisez de gauche à droite

2. Suivez le rythme
   • Les tablatures montrent les notes mais pas toujours le rythme
   • Écoutez l'enregistrement original pour le rythme
   • Utilisez un métronome pour vous entraîner

3. Pratiquez lentement
   • Commencez très lentement
   • Assurez-vous que chaque note sonne clairement
   • Augmentez progressivement la vitesse

4. Utilisez les doigtés suggérés
   • Les tablatures peuvent indiquer les doigts à utiliser
   • Suivez-les pour une meilleure efficacité`,
        },
        {
          id: 'step-5',
          title: 'Recréer le son avec WebAmp',
          description: `Une fois que vous maîtrisez les notes, recréez le son :

1. Recherchez le matériel utilisé
   • Quels amplis et effets l'artiste utilise-t-il ?
   • Utilisez MusicBrainz pour trouver des informations sur l'artiste

2. Créez le preset dans WebAmp
   • Sélectionnez l'ampli approprié
   • Ajoutez les effets dans le bon ordre
   • Ajustez les paramètres

3. Testez en jouant
   • Jouez la chanson avec votre preset
   • Comparez avec l'enregistrement original
   • Ajustez si nécessaire

4. Sauvegardez votre preset
   • Donnez-lui un nom descriptif
   • Associez-le à la tablature si possible
   • Partagez-le avec d'autres musiciens !`,
        },
      ],
    },
    rewards: {
      xp: 250,
      badges: ['maitre-chansons'],
    },
  },
  {
    id: 'learn-004',
    title: 'Progression d\'accords Blues',
    description: 'Apprenez la progression d\'accords blues classique avec tablatures interactives.',
    category: 'styles',
    difficulty: 'beginner',
    duration: 12,
    type: 'tutorial',
    icon: 'Music',
    tags: ['blues', 'accords', 'progression', 'tablature'],
    content: {
      steps: [
        {
          id: 'step-1',
          title: 'La progression Blues 12 mesures',
          description: `La progression blues classique est en 12 mesures :

[tablature:example-001]

| A | A | A | A |
| D | D | A | A |
| E | D | A | E |

Cette progression est la base de milliers de chansons blues, rock et pop.

Chaque case représente une mesure (4 temps en 4/4).

La progression suit un pattern spécifique qui crée la tension et la résolution caractéristiques du blues.

Vous pouvez voir la tablature ci-dessus pour visualiser la progression.`,
        },
        {
          id: 'step-2',
          title: 'Les accords de base',
          description: `Pour jouer cette progression, vous avez besoin de 3 accords :

1. A (La majeur)
   • Corde A (5ème) : À vide
   • Corde D (4ème) : Case 2
   • Corde G (3ème) : Case 2
   • Corde B (2ème) : Case 2
   • Corde E aigu (1ère) : À vide

2. D (Ré majeur)
   • Corde D (4ème) : À vide
   • Corde G (3ème) : Case 2
   • Corde B (2ème) : Case 3
   • Corde E aigu (1ère) : Case 2

3. E (Mi majeur)
   • Corde E grave (6ème) : À vide
   • Corde A (5ème) : À vide
   • Corde D (4ème) : Case 2
   • Corde G (3ème) : Case 1
   • Corde B (2ème) : Case 0
   • Corde E aigu (1ère) : À vide`,
        },
        {
          id: 'step-3',
          title: 'Jouer la progression',
          description: `Pour jouer la progression :

1. Commencez lentement
   • Jouez chaque accord pendant 4 temps
   • Utilisez un métronome à 60-80 BPM
   • Assurez-vous que chaque accord sonne clairement

2. Travaillez les transitions
   • Les transitions A → D et D → A sont les plus difficiles
   • Pratiquez-les séparément
   • Trouvez le mouvement le plus efficace

3. Ajoutez le rythme
   • Une fois que les accords sont fluides, ajoutez le strumming
   • Commencez avec un pattern simple (bas-haut-bas-haut)
   • Variez le rythme selon le style

4. Augmentez la vitesse
   • Une fois que c'est fluide, augmentez progressivement le tempo
   • Objectif : Jouer à 120 BPM ou plus`,
        },
        {
          id: 'step-4',
          title: 'Variations et enrichissements',
          description: `Une fois que vous maîtrisez la progression de base, essayez des variations :

1. Accords de 7ème
   • Remplacez A par A7
   • Remplacez D par D7
   • Remplacez E par E7
   • Cela donne un son plus "bluesy"

2. Turnarounds
   • Ajoutez E → A à la fin de la progression
   • Crée une transition vers le début

3. Accords de substitution
   • Remplacez parfois A par Am
   • Remplacez parfois D par Dm
   • Crée des variations intéressantes

4. Rythmes variés
   • Essayez différents patterns de strumming
   • Ajoutez des accents
   • Variez l'intensité`,
        },
        {
          id: 'step-5',
          title: 'Créer le son Blues dans WebAmp',
          description: `Pour accompagner votre progression blues :

Ampli : Fender Twin Reverb
• Gain : 3-4 (son clean légèrement saturé)
• Bass : 5-6
• Middle : 6-7 (boosté)
• Treble : 5-6

Effets :
1. Overdrive léger
   • Drive : 30-50%
   • Tone : 50-60%
   • Level : 60-70%

2. Delay subtil
   • Time : 300-400ms
   • Feedback : 20-30%
   • Mix : 15-25%

3. Reverb légère
   • Size : Moyen
   • Decay : 2-3 secondes
   • Mix : 20-30%

Ce son vous donnera l'ambiance blues parfaite pour votre progression !`,
        },
      ],
    },
    rewards: {
      xp: 180,
      badges: ['blues-master'],
    },
  },

  // Tutoriels pour apprendre les accords
  {
    id: 'chords-001',
    title: 'Les accords majeurs essentiels',
    description: 'Maîtrisez les accords majeurs de base : C, D, E, G, A avec des diagrammes interactifs.',
    category: 'basics',
    difficulty: 'beginner',
    duration: 20,
    type: 'tutorial',
    icon: 'Music',
    tags: ['accords', 'majeurs', 'débutant'],
    content: {
      steps: [
        {
          id: 'step-1',
          title: 'Introduction aux accords majeurs',
          description: `Les accords majeurs sont la base de la musique occidentale. Ils ont un son joyeux et ouvert.

Les 5 accords majeurs essentiels que vous devez connaître :
• C (Do majeur)
• D (Ré majeur)
• E (Mi majeur)
• G (Sol majeur)
• A (La majeur)

Ces 5 accords vous permettront de jouer des milliers de chansons !`,
        },
        {
          id: 'step-2',
          title: 'Accord de Do majeur (C)',
          description: `[chord:C]

L'accord de C est souvent le premier accord appris par les guitaristes.

Position des doigts :
• Corde A (5ème) : Case 3 avec l'annulaire (doigt 3)
• Corde D (4ème) : Case 2 avec le majeur (doigt 2)
• Corde B (2ème) : Case 1 avec l'index (doigt 1)
• Corde E aigu (1ère) : À vide (O)

Ne jouez PAS les cordes E grave (6ème) et G (3ème).

Astuce : Assurez-vous que chaque note sonne clairement avant de passer à l'accord suivant.`,
        },
        {
          id: 'step-3',
          title: 'Accord de Ré majeur (D)',
          description: `[chord:D]

L'accord de D est compact et sonne brillant.

Position des doigts :
• Corde D (4ème) : À vide (O)
• Corde G (3ème) : Case 2 avec le majeur (doigt 2)
• Corde B (2ème) : Case 3 avec l'annulaire (doigt 3)
• Corde E aigu (1ère) : Case 2 avec l'index (doigt 1)

Ne jouez PAS les cordes E grave (6ème) et A (5ème).

Astuce : Formez un triangle avec vos doigts pour faciliter la position.`,
        },
        {
          id: 'step-4',
          title: 'Accord de Mi majeur (E)',
          description: `[chord:E]

L'accord de E est puissant et ouvert.

Position des doigts :
• Corde E grave (6ème) : À vide (O)
• Corde A (5ème) : À vide (O)
• Corde D (4ème) : Case 2 avec le majeur (doigt 2)
• Corde G (3ème) : Case 1 avec l'index (doigt 1)
• Corde B (2ème) : Case 0 (à vide)
• Corde E aigu (1ère) : À vide (O)

Astuce : C'est un accord facile car il utilise beaucoup de cordes à vide.`,
        },
        {
          id: 'step-5',
          title: 'Accord de Sol majeur (G)',
          description: `[chord:G]

L'accord de G est plein et résonnant.

Position des doigts :
• Corde E grave (6ème) : Case 3 avec l'annulaire (doigt 3)
• Corde A (5ème) : À vide (O)
• Corde D (4ème) : À vide (O)
• Corde G (3ème) : À vide (O)
• Corde B (2ème) : Case 0 (à vide)
• Corde E aigu (1ère) : Case 3 avec l'auriculaire (doigt 4)

Astuce : Il existe plusieurs façons de jouer G. Celle-ci utilise 4 doigts.`,
        },
        {
          id: 'step-6',
          title: 'Accord de La majeur (A)',
          description: `[chord:A]

L'accord de A est brillant et percutant.

Position des doigts :
• Corde A (5ème) : À vide (O)
• Corde D (4ème) : Case 2 avec le majeur (doigt 2)
• Corde G (3ème) : Case 2 avec l'annulaire (doigt 3)
• Corde B (2ème) : Case 2 avec l'index (doigt 1)
• Corde E aigu (1ère) : À vide (O)

Ne jouez PAS la corde E grave (6ème).

Astuce : Tous les doigts sont sur la case 2, formez un "barre" avec votre index.`,
        },
        {
          id: 'step-7',
          title: 'Pratiquer les transitions',
          description: `Pour bien jouer des chansons, vous devez maîtriser les transitions entre accords :

1. Pratiquez chaque transition séparément
   • C → G
   • G → D
   • D → A
   • A → E
   • E → C

2. Utilisez un métronome
   • Commencez à 60 BPM
   • Changez d'accord à chaque battement
   • Augmentez progressivement la vitesse

3. Pratiquez la progression classique
   • C - G - Am - F (progression pop classique)
   • G - D - Em - C (progression en G)

4. Ne vous découragez pas
   • Les transitions deviennent naturelles avec la pratique
   • Concentrez-vous sur la précision, pas la vitesse`,
        },
      ],
    },
    rewards: {
      xp: 200,
      badges: ['maitre-accords-majeurs'],
    },
  },
  {
    id: 'chords-002',
    title: 'Les accords mineurs essentiels',
    description: 'Apprenez les accords mineurs de base : Am, Dm, Em avec des diagrammes interactifs.',
    category: 'basics',
    difficulty: 'beginner',
    duration: 15,
    type: 'tutorial',
    icon: 'Music',
    tags: ['accords', 'mineurs', 'débutant'],
    content: {
      steps: [
        {
          id: 'step-1',
          title: 'Introduction aux accords mineurs',
          description: `Les accords mineurs ont un son mélancolique et émotionnel. Ils sont essentiels pour créer de la variété dans vos progressions.

Les 3 accords mineurs essentiels :
• Am (La mineur)
• Dm (Ré mineur)
• Em (Mi mineur)

Ces accords complètent parfaitement les accords majeurs pour créer des progressions riches.`,
        },
        {
          id: 'step-2',
          title: 'Accord de La mineur (Am)',
          description: `[chord:Am]

L'accord de Am est très facile et très utilisé.

Position des doigts :
• Corde A (5ème) : À vide (O)
• Corde D (4ème) : Case 2 avec le majeur (doigt 2)
• Corde G (3ème) : Case 2 avec l'annulaire (doigt 3)
• Corde B (2ème) : Case 1 avec l'index (doigt 1)
• Corde E aigu (1ère) : À vide (O)

Ne jouez PAS la corde E grave (6ème).

Astuce : C'est presque identique à l'accord de C, mais décalé d'une corde !`,
        },
        {
          id: 'step-3',
          title: 'Accord de Ré mineur (Dm)',
          description: `[chord:Dm]

L'accord de Dm est similaire à D mais avec une note différente.

Position des doigts :
• Corde D (4ème) : À vide (O)
• Corde G (3ème) : Case 2 avec le majeur (doigt 2)
• Corde B (2ème) : Case 3 avec l'annulaire (doigt 3)
• Corde E aigu (1ère) : Case 1 avec l'index (doigt 1)

Ne jouez PAS les cordes E grave (6ème) et A (5ème).

Astuce : Comparez avec l'accord de D majeur pour voir la différence.`,
        },
        {
          id: 'step-4',
          title: 'Accord de Mi mineur (Em)',
          description: `[chord:Em]

L'accord de Em est le plus facile de tous !

Position des doigts :
• Corde E grave (6ème) : À vide (O)
• Corde A (5ème) : À vide (O)
• Corde D (4ème) : Case 2 avec le majeur (doigt 2)
• Corde G (3ème) : Case 2 avec l'annulaire (doigt 3)
• Corde B (2ème) : À vide (O)
• Corde E aigu (1ère) : À vide (O)

Astuce : Seulement 2 doigts ! C'est l'accord parfait pour débuter.`,
        },
        {
          id: 'step-5',
          title: 'Progressions avec accords mineurs',
          description: `Les accords mineurs s'intègrent parfaitement dans les progressions :

1. Progression classique mineure
   • Am - Dm - G - C
   • Em - Am - D - G

2. Progression pop moderne
   • Am - F - C - G (vi-IV-I-V en La mineur)
   • Em - C - G - D (vi-IV-I-V en Mi mineur)

3. Progression blues
   • Am - Dm - E (i-iv-V en La mineur)

4. Pratiquez avec un métronome
   • Commencez lentement
   • Assurez-vous que chaque accord sonne clairement
   • Augmentez progressivement la vitesse`,
        },
      ],
    },
    rewards: {
      xp: 150,
      badges: ['maitre-accords-mineurs'],
    },
  },

  // Tutoriels pour apprendre des morceaux
  {
    id: 'song-001',
    title: 'Apprendre "Wonderwall" - Oasis',
    description: 'Apprenez à jouer ce classique d\'Oasis avec tablatures et informations sur l\'artiste.',
    category: 'styles',
    difficulty: 'beginner',
    duration: 30,
    type: 'tutorial',
    icon: 'Music',
    tags: ['chanson', 'oasis', 'rock', 'débutant'],
    content: {
      steps: [
        {
          id: 'step-1',
          title: 'Découvrir "Wonderwall"',
          description: `"Wonderwall" est l'un des plus grands succès d'Oasis, sorti en 1995 sur l'album "(What's the Story) Morning Glory?".

Cette chanson est parfaite pour débuter car elle utilise seulement 4 accords simples dans une progression répétitive.

[tablature:wonderwall-001]

Voici la tablature complète de la progression principale. Vous pouvez voir les 4 accords utilisés :
• Em (Mi mineur)
• G (Sol majeur)  
• D (Ré majeur)
• A7sus4 (La 7ème suspendue 4)

[artist:Oasis]

Oasis est un groupe de rock britannique formé en 1991. Leur son caractéristique combine guitares acoustiques et électriques avec des riffs simples mais efficaces, créant une ambiance mélancolique et nostalgique.`,
        },
        {
          id: 'step-2',
          title: 'Les accords de "Wonderwall"',
          description: `"Wonderwall" utilise seulement 4 accords dans une progression répétitive :

Progression principale :
• Em (Mi mineur)
• G (Sol majeur)
• D (Ré majeur)
• A7sus4 (La 7ème suspendue 4)

[chord:Em]
[chord:G]
[chord:D]

Ces accords sont tous des accords de base que vous connaissez déjà !`,
        },
        {
          id: 'step-3',
          title: 'Le rythme de strumming',
          description: `Le pattern de strumming de "Wonderwall" est caractéristique :

Pattern de base :
↓ ↓ ↑ ↑ ↓ ↑
(1  2  3  4)

• Commencez par un downstroke sur le premier temps
• Ajoutez un upstroke léger sur le "et" du deuxième temps
• Continuez avec ce pattern régulier

Astuce : Écoutez la chanson originale pour bien sentir le rythme.`,
        },
        {
          id: 'step-4',
          title: 'La progression complète',
          description: `Voici la progression complète de "Wonderwall" :

Verse (Couplet) :
Em | G | D | A7sus4
Em | G | D | A7sus4

Chorus (Refrain) :
Em | G | D | A7sus4
Em | G | D | A7sus4

[tablature:wonderwall-001]

La progression est la même pour le couplet et le refrain, ce qui rend la chanson facile à apprendre !

Pratiquez chaque section séparément avant de les assembler. Commencez lentement avec un métronome à 60 BPM, puis augmentez progressivement jusqu'à 88 BPM (le tempo original).`,
        },
        {
          id: 'step-5',
          title: 'Créer le son Oasis dans WebAmp',
          description: `Pour recréer le son d'Oasis dans WebAmp :

Ampli : Vox AC30
• Gain : 4-5 (son clean légèrement saturé)
• Bass : 5-6
• Middle : 6-7
• Treble : 5-6

Effets :
1. Reverb légère
   • Size : Moyen
   • Decay : 2-3 secondes
   • Mix : 25-35%

2. Delay subtil (pour les parties lead)
   • Time : 300-400ms
   • Feedback : 20-30%
   • Mix : 15-25%

Ce son vous donnera l'ambiance caractéristique d'Oasis !`,
        },
      ],
    },
    rewards: {
      xp: 250,
      badges: ['maitre-wonderwall'],
    },
  },
  {
    id: 'song-002',
    title: 'Apprendre "Stairway to Heaven" - Led Zeppelin',
    description: 'Apprenez l\'intro légendaire de Led Zeppelin avec tablatures et informations sur l\'artiste.',
    category: 'styles',
    difficulty: 'intermediate',
    duration: 45,
    type: 'tutorial',
    icon: 'Music',
    tags: ['chanson', 'led zeppelin', 'rock', 'fingerpicking'],
    content: {
      steps: [
        {
          id: 'step-1',
          title: 'Découvrir Led Zeppelin',
          description: `Découvrons l'un des plus grands groupes de rock de tous les temps.

[artist:Led Zeppelin]

Led Zeppelin est un groupe de rock britannique formé en 1968. "Stairway to Heaven" est leur chanson la plus emblématique, sortie en 1971 sur l'album "Led Zeppelin IV".

Le style de Jimmy Page :
• Fingerpicking complexe
• Harmonies riches
• Transitions fluides entre sections
• Utilisation créative des effets`,
        },
        {
          id: 'step-2',
          title: 'L\'intro au fingerpicking',
          description: `L'intro de "Stairway to Heaven" est jouée au fingerpicking (pouces et doigts).

Technique de base :
• Pouce (P) : Corde E grave (6ème) et A (5ème)
• Index (i) : Corde G (3ème)
• Majeur (m) : Corde B (2ème)
• Annulaire (a) : Corde E aigu (1ère)

Pattern de base :
P - i - m - a - m - i

Pratiquez ce pattern lentement avant d'ajouter les notes.`,
        },
        {
          id: 'step-3',
          title: 'Les accords de l\'intro',
          description: `L'intro utilise une progression d'accords en Am :

[chord:Am]

Progression :
Am | Am | Am | Am
C | C | D | D
F | F | G | G

Ces accords créent une progression ascendante caractéristique.

Astuce : Jouez chaque accord avec le pattern de fingerpicking.`,
        },
        {
          id: 'step-4',
          title: 'La mélodie principale',
          description: `La mélodie principale suit la progression d'accords :

[tablature:example-001]

Points importants :
• La mélodie est jouée sur les cordes aiguës (B et E)
• Les basses (E grave, A) suivent la progression d'accords
• Le rythme est fluide et régulier

Pratiquez la mélodie seule d'abord, puis ajoutez les basses.`,
        },
        {
          id: 'step-5',
          title: 'Créer le son Led Zeppelin dans WebAmp',
          description: `Pour recréer le son de Jimmy Page dans WebAmp :

Ampli : Marshall Plexi
• Gain : 3-4 (son clean pour l'intro)
• Bass : 6-7
• Middle : 7-8 (boosté)
• Treble : 6-7

Effets :
1. Delay
   • Time : 400-500ms
   • Feedback : 30-40%
   • Mix : 25-35%

2. Reverb
   • Size : Grand
   • Decay : 3-4 secondes
   • Mix : 30-40%

3. Chorus léger (pour les parties lead)
   • Rate : 1-2 Hz
   • Depth : 30-40%
   • Mix : 20-30%

Ce son vous donnera l'ambiance épique de Led Zeppelin !`,
        },
      ],
    },
    rewards: {
      xp: 300,
      badges: ['maitre-stairway'],
    },
  },
  {
    id: 'song-003',
    title: 'Apprendre "Sweet Child O\' Mine" - Guns N\' Roses',
    description: 'Apprenez le riff légendaire de Slash avec tablatures et informations sur l\'artiste.',
    category: 'styles',
    difficulty: 'intermediate',
    duration: 40,
    type: 'tutorial',
    icon: 'Music',
    tags: ['chanson', 'guns n roses', 'rock', 'riff'],
    content: {
      steps: [
        {
          id: 'step-1',
          title: 'Découvrir Guns N\' Roses',
          description: `Découvrons l'un des groupes de hard rock les plus influents.

[artist:Guns N' Roses]

Guns N' Roses est un groupe de hard rock américain formé en 1985. "Sweet Child O' Mine" est leur chanson la plus célèbre, sortie en 1987 sur l'album "Appetite for Destruction".

Le style de Slash :
• Riffs mélodiques et reconnaissables
• Solos expressifs avec beaucoup de bends
• Utilisation créative du wah-wah
• Son Marshall caractéristique`,
        },
        {
          id: 'step-2',
          title: 'Le riff principal',
          description: `Le riff de "Sweet Child O' Mine" est l'un des plus reconnaissables au monde.

[tablature:example-001]

Le riff utilise :
• Des notes sur les cordes aiguës (B et E)
• Des slides et des bends
• Un rythme syncopé caractéristique

Pratiquez très lentement d'abord, note par note.`,
        },
        {
          id: 'step-3',
          title: 'Les techniques utilisées',
          description: `Le riff utilise plusieurs techniques avancées :

1. Slides (glissés)
   • Glissez d'une note à l'autre sans relever le doigt
   • Crée un son fluide et connecté

2. Bends (tirés de corde)
   • Tirez la corde vers le haut ou le bas
   • Change la hauteur de la note
   • Donne de l'expression au jeu

3. Hammer-ons et Pull-offs
   • Hammer-on : Frappez une note sans pincer
   • Pull-off : Retirez un doigt en pinçant la corde
   • Crée des notes rapides et fluides

Pratiquez chaque technique séparément avant de les combiner.`,
        },
        {
          id: 'step-4',
          title: 'La progression d\'accords',
          description: `Sous le riff, la progression d'accords est :

[chord:D]
[chord:C]
[chord:G]

Progression :
D | C | G | D
D | C | G | D

Ces accords simples soutiennent le riff complexe.

Astuce : Jouez les accords en arrière-plan pendant que vous pratiquez le riff.`,
        },
        {
          id: 'step-5',
          title: 'Créer le son Guns N\' Roses dans WebAmp',
          description: `Pour recréer le son de Slash dans WebAmp :

Ampli : Marshall JCM800
• Gain : 6-7 (son saturé caractéristique)
• Bass : 6-7
• Middle : 7-8 (boosté)
• Treble : 6-7

Effets :
1. Wah-Wah
   • Position : Variée selon la partie
   • Rate : Contrôlé manuellement
   • Mix : 100% (effet complet)

2. Delay
   • Time : 300-400ms
   • Feedback : 25-35%
   • Mix : 20-30%

3. Reverb
   • Size : Moyen-Grand
   • Decay : 2-3 secondes
   • Mix : 25-35%

Ce son vous donnera le caractère puissant de Guns N' Roses !`,
        },
      ],
    },
    rewards: {
      xp: 300,
      badges: ['maitre-sweet-child'],
    },
  },
  
  // Nouveaux tutoriels - Débutant
  {
    id: 'tut-005',
    title: 'Les bases du rythme',
    description: 'Apprenez les fondamentaux du rythme à la guitare avec des exercices pratiques.',
    category: 'basics',
    difficulty: 'beginner',
    duration: 10,
    type: 'tutorial',
    icon: 'Music',
    tags: ['rythme', 'bases', 'exercices'],
    content: {
      steps: [
        {
          id: 'step-1',
          title: 'Comprendre le tempo',
          description: `Le tempo est la vitesse à laquelle la musique est jouée, mesurée en BPM (battements par minute).

• 60 BPM = lent (ballade)
• 120 BPM = modéré (rock classique)
• 180+ BPM = rapide (metal)

Utilisez le métronome intégré de WebAmp pour pratiquer à différents tempos.`,
        },
        {
          id: 'step-2',
          title: 'Les notes de base',
          description: `Les notes de base en musique :
• Noire (1 temps) : ♩
• Blanche (2 temps) : ♪
• Croche (1/2 temps) : ♫
• Double croche (1/4 temps) : ♬

Commencez par jouer des noires sur chaque temps du métronome.`,
        },
        {
          id: 'step-3',
          title: 'Patterns de strumming simples',
          description: `Pattern de base pour débutant :
↓ ↓ ↓ ↓
(1  2  3  4)

Jouez un downstroke sur chaque temps. Une fois à l'aise, ajoutez des upstrokes :
↓ ↑ ↓ ↑
(1 & 2 &)`,
        },
      ],
    },
    rewards: {
      xp: 50,
    },
  },
  {
    id: 'tut-006',
    title: 'Premiers accords ouverts',
    description: 'Maîtrisez les accords de base : Mi majeur, La majeur, Ré majeur.',
    category: 'basics',
    difficulty: 'beginner',
    duration: 15,
    type: 'tutorial',
    icon: 'Music',
    tags: ['accords', 'bases', 'débutant'],
    content: {
      steps: [
        {
          id: 'step-1',
          title: 'L\'accord Mi majeur (E)',
          description: `[chord:E]

Position des doigts :
• Index : 1ère case, corde G (3ème)
• Majeur : 2ème case, corde A (5ème)
• Annulaire : 2ème case, corde D (4ème)

Les cordes E grave et E aigu sont jouées à vide.`,
        },
        {
          id: 'step-2',
          title: 'L\'accord La majeur (A)',
          description: `[chord:A]

Position des doigts :
• Index : 2ème case, corde D (4ème)
• Majeur : 2ème case, corde G (3ème)
• Annulaire : 2ème case, corde B (2ème)

La corde E grave n'est pas jouée.`,
        },
        {
          id: 'step-3',
          title: 'L\'accord Ré majeur (D)',
          description: `[chord:D]

Position des doigts :
• Index : 2ème case, corde G (3ème)
• Majeur : 2ème case, corde E (1ère)
• Annulaire : 3ème case, corde B (2ème)

Les cordes E grave et A ne sont pas jouées.`,
        },
        {
          id: 'step-4',
          title: 'Pratiquer la transition',
          description: `Exercice de transition :
1. Jouez E pendant 4 temps
2. Transition vers A
3. Jouez A pendant 4 temps
4. Transition vers D
5. Répétez

Astuce : Gardez vos doigts près des cordes pour des transitions plus rapides.`,
        },
      ],
    },
    rewards: {
      xp: 75,
    },
  },
  {
    id: 'guide-011',
    title: 'Guide du Noise Gate',
    description: 'Apprenez à utiliser un noise gate pour éliminer les bruits indésirables.',
    category: 'effects',
    difficulty: 'beginner',
    duration: 8,
    type: 'tutorial',
    icon: 'Zap',
    tags: ['noise gate', 'nettoyage', 'bruit'],
    content: {
      steps: [
        {
          id: 'step-1',
          title: 'Qu\'est-ce qu\'un Noise Gate ?',
          description: `Un noise gate (porte de bruit) coupe automatiquement le signal lorsqu'il est en dessous d'un certain seuil.

Utile pour :
• Éliminer le bruit de fond
• Réduire les sifflements (hiss)
• Nettoyer les pauses dans votre jeu`,
        },
        {
          id: 'step-2',
          title: 'Les paramètres',
          description: `• Threshold : Le niveau au-dessous duquel le gate se ferme
• Attack : La vitesse d'ouverture du gate
• Release : La vitesse de fermeture du gate
• Ratio : L'intensité de la réduction`,
        },
        {
          id: 'step-3',
          title: 'Réglage optimal',
          description: `1. Réglez le Threshold juste au-dessus du niveau de bruit
2. Attack rapide (1-5ms) pour une réponse immédiate
3. Release modéré (50-200ms) pour un son naturel
4. Testez en jouant et en vous arrêtant`,
        },
      ],
    },
    rewards: {
      xp: 60,
    },
  },
  {
    id: 'preset-003',
    title: 'Son Clean Jazz',
    description: 'Créez un son clean et chaleureux pour le jazz.',
    category: 'styles',
    difficulty: 'beginner',
    duration: 5,
    type: 'preset',
    icon: 'Music',
    tags: ['jazz', 'clean', 'preset'],
    content: {
      presetId: 'jazz-clean',
    },
    rewards: {
      xp: 40,
    },
  },
  
  // Nouveaux tutoriels - Intermédiaire
  {
    id: 'guide-012',
    title: 'Maîtriser l\'Octaver',
    description: 'Découvrez comment utiliser un octaver pour créer des sons profonds et puissants.',
    category: 'effects',
    difficulty: 'intermediate',
    duration: 12,
    type: 'tutorial',
    icon: 'Zap',
    tags: ['octaver', 'pitch', 'effets'],
    content: {
      steps: [
        {
          id: 'step-1',
          title: 'Qu\'est-ce qu\'un Octaver ?',
          description: `Un octaver ajoute une ou plusieurs octaves au-dessus ou en dessous de votre signal original.

Types :
• Octave down (-1 octave) : Son plus grave
• Octave up (+1 octave) : Son plus aigu
• Sub-octave : Double octave en dessous`,
        },
        {
          id: 'step-2',
          title: 'Applications musicales',
          description: `• Basse synthétique : Pour simuler une basse
• Son épais : Pour donner plus de corps aux riffs
• Effets créatifs : Pour des textures uniques`,
        },
        {
          id: 'step-3',
          title: 'Où placer l\'Octaver ?',
          description: `Placez l'octaver AVANT la distorsion pour :
• Un tracking plus précis
• Un son plus naturel
• Moins d'artefacts

Placez-le APRÈS pour des effets plus créatifs mais moins précis.`,
        },
      ],
    },
    rewards: {
      xp: 80,
    },
  },
  {
    id: 'tech-004',
    title: 'Techniques de palm muting',
    description: 'Maîtrisez le palm muting pour des riffs plus percussifs et définis.',
    category: 'techniques',
    difficulty: 'intermediate',
    duration: 15,
    type: 'tutorial',
    icon: 'Target',
    tags: ['palm muting', 'technique', 'rythme'],
    content: {
      steps: [
        {
          id: 'step-1',
          title: 'Qu\'est-ce que le Palm Muting ?',
          description: `Le palm muting consiste à poser légèrement le bord de la paume de votre main droite sur les cordes près du chevalet.

Cela crée un son étouffé et percussif, caractéristique du metal et du rock moderne.`,
        },
        {
          id: 'step-2',
          title: 'Position de la main',
          description: `1. Placez le bord de votre paume (côté petit doigt) sur les cordes
2. Position : juste avant le chevalet
3. Pression : légère, juste assez pour étouffer
4. Ajustez selon le son désiré`,
        },
        {
          id: 'step-3',
          title: 'Applications',
          description: `• Riffs de metal : Pour des riffs puissants et définis
• Accompagnement : Pour donner du rythme sans masquer
• Transitions : Pour créer de la dynamique dans vos morceaux`,
        },
      ],
    },
    rewards: {
      xp: 90,
    },
  },
  {
    id: 'chain-004',
    title: 'Chaîne pour le fingerpicking',
    description: 'Créez une chaîne optimale pour le fingerpicking acoustique et électrique.',
    category: 'chains',
    difficulty: 'intermediate',
    duration: 12,
    type: 'tutorial',
    icon: 'Layers',
    tags: ['fingerpicking', 'chaîne', 'acoustique'],
    content: {
      steps: [
        {
          id: 'step-1',
          title: 'Les besoins du fingerpicking',
          description: `Le fingerpicking nécessite :
• Clarté : Chaque note doit être distincte
• Dynamique : Respecter les nuances
• Espace : Laisser respirer le son`,
        },
        {
          id: 'step-2',
          title: 'Chaîne recommandée',
          description: `1. Compression légère (optionnel)
   → Ajoute du sustain sans masquer
2. EQ
   → Boost des médiums pour la clarté
3. Reverb légère
   → Ajoute de l'espace sans noyer
4. Delay subtil (optionnel)
   → Pour les parties mélodiques`,
        },
      ],
    },
    rewards: {
      xp: 85,
    },
  },
  {
    id: 'style-004',
    title: 'Son Funk Classique',
    description: 'Recreatez le son funk des années 70 avec une chaîne optimisée.',
    category: 'styles',
    difficulty: 'intermediate',
    duration: 18,
    type: 'tutorial',
    icon: 'Music',
    tags: ['funk', 'années 70', 'rythme'],
    content: {
      steps: [
        {
          id: 'step-1',
          title: 'Caractéristiques du son funk',
          description: `Le funk se caractérise par :
• Son clean et percussif
• Beaucoup de groove et de rythme
• Utilisation créative des effets
• Clarté avant tout`,
        },
        {
          id: 'step-2',
          title: 'Configuration',
          description: `Ampli : Fender Clean
• Gain : 2-3 (très clean)
• Bass : 5-6
• Middle : 7-8 (boosté)
• Treble : 6-7

Effets :
1. Compression
   → Ajoute du punch
2. Wah-Wah
   → Essentiel pour le funk
3. Chorus léger
   → Pour la largeur stéréo`,
        },
      ],
    },
    rewards: {
      xp: 100,
    },
  },
  {
    id: 'amp-003',
    title: 'Comparaison Fender vs Marshall',
    description: 'Comprenez les différences fondamentales entre ces deux légendes.',
    category: 'amps',
    difficulty: 'intermediate',
    duration: 20,
    type: 'tutorial',
    icon: 'Radio',
    tags: ['fender', 'marshall', 'comparaison'],
    content: {
      steps: [
        {
          id: 'step-1',
          title: 'Fender : Clarté et cristal',
          description: `Caractéristiques Fender :
• Son clean exceptionnel
• Médiums équilibrés
• Idéal pour : Blues, Country, Pop
• Artistes : Stevie Ray Vaughan, Eric Clapton`,
        },
        {
          id: 'step-2',
          title: 'Marshall : Chaleur et saturation',
          description: `Caractéristiques Marshall :
• Son chaud et saturé
• Médiums boostés
• Idéal pour : Rock, Hard Rock
• Artistes : Jimi Hendrix, Slash`,
        },
        {
          id: 'step-3',
          title: 'Quand utiliser chacun ?',
          description: `Choisissez Fender pour :
• Son clean
• Blues et country
• Clarté maximale

Choisissez Marshall pour :
• Son saturé
• Rock et hard rock
• Présence dans le mix`,
        },
      ],
    },
    rewards: {
      xp: 95,
    },
  },
  
  // Nouveaux tutoriels - Avancé
  {
    id: 'guide-013',
    title: 'Techniques avancées de Delay',
    description: 'Maîtrisez les techniques professionnelles de delay : ping-pong, dotted notes, etc.',
    category: 'effects',
    difficulty: 'advanced',
    duration: 25,
    type: 'tutorial',
    icon: 'Zap',
    tags: ['delay', 'avancé', 'techniques'],
    content: {
      steps: [
        {
          id: 'step-1',
          title: 'Delay Ping-Pong',
          description: `Le delay ping-pong alterne entre les canaux gauche et droit.

Réglages :
• Time : 300-500ms
• Feedback : 40-60%
• Mix : 30-40%

Crée un effet stéréo immersif.`,
        },
        {
          id: 'step-2',
          title: 'Dotted Notes',
          description: `Les dotted notes utilisent des délais à 1.5x ou 2x le tempo.

Exemple : Si le tempo est 120 BPM
• 1/4 note delay : 500ms
• Dotted 1/8 : 375ms (1.5x)
• 1/8 note delay : 250ms

Synchronisez avec le tempo de votre morceau.`,
        },
        {
          id: 'step-3',
          title: 'Delay en série',
          description: `Utilisez plusieurs delays en série pour des effets complexes :
1. Delay court (100-200ms) : Doublage
2. Delay moyen (300-500ms) : Écho principal
3. Delay long (800ms+) : Ambiance

Ajustez les niveaux pour créer de la profondeur.`,
        },
      ],
    },
    rewards: {
      xp: 150,
    },
  },
  {
    id: 'tech-005',
    title: 'Sweep picking avancé',
    description: 'Maîtrisez la technique du sweep picking pour des arpèges rapides et fluides.',
    category: 'techniques',
    difficulty: 'advanced',
    duration: 30,
    type: 'tutorial',
    icon: 'Target',
    tags: ['sweep picking', 'technique', 'avancé'],
    content: {
      steps: [
        {
          id: 'step-1',
          title: 'Les bases du Sweep Picking',
          description: `Le sweep picking consiste à balayer les cordes dans un mouvement fluide, une corde à la fois.

Différence avec le strumming :
• Strumming : Toutes les cordes résonnent
• Sweep : Une seule corde à la fois résonne`,
        },
        {
          id: 'step-2',
          title: 'Technique de la main droite',
          description: `1. Mouvement fluide et continu
2. Mutez chaque note avant de passer à la suivante
3. Utilisez un médiator incliné pour un son plus doux
4. Commencez très lentement`,
        },
        {
          id: 'step-3',
          title: 'Arpèges de base',
          description: `Commencez par des arpèges simples :
• Am : 5-7-5-7-5-7 (cordes 6-5-4-3-2-1)
• Em : 0-0-0-9-9-9
• C : 8-7-5-5-5-8

Pratiquez chaque arpège séparément avant de les enchaîner.`,
        },
      ],
    },
    rewards: {
      xp: 200,
    },
  },
  {
    id: 'crea-002',
    title: 'Créer des textures ambiantes',
    description: 'Utilisez les effets pour créer des paysages sonores ambiants et atmosphériques.',
    category: 'creativity',
    difficulty: 'advanced',
    duration: 20,
    type: 'tutorial',
    icon: 'Sparkles',
    tags: ['ambient', 'créativité', 'textures'],
    content: {
      steps: [
        {
          id: 'step-1',
          title: 'Les éléments de l\'ambient',
          description: `L'ambient nécessite :
• Reverb très présente
• Delay avec beaucoup de feedback
• Modulation subtile
• Volume et sustain`,
        },
        {
          id: 'step-2',
          title: 'Chaîne recommandée',
          description: `1. Compression
   → Ajoute du sustain
2. Delay long (800ms+)
   → Feedback élevé (60-80%)
3. Reverb grande taille
   → Decay long (4-6 secondes)
4. Chorus ou Flanger subtil
   → Pour le mouvement`,
        },
        {
          id: 'step-3',
          title: 'Techniques de jeu',
          description: `• Utilisez des notes longues
• Laissez les effets résonner
• Jouez avec l'espace et le silence
• Expérimentez avec les harmoniques`,
        },
      ],
    },
    rewards: {
      xp: 180,
    },
  },
  {
    id: 'chain-005',
    title: 'Chaîne pour le shoegaze',
    description: 'Créez le son caractéristique du shoegaze avec des effets en cascade.',
    category: 'chains',
    difficulty: 'advanced',
    duration: 22,
    type: 'tutorial',
    icon: 'Layers',
    tags: ['shoegaze', 'chaîne', 'effets'],
    content: {
      steps: [
        {
          id: 'step-1',
          title: 'Caractéristiques du shoegaze',
          description: `Le shoegaze se caractérise par :
• Beaucoup de reverb et delay
• Distorsion modérée
• Textures denses
• Son "noyé" dans les effets`,
        },
        {
          id: 'step-2',
          title: 'Chaîne shoegaze',
          description: `1. Distortion/Overdrive modérée
2. Reverb avant la distorsion (reverse reverb)
3. Delay avec feedback élevé
4. Reverb après la distorsion
5. Chorus ou Flanger pour le mouvement`,
        },
      ],
    },
    rewards: {
      xp: 175,
    },
  },
  
  // Nouveaux tutoriels - Pro
  {
    id: 'pro-001',
    title: 'Mixage professionnel de guitare',
    description: 'Techniques avancées de mixage pour intégrer la guitare dans un mix professionnel.',
    category: 'techniques',
    difficulty: 'pro',
    duration: 35,
    type: 'tutorial',
    icon: 'Target',
    tags: ['mixage', 'pro', 'studio'],
    content: {
      steps: [
        {
          id: 'step-1',
          title: 'Égalisation dans le mix',
          description: `Dans un mix professionnel :
• Coupez les fréquences inutiles (HPF à 80-100Hz)
• Réduisez les fréquences qui entrent en conflit avec la basse (200-400Hz)
• Boostez la présence (2-4kHz) pour la clarté
• Contrôlez les aigus (8kHz+) pour éviter la dureté`,
        },
        {
          id: 'step-2',
          title: 'Compression multi-bandes',
          description: `Utilisez une compression différente selon les fréquences :
• Basses : Compression modérée pour la stabilité
• Médiums : Compression légère pour la présence
• Aigus : Compression minimale pour la transparence`,
        },
        {
          id: 'step-3',
          title: 'Double tracking',
          description: `Enregistrez la même partie deux fois et pannez :
• Piste 1 : Pan gauche (-30 à -50)
• Piste 2 : Pan droit (+30 à +50)

Cela crée une largeur stéréo naturelle.`,
        },
      ],
    },
    rewards: {
      xp: 300,
      badges: ['mixeur-pro'],
    },
  },
  {
    id: 'pro-002',
    title: 'Modélisation d\'amplis avancée',
    description: 'Techniques professionnelles pour modéliser précisément des amplis réels.',
    category: 'amps',
    difficulty: 'pro',
    duration: 40,
    type: 'tutorial',
    icon: 'Radio',
    tags: ['modélisation', 'pro', 'amplis'],
    content: {
      steps: [
        {
          id: 'step-1',
          title: 'Analyse de la réponse fréquentielle',
          description: `Pour modéliser un ampli :
1. Enregistrez la réponse impulsionnelle (IR)
2. Analysez la courbe de réponse fréquentielle
3. Identifiez les caractéristiques uniques
4. Répliquez dans WebAmp avec l'EQ`,
        },
        {
          id: 'step-2',
          title: 'Saturation et distorsion',
          description: `Caractéristiques à reproduire :
• Point de saturation (gain sweet spot)
• Courbe de distorsion harmonique
• Compression naturelle de l'ampli
• Réponse dynamique`,
        },
        {
          id: 'step-3',
          title: 'Cabinet et micro',
          description: `L'IR du cabinet est cruciale :
• Position du micro (on-axis vs off-axis)
• Distance du micro
• Type de micro (dynamic, ribbon, condenser)
• Combinaison de plusieurs micros`,
        },
      ],
    },
    rewards: {
      xp: 350,
      badges: ['modélisateur-pro'],
    },
  },
  {
    id: 'pro-003',
    title: 'Chaînes d\'effets pour le live professionnel',
    description: 'Optimisez votre chaîne pour des performances live avec gestion du feedback et de la latence.',
    category: 'chains',
    difficulty: 'pro',
    duration: 30,
    type: 'tutorial',
    icon: 'Layers',
    tags: ['live', 'pro', 'performance'],
    content: {
      steps: [
        {
          id: 'step-1',
          title: 'Gestion de la latence',
          description: `Pour le live, la latence doit être minimale :
• Utilisez le Native Helper pour < 10ms
• Évitez les effets avec beaucoup de traitement
• Privilégiez les effets analogiques modélisés
• Testez en conditions réelles`,
        },
        {
          id: 'step-2',
          title: 'Prévention du feedback',
          description: `Techniques anti-feedback :
• Utilisez un noise gate serré
• Évitez les fréquences résonantes (200-500Hz, 1-2kHz)
• Contrôlez la reverb (moins de reverb = moins de feedback)
• Positionnez-vous correctement par rapport aux monitors`,
        },
        {
          id: 'step-3',
          title: 'Présets par morceau',
          description: `Créez des presets dédiés :
• Un preset par morceau ou section
• Transitions fluides entre presets
• Backup presets en cas de problème
• Testez tous les presets avant le concert`,
        },
      ],
    },
    rewards: {
      xp: 320,
      badges: ['live-pro'],
    },
  },
  {
    id: 'pro-004',
    title: 'Techniques de production moderne',
    description: 'Intégrez la guitare dans des productions modernes avec sidechain, automation, etc.',
    category: 'creativity',
    difficulty: 'pro',
    duration: 35,
    type: 'tutorial',
    icon: 'Sparkles',
    tags: ['production', 'pro', 'moderne'],
    content: {
      steps: [
        {
          id: 'step-1',
          title: 'Sidechain compression',
          description: `Utilisez la compression sidechain pour que la guitare "respire" avec la grosse caisse :

• Trigger : Grosse caisse
• Ratio : 3:1 à 6:1
• Attack : Rapide (1-5ms)
• Release : Moyen (50-100ms)

La guitare se compresse quand la grosse caisse joue.`,
        },
        {
          id: 'step-2',
          title: 'Automation des effets',
          description: `Automatisez les paramètres pour créer du mouvement :
• Delay feedback : Augmente pendant les solos
• Reverb mix : Plus présent dans les breaks
• Wah position : Automatisez pour des effets créatifs
• Distortion gain : Varie selon les sections`,
        },
        {
          id: 'step-3',
          title: 'Layering et stacking',
          description: `Superposez plusieurs prises :
• Piste principale : Son principal
• Piste doublée : Légèrement différente (autre guitare/ampli)
• Piste d'ambiance : Reverb seule, très traitée
• Mixez pour créer de la profondeur`,
        },
      ],
    },
    rewards: {
      xp: 340,
      badges: ['producteur-pro'],
    },
  },
  {
    id: 'pro-005',
    title: 'Analyse spectrale avancée',
    description: 'Utilisez l\'analyse spectrale pour optimiser votre son et identifier les problèmes.',
    category: 'techniques',
    difficulty: 'pro',
    duration: 25,
    type: 'tutorial',
    icon: 'Target',
    tags: ['analyse', 'pro', 'spectre'],
    content: {
      steps: [
        {
          id: 'step-1',
          title: 'Comprendre le spectre',
          description: `Le spectre montre la distribution des fréquences :
• 20-200Hz : Sub-basses et basses
• 200-500Hz : Bas-médiums (corps)
• 500Hz-2kHz : Médiums (présence)
• 2-5kHz : Haut-médiums (clarté)
• 5-20kHz : Aigus (brillance)`,
        },
        {
          id: 'step-2',
          title: 'Identifier les problèmes',
          description: `Problèmes courants visibles sur le spectre :
• Accumulation dans les basses (200-400Hz) : Son boueux
• Pic dans les aigus (3-5kHz) : Son dur
• Manque de présence (2-4kHz) : Son terne
• Excès de sub-basses (< 80Hz) : Masque le mix`,
        },
        {
          id: 'step-3',
          title: 'Corrections ciblées',
          description: `Utilisez l'EQ pour corriger :
• Réduisez les fréquences problématiques
• Boostez les fréquences manquantes
• Utilisez des Q serrés pour des corrections précises
• Comparez avant/après avec le spectre`,
        },
      ],
    },
    rewards: {
      xp: 280,
    },
  },
  {
    id: 'song-004',
    title: 'Apprendre "Black" - Pearl Jam',
    description: 'Maîtrisez cette ballade emblématique avec ses techniques de fingerpicking avancées.',
    category: 'styles',
    difficulty: 'advanced',
    duration: 45,
    type: 'tutorial',
    icon: 'Music',
    tags: ['chanson', 'pearl jam', 'ballade', 'fingerpicking'],
    content: {
      steps: [
        {
          id: 'step-1',
          title: 'Découvrir Pearl Jam',
          description: `[artist:Pearl Jam]

Pearl Jam est un groupe de rock alternatif américain formé en 1990. "Black" est l'une de leurs ballades les plus célèbres, sortie en 1991 sur l'album "Ten".

Le style de Mike McCready :
• Fingerpicking expressif
• Utilisation créative des effets
• Émotion et dynamique`,
        },
        {
          id: 'step-2',
          title: 'Technique de fingerpicking',
          description: `L'intro utilise un pattern de fingerpicking complexe :

Pattern :
P - i - m - a - m - i
(Thumb - Index - Middle - Ring - Middle - Index)

Pratiquez très lentement d'abord.`,
        },
        {
          id: 'step-3',
          title: 'La progression d\'accords',
          description: `Progression principale :
Am | C | D | F
Am | C | E | E

[chord:Am]
[chord:C]
[chord:D]
[chord:F]
[chord:E]`,
        },
        {
          id: 'step-4',
          title: 'Créer le son Pearl Jam dans WebAmp',
          description: `Ampli : Fender Clean
• Gain : 3-4 (son clean)
• Bass : 6-7
• Middle : 7-8
• Treble : 6-7

Effets :
1. Compression légère
2. Delay subtil (300-400ms, 20-30% mix)
3. Reverb moyenne (2-3s decay, 30-40% mix)`,
        },
      ],
    },
    rewards: {
      xp: 250,
      badges: ['maitre-black'],
    },
  },
  {
    id: 'song-005',
    title: 'Apprendre "Smoke on the Water" - Deep Purple',
    description: 'Apprenez le riff le plus célèbre de l\'histoire du rock.',
    category: 'styles',
    difficulty: 'beginner',
    duration: 20,
    type: 'tutorial',
    icon: 'Music',
    tags: ['chanson', 'deep purple', 'rock', 'riff'],
    content: {
      steps: [
        {
          id: 'step-1',
          title: 'Découvrir Deep Purple',
          description: `[artist:Deep Purple]

Deep Purple est un groupe de hard rock britannique formé en 1968. "Smoke on the Water" est leur chanson la plus célèbre, sortie en 1972.

Le riff de Ritchie Blackmore est l'un des plus reconnaissables au monde.`,
        },
        {
          id: 'step-2',
          title: 'Le riff légendaire',
          description: `[tablature:example-001]

Le riff utilise principalement les cordes graves (E, A, D) avec des power chords.

Pattern :
0-3-5 / 0-3-6-5 / 0-3-5 / 3-0

Jouez avec des downstrokes fermes et rythmés.`,
        },
        {
          id: 'step-3',
          title: 'Créer le son Deep Purple dans WebAmp',
          description: `Ampli : Marshall Plexi
• Gain : 7-8 (son saturé)
• Bass : 7-8
• Middle : 6-7
• Treble : 6-7

Effets :
1. Distortion modérée
2. Reverb légère (pour l'ambiance)`,
        },
      ],
    },
    rewards: {
      xp: 150,
      badges: ['maitre-smoke'],
    },
  },
  {
    id: 'quiz-004',
    title: 'Quiz : Techniques avancées',
    description: 'Testez vos connaissances sur les techniques avancées de guitare.',
    category: 'techniques',
    difficulty: 'advanced',
    duration: 10,
    type: 'quiz',
    icon: 'Target',
    tags: ['quiz', 'techniques', 'avancé'],
    content: {
      quiz: [
        {
          id: 'q1',
          question: 'Quelle technique consiste à balayer les cordes une par une dans un mouvement fluide ?',
          options: [
            'Sweep picking',
            'Alternate picking',
            'Economy picking',
            'Hybrid picking',
          ],
          correctAnswer: 0,
          explanation: 'Le sweep picking consiste à balayer les cordes dans un mouvement fluide, une corde à la fois.',
        },
        {
          id: 'q2',
          question: 'Qu\'est-ce que le palm muting ?',
          options: [
            'Muter avec la paume de la main gauche',
            'Muter avec la paume de la main droite près du chevalet',
            'Muter avec les doigts',
            'Ne pas muter du tout',
          ],
          correctAnswer: 1,
          explanation: 'Le palm muting consiste à poser le bord de la paume de la main droite sur les cordes près du chevalet.',
        },
        {
          id: 'q3',
          question: 'Quelle est la différence entre un delay ping-pong et un delay standard ?',
          options: [
            'Le ping-pong alterne entre les canaux stéréo',
            'Le ping-pong est plus rapide',
            'Le ping-pong a plus de feedback',
            'Il n\'y a pas de différence',
          ],
          correctAnswer: 0,
          explanation: 'Le delay ping-pong alterne entre les canaux gauche et droit pour créer un effet stéréo.',
        },
      ],
    },
    rewards: {
      xp: 120,
    },
  },
  {
    id: 'guide-014',
    title: 'Guide complet du Rotary Speaker',
    description: 'Découvrez l\'effet de haut-parleur rotatif et ses applications musicales.',
    category: 'effects',
    difficulty: 'intermediate',
    duration: 15,
    type: 'tutorial',
    icon: 'Zap',
    tags: ['rotary', 'leslie', 'modulation'],
    content: {
      steps: [
        {
          id: 'step-1',
          title: 'Qu\'est-ce qu\'un Rotary Speaker ?',
          description: `Un rotary speaker (ou Leslie) fait tourner physiquement les haut-parleurs pour créer un effet Doppler.

Effets créés :
• Vibrato (modulation de hauteur)
• Tremolo (modulation de volume)
• Chorus naturel`,
        },
        {
          id: 'step-2',
          title: 'Les paramètres',
          description: `• Speed : Vitesse de rotation (Slow/Fast)
• Acceleration : Temps pour changer de vitesse
• Mix : Niveau de l'effet
• Horn/Bass : Contrôle séparé des haut-parleurs`,
        },
        {
          id: 'step-3',
          title: 'Applications musicales',
          description: `• Rock psychédélique : Pour des textures vintage
• Jazz : Pour des solos expressifs
• Blues : Pour de la couleur sonore
• Rock alternatif : Pour des effets créatifs`,
        },
      ],
    },
    rewards: {
      xp: 100,
    },
  },
  {
    id: 'guide-015',
    title: 'Maîtriser le Bitcrusher',
    description: 'Créez des sons lo-fi et rétro avec le bitcrusher.',
    category: 'effects',
    difficulty: 'intermediate',
    duration: 12,
    type: 'tutorial',
    icon: 'Zap',
    tags: ['bitcrusher', 'lo-fi', 'rétro'],
    content: {
      steps: [
        {
          id: 'step-1',
          title: 'Qu\'est-ce qu\'un Bitcrusher ?',
          description: `Un bitcrusher réduit la résolution bit et la fréquence d'échantillonnage du signal.

Effets créés :
• Distorsion numérique
• Son "8-bit" ou "lo-fi"
• Texture granulaire`,
        },
        {
          id: 'step-2',
          title: 'Les paramètres',
          description: `• Bit Depth : Résolution (1-16 bits)
• Sample Rate : Fréquence d'échantillonnage
• Mix : Niveau de l'effet
• Drive : Quantité de distorsion`,
        },
        {
          id: 'step-3',
          title: 'Applications créatives',
          description: `• Musique électronique : Pour des textures uniques
• Rock alternatif : Pour des breaks créatifs
• Lo-fi : Pour un son vintage
• Effets spéciaux : Pour des transitions`,
        },
      ],
    },
    rewards: {
      xp: 90,
    },
  },
  {
    id: 'tech-006',
    title: 'Hybrid picking',
    description: 'Combinez médiator et doigts pour plus de polyphonie et de vitesse.',
    category: 'techniques',
    difficulty: 'advanced',
    duration: 20,
    type: 'tutorial',
    icon: 'Target',
    tags: ['hybrid picking', 'technique', 'polyphonie'],
    content: {
      steps: [
        {
          id: 'step-1',
          title: 'Qu\'est-ce que le Hybrid Picking ?',
          description: `Le hybrid picking combine :
• Médiator : Pour les cordes graves
• Doigts (index, majeur) : Pour les cordes aiguës

Permet de jouer des lignes mélodiques complexes tout en gardant les basses.`,
        },
        {
          id: 'step-2',
          title: 'Technique de base',
          description: `1. Tenez le médiator normalement
2. Utilisez votre index pour pincer les cordes aiguës
3. Utilisez votre majeur si nécessaire
4. Coordonnez médiator et doigts`,
        },
        {
          id: 'step-3',
          title: 'Applications',
          description: `• Country : Pour des lignes mélodiques complexes
• Jazz : Pour des accords avec basses alternées
• Rock : Pour des riffs polyphoniques
• Fingerstyle électrique : Pour plus de polyphonie`,
        },
      ],
    },
    rewards: {
      xp: 180,
    },
  },
  {
    id: 'style-005',
    title: 'Son Country Moderne',
    description: 'Créez un son country moderne avec compression et effets subtils.',
    category: 'styles',
    difficulty: 'intermediate',
    duration: 18,
    type: 'tutorial',
    icon: 'Music',
    tags: ['country', 'moderne', 'compression'],
    content: {
      steps: [
        {
          id: 'step-1',
          title: 'Caractéristiques du son country',
          description: `Le country moderne se caractérise par :
• Son clean et clair
• Compression présente
• Reverb plate (plate reverb)
• Delay subtil pour la profondeur`,
        },
        {
          id: 'step-2',
          title: 'Configuration',
          description: `Ampli : Fender Clean
• Gain : 3-4
• Bass : 5-6
• Middle : 6-7
• Treble : 6-7

Effets :
1. Compression (ratio 4:1, attack moyen)
2. Reverb plate (decay 2-3s)
3. Delay subtil (200-300ms, 15-20% mix)`,
        },
      ],
    },
    rewards: {
      xp: 110,
    },
  },
  {
    id: 'style-006',
    title: 'Son Indie Rock',
    description: 'Recreatez le son caractéristique de l\'indie rock avec des effets créatifs.',
    category: 'styles',
    difficulty: 'intermediate',
    duration: 20,
    type: 'tutorial',
    icon: 'Music',
    tags: ['indie', 'rock', 'créatif'],
    content: {
      steps: [
        {
          id: 'step-1',
          title: 'Caractéristiques de l\'indie rock',
          description: `L'indie rock se caractérise par :
• Distorsion modérée
• Beaucoup de reverb et delay
• Effets de modulation créatifs
• Son "noyé" dans les effets`,
        },
        {
          id: 'step-2',
          title: 'Configuration',
          description: `Ampli : Vox AC30 ou Fender
• Gain : 5-6
• EQ équilibré

Effets :
1. Overdrive modérée
2. Chorus ou Flanger
3. Delay avec feedback (40-50%)
4. Reverb grande taille`,
        },
      ],
    },
    rewards: {
      xp: 120,
    },
  },
  {
    id: 'chain-006',
    title: 'Chaîne pour le slide guitar',
    description: 'Optimisez votre chaîne pour le slide guitar avec compression et reverb.',
    category: 'chains',
    difficulty: 'intermediate',
    duration: 15,
    type: 'tutorial',
    icon: 'Layers',
    tags: ['slide', 'blues', 'chaîne'],
    content: {
      steps: [
        {
          id: 'step-1',
          title: 'Les besoins du slide',
          description: `Le slide nécessite :
• Sustain : Pour les notes longues
• Compression : Pour uniformiser
• Reverb : Pour l'espace
• Clarté : Pour entendre les nuances`,
        },
        {
          id: 'step-2',
          title: 'Chaîne recommandée',
          description: `1. Compression (ratio 3:1, attack moyen)
2. Overdrive légère (optionnel)
3. Reverb moyenne (2-3s decay)
4. Delay subtil (300-400ms, 20% mix)`,
        },
      ],
    },
    rewards: {
      xp: 95,
    },
  },
  {
    id: 'learn-005',
    title: 'Théorie : Les modes',
    description: 'Comprenez les modes grecs et leur application à la guitare.',
    category: 'basics',
    difficulty: 'advanced',
    duration: 30,
    type: 'tutorial',
    icon: 'GraduationCap',
    tags: ['théorie', 'modes', 'gammes'],
    content: {
      steps: [
        {
          id: 'step-1',
          title: 'Qu\'est-ce qu\'un mode ?',
          description: `Un mode est une gamme commençant sur une note différente de la tonique.

Les 7 modes de la gamme majeure :
• Ionien (majeur)
• Dorien
• Phrygien
• Lydien
• Mixolydien
• Éolien (mineur naturel)
• Locrien`,
        },
        {
          id: 'step-2',
          title: 'Applications pratiques',
          description: `Chaque mode a une couleur unique :
• Dorien : Mineur avec 6ème majeure (jazz, rock)
• Mixolydien : Majeur avec 7ème mineure (blues, rock)
• Lydien : Majeur avec 4ème augmentée (jazz moderne)`,
        },
      ],
    },
    rewards: {
      xp: 200,
    },
  },
  {
    id: 'learn-006',
    title: 'Théorie : Les accords enrichis',
    description: 'Maîtrisez les accords à 4 sons et plus : 7ème, 9ème, 11ème, 13ème.',
    category: 'basics',
    difficulty: 'advanced',
    duration: 25,
    type: 'tutorial',
    icon: 'GraduationCap',
    tags: ['théorie', 'accords', 'jazz'],
    content: {
      steps: [
        {
          id: 'step-1',
          title: 'Les accords à 4 sons',
          description: `Accords de base :
• Maj7 : 1, 3, 5, 7
• m7 : 1, b3, 5, b7
• 7 (dominante) : 1, 3, 5, b7
• m7b5 : 1, b3, b5, b7`,
        },
        {
          id: 'step-2',
          title: 'Accords à 5 sons et plus',
          description: `• 9ème : Ajoute la 9ème
• 11ème : Ajoute la 11ème
• 13ème : Ajoute la 13ème

Ces extensions ajoutent de la couleur et de la complexité harmonique.`,
        },
      ],
    },
    rewards: {
      xp: 180,
    },
  },
  {
    id: 'preset-004',
    title: 'Son Post-Rock',
    description: 'Créez un preset pour le post-rock avec beaucoup d\'ambiance et de texture.',
    category: 'styles',
    difficulty: 'advanced',
    duration: 8,
    type: 'preset',
    icon: 'Music',
    tags: ['post-rock', 'ambient', 'preset'],
    content: {
      presetId: 'post-rock',
    },
    rewards: {
      xp: 120,
    },
  },
  {
    id: 'preset-005',
    title: 'Son Pop Moderne',
    description: 'Preset optimisé pour la pop moderne avec clarté et présence.',
    category: 'styles',
    difficulty: 'intermediate',
    duration: 6,
    type: 'preset',
    icon: 'Music',
    tags: ['pop', 'moderne', 'preset'],
    content: {
      presetId: 'pop-modern',
    },
    rewards: {
      xp: 80,
    },
  },
  {
    id: 'amp-004',
    title: 'Mesa Boogie : Le son high-gain',
    description: 'Maîtrisez les amplis Mesa Boogie pour le metal et le rock moderne.',
    category: 'amps',
    difficulty: 'intermediate',
    duration: 18,
    type: 'tutorial',
    icon: 'Radio',
    tags: ['mesa boogie', 'high-gain', 'metal'],
    content: {
      steps: [
        {
          id: 'step-1',
          title: 'Caractéristiques Mesa Boogie',
          description: `Mesa Boogie est réputé pour :
• Son high-gain puissant
• Compression naturelle
• Réponse dynamique
• Clarté même à haut gain`,
        },
        {
          id: 'step-2',
          title: 'Réglages typiques',
          description: `• Gain : 7-9 (selon le style)
• Bass : 6-7
• Middle : 5-6 (scoop modéré)
• Treble : 6-7
• Presence : 6-7`,
        },
      ],
    },
    rewards: {
      xp: 100,
    },
  },
  {
    id: 'amp-005',
    title: 'Orange : Le son vintage chaleureux',
    description: 'Découvrez les amplis Orange et leur son caractéristique.',
    category: 'amps',
    difficulty: 'intermediate',
    duration: 16,
    type: 'tutorial',
    icon: 'Radio',
    tags: ['orange', 'vintage', 'chaleur'],
    content: {
      steps: [
        {
          id: 'step-1',
          title: 'Caractéristiques Orange',
          description: `Orange est réputé pour :
• Son chaud et vintage
• Médiums prononcés
• Distorsion naturelle
• Caractère unique`,
        },
        {
          id: 'step-2',
          title: 'Réglages typiques',
          description: `• Gain : 6-8
• Bass : 7-8
• Middle : 7-8 (boosté)
• Treble : 5-6`,
        },
      ],
    },
    rewards: {
      xp: 95,
    },
  },
  {
    id: 'chords-003',
    title: 'Accords barrés : Les bases',
    description: 'Maîtrisez les accords barrés pour jouer dans toutes les tonalités.',
    category: 'basics',
    difficulty: 'intermediate',
    duration: 20,
    type: 'tutorial',
    icon: 'Music',
    tags: ['accords', 'barrés', 'bases'],
    content: {
      steps: [
        {
          id: 'step-1',
          title: 'Qu\'est-ce qu\'un accord barré ?',
          description: `Un accord barré utilise l'index pour appuyer sur plusieurs cordes à la fois.

Avantages :
• Jouer dans toutes les tonalités
• Transposer facilement
• Plus de flexibilité`,
        },
        {
          id: 'step-2',
          title: 'Accords barrés de base',
          description: `Forme de base en Mi majeur (E) :
[chord:F] (barré sur la 1ère case)

Forme de base en La majeur (A) :
[chord:Bb] (barré sur la 1ère case)

Pratiquez ces formes jusqu'à ce qu'elles sonnent clairement.`,
        },
      ],
    },
    rewards: {
      xp: 120,
    },
  },
  {
    id: 'song-006',
    title: 'Apprendre "Nothing Else Matters" - Metallica',
    description: 'Maîtrisez cette ballade métal avec ses techniques de fingerpicking.',
    category: 'styles',
    difficulty: 'intermediate',
    duration: 35,
    type: 'tutorial',
    icon: 'Music',
    tags: ['chanson', 'metallica', 'ballade', 'fingerpicking'],
    content: {
      steps: [
        {
          id: 'step-1',
          title: 'Découvrir Metallica',
          description: `[artist:Metallica]

Metallica est un groupe de thrash metal américain formé en 1981. "Nothing Else Matters" est une ballade sortie en 1991 sur l'album "Metallica" (The Black Album).

Le style de James Hetfield combine puissance et mélodie.`,
        },
        {
          id: 'step-2',
          title: 'L\'intro au fingerpicking',
          description: `L'intro utilise un pattern de fingerpicking simple mais efficace.

Pattern :
P - i - m - a
(Thumb - Index - Middle - Ring)

Jouez les cordes graves avec le pouce et les aiguës avec les doigts.`,
        },
        {
          id: 'step-3',
          title: 'La progression d\'accords',
          description: `Progression principale :
Em | C | G | D
Em | C | G | D

[chord:Em]
[chord:C]
[chord:G]
[chord:D]`,
        },
        {
          id: 'step-4',
          title: 'Créer le son Metallica dans WebAmp',
          description: `Ampli : Mesa Boogie
• Gain : 4-5 (clean pour l'intro)
• Bass : 7-8
• Middle : 5-6
• Treble : 6-7

Effets :
1. Compression légère
2. Reverb moyenne (2-3s)
3. Delay subtil (pour les parties lead)`,
        },
      ],
    },
    rewards: {
      xp: 220,
      badges: ['maitre-nothing-else'],
    },
  },
  {
    id: 'song-007',
    title: 'Apprendre "Hotel California" - Eagles',
    description: 'Apprenez les solos emblématiques de cette chanson légendaire.',
    category: 'styles',
    difficulty: 'advanced',
    duration: 50,
    type: 'tutorial',
    icon: 'Music',
    tags: ['chanson', 'eagles', 'rock', 'solo'],
    content: {
      steps: [
        {
          id: 'step-1',
          title: 'Découvrir les Eagles',
          description: `[artist:Eagles]

Les Eagles sont un groupe de rock américain formé en 1971. "Hotel California" est leur chanson la plus célèbre, sortie en 1976.

Les solos de Joe Walsh et Don Felder sont parmi les plus reconnaissables du rock.`,
        },
        {
          id: 'step-2',
          title: 'La progression d\'accords',
          description: `Progression caractéristique :
Am | E | G | D | F | C | Dm | E

[chord:Am]
[chord:E]
[chord:G]
[chord:D]
[chord:F]
[chord:C]
[chord:Dm]`,
        },
        {
          id: 'step-3',
          title: 'Les techniques de solo',
          description: `Les solos utilisent :
• Bends expressifs
• Slides fluides
• Vibrato contrôlé
• Phrasé mélodique`,
        },
        {
          id: 'step-4',
          title: 'Créer le son Eagles dans WebAmp',
          description: `Ampli : Fender Clean
• Gain : 4-5
• Bass : 6-7
• Middle : 7-8
• Treble : 6-7

Effets :
1. Compression légère
2. Delay (400-500ms, 25-30% mix)
3. Reverb moyenne (2-3s)`,
        },
      ],
    },
    rewards: {
      xp: 280,
      badges: ['maitre-hotel-california'],
    },
  },
  {
    id: 'crea-003',
    title: 'Créer des boucles avec le Looper',
    description: 'Utilisez le looper intégré pour créer des compositions en couches.',
    category: 'creativity',
    difficulty: 'intermediate',
    duration: 15,
    type: 'tutorial',
    icon: 'Sparkles',
    tags: ['looper', 'boucles', 'composition'],
    content: {
      steps: [
        {
          id: 'step-1',
          title: 'Les bases du looping',
          description: `Le looping permet de :
• Enregistrer une partie
• La rejouer en boucle
• Ajouter d'autres parties par-dessus
• Créer des compositions complètes`,
        },
        {
          id: 'step-2',
          title: 'Techniques de base',
          description: `1. Enregistrez une partie rythmique (4-8 mesures)
2. Ajoutez une partie de basse ou d'accords
3. Ajoutez une mélodie ou un solo
4. Variez les textures avec différents effets`,
        },
        {
          id: 'step-3',
          title: 'Astuces créatives',
          description: `• Commencez simple et ajoutez progressivement
• Variez les dynamiques (fort/faible)
• Utilisez différents effets pour chaque couche
• Expérimentez avec les silences`,
        },
      ],
    },
    rewards: {
      xp: 100,
    },
  },
  {
    id: 'pro-006',
    title: 'Routage avancé : Parallel Processing',
    description: 'Techniques professionnelles de traitement parallèle pour plus de flexibilité.',
    category: 'chains',
    difficulty: 'pro',
    duration: 30,
    type: 'tutorial',
    icon: 'Layers',
    tags: ['routage', 'pro', 'parallel'],
    content: {
      steps: [
        {
          id: 'step-1',
          title: 'Qu\'est-ce que le Parallel Processing ?',
          description: `Le parallel processing consiste à traiter le signal original et une copie traitée en parallèle, puis à les mixer.

Avantages :
• Garde la clarté du signal original
• Ajoute de la couleur avec le signal traité
• Plus de contrôle sur le mix final`,
        },
        {
          id: 'step-2',
          title: 'Applications',
          description: `• Compression parallèle : Compressez une copie et mixez avec l'original
• Distorsion parallèle : Ajoutez de la saturation sans perdre la clarté
• Reverb parallèle : Reverb sur une copie pour plus de contrôle`,
        },
        {
          id: 'step-3',
          title: 'Mise en œuvre',
          description: `Dans WebAmp, créez deux chaînes :
1. Chaîne principale : Signal clean ou légèrement traité
2. Chaîne parallèle : Signal avec effets

Mixez les deux chaînes pour le résultat final.`,
        },
      ],
    },
    rewards: {
      xp: 300,
    },
  },
  {
    id: 'pro-007',
    title: 'Calibration et mesure de latence',
    description: 'Mesurez et optimisez la latence de votre système pour des performances optimales.',
    category: 'techniques',
    difficulty: 'pro',
    duration: 25,
    type: 'tutorial',
    icon: 'Target',
    tags: ['latence', 'pro', 'optimisation'],
    content: {
      steps: [
        {
          id: 'step-1',
          title: 'Pourquoi mesurer la latence ?',
          description: `La latence affecte :
• Le feeling de jeu
• La synchronisation
• Le confort de jeu

Une latence < 10ms est idéale pour le jeu en direct.`,
        },
        {
          id: 'step-2',
          title: 'Méthodes de mesure',
          description: `1. Méthode du clap : Enregistrez un clap et mesurez le délai
2. Utilisez les outils de monitoring de WebAmp
3. Testez avec différents drivers audio (ASIO recommandé)`,
        },
        {
          id: 'step-3',
          title: 'Optimisation',
          description: `Pour réduire la latence :
• Utilisez le Native Helper
• Réduisez la taille du buffer
• Utilisez ASIO sur Windows
• Désactivez les effets non essentiels`,
        },
      ],
    },
    rewards: {
      xp: 250,
    },
  },
  {
    id: 'guide-016',
    title: 'Guide du Pitch Shifter',
    description: 'Utilisez le pitch shifter pour créer des harmonies et des effets créatifs.',
    category: 'effects',
    difficulty: 'intermediate',
    duration: 14,
    type: 'tutorial',
    icon: 'Zap',
    tags: ['pitch shifter', 'harmonies', 'effets'],
    content: {
      steps: [
        {
          id: 'step-1',
          title: 'Qu\'est-ce qu\'un Pitch Shifter ?',
          description: `Un pitch shifter change la hauteur du signal sans changer la vitesse.

Applications :
• Harmonies automatiques
• Effets créatifs
• Correction de hauteur`,
        },
        {
          id: 'step-2',
          title: 'Les paramètres',
          description: `• Pitch : Intervalle de hauteur (+/- octaves, demi-tons)
• Mix : Niveau du signal décalé
• Feedback : Pour des effets de feedback
• Tracking : Précision du suivi`,
        },
        {
          id: 'step-3',
          title: 'Applications musicales',
          description: `• Harmonies : +3, +5, +7 demi-tons pour des harmonies
• Octaver : +12 ou -12 demi-tons pour des octaves
• Effets créatifs : Décalages étranges pour des textures`,
        },
      ],
    },
    rewards: {
      xp: 95,
    },
  },
  {
    id: 'tech-007',
    title: 'Tapping à deux mains',
    description: 'Maîtrisez la technique du tapping à deux mains pour des arpèges complexes.',
    category: 'techniques',
    difficulty: 'advanced',
    duration: 25,
    type: 'tutorial',
    icon: 'Target',
    tags: ['tapping', 'technique', 'avancé'],
    content: {
      steps: [
        {
          id: 'step-1',
          title: 'Les bases du tapping',
          description: `Le tapping consiste à "taper" les notes sur le manche avec les doigts de la main droite (ou gauche pour les gauchers).

Permet de jouer des arpèges et des mélodies complexes rapidement.`,
        },
        {
          id: 'step-2',
          title: 'Technique de base',
          description: `1. Tenez le médiator entre pouce et index
2. Utilisez votre majeur pour taper
3. Hammer-on avec la main gauche
4. Pull-off pour revenir`,
        },
        {
          id: 'step-3',
          title: 'Exercices progressifs',
          description: `Commencez par des patterns simples :
• 3 notes sur une corde
• Puis sur plusieurs cordes
• Ensuite des arpèges complets
• Enfin des mélodies complexes`,
        },
      ],
    },
    rewards: {
      xp: 200,
    },
  },
  {
    id: 'style-007',
    title: 'Son Punk Rock',
    description: 'Créez un son punk énergique et direct avec distorsion et simplicité.',
    category: 'styles',
    difficulty: 'beginner',
    duration: 12,
    type: 'tutorial',
    icon: 'Music',
    tags: ['punk', 'rock', 'distorsion'],
    content: {
      steps: [
        {
          id: 'step-1',
          title: 'Caractéristiques du punk',
          description: `Le punk se caractérise par :
• Distorsion agressive
• Simplicité
• Énergie brute
• Pas d'effets complexes`,
        },
        {
          id: 'step-2',
          title: 'Configuration',
          description: `Ampli : Marshall ou équivalent
• Gain : 8-10 (maximum)
• EQ : Tout à fond ou presque

Effets :
1. Distortion maximale
2. C'est tout ! Le punk, c'est simple.`,
        },
      ],
    },
    rewards: {
      xp: 70,
    },
  },
  {
    id: 'quiz-005',
    title: 'Quiz : Niveau Pro',
    description: 'Testez vos connaissances avancées sur la production et le mixage.',
    category: 'techniques',
    difficulty: 'pro',
    duration: 15,
    type: 'quiz',
    icon: 'Target',
    tags: ['quiz', 'pro', 'production'],
    content: {
      quiz: [
        {
          id: 'q1',
          question: 'Qu\'est-ce que le parallel processing ?',
          options: [
            'Traiter le signal en série',
            'Traiter le signal original et une copie en parallèle puis mixer',
            'Utiliser plusieurs processeurs',
            'Traiter uniquement les fréquences aiguës',
          ],
          correctAnswer: 1,
          explanation: 'Le parallel processing consiste à traiter le signal original et une copie traitée en parallèle, puis à les mixer.',
        },
        {
          id: 'q2',
          question: 'Quelle latence est considérée comme idéale pour le jeu en direct ?',
          options: [
            '< 5ms',
            '< 10ms',
            '< 20ms',
            '< 50ms',
          ],
          correctAnswer: 1,
          explanation: 'Une latence < 10ms est idéale pour le jeu en direct, permettant un feeling naturel.',
        },
        {
          id: 'q3',
          question: 'Qu\'est-ce que le double tracking ?',
          options: [
            'Enregistrer deux fois la même partie et panner',
            'Utiliser deux amplis',
            'Doubler le tempo',
            'Utiliser deux micros',
          ],
          correctAnswer: 0,
          explanation: 'Le double tracking consiste à enregistrer la même partie deux fois et à panner les deux pistes pour créer une largeur stéréo.',
        },
      ],
    },
    rewards: {
      xp: 200,
    },
  },
]

export const categoryLabels: Record<TutorialCategory, string> = {
  basics: 'Bases',
  effects: 'Effets',
  amps: 'Amplis',
  chains: 'Chaînes',
  styles: 'Styles',
  techniques: 'Techniques',
  creativity: 'Créativité',
}

export const categoryIcons: Record<TutorialCategory, string> = {
  basics: 'GraduationCap',
  effects: 'Zap',
  amps: 'Radio',
  chains: 'Layers',
  styles: 'Music',
  techniques: 'Target',
  creativity: 'Sparkles',
}

export const difficultyLabels: Record<TutorialDifficulty, string> = {
  beginner: 'Débutant',
  intermediate: 'Intermédiaire',
  advanced: 'Avancé',
  pro: 'Pro',
}

export const difficultyColors: Record<TutorialDifficulty, string> = {
  // On réserve le vert pour indiquer un cours terminé,
  // donc on utilise une autre couleur pour les cours débutant
  beginner: 'bg-blue-500',
  intermediate: 'bg-yellow-500',
  advanced: 'bg-red-500',
  pro: 'bg-purple-500',
}

