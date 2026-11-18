# Référence matériel — WebAmp Studio (marque blanche)

Document généré par `frontend/scripts/generate-equipment-reference.ts` depuis les
définitions réellement rendues par le design system (`frontend/src/equipment/`)
et les fiches constructeur relevées en ligne (recherche des lots L1–L5, URLs
vérifiées en HTTP le 15 novembre 2026).

## Règles de marque blanche

- Aucune marque réelle sur l'appareil : `brandName` = `WebAmp Studio` (pédales)
  ou `WebAmp` (amplis).
- Marque et modèle d'origine conservés en métadonnée interne
  `branding.sourceName` / `branding.sourceUrl` — jamais rendus à l'écran.
- Nomenclature : `WA-<code><n>` (pédales), `WA-<n><H|C> <SÉRIE>` (amplis).
- Ids de paramètres audio inchangés : `PedalboardEngine`, `audio/ampToneStack.ts`,
  `config.ts` et les presets ne sont pas impactés.

## Méthode de recherche

Recherche **par famille de hardware** (BOSS compact, Ibanez Tube Screamer,
EHX/Big Muff, MXR/Dunlop, Pro Co, boîtiers boutique JHS/Wampler/EQD/Strymon/
Walrus/Chase Bliss, mini-pédales Mooer, fuzz vintage, delays analogiques,
tape echoes, grosses boîtes reverb, égaliseurs graphiques et paramétriques,
wah signature Dunlop/Vox, pédales de volume), puis fiche **modèle par modèle** :
couleur et finition du boîtier, matériau, style de knobs, couleur de LED, type
de footswitch, libellés sérigraphiés réels et URL constructeur.

Chaque URL conservée a été ouverte en HTTP : une 404, une page hors sujet ou une
page de modèle voisin est soit remplacée, soit marquée ⚠ (voir la section des
doutes). Les teintes sont ramenées aux tokens disponibles (`EquipmentColorId`) :
ce sont des équivalents, pas des Pantone.

## Lots L1–L5 (186 modèles)

186 modèles — 152 avec source en ligne (dont 29 pages gamme), 20 modèles maison WebAmp, 14 sans source officielle,
12 URLs encore douteuses.

