import { createCorsErrorResponse, createCorsJsonResponse } from './cors.ts'
import { AuthError, requireAdmin, requireUser } from './auth.ts'
import { clientIp, rateLimit, safeClientError } from './rateLimit.ts'

type GuardOk = { ok: true; userId: string; origin: string | null }
type GuardFail = { ok: false; response: Response }

/**
 * Auth + rate-limit preamble for AI Edge Functions.
 * limit: 20 req / user / minute (contact uses its own limiter).
 */
export async function guardAuthedPost(
  req: Request,
  fnName: string,
  opts?: { admin?: boolean; limit?: number }
): Promise<GuardOk | GuardFail> {
  const origin = req.headers.get('Origin')

  if (req.method === 'OPTIONS') {
    return { ok: false, response: createCorsJsonResponse({ ok: true }, 200, {}, origin) }
  }
  if (req.method !== 'POST') {
    return { ok: false, response: createCorsErrorResponse('Method not allowed', 405, {}, origin) }
  }

  try {
    const user = opts?.admin ? await requireAdmin(req) : await requireUser(req)
    const ip = clientIp(req)
    const rl = rateLimit(`${fnName}:${user.id}:${ip}`, {
      limit: opts?.limit ?? 20,
      windowMs: 60_000,
    })
    if (!rl.ok) {
      return {
        ok: false,
        response: createCorsErrorResponse(
          `Trop de requêtes. Réessayez dans ${rl.retryAfterSec}s.`,
          429,
          {},
          origin
        ),
      }
    }
    return { ok: true, userId: user.id, origin }
  } catch (e) {
    if (e instanceof AuthError) {
      return { ok: false, response: createCorsErrorResponse(e.message, e.status, {}, origin) }
    }
    console.error(`[${fnName}] guard error`, e)
    return {
      ok: false,
      response: createCorsErrorResponse(safeClientError(e), 500, {}, origin),
    }
  }
}

export { safeClientError }
