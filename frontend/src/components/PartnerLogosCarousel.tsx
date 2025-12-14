import { useState, useEffect } from 'react'
import { Block } from './Block'

// Import du logo partenaire
import walrusLogo from '../assets/logos/walrus.svg'

// Pour l'instant, seulement le logo Walrus
const LOGOS = [
  { name: 'Walrus', src: walrusLogo },
]

const DISPLAY_DURATION = 1500 // 1.5 secondes

interface PartnerLogosCarouselProps {
  /** Si true, le composant sera enveloppé dans un Block */
  withBlock?: boolean
}

export function PartnerLogosCarousel({ withBlock = false }: PartnerLogosCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  // Désactiver l'animation s'il n'y a qu'un seul logo
  useEffect(() => {
    if (LOGOS.length <= 1) {
      return
    }

    const interval = setInterval(() => {
      // Faire disparaître le logo actuel
      setIsVisible(false)
      
      // Après la transition, changer de logo et le faire apparaître
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % LOGOS.length)
        setIsVisible(true)
      }, 300) // Durée de la transition de sortie
    }, DISPLAY_DURATION)

    return () => clearInterval(interval)
  }, [])

  const content = (
    <div className="relative w-full h-full flex items-center justify-center p-6">
      <div
        className={`absolute inset-0 flex items-center justify-center ${
          LOGOS.length > 1 ? 'transition-all duration-300 ease-in-out' : ''
        } ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      >
        <img
          src={LOGOS[currentIndex].src}
          alt={LOGOS[currentIndex].name}
          className="h-20 w-full object-contain opacity-80 dark:opacity-100 dark:brightness-0 dark:invert"
        />
      </div>
    </div>
  )

  if (withBlock) {
    return (
      <Block className="w-full overflow-hidden">
        {content}
      </Block>
    )
  }

  return <div className="w-full h-full overflow-hidden">{content}</div>
}

