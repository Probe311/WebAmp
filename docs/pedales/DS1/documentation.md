# BOSS DS-1 Distortion — Documentation technique et modélisation sonore

**Version :** 1.0  
**Date :** 29 octobre 2026  
**ID système :** `boss-ds1`

**Objectif :** documenter la technologie sonore de la BOSS DS-1, son architecture électronique et les paramètres nécessaires à une émulation logicielle fidèle.

---

## 1. Présentation générale

La **BOSS DS-1 Distortion** est une pédale de distorsion analogique commercialisée depuis **1978**. C’est la première distorsion compacte BOSS et la plus vendue de la gamme. Elle est connue pour son attaque tranchante, son sustain long et son circuit à deux étages (transistors + AOP).

Contrairement à une distorsion numérique générique, son caractère sonore résulte de l’interaction de plusieurs éléments :

- L’adaptation d’impédance en entrée
- Le préampli transistor et le filtrage
- Le gain piloté par DIST
- L’écrêtage par diodes (clipping dure)
- Le réseau de tonalité TONE
- L’étage de sortie et LEVEL
- Le niveau du signal entrant et l’interaction avec la guitare

**Principe fondamental :** reproduire uniquement un écrêtage dur ne suffit pas à reproduire fidèlement une DS-1. Le double étage de gain et le filtrage avant / après clipping sont essentiels.

### Objectifs de la modélisation

L’émulation logicielle doit chercher à reproduire :

1. La réponse fréquentielle de la pédale
2. La courbe de saturation en fonction du niveau d’entrée
3. Le caractère « hard clip » et le sustain
4. L’évolution du son avec DIST, TONE et LEVEL
5. La réponse aux transitoires et à la dynamique
6. Le niveau de sortie et le comportement du bypass

La fidélité doit être vérifiée par comparaison avec une pédale physique identifiée (révision DS-1 vs DS-1A). Sans cette référence, le modèle reste une approximation technique.

---

## 2. Sources techniques

### 2.1 Documentation officielle

**BOSS — Page produit DS-1**  
https://www.boss.info/global/products/ds-1/  
Caractère sonore, commandes, circuit à deux étages, spécifications actuelles.

**BOSS — Support / manuels DS-1**  
https://www.boss.info/global/support/by_product/ds-1/owners_manuals/

**Manuel utilisateur DS-1** (local)  
[`BOSS_DS-1_Owner_Manual.pdf`](./BOSS_DS-1_Owner_Manual.pdf)  
Source : https://static.roland.com/assets/media/pdf/DS-1_M_eng02_W.pdf

### 2.2 Schéma électronique et composants

**BOSS DS-1 Service Notes — Second Edition (déc. 1994)** (local)  
[`BOSS_DS-1_SERVICE_NOTES.pdf`](./BOSS_DS-1_SERVICE_NOTES.pdf)  
Source : https://www.synfo.nl/servicemanuals/Boss/DS-1_SERVICE_NOTES.pdf  

Contient notamment :

- Différences DS-1 (ACA) vs DS-1A (PSA)
- Spécifications
- Vue éclatée et liste de pièces
- Implantations PCB
- Schémas électriques (DS-1 et DS-1A)

**Copie alternative Service Manual**  
[`BOSS_DS-1_Service_Manual_alt.pdf`](./BOSS_DS-1_Service_Manual_alt.pdf)

**Schémas PNG (Hobby-Hour)**  
- [`schema_electrique_DS1A.png`](./schema_electrique_DS1A.png) — Second Edition (1994+)  
- [`schema_electrique_DS1_1st.png`](./schema_electrique_DS1_1st.png) — First Edition (si disponible)

> **Important :** à partir de novembre 1994 (SNo. JG83100), la révision interne est appelée DS-1A (adaptateur PSA). Le marquage externe reste « DS-1 ». Les Service Notes historiques ne doivent pas être généralisés à toutes les versions sans vérification.

---

## 3. Caractéristiques matérielles