| # | Code WebAmp | Modèle source (interne) | Type | Châssis | Boîtier | Knobs / LED | Contrôles | Source |
|---|---|---|---|---|---|---|---|---|
| 1 | DISTORTION DS-1 | BOSS DS-1 | distortion | compact | webamp-orange / gloss | black-silver / red | knobs: Distortion, Tone, Level | https://www.boss.info/global/products/ds-1 |
| 2 | DISTORTION DS-2 | Pro Co RAT | distortion | compact-wide | black / powder-coated | black-silver / red | knobs: DISTORTION, FILTER, VOLUME | https://en.wikipedia.org/wiki/Pro_Co_RAT ⚠ |
| 3 | DISTORTION DS-3 | Ibanez Tube Screamer TS9 | distortion | compact | british-racing-green / gloss | chrome / red | knobs: DRIVE, Level, Tone | https://www.ibanez.com/usa/products/detail/ts9_99.html |
| 4 | DISTORTION DS-4 | Electro-Harmonix Big Muff Pi | distortion | compact-wide | silver / satin | black-silver / red | knobs: Sustain, Tone, Volume | https://www.ehx.com/products/big-muff-pi/ |
| 5 | Fundamental Distortion | Walrus Audio Fundamental Distortion | distortion | compact-wide | black / matte | faders / white | faders: Gain, Tone, Vol · sélecteurs: Mode (DARK/SI/LED) | https://www.walrusaudio.com/collections/fundamental-series |
| 6 | OVER DRIVE OD-1 | BOSS SD-1 | overdrive | compact | yellow / gloss | black-silver / red | knobs: Drive, Tone, Level | https://www.boss.info/global/products/sd-1 |
| 7 | OVER DRIVE OD-2 | Fulltone OCD | overdrive | compact | cream-ivory / gloss | chrome / blue | knobs: DRIVE, TONE, VOLUME · sélecteurs: Mode (HP/LP) | https://www.fulltoneusa.com/products/ocd-v2 |
| 8 | OVER DRIVE OD-3 | Klon Centaur | overdrive | compact | gold / gold-plated | vintage-round / red | knobs: GAIN, TREBLE, OUTPUT | https://en.wikipedia.org/wiki/Klon_Centaur ⚠ |
| 9 | OVER DRIVE OD-4 | Ibanez TS Mini | overdrive | mini | british-racing-green / gloss | chrome / red | knobs: Drive, Level, Tone | https://www.ibanez.com/usa/products/detail/ts_mini_01.html |
| 10 | Fundamental Drive | Walrus Audio Fundamental Drive | overdrive | compact-wide | black / matte | faders / white | faders: Gain, Tone, Vol · sélecteurs: Mode (SMOOTH/CRUNCH/BRIGHT) | https://www.walrusaudio.com/collections/fundamental-series |
| 11 | FUZZ FZ-1 | Dunlop Fuzz Face | fuzz | compact-wide | grey / aged | vintage-round / sans LED | knobs: Fuzz, Volume | https://www.jimdunlop.com/products/electronics *(page gamme)* |
| 12 | FUZZ FZ-2 | ZVEX Fuzz Factory | fuzz | compact-wide | chrome / polished | chrome / red | knobs: Gate, Comp, Drive, Stab, Volume | https://www.zvex.com/guitar-pedals/fuzz-factory-vertical-guitar-effects-pedal-2022 |
| 13 | FUZZ FZ-3 | Electro-Harmonix Big Muff | fuzz | compact-wide | cream-ivory / satin | black-silver / red | knobs: Sustain, Tone, Volume | https://www.ehx.com/products/big-muff-pi/ |
| 14 | Fundamental Fuzz | Walrus Audio Fundamental Fuzz | fuzz | compact-wide | black / matte | faders / white | faders: Gain, Tone, Vol · sélecteurs: Mode (GATE/CLASSIC/MID+) | https://www.walrusaudio.com/collections/fundamental-series |
| 15 | CHORUS CH-1 | BOSS CH-1 | chorus | compact | baby-blue / gloss | black-silver / red | knobs: Rate, Depth, E.LEVEL, Level | https://www.boss.info/global/products/ch-1 |
| 16 | CHORUS CH-2 | Electro-Harmonix Small Clone | chorus | compact-wide | silver / satin | black-silver / red | knobs: Rate, Depth · sélecteurs: Mode (CHORUS/VIBRATO) | https://www.ehx.com/products/small-clone/ |
| 17 | Fundamental Chorus | Walrus Audio Fundamental Chorus | chorus | compact-wide | black / matte | faders / white | faders: Rate, Depth, Mix · sélecteurs: Mode (LIGHT/MEDIUM/HEAVY) | https://www.walrusaudio.com/products/fundamental-series-chorus |
| 18 | CHORUS CH-4 | Electro-Harmonix Oceans 11 | chorus | compact-wide | white / gloss | chrome / blue | knobs: Rate, Depth, Mix · sélecteurs: Mode (SPRING/HALL/PLATE/MOD/REVERSE/ECHO/SHIMMER/DYNA/POLY/AUTO/MANUAL) | https://www.ehx.com/products/oceans-11/ |
| 19 | DELAY DL-1 | BOSS DD-3 | delay | compact | white / gloss | black-silver / red | knobs: Time, Feedback, Level · sélecteurs: Memory (S/M/L) | https://www.boss.info/global/products/dd-3 |
| 20 | DELAY DL-2 | TC Electronic Flashback | delay | compact | white / gloss | chrome / blue | knobs: Time, Feedback, Mix | https://tcelectronic.com/en/products/0709-AGB ⚠ |
| 21 | Fundamental Delay | Walrus Audio Fundamental Delay | delay | compact-wide | black / matte | faders / white | faders: Time, Feedback, Mix · sélecteurs: Mode (DIGITAL/ANALOG/REVERSE) | https://www.walrusaudio.com/collections/fundamental-series *(page gamme)* |
| 22 | DELAY DL-4 | Strymon Timeline | delay | compact-wide | black / matte | metal / blue | knobs: Time, Feedback, Mix | https://www.strymon.net/product/timeline |
| 23 | REVERB RV-1 | BOSS RV-6 | reverb | compact | white / gloss | black-silver / red | knobs: Decay, Tone, Level · sélecteurs: Mode (HALL/ROOM/PLATE/MODULATE/SHIMMER/DYNAMIC/+DELAY/SPRING) | https://www.boss.info/global/products/rv-6 |
| 24 | REVERB RV-2 | Electro-Harmonix Holy Grail | reverb | mini | silver / satin | chrome / red | knobs: Reverb | https://www.ehx.com/products/holy-grail/ |
| 25 | Fundamental Reverb | Walrus Audio Fundamental Reverb | reverb | compact-wide | black / matte | faders / white | faders: Decay, Tone, Mix · sélecteurs: Mode (HALL/SPRING/PLATE) | https://www.walrusaudio.com/collections/fundamental-series *(page gamme)* |
| 26 | Fundamental Ambient | Walrus Audio Fundamental Ambient | reverb | compact-wide | black / matte | faders / white | faders: Decay, Tone, Mix · sélecteurs: Mode (DEEP/LUSH/HAZE) | https://www.walrusaudio.com/collections/fundamental-series *(page gamme)* |
| 27 | REVERB RV-5 | Strymon BigSky | reverb | compact-wide | black / matte | metal / blue | knobs: Decay, Tone, Mix | https://www.strymon.net/product/bigsky |
| 28 | FLANGER FL-1 | BOSS BF-3 | flanger | compact | silver / satin | black-silver / red | knobs: Rate, Depth, Manual, Resonance | https://www.boss.info/global/products/bf-3 |
| 29 | FLANGER FL-2 | Electro-Harmonix Electric Mistress | flanger | compact-wide | chrome / polished | chrome / red | knobs: Rate, Range, Color | https://www.ehx.com/products/stereo-electric-mistress/ |
| 30 | Fundamental Flanger | Walrus Audio Fundamental Flanger | flanger | compact-wide | black / matte | faders / white | faders: Rate, Depth, Feedback · sélecteurs: Mode (LIGHT/MEDIUM/HEAVY) | https://www.walrusaudio.com/collections/fundamental-series |
| 31 | FLANGER FL-4 | Mooer E-Lady | flanger | mini | baby-blue / gloss | mini / blue | knobs: Rate, Range, Color | https://www.mooeraudio.com/product/E-lady-134.html |
| 32 | TREMOLO TR-1 | BOSS TR-2 | tremolo | compact | baby-blue / gloss | black-silver / red | knobs: Rate, Depth · sélecteurs: Wave (SINE/SQUARE) | https://www.boss.info/us/products/tr-2 |
| 33 | Fundamental Tremolo | Walrus Audio Fundamental Tremolo | tremolo | compact-wide | black / matte | faders / white | faders: Rate, Depth, Vol · sélecteurs: Wave (SINE/SQUARE/RANDOM) | https://www.walrusaudio.com/products/fundamental-series-tremolo |
| 34 | TREMOLO TR-3 | Fulltone Supatrem | tremolo | compact | cream-ivory / gloss | chrome / blue | knobs: Speed, Depth, Volume | https://www.fulltoneusa.com/ *(page gamme)* |
| 35 | TREMOLO TR-4 | Strymon Flint | tremolo | compact-wide | black / matte | metal / blue | knobs: Rate, Depth, Intensity · sélecteurs: Tremolo Wave (BIAS/HARMONIC/SQUARE), Reverb Type (61/65/80) | https://www.strymon.net/product/flint |
| 36 | PHASER PH-1 | BOSS PH-3 | phaser | compact | seafoam-green / gloss | black-silver / red | knobs: Rate, Depth, Resonance · sélecteurs: Mode (4-STAGE/8-STAGE/10-STAGE/12-STAGE/UNI-V/STEP/RISE/FALL) | https://www.boss.info/global/products/ph-3 |
| 37 | PHASER PH-2 | Electro-Harmonix Small Stone | phaser | mini | silver / satin | black-silver / red | knobs: Rate · sélecteurs: Color (OFF/ON) | https://www.ehx.com/products/small-stone/ |
| 38 | PHASER PH-3 | Mooer Phase 90 | phaser | mini | white / gloss | mini / blue | knobs: Rate, Depth | https://www.mooeraudio.com/ *(page gamme)* |
| 39 | Fundamental Phaser | Walrus Audio Fundamental Phaser | phaser | compact-wide | black / matte | faders / white | faders: Rate, Feedback, Depth · sélecteurs: Mode (LIGHT/MEDIUM/HEAVY) | https://www.walrusaudio.com/products/fundamental-series-phaser |
| 40 | EQUALIZER EQ-1 | BOSS GE-7 | eq | eq | grey / gloss | faders / red | faders: 100, 200, 400, 800, 1.6K, 3.2K, 6.4K, LEVEL | https://www.boss.info/global/products/ge-7 |
| 41 | EQUALIZER EQ-2 | MXR 10-Band EQ | eq | eq | silver / brushed | faders / blue | faders: 31, 62, 125, 250, 500, 1K, 2K, 4K, 8K, 16K, VOLUME | https://www.jimdunlop.com/mxr-ten-band-eq/ |
| 42 | EQUALIZER EQ-3 | Source Audio Programmable EQ | eq | sliders | black / matte | faders / blue | faders: LOW, LO-MID, MID, HI-MID, HIGH, LEVEL | https://sourceaudio.net/pages/programmable-eq |
| 43 | EQUALIZER EQ-4 | Empress ParaEQ | eq | compact-wide | baby-blue / powder-coated | black-silver / orange | knobs: LOW FREQ, MID FREQ, HIGH FREQ, BOOST | https://empresseffects.com/products/paraeq-mkii |
| 44 | WAH WH-1 | Vox V847 Wah | wah | treadle | black / gloss | black-silver / sans LED | knobs: SWEEP, Q, LEVEL | https://voxamps.com/product/v847-wah-pedal |
| 45 | WAH WH-2 | Dunlop Cry Baby | wah | treadle | black / gloss | black-silver / sans LED | knobs: SWEEP, Q, VOLUME | https://www.jimdunlop.com/cry-baby-standard-wah |
| 46 | WAH WH-3 | Dunlop Slash SW95 | wah | treadle | black / gloss | black-silver / red | knobs: SWEEP, Q, BOOST | https://www.jimdunlop.com/slash-cry-baby-wah/ |
| 47 | WAH WH-4 | EVH Signature Wah | wah | treadle | mustard-yellow / gloss | black-silver / blue | knobs: SWEEP, Q, VOLUME | https://www.jimdunlop.com/cry-baby-evh-wah |
| 48 | WAH WH-5 | Dunlop KH95 Wah | wah | treadle | british-racing-green / gloss | black-silver / sans LED | knobs: SWEEP, Q, GAIN | https://www.jimdunlop.com/kirk-hammett-cry-baby-wah/ |
| 49 | WAH WH-6 | RMC Custom Wah | wah | treadle | chrome / polished | vintage-round / sans LED | knobs: SWEEP, Q, LOW | https://www.realmccoycustom.com/RMC3.htm |
| 50 | UNI-VIBE VB-1 | Shin-ei Uni-Vibe | vibe | treadle | grey / aged | vintage-round / red | knobs: Speed, Intensity, Mix | — (produit vintage (Shin-ei, 1968) sans site constructeur) |
| 51 | VOLUME VL-1 | BOSS Volume/Expression | volume | treadle | silver / matte | black-silver / sans LED | knobs: MINIMUM VOLUME, TAPER | https://www.boss.info/global/products/fv-500h_500l |
| 52 | CHORUS CH-5 | BOSS CE-1 | chorus | compact-wide | silver | black-silver / red | knobs: Rate, Depth, Level · sélecteurs: Mode (CHORUS/VIBRATO) | https://www.boss.info/global/products/ce-2w *(page gamme)* ⚠ |
| 53 | CHORUS CH-6 | MXR Analog Chorus | chorus | compact | vintage-orange / gloss | black-silver / blue | knobs: Rate, Depth, Level | https://www.jimdunlop.com/mxr-analog-chorus |
| 54 | PHASER PH-5 | MXR Phase 90 | phaser | mini | webamp-orange / gloss | black-silver / sans LED | knobs: RATE, Mix | https://www.jimdunlop.com/mxr-phase-90 |
| 55 | FLANGER FL-5 | MXR Flanger 117 | flanger | compact-wide | vintage-orange / gloss | black-silver / blue | knobs: SPEED, WIDTH, REGEN., MANUAL | https://www.jimdunlop.com/mxr-flanger |
| 56 | DELAY DL-5 | Maestro Echoplex | delay | desktop | vintage-brown / matte | vintage-round / sans LED | knobs: Time, Repeat, Mix | — (Maestro Echoplex vintage (1968), pas de fiche constructeur) |
| 57 | TAPE ECHO TE-1 | Strymon El Capistan | tapedelay | compact-wide | cream-ivory / satin | metal / blue | knobs: Time, Feedback, Saturation, Wow, Mix | https://www.strymon.net/product/elcapistan |
| 58 | SPRING SP-1 | SurfyBear Metal | springreverb | desktop | silver / brushed | chrome / blue | knobs: DWELL, TONE, MIX | https://www.surfyindustries.com/surfybearmetal |
| 59 | SHIMMER SH-1 | Strymon BigSky Shimmer | shimmerreverb | compact-wide | black / matte | metal / blue | knobs: Decay, Pitch, Mix | https://www.strymon.net/product/bigsky |
| 60 | DELAY DL-6 | Binson Echorec | delay | desktop | silver / aged | vintage-round / red | knobs: Repeat, Tone · sélecteurs: Heads (4/6/8) | — (Binson Echorec vintage (Italie), marque disparue) |
| 61 | DELAY DL-7 | Electro-Harmonix Memory Man | delay | compact-wide | silver / satin | chrome / red | knobs: Delay, Feedback, Blend | https://www.ehx.com/products/deluxe-memory-man/ ⚠ |
| 62 | DELAY DL-8 | Roland Space Echo | delay | desktop | vintage-brown / matte | vintage-round / red | knobs: Repeat, Intensity, Echo Volume · sélecteurs: Heads (3/5/8) | https://www.roland.com/global/products/rc_re-201_space_echo *(page gamme)* ⚠ |
| 63 | DELAY DL-9 | TC Electronic 2290 Style | delay | compact-wide | black / matte | black-silver / blue | knobs: Time, Feedback, Mix | https://www.tcelectronic.com/products *(page gamme)* ⚠ |
| 64 | DISTORTION DS-6 | Ibanez Jemini Distortion | distortion | compact-wide | white / gloss | chrome / red | knobs: Gain A, Gain B, Tone, Level | https://www.ibanez.com/usa/products/electronics/ *(page gamme)* |
| 65 | CHORUS CH-7 | Eventide Harmonizer | chorus | desktop | black / matte | black-silver / blue | knobs: Mix, Shift, Feedback | — (Harmonizer H910/H3000 (studio) : plus de fiche constructeur, la gamme actuelle est H90/H9000) |
| 66 | PHASER PH-6 | Morley Bad Horsie Wah | phaser | treadle | black / matte | black-silver / red | knobs: Sweep, Level | https://www.morley2020.com/20-20-pedals-main |
| 67 | DISTORTION DS-7 | Vox Satchurator | distortion | compact | silver | chrome / red | knobs: Gain, Tone, Volume | — (Vox a retiré la Satchurator du catalogue (2016) : pas de fiche constructeur) |
| 68 | DELAY DL-10 | Vox Time Machine | delay | compact | silver / satin | chrome / blue | knobs: Time, Feedback, Mix | — (Vox a retiré la Time Machine du catalogue : pas de fiche constructeur) |
| 69 | PHASER PH-7 | Dunlop Cry Baby Wah | phaser | treadle | black / matte | black-silver / red | knobs: Sweep, Q | https://www.jimdunlop.com/cry-baby-standard-wah |
| 70 | TREMOLO TR-5 | Custom Killswitch | tremolo | mini | black / matte | black-silver / red | knobs: Speed, Depth | — (modèle custom (assemblage)) |
| 71 | OVER DRIVE OD-6 | Rangemaster Treble Booster | overdrive | compact | grey / aged | vintage-round / amber | knobs: Boost, Level | — (Rangemaster vintage, pas de fiche constructeur) |
| 72 | OVER DRIVE OD-7 | Mesa Boogie Grid Slammer | overdrive | compact | black / powder-coated | black-silver / red | knobs: Gain, Tone, Level | https://legacy.mesaboogie.com/pedals--related/drive-pedals/grid-slammer.html |
| 73 | CHORUS CH-8 | BOSS CE-2 | chorus | mini | baby-blue / gloss | black-silver / red | knobs: Rate, Depth | https://www.boss.info/global/products/ce-2w *(page gamme)* |
| 74 | OVER DRIVE OD-8 | BOSS OD-1 | overdrive | mini | yellow / satin | black-silver / red | knobs: LEVEL, OVERDRIVE | https://www.roland.com/us/products/rc_boss_effects_pedals/specifications *(page gamme)* ⚠ |
| 75 | OVER DRIVE OD-9 | JHS AT Drive | overdrive | compact | white / gloss | black-silver / blue | knobs: Drive, Tone, Level | https://jhspedals.info/products/at |
| 76 | REVERB RV-6 | Neunaber Ambient | reverb | compact | white / satin | chrome / blue | knobs: Mix, Decay, Tone | https://neunaber.net/collections/pedals *(page gamme)* ⚠ |
| 77 | VOLUME VL-2 | Ernie Ball VP Jr | volume | treadle | silver / brushed | black-silver / sans LED | knobs: Level | https://www.ernieball.com/guitar-accessories/volume-pedals |
| 78 | OVER DRIVE OD-10 | BOSS BD-2 | overdrive | compact | baby-blue / gloss | black-silver / red | knobs: Drive, Tone, Level | https://www.boss.info/global/products/bd-2 |
| 79 | OVER DRIVE OD-11 | BOSS OD-3 | overdrive | compact | yellow / gloss | black-silver / red | knobs: Drive, Tone, Level | https://www.boss.info/global/products/od-3 |
| 80 | OVER DRIVE OD-12 | Ibanez TS808 | overdrive | compact | british-racing-green / gloss | chrome / red | knobs: OVERDRIVE, Tone, Level | https://www.ibanez.com/eu/products/detail/ts808_99.html |
| 81 | OVER DRIVE OD-13 | Marshall Bluesbreaker | overdrive | compact | black / satin | gold / red | knobs: Drive, Tone, Level | https://www.marshall.com/ad/en/product/bluesbreaker-vintage-reissue-pedal |
| 82 | OVER DRIVE OD-14 | Analog Man King of Tone | overdrive | compact | purple / powder-coated | chrome / red | knobs: Drive, Tone, Level | https://www.analogman.com/kingtone.htm |
| 83 | OVER DRIVE OD-15 | Paul Cochrane Timmy | overdrive | compact | silver | metal / red | knobs: Drive, Tone, Level | — (artisan sans site constructeur ; fiche revendeur uniquement) |
| 84 | OVER DRIVE OD-16 | Wampler Tumnus | overdrive | compact | gold / satin | gold / blue | knobs: GAIN, TREBLE, VOLUME | https://www.wamplerpedals.com/products/distortion-overdrive/tumnus/ |
| 85 | OVER DRIVE OD-17 | JHS Morning Glory | overdrive | compact | gold / powder-coated | black-silver / blue | knobs: Drive, Tone, Level | https://jhspedals.info/products/morning-glory |
| 86 | OVER DRIVE OD-18 | Bondi Sick As | overdrive | compact | white / gloss | cream / blue | knobs: Drive, Tone, Level | https://www.bondieffects.com/products/sick-as-overdrive-mkiii |
| 87 | OVER DRIVE OD-19 | Origin Effects RevivalDRIVE | overdrive | compact | gunmetal / matte | chrome / amber | knobs: Drive, Tone, Level | https://origineffects.com/product-category/all-products *(page gamme)* |
| 88 | OVER DRIVE OD-20 | Friedman BE-OD | overdrive | compact | silver | black-silver / red | knobs: Drive, Tone, Level | https://friedmanamplification.com/shop/pedals/be-od |
| 89 | DISTORTION DS-8 | Suhr Riot | distortion | compact | black / powder-coated | black-silver / blue | knobs: Distortion, Tone, Level | https://www.suhr.com/product/riot |
| 90 | OVER DRIVE OD-21 | Greer Lightspeed | overdrive | compact | cream-ivory / gloss | cream / blue | knobs: Drive, Tone, Level | https://www.greeramps.com/products/lightspeed |
| 91 | OVER DRIVE OD-22 | Nobels ODR-1 | overdrive | compact | british-racing-green / gloss | black-silver / red | knobs: DRIVE, SPECTRUM, LEVEL | https://nobels.de/produkte *(page gamme)* |
| 92 | DISTORTION DS-9 | JHS Angry Charlie | distortion | compact | wine-red / powder-coated | black-silver / blue | knobs: Distortion, Tone, Level | https://jhspedals.info/products/angry-charlie-v3 |
| 93 | OVER DRIVE OD-23 | Ethos Overdrive | overdrive | compact | silver | chrome / green | knobs: Drive, Tone, Level | — (artisan sans site constructeur) |
| 94 | DISTORTION DS-10 | BOSS HM-2 | distortion | compact | vintage-brown / gloss | black-silver / red | knobs: Distortion, Tone, Level | https://support.roland.com/hc/en-us/articles/201951149-HM-2-Specifications |
| 95 | DISTORTION DS-11 | BOSS MT-2 | distortion | compact | anthracite / satin | black-silver / red | knobs: Distortion, Tone, Level | https://www.boss.info/global/products/mt-2 |
| 96 | DISTORTION DS-12 | Marshall Guv'nor | distortion | compact | black / satin | gold / red | knobs: Distortion, Tone, Level | https://www.marshall.com/gg/en/product/guvnor-vintage-reissue-pedal |
| 97 | DISTORTION DS-13 | Electro-Harmonix Metal Muff | distortion | compact-wide | black / powder-coated | black-silver / red | knobs: Distortion, Tone, Level | https://www.ehx.com/products/metal-muff/ |
| 98 | DISTORTION DS-14 | Tech 21 SansAmp GT2 | distortion | compact-wide | silver | black-silver / red | knobs: Distortion, Tone, Level | https://www.tech21nyc.com/products/sansamp-2/gt2 |
| 99 | OVER DRIVE OD-24 | Joyo American Sound | overdrive | compact | black / powder-coated | black-silver / blue | knobs: Drive, Tone, Level | https://www.joyoaudio.com/product/63.html |
| 100 | OVER DRIVE OD-25 | Universal Audio Dream '65 | overdrive | compact | black / matte | chrome / blue | knobs: Drive, Tone, Level | https://www.uaudio.com/products/dream-65-reverb-amplifier |
| 101 | DISTORTION DS-15 | Pro Co Turbo RAT | distortion | compact-wide | black / powder-coated | black-silver / red | knobs: DISTORTION, FILTER, VOLUME | https://soundpro.com/products/proco-sound-trat |
| 102 | DISTORTION DS-16 | Mesa Boogie Throttle Box | distortion | compact-wide | black / powder-coated | black-silver / red | knobs: Distortion, Tone, Level | https://legacy.mesaboogie.com/pedals--related/drive-pedals/throttle-box.html |
| 103 | DISTORTION DS-17 | Bogner Ecstasy Red | distortion | compact-wide | wine-red / powder-coated | black-silver / red | knobs: Distortion, Tone, Level | https://bogneramplification.com/ *(page gamme)* |
| 104 | DISTORTION DS-18 | BOSS ML-2 | distortion | compact | black / satin | black-silver / red | knobs: Distortion, Tone, Level | https://www.boss.info/global/products/ml-2 |
| 105 | OVER DRIVE OD-26 | Wampler Plexi-Drive | overdrive | compact | black / powder-coated | black-silver / blue | knobs: Drive, Tone, Level | https://www.wamplerpedals.com/products/distortion-overdrive/ *(page gamme)* |
| 106 | FUZZ FZ-5 | Sola Sound Tone Bender MKII | fuzz | compact-wide | grey / aged | vintage-round / red | knobs: Fuzz, Tone, Volume | — (Sola Sound vintage (1966), pas de fiche constructeur en ligne) |
| 107 | FUZZ FZ-6 | Mosrite Fuzzrite | fuzz | compact-wide | silver / brushed | vintage-round / red | knobs: Fuzz, Tone, Volume | — (Mosrite vintage (1967), marque disparue) |
| 108 | FUZZ FZ-7 | Electro-Harmonix Green Russian Big Muff | fuzz | compact-wide | olive-green / matte | black-silver / red | knobs: Sustain, Tone, Volume | https://www.ehx.com/products/green-russian-big-muff-pi/ |
| 109 | FUZZ FZ-8 | Way Huge Swollen Pickle | fuzz | compact-wide | purple / powder-coated | black-silver / red | knobs: Fuzz, Tone, Volume | https://www.jimdunlop.com/way-huge-swollen-pickle-jumbo-fuzz-mkiis/ |
| 110 | FUZZ FZ-9 | EarthQuaker Devices Hoof | fuzz | compact | olive-green / powder-coated | cream / blue | knobs: Fuzz, Tone, Volume | https://www.earthquakerdevices.com/hoof |
| 111 | FUZZ FZ-10 | Catalinbread Fuzzrite | fuzz | compact-wide | silver / brushed | chrome / blue | knobs: Fuzz, Tone, Volume | https://catalinbread.com/products/fuzzrite |
| 112 | FUZZ FZ-11 | Death By Audio Fuzz War | fuzz | compact-wide | silver / brushed | black-silver / red | knobs: Fuzz, Tone, Volume | https://deathbyaudio.com/products/fuzz-war |
| 113 | FUZZ FZ-12 | Fuzzrocious Demon | fuzz | compact-wide | black / matte | black-silver / red | knobs: Fuzz, Tone, Volume | https://fuzzrociouspedals.com/ *(page gamme)* |
| 114 | FUZZ FZ-13 | Behringer SF300 | fuzz | compact-wide | silver / matte | black-silver / red | knobs: Fuzz, Tone, Volume | https://www.behringer.com/en/products/0709-ACK |
| 115 | FUZZ FZ-14 | Dunlop JH-F1 Fuzz Face | fuzz | compact-wide | turquoise / aged | vintage-round / red | knobs: Fuzz, Tone, Volume | https://www.jimdunlop.com/jimi-hendrix-fuzz-face-distortion |
| 116 | OVER DRIVE OD-27 | Crowther Hot Cake | overdrive | compact | mustard-yellow / satin | black-silver / red | knobs: Drive, Tone, Level | http://www.crowtheraudio.net/products/hotcake |
| 117 | FUZZ FZ-15 | Devi Ever Shoe Gazer | fuzz | compact-wide | silver / brushed | black-silver / red | knobs: Fuzz, Tone, Volume | https://deviever.net/products/devi-ever-fx-shoe-gazer |
| 118 | CHORUS CH-9 | BOSS VB-2 | chorus | mini | purple / gloss | black-silver / red | knobs: Rate, Depth | https://www.boss.info/global/products/vb-2w *(page gamme)* ⚠ |
| 119 | CHORUS CH-10 | BOSS MO-2 | chorus | compact | anthracite / satin | black-silver / red | knobs: Rate, Depth, Level | https://www.boss.info/de/products/mo-2 |
| 120 | TREMOLO TR-6 | Electro-Harmonix Stereo Pulsar | tremolo | compact-wide | silver / satin | black-silver / red | knobs: Rate, Depth, Level | https://www.ehx.com/products/stereo-pulsar/ |
| 121 | TREMOLO TR-7 | Chase Bliss Gravitas | tremolo | compact-wide | black / matte | cream / white | knobs: Rate, Depth, Level | https://www.chasebliss.com/pedals *(page gamme)* |
| 122 | DELAY DL-11 | Chase Bliss Mood | delay | compact-wide | cream-ivory / satin | cream / white | knobs: Time, Feedback, Mix, Mod | https://www.chasebliss.com/pedals *(page gamme)* |
| 123 | CHORUS CH-11 | EarthQuaker Devices Sea Machine | chorus | compact-wide | white / matte | cream / blue | knobs: Rate, Depth, Level | https://www.earthquakerdevices.com/sea-machine |
| 124 | PHASER PH-8 | EarthQuaker Devices Grand Orbiter | phaser | compact-wide | white / matte | cream / blue | knobs: Rate, Depth | https://www.earthquakerdevices.com/grand-orbiter |
| 125 | FLANGER FL-6 | EarthQuaker Devices Pyramids | flanger | compact-wide | white / matte | cream / blue | knobs: Rate, Depth, Regen, Manual | https://www.earthquakerdevices.com/pyramids |
| 126 | CHORUS CH-12 | Walrus Audio Julianna | chorus | compact | metallic-blue / gloss | cream / white | knobs: Rate, Depth, Level | https://www.walrusaudio.com/ *(page gamme)* |
| 127 | CHORUS CH-13 | Strymon Deco | chorus | compact-wide | silver | metal / blue | knobs: Rate, Depth, Level | https://www.strymon.net/product/deco |
| 128 | CHORUS CH-14 | TC Electronic Corona Chorus | chorus | compact | white / gloss | chrome / blue | knobs: Rate, Depth, Level | https://www.tcelectronic.com/product.html?modelCode=0709-AFR |
| 129 | CHORUS CH-15 | BOSS DC-2 | chorus | mini | white / satin | black-silver / red | knobs: Rate, Depth | https://www.boss.info/global/products/dc-2w *(page gamme)* |
| 130 | CHORUS CH-16 | Fairfield Circuitry Shallow Water | chorus | compact | silver / brushed | metal / amber | knobs: Rate, Depth, Level | https://fairfieldcircuitry.com/products/shallow-water |
| 131 | UNI-VIBE VB-2 | MXR Uni-Vibe | vibe | compact | metallic-blue / gloss | black-silver / blue | knobs: Speed, Intensity, Volume | https://www.jimdunlop.com/mxr-uni-vibe-chorus-vibrato/ |
| 132 | DELAY DL-12 | BOSS DM-2 | delay | compact | metallic-blue / gloss | black-silver / red | knobs: Time, Feedback, Mix | https://www.boss.info/global/products/dm-2w *(page gamme)* ⚠ |
| 133 | DELAY DL-13 | BOSS DD-8 | delay | compact | white / gloss | black-silver / red | knobs: Time, Feedback, Mix, Mod | https://www.boss.info/global/products/dd-8 |
| 134 | DELAY DL-14 | Electro-Harmonix Canyon | delay | compact | white / gloss | chrome / blue | knobs: Time, Feedback, Mix, Mod | https://www.ehx.com/products/canyon/ |
| 135 | TAPE ECHO TE-2 | Catalinbread Belle Epoch | tapedelay | compact-wide | cream-ivory / satin | cream / blue | knobs: Time, Feedback, Mix | https://catalinbread.com/products/belle-epoch |
| 136 | DELAY DL-15 | Chase Bliss Tonal Recall | delay | compact-wide | black / matte | cream / white | knobs: Time, Feedback, Mix, Mod | https://www.chasebliss.com/pedals *(page gamme)* |
| 137 | DELAY DL-16 | Meris Polymoon | delay | compact-wide | silver / brushed | metal / blue | knobs: Time, Feedback, Mix, Mod | https://meris.us/product/polymoon-pedal |
| 138 | DELAY DL-17 | Empress Echosystem | delay | compact-wide | white / satin | black-silver / blue | knobs: Time, Feedback, Mix, Mod | https://empresseffects.com/products/echosystem |
| 139 | DELAY DL-18 | Line 6 DL4 | delay | looper | olive-green / matte | black-silver / green | knobs: Time, Feedback, Mix, Mod | https://line6.com/effects-pedals/dl4-mkii ⚠ |
| 140 | DELAY DL-19 | Keeley Caverns | delay | compact-wide | white / gloss | chrome / blue | knobs: Time, Feedback, Mix | https://robertkeeley.com/product/caverns-delay-reverb-v2/ |
| 141 | DELAY DL-20 | Walrus Audio ARP-87 | delay | compact-wide | white / gloss | cream / blue | knobs: Time, Feedback, Mix, Mod | https://www.walrusaudio.com/collections/delay *(page gamme)* |
| 143 | DELAY DL-22 | Strymon Brigadier | delay | compact-wide | silver / satin | metal / blue | knobs: Time, Feedback, Mix | https://www.strymon.net/support/brigadier/brigadier-brochure |
| 144 | DELAY DL-23 | Malekko Ekko 616 | delay | compact | black / powder-coated | black-silver / blue | knobs: Time, Feedback, Mix | — (Malekko Heavy Industry : site constructeur hors ligne) |
| 145 | DELAY DL-24 | Electro-Harmonix Deluxe Memory Man | delay | compact-wide | silver / satin | chrome / red | knobs: Time, Feedback, Mix, Mod | https://www.ehx.com/products/deluxe-memory-man/ |
| 146 | REVERB RV-7 | BOSS RV-5 | reverb | compact | white / gloss | black-silver / red | knobs: Mix, Decay, Tone | https://www.boss.info/global/products/rv-5 |
| 147 | REVERB RV-8 | Electro-Harmonix Cathedral | reverb | compact-wide | silver / satin | chrome / red | knobs: Mix, Decay, Tone, Predelay | https://www.ehx.com/products/cathedral/ |
| 148 | REVERB RV-9 | Meris Mercury7 | reverb | compact-wide | silver / brushed | metal / blue | knobs: Mix, Decay, Tone, Predelay | https://meris.us/product/mercury7-reverb |
| 149 | REVERB RV-10 | Walrus Audio Slö | reverb | compact-wide | seafoam-green / gloss | cream / blue | knobs: Mix, Decay, Tone | https://www.walrusaudio.com/collections/reverb *(page gamme)* |
| 150 | REVERB RV-11 | EarthQuaker Devices Afterneath | reverb | compact-wide | white / matte | cream / blue | knobs: Mix, Decay, Tone | https://www.earthquakerdevices.com/afterneath |
| 151 | REVERB RV-12 | EarthQuaker Devices Ghost Echo | reverb | compact-wide | white / matte | cream / blue | knobs: Mix, Decay, Tone | https://www.earthquakerdevices.com/ghost-echo |
| 152 | DELAY DL-25 | Chase Bliss Habit | delay | compact-wide | cream-ivory / satin | cream / white | knobs: Time, Feedback, Mix, Mod | https://www.chasebliss.com/pedals *(page gamme)* |
| 153 | REVERB RV-13 | Old Blood Noise Dark Star | reverb | compact-wide | black / matte | cream / white | knobs: Mix, Decay, Tone | https://oldbloodnoise.com/pedals/p/dark-star |
| 154 | REVERB RV-14 | Caroline Météore | reverb | compact-wide | cream-ivory / gloss | cream / blue | knobs: Mix, Decay, Tone | https://carolineguitar.com/product/meteore/ |
| 155 | REVERB RV-15 | Strymon blueSky | reverb | compact-wide | metallic-blue / satin | metal / blue | knobs: Mix, Decay, Tone | https://www.strymon.net/product/bluesky |
| 156 | REVERB RV-16 | Eventide Space | reverb | desktop | black / matte | black-silver / blue | knobs: Mix, Decay, Tone, Predelay | https://www.eventideaudio.com/pedals/space |
| 157 | REVERB RV-17 | Neunaber Immerse | reverb | compact-wide | white / satin | chrome / blue | knobs: Mix, Decay, Tone | https://neunaber.net/products/immerse-reverberator-mk-ii |
| 158 | WAH WH-7 | Electro-Harmonix Q-Tron | wah | compact-wide | silver / satin | black-silver / red | knobs: RANGE, PEAK, GAIN | https://www.ehx.com/products/q-tron-plus/ |
| 159 | WAH WH-8 | Mu-Tron III | wah | compact-wide | silver / brushed | vintage-round / red | knobs: RANGE, PEAK, GAIN | https://mu-tron.com/shop/pedals/mu-tron-iii-vintage-silver |
| 160 | WAH WH-9 | BOSS AW-3 | wah | compact | gold / satin | black-silver / red | knobs: MANUAL, SENS, DECAY | https://www.boss.info/global/products/aw-3 |
| 161 | EQUALIZER EQ-5 | Chase Bliss Condor | eq | compact-wide | white / matte | cream / red | knobs: FREQ, RES, MIX | https://www.chasebliss.com/condor-hifi |
| 162 | OVER DRIVE OD-28 | Chase Bliss Brothers | overdrive | compact | black / matte | cream / white | knobs: Drive, Tone, Level | https://www.chasebliss.com/brothers-am |
| 163 | DELAY DL-26 | Red Panda Particle | delay | compact-wide | white / satin | chrome / blue | knobs: Time, Feedback, Mix, Mod | https://www.redpandalab.com/products/particle |
| 164 | DISTORTION DS-19 | Old Blood Noise Excess | distortion | compact | black / matte | cream / white | knobs: Distortion, Tone, Level | https://oldbloodnoise.com/ *(page gamme)* |
| 165 | CHORUS CH-17 | Caroline Somersault | chorus | compact | cream-ivory / gloss | cream / blue | knobs: Rate, Depth, Level | https://carolineguitar.com/product/somersault/ |
| 166 | WAH WH-10 | DigiTech Synth Wah | wah | compact-wide | purple / gloss | black-silver / red | knobs: RANGE, SENS, MIX | — (DigiTech a retiré la Synth Wah ; le site est réduit à la gamme Whammy) |
| 167 | OVER DRIVE OD-29 | WebAmp OD-300 | overdrive | compact | webamp-orange / gloss | black-silver / orange | knobs: Drive, Tone, Level · sélecteurs: Mode (OD/DIST) | modèle maison WebAmp |
| 168 | OVER DRIVE OD-30 | WebAmp TO-800 | overdrive | compact | british-racing-green / gloss | black-silver / red | knobs: Drive, Tone, Level | modèle maison WebAmp |
| 169 | DISTORTION DS-20 | WebAmp UM-300 | distortion | compact-wide | black / powder-coated | black-silver / red | knobs: Dist, Level, Low, Mid, High | modèle maison WebAmp |
| 170 | DISTORTION DS-21 | WebAmp HM-300 | distortion | compact | vintage-brown / gloss | black-silver / red | knobs: Distortion, Low, Mid, Level | modèle maison WebAmp |
| 171 | DISTORTION DS-22 | WebAmp HD-300 | distortion | compact | hot-pink / gloss | black-silver / amber | knobs: LEVEL, TONE, DIST, GAIN BOOST, BOTTOM | modèle maison WebAmp |
| 172 | FUZZ FZ-16 | WebAmp SF-300 | fuzz | compact-wide | silver / matte | black-silver / red | knobs: Gain, Level, Low, High · sélecteurs: Mode (FUZZ/GRUNGE/BOOST) | modèle maison WebAmp |
| 173 | OVER DRIVE OD-31 | WebAmp BOD-400 | overdrive | compact | purple / gloss | black-silver / orange | knobs: LEVEL, HIGH, GAIN, BAL, LOW | modèle maison WebAmp |
| 174 | EQUALIZER EQ-6 | WebAmp BEQ-700 | eq | compact | yellow / gloss | faders / red | faders: 50, 120, 400, 500, 800, 4k5, 10k · knobs: LEVEL | modèle maison WebAmp |
| 175 | CHORUS CH-18 | WebAmp UC-200 | chorus | compact | baby-blue / gloss | black-silver / blue | knobs: Level, Tone, Rate, Depth | modèle maison WebAmp |
| 176 | CHORUS CH-19 | WebAmp UV-300 | chorus | compact | purple / gloss | black-silver / blue | knobs: Depth, Rate, Rise · sélecteurs: Mode (UNLATCH/BYPASS/LATCH) | modèle maison WebAmp |
| 177 | TREMOLO TR-8 | WebAmp UT-300 | tremolo | compact | cream-ivory / satin | black-silver / amber | knobs: Rate, Wave, Depth | modèle maison WebAmp |
| 178 | CHORUS CH-20 | WebAmp CL-9 | chorus | compact | crimson / gloss | black-silver / orange | knobs: ATTACK TIME, SUSTAIN, LEVEL | modèle maison WebAmp |
| 179 | PHASER PH-9 | WebAmp VP-1 | phaser | mini | black / satin | black-silver / blue | knobs: Rate, Tone | modèle maison WebAmp |
| 180 | DELAY DL-27 | WebAmp VD-400 | delay | compact | webamp-orange / gloss | black-silver / orange | knobs: Time, Feedback, Level | modèle maison WebAmp |
| 181 | REVERB RV-18 | WebAmp DR-600 | reverb | compact | silver / satin | black-silver / amber | knobs: LEVEL, TONE, TIME · sélecteur MODE horizontal (ROOM/HALL/PLATE) | modèle maison WebAmp |
| 182 | OVER DRIVE OD-32 | WebAmp TM-300 | overdrive | compact | black / powder-coated | black-silver / blue | knobs: Level, Low, High, Drive · sélecteurs: Mic (CLSIC/CNTR/OFF/X), Mod (CLN/HI G/HOT), Amp (TWEED/BRIT/CALIF) | modèle maison WebAmp |
| 183 | EQUALIZER EQ-7 | WebAmp EQ-700 | eq | compact | gold / gloss | faders / red | faders: 100, 200, 400, 800, 1k6, 3k2, 6k4 | modèle maison WebAmp |
| 185 | WAH WH-11 | WebAmp Wahcko | wah | treadle | webamp-orange / gloss | black-silver / orange | knobs: Sweep, Range, Q | modèle maison WebAmp |
| 186 | MULTI-FX MF-1 | WebAmp FX-600 | multifx | compact | silver / gloss | black-silver / amber | knobs: LEVEL, PAR 1, PAR 2 · sélecteur FX horizontal (FLANGER/CHORUS/PHASER/DELAY/TREMOLO/PITCH SHIFTER) | modèle maison WebAmp |

