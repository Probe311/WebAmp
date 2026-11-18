/** Conversions et tracés SVG partagés par les cadrans et les VU-mètres. */

export interface Point {
  x: number
  y: number
}

/** Coordonnées polaires → cartésiennes, 0° vers le haut. */
export function polarToCartesian(centerX: number, centerY: number, radius: number, angleDeg: number): Point {
  const radians = (angleDeg * Math.PI) / 180
  return {
    x: centerX + Math.sin(radians) * radius,
    y: centerY - Math.cos(radians) * radius,
  }
}

/** Chemin d'un arc de cercle entre deux angles. */
export function describeArc(
  centerX: number,
  centerY: number,
  radius: number,
  startAngle: number,
  endAngle: number
): string {
  const start = polarToCartesian(centerX, centerY, radius, startAngle)
  const end = polarToCartesian(centerX, centerY, radius, endAngle)
  const largeArc = Math.abs(endAngle - startAngle) > 180 ? 1 : 0
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`
}

/** Chemin d'un secteur annulaire (zone d'avertissement d'un cadran). */
export function describeSector(
  centerX: number,
  centerY: number,
  innerRadius: number,
  outerRadius: number,
  startAngle: number,
  endAngle: number
): string {
  const outerStart = polarToCartesian(centerX, centerY, outerRadius, startAngle)
  const outerEnd = polarToCartesian(centerX, centerY, outerRadius, endAngle)
  const innerEnd = polarToCartesian(centerX, centerY, innerRadius, endAngle)
  const innerStart = polarToCartesian(centerX, centerY, innerRadius, startAngle)
  const largeArc = Math.abs(endAngle - startAngle) > 180 ? 1 : 0
  return (
    `M ${outerStart.x} ${outerStart.y} A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y} ` +
    `L ${innerEnd.x} ${innerEnd.y} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${innerStart.x} ${innerStart.y} Z`
  )
}
