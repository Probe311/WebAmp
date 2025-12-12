import React from 'react'

// Import all generated control components
import { BossDs1Controls, BossDs1Pedal } from './boss-ds1'
import { ProcoRatControls, ProcoRatPedal } from './proco-rat'
import { IbanezTubeScreamerControls, IbanezTubeScreamerPedal } from './ibanez-tube-screamer'
import { ElectroHarmonixBigMuffControls, ElectroHarmonixBigMuffPedal } from './electro-harmonix-big-muff'
import { WalrusAudioDistortionControls, WalrusAudioDistortionPedal } from './walrus-audio-distortion'
import { BossSd1Controls, BossSd1Pedal } from './boss-sd1'
import { FulltoneOcdControls, FulltoneOcdPedal } from './fulltone-ocd'
import { KlonCentaurControls, KlonCentaurPedal } from './klon-centaur'
import { IbanezTubeScreamerMiniControls, IbanezTubeScreamerMiniPedal } from './ibanez-tube-screamer-mini'
import { WalrusAudioDriveControls, WalrusAudioDrivePedal } from './walrus-audio-drive'
import { DunlopFuzzFaceControls, DunlopFuzzFacePedal } from './dunlop-fuzz-face'
import { ZvexFuzzFactoryControls, ZvexFuzzFactoryPedal } from './zvex-fuzz-factory'
import { ElectroHarmonixMuffControls, ElectroHarmonixMuffPedal } from './electro-harmonix-muff'
import { WalrusAudioFuzzControls, WalrusAudioFuzzPedal } from './walrus-audio-fuzz'
import { BossCh1Controls, BossCh1Pedal } from './boss-ch1'
import { ElectroHarmonixSmallCloneControls, ElectroHarmonixSmallClonePedal } from './electro-harmonix-small-clone'
import { WalrusAudioChorusControls, WalrusAudioChorusPedal } from './walrus-audio-chorus'
import { ElectroHarmonixOceans11Controls, ElectroHarmonixOceans11Pedal } from './electro-harmonix-oceans-11'
import { BossCe1Controls, BossCe1Pedal } from './boss-ce1'
import { MxrAnalogChorusControls, MxrAnalogChorusPedal } from './mxr-analog-chorus'
import { BossDd3Controls, BossDd3Pedal } from './boss-dd3'
import { TcElectronicFlashbackControls, TcElectronicFlashbackPedal } from './tc-electronic-flashback'
import { WalrusAudioDelayControls, WalrusAudioDelayPedal } from './walrus-audio-delay'
import { StrymonTimelineControls, StrymonTimelinePedal } from './strymon-timeline'
import { EchoplexTapeDelayControls, EchoplexTapeDelayPedal } from './echoplex-tape-delay'
import { BinsonEchorecControls, BinsonEchorecPedal } from './binson-echorec'
import { MemoryManDelayControls, MemoryManDelayPedal } from './memory-man-delay'
import { RolandSpaceEchoControls, RolandSpaceEchoPedal } from './roland-space-echo'
import { TcDelayControls, TcDelayPedal } from './tc-delay'
import { BossRv6Controls, BossRv6Pedal } from './boss-rv6'
import { ElectroHarmonixHolyGrailControls, ElectroHarmonixHolyGrailPedal } from './electro-harmonix-holy-grail'
import { WalrusAudioReverbControls, WalrusAudioReverbPedal } from './walrus-audio-reverb'
import { WalrusAudioAmbientControls, WalrusAudioAmbientPedal } from './walrus-audio-ambient'
import { StrymonBigskyControls, StrymonBigskyPedal } from './strymon-bigsky'
import { BossBf3Controls, BossBf3Pedal } from './boss-bf3'
import { ElectroHarmonixElectricMistressControls, ElectroHarmonixElectricMistressPedal } from './electro-harmonix-electric-mistress'
import { WalrusAudioFlangerControls, WalrusAudioFlangerPedal } from './walrus-audio-flanger'
import { MooerELadyControls, MooerELadyPedal } from './mooer-e-lady'
import { MxrFlanger117Controls, MxrFlanger117Pedal } from './mxr-flanger-117'
import { BossTr2Controls, BossTr2Pedal } from './boss-tr2'
import { WalrusAudioTremoloControls, WalrusAudioTremoloPedal } from './walrus-audio-tremolo'
import { FulltoneSupatremControls, FulltoneSupatremPedal } from './fulltone-supatrem'
import { StrymonFlintControls, StrymonFlintPedal } from './strymon-flint'
import { BossPh3Controls, BossPh3Pedal } from './boss-ph3'
import { ElectroHarmonixSmallStoneControls, ElectroHarmonixSmallStonePedal } from './electro-harmonix-small-stone'
import { MooerPhaserControls, MooerPhaserPedal } from './mooer-phaser'
import { WalrusAudioPhaserControls, WalrusAudioPhaserPedal } from './walrus-audio-phaser'
import { MxrPhase90Controls, MxrPhase90Pedal } from './mxr-phase90'
import { BossGe7Controls, BossGe7Pedal } from './boss-ge7'
import { Mxr10BandEqControls, Mxr10BandEqPedal } from './mxr-10-band-eq'
import { SourceAudioProgrammableEqControls, SourceAudioProgrammableEqPedal } from './source-audio-programmable-eq'
import { EmpressParaeqControls, EmpressParaeqPedal } from './empress-paraeq'
import { VoxV847WahControls, VoxV847WahPedal } from './vox-v847-wah'
import { CryBabyWahControls, CryBabyWahPedal } from './cry-baby-wah'
import { SlashWahSw95Controls, SlashWahSw95Pedal } from './slash-wah-sw95'
import { EvhWahControls, EvhWahPedal } from './evh-wah'
import { Kh95WahControls, Kh95WahPedal } from './kh95-wah'
import { RmcWahControls, RmcWahPedal } from './rmc-wah'
import { PowerBoosterControls, PowerBoosterPedal } from './power-booster'
import { LightBoostControls, LightBoostPedal } from './light-boost'
import { MxrMc402Controls, MxrMc402Pedal } from './mxr-mc402'
import { MxrDynaCompControls, MxrDynaCompPedal } from './mxr-dyna-comp'
import { OctaviaFuzzControls, OctaviaFuzzPedal } from './octavia-fuzz'
import { UnivibeControls, UnivibePedal } from './univibe'
import { DigitechWhammyControls, DigitechWhammyPedal } from './digitech-whammy'
import { LeslieRotaryControls, LeslieRotaryPedal } from './leslie-rotary'
import { BossVolumeExpressionControls, BossVolumeExpressionPedal } from './boss-volume-expression'
import { NoiseGateControls, NoiseGatePedal } from './noise-gate'
import { TcGmajor2Controls, TcGmajor2Pedal } from './tc-gmajor2'
import { IbanezJeminiControls, IbanezJeminiPedal } from './ibanez-jemini'
import { EventideHarmonizerControls, EventideHarmonizerPedal } from './eventide-harmonizer'
import { MorleyBadHorsieControls, MorleyBadHorsiePedal } from './morley-bad-horsie'
import { SatchuratorControls, SatchuratorPedal } from './satchurator'
import { VoxTimeMachineControls, VoxTimeMachinePedal } from './vox-time-machine'
import { DunlopCrybabyClassicControls, DunlopCrybabyClassicPedal } from './dunlop-crybaby-classic'
import { KillswitchStutterControls, KillswitchStutterPedal } from './killswitch-stutter'
import { TrebleBoosterControls, TrebleBoosterPedal } from './treble-booster'
import { MesaGridSlammerControls, MesaGridSlammerPedal } from './mesa-grid-slammer'
import { BossCe2Controls, BossCe2Pedal } from './boss-ce2'
import { BossOd1Controls, BossOd1Pedal } from './boss-od1'
import { JhsAtDriveControls, JhsAtDrivePedal } from './jhs-at-drive'
import { NeunaberReverbControls, NeunaberReverbPedal } from './neunaber-reverb'
import { BossTu3Controls, BossTu3Pedal } from './boss-tu3'
import { MoogMfRingControls, MoogMfRingPedal } from './moog-mf-ring'
import { ZvexLoFiJunkyControls, ZvexLoFiJunkyPedal } from './zvex-lo-fi-junky'
import { RedPandaBitmapControls, RedPandaBitmapPedal } from './red-panda-bitmap'
import { StrymonElCapistanControls, StrymonElCapistanPedal } from './strymon-el-capistan'
import { SurfybearMetalControls, SurfybearMetalPedal } from './surfybear-metal'
import { StrymonBigskyShimmerControls, StrymonBigskyShimmerPedal } from './strymon-bigsky-shimmer'

