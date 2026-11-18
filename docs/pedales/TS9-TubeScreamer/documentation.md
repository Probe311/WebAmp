# Ibanez TS9 Tube Screamer — Documentation technique et modélisation sonore

**Version :** 1.0  
**Date :** 29 octobre 2026  
**ID système :** `ibanez-tube-screamer`

**Objectif :** documenter la technologie sonore de l’Ibanez TS9 Tube Screamer, son architecture électronique et les paramètres nécessaires à une émulation logicielle fidèle.

---

## 1. Présentation générale

L’**Ibanez Tube Screamer TS9** est une overdrive analogique, réédition du classique vert. Le circuit d’origine (famille TS808 / TS9) a été conçu vers **1979–1980** par S. Tamura (Nisshin Onpa / Maxon) pour Ibanez. C’est l’archétype de l’overdrive « mid-hump », utilisée pour pousser un ampli à lampes autant que comme saturation autonome.

Caractère sonore issu de :

- Buffers d’entrée / sortie
- Soft-clipping par diodes **dans** la boucle de contre-réaction de l’AOP
- Filtrage HPF/LPF dans le feedback (signature médium)
- Réseau TONE actif
- LEVEL et bypass (JFET historique ou true bypass selon révision)

**Principe fondamental :** un soft-clip générique sans mid-hump ni filtres de feedback ne reproduit pas un Tube Screamer.

### Objectifs de la modélisation

1. Réponse fréquentielle (bosse médium)
2. Soft clip vs niveau d’entrée et DRIVE
3. Interactions DRIVE / TONE / LEVEL
4. Dynamique et clean-up au volume guitare
5. Comportement en booster devant un ampli saturé
6. Bypass

---

## 2. Sources techniques

### 2.1 Documentation officielle

**Ibanez — Page produit TS9**  
https://www.ibanez.com/usa/products/detail/ts9_99.html  
(local : [`page_officielle.html`](./page_officielle.html))

Commandes Drive, Tone, Level · 8 mA @ 9 V · alim centre négatif.

### 2.2 Schéma et analyses

**Schéma TS-9** (local)  
[`schema_TS9.pdf`](./schema_TS9.pdf) · [`schema_TS9.gif`](./schema_TS9.gif)  
Source : schematicsforfree.com — AOP dual 4558, diodes Si (1N914), JFET 2SK30A.

**ElectroSmash — Tube Screamer Circuit Analysis** (TS808, même famille)  
[`ElectroSmash_Tube_Screamer_Analysis.pdf`](./ElectroSmash_Tube_Screamer_Analysis.pdf)  
https://www.electrosmash.com/tube-screamer-analysis  

Analyse par blocs : bypass JFET, buffers, clipping amp, tone/volume.

> TS808 et TS9 sont proches mais pas identiques (valeurs de composants, sortie). Identifier la révision ciblée (TS9 reissue actuelle vs vintage).

---

## 3. Caractéristiques matérielles

| Caractéristique | Valeur ou description | Précision |
|---|---|---|
| Type | Overdrive analogique | Ibanez TS9 |
| Famille | Tube Screamer (TS808 / TS9) | 1979– |
| Commandes | DRIVE, TONE, LEVEL | Overdrive / Tone / Level |
| Alimentation | 9 V DC centre négatif ou pile | Officiel |
| Consommation | 8 mA @ 9 V | Fiche Ibanez |
| AOP typique | JRC4558 (dual) | Schémas historiques |
| Clipping | Diodes Si dans le feedback | Soft clip |
| Bypass historique | Bufferisé (JFET) | TS808 / anciennes |
| Bypass moderne | Souvent true bypass | Selon révision reissue |

---

## 4. Technologie sonore

### 4.1 Soft clipping dans le feedback

Les diodes limitent la tension d’erreur dans la boucle de l’AOP non-inverseur → saturation progressive, harmoniques plus « douces » qu’un hard clip (DS-1, RAT).

### 4.2 Mid-hump

Le filtrage (HPF + LPF dans / autour du feedback, puis tone) accentue les médiums. Le son coupe dans un mix sans empâter les basses autant qu’une distorsion large bande.

### 4.3 Usage booster

DRIVE bas + LEVEL élevé : boost médium pour saturer l’entrée d’un ampli. DRIVE élevé : overdrive autonome.

### 4.4 Commandes

- **DRIVE** — gain de l’étage clippeur
- **TONE** — équilibre aigu / grave (circuit actif caractéristique)
- **LEVEL** — niveau de sortie

---

## 5. Architecture électronique fonctionnelle

```text
ENTRÉE
  → Buffer entrée
  → AOP non-inverseur + soft clip diodes (DRIVE)
      (+ HPF/LPF feedback)
  → Réseau TONE
  → LEVEL
  → Buffer sortie
  → SORTIE
```

(Bypass JFET ou true bypass en parallèle selon révision.)

---

## 6. Configuration logicielle recommandée

```text
Entrée
  → Buffer / Zin
  → Filtres pré-clip (mid shaping)
  → Gain DRIVE
  → Suréchantillonnage
  → Soft clip (diodes feedback équivalent)
  → Reconstruction
  → TONE calibré
  → LEVEL
  → Sortie
```

Points critiques : soft clip lissé, mid-hump calibré, TONE non générique, OS 4×/8× sur la non-linéarité.

---

## 7. Calibration

Pédale TS9 identifiée, DI, sinusoïdes, balayages faible/fort niveau. Combinaisons DRIVE × TONE × LEVEL × niveaux d’entrée. Mesurer FR, I/O, harmoniques, transitoires.

---

## 8–9. Tests et critères

A/B vs pédale : mid-hump, soft clip, booster vs OD. Pas de clics, CPU OK, dynamique préservée.

---

## 10. Feuille de route

**A** Chemin + DRIVE/TONE/LEVEL · **B** Soft clip + mid-hump + OS · **C** Validation · **D** Circuit 4558 si besoin

---

## 11. Limites

- TS808 ≠ TS9 ≠ TS Mini (valeurs / output)
- Clones et « mods » nombreux
- Pas de paramètres DSP officiels Ibanez
- Schémas historiques / reverse-engineered

---

## 12. Ressources locales

| Fichier | Description |
|---|---|
| [`photo_officielle.png`](./photo_officielle.png) | Visuel Ibanez |
| [`photo_produit.jpg`](./photo_produit.jpg) | Photo produit |
| [`schema_TS9.pdf`](./schema_TS9.pdf) | Schéma TS-9 |
| [`schema_TS9.gif`](./schema_TS9.gif) | Schéma GIF |
| [`ElectroSmash_Tube_Screamer_Analysis.pdf`](./ElectroSmash_Tube_Screamer_Analysis.pdf) | Analyse TS808 |
| [`page_officielle.html`](./page_officielle.html) | Page Ibanez |

Liens : [Ibanez TS9](https://www.ibanez.com/usa/products/detail/ts9_99.html) · [ElectroSmash](https://www.electrosmash.com/tube-screamer-analysis)

---

## 13. Conclusion

Priorités : soft clip feedback, mid-hump, TONE, dynamique booster. Modèle comportemental calibré en premier.
