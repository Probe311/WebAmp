# BOSS TR-2 Tremolo — Documentation technique et modélisation sonore

**Version :** 1.0  
**Date :** 29 octobre 2026  
**ID système :** `boss-tr2`

---

## 1. Présentation

Tremolo optique BOSS Rate / Depth / Wave (tri/sin).

---

## 2. Sources

- boss.info TR-2
- Service Notes

---

## 3. Caractéristiques

| Caractéristique | Valeur |
|---|---|
| Commandes | RATE, DEPTH, WAVE |

---

## 4. Technologie sonore

- Tremolo volume LFO

---

## 5–6. Architecture / DSP

```text
amplitude LFO(wave)
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
