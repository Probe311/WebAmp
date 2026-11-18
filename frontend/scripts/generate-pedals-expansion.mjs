/**
 * Génère pedals-expansion.ts + met à jour LISTE-PEDALES.md
 * ponytail: stubs UI + liste — docs DSP complètes = upgrade path
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '../..')
const frontendSrc = path.join(root, 'frontend/src/data')
const docsPedals = path.join(root, 'docs/pedales')

/** @typedef {{ id: string, brand: string, model: string, type: string, description: string, params: string[], style?: string, accent: string, folder: string }} Spec */

const knobs = {
  drive3: ['drive', 'tone', 'level'],
  dist3: ['distortion', 'tone', 'level'],
  fuzz3: ['fuzz', 'tone', 'volume'],
  sustain3: ['sustain', 'tone', 'volume'],
  boost2: ['boost', 'level'],
  boost1: ['level'],
  comp3: ['sustain', 'attack', 'level'],
  comp4: ['sustain', 'attack', 'blend', 'level'],
  gate2: ['threshold', 'decay'],
  gate3: ['threshold', 'decay', 'level'],
  chorus3: ['rate', 'depth', 'level'],
  chorus2: ['rate', 'depth'],
  flanger4: ['rate', 'depth', 'regen', 'manual'],
  phaser2: ['rate', 'depth'],
  trem3: ['rate', 'depth', 'level'],
  delay3: ['time', 'feedback', 'mix'],
  delay4: ['time', 'feedback', 'mix', 'mod'],
  reverb3: ['mix', 'decay', 'tone'],
  reverb4: ['mix', 'decay', 'tone', 'predelay'],
  pitch3: ['pitch', 'mix', 'tone'],
  oct3: ['octave', 'dry', 'tone'],
  filter3: ['freq', 'res', 'mix'],
  wah2: ['sweep', 'q'],
  vol1: ['level'],
  multi4: ['a', 'b', 'c', 'mix'],
  looper2: ['level', 'speed'],
  vibe3: ['speed', 'intensity', 'volume'],
  bit3: ['bits', 'sample', 'mix'],
  synth4: ['pitch', 'filter', 'fuzz', 'mix'],
}