| Caractéristique | Valeur ou description | Précision |
|---|---|---|
| Type | Distorsion analogique | BOSS DS-1 |
| Première commercialisation | 1978 | Historique BOSS |
| Commandes | DIST, TONE, LEVEL | Contrôles utilisateur |
| Alimentation | 9 V DC (PSA) ou pile 9 V | Versions actuelles ; anciennes ACA |
| Niveau nominal d’entrée | -20 dBu | Fiche BOSS actuelle |
| Impédance d’entrée | 1 MΩ | Fiche actuelle ; docs historiques : 470 kΩ |
| Niveau nominal de sortie | -20 dBu | Fiche BOSS actuelle |
| Impédance de sortie | 1 kΩ | Fiche BOSS actuelle |
| Charge de sortie recommandée | 10 kΩ ou plus | Fiche BOSS actuelle |
| Consommation | 10 mA | Fiche actuelle ; Service Notes DS-1A : ~4 mA |
| Bypass | Bufferisé | Compact BOSS typique |
| Dimensions | 73 × 129 × 59 mm | Avec pile |
| Poids | ~360 g | Avec pile |
| AOP historique (DS-1A) | BA728N / M5223AL / NJM2904L | Selon période de production |
| Transistors historiques | 2SC2240, 2SC2458, 2SK30 (JFET) | Vérifier nomenclature |
| Diodes de clipping | 1S2473 / 1S1588 (réseau) | Service Notes |

Ces caractéristiques constituent un point de départ documentaire. Elles ne doivent pas toutes être considérées comme invariantes entre les révisions.

---

## 4. Technologie sonore

### 4.1 Distorsion à deux étages

La DS-1 utilise un circuit pionnier à **deux étages de gain** :

1. **Étage transistor** — préamplification et coloration basse
2. **Étage AOP + diodes** — gain élevé et écrêtage dur

Cette architecture contribue à la plénitude dans le grave et au sustain caractéristique, distincte d’une overdrive à soft-clip (ex. SD-1).

### 4.2 Écrêtage « hard clip »

L’écrêtage par diodes limite fortement l’amplitude et génère un spectre riche en harmoniques d’ordre élevé. Le rendu est plus agressif et « tranchant » qu’une SD-1.

Cependant, le hard clip n’est qu’un élément : le filtrage avant et après, le gain DIST et le TONE façonnent le résultat final.

### 4.3 Réponse fréquentielle

La DS-1 est associée à :

- Des basses relativement présentes (aide aux riffs lourds)
- Des aigus pouvant devenir agressifs selon TONE
- Une attaque claire même à fort DIST

Le modèle logiciel doit reproduire :

- La réponse en basses fréquences
- L’équilibre médium / aigu
- Les variations avec DIST et TONE
- L’interaction filtrage ↔ saturation

### 4.4 Sensibilité à la dynamique

À DIST faible, la pédale peut servir de **booster**. Un signal faible reste plus propre ; un signal fort augmente l’écrêtage. Baisser le volume de la guitare nettoie le son sans trop d’empâtement (comportement documenté par BOSS).

### 4.5 Interactions entre commandes

- **DIST** — gain vers la section non linéaire (plage très large)
- **TONE** — équilibre spectral (filtre caractéristique, pas un simple LPF générique)
- **LEVEL** — niveau de sortie

Leur interaction doit être calibrée sur plusieurs positions.

---

## 5. Architecture électronique fonctionnelle

