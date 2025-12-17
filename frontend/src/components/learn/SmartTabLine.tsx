import React from 'react'

interface SmartTabLineProps {
  line: string
  isActive?: boolean
}

/**
 * Composant pour afficher une ligne de tablature avec syntaxe colorée
 * Parse et colore les différentes parties :
 * - Frets (nombres) : orange/rouge selon l'état actif
 * - Techniques (h, p, b, r, /, \, ~, x, <, >) : cyan
 * - Structure (|, e, B, G, D, A, E) : blanc/gris
 * - Tirets (-) : gris foncé
 */
export function SmartTabLine({ line, isActive = false }: SmartTabLineProps) {
  // Regex pour tokeniser la ligne de tablature
  // Capture :
  // 1. Nombres (frets)
  // 2. Techniques (h, p, b, r, /, \, ~, x, <, >)
  // 3. Structure (|, e, B, G, D, A, E)
  // 4. Tirets (-)
  const regex = /(\d+)|([hpbr/\\~x<>])|([|eBGDAE])|(-+)/g

  const parts: Array<{ text: string; type: 'fret' | 'technique' | 'structure' | 'dash' }> = []
  let match

  while ((match = regex.exec(line)) !== null) {
    if (match[1]) {
      // Fret (nombre)
      parts.push({ text: match[0], type: 'fret' })
    } else if (match[2]) {
      // Technique
      parts.push({ text: match[0], type: 'technique' })
    } else if (match[3]) {
      // Structure (barres et noms de cordes)
      parts.push({ text: match[0], type: 'structure' })
    } else if (match[4]) {
      // Tirets
      parts.push({ text: match[0], type: 'dash' })
    }
  }

  // Si aucun match trouvé, retourner la ligne telle quelle
  if (parts.length === 0) {
    return <div className="whitespace-pre font-mono text-sm">{line}</div>
  }

  return (
    <div className="whitespace-pre font-mono text-sm leading-relaxed tracking-wide">
      {parts.map((part, idx) => {
        let className = ''

        switch (part.type) {
          case 'fret':
            // Notes en orange quand actives, sinon blanc
            className = isActive
              ? 'text-orange-500 font-bold drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]'
              : 'text-white dark:text-white font-medium'
            break
          case 'technique':
            // Techniques en cyan
            className = 'text-cyan-400 dark:text-cyan-400 italic font-serif'
            break
          case 'structure':
            // Barres et noms de cordes
            className = 'text-white/80 dark:text-white/80 font-bold'
            break
          case 'dash':
            // Lignes de fond
            className = 'text-gray-700 dark:text-gray-600 opacity-50'
            break
        }

        return (
          <span key={idx} className={className}>
            {part.text}
          </span>
        )
      })}
    </div>
  )
}

