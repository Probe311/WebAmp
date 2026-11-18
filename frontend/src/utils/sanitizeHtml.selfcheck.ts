/** Runnable: npx tsx src/utils/sanitizeHtml.selfcheck.ts */
import { sanitizeHtml, sanitizeSvg } from './sanitizeHtml'

// Le projet ne charge pas les types Node (bundle navigateur) : on déclare le
// seul membre utilisé, pour garder le code de sortie 1 sous `tsx`.
declare const process: { exit(code?: number): never }

const cases: Array<[string, string, boolean, 'html' | 'svg']> = [
  ['<p>ok</p>', '<p>ok</p>', true, 'html'],
  ['<script>alert(1)</script><b>x</b>', 'script', false, 'html'],
  ['<img src=x onerror=alert(1)>', 'onerror', false, 'html'],
  ['<a href="javascript:alert(1)">x</a>', 'javascript:', false, 'html'],
  ['<div style="width:expression(alert(1))">x</div>', 'expression', false, 'html'],
  ['<svg><foreignObject></foreignObject></svg>', 'foreignObject', false, 'svg'],
]

let failed = 0
for (const [input, needle, mustContain, kind] of cases) {
  const out = kind === 'svg' ? sanitizeSvg(input) : sanitizeHtml(input)
  const has = out.toLowerCase().includes(needle.toLowerCase())
  const ok = mustContain ? has : !has
  if (!ok) {
    failed++
    console.error('FAIL', { input, out, needle, mustContain })
  }
}

if (failed) {
  console.error(`sanitizeHtml selfcheck: ${failed} failed`)
  process.exit(1)
}
console.log('sanitizeHtml selfcheck: ok')