```text
ENTRÉE GUITARE
      |
      v
Adaptation d'impédance / buffer
      |
      v
Étage transistor (pré-gain + filtrage)
      |
      v
Gain AOP piloté par DIST
      |
      v
Écrêtage diodes (hard clip)
      |
      v
Réseau de tonalité TONE
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

Cette représentation sert à organiser le développement DSP. Elle ne prétend pas reproduire l’ordre exact de chaque composant du schéma d’origine.

### 5.1 Entrée et adaptation d’impédance

L’impédance d’entrée influence la charge vue par les micros. Pour une modélisation précise, tenir compte de l’impédance, des condensateurs de couplage et du niveau de la source.

### 5.2 Amplification à deux étages

Le gain DIST agit sur le niveau envoyé au clipping. Une simple multiplication linéaire par le potentiomètre est une première approximation, insuffisante pour la progression sonore réelle.

### 5.3 Réseau d’écrêtage

Pour une émulation comportementale : fonction de saturation « hard » (ex. clip symétrique lissé, ou courbe mesurée).  
Pour une émulation circuit : modéliser transistors, AOP et diodes à partir du schéma de la révision ciblée.

### 5.4 Réseau de tonalité

Le TONE de la DS-1 a une réponse spécifique (souvent décrit comme coupant / formant). Ne pas le réduire à un passe-bas générique sans mesures.

### 5.5 Niveau de sortie et bypass

LEVEL règle le niveau vers l’étage suivant. Le bypass des compactes BOSS modernes est bufferisé : ne pas affirmer un true bypass sans preuve pour la révision concernée.

---

## 6. Configuration logicielle recommandée

### 6.1 Objectif

Le modèle DSP doit :

- Fonctionner en temps réel
- Préserver la dynamique
- Reproduire le hard clip et le double étage
- Reproduire les filtres
- Limiter l’aliasing
- Permettre une calibration reproductible
- Rester efficace pour plusieurs instances

### 6.2 Chaîne DSP initiale

```text
Entrée audio
    |
    v
DC blocker (si nécessaire)
    |
    v
Filtres / pré-étage calibrés
    |
    v
Gain piloté par DIST
    |
    v
Suréchantillonnage
    |
    v
Saturation hard-clip (lissée)
    |
    v
Filtrage de reconstruction
    |
    v
Réseau TONE calibré
    |
    v
Gain LEVEL
    |
    v
