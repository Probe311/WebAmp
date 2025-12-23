export interface EffectInfo {
  id: string
  name: string
  type: string
  tagline: string
  description: string
  notableUse?: string
}

export const effectInfos: EffectInfo[] = [
  {
    id: 'chorus',
    name: 'Chorus',
    type: 'chorus',
    tagline: 'Épaissit une ligne claire avec un léger détune.',
    description: 'Modulation douce qui double le signal et le décale légèrement en hauteur et en temps pour obtenir un shimmer stéréo.',
    notableUse: 'Le son CE-1/CE-2 des années 80'
  },
  {
    id: 'delay',
    name: 'Delay',
    type: 'delay',
    tagline: 'L’écho contrôlé pour sculpter la profondeur.',
    description: 'Répète le signal après un temps réglable. Digital pour la précision, analogique ou tape pour la chaleur et la dégradation.',
    notableUse: 'U2, Pink Floyd, LoFi reels'
  },
  {
    id: 'reverb',
    name: 'Reverb',
    type: 'reverb',
    tagline: 'Place votre son dans un espace naturel ou infini.',
    description: 'Simule des pièces, halls, plaques ou ressorts. Un mix faible ajoute de la colle, un mix élevé crée des textures ambient.',
    notableUse: 'Shoegaze, sound design, nappes ciné'
  },
  {
    id: 'overdrive',
    name: 'Overdrive',
    type: 'overdrive',
    tagline: 'Chaleur et compression légère pour pousser l’ampli.',
    description: 'Sature en douceur en imitant un ampli à lampes poussé. Sert de boost médiums pour ressortir dans un mix.',
    notableUse: 'SRV, rock moderne, worship'
  },
  {
    id: 'distortion',
    name: 'Distortion',
    type: 'distortion',
    tagline: 'Gain musclé, harmoniques serrées et sustain.',
    description: 'Clipping plus agressif que l’overdrive, idéal pour riffs serrés ou leads chantants selon le filtre de ton.',
    notableUse: 'Grunge, punk, metal classique'
  },
  {
    id: 'fuzz',
    name: 'Fuzz',
    type: 'fuzz',
    tagline: 'Grain velcro, saturation massive et caractère vintage.',
    description: 'Écrase le signal jusqu’au carré, réagit fortement au volume de la guitare. Excellent pour textures ou leads psyché.',
    notableUse: 'Hendrix, Smashing Pumpkins'
  },
  {
    id: 'tremolo',
    name: 'Tremolo',
    type: 'tremolo',
    tagline: 'Volume qui pulse, du subtil au stutter glitch.',
    description: 'Fait varier le volume à une vitesse réglable. Formes sine pour douceur, square ou random pour effets hachés.',
    notableUse: 'Surf, musiques de western, indie moderne'
  },
  {
    id: 'phaser',
    name: 'Phaser',
    type: 'phaser',
    tagline: 'Balayage liquide, creux de phase mouvants.',
    description: 'Décale la phase de bandes de fréquences pour créer des balayages. Peu de commandes mais beaucoup de caractère.',
    notableUse: 'Eddie Van Halen, funk 70s'
  },
  {
    id: 'flanger',
    name: 'Flanger',
    type: 'flanger',
    tagline: 'Jet qui décolle, comb filtering prononcé.',
    description: 'Retarde le signal de quelques ms et le module pour créer un balayage métallique. Idéal sur riffs palm-mute ou synthés.',
    notableUse: 'Van Halen, The Cure'
  },
  {
    id: 'compressor',
    name: 'Compresseur',
    type: 'compressor',
    tagline: 'Lisse la dynamique, met le groove en avant.',
    description: 'Réduit les écarts de volume, ajoute sustain et clarté. Incontournable pour funk claquant ou slide velouté.',
    notableUse: 'Country clean, funk chic'
  },
  {
    id: 'octaver',
    name: 'Octaver',
    type: 'octaver',
    tagline: 'Ajoute une octave au-dessus/dessous pour épaissir.',
    description: 'Mélange du pitch-shifté avec le signal dry. En mono pour épaissir, en stéréo pour des textures synth-like.',
    notableUse: 'Basse mono massive, leads façon organ'
  }
]

