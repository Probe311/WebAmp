# Sécurité

## Signaler une vulnérabilité

N’ouvrez **pas** d’issue publique pour un problème de sécurité.

Contactez les mainteneurs en privé via le [profil GitHub Probe311](https://github.com/Probe311) (ou l’email listé sur le profil) avec :

- description du problème
- étapes de reproduction
- impact estimé
- correctif proposé si vous en avez un

## Secrets et variables d’environnement

- **Ne jamais** committer `.env`, `.env.local`, ni de clés API réelles.
- Utiliser [frontend/.env.example](frontend/.env.example) comme modèle (placeholders uniquement).
- `SUPABASE_SERVICE_ROLE_KEY` : CLI / seeds / serveur uniquement — jamais préfixe `VITE_`.
- Toute variable `VITE_*` est injectée dans le bundle navigateur : ne pas y mettre de secrets que vous ne voulez pas exposer.
- Secrets Edge Functions (`GEMINI_API_KEY`, `RESEND_API_KEY`, `CORS_ALLOWED_ORIGINS`, etc.) : dashboard Supabase → Project Settings → Edge Functions → Secrets.
- **Interdit côté client** : `VITE_GEMINI_API_KEY`, `VITE_FREESOUND_CLIENT_SECRET`, service_role, Resend, OAuth client secrets.

## Rotation obligatoire (fuite historique)

Des JWT Supabase (anon + **service_role**) ont figuré dans d’anciens commits (`supabase/APPLY_MIGRATION.md`, `supabase/seed.ps1`, `docs/VERCEL_SETUP.md`), projet ref `obsatctfkwanwxextiyz`. Même après nettoyage de `main`, **l’historique public les expose encore**.

Checklist humaine (dashboard) :

1. Dashboard Supabase → **Project Settings → API** → **Reset** / régénérer `service_role` **et** `anon` (projet actuel `lyyqfkxuwlwbaudxjtzs` + ancien projet si encore actif).
2. Mettre à jour Vercel (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) + secrets Edge + `.env.local`.
3. Redeploy frontend + redeploy Edge Functions.
4. Vérifier Auth / logs pour activité suspecte.
5. Optionnel : purge d’historique (`git filter-repo`) puis `git push --force` (coordonner les forks).

Tant que la rotation n’est pas faite sur l’ancien projet exposé, considérez-le **compromis**.

## Auth / session / reset password

- Auth : Supabase Auth (hash côté serveur).
- Session client : `localStorage` (`webamp-auth`) + PKCE — XSS = vol de session → sanitize + CSP.
- Domaines : LP `https://webamp.studio` · app `https://app.webamp.studio`.
- Entrée LP → app : deep-link `https://app.webamp.studio/?auth=login` (aucun token dans l’URL). **Pas** de sous-domaine `login.` / `oauth.` : l’auth vit sur l’origine app (Supabase PKCE + localStorage). Un bridge dédié ne sert que pour SSO cookie multi-apps / OAuth centralisé — hors scope actuel.
- Site URL Auth (dashboard) = `https://app.webamp.studio`
- Reset MDP : `resetPasswordForEmail` → redirect `/?auth=recovery`. Redirect URLs allowlist :
  - `https://app.webamp.studio/**`
  - `http://localhost:10000/**`
  - durée du lien ≤ 1 h ; **Leaked password protection** (HaveIBeenPwned)
- MDP app : score ≥ 70 à l’inscription ; min 12 caractères au changement.
- Edge `CORS_ALLOWED_ORIGINS` : `https://app.webamp.studio,http://localhost:10000` (pas la LP).

## Admin

- UI : `VITE_ADMIN_UUID` **ou** RPC `is_admin()` (`useIsAdmin`).
- Écritures catalogue : RLS `is_admin()` uniquement.
- Seed :

```sql
INSERT INTO public.user_roles (user_id, role)
VALUES ('YOUR_AUTH_UUID', 'admin')
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
```

## Edge Functions

- Toutes les fonctions `ai-*` exigent un JWT utilisateur (+ rate-limit).
- `ai-gemini` : **admin only** (proxy Gemini, clé serveur).
- `contact-support` : public + rate-limit IP + validation champs.
- Définir `CORS_ALLOWED_ORIGINS` (origines prod séparées par des virgules).

## Uploads IR

- Bucket `ir` : owner-only policies, `file_size_limit` 50 Mo, mime audio.
- Import URL : HTTPS only, anti-SSRF hosts privés.

## Hygiène

- `npm run audit` / Dependabot (`.github/dependabot.yml`)
- `npm run security:sanitize-selfcheck`
- Rapport : [docs/SECURITY_AUDIT_REPORT.md](docs/SECURITY_AUDIT_REPORT.md)

## Bonnes pratiques forks

1. Créer votre propre projet Supabase
2. Régénérer / utiliser vos propres clés API tierces
3. Révoquer toute clé qui aurait fuité dans un commit (historique Git inclus)
4. Définir `CORS_ALLOWED_ORIGINS`

## Gouvernance dépôt

- Contributions : [CONTRIBUTING.md](CONTRIBUTING.md) · [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)
- Protection `main` / labels : [docs/GITHUB_BRANCH_PROTECTION.md](docs/GITHUB_BRANCH_PROTECTION.md)
