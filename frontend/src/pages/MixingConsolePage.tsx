import { useState, useCallback, useEffect, useMemo } from 'react'
import { Power, Link2, Save, CircleOff, Circle, Home, Building, Radio, Waves, Zap, Clock, RotateCcw, RotateCw } from 'lucide-react'
import { Knob } from '../components/Knob'
import { Slider } from '../components/Slider'
import Toggle from '../components/Toggle'
import { Dropdown } from '../components/Dropdown'
import { ColumnHeader } from '../components/equalizer/components/ColumnHeader'
import { VUMeter } from '../components/equalizer/components/VUMeter'
import { WebSocketClient } from '../services/websocket'
import { Block } from '../components/Block'
import { CTA } from '../components/CTA'

interface MixingConsolePageProps {
  stats?: {
    cpu: number
    latency: number
    peakInput: number
    peakOutput: number
  }
}

const clamp = (value: number, min = 0, max = 100) => Math.min(max, Math.max(min, value))

const dbToPercent = (db: number) => {
  const scaled = ((db + 60) / 60) * 120
  return clamp(isFinite(scaled) ? scaled : 0, 0, 120)
}

// Presets EQ pour 15 bandes (valeurs 0-100, où 50 = 0dB)
const EQ_PRESETS = {
  flat: [50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50],
  rock: [
    55, 60, 65, 70, 68,  // Lows (20, 31.5, 50, 80, 125 Hz)
    60, 50, 45, 40, 40,  // Low Mids - Scoop (200, 315, 500, 800, 1.25k Hz)
    45, 50, 60, 65, 70   // High Mids & Highs - Presence (2k, 3.15k, 5k, 8k, 12.5k Hz)
  ],
  jazz: [
    45, 50, 55, 60, 58,  // Lows légèrement boostés
    55, 58, 60, 58, 55,  // Mids équilibrés
    52, 50, 48, 45, 42   // Highs légèrement atténués
  ],
  pop: [
    50, 52, 55, 58, 60,  // Lows légèrement boostés
    58, 60, 62, 60, 58,  // Mids présents
    60, 62, 65, 68, 70   // Highs boostés pour la clarté
  ],
  metal: [
    65, 70, 75, 72, 68,  // Lows très boostés
    55, 45, 40, 38, 40,  // Mids fortement scoopés
    45, 50, 58, 65, 70   // Highs boostés pour le crunch
  ],
  vocal: [
    45, 48, 50, 52, 55,  // Lows légers
    60, 65, 68, 65, 60,  // Mids boostés (présence vocale)
    58, 60, 62, 60, 58   // Highs équilibrés
  ],
  bass: [
    70, 75, 80, 75, 70,  // Lows très boostés
    55, 50, 45, 50, 55,  // Mids équilibrés
    45, 40, 38, 40, 42   // Highs atténués
  ],
  bright: [
    45, 48, 50, 52, 50,  // Lows neutres
    52, 55, 58, 60, 62,  // Mids légèrement boostés
    65, 70, 75, 78, 80   // Highs très boostés
  ]
}

