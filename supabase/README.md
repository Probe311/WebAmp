# Supabase – WebAmp

Ce dossier contient le schéma SQL, les seeds et les instructions pour Supabase.

## Configuration env

Ne jamais committer de vraies clés. Modèle : [`../frontend/.env.example`](../frontend/.env.example).

Créer `frontend/.env.local` :
```
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Variables seed/CLI (shell local uniquement, **pas** de préfixe `VITE_`, **pas** de commit) :
```
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

Voir aussi [`../SECURITY.md`](../SECURITY.md).

## Migrations
```
supabase db push --file supabase/migrations/0001_schema.sql
```

## Seed catalogue
Dans `frontend/` (où @supabase/supabase-js et ts-node sont installés) :
```
cd frontend
SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... `
  npx ts-node ../supabase/seed/seed_catalog.ts
```

## Buckets
- Bucket `ir` (privé). Uploads préfixés par `user_id/<filename>`.
- Accès public via URL signée seulement.

## RLS (résumé)
- Catalogue (pedals/amplifiers) : lecture publique, write service/admin.
- Presets / IR / favoris : owner-only, `is_public` pour partage.
- Storage `ir` : owner par préfixe de chemin, service_role full access.
- LMS : Cours publiés en lecture publique, progression privée par utilisateur.

Pour plus de détails sur la sécurité RLS, voir [docs/RLS_SECURITY_GUIDE.md](../docs/RLS_SECURITY_GUIDE.md).

