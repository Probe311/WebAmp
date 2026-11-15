# Configuration des variables d’environnement (Vercel / local)

## Règles de sécurité

1. **Ne jamais** committer de clés réelles (ni dans ce fichier, ni dans le README).
2. Modèle local : copier [`frontend/.env.example`](../frontend/.env.example) → `frontend/.env.local`.
3. Tout préfixe `VITE_*` est injecté dans le **bundle navigateur** au build. N’y mettez que ce que vous acceptez d’exposer côté client (anon Supabase, éventuellement des clés « public »).
4. Secrets serveur (`SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, OAuth client secret, etc.) : dashboard Vercel / Supabase Secrets uniquement — **pas** de préfixe `VITE_`.

## Liste des variables

### Obligatoires (frontend)

| Variable | Description | Exemple (placeholder) |
|----------|-------------|------------------------|
| `VITE_SUPABASE_URL` | URL projet Supabase | `https://YOUR_PROJECT.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Clé **anon** (publique + RLS) | `your_supabase_anon_key` |

### Optionnelles (frontend)

| Variable | Description | Note |
|----------|-------------|------|
| `VITE_WEBSOCKET_URL` | Helper natif | Défaut local : `ws://localhost:8765` |
| `VITE_ADMIN_UUID` | UUID Auth de l’admin UI | Complété par `is_admin()` côté DB |
| `VITE_PEXELS_API_KEY` | Images Pexels | Embarquée client |
| `VITE_PIXABAY_API_KEY` | Images Pixabay | Idem |
| `VITE_FREESOUND_API_KEY` | Freesound (recherche) | Idem |
| `VITE_FREESOUND_CLIENT_ID` | OAuth Freesound (public) | Idem |

### Serveur uniquement (hors frontend)

| Variable | Où |
|----------|-----|
| `SUPABASE_SERVICE_ROLE_KEY` | Seeds / CLI locaux (jamais commit) |
| `GEMINI_API_KEY` | Secrets Edge (`ai-*`, `ai-gemini`) — **jamais** `VITE_` |
| `RESEND_API_KEY`, `CONTACT_EMAIL`, `RESEND_FROM_EMAIL` | Secrets Edge `contact-support` |
| `CORS_ALLOWED_ORIGINS` | Edge Functions — ex. `https://app.webamp.studio,http://localhost:10000` |
| `FREESOUND_CLIENT_SECRET` | Edge OAuth uniquement — **jamais** `VITE_*` |

Les `VITE_*` sont injectées au **build time** : après ajout/modif → Redeploy Vercel.

## Diagnostic

1. Logs de build Vercel : erreurs liées aux env
2. Format : préfixe `VITE_` pour le client, pas d’espaces parasites, pas de guillemets inutiles
3. Environnement correct (Production vs Preview)

## Références

- [Variables d’environnement Vercel](https://vercel.com/docs/concepts/projects/environment-variables)
- [SECURITY.md](../SECURITY.md)
- [frontend/.env.example](../frontend/.env.example)
