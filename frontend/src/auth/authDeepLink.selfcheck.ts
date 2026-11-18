/** Runnable: npx tsx src/auth/authDeepLink.selfcheck.ts */
import { parseAuthDeepLink, resolvePostAuthApp } from './authDeepLink'

// Le projet ne charge pas les types Node (bundle navigateur) : on déclare le
// seul membre utilisé, pour garder le code de sortie 1 sous `tsx`.
declare const process: { exit(code?: number): never }

let failed = 0

function assert(cond: boolean, msg: string) {
  if (!cond) {
    failed++
    console.error('FAIL', msg)
  }
}

const empty = parseAuthDeepLink('')
assert(empty.auth === null && empty.next === null, 'empty search')

const login = parseAuthDeepLink('?auth=login')
assert(login.auth === 'login' && login.next === null, 'auth=login')

const signup = parseAuthDeepLink('auth=signup&next=pedalboard')
assert(signup.auth === 'signup' && signup.next === 'pedalboard', 'signup+next')

const evil = parseAuthDeepLink('?auth=login&next=https://evil.example')
assert(evil.auth === 'login' && evil.next === null, 'reject external next')

const junk = parseAuthDeepLink('?auth=admin&next=../etc')
assert(junk.auth === null && junk.next === null, 'reject junk auth/next')

const legacy = parseAuthDeepLink('?auth=recovery&next=webamp')
assert(legacy.auth === 'recovery' && legacy.next === 'pedalboard', 'webamp→pedalboard')

assert(resolvePostAuthApp(null) === 'home', 'default home')
assert(resolvePostAuthApp('daw') === 'daw', 'keep next')

if (failed) {
  console.error(`authDeepLink selfcheck: ${failed} failed`)
  process.exit(1)
}
console.log('authDeepLink selfcheck: ok')
