```
# BOSS SD-1 Super OverDrive — Documentation technique et modélisation sonore
```

```
**Version :** 1.0
**Date :** 29 octobre 2026
```

```
**Objectif :** documenter la technologie sonore de la BOSS SD-1, son
architecture électronique et les paramètres nécessaires à une émulation
logicielle fidèle.
```

```
## 1. Présentation générale
```

```
La **BOSS SD-1 Super OverDrive** est une pédale d'overdrive analogique
commercialisée depuis 1981. Elle est connue pour son écrêtage asymétrique, son
accentuation des médiums et sa réponse dynamique au jeu du guitariste.
```

```
Contrairement à une distorsion numérique générique, son caractère sonore résulte
de l'interaction de plusieurs éléments :
```

- `L'adaptation d'impédance en entrée.` 

- `Les filtres analogiques.` 

- `Le gain contrôlé par DRIVE.` 

- `L'écrêtage asymétrique.` 

- `Le réseau de tonalité.` 

- `L'étage de sortie.` 

- `Le niveau du signal entrant et l'interaction avec la guitare.` 

```
**Principe fondamental :** reproduire uniquement l'écrêtage asymétrique ne
suffit pas à reproduire fidèlement une SD-1.
```

# `### Objectifs de la modélisation` 

```
L'émulation logicielle doit chercher à reproduire :
```

`1. La réponse fréquentielle de la pédale.` 

`2. La courbe de saturation en fonction du niveau d'entrée.` 

`3. L'asymétrie de l'écrêtage.` 

`4. L'évolution du son avec les commandes DRIVE, TONE et LEVEL.` 

`5. La réponse aux transitoires et aux variations de dynamique.` 

`6. Le niveau de sortie et le comportement du bypass.` 

```
La fidélité doit être vérifiée par comparaison avec une pédale physique
identifiée. Sans cette référence, le modèle reste une approximation technique.
```

```
## 2. Sources techniques
```

```
### 2.1 Documentation officielle
```

```
**BOSS — Page produit SD-1**
```

```
https://www.boss.info/global/products/sd-1/
```

```
Informations sur le caractère sonore, les commandes, l'écrêtage asymétrique et
les caractéristiques générales.
```

```
**BOSS — Assistance SD-1**
```

```
https://www.boss.info/global/products/sd-1/support/
```

```
Manuels et documents techniques associés au produit.
```

```
**Manuel utilisateur SD-1**
```

```
https://static.roland.com/assets/media/pdf/SD-1_eng02_W.pdf
```

```
Informations concernant les commandes, l'utilisation et les caractéristiques
publiées.
```

```
### 2.2 Schéma électronique et composants
```

```
**BOSS SD-1 Service Notes — document historique**
```

```
https://www.synfo.nl/servicemanuals/Boss/BOSS_SD-1_SERVICE_NOTES.pdf
```

```
Ce document contient notamment :
```

- `Le schéma électronique d'une version historique.` 

- `L'implantation des composants.` 

- `La liste des composants.` 

- `Des indications de dépannage et de contrôle.` 

```
**Ancien manuel utilisateur SD-1**
```

```
https://static.roland.com/assets/media/pdf/SD-1_OM.pdf
```

```
Les documents anciens et les caractéristiques modernes peuvent différer. Il faut
donc identifier la révision matérielle ciblée avant d'utiliser une valeur de
composant comme référence universelle.
```

```
> **Important :** les composants et valeurs indiqués dans les Service Notes
historiques ne doivent pas être généralisés à toutes les versions de la SD-1. Le
schéma fonctionnel de ce document est pédagogique ; il ne remplace pas le schéma
électrique constructeur.
```

- `## 3. Caractéristiques matérielles` 

- `| Caractéristique | Valeur ou description | Précision |` 

- `|---|---|---|` 

- `| Type | Overdrive analogique | BOSS SD-1 |` 

- `| Première commercialisation | 1981 | Historique BOSS |` 

- `| Commandes | DRIVE, TONE, LEVEL | Contrôles utilisateur |` 

- `| Alimentation | 9 V DC ou pile 9 V | Respecter les caractéristiques de la version ciblée |` 

- `| Niveau nominal d'entrée | -20 dBu | Fiche BOSS actuelle |` 

- `| Impédance d'entrée | 1 MΩ | Fiche actuelle ; certaines documentations historiques indiquent 470 kΩ |` 

- `| Niveau nominal de sortie | -20 dBu | Fiche BOSS actuelle |` 

- `| Impédance de sortie | 1 kΩ | Fiche BOSS actuelle |` 

- `| Charge de sortie recommandée | 10 kΩ ou plus | Fiche BOSS actuelle |` 