## Amplis (44) — lot L7

| # | Code WebAmp | Modèle source (interne) | Type | Châssis | Boîtier | Knobs / LED | Contrôles | Source |
|---|---|---|---|---|---|---|---|---|
| 1 | WEBAMP TWIN COMBO | Fender 65 Twin Reverb | combo | combo-twin | black / matte | chrome / red | knobs: VOLUME, BASS, MIDDLE, TREBLE, REVERB · switchs: POWER, CABINET | L7 (recherche à venir) |
| 2 | WEBAMP COMBO | Fender Deluxe Reverb | combo | combo | black / matte | chrome / red | knobs: VOLUME, BASS, TREBLE, REVERB · switchs: POWER, CABINET | L7 (recherche à venir) |
| 3 | WEBAMP CLASSIC TUBE | Marshall JCM 800 | head | head-gold | black / matte | gold / red | knobs: VOLUME, BASS, MIDDLE, TREBLE, PRESENCE, MASTER · switchs: POWER, CABINET, CHANNEL | L7 (recherche à venir) |
| 4 | WEBAMP CLASSIC TUBE | Marshall Plexi 1959 | head | head-gold | black / matte | gold / red | knobs: VOLUME, BASS, MIDDLE, TREBLE, PRESENCE · switchs: POWER, CABINET | L7 (recherche à venir) |
| 5 | WEBAMP STUDIO | Orange Rockerverb 100 | head | head-citrus | vintage-orange / satin | classic / amber | knobs: VOLUME, GAIN, BASS, MIDDLE, TREBLE, REVERB, MASTER · switchs: POWER, CABINET, CHANNEL | L7 (recherche à venir) |
| 6 | WEBAMP LUNCHBOX | Orange Tiny Terror | head | lunchbox | vintage-orange / satin | classic / amber | knobs: GAIN, TONE, VOLUME · switchs: POWER, CABINET, CHANNEL | L7 (recherche à venir) |
| 7 | WEBAMP MODERN | Mesa Boogie Dual Rectifier | head | head-black | black / matte | chrome / red | knobs: GAIN, BASS, MIDDLE, TREBLE, PRESENCE, RESONANCE, MASTER · switchs: POWER, CABINET, CHANNEL | L7 (recherche à venir) |
| 8 | WEBAMP TWIN COMBO | Vox AC30 | combo | combo-twin | black / matte | cream / red | knobs: VOLUME, BASS, TREBLE, MASTER · switchs: POWER, CABINET, CHANNEL | L7 (recherche à venir) |
| 9 | WEBAMP COMBO | Vox AC15 | combo | combo | black / matte | cream / red | knobs: VOLUME, BASS, TREBLE, MASTER · switchs: POWER, CABINET, CHANNEL | L7 (recherche à venir) |
| 10 | WEBAMP HIGH GAIN | Peavey 5150 | head | head-silver | black / matte | chicken-head / green | knobs: GAIN, VOLUME, BASS, MIDDLE, TREBLE, PRESENCE, RESONANCE, MASTER · switchs: POWER, CABINET, CHANNEL | L7 (recherche à venir) |
| 11 | WEBAMP COMBO | Gibson GA-40 | combo | combo | black / matte | chrome / red | knobs: VOLUME, BASS, TREBLE, MASTER · switchs: POWER, CABINET, CHANNEL | L7 (recherche à venir) |
| 12 | WEBAMP HIGH GAIN | Carvin Legacy | head | head-silver | black / matte | chicken-head / green | knobs: GAIN, VOLUME, BASS, MIDDLE, TREBLE, PRESENCE, MASTER · switchs: POWER, CABINET, CHANNEL | L7 (recherche à venir) |
| 13 | WEBAMP MODERN | Synergy Modular | head | head-black | black / matte | classic / red | knobs: GAIN, VOLUME, BASS, MIDDLE, TREBLE, PRESENCE, MASTER · switchs: POWER, CABINET, CHANNEL | L7 (recherche à venir) |
| 14 | WEBAMP CLASSIC TUBE | Marshall JVM410HJS | head | head-gold | black / matte | gold / red | knobs: GAIN, VOLUME, BASS, MIDDLE, TREBLE, PRESENCE, MASTER · switchs: POWER, CABINET, CHANNEL | L7 (recherche à venir) |
| 15 | WEBAMP HIGH GAIN | Peavey JSX | head | head-silver | black / matte | chicken-head / green | knobs: GAIN, VOLUME, BASS, MIDDLE, TREBLE, PRESENCE, RESONANCE, MASTER · switchs: POWER, CABINET, CHANNEL | L7 (recherche à venir) |
| 16 | WEBAMP COMBO | Lab Series L5 | combo | combo | black / matte | chrome / red | knobs: VOLUME, BASS, MIDDLE, TREBLE, PRESENCE · switchs: POWER, CABINET | L7 (recherche à venir) |
| 17 | WEBAMP CLASSIC TUBE | Marshall JTM45 | head | head-gold | black / matte | gold / red | knobs: VOLUME, BASS, MIDDLE, TREBLE, PRESENCE · switchs: POWER, CABINET | L7 (recherche à venir) |
| 18 | WEBAMP CLASSIC TUBE | Marshall 1959SLP | head | head-gold | black / matte | gold / red | knobs: VOLUME, BASS, MIDDLE, TREBLE, PRESENCE · switchs: POWER, CABINET | L7 (recherche à venir) |
| 19 | WEBAMP HIGH GAIN | Soldano SLO-100 | head | head-silver | black / matte | chicken-head / green | knobs: GAIN, VOLUME, BASS, MIDDLE, TREBLE, PRESENCE, MASTER · switchs: POWER, CABINET, CHANNEL | L7 (recherche à venir) |
| 20 | WEBAMP COMBO | Fender Vibrolux | combo | combo | black / matte | chrome / red | knobs: VOLUME, BASS, TREBLE, REVERB, MASTER · switchs: POWER, CABINET, CHANNEL | L7 (recherche à venir) |
| 21 | WEBAMP MODERN | Mesa Boogie Mark I | combo | head-black | black / matte | chrome / red | knobs: GAIN, BASS, MIDDLE, TREBLE, PRESENCE, MASTER · switchs: POWER, CABINET, CHANNEL | L7 (recherche à venir) |
| 22 | WEBAMP COMBO | Polytone Mini-Brute | combo | combo | black / matte | chrome / red | knobs: VOLUME, BASS, MIDDLE, TREBLE · switchs: POWER, CABINET | L7 (recherche à venir) |
| 23 | WEBAMP COMBO | Standel Custom | combo | combo | black / matte | chrome / red | knobs: VOLUME, BASS, TREBLE, MASTER · switchs: POWER, CABINET, CHANNEL | L7 (recherche à venir) |
| 24 | WEBAMP TWIN COMBO | Roland JC-120 | combo | combo-twin | black / matte | chrome / red | knobs: VOLUME, BASS, MIDDLE, TREBLE, MASTER · switchs: POWER, CABINET, CHANNEL | L7 (recherche à venir) |
| 25 | WEBAMP HIGH GAIN | Engl Powerball | head | head-silver | black / matte | chicken-head / green | knobs: GAIN, VOLUME, BASS, MIDDLE, TREBLE, PRESENCE, MASTER · switchs: POWER, CABINET, CHANNEL | L7 (recherche à venir) |
| 26 | WEBAMP HIGH GAIN | Randall RG100ES | head | head-silver | black / matte | chicken-head / green | knobs: GAIN, VOLUME, BASS, MIDDLE, TREBLE, PRESENCE · switchs: POWER, CABINET, CHANNEL | L7 (recherche à venir) |
| 27 | WEBAMP MODERN | Mesa Boogie Mark IIC+ | head | head-black | black / matte | chrome / red | knobs: GAIN, VOLUME, BASS, MIDDLE, TREBLE, PRESENCE, MASTER · switchs: POWER, CABINET, CHANNEL | L7 (recherche à venir) |
| 28 | WEBAMP MODERN | Mesa Boogie JP2C | head | head-black | black / matte | chrome / red | knobs: GAIN, VOLUME, BASS, MIDDLE, TREBLE, PRESENCE, MASTER · switchs: POWER, CABINET, CHANNEL | L7 (recherche à venir) |
| 29 | WEBAMP MODERN | Mesa Boogie Mark V | head | head-black | black / matte | chrome / red | knobs: GAIN, VOLUME, BASS, MIDDLE, TREBLE, PRESENCE, MASTER · switchs: POWER, CABINET, CHANNEL | L7 (recherche à venir) |
| 30 | WEBAMP MODERN | Mesa Boogie Lonestar | combo | head-black | black / matte | chrome / red | knobs: GAIN, BASS, MIDDLE, TREBLE, PRESENCE, MASTER · switchs: POWER, CABINET, CHANNEL | L7 (recherche à venir) |
| 31 | WEBAMP HIGH GAIN | Hartley Thompson Custom | head | head-silver | black / matte | chicken-head / green | knobs: GAIN, VOLUME, BASS, MIDDLE, TREBLE · switchs: POWER, CABINET, CHANNEL | L7 (recherche à venir) |
| 32 | WEBAMP COMBO | Yamaha DG80 | combo | combo | black / matte | chrome / red | knobs: GAIN, VOLUME, BASS, MIDDLE, TREBLE, PRESENCE · switchs: POWER, CABINET, CHANNEL | L7 (recherche à venir) |
| 33 | WEBAMP MODELER | Fractal Axe-FX | head | rack | anthracite / brushed | metal / blue | knobs: GAIN, VOLUME, BASS, MIDDLE, TREBLE, PRESENCE, MASTER · switchs: POWER, CABINET, CHANNEL | L7 (recherche à venir) |
| 34 | WEBAMP MODELER | Neural DSP Quad Cortex | head | rack | anthracite / brushed | metal / blue | knobs: GAIN, VOLUME, BASS, MIDDLE, TREBLE, PRESENCE · switchs: POWER, CABINET, CHANNEL | L7 (recherche à venir) |
| 35 | WEBAMP MODERN | Mesa Boogie Mark V | head | head-black | black / matte | chrome / red | knobs: GAIN, VOLUME, BASS, MIDDLE, TREBLE, PRESENCE, MASTER · switchs: POWER, CABINET, CHANNEL | L7 (recherche à venir) |
| 36 | WEBAMP MODERN | Mesa Boogie Dual Rectifier | head | head-black | black / matte | chrome / red | knobs: GAIN, VOLUME, BASS, MIDDLE, TREBLE, PRESENCE, MASTER · switchs: POWER, CABINET, CHANNEL | L7 (recherche à venir) |
| 37 | WEBAMP STUDIO | Orange Rockerverb 50 | head | head-citrus | vintage-orange / satin | classic / amber | knobs: GAIN, VOLUME, BASS, MIDDLE, TREBLE, PRESENCE, REVERB · switchs: POWER, CABINET, CHANNEL | L7 (recherche à venir) |
| 38 | WEBAMP LUNCHBOX | Orange Tiny Terror | head | lunchbox | vintage-orange / satin | classic / amber | knobs: GAIN, VOLUME, TONE · switchs: POWER, CABINET, CHANNEL | L7 (recherche à venir) |
| 39 | WEBAMP TWIN COMBO | Vox AC30 | combo | combo-twin | black / matte | cream / red | knobs: VOLUME, BASS, TREBLE, TONE, REVERB · switchs: POWER, CABINET | L7 (recherche à venir) |
| 40 | WEBAMP COMBO | Vox AC15 | combo | combo | black / matte | cream / red | knobs: VOLUME, BASS, TREBLE, TONE, REVERB · switchs: POWER, CABINET | L7 (recherche à venir) |
| 41 | WEBAMP HIGH GAIN | Peavey 5150 | head | head-silver | black / matte | chicken-head / green | knobs: GAIN, VOLUME, BASS, MIDDLE, TREBLE, PRESENCE, RESONANCE · switchs: POWER, CABINET, CHANNEL | L7 (recherche à venir) |
| 42 | WEBAMP HIGH GAIN | Peavey 6505 | head | head-silver | black / matte | chicken-head / green | knobs: GAIN, VOLUME, BASS, MIDDLE, TREBLE, PRESENCE, RESONANCE · switchs: POWER, CABINET, CHANNEL | L7 (recherche à venir) |
| 43 | WEBAMP COMBO | Supro Blues King 12 | combo | combo | black / matte | chrome / red | knobs: VOLUME, BASS, TREBLE, TONE, REVERB · switchs: POWER, CABINET | L7 (recherche à venir) |
| 44 | WEBAMP MODERN | Supro Black Magick | head | head-black | black / matte | classic / red | knobs: VOLUME, BASS, TREBLE, TONE, PRESENCE · switchs: POWER, CABINET | L7 (recherche à venir) |

