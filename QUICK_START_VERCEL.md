# 🚀 Déploiement Vercel - Guide Rapide

## Étapes rapides

### 1. Préparer le repository

```bash
# Vérifier que tout est commité
git status

# Ajouter les nouveaux fichiers
git add .
git commit -m "Configure Vercel deployment"
git push origin main
```

### 2. Connecter Vercel

1. Aller sur [vercel.com](https://vercel.com)
2. **Sign Up** avec GitHub
3. **Add New Project**
4. Sélectionner le repo **Probe311/WebAmp**

### 3. Configuration Vercel

**Root Directory :** `frontend`

**Framework Preset :** Vite (auto-détecté)

**Build Command :** `npm run build` (déjà dans vercel.json)

**Output Directory :** `dist` (déjà dans vercel.json)

### 4. Variables d'environnement

Dans **Settings** → **Environment Variables**, ajouter :

```
VITE_SUPABASE_URL=https://obsatctfkwanwxextiyz.supabase.co
VITE_SUPABASE_ANON_KEY=REDACTED_SUPABASE_JWT
VITE_WEBSOCKET_URL=ws://localhost:8765
```

✅ Cocher : Production, Preview, Development

### 5. Déployer

Cliquer sur **Deploy** et attendre 2-3 minutes.

### 6. Vérifier

Une fois déployé, vous obtiendrez une URL comme :
```
https://webamp-xxx.vercel.app
```

## ✅ Checklist

- [ ] Repository poussé sur GitHub
- [ ] Compte Vercel créé
- [ ] Projet importé dans Vercel
- [ ] Root Directory = `frontend`
- [ ] Variables d'environnement configurées
- [ ] Déploiement réussi
- [ ] Application accessible

## 📚 Documentation complète

Voir `docs/VERCEL_SETUP.md` pour plus de détails.

## 🆘 Problèmes courants

**Build failed ?**
- Vérifier les logs dans Vercel
- Tester localement : `cd frontend && npm run build`

**404 sur les routes ?**
- Vérifier que `vercel.json` contient les `rewrites`

**Supabase ne fonctionne pas ?**
- Vérifier les variables d'environnement dans Vercel
- Vérifier la console du navigateur (F12)