/** @type {Spec[]} */
const specs = [
  // —— Dynamics / utilitaires (18)
  { id: 'boss-cs3', brand: 'BOSS', model: 'CS-3', type: 'compressor', description: 'Compresseur compact classique', params: knobs.comp3, accent: 'YELLOW_AMBER', folder: 'BOSS_CS-3', style: 'vintage' },
  { id: 'keeley-compressor-plus', brand: 'Keeley', model: 'Compressor Plus', type: 'compressor', description: 'Compresseur boutique transparent', params: knobs.comp4, accent: 'BLUE_SKY', folder: 'Keeley_Compressor_Plus', style: 'boutique' },
  { id: 'wampler-ego', brand: 'Wampler', model: 'Ego Compressor', type: 'compressor', description: 'Compresseur à blend parallèle', params: knobs.comp4, accent: 'ORANGE_BRIGHT', folder: 'Wampler_Ego', style: 'boutique' },
  { id: 'diamond-compressor', brand: 'Diamond', model: 'Compressor', type: 'compressor', description: 'Opto compressor canadien', params: knobs.comp3, accent: 'BLUE_DARK', folder: 'Diamond_Compressor', style: 'boutique' },
  { id: 'mxr-studio-comp', brand: 'MXR', model: 'Studio Compressor', type: 'compressor', description: 'Compresseur studio à ratio', params: knobs.comp4, accent: 'BLUE', folder: 'MXR_Studio_Compressor', style: 'modern' },
  { id: 'orange-squeezer', brand: 'Dan Armstrong', model: 'Orange Squeezer', type: 'compressor', description: 'Compresseur vintage squashy', params: knobs.comp3, accent: 'ORANGE', folder: 'Orange_Squeezer', style: 'vintage' },
  { id: 'origin-cali76', brand: 'Origin Effects', model: 'Cali76 Compact', type: 'compressor', description: '1176 en boîtier pédale', params: knobs.comp4, accent: 'YELLOW_DARK', folder: 'Origin_Cali76', style: 'boutique' },
  { id: 'boss-ns2', brand: 'BOSS', model: 'NS-2', type: 'noisegate', description: 'Noise suppressor classique', params: knobs.gate2, accent: 'GRAY', folder: 'BOSS_NS-2', style: 'vintage' },
  { id: 'tc-sentry', brand: 'TC Electronic', model: 'Sentry', type: 'noisegate', description: 'Noise gate multibande', params: knobs.gate3, accent: 'GRAY_LIGHT', folder: 'TC_Electronic_Sentry', style: 'modern' },
  { id: 'empress-noise-gate', brand: 'Empress', model: 'Noise Gate', type: 'noisegate', description: 'Gate boutique ultra rapide', params: knobs.gate3, accent: 'PURPLE', folder: 'Empress_Noise_Gate', style: 'boutique' },
  { id: 'xotic-ep-booster', brand: 'Xotic', model: 'EP Booster', type: 'boost', description: 'Boost style Echoplex preamp', params: knobs.boost1, accent: 'YELLOW', folder: 'Xotic_EP_Booster', style: 'boutique' },
  { id: 'mxr-micro-amp', brand: 'MXR', model: 'Micro Amp', type: 'boost', description: 'Clean boost transparent', params: knobs.boost1, accent: 'ORANGE_DARK', folder: 'MXR_Micro_Amp', style: 'vintage' },
  { id: 'ehx-lpb1', brand: 'Electro-Harmonix', model: 'LPB-1', type: 'boost', description: 'Linear Power Booster historique', params: knobs.boost1, accent: 'RED', folder: 'Electro-Harmonix_LPB-1', style: 'vintage' },
  { id: 'jackson-bloom', brand: 'Jackson Audio', model: 'Bloom', type: 'boost', description: 'Boost + compressor modulable', params: knobs.comp4, accent: 'GREEN_EMERALD', folder: 'Jackson_Audio_Bloom', style: 'boutique' },
  { id: 'boss-rc5', brand: 'BOSS', model: 'RC-5', type: 'multifx', description: 'Looper compact 99 phrases', params: knobs.looper2, accent: 'RED_BRIGHT', folder: 'BOSS_RC-5', style: 'modern' },
  { id: 'tc-ditto', brand: 'TC Electronic', model: 'Ditto', type: 'multifx', description: 'Looper one-knob minimal', params: knobs.vol1, accent: 'RED_PINK', folder: 'TC_Electronic_Ditto', style: 'modern' },
  { id: 'ehx-720', brand: 'Electro-Harmonix', model: '720 Stereo Looper', type: 'multifx', description: 'Looper stéréo 12 minutes', params: knobs.looper2, accent: 'ORANGE_CORAL', folder: 'Electro-Harmonix_720', style: 'modern' },
  { id: 'ernie-ball-vp-jr', brand: 'Ernie Ball', model: 'VP Jr', type: 'volume', description: 'Pédale de volume passive', params: knobs.vol1, accent: 'GRAY', folder: 'Ernie_Ball_VP_Jr', style: 'vintage' },

  // —— Overdrive (18)
  { id: 'boss-bd2', brand: 'BOSS', model: 'BD-2', type: 'overdrive', description: 'Blues Driver dynamique', params: knobs.drive3, accent: 'BLUE', folder: 'BOSS_BD-2', style: 'vintage' },
  { id: 'boss-od3', brand: 'BOSS', model: 'OD-3', type: 'overdrive', description: 'Dual-stage overdrive', params: knobs.drive3, accent: 'YELLOW_AMBER', folder: 'BOSS_OD-3', style: 'modern' },
  { id: 'ibanez-ts808', brand: 'Ibanez', model: 'TS808', type: 'overdrive', description: 'Tube Screamer original 808', params: knobs.drive3, accent: 'GREEN_DARK', folder: 'Ibanez_TS808', style: 'vintage' },
  { id: 'marshall-bluesbreaker', brand: 'Marshall', model: 'Bluesbreaker', type: 'overdrive', description: 'Overdrive transparent Marshall', params: knobs.drive3, accent: 'ORANGE_BROWN', folder: 'Marshall_Bluesbreaker', style: 'vintage' },
  { id: 'analog-man-kot', brand: 'Analog Man', model: 'King of Tone', type: 'overdrive', description: 'Double overdrive mythique', params: knobs.drive3, accent: 'YELLOW_DARK', folder: 'Analog_Man_King_of_Tone', style: 'boutique' },
  { id: 'paul-cochrane-timmy', brand: 'Paul Cochrane', model: 'Timmy', type: 'overdrive', description: 'Overdrive transparent à stack', params: knobs.drive3, accent: 'ORANGE_BRIGHT', folder: 'Paul_Cochrane_Timmy', style: 'boutique' },
  { id: 'wampler-tumnus', brand: 'Wampler', model: 'Tumnus', type: 'overdrive', description: 'Klon-style compact', params: knobs.drive3, accent: 'YELLOW', folder: 'Wampler_Tumnus', style: 'boutique' },
  { id: 'jhs-morning-glory', brand: 'JHS', model: 'Morning Glory', type: 'overdrive', description: 'Bluesbreaker modernisé', params: knobs.drive3, accent: 'BLUE_LIGHT', folder: 'JHS_Morning_Glory', style: 'boutique' },
  { id: 'bondi-sick-as', brand: 'Bondi', model: 'Sick As', type: 'overdrive', description: 'KOT australien dual channel', params: knobs.drive3, accent: 'RED_LIGHT', folder: 'Bondi_Sick_As', style: 'boutique' },
  { id: 'origin-revivaldrive', brand: 'Origin Effects', model: 'RevivalDRIVE', type: 'overdrive', description: 'Amp-in-a-box vintage British', params: knobs.drive3, accent: 'BROWN', folder: 'Origin_RevivalDRIVE', style: 'boutique' },
  { id: 'friedman-be-od', brand: 'Friedman', model: 'BE-OD', type: 'overdrive', description: 'Brown Eye amp-in-a-box', params: knobs.drive3, accent: 'ORANGE_DARK_AMBER', folder: 'Friedman_BE-OD', style: 'boutique' },
  { id: 'suhr-riot', brand: 'Suhr', model: 'Riot', type: 'distortion', description: 'Distortion high-gain Suhr', params: knobs.dist3, accent: 'RED_DARK', folder: 'Suhr_Riot', style: 'boutique' },
  { id: 'greer-lightspeed', brand: 'Greer', model: 'Lightspeed', type: 'overdrive', description: 'Organic overdrive transparent', params: knobs.drive3, accent: 'YELLOW_BRIGHT', folder: 'Greer_Lightspeed', style: 'boutique' },
  { id: 'jackson-prism', brand: 'Jackson Audio', model: 'Prism', type: 'boost', description: 'Boost / EQ / buffer modulable', params: knobs.drive3, accent: 'PURPLE_BRIGHT', folder: 'Jackson_Audio_Prism', style: 'boutique' },
  { id: 'nobels-odr1', brand: 'Nobels', model: 'ODR-1', type: 'overdrive', description: 'Overdrive allemand légendaire', params: knobs.drive3, accent: 'GREEN_TEAL', folder: 'Nobels_ODR-1', style: 'vintage' },
  { id: 'keeley-katana', brand: 'Keeley', model: 'Katana', type: 'boost', description: 'Clean boost transparent', params: knobs.boost2, accent: 'BLUE_CYAN', folder: 'Keeley_Katana', style: 'boutique' },
  { id: 'jhs-angry-charlie', brand: 'JHS', model: 'Angry Charlie', type: 'distortion', description: 'Marshall-in-a-box JHS', params: knobs.dist3, accent: 'RED', folder: 'JHS_Angry_Charlie', style: 'boutique' },
  { id: 'ethos-overdrive', brand: 'Ethos', model: 'Overdrive', type: 'overdrive', description: 'Overdrive Dumble-inspired', params: knobs.drive3, accent: 'ORANGE_RUST', folder: 'Ethos_Overdrive', style: 'boutique' },

  // —— Distortion / amp-box (12)
  { id: 'boss-hm2', brand: 'BOSS', model: 'HM-2', type: 'distortion', description: 'Heavy Metal buzzsaw suédois', params: knobs.dist3, accent: 'ORANGE_DARK', folder: 'BOSS_HM-2', style: 'vintage' },
  { id: 'boss-mt2', brand: 'BOSS', model: 'MT-2', type: 'distortion', description: 'Metal Zone mid-scoop iconique', params: knobs.dist3, accent: 'GRAY', folder: 'BOSS_MT-2', style: 'vintage' },
  { id: 'marshall-guvnor', brand: 'Marshall', model: "Guv'nor", type: 'distortion', description: 'Distortion Marshall classique', params: knobs.dist3, accent: 'ORANGE_BROWN', folder: 'Marshall_Guvnor', style: 'vintage' },
  { id: 'ehx-metal-muff', brand: 'Electro-Harmonix', model: 'Metal Muff', type: 'distortion', description: 'Distortion métal à scoop', params: knobs.dist3, accent: 'RED_DARK', folder: 'Electro-Harmonix_Metal_Muff', style: 'modern' },
  { id: 'tech21-sansamp-gt2', brand: 'Tech 21', model: 'SansAmp GT2', type: 'distortion', description: 'Amp simulator original', params: knobs.dist3, accent: 'BLUE_INDIGO', folder: 'Tech21_SansAmp_GT2', style: 'modern' },
  { id: 'joyo-american-sound', brand: 'Joyo', model: 'American Sound', type: 'overdrive', description: 'Fender Twin-in-a-box budget', params: knobs.drive3, accent: 'BLUE_SKY', folder: 'Joyo_American_Sound', style: 'modern' },
  { id: 'uafx-dream65', brand: 'Universal Audio', model: "Dream '65", type: 'overdrive', description: 'Twin Reverb UAFX', params: knobs.drive3, accent: 'BLUE_ROYAL', folder: 'UAFX_Dream_65', style: 'modern' },
  { id: 'proco-turbo-rat', brand: 'Pro Co', model: 'Turbo RAT', type: 'distortion', description: 'RAT plus gain et LED clipping', params: knobs.dist3, accent: 'YELLOW', folder: 'ProCo_Turbo_RAT', style: 'vintage' },
  { id: 'mesa-throttle-box', brand: 'Mesa Boogie', model: 'Throttle Box', type: 'distortion', description: 'High-gain Mesa en pédale', params: knobs.dist3, accent: 'RED_BRIGHT', folder: 'Mesa_Throttle_Box', style: 'modern' },
  { id: 'bogner-ecstasy-red', brand: 'Bogner', model: 'Ecstasy Red', type: 'distortion', description: 'Ecstasy amp-in-a-box', params: knobs.dist3, accent: 'RED', folder: 'Bogner_Ecstasy_Red', style: 'boutique' },
  { id: 'boss-ml2', brand: 'BOSS', model: 'ML-2', type: 'distortion', description: 'Metal Core agressif', params: knobs.dist3, accent: 'GRAY_LIGHT', folder: 'BOSS_ML-2', style: 'modern' },
  { id: 'wampler-plexi-drive', brand: 'Wampler', model: 'Plexi-Drive', type: 'overdrive', description: 'Plexi Marshall-in-a-box', params: knobs.drive3, accent: 'ORANGE_DARK_AMBER', folder: 'Wampler_Plexi_Drive', style: 'boutique' },

  // —— Fuzz (12)
  { id: 'tone-bender-mkii', brand: 'Sola Sound', model: 'Tone Bender MKII', type: 'fuzz', description: 'Fuzz britannique légendaire', params: knobs.fuzz3, accent: 'GRAY', folder: 'Tone_Bender_MKII', style: 'vintage' },
  { id: 'mosrite-fuzzrite', brand: 'Mosrite', model: 'Fuzzrite', type: 'fuzz', description: 'Fuzz silicon vintage US', params: knobs.fuzz3, accent: 'RED_PINK', folder: 'Mosrite_Fuzzrite', style: 'vintage' },
  { id: 'ehx-russian-muff', brand: 'Electro-Harmonix', model: 'Green Russian Big Muff', type: 'fuzz', description: 'Big Muff russe sombre', params: knobs.sustain3, accent: 'GREEN_DARK', folder: 'Electro-Harmonix_Green_Russian', style: 'vintage' },
  { id: 'way-huge-swollen-pickle', brand: 'Way Huge', model: 'Swollen Pickle', type: 'fuzz', description: 'Jumbo fuzz à scoop', params: knobs.fuzz3, accent: 'GREEN_WALRUS', folder: 'Way_Huge_Swollen_Pickle', style: 'boutique' },
  { id: 'eqd-hoof', brand: 'EarthQuaker Devices', model: 'Hoof', type: 'fuzz', description: 'Fuzz germanium/silicon hybride', params: knobs.fuzz3, accent: 'YELLOW_FUZZ', folder: 'EQD_Hoof', style: 'boutique' },
  { id: 'catalinbread-fuzzrite', brand: 'Catalinbread', model: 'Fuzzrite', type: 'fuzz', description: 'Recréation Fuzzrite', params: knobs.fuzz3, accent: 'ORANGE_CORAL', folder: 'Catalinbread_Fuzzrite', style: 'boutique' },
  { id: 'death-by-audio-fuzz-war', brand: 'Death By Audio', model: 'Fuzz War', type: 'fuzz', description: 'Fuzz extrême brooklyn', params: knobs.fuzz3, accent: 'RED_BRIGHT', folder: 'Death_By_Audio_Fuzz_War', style: 'boutique' },
  { id: 'fuzzrocious-demon', brand: 'Fuzzrocious', model: 'Demon', type: 'fuzz', description: 'Fuzz gated bizarre', params: knobs.fuzz3, accent: 'PURPLE_MAGENTA', folder: 'Fuzzrocious_Demon', style: 'boutique' },
  { id: 'behringer-sf300', brand: 'Behringer', model: 'SF300', type: 'fuzz', description: 'Super Fuzz budget 3 modes', params: knobs.fuzz3, accent: 'GRAY_LIGHT', folder: 'Behringer_SF300', style: 'modern' },
  { id: 'dunlop-jh-f1', brand: 'Dunlop', model: 'JH-F1 Fuzz Face', type: 'fuzz', description: 'Fuzz Face signature Hendrix', params: knobs.fuzz3, accent: 'RED_DARK', folder: 'Dunlop_JH-F1', style: 'vintage' },
  { id: 'crowther-hot-cake', brand: 'Crowther', model: 'Hot Cake', type: 'overdrive', description: 'Overdrive/fuzz NZ culte', params: knobs.drive3, accent: 'ORANGE', folder: 'Crowther_Hot_Cake', style: 'boutique' },
  { id: 'devi-ever-shoe-gazer', brand: 'Devi Ever', model: 'Shoe Gazer', type: 'fuzz', description: 'Fuzz shoegaze self-oscillant', params: knobs.fuzz3, accent: 'PINK_PHASER', folder: 'Devi_Ever_Shoe_Gazer', style: 'boutique' },

  // —— Modulation (16)
  { id: 'boss-vb2', brand: 'BOSS', model: 'VB-2', type: 'chorus', description: 'Vibrato analogique rare', params: knobs.chorus2, accent: 'PURPLE_CHORUS', folder: 'BOSS_VB-2', style: 'vintage' },
  { id: 'boss-mo2', brand: 'BOSS', model: 'MO-2', type: 'chorus', description: 'Multi Overtone harmonique', params: knobs.chorus3, accent: 'PURPLE_LIGHT', folder: 'BOSS_MO-2', style: 'modern' },
  { id: 'ehx-stereo-pulsar', brand: 'Electro-Harmonix', model: 'Stereo Pulsar', type: 'tremolo', description: 'Tremolo / pan stéréo', params: knobs.trem3, accent: 'ORANGE_WALRUS', folder: 'Electro-Harmonix_Stereo_Pulsar', style: 'modern' },
  { id: 'chase-bliss-gravitas', brand: 'Chase Bliss', model: 'Gravitas', type: 'tremolo', description: 'Tremolo analogique MIDI', params: knobs.trem3, accent: 'PURPLE_DARK', folder: 'Chase_Bliss_Gravitas', style: 'boutique' },
  { id: 'chase-bliss-mood', brand: 'Chase Bliss', model: 'Mood', type: 'delay', description: 'Micro-looper / delay granulaire', params: knobs.delay4, accent: 'PURPLE', folder: 'Chase_Bliss_Mood', style: 'boutique' },
  { id: 'eqd-sea-machine', brand: 'EarthQuaker Devices', model: 'Sea Machine', type: 'chorus', description: 'Chorus animé chorus/vibrato', params: knobs.chorus3, accent: 'BLUE_CYAN', folder: 'EQD_Sea_Machine', style: 'boutique' },
  { id: 'eqd-grand-orbiter', brand: 'EarthQuaker Devices', model: 'Grand Orbiter', type: 'phaser', description: 'Phaser 4 modes', params: knobs.phaser2, accent: 'PURPLE_SLATE', folder: 'EQD_Grand_Orbiter', style: 'boutique' },
  { id: 'eqd-pyramids', brand: 'EarthQuaker Devices', model: 'Pyramids', type: 'flanger', description: 'Flanger stéréo 5 modes', params: knobs.flanger4, accent: 'YELLOW_BRIGHT', folder: 'EQD_Pyramids', style: 'boutique' },
  { id: 'meris-ottobit', brand: 'Meris', model: 'Ottobit Jr', type: 'bitcrusher', description: 'Bitcrusher sequencer', params: knobs.bit3, accent: 'ORANGE_BRIGHT', folder: 'Meris_Ottobit_Jr', style: 'boutique' },
  { id: 'walrus-julianna', brand: 'Walrus Audio', model: 'Julianna', type: 'chorus', description: 'Chorus/vibrato stéréo', params: knobs.chorus3, accent: 'PURPLE_CHORUS', folder: 'Walrus_Audio_Julianna', style: 'boutique' },
  { id: 'strymon-deco', brand: 'Strymon', model: 'Deco', type: 'chorus', description: 'Tape saturation + doubletracker', params: knobs.chorus3, accent: 'ORANGE_BROWN', folder: 'Strymon_Deco', style: 'boutique' },
  { id: 'strymon-mobius', brand: 'Strymon', model: 'Mobius', type: 'multifx', description: 'Modulation multi-algorithmes', params: knobs.multi4, accent: 'BLUE_INDIGO', folder: 'Strymon_Mobius', style: 'boutique' },
  { id: 'tc-corona', brand: 'TC Electronic', model: 'Corona Chorus', type: 'chorus', description: 'Chorus TonePrint', params: knobs.chorus3, accent: 'BLUE_SKY', folder: 'TC_Electronic_Corona', style: 'modern' },
  { id: 'boss-dc2', brand: 'BOSS', model: 'DC-2', type: 'chorus', description: 'Dimension C spatial', params: knobs.chorus2, accent: 'PURPLE_PALE', folder: 'BOSS_DC-2', style: 'vintage' },
  { id: 'fairfield-shallow-water', brand: 'Fairfield Circuitry', model: 'Shallow Water', type: 'chorus', description: 'K-field modulator weird', params: knobs.chorus3, accent: 'GREEN_TEAL', folder: 'Fairfield_Shallow_Water', style: 'boutique' },
  { id: 'mxr-univibe', brand: 'MXR', model: 'Uni-Vibe', type: 'vibe', description: 'Uni-Vibe MXR moderne', params: knobs.vibe3, accent: 'PURPLE_SLATE', folder: 'MXR_Uni-Vibe', style: 'modern' },

  // —— Delay (14)
  { id: 'boss-dm2', brand: 'BOSS', model: 'DM-2', type: 'delay', description: 'Delay analogique bucket brigade', params: knobs.delay3, accent: 'ORANGE_DARK', folder: 'BOSS_DM-2', style: 'vintage' },
  { id: 'boss-dd8', brand: 'BOSS', model: 'DD-8', type: 'delay', description: 'Delay digital polyvalent', params: knobs.delay4, accent: 'ORANGE_BRIGHT', folder: 'BOSS_DD-8', style: 'modern' },
  { id: 'ehx-canyon', brand: 'Electro-Harmonix', model: 'Canyon', type: 'delay', description: 'Delay/looper 11 modes', params: knobs.delay4, accent: 'ORANGE_CORAL', folder: 'Electro-Harmonix_Canyon', style: 'modern' },
  { id: 'catalinbread-belle-epoch', brand: 'Catalinbread', model: 'Belle Epoch', type: 'tapedelay', description: 'Echoplex EP-3 en pédale', params: knobs.delay3, accent: 'YELLOW_DARK', folder: 'Catalinbread_Belle_Epoch', style: 'boutique' },
  { id: 'chase-bliss-tonal-recall', brand: 'Chase Bliss', model: 'Tonal Recall', type: 'delay', description: 'Delay analogique MIDI boutique', params: knobs.delay4, accent: 'BLUE_PURPLE', folder: 'Chase_Bliss_Tonal_Recall', style: 'boutique' },
  { id: 'meris-polymoon', brand: 'Meris', model: 'Polymoon', type: 'delay', description: 'Delay modulé supermoon', params: knobs.delay4, accent: 'PURPLE_BRIGHT', folder: 'Meris_Polymoon', style: 'boutique' },
  { id: 'empress-echosystem', brand: 'Empress', model: 'Echosystem', type: 'delay', description: 'Dual delay 12 algorithmes', params: knobs.delay4, accent: 'PURPLE', folder: 'Empress_Echosystem', style: 'boutique' },
  { id: 'line6-dl4', brand: 'Line 6', model: 'DL4', type: 'delay', description: 'Delay modeler iconique', params: knobs.delay4, accent: 'GREEN_EMERALD', folder: 'Line6_DL4', style: 'modern' },
  { id: 'keeley-caverns', brand: 'Keeley', model: 'Caverns', type: 'delay', description: 'Delay + reverb compact', params: knobs.delay3, accent: 'BLUE_CYAN', folder: 'Keeley_Caverns', style: 'boutique' },
  { id: 'walrus-arp87', brand: 'Walrus Audio', model: 'ARP-87', type: 'delay', description: 'Delay multi-mode boutique', params: knobs.delay4, accent: 'ORANGE_WALRUS', folder: 'Walrus_Audio_ARP-87', style: 'boutique' },
  { id: 'strymon-brigadier', brand: 'Strymon', model: 'Brigadier', type: 'delay', description: 'BBD delay numérique', params: knobs.delay3, accent: 'GREEN_DARK', folder: 'Strymon_Brigadier', style: 'boutique' },
  { id: 'malekko-ekko-616', brand: 'Malekko', model: 'Ekko 616', type: 'delay', description: 'Delay analogique dark', params: knobs.delay3, accent: 'GRAY', folder: 'Malekko_Ekko_616', style: 'boutique' },
  { id: 'ehx-deluxe-memory-man', brand: 'Electro-Harmonix', model: 'Deluxe Memory Man', type: 'delay', description: 'Analog delay + chorus/vibrato', params: knobs.delay4, accent: 'ORANGE', folder: 'Electro-Harmonix_Deluxe_Memory_Man', style: 'vintage' },

  // —— Reverb (12)
  { id: 'boss-rv5', brand: 'BOSS', model: 'RV-5', type: 'reverb', description: 'Reverb numérique polyvalente', params: knobs.reverb3, accent: 'BLUE_SKY', folder: 'BOSS_RV-5', style: 'modern' },
  { id: 'ehx-cathedral', brand: 'Electro-Harmonix', model: 'Cathedral', type: 'reverb', description: 'Reverb 8 modes stéréo', params: knobs.reverb4, accent: 'PURPLE_PALE', folder: 'Electro-Harmonix_Cathedral', style: 'modern' },
  { id: 'meris-mercury7', brand: 'Meris', model: 'Mercury7', type: 'reverb', description: 'Reverb spatiale Blade Runner', params: knobs.reverb4, accent: 'BLUE_INDIGO', folder: 'Meris_Mercury7', style: 'boutique' },
  { id: 'walrus-slo', brand: 'Walrus Audio', model: 'Slö', type: 'reverb', description: 'Reverb ambient multi-texture', params: knobs.reverb3, accent: 'CYAN_WALRUS_AMBIENT', folder: 'Walrus_Audio_Slo', style: 'boutique' },
  { id: 'eqd-afterneath', brand: 'EarthQuaker Devices', model: 'Afterneath', type: 'reverb', description: 'Reverb granulaire cavernous', params: knobs.reverb3, accent: 'GREEN_WALRUS', folder: 'EQD_Afterneath', style: 'boutique' },
  { id: 'eqd-ghost-echo', brand: 'EarthQuaker Devices', model: 'Ghost Echo', type: 'reverb', description: 'Spring-ish ambient pre-delay', params: knobs.reverb3, accent: 'GRAY_LIGHT', folder: 'EQD_Ghost_Echo', style: 'boutique' },
  { id: 'chase-bliss-habit', brand: 'Chase Bliss', model: 'Habit', type: 'delay', description: 'Delay mémoire / experimental', params: knobs.delay4, accent: 'PURPLE_DARK', folder: 'Chase_Bliss_Habit', style: 'boutique' },
  { id: 'obne-dark-star', brand: 'Old Blood Noise', model: 'Dark Star', type: 'reverb', description: 'Reverb pad / freeze', params: knobs.reverb3, accent: 'PURPLE_MAGENTA', folder: 'OBNE_Dark_Star', style: 'boutique' },
  { id: 'caroline-meteore', brand: 'Caroline', model: 'Météore', type: 'reverb', description: 'Reverb lo-fi Caroline', params: knobs.reverb3, accent: 'ORANGE_RUST', folder: 'Caroline_Meteore', style: 'boutique' },
  { id: 'strymon-bluesky', brand: 'Strymon', model: 'blueSky', type: 'reverb', description: 'Reverb plate/room/spring', params: knobs.reverb3, accent: 'BLUE', folder: 'Strymon_blueSky', style: 'boutique' },
  { id: 'eventide-space', brand: 'Eventide', model: 'Space', type: 'reverb', description: 'Reverb Eventide studio', params: knobs.reverb4, accent: 'BLUE_ROYAL', folder: 'Eventide_Space', style: 'boutique' },
  { id: 'neunaber-immerse', brand: 'Neunaber', model: 'Immerse', type: 'reverb', description: 'Reverb stéréo Immersion', params: knobs.reverb3, accent: 'BLUE_PURPLE', folder: 'Neunaber_Immerse', style: 'boutique' },

  // —— Pitch / filter / oddballs (19) → trim to reach ~111 total
  { id: 'ehx-pog2', brand: 'Electro-Harmonix', model: 'POG2', type: 'octaver', description: 'Polyphonic octave generator', params: knobs.oct3, accent: 'ORANGE_CORAL', folder: 'Electro-Harmonix_POG2', style: 'modern' },
  { id: 'ehx-pitch-fork', brand: 'Electro-Harmonix', model: 'Pitch Fork', type: 'pitch', description: 'Pitch shifter polyphonique', params: knobs.pitch3, accent: 'ORANGE_BRIGHT', folder: 'Electro-Harmonix_Pitch_Fork', style: 'modern' },
  { id: 'ehx-mel9', brand: 'Electro-Harmonix', model: 'Mel9', type: 'multifx', description: 'Tape replay machine mellotron', params: knobs.synth4, accent: 'YELLOW_AMBER', folder: 'Electro-Harmonix_Mel9', style: 'modern' },
  { id: 'boss-ps6', brand: 'BOSS', model: 'PS-6', type: 'pitch', description: 'Harmonist intelligent', params: knobs.pitch3, accent: 'BLUE_DARK', folder: 'BOSS_PS-6', style: 'modern' },
  { id: 'tc-sub-n-up', brand: 'TC Electronic', model: "Sub 'N' Up", type: 'octaver', description: 'Octaver polyphonique TonePrint', params: knobs.oct3, accent: 'PURPLE_BRIGHT', folder: 'TC_Electronic_Sub_N_Up', style: 'modern' },
  { id: 'digitech-drop', brand: 'DigiTech', model: 'Drop', type: 'pitch', description: 'Drop tune polyphonic', params: knobs.pitch3, accent: 'RED_BRIGHT', folder: 'DigiTech_Drop', style: 'modern' },
  { id: 'eventide-pitchfactor', brand: 'Eventide', model: 'PitchFactor', type: 'pitch', description: 'Pitch / harmonizer Eventide', params: knobs.pitch3, accent: 'BLUE_INDIGO', folder: 'Eventide_PitchFactor', style: 'boutique' },
  { id: 'boss-oc5', brand: 'BOSS', model: 'OC-5', type: 'octaver', description: 'Octave poly + vintage', params: knobs.oct3, accent: 'ORANGE_DARK', folder: 'BOSS_OC-5', style: 'modern' },
  { id: 'ehx-q-tron', brand: 'Electro-Harmonix', model: 'Q-Tron', type: 'wah', description: 'Envelope filter Mu-Tron style', params: knobs.filter3, accent: 'ORANGE', folder: 'Electro-Harmonix_Q-Tron', style: 'vintage' },
  { id: 'mutron-iii', brand: 'Mu-Tron', model: 'III', type: 'wah', description: 'Envelope filter original', params: knobs.filter3, accent: 'ORANGE_WALRUS', folder: 'Mu-Tron_III', style: 'vintage' },
  { id: 'boss-aw3', brand: 'BOSS', model: 'AW-3', type: 'wah', description: 'Dynamic wah envelope', params: knobs.filter3, accent: 'YELLOW_AMBER', folder: 'BOSS_AW-3', style: 'modern' },
  { id: 'chase-bliss-condor', brand: 'Chase Bliss', model: 'Condor', type: 'eq', description: 'Filter / EQ analogique MIDI', params: knobs.filter3, accent: 'GREEN_EMERALD', folder: 'Chase_Bliss_Condor', style: 'boutique' },
  { id: 'chase-bliss-brothers', brand: 'Chase Bliss', model: 'Brothers', type: 'overdrive', description: 'Dual drive / boost / fuzz', params: knobs.drive3, accent: 'YELLOW_DARK', folder: 'Chase_Bliss_Brothers', style: 'boutique' },
  { id: 'fairfield-accountant', brand: 'Fairfield Circuitry', model: 'The Accountant', type: 'compressor', description: 'Compresseur weird Fairfield', params: knobs.comp3, accent: 'GRAY', folder: 'Fairfield_Accountant', style: 'boutique' },
  { id: 'red-panda-particle', brand: 'Red Panda', model: 'Particle', type: 'delay', description: 'Granular delay / pitch', params: knobs.delay4, accent: 'RED_PINK', folder: 'Red_Panda_Particle', style: 'boutique' },
  { id: 'meris-enzo', brand: 'Meris', model: 'Enzo', type: 'multifx', description: 'Multi-voice synth pedal', params: knobs.synth4, accent: 'PURPLE_BRIGHT', folder: 'Meris_Enzo', style: 'boutique' },
  { id: 'obne-excess', brand: 'Old Blood Noise', model: 'Excess', type: 'distortion', description: 'Distortion + delay/chorus', params: knobs.dist3, accent: 'RED_LIGHT', folder: 'OBNE_Excess', style: 'boutique' },
  { id: 'caroline-somersault', brand: 'Caroline', model: 'Somersault', type: 'chorus', description: 'Lo-fi modulator Caroline', params: knobs.chorus3, accent: 'BLUE_CYAN', folder: 'Caroline_Somersault', style: 'boutique' },
  { id: 'digitech-synth-wah', brand: 'DigiTech', model: 'Synth Wah', type: 'wah', description: 'Envelope filter / synth wah', params: knobs.filter3, accent: 'PURPLE_MAGENTA', folder: 'DigiTech_Synth_Wah', style: 'modern' },
]