import type { PedalComponentProps } from './types'

// Export des composants de contrôles (pour compatibilité avec l'ancien système)
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
  'walrus-audio-ambient': WalrusAudioAmbientControls,
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

// Export des composants complets de pédales (nouveau système)
export const pedalComponents: Record<string, React.FC<PedalComponentProps>> = {
  'boss-ds1': BossDs1Pedal,
  'boss-sd1': BossSd1Pedal,
  'boss-dd3': BossDd3Pedal,
  'boss-ch1': BossCh1Pedal,
  'boss-ce1': BossCe1Pedal,
  'boss-ce2': BossCe2Pedal,
  'boss-bf3': BossBf3Pedal,
  'boss-ph3': BossPh3Pedal,
  'boss-rv6': BossRv6Pedal,
  'boss-tr2': BossTr2Pedal,
  'boss-ge7': BossGe7Pedal,
  'ibanez-tube-screamer': IbanezTubeScreamerPedal,
  'proco-rat': ProcoRatPedal,
  'electro-harmonix-big-muff': ElectroHarmonixBigMuffPedal,
  'electro-harmonix-small-clone': ElectroHarmonixSmallClonePedal,
  'electro-harmonix-holy-grail': ElectroHarmonixHolyGrailPedal,
  'walrus-audio-distortion': WalrusAudioDistortionPedal,
  'walrus-audio-drive': WalrusAudioDrivePedal,
  'walrus-audio-fuzz': WalrusAudioFuzzPedal,
  'walrus-audio-chorus': WalrusAudioChorusPedal,
  'walrus-audio-delay': WalrusAudioDelayPedal,
  'walrus-audio-reverb': WalrusAudioReverbPedal,
  'klon-centaur': KlonCentaurPedal,
  'fulltone-ocd': FulltoneOcdPedal,
  'dunlop-fuzz-face': DunlopFuzzFacePedal,
  'zvex-fuzz-factory': ZvexFuzzFactoryPedal,
  'strymon-flint': StrymonFlintPedal,
  'electro-harmonix-oceans-11': ElectroHarmonixOceans11Pedal,
  'mxr-10-band-eq': Mxr10BandEqPedal,
  'mxr-phase90': MxrPhase90Pedal,
  'mxr-analog-chorus': MxrAnalogChorusPedal,
  'mxr-dyna-comp': MxrDynaCompPedal,
  'mxr-flanger-117': MxrFlanger117Pedal,
  'boss-od1': BossOd1Pedal,
  'electro-harmonix-small-stone': ElectroHarmonixSmallStonePedal,
  'strymon-el-capistan': StrymonElCapistanPedal,
  'strymon-timeline': StrymonTimelinePedal,
  'strymon-bigsky': StrymonBigskyPedal,
  'neunaber-reverb': NeunaberReverbPedal,
  'walrus-audio-phaser': WalrusAudioPhaserPedal,
  'walrus-audio-tremolo': WalrusAudioTremoloPedal,
  'walrus-audio-flanger': WalrusAudioFlangerPedal,
  'walrus-audio-ambient': WalrusAudioAmbientPedal,
  'mooer-phaser': MooerPhaserPedal,
  'mooer-e-lady': MooerELadyPedal,
  'electro-harmonix-electric-mistress': ElectroHarmonixElectricMistressPedal,
  'fulltone-supatrem': FulltoneSupatremPedal,
  'ibanez-tube-screamer-mini': IbanezTubeScreamerMiniPedal,
  'jhs-at-drive': JhsAtDrivePedal,
  'mesa-grid-slammer': MesaGridSlammerPedal,
  'satchurator': SatchuratorPedal,
  'treble-booster': TrebleBoosterPedal,
  'power-booster': PowerBoosterPedal,
  'light-boost': LightBoostPedal,
  'octavia-fuzz': OctaviaFuzzPedal,
  'electro-harmonix-muff': ElectroHarmonixMuffPedal,
  'mxr-mc402': MxrMc402Pedal,
  'univibe': UnivibePedal,
  'ibanez-jemini': IbanezJeminiPedal,
  'vox-time-machine': VoxTimeMachinePedal,
  'memory-man-delay': MemoryManDelayPedal,
  'tc-delay': TcDelayPedal,
  'echoplex-tape-delay': EchoplexTapeDelayPedal,
  'binson-echorec': BinsonEchorecPedal,
  'roland-space-echo': RolandSpaceEchoPedal,
  'leslie-rotary': LeslieRotaryPedal,
  'digitech-whammy': DigitechWhammyPedal,
  'boss-volume-expression': BossVolumeExpressionPedal,
  'noise-gate': NoiseGatePedal,
  'killswitch-stutter': KillswitchStutterPedal,
  'morley-bad-horsie': MorleyBadHorsiePedal,
  'tc-electronic-flashback': TcElectronicFlashbackPedal,
  'tc-gmajor2': TcGmajor2Pedal,
  'vox-v847-wah': VoxV847WahPedal,
  'cry-baby-wah': CryBabyWahPedal,
  'source-audio-programmable-eq': SourceAudioProgrammableEqPedal,
  'empress-paraeq': EmpressParaeqPedal,
  'slash-wah-sw95': SlashWahSw95Pedal,
  'evh-wah': EvhWahPedal,
  'kh95-wah': Kh95WahPedal,
  'rmc-wah': RmcWahPedal,
  'dunlop-crybaby-classic': DunlopCrybabyClassicPedal,
  'eventide-harmonizer': EventideHarmonizerPedal,
  'moog-mf-ring': MoogMfRingPedal,
  'zvex-lo-fi-junky': ZvexLoFiJunkyPedal,
  'red-panda-bitmap': RedPandaBitmapPedal,
  'surfybear-metal': SurfybearMetalPedal,
  'strymon-bigsky-shimmer': StrymonBigskyShimmerPedal,
  'boss-tu3': BossTu3Pedal,
  // Toutes les pédales sont maintenant refactorisées !
}

export type PedalComponentsMap = typeof pedalComponents

// Export du composant de trame
export { PedalFrame, determinePedalSize } from './PedalFrame'
export type { PedalFrameProps } from './PedalFrame'

