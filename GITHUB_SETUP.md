# 🔗 Configuration GitHub pour WebAmp

## Étape 1 : Créer le repository sur GitHub

1. Aller sur [github.com](https://github.com)
2. Cliquer sur **"New repository"** (ou le bouton **"+"** en haut à droite)
3. Remplir les informations :
   - **Repository name** : `WebAmp`
   - **Description** : `Application de simulation d'amplificateur guitare/basse avec interface web moderne et traitement audio natif`
   - **Visibility** : Public (ou Private selon votre préférence)
   - **NE PAS** cocher "Initialize with README" (on a déjà un README)
   - **NE PAS** ajouter .gitignore ou license (on les a déjà)
4. Cliquer sur **"Create repository"**

## Étape 2 : Connecter le repository local à GitHub

Une fois le repository créé sur GitHub, vous obtiendrez une URL comme :
```
https://github.com/Probe311/WebAmp.git
```

### Option A : HTTPS (recommandé)

```powershell
# Depuis la racine du projet
git remote add origin https://github.com/Probe311/WebAmp.git
git branch -M main
git push -u origin main
```

### Option B : SSH (si vous avez configuré une clé SSH)

```powershell
git remote add origin git@github.com:Probe311/WebAmp.git
git branch -M main
git push -u origin main
```

## Étape 3 : Vérifier la connexion

```powershell
# Vérifier le remote
git remote -v

# Devrait afficher :
# origin  https://github.com/Probe311/WebAmp.git (fetch)
# origin  https://github.com/Probe311/WebAmp.git (push)
```

## Étape 4 : Pousser le code

```powershell
# Pousser tous les commits
git push -u origin main
```

Si vous avez des erreurs d'authentification :
- GitHub a supprimé le support des mots de passe
- Utiliser un **Personal Access Token** (PAT) :
  1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
  2. Generate new token (classic)
  3. Cocher `repo` (accès complet aux repositories)
  4. Copier le token
  5. Utiliser le token comme mot de passe lors du `git push`

## Étape 5 : Vérifier sur GitHub

1. Aller sur `https://github.com/Probe311/WebAmp`
2. Vérifier que tous les fichiers sont présents
3. Vérifier que le README s'affiche correctement

## Prochaines étapes

Une fois le code sur GitHub, vous pouvez :
1. Connecter Vercel (voir `QUICK_START_VERCEL.md`)
2. Configurer GitHub Actions (optionnel)
3. Ajouter des collaborateurs (optionnel)

## Commandes utiles

```powershell
# Voir l'état
git status

# Voir les remotes
git remote -v

# Changer l'URL du remote (si nécessaire)
git remote set-url origin https://github.com/Probe311/WebAmp.git

# Pousser les changements
git push

# Récupérer les changements
git pull
```

