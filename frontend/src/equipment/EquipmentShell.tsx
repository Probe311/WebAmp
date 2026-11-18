import { useEffect, useMemo, useRef, useState } from 'react'
import type {
  AmpArchetype,
  EquipmentDefinition,
  PedalArchetype,
  SwitchKind,
} from './types'
import { validateEquipmentDefinition } from './types'
import { AmpChassis } from './chassis/AmpChassis'
import { PedalChassis } from './chassis/PedalChassis'
import { ChannelPush, Footswitch, LedIndicator, MultiSwitch, RockerSwitch, RotaryKnob, RotarySelector, SliderControl, StompPad, ToggleSwitch } from './controls'
import { AMP_BRANDING, PEDAL_BRANDING } from './layouts'
import { resolveSurfaceColor } from './tokens'

export interface EquipmentShellProps {
  definition: EquipmentDefinition
  values: Record<string, number>
  multiValues?: Record<string, string>
  switchStates: Record<string, boolean>
  ledStates?: Record<string, boolean>
  onControlChange: (id: string, value: number) => void
  onMultiSwitchChange?: (id: string, value: string) => void
  onSwitchChange: (id: string, checked: boolean) => void
  /** Couleur d'accent des commandes (ticks, LED d'accent). */
  accentColor?: string
  maxWidth?: number | string
  disabled?: boolean
  className?: string
}

const PEDAL_SWITCH_TYPES: SwitchKind[] = ['footswitch', 'stomp-pad']

function renderSwitch(
  def: EquipmentDefinition,
  id: string,
  kind: SwitchKind,
  checked: boolean,
  onChange: (next: boolean) => void,
  labelColor: string
) {
  const sw = def.switches.find((s) => s.id === id)
  const onLabel = sw?.onLabel ?? 'ON'
  const offLabel = sw?.offLabel ?? 'BYPASS'
  switch (kind) {
    case 'stomp-pad':
      return (
        <StompPad
          active={checked}
          onToggle={onChange}
          label={sw?.label}
          width={sw?.style?.width ?? 210}
          height={sw?.style?.height ?? 108}
          minimal={Boolean(def.chrome)}
        />
      )
    case 'footswitch':
      return (
        <Footswitch
          active={checked}
          onToggle={onChange}
          label={sw?.label ?? 'BYPASS'}
          activeLabel={onLabel}
          bypassLabel={offLabel}
          size={sw?.style?.size ?? 46}
        />
      )
    case 'rocker':
      return (
        <RockerSwitch
          checked={checked}
          onChange={onChange}
          label={sw?.label ?? 'POWER'}
          rockerColor={sw?.style?.rockerColor ?? 'red'}
          size={sw?.style?.size ?? 28}
          labelColor={sw?.style?.labelColor ?? labelColor}
        />
      )
    case 'illuminated-button':
    case 'led-button':
      return (
        <ChannelPush
          checked={checked}
          onChange={onChange}
          label={sw?.label ?? id}
          size={sw?.style?.size ?? 18}
          labelColor={sw?.style?.labelColor ?? labelColor}
        />
      )
    case 'push':
    case 'momentary':
    case 'latching':
    case 'metal-push':
      return (
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          aria-label={sw?.label ?? id}
          onClick={(e) => {
            e.stopPropagation()
            onChange(!checked)
          }}
          style={{
            minWidth: sw?.style?.size ?? 26,
            minHeight: sw?.style?.size ?? 26,
            borderColor: checked ? (sw?.style?.accentColor ?? '#F26A1B') : 'rgba(148,163,184,0.5)',
            background: checked ? (sw?.style?.accentColor ?? '#F26A1B') : 'linear-gradient(180deg,#3f3f46,#18181b)',
          }}
          className="flex items-center justify-center rounded-md border text-[8px] font-bold uppercase tracking-wider text-white shadow"
        >
          {sw?.label}
        </button>
      )
    case 'rotary-selector':
      return sw?.options ? (
        <RotarySelector
          label={sw.label}
          options={sw.options}
          value={sw.options[0]}
          onChange={() => undefined}
          size={sw.style?.size ?? 34}
          labelColor={sw.style?.labelColor ?? labelColor}
        />
      ) : null
    default:
      return (
        <ToggleSwitch
          checked={checked}
          onChange={onChange}
          label={sw?.label ?? id}
          onLabel={onLabel}
          offLabel={offLabel}
          variant={kind === 'mini-toggle' || kind === 'paddle' || kind === 'slide-switch' ? kind : 'toggle'}
          size={sw?.style?.size ?? 34}
          labelColor={sw?.style?.labelColor ?? labelColor}
        />
      )
  }
}

