# Electro-Harmonix Big Muff Pi — Documentation technique et modélisation sonore

**Version :** 1.0  
**Date :** 29 octobre 2026  
**ID système :** `electro-harmonix-big-muff`

**Objectif :** documenter la technologie sonore du Big Muff Pi (référence NYC / production actuelle), son architecture à transistors et les paramètres pour une émulation DSP fidèle.

---

## 1. Présentation générale

Le **Electro-Harmonix Big Muff Pi** est une fuzz / distorsion / sustainer analogique apparue fin des années **1960** (Mike Matthews / Bob Myer). Le modèle NYC reissue (années 2000+) perpétue le son « creamy », sustain violon et scoop médium caractéristiques.

Architecture typique : **quatre étages transistor NPN** — entrée, deux étages de clipping diodes, tone stack passif, sortie — commandes **VOLUME**, **TONE**, **SUSTAIN**.

Éléments du caractère :

- Cascade de gain transistor
- Soft/hard clip progressif via paires de diodes (2 étages)
- Tone stack type « scoop » (grave ↔ aigu, médiums creusés)
- Sustain très long à SUSTAIN élevé
- True bypass (versions modernes)

**Principe fondamental :** un fuzz à un seul soft-clip ne suffit pas. La double cascade + tone scoop définit le Muff.

### Objectifs de la modélisation

1. Scoop médium et réponse TONE  
2. Progression SUSTAIN (grit → wall of fuzz)  
3. Spectre harmonique des deux étages de diodes  
4. Dynamique / attaque  
5. Niveau VOLUME  
6. Bypass  

---

## 2. Sources techniques

### 2.1 Officiel EHX

**Page produit Big Muff Pi**  
https://www.ehx.com/products/big-muff-pi/  
(local : [`page_officielle.html`](./page_officielle.html))

- Circuit analogique, true bypass, 3 mA, pile 9 V  
- Commandes Volume / Tone / Sustain  

### 2.2 Schémas et historique

**Schéma réplique NYC (GGG)**  
[`schema_NYC.pdf`](./schema_NYC.pdf)  
https://generalguitargadgets.com/pdf/ggg_bmp_nyc_sc.pdf  

**Kit Rae — versions et schémas historiques**  
[`kitrae_versions_part1.html`](./kitrae_versions_part1.html)  
https://www.bigmuffpage.com/  

> De nombreuses variantes (Triangle, Ram’s Head, Russian, Op-amp…). **Ce dossier cible le NYC / Pi « classique »** utilisé comme référence app ; noter toute autre révision.

---

## 3. Caractéristiques matérielles

| Caractéristique | Valeur ou description | Précision |
|---|---|---|
| Type | Fuzz / Distortion / Sustainer | EHX Big Muff Pi |
| Première génération | ~1969–1971 | Historique |
| Reissue NYC | ~2000+ | Fiche EHX |
| Commandes | VOLUME, TONE, SUSTAIN | |
| Alimentation | 9 V pile / adaptateur | |
| Consommation | 3 mA | EHX |
| Bypass | True bypass | Moderne |
| Dimensions | ~5.5 × 2.95 × 6.88 in | EHX |
| Transistors | 4 × NPN BJT | Schémas réplique |
| Diodes clipping | 2 paires Si (ex. 1N914/1N6263) | Selon révision |

---

## 4. Technologie sonore

### 4.1 Double étage de clipping

Deux cellules « transistor + diodes » en cascade produisent un fuzz dense et un sustain extrême. Le premier étage prépare ; le second écrase.

### 4.2 Tone stack (scoop)

Le TONE balance grave et aigu autour d’un **creux médium**. C’est la signature « Muff » dans un mix — et un piège DSP si on utilise un simple tilt générique.

### 4.3 SUSTAIN

Contrôle le gain de la cascade (et donc clipping + sustain). Bas = crunch / fuzz léger ; haut = mur de sustain.

### 4.4 VOLUME

Niveau de sortie après le tone stack.

---

## 5. Architecture fonctionnelle

```text
ENTRÉE
  → Étage transistor entrée / gain
  → Clip stage 1 (transistor + diodes)
  → Clip stage 2 (transistor + diodes)
  → Tone stack (TONE)
  → VOLUME
  → SORTIE
```

SUSTAIN agit principalement sur le gain des étages de clipping.

---

## 6. DSP recommandé

```text
Entrée
  → Couplage / HPF
  → Gain + soft/hard clip étage 1 (OS)
  → Gain + clip étage 2 (OS)
  → Tone scoop calibré
  → VOLUME
  → Sortie
```

Suréchantillonner les non-linéarités. Calibrer le scoop sur mesures FR à plusieurs positions TONE. Ne pas fusionner les deux étages en une seule courbe sans vérifier le spectre.

---

## 7. Calibration

Pédale NYC (ou révision ciblée) + DI + sinusoïdes + balayages. Matrice SUSTAIN × TONE × VOLUME × niveaux d’entrée. Mesurer scoop, I/O, harmoniques, sustain subjectif.

---

## 8–11. Tests, critères, limites

A/B : wall of fuzz, scoop, clean-up partiel.  
Limites : dizaines de variantes historiques ; schémas GGG = répliques pédagogiques ; pas de modèle DSP officiel EHX.

---

## 12. Ressources locales

| Fichier | Description |
|---|---|
| [`photo_produit.jpg`](./photo_produit.jpg) | Photo officielle EHX |
| [`photo_angle.jpg`](./photo_angle.jpg) | Vue complémentaire |
| [`schema_NYC.pdf`](./schema_NYC.pdf) | Schéma NYC (GGG) |
| [`page_officielle.html`](./page_officielle.html) | Page EHX |
| [`kitrae_versions_part1.html`](./kitrae_versions_part1.html) | Historique versions |

Liens : [EHX Big Muff Pi](https://www.ehx.com/products/big-muff-pi/) · [Big Muff Page (Kit Rae)](https://www.bigmuffpage.com/) · [GGG BMP](https://generalguitargadgets.com/effects-projects/distortion/big-muff-pi/)

---

## 13. Conclusion

Priorités : double cascade de clip, tone scoop, progression SUSTAIN, sustain long. Modèle comportemental 2 étages + tone calibré avant toute simulation transistor détaillée.
