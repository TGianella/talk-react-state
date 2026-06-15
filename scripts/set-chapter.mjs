import { writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const chapter = process.argv[2]

if (!chapter) {
  console.error('Usage: node set-chapter.mjs <chapter-id>')
  process.exit(1)
}

const valid = ['1a', '1b', '2', '3a', '3c', '4b', '5a']
if (!valid.includes(chapter)) {
  console.error(`Chapitre invalide. Valeurs acceptées : ${valid.join(', ')}`)
  process.exit(1)
}

const unionType = valid.map((c) => `'${c}'`).join(' | ')

const content = `// Ce fichier est écrit par scripts/set-chapter.mjs — ne pas éditer manuellement
export const CURRENT_CHAPTER: ${unionType} = '${chapter}'
`

const dest = resolve(__dirname, '../apps/wanderstate/src/current-chapter.ts')
writeFileSync(dest, content, 'utf-8')
console.log(`✓ Chapitre actif : ${chapter}`)
