import { useState, useCallback } from 'react'
import { Power } from 'lucide-react'
import { Knob } from '../Knob'
import { Slider } from '../Slider'
import { Toggle } from './components/Toggle'
import { Display } from './components/Display'
import { WebSocketClient } from '../../services/websocket'

export function SimpleView() {
  const ws = WebSocketClient.getInstance()

  // Panel 1 State (Pre-Amp / Global)
  const [input, setInput] = useState(75)
  const [width, setWidth] = useState(40)
  const [clipEnabled, setClipEnabled] = useState('On') // 'On' ou 'Off'
  const [panel1Active, setPanel1Active] = useState(true)

  // Panel 2 State (EQ)
  const [low, setLow] = useState(60)
  const [mid, setMid] = useState(45)
  const [high, setHigh] = useState(70)
  const [air, setAir] = useState(85)
  const [speedMode, setSpeedMode] = useState('Fast') // Fast ou Slow (toggle binaire)
  const [phaseEnabled, setPhaseEnabled] = useState('Off') // 'On' ou 'Off'
  const [panel2Active, setPanel2Active] = useState(true)

  // Panel 3 State (Color / Saturation)
  const [drive, setDrive] = useState(25)
  const [mix, setMix] = useState(80)
  const [bias, setBias] = useState(50)
  const [tone, setTone] = useState(60)
  const [hqMode, setHqMode] = useState('Off') // 'On' ou 'Off'
  const [panel3Active, setPanel3Active] = useState(true)

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

  const handleInputChange = useCallback((value: number) => {
    setInput(value)
    sendEqualizerParam('input', value)
  }, [sendEqualizerParam])

  const handleWidthChange = useCallback((value: number) => {
    setWidth(value)
    sendEqualizerParam('width', value)
  }, [sendEqualizerParam])

  const handleClipToggle = useCallback((value: string) => {
    setClipEnabled(value)
    sendEqualizerParam('clip', value === 'On')
  }, [sendEqualizerParam])

  const handleLowChange = useCallback((value: number) => {
    setLow(value)
    sendEqualizerParam('eqLow', value)
  }, [sendEqualizerParam])

  const handleMidChange = useCallback((value: number) => {
    setMid(value)
    sendEqualizerParam('eqMid', value)
  }, [sendEqualizerParam])

  const handleHighChange = useCallback((value: number) => {
    setHigh(value)
    sendEqualizerParam('eqHigh', value)
  }, [sendEqualizerParam])

  const handleAirChange = useCallback((value: number) => {
    setAir(value)
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

  const handleDriveChange = useCallback((value: number) => {
    setDrive(value)
    sendEqualizerParam('drive', value)
  }, [sendEqualizerParam])

  const handleMixChange = useCallback((value: number) => {
    setMix(value)
    sendEqualizerParam('mix', value)
  }, [sendEqualizerParam])

  const handleBiasChange = useCallback((value: number) => {
    setBias(value)
    sendEqualizerParam('bias', value)
  }, [sendEqualizerParam])

  const handleToneChange = useCallback((value: number) => {
    setTone(value)
    sendEqualizerParam('tone', value)
  }, [sendEqualizerParam])

  const handleHqModeToggle = useCallback((value: string) => {
    setHqMode(value)
    sendEqualizerParam('hqMode', value === 'On')
  }, [sendEqualizerParam])

  const handlePanel1Toggle = useCallback(() => {
    const newState = !panel1Active
    setPanel1Active(newState)
    sendEqualizerParam('panel1Active', newState)
  }, [panel1Active, sendEqualizerParam])

  const handlePanel2Toggle = useCallback(() => {
    const newState = !panel2Active
    setPanel2Active(newState)
    sendEqualizerParam('panel2Active', newState)
  }, [panel2Active, sendEqualizerParam])

  const handlePanel3Toggle = useCallback(() => {
    const newState = !panel3Active
    setPanel3Active(newState)
    sendEqualizerParam('panel3Active', newState)
  }, [panel3Active, sendEqualizerParam])

  return (
    <div className="flex flex-col md:flex-row gap-8 md:gap-12 justify-center items-stretch">
      {/* Panel 1: Pre-Amp & Width */}
      <div className="bg-white dark:bg-gray-800 rounded-[24px] p-8 shadow-[8px_8px_16px_rgba(0,0,0,0.1),-8px_-8px_16px_rgba(255,255,255,0.9),inset_0_0_0_1px_rgba(255,255,255,0.8)] dark:shadow-[8px_8px_16px_rgba(0,0,0,0.5),-8px_-8px_16px_rgba(40,40,40,0.5),inset_0_0_0_1px_rgba(60,60,60,0.8)] flex flex-col items-center gap-8 min-w-[160px] transition-colors duration-200">
        <button
          onClick={handlePanel1Toggle}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
            panel1Active
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
            value={input}
            onChange={handleInputChange}
            size="lg"
            showValue
            disabled={!panel1Active}
          />
          <Knob
            label="Width"
            value={width}
            onChange={handleWidthChange}
            size="sm"
            disabled={!panel1Active}
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
      <div className="bg-white dark:bg-gray-800 rounded-[24px] p-8 shadow-[8px_8px_16px_rgba(0,0,0,0.1),-8px_-8px_16px_rgba(255,255,255,0.9),inset_0_0_0_1px_rgba(255,255,255,0.8)] dark:shadow-[8px_8px_16px_rgba(0,0,0,0.5),-8px_-8px_16px_rgba(40,40,40,0.5),inset_0_0_0_1px_rgba(60,60,60,0.8)] flex flex-col items-center gap-8 min-w-[160px] transition-colors duration-200">
        <button
          onClick={handlePanel2Toggle}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
            panel2Active
              ? 'bg-green-500 text-white shadow-[0_8px_18px_rgba(34,197,94,0.3)]'
              : 'bg-red-500 text-white shadow-[0_8px_18px_rgba(239,68,68,0.3)]'
          }`}
          aria-label="Activer/Désactiver EQ"
        >
          <Power size={18} />
        </button>
        <div className="flex flex-col gap-6 w-full max-w-[240px]">
          <Display bands={{ low, mid, high, air }} />
          <div className="flex justify-between gap-3 px-1">
            <Slider label="Low" value={low} onChange={handleLowChange} orientation="vertical" />
            <Slider label="Mid" value={mid} onChange={handleMidChange} orientation="vertical" />
            <Slider label="High" value={high} onChange={handleHighChange} orientation="vertical" />
            <Slider label="Air" value={air} onChange={handleAirChange} orientation="vertical" />
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
      <div className="bg-white dark:bg-gray-800 rounded-[24px] p-8 shadow-[8px_8px_16px_rgba(0,0,0,0.1),-8px_-8px_16px_rgba(255,255,255,0.9),inset_0_0_0_1px_rgba(255,255,255,0.8)] dark:shadow-[8px_8px_16px_rgba(0,0,0,0.5),-8px_-8px_16px_rgba(40,40,40,0.5),inset_0_0_0_1px_rgba(60,60,60,0.8)] flex flex-col items-center gap-8 min-w-[160px] transition-colors duration-200">
        <button
          onClick={handlePanel3Toggle}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
            panel3Active
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
            disabled={!panel3Active}
          />
          <Knob
            label="Mix"
            value={mix}
            onChange={handleMixChange}
            size="md"
            disabled={!panel3Active}
          />
        </div>
        <div className="w-full h-[1px] bg-gray-300/50 dark:bg-gray-600/50 my-4 shadow-[0_1px_0_#fff] dark:shadow-[0_1px_0_rgba(60,60,60,0.8)]" />
        <div className="grid grid-cols-2 gap-x-8 gap-y-8">
          <Knob
            label="Bias"
            value={bias}
            onChange={handleBiasChange}
            size="sm"
            disabled={!panel3Active}
          />
          <Knob
            label="Tone"
            value={tone}
            onChange={handleToneChange}
            size="sm"
            disabled={!panel3Active}
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