- `| Bypass | Bufferisé | Fiche BOSS actuelle |` 

- `| Consommation | 10 mA | Valeur publiée actuellement ; des documents anciens peuvent différer |` 

- `| Amplificateur opérationnel historique | μPC4558C | Référence documentée dans une version historique |` 

- `| Transistors historiques | JFET et transistors bipolaires | Vérifier la nomenclature du schéma ciblé |` 

```
| Diodes historiques | Références listées dans les Service Notes | Vérifier la
version du circuit |
```

```
Ces caractéristiques constituent un point de départ documentaire. Elles ne
doivent pas toutes être considérées comme invariantes entre les révisions.
```

```
## 4. Technologie sonore
```

```
### 4.1 L'écrêtage asymétrique
```

```
L'écrêtage est le mécanisme qui limite progressivement l'amplitude du signal et
crée de nouvelles composantes harmoniques.
```

```
Dans un écrêtage symétrique, les alternances positives et négatives sont
traitées de façon similaire.
```

```
Dans un écrêtage asymétrique, elles ne sont pas traitées de manière identique.
```

```
Cette différence modifie la forme d'onde et la répartition des harmoniques. Elle
contribue au caractère sonore de la SD-1.
```

```
Cependant, l'écrêtage asymétrique ne constitue qu'un élément de la pédale. Le
résultat final dépend aussi du filtrage, du gain avant écrêtage, des étages
actifs et du niveau du signal entrant.
```

# `### 4.2 Réponse fréquentielle` 

```
La SD-1 est associée à un caractère médium marqué et à des basses relativement
resserrées.
```

```
Ce comportement est important dans une chaîne guitare, car il permet notamment
de distinguer une overdrive de ce type d'une saturation plus large bande.
```

```
Le modèle logiciel doit reproduire :
```

- `La réponse en basses fréquences.` 

- `La présence et l'équilibre des médiums.` 

- `L'atténuation ou l'accentuation des hautes fréquences.` 

- `Les variations de réponse avec DRIVE et TONE.` 

- `L'interaction entre le filtrage et la saturation.` 

```
Il ne faut pas supposer que la réponse fréquentielle est identique à faible et
fort niveau : les étages non linéaires peuvent modifier le spectre en fonction
de l'amplitude.
```

# `### 4.3 Sensibilité à la dynamique` 

```
Le son obtenu dépend du niveau d'entrée.
```

```
Un signal faible peut rester relativement propre, tandis qu'un signal plus fort
entraîne davantage d'écrêtage.
```

```
Cette caractéristique doit être préservée dans l'émulation. Une fonction qui
applique une saturation fixe sans tenir compte du niveau d'entrée risque de
produire un rendu trop uniforme.
```

# `### 4.4 Interactions entre commandes` 

```
Les trois commandes ne doivent pas être implémentées comme des effets totalement
indépendants.
```

- `**DRIVE** modifie le gain et donc le niveau envoyé à la partie non linéaire.` 

- `**TONE** modifie l'équilibre spectral.` 

- `**LEVEL** détermine le niveau de sortie.` 

```
Leur interaction doit être calibrée sur plusieurs positions, plutôt que supposée
à partir de potentiomètres génériques.
```

```
## 5. Architecture électronique fonctionnelle
```

```
Le chemin audio peut être représenté par les blocs suivants :
```

```
```text
ENTRÉE GUITARE
      |
      v
Adaptation d'impédance
      |
      v
Couplage et filtrage d'entrée
      |
      v
Étage de gain piloté par DRIVE
      |
      v
Écrêtage asymétrique
      |
      v
Filtrage et réseau de tonalité
      |
      v
Réglage LEVEL
      |
      v
Étage de sortie / buffer
      |
      v
SORTIE AUDIO
```
```

```
Cette représentation sert à organiser le développement DSP. Elle ne prétend pas
reproduire l'ordre exact de chaque composant du schéma électronique d'origine.
```

```
### 5.1 Entrée et adaptation d'impédance
```

```
L'impédance d'entrée influence la charge vue par les micros de la guitare.
```

```
Une entrée trop basse peut modifier le niveau et la réponse fréquentielle de la
guitare, particulièrement avec des micros passifs.
```

```
Pour une modélisation précise, il faut tenir compte :
```

- `De l'impédance d'entrée.` 

- `Des condensateurs de couplage.` 

- `Du comportement des étages actifs.` 

- `Du niveau de la source.` 

- `De l'impédance de sortie de la guitare ou du dispositif de reamping.` 

# `### 5.2 Amplification` 

```
Le gain détermine le niveau qui atteint la partie non linéaire.
```

