# BOSS PH-3 Phase Shifter — Documentation technique et modélisation sonore

**Version :** 1.0  
**Date :** 29 octobre 2026  
**ID système :** `boss-ph3`

---

## 1. Présentation

Phaser BOSS multi-modes (4/8/10/12 stages, Rise/Fall, Step).

---

## 2. Sources

- boss.info PH-3

---

## 3. Caractéristiques

| Caractéristique | Valeur |
|---|---|
| Modes | Multi-stage / step |

---

## 4. Technologie sonore

- Phaser DSP/analog hybrid BOSS

---

## 5–6. Architecture / DSP

```text
allpass cascade + LFO
```

Objectif : temps réel, multi-instances, calibration sur matériel réel, suréchantillonnage des non-linéarités si nécessaire.

---

## 7–11. Calibration, tests, limites

- Captures DI, FR, I/O, écoute A/B
- Identifier la révision matérielle
- Sans pédale physique, la fidélité reste une approximation
- Schémas et marques soumis aux droits applicables

---

## 12. Ressources locales

Compléter ce dossier avec photos produit, manuels PDF et schémas (script `download.js`).

---

## 13. Conclusion

Modèle comportemental calibré en priorité ; raffiner selon mesures.
