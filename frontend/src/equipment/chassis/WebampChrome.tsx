/**
 * Habillage constructeur de la gamme Webamp Classic.
 *
 * Gabarit unique de la série, découpé en trois tiers du boîtier : bloc noir des
 * commandes en haut, plaque de gamme + référence au centre, pad d'activation en
 * bas. Le bloc noir est emboîté dans un liseré de la couleur du boîtier et ses
 * quatre coins sont arrondis ; la référence est une pastille crème sans cerclage
 * noir, lettrée dans la couleur de la pédale.
 * Repère : canevas 304 × 460 de la gamme (boîtier 18…286 × 8…458).
 */

const INK = '#0b0b0c'
const CREAM = '#efece1'
const PAD = '#141416'
const FONT = 'ui-sans-serif, system-ui, sans-serif'

export interface WebampChromeProps {
  /** Couleur du boîtier : encre lisible, liseré du bloc noir, lettrage du code. */
  bodyColor: string
  /** Code produit affiché en pastille (« OD-300 »). */
  modelName: string
  /** Ligne de gamme (« ULTRA TREMOLO »). */
  series: string
  /** Knobs : id, centre en % du canevas + taille en px. */
  knobs: { id?: string; x: number; y: number; size: number }[]
  /** Sous-échelle sérigraphiée par knob (« MIN / MAX » par défaut). */
  knobScales?: Record<string, { left: string; right: string }>
  /** Ordonnées (%) des sélecteurs (hors footswitch). */
  switchYs: number[]
  /** Ordonnée (%) du footswitch (le pad se cale dessus). */
  footY?: number
  /** Mention latérale de façade (« DIR OUT »). */
  sideNote?: string
  /** Pictogrammes de forme d'onde sous le dernier potentiomètre. */
  waveGlyphs?: boolean
  /** Bloc accordeur : écran de note, échelle PITCH et témoins latéraux. */
  tunerDisplay?: boolean
  /**
   * Bloc de commandes dans la couleur du boîtier au lieu du noir (EQ-700) :
   * la sérigraphie passe alors en encre sombre.
   */
  faceTone?: 'body'
  /** Faders verticaux (EQ) : centre en %, longueur en px, libellé. */
  sliders?: { x: number; y: number; length: number; label: string }[]
  /** Molette FX : libellés crantés en colonne à gauche du bouton. */
  rotaryLabels?: { x: number; y: number; size: number; label: string; options: string[] }[]
  width: number
  height: number
}

/** Luminance perçue d'une couleur `#rrggbb` (0-255). */
function luminance(hex: string): number {
  const value = hex.trim().replace('#', '')
  const full = value.length === 3 ? value.split('').map((c) => c + c).join('') : value
  const n = Number.parseInt(full.slice(0, 6), 16)
  if (!Number.isFinite(n)) return 0
  return 0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)
}

