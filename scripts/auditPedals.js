// Script d'audit pour comparer les pédales avec la documentation
// Vérifie la cohérence des paramètres, types de contrôles, etc.

const fs = require('fs')
const path = require('path')

// Lire la documentation
const docPath = path.join(__dirname, '../docs/REFERENCE_PEDALES.md')
const docContent = fs.readFileSync(docPath, 'utf8')

// Lire pedals.ts
const pedalsPath = path.join(__dirname, '../frontend/src/data/pedals.ts')
const pedalsContent = fs.readFileSync(pedalsPath, 'utf8')

// Extraire les informations de la documentation
const docPedals = {}
const docSections = docContent.split(/^## /m)
docSections.forEach(section => {
  const lines = section.split('\n')
  let currentPedal = null
  lines.forEach(line => {
    if (line.startsWith('### ')) {
      const match = line.match(/^### (.+)$/)
      if (match) {
        currentPedal = match[1].trim()
        docPedals[currentPedal] = { params: [], type: null }
      }
    } else if (currentPedal && line.trim().startsWith('- `')) {
      const paramMatch = line.match(/- `(\w+)`\s*:\s*(.+)/)
      if (paramMatch) {
        const paramName = paramMatch[1]
        const paramDesc = paramMatch[2]
        let controlType = 'knob'
        if (paramDesc.includes('Slider')) controlType = 'slider'
        if (paramDesc.includes('Switch Selector')) controlType = 'switch-selector'
        if (paramDesc.includes('horizontal')) controlType = 'slider-horizontal'
        docPedals[currentPedal].params.push({ name: paramName, type: controlType, desc: paramDesc })
      }
    }
  })
})

console.log(`Pédales documentées: ${Object.keys(docPedals).length}`)
console.log('\nAudit des pédales...\n')

// Extraire les pédales de pedals.ts (simplifié - juste pour identifier les problèmes majeurs)
const issues = []

// Vérifier quelques pédales clés
const keyPedals = [
  { id: 'boss-ds1', name: 'BOSS DS-1', docParams: ['Distortion', 'Tone', 'Level'] },
  { id: 'proco-rat', name: 'Pro Co RAT', docParams: ['Distortion', 'Filter', 'Volume'] },
  { id: 'ibanez-tube-screamer', name: 'Ibanez Tube Screamer TS-9', docParams: ['Drive', 'Tone', 'Level'] },
]

keyPedals.forEach(({ id, name, docParams }) => {
  const pedalMatch = pedalsContent.match(new RegExp(`id: '${id}'[\\s\\S]*?parameters: \\{([\\s\\S]*?)\\}`))
  if (pedalMatch) {
    const paramsBlock = pedalMatch[1]
    const foundParams = []
    docParams.forEach(docParam => {
      const paramKey = docParam.toLowerCase().replace(/\s+/g, '')
      if (paramsBlock.includes(`${paramKey}:`)) {
        foundParams.push(docParam)
      }
    })
    if (foundParams.length !== docParams.length) {
      issues.push(`${name}: Paramètres manquants ou différents`)
    }
  }
})

if (issues.length > 0) {
  console.log('Problèmes détectés:')
  issues.forEach(issue => console.log(`  - ${issue}`))
} else {
  console.log('✓ Aucun problème majeur détecté dans les pédales clés')
}

console.log('\nNote: Audit simplifié. Vérification manuelle recommandée pour toutes les pédales.')