```
La commande DRIVE doit agir sur ce gain de manière cohérente avec la pédale de
référence.
```

```
Une simple multiplication arbitraire par une valeur liée au potentiomètre peut
constituer une première approximation, mais ne garantit pas la même progression
sonore.
```

```
### 5.3 Réseau d'écrêtage
```

```
Le circuit historique utilise des composants non linéaires pour façonner le
signal.
```

```
Pour une émulation comportementale, on peut utiliser une fonction de saturation
```

```
asymétrique.
```

```
Pour une émulation au niveau du circuit, il faut modéliser les étages actifs et
leurs interactions à partir du schéma exact de la révision ciblée.
```

```
### 5.4 Réseau de tonalité
```

```
Le contrôle TONE doit reproduire la variation spectrale mesurée.
```

```
Il ne faut pas simplement supposer qu'il correspond à un filtre passe-bas
générique. Sa réponse exacte doit être déduite du schéma et, idéalement, mesurée
sur la pédale.
```

```
### 5.5 Niveau de sortie et bypass
```

```
LEVEL règle le niveau envoyé à l'étage suivant.
```

```
Le bypass doit être traité comme un chemin distinct. La fiche actuelle de BOSS
indique un bypass bufferisé : il ne faut donc pas présenter la pédale comme un
modèle true bypass sans preuve spécifique à la révision concernée.
```

```
## 6. Configuration logicielle recommandée
```

```
### 6.1 Objectif
```

```
Le modèle DSP doit :
```

```
- Fonctionner en temps réel.
```

```
- Préserver la dynamique.
```

```
- Reproduire l'écrêtage asymétrique.
```

```
- Reproduire les filtres.
```

```
- Éviter l'aliasing excessif.
```

```
- Permettre une calibration reproductible.
```

- `Être suffisamment efficace pour permettre plusieurs instances dans l'application.` 

```
### 6.2 Chaîne DSP initiale
```

```
```text
Entrée audio
    |
    v
DC blocker (si nécessaire)
    |
    v
Filtres d'entrée calibrés
    |
    v
Gain piloté par DRIVE
    |
    v
Suréchantillonnage
    |
    v
Saturation asymétrique
    |
    v
Filtrage de reconstruction
    |
    v
Réseau TONE calibré
    |
    v
```

```
Gain LEVEL
```

```
    |
    v
Sortie audio
```
```

```
Cette architecture constitue une base de travail. L'ordre exact des filtres doit
être ajusté selon le schéma électronique et les résultats de mesure.
```

```
### 6.3 Fréquence d'échantillonnage
```

```
La pédale physique est analogique : elle n'a pas de fréquence d'échantillonnage
interne à reproduire.
```

```
Pour l'application :
```

- `Conserver la fréquence audio native du moteur, par exemple 44,1 ou 48 kHz.` 

- `Suréchantillonner la partie non linéaire si les tests montrent que cela améliore la qualité.` 

- `Mesurer la latence et le coût CPU.` 

```
Tester plusieurs facteurs de suréchantillonnage, notamment 4× et 8×, puis
retenir le meilleur compromis entre qualité et performances.
```

```
### 6.4 Filtrage de suréchantillonnage
```

```
Utiliser un filtre de bonne qualité, par exemple un filtre FIR polyphasé, ou une
solution équivalente adaptée au moteur audio.
```

```
Vérifier :
```

- `La suppression des images spectrales.` 

- `La réduction de l'aliasing.` 

- `La stabilité.` 

- `La latence introduite.` 

- `Le coût CPU lorsque plusieurs pédales fonctionnent simultanément.` 

```
### 6.5 Non-linéarité asymétrique
```

```
Une première approximation peut être définie ainsi :
```

```
```text
si x >= 0 :
    y = f_pos(x, DRIVE)
sinon :
    y = f_neg(x, DRIVE)
```
```

```
Les fonctions `f_pos` et `f_neg` doivent être lisses et calibrables.
```

```
Des fonctions de type `tanh()` peuvent servir de prototype, mais leurs
paramètres doivent être ajustés à partir de mesures. Une courbe de transfert
mesurée et interpolée peut être plus appropriée si les données de référence sont
suffisamment fiables.
```

```
Une saturation statique ne reproduit pas nécessairement tous les comportements
du circuit analogique. Si nécessaire, il faudra modéliser les interactions entre
étages, filtres et éléments non linéaires.
```

```
### 6.6 Gestion du niveau
```

- `Utiliser une représentation interne en virgule flottante.` 

- `Conserver une marge suffisante pour les crêtes.` 

- `Définir un niveau d'entrée de référence.` 