## Modèles sans source officielle (14)

Aucune page constructeur en ligne n'existe pour ces appareils (produits vintage
de marques disparues, assemblages custom, modèles retirés du catalogue).

- UNI-VIBE VB-1 — Shin-ei Uni-Vibe : produit vintage (Shin-ei, 1968) sans site constructeur
- DELAY DL-5 — Maestro Echoplex : Maestro Echoplex vintage (1968), pas de fiche constructeur
- DELAY DL-6 — Binson Echorec : Binson Echorec vintage (Italie), marque disparue
- CHORUS CH-7 — Eventide Harmonizer : Harmonizer H910/H3000 (studio) : plus de fiche constructeur, la gamme actuelle est H90/H9000
- DISTORTION DS-7 — Vox Satchurator : Vox a retiré la Satchurator du catalogue (2016) : pas de fiche constructeur
- DELAY DL-10 — Vox Time Machine : Vox a retiré la Time Machine du catalogue : pas de fiche constructeur
- TREMOLO TR-5 — Custom Killswitch : modèle custom (assemblage)
- OVER DRIVE OD-6 — Rangemaster Treble Booster : Rangemaster vintage, pas de fiche constructeur
- OVER DRIVE OD-15 — Paul Cochrane Timmy : artisan sans site constructeur ; fiche revendeur uniquement
- OVER DRIVE OD-23 — Ethos Overdrive : artisan sans site constructeur
- FUZZ FZ-5 — Sola Sound Tone Bender MKII : Sola Sound vintage (1966), pas de fiche constructeur en ligne
- FUZZ FZ-6 — Mosrite Fuzzrite : Mosrite vintage (1967), marque disparue
- DELAY DL-23 — Malekko Ekko 616 : Malekko Heavy Industry : site constructeur hors ligne
- WAH WH-10 — DigiTech Synth Wah : DigiTech a retiré la Synth Wah ; le site est réduit à la gamme Whammy

