# Guide de sécurité RLS pour Supabase

## Politiques cibles

### Lecture (SELECT)
- Cours / leçons / quiz / récompenses **publiés** : lecture publique
- Tablatures / accords : lecture publique
- Progression / quiz attempts / stats : **owner only** (`auth.uid() = user_id`)

### Écriture catalogue (INSERT / UPDATE / DELETE)
- **Admin uniquement** via `public.is_admin()` (table `user_roles`)
- Plus de politiques « any authenticated can write »

## Application

1. **Rotation des clés** si fuite historique — voir [SECURITY.md](../SECURITY.md)
2. SQL Editor → exécuter [supabase/migrations/20260320_admin_rls.sql](../supabase/migrations/20260320_admin_rls.sql)
3. Seed admin :

```sql
INSERT INTO public.user_roles (user_id, role)
VALUES ('YOUR_AUTH_UUID', 'admin')
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
```

4. Vérifier Policies sur `courses`, `amplifiers`, `pedals`, etc. :
   - SELECT public / published
   - INSERT/UPDATE/DELETE → `Admins can …` + `is_admin()`

## Niveaux

| Niveau | Droits |
|--------|--------|
| Anonyme | Lecture contenu publié |
| Authentifié | Lecture + ses données privées |
| Admin (`user_roles.role = 'admin'`) | Écriture catalogue |

`VITE_ADMIN_UUID` ne contrôle que l’UI. La base doit refuser les écritures non-admin.
