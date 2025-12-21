/**
 * Utilitaire de test pour le service d'images
 * Permet de tester les différentes APIs depuis la console
 */

import { imageService } from '../services/imageService'

/**
 * Teste le service d'images avec différentes requêtes
 */
export async function testImageService() {
  console.log('🧪 Test du service d\'images...')
  console.log(`Provider actuel: ${(imageService as any).provider}`)
  console.log(`Clé API Pexels: ${import.meta.env.VITE_PEXELS_API_KEY ? '✅' : '❌'}`)
  console.log(`Clé API Pixabay: ${import.meta.env.VITE_PIXABAY_API_KEY ? '✅' : '❌'}`)
  console.log(`Clé API Unsplash: ${import.meta.env.VITE_UNSPLASH_ACCESS_KEY ? '✅' : '❌'}`)

  // Test 1 : Recherche générique
  console.log('\n📸 Test 1: Recherche "guitar pedal"')
  const results1 = await imageService.searchImages('guitar pedal', 3)
  console.log(`Résultats: ${results1.length}`)
  if (results1.length > 0) {
    console.log(`Première image: ${results1[0].url}`)
  }

  // Test 2 : Recherche pour une marque
  console.log('\n📸 Test 2: Image pour marque "BOSS"')
  const brandImage = await imageService.getImageForBrand('BOSS', 'pedal')
  if (brandImage) {
    console.log(`Image trouvée: ${brandImage.url}`)
    console.log(`Auteur: ${brandImage.author}`)
  } else {
    console.log('Aucune image trouvée')
  }

  // Test 3 : Recherche pour un style
  console.log('\n📸 Test 3: Image pour style "vintage"')
  const styleImage = await imageService.getImageForStyle('vintage')
  if (styleImage) {
    console.log(`Image trouvée: ${styleImage.url}`)
  } else {
    console.log('Aucune image trouvée')
  }

  console.log('\n✅ Tests terminés')
}

// Exposer globalement pour utilisation depuis la console
if (typeof window !== 'undefined') {
  (window as any).testImageService = testImageService
}

