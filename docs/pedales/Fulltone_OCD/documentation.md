# Fulltone OCD — Documentation technique et modélisation sonore

**Version :** 1.0  
**Date :** 29 octobre 2026  
**ID système :** `fulltone-ocd`

**Objectif :** documenter l’Obsessive Compulsive Drive (Fulltone) pour émulation WebAmp.

---

## 1. Présentation

Overdrive / distorsion créée par **Mike Fuller** (2004). Réputée pour sa dynamique type ampli à lampes et son clipping **MOSFET** (2N7000), plus « doux » qu’un hard clip diode classique malgré un comportement hard-clip.

Commandes : **Volume**, **Drive**, **Tone**, switch **HP/LP** (High Peak / Low Peak). Versions V1.x puis V2 (buffer JFET, bypass selectable, etc.).

**Principe :** double étage AOP (TL082) + clip MOSFET (± Ge 1N34A selon révision) + tone treble-bleed + HP/LP.

---

## 2. Sources

- Schéma (réplique / archive) : [`schema_Fulltone_OCD.pdf`](./schema_Fulltone_OCD.pdf)
- Analyse : [`analyse_circuit.html`](./analyse_circuit.html) — https://www.analogisnotdead.com/article34/circuit-analysis-fulltone-s-ocd
- Produit : https://www.fulltoneusa.com/products/ocd-v2
- Photos : [`photo_produit.jpg`](./photo_produit.jpg)

---

## 3. Caractéristiques

| | |
|---|---|
| Type | Overdrive / Distortion MOSFET |
| AOP | TL082 (dual) |
| Clip | 2N7000 (+ 1N34A Ge sur versions récentes) |
| Alim | 9–18 V DC centre négatif |
| Bypass V2 | True bypass / Enhanced bypass |

---

## 4. Technologie

- Gain stage 1 → clip MOSFET (asymétrie possible avec Ge) → gain stage 2
- Tone : treble bleed passif
- HP/LP : change la réponse aiguë (parallèle résistances)
- 18 V = plus de headroom (moins de sat AOP)
- V2 : entrée JFET Class A, plus de dynamique

---

## 5–6. Architecture / DSP

```text
Entrée → Gain1(DRIVE) → Clip MOSFET[/Ge] → Gain2 → Tone + HP/LP → Volume → Sortie
```

DSP : soft-hard clip MOSFET (courbe mesurée), asymétrie optionnelle, tone + switch HP/LP, OS sur non-linéarité.

---

## 7–13. Calibration & conclusion

Identifier révision (V1.x vs V2). Priorité : dynamique MOSFET, HP/LP, progression Drive. Mesures indispensables.

## Ressources

| Fichier | |
|---|---|
| [`schema_Fulltone_OCD.pdf`](./schema_Fulltone_OCD.pdf) | Schéma |
| [`analyse_circuit.html`](./analyse_circuit.html) | Analyse circuit |
| [`photo_produit.jpg`](./photo_produit.jpg) | Photo |
