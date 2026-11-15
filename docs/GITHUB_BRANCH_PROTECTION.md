# Protection de `main` (GitHub)

À faire une fois dans **Settings → Branches → Branch protection rules** (ou Rulesets).

## Règle recommandée sur `main`

1. **Require a pull request before merging**
   - Require approvals : 1
   - Dismiss stale reviews : on
2. **Require status checks to pass**
   - Require branches to be up to date
   - Status check : `Frontend lint & test` (workflow `.github/workflows/ci.yml`)
3. **Require conversation resolution before merging**
4. **Allow admin bypass** pour un solo-maintainer (`enforce_admins: false`) ; activer `true` dès qu’il y a co-mainteneurs
5. **Restrict force pushes** et **Restrict deletions**
6. Optionnel : Require linear history ; Require signed commits

## Via GitHub CLI (après `gh auth login`)

```bash
gh api -X PUT repos/Probe311/WebAmp/branches/main/protection \
  -H "Accept: application/vnd.github+json" \
  -f required_status_checks='{"strict":true,"contexts":["Frontend lint & test"]}' \
  -F enforce_admins=true \
  -f required_pull_request_reviews='{"required_approving_review_count":1,"dismiss_stale_reviews":true}' \
  -F restrictions= \
  -F allow_force_pushes=false \
  -F allow_deletions=false
```

Ou Rulesets UI : https://github.com/Probe311/WebAmp/settings/rules

## Homepage & labels

```bash
gh repo edit Probe311/WebAmp --homepage "https://app.webamp.studio"
gh label create "good first issue" --color "7057ff" --description "Bon premier ticket" || true
gh label create "help wanted" --color "008672" --description "Aide externe bienvenue" || true
gh label create "bug" --color "d73a4a" || true
gh label create "enhancement" --color "a2eeef" || true
gh label create "security" --color "ee0701" || true
```

## Rotation clés (humain — bloquant)

Dashboard Supabase → reset `anon` + `service_role` (projet actuel + ancien si actif), puis maj Vercel / Edge / `.env.local`. Voir [SECURITY.md](../SECURITY.md).
