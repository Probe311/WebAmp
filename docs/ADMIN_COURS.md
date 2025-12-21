# 📚 Administration des Cours - Guide Complet

Ce document regroupe toutes les commandes et scripts pour gérer les cours et packs DLC dans WebAmp.

> ⚠️ **Note** : Ces scripts sont destinés aux administrateurs uniquement. Les scripts mentionnés doivent être ajoutés manuellement si nécessaire (ils ne sont pas inclus dans le build de production).

## 🎯 Vue d'ensemble

Les cours WebAmp sont gérés via Supabase et peuvent être organisés en packs DLC. Les principales opérations sont :

- ✅ **Création** de nouveaux cours
- ✨ **Enrichissement** des cours existants
- 🚀 **Déploiement** des parcours et packs DLC
- 🔍 **Vérification** des cours
- 📊 **Diagnostic** de l'état des cours

## 📦 Gestion des Packs DLC

### Régénérer tous les packs

Régénère complètement tous les packs (suppression + génération + import) :

```javascript
await window.regenerateDLCPacks()
```

Cette commande :
1. Supprime tous les packs existants
2. Charge les cours depuis Supabase
3. Génère 10-13 packs thématiques basés sur REFERENCE_COURS.md
4. Importe les nouveaux packs dans Supabase

### Générer les packs sans supprimer

Génère les packs et les sauvegarde dans localStorage :

```javascript
await window.generateDLCPacks()
```

### Importer les packs dans Supabase

Importe les packs générés précédemment :

```javascript
await window.importDLCPacksToSupabase()
```

**Prérequis :** Les packs doivent avoir été générés avec `window.generateDLCPacks()` au préalable.

### Supprimer tous les packs

```javascript
await window.deleteAllDLCPacks()
```

⚠️ **Attention :** Cette opération est irréversible. Les achats/utilisations ne sont pas supprimés pour préserver l'historique.

### Supprimer via SQL

Exécutez le script SQL dans le SQL Editor de Supabase :

```sql
-- Voir: supabase/migrations/delete_all_dlc_packs.sql
```

## 📋 Vérification des Packs

### Vérifier les packs dans Supabase

```sql
-- Compter les packs
SELECT COUNT(*) FROM public.dlc_packs;

-- Voir tous les packs
SELECT id, name, type, is_premium, price, currency 
FROM public.dlc_packs 
ORDER BY created_at DESC;

-- Voir les packs par type
SELECT type, COUNT(*) as count 
FROM public.dlc_packs 
GROUP BY type;

-- Voir les packs premium vs gratuits
SELECT 
  is_premium,
  COUNT(*) as count,
  AVG(price) as prix_moyen
FROM public.dlc_packs 
GROUP BY is_premium;
```

### Vérifier les cours inclus dans les packs

```sql
-- Voir le contenu d'un pack
SELECT 
  dp.name as pack_name,
  dpc.content_type,
  dpc.content_id
FROM public.dlc_packs dp
LEFT JOIN public.dlc_pack_contents dpc ON dp.id = dpc.pack_id
WHERE dp.id = 'VOTRE_PACK_ID';

-- Compter les cours par pack
SELECT 
  dp.name as pack_name,
  COUNT(dpc.content_id) as nombre_cours
FROM public.dlc_packs dp
LEFT JOIN public.dlc_pack_contents dpc 
  ON dp.id = dpc.pack_id 
  AND dpc.content_type = 'course'
GROUP BY dp.id, dp.name
ORDER BY nombre_cours DESC;
```

## 🎓 Packs Générés

Les packs sont générés selon les thèmes suivants :

### Packs Thématiques (10 packs)
1. **Hard Rock & Metal** - Cours sur Metallica, AC/DC, Deep Purple, etc.
2. **Effets Avancés** - Cours avancés/pro sur les effets
3. **Styles Musicaux** - Cours sur rock, blues, jazz, metal, etc.
4. **Techniques Avancées** - Tapping, sweep picking, legato, etc.
5. **Amplificateurs** - Cours sur Mesa, Orange, Marshall, etc.
6. **Théorie Musicale** - Modes, gammes, accords enrichis, etc.
7. **Chaînes d'Effets** - Création de chaînes pour studio, live, etc.
8. **Créativité & Expérimentation** - Presets, textures, boucles, etc.
9. **Chansons Populaires** - Cours pour apprendre des chansons célèbres
10. **Bases & Fondamentaux** - Cours de base avancés

### Packs Parcours Recommandés (3 packs)
11. **Parcours Débutant** - Pack complet avec 8 cours essentiels
12. **Parcours Intermédiaire** - Pack complet avec 10 cours
13. **Parcours Avancé** - Pack complet avec 10 cours

**Note :** Seuls les cours premium (`is_premium = true` et `price > 0`) sont inclus dans les packs.

## 🔧 Workflow Recommandé

### Déploiement Initial

1. Vérifier que tous les cours existent dans Supabase
2. Régénérer tous les packs :
   ```javascript
   await window.regenerateDLCPacks()
   ```

### Mise à Jour des Packs

Si vous avez modifié les cours ou ajouté de nouveaux cours :

1. Régénérer tous les packs :
   ```javascript
   await window.regenerateDLCPacks()
   ```

## ⚠️ Avertissements

- La suppression des packs est **irréversible**
- Les achats/utilisations (`dlc_pack_purchases`) ne sont **pas supprimés** pour préserver l'historique
- La régénération peut prendre quelques secondes selon le nombre de cours
- Assurez-vous d'avoir des cours premium dans Supabase pour générer des packs

## 🔍 Dépannage

### Erreur : "Supabase client non initialisé"
- Vérifiez que vous êtes connecté à Supabase
- Vérifiez les variables d'environnement `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY`

### Erreur : "Table dlc_packs not found"
- Exécutez la migration : `supabase/migrations/create_dlc_packs_tables.sql`

### Aucun pack généré
- Vérifiez qu'il y a des cours premium dans Supabase
- Vérifiez que les cours ont `is_premium = true` et `price > 0`

## 📖 Référence

Pour la liste complète des cours disponibles, consultez [REFERENCE_COURS.md](./REFERENCE_COURS.md).