/**
 * Shell unique de rendu : châssis + branding + contrôles, mis à l'échelle.
 */
export function EquipmentShell({
  definition,
  values,
  multiValues = {},
  switchStates,
  ledStates = {},
  onControlChange,
  onMultiSwitchChange,
  onSwitchChange,
  accentColor: accentProp,
  maxWidth,
  disabled = false,
  className = '',
}: EquipmentShellProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [width, setWidth] = useState(definition.dimensions.width)

  const validation = useMemo(() => validateEquipmentDefinition(definition), [definition])

  useEffect(() => {
    const el = containerRef.current
    if (!el || typeof ResizeObserver === 'undefined') return
    let raf: number | null = null
    const update = () => {
      if (raf !== null) cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const next = Math.round(el.getBoundingClientRect().width)
        if (next > 0) setWidth((prev) => (Math.abs(prev - next) > 1 ? next : prev))
      })
    }
    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => {
      if (raf !== null) cancelAnimationFrame(raf)
      observer.disconnect()
    }
  }, [])

  if (!validation.valid || !validation.definition) {
    return (
      <div role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 p-4 font-mono text-xs text-rose-800">
        <p className="mb-1 font-bold">Configuration d&apos;appareil invalide :</p>
        <ul className="list-disc space-y-0.5 pl-4">
          {validation.errors.map((err, idx) => (
            <li key={idx}>{err}</li>
          ))}
        </ul>
      </div>
    )
  }

  const def = validation.definition
  const isPedal = def.type === 'pedal'
  const chassisVariant = def.chassisVariant
  const scale = width / def.dimensions.width
  const surface = def.surfaceConfig
  const color = resolveSurfaceColor(surface, isPedal ? 'anthracite' : 'black')
  const accentColor = accentProp ?? def.accentColor ?? '#F26A1B'

  const brandingPos =
    def.branding.modelPosition ??
    (isPedal
      ? PEDAL_BRANDING[chassisVariant as PedalArchetype]
      : AMP_BRANDING[chassisVariant as AmpArchetype])

  const brandTone = def.branding.tone === 'dark' ? '#0f172a' : isPedal ? color.contrastText : '#f8fafc'
  const subtitleTone = isPedal ? brandTone : 'rgba(248,250,252,0.72)'

  const wrapper = (pos: { x: number; y: number }, key: string, node: React.ReactNode) => (
    <div
      key={key}
      style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: `translate(-50%, -50%) scale(${scale})` }}
      className="absolute"
    >
      {node}
    </div>
  )

  return (
    <div
      ref={containerRef}
      data-equipment-id={def.id}
      data-equipment-type={def.type}
      style={{
        aspectRatio: `${def.dimensions.width} / ${def.dimensions.height}`,
        maxWidth: maxWidth ?? `${def.dimensions.width}px`,
      }}
      className={`relative mx-auto w-full select-none bg-transparent ${className}`}
    >
      {isPedal ? (
        <PedalChassis
          variant={chassisVariant as PedalArchetype}
          surface={surface}
          accentColor={accentColor}
          alt={`${def.branding.brandName} ${def.branding.modelName}`}
          dimensions={def.dimensions}
          chrome={
            def.chrome
              ? {
                  kind: def.chrome.kind,
                  modelName: def.branding.modelName,
                  sliderYs: (def.sliders ?? []).map((slider) => slider.position.y),
                  sliderLength: def.sliders?.[0]?.length ?? 0,
                  footNote: def.chrome.footNote,
                  series: def.chrome.series,
                  sideNote: def.chrome.sideNote,
                  waveGlyphs: def.chrome.waveGlyphs,
                  tunerDisplay: def.chrome.tunerDisplay,
                  faceTone: def.chrome.faceTone,
                  knobScales: def.chrome.knobScales,
                  sliders: def.chrome.sliders,
                  rotaryLabels: def.chrome.rotaryLabels,
                  footY: def.switches.find((s) => s.id === 'active')?.position.y,
                  knobs: def.controls.map((ctrl) => ({
                    id: ctrl.id,
                    x: ctrl.position.x,
                    y: ctrl.position.y,
                    size: ctrl.style.size,
                  })),
                  switchYs: [
                    ...(def.multiSwitches ?? []).map((ms) => ms.position.y),
                    ...def.switches.filter((s) => s.id !== 'active').map((s) => s.position.y),
                  ],
                }
              : undefined
          }
        />
      ) : (
        <AmpChassis
          variant={chassisVariant as AmpArchetype}
          surface={surface}
          accentColor={accentColor}
          alt={`${def.branding.brandName} ${def.branding.modelName}`}
        />
      )}

      {/* Couche branding — marque blanche uniquement */}
      {!def.branding.hideOverlayText && (
        <div className="pointer-events-none absolute inset-0 z-10" aria-hidden="true">
          {def.branding.showWhiteLogoBadge && (
            <div
              style={{
                left: `${(def.branding.badgePosition ?? { x: brandingPos.x, y: brandingPos.y - (isPedal ? 6 : 7) }).x}%`,
                top: `${(def.branding.badgePosition ?? { x: brandingPos.x, y: brandingPos.y - (isPedal ? 6 : 7) }).y}%`,
                transform: `translate(-50%, -50%) scale(${scale})`,
              }}
              className="absolute inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-2.5 py-0.5 shadow-[0_2px_6px_rgba(0,0,0,0.28)]"
            >
              <span className="inline-flex h-2.5 w-2.5 items-center justify-center rounded-full bg-[#F26A1B]">
                <span className="h-1 w-1 rounded-full bg-white" />
              </span>
              <span className="whitespace-nowrap text-[9px] font-extrabold uppercase tracking-wider text-slate-900">
                {def.branding.brandName}
              </span>
            </div>
          )}

          <div
            style={{
              left: `${brandingPos.x}%`,
              top: `${brandingPos.y}%`,
              transform: `translate(-50%, -50%) scale(${scale})`,
              color: brandTone,
            }}
            className="absolute flex flex-col items-center text-center"
          >
            <span
              className={`whitespace-nowrap font-black uppercase leading-none tracking-[0.14em] drop-shadow-[0_1px_1px_rgba(255,255,255,0.25)] ${
                isPedal ? 'text-[17px]' : 'text-[30px]'
              }`}
            >
              {def.branding.modelName}
            </span>
            {def.branding.subtitle && (
              <span
                style={{ color: subtitleTone }}
                className={`mt-1 whitespace-nowrap font-mono font-bold uppercase tracking-[0.18em] ${
                  isPedal ? 'text-[7px]' : 'text-[10px]'
                }`}
              >
                {def.branding.subtitle}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Couche contrôles */}
      <div className={`absolute inset-0 z-20 ${disabled ? 'pointer-events-none' : ''}`}>
        {def.controls.map((ctrl) => {
          const labelColor = ctrl.style.labelColor ?? (isPedal ? color.contrastText : '#0f172a')
          return wrapper(
            ctrl.position,
            `knob-${ctrl.id}`,
            <RotaryKnob
              value={values[ctrl.id] ?? ctrl.defaultValue}
              min={ctrl.min}
              max={ctrl.max}
              step={ctrl.step ?? 1}
              defaultValue={ctrl.defaultValue}
              label={ctrl.label}
              unit={ctrl.unit ?? (isPedal ? '%' : '')}
              size={ctrl.style.size}
              knobStyle={ctrl.style.type}
              indicatorStyle={ctrl.style.indicatorStyle ?? 'line'}
              rotationMin={ctrl.rotationMin}
              rotationMax={ctrl.rotationMax}
              color={ctrl.style.color ?? accentColor}
              labelColor={labelColor}
              tooltip={ctrl.tooltip}
              labelPosition={ctrl.style.labelPosition ?? 'bottom'}
              showValue={!ctrl.style.hideValue}
              disabled={disabled}
              onChange={(v) => onControlChange(ctrl.id, v)}
            />
          )
        })}

        {def.sliders?.map((slider) => {
          const labelColor = slider.labelColor ?? (isPedal ? color.contrastText : '#0f172a')
          return wrapper(
            slider.position,
            `slider-${slider.id}`,
            <SliderControl
              value={values[slider.id] ?? slider.defaultValue}
              min={slider.min}
              max={slider.max}
              step={slider.step ?? 1}
              defaultValue={slider.defaultValue}
              label={slider.label}
              unit={slider.unit}
              orientation={slider.orientation}
              length={slider.length}
              styleType={slider.styleType}
              scaleVariant={slider.scaleVariant}
              accentColor={slider.accentColor ?? accentColor}
              labelColor={labelColor}
              tooltip={slider.tooltip}
              disabled={disabled}
              onChange={(v) => onControlChange(slider.id, v)}
            />
          )
        })}

        {def.multiSwitches?.map((ms) =>
          wrapper(
            ms.position,
            `multi-${ms.id}`,
            <MultiSwitch
              label={ms.label}
              options={ms.options}
              value={multiValues[ms.id] ?? ms.defaultValue}
              width={ms.width}
              orientation={ms.orientation}
              dense={ms.dense}
              labelColor={ms.labelColor ?? (isPedal ? color.contrastText : '#0f172a')}
              disabled={disabled}
              onChange={(opt) => onMultiSwitchChange?.(ms.id, opt)}
            />
          )
        )}

        {def.rotarySelectors?.map((sel) =>
          wrapper(
            sel.position,
            `rotary-${sel.id}`,
            <RotarySelector
              label={sel.label}
              options={sel.options}
              value={multiValues[sel.id] ?? sel.defaultValue}
              onChange={(opt) => onMultiSwitchChange?.(sel.id, opt)}
              size={sel.size}
              labelColor={sel.labelColor ?? (isPedal ? color.contrastText : '#0f172a')}
              accentColor={accentColor}
              hideReadout={sel.hideReadout}
              disabled={disabled}
            />
          )
        )}

        {def.switches.map((sw) =>
          wrapper(
            sw.position,
            `switch-${sw.id}`,
            renderSwitch(
              def,
              sw.id,
              sw.type,
              switchStates[sw.id] ?? sw.defaultValue,
              (next) => onSwitchChange(sw.id, next),
              sw.style?.labelColor ?? (isPedal ? color.contrastText : '#0f172a')
            )
          )
        )}

        {def.leds.map((led) => {
          const active =
            led.id in ledStates
              ? ledStates[led.id]
              : led.linkedControlId
                ? Boolean(switchStates[led.linkedControlId])
                : false
          return wrapper(
            led.position,
            `led-${led.id}`,
            <LedIndicator
              active={active}
              color={led.color}
              label={led.label}
              size={led.size ?? 12}
              variant={led.variant ?? 'led'}
              labelColor={led.labelColor ?? (isPedal ? color.contrastText : '#0f172a')}
              hideLabel={led.hideLabel}
            />
          )
        })}
      </div>
    </div>
  )
}

/** Types de switches qui déclenchent un changement d'état « onglet ». */
export const TOGGLE_KINDS = PEDAL_SWITCH_TYPES