- `Ne pas normaliser automatiquement tous les rendus.` 

- `Mesurer le gain réel avant de procéder à une comparaison d'écoute à niveau` 

```
égal.
```

- `Contrôler l'absence de clipping numérique inattendu.` 

```
### 6.7 Bruit et alimentation
```

```
Ne pas ajouter de bruit aléatoire sans données de référence.
```

```
Si le bruit fait partie de l'objectif de fidélité :
```

`1. Mesurer le bruit de la pédale.` 

`2. Séparer le bruit de l'interface audio.` 

`3. Déterminer le spectre et le niveau.` 

`4. Implémenter un modèle indépendant et désactivable.` 

```
De même, ne pas inventer une simulation d'alimentation ou de sag sans vérifier
qu'elle améliore la correspondance avec le matériel cible.
```

```
## 7. Calibration sur une pédale réelle
```

```
Une émulation fidèle nécessite des mesures.
```

```
### 7.1 Matériel de test
```

- `Une BOSS SD-1 physique identifiée.` 

- `Une interface audio dont la réponse est connue.` 

- `Une entrée adaptée à l'impédance de la pédale.` 

- `Une source de test ou un dispositif de reamping.` 

- `Une charge de sortie connue.` 

- `Un logiciel d'analyse audio.` 

- `Des enregistrements DI reproductibles.` 

```
Il faut consigner la révision matérielle et, si possible, photographier le PCB
et les composants.
```

```
**Précaution :** ne jamais connecter directement une sortie amplifiée de haut-
parleur à une entrée ligne. Respecter les niveaux électriques admissibles des
équipements.
```

```
### 7.2 Captures à effectuer
```

```
Tester les combinaisons suivantes :
```

- `| Test | Paramètre | |---|---|` 

- `| 1 | Bypass activé |` 

- `| 2 | Effet activé, DRIVE faible |` 

- `| 3 | Effet activé, DRIVE moyen | | 4 | Effet activé, DRIVE élevé | | 5 | TONE faible |` 

- `| 6 | TONE médian |` 

- `| 7 | TONE élevé |` 

- `| 8 | LEVEL à plusieurs positions |` 

- `| 9 | Plusieurs niveaux d'entrée |` 

- `| 10 | Signaux transitoires et DI de guitare |` 

```
Utiliser également des sinusoïdes à plusieurs fréquences et amplitudes.
```

```
Un balayage à faible niveau permet de caractériser le filtrage en limitant
l'influence de l'écrêtage. Des tests à niveau plus élevé permettent ensuite de
caractériser la non-linéarité.
```

```
### 7.3 Mesures à conserver
```

```
Pour chaque configuration :
```

- `Niveau RMS d'entrée et de sortie.` 

- `Niveau de crête.` 

- `Réponse fréquentielle.` 

- `Courbe entrée/sortie.` 

- `Spectre harmonique.` 

- `Distorsion harmonique.` 

- `Réponse aux transitoires.` 

- `Latence.` 

- `Paramètres exacts des commandes.` 

```
Conserver les fichiers sources, les résultats, les versions du code et les
réglages utilisés.
```

```
## 8. Tests de fidélité
```

```
### 8.1 Tests objectifs
```

```
Comparer le modèle logiciel et la pédale physique avec :
```

- `Réponse fréquentielle. - Courbe de gain en fonction de l'amplitude.` 

- `Harmoniques à plusieurs niveaux.` 

- `Réponse aux transitoires.` 

- `Erreur résiduelle sur les signaux DI.` 

- `Niveaux RMS et crêtes.` 

- `Latence et stabilité.` 

```
### 8.2 Tests d'écoute
```

```
Effectuer des comparaisons A/B à niveau égal.
```

```
La banque de test doit contenir :
```

- `Notes isolées.` 

- `Accords ouverts.` 

- `Accords saturés.` 

- `Attaques faibles.` 

- `Attaques fortes.` 

- `Signaux DI propres.` 

- `Différents niveaux de sortie de guitare.` 

```
Ne pas se fier uniquement à une guitare déjà très saturée : elle peut masquer
les différences entre les modèles.
```

```
### 8.3 Tests de régression
```

```
Pour chaque nouvelle version, conserver :
```

```
- Les signaux DI.
```

- `Les réglages de référence.` 

- `Les rendus de la version précédente.` 

- `Les métriques.` 

- `La version du moteur DSP.` 

```
Toute modification des filtres, du gain ou de la saturation doit être testée
pour détecter les régressions.
```

```
## 9. Critères d'acceptation
```

```
Les critères suivants sont des objectifs internes au projet, pas des tolérances
officielles de BOSS.
```

