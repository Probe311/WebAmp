# MXR Phase 90 — Documentation technique et modélisation sonore

**Version :** 1.0  
**Date :** 29 octobre 2026  
**ID système :** `mxr-phase90`

---

## 1. Présentation

Phaser 4 étages mythique, un knob Speed. Script vs block logo (feedback).

---

## 2. Sources

- jimdunlop.com Phase 90
- ElectroSmash Phase 90

---

## 3. Caractéristiques

| Caractéristique | Valeur |
|---|---|
| Commandes | SPEED |
| Stages | 4 |

---

## 4. Technologie sonore

- Phaser JFET

---

## 5–6. Architecture / DSP

```text
4× allpass + LFO
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
