// Profils de rock stars avec leurs équipements
export interface RockStarProfile {
  name: string
  style: string
  amps: string[]
  pedals: string[]
  notes: string
}

export const rockStarProfiles: RockStarProfile[] = [
  {
    name: "Jimi Hendrix",
    style: "Psychedelic Rock / Blues Rock",
    amps: ["Marshall Plexi", "Fender Twin", "Fender Bassman"],
    pedals: ["Fuzz Face", "Vox Wah V847", "Univibe", "Octavia", "Tape Echo (Binson / Echoplex)"],
    notes: "Grande expérimentation sonore, pionnier de l'usage d'effets."
  },
  {
    name: "Chuck Berry",
    style: "Rock'n'Roll / Rhythm & Blues",
    amps: ["Fender Twin", "Gibson GA-40"],
    pedals: [],
    notes: "Rig très simple : gros clean poussé, quasiment aucun effet."
  },
  {
    name: "Steve Vai",
    style: "Rock Instrumental / Fusion",
    amps: ["Carvin Legacy", "Synergy Modules (live récents)"],
    pedals: ["Ibanez Jemini Distortion", "Boss DS-1", "Eventide Harmonizer", "Morley Bad Horsie Wah"],
    notes: "Rig complexe, multi-effets, harmonizers et contrôleurs MIDI."
  },
  {
    name: "Joe Satriani",
    style: "Rock Instrumental / Hard Rock",
    amps: ["Marshall JVM410HJS", "Peavey JSX"],
    pedals: ["Satchurator", "Vox Time Machine Delay", "Dunlop Cry Baby Wah", "Boss CH-1"],
    notes: "Son lead chantant, rig orienté disto+delay propre."
  },
  {
    name: "Buckethead",
    style: "Experimental / Avant-Garde / Metal",
    amps: ["Mesa/Boogie Dual Rectifier", "Marshall JCM800"],
    pedals: ["DigiTech Whammy", "Boss DD-3", "Electro-Harmonix Memory Man", "Killswitch intégré"],
    notes: "Effets exagérés, whammy, delays et sons non conventionnels."
  },
  {
    name: "B.B. King",
    style: "Blues",
    amps: ["Lab Series L5", "Fender Twin"],
    pedals: [],
    notes: "Clean unique, sustain contrôlé au vibrato de main gauche, très peu d'effets."
  },
  {
    name: "Gary Moore",
    style: "Blues Rock / Hard Rock",
    amps: ["Marshall JTM45", "Marshall 1959SLP", "Soldano SLO-100"],
    pedals: ["Ibanez Tube Screamer", "Boss DS-1", "TC Electronic Delay"],
    notes: "Overdrive puissant, sustain long, son blues rock épais."
  },
  {
    name: "Mark Knopfler",
    style: "Rock / Fingerstyle",
    amps: ["Fender Vibrolux", "Mesa/Boogie Mark I", "Soldano SLO-100"],
    pedals: ["Cry Baby Wah", "Boss CE-2", "TC Electronic Delay"],
    notes: "Son clean compressé, fingerpicking emblématique."
  },
  {
    name: "Prince",
    style: "Funk / Pop / Rock",
    amps: ["Mesa/Boogie Mark I", "Fender Twin"],
    pedals: ["Boss DD-3", "Boss Chorus CE-1", "Wah", "Flanger"],
    notes: "Rig variable, souvent clean funky + effets légers."
  },
  {
    name: "Brian May",
    style: "Rock / Orchestral Rock",
    amps: ["Vox AC30"],
    pedals: ["Treble Booster (Rangemaster/clone)", "Delay synchronisé (TC, Boss)", "Modulations légères"],
    notes: "Son signé AC30 + booster, harmonies multitrack."
  },
  {
    name: "George Benson",
    style: "Jazz / Smooth Jazz",
    amps: ["Polytone Mini-Brute", "Fender Twin"],
    pedals: ["Boss Delay DD Series"],
    notes: "Clean jazz très rond et chaleureux, très peu d'effets."
  },
  {
    name: "Wes Montgomery",
    style: "Jazz",
    amps: ["Fender Twin", "Standel Amps"],
    pedals: [],
    notes: "Aucun effet, attaques au pouce et accords octaves emblématiques."
  },
  {
    name: "Nile Rodgers",
    style: "Funk / Disco / Pop",
    amps: ["Fender Twin", "Roland JC-120"],
    pedals: ["Boss CE-2", "MXR Phase 90"],
    notes: "Clean ultra précis, compresseur et chorus légers."
  },
  {
    name: "John Petrucci",
    style: "Progressive Metal / Shred",
    amps: ["Mesa/Boogie Mark IIC+", "Mesa/Boogie JP2C", "IIC+ Synergy"],
    pedals: ["Wah JP95", "Delay TC Flashback", "Chorus", "Overdrive Mesa Grid Slammer"],
    notes: "Rig très technique, multi-amps, effets numériques sophistiqués."
  },
  {
    name: "Dimebag Darrell",
    style: "Groove Metal",
    amps: ["Randall RG100ES", "Peavey 5150"],
    pedals: ["MXR Phase 90", "Dunlop Cry Baby From Hell", "Rack MXR Flanger/Doubler"],
    notes: "Distorsion high-gain signature, harmonics et whammy bar."
  },
  {
    name: "Marty Friedman",
    style: "Metal / Neo-Classical",
    amps: ["Engl Powerball", "Marshall JCM800"],
    pedals: ["Boss OD-1", "Delay Boss DD-3", "Chorus"],
    notes: "Son lead exotique, vibrato unique."
  },
  {
    name: "Andy Timmons",
    style: "Rock Instrumental / Fusion",
    amps: ["Mesa Lonestar", "Mesa Mark V"],
    pedals: ["JHS AT Drive", "Delay Strymon Timeline", "Reverb Neunaber"],
    notes: "Overdrive organique, delays atmosphériques."
  },
  {
    name: "Allan Holdsworth",
    style: "Jazz Fusion",
    amps: ["Hartley Thompson", "Yamaha DG80"],
    pedals: ["TC Electronic Delay", "Chorus", "Volume Pedal"],
    notes: "Legato extrême, son synthé-like, rack souvent utilisé."
  },
  {
    name: "Johnny Marr",
    style: "Indie / Alternative",
    amps: ["Fender Twin", "Vox AC30"],
    pedals: ["Boss CE-2", "Electro-Harmonix Memory Man", "Compresseur"],
    notes: "Superpositions de guitares clean et modulations fines."
  },
  {
    name: "Tosin Abasi",
    style: "Progressive Metal / Djent / Fusion",
    amps: ["Fractal Axe-FX", "Neural DSP Quad Cortex"],
    pedals: ["Overdrives modernes", "Compresseur"],
    notes: "Son moderne djent/fusion, stack numérique, précision et mix clair."
  },
  {
    name: "Eric Clapton",
    style: "Blues Rock",
    amps: ["Marshall Super Lead 100", "Fender Bassman", "Fender Twin"],
    pedals: ["Cry Baby Wah", "Boss CE-1 Chorus", "Delays Roland", "Boost/Compresseurs divers"],
    notes: "Rig plutôt minimaliste, son basé sur ampli + dynamique."
  },
  {
    name: "Jimmy Page",
    style: "Hard Rock / Blues Rock",
    amps: ["Marshall Super Lead 1959", "Fender Dual Showman", "Orange Heads"],
    pedals: ["MXR Phase 90", "Echoplex", "Binson Echo", "EQs"],
    notes: "Grand usage de studio, textures et expérimentations."
  },
  {
    name: "David Gilmour",
    style: "Progressive Rock / Ambient Rock",
    amps: ["Hiwatt DR103", "Fender Twin Reverb"],
    pedals: ["Big Muff", "Uni-Vibe", "Binson Echorec", "Power Booster", "Delays multiples"],
    notes: "Son atmosphérique très travaillé, rig complexe."
  },
  {
    name: "Eddie Van Halen",
    style: "Hard Rock / Heavy Metal",
    amps: ["Marshall Plexi modifié", "EVH 5150"],
    pedals: ["MXR Phase 90", "MXR Flanger 117", "Wah EVH", "Echoplex"],
    notes: "'Brown Sound' basé sur l'ampli + variac, peu d'effets."
  },
  {
    name: "Stevie Ray Vaughan",
    style: "Blues",
    amps: ["Fender Vibroverb", "Fender Super Reverb", "Dumble"],
    pedals: ["Ibanez TS808", "Wah occasionnel", "Leslie/Rotary"],
    notes: "Overdrive léger, rig très orienté ampli + attaque."
  },
  {
    name: "Carlos Santana",
    style: "Latin Rock / Fusion",
    amps: ["Mesa Boogie Mark I", "PRS Custom Amps"],
    pedals: ["RMC Wah", "Boost léger", "Delay TC Electronic"],
    notes: "Son vocal, sustain important, peu d'effets."
  },
  {
    name: "The Edge",
    style: "Rock Atmosphérique / Alternative",
    amps: ["Vox AC30", "Roland JC-120"],
    pedals: ["Memory Man Delay", "DigiTech Whammy", "Boss Volume/Expression", "Rack Bradshaw"],
    notes: "Usage intensif de delays rythmiques et multi-amps."
  },
  {
    name: "Tom Morello",
    style: "Alternative Metal / Experimental",
    amps: ["Marshall JCM800", "Marshall DSL"],
    pedals: ["DigiTech Whammy", "Dunlop Wah", "Boss DD-2/3", "DOD EQ"],
    notes: "Effets utilisés de manière créative et non conventionnelle."
  },
  {
    name: "John Mayer",
    style: "Blues / Pop",
    amps: ["Dumble Overdrive Special", "Two-Rock Custom", "Fender Blackface"],
    pedals: ["Tube Screamer", "Overdrives transparents", "Delays soft", "Reverb"],
    notes: "Tonalité clean et dynamique, rig très soigné."
  },
  {
    name: "Slash",
    style: "Hard Rock",
    amps: ["Marshall Silver Jubilee 2555", "Marshall JCM Slash 2555"],
    pedals: ["Dunlop Slash Wah SW95", "MXR MC-402 Boost/OD", "Boss DD-3", "MXR Analog Chorus", "Noise Gate"],
    notes: "Rock classique basé sur un gros son d'ampli + wah/boost."
  },
  {
    name: "Kirk Hammett",
    style: "Thrash Metal / Heavy Metal",
    amps: ["Mesa Boogie Mark IIC+", "Randall KH103", "Marshall 100W / JCM800"],
    pedals: ["Ibanez TS-9", "Dunlop KH95 Wah", "TC Electronic G-Major 2", "Delays / Modulations"],
    notes: "Rig métal puissant, beaucoup de leads wah + delays."
  }
]