console.log(`Specs: ${specs.length} (target ~111 → total ~${89 + specs.length})`)

function paramBlock(names) {
  const lines = names.map((n) => {
    const label = n.charAt(0).toUpperCase() + n.slice(1)
    return `      ${n}: { min: 0, max: 100, default: 50, label: '${label}' }`
  })
  return `{\n${lines.join(',\n')}\n    }`
}

function toTsEntry(s) {
  const style = s.style || 'modern'
  return `  {
    id: '${s.id}',
    brand: '${s.brand.replace(/'/g, "\\'")}',
    model: '${s.model.replace(/'/g, "\\'")}',
    type: '${s.type}',
    description: '${s.description.replace(/'/g, "\\'")}',
    parameters: ${paramBlock(s.params)},
    color: PEDAL_ACCENT_COLORS.${s.accent},
    accentColor: PEDAL_ACCENT_COLORS.${s.accent},
    style: '${style}'
  }`
}

const ts = `// Auto-généré par scripts/generate-pedals-expansion.mjs — ne pas éditer à la main
import type { PedalModel } from './pedals'
import { PEDAL_ACCENT_COLORS } from './pedalAccentColors'

export const pedalsExpansion: PedalModel[] = [
${specs.map(toTsEntry).join(',\n')}
]

export const pedalsExpansionIds = pedalsExpansion.map((p) => p.id)
`

