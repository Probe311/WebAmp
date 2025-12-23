export type InstrumentType = 'guitare' | 'basse' | 'batterie'

export interface MusicianProfile {
  name: string
  instrument: InstrumentType
  genres: string[]
  bio: string
  highlight?: string
  imageQuery?: string
}

export const musicianProfiles: MusicianProfile[] = [
  {
    name: 'Nile Rodgers',
    instrument: 'guitare',
    genres: ['Funk', 'Disco', 'Pop'],
    bio: 'Architecte du son chic, riffs nets et groove inarrêtable.',
    highlight: 'Producteur pour Daft Punk, Bowie, Madonna'
  },
  {
    name: 'Tosin Abasi',
    instrument: 'guitare',
    genres: ['Progressif', 'Djent', 'Fusion'],
    bio: 'Technique à huit cordes, lignes polyrhythmiques aériennes.',
    highlight: 'Animals as Leaders'
  },
  {
    name: 'Mark Lettieri',
    instrument: 'guitare',
    genres: ['Funk', 'Fusion', 'Neo-soul'],
    bio: 'Phrasing percussif et mélodies soul au service du groove.',
    highlight: 'Snarky Puppy'
  },
  {
    name: 'Mateus Asato',
    instrument: 'guitare',
    genres: ['Pop', 'Soul', 'Ambient'],
    bio: 'Jeu mélodique ultra-chantant et arrangements minimalistes.',
    highlight: 'Tone Instagram devenu standard studio'
  },
  {
    name: 'Plini',
    instrument: 'guitare',
    genres: ['Progressif', 'Ambient', 'Fusion'],
    bio: 'Textures éthérées, thèmes lumineux et production ciselée.',
    highlight: 'Albums auto-produits acclamés'
  },
  {
    name: 'Guthrie Govan',
    instrument: 'guitare',
    genres: ['Fusion', 'Rock', 'Jazz'],
    bio: 'Virtuose au toucher fluide, mélange shred et sens mélodique.',
    highlight: 'The Aristocrats'
  },
  {
    name: 'St. Vincent',
    instrument: 'guitare',
    genres: ['Art Rock', 'Indie', 'Pop'],
    bio: 'Textures angulaires, sons synthés-guitares et hooks tranchants.',
    highlight: 'Signature Music Man'
  },
  {
    name: 'Tom Morello',
    instrument: 'guitare',
    genres: ['Rock', 'Rap Rock', 'Alternative'],
    bio: 'Bruitage inventif, killswitch et whammy politisés.',
    highlight: 'Rage Against The Machine'
  },
  {
    name: 'Nels Cline',
    instrument: 'guitare',
    genres: ['Indie', 'Expérimental', 'Jazz'],
    bio: 'Textures noise, lap steel et mélodies fines en clair.',
    highlight: 'Wilco'
  },
  {
    name: 'Julien Baker',
    instrument: 'guitare',
    genres: ['Indie', 'Ambient', 'Songwriting'],
    bio: 'Reverbs cathédrale, arpèges fragiles, intensité intime.',
    highlight: 'Boygenius'
  },
  {
    name: 'Cory Wong',
    instrument: 'guitare',
    genres: ['Funk', 'Jazz', 'Fusion'],
    bio: 'Rythmiques ultra-précises, compression claquante signature.',
    highlight: 'Vulfpeck'
  },
  {
    name: 'Larnell Lewis',
    instrument: 'batterie',
    genres: ['Fusion', 'Gospel', 'Jazz'],
    bio: 'Groove métronomique, ghost notes soyeuses, sens de la mélodie.',
    highlight: 'Snarky Puppy'
  },
  {
    name: 'Anika Nilles',
    instrument: 'batterie',
    genres: ['Fusion', 'Pop', 'Progressif'],
    bio: 'Jeu hybride, mesures composées fluides, son moderne et sec.',
    highlight: 'Sonorité brillante et précise'
  },
  {
    name: 'Benny Greb',
    instrument: 'batterie',
    genres: ['Groove', 'Jazz', 'Funk'],
    bio: 'Contrôle du timbre, vocabulaire vocalique et groove profond.',
    highlight: 'Concepts de rythme singuliers'
  },
  {
    name: 'Questlove',
    instrument: 'batterie',
    genres: ['Hip-hop', 'Soul', 'Neo-soul'],
    bio: 'Backbeat millimétré, shuffle chaleureux, culture encyclopédique.',
    highlight: 'The Roots'
  },
  {
    name: 'Travis Barker',
    instrument: 'batterie',
    genres: ['Punk', 'Hip-hop', 'Pop'],
    bio: 'Énergie punk, précision studio, toms très présents.',
    highlight: 'Blink-182 & collabs rap'
  },
  {
    name: 'Pino Palladino',
    instrument: 'basse',
    genres: ['Soul', 'Pop', 'Rock'],
    bio: 'Lignes chantantes, slides iconiques et midrange feutré.',
    highlight: 'D’Angelo, John Mayer Trio'
  },
  {
    name: 'Jaco Pastorius',
    instrument: 'basse',
    genres: ['Jazz', 'Fusion', 'Latin'],
    bio: 'Fretless chantant, harmoniques naturelles, groove mélodique.',
    highlight: 'Weather Report'
  },
  {
    name: 'Flea',
    instrument: 'basse',
    genres: ['Funk', 'Rock', 'Alternative'],
    bio: 'Slap agressif, énergie brute et lignes mélodiques inattendues.',
    highlight: 'Red Hot Chili Peppers'
  },
  {
    name: 'Victor Wooten',
    instrument: 'basse',
    genres: ['Fusion', 'Jazz', 'Groove'],
    bio: 'Double-thumbing, tapping harmoniques, musicalité avant tout.',
    highlight: 'Béla Fleck & The Flecktones'
  },
  {
    name: 'Tal Wilkenfeld',
    instrument: 'basse',
    genres: ['Fusion', 'Rock', 'Jazz'],
    bio: 'Phrasing chantant, time irréprochable, solos mélodiques.',
    highlight: 'Jeff Beck Group'
  },
  {
    name: 'Marcus Miller',
    instrument: 'basse',
    genres: ['Funk', 'Jazz', 'Fusion'],
    bio: 'Slap musclé, préampli signature, arrangeur hors pair.',
    highlight: 'Miles Davis, Luther Vandross'
  },
  {
    name: 'Carter Beauford',
    instrument: 'batterie',
    genres: ['Rock', 'Fusion', 'Jam'],
    bio: 'Ambidextre, hi-hats ouverts, groove en mouvement constant.',
    highlight: 'Dave Matthews Band'
  },
  {
    name: 'Nita Strauss',
    instrument: 'guitare',
    genres: ['Metal', 'Rock', 'Shred'],
    bio: 'Riffs musclés, phrasé précis et présence scénique incendiaire.',
    highlight: 'Alice Cooper'
  }
]