Sortie audio
```

### 6.3 Fréquence d’échantillonnage

Conserver la fréquence native du moteur (44,1 ou 48 kHz). Suréchantillonner la partie non linéaire (tester 4× et 8×). Mesurer latence et CPU.

### 6.4 Non-linéarité

Première approximation :

```text
y = clip_hard(x * g(DIST), seuil)
```

avec `clip_hard` lissé (pas de discontinuité dérivable brutale) pour limiter les artefacts. Calibrer seuils et courbes sur mesures. Une courbe entrée/sortie mesurée et interpolée est préférable si les données sont fiables.

### 6.5 Gestion du niveau

- Virgule flottante interne
- Marge de crête
- Niveau d’entrée de référence défini
- Pas de normalisation automatique aveugle
- Contrôle de l’absence de clipping numérique imprévu

### 6.6 Bruit et alimentation

Ne pas ajouter de bruit ou de sag d’alimentation sans données de référence.

---

## 7. Calibration sur une pédale réelle

### 7.1 Matériel de test

- Une BOSS DS-1 physique (noter révision DS-1 / DS-1A / DS-1W si applicable)
- Interface audio de réponse connue
- Source de test / reamping
- Charge de sortie connue
- Logiciel d’analyse
- DI reproductibles

Photographier le PCB et les composants si possible.

**Précaution :** ne jamais connecter une sortie HP amplifiée à une entrée ligne.

### 7.2 Captures à effectuer

| Test | Paramètre |
|---|---|
| 1 | Bypass |
| 2 | DIST faible |
| 3 | DIST moyen |
| 4 | DIST élevé |
| 5–7 | TONE bas / médian / élevé |
| 8 | LEVEL à plusieurs positions |
| 9 | Plusieurs niveaux d’entrée |
| 10 | Transitoires et DI guitare |

Sinusoïdes multi-fréquences / amplitudes + balayage à faible niveau (filtrage) puis haut niveau (non-linéarité).

### 7.3 Mesures à conserver

RMS / crête in-out, réponse fréquentielle, courbe entrée/sortie, spectre harmonique, THD, transitoires, latence, positions exactes des knobs.

---

## 8. Tests de fidélité

### 8.1 Objectifs

Comparer modèle et pédale : réponse fréquentielle, gain vs amplitude, harmoniques, transitoires, erreur résiduelle sur DI, niveaux, stabilité.

### 8.2 Écoute

A/B à niveau égal : notes isolées, accords ouverts / saturés, attaques faibles / fortes, DI propres, niveaux de sortie guitare variés.

### 8.3 Régression

Conserver DI, réglages de référence, rendus précédents, métriques et version DSP.

---

## 9. Critères d’acceptation

Objectifs internes (non officiels BOSS) :

- Pas de clipping numérique imprévu
- Pas de clics au changement de paramètres
- Commandes continues sans discontinuité audible
- Réponse fréquentielle reproductible
- Courbe de gain cohérente avec la référence
- Dynamique préservée
- Latence et CPU acceptables pour multi-instances

---

## 10. Feuille de route

### Étape A — Référence fonctionnelle

- Chemin audio, DIST / TONE / LEVEL, bypass séparé
- Unités et lois de paramètres
- Tests de stabilité / latence

### Étape B — Modèle comportemental

- Calibrer filtres et pré-étage
- Ajuster gain DIST et hard clip
- Tester suréchantillonnage, aliasing, CPU

### Étape C — Validation

- Comparaison pédale physique
- Écoutes A/B
- Documenter les écarts restants

### Étape D — Modélisation circuit (si nécessaire)

Uniquement si le modèle comportemental ne suffit pas et si le gain de fidélité justifie le coût CPU.

---

## 11. Limites et incertitudes

- Pas de paramètres DSP officiels BOSS pour l’émulation
- Lois exactes des potentiomètres à mesurer, pas à inventer
- Différences DS-1 / DS-1A / DS-1W (Waza Craft) : ne pas confondre
- Composants des Service Notes ≠ toutes les révisions
- Sans pédale physique, la fidélité ne peut pas être démontrée
- Schémas et documents sources soumis aux droits applicables

---

## 12. Schémas et ressources locales

### Photos produit

| Fichier | Description |
|---|---|
| [`photo_produit_main.jpg`](./photo_produit_main.jpg) | Visuel principal BOSS / Roland |
| [`photo_hero.jpg`](./photo_hero.jpg) | Hero page officielle |
| [`photo_vue_dessus.png`](./photo_vue_dessus.png) | Vue dessus |

### Schémas

| Fichier | Description |
|---|---|
| [`BOSS_DS-1_SERVICE_NOTES.pdf`](./BOSS_DS-1_SERVICE_NOTES.pdf) | Service Notes officiels historiques |
| [`schema_electrique_DS1A.png`](./schema_electrique_DS1A.png) | Schéma Second Edition |
| [`schema_electrique_DS1_1st.png`](./schema_electrique_DS1_1st.png) | Schéma First Edition |

### Documentation constructeur

- [BOSS DS-1 — page officielle](https://www.boss.info/global/products/ds-1/)
- [BOSS DS-1 — support](https://www.boss.info/global/support/by_product/ds-1/owners_manuals/)
- [Hobby-Hour — schéma DS-1A](https://www.hobby-hour.com/electronics/s/boss-ds1a-distortion.php)

### Schéma fonctionnel (pédagogique)

```text
INPUT
  → Adaptation d'impédance
  → Étage transistor
  → Gain DIST (AOP)
  → Hard clip diodes
  → Réseau TONE
  → Niveau LEVEL
  → Étage de sortie
  → OUTPUT
```

---

## 13. Conclusion

La modélisation de la BOSS DS-1 doit privilégier une approche mesurable et progressive.

Priorités :

1. Double étage (transistor + AOP)
2. Hard clip et sustain
3. Filtrage / TONE
4. Progression de DIST
5. Niveau de sortie
6. Dynamique et clean-up au volume guitare
7. Bypass

Un modèle comportemental bien calibré constitue une excellente base. Une simulation circuit plus détaillée doit être justifiée par des mesures démontrant un gain réel de fidélité.
