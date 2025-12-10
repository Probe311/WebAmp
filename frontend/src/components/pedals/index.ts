import React from 'react'

// Import all generated control components
import { BossDs1Controls } from './boss-ds1'
import { ProcoRatControls } from './proco-rat'
import { IbanezTubeScreamerControls } from './ibanez-tube-screamer'
import { ElectroHarmonixBigMuffControls } from './electro-harmonix-big-muff'
import { WalrusAudioDistortionControls } from './walrus-audio-distortion'
import { BossSd1Controls } from './boss-sd1'
import { FulltoneOcdControls } from './fulltone-ocd'
import { KlonCentaurControls } from './klon-centaur'
import { IbanezTubeScreamerMiniControls } from './ibanez-tube-screamer-mini'
import { WalrusAudioDriveControls } from './walrus-audio-drive'
import { DunlopFuzzFaceControls } from './dunlop-fuzz-face'
import { ZvexFuzzFactoryControls } from './zvex-fuzz-factory'
import { ElectroHarmonixMuffControls } from './electro-harmonix-muff'
import { WalrusAudioFuzzControls } from './walrus-audio-fuzz'
import { BossCh1Controls } from './boss-ch1'
import { ElectroHarmonixSmallCloneControls } from './electro-harmonix-small-clone'
import { WalrusAudioChorusControls } from './walrus-audio-chorus'
import { ElectroHarmonixOceans11Controls } from './electro-harmonix-oceans-11'
import { BossCe1Controls } from './boss-ce1'
import { MxrAnalogChorusControls } from './mxr-analog-chorus'
import { BossDd3Controls } from './boss-dd3'
import { TcElectronicFlashbackControls } from './tc-electronic-flashback'
import { WalrusAudioDelayControls } from './walrus-audio-delay'
import { StrymonTimelineControls } from './strymon-timeline'
import { EchoplexTapeDelayControls } from './echoplex-tape-delay'
import { BinsonEchorecControls } from './binson-echorec'
import { MemoryManDelayControls } from './memory-man-delay'
import { RolandSpaceEchoControls } from './roland-space-echo'
import { TcDelayControls } from './tc-delay'
import { BossRv6Controls } from './boss-rv6'
import { ElectroHarmonixHolyGrailControls } from './electro-harmonix-holy-grail'
import { WalrusAudioReverbControls } from './walrus-audio-reverb'
import { StrymonBigskyControls } from './strymon-bigsky'
import { BossBf3Controls } from './boss-bf3'
import { ElectroHarmonixElectricMistressControls } from './electro-harmonix-electric-mistress'
import { WalrusAudioFlangerControls } from './walrus-audio-flanger'
import { MooerELadyControls } from './mooer-e-lady'
import { MxrFlanger117Controls } from './mxr-flanger-117'
import { BossTr2Controls } from './boss-tr2'
import { WalrusAudioTremoloControls } from './walrus-audio-tremolo'
import { FulltoneSupatremControls } from './fulltone-supatrem'
import { StrymonFlintControls } from './strymon-flint'
import { BossPh3Controls } from './boss-ph3'
import { ElectroHarmonixSmallStoneControls } from './electro-harmonix-small-stone'
import { MooerPhaserControls } from './mooer-phaser'
import { WalrusAudioPhaserControls } from './walrus-audio-phaser'
import { MxrPhase90Controls } from './mxr-phase90'
import { BossGe7Controls } from './boss-ge7'
import { Mxr10BandEqControls } from './mxr-10-band-eq'
import { SourceAudioProgrammableEqControls } from './source-audio-programmable-eq'
import { EmpressParaeqControls } from './empress-paraeq'
import { VoxV847WahControls } from './vox-v847-wah'
import { CryBabyWahControls } from './cry-baby-wah'
import { SlashWahSw95Controls } from './slash-wah-sw95'
import { EvhWahControls } from './evh-wah'
import { Kh95WahControls } from './kh95-wah'
import { RmcWahControls } from './rmc-wah'
import { PowerBoosterControls } from './power-booster'
import { LightBoostControls } from './light-boost'
import { MxrMc402Controls } from './mxr-mc402'
import { MxrDynaCompControls } from './mxr-dyna-comp'
import { OctaviaFuzzControls } from './octavia-fuzz'
import { UnivibeControls } from './univibe'
import { DigitechWhammyControls } from './digitech-whammy'
import { LeslieRotaryControls } from './leslie-rotary'
import { BossVolumeExpressionControls } from './boss-volume-expression'
import { NoiseGateControls } from './noise-gate'
import { TcGmajor2Controls } from './tc-gmajor2'
import { IbanezJeminiControls } from './ibanez-jemini'
import { EventideHarmonizerControls } from './eventide-harmonizer'
import { MorleyBadHorsieControls } from './morley-bad-horsie'
import { SatchuratorControls } from './satchurator'
import { VoxTimeMachineControls } from './vox-time-machine'
import { DunlopCrybabyClassicControls } from './dunlop-crybaby-classic'
import { KillswitchStutterControls } from './killswitch-stutter'
import { TrebleBoosterControls } from './treble-booster'
import { MesaGridSlammerControls } from './mesa-grid-slammer'
import { BossCe2Controls } from './boss-ce2'
import { BossOd1Controls } from './boss-od1'
import { JhsAtDriveControls } from './jhs-at-drive'
import { NeunaberReverbControls } from './neunaber-reverb'
import { BossTu3Controls } from './boss-tu3'
import { MoogMfRingControls } from './moog-mf-ring'
import { ZvexLoFiJunkyControls } from './zvex-lo-fi-junky'
import { RedPandaBitmapControls } from './red-panda-bitmap'
import { StrymonElCapistanControls } from './strymon-el-capistan'
import { SurfybearMetalControls } from './surfybear-metal'
import { StrymonBigskyShimmerControls } from './strymon-bigsky-shimmer'

