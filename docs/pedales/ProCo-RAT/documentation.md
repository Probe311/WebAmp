# Pro Co RAT — Documentation technique et modélisation sonore

**Version :** 1.0  
**Date :** 29 octobre 2026  
**ID système :** `proco-rat`

**Objectif :** documenter la technologie sonore de la Pro Co RAT (référence RAT 2 actuelle), son architecture électronique et les paramètres nécessaires à une émulation logicielle fidèle.

---

## 1. Présentation générale

La **Pro Co RAT** est une pédale de distorsion analogique conçue à Kalamazoo (Michigan) par Scott Burnham et Steve Kiraly. Prototype « Bud Box » en 1978, production de masse dès **1979**. La **RAT 2** (1988) est la version contemporaine la plus répandue : même circuit de base, LED d’état, boîtier métal massif.

Son caractère vient d’un **hard clip** par diodes après un AOP à très fort gain (historiquement **LM308**), suivi d’un contrôle **FILTER** (passe-bas) plutôt qu’un tone classique.

Éléments clés du son :

- Impédance d’entrée et couplage
- Gain variable très élevé (DISTORTION)
- Slew-rate limité du LM308 (couleur « sale » / compression naturelle)
- Écrêtage dur symétrique (diodes 1N914 typiques)
- Filtre coupe-aigu FILTER
- Buffer JFET de sortie et VOLUME

**Principe fondamental :** un simple hard-clip numérique ne reproduit pas une RAT. Le gain extrême, le filtrage autour de l’AOP et le FILTER sont essentiels.

### Objectifs de la modélisation

1. Réponse fréquentielle (pré-filtre + FILTER)
2. Courbe de saturation vs niveau d’entrée et DISTORTION
3. Hard clip et spectre harmonique
4. Interaction FILTER / DISTORTION / VOLUME
5. Dynamique et comportement en booster
6. Bypass et niveau de sortie

Comparer idéalement à une RAT 2 physique identifiée (et noter les variantes Turbo / Dirty / Vintage).

---

## 2. Sources techniques

### 2.1 Documentation produit

**RAT Distortion (famille officielle / ACT Entertainment)**  
https://actentertainment.com/rat-distortion-detail/

**Fiche détaillant (Thomann) — RAT 2**  
https://www.thomann.co.uk/proco_rat2.htm  
Commandes Distortion / Filter / Volume, conso ~0,8 mA, 9 V.

### 2.2 Analyse circuit et schémas

**ElectroSmash — Pro Co Rat Analysis** (local)  
[`electrosmash_analysis.html`](./electrosmash_analysis.html)  
https://electrosmash.mas-effects.com/proco-rat.html  

Découpage : alimentation, clipper amp (LM308), tone/filter, sortie. Formules de gain et de filtres.

**Schéma reverse-engineered** (local)  
[`schema_ProCo_RAT.pdf`](./schema_ProCo_RAT.pdf) — http://www.dirk-hendrik.com/proco_rat.pdf  

**Schéma alternatif** (local)  
[`schema_ProCo_RAT_alt.pdf`](./schema_ProCo_RAT_alt.pdf) — schematicsforfree.com

> Les schémas publics sont souvent reverse-engineered. Vérifier la révision matérielle avant d’utiliser une valeur de composant comme référence universelle.

---

## 3. Caractéristiques matérielles

| Caractéristique | Valeur ou description | Précision |
|---|---|---|
| Type | Distorsion / OD / fuzz-like | Pro Co RAT 2 |
| Origine | 1978–1979 (Kalamazoo) | Historique |
| Commandes | DISTORTION, FILTER, VOLUME | Contrôles utilisateur |
| Alimentation | 9 V DC (centre négatif) ou pile | Tipique |
| Consommation | ~0,8 mA (fiche) / ~5 mA (docs anciennes) | Selon source |
| Dimensions (RAT 2) | ~89 × 103 × 73 mm | Thomann |
| Poids | ~794 g | Thomann |
| AOP historique | LM308 (ou équivalent selon révision) | Cœur du circuit |
| Clipping | 2 × 1N914 (Si) à la masse | Hard clip symétrique |
| Buffer sortie | JFET (ex. 2N5458) | Après FILTER |
| Bypass | True bypass (versions courantes) | Vérifier révision |

Variantes notables (même famille, circuits / clipping différents) : Turbo RAT, You Dirty RAT, Vintage / Whiteface, Lil’ RAT, Deucetone. **Ce document cible la RAT / RAT 2 classique (diodes Si).**

---

## 4. Technologie sonore

### 4.1 Hard clip après fort gain

Contrairement à une Tube Screamer (soft clip dans la boucle de contre-réaction), la RAT place les diodes **après** l’étage de gain, vers la masse → forme d’onde proche du carré, harmoniques riches, sustain agressif.

### 4.2 Rôle du LM308

Le LM308 a un **slew rate limité**. À fort gain, l’AOP ne suit pas parfaitement les transitoires : coloration, compression et « grit » caractéristiques. Une émulation qui ignore le slew rate risque un hard clip trop « numérique » et trop propre.

### 4.3 FILTER (pas un TONE classique)

Le FILTER est un **passe-bas** : on **coupe** les aigus en tournant (sens inverse de beaucoup de TONE BOSS). Ouvert = plus d’aigus / agressivité ; fermé = son plus sourd / carré filtré.

### 4.4 Plage de gain

D’après l’analyse ElectroSmash (ordre de grandeur) :

- Gain min ≈ 0 dB
- Gain max théorique ≈ 67 dB (en pratique limité par le slew et le clipping)

À DISTORTION faible : booster / OD. À DISTORTION élevé : distorsion lourde voire fuzz-like.

### 4.5 Interactions

