# Guide de sécurité RLS pour Supabase

## 🔒 Politiques RLS appliquées

### Lecture (SELECT)
- ✅ **Cours publiés** : Accessibles à tous (lecture publique)
- ✅ **Leçons** : Accessibles à tous pour les cours publiés
- ✅ **Questions de quiz** : Accessibles à tous pour les cours publiés
- ✅ **Récompenses** : Accessibles à tous pour les cours publiés
- ✅ **Tablatures** : Accessibles à tous
- ✅ **Accords** : Accessibles à tous

### Insertion (INSERT)
- 🔐 **Cours** : Seuls les utilisateurs authentifiés peuvent créer
- 🔐 **Leçons** : Seuls les utilisateurs authentifiés peuvent créer
- 🔐 **Questions de quiz** : Seuls les utilisateurs authentifiés peuvent créer
- 🔐 **Récompenses** : Seuls les utilisateurs authentifiés peuvent créer
- 🔐 **Tablatures** : Seuls les utilisateurs authentifiés peuvent créer
- 🔐 **Accords** : Seuls les utilisateurs authentifiés peuvent créer

### Modification (UPDATE)
- 🔐 **Cours** : Seuls les utilisateurs authentifiés peuvent modifier
- 🔐 **Leçons** : Seuls les utilisateurs authentifiés peuvent modifier
- 🔐 **Questions de quiz** : Seuls les utilisateurs authentifiés peuvent modifier
- 🔐 **Récompenses** : Seuls les utilisateurs authentifiés peuvent modifier
- 🔐 **Tablatures** : Seuls les utilisateurs authentifiés peuvent modifier
- 🔐 **Accords** : Seuls les utilisateurs authentifiés peuvent modifier

### Données utilisateur (privées)
- 🔐 **Progression** : Chaque utilisateur voit/modifie uniquement sa propre progression
- 🔐 **Tentatives de quiz** : Chaque utilisateur voit/insère uniquement ses propres tentatives
- 🔐 **Statistiques** : Chaque utilisateur voit/modifie uniquement ses propres statistiques

## 📋 Application des politiques

### Étape 1 : Exécuter le script

1. Aller dans **SQL Editor** de Supabase
2. Ouvrir le fichier `docs/SUPABASE_COMPLETE.sql`
3. Copier tout le contenu
4. Coller dans l'éditeur SQL
5. Cliquer sur **Run**

**Note** : Ce script crée toutes les tables ET applique les politiques RLS sécurisées en une seule fois.

### Étape 2 : Vérification

Vérifier dans Supabase que les politiques sont bien appliquées :

1. Aller dans **Authentication** → **Policies**
2. Sélectionner la table `courses`
3. Vérifier les politiques :
   - ✅ "Public courses are viewable by everyone" (SELECT)
   - ✅ "Authenticated users can insert courses" (INSERT)
   - ✅ "Authenticated users can update courses" (UPDATE)
   - ✅ "Authenticated users can delete courses" (DELETE)

## 🔐 Niveaux de sécurité

### Niveau 1 : Utilisateur anonyme (non authentifié)
- ✅ Peut lire les cours publiés
- ✅ Peut lire les leçons, quiz, récompenses
- ✅ Peut lire les tablatures et accords
- ❌ Ne peut pas créer de contenu
- ❌ Ne peut pas modifier de contenu
- ❌ Ne peut pas voir sa progression (pas de compte)

### Niveau 2 : Utilisateur authentifié
- ✅ Tous les droits du niveau 1
- ✅ Peut créer des cours, leçons, quiz
- ✅ Peut modifier le contenu qu'il crée
- ✅ Peut voir et modifier sa propre progression
- ✅ Peut voir ses propres statistiques
- ❌ Ne peut pas modifier le contenu créé par d'autres
- ❌ Ne peut pas voir la progression des autres

### Niveau 3 : Administrateur (à implémenter)
Pour ajouter un niveau administrateur, vous pouvez :

1. Créer une table `user_roles` :
```sql
CREATE TABLE user_roles (
  user_id UUID REFERENCES auth.users(id) PRIMARY KEY,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin'))
);
```

2. Créer une fonction helper :
```sql
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

3. Modifier les politiques pour permettre aux admins de tout modifier :
```sql
CREATE POLICY "Admins can update all courses"
  ON public.courses FOR UPDATE
  USING (is_admin() OR auth.uid() = created_by)
  WITH CHECK (is_admin() OR auth.uid() = created_by);
```

## ⚠️ Notes importantes

### Sécurité des données utilisateur
Les données de progression (`user_progress`, `user_quiz_attempts`, `user_stats`) sont **toujours privées** :
- Chaque utilisateur voit uniquement ses propres données
- Impossible de voir la progression d'un autre utilisateur
- Les politiques utilisent `auth.uid() = user_id` pour garantir la séparation

### Contenu public vs privé
- Les cours avec `is_published = false` ne sont **pas** visibles publiquement
- Seuls les utilisateurs authentifiés peuvent créer du contenu
- Les utilisateurs authentifiés peuvent modifier le contenu qu'ils créent

### Performance
Les politiques RLS sont optimisées avec des index :
- Index sur `courses.is_published` pour les requêtes de lecture
- Index sur `user_progress.user_id` pour les requêtes de progression
- Index sur les clés étrangères pour les jointures

## 🛡️ Bonnes pratiques

1. **Toujours utiliser RLS** : Ne jamais désactiver RLS en production
2. **Tester les politiques** : Vérifier que les utilisateurs ne peuvent pas accéder aux données d'autres utilisateurs
3. **Auditer régulièrement** : Vérifier les politiques dans Supabase Dashboard
4. **Documenter les changements** : Noter toute modification des politiques
5. **Utiliser le service role key avec précaution** : Seulement pour les opérations administratives

## 🔍 Dépannage

### Problème : Les utilisateurs ne peuvent pas créer de cours
- Vérifier qu'ils sont authentifiés (`auth.role() = 'authenticated'`)
- Vérifier que la politique INSERT existe pour `courses`

### Problème : Les cours ne s'affichent pas
- Vérifier que `is_published = true`
- Vérifier que la politique SELECT existe pour `courses`

### Problème : Erreur "permission denied"
- Vérifier que RLS est activé sur la table
- Vérifier que les politiques existent
- Vérifier que l'utilisateur a les droits nécessaires

