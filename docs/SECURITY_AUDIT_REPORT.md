# Rapport d’audit sécurité — WebAmp — 2026-11-13

## Périmètre

Frontend Vite/React, Supabase (Auth / Postgres RLS / Storage), Edge Functions, Vercel headers.

## Méthode

Revue code + advisors Supabase + migration live + durcissements Phase 0–6.

## Synthèse

| Sévérité | Nb | Notes |
|----------|----|-------|
| Critique (humain) | 1 | Rotation clés / historique git ancien projet — **action dashboard** |
| Élevé (corrigé code) | plusieurs | Gemini client, Edge AI ouvertes, RPC progress, CSP mic |
| Moyen | résiduel | Session localStorage, CSP encore `unsafe-inline/eval`, rate-limit in-memory, `d3-color` (dep transitive maps) |
| Info | — | Dependabot + scripts audit ajoutés ; `ws` corrigé via `npm audit fix` |

## Findings

### [CRIT-01] Fuite historique service_role
- **Statut** : ouvert côté humain (checklist `SECURITY.md`)
- **Impact** : accès total si clés non rotées sur l’ancien projet
- Correctif : reset API keys + mise à jour Vercel / `.env.local`

### [HIGH-01] Gemini dans le bundle `VITE_*`
- **Statut** : corrigé — proxy `ai-gemini` (admin) + Edge `GEMINI_API_KEY`
- Retirer toute `VITE_GEMINI_API_KEY` de Vercel

### [HIGH-02] Edge AI sans auth
- **Statut** : corrigé — JWT + rate-limit sur `ai-*`

### [HIGH-03] `get_course_progress` SECURITY DEFINER
- **Statut** : corrigé — refuse si `auth.uid() <> user_uuid`

### [MED-01] Import IR URL (SSRF)
- **Statut** : corrigé côté client (HTTPS + blocklist hosts)

### [MED-02] Permissions-Policy bloquait le micro
- **Statut** : corrigé (`microphone=(self)`)

### [LOW-01] Leaked password protection Auth
- **Statut** : action dashboard Supabase (advisor)

## Checklist contrôles

| Contrôle | Statut |
|----------|--------|
| Auth Supabase | OK |
| API keys secrets hors `VITE_` (Gemini) | OK code |
| RLS catalogue + `is_admin` | OK (appliqué) |
| HTTPS / HSTS | OK |
| Hash password | OK (Supabase) |
| Validation serveur Edge | OK |
| XSS sanitize | OK (regex + selfcheck) |
| Routes admin UI + RLS | OK |
| Requêtes paramétrées | OK |
| Env / gitignore | OK |
| Rate limit | OK (in-memory) |
| CORS allowlist | OK (configurer prod) |
| En-têtes sécurité | OK (CSP progressive) |
| Session cookies HttpOnly | N/A (localStorage documenté) |
| CSRF | Faible risque SPA JWT |
| Expiration reset MDP | Config dashboard |
| Limite uploads IR | OK (50 Mo bucket + UI) |
| Debug prod | OK (`drop_console`) |
| MAJ deps | Dependabot + `npm run audit` |

## Tests

| ID | Résultat attendu | Statut |
|----|------------------|--------|
| T1–T3 RLS writes | non-admin refusé | À rejouer manuellement après deploy |
| T5 contact 429 | rate-limit | Après redeploy Edge |
| T7 sanitize selfcheck | PASS | `npm run security:sanitize-selfcheck` |
| T10 AI sans JWT | 401 | Après redeploy Edge |
| T11 headers prod | HSTS/CSP | Après deploy Vercel |
| T12 bundle sans Gemini secret | PASS si `VITE_GEMINI_*` retirée | Manuel |

## Residual risk

- Session en `localStorage` (vol via XSS)
- Rate-limit Edge en mémoire (cold start reset)
- CSP encore permissive pour Vite (`unsafe-inline` / `unsafe-eval`)
- Rotation clés historique non automatisable ici
