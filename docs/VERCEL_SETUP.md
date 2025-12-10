# Guide de Configuration Vercel pour WebAmp

## Prérequis

- Compte GitHub avec le repo WebAmp
- Compte Vercel (gratuit)
- Projet Supabase configuré

## Étape 1 : Préparer le repository Git

### 1.1 Vérifier que le frontend est prêt

```bash
cd frontend
npm install
npm run build  # Vérifier que le build fonctionne
```

### 1.2 Vérifier les fichiers de configuration

Assurez-vous que ces fichiers existent :
- ✅ `frontend/vercel.json` (créé)
- ✅ `frontend/package.json` (avec script `build`)
- ✅ `frontend/.gitignore` (ignore `node_modules`, `.env.local`)

### 1.3 Commiter et pousser sur GitHub

```bash
# Depuis la racine du projet
git add .
git commit -m "Configure Vercel deployment"
git push origin main
```

## Étape 2 : Connecter Vercel à GitHub

### 2.1 Créer un compte Vercel

1. Aller sur [vercel.com](https://vercel.com)
2. Cliquer sur **"Sign Up"**
3. Choisir **"Continue with GitHub"**
4. Autoriser Vercel à accéder à vos repositories

### 2.2 Importer le projet

1. Dans le dashboard Vercel, cliquer sur **"Add New..."** → **"Project"**
2. Sélectionner le repository **"Probe311/WebAmp"**
3. Vercel détectera automatiquement que c'est un projet Vite

### 2.3 Configuration du projet

Dans la page de configuration :

**Root Directory :**
- Sélectionner `frontend` (ou laisser vide si le projet est à la racine)

**Framework Preset :**
- Vercel devrait détecter automatiquement **"Vite"**

**Build Command :**
- `npm run build` (déjà configuré dans `vercel.json`)

**Output Directory :**
- `dist` (déjà configuré dans `vercel.json`)

**Install Command :**
- `npm install` (par défaut)

## Étape 3 : Configurer les variables d'environnement

### 3.1 Dans Vercel Dashboard

1. Aller dans **Settings** → **Environment Variables**
2. Ajouter les variables suivantes :

```
VITE_SUPABASE_URL=https://obsatctfkwanwxextiyz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ic2F0Y3Rma3dhbnd4ZXh0aXl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzNDQ4MzIsImV4cCI6MjA4MDkyMDgzMn0.pM0yN8NnkT0a3O3WPE7sNTZ0WFqbYcggV88-w1Xorv8
VITE_WEBSOCKET_URL=ws://localhost:8765
```

> ⚠️ **Important** : `VITE_WEBSOCKET_URL=ws://localhost:8765` est **correct** car :
> - Le frontend est servi depuis Vercel (accessible via le domaine Vercel)
> - Mais le **Native Helper** tourne sur la machine locale de l'utilisateur
> - Le navigateur de l'utilisateur se connecte donc à `ws://localhost:8765` sur **sa machine locale**, pas sur le serveur Vercel
> - C'est une **architecture hybride** : frontend cloud (Vercel) + backend local (Native Helper pour l'audio)

### 3.2 Environnements

Pour chaque variable, sélectionner les environnements :
- ✅ **Production**
- ✅ **Preview** (pour les PR)
- ✅ **Development** (optionnel)

> ⚠️ **Note** : `VITE_WEBSOCKET_URL` est pour le développement local. En production, le frontend se connectera au Native Helper local de l'utilisateur.

## Étape 4 : Déployer

### 4.1 Déploiement automatique

1. Cliquer sur **"Deploy"**
2. Vercel va :
   - Installer les dépendances
   - Builder le projet
   - Déployer sur le CDN
3. Attendre la fin du déploiement (2-3 minutes)

### 4.2 Vérifier le déploiement

Une fois terminé, vous obtiendrez une URL comme :
```
https://webamp-xxx.vercel.app
```

Cliquer sur l'URL pour tester l'application.

## Étape 5 : Configuration du domaine personnalisé (optionnel)

### 5.1 Ajouter un domaine

1. Dans Vercel Dashboard → **Settings** → **Domains**
2. Cliquer sur **"Add Domain"**
3. Entrer votre domaine (ex: `webamp.julienvaissier.fr`)
4. Suivre les instructions DNS

### 5.2 Configuration DNS

Ajouter un enregistrement CNAME :
```
Type: CNAME
Name: webamp (ou @ pour le domaine racine)
Value: cname.vercel-dns.com
```

## Étape 6 : Déploiement automatique

Une fois configuré, chaque push sur `main` déclenchera automatiquement un déploiement en production.

### 6.1 Branches et PR

- **Branche `main`** → Déploiement en production
- **Pull Requests** → Déploiement preview (URL temporaire)
- **Autres branches** → Déploiement preview (si configuré)

### 6.2 Vérifier les déploiements

Dans Vercel Dashboard → **Deployments**, vous verrez :
- L'historique des déploiements
- Les logs de build
- Les erreurs éventuelles

## Étape 7 : Configuration avancée (optionnel)

### 7.1 Headers de sécurité

Ajouter dans `frontend/vercel.json` :

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

### 7.2 Redirections

Si vous avez besoin de redirections :

```json
{
  "redirects": [
    {
      "source": "/old-path",
      "destination": "/new-path",
      "permanent": true
    }
  ]
}
```

## Dépannage

### Erreur : "Build failed"

1. Vérifier les logs dans Vercel Dashboard
2. Tester le build localement : `npm run build`
3. Vérifier que toutes les dépendances sont dans `package.json`

### Erreur : "Environment variables not found"

1. Vérifier que les variables sont bien configurées dans Vercel
2. Vérifier que les noms commencent par `VITE_`
3. Redéployer après avoir ajouté les variables

### Erreur : "404 Not Found" sur les routes

1. Vérifier que `vercel.json` contient les `rewrites`
2. Vérifier que le `outputDirectory` est correct (`dist`)

### L'application ne se connecte pas à Supabase

1. Vérifier les variables d'environnement dans Vercel
2. Vérifier que les clés Supabase sont correctes
3. Vérifier les logs du navigateur (F12 → Console)

## Commandes utiles

### Déploiement manuel via CLI

```bash
# Installation
npm i -g vercel

# Connexion
vercel login

# Déploiement preview
cd frontend
vercel

# Déploiement production
vercel --prod
```

### Vérifier la configuration

```bash
# Voir la configuration actuelle
vercel inspect

# Voir les logs
vercel logs
```

## Checklist de déploiement

- [ ] Repository GitHub configuré
- [ ] Compte Vercel créé
- [ ] Projet importé dans Vercel
- [ ] Variables d'environnement configurées
- [ ] Build testé localement (`npm run build`)
- [ ] Premier déploiement réussi
- [ ] Application accessible via l'URL Vercel
- [ ] Connexion à Supabase fonctionnelle
- [ ] Domaine personnalisé configuré (optionnel)
- [ ] Déploiement automatique testé (push sur main)

## Support

- [Documentation Vercel](https://vercel.com/docs)
- [Documentation Vite](https://vitejs.dev/guide/static-deploy.html#vercel)
- [Support Vercel](https://vercel.com/support)

