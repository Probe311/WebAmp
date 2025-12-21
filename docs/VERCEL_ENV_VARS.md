# Configuration des Variables d'Environnement Vercel

## ⚠️ Problème courant : Variables non détectées en production

Si vous obtenez l'erreur :
```
Clé API Gemini non configurée. Vérifiez que VITE_GEMINI_API_KEY est définie dans les variables d'environnement Vercel et redéployez l'application.
```

## 🔧 Solution

### 1. Vérifier que les variables sont bien configurées

Dans le dashboard Vercel :
- Allez dans **Settings** > **Environment Variables**
- Vérifiez que `VITE_GEMINI_API_KEY` est bien présente
- Vérifiez qu'elle est activée pour **Production** (et éventuellement Preview/Development)

### 2. ⚠️ IMPORTANT : Redéployer après ajout/modification

**Les variables `VITE_*` sont injectées au BUILD TIME, pas au runtime.**

Cela signifie que :
- ✅ Si vous ajoutez une variable → **Vous DEVEZ redéployer**
- ✅ Si vous modifiez une variable → **Vous DEVEZ redéployer**
- ❌ Les variables ne sont pas disponibles immédiatement après ajout

### 3. Comment redéployer

**Option A : Via le Dashboard Vercel**
1. Allez dans **Deployments**
2. Cliquez sur les **3 points** (⋯) du dernier déploiement
3. Sélectionnez **Redeploy**
4. Confirmez le redéploiement

**Option B : Via Git**
```bash
# Faites un commit vide pour déclencher un nouveau déploiement
git commit --allow-empty -m "trigger redeploy for env vars"
git push origin main
```

**Option C : Via Vercel CLI**
```bash
vercel --prod
```

### 4. Vérifier que les variables sont injectées

Après le redéploiement, vous pouvez vérifier dans les logs de build Vercel :
- Les variables `VITE_*` doivent être visibles (masquées) dans les logs
- Si elles n'apparaissent pas, vérifiez qu'elles sont bien configurées pour l'environnement de build

## 📋 Liste des variables requises

### Variables obligatoires
- `VITE_SUPABASE_URL` - URL de votre projet Supabase
- `VITE_SUPABASE_ANON_KEY` - Clé anonyme Supabase

### Variables optionnelles (selon les fonctionnalités utilisées)
- `VITE_GEMINI_API_KEY` - Clé API Google Gemini (pour l'optimisation de cours)
- `VITE_PEXELS_API_KEY` - Clé API Pexels (pour les images)
- `VITE_PIXABAY_API_KEY` - Clé API Pixabay (pour les images)
- `VITE_FREESOUND_CLIENT_ID` - Client ID Freesound
- `VITE_FREESOUND_CLIENT_SECRET` - Client Secret Freesound
- `VITE_WEBSOCKET_URL` - URL WebSocket (local uniquement, généralement `ws://localhost:8765`)

## 🔍 Diagnostic

Si les variables ne fonctionnent toujours pas après redéploiement :

1. **Vérifiez les logs de build Vercel**
   - Allez dans **Deployments** > Cliquez sur le dernier déploiement
   - Regardez les logs de build
   - Cherchez les erreurs liées aux variables d'environnement

2. **Vérifiez le format des variables**
   - Les variables doivent commencer par `VITE_` pour être accessibles dans le code
   - Pas d'espaces avant/après la valeur
   - Pas de guillemets autour de la valeur (sauf si nécessaire)

3. **Vérifiez les environnements**
   - Production : Variables disponibles pour `vercel --prod`
   - Preview : Variables disponibles pour les PR/commits
   - Development : Variables disponibles pour `vercel dev`

## 📚 Documentation Vercel

- [Variables d'environnement Vercel](https://vercel.com/docs/concepts/projects/environment-variables)
- [Build Time vs Runtime Variables](https://vercel.com/docs/concepts/projects/environment-variables#build-time-variables)

