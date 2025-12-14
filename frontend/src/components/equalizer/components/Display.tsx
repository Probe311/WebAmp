interface DisplayProps {
  variant?: 'default' | 'flat'
  bands?: number[] // 15 bandes de fréquences (valeurs 0-100, où 50 = 0dB)
  frequencies?: string[] // Labels des fréquences
  positions?: number[] // Positions logarithmiques pour l'affichage
  active?: boolean // État actif/inactif de l'égaliseur
}

export function Display({ 
  variant = 'default', 
  bands = [],
  positions = [],
  active = true
}: DisplayProps) {
  const containerClasses = variant === 'default'
    ? "w-full h-48 rounded-xl bg-gradient-to-b from-gray-50 via-gray-100 to-gray-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-inner relative overflow-hidden transition-colors duration-200"
    : "w-full h-full rounded-lg bg-transparent border border-gray-300/30 dark:border-gray-600/30 relative overflow-hidden opacity-80"

  // Convertir les valeurs 0-100 en dB (-12 à +12)
  // 50 = 0dB, 0 = -12dB, 100 = +12dB
  const valueToDb = (value: number) => {
    return ((value - 50) / 50) * 12
  }

  // Convertir dB en position Y (0-100 dans le viewBox)
  // +12dB = 10%, 0dB = 50%, -12dB = 90%
  const dbToY = (db: number) => {
    return 50 - (db / 12) * 40
  }

  // Calculer les positions des points sur la courbe
  const getPoints = () => {
    if (bands.length === 0) return []
    
    return bands.map((value, index) => {
      const db = valueToDb(value)
      // Utiliser les positions logarithmiques si disponibles, sinon distribution linéaire
      const x = positions[index] !== undefined ? positions[index] : (index / (bands.length - 1)) * 100
      const y = dbToY(db)
      return { x, y }
    })
  }

  const points = getPoints()

  // Créer une courbe lissée avec interpolation de Bézier
  const createSmoothPath = (pts: { x: number; y: number }[]) => {
    if (pts.length < 2) return ''
    
    let path = `M ${pts[0].x} ${pts[0].y}`
    
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(0, i - 1)]
      const p1 = pts[i]
      const p2 = pts[i + 1]
      const p3 = pts[Math.min(pts.length - 1, i + 2)]
      
      // Points de contrôle pour courbe de Bézier cubique
      const cp1x = p1.x + (p2.x - p0.x) / 6
      const cp1y = p1.y + (p2.y - p0.y) / 6
      const cp2x = p2.x - (p3.x - p1.x) / 6
      const cp2y = p2.y - (p3.y - p1.y) / 6
      
      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`
    }
    
    return path
  }

  const linePath = createSmoothPath(points)

  return (
    <div className={containerClasses}>
      <svg 
        viewBox="0 0 100 100" 
        className="w-full h-full" 
        preserveAspectRatio="none"
        style={{ minHeight: '200px' }}
      >
        {/* Ligne de référence 0 dB */}
        <line
          x1="0"
          x2="100"
          y1="50"
          y2="50"
          stroke="currentColor"
          strokeWidth="0.5"
          strokeDasharray="2 2"
          opacity="0.3"
          className="text-gray-400 dark:text-gray-600"
        />
        
        {/* Courbe principale */}
        {linePath && (
          <path
            d={linePath}
            fill="none"
            stroke={active ? "currentColor" : "#6b7280"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={active ? 1 : 0.5}
            className={active ? "text-blue-500 dark:text-blue-400" : ""}
          />
        )}
      </svg>
    </div>
  )
}

