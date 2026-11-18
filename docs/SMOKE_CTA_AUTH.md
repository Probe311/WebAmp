# Smoke — CTA LP → Login App

Parcours manuel après déploiement / config Phase 0.

## Prérequis

- LP : `VITE_APP_URL=https://app.webamp.studio/?auth=login` (ou localhost)
- Domaines : `webamp.studio` (Site) · `app.webamp.studio` (App) — pas de `login.` / `oauth.`
- App : `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`
- Supabase Auth : Site URL = `https://app.webamp.studio` ; Redirect URLs = `https://app.webamp.studio/**` + localhost
- Edge `CORS_ALLOWED_ORIGINS` : `https://app.webamp.studio,http://localhost:10000`

## Cas

1. **CTA cold** — Incognito → LP → « Ouvrir webamp » → **gate plein écran** (pas de dock/workspace) → login.
2. **Session existante** — Déjà connecté → CTA LP → entre dans l’app (`home` / `next`), sans gate.
3. **Signup** — Gate → Créer un compte → email confirm ou session → app.
4. **Reset MDP** — Gate → oublié → mail → `/?auth=recovery` → gate/session → maj MDP.
5. **Header Se connecter** — même deep-link / gate.
6. **next allowlist** — `/?auth=login&next=pedalboard` → après login ouvre pedalboard ; `next=https://evil` ignoré.
7. **Aucun chrome app** sur la gate (header logo + carte + scène musicale uniquement).

## Self-check

```bash
cd App/frontend
npx tsx src/auth/authDeepLink.selfcheck.ts
```
