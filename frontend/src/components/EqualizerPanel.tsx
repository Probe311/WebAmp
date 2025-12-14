import { useState, useCallback, useEffect, useMemo } from 'react'
import { Power, Link2 } from 'lucide-react'
import { Knob } from './Knob'
import { Slider } from './Slider'
import Toggle from './Toggle'
import { Display } from './equalizer/components/Display'
import { ColumnHeader } from './equalizer/components/ColumnHeader'
import { VUMeter } from './equalizer/components/VUMeter'
import { WebSocketClient } from '../services/websocket'

interface EqualizerPanelProps {
  stats?: {
    cpu: number
    latency: number
    peakInput: number
    peakOutput: number
  }
  variant?: 'simple' | 'advanced'
}

const clamp = (value: number, min = 0, max = 100) => Math.min(max, Math.max(min, value))

const dbToPercent = (db: number) => {
  const scaled = ((db + 60) / 60) * 120
  return clamp(isFinite(scaled) ? scaled : 0, 0, 120)
}

export function EqualizerPanel({ stats, variant = 'advanced' }: EqualizerPanelProps) {
  const ws = WebSocketClient.getInstance()

  // Pre-Amp / Input Section
  const [level, setLevel] = useState(() => stats ? dbToPercent(stats.peakInput) : 75)
  const [width, setWidth] = useState(40)
  const [clipEnabled, setClipEnabled] = useState('Off')
  const [preAmpActive, setPreAmpActive] = useState(true)

  // Dynamics Section
  const [attack, setAttack] = useState(30)
  const [release, setRelease] = useState(70)
  const [ratio, setRatio] = useState(40)
  const [thresh, setThresh] = useState(50)
  const [knee, setKnee] = useState(20)
  const [makeup, setMakeup] = useState(60)
  const [dynamicsActive, setDynamicsActive] = useState(true)

  // Space Section
  const [spaceWidth, setSpaceWidth] = useState(45)
  const [depth, setDepth] = useState(30)
  const [reverbType, setReverbType] = useState('Room')
  const [stereoMode, setStereoMode] = useState('Stereo')
  const [spaceActive, setSpaceActive] = useState(true)

  // Master Section
  const [masterLevel, setMasterLevel] = useState(80)

  // Saturation/Color Section
  const [drive, setDrive] = useState(65)
  const [satMix, setSatMix] = useState(75)
  const [bias, setBias] = useState(40)
  const [tone, setTone] = useState(55)
  const [texture, setTexture] = useState(85)
  const [hqMode, setHqMode] = useState('Off')
  const [saturationActive, setSaturationActive] = useState(true)

  // Equalizer Section
  const [eqLow, setEqLow] = useState(60)
  const [eqMid, setEqMid] = useState(45)
  const [eqHigh, setEqHigh] = useState(70)
  const [eqAir, setEqAir] = useState(85)
  const [speedMode, setSpeedMode] = useState('Fast')
  const [phaseEnabled, setPhaseEnabled] = useState('Off')
  const [eqActive, setEqActive] = useState(true)

  // 15-band EQ (pour variant advanced)
  const [eqBands] = useState([
    50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50
  ])
  const eqFrequencies = [
    '20', '31.5', '50', '80', '125', '200', '315',
    '500', '800', '1.25k', '2k', '3.15k', '5k',
    '8k', '12.5k'
  ]
  const eqPositions = useMemo(() => {
    const logStart = Math.log10(20)
    const logEnd = Math.log10(12500)
    return eqFrequencies.map((_, index) => {
      const logValue = logStart + (index / 14) * (logEnd - logStart)
      const linearPos = ((Math.pow(10, logValue) - 20) / (12500 - 20)) * 96 + 2
      return linearPos
    })
  }, [])

  // Update from stats
  useEffect(() => {
    if (stats) {
      setDrive(clamp(stats.cpu))
      setLevel(dbToPercent(stats.peakInput))
      setTone(clamp(40 + stats.latency * 4))
    }
  }, [stats])

  // Fonctions pour envoyer les paramètres via WebSocket
  const sendEqualizerParam = useCallback((param: string, value: number | boolean | string) => {
    if (ws.isConnected()) {
      ws.send({
        type: 'setEqualizerParameter',
        parameter: param,
        value: value
      })
    }
  }, [ws])

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
  const handleSpaceWidthChange = useCallback((value: number) => {
    setSpaceWidth(value)
    sendEqualizerParam('spaceWidth', value)
  }, [sendEqualizerParam])

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

  const handleHqModeToggle = useCallback((value: string) => {
    setHqMode(value)
    sendEqualizerParam('hqMode', value === 'On')
  }, [sendEqualizerParam])

  const handleSaturationToggle = useCallback(() => {
    const newState = !saturationActive
    setSaturationActive(newState)
    sendEqualizerParam('saturationActive', newState)
  }, [saturationActive, sendEqualizerParam])

  // EQ handlers
  const handleEqLowChange = useCallback((value: number) => {
    setEqLow(value)
    sendEqualizerParam('eqLow', value)
  }, [sendEqualizerParam])

  const handleEqMidChange = useCallback((value: number) => {
    setEqMid(value)
    sendEqualizerParam('eqMid', value)
  }, [sendEqualizerParam])

  const handleEqHighChange = useCallback((value: number) => {
    setEqHigh(value)
    sendEqualizerParam('eqHigh', value)
  }, [sendEqualizerParam])

  const handleEqAirChange = useCallback((value: number) => {
    setEqAir(value)
    sendEqualizerParam('eqAir', value)
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

  if (variant === 'simple') {
    return (
      <div className="flex flex-col md:flex-row gap-8 md:gap-12 justify-center items-stretch">
        {/* Panel 1: Pre-Amp & Width */}
        <div className="bg-white dark:bg-gray-800 rounded-[24px] p-8 shadow-[8px_8px_16px_rgba(0,0,0,0.1),-8px_-8px_16px_rgba(255,255,255,0.9),inset_0_0_0_1px_rgba(255,255,255,0.8)] dark:shadow-[8px_8px_16px_rgba(0,0,0,0.5),-8px_-8px_16px_rgba(60,60,60,0.5),inset_0_0_0_1px_rgba(60,60,60,0.8)] flex flex-col items-center gap-8 min-w-[160px] transition-colors duration-200">
          <button
            onClick={handlePreAmpToggle}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
              preAmpActive
                ? 'bg-green-500 text-white shadow-[0_8px_18px_rgba(34,197,94,0.3)]'
                : 'bg-red-500 text-white shadow-[0_8px_18px_rgba(239,68,68,0.3)]'
            }`}
            aria-label="Activer/Désactiver Pre-Amp"
          >
            <Power size={18} />
          </button>
          <div className="flex flex-col items-center gap-10 flex-1 justify-center">
            <Knob
              label="Input"
              value={level}
              onChange={handleLevelChange}
              size="lg"
              showValue
              disabled={!preAmpActive}
            />
            <Knob
              label="Width"
              value={width}
              onChange={handleWidthChange}
              size="sm"
              disabled={!preAmpActive}
            />
          </div>
          <div className="mt-8">
            <Toggle
              options={['Off', 'On']}
              value={clipEnabled}
              onChange={handleClipToggle}
            />
          </div>
        </div>

        {/* Panel 2: Equalizer */}
        <div className="bg-white dark:bg-gray-800 rounded-[24px] p-8 shadow-[8px_8px_16px_rgba(0,0,0,0.1),-8px_-8px_16px_rgba(255,255,255,0.9),inset_0_0_0_1px_rgba(255,255,255,0.8)] dark:shadow-[8px_8px_16px_rgba(0,0,0,0.5),-8px_-8px_16px_rgba(60,60,60,0.5),inset_0_0_0_1px_rgba(60,60,60,0.8)] flex flex-col items-center gap-8 min-w-[160px] transition-colors duration-200">
          <button
            onClick={handleEqToggle}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
              eqActive
                ? 'bg-green-500 text-white shadow-[0_8px_18px_rgba(34,197,94,0.3)]'
                : 'bg-red-500 text-white shadow-[0_8px_18px_rgba(239,68,68,0.3)]'
            }`}
            aria-label="Activer/Désactiver EQ"
          >
            <Power size={18} />
          </button>
          <div className="flex flex-col gap-6 w-full max-w-[240px]">
            <Display bands={[eqLow, eqMid, eqHigh, eqAir]} />
            <div className="flex justify-between gap-3 px-1">
              <Slider label="Low" value={eqLow} onChange={handleEqLowChange} orientation="vertical" />
              <Slider label="Mid" value={eqMid} onChange={handleEqMidChange} orientation="vertical" />
              <Slider label="High" value={eqHigh} onChange={handleEqHighChange} orientation="vertical" />
              <Slider label="Air" value={eqAir} onChange={handleEqAirChange} orientation="vertical" />
            </div>
          </div>
          <div className="flex flex-col items-center gap-6 mt-auto">
            <Toggle
              options={['Fast', 'Slow']}
              value={speedMode}
              onChange={handleSpeedModeChange}
            />
            <Toggle
              options={['Off', 'On']}
              value={phaseEnabled}
              onChange={handlePhaseToggle}
            />
          </div>
        </div>

        {/* Panel 3: Color (Saturation) */}
        <div className="bg-white dark:bg-gray-800 rounded-[24px] p-8 shadow-[8px_8px_16px_rgba(0,0,0,0.1),-8px_-8px_16px_rgba(255,255,255,0.9),inset_0_0_0_1px_rgba(255,255,255,0.8)] dark:shadow-[8px_8px_16px_rgba(0,0,0,0.5),-8px_-8px_16px_rgba(60,60,60,0.5),inset_0_0_0_1px_rgba(60,60,60,0.8)] flex flex-col items-center gap-8 min-w-[160px] transition-colors duration-200">
          <button
            onClick={handleSaturationToggle}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
              saturationActive
                ? 'bg-green-500 text-white shadow-[0_8px_18px_rgba(34,197,94,0.3)]'
                : 'bg-red-500 text-white shadow-[0_8px_18px_rgba(239,68,68,0.3)]'
            }`}
            aria-label="Activer/Désactiver Color"
          >
            <Power size={18} />
          </button>
          <div className="grid grid-cols-2 gap-x-8 gap-y-8">
            <Knob
              label="Drive"
              value={drive}
              onChange={handleDriveChange}
              size="md"
              disabled={!saturationActive}
            />
            <Knob
              label="Mix"
              value={satMix}
              onChange={handleSatMixChange}
              size="md"
              disabled={!saturationActive}
            />
          </div>
          <div className="w-full h-[1px] bg-gray-300/50 dark:bg-gray-600/50 my-4 shadow-[0_1px_0_#fff] dark:shadow-[0_1px_0_rgba(60,60,60,0.8)]" />
          <div className="grid grid-cols-2 gap-x-8 gap-y-8">
            <Knob
              label="Bias"
              value={bias}
              onChange={handleBiasChange}
              size="sm"
              disabled={!saturationActive}
            />
            <Knob
              label="Tone"
              value={tone}
              onChange={handleToneChange}
              size="sm"
              disabled={!saturationActive}
            />
          </div>
          <div className="mt-auto pt-8">
            <Toggle
              options={['Off', 'On']}
              value={hqMode}
              onChange={handleHqModeToggle}
            />
          </div>
        </div>
      </div>
    )
  }

  // Variant advanced
  return (
    <div className="bg-white dark:bg-gray-800 rounded-[32px] p-6 md:p-8 shadow-[8px_8px_16px_rgba(0,0,0,0.1),-8px_-8px_16px_rgba(255,255,255,0.9),inset_0_0_0_1px_rgba(255,255,255,0.8)] dark:shadow-[8px_8px_16px_rgba(0,0,0,0.5),-8px_-8px_16px_rgba(60,60,60,0.5),inset_0_0_0_1px_rgba(60,60,60,0.8)] flex flex-col lg:flex-row gap-6 w-full transition-colors duration-200 items-stretch">
      {/* COLUMN 1: DYNAMICS */}
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

      {/* COLUMN 2: SPACE (Ambience) */}
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
              <Slider label="" value={spaceWidth} onChange={handleSpaceWidthChange} orientation="vertical" />
              <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 mt-2">WIDTH</span>
            </div>
            <div className="flex flex-col items-center flex-1 gap-2">
              <Slider label="" value={depth} onChange={handleDepthChange} orientation="vertical" />
              <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 mt-2">DEPTH</span>
            </div>
          </div>
          <div className="flex flex-col gap-4 mb-2 items-center">
            <Toggle options={['Room', 'Hall']} value={reverbType} onChange={handleReverbTypeChange} />
            <Toggle options={['Stereo', 'Mono']} value={stereoMode} onChange={handleStereoModeChange} />
          </div>
        </div>
      </div>

      {/* COLUMN 3: CENTER (MASTER) */}
      <div className="flex flex-col items-center justify-between gap-4 px-4 min-w-[160px] h-full">
        <div className="flex-1 flex items-center justify-center min-h-[120px]">
          <Knob label="MASTER" value={masterLevel} onChange={handleMasterChange} size="lg" showValue />
        </div>
        <VUMeter peakOutput={stats?.peakOutput} />
      </div>

      {/* COLUMN 4: SATURATION (COLOR) */}
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
        </div>
      </div>

      {/* COLUMN 5: EQUALIZER */}
      <div className="flex flex-col gap-4 flex-1 min-w-[200px] h-full">
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
        <div className="bg-white dark:bg-gray-700 rounded-2xl p-4 shadow-[inset_3px_3px_6px_rgba(0,0,0,0.1),inset_-3px_-3px_6px_rgba(255,255,255,0.9),0_0_0_1px_rgba(255,255,255,0.8)] dark:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.5),inset_-3px_-3px_6px_rgba(60,60,60,0.5),0_0_0_1px_rgba(60,60,60,0.8)] flex flex-col gap-4 flex-1 justify-between border border-gray-100 dark:border-gray-600 transition-colors duration-200">
          <div className="h-20 w-full">
            <Display variant="flat" bands={eqBands} frequencies={eqFrequencies} positions={eqPositions} active={eqActive} />
          </div>
          <div className="flex justify-between gap-2 px-1 flex-1">
            <Slider label="Low" value={eqLow} onChange={handleEqLowChange} orientation="vertical" />
            <Slider label="Mid" value={eqMid} onChange={handleEqMidChange} orientation="vertical" />
            <Slider label="High" value={eqHigh} onChange={handleEqHighChange} orientation="vertical" />
            <Slider label="Air" value={eqAir} onChange={handleEqAirChange} orientation="vertical" />
          </div>
          <div className="flex flex-col gap-2 items-center mt-2">
            <Toggle options={['Fast', 'Slow']} value={speedMode} onChange={handleSpeedModeChange} />
            <Toggle options={['Off', 'On']} value={phaseEnabled} onChange={handlePhaseToggle} />
          </div>
        </div>
      </div>
    </div>
  )
}

