# Guide de Déploiement - WebAmp

## Architecture de l'application

WebAmp est composé de :
- **Frontend React/Vite** : Application web statique
- **Native Helper (C++)** : Traitement audio local (WebSocket sur port 8765)
- **Supabase** : Base de données, authentification, storage (IR)

> ⚠️ **Important** : Le Native Helper doit tourner **localement** sur la machine de l'utilisateur pour accéder aux drivers audio (WASAPI/ASIO/CoreAudio). Il ne peut pas être hébergé sur un serveur distant.

## Options d'hébergement recommandées

### 🥇 Option 1 : Vercel (Recommandé pour le frontend)

**Avantages :**
- ✅ Gratuit pour les projets personnels
- ✅ Déploiement automatique depuis Git
- ✅ CDN global (performance optimale)
- ✅ SSL automatique
- ✅ Intégration native avec Supabase
- ✅ Support des variables d'environnement
- ✅ Preview deployments pour chaque PR
- ✅ Excellent pour React/Vite

**Limitations :**
- ❌ Pas de support WebSocket (mais le Native Helper tourne en local)
- ❌ Limite de 100 GB de bande passante/mois (gratuit)

**Configuration :**
```bash
# Installation
npm i -g vercel

# Déploiement
cd frontend
vercel
```

Variables d’environnement : **uniquement** via le dashboard Vercel (ou CLI secrets), jamais dans le dépôt.

Modèle local : [`frontend/.env.example`](../frontend/.env.example). Liste et règles : [`VERCEL_ENV_VARS.md`](VERCEL_ENV_VARS.md), [`../SECURITY.md`](../SECURITY.md).

Rappels :

- Les `VITE_*` sont injectées au **build time** → **Redeploy** après ajout/modif
- Placeholders uniquement dans la doc (`YOUR_PROJECT`, `your_supabase_anon_key`, …)
- Pas de `SUPABASE_SERVICE_ROLE_KEY` ni de secrets OAuth en `VITE_*`
- Dashboard : Settings → Environment Variables → Production / Preview / Development

**Prix :** Gratuit (Hobby) → $20/mois (Pro) pour plus de bande passante

---

### Alternative : Netlify

Si vous préférez Netlify :

```bash
# Installation
npm i -g netlify-cli

# Déploiement
cd frontend
netlify init
netlify deploy --prod

# Variables d'environnement (via dashboard Netlify)
```

**Prix :** Gratuit (Starter) → $19/mois (Pro)

### Architecture recommandée

```
┌─────────────────────────────────────┐
│    Utilisateur (Navigateur)         │
│    https://app.webamp.studio        │
└───────────┬──────────────────────────┘
            │
            ├─────────────────┐
            │                 │
            ▼                 ▼
┌───────────────────┐  ┌──────────────────┐
│  Vercel (Frontend) │  │  Supabase Cloud  │
│  - React/Vite      │  │  - PostgreSQL    │
│  - CDN global      │  │  - Auth          │
│  - SSL auto        │  │  - Storage (IR)  │
└───────────────────┘  └──────────────────┘
            │
            │ WebSocket (localhost)
            │ (depuis le navigateur)
            ▼
┌─────────────────────────────────────┐
│    Native Helper (Local Machine)     │
│    - C++ Audio Engine               │
│    - WASAPI/ASIO/CoreAudio          │
│    - Port 8765 (localhost)          │
│    ⚠️ Tourne sur la machine locale   │
└──────────────────────────────────────┘
```

> **Note importante** : Le frontend est déployé sur Vercel, mais se connecte au WebSocket local (`ws://localhost:8765`) car le Native Helper doit tourner sur la machine de l'utilisateur pour accéder aux drivers audio locaux (WASAPI/ASIO/CoreAudio). C'est une architecture hybride : cloud (frontend) + local (audio).

## Guide de déploiement Vercel

### 1. Préparation

```bash
cd frontend

# Créer un fichier vercel.json (optionnel)
cat > vercel.json << EOF
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite"
}
EOF
```

### 2. Variables d'environnement

Dans le dashboard Vercel (valeurs réelles **hors Git**) :
- `VITE_SUPABASE_URL` : URL de votre projet Supabase
- `VITE_SUPABASE_ANON_KEY` : clé **anon** (publique + RLS)
- `VITE_WEBSOCKET_URL` : en prod utilisateur, le helper reste en local → souvent `ws://localhost:8765`
- Optionnel : `VITE_ADMIN_UUID`, APIs tierces — voir [`VERCEL_ENV_VARS.md`](VERCEL_ENV_VARS.md)

### 3. Déploiement

```bash
# Installation
npm i -g vercel

# Connexion
vercel login

# Déploiement
cd frontend
vercel

# Déploiement en production
vercel --prod
```

### 4. Configuration du domaine (optionnel)

Dans Vercel Dashboard :
- Settings → Domains
- Ajouter votre domaine personnalisé
- Configurer les DNS

## Alternative : Netlify

Si vous préférez Netlify :

```bash
# Installation
npm i -g netlify-cli

# Connexion
netlify login

# Déploiement
cd frontend
netlify init
netlify deploy --prod
```

## Distribution du Native Helper

Le Native Helper doit être distribué séparément :

### Option A : GitHub Releases
- Compiler pour Windows/macOS/Linux
- Créer des releases GitHub avec les binaires
- Les utilisateurs téléchargent et installent localement

### Option B : Installateur
- Créer des installateurs (NSIS pour Windows, DMG pour macOS)
- Distribuer via votre site web

### Option C : Auto-update
- Implémenter un système de mise à jour automatique
- Vérifier les nouvelles versions au démarrage

## Checklist de déploiement

- [ ] Frontend déployé sur Vercel/Netlify
- [ ] Variables d'environnement configurées
- [ ] Supabase configuré (RLS, storage buckets)
- [ ] Domaine personnalisé configuré (optionnel)
- [ ] Native Helper compilé pour toutes les plateformes
- [ ] Documentation utilisateur pour installer le Native Helper
- [ ] Tests de déploiement effectués
- [ ] Monitoring configuré (Sentry, LogRocket, etc.)

## Monitoring et Analytics

### Recommandations :
- **Vercel Analytics** : Intégré, gratuit
- **Sentry** : Gestion des erreurs
- **Supabase Dashboard** : Monitoring de la base de données
- **Google Analytics** : Analytics utilisateur (optionnel)

## Coûts estimés

### Démarrage (Gratuit)
- Vercel : Gratuit
- Supabase : Gratuit (500 MB DB, 1 GB storage)
- **Total : 0€/mois**

### Croissance (Payant)
- Vercel Pro : $20/mois
- Supabase Pro : $25/mois
- **Total : ~45€/mois**

## Support

- [Documentation Vercel](https://vercel.com/docs)
- [Documentation Supabase](https://supabase.com/docs)
- [Documentation Netlify](https://docs.netlify.com)

