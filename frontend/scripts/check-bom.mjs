/**
 * Échoue si un fichier du dépôt commence par un BOM UTF-8 (EF BB BF).
 * Un BOM en tête de JSON casse `JSON.parse` — donc le build, loin de sa cause.
 *
 * Usage : npm run check:bom (branché en tête de `npm run build`).
 * La liste des fichiers vient de git : node_modules, dist et les fichiers
 * ignorés sont écartés par git lui-même, sans liste à maintenir ici.
 */
import { execFileSync } from 'node:child_process'
import { closeSync, openSync, readSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(fileURLToPath(new URL('.', import.meta.url)), '../..')
const BOM = Buffer.from([0xef, 0xbb, 0xbf])

let files
try {
  files = execFileSync('git', ['ls-files', '-z', '--cached', '--others', '--exclude-standard'], {
    cwd: ROOT,
    encoding: 'utf8',
    // On capture stderr pour traduire l'échec nous-mêmes, au lieu de laisser
    // git cracher son `fatal:` sur le terminal du build.
    stdio: ['ignore', 'pipe', 'pipe'],
  })
    .split('\0')
    .filter(Boolean)
} catch (error) {
  // Tarball GitHub (pas de .git), image docker sans git, `dubious ownership` :
  // le contrôle est un filet, pas une condition du build. On prévient et on passe.
  console.warn(`check:bom — contrôle ignoré : ${describeGitFailure(error)}`)
  process.exit(0)
}

function describeGitFailure(error) {
  if (error?.code === 'ENOENT') return 'git introuvable dans le PATH'
  const stderr = String(error?.stderr ?? '')
  if (/not a git repository/i.test(stderr)) return 'ce dossier n\'est pas dans un dépôt git (archive sans .git ?)'
  if (/dubious ownership/i.test(stderr)) return 'dépôt refusé par git (dubious ownership)'
  return stderr.split('\n')[0].trim() || (error instanceof Error ? error.message : String(error))
}

function hasBom(file) {
  try {
    const head = Buffer.alloc(3)
    const fd = openSync(path.join(ROOT, file), 'r')
    readSync(fd, head, 0, 3, 0)
    closeSync(fd)
    return head.equals(BOM)
  } catch {
    return false // fichier listé par git mais absent du disque
  }
}

const offenders = files.filter(hasBom)

if (offenders.length > 0) {
  console.error(`check:bom — BOM UTF-8 (EF BB BF) détecté dans ${offenders.length} fichier(s) :`)
  for (const file of offenders) console.error(`  ${file}`)
  console.error('\nCorrection : tail -c +4 "<fichier>" > tmp && mv tmp "<fichier>"')
  process.exit(1)
}

console.log(`check:bom — ${files.length} fichiers, aucun BOM`)
