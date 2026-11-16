# Purge secrets from git history (after rotating Supabase keys)

1. Install: `pip install git-filter-repo`
2. Create a **LOCAL** file outside the repo, e.g. `%TEMP%\webamp-replacements.txt` with lines:
   ```
   <exact-leaked-jwt>==>REDACTED_SUPABASE_SERVICE_ROLE
   <exact-leaked-anon-jwt>==>REDACTED_SUPABASE_ANON_KEY
   <exact-leaked-admin-uuid>==>YOUR_ADMIN_AUTH_UUID
   ```
   Put the real leaked values only in that local file — never commit them.
3. From repo root (backup first):
   ```
   git filter-repo --replace-text %TEMP%\webamp-replacements.txt
   ```
4. Force-push only after coordinating: `git push --force-with-lease origin main`

Rotation of keys in the Supabase dashboard remains mandatory even after history rewrite.
See [SECURITY.md](../SECURITY.md).
