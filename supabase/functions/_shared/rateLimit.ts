/**
 * ponytail: in-memory rate limit (resets on cold start) — upgrade: Upstash/KV
 */

const hits = new Map<string, { count: number; resetAt: number }>()

export function rateLimit(
  key: string,
  opts: { limit: number; windowMs: number }
): { ok: true } | { ok: false; retryAfterSec: number } {
  const now = Date.now()
  const cur = hits.get(key)
  if (!cur || now >= cur.resetAt) {
    hits.set(key, { count: 1, resetAt: now + opts.windowMs })
    return { ok: true }
  }
  if (cur.count >= opts.limit) {
    return { ok: false, retryAfterSec: Math.ceil((cur.resetAt - now) / 1000) }
  }
  cur.count += 1
  return { ok: true }
}

export function clientIp(req: Request): string {
  return (
    req.headers.get('cf-connecting-ip') ||
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  )
}

export function safeClientError(error: unknown, fallback = 'Internal error'): string {
  if (error instanceof Error && error.name === 'AuthError') return error.message
  // Avoid leaking upstream API keys / stack internals
  if (error instanceof Error) {
    const msg = error.message
    if (/api key|GEMINI|RESEND|secret|token/i.test(msg)) return fallback
    if (msg.length < 200) return msg
  }
  return fallback
}