## URLs à revérifier (12)

Ces fiches portent un champ `urlDoubt` : l'adresse pointe un modèle voisin, une
réédition, une page de gamme, ou une source non constructeur. Elles restent
utiles comme référence mais **ne sont pas des fiches produit exactes**.

| Fiche | URL | Raison |
|---|---|---|
| `boss-od1` | https://www.roland.com/us/products/rc_boss_effects_pedals/specifications | page des plugins BOSS ; aucune fiche de la pédale OD-1 |
| `klon-centaur` | https://en.wikipedia.org/wiki/Klon_Centaur | source encyclopédique (Wikipedia), pas une fiche constructeur |
| `proco-rat` | https://en.wikipedia.org/wiki/Pro_Co_RAT | source encyclopédique (Wikipedia), pas une fiche constructeur |
| `boss-ce1` | https://www.boss.info/global/products/ce-2w | pointe la réédition CE-2W, pas le CE-1 original |
| `boss-vb2` | https://www.boss.info/global/products/vb-2w | pointe la réédition VB-2W, pas le VB-2 original |
| `boss-dm2` | https://www.boss.info/global/products/dm-2w | pointe la réédition DM-2W, pas le DM-2 original |
| `tc-electronic-flashback` | https://tcelectronic.com/en/products/0709-AGB | page du Flashback 2 ; le Flashback original n’a plus de fiche |
| `memory-man-delay` | https://www.ehx.com/products/deluxe-memory-man/ | page du Deluxe Memory Man ; le Memory Man original n’a plus de fiche |
| `roland-space-echo` | https://www.roland.com/global/products/rc_re-201_space_echo | page du plugin RE-201, pas la machine à bande originale |
| `tc-delay` | https://www.tcelectronic.com/products | 2290/Nova Delay discontinués : aucune fiche produit |
| `line6-dl4` | https://line6.com/effects-pedals/dl4-mkii | page du DL4 MkII ; le DL4 original n’a plus de fiche |
| `neunaber-reverb` | https://neunaber.net/collections/pedals | gamme Neunaber reprise par Quilter Labs ; pas de fiche du modèle Ambient |