export function WebampChrome({
  bodyColor,
  modelName,
  series,
  knobs,
  switchYs,
  footY,
  sideNote,
  waveGlyphs,
  tunerDisplay,
  faceTone,
  knobScales,
  sliders = [],
  rotaryLabels = [],
  width,
  height,
}: WebampChromeProps) {
  const cx = width / 2
  const y = (pct: number) => (pct / 100) * height
  const x = (pct: number) => (pct / 100) * width
  // Corps clair (argent, crème) → encre noire ; corps coloré → encre crème.
  const light = luminance(bodyColor) > 168
  const ink = light ? '#111113' : CREAM
  // Façade couleur boîtier : la sérigraphie du bloc de commandes s'inverse.
  const bodyFace = faceTone === 'body'
  const panelInk = bodyFace ? ink : CREAM

  // Boîtier de la gamme : 18…286 × 8…458, découpé en trois tiers égaux.
  const body = { top: 8, bottom: height - 2 }
  const third = (body.bottom - body.top) / 3

  const knobBottom = (knob: { y: number; size: number }) => y(knob.y) + knob.size / 2
  const lowestKnob = knobs.length
    ? knobs.reduce((a, b) => (knobBottom(b) > knobBottom(a) ? b : a))
    : null
  const lowestSlider = sliders.length
    ? Math.max(...sliders.map((slider) => y(slider.y) + slider.length / 2 + 6))
    : 0
  const controlsBottom = Math.max(
    lowestKnob ? knobBottom(lowestKnob) : 0,
    switchYs.length ? Math.max(...switchYs.map((pct) => y(pct) + 14)) : 0,
    lowestSlider
  )
  // Tiers haut : le bloc noir occupe le premier tiers, et s'étire juste assez
  // pour contenir graduations et pictogrammes quand les commandes sont basses.
  const panelTop = 16
  const panelBottom = Math.min(
    Math.max(body.top + third, controlsBottom + (waveGlyphs ? 34 : 14)),
    height * 0.46
  )
  const panel = { x: 28, y: panelTop, w: width - 56, h: panelBottom - panelTop }
  const panelRadius = 12

  // Tiers central : plaque de gamme puis pastille de référence, centrées.
  const middleTop = panelBottom
  const middleBottom = body.bottom - third
  const plateH = 50
  const badgeH = 22
  const blockH = plateH + 9 + badgeH
  const plateY = middleTop + Math.max(6, (middleBottom - middleTop - blockH) / 2)
  const plate = { x: 40, y: plateY, w: width - 80, h: plateH }
  // Un « / » coupe la ligne comme sur les photos (« COMPRESSOR/ » + « LIMITER »).
  const words = series
    .split(/\s+/)
    .filter(Boolean)
    .flatMap((word) => {
      if (!word.includes('/')) return [word]
      const chunks = word.split('/').filter(Boolean)
      return chunks.map((chunk, i) => (i < chunks.length - 1 ? `${chunk}/` : chunk))
    })
  // Deux lignes maximum : un mot par ligne, ou première ligne puis le reste.
  const lines = words.length > 2 ? [words[0], words.slice(1).join(' ')] : words.slice(0, 2)
  const lineSize =
    lines.length > 1
      ? lines.some((line) => line.length > 12)
        ? 18
        : 21
      : lines[0].length > 12
        ? 19
        : 27
  const code = modelName.replace(/-/g, '')
  const badge = { w: Math.max(66, code.length * 12 + 22), h: badgeH }
  const badgeY = plateY + plateH + 9

  // Tiers bas : pad caoutchouc de l'activation, calé sur le footswitch.
  const padTop = y(footY ?? 84.5) - 49
  const pad = { x: cx - 114, y: padTop, w: 228, h: 98 }

  return (
    <g data-chrome="webamp-classic">
      {/* Bloc de commandes, emboîté dans le liseré de la couleur du boîtier */}
      <rect
        x={panel.x}
        y={panel.y}
        width={panel.w}
        height={panel.h}
        rx={panelRadius}
        fill={bodyFace ? bodyColor : '#0a0a0b'}
        stroke={bodyFace ? '#000000' : bodyColor}
        strokeOpacity={bodyFace ? 0.35 : 1}
        strokeWidth={2.2}
      />
      <line
        x1={panel.x + panelRadius}
        y1={panel.y + 1.4}
        x2={panel.x + panel.w - panelRadius}
        y2={panel.y + 1.4}
        stroke={bodyFace ? '#000000' : '#ffffff'}
        strokeOpacity={bodyFace ? 0.14 : 0.16}
        strokeWidth={1.2}
      />

      {/* Témoin d'alimentation */}
      <text
        x={cx}
        y={panel.y + 8}
        textAnchor="middle"
        fill={panelInk}
        fontFamily={FONT}
        fontSize={7}
        fontWeight={800}
        letterSpacing={1.3}
      >
        ON
      </text>

      {/* Faders verticaux : fente, graduations et échelle ±15 dB */}
      {sliders.map((slider, i) => {
        const left = x(slider.x)
        // Le curseur dessine son libellé au-dessus de la glissière : le rail est
        // décalé d'autant pour rester aligné sur la piste du fader.
        const top = y(slider.y) - slider.length / 2 + 10
        return (
          <g key={`fader-${slider.label}-${i}`}>
            <rect
              x={left - 5.5}
              y={top}
              width={11}
              height={slider.length}
              rx={4}
              fill="#07070a"
              stroke={bodyFace ? '#000000' : '#ffffff'}
              strokeOpacity={bodyFace ? 0.45 : 0.2}
              strokeWidth={0.9}
            />
            {Array.from({ length: 5 }, (_, k) => {
              const ty = top + (slider.length * k) / 4
              const long = k === 2
              return (
                <g key={k} stroke={panelInk} strokeOpacity={long ? 0.72 : 0.32} strokeWidth={long ? 1.1 : 0.8}>
                  <line x1={left - 9.5} y1={ty} x2={left - 6.5} y2={ty} />
                  <line x1={left + 6.5} y1={ty} x2={left + 9.5} y2={ty} />
                </g>
              )
            })}
            {i === 0 && (
              <g fill={panelInk} fillOpacity={0.82} fontFamily={FONT} fontSize={4.8} fontWeight={700}>
                <text x={panel.x + 2} y={top + 3}>
                  +15
                </text>
                <text x={panel.x + 2} y={top + slider.length / 2 + 2}>
                  0
                </text>
                <text x={panel.x + 2} y={top + slider.length}>
                  -15
                </text>
              </g>
            )}
          </g>
        )
      })}

      {/* Molette FX : libellés crantés empilés à gauche du bouton */}
      {rotaryLabels.map((sel, i) => {
        const left = x(sel.x)
        const center = y(sel.y)
        // Les libellés longs (« PITCH SHIFTER ») passent sur deux lignes comme
        // sur la photo, pour tenir dans la colonne entre les knobs et la molette.
        const words = sel.options.map((opt) => opt.split(/\s+/))
        const lineCount = words.reduce((total, w) => total + w.length, 0)
        const start = center - (lineCount * 6.6) / 2 + 3
        let row = 0
        return (
          <g key={`rotary-${sel.label}-${i}`}>
            <text
              x={left}
              y={center - sel.size / 2 - 5}
              textAnchor="middle"
              fill={panelInk}
              fontFamily={FONT}
              fontSize={6.4}
              fontWeight={800}
              letterSpacing={0.9}
            >
              {sel.label}
            </text>
            <g
              fill={panelInk}
              fillOpacity={0.82}
              fontFamily={FONT}
              fontSize={4.9}
              fontWeight={800}
              letterSpacing={0.15}
              textAnchor="end"
            >
              {sel.options.map((opt, k) =>
                words[k].map((word, w) => {
                  const line = start + row * 6.6
                  row += 1
                  return (
                    <text key={`${opt}-${w}`} x={left - sel.size / 2 - 4} y={line}>
                      {word}
                    </text>
                  )
                })
              )}
            </g>
          </g>
        )
      })}

      {/* Bloc accordeur : écran de note, échelle PITCH, témoins latéraux */}
      {tunerDisplay && (
        <g>
          {[-1, 1].map((dir) => (
            <g key={dir}>
              <rect
                x={cx + dir * 92 - 11}
                y={48}
                width={22}
                height={8}
                rx={2}
                fill="#2b1503"
                stroke="#000"
                strokeWidth={0.7}
              />
              <rect x={cx + dir * 92 - 9} y={50} width={18} height={4} rx={1} fill="#f59e0b" opacity={0.9} />
            </g>
          ))}

          {/* Fenêtre du détecteur de note : segments éteints façon afficheur */}
          <rect
            x={cx - 22}
            y={46}
            width={44}
            height={34}
            rx={3}
            fill="#170505"
            stroke="#ff3b30"
            strokeOpacity={0.45}
            strokeWidth={1}
          />
          <g stroke="#ff3b30" strokeWidth={2.6} strokeLinecap="round">
            <line x1={cx - 10} y1={51} x2={cx + 10} y2={51} />
            <line x1={cx - 10} y1={63} x2={cx + 10} y2={63} />
            <line x1={cx - 10} y1={75} x2={cx + 10} y2={75} />
            <line x1={cx - 13} y1={54} x2={cx - 13} y2={60} />
            <line x1={cx + 13} y1={54} x2={cx + 13} y2={60} />
            <line x1={cx - 13} y1={66} x2={cx - 13} y2={72} />
            <line x1={cx + 13} y1={66} x2={cx + 13} y2={72} />
          </g>
          <text x={cx + 25} y={62} fill="#ff6b5e" fontFamily={FONT} fontSize={7} fontWeight={800}>
            #
          </text>

          {/* Échelle PITCH */}
          <text
            x={cx}
            y={90}
            textAnchor="middle"
            fill={CREAM}
            fillOpacity={0.72}
            fontFamily={FONT}
            fontSize={5.4}
            fontWeight={800}
            letterSpacing={1.1}
          >
            PITCH
          </text>
          <path
            d={`M${cx - 104} 104 Q${cx} 82 ${cx + 104} 104`}
            fill="none"
            stroke={CREAM}
            strokeOpacity={0.32}
            strokeWidth={1}
          />
          {Array.from({ length: 11 }, (_, i) => {
            const t = i / 10
            const px = (1 - t) * (1 - t) * (cx - 104) + 2 * (1 - t) * t * cx + t * t * (cx + 104)
            const py = (1 - t) * (1 - t) * 104 + 2 * (1 - t) * t * 82 + t * t * 104
            return (
              <line
                key={`pitch-tick-${i}`}
                x1={px}
                y1={py}
                x2={px}
                y2={py + (i === 5 ? 6 : 4)}
                stroke={CREAM}
                strokeOpacity={i === 5 ? 0.85 : 0.4}
                strokeWidth={i === 5 ? 1.4 : 0.9}
              />
            )
          })}
          <g fill={CREAM} fillOpacity={0.6} fontFamily={FONT} fontSize={5.2} fontWeight={700} textAnchor="middle">
            <text x={cx - 100} y={112}>
              -50
            </text>
            <text x={cx + 100} y={112}>
              +50
            </text>
          </g>
        </g>
      )}

      {/* Graduations sous chaque potentiomètre : MIN / MAX de la gamme, ou
          sous-échelle relevée sur la photo (DRY/OD, CUT/+BOOST, LO/HI…). */}
      {knobs.map((knob, i) => {
        const ty = knobBottom(knob) + 10
        if (ty > panelBottom) return null
        const scale = knob.id ? knobScales?.[knob.id] : undefined
        return (
          <g
            key={`scale-${i}`}
            fill={panelInk}
            fillOpacity={0.88}
            fontFamily={FONT}
            fontSize={6.3}
            fontWeight={700}
            letterSpacing={0.3}
            textAnchor="middle"
          >
            <text x={x(knob.x) - 21} y={ty}>
              {scale?.left ?? 'MIN'}
            </text>
            <text x={x(knob.x) + 21} y={ty}>
              {scale?.right ?? 'MAX'}
            </text>
          </g>
        )
      })}

      {/* Pictogrammes de forme d'onde (trémolo) */}
      {waveGlyphs && lowestKnob && (
        <g
          stroke={CREAM}
          strokeOpacity={0.9}
          strokeWidth={1.4}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        >
          {/* Sinusoïde puis créneau, comme les deux pictogrammes sérigraphiés */}
          <path d={`M${x(lowestKnob.x) - 26} ${knobBottom(lowestKnob) + 20} q5 -8 10 0 t10 0`} />
          <path
            d={`M${x(lowestKnob.x) + 8} ${knobBottom(lowestKnob) + 16} h5 v5 h5 v5 h5`}
          />
        </g>
      )}

      {/* Plaque de gamme cerclée */}
      <rect
        x={plate.x}
        y={plate.y}
        width={plate.w}
        height={plate.h}
        rx={2.5}
        fill="none"
        stroke={ink}
        strokeWidth={2.2}
      />
      {lines.map((line, i) => (
        <text
          key={line + i}
          x={cx}
          y={plate.y + (lines.length > 1 ? 24 + i * 21 : 33)}
          textAnchor="middle"
          fill={ink}
          fontFamily={FONT}
          fontSize={lineSize}
          fontWeight={900}
          letterSpacing={0.3}
        >
          {line}
        </text>
      ))}

      {/* Pastille de référence : fond crème, sans cerclage, lettrage couleur pédale */}
      <rect
        x={cx - badge.w / 2}
        y={badgeY}
        width={badge.w}
        height={badge.h}
        rx={3}
        fill={CREAM}
      />
      <text
        x={cx}
        y={badgeY + 16}
        textAnchor="middle"
        fill={light ? INK : bodyColor}
        fontFamily={FONT}
        fontSize={14}
        fontWeight={900}
        letterSpacing={1.2}
      >
        {code}
      </text>

      {/* Mention latérale (ex. « DIR OUT ») */}
      {sideNote && (
        <text
          x={plate.x}
          y={badgeY + 16}
          fill={ink}
          fontFamily={FONT}
          fontSize={8.5}
          fontWeight={900}
          letterSpacing={0.6}
        >
          {sideNote}
        </text>
      )}

      {/* Marque maison sérigraphiée au-dessus du pad */}
      <text
        x={cx}
        y={pad.y - 14}
        textAnchor="middle"
        fill={ink}
        fillOpacity={0.62}
        fontFamily={FONT}
        fontSize={7.5}
        fontWeight={800}
        letterSpacing={2.6}
      >
        WEBAMP CLASSIC
      </text>

      {/* Pad caoutchouc */}
      <rect
        x={pad.x}
        y={pad.y}
        width={pad.w}
        height={pad.h}
        rx={16}
        fill={PAD}
        stroke={bodyColor}
        strokeWidth={1.6}
      />
      <rect
        x={pad.x + 5}
        y={pad.y + 5}
        width={pad.w - 10}
        height={Math.min(18, pad.h / 4)}
        rx={10}
        fill="#ffffff"
        opacity={0.045}
      />
    </g>
  )
}