fs.writeFileSync(path.join(frontendSrc, 'pedals-expansion.ts'), ts, 'utf8')
console.log('Wrote pedals-expansion.ts')

// Stub docs + LISTE
const existingListe = fs.readFileSync(path.join(docsPedals, 'LISTE-PEDALES.md'), 'utf8')
const existingFolders = [...existingListe.matchAll(/\| ✅ \| \[([^\]]+)\]/g)].map((m) => m[1])
const existingSet = new Set(existingFolders)

const newRows = specs
  .filter((s) => !existingSet.has(s.folder))
  .map((s) => `| ⏳ | [${s.folder}](./${s.folder}/documentation.md) |`)

const total = existingFolders.length + newRows.length
const documented = existingFolders.length

let liste = `# Liste des pédales — WebAmp

Fichier de suivi. Modèle : [SD1](./SD1/documentation.md).

**Total :** ${total} · **Dossiers :** ${total}/${total} · **Documentées :** ${documented} / ${total} · **Assets locaux :** ${documented} / ${total}

| Statut | Dossier |
|:---:|---|
`

for (const f of existingFolders) {
  liste += `| ✅ | [${f}](./${f}/documentation.md) |\n`
}
for (const row of newRows) {
  liste += row + '\n'
}

liste += `
**Légende :** ✅ documenté (+ assets locaux : photo / page / schéma / manuel) · ⏳ à faire
`