export function MixingConsolePage({ stats }: MixingConsolePageProps) {
  const ws = WebSocketClient.getInstance()

  // Pre-Amp / Input Section (from SimpleEqualizerPanel)
  const [level, setLevel] = useState(() => stats ? dbToPercent(stats.peakInput) : 75)
  const [width, setWidth] = useState(40)
  const [clipEnabled, setClipEnabled] = useState('Off')
  const [preAmpActive, setPreAmpActive] = useState(true)

  // Dynamics Section (from AdvancedView)
  const [attack, setAttack] = useState(30)
  const [release, setRelease] = useState(70)
  const [ratio, setRatio] = useState(40)
  const [thresh, setThresh] = useState(50)
  const [knee, setKnee] = useState(20)
  const [makeup, setMakeup] = useState(60)
  const [dynamicsActive, setDynamicsActive] = useState(true)

  // Space Section (from AdvancedView)
  const [depth, setDepth] = useState(30)
  const [reverbType, setReverbType] = useState('Room')
  const [stereoMode, setStereoMode] = useState('Stereo')
  const [spaceActive, setSpaceActive] = useState(true)

  // Master Section (from AdvancedView)
  const [masterLevel, setMasterLevel] = useState(80)

  // Saturation/Color Section (from AdvancedView + SimpleEqualizerPanel)
  const [drive, setDrive] = useState(65)
  const [satMix, setSatMix] = useState(75)
  const [bias, setBias] = useState(40)
  const [tone, setTone] = useState(55)
  const [texture, setTexture] = useState(85)
  const [output, setOutput] = useState(() => stats ? dbToPercent(stats.peakOutput) : 0)
  const [mix, setMix] = useState(100)
  const [saturationActive, setSaturationActive] = useState(true)

  // Equalizer Section (enriched with 15 bands - ISO standard frequencies)
  const [eqBands, setEqBands] = useState([
    50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50 // 15 bandes initialisées à 50 (neutre)
  ])
  const [eqPreset, setEqPreset] = useState<string>('flat')
  const [speedMode, setSpeedMode] = useState('Fast')
  const [phaseEnabled, setPhaseEnabled] = useState('Off')
  const lowCut = 80 // Fréquence Low-Cut standard
  const [eqActive, setEqActive] = useState(true)
  
  // Labels des fréquences ISO 1/3 d'octave pour 15 bandes (standards consoles physiques)
  const eqFrequencies = [
    '20', '31.5', '50', '80', '125', '200', '315',
    '500', '800', '1.25k', '2k', '3.15k', '5k',
    '8k', '12.5k'
  ]

  // Update from stats
  useEffect(() => {
    if (stats) {
      setDrive(clamp(stats.cpu))
      setOutput(dbToPercent(stats.peakOutput))
      setLevel(dbToPercent(stats.peakInput))
      setTone(clamp(40 + stats.latency * 4))
    }
  }, [stats])

  // WebSocket send function
  const sendEqualizerParam = useCallback((param: string, value: number | boolean | string) => {
    if (ws.isConnected()) {
      ws.send({
        type: 'setEqualizerParameter',
        parameter: param,
        value: value
      })
    }
  }, [ws])

  // Charger la configuration EQ sauvegardée au démarrage
  useEffect(() => {
    try {
      const savedConfig = localStorage.getItem('webamp-eq-config')
      if (savedConfig) {
        const config = JSON.parse(savedConfig)
        if (config.bands && Array.isArray(config.bands) && config.bands.length === 15) {
          setEqBands(config.bands)
          if (config.preset) setEqPreset(config.preset)
          if (config.speedMode) setSpeedMode(config.speedMode)
          if (config.phaseEnabled) setPhaseEnabled(config.phaseEnabled)
          if (config.active !== undefined) setEqActive(config.active)
          
          // Envoyer la configuration via WebSocket
          config.bands.forEach((value: number, index: number) => {
            sendEqualizerParam(`eqBand${index}`, value)
          })
        }
      }
    } catch (error) {
      // chargement EQ échoué silencieusement
    }
  }, [sendEqualizerParam])

  // Pre-Amp handlers
  const handleLevelChange = useCallback((value: number) => {
    setLevel(value)
    sendEqualizerParam('level', value)
  }, [sendEqualizerParam])

  const handleWidthChange = useCallback((value: number) => {
    setWidth(value)
    sendEqualizerParam('width', value)
  }, [sendEqualizerParam])

  const handleClipToggle = useCallback((value: string) => {
    setClipEnabled(value)
    sendEqualizerParam('clip', value === 'On')
  }, [sendEqualizerParam])

  const handlePreAmpToggle = useCallback(() => {
    const newState = !preAmpActive
    setPreAmpActive(newState)
    sendEqualizerParam('preAmpActive', newState)
  }, [preAmpActive, sendEqualizerParam])

  // Dynamics handlers
  const handleAttackChange = useCallback((value: number) => {
    setAttack(value)
    sendEqualizerParam('attack', value)
  }, [sendEqualizerParam])

  const handleReleaseChange = useCallback((value: number) => {
    setRelease(value)
    sendEqualizerParam('release', value)
  }, [sendEqualizerParam])

  const handleRatioChange = useCallback((value: number) => {
    setRatio(value)
    sendEqualizerParam('ratio', value)
  }, [sendEqualizerParam])

  const handleThreshChange = useCallback((value: number) => {
    setThresh(value)
    sendEqualizerParam('thresh', value)
  }, [sendEqualizerParam])

  const handleKneeChange = useCallback((value: number) => {
    setKnee(value)
    sendEqualizerParam('knee', value)
  }, [sendEqualizerParam])

  const handleMakeupChange = useCallback((value: number) => {
    setMakeup(value)
    sendEqualizerParam('makeup', value)
  }, [sendEqualizerParam])

  const handleDynamicsToggle = useCallback(() => {
    const newState = !dynamicsActive
    setDynamicsActive(newState)
    sendEqualizerParam('dynamicsActive', newState)
  }, [dynamicsActive, sendEqualizerParam])

  // Space handlers
  const handleDepthChange = useCallback((value: number) => {
    setDepth(value)
    sendEqualizerParam('depth', value)
  }, [sendEqualizerParam])

  const handleReverbTypeChange = useCallback((value: string) => {
    setReverbType(value)
    sendEqualizerParam('reverbType', value)
  }, [sendEqualizerParam])

  const handleStereoModeChange = useCallback((value: string) => {
    setStereoMode(value)
    sendEqualizerParam('stereoMode', value)
  }, [sendEqualizerParam])

  const handleSpaceToggle = useCallback(() => {
    const newState = !spaceActive
    setSpaceActive(newState)
    sendEqualizerParam('spaceActive', newState)
  }, [spaceActive, sendEqualizerParam])

  // Master handler
  const handleMasterChange = useCallback((value: number) => {
    setMasterLevel(value)
    sendEqualizerParam('master', value)
  }, [sendEqualizerParam])

  // Saturation handlers
  const handleDriveChange = useCallback((value: number) => {
    setDrive(value)
    sendEqualizerParam('drive', value)
  }, [sendEqualizerParam])

  const handleSatMixChange = useCallback((value: number) => {
    setSatMix(value)
    sendEqualizerParam('satMix', value)
  }, [sendEqualizerParam])

  const handleBiasChange = useCallback((value: number) => {
    setBias(value)
    sendEqualizerParam('bias', value)
  }, [sendEqualizerParam])

  const handleToneChange = useCallback((value: number) => {
    setTone(value)
    sendEqualizerParam('tone', value)
  }, [sendEqualizerParam])

  const handleTextureChange = useCallback((value: number) => {
    setTexture(value)
    sendEqualizerParam('texture', value)
  }, [sendEqualizerParam])

  const handleOutputChange = useCallback((value: number) => {
    setOutput(value)
    sendEqualizerParam('output', value)
  }, [sendEqualizerParam])

  const handleMixChange = useCallback((value: number) => {
    setMix(value)
    sendEqualizerParam('mix', value)
  }, [sendEqualizerParam])

  const handleSaturationToggle = useCallback(() => {
    const newState = !saturationActive
    setSaturationActive(newState)
    sendEqualizerParam('saturationActive', newState)
  }, [saturationActive, sendEqualizerParam])

  // EQ handlers pour 15 bandes
  const handleEqBandChange = useCallback((index: number, value: number) => {
    setEqBands(prev => {
      const newBands = [...prev]
      newBands[index] = value
      return newBands
    })
    sendEqualizerParam(`eqBand${index}`, value)
  }, [sendEqualizerParam])

  const handleSpeedModeChange = useCallback((value: string) => {
    setSpeedMode(value)
    sendEqualizerParam('speedMode', value)
  }, [sendEqualizerParam])

  const handlePhaseToggle = useCallback((value: string) => {
    setPhaseEnabled(value)
    sendEqualizerParam('phase', value === 'On')
  }, [sendEqualizerParam])

  const handleEqToggle = useCallback(() => {
    const newState = !eqActive
    setEqActive(newState)
    sendEqualizerParam('eqActive', newState)
  }, [eqActive, sendEqualizerParam])

  // Handler pour appliquer un preset
  const handlePresetChange = useCallback((presetName: string) => {
    const preset = EQ_PRESETS[presetName as keyof typeof EQ_PRESETS]
    if (preset) {
      setEqBands([...preset])
      setEqPreset(presetName)
      // Envoyer toutes les bandes via WebSocket
      preset.forEach((value, index) => {
        sendEqualizerParam(`eqBand${index}`, value)
      })
    }
  }, [sendEqualizerParam])

  // Handler pour sauvegarder la configuration EQ
  const handleSaveEqConfig = useCallback(() => {
    try {
      const eqConfig = {
        bands: eqBands,
        preset: eqPreset,
        speedMode,
        phaseEnabled,
        lowCut,
        active: eqActive,
        timestamp: new Date().toISOString()
      }
      localStorage.setItem('webamp-eq-config', JSON.stringify(eqConfig))
      
      // Feedback visuel (vous pouvez utiliser un toast si disponible)
      // Pour l'instant, on peut juste afficher un message temporaire (pas de log console)
      // Optionnel: Envoyer via WebSocket pour sauvegarde serveur
      if (ws.isConnected()) {
        ws.send({
          type: 'saveEqualizerConfig',
          config: eqConfig
        })
      }
    } catch (error) {
      // échec silencieux de la sauvegarde EQ
    }
  }, [eqBands, eqPreset, speedMode, phaseEnabled, lowCut, eqActive, ws])

  // Génération du chemin SVG pour la courbe de visualisation
  const eqPathData = useMemo(() => {
    if (eqBands.length === 0) return ""
    
    // Dimensions du viewBox SVG
    const width = 1000
    const height = 200
    const step = width / (eqBands.length - 1)

    // Convertir les valeurs des bandes (0-100) en coordonnées
    // Inverser Y car SVG 0 est en haut. 50 = centre (0dB), 0 = haut (+12dB), 100 = bas (-12dB)
    const points = eqBands.map((val, i) => {
      // Convertir 0-100 en position Y (0 = haut, 200 = bas)
      // 50 = centre (100), 0 = haut (0), 100 = bas (200)
      const y = height - (val / 100) * height
      const x = i * step
      return { x, y }
    })

    // Créer une courbe lisse avec des points de contrôle Bézier cubiques
    let d = `M ${points[0].x} ${points[0].y}`

    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i]
      const p1 = points[i + 1]
      
      // Points de contrôle pour lisser la courbe
      const cp1x = p0.x + (p1.x - p0.x) / 2
      const cp1y = p0.y
      const cp2x = p0.x + (p1.x - p0.x) / 2
      const cp2y = p1.y

      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1.x} ${p1.y}`
    }

    return d
  }, [eqBands])

  // Couleur principale du site (orange/amber)
  const primaryColor = '#f97316' // orange-500 de Tailwind

  return (
    <div className="h-full overflow-y-auto custom-scrollbar p-6 pb-32">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-black/85 dark:text-white/90 mb-6">
          Console de mixage
        </h1>
        {/* Console complète */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Section principale : Console de mixage complète */}
          <Block className="lg:col-span-12">
            <div className="flex flex-col lg:flex-row gap-6 w-full transition-colors duration-200 items-stretch overflow-x-auto custom-scrollbar">
              {/* COLUMN 1: PRE-AMP / INPUT */}
              <div className="flex flex-col gap-4 flex-1 min-w-[200px] h-full">
                <ColumnHeader 
                  title="PRE-AMP"
                  icon={
                    <button
                      onClick={handlePreAmpToggle}
                      onTouchStart={(e) => {
                        e.preventDefault()
                        handlePreAmpToggle()
                      }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 touch-manipulation ${
                        preAmpActive
                          ? 'bg-green-500 text-white shadow-[0_8px_18px_rgba(34,197,94,0.3)]'
                          : 'bg-red-500 text-white shadow-[0_8px_18px_rgba(239,68,68,0.3)]'
                      }`}
                      aria-label="Activer/Désactiver Pre-Amp"
                      style={{ minWidth: '44px', minHeight: '44px' }}
                    >
                      <Power size={18} />
                    </button>
                  }
                />
                <div className="bg-white dark:bg-gray-700 rounded-2xl p-4 shadow-[inset_3px_3px_6px_rgba(0,0,0,0.1),inset_-3px_-3px_6px_rgba(255,255,255,0.9),0_0_0_1px_rgba(255,255,255,0.8)] dark:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.5),inset_-3px_-3px_6px_rgba(60,60,60,0.5),0_0_0_1px_rgba(60,60,60,0.8)] flex flex-col gap-4 flex-1 justify-between border border-gray-100 dark:border-gray-600 transition-colors duration-200">
                  <div className="flex flex-col items-center gap-6 flex-1 justify-center">
                    <Knob
                      label="Level"
                      value={level}
                      onChange={handleLevelChange}
                      size="lg"
                      showValue
                      disabled={!preAmpActive}
                      valueRawDisplayFn={(v: number) => `${Math.round((v / 120) * 12)} dB`}
                    />
                    <Knob
                      label="Width"
                      value={width}
                      onChange={handleWidthChange}
                      size="sm"
                      disabled={!preAmpActive}
                      valueRawDisplayFn={(v: number) => `${Math.round(v)}%`}
                    />
                  </div>
                  <div className="flex justify-center mt-auto">
                    <Toggle 
                      options={['Off', 'On']} 
                      value={clipEnabled} 
                      onChange={handleClipToggle}
                      icons={[CircleOff, Circle]}
                    />
                  </div>
                </div>
              </div>

              {/* COLUMN 2: DYNAMICS */}
              <div className="flex flex-col gap-4 flex-1 min-w-[200px] h-full">
                <ColumnHeader 
                  title="DYNAMICS"
                  icon={
                    <button
                      onClick={handleDynamicsToggle}
                      onTouchStart={(e) => {
                        e.preventDefault()
                        handleDynamicsToggle()
                      }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 touch-manipulation ${
                        dynamicsActive
                          ? 'bg-green-500 text-white shadow-[0_8px_18px_rgba(34,197,94,0.3)]'
                          : 'bg-red-500 text-white shadow-[0_8px_18px_rgba(239,68,68,0.3)]'
                      }`}
                      aria-label="Activer/Désactiver Dynamics"
                      style={{ minWidth: '44px', minHeight: '44px' }}
                    >
                      <Power size={18} />
                    </button>
                  }
                />
                <div className="bg-white dark:bg-gray-700 rounded-2xl p-4 shadow-[inset_3px_3px_6px_rgba(0,0,0,0.1),inset_-3px_-3px_6px_rgba(255,255,255,0.9),0_0_0_1px_rgba(255,255,255,0.8)] dark:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.5),inset_-3px_-3px_6px_rgba(60,60,60,0.5),0_0_0_1px_rgba(60,60,60,0.8)] flex flex-col gap-4 flex-1 justify-between border border-gray-100 dark:border-gray-600 transition-colors duration-200">
                  <div className="flex justify-between gap-2 px-1">
                    <Slider label="Attack" value={attack} onChange={handleAttackChange} orientation="vertical" />
                    <Slider label="Release" value={release} onChange={handleReleaseChange} orientation="vertical" />
                    <Slider label="Ratio" value={ratio} onChange={handleRatioChange} orientation="vertical" />
                  </div>
                  <div className="w-full h-[1px] bg-gray-300/50 dark:bg-gray-600/50 shadow-[0_1px_0_#fff] dark:shadow-[0_1px_0_rgba(60,60,60,0.8)]" />
                  <div className="flex justify-between items-end gap-2 pb-2">
                    <Knob label="Thresh" value={thresh} onChange={handleThreshChange} size="sm" disabled={!dynamicsActive} />
                    <Knob label="Knee" value={knee} onChange={handleKneeChange} size="sm" disabled={!dynamicsActive} />
                    <Knob label="Makeup" value={makeup} onChange={handleMakeupChange} size="sm" disabled={!dynamicsActive} />
                  </div>
                </div>
              </div>

              {/* COLUMN 3: CENTER (MASTER) */}
              <div className="flex flex-col items-center justify-between gap-4 px-4 min-w-[160px] h-full">
                <div className="flex-1 flex items-center justify-center min-h-[120px] pt-8">
                  <Knob label="MASTER" value={masterLevel} onChange={handleMasterChange} size="lg" showValue />
                </div>
                <VUMeter peakOutput={stats?.peakOutput} />
              </div>

              {/* COLUMN 4: SPACE */}
              <div className="flex flex-col gap-4 flex-1 min-w-[180px] h-full">
                <ColumnHeader 
                  title="SPACE"
                  icon={
                    <button
                      onClick={handleSpaceToggle}
                      onTouchStart={(e) => {
                        e.preventDefault()
                        handleSpaceToggle()
                      }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 touch-manipulation ${
                        spaceActive
                          ? 'bg-green-500 text-white shadow-[0_8px_18px_rgba(34,197,94,0.3)]'
                          : 'bg-red-500 text-white shadow-[0_8px_18px_rgba(239,68,68,0.3)]'
                      }`}
                      aria-label="Activer/Désactiver Space"
                      style={{ minWidth: '44px', minHeight: '44px' }}
                    >
                      <Power size={18} />
                    </button>
                  }
                />
                <div className="bg-white dark:bg-gray-700 rounded-2xl p-4 shadow-[inset_3px_3px_6px_rgba(0,0,0,0.1),inset_-3px_-3px_6px_rgba(255,255,255,0.9),0_0_0_1px_rgba(255,255,255,0.8)] dark:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.5),inset_-3px_-3px_6px_rgba(60,60,60,0.5),0_0_0_1px_rgba(60,60,60,0.8)] flex flex-col gap-4 flex-1 justify-between border border-gray-100 dark:border-gray-600 transition-colors duration-200">
                  <div className="flex justify-around gap-4 flex-1 pt-4">
                    <div className="flex flex-col items-center flex-1 gap-2">
                      <Slider label="" value={width} onChange={handleWidthChange} orientation="vertical" />
                      <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 mt-2">WIDTH</span>
                    </div>
                    <div className="flex flex-col items-center flex-1 gap-2">
                      <Slider label="" value={depth} onChange={handleDepthChange} orientation="vertical" />
                      <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 mt-2">DEPTH</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4 mb-2 items-center">
                    <Toggle 
                      options={['Room', 'Hall']} 
                      value={reverbType} 
                      onChange={handleReverbTypeChange}
                      icons={[Home, Building]}
                    />
                    <Toggle 
                      options={['Stereo', 'Mono']} 
                      value={stereoMode} 
                      onChange={handleStereoModeChange}
                      icons={[Waves, Radio]}
                    />
                  </div>
                </div>
              </div>

              {/* COLUMN 5: COLOR */}
              <div className="flex flex-col gap-4 flex-1 min-w-[200px] h-full">
                <ColumnHeader 
                  title="COLOR"
                  icon={
                    <button
                      onClick={handleSaturationToggle}
                      onTouchStart={(e) => {
                        e.preventDefault()
                        handleSaturationToggle()
                      }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 touch-manipulation ${
                        saturationActive
                          ? 'bg-green-500 text-white shadow-[0_8px_18px_rgba(34,197,94,0.3)]'
                          : 'bg-red-500 text-white shadow-[0_8px_18px_rgba(239,68,68,0.3)]'
                      }`}
                      aria-label="Activer/Désactiver Saturation"
                      style={{ minWidth: '44px', minHeight: '44px' }}
                    >
                      <Power size={18} />
                    </button>
                  }
                />
                <div className="bg-white dark:bg-gray-700 rounded-2xl p-4 shadow-[inset_3px_3px_6px_rgba(0,0,0,0.1),inset_-3px_-3px_6px_rgba(255,255,255,0.9),0_0_0_1px_rgba(255,255,255,0.8)] dark:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.5),inset_-3px_-3px_6px_rgba(60,60,60,0.5),0_0_0_1px_rgba(60,60,60,0.8)] flex flex-col gap-4 flex-1 justify-between border border-gray-100 dark:border-gray-600 transition-colors duration-200">
                  <div className="flex justify-around pt-2">
                    <Knob label="Drive" value={drive} onChange={handleDriveChange} size="md" disabled={!saturationActive} />
                    <Knob label="Mix" value={satMix} onChange={handleSatMixChange} size="md" disabled={!saturationActive} />
                  </div>
                  <div className="flex justify-center -my-2 opacity-30">
                    <Link2 size={16} />
                  </div>
                  <div className="flex justify-around">
                    <Knob label="Bias" value={bias} onChange={handleBiasChange} size="sm" disabled={!saturationActive} />
                    <Knob label="Tone" value={tone} onChange={handleToneChange} size="sm" disabled={!saturationActive} />
                  </div>
                  <div className="flex justify-center pb-2">
                    <Knob label="Texture" value={texture} onChange={handleTextureChange} size="sm" disabled={!saturationActive} />
                  </div>
                  <div className="w-full h-[1px] bg-gray-300/50 dark:bg-gray-600/50 shadow-[0_1px_0_#fff] dark:shadow-[0_1px_0_rgba(60,60,60,0.8)]" />
                  <div className="grid grid-cols-2 gap-3">
                    <Knob label="Output" value={output} onChange={handleOutputChange} size="sm" disabled={!saturationActive} valueRawDisplayFn={(v: number) => `${Math.round((v / 120) * 12)} dB`} />
                    <Knob label="Mix" value={mix} onChange={handleMixChange} size="sm" disabled={!saturationActive} valueRawDisplayFn={(v: number) => `${Math.round(v)}%`} />
                  </div>
                </div>
              </div>
            </div>
          </Block>

          {/* EQUALIZER - Ligne séparée avec 15 bandes */}
          <Block className="lg:col-span-12">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <ColumnHeader 
                  title="EQUALIZER"
                  icon={
                    <button
                      onClick={handleEqToggle}
                      onTouchStart={(e) => {
                        e.preventDefault()
                        handleEqToggle()
                      }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 touch-manipulation ${
                        eqActive
                          ? 'bg-green-500 text-white shadow-[0_8px_18px_rgba(34,197,94,0.3)]'
                          : 'bg-red-500 text-white shadow-[0_8px_18px_rgba(239,68,68,0.3)]'
                      }`}
                      aria-label="Activer/Désactiver EQ"
                      style={{ minWidth: '44px', minHeight: '44px' }}
                    >
                      <Power size={18} />
                    </button>
                  }
                />
                <div className="flex items-center gap-3">
                  <div className="w-48">
                    <Dropdown
                      options={[
                        { value: 'flat', label: 'Flat' },
                        { value: 'rock', label: 'Rock' },
                        { value: 'jazz', label: 'Jazz' },
                        { value: 'pop', label: 'Pop' },
                        { value: 'metal', label: 'Metal' },
                        { value: 'vocal', label: 'Vocal' },
                        { value: 'bass', label: 'Bass' },
                        { value: 'bright', label: 'Bright' }
                      ]}
                      value={eqPreset}
                      onChange={handlePresetChange}
                      placeholder="Sélectionner un preset"
                    />
                  </div>
                  <CTA
                    variant="important"
                    icon={<Save size={18} />}
                    onClick={handleSaveEqConfig}
                    title="Sauvegarder la configuration EQ"
                    aria-label="Sauvegarder la configuration EQ"
                  />
                </div>
              </div>
              <div className="bg-white dark:bg-gray-700 rounded-2xl p-4 shadow-[inset_3px_3px_6px_rgba(0,0,0,0.1),inset_-3px_-3px_6px_rgba(255,255,255,0.9),0_0_0_1px_rgba(255,255,255,0.8)] dark:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.5),inset_-3px_-3px_6px_rgba(60,60,60,0.5),0_0_0_1px_rgba(60,60,60,0.8)] flex flex-col gap-4 border border-gray-100 dark:border-gray-600 transition-colors duration-200">
                {/* Écran de visualisation de la courbe EQ */}
                <div className="h-48 w-full bg-gray-900 dark:bg-gray-950 rounded-3xl border border-white/5 dark:border-gray-800 relative overflow-hidden shadow-inner">
                  {/* Lignes de grille */}
                  <div className="absolute inset-0 flex flex-col justify-between py-4 opacity-20 pointer-events-none px-8">
                    <div className="w-full h-px bg-white border-t border-dashed" />
                    <div className="w-full h-px bg-orange-500" /> {/* Ligne centrale */}
                    <div className="w-full h-px bg-white border-t border-dashed" />
                  </div>

                  <svg className="w-full h-full p-4" viewBox="0 0 1000 200" preserveAspectRatio="none">
                    {/* Définition du gradient */}
                    <defs>
                      <linearGradient id="eqCurveGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={primaryColor} stopOpacity="0.5" />
                        <stop offset="100%" stopColor={primaryColor} stopOpacity="0" />
                      </linearGradient>
                    </defs>

                    {/* Zone remplie sous la courbe */}
                    <path 
                      d={`${eqPathData} L 1000 200 L 0 200 Z`} 
                      fill="url(#eqCurveGradient)" 
                      opacity={eqActive ? 1 : 0.5}
                    />
                    
                    {/* Ligne de la courbe */}
                    <path 
                      d={eqPathData} 
                      fill="none" 
                      stroke={primaryColor} 
                      strokeWidth="3" 
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity={eqActive ? 1 : 0.5}
                      className="drop-shadow-[0_0_10px_rgba(249,115,22,0.5)]"
                    />
                  </svg>
                </div>

                {/* Sliders pour les 15 bandes */}
                <div className="flex justify-between gap-1 px-1 w-full">
                  {eqBands.map((value, index) => (
                    <div key={index} className="flex-1 flex justify-center">
                      <Slider 
                        label={eqFrequencies[index]} 
                        value={value} 
                        onChange={(v) => handleEqBandChange(index, v)} 
                        orientation="vertical"
                        color={primaryColor}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex flex-col gap-3 items-center mt-2">
                  <div className="flex items-center gap-4">
                    <span className="text-xl font-bold text-gray-600 dark:text-gray-300 font-mono">{lowCut}</span>
                    <div className="flex flex-col gap-1">
                      <span className="text-[8px] font-bold text-gray-400 dark:text-gray-500">Low-Cut</span>
                      <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full overflow-hidden">
                        <div className="w-1/2 h-full bg-blue-400"></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Toggle 
                      options={['Fast', 'Slow']} 
                      value={speedMode} 
                      onChange={handleSpeedModeChange}
                      icons={[Zap, Clock]}
                    />
                    <Toggle 
                      options={['Off', 'On']} 
                      value={phaseEnabled} 
                      onChange={handlePhaseToggle}
                      icons={[RotateCcw, RotateCw]}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Block>
        </div>
      </div>
    </div>
  )
}