import type { PedalComponentProps } from './boss-ds1'

export const pedalControls: Record<string, React.FC<PedalComponentProps>> = {
  'boss-ds1': BossDs1Controls,
  'proco-rat': ProcoRatControls,
  'ibanez-tube-screamer': IbanezTubeScreamerControls,
  'electro-harmonix-big-muff': ElectroHarmonixBigMuffControls,
  'walrus-audio-distortion': WalrusAudioDistortionControls,
  'boss-sd1': BossSd1Controls,
  'fulltone-ocd': FulltoneOcdControls,
  'klon-centaur': KlonCentaurControls,
  'ibanez-tube-screamer-mini': IbanezTubeScreamerMiniControls,
  'walrus-audio-drive': WalrusAudioDriveControls,
  'dunlop-fuzz-face': DunlopFuzzFaceControls,
  'zvex-fuzz-factory': ZvexFuzzFactoryControls,
  'electro-harmonix-muff': ElectroHarmonixMuffControls,
  'walrus-audio-fuzz': WalrusAudioFuzzControls,
  'boss-ch1': BossCh1Controls,
  'electro-harmonix-small-clone': ElectroHarmonixSmallCloneControls,
  'walrus-audio-chorus': WalrusAudioChorusControls,
  'electro-harmonix-oceans-11': ElectroHarmonixOceans11Controls,
  'boss-ce1': BossCe1Controls,
  'mxr-analog-chorus': MxrAnalogChorusControls,
  'boss-dd3': BossDd3Controls,
  'tc-electronic-flashback': TcElectronicFlashbackControls,
  'walrus-audio-delay': WalrusAudioDelayControls,
  'strymon-timeline': StrymonTimelineControls,
  'echoplex-tape-delay': EchoplexTapeDelayControls,
  'binson-echorec': BinsonEchorecControls,
  'memory-man-delay': MemoryManDelayControls,
  'roland-space-echo': RolandSpaceEchoControls,
  'tc-delay': TcDelayControls,
  'boss-rv6': BossRv6Controls,
  'electro-harmonix-holy-grail': ElectroHarmonixHolyGrailControls,
  'walrus-audio-reverb': WalrusAudioReverbControls,
  'strymon-bigsky': StrymonBigskyControls,
  'boss-bf3': BossBf3Controls,
  'electro-harmonix-electric-mistress': ElectroHarmonixElectricMistressControls,
  'walrus-audio-flanger': WalrusAudioFlangerControls,
  'mooer-e-lady': MooerELadyControls,
  'mxr-flanger-117': MxrFlanger117Controls,
  'boss-tr2': BossTr2Controls,
  'walrus-audio-tremolo': WalrusAudioTremoloControls,
  'fulltone-supatrem': FulltoneSupatremControls,
  'strymon-flint': StrymonFlintControls,
  'boss-ph3': BossPh3Controls,
  'electro-harmonix-small-stone': ElectroHarmonixSmallStoneControls,
  'mooer-phaser': MooerPhaserControls,
  'walrus-audio-phaser': WalrusAudioPhaserControls,
  'mxr-phase90': MxrPhase90Controls,
  'boss-ge7': BossGe7Controls,
  'mxr-10-band-eq': Mxr10BandEqControls,
  'source-audio-programmable-eq': SourceAudioProgrammableEqControls,
  'empress-paraeq': EmpressParaeqControls,
  'vox-v847-wah': VoxV847WahControls,
  'cry-baby-wah': CryBabyWahControls,
  'slash-wah-sw95': SlashWahSw95Controls,
  'evh-wah': EvhWahControls,
  'kh95-wah': Kh95WahControls,
  'rmc-wah': RmcWahControls,
  'power-booster': PowerBoosterControls,
  'light-boost': LightBoostControls,
  'mxr-mc402': MxrMc402Controls,
  'mxr-dyna-comp': MxrDynaCompControls,
  'octavia-fuzz': OctaviaFuzzControls,
  'univibe': UnivibeControls,
  'digitech-whammy': DigitechWhammyControls,
  'leslie-rotary': LeslieRotaryControls,
  'boss-volume-expression': BossVolumeExpressionControls,
  'noise-gate': NoiseGateControls,
  'tc-gmajor2': TcGmajor2Controls,
  'ibanez-jemini': IbanezJeminiControls,
  'eventide-harmonizer': EventideHarmonizerControls,
  'morley-bad-horsie': MorleyBadHorsieControls,
  'satchurator': SatchuratorControls,
  'vox-time-machine': VoxTimeMachineControls,
  'dunlop-crybaby-classic': DunlopCrybabyClassicControls,
  'killswitch-stutter': KillswitchStutterControls,
  'treble-booster': TrebleBoosterControls,
  'mesa-grid-slammer': MesaGridSlammerControls,
  'boss-ce2': BossCe2Controls,
  'boss-od1': BossOd1Controls,
  'jhs-at-drive': JhsAtDriveControls,
  'neunaber-reverb': NeunaberReverbControls,
  'boss-tu3': BossTu3Controls,
  'moog-mf-ring': MoogMfRingControls,
  'zvex-lo-fi-junky': ZvexLoFiJunkyControls,
  'red-panda-bitmap': RedPandaBitmapControls,
  'strymon-el-capistan': StrymonElCapistanControls,
  'surfybear-metal': SurfybearMetalControls,
  'strymon-bigsky-shimmer': StrymonBigskyShimmerControls,
}

export type PedalControlsMap = typeof pedalControls