fs.writeFileSync(path.join(docsPedals, 'LISTE-PEDALES.md'), liste, 'utf8')
console.log(`Updated LISTE-PEDALES.md (${total} total, ${newRows.length} new)`)

// Stub documentation folders
for (const s of specs) {
  const dir = path.join(docsPedals, s.folder)
  fs.mkdirSync(dir, { recursive: true })
  const docPath = path.join(dir, 'documentation.md')
  if (!fs.existsSync(docPath)) {
    fs.writeFileSync(
      docPath,
      `# ${s.brand} ${s.model}

**Statut :** stub — à documenter (modèle [SD1](../SD1/documentation.md)).

## Présentation

${s.description}.

## Paramètres UI

${s.params.map((p) => `- **${p}**`).join('\n')}

## Notes

Catalogue WebAmp id : \`${s.id}\` · type : \`${s.type}\`.
`,
      'utf8'
    )
  }
}

// README
fs.writeFileSync(
  path.join(docsPedals, 'README.md'),
  `# Référentiel et documentation des pédales — WebAmp

Documentation technique, schémas, photos et notes de modélisation DSP pour les pédales modélisées dans WebAmp.

Modèle de référence : **BOSS SD-1** ([SD1](./SD1/documentation.md)).

## Progression

- **Total :** ${total}
- **Dossiers :** ${total} / ${total}
- **Documentées (\`documentation.md\`) :** ${documented} / ${total} (stubs ⏳ pour les ajouts)
- **Assets locaux (≥1 fichier hors doc) :** ${documented} / ${total}
- **Liste de suivi :** [LISTE-PEDALES.md](./LISTE-PEDALES.md)

## Structure d’un dossier

1. **\`documentation.md\`** — présentation, caractéristiques, circuit / DSP, calibration
2. **Photos** — produit / Thomann / constructeur
3. **Schémas** — service notes, schematics publics
4. **Pages / manuels** — HTML constructeur, PDF manuels, références wiki

## Utilitaires

- \`download.js\` — téléchargement d’un fichier distant
- \`_fetch_assets.mjs\` — batch d’assets pour dossiers incomplets

## Liste

Voir [LISTE-PEDALES.md](./LISTE-PEDALES.md) (${total} entrées).
`,
  'utf8'
)

console.log('Done.')