Bilan de la vérification HTTP (novembre 2026) : sur 45 fiches signalées pour les
lots L1–L4, 33 sont corrigées — pages produit réelles pour BOSS
DD-3/RV-5/OD-3/DC-2W, EHX Holy Grail/Cathedral, Suhr Riot, Tech 21 GT2,
Fulltone OCD, Behringer SF300, Mesa Grid Slammer/Throttle Box, Joyo American
Sound, Marshall Guv'nor et Bluesbreaker, Meris Polymoon/Mercury7, Empress
Echosystem, Keeley Caverns, Red Panda Particle, OBNE Dark Star, Neunaber
Immerse, Eventide Space, SurfyBear Metal, Z.Vex Fuzz Factory, Way Huge Swollen
Pickle MkIIS, Line 6 DL4 MkII, Strymon Brigadier/BigSky, et Bondi Sick As.
Quatre liens sont passés en `urlKind: 'none'` : Satchurator et Vox Time Machine
(retirés du catalogue Vox), Malekko Ekko 616 (site constructeur hors ligne) et
Eventide Harmonizer (modèle studio sans fiche).

## Garantie de couverture

Le module de specs est découpé en modules feuilles : `specs/types.ts` (contrat
`PedalResearch`), `specs/urls.ts` (helpers et constantes d'URL partagés),
`specs/research.ts` (L1–L3), `specs/research-l4.ts` (L4) et
`specs/research-l5.ts` (L5). Seul `specs/index.ts` fusionne les lots — aucune
dépendance circulaire.

Le test `frontend/src/equipment/__tests__/definitions.test.ts` vérifie que :

1. chaque modèle des lots L1–L5 possède une fiche dans `specs/` ;
2. chaque fiche expose soit une URL constructeur, soit une justification
   explicite (`urlKind: 'none'` ou `house: true`) ;
3. toute fiche marquée `urlDoubt` a bien une URL et une justification,
   exposées par `PEDAL_RESEARCH_DOUBTS`.

## Familles de châssis

| Archétype | Dimensions (px) | Usage |
|---|---|---|
| `compact` | 300×460 | boîtier 3–4 knobs type BOSS/MXR |
| `compact-wide` | 340×460 | boîtier large (Big Muff, RAT, Strymon, Walrus) |
| `mini` | 260×380 | mini-pédales (Mooer, TS Mini) |
| `sliders` | 320×520 | faders horizontaux (Fundamental Series) |
| `eq` | 420×400 | égaliseurs à faders verticaux |
| `treadle` | 320×520 | wah / Uni-Vibe / volume |
| `expression` | 300×460 | expression / pitch |
| `looper` | 400×480 | looper / multi-effets (DL4) |
| `desktop` | 380×360 | Space Echo, Echorec, SurfyBear, Eventide Space |
| `tuner` | 280×400 | accordeurs |

## Reste à faire

- [ ] L6 Boost 9 + Comp 10 + Noisegate 5 + Octaver 5 + Pitch 5 + Ringmod/Bitcrusher/Lo-Fi/Rotary/Tuner/Multifx 31
- [ ] L7 Amplis 44 (recherche fiche par fiche)