- `Pas de clipping numérique imprévu.` 

- `Pas de clics lors du changement de paramètres.` 

- `Pas de discontinuité audible des commandes.` 

- `Réponse fréquentielle reproductible.` 

- `Courbe de gain cohérente avec la pédale de référence.` 

- `Réponse dynamique préservée.` 

- `Résultats stables sur l'ensemble des signaux de test.` 

- `Latence acceptable.` 

- `Coût CPU compatible avec plusieurs effets simultanés.` 

```
Les seuils numériques doivent être définis après les premières mesures, en
tenant compte de la variabilité du banc de mesure et de l'unité physique.
```

```
## 10. Feuille de route
```

# `### Étape A — Référence fonctionnelle` 

- `Implémenter le chemin audio.` 

- `Ajouter DRIVE, TONE et LEVEL.` 

- `Séparer le bypass.` 

- `Définir les unités et les lois de paramètres.` 

- `Ajouter des tests de stabilité et de latence.` 

```
### Étape B — Modèle comportemental
```

- `Calibrer les filtres.` 

- `Ajuster le gain en fonction de DRIVE.` 

- `Ajuster l'écrêtage asymétrique à plusieurs amplitudes.` 

- `Tester le suréchantillonnage.` 

- `Mesurer l'aliasing et le coût CPU.` 

```
### Étape C — Validation
```

- `Comparer le modèle à la pédale physique.` 

- `Mesurer les écarts de niveau, de spectre et de transitoires.` 

- `Effectuer des écoutes A/B à niveau égal.` 

- `Documenter les écarts restants.` 

```
### Étape D — Modélisation circuit avancée
```

```
À envisager si le modèle comportemental ne suffit pas.
```

- `Relever les valeurs du schéma de la révision cible.` 

- `Modéliser les étages actifs et les composants non linéaires.` 

- `Tenir compte des interactions entre étages.` 

- `Comparer le résultat au modèle comportemental.` 

- `Conserver cette approche uniquement si le gain de fidélité justifie la complexité et le coût CPU.` 

# `## 11. Limites et incertitudes` 

```
Les points suivants ne doivent pas être présentés comme des faits établis sans
vérification :
```

- `Les sources publiques citées ne donnent pas de paramètres DSP officiels BOSS pour une émulation numérique.` 

- `Les lois exactes des potentiomètres ne doivent pas être inventées. - Les composants des Service Notes historiques ne sont pas nécessairement identiques dans toutes les révisions.` 

- `Une simulation circuit n'est pas automatiquement plus fidèle qu'un modèle` 

```
comportemental calibré.
```

```
- Les modèles de composants, les tolérances, l'alimentation et la charge peuvent
influencer le résultat.
- Sans comparaison avec une pédale physique, la fidélité ne peut pas être
démontrée.
```

```
- Les schémas, marques et documents sources restent soumis aux droits
applicables.
```

```
## 12. Schémas et ressources
```

```
### Schéma fonctionnel
```

```
Le schéma fonctionnel fourni avec le dossier représente le chemin audio
simplifié :
```

```
```text
INPUT
```

```
  → Adaptation d'impédance
  → Filtres d'entrée
  → Gain DRIVE
```

```
  → Écrêtage asymétrique
  → Réseau TONE
  → Niveau LEVEL
  → Étage de sortie
  → OUTPUT
```

```
Il s'agit d'une vue pédagogique, et non du schéma électronique exact.
```

```
### Schéma électronique original
```

```
[BOSS SD-1 Service Notes — PDF
historique](https://www.synfo.nl/servicemanuals/Boss/BOSS_SD-1_SERVICE_NOTES.pdf
)
```

# `### Documentation constructeur` 

```
[BOSS SD-1 — page officielle](https://www.boss.info/global/products/sd-1/)
[BOSS SD-1 — support et
documentation](https://www.boss.info/global/products/sd-1/support/)
```

```
## 13. Conclusion
```

```
La modélisation de la BOSS SD-1 doit privilégier une approche mesurable et
progressive.
```

```
La priorité n'est pas d'ajouter immédiatement une simulation électronique
complexe, mais d'obtenir une correspondance reproductible sur les points les
plus importants :
```

`1. Filtrage.` 

`2. Gain et réponse de DRIVE.` 

`3. Écrêtage asymétrique.` 

`4. Réponse de TONE.` 

`5. Niveau de sortie.` 

`6. Dynamique.` 

`7. Comportement du bypass.` 

```
Un modèle comportemental bien calibré peut constituer une excellente base. Une
```

```
simulation circuit plus détaillée doit être justifiée par des mesures démontrant
un gain réel de fidélité.
```

