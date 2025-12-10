# Configuration Git pour WebAmp

## Initialisation du repository Git

### 1. Initialiser Git (si pas déjà fait)

```bash
# Depuis la racine du projet
git init
```

### 2. Vérifier le statut

```bash
git status
```

### 3. Ajouter tous les fichiers

```bash
git add .
```

### 4. Premier commit

```bash
git commit -m "Initial commit: WebAmp with Supabase integration"
```

## Connexion à GitHub

### Option A : Créer un nouveau repository sur GitHub

1. Aller sur [github.com](https://github.com)
2. Cliquer sur **"New repository"**
3. Nom : `WebAmp`
4. Description : "Amplificateur Guitare/Basse Web + Native avec Supabase"
5. **Ne pas** initialiser avec README (déjà présent)
6. Cliquer sur **"Create repository"**

### Option B : Utiliser le repository existant

Si le repository `Probe311/WebAmp` existe déjà :

```bash
# Ajouter le remote
git remote add origin https://github.com/Probe311/WebAmp.git

# Vérifier
git remote -v
```

### 5. Pousser sur GitHub

```bash
# Première fois (créer la branche main)
git branch -M main
git push -u origin main
```

## Configuration Git (optionnel mais recommandé)

```bash
# Configurer votre nom et email (si pas déjà fait)
git config --global user.name "Votre Nom"
git config --global user.email "votre@email.com"

# Vérifier
git config --list
```

## Fichiers à ne pas commiter

Le fichier `.gitignore` est déjà configuré pour ignorer :
- `node_modules/`
- `dist/`
- `.env.local`
- Fichiers de build
- Fichiers temporaires

## Commandes utiles

```bash
# Voir les fichiers modifiés
git status

# Voir les différences
git diff

# Voir l'historique
git log --oneline

# Créer une branche
git checkout -b feature/nom-feature

# Revenir sur main
git checkout main
```

## Workflow recommandé

1. **Travailler sur une branche**
   ```bash
   git checkout -b feature/ma-feature
   ```

2. **Commiter régulièrement**
   ```bash
   git add .
   git commit -m "Description des changements"
   ```

3. **Pousser la branche**
   ```bash
   git push origin feature/ma-feature
   ```

4. **Créer une Pull Request sur GitHub**

5. **Merger dans main** (via GitHub UI)

6. **Vercel déploiera automatiquement** après le merge