- **DISTORTION** → gain avant diodes
- **FILTER** → spectre post-clip
- **VOLUME** → niveau (buffer JFET : le volume ne doit pas trop recolorer)

---

## 5. Architecture électronique fonctionnelle

```text
ENTRÉE GUITARE
      |
      v
Pull-down / couplage / HPF entrée
      |
      v
AOP non-inverseur (gain = DISTORTION)
  + filtres C autour de l'AOP
      |
      v
Hard clip diodes (1N914)
      |
      v
FILTER (passe-bas)
      |
      v
Buffer JFET
      |
      v
VOLUME
      |
      v
SORTIE AUDIO
```

### 5.1 Entrée

Résistance pull-down ~1 MΩ (impédance max). Condensateur de couplage + HPF très bas (~7 Hz d’après ElectroSmash). Condensateur shunt HF pour adoucir.

### 5.2 Amplificateur clippeur

Topologie non-inverseur, potentiomètre DISTORTION dans la contre-réaction. Caps de compensation / filtrage autour de l’AOP façonnent la réponse avant clipping — **à calibrer**, pas à ignorer.

### 5.3 Diodes

Hard clip symétrique. Pour le DSP : fonction de saturation dure lissée, ou courbe mesurée.

### 5.4 FILTER et sortie

Passe-bas calibré sur schéma + mesures. Buffer JFET puis pot VOLUME.

---

## 6. Configuration logicielle recommandée

### 6.1 Chaîne DSP initiale

```text
Entrée
  → DC block / HPF entrée
  → Pré-filtre HF
  → Gain DISTORTION (+ option modèle slew)
  → Suréchantillonnage
  → Hard clip symétrique lissé
  → Reconstruction
  → FILTER LPF
  → Gain VOLUME
  → Sortie
```

### 6.2 Points critiques DSP

- Suréchantillonner le hard clip (4× / 8×)
- Envisager une limitation de slew sur l’étage de gain
- FILTER = LPF calibré (loi du pot à mesurer)
- Pas de noise gate / bruit inventé sans mesure

### 6.3 Objectifs runtime

Temps réel, multi-instances, latence et CPU mesurés, paramètres sans clics.

---

## 7. Calibration sur une pédale réelle

### 7.1 Matériel

RAT 2 (ou RAT) identifiée, interface connue, reamp, charge connue, DI reproductibles. Noter révision / année / origine (USA vs Chine).

### 7.2 Captures

| Test | Paramètre |
|---|---|
| 1 | Bypass |
| 2–4 | DISTORTION faible / moyen / max |
| 5–7 | FILTER fermé / midi / ouvert |
| 8 | VOLUME multi-positions |
| 9 | Niveaux d’entrée variés |
| 10 | Transitoires + DI guitare |

### 7.3 Mesures

RMS/crête, FR, courbe I/O, harmoniques, THD, latence, positions knobs.

---

## 8. Tests de fidélité

Objectifs : FR, gain vs amplitude, spectre, transitoires, erreur résiduelle DI.  
Écoute A/B : notes, accords, attaques faibles/fortes, usage booster vs disto principale.  
Régression : DI + réglages + métriques versionnées.

---

## 9. Critères d’acceptation

- Pas de clipping numérique imprévu / clics
- FILTER et DISTORTION continus
- Caractère hard-clip + filtrage cohérents avec référence
- Dynamique (booster → fuzz) préservée
- CPU / latence OK multi-instances

---

## 10. Feuille de route

**A** — Chemin audio + 3 knobs + bypass  
**B** — Calibrage filtres, gain, hard clip, slew optionnel, OS  
**C** — Validation vs pédale  
**D** — Circuit détaillé si besoin (LM308 + diodes)

---

## 11. Limites et incertitudes

- Pas de modèle DSP officiel Pro Co
- Nombreuses révisions / clones / op-amp substitutes (OP07, etc.)
- Schémas reverse-engineered ≠ garantie constructeur
- Turbo / Dirty RAT = clipping différent → ne pas mélanger les références
- Sans pédale physique, fidélité non démontrable
- Documents soumis aux droits applicables

---

## 12. Schémas et ressources locales

### Photos

| Fichier | Description |
|---|---|
| [`photo_produit_hd.jpg`](./photo_produit_hd.jpg) | Photo produit (Thomann) |
| [`photo_produit.jpg`](./photo_produit.jpg) | Miniature |
| [`photo_opengraph.jpg`](./photo_opengraph.jpg) | Open Graph |

### Schémas / analyses

| Fichier | Description |
|---|---|
| [`schema_ProCo_RAT.pdf`](./schema_ProCo_RAT.pdf) | Schéma reverse-engineered |
| [`schema_ProCo_RAT_alt.pdf`](./schema_ProCo_RAT_alt.pdf) | Schéma alternatif |
| [`electrosmash_analysis.html`](./electrosmash_analysis.html) | Analyse technique détaillée |

### Liens

- [ElectroSmash — Pro Co Rat](https://electrosmash.mas-effects.com/proco-rat.html)
- [ACT — RAT Distortion](https://actentertainment.com/rat-distortion-detail/)
- [Thomann — RAT 2](https://www.thomann.co.uk/proco_rat2.htm)

### Schéma fonctionnel

```text
INPUT → HPF/entrée → Gain LM308 (DIST) → Hard clip → FILTER LPF → JFET → VOLUME → OUTPUT
```

---

## 13. Conclusion

Priorités pour l’émulation RAT :

1. Fort gain + hard clip
2. Coloration type slew / AOP
3. FILTER passe-bas
4. Progression DISTORTION (boost → fuzz)
5. Niveau VOLUME propre
6. Dynamique d’entrée

Un modèle comportemental calibré suffit souvent ; affiner le modèle d’AOP seulement si les mesures le justifient.
